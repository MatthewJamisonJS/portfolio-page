#!/usr/bin/env bash
# Phase 1+ metadata tests. Owner: metadata-curator subagent.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 1 + §6.
# Files to populate:
#   01-og-twitter-shape.sh                 — OG/Twitter meta count + content per locale
#   02-hreflang-block.sh                   — 6 hreflang lines per locale
#   03-canonical-correctness.sh            — canonical URL matches Permalink
#   04-preload-references-real.spec.js     — Phase 3, M3
#   05-twitter-handle-consistency.sh       — Phase 3, M9
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
shopt -s nullglob
FILES=( "$ROOT"/[0-9][0-9]-*.sh "$ROOT"/[0-9][0-9]-*.spec.js )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no metadata tests yet — populated as metadata-curator runs Phase 1+)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  case "$f" in
    *.sh) bash "$f" ;;
    *.spec.js) node "$f" ;;
  esac
done
echo "  metadata suite OK"
