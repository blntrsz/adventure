// R5: every slash-command referenced by skills or the docs command index maps
// to an existing skill; the docs index must cover every framework skill.
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { Check, Violation } from "../harness/types.ts";
import { EXTERNAL_COMMAND_WHITELIST } from "../harness/types.ts";

const COMMAND_REF = /`\/([a-z][a-z0-9-]*)`/g;

/** Bare skill-name references (no slash), e.g. the "Quest Guides" docs section. */
const BARE_SKILL_REF = /`([a-z][a-z0-9-]+(?:-[a-z0-9]+)*)`/g;

export function skillNames(skills: string[]): Set<string> {
  return new Set(skills.map((p) => p.split("/").at(-2)!));
}

export const commandsCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  const names = skillNames(ctx.skills);
  const referenced = new Map<string, string>(); // command → first referencing file (rel)

  for (const skillPath of ctx.skills) {
    const rel = relative(ctx.repoRoot, skillPath);
    const text = readFileSync(skillPath, "utf8");
    for (const m of text.matchAll(COMMAND_REF)) {
      const cmd = m[1];
      if (EXTERNAL_COMMAND_WHITELIST.includes(cmd as never)) continue;
      if (!names.has(cmd)) {
        violations.push({
          file: rel,
          rule: "R5.command-exists",
          message: `${rel}: references /${cmd} but no skills/${cmd}/SKILL.md exists`,
        });
      }
      if (!referenced.has(cmd)) referenced.set(cmd, rel);
    }
  }

  // Docs command index (docs/skills.md) must list exactly the framework skills.
  const docsPath = join(ctx.repoRoot, "docs", "skills.md");
  if (!readFileSync.length || true) {
    // docs/skills.md is optional; when present it must not drift.
  }
  let docsText: string | null = null;
  try {
    docsText = readFileSync(docsPath, "utf8");
  } catch {
    docsText = null;
  }
  if (docsText !== null) {
    const docRel = relative(ctx.repoRoot, docsPath);
    // Documented surface = slash commands + bare skill names (quest guides are
    // indexed bare under "Quest Guides").
    const docCommands = new Set<string>();
    for (const m of docsText.matchAll(COMMAND_REF)) docCommands.add(m[1]);
    for (const m of docsText.matchAll(BARE_SKILL_REF)) {
      if (names.has(m[1])) docCommands.add(m[1]);
    }
    for (const cmd of docCommands) {
      if (EXTERNAL_COMMAND_WHITELIST.includes(cmd as never)) continue;
      if (!names.has(cmd)) {
        violations.push({
          file: docRel,
          rule: "R5.docs-command-exists",
          message: `${docRel}: documents /${cmd} but no skills/${cmd}/SKILL.md exists`,
        });
      }
    }
    for (const name of names) {
      if (!docCommands.has(name)) {
        violations.push({
          file: docRel,
          rule: "R5.docs-cover-skills",
          message: `${docRel}: skill "${name}" exists but is not documented in ${docRel}`,
        });
      }
    }
  }
  return { check: "checks/commands", status: violations.length === 0 ? "pass" : "fail", violations };
};
