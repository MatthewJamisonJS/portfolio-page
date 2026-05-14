#!/usr/bin/env node
// Audit H14: @graph must include a LocalBusiness sibling node (in addition to
// ProfessionalService) with PostalAddress, paymentAccepted, currenciesAccepted,
// openingHoursSpecification.
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 5.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
// AEO-2 Task 3.3: /about/ removed (operator bio absent from public site).
// LocalBusiness must still ride the homepage @graph.
const PAGES = ['index.html'];

const failures = [];
const ldRegex = /<script type=application\/ld\+json>([\s\S]*?)<\/script>/g;

function extractGraph(html) {
  const blocks = [];
  let m;
  while ((m = ldRegex.exec(html)) !== null) {
    try { blocks.push(...(JSON.parse(m[1])['@graph'] || [])); } catch (_) {}
  }
  return blocks;
}

for (const rel of PAGES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) { failures.push(`${rel}: missing`); continue; }
  const nodes = extractGraph(fs.readFileSync(file, 'utf-8'));
  const lb = nodes.find(n => n['@type'] === 'LocalBusiness');
  if (!lb) { failures.push(`${rel}: no LocalBusiness node`); continue; }
  if (!lb.address || lb.address['@type'] !== 'PostalAddress') {
    failures.push(`${rel}: LocalBusiness.address not a PostalAddress`);
  } else {
    if (lb.address.addressLocality !== 'St. Louis') failures.push(`${rel}: addressLocality != St. Louis`);
    if (lb.address.addressRegion !== 'MO') failures.push(`${rel}: addressRegion != MO`);
    if (lb.address.addressCountry !== 'US') failures.push(`${rel}: addressCountry != US`);
  }
  if (!Array.isArray(lb.paymentAccepted) || lb.paymentAccepted.length === 0) {
    failures.push(`${rel}: LocalBusiness.paymentAccepted missing`);
  }
  if (lb.currenciesAccepted !== 'USD') failures.push(`${rel}: currenciesAccepted != USD`);
  if (!lb.openingHoursSpecification) failures.push(`${rel}: openingHoursSpecification missing`);
}

if (failures.length) {
  console.error('tests/schema/14-localbusiness.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/14-localbusiness.spec.js: OK');
