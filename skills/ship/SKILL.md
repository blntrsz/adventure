---
name: ship
description: Production rollout with flag, rollback, observability, SLO, and named owner. Merge is not ship. Use for /ship, rollout, release, feature flag, or production deploy of a gated change.
disable-model-invocation: true
---

# Ship

## Steps

1. Confirm merge gate is green. If not, stop.
2. Fill ship gate from config: flag, rollback, observability, slo, owner. Extra checks from config.
3. Smallest reversible slice. Pause on irreversible cutover until the user confirms.
4. Watch the brief's outcome metric or the contract's signal. Measured.
5. Name `/compound` as next step. Close packets only when done when is met.

**Done when** ship gate evidence cells are filled and rollback was stated before the slice went out.
