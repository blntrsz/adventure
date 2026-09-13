---
name: handoff
description: Snapshot this agent session so another agent can resume. Points at packets, specs, and contracts instead of copying them. Use for /handoff, session snapshot, continue in a new chat, or model swap.
disable-model-invocation: true
---

# Handoff

Two directions: **create** (default) and **resume**.

## Create

Write a markdown snapshot (default `docs/packets/handoffs/` or a path the user names). Include:

- Objective and latest user intent
- Complete / in-progress / not-started
- Decisions and rejected alternatives
- Pointers to packets, specs, contracts, gates, branches. Why each matters
- Fragile local state, labeled as machine-local
- Next playbook recommendation
- Secrets redacted

Print a resume line: `/handoff resume <path>`.

## Resume

If the query is a topic, list candidates and wait. If it is a path, read it, check artifacts still exist, summarize, recommend one next skill, and wait. Do not start `/build`.

**Done when** create printed a path, or resume waited after a recommendation.
