---
name: writing-for-agents
description: Write skills and agent docs with pointers, completion criteria, and progressive disclosure. Use when creating or editing SKILL.md, AGENTS.md, or any doc an agent reaches by a pointer.
---

# Writing for agents

A **context pointer** (skill description, AGENTS.md line) states what the material is and which branches should load it. Front-load the trigger. One trigger per branch.

**Context load** is always-on tokens. **Cognitive load** is the human remembering which skill to type. Spend cognitive load where human judgement matters.

Information hierarchy:

1. In-file steps
2. In-file reference
3. Disclosed reference behind a pointer

Every step ends on a checkable completion criterion. Demand drives thoroughness ("every modified model accounted for").

Positive instructions. Leading words beat restated paragraphs (`frontier`, `packet`, `gate`, `tracer`).

Single source of truth. Do not cache what the environment already shows (`--help`, config files).

User-invoked orchestrators do not call other user-invoked skills. They name the next slash command.

**Done when** a new agent can follow the doc without a second essay, and the description would fire on the intended branches only.
