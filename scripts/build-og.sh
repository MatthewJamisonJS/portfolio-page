#!/usr/bin/env bash
# Build social-share Open Graph PNG card from SVG source.
#
# Source : assets/og/og-default.svg
# Output : static/images/og/og-default.png  (1200x630, served by Hugo)
#
# Requires: rsvg-convert  (brew install librsvg)
# Run from repo root.

set -euo pipefail

cd "$(dirname "$0")/.."

SRC="assets/og/og-default.svg"
OUT="static/images/og/og-default.png"

if ! command -v rsvg-convert >/dev/null 2>&1; then
  echo "rsvg-convert not found. Install with: brew install librsvg" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"
rsvg-convert -w 1200 -h 630 -o "$OUT" "$SRC"

echo "OG card built: $OUT"
ls -la "$OUT"
