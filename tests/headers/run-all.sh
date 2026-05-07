#!/usr/bin/env bash
# Phase 1+ headers tests. Owner: security-engineer subagent.
# Spec: AEO-TIGHTEN-SHIP §3 + §6.
# Files to populate:
#   01-csp-no-cdnjs.sh              — M1
#   02-x-frame-options-aligned.sh   — M2 (_headers vs netlify.toml)
#   03-hsts-shape.sh                — max-age >= 31536000, includeSubDomains, no preload yet
#   04-robots-ai-bots.sh            — H1, 12 verified AI bot user-agents per §A.2
#   05-llms-txt-shape.sh            — H2, H1 + blockquote + >=3 H2 sections
#   06-no-cdnjs.sh                  — M1 dup-suite
#   07-x-frame-aligned.sh           — M2 dup-suite
#   08-security-txt-shape.sh        — M8, RFC 9116
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
shopt -s nullglob
FILES=( "$ROOT"/[0-9][0-9]-*.sh "$ROOT"/[0-9][0-9]-*.spec.js )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no headers tests yet — populated as security-engineer runs Phase 1+)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  case "$f" in
    *.sh) bash "$f" ;;
    *.spec.js) node "$f" ;;
  esac
done
echo "  headers suite OK"
