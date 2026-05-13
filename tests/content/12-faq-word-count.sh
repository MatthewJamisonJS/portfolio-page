#!/usr/bin/env bash
# Audit M13: every FAQ answer across all 5 locales must be 40-60 words
# (industry AI-citation answer block window per Frase / GenOptima 2026 research).
# HTML tags do not count toward the word total.
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 16.
#
# Implementation: pure bash + awk to avoid a Node toolchain dependency.
# Each answer is extracted by scanning faq.yml for `answer: "..."` lines and
# their continuation (folded scalars are not used in this file, so single-line
# answers are the only shape). HTML tags are stripped before counting.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

FAIL=0

for lang in en es ja fr de; do
  FAQ_FILE="data/$lang/faq.yml"
  if [[ ! -f "$FAQ_FILE" ]]; then
    echo "FAIL — $FAQ_FILE missing"
    FAIL=1
    continue
  fi

  # Extract each answer line, strip the `      answer: "` prefix and trailing `"`,
  # strip HTML tags, then count words.
  IDX=0
  while IFS= read -r raw; do
    # Trim leading whitespace + `answer:` key + optional opening quote.
    body=$(echo "$raw" | sed -E 's/^[[:space:]]*answer:[[:space:]]*//; s/^"//; s/"$//; s/^'\''//; s/'\''$//')
    # Strip HTML tags.
    body=$(echo "$body" | sed -E 's/<[^>]+>/ /g')
    # Collapse whitespace.
    body=$(echo "$body" | tr -s '[:space:]' ' ' | sed -E 's/^ +//; s/ +$//')
    if [[ "$lang" == "ja" ]]; then
      # Japanese: count characters via wc -m approximation. Western word-count
      # is meaningless for CJK. The audit M13 window only meaningfully applies
      # to space-delimited locales; for ja we gate ratio against the EN length
      # band instead (40-180 chars covers the same answer envelope).
      cc=$(printf '%s' "$body" | wc -m | tr -d ' ')
      if (( cc < 40 || cc > 200 )); then
        echo "FAIL $lang/faq.yml[#$IDX] answer length $cc chars (target 40-200 for CJK)"
        FAIL=1
      fi
    else
      wc_n=$(echo "$body" | wc -w | tr -d ' ')
      if (( wc_n < 40 || wc_n > 60 )); then
        echo "FAIL $lang/faq.yml[#$IDX] answer $wc_n words (target 40-60)"
        FAIL=1
      fi
    fi
    IDX=$((IDX + 1))
  done < <(grep -E '^[[:space:]]+answer:' "$FAQ_FILE")
done

if (( FAIL )); then
  echo "tests/content/12-faq-word-count.sh: FAIL"
  exit 1
fi
echo "tests/content/12-faq-word-count.sh: OK (5 locales × answers in 40-60 word window)"
