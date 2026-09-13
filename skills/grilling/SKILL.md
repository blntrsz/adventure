---
name: grilling
description: Relentless interview until every branch of the design tree is resolved. Use when aligning, stress-testing a plan, or any Adventure skill needs a grill. Facts are looked up. Decisions go to the owning lane.
---

# Grilling

Map the work as a **design tree**. The **frontier** is every decision whose prerequisites are settled.

Work in **rounds**. Ask the whole frontier in one round. Number each question. Give a recommended answer. Wait for answers before the next round.

```
❓ **Q1** - **<title>**: <body, options>

➡️ <recommended answer>
```

A question that depends on an unanswered question in this round belongs to a later round.

Facts are the agent's job. Dispatch tools or subagents. Do not ask the user for the filesystem, the tracker, or production signals you can read. Decisions belong to a **lane**. Name the lane on the question. If the lane is absent, stop that branch and name `/sync` or `/packet`.

The session is done when the frontier is empty. Do not act on the plan until the user confirms shared understanding.
