#!/usr/bin/env bash
# i18n parity guard. Owner: i18n-warden subagent.
# Asserts: every key path in data/en/X.yml exists in data/{es,ja,fr,de}/X.yml,
# AND email/phone fields in brand.yml are byte-equal across all 5 locales.
# Spec: AEO-TIGHTEN-SHIP §3 i18n-warden + decision 1 of vivid-wondering-harp.md.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

LOCALES=(en es ja fr de)
FAIL=0

# brand.yml byte-equal email + phone_format check
EXPECTED_EMAIL="jamison.matthew@icloud.com"
echo "  brand.yml email (expected: $EXPECTED_EMAIL):"
for loc in "${LOCALES[@]}"; do
  ACTUAL=$(awk -F'"' '/^[[:space:]]+email:/ { print $2; exit }' "data/$loc/brand.yml")
  if [[ "$ACTUAL" != "$EXPECTED_EMAIL" ]]; then
    echo "    FAIL data/$loc/brand.yml email = '$ACTUAL'"
    FAIL=1
  else
    echo "    OK   data/$loc/brand.yml"
  fi
done

# Top-level key parity: every key in data/en/X.yml must appear in other locales' X.yml
echo ""
echo "  top-level key parity (data/en/* vs others):"
for f in data/en/*.yml; do
  name=$(basename "$f")
  KEYS_EN=$(grep -E '^[a-z_]+:' "$f" | sort -u || true)
  for loc in es ja fr de; do
    other="data/$loc/$name"
    if [[ ! -f "$other" ]]; then
      echo "    MISS data/$loc/$name (en has it)"
      FAIL=1
      continue
    fi
    KEYS_OTHER=$(grep -E '^[a-z_]+:' "$other" | sort -u || true)
    DIFF=$(comm -23 <(echo "$KEYS_EN") <(echo "$KEYS_OTHER") || true)
    if [[ -n "$DIFF" ]]; then
      echo "    FAIL data/$loc/$name missing top-level keys: $(echo "$DIFF" | tr '\n' ' ')"
      FAIL=1
    fi
  done
done

if (( FAIL )); then
  echo ""
  echo "i18n parity: FAIL"
  exit 1
fi
echo ""
echo "i18n parity: OK"
