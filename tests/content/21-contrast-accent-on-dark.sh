#!/usr/bin/env bash
# AEO-2 C3 fix: stat/pillar/pricing accent uses --clay on charcoal cards (AA 5.7:1).
# Catches regressions where someone reaches for --primary or --accent on a dark surface.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

FAIL=0

# These selectors live in the AEO-2 block and must use --clay.
SELECTORS=(
  ".stat-headline"
  ".pillar-card h3"
  ".pricing-card .price"
  ".home-teaser-link"
  ".hero-kicker"
)
for sel in "${SELECTORS[@]}"; do
  # Look for the selector followed by a color block that mentions var(--clay)
  # within the current line + the next 5 lines (handles both inline single-line
  # rules and multi-line declaration blocks).
  if ! awk -v s="$sel" 'BEGIN{found=0} index($0,s){buf=$0;for(i=0;i<5;i++){if((getline l)>0){buf=buf""l}} if(match(buf, "color:[[:space:]]*var\\(--clay\\)")){found=1}} END{exit !found}' "$REPO/assets/css/custom.css"; then
    echo "FAIL — $sel not using var(--clay) on dark surface"
    FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/21-contrast-accent-on-dark.sh: FAIL"; exit 1; fi
echo "tests/content/21-contrast-accent-on-dark.sh: OK"
