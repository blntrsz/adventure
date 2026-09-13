---
name: tickets
description: Break a spec, RFC, or conversation into tracer-bullet tickets with blocking edges. Use for /tickets, /to-tickets, slice the work, or when a spec is too large for one session.
disable-model-invocation: true
---

# Tickets

## Steps

1. Read the spec or RFC. If behaviour is missing, stop and name `/spec`.
2. Cut vertical slices. Each ticket demos something a user or partner team can observe. Horizontal layers (schema-only, UI-only with no path) fail this test.
3. Declare blocking edges. Write them as tracker links if GitHub/Linear, or a local `blocks:` list.
4. Each ticket names: seam, prove plan, lane owner, gate stage (merge vs ship).
5. Publish to the configured tracker.

**Done when** every ticket has an owner, a prove plan, and explicit blockers, and the first ticket is unblocked.
