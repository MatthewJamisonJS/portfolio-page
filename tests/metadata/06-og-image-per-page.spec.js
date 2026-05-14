#!/usr/bin/env node
// Audit M11: pages with .Params.image (e.g. blog posts) emit page-specific
// og:image and twitter:image. Pages without it fall back to og-default.png.
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 7.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';

// Each sample asserts the og:image and twitter:image regex against the page.
// AEO-2 Task 3.3: /about/ sample dropped — page intentionally absent.
const SAMPLES = [
  { file: 'index.html', expect: /og-default\.png/ },
  // Tasks 12+13 ship per-post hero images; the post sample lines below activate
  // once the build contains those routes.
];

if (fs.existsSync(path.join(BUILD, 'blog/aeo-vs-seo-what-changed/index.html'))) {
  SAMPLES.push({ file: 'blog/aeo-vs-seo-what-changed/index.html', expect: /og-aeo-vs-seo\.webp/ });
}
if (fs.existsSync(path.join(BUILD, 'blog/robots-txt-llms-txt-for-ai-crawlers/index.html'))) {
  SAMPLES.push({ file: 'blog/robots-txt-llms-txt-for-ai-crawlers/index.html', expect: /og-robots-llms\.webp/ });
}

const failures = [];
for (const { file, expect } of SAMPLES) {
  const full = path.join(BUILD, file);
  if (!fs.existsSync(full)) { failures.push(`${file}: missing`); continue; }
  const html = fs.readFileSync(full, 'utf-8');
  for (const prop of ['og:image', 'twitter:image']) {
    const re = new RegExp(`(?:property|name)="?${prop.replace(/:/g, '\\:')}"?\\s+content="([^"]+)"`);
    const m = html.match(re);
    if (!m) { failures.push(`${file}: ${prop} meta tag missing`); continue; }
    if (!expect.test(m[1])) {
      failures.push(`${file}: ${prop}="${m[1]}" does not match ${expect}`);
    }
  }
}

if (failures.length) {
  console.error('tests/metadata/06-og-image-per-page.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/metadata/06-og-image-per-page.spec.js: OK (${SAMPLES.length} samples)`);
