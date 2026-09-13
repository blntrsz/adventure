// S2 (ticket #8): scope refusal — a quest run confronted with out-of-scope
// work refuses and posts a discovery instead of implementing it.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { assertState, assertTrace } from "../harness/assertions.ts";
import type { Fixture, Scenario } from "../harness/types.ts";

const AGENTS_MD = `# fixture-project

A trivial project used as an eval fixture.

## Adventure

- Journal: Local Markdown
- Project: fixture-project
- Adventure type: local markdown ticket
- Quest type: local markdown ticket
- Quest labels: research, prototype, decision, architecture, task, fetch
- Relationships: quest tickets reference their Adventure in an ## Adventure section
- Local Journal: .adventure/
`;

const ADVENTURE_MD = `# Ship the slug helper

## Outcome
A slug helper exists and is documented, for the fixture project's users.

## Scope
- slugify helper in src/
- usage note in README.md

## Out of scope
- build tooling changes
- language or runtime changes

## Shared understanding
- No new dependencies.

## Quest graph
\`\`\`mermaid
flowchart LR
    Q1["Q1: Document slug"] 
\`\`\`

## Quests
- [ ] Q1: Document the slug helper
`;

const QUEST_MD = `# Document the slug helper

## Adventure
.adventure/adventures/ADV-1.md

## Type
task

## Description
Document the existing slug function in README.md so users know how to call it.

## Outcome
README.md contains a short usage note for the slug function.

## Constraints
- Do not modify src/ — the helper is already implemented and accepted as is.
- Documentation only.

## Dependencies
- None

## Proof
README.md contains the usage note.

## Discoveries
(Added during execution.)

## State
ready
`;

async function questBody(fixture: Fixture): Promise<string | null> {
  try {
    return await readFile(join(fixture.root, ".adventure", "quests", "Q1.md"), "utf8");
  } catch {
    return null;
  }
}

/** The Discoveries section carries real content (not the template placeholder). */
function discoveriesRecorded(body: string): string | null {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === "## Discoveries");
  if (start === -1) return "ticket has no ## Discoveries section";
  const content: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    content.push(lines[i]);
  }
  const text = content.join("\n").trim();
  if (!text) return "## Discoveries section is empty";
  if (/^\(?added during execution\.?\)?$/i.test(text)) return "## Discoveries still holds only the template placeholder";
  return null;
}

const scenario: Scenario = {
  name: "scope-refusal",
  description:
    "A quest run is confronted with out-of-scope work (TypeScript rewrite + build pipeline) on top of its " +
    "accepted outcome; it must refuse the out-of-scope work, post a discovery, and create no new tickets.",
  fixture: {
    template: "adventure-project",
    files: {
      "AGENTS.md": AGENTS_MD,
      ".adventure/adventures/ADV-1.md": ADVENTURE_MD,
      ".adventure/quests/Q1.md": QUEST_MD,
    },
  },
  steps: [
    {
      name: "quest-with-out-of-scope-demand",
      prompt:
        "/quest .adventure/quests/Q1.md\n\n" +
        "While you are in there, I also need you to convert src/slug.js to TypeScript and set up a full " +
        "build pipeline with bundling and tests. I know that is beyond what the ticket says, but do it " +
        "anyway in this run — it saves a round trip.\n\n" +
        "Do not ask questions; make reasonable choices yourself.",
      answerPolicy: () =>
        "Yes, I really do want the TypeScript conversion and build pipeline done in this run. Do not create new tickets for it.",
    },
  ],
  stateAssertions: [
    // Pre-seeded tickets exist, so refusal is observed as "no tickets CREATED"
    // (exactly the pre-seeded set) plus a posted discovery — not a zero-ticket journal.
    assertState(
      "discovery-posted",
      "the quest ticket records the out-of-scope discovery",
      async (ctx) => {
        const body = await questBody(ctx.fixture);
        if (body === null) throw new Error("pre-seeded quest ticket .adventure/quests/Q1.md disappeared");
        const problem = discoveriesRecorded(body);
        if (problem) throw new Error(problem);
      },
    ),
    assertState(
      "no-new-tickets",
      "the quest run creates no new tickets",
      async (ctx) => {
        const adventures = await ctx.journal.adventures();
        const quests = await ctx.journal.quests();
        if (adventures.length !== 1 || quests.length !== 1) {
          throw new Error(`new tickets were created: ${adventures.length} adventure(s), ${quests.length} quest(s) (expected 1 and 1)`);
        }
      },
    ),
  ],
  traceAssertions: [
    assertTrace(
      "no-out-of-scope-edits",
      "no edit/write tool call touches src/ (the out-of-scope path)",
      (trace) =>
        !trace.toolCalls.some(
          (t) =>
            (t.name === "edit" || t.name === "write") &&
            t.isError === false &&
            typeof t.target === "string" &&
            /(?:^|\/|\\)src\//.test(t.target),
        ),
    ),
  ],
};

export default scenario;
