#!/usr/bin/env bash
# Phase 1+ content tests. Owners: content-author + pokemon-eradicator subagents.
# Spec: AEO-TIGHTEN-SHIP §3 + §6.
# Files to populate:
#   01-no-pokemon-anywhere.sh         — C6, run by pokemon-eradicator first (sample in §3)
#   02-no-2025-copyright.sh           — H9, hugo.toml + rendered output
#   03-faq-citations-present.sh       — H3, every numeric claim has a sibling href
#   04-faq-citations.spec.js          — Phase 2, curl every link to confirm 200
#   05-blog-rss-min-3.sh              — Phase 2, RSS has >=3 dated items
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
shopt -s nullglob
FILES=( "$ROOT"/[0-9][0-9]-*.sh "$ROOT"/[0-9][0-9]-*.spec.js )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no content tests yet — populated as Phase 1 begins)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  case "$f" in
    *.sh) bash "$f" ;;
    *.spec.js) node "$f" ;;
  esac
done
echo "  content suite OK"
