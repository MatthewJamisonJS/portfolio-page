#!/usr/bin/env bash
# Audit M9: Twitter handle ownership decision honored.
#
# Decision 2 (recap §"Locked decisions"): handle @matthewjamison is verified
# as owned by the operator. Must appear consistently in twitter:site,
# twitter:creator, and Person.sameAs (x.com URL). No dangling references; no
# mismatched handles.
#
# Spec: AEO-TIGHTEN-SHIP §3 Phase 3 Gherkin "Twitter handle ownership
# decision honored".
set -e
BUILD="${AEO_BUILD:-/tmp/aeo-test-build}"
HOME_HTML="$BUILD/index.html"

if [[ ! -f "$HOME_HTML" ]]; then
  echo "  FAIL: build artifact missing at $HOME_HTML"
  exit 1
fi

# Extract twitter:site value (without leading @ for comparison)
twitter_site=$(grep -oE 'name="?twitter:site"?[[:space:]]+content="@?[^"]+"' "$HOME_HTML" \
  | sed -E 's/.*content="@?([^"]+)".*/\1/' | head -1)

# Extract twitter:creator value (without leading @)
twitter_creator=$(grep -oE 'name="?twitter:creator"?[[:space:]]+content="@?[^"]+"' "$HOME_HTML" \
  | sed -E 's/.*content="@?([^"]+)".*/\1/' | head -1)

# Extract last-segment of x.com URL inside Person.sameAs JSON-LD array
sameas_handle=$(grep -oE '"https://x\.com/[^"]+"' "$HOME_HTML" \
  | sed -E 's|.*x\.com/([^/"?]+).*|\1|' | head -1)

failures=0
if [[ -z "$twitter_site" ]]; then
  echo "  FAIL: twitter:site meta tag missing"
  failures=$((failures + 1))
fi
if [[ -z "$twitter_creator" ]]; then
  echo "  FAIL: twitter:creator meta tag missing"
  failures=$((failures + 1))
fi
if [[ -z "$sameas_handle" ]]; then
  echo "  FAIL: no https://x.com/<handle> entry in JSON-LD Person.sameAs"
  failures=$((failures + 1))
fi

if (( failures == 0 )); then
  if [[ "$twitter_site" != "$twitter_creator" ]]; then
    echo "  FAIL: twitter:site ('$twitter_site') != twitter:creator ('$twitter_creator')"
    failures=$((failures + 1))
  fi
  if [[ "$twitter_site" != "$sameas_handle" ]]; then
    echo "  FAIL: twitter handle ('$twitter_site') does not match x.com URL handle ('$sameas_handle')"
    failures=$((failures + 1))
  fi
fi

if (( failures > 0 )); then
  echo "tests/metadata/05-twitter-handle-consistency.sh: FAIL"
  exit 1
fi
echo "tests/metadata/05-twitter-handle-consistency.sh: OK (@$twitter_site)"
