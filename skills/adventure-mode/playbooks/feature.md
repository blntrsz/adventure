### Feature

**Lane: eng.** New or changed behaviour from a spec or packet.

1. Read spec, contracts, CONTEXT.md, and TEAM.md. If there is no spec, stop and name `/spec` or `/align`.
2. **architect** when the change crosses a function boundary. Name the data shape first (**named domain**).
3. Cut or pick one tracer ticket. **verifiable units**.
4. Implement with **tdd** at agreed seams. Subtract dead paths first.
5. **prove** on the real surface. **blast-radius** for what else can break.
6. Fill a **gate** for merge. Empty evidence is a fail.
7. Packet QA or EM if ship gates remain. Name `/ship` when merge is not ship.

**Reply:** behaviour shipped to the consumer, seams, proof, gate status, next lane.
