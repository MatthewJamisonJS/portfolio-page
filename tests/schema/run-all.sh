#!/usr/bin/env bash
# Phase 1+ schema tests. Owner: schema-architect subagent.
# Spec: AEO-TIGHTEN-SHIP §3 Phase 1 + §6.
# Files to populate (TDD red-first by schema-architect):
#   01-validate-schema-org.sh        — validator.schema.org API
#   02-rich-results-curl.sh          — JSON-LD shape assertions via curl + jq
#   03-required-properties.spec.js   — ProfessionalService has address/phone/priceRange/...
#   04-id-consistency.spec.js        — Organization @id stable across locales (sample in §3)
#   05-email-is-reachable.spec.js    — email matches brand.yml; warns if not icloud.com placeholder
#   06-person-eeat.spec.js           — Person knowsLanguage, worksFor, hasOccupation (Phase 2)
#   07-review-min-1.spec.js          — at least one Review with non-placeholder author (Phase 2)
#   08-brief-intake-offer.spec.js    — Brief intake Offer at price 0 (Phase 2, audit H6 reframe)
#   09-article-schema.spec.js        — every /blog/* page emits Article schema (Phase 2)
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
shopt -s nullglob
FILES=( "$ROOT"/[0-9][0-9]-*.sh "$ROOT"/[0-9][0-9]-*.spec.js )
if (( ${#FILES[@]} == 0 )); then
  echo "  (no schema tests yet — populated as schema-architect runs Phase 1+)"
  exit 0
fi
for f in "${FILES[@]}"; do
  echo "  -> $(basename "$f")"
  case "$f" in
    *.sh) bash "$f" ;;
    *.spec.js) node "$f" ;;
  esac
done
echo "  schema suite OK"
