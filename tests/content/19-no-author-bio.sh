#!/usr/bin/env bash
# AEO-2 Task 3.3: no author photo or bio on any built page.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

# Photo file must not be referenced.
if grep -rq 'matthew-jamison.webp' "$BUILD"; then
  echo "FAIL — author photo still referenced in built site"; FAIL=1
fi

# No /about/ page in any locale.
for prefix in "" "es/" "ja/" "fr/" "de/"; do
  if [[ -d "$BUILD/${prefix}about" ]]; then
    echo "FAIL — $BUILD/${prefix}about still exists"; FAIL=1
  fi
done

# No author-bio class markup rendered in built HTML.
for f in "$BUILD/index.html" "$BUILD/different/index.html" "$BUILD/why/index.html" "$BUILD/pricing/index.html" "$BUILD/faq/index.html"; do
  if [[ -f "$f" ]] && grep -q 'author-bio\|author-photo\|author-bio-card' "$f"; then
    echo "FAIL — author-bio markup found on $f"; FAIL=1
  fi
done

# Source check: data/<lang>/author.yml should be gone.
for lang in en es ja fr de; do
  if [[ -f "$REPO/data/${lang}/author.yml" ]]; then
    echo "FAIL — data/${lang}/author.yml still exists"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/19-no-author-bio.sh: FAIL"; exit 1; fi
echo "tests/content/19-no-author-bio.sh: OK"
