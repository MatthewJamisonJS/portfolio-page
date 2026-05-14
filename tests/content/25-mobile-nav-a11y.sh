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

# pa11y 9.x passes viewport via --config JSON (no --viewport.width flag).
PA11Y_CFG="$(mktemp /tmp/pa11y-mobile-XXXXXX.json)"
cat > "$PA11Y_CFG" <<'JSON'
{
  "standard": "WCAG2AA",
  "includeWarnings": true,
  "viewport": { "width": 360, "height": 740 }
}
JSON
trap 'rm -f "$PA11Y_CFG"' EXIT

FAIL=0
for route in / /why/ /different/ /pricing/ /faq/; do
  echo "  -> pa11y 360×740 http://127.0.0.1:1313${route}"
  if ! npx --yes pa11y --config "$PA11Y_CFG" \
      "http://127.0.0.1:1313${route}" 2>&1 | grep -v '^$'; then
    echo "FAIL — pa11y exited non-zero on ${route}"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/25-mobile-nav-a11y.sh: FAIL"; exit 1; fi
echo "tests/content/25-mobile-nav-a11y.sh: OK"
