#!/usr/bin/env bash
# AEO-2 Task 2.4: FAQPage JSON-LD lives ONLY on /faq/, not on other pages.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

FAQ_HTML="$BUILD/faq/index.html"
if [[ ! -f "$FAQ_HTML" ]]; then echo "FAIL — $FAQ_HTML not built"; exit 1; fi
if ! grep -qE '"@type":\s*"FAQPage"' "$FAQ_HTML"; then
  echo "FAIL — /faq missing FAQPage schema"
  FAIL=1
fi

for path in index why/index different/index pricing/index; do
  f="$BUILD/$path.html"
  if [[ -f "$f" ]] && grep -qE '"@type":\s*"FAQPage"' "$f"; then
    echo "FAIL — $path leaks FAQPage schema"; FAIL=1
  fi
done

QS=(
  "What is AEO"
  "robots.txt and schema markup"
  "Is AI search really replacing Google"
  "How much does AEO cost"
  "How long until I see results"
  "Why are your prices so much lower"
  "Can you guarantee a #1 ranking"
  "What if I already have an SEO person"
  "What if I don't even have a website"
  "Google Business Profile"
  "What if I want to stop"
  "Can I do this myself"
)
for q in "${QS[@]}"; do
  if ! grep -q "$q" "$FAQ_HTML"; then
    echo "FAIL — /faq missing question: $q"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/17-faq-page-scoped.sh: FAIL"; exit 1; fi
echo "tests/content/17-faq-page-scoped.sh: OK"
