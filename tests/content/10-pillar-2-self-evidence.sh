#!/usr/bin/env bash
# Pillar Post 2 self-evidence assertions: the code blocks in the post must
# include every User-agent: line from static/robots.txt verbatim.
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 13.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

POST="$REPO/content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md"
ROBOTS="$REPO/static/robots.txt"
LLMSTXT="$REPO/static/llms.txt"

if [[ ! -f "$POST" ]]; then
  echo "tests/content/10-pillar-2-self-evidence.sh: FAIL — post missing"
  exit 1
fi

# Body word count check.
BODY=$(awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' "$POST")
WORDS=$(echo "$BODY" | wc -w | tr -d ' ')
if (( WORDS < 1500 || WORDS > 2200 )); then
  echo "FAIL — body is $WORDS words (target 1500-2200)"
  exit 1
fi

# Every User-agent line in static/robots.txt must appear in the post.
FAIL=0
while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  if [[ "$line" =~ ^User-agent: ]]; then
    if ! grep -qF "$line" "$POST"; then
      echo "FAIL — post missing line from static/robots.txt: $line"
      FAIL=1
    fi
  fi
done < "$ROBOTS"

# H1 from static/llms.txt must appear in the post.
LLMS_H1=$(grep -m1 '^# ' "$LLMSTXT")
if ! grep -qF "$LLMS_H1" "$POST"; then
  echo "FAIL — post missing llms.txt H1 line: $LLMS_H1"
  FAIL=1
fi

# Required citations.
REQUIRED=(
  "platform.openai.com/docs/bots"
  "docs.anthropic.com"
  "docs.perplexity.ai/guides/bots"
  "developers.google.com/search/docs/crawling-indexing"
  "support.apple.com"
  "llmstxt.org"
)
for host in "${REQUIRED[@]}"; do
  if ! grep -q "$host" "$POST"; then
    echo "FAIL — missing required citation host: $host"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/10-pillar-2-self-evidence.sh: FAIL"
  exit 1
fi
echo "tests/content/10-pillar-2-self-evidence.sh: OK (body $WORDS words; robots.txt + llms.txt are self-consistent with live files)"
