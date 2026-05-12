#!/usr/bin/env bash
# Audit Task 11: blog list + single templates render correctly.
#
# Until Task 12 ships actual pillar posts, this test is mostly vacuous —
# the loop over single posts will be empty. The list page may also not
# materialize without an _index.md anchoring the section. What this guards:
#   - If any blog single ships, it must carry breadcrumb + the
#     blog-post wrapper + a byline link to /about/.
#   - If a /blog/index.html ships, it must carry blog-list class.
# Once Task 12 lands these become real gates.
#
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 11.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
rm -rf "$BUILD"
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0
shopt -s nullglob

# Blog list page (any locale).
LISTS=( "$BUILD"/blog/index.html "$BUILD"/*/blog/index.html )
for LIST in "${LISTS[@]}"; do
  [[ -f "$LIST" ]] || continue
  for marker in 'blog-list-section' 'blog-list-header'; do
    if ! grep -q "$marker" "$LIST"; then
      echo "FAIL — $LIST missing marker: $marker"
      FAIL=1
    fi
  done
done

# Blog single pages — only single posts, not the list index.
POSTS=( "$BUILD"/blog/*/index.html "$BUILD"/*/blog/*/index.html )
for p in "${POSTS[@]}"; do
  [[ -f "$p" ]] || continue
  # Skip the section index pages.
  [[ "$p" == */blog/index.html ]] && continue
  for marker in \
    'aria-label=("Breadcrumb"|Breadcrumb[> ])' \
    'class=("blog-post[^"]*"|blog-post)' \
    'itemtype=("https://schema.org/BlogPosting"|https://schema.org/BlogPosting)' \
    'href=("/(es/|ja/|fr/|de/)?about/"|/(es/|ja/|fr/|de/)?about/)'
  do
    if ! grep -qE "$marker" "$p"; then
      echo "FAIL — $p missing marker: $marker"
      FAIL=1
    fi
  done
done

# Cross-check: schema spec 15 (BlogPosting) is the JSON-LD gate. This test
# is only the visible-template gate. Both run in the suite.

if (( FAIL )); then
  echo "tests/content/08-blog-templates.sh: FAIL"
  exit 1
fi
echo "tests/content/08-blog-templates.sh: OK"
