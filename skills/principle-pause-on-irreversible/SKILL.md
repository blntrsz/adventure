---
name: principle-pause-on-irreversible
description: Stop before force-push, prod data mutation, customer or partner messages, hard cutover, or accepting a contract for another team. Use when an action cannot be undone cleanly.
disable-model-invocation: true
---

# Pause on irreversible

Reversible work proceeds. Irreversible work waits for the owning lane. State the action and the owner. Do not hide a cutover inside a "deploy".
