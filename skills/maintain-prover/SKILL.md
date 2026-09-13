---
name: maintain-prover
description: Create or update an application's project-specific prove skill from its real verification paths. Use when a Task Quest needs proof and `/prove` is absent or stale.
---

# Maintain Prover

Create or update `.agents/skills/prove/SKILL.md` in the application repository. The generated skill is project-specific and committed as application tooling; proof reports remain in the Journal.

1. Read the triggering Quest and its `Proof` section when supplied. Inspect `AGENTS.md`, build manifests, test configuration, CI workflows, runtime setup, and existing verification scripts.
2. Exercise the actual application interfaces named by representative Proof contracts: API, browser, CLI, persistence, messaging, or other externally observable seams.
3. Identify the shortest reliable commands and setup needed to run those checks locally. Temporary characterization or integration tests are valid; instruct `/prove` to remove them before handoff unless retention is explicitly requested.
4. Write a user-invoked skill with this frontmatter:

```yaml
---
name: prove
description: Prove a Quest's application behavior using this project's verification paths.
disable-model-invocation: true
---
```

5. In the generated workflow require `/prove` to:
   - read the configured Journal and Quest Proof contract;
   - inspect the working tree and preserve unrelated changes;
   - select checks that demonstrate each required behavior through the application's real interfaces;
   - run the checks and capture commands, environment, and results;
   - clean up temporary proof code;
   - post pass or failure evidence to the Quest;
   - on failure, leave the Quest awaiting proof with actionable diagnostics;
   - on success, mark it proven, ensure the intended change is on a review branch, create or prepare a pull request linked without automatic-closing language, mark it in review, and stop;
   - leave ticket closure to the user.
6. Include concrete project commands and branching conditions rather than generic advice. Keep credentials out of the skill.
7. Validate the generated skill against the current triggering Quest. Report which Proof behaviors it can demonstrate and any unsupported behavior.

Updating the Prover changes verification machinery only; it neither proves nor closes the triggering Quest. The user invokes `/prove <Quest reference>` afterward.
