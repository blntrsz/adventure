---
name: prove
description: Verify the change on the real production-shaped path, not compile or proxy. Use for /prove, verify it works, dogfood, e2e check, or before calling a feature done.
disable-model-invocation: true
---

# Prove

## Steps

1. Name the consumer path from the spec. UI, API, job, or partner contract.
2. Exercise that path. Prefer a script a reviewer can rerun.
3. Check the full chain: input to stored state to output. Integrations include the other side or a faithful fake at the boundary, not a stub that cannot fail.
4. For UI, drive the real surface (browser or equivalent). A screenshot of the happy path is not enough if error and empty states were in the spec.
5. Record evidence in the gate file: command, result, what you observed. Label measured vs inferred.

**Done when** the spec's verification section has a measured result, including at least one failure path if the spec named one.
