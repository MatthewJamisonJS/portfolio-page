#!/usr/bin/env node
// Audit M3: every <link rel="preload"> href must appear as a real consumer
// in the same document — <link rel="stylesheet">, <img src/srcset>, font-face
// url(), or any other consumption. Unconsumed preloads waste bytes + warn in
// devtools as "preloaded but not used within a few seconds".
//
// Spec: AEO-TIGHTEN-SHIP §3 Phase 3 Gherkin "Preload hints actually point to
// consumed resources".

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const HOMES = ['index.html', 'es/index.html', 'ja/index.html', 'fr/index.html', 'de/index.html'];

const failures = [];

// Match `<link rel=preload href=URL ...>` (Hugo's minified output drops quotes
// when safe; tolerate both quoted and unquoted forms).
const preloadRegex = /<link[^>]+rel=["']?preload["']?[^>]+href=["']?([^"'> ]+)["']?[^>]*>/gi;

for (const rel of HOMES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: build artifact missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');

  const preloads = [];
  let m;
  while ((m = preloadRegex.exec(html)) !== null) {
    preloads.push({ tag: m[0], href: m[1] });
  }
  preloadRegex.lastIndex = 0;

  if (preloads.length === 0) {
    failures.push(`${rel}: no <link rel="preload"> tags found (suspicious)`);
    continue;
  }

  for (const { tag, href } of preloads) {
    // Strip the preload tag itself out of the haystack so we can verify a
    // *separate* consumer exists.
    const haystack = html.replace(tag, '');

    // Hugo's minifier strips quotes around attribute values, so an exact
    // substring search on the URL is sufficient. Compare the raw href and
    // (when absolute) also try the path-only form for things like font
    // preloads that show up in url(...) without origin.
    let consumed = haystack.includes(href);
    if (!consumed) {
      try {
        const u = new URL(href, 'https://gatewaytechaeo.com/');
        consumed = haystack.includes(u.pathname);
      } catch (_) { /* not a URL — fall through */ }
    }

    if (!consumed) {
      failures.push(`${rel}: preload href "${href}" has no real consumer in the document`);
    }
  }
}

if (failures.length) {
  console.error('tests/metadata/04-preload-references-real.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/metadata/04-preload-references-real.spec.js: OK');
