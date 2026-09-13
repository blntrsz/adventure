---
name: contract
description: Write or version an interface contract another team or service must keep: API, event, SLA, shared seam. Use for /contract, API contract, event schema, partner SLA, or platform interface.
disable-model-invocation: true
---

# Contract

Packets expire. Contracts version.

## Steps

1. Name producer owner and consumer teams.
2. Write or bump `docs/contracts/` from `templates/contract.md`.
3. Interface includes versioning. Guarantees are checkable. Non-guarantees are written.
4. Auth and data class at the boundary. Rollback for consumers on a bad producer deploy.
5. Packet consumers. Silence is not accept.
6. Point specs and tickets at this file.

**Done when** a consumer engineer can implement against the file without a meeting, and rollback is named.
