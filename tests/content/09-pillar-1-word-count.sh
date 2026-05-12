#!/usr/bin/env bash
# Pillar Post 1 word-count + lead-paragraph + citation assertions.
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 12.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

POST="$REPO/content/english/blog/aeo-vs-seo-what-changed.md"
if [[ ! -f "$POST" ]]; then
  echo "tests/content/09-pillar-1-word-count.sh: FAIL — $POST missing"
  exit 1
fi

# Strip front matter, count words in body.
BODY=$(awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' "$POST")
WORDS=$(echo "$BODY" | wc -w | tr -d ' ')

if (( WORDS < 1200 || WORDS > 1800 )); then
  echo "tests/content/09-pillar-1-word-count.sh: FAIL — body is $WORDS words (target 1200-1800)"
  exit 1
fi

# Lead paragraph: first paragraph after the title H1 (or first non-empty paragraph
# in body). Must be 40-60 words.
LEAD=$(echo "$BODY" | awk 'BEGIN{p=""} /^$/{if(p!="")exit} /./{p=p" "$0} END{print p}')
LEAD_WORDS=$(echo "$LEAD" | wc -w | tr -d ' ')
if (( LEAD_WORDS < 40 || LEAD_WORDS > 60 )); then
  echo "tests/content/09-pillar-1-word-count.sh: FAIL — lead paragraph is $LEAD_WORDS words (target 40-60)"
  echo "Lead: $LEAD"
  exit 1
fi

# Required citations (any URL on these hosts must appear at least once each).
REQUIRED=(
  "gartner.com"
  "adobe.com"
  "schema.org"
  "developers.google.com/search"
  "platform.openai.com/docs/bots"
  "docs.anthropic.com"
)
FAIL=0
for host in "${REQUIRED[@]}"; do
  if ! grep -q "$host" "$POST"; then
    echo "FAIL — missing required citation host: $host"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/09-pillar-1-word-count.sh: FAIL"
  exit 1
fi
echo "tests/content/09-pillar-1-word-count.sh: OK (body $WORDS words; lead $LEAD_WORDS words; all citations present)"
