---
name: adventure
description: Plan or amend an Adventure and materialize its accepted Quest graph. Run explicitly with a goal or an existing Adventure ticket.
disable-model-invocation: true
---

# Adventure

An Adventure turns an outcome into an accepted graph of resumable Quests. Read [the Journal contract](../_shared/journal.md), [ticket templates](../_shared/tickets.md), and [lifecycle](../_shared/lifecycle.md) before proceeding.

## 1. Orient

Read the configured Journal and relevant project artifacts: Project Sheet, Glossary, Codebook, maps, architectural documentation, and existing related tickets. Explore the code paths likely to change.

When the architecture, terminology, or rationale remains too uncertain to plan safely, invoke the `lore` skill with the specific unknown. Resume orientation only after that unknown is resolved.

Orientation is complete when you can name the desired outcome, affected area, material constraints, and remaining unknowns.

## 2. Establish shared understanding

Ask the smallest useful round of high-level questions. Prefer questions about users, outcomes, scope, constraints, and acceptance over implementation details. Reflect the answers as a concise proposed understanding and ask the user to correct it.

Turn unresolved details into Research, Prototype, or Decision Quests when they can be resolved during the Adventure. Continue asking until the user explicitly agrees with the proposed understanding.

## 3. Draft the Quest graph

Choose the smallest Quest types that expose uncertainty and dependencies:

- Research for factual unknowns;
- Prototype for cheap feasibility or interaction learning;
- Decision for trade-offs;
- Architecture for modules, interfaces, seams, and migration shape;
- Task for product or code changes;
- Fetch for obtaining or transforming known material.

Draft every known Quest using the Quest template. Application-changing Tasks include observable behaviors under `Proof`; other Quests say `Not required`. Later tickets may be high-level when an earlier Quest will refine them.

Show a Mermaid dependency flowchart and the proposed ticket list. Ask for explicit acceptance. Revise without writing tickets until accepted.

## 4. Materialize

After acceptance, invoke `to-quests` with the accepted Adventure and graph. Create all known tickets, including blocked and later Quests. Materialization is complete when every ticket has a stable reference, parent Adventure, dependencies, type, and outcome.

Stop after showing the created graph and the first ready Quest. Offer the command `/quest <reference>`; execution begins only when the user invokes it.

## Amendments

When invoked for an existing Adventure, read its tickets and the discovery that triggered amendment. Propose the smallest graph change, obtain explicit acceptance, then create or update tickets through `to-quests`. Preserve ticket history and leave all tickets open.
