// R3 + R4: cross-contract consistency — lifecycle-state vocabulary and ticket
// section names used by skills must be defined in the shared contracts.
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Check, Violation } from "../harness/types.ts";
import { LIFECYCLE_STATES, QUEST_SECTIONS, ADVENTURE_SECTIONS } from "../harness/types.ts";

const CODE_SPAN = /`([^`]+)`/g;

export const consistencyCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  const lifecyclePath = join(ctx.repoRoot, "skills", "_shared", "lifecycle.md");
  const ticketsPath = join(ctx.repoRoot, "skills", "_shared", "tickets.md");
  const lifecycleText = readFileSync(lifecyclePath, "utf8");
  const ticketsText = readFileSync(ticketsPath, "utf8");
  // Skill names (e.g. "to-quests", "research-quest") are not state tokens.
  const skillNameSet = new Set(ctx.skills.map((p) => p.split("/").at(-2)!));

  for (const skillPath of ctx.skills) {
    const rel = relative(ctx.repoRoot, skillPath);
    const text = readFileSync(skillPath, "utf8");
    const spans = new Set<string>();
    for (const m of text.matchAll(CODE_SPAN)) spans.add(m[1]);

    // R3: backticked lifecycle-state tokens used by a skill must be defined in lifecycle.md.
    for (const span of spans) {
      if ((LIFECYCLE_STATES as readonly string[]).includes(span)) continue;
      if (skillNameSet.has(span)) continue;
      if (isStateLike(span) && !lifecycleText.includes(span)) {
        violations.push({
          file: rel,
          rule: "R3.state-defined",
          message: `${rel}: backticked state token "${span}" is not defined in skills/_shared/lifecycle.md`,
        });
      }
    }

    // R4: backticked ticket-section names referenced by a guide must exist in tickets.md.
    for (const span of spans) {
      const inAdventure = (ADVENTURE_SECTIONS as readonly string[]).includes(span);
      const inQuest = (QUEST_SECTIONS as readonly string[]).includes(span);
      if (!inAdventure && !inQuest) continue;
      const heading = `## ${span}`;
      if (!ticketsText.includes(heading)) {
        violations.push({
          file: rel,
          rule: "R4.section-defined",
          message: `${rel}: referenced ticket section "${span}" has no "${heading}" heading in skills/_shared/tickets.md`,
        });
      }
    }
  }
  return { check: "checks/consistency", status: violations.length === 0 ? "pass" : "fail", violations };
};

/** Heuristic: token looks like a lifecycle state (lowercase, hyphenated). */
function isStateLike(span: string): boolean {
  return /^[a-z]+(-[a-z]+)+$/.test(span);
}
