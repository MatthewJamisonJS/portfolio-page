#!/usr/bin/env bash
# Audit Task 10: visible breadcrumb nav rendered on /about/ (and any /blog/*
# singles once they ship in Task 11). Pairs with the BreadcrumbList JSON-LD
# already inlined in head.html (Task 2 / audit H11).
#
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 10.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
rm -rf "$BUILD"
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

# Every locale's /about/ must carry the nav landmark.
for L in "" "es/" "ja/" "fr/" "de/"; do
  ABOUT="$BUILD/${L}about/index.html"
  if [[ ! -f "$ABOUT" ]]; then
    echo "FAIL — $ABOUT not built"
    FAIL=1
    continue
  fi
  # Hugo's minifier drops quotes around attribute values where safe, so test
  # accepts both `aria-label=Breadcrumb` and `aria-label="Breadcrumb"`.
  if ! grep -qE 'aria-label=("Breadcrumb"|Breadcrumb[> ])' "$ABOUT"; then
    echo "FAIL — /${L}about/ missing breadcrumb nav (aria-label=Breadcrumb)"
    FAIL=1
  fi
  if ! grep -qE '<a[^>]*href=("?/"?)[^>]*>(Home|Inicio|ホーム|Accueil|Startseite)</a>' "$ABOUT"; then
    echo "FAIL — /${L}about/ missing localized 'Home' link as first crumb"
    FAIL=1
  fi
  if ! grep -qE 'aria-current=("page"|page[> ])' "$ABOUT"; then
    echo "FAIL — /${L}about/ missing aria-current=page on current crumb"
    FAIL=1
  fi
done

# Home must NOT carry the breadcrumb (single-item trail to self is noise).
if grep -qE 'aria-label=("Breadcrumb"|Breadcrumb[> ])' "$BUILD/index.html"; then
  echo "FAIL — home page should not render breadcrumb nav"
  FAIL=1
fi

# Blog singles (if any ship later) also must carry the marker.
shopt -s nullglob
for p in "$BUILD"/blog/*/index.html "$BUILD"/*/blog/*/index.html; do
  [[ -f "$p" ]] || continue
  if ! grep -qE 'aria-label=("Breadcrumb"|Breadcrumb[> ])' "$p"; then
    echo "FAIL — $p missing breadcrumb nav"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/07-breadcrumb-ui.sh: FAIL"
  exit 1
fi
echo "tests/content/07-breadcrumb-ui.sh: OK"
