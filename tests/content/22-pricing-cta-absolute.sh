#!/usr/bin/env bash
# AEO-2 amendment: every pricing tier cta_link must be absolute (/?service=…#contact)
# so the buttons reach the homepage intake from any locale-prefixed /pricing/ route.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

FAIL=0
for f in data/en/pricing.yml data/es/pricing.yml data/ja/pricing.yml data/fr/pricing.yml data/de/pricing.yml; do
  while IFS= read -r line; do
    if [[ "$line" == *'cta_link: "?service'* ]]; then
      echo "FAIL — $f: $line (relative, should start with /)"; FAIL=1
    fi
  done < "$REPO/$f"
done

for f in data/en/banner.yml data/es/banner.yml data/ja/banner.yml data/fr/banner.yml data/de/banner.yml; do
  while IFS= read -r line; do
    if [[ "$line" == *'link: "?service'* ]]; then
      echo "FAIL — $f: $line (relative, should start with /)"; FAIL=1
    fi
  done < "$REPO/$f"
done

if (( FAIL )); then echo "tests/content/22-pricing-cta-absolute.sh: FAIL"; exit 1; fi
echo "tests/content/22-pricing-cta-absolute.sh: OK"
