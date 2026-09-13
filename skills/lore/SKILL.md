---
name: lore
description: Investigate how an existing codebase works and why it has its current shape. Use when Adventure planning or Quest execution is blocked by architectural, historical, or domain uncertainty.
---

# Lore

Resolve one named codebase unknown before planning or execution continues.

1. State the unknown as a question. Identify what answer would unblock the caller.
2. Read applicable `AGENTS.md`, Project Sheet, Glossary, Codebook, maps, architecture docs, decision records, and relevant tickets.
3. Trace the relevant behavior through code, tests, configuration, and history. Separate observed facts from inference; cite file paths, symbols, commits, or tickets.
4. Reconcile conflicting terminology with the project's glossary. Surface contradictions rather than choosing silently.
5. Return:
   - the direct answer;
   - a compact map of relevant modules and interfaces;
   - constraints that future work must preserve;
   - open questions still unsupported by evidence.
6. Update an existing durable lore artifact only when project conventions provide one and the finding belongs there. Keep Adventure plans and Quest proof in the Journal.

Lore is complete when the caller's named unknown is answered with traceable evidence or explicitly reported as unknowable. Resume the calling Adventure or Quest; create no Quest tickets and perform no product work.
