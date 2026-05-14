#!/usr/bin/env node
// Audit H13: home page emits a HowTo node with 3 HowToStep entries matching
// data/{lang}/method.yml pillars (Technical, Authority, Content).
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 4.

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
  if (!fs.existsSync(file)) { failures.push(`${rel}: missing`); continue; }
  const html = fs.readFileSync(file, 'utf-8');
  const nodes = extractGraph(html);
  const ht = nodes.find(n => n['@type'] === 'HowTo');
  if (!ht) { failures.push(`${rel}: no HowTo node`); continue; }
  if (!ht.name || !ht.step) { failures.push(`${rel}: HowTo missing name or step`); continue; }
  if (!Array.isArray(ht.step) || ht.step.length !== 3) {
    failures.push(`${rel}: HowTo.step.length = ${ht.step?.length} (expected 3)`);
    continue;
  }
  for (const [i, s] of ht.step.entries()) {
    if (s['@type'] !== 'HowToStep') failures.push(`${rel}: step[${i}] @type != HowToStep`);
    if (!s.name) failures.push(`${rel}: step[${i}] missing name`);
    if (!s.text) failures.push(`${rel}: step[${i}] missing text`);
    // Anchor existence — every step.url fragment must resolve to a real id in
    // the rendered HTML of the *target page* (path before the fragment).
    // Catches "dead fragment" regression: a HowToStep that tells crawlers to
    // deep-link to a non-existent anchor degrades citation quality and
    // contradicts the H13 reason-to-exist.
    // AEO-2 Task 1.3: HowToStep urls point at /different/#pillar-{id}, not /#…,
    // so we resolve the target page relative to BUILD before checking the id.
    if (s.url && s.url.includes('#')) {
      const [target, frag] = s.url.split('#');
      // Strip protocol+host; everything after the trailing slash of host is
      // the path. Hugo emits absolute URLs, so split off the host.
      let pathPart = target.replace(/^https?:\/\/[^/]+/, '');
      if (!pathPart || pathPart === '/') pathPart = '/index.html';
      else if (pathPart.endsWith('/')) pathPart += 'index.html';
      const targetFile = path.join(BUILD, pathPart.replace(/^\//, ''));
      if (!fs.existsSync(targetFile)) {
        failures.push(`${rel}: step[${i}].url target file ${pathPart} missing`);
        continue;
      }
      const targetHtml = fs.readFileSync(targetFile, 'utf-8');
      const idRe = new RegExp(`id=["']?${frag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'\\s>]`);
      if (!idRe.test(targetHtml)) {
        failures.push(`${rel}: step[${i}].url '${pathPart}#${frag}' has no matching id= in target HTML`);
      }
    }
  }
}

if (failures.length) {
  console.error('tests/schema/13-howto.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/13-howto.spec.js: OK (HowTo present on 5 home locales)');
