# Collaboration

Enterprise work fails at the **seam between lanes**, not inside a file.

## Lanes

PM, design, eng, EM, security, QA, partner. `docs/TEAM.md` maps people to lanes. Do not guess a decision that belongs to another lane. Put it in a packet or sync.

## Packet vs handoff vs sync (planned)

| Tool | Moves | Durable |
| --- | --- | --- |
| packet | Work from one **lane** to another | Yes, under `docs/packets/` |
| handoff | Context from one **agent session** to the next | Snapshot. Point at packets, do not copy them |
| sync | A questionnaire to a human who is not here | Yes, until they answer |

A packet has a from-lane, to-lane, owner, and a checkable **done when**. A status of `ready` without an owner is invalid.

## Contracts

Versioned promises between teams or services: API, event, SLA, shared UI seam. Packets expire. Contracts version.

## Cross-team RFC

When two or more teams must accept a change. Reviewers are named lanes, not "stakeholders". An accepted RFC that does not update a contract is unfinished.

## EM lane

Sequence people and irreversible steps. No code. Who is blocked on whom, what can run in parallel, which ship gates the EM owns (SLO, owner after hours).
