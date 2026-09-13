# Eval loop

On-demand evaluation of the Adventure framework's skills and shared contracts.

## Run it

```bash
bun install
bun eval/run.ts
```

Requires Bun. Layer 1 needs no API key; Layer 2 runs live DeepSeek sessions and needs DeepSeek credentials (`DEEPSEEK_API_KEY` or a `deepseek` entry in `~/.pi/agent/auth.json`).

Exit code is non-zero when any check or scenario fails.

Flags: `--checks-only`, `--scenarios-only`, `--scenario <name>` (repeatable), `--repeat <k>` (independent full runs; pass^k read from the report), `--model <provider/id>`.

Reports land in gitignored `eval/output/<run-id>/` (`report.json`, `report.md`, per-scenario transcripts).

## Layers

- **Layer 1 — contract checks** (this Quest): deterministic, no LLM, no network. Validates every `skills/*/SKILL.md` and `skills/_shared/*.md`:
  - `frontmatter` (R1): Agent Skills frontmatter — name format and directory match, non-empty description ≤ 1024 chars, known optional fields.
  - `links` (R2): every relative markdown link in skills and `_shared` resolves to an existing file.
  - `consistency` (R3): backticked lifecycle-state tokens used by skills are defined in `skills/_shared/lifecycle.md`.
  - `lifecycle` (R3a): `lifecycle.md`'s state flows define exactly the vocabulary in `eval/harness/types.ts`.
  - `ticket-templates` (R4a): the `tickets.md` Adventure/Quest templates contain every required section.
  - `commands` (R5): slash-command references map to existing skills; `docs/skills.md` covers every skill (`/prove` whitelisted as application-provided).
- **Layer 2 — scenario runs** (#8): scripted headless pi sessions against a fixture project. On-demand only, never a push gate. Each scenario (`eval/scenarios/<name>.scenario.ts`) declares its model, steps, fixture, and assertions; the harness (`eval/harness/`) provisions fixtures outside the repo, drives the session with a scripted user (bounded clarifications, per-step/scenario timeouts), asserts on Journal state, and writes the report. Adding a scenario = adding one scenario file (plus fixture extras in its own `FixtureSpec`), no runner changes.

## Current findings

The repo as of this Quest has one genuine violation: `docs/skills.md` does not document the `show-me` and `technical-writing` skills. Fixing the docs is repo polish (out of scope for this Adventure per #2) — the validator correctly names it.

## Self-test

```bash
bash eval/selftest.sh
```

Builds a synthetic corpus in a temp dir and verifies each rule fires on a targeted defect (R1 name format, R2 broken link, R3 undefined state, R4a missing template section, R5 unknown command). Read-only for the repo.
