#!/usr/bin/env node

const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function purgeCSSFiles() {
  console.log('🧹 Starting PurgeCSS optimization...\n');

  // Bootstrap CSS
  const bootstrapInput = './themes/meghna/static/plugins/bootstrap/bootstrap.min.css';
  const bootstrapOutput = './static/plugins/bootstrap/bootstrap.purged.min.css';

  const purgeCSSResult = await new PurgeCSS().purge({
    content: [
      './public/**/*.html',
      './public/**/*.js',
      './layouts/**/*.html',
      './themes/meghna/layouts/**/*.html'
    ],
    css: [bootstrapInput],
    safelist: {
      standard: [
        'active', 'show', 'fade', 'collapsing', 'modal-backdrop',
        'tooltip', 'popover', 'dropdown-menu', 'nav-link',
        'carousel-item-next', 'carousel-item-prev', 'collapse',
        'navbar-dark', 'navbar-expand-lg', 'navbar-collapse',
        'sticky-top', 'container', 'row', 'col-lg-4', 'col-md-6',
        'btn', 'btn-primary', 'btn-secondary', 'card', 'card-body',
        'form-group', 'form-control'
      ],
      deep: [/carousel/, /modal/, /dropdown/, /nav/, /navbar/, /btn/, /col-/, /form-/],
      greedy: [/^slick/, /^wow/, /fade/, /battle/, /pokemon/]
    }
  });

  // Ensure output directory exists
  const outputDir = path.dirname(bootstrapOutput);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write purged CSS
  fs.writeFileSync(bootstrapOutput, purgeCSSResult[0].css);

  // Get file sizes
  const originalSize = fs.statSync(bootstrapInput).size;
  const purgedSize = fs.statSync(bootstrapOutput).size;
  const savings = originalSize - purgedSize;
  const savingsPercent = ((savings / originalSize) * 100).toFixed(1);

  console.log('✅ Bootstrap CSS purged successfully!');
  console.log(`   Original: ${(originalSize / 1024).toFixed(1)}KB`);
  console.log(`   Purged:   ${(purgedSize / 1024).toFixed(1)}KB`);
  console.log(`   Savings:  ${(savings / 1024).toFixed(1)}KB (${savingsPercent}%)\n`);

  console.log(`📝 Next step: Update hugo.toml to use:`);
  console.log(`   link = "plugins/bootstrap/bootstrap.purged.min.css"\n`);
}

purgeCSSFiles().catch(console.error);
