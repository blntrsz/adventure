// Scripted user driver (Q4 §2): prompt loop + answer policy, bounded
// clarifications, per-step and scenario timeouts. Flakiness machinery lives
// here so failures are attributable, not silent (Q3 decision).
import {
  DEFAULT_MAX_CLARIFICATIONS,
  DEFAULT_SCENARIO_TIMEOUT_MS,
  DEFAULT_STEP_TIMEOUT_MS,
  lastAssistantText,
} from "./session.ts";
import type { ActiveScenarioSession } from "./session.ts";
import type { Fixture, Step } from "./types.ts";

export interface DriverResult {
  completed: boolean;
  failure?: { step: string; kind: "timeout" | "clarification" | "exception"; message: string };
  clarifications: number;
}

/**
 * Q2's widened clarification heuristic, factored into one function so it is
 * improvable in one place (Q4 §2). Matches a trailing question OR explicit
 * ask-for-input phrasing in the tail of the agent's final text.
 */
export function looksLikeClarification(text: string): boolean {
  const tail = text.slice(-800);
  if (!tail.trim()) return false;
  if (tail.includes("?")) return true;
  return /\b(which|option|reply with|confirm|choose|please (?:tell|specify|provide)|let me know)\b/i.test(tail);
}

function withTimeout<T>(p: Promise<T>, ms: number, onTimeout: () => void, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      onTimeout();
      reject(new Error(label));
    }, ms);
  });
  return Promise.race([p, timeout]).finally(() => {
    if (timer) clearTimeout(timer);
  }) as Promise<T>;
}

/**
 * Run the scenario's steps in order against one live session.
 *
 * - Per step: resolve the prompt, `session.prompt(text)`; while the agent's
 *   final text looks like a clarification question, consult the answer policy
 *   → canned answer, prompt again, bounded by `maxClarifications`.
 * - A wall-clock deadline shared across steps enforces the scenario timeout
 *   (checked before each prompt; a hung prompt() is raced against a timer
 *   that calls session.abort() then fails).
 */
export async function runSteps(
  steps: Step[],
  sess: ActiveScenarioSession,
  fixture: Fixture,
  scenarioTimeoutMs: number = DEFAULT_SCENARIO_TIMEOUT_MS,
): Promise<DriverResult> {
  const deadline = Date.now() + scenarioTimeoutMs;
  let clarifications = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const remaining = deadline - Date.now();
    if (remaining <= 0) {
      return {
        completed: false,
        failure: {
          step: step.name,
          kind: "timeout",
          message: `scenario deadline (${scenarioTimeoutMs} ms) exhausted before step "${step.name}"`,
        },
        clarifications,
      };
    }

    let promptText: string;
    try {
      promptText = typeof step.prompt === "function" ? step.prompt(fixture) : step.prompt;
    } catch (err) {
      return {
        completed: false,
        failure: { step: step.name, kind: "exception", message: `prompt resolver threw: ${err}` },
        clarifications,
      };
    }

    const stepTimeout = Math.min(step.timeoutMs ?? DEFAULT_STEP_TIMEOUT_MS, remaining);
    const maxClar = step.maxClarifications ?? DEFAULT_MAX_CLARIFICATIONS;

    try {
      let current = promptText;
      let round = 0;
      // Bounded prompt/clarify loop for this step.
      while (true) {
        sess.trace.prompts.push(current);
        await withTimeout(
          sess.session.prompt(current),
          stepTimeout,
          () => void sess.session.abort(),
          `step "${step.name}" timed out after ${stepTimeout} ms`,
        );
        const reply = lastAssistantText(sess.session.messages);
        if (!looksLikeClarification(reply)) break;
        if (round >= maxClar) {
          return {
            completed: false,
            failure: {
              step: step.name,
              kind: "clarification",
              message: `agent still asking questions after ${maxClar} canned answers; last text: ${JSON.stringify(reply.slice(0, 400))}`,
            },
            clarifications,
          };
        }
        const answer = step.answerPolicy
          ? step.answerPolicy(reply, { step, stepIndex: i, clarificationsSoFar: clarifications })
          : null;
        if (answer === null || answer === undefined) {
          return {
            completed: false,
            failure: {
              step: step.name,
              kind: "clarification",
              message: `no answer policy for the agent's question; last text: ${JSON.stringify(reply.slice(0, 400))}`,
            },
            clarifications,
          };
        }
        clarifications++;
        round++;
        current = answer;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        completed: false,
        failure: { step: step.name, kind: message.includes("timed out") ? "timeout" : "exception", message },
        clarifications,
      };
    }
  }

  return { completed: true, clarifications };
}
