---
name: gate
description: Fill a merge or ship gate with named owners and evidence cells. Empty evidence is a fail. Use for /gate, production readiness, merge checklist, go-live, or release evidence.
disable-model-invocation: true
---

# Gate

## Steps

1. Read `.adventure/config.yaml` gates for `merge` or `ship`. Default to merge if unspecified.
2. Write `docs/gates/` from `templates/gate.md`.
3. Every check has an owner from TEAM.md and evidence (command, link, observation). A blank evidence cell is a fail.
4. Do not mark pass from compile, self-report, or "should be fine".
5. Print the first failing check. Stop there for the user's decision.

**Done when** all cells are pass with evidence, or the first fail is named with owner.
