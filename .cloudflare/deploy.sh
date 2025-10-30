#!/bin/bash
# Cloudflare Pages deployment helper script for portfolio-page
# Site: matthewjamison.dev

echo "Starting Hugo build for Cloudflare Pages..."
echo "=============================================="

# Check Hugo version
echo "Checking Hugo version..."
hugo version

# Clean previous builds
echo ""
echo "Cleaning public directory..."
rm -rf public

# Build site with minification
echo ""
echo "Building site with production settings..."
HUGO_ENV=production hugo --minify --gc

# Verify build output
echo ""
if [ -d "public" ]; then
    echo "Build successful!"
    echo ""
    echo "Build statistics:"
    echo "  Total size: $(du -sh public | cut -f1)"
    echo "  Files generated: $(find public -type f | wc -l)"

    # Verify critical files
    echo ""
    echo "Verifying critical files:"
    for file in "index.html" "_headers" "sitemap.xml" "robots.txt"; do
        if [ -f "public/$file" ]; then
            echo "  ✓ $file"
        else
            echo "  ✗ $file (missing)"
        fi
    done

    echo ""
    echo "Ready for deployment to Cloudflare Pages!"
else
    echo "Build failed - public directory not found"
    exit 1
fi
