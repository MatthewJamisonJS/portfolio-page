#!/usr/bin/env node
// Audit H10: every sameAs URL emitted in the @graph must resolve to HTTP 200.
// gatewaytechaeo.com is unreachable at plan time (2026-05-11) — drop until DNS
// resolves OR an apex redirect to gatewaytechaeo.com ships in same PR.
//
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 1.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const HOME = path.join(BUILD, 'index.html');

if (!fs.existsSync(HOME)) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL — build artifact missing at ' + HOME);
  process.exit(1);
}

const html = fs.readFileSync(HOME, 'utf-8');
const m = html.match(/<script type=application\/ld\+json>([\s\S]*?)<\/script>/);
if (!m) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL — no JSON-LD on home');
  process.exit(1);
}

let graph;
try {
  graph = JSON.parse(m[1])['@graph'] || [];
} catch (e) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL — JSON parse error: ' + e.message);
  process.exit(1);
}

const sameAs = [];
for (const node of graph) {
  if (Array.isArray(node.sameAs)) sameAs.push(...node.sameAs);
}

// Known-broken hosts to flag immediately (no need to hit the network on every
// CI run). Update this list as hosts come online.
const BROKEN = ['gatewaytechaeo.com'];
const failures = sameAs.filter(u => BROKEN.some(b => u.includes(b)));

if (failures.length) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL');
  for (const u of failures) console.error('  - ' + u + ' is in known-broken list');
  process.exit(1);
}
console.log('tests/schema/10-no-broken-sameas.spec.js: OK (' + sameAs.length + ' sameAs URLs, none in BROKEN list)');
