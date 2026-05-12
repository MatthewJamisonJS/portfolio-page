#!/usr/bin/env node
// Audit H15: every page under /blog/ (excluding the index) emits a BlogPosting
// JSON-LD node with required fields. Passes vacuously on builds without blog
// posts; turns into a hard gate once content/english/blog/*.md ships in Task 12.
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 6.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';

function listPosts(dir) {
  const out = [];
  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const full = path.join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name === 'index.html') out.push(full);
    }
  }
  walk(dir);
  return out;
}

const blogDir = path.join(BUILD, 'blog');
const posts = listPosts(blogDir).filter(p => !p.endsWith('/blog/index.html'));

if (posts.length === 0) {
  console.log('tests/schema/15-blogposting.spec.js: SKIP (no blog posts in build yet — passes vacuously)');
  process.exit(0);
}

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

for (const file of posts) {
  const rel = path.relative(BUILD, file);
  const nodes = extractGraph(fs.readFileSync(file, 'utf-8'));
  const bp = nodes.find(n => n['@type'] === 'BlogPosting');
  if (!bp) { failures.push(`${rel}: no BlogPosting node`); continue; }
  for (const k of ['headline', 'description', 'datePublished', 'dateModified', 'mainEntityOfPage', 'inLanguage']) {
    if (!bp[k]) failures.push(`${rel}: BlogPosting.${k} missing`);
  }
  if (!bp.author || bp.author['@id'] !== 'https://matthewjamison.dev/#person') {
    failures.push(`${rel}: BlogPosting.author @id != #person`);
  }
  if (!bp.publisher || bp.publisher['@id'] !== 'https://matthewjamison.dev/#organization') {
    failures.push(`${rel}: BlogPosting.publisher @id != #organization`);
  }
}

if (failures.length) {
  console.error('tests/schema/15-blogposting.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/schema/15-blogposting.spec.js: OK (${posts.length} posts)`);
