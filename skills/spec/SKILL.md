---
name: spec
description: Synthesize the current conversation into a behaviour spec at named seams, with verification the prove skill can run. Use for /spec, /to-spec, write a spec, or when alignment is done and implementation must not invent behaviour.
disable-model-invocation: true
---

# Spec

No interview. Synthesize what is already known. If a load-bearing fork is still open, stop and name `/align`.

## Steps

1. Read CONTEXT.md, contracts, brief, critique, ADRs.
2. Write `docs/specs/` from `templates/spec.md`.
3. Seams: module name and the small interface each exposes. Behaviour as given/when/then including failure.
4. Verification section is the `/prove` plan: real surface, data, rollback signal.
5. Non-goals explicit. Risks named with owner.

**Done when** a new engineer could implement without asking about happy path or failure path, and prove has a real surface.
