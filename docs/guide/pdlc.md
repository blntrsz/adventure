# PDLC

Adventure's product development loop is a **gate chain**, not a waterfall. You can enter at any stage. You cannot skip a gate by renaming the work.

Skills for these stages are not in the repo yet.

## Stages (planned)

1. **Discover.** Brief in production language. Align until the design tree is empty.
2. **Shape.** Critique for interaction. Spec at named seams. Contract when another team must keep a promise. RFC when contested or cross-cutting.
3. **Sequence.** Tracer-bullet tickets with blocking edges. Wayfind if one session cannot hold the map. Staff if people and risk are the constraint.
4. **Build.** One ticket or spec. Architect before code that crosses a function boundary. TDD at agreed seams.
5. **Prove.** Real path. Blast radius. Gate evidence cells.
6. **Review.** Standards, spec fidelity, security, ops, contracts.
7. **Ship.** Flag, rollback, observability, owner. Merge is not ship.
8. **Learn.** Lesson file. If the lesson is an interface, update the contract in the same change.

## Tracer bullets

A ticket that cannot demo a vertical slice is a task, not a tracer. Sequence so each merge proves something a user or a partner team can observe.

## Production ready

Production-ready means:

- Behaviour specified including failure
- Owner named after merge
- Rollback named before rollout
- Telemetry that would have caught this bug
- Contract version if another team consumes you
