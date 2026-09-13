// R4 helper for Layer 1: verify tickets.md templates define every required
// section, and (R3a) that lifecycle.md's state vocabulary is self-consistent
// with what skills reference.
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Check, Violation } from "../harness/types.ts";
import { missingRequiredSections } from "../harness/template.ts";
import { LIFECYCLE_STATES } from "../harness/types.ts";

const ADVENTURE_TEMPLATE_MARKER = "## Adventure\n\n```markdown";
const QUEST_TEMPLATE_MARKER = "## Quest\n\n```markdown";

/**
 * R4a: the tickets.md Adventure and Quest templates must contain the sections
 * the templates promise. Each template is a markdown fence that itself
 * contains a nested fence (the Quest graph); the outer fence is closed by a
 * line that is exactly ``` (the nested one is ```mermaid).
 */
export const ticketTemplatesCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  const ticketsPath = join(ctx.repoRoot, "skills", "_shared", "tickets.md");
  const rel = relative(ctx.repoRoot, ticketsPath);
  const text = readFileSync(ticketsPath, "utf8");

  const adventureBody = extractTemplateFence(text, ADVENTURE_TEMPLATE_MARKER);
  const questBody = extractTemplateFence(text, QUEST_TEMPLATE_MARKER);

  if (adventureBody === null) {
    violations.push({ file: rel, rule: "R4a.template-present", message: `${rel}: Adventure template block not found` });
  } else {
    for (const missing of missingRequiredSections(adventureBody, "adventure")) {
      violations.push({
        file: rel,
        rule: "R4a.adventure-sections",
        message: `${rel}: Adventure template lacks "## ${missing}"`,
      });
    }
  }
  if (questBody === null) {
    violations.push({ file: rel, rule: "R4a.template-present", message: `${rel}: Quest template block not found` });
  } else {
    for (const missing of missingRequiredSections(questBody, "quest")) {
      violations.push({
        file: rel,
        rule: "R4a.quest-sections",
        message: `${rel}: Quest template lacks "## ${missing}"`,
      });
    }
  }
  return { check: "checks/ticket-templates", status: violations.length === 0 ? "pass" : "fail", violations };
}

/**
 * R3a: lifecycle.md must define every state the harness vocabulary knows about,
 * and every backticked state token in lifecycle.md must be in the vocabulary.
 */
export const lifecycleCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  const lifecyclePath = join(ctx.repoRoot, "skills", "_shared", "lifecycle.md");
  const rel = relative(ctx.repoRoot, lifecyclePath);
  const text = readFileSync(lifecyclePath, "utf8");
  // States are defined in arrow-flow code spans: `draft → proposed → ...`.
  const flowSpans = new Set<string>();
  for (const m of text.matchAll(/`([a-z][a-z0-9-]*(?:\s*→\s*[a-z][a-z0-9-]*)+)`/g)) {
    for (const state of m[1].split("→").map((s) => s.trim())) flowSpans.add(state);
  }
  for (const state of LIFECYCLE_STATES) {
    if (!flowSpans.has(state)) {
      violations.push({
        file: rel,
        rule: "R3a.state-defined",
        message: `${rel}: lifecycle state "${state}" is not defined in lifecycle.md's state flows`,
      });
    }
  }
  const backticked = new Set<string>();
  for (const m of text.matchAll(/`([a-z][a-z0-9-]+)`/g)) backticked.add(m[1]);
  for (const token of backticked) {
    if (!(LIFECYCLE_STATES as readonly string[]).includes(token)) {
      violations.push({
        file: rel,
        rule: "R3a.state-vocabulary",
        message: `${rel}: backticked token "${token}" is not in the known lifecycle vocabulary (update eval/harness/types.ts LIFECYCLE_STATES)`,
      });
    }
  }
  return { check: "checks/lifecycle", status: violations.length === 0 ? "pass" : "fail", violations };
};

/**
 * Extract the outer ```markdown fence opened after `marker`. The template body
 * may contain nested fences (```mermaid), so the outer fence ends at a line
 * that is exactly ``` (three backticks, nothing else).
 */
function extractTemplateFence(text: string, marker: string): string | null {
  const idx = text.indexOf(marker);
  if (idx === -1) return null;
  const start = text.indexOf("```markdown", idx);
  if (start === -1) return null;
  const bodyStart = text.indexOf("\n", start) + 1;
  // The outer fence closes at a bare ``` line; the template body may contain a
  // nested ```mermaid fence, so scan for the LAST bare ``` before the next
  // template marker (or end of file).
  const nextMarker = text.indexOf("## Quest\n\n```markdown", bodyStart);
  const scanEnd = nextMarker === -1 ? text.length : nextMarker;
  const region = text.slice(bodyStart, scanEnd);
  const bareCloses = [...region.matchAll(/^```\s*$/gm)];
  if (bareCloses.length === 0) return null;
  const end = bodyStart + bareCloses.at(-1)!.index;
  return text.slice(bodyStart, end);
}
