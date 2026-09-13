// Report writer (Q4 §2): per-run artifact bundle under eval/output/<run-id>/
// (JSON + Markdown + transcripts). Reports are local-only; posting evidence
// to the Journal remains a manual user action (Q4 invariant 7).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { CheckOutcome, RunReport, ScenarioOutcome, SessionTrace } from "./types.ts";

export interface ReportInputs {
  runId: string;
  startedAt: string;
  command: string;
  args: string[];
  checks?: CheckOutcome;
  scenarios: ScenarioOutcome[];
}

export function assembleReport(inputs: ReportInputs): RunReport {
  const passed = inputs.scenarios.filter((s) => s.status === "pass").length;
  const failed = inputs.scenarios.filter((s) => s.status !== "pass").length;
  const estimatedCost = inputs.scenarios.reduce((sum, s) => sum + (s.estimatedCost ?? 0), 0);
  return {
    runId: inputs.runId,
    startedAt: inputs.startedAt,
    command: inputs.command,
    args: inputs.args,
    checks: inputs.checks,
    scenarios: inputs.scenarios,
    summary: { passed, failed, total: inputs.scenarios.length, estimatedCost },
  };
}

/** Persist one scenario's transcript (prompts + messages + tool calls) as JSON. */
export async function writeTranscript(
  scenario: string,
  repeatIndex: number | undefined,
  trace: SessionTrace,
  outDir: string,
): Promise<string> {
  const suffix = repeatIndex !== undefined ? `-r${repeatIndex}` : "";
  const path = join(outDir, `${scenario}${suffix}.transcript.json`);
  await writeFile(
    path,
    JSON.stringify(
      {
        scenario,
        repeatIndex,
        prompts: trace.prompts,
        toolCalls: trace.toolCalls,
        readSkillNames: trace.readSkillNames,
        messages: trace.messages,
      },
      null,
      2,
    ),
  );
  return path;
}

export function renderMarkdown(report: RunReport): string {
  const lines: string[] = [];
  lines.push(`# Eval run ${report.runId}`);
  lines.push("");
  lines.push(`- Started: ${report.startedAt}`);
  lines.push(`- Command: \`${[report.command, ...report.args].join(" ")}\``);
  lines.push(
    `- Summary: ${report.summary.passed}/${report.summary.total} passed, ${report.summary.failed} failed` +
      (report.summary.estimatedCost > 0 ? `, est. $${report.summary.estimatedCost.toFixed(4)}` : ""),
  );
  if (report.checks) {
    lines.push("");
    lines.push("## Layer 1: contract checks");
    const failed = report.checks.results.filter((r) => r.status === "fail");
    lines.push(`- ${report.checks.results.length - failed.length}/${report.checks.results.length} checks pass (${report.checks.durationMs.toFixed(0)} ms)`);
    for (const f of failed) {
      for (const v of f.violations) lines.push(`  - ✗ ${f.check}: ${v.file} — [${v.rule}] ${v.message}`);
    }
  }
  lines.push("");
  lines.push("## Layer 2: scenarios");
  for (const s of report.scenarios) {
    const icon = s.status === "pass" ? "✓" : "✗";
    lines.push(`### ${icon} ${s.scenario} — ${s.status}${s.repeatIndex !== undefined ? ` (repeat ${s.repeatIndex})` : ""}`);
    lines.push(`- model: ${s.model}, duration: ${(s.durationMs / 1000).toFixed(1)}s`);
    if (s.tokenUsage) {
      lines.push(
        `- tokens: in ${s.tokenUsage.input}, out ${s.tokenUsage.output}, cache-read ${s.tokenUsage.cacheRead}` +
          (s.estimatedCost !== undefined ? `, est. $${s.estimatedCost.toFixed(4)}` : ""),
      );
    }
    lines.push(`- tool errors: ${s.toolErrorCount}, clarifications: ${s.clarifications}`);
    if (s.failure) lines.push(`- failure (${s.failure.kind}${s.failure.step ? ` in ${s.failure.step}` : ""}): ${s.failure.message}`);
    for (const a of s.assertions) {
      lines.push(`- ${a.status === "pass" ? "✓" : "✗"} ${a.id}: ${a.description}${a.message ? ` — ${a.message}` : ""}`);
    }
    if (s.transcriptPath) lines.push(`- transcript: ${s.transcriptPath}`);
    lines.push("");
  }
  return lines.join("\n");
}

/** Write the report bundle; returns the JSON and Markdown paths. */
export async function writeReport(
  report: RunReport,
  outDir: string,
): Promise<{ jsonPath: string; mdPath: string }> {
  await mkdir(outDir, { recursive: true });
  const jsonPath = join(outDir, "report.json");
  const mdPath = join(outDir, "report.md");
  await writeFile(jsonPath, JSON.stringify(report, null, 2));
  await writeFile(mdPath, renderMarkdown(report));
  return { jsonPath, mdPath };
}
