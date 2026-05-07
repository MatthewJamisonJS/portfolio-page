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

  // H7: DFY Offer uses priceSpecification not literal range string
  const offers = Array.isArray(ps.offers) ? ps.offers : [];
  const dfy = offers.find(o => /Done-For-You/i.test(o.name || ''));
  if (!dfy) {
    failures.push(`${rel}: no Done-For-You Offer found`);
  } else {
    if (typeof dfy.price === 'string' && /[–—\-]/.test(dfy.price)) {
      failures.push(`${rel}: DFY Offer.price is a literal range string "${dfy.price}" — should use priceSpecification.minPrice/maxPrice (audit H7)`);
    }
    if (!dfy.priceSpecification) {
      failures.push(`${rel}: DFY Offer missing priceSpecification (audit H7)`);
    } else {
      const ps2 = dfy.priceSpecification;
      for (const k of ['minPrice', 'maxPrice', 'priceCurrency']) {
        if (!ps2[k]) failures.push(`${rel}: DFY priceSpecification missing "${k}"`);
      }
    }
  }
}

if (failures.length) {
  console.error('tests/schema/03-required-properties.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/03-required-properties.spec.js: OK');
