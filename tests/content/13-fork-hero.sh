#!/usr/bin/env bash
# AEO-2 Task 1.1: hero question + two CTAs present in built homepage.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

HOME_HTML="$BUILD/index.html"
if [[ ! -f "$HOME_HTML" ]]; then
  echo "FAIL — $HOME_HTML not built"; exit 1
fi

REQUIRED=(
  "will you show up"
  "Why this matters now"
  "What Gateway Tech AEO does"
)
for needle in "${REQUIRED[@]}"; do
  if ! grep -q "$needle" "$HOME_HTML"; then
    echo "FAIL — homepage missing: $needle"
    FAIL=1
  fi
done

BANNED=(
  "Built by a Full-Stack engineer"
  "Helping local businesses get cited"
)
for banned in "${BANNED[@]}"; do
  if grep -q "$banned" "$HOME_HTML"; then
    echo "FAIL — homepage still contains deprecated copy: $banned"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/13-fork-hero.sh: FAIL"; exit 1
fi
echo "tests/content/13-fork-hero.sh: OK"
