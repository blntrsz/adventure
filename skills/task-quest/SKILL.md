---
name: task-quest
description: Guide a Task Quest that changes a codebase while staying within its accepted outcome and Proof contract. Use when the Quest dispatcher selects a task ticket.
---

# Task Quest Guide

1. Read the ticket, accepted upstream outcomes, applicable project instructions, relevant code, and tests. Confirm the working tree state and preserve unrelated changes.
2. Translate the Outcome and Proof section into observable implementation targets. Ask only questions that block safe execution.
3. Implement the smallest coherent change that satisfies the targets and project conventions. Exercise behavior through existing tests while working; these checks do not replace `/prove`.
4. Update durable codebase documentation when the implementation changes facts that documentation owns. Keep plans and proof evidence in the Journal.
5. Inspect the diff for scope, accidental files, and unresolved failures. Record changed paths, checks run, and notable discoveries on the ticket.

When new scope is required, return to `/adventure` before implementing it. When the bounded work is ready, mark the Quest `awaiting-proof` and stop. The user invokes the project-specific `/prove` separately.
