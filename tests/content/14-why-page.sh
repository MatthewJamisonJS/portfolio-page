#!/usr/bin/env bash
# AEO-2 Task 1.2 + 2.1: /why page renders six stat cards with public sources.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
WHY_HTML="$BUILD/why/index.html"
if [[ ! -f "$WHY_HTML" ]]; then
  echo "FAIL — $WHY_HTML not built"; exit 1
fi

CLAIMS=(
  "45% of consumers"
  "93% of AI search sessions"
  "60% of citations in AI Overviews"
  "AI Overviews appear on"
  "25% of all search traffic"
  "Google Business Profile remains the #1"
)
for c in "${CLAIMS[@]}"; do
  if ! grep -q "$c" "$WHY_HTML"; then
    echo "FAIL — /why missing claim: $c"
    FAIL=1
  fi
done

SOURCES=("brightlocal.com" "gartner.com" "whitespark.ca")
for s in "${SOURCES[@]}"; do
  if ! grep -q "$s" "$WHY_HTML"; then
    echo "FAIL — /why missing source: $s"
    FAIL=1
  fi
done

if ! grep -q 'href="/different/"\|href=/different/' "$WHY_HTML"; then
  echo "FAIL — /why missing /different/ link"
  FAIL=1
fi

if (( FAIL )); then echo "tests/content/14-why-page.sh: FAIL"; exit 1; fi
echo "tests/content/14-why-page.sh: OK"
