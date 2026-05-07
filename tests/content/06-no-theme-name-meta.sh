#!/usr/bin/env bash
# Audit L1: hide vestigial `<meta name="theme-name">` tag.
#
# The meghna theme injected a `<meta name="theme-name" content="meghna-hugo">`
# tag in the override head template. It surfaces no AEO benefit, leaks the
# theme provenance to crawlers, and is purely vestigial. L1 calls for its
# removal; this test prevents reintroduction.
#
# Spec: AEO-TIGHTEN-SHIP §3 Phase 4 ("Audit L1: hide meta name=theme-name").
set -e
BUILD="${AEO_BUILD:-/tmp/aeo-test-build}"
HOMES=(
  "$BUILD/index.html"
  "$BUILD/es/index.html"
  "$BUILD/ja/index.html"
  "$BUILD/fr/index.html"
  "$BUILD/de/index.html"
)

failures=0
for f in "${HOMES[@]}"; do
  if [[ ! -f "$f" ]]; then
    echo "  FAIL: build artifact missing at $f"
    failures=$((failures + 1))
    continue
  fi
  if grep -qE 'name="?theme-name"?' "$f"; then
    echo "  FAIL: $f contains <meta name=theme-name>"
    failures=$((failures + 1))
  fi
done

if (( failures > 0 )); then
  echo "tests/content/06-no-theme-name-meta.sh: FAIL"
  exit 1
fi
echo "tests/content/06-no-theme-name-meta.sh: OK (theme-name meta absent across 5 locales)"
