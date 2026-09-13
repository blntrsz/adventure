# Adventure

Enterprise AI PDLC. Align the people, gate the change, compound the learning.

Inspired by [Matt Pocock skills](https://github.com/mattpocock/skills) (grill, shared language, small composable skills), [pstack](https://github.com/cursor/plugins/tree/main/pstack) (principles, playbooks, prove the real artifact), and [Compound Engineering](https://github.com/EveryInc/compound-engineering-plugin) (plan hard, review hard, write the lesson back). Adventure is the production loop for teams that include a PM, a designer, an EM, and other teams you cannot shout across a desk at.

## Install

This repo **is** the plugin (`skills/`, `.cursor-plugin/`).

Cursor: add the GitHub repo as a plugin, or vendor `skills/` into a product repo.

```text
npx skills add blntrsz/adventure
```

Then in the product repo run `/setup-adventure`.

## Default loop

```text
/adventure-mode
```

That router picks a playbook from the stage you are in. The long form is the same loop every time:

| Stage | Skill | Who |
| --- | --- | --- |
| Discover | `/brief` then `/align` | PM, then everyone the brief names |
| Shape | `/critique` `/spec` `/contract` `/rfc` | Design, eng, partner teams |
| Sequence | `/tickets` `/wayfind` `/staff` | Eng, EM |
| Build | `/build` (drives `/tdd` `/architect`) | Eng |
| Prove | `/prove` `/blast-radius` `/gate` | Eng, QA, EM |
| Review | `/review` | Eng, security |
| Ship | `/ship` | Eng, EM |
| Learn | `/compound` | Whoever felt the pain |

Collaboration is not a side quest. `/packet` moves work between lanes. `/handoff` moves work between agent sessions. `/sync` asks a human who is not in the room. `/wait-what` restates a message in the team's shared language.

## Why these three libraries were not enough

Matt's grill closes the gap between *you* and the agent. Enterprise work also has a gap between *roles*. A PM brief that never becomes a design critique that never becomes a spec is three people vibe-coding a roadmap.

pstack's principles keep code honest. Enterprise work also needs a **gate**: rollback, flag, SLO, named owner. "It compiles" is not a ship.

Compound's lesson file makes the next agent smarter. Adventure writes that lesson *and* a **contract** when the learning is an interface another team depends on.

## User-invoked vs model-invoked

**User-invoked** skills (`disable-model-invocation: true`) orchestrate. You type them. They may call model-invoked skills. They never call another user-invoked skill by name; they tell you which one to run next.

**Model-invoked** skills hold reusable discipline: grilling, TDD, diagnosis, architect, review axes. The agent reaches for them when the task fits.

**Principles** are steering words, not slash commands. Name them in chat ("smallest reversible", "gate before merge"). The mode skill already indexed them.

## Docs layout after setup

```text
.adventure/config.yaml
docs/CONTEXT.md
docs/PRODUCT.md
docs/DESIGN.md
docs/TEAM.md
docs/adr/
docs/briefs/
docs/packets/
docs/contracts/
docs/rfc/
docs/specs/
docs/gates/
docs/lessons/
```

`docs_root` in config relocates this tree.

## Guide

- [Install and setup](docs/guide/install.md)
- [PDLC](docs/guide/pdlc.md)
- [Collaboration](docs/guide/collaboration.md)
- [Principles](docs/guide/principles.md)
- [Authoring skills](docs/guide/authoring.md)
- [Catalog](docs/guide/catalog.md)
