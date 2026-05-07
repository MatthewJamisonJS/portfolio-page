#!/usr/bin/env bash
# Phase 2 booking tests. Owner: schema-architect (offer) + security-engineer (CSP if embedded).
# Spec: AEO-TIGHTEN-SHIP §3 Phase 2.
# Files to populate:
#   01-cal-or-calendly-reachable.sh   — H6, booking URL responds 200
set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
shopt -s nullglob
FILES=( "$ROOT"/[0-9][0-9]-*.sh )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no booking tests yet — populated when Phase 2 booking flow ships)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  bash "$f"
done
echo "  booking suite OK"
