---
name: setup-adventure
description: Configure this repo for Adventure PDLC. Issue tracker, lanes, docs layout, merge and ship gates. Run once per repo before other Adventure skills. Use for /setup-adventure, first-time setup, or changing tracker, owners, or gates.
disable-model-invocation: true
---

# Setup Adventure

Run once per repo. Re-run when lanes, tracker, or gates change.

## Steps

### 1. Read current state

Look for `.adventure/config.yaml`, then `.adventure/config.example.yaml`. Look for `docs/TEAM.md` (or `$docs_root/TEAM.md`). Record what already exists. Do not overwrite filled docs with empty templates.

### 2. Tracker

Ask which issue tracker: GitHub, Linear, or local markdown under `docs/tickets/`. Write `tracker` and `tracker_url` in config.

### 3. Docs root

Ask where durable docs live. Default `docs`. Copy missing templates from `templates/` into that root:

- `CONTEXT.md` `PRODUCT.md` `DESIGN.md` `TEAM.md`
- empty dirs: `adr/` `briefs/` `packets/` `contracts/` `rfc/` `specs/` `gates/` `lessons/`

### 4. Lanes

Ask for an owner string per lane: pm, design, eng, em, security, qa, partner. Empty is allowed only if the user says that lane does not exist here. Write `docs/TEAM.md` from the answers. Write the same names into config `lanes`.

### 5. Gates

Show default merge gates (`tests`, `review`, `blast-radius`) and ship gates (`flag`, `rollback`, `observability`, `slo`, `owner`). Ask which to add (compliance, data-class, load test) or drop. Write `gates` in config.

### 6. Triage labels

If the tracker supports labels, confirm or edit the five triage strings in config. If local markdown, use a `status:` field instead.

### 7. Write config

Write `.adventure/config.yaml`. If a local overlay should exist, copy `.adventure/config.example.yaml` notes into `.gitignore` for `*.local.yaml`. Do not put secrets in config.

### 8. Confirm

Print: tracker, docs root, lane owners, gate lists, next command (`/adventure-mode` or `/align`).

**Done when** config exists, TEAM.md has owners or explicit absences, and templates that were missing are copied.
