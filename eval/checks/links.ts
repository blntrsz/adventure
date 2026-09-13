// R2: every relative markdown link inside a resolved file must point at an existing file.
import { dirname, join, relative, resolve } from "node:path";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import type { Check, Violation } from "../harness/types.ts";

const MARKDOWN_LINK = /\[[^\]]*\]\(([^)\s]+)\)/g;

export function extractRelativeMarkdownLinks(content: string): Array<{ target: string; index: number }> {
  const links: Array<{ target: string; index: number }> = [];
  for (const match of content.matchAll(MARKDOWN_LINK)) {
    const target = match[1];
    if (/^[a-z]+:\/\//i.test(target)) continue; // absolute URL
    if (target.startsWith("#")) continue; // in-page anchor
    const [pathPart] = target.split("#");
    if (pathPart === "") continue;
    links.push({ target, index: match.index ?? 0 });
  }
  return links;
}

export const linksCheck: Check = (ctx) => {
  const violations: Violation[] = [];
  for (const skillPath of ctx.skills) {
    const rel = relative(ctx.repoRoot, skillPath);
    const content = readFileSync(skillPath, "utf8");
    const baseDir = dirname(skillPath);
    // Shared contracts may be linked from skills; also check links inside _shared files reachable this way.
    for (const { target } of extractRelativeMarkdownLinks(content)) {
      const [pathPart, anchor] = target.split("#");
      const resolved = resolve(baseDir, pathPart);
      if (!existsSync(resolved)) {
        violations.push({
          file: rel,
          rule: "R2.link-resolves",
          message: `${rel}: link target "${target}" does not resolve to an existing file`,
        });
        continue;
      }
      if (statSync(resolved).isDirectory()) {
        violations.push({
          file: rel,
          rule: "R2.link-file",
          message: `${rel}: link target "${target}" resolves to a directory, not a file`,
        });
        continue;
      }
      if (anchor !== undefined) {
        violations.push({
          file: rel,
          rule: "R2.no-anchors",
          message: `${rel}: link target "${target}" uses an anchor; internal anchors are not part of the contract`,
        });
      }
    }
  }
  // Also sweep the shared contracts themselves (journal.md links tickets.md).
  const sharedDir = join(ctx.repoRoot, "skills", "_shared");
  if (existsSync(sharedDir)) {
    for (const entry of collectMarkdownFiles(sharedDir)) {
      const rel = relative(ctx.repoRoot, entry);
      const content = readFileSync(entry, "utf8");
      for (const { target } of extractRelativeMarkdownLinks(content)) {
        const [pathPart] = target.split("#");
        const resolved = resolve(dirname(entry), pathPart);
        if (!existsSync(resolved) || statSync(resolved).isDirectory()) {
          violations.push({
            file: rel,
            rule: "R2.link-resolves",
            message: `${rel}: link target "${target}" does not resolve to an existing file`,
          });
        }
      }
    }
  }
  return { check: "checks/links", status: violations.length === 0 ? "pass" : "fail", violations };
};

function collectMarkdownFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectMarkdownFiles(full));
    else if (entry.endsWith(".md")) out.push(full);
  }
  return out;
}
