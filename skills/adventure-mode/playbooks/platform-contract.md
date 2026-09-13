### Platform contract

**Lane: producing team.** Interface another team consumes.

1. Name producer owner and consumer teams from TEAM.md.
2. Draft or version `docs/contracts/` from `templates/contract.md`.
3. Guarantees are checkable (errors, latency class, compatibility window). Non-guarantees are explicit.
4. Auth and data class at the **boundary**.
5. Rollback: how a consumer survives a bad producer deploy.
6. Packet consumers. Do not treat silence as accept.
7. Point `/spec` and `/tickets` at this contract. Implementation without a contract is a guess.

**Reply:** interface, guarantees, consumers pending, version.
