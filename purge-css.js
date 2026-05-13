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
      './themes/meghna/layouts/**/*.html',
      './content/**/*.md',
      './assets/js/**/*.js'
    ],
    css: [bootstrapInput],
    safelist: {
      standard: [
        'active', 'show', 'fade', 'collapsing',
        'collapse', 'navbar-collapse',
        'container', 'row',
        'btn', 'btn-transparent', 'page-scroll',
        'hero-area', 'hero-gradient-overlay'
      ],
      deep: [/nav/, /navbar/, /btn/, /col-/, /hero/],
      greedy: [/fade/]
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
