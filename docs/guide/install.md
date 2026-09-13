# Install

1. Add the plugin (or vendor `skills/` into the repo).
2. Run `/setup-adventure`.
3. Fill `docs/TEAM.md` with real names. Empty lanes make packets lie.
4. Point `docs/PRODUCT.md` at the current job to be done.
5. Prefer `/adventure-mode` over collecting slash commands.

Setup writes `.adventure/config.yaml` from `.adventure/config.example.yaml`, copies templates under `docs_root`, and asks which tracker you use.

Re-run setup when lanes, gates, or tracker change.
