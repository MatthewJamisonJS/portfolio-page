#!/usr/bin/env bash
# Audit L6 + content/05: About + blog post pages render the author-bio partial,
# which carries a visible byline + last-updated <time datetime>.
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 9.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

# About page must render the author-bio block.
ABOUT="$BUILD/about/index.html"
if [[ ! -f "$ABOUT" ]]; then
  echo "FAIL — $ABOUT missing"
  FAIL=1
else
  for marker in "author-bio" "Matthew Jamison" '<time datetime='; do
    if ! grep -q "$marker" "$ABOUT"; then
      echo "FAIL — about page missing marker: $marker"
      FAIL=1
    fi
  done
fi

# Blog single (if any) must also carry the marker. Vacuously pass if no posts.
shopt -s nullglob
POSTS=( "$BUILD"/blog/*/index.html )
if (( ${#POSTS[@]} == 0 )); then
  echo "  (no blog posts yet — vacuously OK for blog single)"
else
  for p in "${POSTS[@]}"; do
    [[ "$p" == "$BUILD/blog/index.html" ]] && continue
    if ! grep -q "author-bio" "$p"; then
      echo "FAIL — blog post missing author-bio: $p"
      FAIL=1
    fi
    if ! grep -q '<time datetime=' "$p"; then
      echo "FAIL — blog post missing <time datetime>: $p"
      FAIL=1
    fi
  done
fi

if (( FAIL )); then
  echo "tests/content/05-author-bio.sh: FAIL"
  exit 1
fi
echo "tests/content/05-author-bio.sh: OK"
