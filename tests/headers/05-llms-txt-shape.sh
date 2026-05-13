#!/usr/bin/env bash
# Audit finding H2: llms.txt is served, valid markdown, AEO-tailored.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 2 Gherkin "llms.txt is served, valid
# markdown, AEO-tailored" + emerging convention at https://llmstxt.org/.
#
# Required shape:
#   - first line: `# <site name>` (we use "# Gateway Tech AEO")
#   - second non-blank line begins with `>` (blockquote summary)
#   - at least 3 H2 sections (## ...)
#   - links to /about/ and gatewaytechaeo.com (LLC site)
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

LLMS=static/llms.txt
if [[ ! -f "$LLMS" ]]; then
  echo "FAIL — $LLMS missing"
  exit 1
fi

FAIL=0

FIRST=$(head -n 1 "$LLMS")
if [[ "$FIRST" != \#\ * ]]; then
  echo "FAIL — first line must start with '# '; got: '$FIRST'"
  FAIL=1
fi

# First non-blank line after the H1 must start with '>'
SECOND=$(awk 'NR>1 && NF>0 {print; exit}' "$LLMS")
if [[ "$SECOND" != \>* ]]; then
  echo "FAIL — second non-blank line must start with '>' (blockquote summary); got: '$SECOND'"
  FAIL=1
fi

H2_COUNT=$(grep -c "^## " "$LLMS" || true)
H2_COUNT=${H2_COUNT:-0}
if (( H2_COUNT < 3 )); then
  echo "FAIL — expected >=3 ## headings; found $H2_COUNT"
  FAIL=1
fi

if ! grep -qE '\(/about/\)|\(https://gatewaytechaeo.com/about/\)' "$LLMS"; then
  echo "FAIL — llms.txt does not link to /about/"
  FAIL=1
fi

if ! grep -qE 'gatewaytechaeo\.com' "$LLMS"; then
  echo "FAIL — llms.txt does not reference gatewaytechaeo.com (the LLC site)"
  FAIL=1
fi

if (( FAIL )); then
  echo ""
  echo "tests/headers/05-llms-txt-shape.sh: FAIL"
  exit 1
fi
echo "tests/headers/05-llms-txt-shape.sh: OK"
