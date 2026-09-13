---
name: explore
description: Explore a codebase and produce an evidence-backed map of its current architecture. Use when a user asks to map the repository or an Adventure needs an initial structural survey.
---

# Explore

Map what exists without proposing a redesign.

1. Read applicable project instructions, manifests, top-level documentation, and existing maps.
2. Inventory entry points, major directories, runtime processes, persistence, external integrations, and test suites.
3. Trace at least one representative path from an external interface through the implementation and back. Follow imports and runtime wiring rather than inferring architecture from folder names.
4. Identify modules, caller-visible interfaces, seams with multiple adapters, and ownership of durable state.
5. Produce a concise file tree and Mermaid diagram with path and symbol evidence. Mark inferred relationships explicitly.
6. Report areas not inspected and questions that require Lore.

Write a repository map only when the user or calling ticket requests one; otherwise return it in the conversation or Journal. Exploration is complete when every major runtime path is represented or explicitly listed as uninspected.
