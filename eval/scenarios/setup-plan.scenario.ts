// S1 (ticket #8): setup + plan — a scripted session executes /adventure-setup
// → /adventure → acceptance → /to-quests in a fixture, asserting tickets exist
// with required template sections and dependency-free quests are ready.
import {
  expectAgentConfigured,
  expectDependencyFreeQuestsReady,
  expectJournalAdventures,
  expectJournalQuests,
  expectTicketSections,
} from "../harness/assertions.ts";
import type { Scenario } from "../harness/types.ts";

/** Generic answer: keep the agent moving without expanding scope. */
const proceed: string = "Proceed with reasonable defaults; do not ask further questions.";

const scenario: Scenario = {
  name: "setup-plan",
  description:
    "Scripted session runs /adventure-setup → /adventure → acceptance → /to-quests in a fresh fixture; " +
    "Journal tickets exist with required template sections and dependency-free quests are ready.",
  fixture: { template: "adventure-project" },
  steps: [
    {
      name: "setup",
      prompt:
        "/adventure-setup\n\n" +
        "Use a local Markdown Journal under .adventure/. Discover everything else yourself " +
        "and only ask if you are truly blocked.",
      answerPolicy: () => "Use the local Markdown Journal under .adventure/. Choose the defaults yourself.",
    },
    {
      name: "plan",
      prompt:
        "/adventure Add a small string-utils module: a slugify helper in src/ with a usage note in README.md.\n\n" +
        "Keep the Adventure small (one or two quests at most). Propose the plan and stop for my acceptance. " +
        "Do not create any tickets yet.",
      answerPolicy: () => proceed,
    },
    {
      name: "accept",
      prompt:
        "The plan is accepted exactly as you proposed it. Record that acceptance and stop before materializing tickets.",
      answerPolicy: () => proceed,
    },
    {
      name: "materialize",
      prompt: "/to-quests\n\nMaterialize the accepted Adventure's Quests now.",
      answerPolicy: () => proceed,
    },
  ],
  stateAssertions: [
    expectAgentConfigured(),
    expectJournalAdventures((t) => t.body.includes("## Outcome"), "at least one adventure ticket with an Outcome exists"),
    expectJournalQuests((t) => t.body.includes("## Outcome"), "at least one quest ticket with an Outcome exists"),
    expectTicketSections("quest"),
    expectDependencyFreeQuestsReady(),
  ],
};

export default scenario;
