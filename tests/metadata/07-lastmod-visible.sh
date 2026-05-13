#!/usr/bin/env bash
# Audit L6 / Task 17: About + blog single pages must render a visible
# <time datetime="YYYY-MM-DD"> element carrying the page's published or
# last-modified date. Crawlers and readers both use this signal to judge
# freshness.
#
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 17.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
rm -rf "$BUILD"
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

# Hugo's minifier drops quotes around attribute values where safe, so accept
# both `datetime="2026-05-12"` and `datetime=2026-05-12`.
DATE_RE='<time datetime=("?[0-9]{4}-[0-9]{2}-[0-9]{2}"?)'

check_lastmod() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "FAIL — $file missing"
    FAIL=1
    return
  fi
  if ! grep -qE "$DATE_RE" "$file"; then
    echo "FAIL — $file missing <time datetime=YYYY-MM-DD> element"
    FAIL=1
  fi
}

# About page in every locale.
for L in "" "es/" "ja/" "fr/" "de/"; do
  check_lastmod "$BUILD/${L}about/index.html"
done

# Blog singles in every locale (vacuous until Task 12/13 ship posts).
shopt -s nullglob
for L in "" "es/" "ja/" "fr/" "de/"; do
  for p in "$BUILD"/${L}blog/*/index.html; do
    [[ -f "$p" ]] || continue
    [[ "$p" == "$BUILD/${L}blog/index.html" ]] && continue
    check_lastmod "$p"
  done
done

if (( FAIL )); then
  echo "tests/metadata/07-lastmod-visible.sh: FAIL"
  exit 1
fi
echo "tests/metadata/07-lastmod-visible.sh: OK"
