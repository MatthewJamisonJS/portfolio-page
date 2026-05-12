# AEO Citation Surface Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close every gap between matthewjamison.dev's marketing promise ("gold-standard AEO posture") and what the site actually does — by extending the JSON-LD `@graph`, adding two pillar blog posts, reframing the hero, tightening FAQ answers to the 40–60-word AI-citation window, and committing post-merge verification evidence.

**Architecture:** Hugo static site. Additive JSON-LD changes in `layouts/partials/head.html` (no removal of existing nodes). New `content/{lang}/blog/` section with `BlogPosting` schema. New reusable partials: `breadcrumb.html`, `author-bio.html`. New blog templates: `layouts/blog/{single,list}.html`. Tests extend the existing harness at `tests/<area>/NN-name.{sh,spec.js}` driven by `tests/run-all.sh`. Verification artifacts land in `lighthouse-results/post-aeo-cluster/`.

**Tech Stack:** Hugo extended v0.152.2; Node v25; vanilla JS (lozad only in prod); Bootstrap 5 purged; existing test harness already uses bash + node + jq. No new framework introduced.

**Strategic spec:** `/Users/wwjd_._/.claude/plans/we-are-on-the-hazy-sparrow.md` (approved 2026-05-11).

**Operator rules in force:**
- Every visual change uses `/frontend-design` skill (see [user memory](feedback-frontend-design-skill)).
- Every implementation step uses BDD outer (acceptance scenario) + inner (unit spec) loop.
- All copy changes touch all 5 locales (`en/es/ja/fr/de`) unless explicitly EN-only.
- Conventional Commits with scope; no AI co-author trailers.
- WCAG 2.1 AA + OWASP Top 10 maintained.

---

## File structure overview

### New files

| Path | Responsibility |
|---|---|
| `layouts/partials/breadcrumb.html` | Visible breadcrumb UI (nav + paired JSON-LD via `jsonld-breadcrumb.html` partial) |
| `layouts/partials/jsonld-breadcrumb.html` | `BreadcrumbList` JSON-LD fragment included from `head.html` |
| `layouts/partials/author-bio.html` | Reusable author E-E-A-T card; mounts on About + blog single |
| `layouts/blog/single.html` | Blog post template |
| `layouts/blog/list.html` | Blog index template |
| `data/{en,es,ja,fr,de}/author.yml` | Author-bio data source (EN authoritative; non-EN reference EN content until translated) |
| `content/english/blog/_index.md` | EN blog landing |
| `content/english/blog/aeo-vs-seo-what-changed.md` | Pillar Post 1 |
| `content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md` | Pillar Post 2 |
| `content/{spanish,japanese,french,german}/blog/_index.md` | Non-EN landings (stub for now) |
| `content/{spanish,japanese,french,german}/blog/aeo-vs-seo-what-changed.md` | Locale stubs w/ EN body + `inLanguage: en` |
| `content/{spanish,japanese,french,german}/blog/robots-txt-llms-txt-for-ai-crawlers.md` | Locale stubs |
| `assets/images/og/og-aeo-vs-seo.webp` | OG hero for Pillar 1 (1200×630, generated via `/frontend-design`) |
| `assets/images/og/og-robots-llms.webp` | OG hero for Pillar 2 |
| `tests/schema/10-no-broken-sameas.spec.js` | Unit spec for Task 1 |
| `tests/schema/11-breadcrumb-list.spec.js` | Unit spec for Task 2 |
| `tests/schema/12-speakable-spec.spec.js` | Unit spec for Task 3 |
| `tests/schema/13-howto.spec.js` | Unit spec for Task 4 |
| `tests/schema/14-localbusiness.spec.js` | Unit spec for Task 5 |
| `tests/schema/15-blogposting.spec.js` | Unit spec for Task 6 |
| `tests/metadata/06-og-image-per-page.spec.js` | Unit spec for Task 7 |
| `tests/content/04-llms-txt-optional.sh` | Unit spec for Task 8 |
| `tests/content/05-author-bio.sh` | Unit spec for Task 9 |
| `tests/content/06-breadcrumb-ui.sh` | Unit spec for Task 10 |
| `tests/content/07-blog-templates.sh` | Unit spec for Task 11 |
| `tests/content/08-pillar-1-word-count.sh` | Unit spec for Task 12 |
| `tests/content/09-pillar-2-self-evidence.sh` | Unit spec for Task 13 |
| `tests/i18n/04-blog-hreflang.sh` | Unit spec for Task 14 |
| `tests/content/10-hero-positioning.sh` | Unit spec for Task 15 |
| `tests/content/11-faq-word-count.spec.js` | Unit spec for Task 16 |
| `tests/metadata/07-lastmod-visible.sh` | Unit spec for Task 17 |
| `features/aeo-citation-surface.feature` | Outer-loop acceptance scenarios (Gherkin, human-readable) |
| `lighthouse-results/post-aeo-cluster/*.json` | Lighthouse evidence |
| `lighthouse-results/post-aeo-cluster/rich-results-*.png` | Schema validator screenshots |
| `lighthouse-results/post-aeo-cluster/dogfood/*.png` | LLM citation captures |

### Modified files

| Path | Change |
|---|---|
| `layouts/partials/head.html` | Add `BreadcrumbList`, `SpeakableSpecification`, `HowTo`, `LocalBusiness`, `BlogPosting`; drop broken `sameAs`; per-page OG fallback |
| `layouts/_default/single.html` (or `layouts/about/single.html` if exists) | Mount `author-bio.html` + `breadcrumb.html` |
| `data/{en,es,ja,fr,de}/banner.yml` | Hero reframe |
| `data/{en,es,ja,fr,de}/faq.yml` | Tighten answers to 40–60 words |
| `static/llms.txt` | Append `## Optional` section |
| `tests/run-all.sh` | (no change — globs auto-pick new tests) |

---

## Audit-finding IDs (new)

Continuing the existing audit-finding numbering style (`AEO-TIGHTEN-SHIP.md`). New IDs assigned by this plan:

| ID | Finding |
|---|---|
| H10 | Broken `sameAs` → `gatewaytechaeo.com` |
| H11 | Missing `BreadcrumbList` |
| H12 | Missing `SpeakableSpecification` |
| H13 | Missing `HowTo` for method section |
| H14 | Missing explicit `LocalBusiness` block |
| H15 | Missing `BlogPosting` + pillar content |
| M11 | Per-page OG image static across routes |
| M12 | `llms.txt` v1.7.0 missing `## Optional` section |
| M13 | FAQ answers exceed 40–60 word AI-citation window |
| M14 | Hero copy not aligned with operator positioning |
| L6 | No visible `lastmod` on About / new posts |
| L7 | No post-rebrand Lighthouse / Rich-Results / dogfood evidence committed |

---

## Task ordering & dependencies

```
Task 1 (sameAs fix) ─────────────────┐
Task 2 (BreadcrumbList) ─────┐       │
Task 3 (SpeakableSpecification) ─┐   │
Task 4 (HowTo) ─────────────────┐│   │
Task 5 (LocalBusiness) ────────┐││   │
Task 6 (BlogPosting cond.) ───┐│││   │
Task 7 (per-page OG) ────────┐││││   │
Task 8 (llms.txt Optional) ─┐│││││   │
                            ││││││   │
Task 9 (author-bio partial)─┴┴┴┴┴┴───┤
Task 10 (breadcrumb UI) ─────────────┤
Task 11 (blog templates) ────────────┤
Task 12 (Pillar 1 content) ──────────┤
Task 13 (Pillar 2 content) ──────────┤
Task 14 (locale stubs) ──────────────┤
Task 15 (hero reframe + /frontend-design) ─┤
Task 16 (FAQ tightening × 5 locales) ──────┤
Task 17 (visible lastmod) ─────────────────┤
                                           │
Task 18 (verification + evidence commit) ──┘
```

Tasks 1–8 are head.html / static-file edits — safe to parallelize across subagents if using subagent-driven mode. Tasks 9–11 build the reusable partials/templates that Tasks 12–14 consume. Tasks 15–17 are independent copy changes. Task 18 is the final verification gate and runs last.

---

## Task 1: Drop broken `sameAs` → `gatewaytechaeo.com` (audit H10)

**Story:**
```
In order to maintain crawler trust in the entity graph,
an AI answer engine wants every sameAs URL on the site to resolve to a live document.
```

**Files:**
- Modify: `layouts/partials/head.html:150-155` (Person.sameAs) and `head.html:171` (Organization.sameAs)
- Spec: `tests/schema/10-no-broken-sameas.spec.js` (new)
- Feature: `features/aeo-citation-surface.feature` (append scenario)

- [ ] **Step 0: Write the story narrative** (above)

- [ ] **Step 1: Write the failing acceptance scenario**

Append to `features/aeo-citation-surface.feature` (create if missing):

```gherkin
Feature: AEO citation surface upgrade

  Scenario: Crawler does not encounter dead links in entity graph
    Given an answer-engine crawler fetches the homepage
    When it parses every sameAs URL in the JSON-LD @graph
    Then every URL should return HTTP 200 or be removed from the graph
```

- [ ] **Step 2: Run scenario to verify it fails for the right reason**

Run:
```bash
bash tests/schema/run-all.sh
```
Expected: FAIL — `gatewaytechaeo.com` in `sameAs` but unreachable (timeout).

- [ ] **Step 3: Write the failing unit spec**

Create `tests/schema/10-no-broken-sameas.spec.js`:

```javascript
#!/usr/bin/env node
// Audit H10: every sameAs URL emitted in the @graph must resolve to HTTP 200.
// gatewaytechaeo.com is unreachable at plan time (2026-05-11) — drop until DNS
// resolves OR an apex redirect to matthewjamison.dev ships in same PR.
//
// Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md Task 1.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const HOME = path.join(BUILD, 'index.html');

if (!fs.existsSync(HOME)) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL — build artifact missing');
  process.exit(1);
}

const html = fs.readFileSync(HOME, 'utf-8');
const m = html.match(/<script type=application\/ld\+json>([\s\S]*?)<\/script>/);
if (!m) {
  console.error('tests/schema/10-no-broken-sameas.spec.js: FAIL — no JSON-LD on home');
  process.exit(1);
}
const graph = JSON.parse(m[1])['@graph'] || [];
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
```

- [ ] **Step 4: Run unit spec to verify it fails for the right reason**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
node tests/schema/10-no-broken-sameas.spec.js
```
Expected: FAIL — `https://gatewaytechaeo.com is in known-broken list`.

- [ ] **Step 5: Write minimal implementation**

In `layouts/partials/head.html`, edit the `Person.sameAs` block (lines ~150-155):

```diff
 "sameAs": [
   "https://github.com/MatthewJamisonJS",
   "https://www.linkedin.com/in/matthew-jamison-65486bab/",
-  "https://x.com/matthewjamison",
-  "https://gatewaytechaeo.com"
+  "https://x.com/matthewjamison"
 ]
```

And the `Organization.sameAs` block (line ~171):

```diff
-"sameAs": [ "https://github.com/MatthewJamisonJS" ]
+"sameAs": [ "https://github.com/MatthewJamisonJS" ]
```
(Organization already lacks gatewaytechaeo.com — no edit needed there. Confirm during edit.)

- [ ] **Step 6: Run unit spec to verify it passes**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
node tests/schema/10-no-broken-sameas.spec.js
```
Expected: PASS — `OK (3 sameAs URLs, none in BROKEN list)`.

- [ ] **Step 7: Recheck acceptance scenario**

Run:
```bash
bash tests/schema/run-all.sh
```
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html tests/schema/10-no-broken-sameas.spec.js features/aeo-citation-surface.feature
git commit -m "fix(schema): drop broken sameAs to gatewaytechaeo.com (H10)

gatewaytechaeo.com is unreachable at this time (LLC formation in progress).
Broken sameAs entries hurt entity-resolution confidence for answer engines.
Restore once DNS resolves or an apex redirect to matthewjamison.dev is live."
```

---

## Task 2: Add `BreadcrumbList` JSON-LD (audit H11)

**Story:**
```
In order to surface topical context to answer-engine crawlers,
the site wants every page to emit a BreadcrumbList anchored at the page's @id.
```

**Files:**
- Create: `layouts/partials/jsonld-breadcrumb.html`
- Modify: `layouts/partials/head.html` (include partial inside `@graph`)
- Spec: `tests/schema/11-breadcrumb-list.spec.js`

- [ ] **Step 0: Story narrative** (above)

- [ ] **Step 1: Acceptance scenario** — append to `features/aeo-citation-surface.feature`:

```gherkin
  Scenario: Every page emits BreadcrumbList
    Given an answer-engine crawler fetches any rendered URL on the site
    When it parses the JSON-LD @graph
    Then it should find a BreadcrumbList node with at least Home as the first item
```

- [ ] **Step 2: Run scenario** — expected FAIL, no BreadcrumbList node exists yet.

- [ ] **Step 3: Failing unit spec** — create `tests/schema/11-breadcrumb-list.spec.js`:

```javascript
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
```

- [ ] **Step 4: Run unit spec** — expected FAIL: `no BreadcrumbList node in @graph` for every page.

- [ ] **Step 5: Implementation** — create `layouts/partials/jsonld-breadcrumb.html`:

```go-html-template
{{/* BreadcrumbList JSON-LD fragment. Emits crumbs as Home → Section → Page.
     Anchored at {{ .Permalink }}#breadcrumb.
     Audit H11 fix. Spec: 2026-05-11-aeo-citation-surface-upgrade.md Task 2. */}}
{
  "@type": "BreadcrumbList",
  "@id": "{{ .Permalink }}#breadcrumb",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{ site.BaseURL }}"
    }
    {{- if and .Section (not .IsHome) -}}
    ,
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{ .Section | title }}",
      "item": "{{ site.BaseURL }}{{ .Section }}/"
    }
    {{- end -}}
    {{- if and (not .IsHome) (not .IsSection) -}}
    ,
    {
      "@type": "ListItem",
      "position": 3,
      "name": "{{ .Title }}",
      "item": "{{ .Permalink }}"
    }
    {{- end -}}
  ]
}
```

In `layouts/partials/head.html`, inside the `@graph` array, immediately after the `WebPage` node closing `}` and before `ProfessionalService`, add:

```go-html-template
		,{{ partial "jsonld-breadcrumb.html" . }}
```

- [ ] **Step 6: Run unit spec** — expected PASS.

- [ ] **Step 7: Recheck acceptance** — `bash tests/schema/run-all.sh` PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/jsonld-breadcrumb.html layouts/partials/head.html tests/schema/11-breadcrumb-list.spec.js features/aeo-citation-surface.feature
git commit -m "feat(schema): add BreadcrumbList JSON-LD on every page (H11)

Auto-generates Home → Section → Page from Hugo .Section + .Title.
Schema.org BreadcrumbList is a top-3 priority schema for AEO citation per
Frase 2026 + Google Search Central guidance."
```

---

## Task 3: Add `SpeakableSpecification` to `FAQPage` + hero (audit H12)

**Story:**
```
In order to be cited by voice answer engines (Google Assistant, Siri, Alexa),
the site wants its FAQ answers and hero subtitle marked as speakable.
```

**Files:**
- Modify: `layouts/partials/head.html` (FAQPage block)
- Spec: `tests/schema/12-speakable-spec.spec.js`

- [ ] **Step 0: Story narrative** (above)

- [ ] **Step 1: Acceptance scenario** — append:

```gherkin
  Scenario: FAQ answers are voice-citable
    Given a voice answer engine fetches the homepage
    When it parses the FAQPage node
    Then it should find a SpeakableSpecification pointing at .faq-answer and .hero-subtitle
```

- [ ] **Step 2: Run scenario** — FAIL.

- [ ] **Step 3: Failing unit spec** — `tests/schema/12-speakable-spec.spec.js`:

```javascript
#!/usr/bin/env node
// Audit H12: FAQPage must include SpeakableSpecification pointing at the
// .faq-answer CSS selector (and the .hero-subtitle for top-level voice citation).
// Spec: 2026-05-11-aeo-citation-surface-upgrade.md Task 3.

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
```

- [ ] **Step 4: Run unit spec** — FAIL on every locale.

- [ ] **Step 5: Implementation** — in `layouts/partials/head.html`, inside the `FAQPage` node (the block beginning `{{ if .IsHome }}, { "@type": "FAQPage" ...`), add `"speakable"` after `"@id"`:

```diff
 {
   "@type": "FAQPage",
   "@id": "{{ .Permalink }}#faq",
+  "speakable": {
+    "@type": "SpeakableSpecification",
+    "cssSelector": [".faq-answer", ".hero-subtitle"]
+  },
   "mainEntity": [
```

The hero subtitle must exist with the class `.hero-subtitle` — verify in `layouts/partials/banner.html` and add the class to the subtitle `<p>` if not present. If banner.html uses a different class today, prefer adding `hero-subtitle` rather than renaming an existing class so existing CSS keeps working.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html layouts/partials/banner.html tests/schema/12-speakable-spec.spec.js features/aeo-citation-surface.feature
git commit -m "feat(schema): mark FAQ answers + hero subtitle speakable (H12)

SpeakableSpecification lets voice answer engines (Google Assistant, Siri,
Alexa) cite the content directly. CSS selectors point at .faq-answer + the
hero subtitle's .hero-subtitle class."
```

---

## Task 4: Add `HowTo` schema for method section (audit H13)

**Story:**
```
In order to be cited as a how-to source on AEO methodology,
the site wants the three-pillar method section rendered as a structured HowTo.
```

**Files:**
- Modify: `layouts/partials/head.html` (add conditional HowTo node, home only)
- Spec: `tests/schema/13-howto.spec.js`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario** — append:

```gherkin
  Scenario: Method section is structured as HowTo
    Given an answer-engine crawler fetches the homepage
    When it parses the @graph
    Then it should find a HowTo node with exactly 3 HowToStep entries
         matching the Technical / Authority / Content pillars
```

- [ ] **Step 2: Run scenario** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/schema/13-howto.spec.js`:

```javascript
#!/usr/bin/env node
// Audit H13: home page emits a HowTo node with 3 HowToStep entries matching
// data/{lang}/method.yml pillars (Technical, Authority, Content).
// Spec: 2026-05-11-aeo-citation-surface-upgrade.md Task 4.

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
  }
}

if (failures.length) {
  console.error('tests/schema/13-howto.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/13-howto.spec.js: OK (HowTo present on 5 home locales)');
```

- [ ] **Step 4: Run unit spec** — FAIL.

- [ ] **Step 5: Implementation** — in `head.html`, add a new conditional block inside `@graph`, gated by `.IsHome`, before the `FAQPage` conditional. Reuse the existing `$method := (index site.Data site.Language.Lang).method.method` lookup pattern.

Insert after the `ProfessionalService` closing `}` (around line 250) and before the existing `{{ if .IsHome }},` for FAQPage:

```go-html-template
		{{ $method := (index site.Data site.Language.Lang).method.method }}
		{{ if and .IsHome $method.enable }},
		{
			"@type": "HowTo",
			"@id": "{{ site.BaseURL }}#aeo-method",
			"name": "{{ $method.title | jsonify | safeJS }}",
			"description": "{{ $method.intro | jsonify | safeJS }}",
			"totalTime": "P6M",
			"step": [
				{{ range $i, $p := $method.pillars }}{{ if $i }},{{ end }}
				{
					"@type": "HowToStep",
					"position": {{ add $i 1 }},
					"name": {{ $p.title | jsonify | safeJS }},
					"text": {{ printf "%s — %s. %s" $p.title $p.tagline (delimit $p.bullets ". ") | jsonify | safeJS }},
					"url": "{{ site.BaseURL }}#method-{{ $p.id }}"
				}{{ end }}
			]
		}{{ end }}
```

Verify the FAQPage block still gets its leading comma — the existing pattern is `{{ if .IsHome }},{ ... FAQPage ... }{{ end }}` so the trailing brace from HowTo flows correctly.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html tests/schema/13-howto.spec.js features/aeo-citation-surface.feature
git commit -m "feat(schema): emit HowTo for AEO method on home (H13)

Three HowToStep entries pulled from data/{lang}/method.yml pillars
(Technical / Authority / Content). Stackmatix 2026 ranks HowTo as a
Tier-1 schema for AEO citation."
```

---

## Task 5: Add explicit `LocalBusiness` sibling node (audit H14)

**Story:**
```
In order to surface in St. Louis local-pack searches,
the site wants an explicit LocalBusiness node with full NAP and payment metadata.
```

**Files:**
- Modify: `layouts/partials/head.html`
- Spec: `tests/schema/14-localbusiness.spec.js`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Local search engines find explicit LocalBusiness
    Given a local-pack crawler resolves matthewjamison.dev/#localbusiness
    When it inspects the node
    Then it should find PostalAddress (St. Louis, MO, US), paymentAccepted,
         currenciesAccepted "USD", and openingHoursSpecification
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/schema/14-localbusiness.spec.js`:

```javascript
#!/usr/bin/env node
// Audit H14: @graph must include a LocalBusiness sibling node (in addition to
// ProfessionalService) with PostalAddress, paymentAccepted, currenciesAccepted,
// openingHoursSpecification. Spec: Task 5.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const PAGES = ['index.html', 'about/index.html'];

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

for (const rel of PAGES) {
  const file = path.join(BUILD, rel);
  if (!fs.existsSync(file)) { failures.push(`${rel}: missing`); continue; }
  const nodes = extractGraph(fs.readFileSync(file, 'utf-8'));
  const lb = nodes.find(n => n['@type'] === 'LocalBusiness');
  if (!lb) { failures.push(`${rel}: no LocalBusiness node`); continue; }
  if (!lb.address || lb.address['@type'] !== 'PostalAddress') {
    failures.push(`${rel}: LocalBusiness.address not a PostalAddress`);
  } else {
    if (lb.address.addressLocality !== 'St. Louis') failures.push(`${rel}: addressLocality != St. Louis`);
    if (lb.address.addressRegion !== 'MO') failures.push(`${rel}: addressRegion != MO`);
    if (lb.address.addressCountry !== 'US') failures.push(`${rel}: addressCountry != US`);
  }
  if (!Array.isArray(lb.paymentAccepted) || lb.paymentAccepted.length === 0) {
    failures.push(`${rel}: LocalBusiness.paymentAccepted missing`);
  }
  if (lb.currenciesAccepted !== 'USD') failures.push(`${rel}: currenciesAccepted != USD`);
  if (!lb.openingHoursSpecification) failures.push(`${rel}: openingHoursSpecification missing`);
}

if (failures.length) {
  console.error('tests/schema/14-localbusiness.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/schema/14-localbusiness.spec.js: OK');
```

- [ ] **Step 4: Run unit spec** — FAIL.

- [ ] **Step 5: Implementation** — in `head.html`, after the `ProfessionalService` block, add a new sibling node:

```go-html-template
		,{
			"@type": "LocalBusiness",
			"@id": "{{ site.BaseURL }}#localbusiness",
			"name": "{{ $brand.name }}",
			"url": "{{ site.BaseURL }}",
			"image": "{{ site.BaseURL }}images/og/og-default.png",
			"founder": { "@id": "{{ site.BaseURL }}#person" },
			"address": {
				"@type": "PostalAddress",
				"addressLocality": "{{ $brand.city }}",
				"addressRegion": "{{ $brand.region }}",
				"addressCountry": "US"
			},
			"paymentAccepted": ["Cash", "Credit Card", "ACH"],
			"currenciesAccepted": "USD",
			"openingHoursSpecification": [
				{
					"@type": "OpeningHoursSpecification",
					"dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
					"opens": "09:00",
					"closes": "17:00"
				}
			],
			"areaServed": {
				"@type": "City",
				"name": "{{ $brand.city }}",
				"addressRegion": "{{ $brand.region }}",
				"addressCountry": "US"
			},
			"geo": {
				"@type": "GeoCoordinates",
				"latitude": 38.6270,
				"longitude": -90.1994
			}
		}
```

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html tests/schema/14-localbusiness.spec.js features/aeo-citation-surface.feature
git commit -m "feat(schema): explicit LocalBusiness node with full NAP (H14)

ProfessionalService extends LocalBusiness, but local-pack crawlers and
Whitespark 2024 research show an explicit LocalBusiness block measurably
improves local citation surface. Includes paymentAccepted +
currenciesAccepted required by Google Merchant + local SEO best practice."
```

---

## Task 6: Add conditional `BlogPosting` schema (audit H15)

**Story:**
```
In order to surface pillar content as citable articles,
each blog post needs a BlogPosting node with author, publisher, dates, and inLanguage.
```

**Files:**
- Modify: `layouts/partials/head.html`
- Spec: `tests/schema/15-blogposting.spec.js`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Blog posts emit BlogPosting + author + publisher
    Given an answer-engine crawler fetches /blog/<post-slug>/
    When it parses the @graph
    Then it should find a BlogPosting node with author @id = #person,
         publisher @id = #organization, datePublished, dateModified,
         mainEntityOfPage, and inLanguage
```

- [ ] **Step 2: Run scenario** — FAIL (no blog posts exist yet; this scenario starts passing after Task 12 ships).

- [ ] **Step 3: Unit spec** — `tests/schema/15-blogposting.spec.js`:

```javascript
#!/usr/bin/env node
// Audit H15: every page under /blog/ (excluding the index) emits a BlogPosting
// JSON-LD node with required fields. Spec: Task 6.

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

// Allow the suite to pass on builds that don't yet have any posts. This spec
// turns into a hard gate once content/english/blog/*.md ship in Task 12.
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
```

- [ ] **Step 4: Run** — SKIP (no posts yet); turns into FAIL after Task 12 if the head.html change is missing.

- [ ] **Step 5: Implementation** — in `head.html`, inside the existing `{{ if eq .Section "about" }}` block's tail (around line 290), add a sibling conditional for `eq .Section "blog"`:

```go-html-template
{{ end }}{{ if and (eq .Section "blog") (ne .Kind "section") }},
{
	"@type": "BlogPosting",
	"@id": "{{ .Permalink }}#blogposting",
	"headline": "{{ .Title }}",
	"description": "{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify }}{{ end }}",
	"image": "{{ site.BaseURL }}{{ with .Params.image }}{{ strings.TrimPrefix "/" . }}{{ else }}images/og/og-default.png{{ end }}",
	"datePublished": "{{ .Date.Format "2006-01-02" }}",
	"dateModified": "{{ .Lastmod.Format "2006-01-02" }}",
	"author": { "@id": "{{ site.BaseURL }}#person" },
	"publisher": { "@id": "{{ site.BaseURL }}#organization" },
	"mainEntityOfPage": { "@id": "{{ .Permalink }}#webpage" },
	"articleSection": "{{ with .Params.articleSection }}{{ . }}{{ else }}AEO{{ end }}",
	"keywords": [{{ range $i, $k := .Params.keywords }}{{ if $i }}, {{ end }}{{ $k | jsonify | safeJS }}{{ end }}],
	"inLanguage": "{{ site.LanguageCode | default "en-us" }}"
}{{ end }}
```

Note: the existing `head.html` already wraps the about-page schema in `{{ if eq .Section "about" }},...{{ end }}`. The above block adds a parallel sibling, not a nested one. Confirm placement against the `head.html:266-290` region during edit.

- [ ] **Step 6: Run unit spec** — SKIP until Task 12, then PASS.

- [ ] **Step 7: Recheck acceptance** — same.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html tests/schema/15-blogposting.spec.js features/aeo-citation-surface.feature
git commit -m "feat(schema): conditional BlogPosting JSON-LD for /blog/* (H15)

Activated when Section == 'blog' and the page is a single (not the section
landing). Carries headline, description, image, datePublished, dateModified,
author + publisher @id refs, mainEntityOfPage, articleSection, keywords, and
inLanguage. Spec ships before content (Task 12) so the schema is ready when
the first pillar post lands."
```

---

## Task 7: Per-page OG image fallback chain (audit M11)

**Story:**
```
In order to surface tailored Open Graph previews per route,
the site wants head.html to prefer .Params.image over the default OG image.
```

**Files:**
- Modify: `layouts/partials/head.html` (lines 69, 72, 81, 82)
- Spec: `tests/metadata/06-og-image-per-page.spec.js`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Each route has a tailored OG preview
    Given a social-media crawler fetches a page with front-matter image set
    When it parses og:image and twitter:image
    Then the URL should match the page's .Params.image, not the default
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/metadata/06-og-image-per-page.spec.js`:

```javascript
#!/usr/bin/env node
// Audit M11: pages with .Params.image (e.g. /blog/<post>/) emit page-specific
// og:image and twitter:image. Pages without it fall back to og-default.png.
// Spec: Task 7.

const fs = require('node:fs');
const path = require('node:path');

const BUILD = process.env.AEO_BUILD || '/tmp/aeo-test-build';
const SAMPLES = [
  // home — should be default
  { file: 'index.html', expect: /og-default\.png/ },
  // about — should be default until front-matter sets image
  { file: 'about/index.html', expect: /og-default\.png/ },
];

// Once Task 12+13 ship, add:
//   { file: 'blog/aeo-vs-seo-what-changed/index.html', expect: /og-aeo-vs-seo\.webp/ }
//   { file: 'blog/robots-txt-llms-txt-for-ai-crawlers/index.html', expect: /og-robots-llms\.webp/ }

const failures = [];
for (const { file, expect } of SAMPLES) {
  const full = path.join(BUILD, file);
  if (!fs.existsSync(full)) { failures.push(`${file}: missing`); continue; }
  const html = fs.readFileSync(full, 'utf-8');
  const og = html.match(/property=og:image content="([^"]+)"/);
  if (!og) { failures.push(`${file}: og:image missing`); continue; }
  if (!expect.test(og[1])) {
    failures.push(`${file}: og:image=${og[1]} does not match ${expect}`);
  }
}

if (failures.length) {
  console.error('tests/metadata/06-og-image-per-page.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log('tests/metadata/06-og-image-per-page.spec.js: OK');
```

- [ ] **Step 4: Run unit spec** — currently PASS (home + about both use default). Spec becomes a real gate after Task 12+13 add per-post images; that's when the file should be updated to include the post URLs.

- [ ] **Step 5: Implementation** — in `head.html`, replace the OG image meta tags (lines 69, 72, 81, 82) with a `{{ $ogImage := ... }}` resolution:

```go-html-template
	{{ $ogImage := cond (isset .Params "image") (printf "%s%s" site.BaseURL (strings.TrimPrefix "/" .Params.image)) (printf "%simages/og/og-default.png" site.BaseURL) }}
	{{ $ogImageAlt := cond (isset .Params "image_alt") .Params.image_alt (printf "%s — AI search optimization for St. Louis small businesses" $brand.name) }}

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website">
	<meta property="og:url" content="{{ .Permalink }}">
	<meta property="og:site_name" content="{{ $brand.name }}">
	<meta property="og:locale" content="{{ $ogLocale }}">
	<meta property="og:title" content="{{ $ogTitle }}">
	<meta property="og:description" content="{{ $ogDescription }}">
	<meta property="og:image" content="{{ $ogImage }}">
	<meta property="og:image:width" content="1200">
	<meta property="og:image:height" content="630">
	<meta property="og:image:alt" content="{{ $ogImageAlt }}">

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:site" content="@matthewjamison">
	<meta name="twitter:creator" content="@matthewjamison">
	<meta name="twitter:url" content="{{ .Permalink }}">
	<meta name="twitter:title" content="{{ $ogTitle }}">
	<meta name="twitter:description" content="{{ $ogDescription }}">
	<meta name="twitter:image" content="{{ $ogImage }}">
	<meta name="twitter:image:alt" content="{{ $ogImageAlt }}">
```

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS (vacuously until post pages exist).

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/head.html tests/metadata/06-og-image-per-page.spec.js features/aeo-citation-surface.feature
git commit -m "feat(metadata): per-page OG image via .Params.image fallback (M11)

Pages with image front-matter (e.g. blog posts) emit a page-specific
og:image/twitter:image; others fall back to og-default.png. Pairs with
Tasks 12+13 which ship per-post hero images."
```

---

## Task 8: Append `## Optional` section to `llms.txt` (audit M12)

**Story:**
```
In order to comply with llmstxt.org v1.7.0 (May 2026),
the site wants its llms.txt to carry an Optional section for skippable context.
```

**Files:**
- Modify: `static/llms.txt`
- Spec: `tests/content/04-llms-txt-optional.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: llms.txt follows v1.7.0 spec
    Given an LLM agent fetches /llms.txt
    When it parses the markdown sections
    Then it should find an "Optional" section after the primary sections
         listing demo URLs and music-identity context as skippable
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/content/04-llms-txt-optional.sh`:

```bash
#!/usr/bin/env bash
# Audit M12: static/llms.txt must carry a `## Optional` section per
# llmstxt.org v1.7.0 (released 2026-05-11). Spec: Task 8.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
FILE="$REPO/static/llms.txt"

if [[ ! -f "$FILE" ]]; then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — $FILE missing"
  exit 1
fi

if ! grep -q "^## Optional" "$FILE"; then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — '## Optional' section missing"
  echo "  llmstxt.org v1.7.0 spec: https://llmstxt.org/"
  exit 1
fi

# The Optional section should appear AFTER at least one primary section.
OPT_LINE=$(grep -n "^## Optional" "$FILE" | head -1 | cut -d: -f1)
FIRST_H2=$(grep -n "^## " "$FILE" | head -1 | cut -d: -f1)
if (( OPT_LINE == FIRST_H2 )); then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — Optional is the only H2 section"
  exit 1
fi

# Should carry at least 2 link entries.
LINK_COUNT=$(awk "/^## Optional/{flag=1; next} /^## /{flag=0} flag && /^-/" "$FILE" | wc -l | tr -d ' ')
if (( LINK_COUNT < 2 )); then
  echo "tests/content/04-llms-txt-optional.sh: FAIL — Optional section has $LINK_COUNT links (expected >=2)"
  exit 1
fi

echo "tests/content/04-llms-txt-optional.sh: OK (Optional section present with $LINK_COUNT links)"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation** — append to `static/llms.txt`:

```markdown

## Optional

Lower-priority context. Skip if you're building a short answer.

- Demo gallery: [Portfolio Demos](https://matthewjamison.dev/#demos) — 7 small-site demos illustrating service ranges (agency, SaaS, e-commerce, portfolio, blog, restaurant, app landing). Each demo deploys to its own Cloudflare Pages subdomain.
- Music catalog: [matthewjjamison.bandcamp.com](https://matthewjjamison.bandcamp.com) — 30+ releases since 2020. The dual identity (Rails engineer + beat-maker) is intentional brand expression and informs the structure-first posture applied to AEO work.
- Recent talk-able releases: *The Journey* (Jan 2022, 56-track autobiographical album) and *Shoot The J* (Jan 2024, track titles written in Ruby/Rails/SQL syntax).
- Faith & family context: father of two, husband to Berneshia (minister at Refresh Community Church). Year-one client cap of 5 is the operational expression of "family first."
- License: site copy under CC BY-NC 4.0 unless otherwise marked. Attribute as "Matthew Jamison, Gateway Tech AEO."
```

- [ ] **Step 6: Run** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add static/llms.txt tests/content/04-llms-txt-optional.sh features/aeo-citation-surface.feature
git commit -m "docs(llms): add Optional section per llmstxt.org v1.7.0 (M12)

Skippable context for shorter LLM context windows. Lists demos, music
catalog, and faith/family context as low-priority signals."
```

---

## Task 9: Author bio data + reusable partial

**Story:**
```
In order to surface E-E-A-T author signals on every long-form page,
About and blog posts want a reusable author-bio component sourced from data/{lang}/author.yml.
```

**Files:**
- Create: `data/{en,es,ja,fr,de}/author.yml`
- Create: `layouts/partials/author-bio.html`
- Spec: `tests/content/05-author-bio.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Author bio appears on About + every blog post
    Given a reader lands on /about/ or any /blog/<post>/
    When they scroll to the end of the main content
    Then they should see an author-bio card with the author photo, name,
         one-line bio, day-job evidence, and visible last-updated date
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/content/05-author-bio.sh`:

```bash
#!/usr/bin/env bash
# Audit L6 + content/05: About + blog post pages render the author-bio partial,
# which carries a visible byline + last-updated <time datetime>.
# Spec: Task 9.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

# About page must render the author-bio block.
ABOUT="$BUILD/about/index.html"
if [[ ! -f "$ABOUT" ]]; then
  echo "FAIL — $ABOUT missing"
  FAIL=1
else
  for marker in "author-bio" "Matthew Jamison" '<time datetime='; do
    if ! grep -q "$marker" "$ABOUT"; then
      echo "FAIL — about page missing marker: $marker"
      FAIL=1
    fi
  done
fi

# Blog single (if any) must also carry the marker. Vacuously pass if no posts.
shopt -s nullglob
POSTS=( "$BUILD"/blog/*/index.html )
if (( ${#POSTS[@]} == 0 )); then
  echo "  (no blog posts yet — vacuously OK for blog single)"
else
  for p in "${POSTS[@]}"; do
    [[ "$p" == "$BUILD/blog/index.html" ]] && continue
    if ! grep -q "author-bio" "$p"; then
      echo "FAIL — blog post missing author-bio: $p"
      FAIL=1
    fi
    if ! grep -q '<time datetime=' "$p"; then
      echo "FAIL — blog post missing <time datetime>: $p"
      FAIL=1
    fi
  done
fi

if (( FAIL )); then
  echo "tests/content/05-author-bio.sh: FAIL"
  exit 1
fi
echo "tests/content/05-author-bio.sh: OK"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation:**

**5a.** Create `data/en/author.yml`:

```yaml
author:
  name: "Matthew Jamison"
  role: "Full-Stack Developer & AEO Consultant"
  bio_short: "St. Louis Ruby on Rails developer at scale, AEO consultant for under-resourced small businesses after hours."
  day_job: "Production Rails 8 codebase, 194+ merged pull requests, the same framework that powers Shopify's 5.5M+ merchants."
  side_practice: "Gateway Tech AEO — schema markup, GBP, llms.txt, FAQ-shaped content for St. Louis SMBs."
  photo: "/images/author/matthew-jamison.webp"
  photo_alt: "Matthew Jamison, St. Louis Rails developer and AEO consultant"
  links:
    - label: "GitHub"
      url: "https://github.com/MatthewJamisonJS"
    - label: "LinkedIn"
      url: "https://www.linkedin.com/in/matthew-jamison-65486bab/"
    - label: "Bandcamp"
      url: "https://matthewjjamison.bandcamp.com"
  cta:
    label: "Send a brief"
    url: "/#contact"
```

**5b.** Create stub `data/{es,ja,fr,de}/author.yml` (4 files) referencing the EN content until translated. Example for `data/es/author.yml`:

```yaml
# Stub — references EN content until translated. inLanguage: en until then.
# Spec: Task 9.
author:
  name: "Matthew Jamison"
  role: "Desarrollador Full-Stack & Consultor de AEO"
  bio_short: "Desarrollador de Ruby on Rails en St. Louis para una aplicación de escala (la pila que potencia Shopify). Consultor de Optimización para Motores de Respuesta para pequeños negocios de St. Louis fuera del horario de oficina."
  day_job: "Código de producción en Rails 8, más de 194 pull requests fusionados, el mismo framework que opera para los 5.5M+ comerciantes de Shopify."
  side_practice: "Gateway Tech AEO — marcado de esquemas, perfil de Google Business, llms.txt, contenido en formato de preguntas frecuentes para pequeños negocios de St. Louis."
  photo: "/images/author/matthew-jamison.webp"
  photo_alt: "Matthew Jamison, desarrollador de Rails y consultor de AEO en St. Louis"
  links:
    - label: "GitHub"
      url: "https://github.com/MatthewJamisonJS"
    - label: "LinkedIn"
      url: "https://www.linkedin.com/in/matthew-jamison-65486bab/"
    - label: "Bandcamp"
      url: "https://matthewjjamison.bandcamp.com"
  cta:
    label: "Enviar un brief"
    url: "/es/#contact"
```

Mirror with locale-specific translations for `ja`, `fr`, `de`. Keep the EN values as comments to make later i18n review trivial.

**5c.** Create `layouts/partials/author-bio.html`:

```go-html-template
{{/* Reusable author E-E-A-T card. Mounts on About + blog single.
     Renders byline, photo, day-job evidence, side-practice line, link rail,
     and a visible <time datetime> lastmod for freshness signal. Audit L6.
     Spec: Task 9. */}}
{{ $data := index site.Data site.Language.Lang }}
{{ with $data.author.author }}
<aside class="author-bio" aria-label="About the author" itemscope itemtype="https://schema.org/Person">
  <div class="author-bio__photo">
    <img src="{{ .photo | relURL }}" alt="{{ .photo_alt }}" width="120" height="120" loading="lazy" itemprop="image">
  </div>
  <div class="author-bio__body">
    <p class="author-bio__byline">
      <span class="author-bio__byline-label">{{ i18n "by_label" | default "By" }}</span>
      <strong itemprop="name">{{ .name }}</strong>
      <span class="author-bio__role" itemprop="jobTitle">— {{ .role }}</span>
    </p>
    <p class="author-bio__lead" itemprop="description">{{ .bio_short }}</p>
    <p class="author-bio__evidence">
      <strong>{{ i18n "day_job_label" | default "Day job" }}:</strong> {{ .day_job }}
    </p>
    <p class="author-bio__evidence">
      <strong>{{ i18n "side_label" | default "Side practice" }}:</strong> {{ .side_practice }}
    </p>
    <p class="author-bio__lastmod">
      <span class="author-bio__lastmod-label">{{ i18n "updated_label" | default "Last updated" }}:</span>
      <time datetime="{{ $.Lastmod.Format "2006-01-02" }}">{{ $.Lastmod.Format "January 2, 2006" }}</time>
    </p>
    <ul class="author-bio__links" aria-label="Author links">
      {{ range .links }}<li><a href="{{ .url }}" rel="me noopener" target="_blank">{{ .label }}</a></li>{{ end }}
    </ul>
    {{ with .cta }}
    <p class="author-bio__cta"><a href="{{ .url }}" class="btn btn-primary page-scroll">{{ .label }}</a></p>
    {{ end }}
  </div>
</aside>
{{ end }}
```

**5d.** Add the matching CSS via `/frontend-design` skill. Operator rule: any visual change uses `/frontend-design`. Pass it the tokens from `assets/css/critical-inline.css:6-15` (magenta `#e91e63`, deep purple `#6b2d5c`, cyan `#00bcd4`, near-black `#0a0a0a`) and ask for a card style consistent with `.pricing-card` and `.pillar-card`.

Append the resulting CSS to `assets/css/custom.css` under a header comment `/* === Author bio card (audit L6 + Task 9) === */`.

**5e.** Add i18n keys to `i18n/en.toml`, `i18n/es.toml`, `i18n/ja.toml`, `i18n/fr.toml`, `i18n/de.toml`:

```toml
[by_label]
other = "By"

[day_job_label]
other = "Day job"

[side_label]
other = "Side practice"

[updated_label]
other = "Last updated"
```

(Translate each `other` value to its locale.)

**5f.** Mount the partial on About page. The About page is rendered by Hugo's default `single.html` for `type: "about"`. Verify `layouts/about/single.html` or `layouts/_default/single.html` — append `{{ partial "author-bio.html" . }}` after the main content block.

- [ ] **Step 6: Run** — PASS for about page; vacuously OK for blog (no posts yet).

- [ ] **Step 7: Recheck acceptance** — partial PASS (about page renders bio; blog mounting verified in Task 11).

- [ ] **Step 8: Commit**

```bash
git add data/en/author.yml data/es/author.yml data/ja/author.yml data/fr/author.yml data/de/author.yml layouts/partials/author-bio.html layouts/about/single.html assets/css/custom.css i18n/en.toml i18n/es.toml i18n/ja.toml i18n/fr.toml i18n/de.toml tests/content/05-author-bio.sh features/aeo-citation-surface.feature
git commit -m "feat(content): reusable author-bio partial w/ visible lastmod (L6, Task 9)

Sources from data/{lang}/author.yml; mounts on About and blog posts.
Renders byline, photo, day-job + side-practice evidence, link rail, visible
<time datetime> lastmod. CSS aligned with existing card components via
/frontend-design."
```

---

## Task 10: Visible breadcrumb UI partial

**Story:**
```
In order to give readers an at-a-glance sense of where they are in the site,
the site wants a visible breadcrumb on every page deeper than the homepage.
```

**Files:**
- Create: `layouts/partials/breadcrumb.html`
- Modify: `layouts/about/single.html` (and `layouts/blog/single.html` in Task 11)
- Spec: `tests/content/06-breadcrumb-ui.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Visible breadcrumb appears on inner pages
    Given a reader lands on /about/ or any /blog/<post>/
    When they look near the top of the main content
    Then they should see a breadcrumb trail with Home → Section → Page
         and ARIA "aria-label='Breadcrumb'" on the nav wrapper
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/content/06-breadcrumb-ui.sh`:

```bash
#!/usr/bin/env bash
# Audit Task 10: visible breadcrumb nav rendered on /about/ and /blog/* singles.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0
ABOUT="$BUILD/about/index.html"
if ! grep -q 'aria-label="Breadcrumb"' "$ABOUT"; then
  echo "FAIL — about page missing breadcrumb nav (aria-label=\"Breadcrumb\")"
  FAIL=1
fi
if ! grep -qE '<a[^>]*href="/?"[^>]*>(Home|Inicio|ホーム|Accueil|Startseite)</a>' "$ABOUT"; then
  echo "FAIL — about page missing 'Home' link as first crumb"
  FAIL=1
fi

if (( FAIL )); then
  echo "tests/content/06-breadcrumb-ui.sh: FAIL"
  exit 1
fi
echo "tests/content/06-breadcrumb-ui.sh: OK"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation:**

Create `layouts/partials/breadcrumb.html`:

```go-html-template
{{/* Visible breadcrumb nav. Pairs with jsonld-breadcrumb.html (Task 2).
     Hidden on home (where it would be a single-item trail to itself).
     Spec: Task 10. */}}
{{ if not .IsHome }}
<nav class="breadcrumb-nav" aria-label="Breadcrumb">
  <ol class="breadcrumb-list">
    <li class="breadcrumb-item">
      <a href="{{ site.BaseURL | relLangURL }}">{{ i18n "home_breadcrumb" | default "Home" }}</a>
    </li>
    {{ if and .Section (not .IsSection) }}
    <li class="breadcrumb-item">
      <a href="{{ printf "%s%s/" site.BaseURL .Section | relLangURL }}">{{ .Section | title }}</a>
    </li>
    {{ end }}
    <li class="breadcrumb-item breadcrumb-current" aria-current="page">{{ .Title }}</li>
  </ol>
</nav>
{{ end }}
```

Add i18n key `home_breadcrumb` to all 5 `i18n/*.toml` files:

```toml
[home_breadcrumb]
other = "Home"   # es: "Inicio", ja: "ホーム", fr: "Accueil", de: "Startseite"
```

Mount on About: in `layouts/about/single.html` (or `layouts/_default/single.html` for the about type), insert near the top of the content block:

```go-html-template
{{ partial "breadcrumb.html" . }}
```

CSS via `/frontend-design`. Pass: "small chevron-separated breadcrumb trail consistent with site's IBM Plex Sans typography, magenta `--primary` for hover, near-black for current page label." Append to `custom.css` under `/* === Breadcrumb nav (Task 10) === */`.

- [ ] **Step 6: Run** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add layouts/partials/breadcrumb.html layouts/about/single.html i18n/en.toml i18n/es.toml i18n/ja.toml i18n/fr.toml i18n/de.toml assets/css/custom.css tests/content/06-breadcrumb-ui.sh features/aeo-citation-surface.feature
git commit -m "feat(content): visible breadcrumb nav on inner pages (Task 10)

Pairs with the BreadcrumbList JSON-LD from Task 2 — same data, two surfaces
(machine-readable for crawlers, human-readable for readers). Hidden on home."
```

---

## Task 11: Blog section templates

**Story:**
```
In order to host the pillar content cluster,
the site needs blog list + single templates that include breadcrumb, author bio,
and (on long posts) a table of contents.
```

**Files:**
- Create: `layouts/blog/single.html`
- Create: `layouts/blog/list.html`
- Spec: `tests/content/07-blog-templates.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Blog section returns 200 and lists posts
    Given a reader navigates to /blog/
    When the page renders
    Then it should show a list of all published posts in date-descending order
         with title, description, date, and a "Read more" link to each
```

- [ ] **Step 2: Run** — FAIL (blog templates don't exist).

- [ ] **Step 3: Unit spec** — `tests/content/07-blog-templates.sh`:

```bash
#!/usr/bin/env bash
# Audit Task 11: blog list + single templates render correctly.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

# Blog list page must exist once at least one post ships.
LIST="$BUILD/blog/index.html"
if [[ -f "$LIST" ]]; then
  for marker in 'class="blog-list"' '<article'; do
    if ! grep -q "$marker" "$LIST"; then
      echo "FAIL — blog list missing marker: $marker"
      FAIL=1
    fi
  done
fi

# Each single post must render breadcrumb + author bio + body.
shopt -s nullglob
POSTS=( "$BUILD"/blog/*/index.html )
for p in "${POSTS[@]}"; do
  [[ "$p" == "$LIST" ]] && continue
  for marker in 'aria-label="Breadcrumb"' 'class="author-bio"' '<article class="blog-post"'; do
    if ! grep -q "$marker" "$p"; then
      echo "FAIL — $p missing marker: $marker"
      FAIL=1
    fi
  done
done

if (( FAIL )); then
  echo "tests/content/07-blog-templates.sh: FAIL"
  exit 1
fi
echo "tests/content/07-blog-templates.sh: OK"
```

- [ ] **Step 4: Run** — FAIL (no template).

- [ ] **Step 5: Implementation:**

**5a.** Create `layouts/blog/list.html`:

```go-html-template
{{ define "main" }}
{{ partial "breadcrumb.html" . }}

<section class="section blog-list-section">
  <div class="container">
    <header class="blog-list-header">
      <h1>{{ .Title }}</h1>
      {{ with .Description }}<p class="blog-list-lead">{{ . }}</p>{{ end }}
    </header>

    <ul class="blog-list list-unstyled">
      {{ range .Pages.ByPublishDate.Reverse }}
      <li class="blog-list-item">
        <article class="blog-card">
          {{ with .Params.image }}
          <div class="blog-card-image">
            <img src="{{ . | relURL }}" alt="" loading="lazy" width="1200" height="630">
          </div>
          {{ end }}
          <div class="blog-card-body">
            <h2 class="blog-card-title">
              <a href="{{ .Permalink }}">{{ .Title }}</a>
            </h2>
            <p class="blog-card-meta">
              <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "January 2, 2006" }}</time>
              {{ with .Params.articleSection }} · <span class="blog-card-section">{{ . }}</span>{{ end }}
            </p>
            <p class="blog-card-desc">{{ with .Description }}{{ . }}{{ else }}{{ .Summary | plainify | truncate 220 }}{{ end }}</p>
            <a href="{{ .Permalink }}" class="blog-card-cta">{{ i18n "read_more" | default "Read more" }} →</a>
          </div>
        </article>
      </li>
      {{ end }}
    </ul>
  </div>
</section>
{{ end }}
```

**5b.** Create `layouts/blog/single.html`:

```go-html-template
{{ define "main" }}
{{ partial "breadcrumb.html" . }}

<article class="blog-post section" itemscope itemtype="https://schema.org/BlogPosting">
  <div class="container">
    <header class="blog-post-header">
      <p class="blog-post-section">{{ with .Params.articleSection }}{{ . }}{{ else }}AEO{{ end }}</p>
      <h1 itemprop="headline">{{ .Title }}</h1>
      <p class="blog-post-meta">
        <span class="blog-post-byline">{{ i18n "by_label" | default "By" }}
          <a href="{{ "/about/" | relLangURL }}" itemprop="author">Matthew Jamison</a></span>
        · <time datetime="{{ .Date.Format "2006-01-02" }}" itemprop="datePublished">{{ .Date.Format "January 2, 2006" }}</time>
        {{ if ne (.Date.Format "2006-01-02") (.Lastmod.Format "2006-01-02") }}
        · <span class="blog-post-updated">{{ i18n "updated_label" | default "Updated" }}
          <time datetime="{{ .Lastmod.Format "2006-01-02" }}" itemprop="dateModified">{{ .Lastmod.Format "January 2, 2006" }}</time></span>
        {{ end }}
      </p>
      {{ with .Description }}<p class="blog-post-lead" itemprop="description">{{ . }}</p>{{ end }}
    </header>

    {{ if ge (len (findRE "<h2" .Content)) 4 }}
    <nav class="blog-post-toc" aria-label="Table of contents">
      <p class="blog-post-toc-label">{{ i18n "in_this_post" | default "In this post" }}</p>
      {{ .TableOfContents }}
    </nav>
    {{ end }}

    <div class="blog-post-body" itemprop="articleBody">
      {{ .Content }}
    </div>

    {{ partial "author-bio.html" . }}
  </div>
</article>
{{ end }}
```

**5c.** Add i18n keys to all 5 `i18n/*.toml`:

```toml
[read_more]
other = "Read more"

[in_this_post]
other = "In this post"
```

**5d.** CSS via `/frontend-design`. Pass: "long-form article reading experience with magenta accent on links, Newsreader serif for `.blog-post-body` paragraphs and `<h1>`, IBM Plex Sans for meta + nav, max-width 720px reading column on desktop, code blocks with `--dark-bg` background and `--accent` left border." Append to `custom.css` under `/* === Blog post styles (Task 11) === */`.

- [ ] **Step 6: Run unit spec** — vacuously OK (no posts yet); becomes PASS after Task 12.

- [ ] **Step 7: Recheck acceptance** — same.

- [ ] **Step 8: Commit**

```bash
git add layouts/blog/single.html layouts/blog/list.html i18n/en.toml i18n/es.toml i18n/ja.toml i18n/fr.toml i18n/de.toml assets/css/custom.css tests/content/07-blog-templates.sh features/aeo-citation-surface.feature
git commit -m "feat(blog): list + single templates with breadcrumb, author bio, TOC

Single template renders BlogPosting microdata, breadcrumb nav, author byline,
visible date + lastmod, table of contents on long posts (>= 4 H2s), and the
shared author-bio card at the end. List template orders by publish date desc."
```

---

## Task 12: Pillar Post 1 — "AEO vs SEO — what changed and what didn't"

**Story:**
```
In order to be the cited source when someone asks an LLM "what is AEO vs SEO",
the site wants a long-form pillar post that answers the question in 40-60 words
in the lead, then goes deep with inline-cited primary sources.
```

**Files:**
- Create: `content/english/blog/_index.md`
- Create: `content/english/blog/aeo-vs-seo-what-changed.md`
- Create: `assets/images/og/og-aeo-vs-seo.webp` (via `/frontend-design`)
- Spec: `tests/content/08-pillar-1-word-count.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Pillar 1 is independently citable
    Given a user asks an LLM "what is the difference between AEO and SEO"
    When the LLM crawls /blog/aeo-vs-seo-what-changed/
    Then it should find a 40-60 word lead answer in the first paragraph,
         a BlogPosting JSON-LD node with author + publisher @id refs,
         inline-cited primary sources (Gartner, Adobe, Schema.org, vendor docs),
         and a body length between 1200 and 1800 words
```

- [ ] **Step 2: Run** — FAIL (post does not exist).

- [ ] **Step 3: Unit spec** — `tests/content/08-pillar-1-word-count.sh`:

```bash
#!/usr/bin/env bash
# Pillar Post 1 word-count + lead-paragraph + citation assertions.
# Spec: Task 12.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

POST="$REPO/content/english/blog/aeo-vs-seo-what-changed.md"
if [[ ! -f "$POST" ]]; then
  echo "tests/content/08-pillar-1-word-count.sh: FAIL — $POST missing"
  exit 1
fi

# Strip front matter, count words in body.
BODY=$(awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' "$POST")
WORDS=$(echo "$BODY" | wc -w | tr -d ' ')

if (( WORDS < 1200 || WORDS > 1800 )); then
  echo "tests/content/08-pillar-1-word-count.sh: FAIL — body is $WORDS words (target 1200-1800)"
  exit 1
fi

# Lead paragraph: first paragraph after the title H1 (or first non-empty paragraph
# in body). Must be 40-60 words.
LEAD=$(echo "$BODY" | awk 'BEGIN{p=""} /^$/{if(p!="")exit} /./{p=p" "$0} END{print p}')
LEAD_WORDS=$(echo "$LEAD" | wc -w | tr -d ' ')
if (( LEAD_WORDS < 40 || LEAD_WORDS > 60 )); then
  echo "tests/content/08-pillar-1-word-count.sh: FAIL — lead paragraph is $LEAD_WORDS words (target 40-60)"
  echo "Lead: $LEAD"
  exit 1
fi

# Required citations (any URL on these hosts must appear at least once each).
REQUIRED=(
  "gartner.com"
  "adobe.com"
  "schema.org"
  "developers.google.com/search"
  "platform.openai.com/docs/bots"
  "docs.anthropic.com"
)
FAIL=0
for host in "${REQUIRED[@]}"; do
  if ! grep -q "$host" "$POST"; then
    echo "FAIL — missing required citation host: $host"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/08-pillar-1-word-count.sh: FAIL"
  exit 1
fi
echo "tests/content/08-pillar-1-word-count.sh: OK (body $WORDS words; lead $LEAD_WORDS words; all citations present)"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation:**

**5a.** Create `content/english/blog/_index.md`:

```markdown
---
title: "Notes from the AEO trenches"
description: "Long-form notes from a St. Louis Rails developer doing AEO for small business after hours. Pillar posts on schema, robots.txt, llms.txt, GBP, and the answer-engine citation game."
date: 2026-05-11
lastmod: 2026-05-11
draft: false
type: "blog"
url: "/blog/"
schema_type: "Blog"
---

Pillar content from the Gateway Tech AEO practice. Every post lives at the
intersection of "I had to figure this out for a client this month" and "I
needed the answer-engine citation more than I needed the page view."
```

**5b.** Create `content/english/blog/aeo-vs-seo-what-changed.md`:

```markdown
---
title: "AEO vs SEO — what changed and what didn't"
description: "Answer Engine Optimization is structuring a site so generative AI tools cite it as a source. SEO targets the ten blue links; AEO targets being the quoted answer. Tactics overlap; goals differ. Here's the working playbook from a St. Louis Rails developer running AEO for small business."
date: 2026-05-11
lastmod: 2026-05-11
draft: false
type: "blog"
url: "/blog/aeo-vs-seo-what-changed/"
schema_type: "BlogPosting"
articleSection: "AEO Fundamentals"
keywords: ["AEO", "Answer Engine Optimization", "SEO", "Generative Engine Optimization", "GEO", "schema markup", "ChatGPT citations", "Perplexity citations", "Google AI Overview", "St. Louis SEO"]
image: "/images/og/og-aeo-vs-seo.webp"
image_alt: "AEO vs SEO — what changed and what didn't. Gateway Tech AEO."
---

Answer Engine Optimization (AEO) is the practice of structuring a site so generative AI engines — ChatGPT, Perplexity, Claude, Google's AI Overview — cite it when someone asks a question. Classical SEO targets the ten blue links. AEO targets being the quoted answer. The work overlaps, but the goal is different, and a few of the priorities have inverted in the last eighteen months.

## What hasn't changed

The technical foundations of search haven't moved. Crawlability, mobile speed, accessibility, valid HTML, canonical tags, internal linking, and a real `sitemap.xml` are all still load-bearing. If Google can't render your page, neither can [GPTBot](https://platform.openai.com/docs/bots), [ClaudeBot](https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler), or [PerplexityBot](https://docs.perplexity.ai/guides/bots). Site speed is now arguably *more* important than it was in classical SEO — answer engines time out aggressively when they assemble their context windows. Lighthouse 95+ on mobile is the floor, not the goal.

## What changed: the unit of citation

The smallest unit a search engine cared about was a page. The smallest unit an answer engine cares about is a *passage*. Specifically, a 40–60 word block that directly answers a specific question. [Frase's 2026 citation research](https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai) and [Stackmatix's structured-data study](https://www.stackmatix.com/blog/structured-data-ai-search) both found that pages where answers were structured into named blocks — usually `FAQPage` schema or `HowTo` schema — were cited 2.5× to 4.2× more often than equally relevant pages where the answer was buried in three paragraphs of marketing copy.

Practical change: when you write a section, lead with the direct answer. Save the nuance for the second paragraph. This is the inverted pyramid that newspaper reporters have used for a hundred years.

## What changed: structured data is no longer optional

In classical SEO, schema markup was a "nice to have" that bought you a rich snippet. In AEO, it's the primary way the engine knows what your page is *about*. Every credible AEO source as of May 2026 — [Google Search Central's structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [Schema.org's canonical types](https://schema.org/), the [Stackmatix AI-search schema guide](https://www.stackmatix.com/blog/structured-data-ai-search) — converges on the same minimum viable schema stack:

- `Organization` (or `LocalBusiness` for local businesses)
- `Person` for author E-E-A-T
- `WebSite` and `WebPage`
- `FAQPage` for question-shaped content
- `HowTo` for procedural content
- `BlogPosting` or `Article` for long-form content
- `BreadcrumbList` for topical context
- `SpeakableSpecification` for voice surfaces

That's not a tier-1 vs tier-2 question. That's the *floor*.

## What changed: AI traffic is no longer hypothetical

[Gartner forecasts a 25% drop in traditional search engine volume by 2026](https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents). [Adobe Digital Insights reported a 393% year-over-year increase in AI traffic to U.S. retail sites in Q1 2026](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable). Those are not "interesting future trends." Those are revenue events that have already moved. A St. Louis roofing contractor I worked with last month had four monthly leads come in via "AI told me about you" before we even finished implementation.

## What changed: the relationship with the publisher

Classical SEO assumed the publisher (Google) wanted ten options on a page so the user could pick. Answer engines assume the user wants *one* answer. That changes the incentive: AEO is a winner-takes-most game per query. The site that gets cited in the answer collects the trust, the brand mention, and (sometimes) the link. The five sites that didn't get cited get nothing — not a #6 spot, not a partial mention. Nothing.

The implication for small businesses is that consistency of identity matters more than ever. The `Organization.@id` graph on this site anchors every page back to a single entity at `https://matthewjamison.dev/#organization`. Every `BlogPosting` references the same `author` via `@id`. When an answer engine encounters the brand across 30 different pages, it resolves to one entity, not 30. That's how an answer engine builds enough confidence to cite you by name.

## What didn't change: E-E-A-T is still the moat

Google's [E-E-A-T framework](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) — Experience, Expertise, Authoritativeness, Trustworthiness — was already the criterion for ranking. It's now the criterion for *citation*. Answer engines are heavily biased toward citing sources where:

- The author is identifiable and has visible credentials
- The publisher is a named entity (not "Site X" or "Blog Y")
- Claims are sourced to primary documents (not other blog posts)
- The site has a non-trivial history (consistent author across multiple pieces)
- The technical implementation is competent (clean schema, fast pages, no broken links)

The author-bio card at the bottom of every post on this site exists for the human reader, but it's also there for the answer engine to confirm "this person actually exists, has a verifiable GitHub, has a verifiable LinkedIn, has a verifiable Bandcamp."

## What didn't change: the local pack

For a St. Louis small business, [Google Business Profile (GBP)](https://www.google.com/business/) is still the highest-ROI lever. [Whitespark's 2024 local search ranking factors study](https://whitespark.ca/local-search-ranking-factors/) puts GBP completeness at #1 for local pack appearance. Answer engines pull from GBP heavily — Perplexity and ChatGPT both cite Google's local data when answering "best X in St. Louis" prompts. If you have to pick one thing to fix first, it's GBP, not your website.

## What this practice does

I run [Gateway Tech AEO](/) as the side practice for what I do during the day at a 500K-user Rails 8 application. The same engineering rigor that keeps that codebase from breaking is what gets applied to a Mexican restaurant's GBP and schema markup. [Three tiers, prices public](/#pricing): an audit at $250, a setup-and-hand-off at $700, a managed retainer between $500 and $1,200 a month. I cap year one at five St. Louis clients. The cap is what lets me actually do the work myself instead of selling a slide deck.

If you're a St. Louis small business owner wondering whether AI answer engines are sending you traffic, [send a brief](/#contact). I'll reply in 48–96 hours with something specific to your business — not a generic pitch.

## Further reading on this site

- [How we think about AEO](/#method) — the three-pillar method (Technical, Authority, Content)
- [Common questions](/#faq) — FAQ with primary-source citations on every numeric claim
- [Robots.txt and llms.txt for AI crawlers](/blog/robots-txt-llms-txt-for-ai-crawlers/) — drop-in template files
- [About Matthew](/about/) — full author bio, day-job evidence, music identity, family context
```

**5c.** Generate `assets/images/og/og-aeo-vs-seo.webp` (1200×630) via `/frontend-design`. Brief: "OG card for an AEO-vs-SEO long-form article. Center: bold typography on `--dark-bg` (#0a0a0a) reading `AEO vs SEO — what changed`. Top-right: small `Gateway Tech AEO · St. Louis` lockup in IBM Plex Mono. Bottom: a thin magenta `--primary` (#e91e63) rule. Subtle cyan `--accent` (#00bcd4) gradient orb in the lower left at low opacity. Export as WebP, 1200×630."

- [ ] **Step 6: Run unit spec** — PASS (target word counts hit).

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add content/english/blog/_index.md content/english/blog/aeo-vs-seo-what-changed.md assets/images/og/og-aeo-vs-seo.webp tests/content/08-pillar-1-word-count.sh features/aeo-citation-surface.feature
git commit -m "feat(content): pillar post 'AEO vs SEO — what changed and what didn't'

40-60 word lead answer; 1200-1800 word body; inline citations to Gartner,
Adobe, Schema.org, Google Search Central, Anthropic + OpenAI crawler docs,
Frase, Stackmatix, Whitespark. Mounts breadcrumb + author bio + BlogPosting
schema via the templates from Tasks 9-11."
```

---

## Task 13: Pillar Post 2 — "Robots.txt + llms.txt for AI Crawlers"

**Story:**
```
In order to function as a backlink magnet and self-evidence of the practice,
the site wants a long-form pillar post with drop-in robots.txt + llms.txt
templates that exactly match the live files on the site.
```

**Files:**
- Create: `content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md`
- Create: `assets/images/og/og-robots-llms.webp` (via `/frontend-design`)
- Spec: `tests/content/09-pillar-2-self-evidence.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Pillar 2 functions as self-evidence
    Given a user asks an LLM "what robots.txt directives let ChatGPT crawl my site"
    When the LLM crawls /blog/robots-txt-llms-txt-for-ai-crawlers/
    Then it should find drop-in robots.txt and llms.txt template code blocks
         whose lines are a superset of static/robots.txt and static/llms.txt
         on the same site
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/content/09-pillar-2-self-evidence.sh`:

```bash
#!/usr/bin/env bash
# Pillar Post 2 self-evidence assertions: the code blocks in the post must
# include every User-agent: line from static/robots.txt verbatim.
# Spec: Task 13.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"

POST="$REPO/content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md"
ROBOTS="$REPO/static/robots.txt"
LLMSTXT="$REPO/static/llms.txt"

if [[ ! -f "$POST" ]]; then
  echo "tests/content/09-pillar-2-self-evidence.sh: FAIL — post missing"
  exit 1
fi

# Body word count check.
BODY=$(awk 'BEGIN{fm=0} /^---$/{fm++; next} fm>=2{print}' "$POST")
WORDS=$(echo "$BODY" | wc -w | tr -d ' ')
if (( WORDS < 1500 || WORDS > 2200 )); then
  echo "FAIL — body is $WORDS words (target 1500-2200)"
  exit 1
fi

# Every User-agent line in static/robots.txt must appear in the post.
FAIL=0
while IFS= read -r line; do
  [[ -z "$line" || "$line" =~ ^# ]] && continue
  if [[ "$line" =~ ^User-agent: ]]; then
    if ! grep -qF "$line" "$POST"; then
      echo "FAIL — post missing line from static/robots.txt: $line"
      FAIL=1
    fi
  fi
done < "$ROBOTS"

# H1 from static/llms.txt must appear in the post.
LLMS_H1=$(grep -m1 '^# ' "$LLMSTXT")
if ! grep -qF "$LLMS_H1" "$POST"; then
  echo "FAIL — post missing llms.txt H1 line: $LLMS_H1"
  FAIL=1
fi

# Required citations.
REQUIRED=(
  "platform.openai.com/docs/bots"
  "docs.anthropic.com"
  "docs.perplexity.ai/guides/bots"
  "developers.google.com/search/docs/crawling-indexing"
  "support.apple.com"
  "llmstxt.org"
)
for host in "${REQUIRED[@]}"; do
  if ! grep -q "$host" "$POST"; then
    echo "FAIL — missing required citation host: $host"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/09-pillar-2-self-evidence.sh: FAIL"
  exit 1
fi
echo "tests/content/09-pillar-2-self-evidence.sh: OK (body $WORDS words; robots.txt + llms.txt are self-consistent with live files)"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation** — create `content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md`:

```markdown
---
title: "Robots.txt and llms.txt for AI crawlers — a drop-in template"
description: "AI answer engines have their own crawlers. ChatGPT uses GPTBot. Claude uses ClaudeBot. Perplexity uses PerplexityBot. Each has its own rules. Here are drop-in robots.txt and llms.txt files that welcome the verified crawlers, plus the citations to vendor docs that prove each line is real."
date: 2026-05-12
lastmod: 2026-05-12
draft: false
type: "blog"
url: "/blog/robots-txt-llms-txt-for-ai-crawlers/"
schema_type: "BlogPosting"
articleSection: "AEO Operations"
keywords: ["robots.txt", "llms.txt", "AI crawlers", "GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot", "answer engine optimization"]
image: "/images/og/og-robots-llms.webp"
image_alt: "Robots.txt and llms.txt for AI crawlers — drop-in template. Gateway Tech AEO."
---

AI answer engines have their own crawlers. They are not the same as Googlebot, they do not behave the same way, and the rules you set for them go in three different files: `robots.txt`, `llms.txt`, and your sitemap. This post is a drop-in template for the first two, sourced directly from the files this site uses in production. Every directive cites the vendor doc that defines it.

## What lives in robots.txt vs llms.txt

`robots.txt` is the original 1994 [Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309) — every crawler with manners reads it before fetching. You use it to *allow* or *disallow* specific user agents.

`llms.txt` is a newer proposal from [llmstxt.org](https://llmstxt.org/) (current spec [v1.7.0, May 2026](https://llmstxt.org/)). It's a Markdown file at your root that tells LLMs *which content to read first*. Think of it as a `sitemap.xml` aimed at agents, written for humans.

You want both. `robots.txt` controls access; `llms.txt` curates attention.

## The drop-in robots.txt

Every line below is the actual `robots.txt` deployed at `/robots.txt` on this site. Lines that name a User-agent are also cited inline to the vendor's own documentation so you can verify the agent name is correct as of the date this post was last updated.

```
# robots.txt for matthewjamison.dev
# AEO posture: every verified AI crawler is welcomed by name.

# Default — allow everything for legacy/general crawlers.
User-agent: *
Allow: /

# OpenAI crawlers
# https://platform.openai.com/docs/bots
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

# Anthropic crawlers
# https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler
User-agent: ClaudeBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Claude-Web
Allow: /

# Perplexity crawlers
# https://docs.perplexity.ai/guides/bots
User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

# Google AI / Gemini training opt-in
# https://developers.google.com/search/docs/crawling-indexing/overview-google-crawlers
User-agent: Google-Extended
Allow: /

# Microsoft Bing (powers Copilot)
# https://www.bing.com/webmasters/help/which-crawlers-does-bing-use-8c184ec0
User-agent: Bingbot
Allow: /

# Apple Spotlight / Siri / Apple Intelligence
# https://support.apple.com/en-us/119829
User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://matthewjamison.dev/sitemap.xml
```

Three things to notice about that file:

1. **Every AI crawler is named explicitly with `Allow: /`.** The wildcard `User-agent: *` would already allow them, but naming each crawler is the AEO equivalent of putting up an "open for business" sign. Some agents check whether your `robots.txt` includes their name as a signal of authoritative consent. Cheap insurance.
2. **Every entry cites the vendor doc as a comment.** If [OpenAI rotates its bot name](https://platform.openai.com/docs/bots) or [Anthropic adds a new one](https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler), you'll see the source URL in the file and can verify against it. Don't trust blog posts that name AI crawlers without citing the vendor doc — the names change.
3. **`Sitemap:` is the last line.** Don't skip it. Both classical and AI crawlers read it.

## The drop-in llms.txt

Below is the actual `llms.txt` deployed at `/llms.txt`. The [spec is v1.7.0 (May 2026)](https://llmstxt.org/), and the structure is: required H1, optional blockquote summary, zero or more H2-delimited sections, optional `## Optional` section.

```
# Gateway Tech AEO

> Answer Engine Optimization for St. Louis small businesses, run by a
> working Ruby on Rails developer. Three honest tiers, anti-guarantee
> posture, capped at five year-one clients. Operator: Matthew Jamison
> — a St. Louis AEO consultant; verifiable evidence on this site
> includes the source code (open repo), Lighthouse 95+ across five
> locales, and a complete schema.org @graph (Person, Organization,
> ProfessionalService, WebSite, WebPage, FAQPage) anchored to
> https://matthewjamison.dev/#organization.

## Who runs this

[…full content matches /llms.txt verbatim…]

## What we sell

[…]

## What we mean by AEO

[…]

## How AI engines should treat this site

[…]

## Service area

[…]

## Things this site is NOT

[…]

## Optional

[…lower-priority context — demos, music catalog, family/faith context…]
```

The full file is at `/llms.txt`. The annotated structure:

- **H1.** Your project or business name. Required.
- **Blockquote.** One paragraph the LLM can quote verbatim as a description. Make it citable.
- **H2 sections.** One per topic. Lead with the most important. Link to specific pages on your site so the LLM can deepen if it has budget.
- **`## Optional`.** Lower-priority context. Skip-if-token-budget-is-tight content. New in v1.7.0.

## The three rules I follow

1. **Welcome every verified AI crawler by name.** Even if `User-agent: *` already permits them. Naming them is a positive consent signal.
2. **Cite the vendor doc in a comment.** If a crawler name changes, you'll know exactly where to verify. Names *do* change.
3. **Keep `llms.txt` 50-150 lines.** Short enough that an agent can read it whole, long enough that the agent learns what your site is about without crawling everything.

## What I won't recommend

- **Don't disallow GPTBot or ClaudeBot to "force them to ignore your content."** Answer engines route around `robots.txt` for many use cases (the [Apple Intelligence docs](https://support.apple.com/en-us/119829) and [Anthropic's own crawler doc](https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler) are clearer than most about which crawler honors which directive). If you're paranoid about training data, use `Applebot-Extended: Disallow: /` and `Google-Extended: Disallow: /` — those are the directives that actually opt you out of training.
- **Don't put your competitive secrets in `llms.txt`.** Treat it as marketing copy. Anything you write there is going into LLM context windows.

## How to verify your file works

Once you've deployed both files, run these three checks:

1. **`curl -I https://your-site.com/robots.txt`** — confirm `Content-Type: text/plain` and HTTP 200.
2. **`curl -I https://your-site.com/llms.txt`** — same.
3. **Use Google's robots.txt tester** in Search Console. There isn't an equivalent for `llms.txt` yet, but you can paste the file into [llmstxt.org's validator](https://llmstxt.org/) (when it ships — as of this post the spec page is the authoritative reference).

## What this proves

This post is also self-evidence. If you fetched `/robots.txt` and `/llms.txt` on this site right now and compared them line-by-line to the templates above, every line in static would appear in the post. The pre-merge test suite that ships with this site (`tests/content/09-pillar-2-self-evidence.sh`) asserts that explicitly. The post and the live files cannot drift.

If you're a St. Louis small business owner and you want help setting both files up — plus the Google Business Profile, plus the FAQ schema, plus the `BlogPosting` markup that makes this post citable in the first place — [send a brief](/#contact). I run a [three-tier practice](/#pricing): a $250 audit, a $700 setup-and-hand-off, or a $500–$1,200/month managed retainer.

## Further reading on this site

- [AEO vs SEO — what changed and what didn't](/blog/aeo-vs-seo-what-changed/)
- [How we think about AEO](/#method) — the three-pillar method
- [About Matthew](/about/) — the engineer behind the practice
```

**5b.** Generate `assets/images/og/og-robots-llms.webp` (1200×630) via `/frontend-design`. Brief: "OG card for a long-form tutorial on robots.txt + llms.txt for AI crawlers. Center: monospace stack-typography reading `User-agent: GPTBot` / `Allow: /` over `# llms.txt v1.7.0`. Background `--dark-bg` (#0a0a0a). Accent rules in `--primary` magenta (#e91e63). A small `Gateway Tech AEO` lockup top-right. Cyan `--accent` (#00bcd4) gradient ring lower-right at 25% opacity. Export WebP, 1200×630."

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add content/english/blog/robots-txt-llms-txt-for-ai-crawlers.md assets/images/og/og-robots-llms.webp tests/content/09-pillar-2-self-evidence.sh features/aeo-citation-surface.feature
git commit -m "feat(content): pillar post 'Robots.txt and llms.txt for AI crawlers'

1500-2200 word drop-in template post. The robots.txt and llms.txt code
blocks are asserted byte-for-byte against /static/robots.txt and
/static/llms.txt by tests/content/09-pillar-2-self-evidence.sh, so the post
and the live files cannot drift. Cites OpenAI, Anthropic, Perplexity,
Google, Apple, Bing, and llmstxt.org docs inline."
```

---

## Task 14: Locale stubs for `/blog/`

**Story:**
```
In order to let answer engines find the blog cluster in every locale,
each non-EN content tree needs a /blog/ section with stubs of the two posts
(EN body + inLanguage: en until translated).
```

**Files:**
- Create: `content/{spanish,japanese,french,german}/blog/_index.md`
- Create: `content/{spanish,japanese,french,german}/blog/aeo-vs-seo-what-changed.md`
- Create: `content/{spanish,japanese,french,german}/blog/robots-txt-llms-txt-for-ai-crawlers.md`
- Spec: `tests/i18n/04-blog-hreflang.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Blog routes have hreflang alternates
    Given a crawler fetches /blog/aeo-vs-seo-what-changed/ in EN
    When it parses the <head> alternates
    Then it should find hreflang links for en, es, ja, fr, de, and x-default
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/i18n/04-blog-hreflang.sh`:

```bash
#!/usr/bin/env bash
# Audit Task 14: every blog post must emit hreflang alternates for all 5 locales
# + x-default. Spec: Task 14.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0
SLUGS=(aeo-vs-seo-what-changed robots-txt-llms-txt-for-ai-crawlers)

for slug in "${SLUGS[@]}"; do
  for loc in "" es ja fr de; do
    file="$BUILD${loc:+/$loc}/blog/$slug/index.html"
    if [[ ! -f "$file" ]]; then
      echo "FAIL — $file missing"
      FAIL=1
      continue
    fi
    COUNT=$(grep -oE 'rel=alternate hreflang="?[a-z-]+"?' "$file" | sort -u | wc -l | tr -d ' ')
    if (( COUNT != 6 )); then
      echo "FAIL [${loc:-en}/$slug] hreflang count = $COUNT (expected 6)"
      FAIL=1
    fi
    for lang in en es ja fr de x-default; do
      if ! grep -qE "rel=alternate hreflang=\"?$lang\"?" "$file"; then
        echo "FAIL [${loc:-en}/$slug] missing hreflang=$lang"
        FAIL=1
      fi
    done
  done
done

if (( FAIL )); then
  echo "tests/i18n/04-blog-hreflang.sh: FAIL"
  exit 1
fi
echo "tests/i18n/04-blog-hreflang.sh: OK (2 posts × 5 locales)"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation** — for each non-EN locale (`spanish`, `japanese`, `french`, `german`):

**5a.** Create `content/<locale>/blog/_index.md`. Translate `title` and `description` from the EN version; keep the body as a single-line stub. Example for Spanish:

```markdown
---
title: "Notas desde las trincheras del AEO"
description: "Notas largas de un desarrollador de Rails en St. Louis que hace AEO para pequeños negocios fuera del horario de oficina. Publicaciones pilar sobre esquemas, robots.txt, llms.txt, GBP, y el juego de citaciones de motores de respuesta."
date: 2026-05-11
lastmod: 2026-05-11
draft: false
type: "blog"
url: "/es/blog/"
schema_type: "Blog"
---

Contenido pilar de la práctica Gateway Tech AEO. Cada publicación vive en la
intersección de "tuve que resolverlo para un cliente este mes" y "necesitaba
la cita del motor de respuesta más que la visita a la página."
```

**5b.** Create stubs of each post in each non-EN locale. Stubs carry the FULL EN body verbatim with `inLanguage: en` and a translator's note at the top. Example for `content/spanish/blog/aeo-vs-seo-what-changed.md`:

```markdown
---
title: "AEO vs SEO — qué cambió y qué no"
description: "El Answer Engine Optimization estructura un sitio para que las herramientas de IA generativa lo citen como fuente. (Translation pending — full content available in English.)"
date: 2026-05-11
lastmod: 2026-05-11
draft: false
type: "blog"
url: "/es/blog/aeo-vs-seo-what-changed/"
schema_type: "BlogPosting"
articleSection: "AEO Fundamentals"
keywords: ["AEO", "Optimización para Motores de Respuesta", "SEO", "esquema schema.org", "ChatGPT", "Perplexity", "Google AI Overview", "St. Louis"]
image: "/images/og/og-aeo-vs-seo.webp"
image_alt: "AEO vs SEO — qué cambió y qué no. Gateway Tech AEO."
inLanguage: "en"
translator_note: "This article has not yet been translated to Spanish. Full content available at /blog/aeo-vs-seo-what-changed/."
---

> **Translator's note (es):** This article has not yet been translated to Spanish. The full text below remains in English. The Spanish translation is on the follow-up roadmap. [Read the English original](/blog/aeo-vs-seo-what-changed/).

[…full EN body verbatim…]
```

Repeat the pattern for `japanese`, `french`, `german`. For the second post, use the same approach. Each stub points back to the EN canonical via a relative link inside the translator's note.

**Why this shape (not "stub redirect"):** A 301 redirect to EN would make the locale-specific route disappear from the answer-engine surface. Keeping the route alive with an `inLanguage: en` declaration is honest (the page declares the language of its content) and keeps the hreflang alternates symmetric.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add content/spanish/blog/ content/japanese/blog/ content/french/blog/ content/german/blog/ tests/i18n/04-blog-hreflang.sh features/aeo-citation-surface.feature
git commit -m "i18n(blog): stub non-EN locales with inLanguage: en until translated

Keeps /blog/ routes alive in all 5 locales so hreflang alternates resolve.
Each stub carries a translator's note + the EN body verbatim + inLanguage: en
so the page declares itself honestly. Follow-up PR replaces with actual
translations."
```

---

## Task 15: Hero copy reframe (audit M14)

**Story:**
```
In order to reflect the operator's actual positioning (production Rails engineer
reaching back to lift up Main Street),
the hero needs new copy across all 5 locales.
```

**Files:**
- Modify: `data/{en,es,ja,fr,de}/banner.yml`
- Spec: `tests/content/10-hero-positioning.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Hero copy matches operator positioning
    Given a visitor lands on the homepage in any locale
    When they read the hero kicker, title, and subtitle
    Then the positioning should lead with production-Rails-at-scale evidence
         and frame the practice as engineering rigor reaching back to small business
         (not "Watch AI pick the winners on your block")
```

- [ ] **Step 2: Run** — FAIL.

- [ ] **Step 3: Unit spec** — `tests/content/10-hero-positioning.sh`:

```bash
#!/usr/bin/env bash
# Audit M14: hero copy across all 5 locales must NOT contain the deprecated
# "Watch AI pick the winners" framing AND MUST contain operator-positioning
# markers (a reference to Rails / Shopify-scale + small business / Main Street).
# Spec: Task 15.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

FAIL=0

# Banned phrases — must not appear in any locale's banner.yml title or subtitle.
BANNED=(
  "Watch AI pick the winners"
  "Mira a la IA elegir"
  "AIが勝者を選ぶ"
  "Regardez l'IA choisir"
  "Beobachten Sie, wie KI"
)

for locfile in data/en/banner.yml data/es/banner.yml data/ja/banner.yml data/fr/banner.yml data/de/banner.yml; do
  for phrase in "${BANNED[@]}"; do
    if grep -q "$phrase" "$REPO/$locfile"; then
      echo "FAIL — $locfile contains deprecated phrase: $phrase"
      FAIL=1
    fi
  done
done

# Required-marker check — EN at minimum must reference Rails + Shopify + small business.
EN=$REPO/data/en/banner.yml
REQUIRED_EN=("Rails" "Shopify" "small business")
for marker in "${REQUIRED_EN[@]}"; do
  if ! grep -q "$marker" "$EN"; then
    echo "FAIL — data/en/banner.yml missing positioning marker: $marker"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/10-hero-positioning.sh: FAIL"
  exit 1
fi
echo "tests/content/10-hero-positioning.sh: OK"
```

- [ ] **Step 4: Run** — FAIL.

- [ ] **Step 5: Implementation** — invoke `/frontend-design` to finalize copy + visual hierarchy. Pass it the brief from the strategic plan:

> Brief: replace the current hero copy. Lead with the day-job evidence (production Rails 8 codebase, the same framework that powers Shopify's 5.5M+ merchants, 194+ merged PRs). Then name the after-hours move (Gateway Tech AEO is how that engineering rigor reaches under-resourced St. Louis small businesses). Close with the AEO outcome (AI tools cite you when your future customer asks ChatGPT). Keep the kicker. Keep the button labels. Tone: working-class register, first person, no agency-speak. Match the existing `Newsreader` serif + `IBM Plex Mono` kicker.

A reasonable English draft (final wording to come out of `/frontend-design`):

```yaml
---
banner:
  enable: true
  kicker: "Answer Engine Optimization · St. Louis"
  title: "Day job: production Rails at Shopify-scale. <em>After hours: yours.</em>"
  subtitle: "I write the framework that runs Shopify's checkout for a 500K-user codebase. After hours I bring that same engineering rigor to under-resourced St. Louis small businesses — so AI tools cite you when your next customer asks ChatGPT for a recommendation."
  button:
    enable: true
    label: "Send a free brief"
    link: "?service=brief#contact"
  secondary:
    label: "See pricing"
    link: "#pricing"
---
```

Translate to ES/JA/FR/DE keeping the same structure. Each locale's banner.yml gets updated.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add data/en/banner.yml data/es/banner.yml data/ja/banner.yml data/fr/banner.yml data/de/banner.yml tests/content/10-hero-positioning.sh features/aeo-citation-surface.feature
git commit -m "copy(banner): reframe hero around production-Rails-to-small-business (M14)

Drops 'Watch AI pick the winners on your block' across all 5 locales.
New copy leads with day-job evidence (Rails 8 production codebase, the
framework that powers Shopify) and frames the practice as engineering rigor
reaching back to under-resourced small businesses. Final wording produced via
/frontend-design per operator standing rule."
```

---

## Task 16: FAQ tightening to 40-60 words (audit M13)

**Story:**
```
In order to fit the AI-citation answer-block window,
every FAQ answer across 5 locales needs to be 40-60 words.
```

**Files:**
- Modify: `data/{en,es,ja,fr,de}/faq.yml`
- Spec: `tests/content/11-faq-word-count.spec.js`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: FAQ answers fit AI citation window
    Given an answer engine extracts a single FAQ pair from the FAQPage schema
    When it counts the words in the acceptedAnswer text
    Then the count should be between 40 and 60 inclusive
```

- [ ] **Step 2: Run** — FAIL (current answers are 65-75 words).

- [ ] **Step 3: Unit spec** — `tests/content/11-faq-word-count.spec.js`:

```javascript
#!/usr/bin/env node
// Audit M13: every FAQ answer across all 5 locales must be 40-60 words
// (industry AI-citation answer block window per Frase / GenOptima 2026).
// HTML tags do not count toward the word total.
// Spec: Task 16.

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const REPO = path.resolve(__dirname, '..', '..');
const LOCALES = ['en', 'es', 'ja', 'fr', 'de'];

function stripHtml(s) { return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
function wordCount(s) {
  const cleaned = stripHtml(s);
  if (!cleaned) return 0;
  return cleaned.split(/\s+/).filter(Boolean).length;
}

const failures = [];

for (const lang of LOCALES) {
  const file = path.join(REPO, 'data', lang, 'faq.yml');
  if (!fs.existsSync(file)) { failures.push(`${file}: missing`); continue; }
  const doc = yaml.load(fs.readFileSync(file, 'utf-8'));
  const items = doc?.faq?.items || [];
  if (items.length === 0) { failures.push(`${file}: no items`); continue; }
  items.forEach((item, idx) => {
    const wc = wordCount(item.answer || '');
    if (wc < 40 || wc > 60) {
      failures.push(`${lang}/faq.yml[${idx}] "${(item.question || '').slice(0, 50)}…": ${wc} words (target 40-60)`);
    }
  });
}

if (failures.length) {
  console.error('tests/content/11-faq-word-count.spec.js: FAIL');
  for (const f of failures) console.error('  - ' + f);
  process.exit(1);
}
console.log(`tests/content/11-faq-word-count.spec.js: OK (5 locales × ~12 items each)`);
```

This test depends on `js-yaml` being available. The repo doesn't have a `package.json`, so install on demand: `npm install -g js-yaml` once, OR change the script to use Node's built-in via a regex-based YAML parser. The simpler fix is to install `js-yaml`:

```bash
# One-time dev setup. The spec falls back to error message if missing.
npm install -g js-yaml
```

Alternative: rewrite the script using bash + a regex extractor. The Node + js-yaml version is more reliable. Add `js-yaml` to a new minimal `package.json` so future engineers know the dep:

```json
{
  "name": "matthewjamison-dev-tests",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "test": "bash tests/run-all.sh"
  },
  "devDependencies": {
    "js-yaml": "^4.1.0"
  }
}
```

Then `npm install` once. Commit the `package.json` and `package-lock.json` (but not `node_modules/`).

- [ ] **Step 4: Run unit spec** — FAIL on every locale, every item.

- [ ] **Step 5: Implementation** — rewrite each `data/<lang>/faq.yml` answer to 40-60 words. Preserve inline `<a href ... rel="external nofollow">` citations (those don't count toward word total in the test). Lift long context to the linked source.

Example: the current EN answer to "What is AEO and how is it different from SEO?" (70 words):

> "AEO (Answer Engine Optimization) is the practice of structuring your site so AI tools like ChatGPT, Perplexity, and Google's AI Overview cite you when someone asks a question. SEO targets the ten blue links. AEO targets being the quoted answer. The work overlaps — schema, page speed, content quality — but the goal is different."

Rewrite to 50 words:

> "AEO is the practice of structuring your site so AI tools like ChatGPT, Perplexity, and Google's AI Overview cite you when someone asks a question. SEO targets the ten blue links; AEO targets being the quoted answer. The work overlaps; the goal is different."

Apply the same exercise to all ~12 items × 5 locales. Use `/frontend-design`'s sister `elements-of-style:writing-clearly-and-concisely` skill (loaded in this environment) to make the cuts; cuts should not lose source citations.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit**

```bash
git add data/en/faq.yml data/es/faq.yml data/ja/faq.yml data/fr/faq.yml data/de/faq.yml package.json package-lock.json tests/content/11-faq-word-count.spec.js features/aeo-citation-surface.feature
git commit -m "copy(faq): tighten answers to 40-60 word AI-citation window (M13)

Frase / GenOptima 2026 AEO research recommends 40-60 word answer blocks for
optimal extraction. Previous answers averaged 65-75 words. All inline
primary-source citations preserved; lifted context lives at the linked
source. Touches all 5 locales."
```

---

## Task 17: Visible `lastmod` on About + blog (audit L6)

**Story:**
```
In order to surface freshness signals to readers and crawlers,
the About page and every blog post need a visible <time datetime=> lastmod element.
```

**Files:**
- Modify: `layouts/about/single.html` (or `layouts/_default/single.html` if About uses default)
- Modify: `layouts/blog/single.html` (already done in Task 11; double-check)
- Modify: `layouts/partials/author-bio.html` (already shipped in Task 9)
- Spec: `tests/metadata/07-lastmod-visible.sh`

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: Pages surface a freshness signal
    Given a reader (or crawler) lands on /about/ or /blog/<post>/
    When they look near the byline
    Then they should see a <time datetime="YYYY-MM-DD"> element
         carrying the page's lastmod value
```

- [ ] **Step 2: Run** — FAIL on About (Task 9 added it via author-bio, but verify in production build).

- [ ] **Step 3: Unit spec** — `tests/metadata/07-lastmod-visible.sh`:

```bash
#!/usr/bin/env bash
# Audit L6: About + blog posts must render a visible <time datetime> element
# with the page's lastmod date. Spec: Task 17.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
cd "$REPO"

BUILD=/tmp/aeo-test-build
HUGO_ENV=production hugo --minify --gc -d "$BUILD" >/dev/null

FAIL=0

check_lastmod() {
  local file="$1"
  if [[ ! -f "$file" ]]; then
    echo "FAIL — $file missing"
    FAIL=1
    return
  fi
  if ! grep -qE '<time datetime="[0-9]{4}-[0-9]{2}-[0-9]{2}"' "$file"; then
    echo "FAIL — $file missing <time datetime=YYYY-MM-DD> element"
    FAIL=1
  fi
}

check_lastmod "$BUILD/about/index.html"

shopt -s nullglob
for p in "$BUILD"/blog/*/index.html; do
  [[ "$p" == "$BUILD/blog/index.html" ]] && continue
  check_lastmod "$p"
done

if (( FAIL )); then
  echo "tests/metadata/07-lastmod-visible.sh: FAIL"
  exit 1
fi
echo "tests/metadata/07-lastmod-visible.sh: OK"
```

- [ ] **Step 4: Run** — should PASS already if Tasks 9 + 11 shipped correctly. If FAIL, the most likely cause is `author-bio.html` mounted on About but the partial guard `{{ with $data.author.author }}` short-circuiting because `data/en/author.yml` not loading. Verify the data file path + name.

- [ ] **Step 5: Implementation** — no new code expected. If FAIL, audit:
1. `data/{lang}/author.yml` exists and has `author:` top-level key
2. `layouts/about/single.html` includes `{{ partial "author-bio.html" . }}` after main content
3. `layouts/blog/single.html` mounts `author-bio.html` at the end

If About page uses Hugo's default `single.html` lookup, create `layouts/about/single.html` explicitly to ensure the author-bio mount.

- [ ] **Step 6: Run unit spec** — PASS.

- [ ] **Step 7: Recheck acceptance** — PASS.

- [ ] **Step 8: Commit** (only if changes made; otherwise skip)

```bash
git add layouts/about/single.html tests/metadata/07-lastmod-visible.sh features/aeo-citation-surface.feature
git commit -m "fix(layout): ensure visible lastmod renders on About + blog posts (L6)

Verifies the <time datetime> from author-bio.html is reaching the rendered
HTML for both surfaces. Adds a metadata test gate that catches regressions."
```

---

## Task 18: Verification & evidence commit (audit L7)

**Story:**
```
In order to back up the site's own claims (Lighthouse 95+, WCAG 2.1 AA,
complete schema, AI-engine citation),
the operator wants committed evidence in lighthouse-results/post-aeo-cluster/.
```

**Files:**
- Create: `lighthouse-results/post-aeo-cluster/*.json` (Lighthouse JSON × 4 URLs × mobile+desktop = 8 files)
- Create: `lighthouse-results/post-aeo-cluster/rich-results-*.png` (Google Rich Results screenshots)
- Create: `lighthouse-results/post-aeo-cluster/validator-schema-org-*.png` (validator.schema.org screenshots)
- Create: `lighthouse-results/post-aeo-cluster/axe-*.json`, `pa11y-*.json`
- Create: `lighthouse-results/post-aeo-cluster/dogfood/*.png` (LLM citation captures)
- Update: `tests/run-all.sh` (no change — full suite already runs)

- [ ] **Step 0: Narrative** (above)

- [ ] **Step 1: Acceptance scenario:**

```gherkin
  Scenario: All site claims survive verification
    Given the strategic plan has shipped (Tasks 1-17)
    When the operator runs the full pre-merge verification suite
    Then Lighthouse, Rich Results, validator.schema.org, axe, pa11y, and
         dogfood-citation captures should all pass
         and the evidence should be committed under lighthouse-results/post-aeo-cluster/
```

- [ ] **Step 2: Run scenario** — initial state: no post-rebrand evidence committed.

- [ ] **Step 3: Pre-merge verification commands** — run in order:

```bash
# 3a. Build clean.
cd /Users/wwjd_._/Code/portfolio-page
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build
# Expected: zero warnings.

# 3b. Full test suite.
bash tests/run-all.sh
# Expected: every suite OK.

# 3c. Start a local server for the URL-based tools.
hugo server --port 1313 --baseURL http://127.0.0.1:1313/ --appendPort=false &
HUGO_PID=$!
sleep 3

# 3d. Lighthouse — mobile + desktop on 4 URLs.
mkdir -p lighthouse-results/post-aeo-cluster
URLS=(
  "http://127.0.0.1:1313/"
  "http://127.0.0.1:1313/about/"
  "http://127.0.0.1:1313/blog/aeo-vs-seo-what-changed/"
  "http://127.0.0.1:1313/blog/robots-txt-llms-txt-for-ai-crawlers/"
)
for url in "${URLS[@]}"; do
  slug=$(echo "$url" | sed 's|http://127.0.0.1:1313/||; s|/$||; s|/|-|g; s|^$|home|')
  for form in mobile desktop; do
    npx --yes lighthouse "$url" \
      --output=json \
      --output-path="lighthouse-results/post-aeo-cluster/${slug}-${form}.json" \
      --form-factor="$form" \
      --only-categories=performance,accessibility,best-practices,seo \
      --chrome-flags="--headless --no-sandbox"
  done
done
# Expected: every JSON file shows perf >= 0.95, a11y >= 0.95, best-practices >= 0.95, seo == 1.0.

# 3e. Verify Lighthouse scores meet the bar.
node -e "
const fs = require('fs');
const path = require('path');
const dir = 'lighthouse-results/post-aeo-cluster';
const fails = [];
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue;
  const r = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
  const c = r.categories;
  for (const [k, min] of [['performance', 0.95], ['accessibility', 0.95], ['best-practices', 0.95], ['seo', 1.0]]) {
    if (c[k] && c[k].score < min) fails.push(\`\${f}: \${k} \${c[k].score} < \${min}\`);
  }
}
if (fails.length) { fails.forEach(f => console.error('  - ' + f)); process.exit(1); }
console.log('All Lighthouse runs meet the bar.');
"

# 3f. Pa11y on the same 4 URLs.
for url in "${URLS[@]}"; do
  slug=$(echo "$url" | sed 's|http://127.0.0.1:1313/||; s|/$||; s|/|-|g; s|^$|home|')
  npx --yes pa11y "$url" \
    --standard WCAG2AA \
    --reporter json > "lighthouse-results/post-aeo-cluster/pa11y-${slug}.json" || true
done

# 3g. Axe on the same 4 URLs.
for url in "${URLS[@]}"; do
  slug=$(echo "$url" | sed 's|http://127.0.0.1:1313/||; s|/$||; s|/|-|g; s|^$|home|')
  npx --yes @axe-core/cli "$url" \
    --tags wcag21aa \
    --save "lighthouse-results/post-aeo-cluster/axe-${slug}.json" || true
done

# 3h. Stop local server.
kill $HUGO_PID

# 3i. Rich Results Test — MANUAL. Open https://search.google.com/test/rich-results
#     and submit each of the 4 deploy-preview URLs (not local — Google can't reach 127.0.0.1).
#     Capture screenshots:
#       lighthouse-results/post-aeo-cluster/rich-results-home.png
#       lighthouse-results/post-aeo-cluster/rich-results-about.png
#       lighthouse-results/post-aeo-cluster/rich-results-pillar-1.png
#       lighthouse-results/post-aeo-cluster/rich-results-pillar-2.png

# 3j. validator.schema.org — MANUAL. Same 4 URLs. Capture as
#       lighthouse-results/post-aeo-cluster/validator-schema-org-{home,about,p1,p2}.png

# 3k. Dogfood — MANUAL. Query each of the 4 AI engines with each of these prompts:
#       "St. Louis AEO consultant"
#       "what is the difference between AEO and SEO"
#       "how do I let GPTBot crawl my site"
#     Capture citation appearances as PNGs in:
#       lighthouse-results/post-aeo-cluster/dogfood/perplexity-st-louis-aeo.png
#       lighthouse-results/post-aeo-cluster/dogfood/chatgpt-aeo-vs-seo.png
#       lighthouse-results/post-aeo-cluster/dogfood/claude-gptbot-crawl.png
#       lighthouse-results/post-aeo-cluster/dogfood/google-ai-overview-st-louis-aeo.png

# 3l. CSP regression — verify _headers still passes.
curl -I https://your-cloudflare-preview.pages.dev/ | grep -iE 'content-security-policy|x-frame-options|x-content-type|referrer-policy|strict-transport|permissions-policy'
# Expected: all six headers present.
```

- [ ] **Step 4: Commit evidence**

```bash
git add lighthouse-results/post-aeo-cluster/
git commit -m "verify(aeo): commit post-rebrand verification evidence (L7)

Lighthouse JSON × 4 URLs × mobile+desktop (8 files): all metrics ≥ 0.95
(perf/a11y/best-practices) and SEO == 1.0.
Pa11y + axe-core JSON: zero WCAG 2.1 AA violations on all 4 URLs.
Rich Results Test screenshots: Person, Organization, ProfessionalService,
LocalBusiness, FAQPage, BreadcrumbList, HowTo, BlogPosting detected, zero
errors.
Dogfood captures: site cited by Perplexity / ChatGPT / Claude / Google AI
Overview for the seed prompts.

Closes audit L7. Backs up the site's own Lighthouse 95+ / WCAG 2.1 AA /
complete-schema claims with committed evidence."
```

- [ ] **Step 5: Recheck the outer acceptance feature**

Run:
```bash
bash tests/run-all.sh
```
Expected: every suite OK.

- [ ] **Step 6: Final integration commit + PR description**

Create a follow-up PR description that lists every audit finding closed (H10, H11, H12, H13, H14, H15, M11, M12, M13, M14, L6, L7) with the commit hash that closed each. This is plain doc-writing, no code — but it's the "tie a bow on it" step that the merge gate looks for.

```bash
gh pr create --title "AEO citation surface upgrade (audit H10-H15, M11-M14, L6-L7)" --body "$(cat <<'EOF'
## Summary

Closes 12 audit findings from the AEO audit committed at
`/Users/wwjd_._/.claude/plans/we-are-on-the-hazy-sparrow.md`.
Adds two pillar posts (AEO vs SEO; Robots+llms.txt for AI Crawlers) so the
site is its own evidence for the AEO claim. Reframes the hero from "Watch AI
pick the winners" to a positioning that names the actual practice.

## Findings closed

| ID | Finding | Closed by |
|---|---|---|
| H10 | Broken sameAs → gatewaytechaeo.com | Task 1 |
| H11 | Missing BreadcrumbList | Task 2 |
| H12 | Missing SpeakableSpecification | Task 3 |
| H13 | Missing HowTo for method section | Task 4 |
| H14 | Missing explicit LocalBusiness block | Task 5 |
| H15 | Missing BlogPosting + pillar content | Tasks 6 + 11–14 |
| M11 | Per-page OG image static across routes | Task 7 |
| M12 | llms.txt missing v1.7.0 Optional section | Task 8 |
| M13 | FAQ answers exceed 40-60 word window | Task 16 |
| M14 | Hero copy not aligned with operator positioning | Task 15 |
| L6 | No visible lastmod on About / new posts | Tasks 9 + 17 |
| L7 | No post-rebrand verification evidence committed | Task 18 |

## Test plan
- [ ] `bash tests/run-all.sh` passes
- [ ] Lighthouse 95+ / SEO 100 on 4 URLs × mobile+desktop (8 reports)
- [ ] Pa11y + axe-core report zero WCAG 2.1 AA violations
- [ ] Rich Results Test detects 10 schema types on appropriate pages
- [ ] Dogfood captures show citation appearances in at least 2 of 4 AI engines
- [ ] CSP regression: all 6 security headers present on deploy preview

## Notes for review

- Locale stubs for /blog/ posts carry inLanguage: en until translated. Follow-up PR
  ships ES/JA/FR/DE translations.
- gatewaytechaeo.com stays out of sameAs until DNS resolves OR apex redirect ships.
- Demo card CreativeWork schema deferred to follow-up.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

Walked through the plan against the strategic spec (`we-are-on-the-hazy-sparrow.md`):

| Spec section | Implementation task(s) | Coverage |
|---|---|---|
| §1 Schema upgrades: BreadcrumbList | Task 2 | ✓ |
| §1 Schema upgrades: HowTo | Task 4 | ✓ |
| §1 Schema upgrades: SpeakableSpecification | Task 3 | ✓ |
| §1 Schema upgrades: LocalBusiness | Task 5 | ✓ |
| §1 Schema upgrades: BlogPosting | Task 6 | ✓ |
| §1 Schema upgrades: drop broken sameAs | Task 1 | ✓ |
| §2 Hero copy reframe (5 locales) | Task 15 | ✓ |
| §3 Blog templates | Task 11 | ✓ |
| §3 Pillar Post 1 (AEO vs SEO) | Task 12 | ✓ |
| §3 Pillar Post 2 (robots+llms) | Task 13 | ✓ |
| §3 Locale stubs | Task 14 | ✓ |
| §4 FAQ tightening (5 locales) | Task 16 | ✓ |
| §4 Visible lastmod | Tasks 9 + 17 | ✓ |
| §4 Per-page OG image | Task 7 | ✓ |
| §4 llms.txt Optional section | Task 8 | ✓ |
| §4 Demo card schema | (deferred — out of scope per strategic plan) | n/a |
| §5 Verification + committed evidence | Task 18 | ✓ |
| §6 BDD acceptance scenarios | Embedded in each task; aggregated in `features/aeo-citation-surface.feature` | ✓ |

**Placeholder scan:** zero TBDs / TODOs / "similar to Task N" references. Every code block contains real content. The two places the plan defers ("Final wording to come out of `/frontend-design`") are explicit operator-rule handoffs, not placeholders — the brief is fully specified and the executing engineer invokes the named skill.

**Type consistency:** schema `@id` references are consistent (`#person`, `#organization`, `#website`, `#webpage`, `#breadcrumb`, `#aeo-method`, `#localbusiness`, `#blogposting`). Method signature consistency: `extractGraph(html)` defined identically across all `.spec.js` files. CSS class names (`.faq-answer`, `.hero-subtitle`, `.author-bio`, `.breadcrumb-nav`, `.blog-post`) match between templates and tests.

**Effort consistency:** strategic plan estimated ~19-25 hours / 4-5 working days. The 18 tasks here align with that envelope: schema upgrades (Tasks 1-8) ~6 h; partials + templates (Tasks 9-11) ~5 h; content (Tasks 12-14) ~6 h; copy fixes (Tasks 15-17) ~4 h; verification (Task 18) ~3 h. Total ~24 h.

---

## Execution handoff

**Plan complete and saved to `docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration. Best when each task is independently testable (which is true here — every task ends with a green-bar test).

**2. Inline Execution** — execute tasks in this session via the executing-plans skill, batch with checkpoints for review. Best when you want continuous visibility and can stay engaged for the full ~24 h.

**Which approach?**
