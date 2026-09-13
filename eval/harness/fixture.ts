// Fixture provisioning (Q4 §2): deterministic templates materialized into a
// fresh temp dir OUTSIDE the repo tree, repo skills injected at the
// Q2-verified discovery path, hermetic generated agentDir.
import { cp, mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { isAbsolute, join, resolve, sep } from "node:path";
import { existsSync } from "node:fs";
import type { Fixture, FixtureSpec } from "./types.ts";

/** Where skills are injected inside a fixture (Q2-verified discovery path). */
const SKILLS_DEST = ".agents/skills";

/** Files every fixture template starts from. Deterministic: no timestamps, no randomness. */
function adventureProjectFiles(): Record<string, string> {
  return {
    "README.md": "# Fixture project\n\nA disposable project for an eval scenario run.\n",
    "src/slug.js": "export function slug(s) {\n  return s.toLowerCase().replaceAll(/[^a-z0-9]+/g, \"-\").replace(/^-|-$/g, \"\");\n}\n",
    "AGENTS.md": "# fixture-project\n\nA trivial project used as an eval fixture.\n",
    ".gitignore": ".adventure/\n",
  };
}

export const fixtureTemplates: Record<string, (dest: string) => Promise<void>> = {
  "adventure-project": async (dest: string) => {
    for (const [rel, content] of Object.entries(adventureProjectFiles())) {
      const target = join(dest, rel);
      await mkdir(join(target, ".."), { recursive: true });
      await writeFile(target, content);
    }
  },
};

/** Reject temp dirs inside the repo tree (Q4 invariant 2: no repo pollution). */
function assertOutsideRepo(root: string, repoRoot: string): void {
  const absRoot = resolve(root);
  const absRepo = resolve(repoRoot);
  if (absRoot === absRepo || absRoot.startsWith(absRepo + sep)) {
    throw new Error(`fixture root ${absRoot} is inside the repo tree ${absRepo} — refusing to pollute the repo`);
  }
}

/**
 * Materialize a fixture from a template into a fresh temp dir, inject the
 * repo's skills, and generate a hermetic agentDir (models-store/auth
 * passthrough from the user's real agent dir when present).
 */
export async function provisionFixture(
  spec: FixtureSpec,
  opts: { repoRoot: string; skillsSource: string },
): Promise<Fixture> {
  const template = fixtureTemplates[spec.template];
  if (!template) {
    throw new Error(`unknown fixture template: ${spec.template} (known: ${Object.keys(fixtureTemplates).join(", ")})`);
  }
  const root = await mkdtemp(join(realTmp(), "adventure-eval-"));
  assertOutsideRepo(root, opts.repoRoot);
  await mkdir(join(root, SKILLS_DEST), { recursive: true });
  await template(root);

  // Scenario-specific extra files (e.g. a deliberately broken skill).
  for (const [rel, content] of Object.entries(spec.files ?? {})) {
    if (isAbsolute(rel) || rel.includes("..")) {
      throw new Error(`fixture file path escapes the fixture root: ${rel}`);
    }
    const target = join(root, rel);
    await mkdir(join(target, ".."), { recursive: true });
    await writeFile(target, content);
  }

  // Inject repo skills at the discovery path (Q2: cwd/.agents/skills suffices).
  await cp(opts.skillsSource, join(root, SKILLS_DEST), { recursive: true });

  // Hermetic agentDir: empty except catalog/auth passthrough (Q4 invariant 4).
  const agentDir = join(root, ".agent-dir");
  await mkdir(agentDir, { recursive: true });
  const home = homedir();
  for (const name of ["models-store.json", "auth.json"] as const) {
    const src = join(home, ".pi", "agent", name);
    if (existsSync(src)) await cp(src, join(agentDir, name));
  }

  return {
    root,
    agentDir,
    skillsDir: join(root, SKILLS_DEST),
    async dispose() {
      await rm(root, { recursive: true, force: true });
    },
  };
}

/** OS temp dir, resolved once. mkdtemp needs an existing parent. */
function realTmp(): string {
  const candidate = process.env.TMPDIR || "/tmp";
  return resolve(candidate);
}
