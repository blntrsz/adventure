---
name: adventure-setup
description: Configure a project's Journal and Adventure conventions. Run explicitly before using Adventure in a project.
disable-model-invocation: true
---

# Adventure setup

Configure Adventure without starting or planning work.

1. Inspect the project root, applicable `AGENTS.md`, `.gitignore`, and available ticket-tracker tools. Preserve existing instructions.
2. Ask the user to choose a Journal from the usable integrations: GitHub Issues, Linear, Jira, or local Markdown. Ask only for metadata that cannot be discovered, such as the target project and preferred labels.
3. Verify access by reading the target project or, for local Markdown, by confirming a writable project root. Configuration is ready when the selected Journal can be addressed unambiguously.
4. Add or update one `## Adventure` section in the root `AGENTS.md`:

```markdown
## Adventure

- Journal: <GitHub Issues | Linear | Jira | Local Markdown>
- Project: <owner/repository, project key, or local project name>
- Adventure type: <label or issue type>
- Quest type: <label or issue type>
- Quest labels: <research, prototype, decision, architecture, task, fetch mapping>
- Relationships: <native or description links>
- Local Journal: <path or Not applicable>
```

5. For Local Markdown, create `.adventure/adventures/` and `.adventure/quests/`, then ensure `.adventure/` is ignored by Git. For hosted trackers, write `Local Journal: Not applicable`.
6. Re-read the resulting configuration and report the selected Journal. Stop; setup never starts an Adventure.

Store authentication in the environment or integration. `AGENTS.md` contains non-secret configuration only.
