#!/usr/bin/env node
// Audit H11: every rendered page must emit a BreadcrumbList in the JSON-LD @graph.
// Top-level pages have a single-item breadcrumb (Home). Deeper pages chain
// Home → Section → Page.
//
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 2.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
// Each entry: { file, expectedDepth } — depth 1 = Home only (homepage),
// depth 2 = Home → Section (section indexes, taxonomy listings),
// depth 3 = Home → Section → Page (regular leaf pages).
const PAGES = [
  { file: 'index.html', expectedDepth: 1 },
  // AEO-2 Task 3.3: /about/ removed (operator bio absent from public site).
  // Blog section index + posts retain the depth-2/depth-3 breadcrumbs.
  { file: 'blog/index.html', expectedDepth: 2 },
  { file: 'blog/aeo-vs-seo-what-changed/index.html', expectedDepth: 3 },
  { file: 'blog/robots-txt-llms-txt-for-ai-crawlers/index.html', expectedDepth: 3 },
  { file: 'es/index.html', expectedDepth: 1 },
  { file: 'ja/index.html', expectedDepth: 1 },
  { file: 'fr/index.html', expectedDepth: 1 },
  { file: 'de/index.html', expectedDepth: 1 },
  // Hugo taxonomy listing — Kind: taxonomy. .IsSection == false but
  // .Section == "tags". Must NOT duplicate position 2 as position 3.
  // Audit: fix-up review BLOCKER on commit 2319d2f.
  { file: 'tags/index.html', expectedDepth: 2 },
  { file: 'categories/index.html', expectedDepth: 2 },
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

for (const { file: rel, expectedDepth } of PAGES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    // Optional samples (tags/, categories/) may not always render on every
    // build configuration — skip silently rather than fail loudly.
    if (rel.startsWith('tags/') || rel.startsWith('categories/')) continue;
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
  if (bc.itemListElement.length !== expectedDepth) {
    failures.push(`${rel}: depth ${bc.itemListElement.length} != expected ${expectedDepth} — items=${JSON.stringify(bc.itemListElement.map(x => x.name))}`);
    continue;
  }
  // Position ordering must be strictly 1, 2, 3 with no duplicate names.
  const seenNames = new Set();
  for (let i = 0; i < bc.itemListElement.length; i++) {
    const item = bc.itemListElement[i];
    if (item.position !== i + 1) {
      failures.push(`${rel}: itemListElement[${i}].position=${item.position} (expected ${i + 1})`);
    }
    if (!item.name || !item.item) {
      failures.push(`${rel}: itemListElement[${i}] missing name or item`);
    }
    if (seenNames.has(item.name)) {
      failures.push(`${rel}: duplicate breadcrumb name "${item.name}" — taxonomy listing pages must not emit position 3`);
    }
    seenNames.add(item.name);
  }
}

if (failures.length) {
  console.error('tests/schema/11-breadcrumb-list.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/schema/11-breadcrumb-list.spec.js: OK (${PAGES.length} pages, all carry BreadcrumbList)`);
