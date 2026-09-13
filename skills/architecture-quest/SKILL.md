---
name: architecture-quest
description: Guide an Architecture Quest toward modules, interfaces, seams, migration steps, and test surfaces. Use when the Quest dispatcher selects an architecture ticket.
---

# Architecture Quest Guide

1. Read the current code paths and prior Quest outcomes. State the forces the design must reconcile.
2. Sketch at least two materially different shapes when the design space is not already constrained.
3. Compare module depth, interface size, seam placement, locality, migration risk, and testability. Introduce a seam only where behavior actually varies.
4. Specify the chosen shape through module responsibilities, caller-visible interfaces, data and control flow, errors, invariants, and migration order.
5. Trace representative and edge-case scenarios through the design. Revise until every named constraint has a home.
6. Post the proposed architecture, alternatives, diagrams, trade-offs, risks, and consequences to the Journal.

Write repository architecture documentation only when the ticket requests that deliverable. The user accepts the architecture and closes the ticket; implementation belongs to Task Quests.
