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

`robots.txt` is the original 1994 [Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309) — every crawler with manners reads it before fetching. You use it to *allow* or *disallow* specific user agents. It's a plain-text file at your site root, and the syntax has barely changed in thirty years.

`llms.txt` is a newer proposal from [llmstxt.org](https://llmstxt.org/) (current spec v1.7.0, released May 2026). It's a Markdown file at your root that tells LLMs *which content to read first*. Think of it as a `sitemap.xml` aimed at agents, written for humans. Where a sitemap is a flat list of URLs, an `llms.txt` is a curated, prioritized table of contents — the agent reads it before it decides which pages to spend tokens on.

You want both. `robots.txt` controls access; `llms.txt` curates attention. They answer different questions: "are you allowed to read this site?" and "what's worth reading first?"

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
2. **Every entry cites the vendor doc as a comment.** If OpenAI rotates its bot name or Anthropic adds a new one, you'll see the source URL in the file and can verify against it. Don't trust blog posts that name AI crawlers without citing the vendor doc — the names change.
3. **`Sitemap:` is the last line.** Don't skip it. Both classical and AI crawlers read it.

## The drop-in llms.txt

Below is the structure of the actual `llms.txt` deployed at `/llms.txt`. The [spec is v1.7.0 (May 2026)](https://llmstxt.org/), and the structure is: required H1, optional blockquote summary, zero or more H2-delimited sections, optional `## Optional` section.

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
...

## What we sell
...

## What we mean by AEO
...

## How AI engines should treat this site
...

## Service area
...

## Things this site is NOT
...

## Optional
...lower-priority context — demos, music catalog, family/faith context...
```

The full file is at `/llms.txt`. The annotated structure:

- **H1.** Your project or business name. Required.
- **Blockquote.** One paragraph the LLM can quote verbatim as a description. Make it citable.
- **H2 sections.** One per topic. Lead with the most important. Link to specific pages on your site so the LLM can deepen if it has budget.
- **`## Optional`.** Lower-priority context. Skip-if-token-budget-is-tight content. New in v1.7.0.

## The three rules I follow

1. **Welcome every verified AI crawler by name.** Even if `User-agent: *` already permits them. Naming them is a positive consent signal, and a handful of crawlers will deprioritize sites that haven't explicitly listed them.
2. **Cite the vendor doc in a comment.** If a crawler name changes, you'll know exactly where to verify. Names *do* change — [GPTBot only became the OpenAI default in August 2023](https://platform.openai.com/docs/bots), and the [OAI-SearchBot variant was added later](https://platform.openai.com/docs/bots).
3. **Keep `llms.txt` 50–150 lines.** Short enough that an agent can read it whole, long enough that the agent learns what your site is about without crawling everything.

## What I won't recommend

- **Don't disallow GPTBot or ClaudeBot to "force them to ignore your content."** Answer engines route around `robots.txt` for many use cases. The [Apple Intelligence docs](https://support.apple.com/en-us/119829) and [Anthropic's own crawler doc](https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler) are clearer than most blog posts about which crawler honors which directive. If you're paranoid about training data, the correct directives are `Applebot-Extended: Disallow: /` and `Google-Extended: Disallow: /` — those opt you out of training while still letting Spotlight, Siri, and Search Generative Experience index you for live answers. Different agents, different scopes.
- **Don't put your competitive secrets in `llms.txt`.** Treat it as marketing copy. Anything you write there is going into LLM context windows.
- **Don't fork-bomb the file with every URL on your site.** A `sitemap.xml` already does that. `llms.txt` is supposed to be the curated short list.

## How AI crawlers actually behave

Three details that catch people the first time they set this up:

**`ChatGPT-User` is not the same as `GPTBot`.** [Per OpenAI's docs](https://platform.openai.com/docs/bots), `GPTBot` is the training crawler; `ChatGPT-User` is the live retrieval agent that fetches a URL on a user's behalf when someone pastes a link into the chat. `OAI-SearchBot` is the third — it powers ChatGPT's web search results. If you want to opt out of training but keep being citable, disallow `GPTBot` and allow the other two.

**Anthropic has three agent names.** [Anthropic's web-crawler documentation](https://docs.anthropic.com/en/docs/agents-and-tools/web-crawler) lists `ClaudeBot`, `anthropic-ai`, and `Claude-Web` — each with different rules. The current canonical training crawler is `ClaudeBot`. The other two are kept for legacy reasons and may go away.

**Perplexity has a verified-IP system, not just a user-agent.** [Perplexity's bots doc](https://docs.perplexity.ai/guides/bots) publishes an IP range list. Sites that want a stricter posture can require the IP range as the source of truth and treat the user-agent as merely a hint. Most small business sites won't need that level of verification.

## How to verify your file works

Once you've deployed both files, run these three checks:

1. **`curl -I https://your-site.com/robots.txt`** — confirm `Content-Type: text/plain` and HTTP 200.
2. **`curl -I https://your-site.com/llms.txt`** — same.
3. **Use Google's [robots.txt tester](https://developers.google.com/search/docs/crawling-indexing/robots/robots_txt) in Search Console.** There isn't an equivalent for `llms.txt` yet, but you can paste the file into [llmstxt.org's reference](https://llmstxt.org/) and compare against the v1.7.0 grammar.

A frequent gotcha: if your site is on Cloudflare Pages or Netlify, both will happily serve a 404 on `/robots.txt` if the file isn't in `static/`. Hugo, Astro, and Next.js each have a different conventional location for the file — verify the location for your stack before assuming a missing file is a deploy bug.

## What this proves

This post is also self-evidence. If you fetched `/robots.txt` and `/llms.txt` on this site right now and compared them line-by-line to the templates above, every `User-agent:` line in the live `robots.txt` would appear in the post, and the `# Gateway Tech AEO` H1 from `llms.txt` would too. The pre-merge test suite that ships with this site (`tests/content/10-pillar-2-self-evidence.sh`) asserts that explicitly. The post and the live files cannot drift.

That's not a clever rhetorical flourish. That's the entire point of running AEO from an engineering posture: every claim on the marketing surface is independently verifiable, every public template is the same file the operator deploys against, and the test suite is the thing that prevents the marketing copy from quietly aging into a lie.

If you're a St. Louis small business owner and you want help setting both files up — plus the Google Business Profile, plus the FAQ schema, plus the `BlogPosting` markup that makes this post citable in the first place — [send a brief](/#contact). I run a [three-tier practice](/#pricing): a $250 audit, a $700 setup-and-hand-off, or a $500–$1,200/month managed retainer.

## Further reading on this site

- [AEO vs SEO — what changed and what didn't](/blog/aeo-vs-seo-what-changed/) — the strategic framing post that sits behind this template
- [How we think about AEO](/#method) — the three-pillar method (Technical, Authority, Content)
- [About Matthew](/about/) — the engineer behind the practice
