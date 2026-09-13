---
name: blast-radius
description: Find what else a change can break beyond the diff, and prove the one fact it is safe because of by running code. Use when a small-looking change, a contract bump, or a review needs blast radius.
---

# Blast radius

## Steps

1. Name the behaviour change in CONTEXT terms.
2. Search callers, jobs, flags, partner contracts, and dashboards that assume the old behaviour.
3. Pick the one fact that would make the change safe (idempotency, versioned field, flag off by default).
4. Prove that fact by running code or a contract test. Do not assert it in prose.
5. List residual risks as guess if unproven.

**Done when** the safety fact is measured or the residual risk is explicit.
