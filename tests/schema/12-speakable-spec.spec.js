#!/usr/bin/env node
// Audit H12: FAQPage must include SpeakableSpecification pointing at the
// .faq-answer CSS selector (and the .hero-subtitle for top-level voice citation).
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 3.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
// AEO-2 Phase 2.4: FAQPage migrated off the home @graph onto the dedicated
// /faq/ page. SpeakableSpecification rides the FAQPage where it now lives.
// Spanish/Japanese/French/German /faq/ routes ship once locale translations land.
const HOMES = ['faq/index.html'];

const failures = [];
const ldRegex = /<script type=application\/ld\+json>([\s\S]*?)<\/script>/g;

function extractGraph(html) {
  const blocks = [];
  let m;
  while ((m = ldRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      // Some JSON-LD scripts use @graph; others (the standalone FAQPage on /faq/)
      // emit a single typed object. Walk both shapes.
      const graph = parsed['@graph'] || [parsed];
      blocks.push(...graph);
    } catch (_) {}
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
  const faq = nodes.find(n => n['@type'] === 'FAQPage');
  if (!faq) {
    failures.push(`${rel}: FAQPage node missing`);
    continue;
  }
  const speakable = faq.speakable;
  if (!speakable) {
    failures.push(`${rel}: FAQPage.speakable missing`);
    continue;
  }
  if (speakable['@type'] !== 'SpeakableSpecification') {
    failures.push(`${rel}: FAQPage.speakable['@type'] not SpeakableSpecification`);
  }
  const sel = speakable.cssSelector || [];
  const selectors = Array.isArray(sel) ? sel : [sel];
  if (!selectors.includes('.faq-answer')) {
    failures.push(`${rel}: SpeakableSpecification cssSelector missing .faq-answer`);
  }
  // AEO-2 Phase 2.4: FAQPage moved off homepage onto /faq/. The .hero-subtitle
  // selector no longer applies to the FAQPage's page-of-residence (no hero there);
  // citation-ready voice content on this page is the answer list.
}

if (failures.length) {
  console.error('tests/schema/12-speakable-spec.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/schema/12-speakable-spec.spec.js: OK (${HOMES.length} page(s))`);
