---
name: build
description: Implement one spec or tracer ticket with architected seams, TDD, and a merge gate. Use for /build, /implement, implement the spec, or when tickets are ready and the user wants production code.
disable-model-invocation: true
---

# Build

Implement the work named by the user (spec, ticket, or packet). One tracer at a time.

## Steps

1. Read spec, ticket, CONTEXT.md, contracts. If behaviour is missing, stop and name `/spec`.
2. **architect** when crossing a function boundary. Name the data shape.
3. **tdd** at agreed seams. Typecheck often. Targeted tests often. Full suite once at the end.
4. **prove** on the real surface. **blast-radius**.
5. Fill merge **gate**. Tell the user `/review` then `/ship` if ship gates remain.
6. Commit on the current branch in small verifiable units.

**Done when** the tracer's prove plan is green and the merge gate has evidence cells filled.
