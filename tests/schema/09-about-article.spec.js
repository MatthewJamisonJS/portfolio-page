#!/usr/bin/env node
// Audit finding H4 (content): the /about/ page must emit AboutPage + Article
// schema with the expected E-E-A-T linkages — author → Person, publisher →
// Organization, mainEntityOfPage → AboutPage. Spec: AEO-TIGHTEN-SHIP §3
// Phase 2 + the Article schema scenario.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const ABOUT_PATHS = ['about/index.html', 'es/about/index.html', 'ja/about/index.html', 'fr/about/index.html', 'de/about/index.html'];

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
    } catch (_) {}
  }
  return blocks;
}

for (const rel of ABOUT_PATHS) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: build artifact missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');
  const nodes = extractGraph(html);

  const aboutPage = nodes.find(n => n['@type'] === 'AboutPage');
  if (!aboutPage) {
    failures.push(`${rel}: no AboutPage node in @graph`);
  } else {
    if (!aboutPage['@id']) failures.push(`${rel}: AboutPage missing @id`);
    if (!aboutPage.url) failures.push(`${rel}: AboutPage missing url`);
    if (!aboutPage.mainEntity || aboutPage.mainEntity['@id'] !== 'https://matthewjamison.dev/#person') {
      failures.push(`${rel}: AboutPage.mainEntity must reference #person`);
    }
  }

  const article = nodes.find(n => n['@type'] === 'Article');
  if (!article) {
    failures.push(`${rel}: no Article node in @graph`);
    continue;
  }
  for (const prop of ['headline', 'datePublished', 'dateModified', 'author', 'publisher', 'image', 'mainEntityOfPage']) {
    if (!article[prop]) failures.push(`${rel}: Article missing "${prop}"`);
  }
  if (article.author && article.author['@id'] !== 'https://matthewjamison.dev/#person') {
    failures.push(`${rel}: Article.author must reference #person, got ${JSON.stringify(article.author)}`);
  }
  if (article.publisher && article.publisher['@id'] !== 'https://matthewjamison.dev/#organization') {
    failures.push(`${rel}: Article.publisher must reference #organization, got ${JSON.stringify(article.publisher)}`);
  }

  // Home page should NOT emit AboutPage/Article — schema-architect rule.
  // Skip; covered in 03-required-properties indirectly.
}

if (failures.length) {
  console.error('tests/schema/09-about-article.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/09-about-article.spec.js: OK');
