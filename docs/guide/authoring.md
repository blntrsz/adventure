# Authoring skills

When you add a skill to this library, read `/writing-for-agents` first.

Rules for Adventure skills:

- `name` matches the directory. Lowercase, hyphens.
- Description states **what** and **when**, with trigger words.
- Orchestrators are user-invoked (`disable-model-invocation: true`) plus `agents/openai.yaml` with `allow_implicit_invocation: false`.
- Discipline skills are model-invoked.
- Steps end on a checkable completion criterion.
- Disclose reference behind a pointer. Keep the SKILL.md as the steps.
- User-invoked skills do not invoke other user-invoked skills. They name the next slash command.
- Positive instructions. Name the target behaviour.
