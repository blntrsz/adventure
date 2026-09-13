---
name: code-review
description: Two-axis review of a diff since a fixed point: standards and spec fidelity. Use when reviewing implementation inside build or when a focused code-only review is requested.
---

# Code review

## Steps

1. Fix the comparison point.
2. **Standards:** seams, naming vs CONTEXT.md, smallest reversible, tests that assert behaviour.
3. **Spec:** each given/when/then, including failure. Missing failure coverage is a finding.
4. Findings point at lines. No style nits that the repo does not enforce.
5. Report. Do not apply unless asked.

**Done when** both axes have a verdict.
