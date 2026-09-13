---
name: align
description: Grill a plan, brief, or design until the decision tree is empty, and sharpen CONTEXT.md plus ADRs. Use for /align, /grill, misalignment, kickoff, or before spec when humans disagree with the agent or each other.
disable-model-invocation: true
---

# Align

Close the gap between lanes and the agent before anyone writes a spec.

## Steps

1. Name the lane speaking and the lanes that must accept the outcome.
2. Read PRODUCT.md, CONTEXT.md, DESIGN.md, TEAM.md, and any linked brief or packet.
3. Follow **grilling**. Rounds of frontier questions with a recommended answer each. Facts via tools. Decisions via the owning lane.
4. Follow **domain-modeling** whenever a term is load-bearing. Update CONTEXT.md. Write an ADR only for a hard-to-explain choice that future agents will re-litigate.
5. Stop when the frontier is empty. Restate the shared understanding in CONTEXT terms.
6. Name the next skill: `/brief` if the problem is still mush, `/critique` if interaction is open, `/spec` if behaviour is ready, `/packet` if another lane must act.

Do not implement.

**Done when** the user confirms shared understanding and the next slash command is named.
