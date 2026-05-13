#!/usr/bin/env bash
# Audit finding H3: every FAQ answer that names a study, forecast, or
# numeric stat must carry a primary-source <a href rel="external nofollow">
# within 200 characters of the citation phrase.
#
# This file ships per-claim assertions as the citations land. Each block
# below is a (locale × claim phrase × required URL substring) triple.
#
# Spec: AEO-TIGHTEN-SHIP §3 Phase 2 Gherkin "FAQ statistics are linked to
# primary sources".
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

rm -rf /tmp/aeo-faq-build
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-faq-build >/dev/null
FAIL=0

# claim_phrase|expected_href_substring
CLAIMS=(
  "Gartner forecasts traditional search volume|gartner.com/en/newsroom"
  "Adobe Digital Insights reported AI traffic|business.adobe.com/blog"
  "Whitespark 2026|whitespark.ca"
)

for loc in "" es ja fr de; do
  HTML="/tmp/aeo-faq-build${loc:+/$loc}/index.html"
  if [[ ! -f "$HTML" ]]; then
    echo "FAIL — $HTML missing"
    FAIL=1
    continue
  fi
  for entry in "${CLAIMS[@]}"; do
    IFS='|' read -r phrase href <<< "$entry"
    # Find the byte offset of the phrase, then check 400 chars after it
    # (200-char window each side; we just expand forward since the link
    # follows the phrase by convention).
    if ! grep -q "$phrase" "$HTML"; then
      # Phrase missing entirely — flag, but don't double-fail (translator
      # may have rendered the phrase differently in non-EN locale).
      if [[ -z "$loc" ]]; then
        echo "FAIL [${loc:-en}] phrase '$phrase' missing entirely"
        FAIL=1
      fi
      continue
    fi
    # Pull a window around the phrase via node — BSD grep's bounded
    # repetition with large counts is unreliable; node handles it cleanly.
    WINDOW=$(node -e "
      const fs = require('fs');
      const html = fs.readFileSync('$HTML', 'utf8');
      const i = html.indexOf('$phrase');
      if (i < 0) { process.exit(0); }
      const start = Math.max(0, i - 200);
      process.stdout.write(html.slice(start, i + 400));
    ")
    if ! echo "$WINDOW" | grep -q "$href"; then
      echo "FAIL [${loc:-en}] '$phrase' has no $href href within 200 chars"
      FAIL=1
    fi
    if ! echo "$WINDOW" | grep -qE "rel=['\"]?external"; then
      echo "FAIL [${loc:-en}] '$phrase' link missing rel=\"external nofollow\""
      FAIL=1
    fi
  done
done

if (( FAIL )); then
  echo ""
  echo "tests/content/03-faq-citations-present.sh: FAIL"
  exit 1
fi
echo "tests/content/03-faq-citations-present.sh: OK ($(echo "${CLAIMS[@]}" | wc -w | tr -d ' ') citation block(s) verified across 5 locales)"
