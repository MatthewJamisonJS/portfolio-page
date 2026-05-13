Feature: AEO citation surface upgrade

  # Spec: docs/superpowers/plans/2026-05-11-aeo-citation-surface-upgrade.md
  # Strategic plan: /Users/wwjd_._/.claude/plans/we-are-on-the-hazy-sparrow.md
  #
  # These scenarios are human-readable acceptance gates. Each one is verified
  # programmatically by a sibling .spec.js or .sh file under tests/<area>/.
  # The mapping is annotated next to each scenario.

  Scenario: Crawler does not encounter dead links in entity graph
    Given an answer-engine crawler fetches the homepage
    When it parses every sameAs URL in the JSON-LD @graph
    Then every URL should return HTTP 200 or be removed from the graph
    # Verified by: tests/schema/10-no-broken-sameas.spec.js (Task 1, audit H10)

  Scenario: Every page emits BreadcrumbList
    Given an answer-engine crawler fetches any rendered URL on the site
    When it parses the JSON-LD @graph
    Then it should find a BreadcrumbList node with at least Home as the first item
    # Verified by: tests/schema/11-breadcrumb-list.spec.js (Task 2, audit H11)

  Scenario: FAQ answers are voice-citable
    Given a voice answer engine fetches the homepage
    When it parses the FAQPage node
    Then it should find a SpeakableSpecification pointing at .faq-answer and .hero-subtitle
    # Verified by: tests/schema/12-speakable-spec.spec.js (Task 3, audit H12)

  Scenario: Method section is structured as HowTo
    Given an answer-engine crawler fetches the homepage
    When it parses the @graph
    Then it should find a HowTo node with 3 HowToStep entries
         matching the Technical / Authority / Content pillars from method.yml
    # Verified by: tests/schema/13-howto.spec.js (Task 4, audit H13)

  Scenario: Local search engines find an explicit LocalBusiness
    Given a local-pack crawler resolves matthewjamison.dev/#localbusiness
    When it inspects the node
    Then it should find PostalAddress (St. Louis, MO, US), paymentAccepted,
         currenciesAccepted "USD", and openingHoursSpecification
    # Verified by: tests/schema/14-localbusiness.spec.js (Task 5, audit H14)

  Scenario: Blog posts emit BlogPosting with author and publisher
    Given an answer-engine crawler fetches /blog/<post-slug>/
    When it parses the @graph
    Then it should find a BlogPosting node with author @id = #person,
         publisher @id = #organization, datePublished, dateModified,
         mainEntityOfPage, and inLanguage
    # Verified by: tests/schema/15-blogposting.spec.js (Task 6, audit H15)

  Scenario: Each route has a tailored OG preview
    Given a social-media crawler fetches a page with front-matter image set
    When it parses og:image and twitter:image
    Then the URL should match the page's .Params.image, not the default
    # Verified by: tests/metadata/06-og-image-per-page.spec.js (Task 7, audit M11)

  Scenario: llms.txt follows v1.7.0 spec
    Given an LLM agent fetches /llms.txt
    When it parses the markdown sections
    Then it should find an "Optional" section after the primary sections
         listing demos and music context as skippable
    # Verified by: tests/content/04-llms-txt-optional.sh (Task 8, audit M12)

  Scenario: Visible breadcrumb appears on inner pages
    Given a reader lands on /about/ or any /blog/<post>/
    When they look near the top of the main content
    Then they should see a breadcrumb trail with Home → Section → Page
         and aria-label="Breadcrumb" on the nav wrapper
         and aria-current="page" on the current-page <li>
    # Verified by: tests/content/07-breadcrumb-ui.sh (Task 10)

  Scenario: Blog section returns 200 and lists posts
    Given a reader navigates to /blog/
    When the page renders
    Then it should show a list of all published posts in date-descending order
         with title, description, date, and a "Read more" link to each
    # Verified by: tests/content/08-blog-templates.sh (Task 11)

  Scenario: Blog single carries BlogPosting microdata and breadcrumb
    Given a reader lands on /blog/<post>/
    When the page renders
    Then it should carry itemtype="https://schema.org/BlogPosting",
         a visible breadcrumb, a byline link to /about/,
         a published date, an optional updated date, and a
         table-of-contents nav when the post has 4+ H2 sections
    # Verified by: tests/content/08-blog-templates.sh (Task 11)
    # Schema gate: tests/schema/15-blogposting.spec.js (Task 6)

  Scenario: Blog routes have hreflang alternates in every locale
    Given a crawler fetches any /blog/ route in any locale
    When it parses the <head> alternates
    Then it should find hreflang links for en, es, ja, fr, de, and x-default
         and a counterpart route file at /<loc>/blog/<path>/index.html
         for every other locale
    # Verified by: tests/i18n/04-blog-hreflang.sh (Task 14)

  Scenario: Pages surface a freshness signal
    Given a reader or crawler lands on /about/ or /blog/<post>/
    When they look near the byline
    Then they should see a <time datetime="YYYY-MM-DD"> element
         carrying the page's published or last-modified date
    # Verified by: tests/metadata/07-lastmod-visible.sh (Task 17, audit L6)

  Scenario: Author bio appears on About + every blog post
    Given a reader lands on /about/ or any /blog/<post>/
    When they scroll to the end of the main content
    Then they should see an author-bio card with the author photo, name,
         one-line bio, day-job evidence, and visible last-updated date
    # Verified by: tests/content/05-author-bio.sh (Task 9, audit L6)

  Scenario: Pillar 1 is independently citable
    Given a user asks an LLM "what is the difference between AEO and SEO"
    When the LLM crawls /blog/aeo-vs-seo-what-changed/
    Then it should find a 40-60 word lead answer in the first paragraph,
         a BlogPosting JSON-LD node with author + publisher @id refs,
         inline-cited primary sources (Gartner, Adobe, Schema.org, vendor docs),
         and a body length between 1200 and 1800 words
    # Verified by: tests/content/09-pillar-1-word-count.sh (Task 12)
    # Schema gate: tests/schema/15-blogposting.spec.js (Task 6)

  Scenario: Pillar 2 functions as self-evidence
    Given a user asks an LLM "what robots.txt directives let ChatGPT crawl my site"
    When the LLM crawls /blog/robots-txt-llms-txt-for-ai-crawlers/
    Then it should find drop-in robots.txt and llms.txt template code blocks
         whose lines are a superset of static/robots.txt and static/llms.txt
         on the same site
    # Verified by: tests/content/10-pillar-2-self-evidence.sh (Task 13)

  Scenario: Hero copy matches operator positioning
    Given a visitor lands on the homepage in any locale
    When they read the hero kicker, title, and subtitle
    Then the positioning should lead with production-Rails-at-scale evidence
         and frame the practice as engineering rigor reaching back to small business
         (not "Watch AI pick the winners on your block")
    # Verified by: tests/content/11-hero-positioning.sh (Task 15, audit M14)
