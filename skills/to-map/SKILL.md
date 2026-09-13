---
name: to-map
description: Turn known code, architecture, or workflow facts into a focused visual map. Use when a user or another skill asks for Mermaid, pseudocode, a call tree, or a file-responsibility view.
---

# To map

Choose the smallest representation that answers the named question:

- pseudocode for logic;
- call tree for runtime nesting;
- shallow file tree for responsibility;
- Mermaid flowchart for control or dependency flow;
- Mermaid sequence diagram for interactions;
- Mermaid state diagram for lifecycle;
- Mermaid class diagram for stable structural relationships.

Read enough source material to verify every node and edge. Include paths or symbols where they help the reader return to the code. Mark inference and omit decorative detail.

Place the visual beside a short legend defining only ambiguous terms. Write it to a repository file only when explicitly requested; otherwise return it to the caller or attach it to the Journal outcome.
