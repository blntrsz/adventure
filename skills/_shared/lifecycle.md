# Adventure lifecycle

## Adventure states

`draft → proposed → accepted → active`

The user accepts scope before ticket creation. The user closes the Adventure after reviewing its Quests.

## Quest states

Application Quest:

`ready → active → awaiting-proof → proven → in-review → user-closed`

Non-application Quest:

`ready → active → outcome-ready → user-closed`

A blocked Quest becomes ready when every dependency is user-closed or the Journal records its outcome as accepted.

## Invariants

- Work starts only from an explicit `/adventure` or `/quest` invocation.
- Accepting an Adventure creates all known Quest tickets and stops before execution.
- One `/quest` invocation executes one Quest.
- New scope returns to `/adventure` for a proposed amendment and user acceptance.
- Skills post plans, outcomes, and evidence to the Journal rather than committing them to the repository.
- Skills leave ticket closure to the user.
