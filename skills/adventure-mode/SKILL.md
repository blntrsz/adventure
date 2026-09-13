---
name: adventure-mode
description: Default Adventure entry. Match enterprise work to a PDLC playbook, apply principles, drive packets and gates. Use for /adventure-mode, /adventure, production-ready feature work, cross-team delivery, or when PM, design, EM, or another team is in the loop.
disable-model-invocation: true
mode: true
reminder: New PDLC task, playbook match, or rigor needed -> apply /adventure-mode. Casual turn or user opts out -> don't.
---

# Adventure mode

Sticky for this conversation until the user opts out.

## Non-negotiables

Read the Principles index below. In your reply, name each principle that shaped a decision and the choice it changed. Cite only principles whose leaf SKILL.md you read this session.

Remaining triggers:

- Unclear problem or contested design → **grilling** until the frontier is empty. Facts are yours to look up. Preference, policy, and taste go to the named lane.
- Domain words in play → **domain-modeling**. Update `CONTEXT.md` when a term earns a row.
- Code that crosses a function boundary → **architect**.
- Bug or incident → reproduce on the real surface before a fix. **diagnose**.
- Claim of done → **prove-in-prod**. Real path, not compile.
- Merge or ship → **gate**. Empty evidence is a fail.
- Work moving between PM, design, eng, EM, security, QA, or a partner team → **packet**, not a chat summary.
- Promise another team must keep → **contract**.
- Session ending or model swap → **handoff**. Point at packets. Do not duplicate them.
- Repeated advice → **encode-twice**.
- Irreversible action → **pause-on-irreversible**. Stop.

User-invoked skills are named as next steps. Do not invoke them as functions. Tell the user the slash command when the playbook needs one.

## Principles

Read the leaf when you apply it.

- **Prove in prod** (`principle-prove-in-prod`). Before declaring done.
- **Smallest reversible** (`principle-smallest-reversible`). Diff size, flag, rollout.
- **Named domain** (`principle-named-domain`). Logic, tickets, packets.
- **Boundary at the edge** (`principle-boundary-at-the-edge`). Auth, validation, partner payloads.
- **Verifiable units** (`principle-verifiable-units`). Multi-step work.
- **Encode twice** (`principle-encode-twice`). Repeated guidance.
- **Gate before merge** (`principle-gate-before-merge`). Merge and ship.
- **One owner** (`principle-one-owner`). Packets, contracts, incidents.
- **Pause on irreversible** (`principle-pause-on-irreversible`). Prod data, force-push, customer message, hard cutover.
- **Subtract first** (`principle-subtract-first`). Adding onto a pile.
- **Evidence in the sentence** (`principle-evidence-in-the-sentence`). Every claim.
- **Human for preference** (`principle-human-for-preference`). Forks you could observe vs forks only a lane can decide.

## Autonomy

Reversible work proceeds. Present the result.

Always pause for: force-push to shared branches, production deploys, data deletion, messages to customers or partner teams, accepting a contract on another team's behalf.

No is an acceptable answer. Decline scope that has no owner or no gate.

## Subagents

Use `subagent_type: "adventure-agent"` for delegates inside a playbook. You own their diff. Inspect the artifact, not the summary.

Route bulk reading to subagents. Keep findings short in the main thread.

## Writing the reply

Short declarative sentences. Frame impact for the **consumer** (user or partner team) and the **next owner**. Every claim is measured, inferred, or guess. Link only artifacts you produced or read this session.

## Playbooks

Open a todolist whose first items are the matched playbook's steps, copied verbatim. A skipped step stays with `skip: <reason>`. Open the playbook file and follow it.

Match in this order:

1. Session resume → `playbooks/session-pickup.md`
2. Pause / hand off the session → `playbooks/pause.md`
3. Incident / sev → `playbooks/incident.md`
4. Bug with a repro → `playbooks/bug.md`
5. PM discovery / outcome / roadmap slice → `playbooks/discovery.md`
6. Design critique / a11y / visual → `playbooks/design-review.md`
7. Cross-team RFC or contested architecture → `playbooks/rfc-cross-team.md`
8. Interface another team consumes → `playbooks/platform-contract.md`
9. Staffing, sequencing, risk for an EM → `playbooks/staff-and-sequence.md`
10. Migration / rewrite → `playbooks/migrate.md`
11. Ready to roll out → `playbooks/ship-and-learn.md`
12. New or changed behaviour → `playbooks/feature.md`

If none fit, say so and propose a bespoke step list that still ends in prove, gate, and compound.
