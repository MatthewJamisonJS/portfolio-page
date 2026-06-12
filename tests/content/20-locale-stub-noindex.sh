#!/usr/bin/env bash
# AEO-2 C2 (updated): the why/different/pricing/faq section pages are now fully
# translated in all five locales (driven by data/{lang}/*.yml — verified: the
# es/ja/fr/de headings render in-language), so they are intentionally indexable.
# None should carry noindex. The original stub-noindex rule applied while non-EN
# bodies were still English; that no longer holds for these section pages.
# Hugo's --minify strips quotes from attribute names, so the regex tolerates
# both quoted (`name="robots"`) and unquoted (`name=robots`) forms.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
# EN + all four translated locales: none of these section pages may be noindex.
for prefix in "" es ja fr de; do
  for page in why different pricing faq; do
    f="$BUILD/${prefix:+$prefix/}${page}/index.html"
    if [[ ! -f "$f" ]]; then
      echo "FAIL — ${prefix:-en}/${page} not built"; FAIL=1; continue
    fi
    if grep -qE 'name=.?robots.? content=.?noindex' "$f"; then
      echo "FAIL — ${prefix:-en}/${page} has noindex (translated page must be indexable)"; FAIL=1
    fi
  done
done

if (( FAIL )); then echo "tests/content/20-locale-stub-noindex.sh: FAIL"; exit 1; fi
echo "tests/content/20-locale-stub-noindex.sh: OK"
