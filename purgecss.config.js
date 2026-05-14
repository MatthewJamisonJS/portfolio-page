// PurgeCSS configuration — Gateway Tech AEO editorial system
// Bone / ink / brick palette. Decorative accent system fully removed.
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './layouts/**/*.html',
    './themes/meghna/layouts/**/*.html',
    './content/**/*.md',
    './data/**/*.yml',
    './data/**/*.json',
    './assets/js/**/*.js',
    './static/js/**/*.js'
  ],
  css: [
    './themes/meghna/static/plugins/bootstrap/bootstrap.min.css',
    './themes/meghna/static/css/style.css',
    './assets/css/custom.css'
  ],
  output: './static/css/purged/',
  safelist: {
    standard: [
      'active', 'show', 'fade', 'collapsing', 'modal-backdrop', 'collapse',
      'nav-link',
      // Editorial primitives
      'kicker', 'title-rule', 'section-eyebrow', 'section-title', 'section-rule',
      // Hero (variant C)
      'hero-area', 'hero-texture', 'hero-stack', 'hero-copy', 'hero-corner-rule',
      'hero-subtitle', 'hero-pillars', 'hero-price-floor', 'hero-byline',
      'hero-cta', 'hero-cta-secondary',
      'mark', 'keystone',
      // AEO live-citation reel
      'aeo-reel', 'aeo-reel-eyebrow', 'aeo-reel-eyebrow-dot',
      'aeo-reel-card', 'aeo-reel-card-head',
      'aeo-reel-engine', 'aeo-reel-tag',
      'aeo-reel-frame', 'aeo-reel-video',
      'aeo-reel-foot', 'aeo-reel-pause', 'aeo-reel-pause-icon',
      'aeo-reel-pause-label', 'aeo-reel-disclaimer',
      // Method
      'method-section', 'method-title', 'method-intro', 'method-grid',
      'pillar-card', 'pillar-technical', 'pillar-authority', 'pillar-content',
      'pillar-icon', 'pillar-title', 'pillar-tagline', 'pillar-bullets',
      // Pricing
      'pricing-section', 'pricing-title', 'pricing-grid', 'pricing-card',
      'pricing-highlighted', 'pricing-name', 'pricing-price', 'pricing-cadence',
      'pricing-use', 'pricing-includes', 'pricing-cta', 'pricing-pick',
      'pricing-footnote',
      // Trust block
      'trust-section', 'trust-head', 'trust-grid', 'trust-list', 'trust-item',
      'trust-num', 'trust-title', 'trust-desc',
      'trust-stage', 'trust-stage-head', 'trust-stage-dot',
      'trust-stage-q', 'trust-stage-a', 'trust-stage-cites', 'trust-stage-cite',
      'trust-stage-disclaimer',
      // About slim
      'about-section', 'about-quote', 'about-creds', 'about-cred',
      'about-cred-num', 'about-cred-desc',
      // FAQ
      'faq-section', 'faq-title', 'faq-accordion', 'faq-item',
      'faq-question', 'faq-answer',
      // Demos grid
      'portfolio-demos', 'demo-grid', 'demo-card', 'demo-image',
      'demo-overlay', 'demo-links',
      'demos-offer', 'demos-offer-title', 'demos-offer-body', 'demos-offer-cta',
      // Misc
      'brief-form', 'lozad', 'loaded',
      'cta-clicked', 'field-prefilled',
      'wow', 'fadeInUp', 'fadeIn', 'bounceIn',
      // Themify icons retained
      'ti-github', 'ti-linkedin', 'ti-music', 'ti-server', 'ti-layout', 'ti-pulse',
      // AEO-2 fork hero + page templates
      'btn-fork', 'btn-fork-primary', 'btn-fork-secondary',
      'hero-fork', 'hero-kicker', 'hero-title', 'hero-fork-ctas', 'hero-tertiary',
      'stat-grid', 'stat-card', 'stat-headline', 'stat-body', 'stat-source',
      'pillar-grid', 'pillar-tag',
      'trust-block', 'trust-moves', 'trust-heading',
      'pricing-highlight', 'use-when', 'includes', 'cadence', 'price',
      'page-why', 'page-different', 'page-pricing', 'page-faq',
      'page-header', 'page-subtitle', 'page-intro', 'page-footer',
      'home-teaser', 'home-teaser-copy', 'home-teaser-link',
      'footer-nav', 'nav-cta',
      'faq-list', 'faq-permalink',
      'block-audit-scope', 'block-pillars', 'block-deliverable'
    ],
    deep: [
      /^nav/,
      /^btn/,
      /^card/,
      /^demo-/,
      /^hero-/,
      /^section/,
      /^container/,
      /^row/,
      /^col-/,
      /^method-/,
      /^pillar-/,
      /^pricing-/,
      /^faq-/,
      /^trust-/,
      /^aeo-/,
      /^about-/,
      /^breadcrumb-/,
      /^blog-/
    ],
    greedy: [
      /^wow/,
      /fade/,
      /@keyframes/
    ]
  },
  rejected: [
    /carousel/, /modal/, /tooltip/, /popover/, /dropdown/, /alert/,
    /badge/, /pagination/, /progress/, /spinner/, /toast/
  ]
};
