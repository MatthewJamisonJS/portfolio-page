#!/usr/bin/env node
// Audit H12: FAQPage must include SpeakableSpecification pointing at the
// .faq-answer CSS selector (and the .hero-subtitle for top-level voice citation).
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 3.

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
      const graph = JSON.parse(m[1])['@graph'] || [];
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
  if (!selectors.includes('.hero-subtitle')) {
    failures.push(`${rel}: SpeakableSpecification cssSelector missing .hero-subtitle`);
  }
}

if (failures.length) {
  console.error('tests/schema/12-speakable-spec.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/12-speakable-spec.spec.js: OK (5 locales)');
