// Session factory (Q4 §2): the ONLY file that touches the pi SDK session
// wiring, so SDK behavior drift is re-verified in one place (Q4 §10).
import { join } from "node:path";
import {
  createAgentSession,
  DefaultResourceLoader,
  loadSkillsFromDir,
  ModelRuntime,
  SessionManager,
  SettingsManager,
  type AgentSession,
  type ResourceLoader,
  type Skill,
} from "@earendil-works/pi-coding-agent";
import type { AgentMessage } from "@earendil-works/pi-agent-core";
import type { Fixture, SessionTrace, SkillInjectionMode } from "./types.ts";

export const DEFAULT_SCENARIO_MODEL = { provider: "deepseek", id: "deepseek-flash" };
export const DEFAULT_STEP_TIMEOUT_MS = 180_000;
export const DEFAULT_SCENARIO_TIMEOUT_MS = 600_000;
export const DEFAULT_MAX_CLARIFICATIONS = 2;

export interface SessionConfig {
  fixture: Fixture;
  model: { provider: string; id: string };
  scenarioName: string;
  /** Scenario-level shared deadline (Q4 §5). */
  timeoutMs: number;
  skillInjection?: SkillInjectionMode;
}

export interface ActiveScenarioSession {
  session: AgentSession;
  trace: SessionTrace; // live-updated via subscribe()
  usage(): { input: number; output: number; cacheRead: number; cost: number };
}

/**
 * Create a headless session rooted in the fixture: in-memory session,
 * in-memory settings (compaction off), hermetic agentDir, fixture cwd.
 */
export async function createScenarioSession(cfg: SessionConfig): Promise<ActiveScenarioSession> {
  const modelRuntime = await ModelRuntime.create({
    authPath: join(cfg.fixture.agentDir, "auth.json"),
    modelsPath: join(cfg.fixture.agentDir, "models.json"),
    modelsStorePath: join(cfg.fixture.agentDir, "models-store.json"),
    // allowModelNetwork stays false: refresh() hydrates from the local
    // models-store.json passthrough without touching the network (Q4
    // invariant 3: deterministic fixture setup).
  });
  const model = modelRuntime.getModel(cfg.model.provider, cfg.model.id);
  if (!model) {
    throw new Error(
      `scenario ${cfg.scenarioName}: model ${cfg.model.provider}/${cfg.model.id} not resolvable ` +
        `(check DEEPSEEK_API_KEY / auth passthrough, or the model catalog in the fixture agentDir)`,
    );
  }

  const trace: SessionTrace = { prompts: [], toolCalls: [], readSkillNames: [], messages: [] };
  let usageAcc = { input: 0, output: 0, cacheRead: 0, cost: 0 };

  // The one deliberate seam (Q4 §4): how the session obtains skills.
  // - "discovery" (default): DefaultResourceLoader discovers from cwd/agentDir,
  //   filtered hermetically to the fixture's injected skills (Q2-verified path).
  // - "skillsOverride": bypass discovery entirely and load the fixture skills
  //   dir explicitly — the fallback if pi's discovery path changes.
  const mode: SkillInjectionMode = cfg.skillInjection ?? "discovery";
  let resourceLoader: ResourceLoader;
  if (mode === "skillsOverride") {
    const loaded = loadSkillsFromDir({ dir: cfg.fixture.skillsDir, source: "fixture-skills" });
    const skills: Skill[] = loaded.skills;
    resourceLoader = new DefaultResourceLoader({
      cwd: cfg.fixture.root,
      agentDir: cfg.fixture.agentDir,
      skillsOverride: () => ({ skills, diagnostics: loaded.diagnostics }),
    });
  } else {
    resourceLoader = new DefaultResourceLoader({
      cwd: cfg.fixture.root,
      agentDir: cfg.fixture.agentDir,
      skillsOverride: (current) => {
        // Hermetic: only the skills injected into the fixture, never the
        // user's global skills.
        const filtered = current.skills.filter((s) => s.baseDir.startsWith(cfg.fixture.skillsDir));
        return { skills: filtered, diagnostics: current.diagnostics };
      },
    });
  }
  await resourceLoader.reload();

  const { session } = await createAgentSession({
    cwd: cfg.fixture.root,
    agentDir: cfg.fixture.agentDir,
    model,
    modelRuntime,
    resourceLoader,
    sessionManager: SessionManager.inMemory(cfg.fixture.root),
    settingsManager: SettingsManager.inMemory({ compaction: { enabled: false } }),
  });

  session.subscribe((event) => {
    if (event.type === "tool_execution_start") {
      const argsPath = event.args?.path ?? event.args?.file_path ?? event.args?.command;
      trace.toolCalls.push({
        name: event.toolName,
        isError: false,
        target: typeof argsPath === "string" ? argsPath : undefined,
      });
      if (event.toolName === "read") {
        const p = event.args?.path ?? event.args?.file_path ?? "";
        if (typeof p === "string" && p.endsWith("SKILL.md")) {
          const m = p.split("/.agents/skills/")[1];
          const name = m ? m.split("/")[0] : p;
          if (name && !trace.readSkillNames.includes(name)) trace.readSkillNames.push(name);
        }
      }
    } else if (event.type === "tool_execution_end") {
      const last = [...trace.toolCalls].reverse().find((t) => t.name === event.toolName && !t.isError);
      if (last) last.isError = event.isError;
    } else if (event.type === "message_end") {
      const msg = event.message as AgentMessage;
      trace.messages.push(msg);
      const u = (
        msg as { usage?: { input?: number; output?: number; cacheRead?: number; cost?: { total?: number } } }
      ).usage;
      if (u) {
        usageAcc.input += u.input ?? 0;
        usageAcc.output += u.output ?? 0;
        usageAcc.cacheRead += u.cacheRead ?? 0;
        usageAcc.cost += u.cost?.total ?? 0;
      }
    } else if (event.type === "agent_end") {
      trace.messages.push(...event.messages);
    }
  });

  return {
    session,
    trace,
    usage: () => ({ ...usageAcc }),
  };
}

/** Last assistant text in the message list — the driver's clarification detector input. */
export function lastAssistantText(messages: AgentMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if ((m as { role?: string }).role !== "assistant") continue;
    const content = (m as { content?: Array<{ type: string; text?: string }> }).content ?? [];
    const text = content
      .filter((c) => c.type === "text")
      .map((c) => c.text ?? "")
      .join("\n")
      .trim();
    if (text) return text;
  }
  return "";
}
