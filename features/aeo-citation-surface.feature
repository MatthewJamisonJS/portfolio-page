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
