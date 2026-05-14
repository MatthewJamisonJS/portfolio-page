#!/usr/bin/env bash
# AEO-2 Task 3.2: no demo cards anywhere in built site.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

# No /demos/ directory in any locale's build output.
for prefix in "" "es/" "ja/" "fr/" "de/"; do
  if [[ -d "$BUILD/${prefix}demos" ]]; then
    echo "FAIL — $BUILD/${prefix}demos still exists"; FAIL=1
  fi
done

# No demo-card class markup anywhere.
if grep -rq 'demo-card\|portfolio-demos' "$BUILD"; then
  echo "FAIL — built site still contains demo-card or portfolio-demos markup"; FAIL=1
fi

# Source check: no /content/<locale>/demos/ directory remains either.
for dir in content/english/demos content/spanish/demos content/japanese/demos content/french/demos content/german/demos; do
  if [[ -d "$REPO/$dir" ]]; then
    echo "FAIL — $dir still exists in source"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/18-no-demos.sh: FAIL"; exit 1; fi
echo "tests/content/18-no-demos.sh: OK"
