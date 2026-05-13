#!/usr/bin/env bash
# Audit M12: static/llms.txt must carry a `## Optional` section per the
# llmstxt.org canonical proposal (Jeremy Howard, Sept 2024 — no formal
# version number; the proposal page IS the spec).
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 8.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
FILE="$REPO/static/llms.txt"

if [[ ! -f "$FILE" ]]; then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — $FILE missing"
  exit 1
fi

if ! grep -q "^## Optional" "$FILE"; then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — '## Optional' section missing"
  echo "  llmstxt.org canonical spec: https://llmstxt.org/"
  exit 1
fi

# Optional should appear AFTER at least one primary section.
OPT_LINE=$(grep -n "^## Optional" "$FILE" | head -1 | cut -d: -f1)
FIRST_H2=$(grep -n "^## " "$FILE" | head -1 | cut -d: -f1)
if (( OPT_LINE == FIRST_H2 )); then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — Optional is the only H2 section"
  exit 1
fi

# Should carry at least 2 link entries.
LINK_COUNT=$(awk '/^## Optional/{flag=1; next} /^## /{flag=0} flag && /^-/' "$FILE" | wc -l | tr -d ' ')
if (( LINK_COUNT < 2 )); then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — Optional section has $LINK_COUNT links (expected >=2)"
  exit 1
fi

echo "tests/content/04-llms-txt-optional.sh: OK (Optional section present with $LINK_COUNT links)"
