#!/usr/bin/env bash
# Audit finding H9: copyright year auto-renders to current year via Hugo template,
# never hardcoded so 2027/2028/etc don't require an edit each January.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 1 Gherkin "Copyright year auto-renders".
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

CURRENT_YEAR=$(date +%Y)
PRIOR_YEAR=$((CURRENT_YEAR - 1))
FAIL=0

# 1. hugo.toml must NOT contain a literal hardcoded prior year inside a copyright line.
HARDCODED=$(grep -nE "copyright.*$PRIOR_YEAR" hugo.toml || true)
if [[ -n "$HARDCODED" ]]; then
  echo "FAIL — hugo.toml has hardcoded $PRIOR_YEAR in copyright lines:"
  echo "$HARDCODED"
  FAIL=1
fi

# 2. Build and verify rendered output has the CURRENT year, not prior year, in copyright.
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-year-build >/dev/null
RENDERED=$(grep -h "Copyright" /tmp/aeo-year-build/index.html /tmp/aeo-year-build/{es,ja,fr,de}/index.html 2>/dev/null || true)
if echo "$RENDERED" | grep -q "$PRIOR_YEAR"; then
  echo "FAIL — rendered output still contains $PRIOR_YEAR in copyright text:"
  echo "$RENDERED" | grep "$PRIOR_YEAR" | head -5
  FAIL=1
fi
if ! echo "$RENDERED" | grep -q "$CURRENT_YEAR"; then
  echo "FAIL — rendered output does not contain current year $CURRENT_YEAR in any copyright text"
  echo "Sample: $(echo "$RENDERED" | head -2)"
  FAIL=1
fi

if (( FAIL )); then
  echo ""
  echo "tests/content/02-no-hardcoded-year.sh: FAIL"
  exit 1
fi
echo "tests/content/02-no-hardcoded-year.sh: OK (year = $CURRENT_YEAR)"
