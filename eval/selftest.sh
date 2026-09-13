#!/usr/bin/env bash
# Self-test for the Layer-1 contract checks (ticket #7 proof support).
# Builds a synthetic broken corpus in a temp dir, copies the harness there,
# and verifies each rule fires on a targeted defect. Read-only for the repo.
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

pass=0; fail=0
expect_violation() { # rule_pattern description setup_fn
  local rule="$1" desc="$2" setup="$3"
  local dir="$TMP/$rule"
  mkdir -p "$dir/skills/demo-skill" "$dir/skills/_shared" "$dir/docs"
  cp "$REPO_ROOT"/eval/harness/types.ts "$dir/eval-harness-types.ts" 2>/dev/null || true
  mkdir -p "$dir/eval/harness" "$dir/eval/checks"
  cp "$REPO_ROOT"/eval/harness/types.ts "$dir/eval/harness/types.ts"
  cp "$REPO_ROOT"/eval/harness/template.ts "$dir/eval/harness/template.ts"
  cp "$REPO_ROOT"/eval/checks/*.ts "$dir/eval/checks/"
  cp "$REPO_ROOT"/eval/run.ts "$dir/eval/run.ts"
  cp "$REPO_ROOT"/package.json "$dir/package.json"
  # healthy baseline corpus
  cat > "$dir/skills/demo-skill/SKILL.md" <<'EOF'
---
name: demo-skill
description: A demo skill that passes all checks.
---

# Demo

Read [the Journal contract](../_shared/journal.md).
EOF
  cat > "$dir/skills/_shared/journal.md" <<'EOF'
# Journal contract

Uses the templates in [tickets.md](tickets.md).
EOF
  cat > "$dir/skills/_shared/tickets.md" <<'EOF'
# Ticket templates

## Adventure

```markdown
# Title

## Outcome
x

## Scope
x

## Out of scope
x

## Shared understanding
x

## Quest graph
```mermaid
flowchart LR
    Q1["Q1"] --> Q2["Q2"]
```

## Quests
- [ ] Q1
```

## Quest

```markdown
# Title

## Adventure
x

## Type
x

## Description
x

## Outcome
x

## Constraints
x

## Dependencies
x

## Proof
x

## Discoveries
x
```
EOF
  cat > "$dir/skills/_shared/lifecycle.md" <<'EOF'
# Lifecycle

## States

`draft → proposed → accepted → active`

`ready → active → outcome-ready → user-closed`

`ready → active → awaiting-proof → proven → in-review → user-closed`
EOF
  echo "# demo" > "$dir/README.md"
  echo "# demo" > "$dir/AGENTS.md"
  echo 'eval/output/' > "$dir/.gitignore"
  echo '{"name":"fixture","type":"module"}' > "$dir/package.json"
  "$setup" "$dir"
  # run only the check module under test against the fixture root
  set +e
  (cd "$dir" && bun eval/run.ts > out.log 2>&1)
  local rc=$?
  set -e
  if [ $rc -ne 0 ] && grep -q "$rule" "$dir/out.log"; then
    pass=$((pass+1)); echo "  ✓ $rule: $desc"
  else
    fail=$((fail+1)); echo "  ✗ $rule: $desc (rc=$rc)"; cat "$dir/out.log"
  fi
}

violate_frontmatter() { sed -i '' 's/name: demo-skill/name: Demo Skill/' "$1/skills/demo-skill/SKILL.md"; }
violate_links() { sed -i '' 's|../_shared/journal.md|../_shared/missing.md|' "$1/skills/demo-skill/SKILL.md"; }
violate_state() { printf "%s\n" "Mark the quest \`in-revision\` when done." >> "$1/skills/demo-skill/SKILL.md"; }
violate_template() { sed -i '' '/^## Proof$/,+1d' "$1/skills/_shared/tickets.md"; }
violate_command() { sed -i '' 's|Read \[the Journal contract\](../_shared/journal.md).|Invoke `/nonexistent-command` then continue.|' "$1/skills/demo-skill/SKILL.md"; }

echo "eval check self-tests:"
expect_violation "R1.name-format" "bad skill name fires frontmatter rule" violate_frontmatter
expect_violation "R2.link-resolves" "broken link fires link rule" violate_links
expect_violation "R3" "undefined state token fires consistency rule" violate_state
expect_violation "R4a" "template missing Proof section fires template rule" violate_template
expect_violation "R5.command-exists" "unknown /command fires commands rule" violate_command
echo "pass=$pass fail=$fail"
[ "$fail" -eq 0 ]
