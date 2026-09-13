# Adventure

Skeleton for an enterprise AI PDLC skill library.

Inspired by Matt Pocock skills, pstack, and Compound Engineering. Target: production-ready product development with PM, design, eng, EM, and cross-team collaboration.

**No skills yet.** `skills/` and `agents/` are empty on purpose.

## Layout

```text
.cursor-plugin/     Cursor plugin manifest
.claude-plugin/     Claude plugin manifest
skills/             Skill packages (empty)
agents/             Subagents (empty)
templates/          Durable doc templates for consuming repos
.adventure/         Example plugin config
docs/guide/         Intent and PDLC notes
```

## Later

Skills land under `skills/<name>/SKILL.md`. Setup in a product repo will copy templates under `docs/`. See `docs/guide/`.
