# Changelog

All notable changes to the portfolio-page project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- New brief-intake Worker at `https://intake.gatewaytechaeo.com/brief`
  (`brief-intake-collector/`). Receives the contact form's POST, validates
  fields, builds a markdown summary, and emails it to
  `jamison.matthew@icloud.com` via the CF Email Routing `send_email` binding.
  GET returns a stub; POST without required fields returns 400 JSON;
  unsupported content-types return 415. Replaces Formspree.
- New `/thanks/` page (EN, `noindex`) where the Worker redirects HTML form
  submissions after success.

### Changed
- `data/{en,es,ja,fr,de}/contact.yml` `form_action` swapped from
  `https://formspree.io/f/xjkpovyv` to `https://intake.gatewaytechaeo.com/brief`.
- `static/_headers` CSP drops `https://formspree.io` from `script-src` and
  `connect-src`. Adds `form-action 'self' https://intake.gatewaytechaeo.com`
  so the form's cross-subdomain POST passes CSP. No other allowlist changes.

### Removed
- Third-party Formspree dependency. CSP allowlist no longer mentions
  `formspree.io`. Contact-form path now lives entirely on Cloudflare
  primitives (Worker → Email Routing → iCloud).

### Security
  via a Cloudflare Worker (`csp-report-collector/`). Worker validates
  Content-Type, logs each report via `console.log` (queryable via the
  `cf-observability` MCP), returns 204; rejects other content-types with
  415. `static/_headers` gains the `csp-report-uri`/`report-to` CSP
  directives, plus a modern `Reporting-Endpoints` header (Chrome/Edge ≥96)
  and a legacy `Report-To` header for older Chrome. Safari + Firefox
  only honor `report-uri`, so both delivery paths ship for full coverage.
- Add CodeQL static analysis workflow (`.github/workflows/codeql.yml`)
  scanning `javascript-typescript` (covers `assets/js/script.js` + inline
  `<script>` blocks in layouts) and `actions` (workflow YAML tag-pinning
  + permissions). Runs on push, pull_request, and weekly cron Monday
  07:23 UTC. Results land in GitHub Security → Code scanning.
- Extend `.github/dependabot.yml` with `gitsubmodule` ecosystem so
  upstream Meghna theme commits surface as PRs. Both ecosystems batch
  minor/patch updates and target Monday 08:00 America/Chicago.

### Changed
- Revert canonical URL back to apex now that `gatewaytechaeo.com`
  nameservers are on Cloudflare and CF native CNAME-flattening at apex
  handles the Pages DCV that ALIAS-flattening at Namecheap could not.
  Reverts the temporary www-only swap from the previous commit cycle.
  baseURL: `https://www.gatewaytechaeo.com/` → `https://gatewaytechaeo.com/`.
  Mirrors the same file surface (config, brand.yml ×5, static/*, blog
  posts, about pages). Both apex and www serve the site; canonical now
  points at apex, www acts as the alternate.

### Security
- Harden `/.well-known/security.txt` per RFC 9116: bump `Expires` to
  2027-05-13 (12-month refresh), add `Acknowledgments` field pointing
  at a new `/security/acknowledgments/` page, and document a GitHub
  private security advisory channel as an alternative reporting path.
- Rewrite `SECURITY.md` with explicit scope (in/out), safe-harbor
  clause for good-faith research, coordinated-disclosure timeline
  (48h ack / 7d assess / 90d disclose), supported-versions statement,
  and a no-monetary-bounty acknowledgment with credit-only recognition.
- Add `noindex` Hugo page at `/security/acknowledgments/` so the
  RFC 9116 `Acknowledgments:` URL resolves to a real document.

### Changed
- Primary domain cutover: matthewjamison.dev → gatewaytechaeo.com.
  Updated `config/production/hugo.toml` `baseURL`, `data/{en,es,ja,fr,de}/brand.yml`
  `website`, `static/robots.txt`, `static/llms.txt`, `static/.well-known/security.txt`,
  blog post self-references, i18n caption copy (single-domain rewrite, all five
  locales), and deployment docs (`DEPLOYMENT.md`, `.cloudflare/CHECKLIST.md`,
  `.cloudflare/zone-config.md`, `.cloudflare/deploy.sh`). `matthewjamison.dev`
  is being detached from this Cloudflare Pages project and reserved for a
  future blank-slate project.
- Twitter handle rebrand: `@matthewjamison` → `@M_J_Jamison` in
  `layouts/partials/head.html` (twitter:site, twitter:creator, Person `sameAs`).
- Site lives at `https://www.gatewaytechaeo.com` (www subdomain) during NS
  migration window. Cloudflare Pages requires a CNAME at apex; Namecheap
  publishes apex as ALIAS-flattened A records which CF DCV cannot verify.
  Workaround: serve at www until `gatewaytechaeo.com` nameservers are
  migrated to Cloudflare (24–48h). Once NS migration completes and CF's
  native apex CNAME-flattening is available, baseURL will revert to the
  apex `https://gatewaytechaeo.com/` in a follow-up PR. URL refs updated:
  `baseURL`, brand.yml ×5, robots.txt sitemap line, llms.txt links,
  security.txt Canonical, About pages markdown links, blog post @id
  references. Deployment docs (`DEPLOYMENT.md`, `.cloudflare/*`) and
  i18n caption copy intentionally retain the apex form because they
  document the long-term target state.

## [1.0.0] - 2025-10-30

### Wave 3: GitHub Standardization & WCAG 3.0 Accessibility

#### Added
- LICENSE file (MIT License, 2025)
- SECURITY.md with vulnerability reporting process and security features documentation
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- CHANGELOG.md for version tracking and release notes
- .github/CODEOWNERS for code ownership and review assignment
- WCAG 3.0 accessibility compliance improvements
- Accessibility audit and remediation across all demo sites
- Improved semantic HTML structure
- Enhanced color contrast ratios throughout the site
- ARIA labels and descriptions for interactive elements
- Keyboard navigation enhancements
- Screen reader optimization

#### Changed
- Updated project documentation standards to follow GitHub best practices
- Refined color palette for improved accessibility compliance
- Enhanced form inputs with better accessibility features

#### Fixed
- Accessibility issues with interactive components
- Focus management in navigation menus
- Color contrast issues in footer elements

### Wave 2: Performance Optimization & SEO

#### Added
- WebP image format support with fallbacks
- Lazy loading for images across all demo sites
- Sitemap generation for SEO
- Meta tags optimization
- OpenGraph and Twitter Card support
- Performance monitoring and analytics
- CDN optimization for static assets

#### Changed
- Image optimization pipeline for faster load times
- CSS and JavaScript minification improvements
- Asset delivery optimization

#### Fixed
- Page load performance bottlenecks
- SEO metadata inconsistencies

### Wave 1: Initial Hugo Setup & Deployment

#### Added
- Initial Hugo project setup
- Theme configuration for Andromeda Light theme
- 7 Demo Hugo sites:
  - Demo Agency
  - Demo Blog
  - Demo Creative
  - Demo Ecommerce
  - Demo Landing
  - Demo Restaurant
  - Demo SaaS
- HTTPS deployment configuration
- CSP (Content Security Policy) headers
- Basic security headers implementation
- Primary portfolio site at matthewjamison.dev

#### Changed
- Initial project structure and organization

---

## Development Notes

### Portfolio Structure
This portfolio site showcases 7 different Hugo demo implementations, each demonstrating different design patterns and capabilities:

1. **Demo Agency** - Professional agency portfolio showcase
2. **Demo Blog** - Content-focused blog with categories and tags
3. **Demo Creative** - Creative portfolio with visual emphasis
4. **Demo Ecommerce** - Product catalog and shopping features
5. **Demo Landing** - High-converting landing page template
6. **Demo Restaurant** - Food service business showcase
7. **Demo SaaS** - Software-as-a-Service product website

### Key Features
- Responsive design across all demos
- Hugo static site generation
- Security-focused deployment
- Performance optimized
- Accessibility compliant (WCAG 3.0)
- Clean, maintainable codebase

### Contributing
See CODE_OF_CONDUCT.md for community guidelines and SECURITY.md for reporting security vulnerabilities.

---

[Unreleased]: https://github.com/MatthewJamisonJS/portfolio-page/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/MatthewJamisonJS/portfolio-page/releases/tag/v1.0.0
