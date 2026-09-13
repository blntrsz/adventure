// The one implementation of "required ticket sections" (shared Layer 1 / Layer 2).
import { ADVENTURE_SECTIONS, QUEST_SECTIONS } from "./types.ts";

/**
 * Return the required section names missing from a ticket body.
 * A section counts as present when a `## <Name>` heading appears.
 */
export function missingRequiredSections(body: string, kind: "adventure" | "quest"): string[] {
  const required = kind === "adventure" ? ADVENTURE_SECTIONS : QUEST_SECTIONS;
  const headings = new Set<string>();
  for (const line of body.split(/\r?\n/)) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) headings.add(m[1]);
  }
  return [...required].filter((s) => !headings.has(s));
}
