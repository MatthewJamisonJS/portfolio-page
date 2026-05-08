#!/usr/bin/env bash
# Audit finding C6: zero Pokemon references anywhere in source or rendered
# output. Spec: AEO-TIGHTEN-SHIP §3 Phase 1 Gherkin "Pokemon imagery is gone".
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

PATTERN='[[:<:]](pokemon|mew|pikachu|celebi|jirachi|alakazam|chatot|decidueye|hoopa|meloetta|porygon|rotom|vaporeon|jolteon|electabuzz|magneton|gengar|charizard|dragonite|pidgeot|aerodactyl|articuno|moltres|zapdos|blastoise)[[:>:]]|battle-pokemon|pokemon-battle'
FAIL=0

# 1. No matches in source trees we own (ignore vendored theme).
HITS=$(grep -r -i -l -E "$PATTERN" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  --exclude-dir=public \
  --exclude-dir=resources \
  --exclude-dir=themes \
  --exclude="01-no-pokemon-anywhere.sh" \
  --exclude="vivid-wondering-harp.md" \
  --exclude="AEO-TIGHTEN-SHIP.md" \
  ./assets ./content ./data ./layouts ./static ./purgecss.config.js 2>/dev/null || true)

if [[ -n "$HITS" ]]; then
  echo "FAIL — Pokemon references found in source:"
  echo "$HITS"
  FAIL=1
fi

# 2. No matches in rendered output.
rm -rf /tmp/aeo-no-pokemon-build
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-no-pokemon-build >/dev/null
RENDERED_HITS=$(grep -r -i -l -E "$PATTERN" /tmp/aeo-no-pokemon-build 2>/dev/null || true)
if [[ -n "$RENDERED_HITS" ]]; then
  echo "FAIL — Pokemon references found in rendered output:"
  echo "$RENDERED_HITS"
  FAIL=1
fi

# 3. The static/images/pokemon/ directory should not exist.
if [[ -d static/images/pokemon ]]; then
  echo "FAIL — static/images/pokemon/ still exists ($(find static/images/pokemon -type f | wc -l | tr -d ' ') files)"
  FAIL=1
fi

# 4. The replacement brand mark must be present. Post-rebrand the favicon
#    SVG (Gateway Tech AEO keystone-arch triplet) is the canonical mark;
#    the prior static/images/brand/mj-mark.svg was retired with the AEO redesign.
if [[ ! -f static/images/favicon/favicon.svg ]]; then
  echo "FAIL — replacement brand mark static/images/favicon/favicon.svg missing"
  FAIL=1
fi

if (( FAIL )); then
  echo ""
  echo "tests/content/01-no-pokemon-anywhere.sh: FAIL"
  exit 1
fi
echo "tests/content/01-no-pokemon-anywhere.sh: OK (zero Pokemon refs in source or output)"
