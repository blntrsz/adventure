// Eval harness entry point. Layer 1 (deterministic contract checks) runs now;
// Layer 2 (scenario runs) is built by #8 and invoked through the same command.
// On-demand only — never wired to CI push gates (Q3 decision).
import { resolve, relative, join } from "node:path";
import { existsSync, readdirSync, statSync } from "node:fs";
import type { Check, CheckContext, CheckResult } from "./harness/types.ts";
import { frontmatterCheck } from "./checks/frontmatter.ts";
import { linksCheck } from "./checks/links.ts";
import { consistencyCheck } from "./checks/consistency.ts";
import { commandsCheck } from "./checks/commands.ts";
import { ticketTemplatesCheck, lifecycleCheck } from "./checks/ticket-templates.ts";

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
    console.log("Layer 2: scenario runs — not yet built (ticket #8, Q6)");
    // Implemented by #8: scenario loading, fixture provisioning, session runs, reports.
  }

  if (failures > 0) process.exitCode = 1;
}

main();
