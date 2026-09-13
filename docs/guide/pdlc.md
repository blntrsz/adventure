# PDLC

Adventure's product development loop is a **gate chain**, not a waterfall. You can enter at any stage. You cannot skip a gate by renaming the work.

## Stages

1. **Discover.** `/brief` captures the problem in production language. `/align` grills until the design tree is empty.
2. **Shape.** `/critique` for interaction. `/spec` for behaviour at named seams. `/contract` when another team or service must keep a promise. `/rfc` when the change is contested or cross-cutting.
3. **Sequence.** `/tickets` cuts tracer bullets with blocking edges. `/wayfind` if one session cannot hold the map. `/staff` if people and risk are the constraint.
4. **Build.** `/build` implements one ticket or spec. Architect before code that crosses a function boundary. TDD at agreed seams.
5. **Prove.** `/prove` exercises the real path. `/blast-radius` names what else can break. `/gate` fills evidence cells.
6. **Review.** `/review` is two axes (standards, spec) plus enterprise (security, ops, contracts).
7. **Ship.** `/ship` is flag, rollback, observability, owner. Merge is not ship.
8. **Learn.** `/compound` writes a lesson. If the lesson is an interface, update the contract in the same change.

## Tracer bullets

A ticket that cannot demo a vertical slice is a task, not a tracer. Sequence so each merge proves something a user or a partner team can observe.

## Production ready

Production-ready means:

- Behaviour specified including failure
- Owner named after merge
- Rollback named before rollout
- Telemetry that would have caught this bug
- Contract version if another team consumes you
