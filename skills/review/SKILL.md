---
name: review
description: Two-axis plus enterprise review of the diff: standards, spec fidelity, security, ops, contracts. Report only unless the user asks to apply. Use for /review, code review, pre-merge review, or security-minded review.
disable-model-invocation: true
---

# Review

## Steps

1. Fix the diff base (merge-base with the default branch, or a named commit).
2. Dispatch parallel reviewers (subagents) so axes do not pollute each other:
   - **Standards:** repo conventions, seams, subtract-first, named domain.
   - **Spec:** given/when/then from the originating spec or ticket, including failure.
   - **Enterprise:** authz, data class, secrets, observability, rollback, contract compatibility.
3. Each finding: severity, axis, evidence in the diff, what would make it pass.
4. Report only. Apply only if the user asks.
5. If merge is requested after, name `/gate`.

**Done when** every axis has a verdict and findings point at evidence.
