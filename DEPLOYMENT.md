# Cloudflare Pages Deployment Guide - portfolio-page

**Live Domain:** `https://matthewjamison.dev`

This site is configured for automatic deployment on Cloudflare Pages with a custom domain.

## Quick Start

1. **Push to GitHub**: Simply push to the `main` branch
2. **Automatic Build**: Cloudflare Pages automatically builds and deploys
3. **Live at**: `https://matthewjamison.dev`

```bash
git add .
git commit -m "Update portfolio content"
git push origin main
```

Cloudflare Pages will automatically build and deploy within 1-2 minutes.

## Setup Instructions (First Time Only)

### 1. Connect Repository to Cloudflare Pages

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Select **Connect to Git** → **GitHub**
4. Authorize Cloudflare and select your GitHub account
5. Find and select repository: `MatthewJamisonJS/portfolio-page`

### 2. Configure Build Settings

When Cloudflare asks for build configuration:

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `hugo --minify --gc` |
| **Build output directory** | `public` |
| **Root directory** | (leave empty) |

### 3. Add Environment Variables

Click **Settings** → **Environment variables** and add:

```
HUGO_VERSION = 0.152.2
HUGO_ENV = production
```

### 4. Configure Custom Domain

1. Go to **Custom domains** tab
2. Click **Set up a custom domain**
3. Enter: `matthewjamison.dev`
4. Follow Cloudflare's instructions for DNS setup:

**Option A: If your domain is on Cloudflare DNS:**
- Cloudflare will automatically create the CNAME record
- No additional action needed

**Option B: If your domain is on another DNS provider:**
- Add CNAME record:
  - Name: `matthewjamison.dev` (or `@`)
  - Target: `portfolio-page.pages.dev`
  - TTL: 3600 (or automatic)

Wait 5-10 minutes for DNS propagation.

## Build Verification

Test the build locally before deploying:

```bash
# Run the deployment helper script
bash .cloudflare/deploy.sh

# Or manually:
rm -rf public
HUGO_ENV=production hugo --minify --gc

# Verify output
ls -la public/
find public -type f | wc -l
```

Expected output:
- `public/index.html` - Homepage
- `public/_headers` - Security headers
- `public/sitemap.xml` - SEO sitemap
- `public/robots.txt` - Robot instructions
- `public/css/` - Stylesheets
- `public/js/` - JavaScript files
- `public/images/` - Images (WebP format)
- ~100+ total files
- ~20MB total size

## Security Features

### Security Headers

Security headers are automatically applied via `static/_headers`:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://formspree.io https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://formspree.io

X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Verify Headers

After deployment, verify headers are applied:

```bash
curl -I https://matthewjamison.dev
```

Expected response:
```
HTTP/2 200
date: Thu, 29 Oct 2025 23:00:00 GMT
content-type: text/html; charset=utf-8
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://formspree.io https://cdnjs.cloudflare.com; ...
x-frame-options: SAMEORIGIN
x-content-type-options: nosniff
strict-transport-security: max-age=31536000; includeSubDomains; preload
```

## Deploy Previews

Cloudflare Pages automatically creates preview URLs for:
- **Pull requests**: `[branch-name]--[project-name].pages.dev`
- **Commits**: `[commit-hash].[project-name].pages.dev`

This allows you to review changes before merging to `main`.

## Manual Deployment (Alternative)

### Using Wrangler CLI

If you need to manually deploy without GitHub:

```bash
# Install Wrangler (one-time)
npm install -g @cloudflare/wrangler

# Login to Cloudflare
wrangler login

# Build site
rm -rf public
HUGO_ENV=production hugo --minify --gc

# Deploy
wrangler pages deploy public --project-name=portfolio-page
```

## Performance Targets

After deployment, aim for these metrics:

- **Lighthouse Score**: 95+
- **First Contentful Paint (FCP)**: < 1.5s
- **Time to Interactive (TTI)**: < 2.5s
- **Total Blocking Time (TBT)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Page Size**: < 2MB

Test at: https://pagespeed.web.dev/

## Troubleshooting

### Site doesn't load after deployment

1. Check Cloudflare Pages build logs:
   - Dashboard → Pages → portfolio-page → All deployments
   - Look for error messages in the build logs

2. Verify Hugo config:
   ```bash
   grep "baseURL" hugo.toml
   # Should output: baseURL = "https://matthewjamison.dev"
   ```

3. Check domain configuration:
   - Ensure CNAME record points to `portfolio-page.pages.dev`
   - DNS changes may take 5-10 minutes to propagate

### Images not loading

1. Verify images are in WebP format:
   ```bash
   find public/images -type f | file -
   ```

2. Check image paths are correct (relative to domain root)

3. Verify CORS headers if loading from external source

### Contact form not working

1. Verify Formspree endpoint is configured in template
2. Test form locally: `hugo server`
3. Check Formspree integration in browser console for errors

### Security headers not applied

1. Verify `public/_headers` file exists:
   ```bash
   ls -la public/_headers
   cat public/_headers
   ```

2. Rebuild site:
   ```bash
   rm -rf public
   hugo --minify --gc
   ```

3. Redeploy to Cloudflare Pages

### Slow initial load time

1. Enable caching headers (configured in `_headers`)
2. Optimize images to WebP format
3. Minimize CSS and JavaScript (already done with `--minify`)
4. Check Cloudflare cache settings:
   - Dashboard → Caching → Cache level: Aggressive
   - Browser cache TTL: 4 hours

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `HUGO_VERSION` | `0.152.2` | Ensures consistent Hugo version for builds |
| `HUGO_ENV` | `production` | Enables production optimizations |

## Useful Links

- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages/
- **Hugo Deployment Guide**: https://gohugo.io/hosting-and-deployment/hosting-on-cloudflare-pages/
- **Custom Domains Setup**: https://developers.cloudflare.com/pages/platform/custom-domains/
- **Formspree Integration**: https://formspree.io/docs/
- **Lighthouse Testing**: https://pagespeed.web.dev/

## Files Reference

- `.cloudflare/deploy.sh` - Deployment helper script
- `.cloudflare/CHECKLIST.md` - Pre/post deployment checklist
- `hugo.toml` - Hugo configuration
- `static/_headers` - Security headers configuration
- `static/robots.txt` - Search engine instructions
- `config/` - Theme and layout configurations

## Support

For issues or questions:

1. Check the **DEPLOYMENT.md** file (this document)
2. Review `.cloudflare/CHECKLIST.md` for verification steps
3. Check [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
4. Review [Hugo Documentation](https://gohugo.io/documentation/)
