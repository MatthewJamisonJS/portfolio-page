#!/usr/bin/env bash
# Audit finding C2: OG/Twitter title + description must read from
# data/{lang}/banner.yml, not hardcoded English legacy copy.
# Also strips the legacy duplicate Person JSON-LD that lived in baseof.html
# (jobTitle "Full-Stack Developer", description "specializing in Rails,
# Python, and AI Tooling") which conflicted with the @graph Person.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 1 Gherkin + decision §0 of source plan.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-og-build >/dev/null
FAIL=0

# Per-locale expected fragments. Source: data/{en,es,ja,fr,de}/banner.yml.
declare -a CHECKS=(
  "en|index.html|en_US|Built by a Full-Stack engineer in St. Louis"
  "es|es/index.html|es_ES|"
  "ja|ja/index.html|ja_JP|"
  "fr|fr/index.html|fr_FR|"
  "de|de/index.html|de_DE|"
)

for row in "${CHECKS[@]}"; do
  IFS='|' read -r LOC FILE LOCALE TITLE_FRAGMENT <<< "$row"
  HTML=/tmp/aeo-og-build/$FILE
  if [[ ! -f "$HTML" ]]; then
    echo "FAIL — $FILE missing"
    FAIL=1
    continue
  fi

  # 1. og:locale must match per-locale value
  if ! grep -qE "<meta[^>]*property=\"og:locale\"[^>]*content=\"$LOCALE\"" "$HTML" \
     && ! grep -qE "<meta property=og:locale content=$LOCALE" "$HTML"; then
    echo "FAIL [$LOC] og:locale != $LOCALE in $FILE"
    grep -o "og:locale[^>]*" "$HTML" | head -1
    FAIL=1
  fi

  # 2. og:title and twitter:title must NOT contain legacy hardcoded copy
  if grep -q "Results-Driven Full-Stack Developer" "$HTML"; then
    echo "FAIL [$LOC] legacy 'Results-Driven Full-Stack Developer' still in $FILE"
    FAIL=1
  fi
  if grep -qE "Rails, Python, Hugo, AI[^A-Z]" "$HTML"; then
    echo "FAIL [$LOC] legacy 'Rails, Python, Hugo, AI' still in $FILE"
    FAIL=1
  fi

  # 3. en home page: og:title should contain a fragment from banner.yml.title
  if [[ -n "$TITLE_FRAGMENT" ]]; then
    if ! grep -qF "$TITLE_FRAGMENT" "$HTML"; then
      echo "FAIL [$LOC] og:title does not contain banner.yml fragment '$TITLE_FRAGMENT' in $FILE"
      FAIL=1
    fi
  fi

  # 4. No legacy duplicate Person JSON-LD with jobTitle "Full-Stack Developer"
  #    (the @graph in head.html is the one source of truth).
  if grep -qE '"jobTitle":\s*"Full-Stack Developer"[^&]' "$HTML"; then
    echo "FAIL [$LOC] legacy Person JSON-LD with jobTitle 'Full-Stack Developer' in $FILE (should be only AEO-positioned title in @graph)"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo ""
  echo "tests/metadata/01-og-from-banner.sh: FAIL"
  exit 1
fi
echo "tests/metadata/01-og-from-banner.sh: OK"
