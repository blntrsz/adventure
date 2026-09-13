### RFC cross-team

**Lane: owner named in the RFC.** Contested or multi-team change.

1. Read existing contracts and ADRs. Restate why a local change is not enough.
2. Draft `docs/rfc/` from `templates/rfc.md`. Reviewers are lanes with owners.
3. **grilling** only on decisions those lanes own. Facts researched in parallel.
4. Cross-team impact section lists contracts to add or version.
5. Packet each reviewer. Status stays `review` until every named lane accepts or abstains in writing.
6. On accept, update contract and CONTEXT in the same change. Tell the user `/tickets` next.

**Reply:** proposal in one paragraph, reviewers, contract deltas, unresolved questions.
