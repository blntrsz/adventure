---
name: to-quests
description: Materialize an explicitly accepted Adventure plan as Journal tickets. Use when the Adventure skill has user acceptance or when retrying partial ticket creation.
---

# To quests

Read [the Journal contract](../_shared/journal.md), [ticket templates](../_shared/tickets.md), and [lifecycle](../_shared/lifecycle.md).

Require an accepted Adventure plan containing its outcome, scope, Quest definitions, and dependency graph. If acceptance is absent or ambiguous, return to `/adventure` without writing tickets.

1. Search the configured Journal for tickets already carrying the Adventure's identity or stable references. Build a materialization table of planned Quest to existing ticket, if any.
2. Create or update the parent Adventure ticket from the accepted plan.
3. Create every missing Quest from the accepted definitions. Preserve existing ticket discussion when retrying.
4. Add parent and dependency relationships using native Journal features or explicit description links.
5. Mark dependency-free Quests ready and dependent Quests blocked using configured workflow conventions.
6. Update the Adventure's Quest checklist and Mermaid graph with stable ticket references.
7. Re-read every created or reused ticket. Materialization passes when counts match the accepted plan and every Quest has a type, outcome, parent, dependencies, and Proof section.

Return the Adventure reference, all Quest references, and ready Quests. Leave every ticket open and execute none of them.
