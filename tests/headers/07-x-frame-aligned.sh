#!/usr/bin/env bash
# Audit M2: X-Frame-Options identical across deploy targets.
#
# static/_headers (Cloudflare Pages source of truth) and netlify.toml (backup
# deploy target) must agree on the value. Mismatch means the music-widget
# Bandcamp iframe self-embed works on one host and breaks on the other.
#
# Spec: AEO-TIGHTEN-SHIP §3 Phase 3 Gherkin "X-Frame-Options is identical
# across deploy targets".
set -e
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

# Cloudflare _headers — `  X-Frame-Options: VALUE` (space-indented inside path block)
cf_value=$(grep -E '^[[:space:]]*X-Frame-Options:' "$REPO/static/_headers" | awk '{print $2}' | tr -d '\r')

# Netlify TOML — `X-Frame-Options = "VALUE"`
netlify_value=$(grep -E '^[[:space:]]*X-Frame-Options[[:space:]]*=' "$REPO/netlify.toml" | sed -E 's/.*=[[:space:]]*"([^"]+)".*/\1/')

if [[ -z "$cf_value" || -z "$netlify_value" ]]; then
  echo "  FAIL: missing X-Frame-Options — _headers='$cf_value', netlify.toml='$netlify_value'"
  exit 1
fi

if [[ "$cf_value" != "$netlify_value" ]]; then
  echo "  FAIL: X-Frame-Options mismatch — _headers='$cf_value', netlify.toml='$netlify_value'"
  exit 1
fi

echo "tests/headers/07-x-frame-aligned.sh: OK ($cf_value)"
