#!/usr/bin/env node
// Audit H11: every rendered page must emit a BreadcrumbList in the JSON-LD @graph.
// Top-level pages have a single-item breadcrumb (Home). Deeper pages chain
// Home → Section → Page.
//
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 2.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const PAGES = [
  'index.html',
  'about/index.html',
  'es/index.html',
  'ja/index.html',
  'fr/index.html',
  'de/index.html',
];

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
    } catch (_) { /* parse failures surfaced elsewhere */ }
  }
  return blocks;
}

for (const rel of PAGES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: build artifact missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');
  const nodes = extractGraph(html);
  const bc = nodes.find(n => n['@type'] === 'BreadcrumbList');
  if (!bc) {
    failures.push(`${rel}: no BreadcrumbList node in @graph`);
    continue;
  }
  if (!Array.isArray(bc.itemListElement) || bc.itemListElement.length < 1) {
    failures.push(`${rel}: BreadcrumbList.itemListElement empty`);
    continue;
  }
  const first = bc.itemListElement[0];
  if (first.position !== 1 || !first.name || !first.item) {
    failures.push(`${rel}: first breadcrumb missing position/name/item`);
  }
}

if (failures.length) {
  console.error('tests/schema/11-breadcrumb-list.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/schema/11-breadcrumb-list.spec.js: OK (${PAGES.length} pages, all carry BreadcrumbList)`);
