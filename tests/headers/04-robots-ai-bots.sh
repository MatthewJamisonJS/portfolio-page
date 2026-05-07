#!/usr/bin/env bash
# Audit finding H1: robots.txt explicitly welcomes 12 verified AI crawlers
# (canonical list in AEO-TIGHTEN-SHIP §A.2). Each bot named with its own
# User-agent: line + Allow: / pair, plus the catch-all and the sitemap line.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

ROBOTS=static/robots.txt
if [[ ! -f "$ROBOTS" ]]; then
  echo "FAIL — $ROBOTS missing"
  exit 1
fi

FAIL=0
EXPECTED=( GPTBot ChatGPT-User OAI-SearchBot ClaudeBot anthropic-ai Claude-Web PerplexityBot Perplexity-User Google-Extended Bingbot Applebot Applebot-Extended )

for bot in "${EXPECTED[@]}"; do
  if ! grep -qE "^User-agent:[[:space:]]*${bot}\$" "$ROBOTS"; then
    echo "FAIL — missing User-agent: $bot"
    FAIL=1
  fi
done

# Each named bot must be followed by Allow: / within 3 lines
for bot in "${EXPECTED[@]}"; do
  context=$(grep -A 3 "^User-agent:[[:space:]]*${bot}\$" "$ROBOTS" || true)
  if ! echo "$context" | grep -qE "^Allow:[[:space:]]*/\$"; then
    echo "FAIL — $bot lacks Allow: / directive within 3 lines"
    FAIL=1
  fi
done

# Sitemap line preserved
if ! grep -qE "^Sitemap:[[:space:]]*https://matthewjamison.dev/sitemap.xml\$" "$ROBOTS"; then
  echo "FAIL — Sitemap: line missing or wrong"
  FAIL=1
fi

if (( FAIL )); then
  echo ""
  echo "tests/headers/04-robots-ai-bots.sh: FAIL"
  exit 1
fi
echo "tests/headers/04-robots-ai-bots.sh: OK (12 AI bot directives + sitemap)"
