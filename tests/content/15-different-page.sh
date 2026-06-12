#!/usr/bin/env bash
# AEO-2 Task 1.3 + 2.2: /different renders audit scope + pillars + trust moves;
# no banned methodology terms.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
DIFF_HTML="$BUILD/different/index.html"
if [[ ! -f "$DIFF_HTML" ]]; then
  echo "FAIL — $DIFF_HTML not built"; exit 1
fi

REQ=(
  "three surfaces, not one"
  "Technical"
  "Authority"
  "Content"
  "what to fix, in what order"
  "You own everything we touch"
  "Fixed-scope engagements"
)
for r in "${REQ[@]}"; do
  if ! grep -q "$r" "$DIFF_HTML"; then
    echo "FAIL — /different missing required: $r"; FAIL=1
  fi
done

BANNED=(
  "LocalBusiness schema"
  "JSON-LD @graph"
  "GPTBot"
  "ClaudeBot"
  "PerplexityBot"
  "entity reconciliation"
  "atomic content architecture"
)
# Check the VISIBLE copy only: strip <script> blocks first. The JSON-LD @graph
# offer scopes legitimately name crawlers (GPTBot/PerplexityBot) as citable AEO
# detail; the ban targets methodology jargon leaking into the rendered /different
# prose, not the structured data.
VISIBLE=$(perl -0777 -pe 's/<script[^>]*>.*?<\/script>//gs' "$DIFF_HTML" | sed -E 's/<[^>]+>/ /g')
for b in "${BANNED[@]}"; do
  if grep -qF "$b" <<< "$VISIBLE"; then
    echo "FAIL — /different leaks methodology in visible copy: $b"; FAIL=1
  fi
done

if ! grep -q 'href="/pricing/"\|href=/pricing/' "$DIFF_HTML"; then
  echo "FAIL — /different missing /pricing/ link"; FAIL=1
fi

if (( FAIL )); then echo "tests/content/15-different-page.sh: FAIL"; exit 1; fi
echo "tests/content/15-different-page.sh: OK"
