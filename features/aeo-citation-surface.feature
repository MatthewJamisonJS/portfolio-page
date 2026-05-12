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
