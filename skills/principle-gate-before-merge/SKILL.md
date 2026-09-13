---
name: principle-gate-before-merge
description: Merge and ship only with filled evidence cells and named owners. Empty is a fail. Use when opening a PR, rolling out, or calling a change production-ready.
disable-model-invocation: true
---

# Gate before merge

Compile is not a gate. Self-report is not evidence. Ship gates are distinct from merge gates. A pass without a cell is a fail.
