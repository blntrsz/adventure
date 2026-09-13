---
name: quest
description: Execute or resume exactly one Journal Quest through its type-specific Quest Guide. Run explicitly with a ticket reference.
disable-model-invocation: true
---

# Quest

Read [the Journal contract](../_shared/journal.md) and [lifecycle](../_shared/lifecycle.md). A `/quest` invocation authorizes work on one ticket only.

## 1. Enter the Quest

Resolve the supplied ticket reference through the configured Journal. Read the whole ticket, its Adventure when present, dependencies, linked outcomes, and discussion. Inspect the working tree before changing it.

Stop with a clear reason when the ticket is missing, already under review, or blocked by an unresolved dependency. Ask focused questions when its outcome cannot be determined in a fresh session.

Mark the Quest active only when it is executable.

## 2. Choose the Quest Guide

Dispatch from the ticket's `Type`:

- `research` → `research-quest`
- `prototype` → `prototype-quest`
- `decision` → `decision-quest`
- `architecture` → `architecture-quest`
- `task` → `task-quest`
- `fetch` → `fetch-quest`

A missing or ambiguous type is a ticket defect: ask the user to choose it and update the ticket before work.

## 3. Guard scope

Execute the selected guide against the ticket's Outcome and Constraints. Record useful discoveries in the ticket.

When success requires new work outside the accepted graph, stop the current Quest at a safe point, post the discovery, and invoke `/adventure <Adventure reference>` to propose an amendment. The Quest creates no new tickets.

## 4. Hand off

For an application-changing Task, post a work summary, mark it `awaiting-proof`, and tell the user to invoke `/prove <Quest reference>`. If the project has no `/prove`, direct them to `/maintain-prover <Quest reference>` first.

For every other Quest, post its outcome and mark it `outcome-ready`.

Leave the ticket open. Show what the user should review and stop without starting another Quest.
