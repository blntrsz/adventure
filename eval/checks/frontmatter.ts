// R1: Agent Skills frontmatter rules for every SKILL.md.
import { readFileSync } from "node:fs";
import { basename, dirname, relative } from "node:path";
import type { Check, Violation } from "../harness/types.ts";

export const SKILL_NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const MAX_NAME_LENGTH = 64;
export const MAX_DESCRIPTION_LENGTH = 1024;
const KNOWN_FIELDS = new Set([
  "name",
  "description",
  "disable-model-invocation",
  "license",
  "allowed-tools",
  "metadata",
]);

/** Minimal frontmatter parser: the first `---` fenced block of a markdown file. */
export function parseFrontmatter(
  content: string,
): { frontmatter: Map<string, string> | null; error?: string } {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(content);
  if (!match) return { frontmatter: null, error: "no frontmatter block (must start with --- ... ---)" };
  const map = new Map<string, string>();
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === "") continue;
    const kv = /^([a-zA-Z][a-zA-Z0-9-]*):\s*(.*)$/.exec(line);
    if (!kv) return { frontmatter: map, error: `malformed frontmatter line: "${line}"` };
    map.set(kv[1], kv[2].trim());
  }
  return { frontmatter: map };
}

export const frontmatterCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  for (const skillPath of ctx.skills) {
    const rel = relative(ctx.repoRoot, skillPath);
    const text = readFileSync(skillPath, "utf8");
    const { frontmatter: fm, error } = parseFrontmatter(text);
    if (fm === null) {
      violations.push({ file: rel, rule: "R1.frontmatter-present", message: `${rel}: ${error}` });
      continue;
    }
    if (error) {
      violations.push({ file: rel, rule: "R1.frontmatter-parses", message: `${rel}: ${error}` });
    }
    const name = fm.get("name");
    if (name === undefined) {
      violations.push({ file: rel, rule: "R1.name-present", message: `${rel}: frontmatter missing "name"` });
    } else {
      if (!SKILL_NAME_PATTERN.test(name)) {
        violations.push({
          file: rel,
          rule: "R1.name-format",
          message: `${rel}: name "${name}" must be lowercase alphanumeric segments separated by hyphens`,
        });
      }
      if (name.length > MAX_NAME_LENGTH) {
        violations.push({ file: rel, rule: "R1.name-length", message: `${rel}: name exceeds ${MAX_NAME_LENGTH} chars` });
      }
      const dirName = basename(dirname(skillPath));
      if (dirName !== name) {
        violations.push({
          file: rel,
          rule: "R1.name-matches-dir",
          message: `${rel}: name "${name}" does not match directory "${dirName}"`,
        });
      }
    }
    const description = fm.get("description");
    if (description === undefined || description === "") {
      violations.push({
        file: rel,
        rule: "R1.description-present",
        message: `${rel}: frontmatter missing non-empty "description"`,
      });
    } else if (description.length > MAX_DESCRIPTION_LENGTH) {
      violations.push({
        file: rel,
        rule: "R1.description-length",
        message: `${rel}: description is ${description.length} chars (limit ${MAX_DESCRIPTION_LENGTH})`,
      });
    }
    for (const key of fm.keys()) {
      if (!KNOWN_FIELDS.has(key)) {
        violations.push({ file: rel, rule: "R1.known-fields", message: `${rel}: unknown frontmatter field "${key}"` });
      }
    }
    const dmi = fm.get("disable-model-invocation");
    if (dmi !== undefined && dmi !== "true" && dmi !== "false") {
      violations.push({
        file: rel,
        rule: "R1.disable-model-invocation",
        message: `${rel}: disable-model-invocation must be true or false, got "${dmi}"`,
      });
    }
  }
  return { check: "checks/frontmatter", status: violations.length === 0 ? "pass" : "fail", violations };
};
