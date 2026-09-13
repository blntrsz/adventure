---
name: rfc
description: Draft a cross-team RFC with named lane reviewers, contract impact, and rollout. Use for /rfc, architecture proposal, cross-team change, or when two teams must accept before build.
disable-model-invocation: true
---

# RFC

## Steps

1. Confirm a local change is not enough. If it is, name `/spec` instead.
2. Write `docs/rfc/` from `templates/rfc.md`. Reviewers are lanes with owners from TEAM.md.
3. Alternatives considered: why they lost, in one paragraph each.
4. Cross-team impact lists contracts to add or version.
5. Packet each reviewer. Status `review` until written accept or abstain.
6. On accept, tell the user to version contracts in the same change, then `/tickets`.

**Done when** the RFC names reviewers, contract deltas, and unresolved questions, and packets exist.
