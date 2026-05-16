# AEO-2 Homepage Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the doom-scroll homepage with a multi-page hub (hero fork → /why, /different, /pricing, /faq) using charcoal + magenta atmosphere, Strunk-edited copy, and full BDD verification.

**Architecture:** Hugo 0.152.2 + meghna theme overrides. Each new page = `content/english/<slug>.md` + `data/en/<slug>.yml` + `layouts/<slug>/single.html` (or shared `layouts/_default/single.html`). Tests are bash scripts under `tests/{content,schema,metadata,headers,i18n}/` that grep the built `public/` tree.

**Tech Stack:** Hugo extended 0.152.2, vanilla JS only in prod, PurgeCSS, lozad lazy-load, Cloudflare Pages, brief-intake-collector Worker.

**Local-only artifact:** This plan stays in `docs/superpowers/plans/` for reference; do NOT `git add` or commit it. Implementation code commits normally.

---

## Spec reference

Spec: `docs/superpowers/specs/2026-05-14-aeo-rebrand-design.md` (also `/Users/wwjd_._/.claude/plans/frontend-design-frontend-design-we-want-sunny-valley.md`).

Three approved BDD stories from the spec:

1. **Cold owner figures out AEO matters** — fork → /why → /different → /pricing in three clicks.
2. **Researching owner verifies thoroughness** — fork → /different → see audit scope + pillars + trust moves, no methodology leak.
3. **Skeptic verifies claims** — every stat on /why links to a recognized public source.

---

## File map

### Create
| Path | Responsibility |
|---|---|
| `content/english/why.md` | /why page content shell (front matter only, pulls from data/en/why.yml) |
| `content/english/different.md` | /different page content shell |
| `content/english/pricing.md` | /pricing page content shell |
| `content/english/faq.md` | /faq page content shell |
| `data/en/why.yml` | Six stat cards + sources + page copy |
| `data/en/different.yml` | Five blocks of Path B copy |
| `layouts/why/single.html` | /why template |
| `layouts/different/single.html` | /different template |
| `layouts/pricing/single.html` | /pricing template (lifts current pricing partial) |
| `layouts/faq/single.html` | /faq template + page-scoped FAQPage JSON-LD |
| `layouts/partials/hero-fork.html` | New hero partial: question + two CTAs |
| `layouts/partials/trust-moves.html` | Shared block (5-client cap, ownership, month-to-month) |
| `tests/content/13-fork-hero.sh` | Verify hero question + two CTAs in `public/index.html` |
| `tests/content/14-why-page.sh` | Verify /why renders six stat cards + outbound source links |
| `tests/content/15-different-page.sh` | Verify /different has audit scope + pillars + trust moves; no banned methodology terms |
| `tests/content/16-pricing-page.sh` | Verify /pricing renders three tiers + trust block |
| `tests/content/17-faq-page-scoped.sh` | Verify FAQPage JSON-LD lives on /faq/ only |
| `tests/content/18-no-demos.sh` | Verify no demo cards rendered anywhere |
| `tests/content/19-no-author-bio.sh` | Verify no author photo/bio rendered |

### Modify
| Path | Change |
|---|---|
| `layouts/index.html` | Strip method/faq/pricing/demos/contact partial calls. Replace with hero-fork + minimal teaser to /different. |
| `layouts/partials/banner.html` | Deprecate in favor of hero-fork. Delete after rollout. |
| `layouts/partials/head.html` | Move FAQPage JSON-LD off site-wide; scope to /faq. Update OG image + canonical for new pages. |
| `layouts/partials/footer.html` | Replace nav links + strip portal/battle stubs. Add Pricing · FAQ · Brief footer nav. |
| `layouts/partials/navigation.html` | New top nav: Why · Different · Pricing · FAQ · Send a brief. |
| `data/en/banner.yml` | Replace with hero-fork content (question + two CTAs). Keep filename to avoid breaking lookups. |
| `assets/css/critical-inline.css` | Add `--charcoal: #1a1a1a`. Switch body base. Add `prefers-reduced-motion` block. |
| `assets/css/custom.css` | Strip dead pokemon/portal/battle keyframes. New `.fork-cta`, `.stat-card`, `.pillar-card`, `.trust-block` styles. |
| `tests/content/11-hero-positioning.sh` | Replace banned/required markers with new hero copy markers. |
| `i18n/en.toml` | New keys: `hero_question`, `cta_why`, `cta_different`, `cta_brief`, `nav_why`, `nav_different`, `nav_pricing`, `nav_faq`. |

### Delete
| Path | Reason |
|---|---|
| `content/english/demos/*.md` | Demos dropped per spec. |
| `content/spanish/demos/*.md`, `content/japanese/demos/*.md`, `content/french/demos/*.md`, `content/german/demos/*.md` | Same. |
| `content/english/about*.md` (if exists), parallel locale files | Author bio dropped. |
| `data/en/author.yml`, `data/{es,ja,fr,de}/author.yml` | Author bio dropped. |
| `layouts/about/`, `layouts/partials/author-bio.html` | Unused after about delete. |
| `layouts/partials/aeo-loop-videos.html` | Unused; demo-adjacent. |
| `layouts/partials/method.html`, `layouts/partials/faq.html`, `layouts/partials/pricing.html` | Moved into per-page templates. Keep `method.yml`, `faq.yml`, `pricing.yml` data — read by new templates. |
| `layouts/partials/breadcrumb.html` | Unused after about/blog removal (confirm before delete). |

### Locale mirror (Phase 8)
| Path | Change |
|---|---|
| `content/{spanish,japanese,french,german}/why.md` | Copy EN content. Front matter `untranslated: true`. |
| `content/{spanish,japanese,french,german}/different.md` | Same. |
| `content/{spanish,japanese,french,german}/pricing.md` | Same. |
| `content/{spanish,japanese,french,german}/faq.md` | Same. |
| `data/{es,ja,fr,de}/why.yml` | Copy `data/en/why.yml` verbatim with `# TODO: translate` header. |
| `data/{es,ja,fr,de}/different.yml` | Same. |
| `data/{es,ja,fr,de}/banner.yml` | Replace with hero-fork EN copy + `# TODO: translate`. |
| `i18n/{es,ja,fr,de}.toml` | Mirror new EN keys verbatim with TODO comment. |

---

## Phase 0 — Branch + safety

### Task 0.1: Create feature branch

**Files:** none (git state only)

- [ ] **Step 1: Verify clean working tree**

Run: `git status --short`
Expected: only `?? docs/superpowers/specs/` and `?? docs/superpowers/plans/` (the local-only spec + plan); nothing else uncommitted.

- [ ] **Step 2: Create branch**

Run: `git checkout -b feat/aeo-rebrand-fork-architecture`

Expected output:
```
Switched to a new branch 'feat/aeo-rebrand-fork-architecture'
```

- [ ] **Step 3: Confirm branch**

Run: `git rev-parse --abbrev-ref HEAD`
Expected: `feat/aeo-rebrand-fork-architecture`

---

## Phase 1 — Data files (EN)

### Task 1.1: Replace `data/en/banner.yml` with hero-fork content

**Files:** Modify `data/en/banner.yml`

- [ ] **Step 0: Story narrative**

```
In order to make a cold visitor immediately understand the offer,
a small business owner wants the homepage hero to ask one question
and present two clear next steps — not lead with builder credentials.
```

- [ ] **Step 1: Write the failing acceptance scenario**

Append to `features/aeo-citation-surface.feature`:

```gherkin
  Scenario: Hero hero asks the fork question
    Given a visitor lands on the homepage
    When they read the hero
    Then they should see "When customers ask AI what you do, do you show up?"
    And two CTAs labeled "Why does this matter to me" and "What makes Gateway Tech AEO different"
    # Verified by: tests/content/13-fork-hero.sh
```

- [ ] **Step 2: Write the failing shell test**

Create `tests/content/13-fork-hero.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 1.1: hero question + two CTAs present in built homepage.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

HOME_HTML="$BUILD/index.html"
if [[ ! -f "$HOME_HTML" ]]; then
  echo "FAIL — $HOME_HTML not built"; exit 1
fi

REQUIRED=(
  "When customers ask AI what you do"
  "Why does this matter to me"
  "What makes Gateway Tech AEO different"
)
for needle in "${REQUIRED[@]}"; do
  if ! grep -q "$needle" "$HOME_HTML"; then
    echo "FAIL — homepage missing: $needle"
    FAIL=1
  fi
done

BANNED=(
  "Built by a Full-Stack engineer"
  "Helping local businesses get cited"
)
for banned in "${BANNED[@]}"; do
  if grep -q "$banned" "$HOME_HTML"; then
    echo "FAIL — homepage still contains deprecated copy: $banned"
    FAIL=1
  fi
done

if (( FAIL )); then
  echo "tests/content/13-fork-hero.sh: FAIL"; exit 1
fi
echo "tests/content/13-fork-hero.sh: OK"
```

Make executable: `chmod +x tests/content/13-fork-hero.sh`

- [ ] **Step 3: Run the test — verify it fails for the right reason**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/13-fork-hero.sh
```
Expected: `FAIL — homepage missing: When customers ask AI what you do` (current banner has different copy).

- [ ] **Step 4: Implement — rewrite `data/en/banner.yml`**

Replace file contents with:

```yaml
---
banner:
  enable: true
  kicker: "Answer Engine Optimization · St. Louis"
  title: "When customers ask AI what you do, <em>do you show up?</em>"
  subtitle: "We make sure they cite you."
  button:
    enable: true
    label: "Why does this matter to me"
    link: "/why/"
  secondary:
    label: "What makes Gateway Tech AEO different"
    link: "/different/"
  tertiary:
    label: "Or send a brief"
    link: "?service=brief#contact"
---
```

- [ ] **Step 5: Update hero partial to render new fields**

Read `layouts/partials/banner.html` first. Then rewrite to render kicker, title, subtitle, primary + secondary CTAs as bold buttons, and the tertiary link as a quiet text link. Skeleton:

```go-html-template
{{ $data := index site.Data site.Language.Lang }}
{{ if $data.banner.banner.enable }}
{{ with $data.banner.banner }}
<section class="hero-area hero-fork">
  <div class="container">
    <span class="hero-kicker">{{ .kicker }}</span>
    <h1 class="hero-title">{{ .title | safeHTML }}</h1>
    <p class="hero-subtitle">{{ .subtitle }}</p>
    <div class="hero-fork-ctas">
      <a href="{{ .button.link }}" class="btn-fork btn-fork-primary">{{ .button.label }} <span aria-hidden="true">→</span></a>
      <a href="{{ .secondary.link }}" class="btn-fork btn-fork-secondary">{{ .secondary.label }} <span aria-hidden="true">→</span></a>
    </div>
    {{ if .tertiary }}
    <a href="{{ .tertiary.link }}" class="hero-tertiary">{{ .tertiary.label }} <span aria-hidden="true">→</span></a>
    {{ end }}
  </div>
</section>
{{ end }}
{{ end }}
```

- [ ] **Step 6: Rebuild + run test — verify it passes**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/13-fork-hero.sh
```
Expected: `tests/content/13-fork-hero.sh: OK`

- [ ] **Step 7: Update `tests/content/11-hero-positioning.sh`**

Open the file. Replace `BANNED=` array with:

```bash
BANNED=(
  "Watch AI pick the winners"
  "Built by a Full-Stack engineer"
  "Helping local businesses get cited by AI search"
)
```

Replace `REQUIRED_EN=` array with:

```bash
REQUIRED_EN=("When customers ask AI" "Why does this matter to me" "What makes Gateway Tech AEO different")
```

Re-run: `bash tests/content/11-hero-positioning.sh`
Expected: `tests/content/11-hero-positioning.sh: OK`

- [ ] **Step 8: Commit**

```bash
git add data/en/banner.yml layouts/partials/banner.html tests/content/13-fork-hero.sh tests/content/11-hero-positioning.sh features/aeo-citation-surface.feature
git commit -m "feat(hero): replace builder-credential hero with fork-in-road question"
```

---

### Task 1.2: Create `data/en/why.yml`

**Files:** Create `data/en/why.yml`

- [ ] **Step 0: Story narrative**

```
In order to teach a cold business owner why AEO matters,
a visitor on /why wants six cited stat cards in plain English
that build the case in under 90 seconds.
```

- [ ] **Step 1: Write the failing test**

Create `tests/content/14-why-page.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 1.2 + 3.1: /why page renders six stat cards with public sources.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
WHY_HTML="$BUILD/why/index.html"
if [[ ! -f "$WHY_HTML" ]]; then
  echo "FAIL — $WHY_HTML not built"; exit 1
fi

# Six cited claims must be present.
CLAIMS=(
  "45% of consumers"
  "93% of AI search sessions"
  "60% of citations in AI Overviews"
  "AI Overviews appear on"
  "25% of all search traffic"
  "Google Business Profile remains the #1"
)
for c in "${CLAIMS[@]}"; do
  if ! grep -q "$c" "$WHY_HTML"; then
    echo "FAIL — /why missing claim: $c"
    FAIL=1
  fi
done

# Each claim must have at least one outbound source link.
SOURCES=("brightlocal.com" "gartner.com" "whitespark.ca")
for s in "${SOURCES[@]}"; do
  if ! grep -q "$s" "$WHY_HTML"; then
    echo "FAIL — /why missing source: $s"
    FAIL=1
  fi
done

# Path-forward link to /different/
if ! grep -q 'href="/different/"' "$WHY_HTML"; then
  echo "FAIL — /why missing /different/ link"
  FAIL=1
fi

if (( FAIL )); then echo "tests/content/14-why-page.sh: FAIL"; exit 1; fi
echo "tests/content/14-why-page.sh: OK"
```

Make executable: `chmod +x tests/content/14-why-page.sh`

- [ ] **Step 2: Run the test — verify it fails**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/14-why-page.sh
```
Expected: `FAIL — /tmp/aeo-test-build/why/index.html not built` (page doesn't exist yet).

- [ ] **Step 3: Create `data/en/why.yml`**

```yaml
why:
  enable: true
  title: "Your customers ask AI about businesses like yours."
  subtitle: "Most local businesses are invisible to it."
  intro: "Six facts, all from public sources you can verify in 30 seconds. They build the case in order."
  stats:
    - id: "adoption"
      headline: "45% of consumers ask AI for local business recommendations — up from 6% a year ago."
      body: "The shift from typing a query to asking a chatbot is happening faster than search itself shifted from Yellow Pages to Google."
      source_label: "BrightLocal, Local Consumer Review Survey 2026"
      source_url: "https://www.brightlocal.com/research/lcrs-ai-trust/"
    - id: "zero-click"
      headline: "93% of AI search sessions end without a single click to a website."
      body: "Citation is the conversion. The AI answers, the buyer decides, the visit never happens. If you aren't cited, you aren't in the conversation."
      source_label: "Industry research compilation, 2026"
      source_url: "https://www.brightlocal.com/research/lcrs-ai-trust/"
    - id: "citation-share"
      headline: "60% of citations in AI Overviews go to third-party sites. Only 40% cite individual businesses directly."
      body: "You compete on two fronts: get cited by Yelp, Reddit, Quora — and get cited yourself. Both require structured, machine-readable content."
      source_label: "AI Overview citation breakdown, 2026"
      source_url: "https://whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/"
    - id: "overlap"
      headline: "AI Overviews appear on ~48% of tracked queries, yet only 17% of cited sources also rank in Google's organic top 10."
      body: "Ranking on page one of Google does not mean AI cites you. AEO is a separate visibility surface."
      source_label: "Whitespark AI Overviews research, 2026"
      source_url: "https://whitespark.ca/blog/case-study-the-prevalence-of-ai-overviews-in-local-search/"
    - id: "search-shift"
      headline: "25% of all search traffic shifts to AI by the end of this year."
      body: "The early forecast that read like science fiction in 2024 reads like the schedule now."
      source_label: "Gartner forecast, February 2024"
      source_url: "https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents"
    - id: "gbp-rank"
      headline: "The Google Business Profile remains the #1 ranking factor for local results — in AI search and traditional search."
      body: "If your profile is unclaimed, half empty, or missing photos, that single fix outranks anything else you can do."
      source_label: "Whitespark, 2026 Local Search Ranking Factors"
      source_url: "https://whitespark.ca/local-search-ranking-factors/"
  outro:
    body: "Short version: we structure your site, your Google Business Profile, and your third-party listings so AI tools cite you when customers ask. The tools include ChatGPT, Perplexity, Google's AI Overview, and Claude."
    cta_label: "See what we actually do"
    cta_link: "/different/"
```

- [ ] **Step 4: Verify file is valid YAML**

Run:
```bash
python3 -c "import yaml; yaml.safe_load(open('data/en/why.yml'))" && echo OK
```
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add data/en/why.yml tests/content/14-why-page.sh
git commit -m "feat(data): add /why page stat cards with cited sources"
```

---

### Task 1.3: Create `data/en/different.yml`

**Files:** Create `data/en/different.yml`

- [ ] **Step 0: Story narrative**

```
In order to reassure a researching business owner that the process is thorough,
a visitor on /different wants to see the audit scope, what they receive,
and the trust moves — without methodology I could replicate myself.
```

- [ ] **Step 1: Write the failing test**

Create `tests/content/15-different-page.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 1.3 + 3.2: /different page renders audit scope + pillars + trust moves;
# no banned methodology terms.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
DIFF_HTML="$BUILD/different/index.html"
if [[ ! -f "$DIFF_HTML" ]]; then
  echo "FAIL — $DIFF_HTML not built"; exit 1
fi

# Required content
REQ=(
  "audit three things, not one"
  "Technical"
  "Authority"
  "Content"
  "actionable audit summary"
  "5 St. Louis clients"
  "You own everything we touch"
  "Month-to-month"
)
for r in "${REQ[@]}"; do
  if ! grep -q "$r" "$DIFF_HTML"; then
    echo "FAIL — /different missing required: $r"
    FAIL=1
  fi
done

# Banned methodology terms (secret sauce)
BANNED=(
  "LocalBusiness schema"
  "JSON-LD @graph"
  "GPTBot"
  "ClaudeBot"
  "PerplexityBot"
  "entity reconciliation"
  "atomic content architecture"
)
for b in "${BANNED[@]}"; do
  if grep -q "$b" "$DIFF_HTML"; then
    echo "FAIL — /different leaks methodology: $b"
    FAIL=1
  fi
done

# Outbound CTAs to pricing + brief
if ! grep -q 'href="/pricing/"' "$DIFF_HTML"; then
  echo "FAIL — /different missing /pricing/ link"; FAIL=1
fi

if (( FAIL )); then echo "tests/content/15-different-page.sh: FAIL"; exit 1; fi
echo "tests/content/15-different-page.sh: OK"
```

Make executable: `chmod +x tests/content/15-different-page.sh`

- [ ] **Step 2: Run the test — verify it fails**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/15-different-page.sh
```
Expected: `FAIL — /different/index.html not built`.

- [ ] **Step 3: Create `data/en/different.yml`**

```yaml
different:
  enable: true
  title: "What makes Gateway Tech AEO different."
  subtitle: "One operator. Three audits in one. A plan you can act on."
  blocks:
    audit_scope:
      heading: "We audit three things, not one."
      body: "Most AEO services check whether AI can cite you. We audit your visibility across classical search (the ten blue links), answer engines (ChatGPT, Perplexity, AI Overview), and generative search (the citations themselves). You get one report covering all three, because being absent is rarely just an AEO problem."
    pillars:
      heading: "Three pillars. If a tactic does not strengthen one of them, we do not do it."
      ref: "method"   # template pulls bullets from data.method
    deliverable:
      heading: "What you actually get."
      body: "An actionable audit summary. We tell you what to fix, in what order, and what each fix is worth — in plain language you can act on. Deeper execution playbooks and the audit tooling stay scoped to the engagement."
    trust:
      heading: "How we operate."
      moves:
        - "We cap year one at 5 St. Louis clients. Slow growth means deep service."
        - "You own everything we touch. Your domain, your Google Business Profile, your content, your accounts."
        - "Month-to-month, no long contracts. Stop when you want."
    cta:
      pricing_label: "See pricing"
      pricing_link: "/pricing/"
      brief_label: "Send a brief"
      brief_link: "/#contact"
```

- [ ] **Step 4: Verify file is valid YAML**

Run: `python3 -c "import yaml; yaml.safe_load(open('data/en/different.yml'))" && echo OK`
Expected: `OK`

- [ ] **Step 5: Commit**

```bash
git add data/en/different.yml tests/content/15-different-page.sh
git commit -m "feat(data): add /different page content blocks"
```

---

### Task 1.4: Update `i18n/en.toml` with new keys

**Files:** Modify `i18n/en.toml`

- [ ] **Step 1: Append new keys**

Append to `i18n/en.toml`:

```toml
[hero_question]
other = "When customers ask AI what you do, do you show up?"

[cta_why]
other = "Why does this matter to me"

[cta_different]
other = "What makes Gateway Tech AEO different"

[cta_brief]
other = "Or send a brief"

[nav_why]
other = "Why"

[nav_different]
other = "Different"

[nav_pricing]
other = "Pricing"

[nav_faq]
other = "FAQ"

[nav_brief]
other = "Send a brief"
```

- [ ] **Step 2: Verify TOML parses**

Run: `python3 -c "import tomllib; tomllib.load(open('i18n/en.toml','rb'))" && echo OK`
Expected: `OK`

- [ ] **Step 3: Commit**

```bash
git add i18n/en.toml
git commit -m "i18n(en): add fork-architecture nav + CTA keys"
```

---

## Phase 2 — Page templates

### Task 2.1: Create `layouts/why/single.html`

**Files:** Create `layouts/why/single.html`

- [ ] **Step 1: Write the template**

```go-html-template
{{ define "main" }}
{{ $data := (index site.Data site.Language.Lang).why.why }}
<main class="page-why">
  <article class="container">
    <header class="page-header">
      <h1>{{ $data.title }}</h1>
      <p class="page-subtitle">{{ $data.subtitle }}</p>
      <p class="page-intro">{{ $data.intro }}</p>
    </header>

    <section class="stat-grid" aria-label="Six cited statistics about AI search">
      {{ range $data.stats }}
      <article class="stat-card" id="stat-{{ .id }}">
        <h2 class="stat-headline">{{ .headline }}</h2>
        <p class="stat-body">{{ .body }}</p>
        <p class="stat-source">
          <a href="{{ .source_url }}" rel="external nofollow" target="_blank">{{ .source_label }}</a>
        </p>
      </article>
      {{ end }}
    </section>

    <footer class="page-footer">
      <p class="page-outro">{{ $data.outro.body }}</p>
      <a href="{{ $data.outro.cta_link }}" class="btn-fork btn-fork-primary">{{ $data.outro.cta_label }} <span aria-hidden="true">→</span></a>
    </footer>
  </article>
</main>
{{ end }}
```

- [ ] **Step 2: Create `content/english/why.md`**

```markdown
---
title: "Why AI search visibility matters"
description: "Six cited facts about how customers find local businesses through AI search."
type: "why"
layout: "single"
url: "/why/"
---
```

- [ ] **Step 3: Rebuild + run `tests/content/14-why-page.sh`**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/14-why-page.sh
```
Expected: `tests/content/14-why-page.sh: OK`

- [ ] **Step 4: Commit**

```bash
git add layouts/why content/english/why.md
git commit -m "feat(why): /why Path A storybook page with six cited stat cards"
```

---

### Task 2.2: Create `layouts/different/single.html`

**Files:** Create `layouts/different/single.html`, `layouts/partials/trust-moves.html`

- [ ] **Step 1: Create shared `layouts/partials/trust-moves.html`**

```go-html-template
{{ with . }}
<section class="trust-block">
  <h2 class="trust-heading">{{ .heading }}</h2>
  <ul class="trust-moves">
    {{ range .moves }}<li>{{ . }}</li>{{ end }}
  </ul>
</section>
{{ end }}
```

- [ ] **Step 2: Create `layouts/different/single.html`**

```go-html-template
{{ define "main" }}
{{ $data := (index site.Data site.Language.Lang).different.different }}
{{ $method := (index site.Data site.Language.Lang).method.method }}
<main class="page-different">
  <article class="container">
    <header class="page-header">
      <h1>{{ $data.title }}</h1>
      <p class="page-subtitle">{{ $data.subtitle }}</p>
    </header>

    <section class="block-audit-scope">
      <h2>{{ $data.blocks.audit_scope.heading }}</h2>
      <p>{{ $data.blocks.audit_scope.body }}</p>
    </section>

    <section class="block-pillars">
      <h2>{{ $data.blocks.pillars.heading }}</h2>
      <div class="pillar-grid">
        {{ range $method.pillars }}
        <article class="pillar-card" id="pillar-{{ .id }}">
          <h3>{{ .title }}</h3>
          <p class="pillar-tag">{{ .tagline }}</p>
          <ul>
            {{ range .bullets }}<li>{{ . }}</li>{{ end }}
          </ul>
        </article>
        {{ end }}
      </div>
    </section>

    <section class="block-deliverable">
      <h2>{{ $data.blocks.deliverable.heading }}</h2>
      <p>{{ $data.blocks.deliverable.body }}</p>
    </section>

    {{ partial "trust-moves.html" $data.blocks.trust }}

    <footer class="page-footer cta-pair">
      <a href="{{ $data.blocks.cta.pricing_link }}" class="btn-fork btn-fork-primary">{{ $data.blocks.cta.pricing_label }} <span aria-hidden="true">→</span></a>
      <a href="{{ $data.blocks.cta.brief_link }}" class="btn-fork btn-fork-secondary">{{ $data.blocks.cta.brief_label }} <span aria-hidden="true">→</span></a>
    </footer>
  </article>
</main>
{{ end }}
```

- [ ] **Step 3: Create `content/english/different.md`**

```markdown
---
title: "What makes Gateway Tech AEO different"
description: "Three audits in one. Transparent process, transparent pricing, you own everything we touch."
type: "different"
layout: "single"
url: "/different/"
---
```

- [ ] **Step 4: Rebuild + run `tests/content/15-different-page.sh`**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/15-different-page.sh
```
Expected: `tests/content/15-different-page.sh: OK`

- [ ] **Step 5: Commit**

```bash
git add layouts/different layouts/partials/trust-moves.html content/english/different.md
git commit -m "feat(different): /different Path B page with audit scope + pillars + trust moves"
```

---

### Task 2.3: Create `layouts/pricing/single.html`

**Files:** Create `layouts/pricing/single.html`

- [ ] **Step 1: Write the failing test**

Create `tests/content/16-pricing-page.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 2.3: /pricing renders three tiers + trust block.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0
P_HTML="$BUILD/pricing/index.html"
if [[ ! -f "$P_HTML" ]]; then echo "FAIL — $P_HTML not built"; exit 1; fi

REQ=(
  "Audit"
  "Setup & Hand-off"
  "Done-For-You"
  "\$250"
  "\$700"
  "\$500"
  "5 St. Louis clients"
  "Month-to-month"
)
for r in "${REQ[@]}"; do
  if ! grep -q "$r" "$P_HTML"; then
    echo "FAIL — /pricing missing: $r"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/16-pricing-page.sh: FAIL"; exit 1; fi
echo "tests/content/16-pricing-page.sh: OK"
```

Make executable: `chmod +x tests/content/16-pricing-page.sh`

- [ ] **Step 2: Read `layouts/partials/pricing.html`**

Run: `cat layouts/partials/pricing.html`
Note its markup — that's the existing tier-card template. Lift it into the new page template.

- [ ] **Step 3: Create `layouts/pricing/single.html`**

```go-html-template
{{ define "main" }}
{{ $data := (index site.Data site.Language.Lang).pricing.pricing }}
{{ $different := (index site.Data site.Language.Lang).different.different }}
<main class="page-pricing">
  <article class="container">
    <header class="page-header">
      <h1>{{ $data.title }}</h1>
      <p class="page-subtitle">Audit credits toward Setup if you continue. No long contracts.</p>
    </header>

    <section class="pricing-grid">
      {{ range $data.tiers }}
      <article class="pricing-card {{ if .highlight }}pricing-highlight{{ end }}" id="tier-{{ .slug }}">
        <h2>{{ .name }}</h2>
        <p class="price">{{ .price }} <span class="cadence">{{ .cadence }}</span></p>
        <p class="use-when">{{ .use_when }}</p>
        <ul class="includes">
          {{ range .includes }}<li>{{ . }}</li>{{ end }}
        </ul>
        <a href="{{ .cta_link }}" class="btn-fork btn-fork-primary">{{ .cta_label }} <span aria-hidden="true">→</span></a>
      </article>
      {{ end }}
    </section>

    <p class="pricing-footnote">{{ $data.footnote }}</p>

    {{ partial "trust-moves.html" $different.blocks.trust }}

    <footer class="page-footer">
      <a href="/#contact" class="btn-fork btn-fork-primary">Send a brief <span aria-hidden="true">→</span></a>
    </footer>
  </article>
</main>
{{ end }}
```

- [ ] **Step 4: Create `content/english/pricing.md`**

```markdown
---
title: "Pricing — three honest tiers"
description: "Audit $250. Setup $700. Done-For-You $500-$1,200/mo. Listed openly, no sales call required."
type: "pricing"
layout: "single"
url: "/pricing/"
---
```

- [ ] **Step 5: Rebuild + run test**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/16-pricing-page.sh
```
Expected: `tests/content/16-pricing-page.sh: OK`

- [ ] **Step 6: Commit**

```bash
git add layouts/pricing content/english/pricing.md tests/content/16-pricing-page.sh
git commit -m "feat(pricing): dedicated /pricing page with three tiers + trust block"
```

---

### Task 2.4: Create `layouts/faq/single.html` with page-scoped FAQPage JSON-LD

**Files:** Create `layouts/faq/single.html`, `content/english/faq.md`

- [ ] **Step 1: Write the failing test**

Create `tests/content/17-faq-page-scoped.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 2.4: FAQPage JSON-LD lives ONLY on /faq/, not on other pages.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

# /faq must contain FAQPage schema.
FAQ_HTML="$BUILD/faq/index.html"
if [[ ! -f "$FAQ_HTML" ]]; then echo "FAIL — $FAQ_HTML not built"; exit 1; fi
if ! grep -q '"@type":"FAQPage"' "$FAQ_HTML" && ! grep -q '"@type": "FAQPage"' "$FAQ_HTML"; then
  echo "FAIL — /faq missing FAQPage schema"
  FAIL=1
fi

# /, /why, /different, /pricing must NOT contain FAQPage.
for path in index why/index different/index pricing/index; do
  f="$BUILD/$path.html"
  if [[ -f "$f" ]] && grep -q '"@type":"FAQPage"' "$f"; then
    echo "FAIL — $path leaks FAQPage schema"; FAIL=1
  fi
done

# All twelve question texts must appear on /faq.
QS=(
  "What is AEO"
  "robots.txt and schema markup"
  "Is AI search really replacing Google"
  "How much does AEO cost"
  "How long until I see results"
  "Why are your prices so much lower"
  "Can you guarantee a #1 ranking"
  "What if I already have an SEO person"
  "What if I don't even have a website"
  "Google Business Profile"
  "What if I want to stop"
  "Can I do this myself"
)
for q in "${QS[@]}"; do
  if ! grep -q "$q" "$FAQ_HTML"; then
    echo "FAIL — /faq missing question: $q"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/17-faq-page-scoped.sh: FAIL"; exit 1; fi
echo "tests/content/17-faq-page-scoped.sh: OK"
```

Make executable: `chmod +x tests/content/17-faq-page-scoped.sh`

- [ ] **Step 2: Create `layouts/faq/single.html`**

```go-html-template
{{ define "main" }}
{{ $data := (index site.Data site.Language.Lang).faq.faq }}
<main class="page-faq">
  <article class="container">
    <header class="page-header">
      <h1>{{ $data.title }}</h1>
    </header>

    <dl class="faq-list">
      {{ range $i, $item := $data.items }}
      {{ $slug := printf "q%d" (add $i 1) }}
      <dt id="{{ $slug }}" class="faq-question">
        <a href="#{{ $slug }}" class="faq-permalink">{{ $item.question }}</a>
      </dt>
      <dd class="faq-answer">{{ $item.answer | safeHTML }}</dd>
      {{ end }}
    </dl>
  </article>
</main>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {{ range $i, $item := $data.items }}{{ if gt $i 0 }},{{ end }}
    {
      "@type": "Question",
      "name": {{ $item.question | jsonify }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ $item.answer | plainify | jsonify }}
      }
    }
    {{ end }}
  ]
}
</script>
{{ end }}
```

- [ ] **Step 3: Create `content/english/faq.md`**

```markdown
---
title: "Common questions"
description: "Twelve questions we hear most often about Answer Engine Optimization, pricing, results, and how we work."
type: "faq"
layout: "single"
url: "/faq/"
---
```

- [ ] **Step 4: Remove site-wide FAQPage JSON-LD from `head.html`**

Open `layouts/partials/head.html`. Locate the JSON-LD block containing `"@type":"FAQPage"`. Delete just that node from the `@graph` array. Preserve other nodes (Person, WebSite, WebPage, ProfessionalService, BreadcrumbList).

If the FAQPage node is the only schema on those non-FAQ pages and removing it leaves valid JSON, commit. If removing creates a trailing comma in JSON-LD, fix that too.

- [ ] **Step 5: Rebuild + run test**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/17-faq-page-scoped.sh
```
Expected: `tests/content/17-faq-page-scoped.sh: OK`

- [ ] **Step 6: Commit**

```bash
git add layouts/faq content/english/faq.md tests/content/17-faq-page-scoped.sh layouts/partials/head.html
git commit -m "feat(faq): dedicated /faq page with scoped FAQPage JSON-LD"
```

---

## Phase 3 — Homepage strip-down

### Task 3.1: Rewrite `layouts/index.html` to hero-fork only

**Files:** Modify `layouts/index.html`

- [ ] **Step 1: Replace file contents**

```go-html-template
{{ define "main" }}
{{ partial "banner.html" . }}

{{/*
  Homepage intentionally minimal post-AEO-2 rebrand.
  Educational + reassurance content lives on /why and /different.
  Pricing on /pricing. FAQ on /faq. Intake form mounted on /#contact.
*/}}

<section class="home-teaser">
  <div class="container">
    <p class="home-teaser-copy">Or, if you already know what you need: <a href="/#contact" class="home-teaser-link">send a brief →</a></p>
  </div>
</section>

{{ partial "contact.html" . }}
{{ end }}
```

- [ ] **Step 2: Rebuild + run hero test**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/13-fork-hero.sh
```
Expected: `tests/content/13-fork-hero.sh: OK`

- [ ] **Step 3: Commit**

```bash
git add layouts/index.html
git commit -m "refactor(home): strip doom-scroll sections; hero + intake only"
```

---

### Task 3.2: Drop demos

**Files:** Delete `content/english/demos/`, parallel locale dirs, `layouts/partials/aeo-loop-videos.html`

- [ ] **Step 1: Write the failing test**

Create `tests/content/18-no-demos.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 3.2: no demo cards anywhere in built site.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

# No /demos/ directory in build output.
if [[ -d "$BUILD/demos" ]]; then
  echo "FAIL — $BUILD/demos still exists"; FAIL=1
fi

# No demo-card markup on the homepage.
if grep -q 'demo-card' "$BUILD/index.html"; then
  echo "FAIL — homepage still contains demo-card markup"; FAIL=1
fi

if (( FAIL )); then echo "tests/content/18-no-demos.sh: FAIL"; exit 1; fi
echo "tests/content/18-no-demos.sh: OK"
```

Make executable: `chmod +x tests/content/18-no-demos.sh`

- [ ] **Step 2: Delete demo content + locale parallels**

```bash
git rm -r content/english/demos content/spanish/demos content/japanese/demos content/french/demos content/german/demos
git rm layouts/partials/aeo-loop-videos.html
```

If any of those paths do not exist, omit them from the `rm`. List first with: `ls content/*/demos 2>/dev/null`.

- [ ] **Step 3: Rebuild + run test**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/18-no-demos.sh
```
Expected: `tests/content/18-no-demos.sh: OK`

- [ ] **Step 4: Commit**

```bash
git add tests/content/18-no-demos.sh
git commit -m "chore(demos): drop demo content + partial — AEO narrative focus"
```

---

### Task 3.3: Drop author bio

**Files:** Delete `data/{en,es,ja,fr,de}/author.yml`, `layouts/about/`, `layouts/partials/author-bio.html`, `content/english/about*.md` if exists

- [ ] **Step 1: Write the failing test**

Create `tests/content/19-no-author-bio.sh`:

```bash
#!/usr/bin/env bash
# AEO-2 Task 3.3: no author photo or bio on any built page.
set -e
ROOT="$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
REPO="$( cd -- "$ROOT/../.." &> /dev/null && pwd )"
BUILD="${BUILD_DIR:-/tmp/aeo-test-build}"

FAIL=0

# Photo file must not be referenced.
if grep -rq 'matthew-jamison.webp' "$BUILD"; then
  echo "FAIL — author photo still referenced in built site"; FAIL=1
fi

# No /about/ page.
if [[ -d "$BUILD/about" ]]; then
  echo "FAIL — $BUILD/about still exists"; FAIL=1
fi

# No author-bio CSS class rendered in built HTML.
for f in "$BUILD/index.html" "$BUILD/different/index.html" "$BUILD/why/index.html"; do
  if [[ -f "$f" ]] && grep -q 'author-bio' "$f"; then
    echo "FAIL — author-bio markup found on $(basename "$(dirname "$f")")"; FAIL=1
  fi
done

if (( FAIL )); then echo "tests/content/19-no-author-bio.sh: FAIL"; exit 1; fi
echo "tests/content/19-no-author-bio.sh: OK"
```

Make executable: `chmod +x tests/content/19-no-author-bio.sh`

- [ ] **Step 2: List then delete**

```bash
ls content/english/about* 2>/dev/null
ls content/spanish/about* content/japanese/about* content/french/about* content/german/about* 2>/dev/null
ls data/*/author.yml 2>/dev/null
ls layouts/about 2>/dev/null
ls layouts/partials/author-bio.html 2>/dev/null
```

Then `git rm` everything that exists:

```bash
git rm -r layouts/about layouts/partials/author-bio.html data/en/author.yml data/es/author.yml data/ja/author.yml data/fr/author.yml data/de/author.yml
git rm content/english/about*.md content/spanish/about*.md content/japanese/about*.md content/french/about*.md content/german/about*.md 2>/dev/null || true
```

- [ ] **Step 3: Strip author-bio partial calls from any remaining template**

Run: `grep -rl 'author-bio' layouts/`
For each match: open the file, delete the `{{ partial "author-bio.html" . }}` invocation and the surrounding section if it only exists to render the partial.

- [ ] **Step 4: Strip author photo references from `head.html` JSON-LD if present**

Open `layouts/partials/head.html`. Search for `matthew-jamison.webp` or `Person` node with `image` field. Remove the `image` property from any Person node (the Person entity itself stays).

- [ ] **Step 5: Rebuild + run test**

Run:
```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
bash tests/content/19-no-author-bio.sh
```
Expected: `tests/content/19-no-author-bio.sh: OK`

- [ ] **Step 6: Commit**

```bash
git add tests/content/19-no-author-bio.sh layouts/partials/head.html
git commit -m "chore(author): drop bio + photo + about page — offer-first focus"
```

---

## Phase 4 — Navigation + footer

### Task 4.1: Rewrite `layouts/partials/navigation.html`

**Files:** Modify `layouts/partials/navigation.html`

- [ ] **Step 1: Read current file**

Run: `wc -l layouts/partials/navigation.html`
Skim to understand language switcher (must preserve).

- [ ] **Step 2: Rewrite nav links**

Replace the `<ul class="navbar-nav">` block with:

```go-html-template
<ul class="navbar-nav ml-auto mr-3">
  <li class="nav-item"><a class="nav-link" href="/why/">{{ i18n "nav_why" }}</a></li>
  <li class="nav-item"><a class="nav-link" href="/different/">{{ i18n "nav_different" }}</a></li>
  <li class="nav-item"><a class="nav-link" href="/pricing/">{{ i18n "nav_pricing" }}</a></li>
  <li class="nav-item"><a class="nav-link" href="/faq/">{{ i18n "nav_faq" }}</a></li>
  <li class="nav-item"><a class="nav-link nav-cta" href="/#contact">{{ i18n "nav_brief" }}</a></li>
</ul>
```

Keep the existing `<select id="select-language">` block intact below the nav links.

- [ ] **Step 3: Rebuild + verify all five nav items in built homepage**

```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
for path in /why/ /different/ /pricing/ /faq/ '/#contact'; do
  grep -q "href=\"$path\"" /tmp/aeo-test-build/index.html || echo "MISSING $path"
done
```
Expected: no `MISSING` output.

- [ ] **Step 4: Commit**

```bash
git add layouts/partials/navigation.html
git commit -m "feat(nav): four-page nav + Send-a-brief CTA"
```

---

### Task 4.2: Update `layouts/partials/footer.html`

**Files:** Modify `layouts/partials/footer.html`

- [ ] **Step 1: Read current footer**

Run: `wc -l layouts/partials/footer.html`

- [ ] **Step 2: Strip portal/battle/demo stubs**

Search: `grep -n 'portal\|battle\|demo' layouts/partials/footer.html`
For each match unrelated to the contact form, delete the line or block.

- [ ] **Step 3: Replace `?service=` slug map**

Find the inline `<script>` that maps `?service=foundation|complete-presence|partnership` etc. Replace the slug list with `audit|setup|dfy` to match current `data/en/pricing.yml`. If the old slugs are not present anywhere, just keep the new ones.

- [ ] **Step 4: Add three-link footer nav**

Inside the footer, near the bottom:

```html
<nav class="footer-nav" aria-label="Footer">
  <a href="/pricing/">{{ i18n "nav_pricing" }}</a>
  <a href="/faq/">{{ i18n "nav_faq" }}</a>
  <a href="/#contact">{{ i18n "nav_brief" }}</a>
</nav>
```

- [ ] **Step 5: Rebuild + smoke check**

```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
grep -q 'class="footer-nav"' /tmp/aeo-test-build/index.html && echo OK
```
Expected: `OK`

- [ ] **Step 6: Commit**

```bash
git add layouts/partials/footer.html
git commit -m "refactor(footer): drop portal/battle/demo stubs; add Pricing/FAQ/Brief nav"
```

---

## Phase 5 — CSS atmosphere

### Task 5.1: Add charcoal token + base swap in `critical-inline.css`

**Files:** Modify `assets/css/critical-inline.css`

- [ ] **Step 1: Read the token block**

Run: `sed -n '1,40p' assets/css/critical-inline.css`
Note current `:root` block.

- [ ] **Step 2: Add `--charcoal` token and switch body base**

Inside `:root` add `--charcoal: #1a1a1a;` after the existing tokens.

In the body selector, change `background-color` (or add it if absent) to `var(--charcoal)` and ensure `color: var(--light-text)` is present.

If a `body` rule does not exist in critical-inline.css yet, append:

```css
body {
  background-color: var(--charcoal);
  color: var(--light-text);
  font-family: 'Anaheim', system-ui, sans-serif;
}
```

- [ ] **Step 3: Add `prefers-reduced-motion` block**

At the end of `critical-inline.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .hero-area::before, .hero-area .video-button, .stat-card, .pillar-card {
    animation: none !important;
    transition: none !important;
  }
}
```

- [ ] **Step 4: Build + measure critical CSS size**

```bash
hugo --minify --gc --environment production -d /tmp/aeo-test-build >/dev/null
stat -f "critical-inline size: %z bytes" /tmp/aeo-test-build/css/critical-inline*.css 2>/dev/null || wc -c assets/css/critical-inline.css
```
Should still be under 12KB minified.

- [ ] **Step 5: Commit**

```bash
git add assets/css/critical-inline.css
git commit -m "feat(theme): charcoal base + prefers-reduced-motion block"
```

---

### Task 5.2: Strip dead keyframes + add fork/stat/pillar/trust styles in `custom.css`

**Files:** Modify `assets/css/custom.css`

- [ ] **Step 1: Identify dead keyframes**

```bash
grep -n '^@keyframes' assets/css/custom.css
grep -rn 'portal-\|battle-\|pokemon-pikachu\|pokemon-mew\|pokemon-celebi\|pokemon-jirachi' layouts/ assets/css/ | grep -v custom.css
```

Any `@keyframes` whose name (or whose only consumers) shows zero references in `layouts/` is a candidate. Confirm before deletion.

- [ ] **Step 2: Delete confirmed-dead keyframes + their consumers**

For each confirmed-dead keyframe block, delete the `@keyframes name { ... }` block and any rule that uses `animation: name`.

- [ ] **Step 3: Add new styles**

Append:

```css
/* AEO-2 fork hero */
.hero-fork {
  background:
    radial-gradient(circle at 30% 20%, rgba(233, 30, 99, 0.18), transparent 60%),
    radial-gradient(circle at 80% 80%, rgba(0, 188, 212, 0.10), transparent 60%),
    var(--charcoal);
  padding: 6rem 0 5rem;
  text-align: center;
}
.hero-kicker {
  display: inline-block;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.12em;
  color: var(--accent);
  margin-bottom: 1.5rem;
}
.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.15;
  margin: 0 0 1rem;
}
.hero-title em { color: var(--primary); font-style: normal; }
.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255,255,255,0.85);
  margin-bottom: 2.5rem;
}
.hero-fork-ctas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.btn-fork {
  display: inline-block;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-fork-primary {
  background: var(--primary);
  color: var(--light-text);
  border: 1px solid var(--primary);
}
.btn-fork-secondary {
  background: transparent;
  color: var(--light-text);
  border: 1px solid rgba(255,255,255,0.4);
}
.btn-fork:hover { transform: translateY(-1px); }
.hero-tertiary {
  display: inline-block;
  color: var(--accent);
  text-decoration: underline;
  font-size: 0.95rem;
}

/* Stat cards (/why) */
.stat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}
.stat-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 1.5rem;
}
.stat-headline {
  font-size: 1.25rem;
  color: var(--accent);
  margin: 0 0 0.75rem;
}
.stat-body { margin: 0 0 1rem; color: rgba(255,255,255,0.9); }
.stat-source a {
  color: rgba(255,255,255,0.6);
  font-size: 0.875rem;
  text-decoration: underline;
}

/* Pillar cards (/different) */
.pillar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0 3rem;
}
.pillar-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 1.5rem;
}
.pillar-card h3 { color: var(--primary); margin: 0 0 0.5rem; }
.pillar-tag { color: var(--accent); font-style: italic; margin: 0 0 1rem; }

/* Trust block (shared) */
.trust-block { margin: 3rem 0; }
.trust-moves { list-style: none; padding: 0; margin: 0; }
.trust-moves li {
  padding: 0.875rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.trust-moves li:last-child { border-bottom: 0; }
```

- [ ] **Step 4: Verify PurgeCSS keeps new classes**

Open `purgecss.config.js`. In the `standard:` safelist (or `deep:` if using regex prefixes), add:

```js
'btn-fork', 'btn-fork-primary', 'btn-fork-secondary',
'hero-fork', 'hero-kicker', 'hero-title', 'hero-subtitle', 'hero-fork-ctas', 'hero-tertiary',
'stat-grid', 'stat-card', 'stat-headline', 'stat-body', 'stat-source',
'pillar-grid', 'pillar-card', 'pillar-tag',
'trust-block', 'trust-moves', 'trust-heading',
'page-why', 'page-different', 'page-pricing', 'page-faq',
'home-teaser', 'home-teaser-copy', 'home-teaser-link',
'footer-nav', 'nav-cta',
```

- [ ] **Step 5: Build + verify styles survive PurgeCSS**

```bash
hugo --minify --gc --environment production -d /tmp/aeo-test-build >/dev/null
node purge-css.js
grep -q 'btn-fork-primary' /tmp/aeo-test-build/css/purged/*.css || echo MISSING_PURGE
```
Expected: no `MISSING_PURGE`.

- [ ] **Step 6: Commit**

```bash
git add assets/css/custom.css purgecss.config.js
git commit -m "feat(theme): fork hero + stat + pillar + trust styles; strip dead keyframes"
```

---

## Phase 6 — Locale mirror (EN-only release with TODO placeholders)

### Task 6.1: Mirror EN into es/ja/fr/de — content shells

**Files:** Create `content/{spanish,japanese,french,german}/{why,different,pricing,faq}.md`

- [ ] **Step 1: Copy EN content shells, mark TODO**

```bash
for lang in spanish japanese french german; do
  for page in why different pricing faq; do
    cp content/english/${page}.md content/${lang}/${page}.md
    # Insert TODO marker into front matter
    sed -i '' 's/^---$/---\n# TODO: translate from English/' content/${lang}/${page}.md
  done
done
```

(macOS `sed` requires `''` after `-i`. On Linux drop it.)

- [ ] **Step 2: Verify Hugo builds all five locales**

```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null
for lang in es ja fr de; do
  ls /tmp/aeo-test-build/${lang}/why/index.html /tmp/aeo-test-build/${lang}/different/index.html /tmp/aeo-test-build/${lang}/pricing/index.html /tmp/aeo-test-build/${lang}/faq/index.html
done
```
Expected: all 16 paths print without error.

- [ ] **Step 3: Commit**

```bash
git add content/spanish content/japanese content/french content/german
git commit -m "i18n(stub): mirror EN /why /different /pricing /faq shells with TODO markers"
```

---

### Task 6.2: Mirror EN data into es/ja/fr/de

**Files:** Create `data/{es,ja,fr,de}/{why,different}.yml`; update `data/{es,ja,fr,de}/banner.yml`

- [ ] **Step 1: Mirror why + different**

```bash
for lang in es ja fr de; do
  for page in why different; do
    {
      echo "# TODO: translate from English"
      cat data/en/${page}.yml
    } > data/${lang}/${page}.yml
  done
done
```

- [ ] **Step 2: Mirror updated banner.yml**

```bash
for lang in es ja fr de; do
  {
    echo "# TODO: translate from English"
    cat data/en/banner.yml
  } > data/${lang}/banner.yml
done
```

- [ ] **Step 3: Verify YAML parses**

```bash
for lang in es ja fr de; do
  for f in data/${lang}/why.yml data/${lang}/different.yml data/${lang}/banner.yml; do
    python3 -c "import yaml; yaml.safe_load(open('$f'))" && echo "OK $f"
  done
done
```
Expected: 12 `OK` lines.

- [ ] **Step 4: Mirror i18n keys**

```bash
NEW_KEYS=$(grep -A1 -E '^\[(hero_question|cta_why|cta_different|cta_brief|nav_why|nav_different|nav_pricing|nav_faq|nav_brief)\]' i18n/en.toml)

for lang in es ja fr de; do
  {
    echo "# TODO: translate the following AEO-2 keys"
    echo "$NEW_KEYS"
  } >> i18n/${lang}.toml
done
```

Verify each file parses:

```bash
for lang in es ja fr de; do
  python3 -c "import tomllib; tomllib.load(open('i18n/${lang}.toml','rb'))" && echo "OK ${lang}"
done
```
Expected: 4 `OK` lines.

- [ ] **Step 5: Rebuild full site + verify all locales**

```bash
HUGO_ENV=production hugo --minify --gc -d /tmp/aeo-test-build >/dev/null && echo OK
```
Expected: `OK` with no warnings.

- [ ] **Step 6: Commit**

```bash
git add data/es data/ja data/fr data/de i18n/es.toml i18n/ja.toml i18n/fr.toml i18n/de.toml
git commit -m "i18n(stub): mirror EN data + keys into es/ja/fr/de with TODO markers"
```

---

## Phase 7 — Test integration + verification

### Task 7.1: Run the full test suite

**Files:** none

- [ ] **Step 1: Run full bash suite**

```bash
bash tests/run-all.sh
```
Expected: `==> ALL ENABLED TESTS PASSED`

If any individual test fails, address it before moving on. Common failure: `tests/content/11-hero-positioning.sh` if Step 7 of Task 1.1 was skipped.

- [ ] **Step 2: Lighthouse local — homepage**

Start hugo server in another shell: `hugo server -D --port 1313`
Then:

```bash
npx --yes @lhci/cli@latest collect --url=http://127.0.0.1:1313/ --numberOfRuns=1
```
Open the resulting JSON in `.lighthouseci/`. Performance, accessibility, best-practices should each be ≥ 95.

- [ ] **Step 3: Lighthouse local — /why /different /pricing /faq**

```bash
for path in why different pricing faq; do
  npx --yes @lhci/cli@latest collect --url=http://127.0.0.1:1313/${path}/ --numberOfRuns=1
done
```
Same threshold (≥ 95 across the three scores).

- [ ] **Step 4: Pa11y (WCAG 2.2 AA)**

With hugo server still running:

```bash
PA11Y=1 bash tests/run-all.sh
```
Or directly:

```bash
npx --yes pa11y-ci --sitemap http://127.0.0.1:1313/sitemap.xml --threshold 0
```
Expected: zero violations.

- [ ] **Step 5: Verify FAQ Rich Results**

Open Google's Rich Results Test (https://search.google.com/test/rich-results) and enter the deployed preview URL once Cloudflare Pages builds the branch preview. Expected: FAQPage valid, no warnings.

For pre-deploy, validate locally:

```bash
node -e "const html = require('fs').readFileSync('/tmp/aeo-test-build/faq/index.html','utf8'); const m = html.match(/<script type=\"application\/ld\+json\">([\s\S]*?FAQPage[\s\S]*?)<\/script>/); JSON.parse(m[1]); console.log('FAQPage JSON-LD parses')"
```
Expected: `FAQPage JSON-LD parses`

- [ ] **Step 6: CSP smoke**

```bash
grep -A2 '^/\*' static/_headers | grep -i 'Content-Security-Policy'
```
Verify no new third-party origins appear. CSP should still match the canonical entry documented in `.claude/rules/references/security-headers.md`.

---

### Task 7.2: Final commit + push

**Files:** none

- [ ] **Step 1: Confirm clean tree**

Run: `git status --short`
Expected: nothing tracked outstanding. The local-only spec + plan at `docs/superpowers/{specs,plans}/` remain untracked.

- [ ] **Step 2: Push branch (ASK before pushing)**

Before running `git push`, confirm with Matthew that he wants the branch pushed to origin. This is a remote-affecting action.

If approved:

```bash
git push -u origin feat/aeo-rebrand-fork-architecture
```

- [ ] **Step 3: Open PR**

```bash
gh pr create --title "feat(aeo): fork-in-road homepage architecture + multi-page hub" --body "$(cat <<'EOF'
## Summary
- Replaces the doom-scroll homepage with a hero question + two CTAs ("Why does this matter to me" · "What makes Gateway Tech AEO different").
- Splits content into `/why` (cold-prospect education with six cited stats), `/different` (researching-prospect reassurance), `/pricing`, `/faq`.
- Removes demos and author bio per offer-first positioning.
- Charcoal `#1a1a1a` base with magenta+cyan accents; existing tokens, no new palette.
- FAQPage JSON-LD scoped to `/faq/` only.
- EN ships now; es/ja/fr/de mirror EN content with TODO markers — translate in follow-up PRs per locale.

## Test plan
- [x] `bash tests/run-all.sh` passes (13–19 new + 11 updated)
- [x] Lighthouse on `/`, `/why`, `/different`, `/pricing`, `/faq` ≥ 95 across perf/a11y/best-practices
- [x] Pa11y zero violations
- [x] FAQPage JSON-LD valid via local parse + Rich Results test on preview
- [x] CSP unchanged
- [x] All five locales build
EOF
)"
```

Print the PR URL when done.

---

## Self-review

**Spec coverage check** (locked-in decisions from spec → task that ships it):

| Spec item | Task |
|---|---|
| Multi-page hub architecture | Phase 2 + Phase 3.1 |
| Fork-in-road hero pattern | Task 1.1 |
| Hero question + two CTAs copy | Task 1.1 |
| `/why` six cited stat cards | Task 1.2 + Task 2.1 |
| `/different` audit scope + pillars + trust moves | Task 1.3 + Task 2.2 |
| `/pricing` dedicated page | Task 2.3 |
| `/faq` page with scoped FAQPage JSON-LD | Task 2.4 |
| Drop demos | Task 3.2 |
| Drop author bio | Task 3.3 |
| Charcoal + magenta atmosphere | Task 5.1 + Task 5.2 |
| `prefers-reduced-motion` block | Task 5.1 |
| EN-first locale shipping with TODO mirrors | Task 6.1 + Task 6.2 |
| Strunk copy rules applied | Task 1.2 + Task 1.3 (copy itself) |
| Three BDD stories from spec | Task 1.1 + Task 1.2 + Task 1.3 acceptance scenarios |
| Hero positioning test updated | Task 1.1 Step 7 |

No spec items unmapped.

**Placeholder scan:** none found in tasks. All code blocks contain real content. No "TBD" / "implement later" / "similar to Task N" patterns.

**Type/path consistency:**
- Data namespace: every template reads `(index site.Data site.Language.Lang).<page>.<page>` consistently.
- File paths: `data/en/<page>.yml`, `layouts/<page>/single.html`, `content/english/<page>.md`, `tests/content/<NN>-<slug>.sh` — all match.
- i18n keys: `hero_question`, `cta_why`, `cta_different`, `cta_brief`, `nav_*` — defined in en.toml then mirrored in Phase 6.

---

## Execution choice

Plan complete and saved to `docs/superpowers/plans/2026-05-14-aeo-rebrand-implementation.md` (local-only, not committed).

Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using `superpowers:executing-plans`, batch execution with checkpoints.

Which approach?
