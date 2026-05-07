#!/usr/bin/env node
// Audit finding H4: Person schema carries E-E-A-T signals.
// knowsLanguage covers the five locale codes; worksFor names the operator's
// current employer (Concordia Publishing House); hasOccupation.skills lists
// the named tools/expertise in plain, citable form.
//
// Spec: AEO-TIGHTEN-SHIP §3 Phase 2 Gherkin "Person schema carries E-E-A-T
// signals".

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
      const parsed = JSON.parse(m[1]);
      const graph = parsed['@graph'] || [parsed];
      blocks.push(...graph);
    } catch (_) {}
  }
  return blocks;
}

const REQUIRED_LANGS = ['en', 'es', 'ja', 'fr', 'de'];
const REQUIRED_SKILLS = ['Ruby on Rails', 'Hugo', 'Schema Markup', 'Answer Engine Optimization'];

for (const rel of HOMES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) {
    failures.push(`${rel}: build artifact missing`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf-8');
  const nodes = extractGraph(html);
  const person = nodes.find(n => n['@type'] === 'Person');
  if (!person) {
    failures.push(`${rel}: no Person node in @graph`);
    continue;
  }

  // knowsLanguage
  if (!Array.isArray(person.knowsLanguage)) {
    failures.push(`${rel}: Person.knowsLanguage missing or not an array`);
  } else {
    for (const lang of REQUIRED_LANGS) {
      if (!person.knowsLanguage.includes(lang)) {
        failures.push(`${rel}: Person.knowsLanguage missing "${lang}"`);
      }
    }
  }

  // worksFor: Concordia Publishing House
  const worksFor = person.worksFor;
  if (!worksFor || worksFor.name !== 'Concordia Publishing House') {
    failures.push(`${rel}: Person.worksFor.name must be "Concordia Publishing House"`);
  }

  // hasOccupation.skills
  const occ = person.hasOccupation;
  if (!occ) {
    failures.push(`${rel}: Person.hasOccupation missing`);
  } else {
    const skills = occ.skills;
    const skillsText = Array.isArray(skills) ? skills.join(' ') : (skills || '');
    for (const required of REQUIRED_SKILLS) {
      if (!skillsText.includes(required)) {
        failures.push(`${rel}: Person.hasOccupation.skills missing "${required}"`);
      }
    }
  }
}

if (failures.length) {
  console.error('tests/schema/06-person-eeat.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/06-person-eeat.spec.js: OK');
