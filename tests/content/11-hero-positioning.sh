#!/usr/bin/env bash
# Audit M14: hero copy across all 5 locales must NOT contain the deprecated
# "Watch AI pick the winners" framing AND MUST contain operator-positioning
# markers (a reference to Rails / Shopify-scale + small business / Main Street).
# Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 15.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

FAIL=0

# Banned phrases — must not appear in any locale's banner.yml title or subtitle.
BANNED=(
  "Watch AI pick the winners"
  "Built by a Full-Stack engineer"
  "Helping local businesses get cited by AI search"
)

for locfile in data/en/banner.yml data/es/banner.yml data/ja/banner.yml data/fr/banner.yml data/de/banner.yml; do
  for phrase in "${BANNED[@]}"; do
    if grep -q "$phrase" "$REPO/$locfile"; then
      echo "FAIL — $locfile contains deprecated phrase: $phrase"
      FAIL=1
    fi
  done
done

# Required-marker check — EN at minimum must reference Full-Stack + St. Louis
# + local businesses + AI search (operator's voice after the teach-first hero
# refactor in PR #45 "small→local sweep" — replaces the older "small business
# + AI-world" framing).
EN=$REPO/data/en/banner.yml
REQUIRED_EN=("When customers ask AI" "Why does this matter to me" "What makes Gateway Tech AEO different")
for marker in "${REQUIRED_EN[@]}"; do
  if ! grep -q "$marker" "$EN"; then
    echo "FAIL — data/en/banner.yml missing positioning marker: $marker"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/11-hero-positioning.sh: FAIL"
  exit 1
fi
echo "tests/content/11-hero-positioning.sh: OK"
