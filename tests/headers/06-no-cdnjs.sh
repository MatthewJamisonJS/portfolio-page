#!/usr/bin/env bash
# Audit M1: CSP no longer references unused cdnjs.cloudflare.com.
#
# js-cookie was the only consumer (footer.html cookie banner partial), but the
# block is gated on site.Params.cookies.enable which is unset across hugo.toml
# and both env configs. The banner never renders, so the cdnjs allowance was
# dead weight in the CSP.
#
# Spec: AEO-TIGHTEN-SHIP §3 Phase 3 Gherkin "CSP no longer references unused
# cdnjs.cloudflare.com".
set -e
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

failures=0
for f in static/_headers netlify.toml DEPLOYMENT.md; do
  if grep -q 'cdnjs.cloudflare.com' "$REPO/$f" 2>/dev/null; then
    echo "  FAIL: $f still references cdnjs.cloudflare.com"
    failures=$((failures + 1))
  fi
done

if (( failures > 0 )); then
  echo "tests/headers/06-no-cdnjs.sh: FAIL ($failures file(s))"
  exit 1
fi
echo "tests/headers/06-no-cdnjs.sh: OK (cdnjs absent from _headers, netlify.toml, DEPLOYMENT.md)"
