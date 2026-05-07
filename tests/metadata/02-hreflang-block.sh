#!/usr/bin/env bash
# Audit finding C3: every locale page must emit hreflang alternates for all
# 5 locales plus an x-default — exactly 6 <link rel="alternate" hreflang=...>
# lines per page. Sitemap should also carry xhtml:link alternates.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 1 Gherkin "hreflang block is emitted".
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-hreflang-build >/dev/null
FAIL=0

for loc in "" es ja fr de; do
  url="/tmp/aeo-hreflang-build${loc:+/$loc}/index.html"
  if [[ ! -f "$url" ]]; then
    echo "FAIL — $url missing"
    FAIL=1
    continue
  fi
  COUNT=$(grep -oE 'rel=alternate hreflang="?[a-z-]+"?' "$url" | sort -u | wc -l | tr -d ' ')
  if (( COUNT != 6 )); then
    echo "FAIL [${loc:-en}] hreflang count = $COUNT (expected 6)"
    grep -oE 'rel=alternate hreflang="?[a-z-]+"?' "$url" | sort -u
    FAIL=1
  fi
  for lang in en es ja fr de x-default; do
    if ! grep -qE "rel=alternate hreflang=\"?$lang\"?" "$url"; then
      echo "FAIL [${loc:-en}] missing hreflang=$lang"
      FAIL=1
    fi
  done
done

# The root sitemap.xml is a sitemapindex pointing to per-locale sitemaps;
# the xhtml:link alternates live inside each per-locale urlset. Each per-
# locale sitemap should have at least 6 xhtml:link entries (one per
# translated page * 6 hreflang values would be many; the home page alone
# gives us 6).
for loc in en es ja fr de; do
  SITEMAP=/tmp/aeo-hreflang-build/$loc/sitemap.xml
  if [[ ! -f "$SITEMAP" ]]; then
    echo "FAIL — $loc/sitemap.xml missing"
    FAIL=1
    continue
  fi
  XHTML_COUNT=$(grep -o "xhtml:link" "$SITEMAP" 2>/dev/null | wc -l | tr -d ' ')
  XHTML_COUNT=${XHTML_COUNT:-0}
  if (( XHTML_COUNT < 6 )); then
    echo "FAIL — $loc/sitemap.xml has only $XHTML_COUNT xhtml:link alternates (expected >=6 for translated home + others)"
    FAIL=1
  fi
  if grep -qE '<loc/>|<loc></loc>' "$SITEMAP"; then
    echo "FAIL — $loc/sitemap.xml emits empty <loc/> for hidden pages"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo ""
  echo "tests/metadata/02-hreflang-block.sh: FAIL"
  exit 1
fi
echo "tests/metadata/02-hreflang-block.sh: OK"
