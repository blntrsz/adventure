// Shared contract surface for the eval harness (Q4 architecture).
// Layer 1 uses Check/Violation/CheckContext; Layer 2 (built in #8) uses the rest.

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

/** Headings in docs/skills.md under which commands are indexed. */
export const DOC_COMMAND_INDEX_HEADINGS = [
  "Setup",
  "Orchestration",
  "Workflow",
  "Quest Guides",
  "Visuals",
] as const;
