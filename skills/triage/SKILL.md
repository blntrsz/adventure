---
name: triage
description: Move issues through Adventure triage states using configured labels: inbox, ready, blocked, doing, done. Use for /triage, label issues, inbox sweep, or ticket hygiene.
disable-model-invocation: true
---

# Triage

## Steps

1. Read triage_labels from config. If missing, run setup first.
2. For each issue in scope: current state, missing owner, missing prove plan, missing blocker links.
3. Ready requires: owner, tracer-sized, unblocked, prove plan.
4. Blocked requires: named blocker and owning lane.
5. Apply labels or local status fields. Do not invent a sixth state.
6. Packet a lane if a human decision is the blocker. That is `/sync` as the next command.

**Done when** every issue in scope has a legal state and an owner or an explicit inbox reason.
