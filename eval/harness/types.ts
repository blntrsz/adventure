// Shared contract surface for the eval harness (Q4 architecture).
// Layer 1 uses Check/Violation/CheckContext; Layer 2 (built in #8) uses the rest.
import type { AgentMessage } from "@earendil-works/pi-agent-core";

export interface Violation {
  file: string; // repo-relative
  rule: string; // stable rule id, e.g. "R1.name-format"
  message: string; // names the file and the violated rule
}

export interface CheckResult {
  check: string; // e.g. "checks/frontmatter"
  status: "pass" | "fail";
  violations: Violation[]; // empty when pass
}

export interface CheckContext {
  repoRoot: string;
  skills: string[]; // paths to all SKILL.md files (discovered once by the runner)
}

export type Check = (
  ctx: CheckContext,
) => CheckResult | CheckResult[] | Promise<CheckResult | CheckResult[]>;

/** Sections an Adventure ticket must carry (skills/_shared/tickets.md). */
export const ADVENTURE_SECTIONS = [
  "Outcome",
  "Scope",
  "Out of scope",
  "Shared understanding",
  "Quest graph",
  "Quests",
] as const;

/** Sections a Quest ticket must carry (skills/_shared/tickets.md). */
export const QUEST_SECTIONS = [
  "Adventure",
  "Type",
  "Description",
  "Outcome",
  "Constraints",
  "Dependencies",
  "Proof",
  "Discoveries",
] as const;

/** The six Quest types (skills/_shared/tickets.md Type enumeration). */
export const QUEST_TYPES = [
  "research",
  "prototype",
  "decision",
  "architecture",
  "task",
  "fetch",
] as const;

/**
 * Lifecycle states defined in skills/_shared/lifecycle.md. Kept in sync by the
 * R3 check itself: any backticked state token used by a skill must appear in
 * lifecycle.md; this list is what lifecycle.md defines today.
 */
export const LIFECYCLE_STATES = [
  // Adventure states
  "draft",
  "proposed",
  "accepted",
  // Quest states (shared)
  "ready",
  "active",
  "user-closed",
  // Application Quest path
  "awaiting-proof",
  "proven",
  "in-review",
  // Non-application Quest path
  "outcome-ready",
] as const;

/** Commands documented as provided by applications, not this framework. */
export const EXTERNAL_COMMAND_WHITELIST = ["prove"] as const;

// ─── Layer 2: scenario harness (built by #8) ────────────────────────────────

/** How the fixture session obtains skills (the one deliberate seam, Q4 §4). */
export type SkillInjectionMode = "discovery" | "skillsOverride";

export interface FixtureSpec {
  template: string; // keyed registry; new templates = new keys
  files?: Record<string, string>; // scenario-specific extra files (repo-relative → content)
}

export interface Fixture {
  root: string; // absolute temp dir (always OUTSIDE the repo tree)
  agentDir: string; // generated, empty except models-store/auth passthrough
  skillsDir: string; // <root>/.agents/skills
  dispose(): Promise<void>;
}

/** Context handed to a step's answer policy when the agent asks a question. */
export interface StepContext {
  step: Step;
  stepIndex: number;
  clarificationsSoFar: number;
}

export type AnswerPolicy = (question: string, step: StepContext) => string | null;

export interface Step {
  name: string;
  prompt: string | ((fixture: Fixture) => string);
  answerPolicy?: AnswerPolicy; // default: fail on unanswered clarification
  maxClarifications?: number; // default 2
  timeoutMs?: number; // default 180_000
}

export interface JournalTicket {
  path: string;
  title: string;
  body: string;
}

export interface JournalView {
  adventures(): Promise<JournalTicket[]>;
  quests(): Promise<JournalTicket[]>;
  /** AGENTS.md `## Adventure` section body, or null when absent. */
  configSection(): Promise<string | null>;
}

export interface StateContext {
  fixture: Fixture;
  journal: JournalView;
}

export interface StateAssertion {
  id: string;
  description: string;
  check: (ctx: StateContext) => Promise<void>; // throw AssertionError on fail
}

export interface SessionTrace {
  prompts: string[];
  toolCalls: Array<{ name: string; isError: boolean; target?: string }>;
  readSkillNames: string[]; // skills the agent read via SKILL.md reads
  messages: AgentMessage[];
}

export interface TraceAssertion {
  id: string;
  description: string;
  check: (trace: SessionTrace) => boolean;
}

export interface Scenario {
  name: string; // unique; filename must match <name>.scenario.ts
  description: string;
  model?: { provider: string; id: string }; // default deepseek/deepseek-flash
  fixture: FixtureSpec;
  steps: Step[];
  stateAssertions: StateAssertion[];
  traceAssertions?: TraceAssertion[]; // presence = trace failures count
}

export interface ScenarioOutcome {
  scenario: string;
  model: string; // "provider/id" actually used
  status: "pass" | "fail" | "error";
  repeatIndex?: number; // present when --repeat k, k>1
  durationMs: number;
  tokenUsage?: { input: number; output: number; cacheRead: number };
  estimatedCost?: number; // advisory; summed from provider-reported usage
  toolErrorCount: number;
  clarifications: number;
  failure?: {
    step?: string;
    kind: "assertion" | "timeout" | "clarification" | "exception";
    message: string;
  };
  assertions: Array<{ id: string; description: string; status: "pass" | "fail"; message?: string }>;
  transcriptPath?: string;
}

export interface CheckOutcome {
  results: CheckResult[];
  durationMs: number;
}

export interface RunReport {
  runId: string;
  startedAt: string;
  command: string;
  args: string[];
  checks?: CheckOutcome;
  scenarios: ScenarioOutcome[];
  summary: { passed: number; failed: number; total: number; estimatedCost: number };
}

/** Headings in docs/skills.md under which commands are indexed. */
export const DOC_COMMAND_INDEX_HEADINGS = [
  "Setup",
  "Orchestration",
  "Workflow",
  "Quest Guides",
  "Visuals",
] as const;
