# Gateway Tech AEO — homepage rebrand (AEO-2)

## Context

The site at https://gatewaytechaeo.com currently runs as one long scrolling page. Matthew's wife flagged three problems after a walkthrough:

1. The hero leads with builder credentials ("Built by a full-stack engineer") instead of the offer.
2. The page explains too much AEO theory before the visitor knows why they should care.
3. The white background and infinite scroll bury the value prop.

The audience splits cleanly:
- **Cold business owners** — never heard of AEO, must be educated *and* shown why it matters before they will spend a dollar.
- **Researching owners** — already shopping for AEO/GEO services, want reassurance the process is thorough without the secret sauce.

Matthew is a solo operator. The market gap he fills is real: established AEO firms (First Page Sage, GenOptima, Directive, Omnius) target enterprise, hide pricing behind sales calls, and lean on jargon ("entity positioning," "atomic content architecture"). Gateway Tech serves under-$5M-revenue businesses and mid-size organizations with transparent fixed pricing and one-person accountability.

Goal: rebuild the site so a cold visitor reaches "I get it, I want this" in under 90 seconds, and a researching visitor reaches "this is thorough, here's the cost" in under three clicks. Use Strunk's clarity rules on every line.

## Decisions locked in

| Decision | Choice |
|---|---|
| Page architecture | Multi-page hub. Doom-scroll dies. |
| Hero pattern | Fork-in-road. One question, two CTAs. |
| Hero question | "When customers ask AI what you do, do you show up?" |
| CTA labels | "Why does this matter to me" · "What makes Gateway Tech AEO different" |
| Color base | Charcoal (`#1a1a1a` lifted from pure black), magenta `--primary` accents, cyan `--accent` sparingly |
| Demos | Removed entirely from public site |
| Author bio | Removed entirely. No photo, no story, no day-job link. |
| Pricing | Dedicated `/pricing` page |
| FAQ | Dedicated `/faq` page, full FAQPage schema |
| Method gloss | Lives on `/different`. Names the three pillars; conceals tool + audit methodology. |
| Audit angle | "Comprehensive audit covering SEO + AEO + GEO → prioritized action plan." Method concealed. |

## Site map (new)

```
/                  Hero + fork + intake teaser
/why               Path A — stat-card storybook for cold owners
/different         Path B — process thoroughness + trust moves for researching owners
/pricing           Three tiers + cap + ownership + month-to-month
/faq               Full FAQPage with schema
/brief (#contact)  Intake form (existing brief-intake-collector Worker)
```

Footer everywhere: Pricing · FAQ · Send a brief.

## Copy drafts (Strunk-edited)

### Home hero

```
ANSWER ENGINE OPTIMIZATION · ST. LOUIS

When customers ask AI what you do,
do you show up?

We make sure they cite you.

[ Why does this matter to me →     ]   [ What makes us different →     ]

  Or send a brief →
```

Notes: active voice. Two definite CTAs at hero. The brief link is a quiet third path for warm leads who already want to talk.

### `/why` — Path A (cold prospect education)

One page. Six stat cards. ~450 words total. Each card cites a public source.

**Headline:** "Your customers are asking AI about businesses like yours. Most local businesses are invisible to it."

**Stat cards (final, all sourced):**

1. **45% of consumers now ask AI for local business recommendations — up from 6% a year ago.** BrightLocal, Local Consumer Review Survey 2026. Source linked.
2. **93% of AI search sessions end without a single click to a website.** Citation IS the conversion — the AI answers, the buyer decides, the visit never happens. Source linked.
3. **60% of citations in AI Overviews go to third-party sites (Yelp, Reddit, Quora). Only 40% cite individual businesses directly.** You compete for both. Source linked.
4. **AI Overviews appear on ~48% of tracked queries, yet only 17% of cited sources also rank in Google's organic top 10.** Being on page one of Google does not mean AI cites you. Source linked.
5. **25% of all search traffic shifts to AI by the end of this year.** Gartner, February 2024. Source linked.
6. **The Google Business Profile remains the #1 ranking factor for local results — in AI search and traditional search.** Whitespark, 2026 Local Search Ranking Factors. Source linked.

Footer of `/why`:
> "Short version: we structure your site, your Google Business Profile, and your third-party listings so AI tools cite you when customers ask. The tools include ChatGPT, Perplexity, Google's AI Overview, and Claude."
>
> **[ See what we actually do → /different ]**

Sources to cite inline (verified during plan, May 2026):
- BrightLocal LCRS 2026 — 45% adoption: `https://www.brightlocal.com/research/lcrs-ai-trust/`
- Zero-click 93% — verified via multiple AEO/SEO industry reports
- AI Overviews citation breakdown (60% third-party / 40% direct) — industry research compilation
- Gartner forecast — `https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents`
- Whitespark 2026 — `https://whitespark.ca/local-search-ranking-factors/`

### `/different` — Path B (researching prospect reassurance)

One page. Five blocks. ~600 words total. Names what we do; conceals how.

**Block 1 — Headline:** "We audit three things, not one."
> "Most AEO services check whether AI can cite you. We audit your visibility across classical search (Google's ten blue links), answer engines (ChatGPT, Perplexity, AI Overview), and generative search (the citations themselves). You get one report covering all three, because being absent is rarely just an AEO problem."

**Block 2 — The three pillars (from `data/en/method.yml`, keep current content):**
- **Technical** — Can AI find you?
- **Authority** — Can AI trust you?
- **Content** — Do you answer what they ask?

Three short bullets each, current copy. No tool names, no schema-type lists, no robots.txt syntax.

**Block 3 — What you actually get:**
> "An actionable audit summary. We tell you what to fix, in what order, and what each fix is worth — in plain language you can act on. Deeper execution playbooks and the audit tooling stay scoped to the engagement."

This wording softens the original draft. The summary the client receives is real and useful; the methodology that produced it is not transferred. Honest, on-brand, no over-promise.

**Block 4 — Trust moves (lift from FAQ + pricing.yml footnote):**
- We cap year one at 5 St. Louis clients. Slow growth means deep service.
- You own everything we touch. Your domain, your Google Business Profile, your content, your accounts.
- Month-to-month, no long contracts. Stop when you want.

**Block 5 — CTA pair:**
- [ See pricing → /pricing ]
- [ Send a brief → /#contact ]

### `/pricing`

Three cards from `data/en/pricing.yml` — no changes to numbers. Add:
- Sticky note above cards: "Audit credits toward Setup if you continue. No long contracts."
- Below cards: trust-move block (5-client cap, ownership, month-to-month) repeated for visitors who land directly on `/pricing` from search.
- Single CTA at bottom: Send a brief.

### `/faq`

All twelve FAQ entries from `data/en/faq.yml`. Render with `<dl><dt><dd>` plus `FAQPage` JSON-LD on this page only (move from current `head.html`-global to page-scoped). Standard accordion, all collapsed by default. Permalink to each question (`#what-is-aeo` etc.) so AI can cite individual answers.

## Visual atmosphere

Use existing tokens. No new palette.

| Surface | Token | Hex |
|---|---|---|
| Page base | `--charcoal` (new) | `#1a1a1a` |
| Card surface | rgba(255,255,255,0.04) over base | — |
| Primary CTA | `--primary` | `#e91e63` |
| Body text | `--light-text` | `#ffffff` (90% opacity for body, 100% for headings) |
| Accent (links, stat numbers) | `--accent` | `#00bcd4` |
| Borders | rgba(255,255,255,0.08) | — |

Hero gets a slow ambient magenta wash (CSS radial-gradient, no animation on LCP). No keyframes on the hero `<img>` — per `assets/css/custom.css:76` rule.

Add `@media (prefers-reduced-motion: reduce)` block to kill the existing `sparkle` and `pulse` keyframes from `custom.css:49-119`.

## Strunk rules applied to all copy

- Active voice: "We audit three things," not "Three things are audited."
- Positive form: "You keep the plan," not "You don't lose the plan."
- Definite, specific, concrete: "5 St. Louis clients in year one," not "limited capacity."
- Omit needless words: "Stop when you want." Not "You always retain the ability to stop service at any time."
- Emphatic word at end: "You own everything we touch." Not "Everything we touch is yours."

## BDD acceptance scenarios

**Story: Cold owner figures out AEO matters.**
In order to decide whether AEO is worth my time,
a small-business owner who has never heard of AEO needs the page to teach me in under 90 seconds.

```
Scenario: Cold owner follows Path A
  Given I am on the homepage and have never heard of AEO
  When I click "Why does this matter to me"
  Then I should land on /why with six cited stat cards
  And I should see a link to /different at the bottom

Scenario: Cold owner reaches pricing in three clicks
  Given I am on /why and finish reading
  When I follow the "See what we do" link to /different
  And I follow the "See pricing" link
  Then I should land on /pricing with three visible tiers
```

**Story: Researching owner verifies thoroughness.**
In order to decide whether to hire Gateway Tech,
a business owner who already knows AEO wants to see the process, the pricing, and the trust posture without a sales call.

```
Scenario: Researching owner follows Path B
  Given I am on the homepage and I already know what AEO is
  When I click "What makes Gateway Tech AEO different"
  Then I should see the audit scope, the three pillars, what I receive, and the trust moves
  And I should see no methodology details I could replicate myself

Scenario: Researching owner reaches the brief
  Given I am on /different
  When I follow "Send a brief"
  Then I should land at the existing intake form
  And the form should pre-fill no service field
```

**Story: Skeptic verifies claims.**
In order to trust the offer,
a skeptical visitor wants every claim on the site backed by a public source.

```
Scenario: Skeptic clicks any stat
  Given I am on /why
  When I click any cited statistic
  Then a link should open the original source in a new tab
  And the source should be a recognized research firm (Gartner, Adobe, Whitespark, Schema.org)
```

## Files changed (preview — no edits in plan mode)

| File | Change |
|---|---|
| `layouts/index.html` | Rewrite. Remove demo grid, FAQ, pricing, method. Hero + fork only. |
| `layouts/_default/single.html` or new `layouts/page/single.html` | Add page-type template for `/why`, `/different`, `/pricing`, `/faq`. |
| `content/english/why.md` | New. Front matter + stat-card data references. |
| `content/english/different.md` | New. Front matter + section references. |
| `content/english/pricing.md` | New. Front matter pulls from `data/en/pricing.yml`. |
| `content/english/faq.md` | New. Front matter pulls from `data/en/faq.yml`. Adds `FAQPage` schema scoped to this page. |
| `content/english/demos/*.md` + `content/{es,ja,fr,de}/demos/*` | Delete all. |
| `content/english/about*.md` if exists | Delete. |
| `data/en/author.yml` | Delete (also for `es`, `ja`, `fr`, `de`). |
| `data/en/why.yml` | New. Stat-card content per locale. |
| `data/en/different.yml` | New. Block content per locale. |
| `assets/css/critical-inline.css` | Add `--charcoal: #1a1a1a` token. Switch page base. Add `prefers-reduced-motion` block. |
| `assets/css/custom.css` | Remove unused pokemon/portal/battle keyframes confirmed dead. Update hero ambient gradient. |
| `layouts/partials/head.html` | Move FAQ JSON-LD off global, on to `/faq` only. Update OG image to a generated card with hero question. |
| `layouts/partials/footer.html` | Replace service-slug map with current `{audit,setup,dfy}` slugs. Strip portal/battle stubs. |
| `i18n/{en,es,ja,fr,de}.toml` | Add keys for hero question, two CTAs, page titles. |
| `static/_headers` and `netlify.toml` | No CSP changes (no new origins). |

## All-five-locale follow-up

Each new content + data file (`why`, `different`, `pricing`, `faq`) requires:
- `content/{english,spanish,japanese,french,german}/<page>.md`
- `data/{en,es,ja,fr,de}/<page>.yml`
- `i18n/{en,es,ja,fr,de}.toml` keys

Owner translations happen in a separate PR per locale. Initial PR ships EN-only with the four other locales matching EN content verbatim (clearly marked TODO) so the build does not break.

## Verification

End-to-end test plan once implementation begins:

1. `hugo --minify --gc --environment production` succeeds, `public/{why,different,pricing,faq}/index.html` all present.
2. `curl -I https://localhost:1313/` returns HTTP 200; hero contains the question + both CTAs.
3. Lighthouse on `/` and `/why`: performance ≥ 95, accessibility ≥ 95, best practices ≥ 95.
4. axe-core run on `/`, `/why`, `/different`, `/pricing`, `/faq`: zero serious violations.
5. CSP devtools console clean on every new page.
6. `prefers-reduced-motion: reduce` confirmed via Chrome DevTools rendering panel — sparkle and pulse animations disabled.
7. `/faq` validates as `FAQPage` via Google Rich Results test.
8. Brief intake submission from `/different` and `/pricing` reaches the Worker (manual smoke).
9. BDD scenarios above pass as Cucumber/Playwright outer-loop scenarios (or equivalent).

## Open questions — all resolved

1. ~~Plan ownership wording~~ → resolved: softened to "actionable audit summary"; methodology not transferred.
2. ~~Locale shipping~~ → resolved: ship EN first, four other locales mirror EN as TODO placeholders. Translate per-locale in follow-up PRs.
3. ~~FAQ JSON-LD location~~ → resolved: move to `/faq` page only. Site-wide block in `head.html` deleted.
4. ~~Revenue-delta stat~~ → resolved: replaced with citation-share stats from BrightLocal LCRS 2026 + AI Overviews citation breakdown. Six cards all sourced.

## Next step after plan approval

Per `superpowers:brainstorming` skill, the next skill is `superpowers:writing-plans` to produce a detailed implementation plan (file-by-file change list with BDD-driven step ordering). Implementation skill `frontend-design` is **not** invoked from brainstorming.

Plan-mode artifact: this plan file at `/Users/wwjd_._/.claude/plans/frontend-design-frontend-design-we-want-sunny-valley.md`.
Spec destination (written after plan-mode exit): `docs/superpowers/specs/2026-05-14-aeo-rebrand-design.md`.
