#!/usr/bin/env bash
# AEO-2 C2 fix: locale stub pages must carry noindex until translated.
# Hugo's --minify strips quotes from attribute names, so the regex tolerates
# both quoted (`name="robots"`) and unquoted (`name=robots`) forms.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
for prefix in es ja fr de; do
  for page in why different pricing faq; do
    f="$BUILD/${prefix}/${page}/index.html"
    if [[ ! -f "$f" ]]; then
      echo "FAIL — ${prefix}/${page} not built"; FAIL=1; continue
    fi
    if ! grep -qE 'name=.?robots.? content=.?noindex' "$f"; then
      echo "FAIL — ${prefix}/${page} missing noindex meta"; FAIL=1
    fi
  done
done

# EN pages MUST NOT have noindex.
for page in why different pricing faq; do
  f="$BUILD/${page}/index.html"
  if grep -qE 'name=.?robots.? content=.?noindex' "$f"; then
    echo "FAIL — EN /${page}/ has noindex (must be indexable)"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/20-locale-stub-noindex.sh: FAIL"; exit 1; fi
echo "tests/content/20-locale-stub-noindex.sh: OK"
