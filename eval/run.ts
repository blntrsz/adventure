// Eval harness entry point. Layer 1 (deterministic contract checks) and
// Layer 2 (scenario runs) both execute here. On-demand only — never wired to
// CI push gates (Q3 decision).
import { resolve, join } from "node:path";
import { mkdirSync, existsSync, readdirSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import type { Check, CheckContext, CheckResult, Scenario, ScenarioOutcome } from "./harness/types.ts";
import { frontmatterCheck } from "./checks/frontmatter.ts";
import { linksCheck } from "./checks/links.ts";
import { consistencyCheck } from "./checks/consistency.ts";
import { commandsCheck } from "./checks/commands.ts";
import { ticketTemplatesCheck, lifecycleCheck } from "./checks/ticket-templates.ts";
import { provisionFixture } from "./harness/fixture.ts";
import { DEFAULT_SCENARIO_MODEL, DEFAULT_SCENARIO_TIMEOUT_MS, createScenarioSession } from "./harness/session.ts";
import { runSteps } from "./harness/driver.ts";
import { openJournal } from "./harness/journal.ts";
import { runStateAssertions, runTraceAssertions } from "./harness/assertions.ts";
import { assembleReport, writeReport, writeTranscript } from "./harness/report.ts";

interface CliArgs {
  checksOnly: boolean;
  scenariosOnly: boolean;
  scenario: string[];
  repeat: number;
  model?: string;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { checksOnly: false, scenariosOnly: false, scenario: [], repeat: 1 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--checks-only") args.checksOnly = true;
    else if (a === "--scenarios-only") args.scenariosOnly = true;
    else if (a === "--scenario") args.scenario.push(argv[++i] ?? "");
    else if (a === "--repeat") args.repeat = Math.max(1, Number.parseInt(argv[++i] ?? "1", 10) || 1);
    else if (a === "--model") args.model = argv[++i];
    else {
      console.error(`Unknown flag: ${a}`);
      process.exit(2);
    }
  }
  if (args.checksOnly && args.scenariosOnly) {
    console.error("--checks-only and --scenarios-only are mutually exclusive");
    process.exit(2);
  }
  return args;
}

const repoRoot = resolve(import.meta.dir, "..");

function discoverSkillFiles(root: string): string[] {
  const skillsDir = join(root, "skills");
  const out: string[] = [];
  for (const entry of readdirSync(skillsDir)) {
    const full = join(skillsDir, entry);
    if (statSync(full).isDirectory()) {
      const skillMd = join(full, "SKILL.md");
      if (existsSync(skillMd)) out.push(skillMd);
    }
  }
  return out;
}

async function runChecks(): Promise<CheckResult[]> {
  const ctx: CheckContext = { repoRoot, skills: discoverSkillFiles(repoRoot) };
  const checks: Array<[string, Check]> = [
    ["frontmatter", frontmatterCheck],
    ["links", linksCheck],
    ["consistency", consistencyCheck],
    ["lifecycle", lifecycleCheck],
    ["ticket-templates", ticketTemplatesCheck],
    ["commands", commandsCheck],
  ];
  const results: CheckResult[] = [];
  for (const [name, check] of checks) {
    try {
      const r = await check(ctx);
      results.push(...(Array.isArray(r) ? r : [r]));
    } catch (err) {
      results.push({
        check: `checks/${name}`,
        status: "fail",
        violations: [
          {
            file: `checks/${name}.ts`,
            rule: "check-crashed",
            message: `check crashed: ${err instanceof Error ? err.message : String(err)}`,
          },
        ],
      });
    }
  }
  return results;
}

function printCheckResults(results: CheckResult[]): boolean {
  let allPass = true;
  for (const r of results) {
    if (r.status === "pass") {
      console.log(`  ✓ ${r.check}`);
    } else {
      allPass = false;
      console.log(`  ✗ ${r.check}`);
      for (const v of r.violations) {
        console.log(`      ${v.file} — [${v.rule}] ${v.message}`);
      }
    }
  }
  return allPass;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  console.log(`adventure eval — repo: ${repoRoot}\n`);
  let failures = 0;

  if (!args.scenariosOnly) {
    console.log("Layer 1: contract checks");
    const t0 = performance.now();
    const results = await runChecks();
    const ok = printCheckResults(results);
    console.log(
      `  ${ok ? "all checks pass" : "checks failed"} (${(performance.now() - t0).toFixed(0)} ms)\n`,
    );
    if (!ok) failures++;
  }

  if (!args.checksOnly) {
    const outcomes = await runScenarios(args);
    failures += outcomes.filter((o) => o.status !== "pass").length;
  }

  if (failures > 0) process.exitCode = 1;
}

// ─── Layer 2: scenario runs ─────────────────────────────────────────────────

const scenariosDir = join(import.meta.dir, "scenarios");

/** Load every eval/scenarios/*.scenario.ts; malformed files fail the whole run, named. */
async function loadScenariosAsync(): Promise<Scenario[]> {
  if (!existsSync(scenariosDir)) return [];
  const files = readdirSync(scenariosDir).filter((f) => f.endsWith(".scenario.ts")).sort();
  const scenarios: Scenario[] = [];
  for (const file of files) {
    try {
      const mod = await import(join(scenariosDir, file));
      const s = mod.default as Scenario | undefined;
      validateScenario(s, file);
      scenarios.push(s!);
    } catch (err) {
      throw new Error(`scenario file ${file} failed to load: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  return scenarios;
}

function validateScenario(s: Scenario | undefined, file: string): void {
  const problems: string[] = [];
  if (!s || typeof s !== "object") problems.push("no default Scenario export");
  else {
    const expectedName = file.replace(/\.scenario\.ts$/, "");
    if (s.name !== expectedName) problems.push(`name "${s.name}" does not match filename "${expectedName}"`);
    if (typeof s.description !== "string") problems.push("missing description");
    if (!s.fixture || typeof s.fixture.template !== "string") problems.push("missing fixture.template");
    if (!Array.isArray(s.steps) || s.steps.length === 0) problems.push("missing steps");
    if (!Array.isArray(s.stateAssertions)) problems.push("missing stateAssertions");
  }
  if (problems.length > 0) throw new Error(`malformed Scenario export: ${problems.join("; ")}`);
}

async function runScenarios(args: CliArgs): Promise<ScenarioOutcome[]> {
  console.log("Layer 2: scenario runs");
  let scenarios: Scenario[];
  try {
    scenarios = await loadScenariosAsync();
  } catch (err) {
    console.error(`  ✗ ${err instanceof Error ? err.message : String(err)}`);
    return [
      {
        scenario: "(load)",
        model: "-",
        status: "error",
        durationMs: 0,
        toolErrorCount: 0,
        clarifications: 0,
        failure: { kind: "exception", message: err instanceof Error ? err.message : String(err) },
        assertions: [],
      },
    ];
  }

  if (args.scenario.length > 0) {
    const unknown = args.scenario.filter((n) => !scenarios.some((s) => s.name === n));
    if (unknown.length > 0) {
      console.error(`  ✗ unknown scenario(s): ${unknown.join(", ")} (known: ${scenarios.map((s) => s.name).join(", ")})`);
      process.exit(2);
    }
    scenarios = scenarios.filter((s) => args.scenario.includes(s.name));
  }
  if (scenarios.length === 0) {
    console.log("  (no scenarios found)");
    return [];
  }

  const runId = `${new Date().toISOString().replaceAll(":", "-")}-${Math.random().toString(16).slice(2, 6)}`;
  const outDir = join(repoRoot, "eval", "output", runId);
  await mkdir(outDir, { recursive: true });
  const outcomes: ScenarioOutcome[] = [];

  for (const scenario of scenarios) {
    const repeats = args.repeat;
    for (let r = 0; r < repeats; r++) {
      const repeatIndex = repeats > 1 ? r : undefined;
      outcomes.push(await runOneScenario(scenario, args, repeatIndex, outDir));
    }
  }

  const report = assembleReport({
    runId,
    startedAt: new Date().toISOString(),
    command: "bun eval/run.ts",
    args: process.argv.slice(2),
    scenarios: outcomes,
  });
  const { jsonPath, mdPath } = await writeReport(report, outDir);
  console.log(`\nreport: ${jsonPath}\n        ${mdPath}`);
  return outcomes;
}

async function runOneScenario(
  scenario: Scenario,
  args: CliArgs,
  repeatIndex: number | undefined,
  outDir: string,
): Promise<ScenarioOutcome> {
  const modelSpec = args.model
    ? (() => {
        const [provider, id] = args.model.split("/");
        return provider && id ? { provider, id } : DEFAULT_SCENARIO_MODEL;
      })()
    : (scenario.model ?? DEFAULT_SCENARIO_MODEL);
  const label = `${scenario.name}${repeatIndex !== undefined ? ` (repeat ${repeatIndex})` : ""}`;
  const t0 = performance.now();
  console.log(`  ▶ ${label} [${modelSpec.provider}/${modelSpec.id}]`);

  let fixture;
  try {
    fixture = await provisionFixture(scenario.fixture, { repoRoot, skillsSource: join(repoRoot, "skills") });
    const sess = await createScenarioSession({
      fixture,
      model: modelSpec,
      scenarioName: scenario.name,
      timeoutMs: DEFAULT_SCENARIO_TIMEOUT_MS,
    });
    try {
      const driven = await runSteps(scenario.steps, sess, fixture, DEFAULT_SCENARIO_TIMEOUT_MS);
      const assertionResults = await runStateAssertions(scenario.stateAssertions, { fixture, journal: openJournal(fixture) });
      const traceResults = scenario.traceAssertions ? runTraceAssertions(scenario.traceAssertions, sess.trace) : [];
      const all = [...assertionResults, ...traceResults];
      const transcriptPath = await writeTranscript(scenario.name, repeatIndex, sess.trace, outDir);
      const failed = all.filter((a) => a.status === "fail");
      const usage = sess.usage();
      const outcome: ScenarioOutcome = {
        scenario: scenario.name,
        model: `${modelSpec.provider}/${modelSpec.id}`,
        status: driven.completed && failed.length === 0 ? "pass" : "fail",
        repeatIndex,
        durationMs: performance.now() - t0,
        tokenUsage: { input: usage.input, output: usage.output, cacheRead: usage.cacheRead },
        estimatedCost: usage.cost,
        toolErrorCount: sess.trace.toolCalls.filter((t) => t.isError).length,
        clarifications: driven.clarifications,
        failure: driven.completed
          ? failed.length > 0
            ? { kind: "assertion", message: failed.map((f) => `${f.id}: ${f.message ?? f.description}`).join("; ") }
            : undefined
          : { step: driven.failure?.step, kind: driven.failure?.kind ?? "exception", message: driven.failure?.message ?? "unknown" },
        assertions: all,
        transcriptPath,
      };
      printOutcome(outcome);
      return outcome;
    } finally {
      sess.session.dispose();
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const outcome: ScenarioOutcome = {
      scenario: scenario.name,
      model: `${modelSpec.provider}/${modelSpec.id}`,
      status: "error",
      repeatIndex,
      durationMs: performance.now() - t0,
      toolErrorCount: 0,
      clarifications: 0,
      failure: { kind: "exception", message },
      assertions: [],
    };
    console.log(`  ✗ ${label} — error: ${message}`);
    return outcome;
  } finally {
    if (fixture) await fixture.dispose();
  }
}

function printOutcome(o: ScenarioOutcome): void {
  const icon = o.status === "pass" ? "✓" : "✗";
  console.log(`    ${icon} ${o.scenario} — ${o.status} (${(o.durationMs / 1000).toFixed(1)}s, ${o.toolErrorCount} tool errors, ${o.clarifications} clarifications)`);
  for (const a of o.assertions) {
    console.log(`      ${a.status === "pass" ? "✓" : "✗"} ${a.id}${a.message ? ` — ${a.message}` : ""}`);
  }
  if (o.failure) console.log(`      failure (${o.failure.kind}${o.failure.step ? ` in ${o.failure.step}` : ""}): ${o.failure.message}`);
}

main();
