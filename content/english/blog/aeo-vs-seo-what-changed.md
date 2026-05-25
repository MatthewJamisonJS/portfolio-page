---
title: "AEO vs SEO: what changed and what didn't"
description: "Answer Engine Optimization is structuring a site so generative AI tools cite it as a source. SEO targets the ten blue links; AEO targets being the quoted answer. Tactics overlap; goals differ. A working playbook from a St. Louis Rails developer running AEO for local business."
date: 2026-05-12
lastmod: 2026-05-12
draft: false
type: "blog"
url: "/blog/aeo-vs-seo-what-changed/"
schema_type: "BlogPosting"
articleSection: "AEO Fundamentals"
keywords: ["AEO", "Answer Engine Optimization", "SEO", "Generative Engine Optimization", "GEO", "schema markup", "ChatGPT citations", "Perplexity citations", "Google AI Overview", "St. Louis SEO"]
image: "/images/og/og-aeo-vs-seo.webp"
image_alt: "AEO vs SEO: what changed and what didn't. Gateway Tech AEO."
---

Answer Engine Optimization (AEO) is the practice of structuring a site so generative AI engines (ChatGPT, Perplexity, Claude, Google's AI Overview) cite it when someone asks a question. Classical SEO targets the ten blue links. AEO targets being the quoted answer. The work overlaps, but the goal is different, and several priorities have inverted.

## What hasn't changed

The technical foundations of search haven't moved. Crawlability, mobile speed, accessibility, valid HTML, canonical tags, internal linking, and a real `sitemap.xml` are all still load-bearing. If Google can't render your page, neither can [GPTBot](https://platform.openai.com/docs/bots), [ClaudeBot](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler), or [PerplexityBot](https://docs.perplexity.ai/guides/bots). Site speed is now arguably *more* important than it was in classical SEO: answer engines time out aggressively when they assemble their context windows. Lighthouse 95+ on mobile is the floor, not the goal.

## What changed: the unit of citation

The smallest unit a search engine cared about was a page. The smallest unit an answer engine cares about is a *passage*. Specifically, a 40–60 word block that directly answers a specific question. [Stackmatix's 2026 structured-data study](https://www.stackmatix.com/blog/structured-data-ai-search) reports content with proper schema markup has a 2.5× higher chance of appearing in AI-generated answers, that `FAQPage` schema improves AI citation rates by roughly 30% on average, and that sites with complete "Tier 1" schema see up to 40% more AI Overview appearances. The named, structured passage is the unit that gets quoted.

Practical change: when you write a section, lead with the direct answer. Save the nuance for the second paragraph. This is the inverted pyramid that newspaper reporters have used for a hundred years. It is also exactly how a transformer reads context: the first sentence of a passage carries disproportionate weight when the model decides whether the chunk is worth citing.

## What changed: structured data is no longer optional

In classical SEO, schema markup was a "nice to have" that bought you a rich snippet. In AEO, it's the primary way the engine knows what your page is *about*. Every credible AEO source as of May 2026 converges on the same minimum viable schema stack ([Google Search Central's structured data guidance](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data), [Schema.org's canonical types](https://schema.org/), and the [Stackmatix AI-search schema guide](https://www.stackmatix.com/blog/structured-data-ai-search)):

- `Organization` (or `LocalBusiness` for local businesses)
- `Person` for author E-E-A-T
- `WebSite` and `WebPage`
- `FAQPage` for question-shaped content
- `HowTo` for procedural content
- `BlogPosting` or `Article` for long-form content
- `BreadcrumbList` for topical context
- `SpeakableSpecification` for voice surfaces

That's not a tier-1 vs tier-2 question. That's the *floor*. A site missing three of those nodes is effectively invisible to the engine asking "is this page about what the user wants?"

## What changed: AI traffic is no longer hypothetical

[Gartner forecasts a 25% drop in traditional search engine volume by 2026](https://www.gartner.com/en/newsroom/press-releases/2024-02-19-gartner-predicts-search-engine-volume-will-drop-25-percent-by-2026-due-to-ai-chatbots-and-other-virtual-agents) as conversational interfaces absorb informational queries. [Adobe Digital Insights reported AI-driven traffic to U.S. retail sites grew 393% year-over-year between January and March 2026](https://business.adobe.com/blog/ai-traffic-surge-retail-sites-not-machine-readable), and the share has kept climbing through Q2. Those are not "interesting future trends." Those are revenue events that have already moved.

The shift is more pronounced in informational queries ("how do I", "what is", "best X for Y") where the answer engine can compose a confident response without sending traffic anywhere. Transactional queries ("buy", "near me", "open now") still flow heavily through classical search, which is why a local business that depends on local intent should not abandon Google Business Profile or paid search while it builds an AEO posture. The two channels are complementary, not substitutes, and at least through the next twelve months the budget split should reflect that.

## What changed: the relationship with the publisher

Classical SEO assumed the publisher (Google) wanted ten options on a page so the user could pick. Answer engines assume the user wants *one* answer. That changes the incentive: AEO is a winner-takes-most game per query. The site that gets cited in the answer collects the trust, the brand mention, and (sometimes) the link. The five sites that didn't get cited get nothing — not a #6 spot, not a partial mention. Nothing.

The implication for local businesses is that consistency of identity matters more than ever. The `Organization.@id` graph on this site anchors every page back to a single entity at `https://gatewaytechaeo.com/#organization`. Every `BlogPosting` references the same `author` via `@id`. When an answer engine encounters the brand across thirty different pages, it resolves to one entity, not thirty. That's how an answer engine builds enough confidence to cite you by name instead of paraphrasing your content anonymously.

## What didn't change: E-E-A-T is still the moat

Google's [E-E-A-T framework](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) (Experience, Expertise, Authoritativeness, Trustworthiness) was already the criterion for ranking. It's now the criterion for *citation*. Answer engines are heavily biased toward citing sources where:

- The author is identifiable and has visible credentials
- The publisher is a named entity (not "Site X" or "Blog Y")
- Claims are sourced to primary documents (not other blog posts)
- The site has a non-trivial history (consistent author across multiple pieces)
- The technical implementation is competent (clean schema, fast pages, no broken links)

The author-bio card at the bottom of every post on this site exists for the human reader, but it's also there for the answer engine to confirm "this person actually exists, has a verifiable GitHub, has a verifiable LinkedIn, has a verifiable employer."

## What didn't change: the local pack

For a St. Louis local business, [Google Business Profile (GBP)](https://www.google.com/business/) is still the highest-ROI lever. [Whitespark's 2026 Local Search Ranking Factors Report](https://whitespark.ca/local-search-ranking-factors/) puts Primary GBP Category at #1 for local pack appearance. Answer engines pull from GBP heavily; Perplexity and ChatGPT both cite Google's local data when answering "best X in St. Louis" prompts. If you have to pick one thing to fix first, it's GBP, not your website.

## What changed: review surfaces compound faster

Reviews used to influence ranking. Now they influence *citation* in a measurable way. When an answer engine writes "the best-reviewed plumber in St. Louis is X," the underlying decision is built from a small bundle of corroborating signals: GBP review count, review recency, sentiment, and whether the same business name appears in third-party directory data. Inconsistent NAP (Name, Address, Phone) data across directories is what stops a local business from being named by an answer engine even when its reviews are excellent. Fix NAP first, then push for reviews; doing it in the other order wastes the cheap win.

## What this practice does

I run [Gateway Tech AEO](/) as the side practice for what I do during the day on a production Rails 8 codebase. The same engineering rigor that keeps that codebase from breaking is what gets applied to a Mexican restaurant's GBP and schema markup. [Three tiers, prices public](/#pricing): an audit at $250, a setup-and-hand-off at $700, a managed retainer between $500 and $1,200 a month. I cap year one at five St. Louis clients. The cap is what lets me actually do the work myself instead of selling a slide deck.

If you're a St. Louis local business owner wondering whether AI answer engines are sending you traffic, [send a brief](/#contact). I'll reply in 48–96 hours with something specific to your business, not a generic pitch.

## Further reading on this site

- [How we think about AEO](/#method): the three-pillar method (Technical, Authority, Content)
- [Common questions](/#faq): FAQ with primary-source citations on every numeric claim
- [About Matthew](/about/): full author bio and day-job evidence
