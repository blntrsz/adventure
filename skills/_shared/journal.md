# Journal contract

The Journal is the ticket tracker selected in `AGENTS.md` by `/adventure-setup`. It may be GitHub Issues, Linear, Jira, or ignored local Markdown under `.adventure/`.

## Configuration

Read the `## Adventure` section of the nearest applicable `AGENTS.md`. It records:

- Journal kind and project identity;
- labels or issue types for Adventures and Quest types;
- relationship conventions when the tracker has no native parent or dependency relation;
- local Journal path when applicable.

Credentials belong to the environment or tracker integration. Store no credentials in `AGENTS.md`.

If configuration is absent, stop with: `Run /adventure-setup before starting an Adventure or Quest.`

## Tool selection

Discover the available tracker tools and use those matching the configured Journal. For local Markdown, use file tools under the configured ignored directory. Preserve links or stable identifiers returned by the Journal.

## Common operations

The skills need these logical operations regardless of tracker:

- create and read a ticket;
- update its description;
- add a comment or equivalent timeline entry;
- relate a Quest to its Adventure;
- record dependencies between Quests;
- assign a workflow state or its configured label equivalent;
- list Quests belonging to an Adventure.

When a tracker lacks a native operation, encode it in the ticket description using the templates in [tickets.md](tickets.md).

## Human closure

Skills leave every ticket open. They may mark work `outcome-ready`, `awaiting-proof`, `proven`, or `in-review`; the user reviews and closes tickets.
