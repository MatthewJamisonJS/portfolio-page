#!/usr/bin/env node
// Audit H6 reframe: phone-call posture removed in commit d8d8800; the
// originally-scoped "Discovery Call Offer at price 0" no longer applies.
// Replacement signal: Brief intake Offer — free email-first intake plumbed
// via ?service=brief#contact, exposed in JSON-LD so AEO engines can cite the
// zero-cost on-ramp alongside the three paid tiers.
//
// Spec: AEO-Token-Conserving-Recap.md "H6 — reframe needed" + the recap's
// chosen Brief-Offer reframe (schema-only, no visual change).

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const HOMES = ['index.html', 'es/index.html', 'ja/index.html', 'fr/index.html', 'de/index.html'];

const failures = [];
const ldRegex = /<script type=application\/ld\+json>([\s\S]*?)<\/script>/g;

function extractGraph(html) {
  const blocks = [];
  let m;
  while ((m = ldRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const graph = parsed['@graph'] || [parsed];
      blocks.push(...graph);
    } catch (_) { /* surfaced by 01-validate-schema-org */ }
  }
  return blocks;
}

for (const rel of HOMES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: build artifact missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');
  const nodes = extractGraph(html);
  const ps = nodes.find(n => n['@type'] === 'ProfessionalService');
  if (!ps) {
    failures.push(`${rel}: no ProfessionalService node in @graph`);
    continue;
  }

  const offers = Array.isArray(ps.offers) ? ps.offers : [];
  // Match by price === "0" — the brief intake is the only free Offer in the array.
  // Locale-agnostic; the EN name "Project brief intake" is translated in ES/JA/FR/DE.
  const intake = offers.find(o => o.price === '0')
              || offers.find(o => /brief intake/i.test(o.name || ''));

  if (!intake) {
    failures.push(`${rel}: no Brief intake Offer in ProfessionalService.offers (audit H6)`);
    continue;
  }

  if (intake.price !== '0') {
    failures.push(`${rel}: Brief intake Offer.price must be "0", got "${intake.price}"`);
  }
  if (intake.priceCurrency !== 'USD') {
    failures.push(`${rel}: Brief intake Offer.priceCurrency must be "USD", got "${intake.priceCurrency}"`);
  }
  if (intake.availability !== 'https://schema.org/InStock') {
    failures.push(`${rel}: Brief intake Offer.availability must be schema.org/InStock, got "${intake.availability}"`);
  }
  if (!intake.url || !/\?service=brief/.test(intake.url)) {
    failures.push(`${rel}: Brief intake Offer.url must contain "?service=brief", got "${intake.url}"`);
  }
  if (typeof intake.description !== 'string' || intake.description.length < 10) {
    failures.push(`${rel}: Brief intake Offer.description must be a non-trivial string`);
  }
}

if (failures.length) {
  console.error('tests/schema/08-brief-intake-offer.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/08-brief-intake-offer.spec.js: OK');
