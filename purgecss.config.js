// PurgeCSS configuration for removing unused CSS
module.exports = {
  content: [
    './public/**/*.html',
    './public/**/*.js',
    './layouts/**/*.html',
    './themes/meghna/layouts/**/*.html'
  ],
  css: [
    './themes/meghna/static/plugins/bootstrap/bootstrap.min.css',
    './themes/meghna/static/css/style.css',
    './themes/meghna/static/plugins/themify-icons/themify-icons.css'
  ],
  output: './static/plugins/bootstrap/',
  safelist: {
    // Dynamically added classes
    standard: [
      'active',
      'show',
      'fade',
      'collapsing',
      'modal-backdrop',
      'tooltip',
      'popover',
      'dropdown-menu',
      'nav-link',
      'carousel-item-next',
      'carousel-item-prev',
      'collapse',
      /^slick-/,
      /^wow/,
      /^battle-/,
      /^pokemon-/,
      /^data-/
    ],
    deep: [/carousel/, /modal/, /dropdown/, /nav/, /slick/],
    greedy: [/^wow/, /fade/, /battle/, /pokemon/]
  }
};
