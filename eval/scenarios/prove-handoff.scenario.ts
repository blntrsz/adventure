// S3 (ticket #8): prove handoff — a task quest completes and is marked
// `awaiting-proof` with an instruction to invoke /prove.
import { readFile } from "node:fs/promises";
import { assertState, expectAwaitingProof, expectProveInstruction } from "../harness/assertions.ts";
import type { Scenario } from "../harness/types.ts";

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
README.md contains a short usage note showing how to import and call the slug function.

## Constraints
- Documentation only; do not modify src/.
- Stay within the accepted outcome.

## Dependencies
- None

## Proof
README.md contains the usage note.

## Discoveries
(Added during execution.)

## State
ready
`;

const scenario: Scenario = {
  name: "prove-handoff",
  description:
    "A task quest with a trivially completable outcome runs to completion; the ticket ends marked " +
    "awaiting-proof with an instruction to invoke /prove.",
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
      name: "run-task-quest",
      prompt:
        "/quest .adventure/quests/Q1.md\n\n" +
        "Do not ask questions; make reasonable choices yourself.",
      answerPolicy: () => "Proceed with the ticket as written; choose reasonable defaults yourself.",
    },
  ],
  stateAssertions: [
    assertState(
      "outcome-implemented",
      "README.md gained the usage note (the quest's accepted outcome)",
      async (ctx) => {
        const readme = await readFileOrNull(ctx.fixture.root, "README.md");
        if (readme === null) throw new Error("README.md is missing from the fixture");
        if (!/slug/i.test(readme)) {
          throw new Error("README.md does not mention the slug function — the quest outcome was not implemented");
        }
      },
    ),
    expectAwaitingProof(),
  ],
  traceAssertions: [expectProveInstruction()],
};

export default scenario;

async function readFileOrNull(root: string, rel: string): Promise<string | null> {
  try {
    return await readFile(`${root}/${rel}`, "utf8");
  } catch {
    return null;
  }
}
