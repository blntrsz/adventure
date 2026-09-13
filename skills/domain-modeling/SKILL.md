---
name: domain-modeling
description: Sharpen ubiquitous language. Challenge terms against CONTEXT.md, stress-test with edge scenarios, update the glossary and ADRs. Use when naming is sloppy, tickets drift, or align is running.
---

# Domain modeling

## Steps

1. Collect candidate terms from the conversation, spec, and code names.
2. For each term: one meaning, one row in CONTEXT.md. Collapse synonyms. Split overloaded words.
3. Stress-test with an edge scenario. If the term breaks, rename or split.
4. Write invariants and seams. Seams are interfaces, not file paths.
5. ADR only when a naming or model choice will be re-litigated. Otherwise the glossary row is enough.

**Done when** the current work can be restated using only CONTEXT terms plus proper nouns.
