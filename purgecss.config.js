// Enhanced PurgeCSS configuration for Phase 5
// Target: 221KB → 30KB CSS (reduce by 86%)
module.exports = {
  content: [
    // Generated HTML from all languages
    './public/**/*.html',
    './public/**/*.js',
    // Hugo templates
    './layouts/**/*.html',
    './themes/meghna/layouts/**/*.html',
    // Content files (may contain classes)
    './content/**/*.md',
    // Data files (YAML/JSON may reference classes)
    './data/**/*.yml',
    './data/**/*.json',
    // JavaScript files (dynamic classes)
    './assets/js/**/*.js',
    './static/js/**/*.js'
  ],
  css: [
    // All CSS files to be purged
    './themes/meghna/static/plugins/bootstrap/bootstrap.min.css',
    './themes/meghna/static/css/style.css',
    './themes/meghna/static/plugins/themify-icons/themify-icons.css',
    './assets/css/custom.css',
    './assets/css/battle-animations.css'
  ],
  output: './static/plugins/bootstrap/',
  safelist: {
    // Classes that are dynamically added or used in animations
    standard: [
      'active',
      'show',
      'fade',
      'collapsing',
      'modal-backdrop',
      'collapse',
      'nav-link',
      // Portal animation classes (footer.html line 193-232)
      'portal-overlay',
      'portal-center',
      'portal-ring',
      'portal-ring-1',
      'portal-ring-2',
      'portal-ring-3',
      'portal-ring-4',
      'portal-ring-5',
      'portal-core',
      // Pokemon decorative animations
      'pokemon-pikachu',
      'pokemon-mew',
      'pokemon-celebi',
      'pokemon-jirachi',
      // Lazy loading
      'lozad',
      'loaded',
      // Pricing CTA
      'cta-clicked',
      'field-prefilled',
      // WOW animations
      'wow',
      'fadeInUp',
      'fadeIn',
      'bounceIn',
      // Themify icons (only the ones actually used)
      'ti-github',
      'ti-linkedin',
      'ti-music',
      'ti-server',
      'ti-layout',
      'ti-pulse'
    ],
    // Deep matching for component variations
    deep: [
      /^portal-/,      // Portal animation system
      /^pokemon-/,     // Pokemon decorative elements
      /^nav/,          // Navigation components
      /^btn/,          // Button variants
      /^card/,         // Card components
      /^demo-/,        // Demo card styles
      /^hero-/,        // Hero section
      /^section/,      // Section classes
      /^container/,    // Layout containers
      /^row/,          // Grid rows
      /^col-/          // Grid columns
    ],
    // Greedy matching for animation keyframes
    greedy: [
      /^wow/,
      /fade/,
      /^portal/,
      /^pokemon/,
      /^battle/,
      /@keyframes/
    ]
  },
  // Reject list - classes we definitely don't need
  rejected: [
    /carousel/,      // Not using Bootstrap carousel
    /modal/,         // Not using Bootstrap modals
    /tooltip/,       // Not using Bootstrap tooltips
    /popover/,       // Not using Bootstrap popovers
    /dropdown/,      // Not using Bootstrap dropdowns
    /alert/,         // Not using Bootstrap alerts
    /badge/,         // Not using Bootstrap badges
    /breadcrumb/,    // Not using breadcrumbs
    /pagination/,    // Not using Bootstrap pagination
    /progress/,      // Not using progress bars
    /spinner/,       // Not using spinners
    /toast/          // Not using toasts
  ]
};
