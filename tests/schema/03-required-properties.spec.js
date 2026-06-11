#!/usr/bin/env node
// Audit findings C4 + H7: ProfessionalService schema must be a complete
// LocalBusiness markup, not just an areaServed stub.
//
//   C4 — required: priceRange, openingHoursSpecification, image, geo
//        (telephone is deferred per decision 3 of vivid-wondering-harp.md)
//   H7 — DFY tier Offer must use priceSpecification with minPrice/maxPrice/
//        priceCurrency/unitText, NOT the literal "$500–1,200" string in price.
//
// Spec: AEO-TIGHTEN-SHIP §3 Phase 1 Gherkin "ProfessionalService schema is
// complete LocalBusiness markup" + "DFY tier uses priceSpecification".

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

  // C4 required properties
  for (const prop of ['priceRange', 'openingHoursSpecification', 'image', 'geo']) {
    if (!(prop in ps)) failures.push(`${rel}: ProfessionalService missing "${prop}"`);
  }

  // openingHoursSpecification shape: array of objects with dayOfWeek/opens/closes
  if (Array.isArray(ps.openingHoursSpecification)) {
    const sample = ps.openingHoursSpecification[0];
    if (!sample || !sample.dayOfWeek || !sample.opens || !sample.closes) {
      failures.push(`${rel}: openingHoursSpecification entries missing dayOfWeek/opens/closes`);
    }
  } else if (ps.openingHoursSpecification && typeof ps.openingHoursSpecification === 'object') {
    if (!ps.openingHoursSpecification.dayOfWeek || !ps.openingHoursSpecification.opens) {
      failures.push(`${rel}: openingHoursSpecification missing dayOfWeek/opens`);
    }
  }

  // geo shape: GeoCoordinates with latitude/longitude
  if (ps.geo) {
    if (!ps.geo.latitude || !ps.geo.longitude) {
      failures.push(`${rel}: geo missing latitude/longitude`);
    }
  }

  // H7: range-priced Offers must express the range via priceSpecification
  // minPrice/maxPrice, NOT a literal range string in `price`. Match a
  // remaining range offer (minPrice !== maxPrice) — locale-agnostic; the
  // scoped implementation ($2,500–$6,500), AEO-native build, and 90-day
  // program all carry a true min/max range. (The per-month retainers that
  // previously anchored this check were removed when hourly + retainer
  // billing was retired.)
  const offers = Array.isArray(ps.offers) ? ps.offers : [];
  const rangeOffer = offers.find(o =>
    o.priceSpecification &&
    o.priceSpecification.minPrice &&
    o.priceSpecification.maxPrice &&
    o.priceSpecification.minPrice !== o.priceSpecification.maxPrice
  );
  if (!rangeOffer) {
    failures.push(`${rel}: no range-priced Offer found (expected scoped implementation / build / 90-day program)`);
  } else {
    if (typeof rangeOffer.price === 'string' && /[–—\-]/.test(rangeOffer.price)) {
      failures.push(`${rel}: range Offer.price is a literal range string "${rangeOffer.price}" — should use priceSpecification.minPrice/maxPrice (audit H7)`);
    }
    const ps2 = rangeOffer.priceSpecification;
    for (const k of ['minPrice', 'maxPrice', 'priceCurrency']) {
      if (!ps2[k]) failures.push(`${rel}: range priceSpecification missing "${k}"`);
    }
  }
}

if (failures.length) {
  console.error('tests/schema/03-required-properties.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/03-required-properties.spec.js: OK');
