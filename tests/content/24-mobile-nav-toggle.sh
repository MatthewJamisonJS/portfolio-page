#!/usr/bin/env bash
# AEO-2 §2a: hamburger markup gate — toggler present, .show removed, drawer bars rendered.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

PAGES=(
  "index.html"
  "why/index.html"
  "different/index.html"
  "pricing/index.html"
  "faq/index.html"
)

for page in "${PAGES[@]}"; do
  FILE="$BUILD/$page"

  if [[ ! -f "$FILE" ]]; then
    echo "FAIL — $FILE not built"; FAIL=1; continue
  fi

  if ! grep -q 'navbar-toggler' "$FILE"; then
    echo "FAIL — $page: missing navbar-toggler class"; FAIL=1
  fi

  if ! grep -q 'aria-controls' "$FILE"; then
    echo "FAIL — $page: missing aria-controls attribute"; FAIL=1
  fi

  if grep -q 'navbar-collapse show' "$FILE"; then
    echo "FAIL — $page: hardcoded .show on navbar-collapse (drawer always open)"; FAIL=1
  fi

  if ! grep -q 'drawer-bar' "$FILE"; then
    echo "FAIL — $page: missing drawer-bar spans"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/24-mobile-nav-toggle.sh: FAIL"; exit 1; fi
echo "tests/content/24-mobile-nav-toggle.sh: OK"
