# Cloudflare Optimization — gatewaytechaeo.com

**Date:** 2026-05-14
**Status:** Approved

## Context

The site (gatewaytechaeo.com) is deployed on Cloudflare Pages with two sibling Workers (brief-intake-collector at intake.gatewaytechaeo.com, csp-report-collector at csp-report.gatewaytechaeo.com). Nameservers are on Cloudflare. Zone settings are mostly active but several issues exist:

1. **Cloudflare AI Audit is overriding robots.txt** — prepending `Disallow: /` for GPTBot, ClaudeBot, Google-Extended, Applebot-Extended, and others. This directly undermines the AEO strategy where all AI crawlers should be explicitly allowed.
2. **Production CSP headers are stale** — still reference `formspree.io` (removed in PR #55), missing `intake.gatewaytechaeo.com` form-action and CSP report directives. Local `static/_headers` has the fix but hasn't been deployed.
3. **Static assets use 4-hour cache TTL** — Hugo fingerprints CSS/JS with content hashes, making them immutable. These should cache for 1 year.
4. **Worker subdomains lack X-Robots-Tag** — API endpoints could be indexed by crawlers.

## Work Items

### 1. Disable CF AI Audit (robots.txt fix)

**Problem:** Cloudflare's "AI Audit" / managed content feature prepends blocking rules to robots.txt:

```
# BEGIN Cloudflare Managed content
User-agent: ClaudeBot
Disallow: /
User-agent: GPTBot
Disallow: /
User-agent: Google-Extended
Disallow: /
User-agent: Applebot-Extended
Disallow: /
# END Cloudflare Managed Content
```

These come BEFORE the site's custom `Allow: /` rules, causing some crawlers to honor the first `Disallow` they encounter.

**Fix:** CF Dashboard > Security > Bots > AI Audit — disable managed robots.txt injection. Alternatively use CF API to set `ai_bots.block = false`.

**Verification:**
```bash
curl -s https://gatewaytechaeo.com/robots.txt | grep -c "Cloudflare Managed"
# Expected: 0
```

### 2. Deploy Updated CSP + Security Headers

**Problem:** Production CSP (from last deploy) still references formspree.io. Local `static/_headers` has the correct values but hasn't been deployed.

**Production (stale):**
```
script-src 'self' 'unsafe-inline' https://formspree.io https://static.cloudflareinsights.com
connect-src 'self' https://formspree.io https://cloudflareinsights.com
frame-src 'self'
```

**Local (correct):**
```
script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com
connect-src 'self' https://cloudflareinsights.com https://csp-report.gatewaytechaeo.com
form-action 'self' https://intake.gatewaytechaeo.com
frame-src 'self'
report-to csp
report-uri https://csp-report.gatewaytechaeo.com/
```

**Fix:** Deploy the site (push to main or trigger CF Pages build). Also sync `netlify.toml` with the same CSP values.

**Verification:**
```bash
curl -sI https://gatewaytechaeo.com/ | grep -i content-security-policy
# Should NOT contain formspree.io
# Should contain intake.gatewaytechaeo.com and csp-report.gatewaytechaeo.com
```

### 3. Verify Zone Performance Settings

Most settings confirmed active via curl. Two need dashboard verification:

| Setting | Status | How verified |
|---|---|---|
| Rocket Loader | OFF | `curl` — no rocket-loader script injected |
| Bot Fight Mode | OFF | `curl` — no challenge-platform script |
| Brotli | ON | `content-encoding: br` confirmed |
| HTTP/3 | ON | `alt-svc: h3=":443"` confirmed |
| HTTPS redirect | ON | `301 → https` confirmed |
| Web Analytics | ON | cloudflareinsights beacon present |
| Early Hints | **Verify in dashboard** | Cannot confirm via curl (103 is transparent) |
| 0-RTT | **Verify in dashboard** | Cannot confirm via curl |

**Dashboard paths:**
- Early Hints: Speed > Optimization > Content Optimization > "Early Hints"
- 0-RTT: Network > "0-RTT Connection Resumption"

### 4. Cache Rules for Static Assets

Create CF Cache Rules (Dashboard > Caching > Cache Rules):

| Rule name | Match expression | Edge TTL | Browser TTL | Rationale |
|---|---|---|---|---|
| Fingerprinted assets | `http.request.uri.path matches ".*\\.min\\.[a-f0-9]+\\.(css\|js)$"` | 1 year | 1 year | Content hash in filename = immutable (Hugo pattern: `name.min.{sha256}.ext`) |
| Fonts | `starts_with(http.request.uri.path, "/fonts/")` | 1 year | 1 year | Fonts never change |
| Static images | `starts_with(http.request.uri.path, "/images/")` | 30 days | 7 days | Images rarely change; shorter browser TTL for updates |
| HTML (default) | No rule needed | CF Pages default (4h) | CF Pages default | Content changes on deploy; CF auto-purges |

Also verify Smart Tiered Caching is enabled (Caching > Tiered Cache > Smart Tiered Caching). Free tier includes this.

### 5. Worker Subdomains — X-Robots-Tag

**Files to modify:**
- `brief-intake-collector/src/index.ts` — add `X-Robots-Tag: noindex` to all responses
- `csp-report-collector/src/index.ts` — add `X-Robots-Tag: noindex` to all responses

The `/thanks` endpoint already sets this header. Extend to all other response paths (GET `/`, POST responses, error responses).

**Approach:** Add a helper that wraps responses with the header, or add it to each Response constructor. Keep it simple — no middleware abstraction needed for 2-3 response sites.

### 6. Sync netlify.toml CSP

Update `netlify.toml` `[[headers]]` blocks to match `static/_headers`. These are the backup deploy target and should stay in sync.

**File:** `netlify.toml`

## BDD Scenarios

### AI Crawler Access

```gherkin
Story: AEO-friendly crawler access
  In order to be cited by answer engines,
  a site operator wants all verified AI crawlers to be allowed.

Scenario: AI crawlers see Allow directives
  Given CF AI Audit is disabled on gatewaytechaeo.com zone
  When GPTBot fetches /robots.txt
  Then the response should contain "Allow: /" for User-agent GPTBot
  And the response should NOT contain "Disallow: /" for User-agent GPTBot

Scenario: Worker subdomains signal noindex
  Given the brief-intake Worker is deployed with X-Robots-Tag
  When any crawler sends GET to intake.gatewaytechaeo.com/
  Then the response should include X-Robots-Tag: noindex
```

### Security Headers

```gherkin
Story: Production security headers match source of truth
  In order to prevent XSS and enforce form submission boundaries,
  the deployed site must serve the CSP from static/_headers.

Scenario: CSP allows intake Worker for form submissions
  Given the site is deployed with updated _headers
  When a browser submits the brief-intake form
  Then the form POST to intake.gatewaytechaeo.com should not be blocked by CSP

Scenario: CSP blocks removed third parties
  Given the site is deployed with updated _headers
  When curl -sI gatewaytechaeo.com is run
  Then the CSP header should NOT contain formspree.io

Scenario: CSP violations are reported
  Given the site is deployed with updated _headers
  When a CSP violation occurs in a visitor's browser
  Then the browser should POST the report to csp-report.gatewaytechaeo.com
```

### Zone Performance

```gherkin
Story: Zone performance settings are active
  In order to serve pages with minimal latency,
  the site operator wants all zone optimizations enabled.

Scenario: Brotli compression serves smaller responses
  Given Brotli is enabled on the zone
  When a browser requests the homepage with Accept-Encoding: br
  Then the response content-encoding should be br

Scenario: HTTP redirects to HTTPS
  Given Always Use HTTPS is enabled
  When a browser requests http://gatewaytechaeo.com
  Then it should receive a 301 redirect to https://gatewaytechaeo.com
```

### Cache Efficiency

```gherkin
Story: Static assets cache efficiently at the edge
  In order to reduce load times for repeat visitors,
  fingerprinted assets should cache for maximum duration.

Scenario: Fingerprinted CSS caches for one year
  Given a CF Cache Rule targets fingerprinted CSS files
  When a browser requests /css/custom.min.dfd9f2c3.css
  Then the cache-control header should include max-age=31536000

Scenario: HTML pages allow fast content updates
  Given CF Pages auto-purges on deploy
  When a browser requests the homepage
  Then the cache-control should not set a long max-age
```

## Verification Plan

After all changes are applied:

1. **robots.txt clean:** `curl -s https://gatewaytechaeo.com/robots.txt | grep "Cloudflare Managed"` returns nothing
2. **CSP updated:** `curl -sI https://gatewaytechaeo.com/ | grep content-security-policy` shows intake + csp-report, no formspree
3. **Workers noindex:** `curl -sI https://intake.gatewaytechaeo.com/ | grep x-robots-tag` returns `noindex`
4. **Cache headers:** `curl -sI https://gatewaytechaeo.com/fonts/anaheim.woff2 | grep cache-control` shows long TTL
5. **Lighthouse regression check:** Score stays 95+
6. **Brotli:** `curl -sI https://gatewaytechaeo.com/ -H 'Accept-Encoding: br' | grep content-encoding` returns `br`

## Out of Scope

- Turnstile (no spam problem yet — defer until evidence of need)
- Cache Reserve ($5/mo — not justified at current traffic)
- WAF custom rules (Bot Fight Mode OFF is sufficient)
- Terraform / infrastructure-as-code for zone config (single-operator, overkill)
- New third-party integrations (would require CSP changes)
