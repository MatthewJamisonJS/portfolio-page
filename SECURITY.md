# Security Policy

This site is the public-facing presence of **Gateway Tech AEO** (St. Louis, MO), operated by Matthew Jamison. The codebase is open source under the MIT License at [github.com/MatthewJamisonJS/portfolio-page](https://github.com/MatthewJamisonJS/portfolio-page).

This document supplements the machine-readable `/.well-known/security.txt` per [RFC 9116](https://www.rfc-editor.org/rfc/rfc9116).

## Scope

**In scope:**
- Production site at `https://www.gatewaytechaeo.com` and its subpaths
- Production assets served from the same origin
- The Cloudflare Pages deployment of this site
- The source code in this repository

**Out of scope:**
- Third-party services this site depends on (Cloudflare Pages, Formspree, Bandcamp embeds, Cloudflare Web Analytics) — please report those directly to the vendor
- Demo subdomains (`demo-*.pages.dev`) — these are illustrative templates, not production systems
- Domains owned by the operator but not deployed from this repository (e.g. `matthewjamison.dev`)
- Vulnerabilities in third-party AI crawlers themselves

## How to report

Preferred: email **security@gatewaytechaeo.com** with the prefix `[security]` in the subject line.

Alternative: file a private security advisory at [github.com/MatthewJamisonJS/portfolio-page/security/advisories/new](https://github.com/MatthewJamisonJS/portfolio-page/security/advisories/new). GitHub handles the routing without making the report public.

Please include:

- A clear description of the vulnerability and its category (XSS, CSRF, SSRF, IDOR, etc.)
- Steps to reproduce, or a proof-of-concept
- Affected URLs and any user-agent or environment specifics
- Your assessment of impact and severity
- Suggested remediation if you have one

If the report contains sensitive data (PII, credentials, exploit payloads), please use the email channel — the GitHub form is private but stored on a third-party server.

## Response timeline

- **Within 48 hours** — acknowledgment of receipt.
- **Within 7 days** — initial assessment and severity classification.
- **Within 90 days** — coordinated public disclosure if a fix is shipped, or a documented timeline if not. Reporters are credited (with consent) in the [acknowledgments list](https://www.gatewaytechaeo.com/security/acknowledgments/).

## Safe harbor

We support good-faith security research. If you make a reasonable effort to follow this policy, **we will not pursue or support legal action against you**.

"Good faith" specifically means:

- You only test against the in-scope surface listed above
- You stop, document, and report as soon as you confirm a vulnerability — you do not exfiltrate data beyond what is necessary to prove the finding
- You do not degrade service availability (no denial-of-service testing, no brute force, no automated scanning that exceeds normal browsing rates)
- You do not access, modify, or destroy data belonging to other users
- You give us reasonable time to respond before public disclosure

If your research crosses these lines, the safe-harbor commitment does not apply.

## Security posture

This site implements:

- **Content Security Policy** (strict CSP, `default-src 'self'` with narrowly-scoped allowances for Formspree, Cloudflare Insights, and Bandcamp embeds — see `static/_headers`)
- **HTTP Strict Transport Security** (`max-age=31536000; includeSubDomains; preload`)
- **`X-Frame-Options: SAMEORIGIN`** to prevent clickjacking
- **`X-Content-Type-Options: nosniff`** to block MIME-type confusion
- **`Referrer-Policy: strict-origin-when-cross-origin`**
- **`Permissions-Policy: geolocation=(), microphone=(), camera=()`**

The full header configuration lives in `static/_headers` and the production CSP allowlist is documented in `.claude/rules/references/security-headers.md`.

## Supported versions

This is a continuously deployed static site — there are no released "versions". The current production build is the only supported state. Reports against historical commits or non-production branches will be redirected to the current main.

## Bug bounty

This is a small business, not an enterprise — there is no monetary bounty program at this time. Reporters acting in good faith are credited in the acknowledgments page with their consent, and we will write a recommendation or referral for security professionals whose work materially improves the site.

## Disclosure

This policy is itself versioned. Material changes (scope changes, timeline changes, removal of safe-harbor language) are announced in the [CHANGELOG](./CHANGELOG.md) with at least 14 days' notice when feasible. The `Expires:` field in `/.well-known/security.txt` is refreshed at least annually.