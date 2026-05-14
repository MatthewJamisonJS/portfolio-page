#!/usr/bin/env bash
# AEO-2 amendment: page base is espresso, body resolves to var(--espresso),
# and the token is defined in the inlined critical CSS shipped to every page.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
for path in index why/index different/index pricing/index faq/index; do
  f="$BUILD/${path}.html"
  if [[ ! -f "$f" ]]; then echo "FAIL — $f not built"; FAIL=1; continue; fi
  if ! grep -q -- '--espresso' "$f"; then
    echo "FAIL — ${path} missing --espresso token"; FAIL=1
  fi
  if ! grep -qE 'body[^}]*background-color:[[:space:]]*var\(--espresso\)' "$f"; then
    echo "FAIL — ${path} body does not resolve to var(--espresso)"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/23-espresso-base.sh: FAIL"; exit 1; fi
echo "tests/content/23-espresso-base.sh: OK"
