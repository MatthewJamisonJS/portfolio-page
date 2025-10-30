# Deployment Checklist - portfolio-page

**Site Domain:** `matthewjamison.dev`
**Cloudflare Project:** `portfolio-page` (custom domain)
**Deployment Type:** Automatic (GitHub Push)

## Pre-Deployment

- [ ] Hugo version is 0.152.2+ (current: 0.152.2)
- [ ] `baseURL` in `hugo.toml` is correct: `https://matthewjamison.dev`
- [ ] All images are optimized to WebP format
- [ ] `static/_headers` file exists with security headers
- [ ] `robots.txt` has correct sitemap URL
- [ ] Local build succeeds: `bash .cloudflare/deploy.sh`
- [ ] No console errors in browser
- [ ] Contact form points to Formspree endpoint

## Cloudflare Pages Setup

- [ ] Repository `portfolio-page` connected to Cloudflare Pages
- [ ] Build command configured: `hugo --minify --gc`
- [ ] Build output directory: `public`
- [ ] Environment variable set: `HUGO_VERSION=0.152.2`
- [ ] Environment variable set: `HUGO_ENV=production`
- [ ] Custom domain configured: `matthewjamison.dev`
- [ ] DNS records verified:
  - [ ] CNAME: `matthewjamison.dev` → `portfolio-page.pages.dev`
  - [ ] Or using Cloudflare's automatic DNS if domain is managed by Cloudflare

## Post-Deployment Verification

- [ ] Site loads successfully at `https://matthewjamison.dev`
- [ ] Check security headers: `curl -I https://matthewjamison.dev`
- [ ] Verify security headers are present:
  - [ ] `Content-Security-Policy` header present
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Strict-Transport-Security` (HSTS)
- [ ] Test all internal navigation links
- [ ] Test responsive design on mobile (iPhone, Android)
- [ ] Verify images load correctly (WebP format)
- [ ] Test contact form submission (Formspree integration)
- [ ] Verify project links in demos section
- [ ] Check Lighthouse score (should be 95+)
- [ ] Verify sitemap is accessible: `/sitemap.xml`
- [ ] Verify robots.txt is accessible: `/robots.txt`

## Performance Metrics

- [ ] First Contentful Paint < 1.5s
- [ ] Time to Interactive < 2.5s
- [ ] Total page size < 2MB
- [ ] All images using lazy loading

## Security Verification

- [ ] HTTPS enforced (automatic with Cloudflare)
- [ ] HSTS header present (max-age=31536000)
- [ ] CSP header blocks inline scripts
- [ ] X-Frame-Options prevents clickjacking
- [ ] No mixed content warnings
- [ ] Formspree endpoint is HTTPS-only

## Troubleshooting

If issues occur:

1. **Build fails**: Check Cloudflare Pages build logs for specific errors
2. **Images missing**: Verify WebP format support and image paths
3. **Form not working**: Test Formspree integration and endpoint configuration
4. **Headers not applied**: Verify `public/_headers` file exists after build
5. **Custom domain issues**: Check DNS propagation (may take 5-10 minutes)

## Commands for Testing

```bash
# Test local build
bash .cloudflare/deploy.sh

# Test with production environment
HUGO_ENV=production hugo --minify --gc

# Verify build output
ls -la public/
find public -type f | wc -l

# Check headers file
cat public/_headers

# Test locally
hugo server
```
