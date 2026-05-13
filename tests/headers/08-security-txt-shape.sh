#!/usr/bin/env bash
# Audit finding M8: /.well-known/security.txt is RFC 9116 compliant.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 3 Gherkin "security.txt is RFC 9116
# compliant and served at /.well-known/" + RFC 9116 §2.5 (required Contact
# and Expires).
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

SEC=static/.well-known/security.txt
if [[ ! -f "$SEC" ]]; then
  echo "FAIL — $SEC missing"
  exit 1
fi

FAIL=0

# Contact: mailto:... is the only RFC-mandated field. We assert icloud.com
# until orchestrator signals the routing swap (decision 1 of vivid-wondering-harp.md).
if ! grep -qE "^Contact:[[:space:]]*mailto:jamison\.matthew@icloud\.com\$" "$SEC"; then
  echo "FAIL — Contact: line missing or wrong value"
  FAIL=1
fi

# Expires: must be ISO-8601, parseable as a date < 365 days from today.
EXPIRES=$(grep -E "^Expires:" "$SEC" | head -n 1 | sed 's/^Expires:[[:space:]]*//')
if [[ -z "$EXPIRES" ]]; then
  echo "FAIL — Expires: line missing"
  FAIL=1
else
  TODAY_EPOCH=$(date -u +%s)
  # Portable ISO-8601 parse — BSD date (macOS local) uses `-j -f`, GNU date
  # (Linux CI) uses `-d`. Try BSD first, fall back to GNU, zero on both fail.
  EXP_EPOCH=$(date -u -j -f "%Y-%m-%dT%H:%M:%SZ" "$EXPIRES" +%s 2>/dev/null \
    || date -u -d "$EXPIRES" +%s 2>/dev/null \
    || echo 0)
  if (( EXP_EPOCH == 0 )); then
    echo "FAIL — Expires '$EXPIRES' not parseable as ISO-8601 (e.g. 2027-05-06T00:00:00Z)"
    FAIL=1
  else
    DAYS=$(( (EXP_EPOCH - TODAY_EPOCH) / 86400 ))
    if (( DAYS > 365 )); then
      echo "FAIL — Expires is $DAYS days out (must be <= 365 per RFC 9116)"
      FAIL=1
    fi
    if (( DAYS < 0 )); then
      echo "FAIL — Expires is in the past ($DAYS days)"
      FAIL=1
    fi
  fi
fi

# Recommended fields per RFC 9116 §2.5
for field in Preferred-Languages Canonical; do
  if ! grep -qE "^${field}:" "$SEC"; then
    echo "FAIL — $field: line missing"
    FAIL=1
  fi
done

# Canonical must reference the .well-known path
if ! grep -qE "^Canonical:[[:space:]]*https://gatewaytechaeo\.com/\.well-known/security\.txt\$" "$SEC"; then
  echo "FAIL — Canonical: must point at https://gatewaytechaeo.com/.well-known/security.txt"
  FAIL=1
fi

if (( FAIL )); then
  echo ""
  echo "tests/headers/08-security-txt-shape.sh: FAIL"
  exit 1
fi
echo "tests/headers/08-security-txt-shape.sh: OK (RFC 9116, expires in $DAYS days)"
