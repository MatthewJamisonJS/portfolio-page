#!/usr/bin/env bash
# Audit Task 14: every blog list + post must emit hreflang alternates for all
# 5 locales + x-default. Data-driven over actual EN posts so the spec stays
# vacuous until Task 12/13 ship pillar content, then activates automatically.
#
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 14.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
rm -rf "$BUILD"
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0
LOCALES=("" es ja fr de)
EXPECTED_LANGS=(en es ja fr de x-default)

# Build a list of EN blog routes that exist (excluding RSS, JSON, etc).
shopt -s nullglob
EN_ROUTES=( "$BUILD"/blog/index.html "$BUILD"/blog/*/index.html )
ROUTES=()
for r in "${EN_ROUTES[@]}"; do
  [[ -f "$r" ]] && ROUTES+=( "${r#$BUILD/}" )
done

if (( ${#ROUTES[@]} == 0 )); then
  echo "tests/i18n/04-blog-hreflang.sh: OK (vacuous — no EN blog routes yet; activates after Task 12)"
  exit 0
fi

# For every EN route, every non-EN counterpart must exist + carry hreflang.
# `route` is `blog/index.html` for the list, `blog/<slug>/index.html` for posts.
# Strip the leading `blog/` and trailing `/index.html` (or bare `index.html`)
# to get the slug, then rebuild per-locale paths.
for route in "${ROUTES[@]}"; do
  rel="${route#blog/}"
  rel="${rel%/index.html}"
  rel="${rel%index.html}"
  rel="${rel%/}"
  for loc in "${LOCALES[@]}"; do
    if [[ -z "$loc" ]]; then
      file="$BUILD/$route"
    elif [[ -z "$rel" ]]; then
      file="$BUILD/$loc/blog/index.html"
    else
      file="$BUILD/$loc/blog/$rel/index.html"
    fi
    if [[ ! -f "$file" ]]; then
      echo "FAIL — [${loc:-en}] expected $file (mirroring /$route)"
      FAIL=1
      continue
    fi
    for lang in "${EXPECTED_LANGS[@]}"; do
      if ! grep -qE "rel=alternate hreflang=\"?$lang\"?" "$file"; then
        echo "FAIL [${loc:-en}/$rel] missing hreflang=$lang"
        FAIL=1
      fi
    done
  done
done

if (( FAIL )); then
  echo "tests/i18n/04-blog-hreflang.sh: FAIL"
  exit 1
fi
echo "tests/i18n/04-blog-hreflang.sh: OK (${#ROUTES[@]} EN route(s) × 5 locales)"
