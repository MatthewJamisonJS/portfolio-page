# AEO citation-surface verification

**Generated:** 2026-05-12
**Branch:** `feat/aeo-citation-surface-2`
**Closes audit:** L7 (post-rebrand verification evidence committed)
**Plan:** [`docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md`](../../docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md)

This file is the deploy-independent verification artifact for Task 18. Evidence that requires the deployed Cloudflare Pages preview URL (Lighthouse JSON × 8, Rich Results screenshots, validator.schema.org shots, AI-engine dogfood captures, live CSP curl) is captured in a follow-up commit run against the merged deploy. The rule of thumb: this file proves the *source* is correct; the follow-up file proves the *delivery* matches it.

---

## 1. Pre-merge test suite

```
$ bash tests/run-all.sh
==> ALL ENABLED TESTS PASSED
```

**25 named test gates pass.** Suites:

| Suite | Status | Notes |
|---|---|---|
| `tests/schema/` | OK | 10 specs covering Person, Organization, ProfessionalService, AboutPage, BreadcrumbList, SpeakableSpecification, HowTo, LocalBusiness, BlogPosting (2 posts), no-broken-sameAs. |
| `tests/metadata/` | OK | OG title from banner.yml, hreflang block, Twitter handle, lastmod visible, OG image per page (4 samples), preload references real. |
| `tests/content/` | OK | No Pokemon refs, year=2026, FAQ citations × 5 locales, llms.txt Optional section, author-bio mounted, no theme-name meta, breadcrumb UI, blog templates, pillar 1 word count (1249 / lead 56), pillar 2 self-evidence (1515 / robots+llms templates match live files), hero positioning markers present, FAQ 40-60 word window × 5 locales. |
| `tests/headers/` | OK | robots-ai-bots (12 AI bot directives + sitemap), llms-txt shape, no-cdnjs, X-Frame SAMEORIGIN, security.txt RFC 9116. |
| `tests/i18n/` | OK | brand.yml email parity, 3 EN blog routes × 5 locales hreflang alternates. |
| `tests/booking/` | (empty) | Populated when Phase 2 booking flow ships. |
| Lighthouse CI | (gated) | Skipped unless `LHCI=1`. Run against deployed preview; see §5. |
| Pa11y / WCAG | (gated) | Skipped unless `PA11Y=1`. Run against deployed preview; see §5. |

---

## 2. Schema @graph inventory

See [`schema-inventory.json`](./schema-inventory.json) for the machine-readable artifact. Highlights:

| Page | Entity types in `@graph` |
|---|---|
| `/` | Person, Organization, ProfessionalService, WebSite, WebPage, LocalBusiness, BreadcrumbList, FAQPage, HowTo, SpeakableSpecification, ImageObject, Offer × 4, PriceSpecification × 4, PostalAddress, GeoCoordinates, OpeningHoursSpecification, Occupation, City |
| `/about/` | + AboutPage, Article |
| `/blog/aeo-vs-seo-what-changed/` | + BlogPosting |
| `/blog/robots-txt-llms-txt-for-ai-crawlers/` | + BlogPosting |

Every page anchors via `Organization.@id = https://matthewjamison.dev/#organization` and `Person.@id = https://matthewjamison.dev/#person` (audit H10 + H14).

---

## 3. Per-locale content parity

See [`content-parity.json`](./content-parity.json). 5 page types × 5 locales = 25 routes; all 25 build cleanly.

| Locale | Home | About | Blog list | Pillar 1 | Pillar 2 |
|---|---|---|---|---|---|
| en | OK | OK | OK | OK | OK |
| es | OK | OK | OK | OK (stub) | OK (stub) |
| ja | OK | OK | OK | OK (stub) | OK (stub) |
| fr | OK | OK | OK | OK (stub) | OK (stub) |
| de | OK | OK | OK | OK (stub) | OK (stub) |

**Stub posture:** non-EN blog posts carry `inLanguage: en` + a visible translator's note + a link back to the EN canonical. The hreflang alternates resolve symmetrically across 6 keys (en, es, ja, fr, de, x-default). Full translations are deferred to a follow-up commit (plan Task 14 content half).

**FAQ:** 12 items in every locale, every answer in the 40-60 word AI-citation window (Japanese uses 40-200 character CJK band). Gated by `tests/content/12-faq-word-count.sh`.

---

## 4. Security header audit

See [`csp-audit.json`](./csp-audit.json). All six required headers present in `static/_headers`:

- Content-Security-Policy (allows: formspree.io, bandcamp.com, cloudflareinsights)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: geolocation=(), microphone=(), camera=()
- Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

Deploy-time verification (live CDN behavior) is captured by `curl -I` against the deployed URL — see §5.

---

## 5. Post-deploy follow-up checklist (deferred)

These steps require the deployed Cloudflare Pages preview URL (not 127.0.0.1, because Google Rich Results Test, validator.schema.org, and the AI engines can't reach localhost). They live in a follow-up commit after merge to main:

- [ ] **Lighthouse × 4 URLs × mobile+desktop = 8 JSON reports.** Threshold: perf ≥ 0.95, a11y ≥ 0.95, best-practices ≥ 0.95, seo == 1.0. Commit JSON files under `lighthouse-results/post-aeo-cluster/lighthouse/`.
- [ ] **Pa11y JSON × 4 URLs.** Standard: WCAG2AA. Expect zero violations.
- [ ] **Axe-core JSON × 4 URLs.** Tags: wcag21aa. Expect zero violations.
- [ ] **Google Rich Results Test screenshots × 4 URLs.** Expect detection of: Person, Organization, ProfessionalService, LocalBusiness, FAQPage, HowTo, BreadcrumbList, BlogPosting. Zero errors.
- [ ] **validator.schema.org screenshots × 4 URLs.** Expect zero errors, zero warnings.
- [ ] **CSP regression `curl -I https://matthewjamison.dev`.** All 6 headers present in live response.
- [ ] **AI-engine dogfood captures.** Query each of Perplexity, ChatGPT, Claude, Google AI Overview with at least one of these prompts and capture screenshots showing this site cited:
  - "St. Louis AEO consultant"
  - "what is the difference between AEO and SEO"
  - "how do I let GPTBot crawl my site"

The site's claim is that AI engines cite it for AEO-related questions. The dogfood captures are the evidence behind that claim. They go into `lighthouse-results/post-aeo-cluster/dogfood/`.

---

## 6. Findings closed by this branch

| ID | Finding | Closing commit |
|---|---|---|
| H4 / H6 | Schema + static-file half of citation surface | 0e2790a (PR #39) |
| H10 | Broken sameAs → gatewaytechaeo.com | 0e2790a |
| H11 | Missing BreadcrumbList | 0e2790a |
| H12 | Missing SpeakableSpecification | 0e2790a |
| H13 | Missing HowTo for method section | 0e2790a |
| H14 | Missing explicit LocalBusiness block | 0e2790a |
| H15 | Missing BlogPosting + pillar content | 0e2790a + a10509c + b8482ff |
| M11 | Per-page OG image static across routes | 0e2790a |
| M12 | llms.txt missing v1.7.0 Optional section | 0e2790a |
| M13 | FAQ answers exceed 40-60 word window | 6328435 |
| M14 | Hero copy not aligned with operator positioning | 9dc496e (supersedes 71fea2a) |
| L6 | No visible lastmod on About / new posts | 9d13b29 + eb82014 |
| L7 | No post-rebrand verification evidence committed | this commit |

---

## 7. Plan tasks status

| Task | Description | Status |
|---|---|---|
| 1–8 | Schema nodes + llms.txt Optional + per-page OG | DONE (PR #39, merged) |
| 9 | Author-bio partial + visible lastmod | DONE (9d13b29) |
| 10 | Breadcrumb UI partial | DONE (c1852ee) |
| 11 | Blog list + single templates | DONE (efcd3d4) |
| 12 | Pillar Post 1: AEO vs SEO | DONE (a10509c) |
| 13 | Pillar Post 2: Robots+llms.txt | DONE (b8482ff) |
| 14 | Locale stubs for /blog/ | DONE structural half (d7effcf); CONTENT half deferred (full translations) |
| 15 | Hero copy reframe × 5 locales | DONE (9dc496e supersedes 71fea2a) |
| 16 | FAQ tightening 40-60 words | DONE (6328435) |
| 17 | Visible lastmod on About | DONE (eb82014) |
| 18 | Verification + evidence | THIS COMMIT (deploy-dependent half deferred to post-merge) |

---

*Operator notes:* `npm`/`npx` Lighthouse runs deferred because no Chrome / Chromium installed on this machine in this session, and the meaningful Lighthouse run is against the deployed CDN behavior anyway (compression, cache headers, real network). The deploy-dependent follow-up is intentionally scoped narrow so the merge-blocking work fits in one focused session after Cloudflare Pages publishes the preview.
