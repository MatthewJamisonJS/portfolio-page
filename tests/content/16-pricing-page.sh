#!/usr/bin/env bash
# AEO-2 Task 2.3: /pricing renders three tiers + trust block.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
P_HTML="$BUILD/pricing/index.html"
if [[ ! -f "$P_HTML" ]]; then echo "FAIL — $P_HTML not built"; exit 1; fi

REQ=(
  "Audit"
  "Setup & Hand-off"
  "Done-For-You"
  "\$250"
  "\$700"
  "\$500"
  "5 St. Louis clients"
  "Month-to-month"
)
for r in "${REQ[@]}"; do
  if ! grep -q "$r" "$P_HTML"; then
    echo "FAIL — /pricing missing: $r"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/16-pricing-page.sh: FAIL"; exit 1; fi
echo "tests/content/16-pricing-page.sh: OK"
