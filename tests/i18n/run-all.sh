#!/usr/bin/env bash
# i18n parity tests. Owner: i18n-warden subagent.
# Spec: AEO-TIGHTEN-SHIP §3 (i18n-warden role) + .claude/rules/references/i18n-structure.md.
# Files to populate:
#   parity-check.sh    — every key in data/en/X.yml exists in data/{es,ja,fr,de}/X.yml
#   01-hreflang-emit.sh — every locale page emits 6 hreflang lines (en/es/ja/fr/de + x-default)
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
shopt -s nullglob
FILES=( "$ROOT"/parity-check*.sh "$ROOT"/[0-9][0-9]-*.sh )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no i18n tests yet — populated as i18n-warden first runs Phase 1)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  bash "$f"
done
echo "  i18n suite OK"
