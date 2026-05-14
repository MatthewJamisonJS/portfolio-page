#!/usr/bin/env bash
# AEO-2 §2a: Pa11y mobile viewport sweep — 360×740, WCAG2AA, zero serious violations.
# Gated: only runs when PA11Y=1. Requires hugo server running at http://127.0.0.1:1313/.
set -e
set -o pipefail
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

if [[ "${PA11Y:-0}" != "1" ]]; then
  echo "tests/content/25-mobile-nav-a11y.sh: skipped (PA11Y=1 to enable; needs hugo server)"
  exit 0
fi

FAIL=0
for route in / /why/ /different/ /pricing/ /faq/; do
  echo "  -> pa11y 360×740 http://127.0.0.1:1313${route}"
  if ! npx --yes pa11y \
      --viewport.width 360 \
      --viewport.height 740 \
      --standard WCAG2AA \
      --include-warnings \
      "http://127.0.0.1:1313${route}" 2>&1 | grep -v '^$'; then
    echo "FAIL — pa11y exited non-zero on ${route}"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/25-mobile-nav-a11y.sh: FAIL"; exit 1; fi
echo "tests/content/25-mobile-nav-a11y.sh: OK"
