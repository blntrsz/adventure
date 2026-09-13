---
name: wait-what
description: Re-pitch the last message in CONTEXT.md language when it did not land. Use for /wait-what, I don't follow, say that in product terms, or jargon collision between lanes.
disable-model-invocation: true
---

# Wait what

## Steps

1. Identify the message that did not land (last assistant message unless the user points elsewhere).
2. Read CONTEXT.md. Replace jargon with terms, or add a term if the concept is load-bearing and missing.
3. Re-pitch in plain language for the consumer and the owning lane. No new decisions.
4. If the miss was a cross-lane assumption, name `/packet` or `/sync`.

**Done when** the user can repeat the point in CONTEXT terms.
