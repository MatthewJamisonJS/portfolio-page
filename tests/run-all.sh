#!/usr/bin/env bash
# Top-level entry point — runs every BDD/TDD test for the AEO tighten-ship branch.
# Exits 0 only if every test passes.
#
# Usage:
#   bash tests/run-all.sh
#
# Spec: /Users/wwjd_._/Desktop/AEO/plans/AEO-TIGHTEN-SHIP.md §6
# Roadmap: /Users/wwjd_._/.claude/plans/vivid-wondering-harp.md
set -e

SCRIPT_DIR="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ROOT="$SCRIPT_DIR"
REPO="$( dirname -- "$SCRIPT_DIR" )"

echo "==> Building site for tests..."
cd "$REPO"
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
echo "    build OK"

run_suite() {
  local name="$1"
  local dir="$ROOT/$name"
  echo ""
  echo "==> tests/$name/"
  if [[ -x "$dir/run-all.sh" ]]; then
    bash "$dir/run-all.sh"
  else
    echo "  (skipped — $name suite not yet populated)"
  fi
}

run_suite schema
run_suite metadata
run_suite content
run_suite headers
run_suite i18n
run_suite booking

echo ""
echo "==> Lighthouse CI (gated; skipped unless LHCI=1 set)"
if [[ "${LHCI:-0}" == "1" ]]; then
  npx --yes @lhci/cli@latest autorun --config="$REPO/lighthouserc.json"
else
  echo "    (skipped — re-run with LHCI=1 bash tests/run-all.sh to include)"
fi

echo ""
echo "==> Pa11y / WCAG 2.2 AA (gated; skipped unless PA11Y=1 set)"
if [[ "${PA11Y:-0}" == "1" ]]; then
  npx --yes pa11y-ci --sitemap http://127.0.0.1:1313/sitemap.xml --threshold 0
else
  echo "    (skipped — re-run with PA11Y=1 to include; needs hugo server running)"
fi

echo ""
echo "==> ALL ENABLED TESTS PASSED"
