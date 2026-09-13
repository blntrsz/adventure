// Assertion builders (Q4 §2): state assertions are the primary pass/fail
// basis; trace assertions are opt-in. runStateAssertions collects ALL
// failures so one run reports every broken expectation (Q4 invariant 6).
import { missingRequiredSections } from "./template.ts";
import type { JournalTicket, JournalView, StateAssertion, StateContext, TraceAssertion } from "./types.ts";

/** Carries { id, description, message } for per-assertion reporting. */
export class AssertionError extends Error {
  constructor(
    public readonly id: string,
    public readonly description: string,
    message: string,
  ) {
    super(message);
    this.name = "AssertionError";
  }
}

export function assertState(
  id: string,
  description: string,
  check: StateAssertion["check"],
): StateAssertion {
  return { id, description, check };
}

export function assertTrace(id: string, description: string, check: (t: import("./types.ts").SessionTrace) => boolean): TraceAssertion {
  return { id, description, check };
}

// ─── Builder library ────────────────────────────────────────────────────────

/** AGENTS.md has a configured `## Adventure` section (setup ran). */
export function expectAgentConfigured(): StateAssertion {
  return assertState("agent-configured", "AGENTS.md carries an `## Adventure` section", async (ctx) => {
    const section = await ctx.journal.configSection();
    if (section === null) {
      throw new AssertionError("agent-configured", "AGENTS.md carries an `## Adventure` section", "AGENTS.md has no `## Adventure` section — /adventure-setup did not configure the Journal");
    }
  });
}

/** The local Journal has at least one Adventure ticket. */
export function expectJournalAdventures(pred: (t: JournalTicket) => boolean, description: string): StateAssertion {
  return assertState("journal-adventures", description, async (ctx) => {
    const tickets = await ctx.journal.adventures();
    if (!tickets.some(pred)) {
      throw new AssertionError("journal-adventures", description, `no adventure ticket matches; found ${tickets.length} ticket(s): ${tickets.map((t) => t.title).join(", ") || "(none)"}`);
    }
  });
}

/** The local Journal has at least one Quest ticket matching pred. */
export function expectJournalQuests(pred: (t: JournalTicket) => boolean, description: string): StateAssertion {
  return assertState("journal-quests", description, async (ctx) => {
    const tickets = await ctx.journal.quests();
    if (!tickets.some(pred)) {
      throw new AssertionError("journal-quests", description, `no quest ticket matches; found ${tickets.length} ticket(s): ${tickets.map((t) => t.title).join(", ") || "(none)"}`);
    }
  });
}

/** Every quest ticket contains the required template sections. */
export function expectTicketSections(kind: "adventure" | "quest" = "quest"): StateAssertion {
  const id = "ticket-sections";
  const description = `every ${kind} ticket carries the required template sections`;
  return assertState(id, description, async (ctx) => {
    const tickets = kind === "quest" ? await ctx.journal.quests() : await ctx.journal.adventures();
    if (tickets.length === 0) {
      throw new AssertionError(id, description, `no ${kind} tickets exist to check`);
    }
    const problems: string[] = [];
    for (const t of tickets) {
      const missing = missingRequiredSections(t.body, kind);
      if (missing.length > 0) problems.push(`${t.title}: missing ${missing.join(", ")}`);
    }
    if (problems.length > 0) {
      throw new AssertionError(id, description, problems.join("; "));
    }
  });
}

/** Dependency-free quests are marked ready (lifecycle start state). */
export function expectDependencyFreeQuestsReady(): StateAssertion {
  const id = "dependency-free-quests-ready";
  const description = "dependency-free quest tickets are marked ready";
  return assertState(id, description, async (ctx) => {
    const quests = await ctx.journal.quests();
    if (quests.length === 0) {
      throw new AssertionError(id, description, "no quest tickets exist");
    }
    const problems: string[] = [];
    for (const q of quests) {
      const deps = parseDependencies(q.body);
      const state = parseState(q.body);
      if (deps.length === 0 && state !== null && state !== "ready") {
        problems.push(`${q.title}: dependency-free but state is "${state}"`);
      }
    }
    if (problems.length > 0) {
      throw new AssertionError(id, description, problems.join("; "));
    }
  });
}

/** Scope refusal: no new tickets created and a discovery was posted. */
export function expectRefusal(): StateAssertion {
  const id = "scope-refusal";
  const description = "out-of-scope work is refused: no tickets created, discovery posted";
  return assertState(id, description, async (ctx) => {
    const adventures = await ctx.journal.adventures();
    const quests = await ctx.journal.quests();
    if (adventures.length > 0 || quests.length > 0) {
      throw new AssertionError(id, description, `tickets were created despite out-of-scope work (${adventures.length} adventure(s), ${quests.length} quest(s))`);
    }
    // Discovery evidence is checked on the transcript via trace assertions;
    // here we only assert the filesystem state.
  });
}

/** A task quest completed and is marked awaiting-proof. */
export function expectAwaitingProof(): StateAssertion {
  const id = "awaiting-proof";
  const description = "task quest marked awaiting-proof";
  return assertState(id, description, async (ctx) => {
    const quests = await ctx.journal.quests();
    if (quests.length === 0) {
      throw new AssertionError(id, description, "no quest tickets exist");
    }
    const marked = quests.filter((q) => parseState(q.body) === "awaiting-proof");
    if (marked.length === 0) {
      throw new AssertionError(id, description, `no quest is marked awaiting-proof (states: ${quests.map((q) => parseState(q.body) ?? "?").join(", ")})`);
    }
  });
}

/** The final assistant message tells the user to invoke /prove (quest handoff). */
export function expectProveInstruction(): TraceAssertion {
  return assertTrace("prove-instruction", "final message instructs the user to invoke /prove", (trace) => {
    const lastText = trace.messages
      .filter((m) => (m as { role?: string }).role === "assistant")
      .map((m) =>
        ((m as { content?: Array<{ type: string; text?: string }> }).content ?? [])
          .filter((c) => c.type === "text")
          .map((c) => c.text ?? "")
          .join("\n"),
      )
      .filter(Boolean)
      .pop();
    return typeof lastText === "string" && /\/prove\b/.test(lastText);
  });
}

// ─── Ticket metadata parsing (Markdown by convention) ───────────────────────

/** Parse a `## Dependencies` section into ticket references (e.g. "#6"). */
export function parseDependencies(body: string): string[] {
  const section = sectionBody(body, "Dependencies");
  if (section === null) return [];
  const refs = section.match(/#\d+/g) ?? [];
  return [...new Set(refs)];
}

/**
 * Parse the lifecycle state recorded on a ticket. Handles the local-Markdown
 * conventions: an inline `State: <state>` / `Status: <state>` line, or a
 * `## State` / `## Status` section whose body is the bare state.
 */
export function parseState(body: string): string | null {
  const inline = body.match(/(?:^|\n)\s*(?:[-*]\s*)?(?:state|status)[::]\s*\*{0,2}([a-z-]+)\*{0,2}/i);
  if (inline) return inline[1].toLowerCase();
  const section = sectionBody(body, "State") ?? sectionBody(body, "Status");
  if (section !== null) {
    const m = section.match(/\*{0,2}([a-z-]+)\*{0,2}/i);
    if (m) return m[1].toLowerCase();
  }
  return null;
}

function sectionBody(body: string, heading: string): string | null {
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) return null;
  const out: string[] = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].startsWith("## ")) break;
    out.push(lines[i]);
  }
  return out.join("\n").trim();
}

// ─── Runner ─────────────────────────────────────────────────────────────────

export interface AssertionResult {
  id: string;
  description: string;
  status: "pass" | "fail";
  message?: string;
}

/** Run all state assertions, collecting every failure (Q4 invariant 6). */
export async function runStateAssertions(
  assertions: StateAssertion[],
  ctx: StateContext,
): Promise<AssertionResult[]> {
  const results: AssertionResult[] = [];
  for (const a of assertions) {
    try {
      await a.check(ctx);
      results.push({ id: a.id, description: a.description, status: "pass" });
    } catch (err) {
      const message =
        err instanceof AssertionError ? err.message : err instanceof Error ? err.message : String(err);
      results.push({ id: a.id, description: a.description, status: "fail", message });
    }
  }
  return results;
}

/** Run opt-in trace assertions. */
export function runTraceAssertions(
  assertions: TraceAssertion[],
  trace: import("./types.ts").SessionTrace,
): AssertionResult[] {
  return assertions.map((a) => {
    try {
      if (a.check(trace)) return { id: a.id, description: a.description, status: "pass" as const };
      return { id: a.id, description: a.description, status: "fail" as const, message: "trace assertion returned false" };
    } catch (err) {
      return { id: a.id, description: a.description, status: "fail" as const, message: err instanceof Error ? err.message : String(err) };
    }
  });
}

// Re-exported so scenarios can build assertions without importing journal.ts.
export type { JournalTicket, JournalView };
