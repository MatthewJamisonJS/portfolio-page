# Changelog

All notable changes to the portfolio-page project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
