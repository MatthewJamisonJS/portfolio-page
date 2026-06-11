#!/usr/bin/env bash
# /pricing renders the service catalog (diagnostic, programs, retainers, flat packages) + footer.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
P_HTML="$BUILD/pricing/index.html"
if [[ ! -f "$P_HTML" ]]; then echo "FAIL — $P_HTML not built"; exit 1; fi

REQ=(
  "AEO / AI Visibility Diagnostic"
  "\$1,750"
  "Concierge"
  "\$8,500"
  "\$225"
  "Foundation"
)
for r in "${REQ[@]}"; do
  if ! grep -q "$r" "$P_HTML"; then
    echo "FAIL — /pricing missing: $r"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/16-pricing-page.sh: FAIL"; exit 1; fi
echo "tests/content/16-pricing-page.sh: OK"
