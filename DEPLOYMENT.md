# Cloudflare Pages Deployment Guide - portfolio-page

**Live Domain:** `https://gatewaytechaeo.com`

This site is configured for automatic deployment on Cloudflare Pages with a custom domain.

## Quick Start

1. **Push to GitHub**: Simply push to the `main` branch
2. **Automatic Build**: Cloudflare Pages automatically builds and deploys
3. **Live at**: `https://gatewaytechaeo.com`

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
3. Enter: `gatewaytechaeo.com`
4. Follow Cloudflare's instructions for DNS setup:

**Option A: If your domain is on Cloudflare DNS:**
- Cloudflare will automatically create the CNAME record
- No additional action needed

**Option B: If your domain is on another DNS provider:**
- Add CNAME record:
  - Name: `gatewaytechaeo.com` (or `@`)
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
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data: https:; media-src 'self'; connect-src 'self' https://cloudflareinsights.com https://csp-report.gatewaytechaeo.com; frame-src 'self'; form-action 'self' https://intake.gatewaytechaeo.com; report-to csp; report-uri https://csp-report.gatewaytechaeo.com/

Reporting-Endpoints: csp="https://csp-report.gatewaytechaeo.com/"
Report-To: {"group":"csp","max_age":10886400,"endpoints":[{"url":"https://csp-report.gatewaytechaeo.com/"}]}
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### Verify Headers

After deployment, verify headers are applied:

```bash
curl -I https://gatewaytechaeo.com
```

Expected response:
```
HTTP/2 200
date: Thu, 29 Oct 2025 23:00:00 GMT
content-type: text/html; charset=utf-8
content-security-policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; ...
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
   # Should output: baseURL = "https://gatewaytechaeo.com"
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

1. Confirm `data/{lang}/contact.yml` `form_action` points at `https://intake.gatewaytechaeo.com/brief`.
2. Confirm the `brief-intake-collector` Worker is deployed (`wrangler deploy` from `brief-intake-collector/`).
3. `curl -sI https://intake.gatewaytechaeo.com/` should return 200.
4. `curl -X POST -d 'name=t&email=t@x.io&location=l&business_one_liner=b&current_goals=g' -H 'Content-Type: application/x-www-form-urlencoded' https://intake.gatewaytechaeo.com/brief` should return 303 and deliver to `jamison.matthew@icloud.com`.
5. Verify `cf-observability` MCP logs for `brief-intake-collector` show recent receives.

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
- **Cloudflare Email Routing — Send from Workers**: https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
- **Lighthouse Testing**: https://pagespeed.web.dev/

## AEO loop video production

The hero `.aeo-videos` reel renders one or more terminal-style citation loops. Each
loop is produced from a checked-in [VHS](https://github.com/charmbracelet/vhs) `.tape`
script under `assets/video-tapes/`. Output is encoded to webm (vp9) + mp4 (H.264) +
WebP poster.

### Tools

```bash
brew install vhs ffmpeg webp
```

`vhs` requires Google Chrome installed (used for headless render). `webp` provides
`cwebp` for the poster encode (ffmpeg's libwebp encoder is not always present).

### Producing a loop end-to-end

```bash
cd "$(git rev-parse --show-toplevel)"

# 1. VHS produces the mp4 (Output line in the .tape file points here)
vhs assets/video-tapes/loop1-italian.tape

# 2. Encode webm from the mp4
ffmpeg -y -i static/videos/loop1-italian.mp4 \
  -c:v libvpx-vp9 -b:v 0 -crf 35 -row-mt 1 -an \
  static/videos/loop1-italian.webm

# 3. Extract poster frame at t=4s, encode WebP via cwebp
ffmpeg -y -i static/videos/loop1-italian.mp4 \
  -ss 00:00:04 -frames:v 1 -update 1 -vf "scale=800:500" \
  /tmp/loop1-italian-poster.png
cwebp -q 85 /tmp/loop1-italian-poster.png \
  -o static/images/posters/loop1-italian-poster.webp
rm /tmp/loop1-italian-poster.png

# 4. Verify file-size budget
du -h static/videos/loop1-italian.{webm,mp4} \
       static/images/posters/loop1-italian-poster.webp
```

### Size budget (hard gates)

| Asset | Max |
|---|---|
| webm | 250 KB |
| mp4  | 350 KB |
| poster.webp | 30 KB |

If oversize, raise `-crf` (try 38, then 42) and re-encode webm. Fall back to a
stricter H.264 ffmpeg pass on the mp4 if needed.

### Wiring a finished loop into the site

1. Place the `.tape`, `.webm`, `.mp4`, and `.webp` poster at the paths the recipe writes.
2. Edit `data/{en,es,ja,fr,de}/reel.yml` — set `enabled: true` on the matching loop
   slug across all five locales.
3. Run `hugo --environment production --minify --gc` and verify the new `<video
   data-loop="…">` slot renders.

## Sibling Worker — CSP report collector

The site's CSP `report-to` / `report-uri` directives target a separate Cloudflare
Worker at `https://csp-report.gatewaytechaeo.com`. Source lives in
`csp-report-collector/` at repo root and is deployed independently of Pages via
`wrangler deploy` from that directory (uses the OAuth session on the cph.org
Cloudflare account, account_id `9fe16a00e3fedbfd2be304559fc7f777`). Deploying
the Worker is a **one-time op** — only redeploy when `csp-report-collector/src/`
changes. Pages builds do not touch it. If the Worker is offline, browsers log a
console warning when posting violation reports but the site continues to render
normally (`report-to` failure is non-fatal).

Observability lives in the Worker, not Pages: every POST is logged via
`console.log` and is queryable through the `cf-observability` MCP
(`query_worker_observability` against script name `csp-report-collector`).

Verify a fresh deploy:

```bash
# GET stub
curl -s https://csp-report.gatewaytechaeo.com/
# expect: "CSP violation report endpoint. POST CSP reports here."

# Legacy POST (Safari, older browsers)
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -H 'Content-Type: application/csp-report' \
  -d '{"csp-report":{"violated-directive":"connect-src"}}' \
  https://csp-report.gatewaytechaeo.com/
# expect: 204

# Modern POST (Chrome/Edge Reporting API)
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -H 'Content-Type: application/reports+json' \
  -d '[{"type":"csp-violation","age":0,"url":"x","body":{}}]' \
  https://csp-report.gatewaytechaeo.com/
# expect: 204

# Unknown content-type is rejected with 415
curl -s -o /dev/null -w "%{http_code}\n" -X POST \
  -H 'Content-Type: text/plain' \
  -d 'hi' \
  https://csp-report.gatewaytechaeo.com/
# expect: 415
```

## Files Reference

- `.cloudflare/deploy.sh` - Deployment helper script
- `.cloudflare/CHECKLIST.md` - Pre/post deployment checklist
- `hugo.toml` - Hugo configuration
- `static/_headers` - Security headers configuration
- `static/robots.txt` - Search engine instructions
- `config/` - Theme and layout configurations
- `csp-report-collector/` - Sibling Cloudflare Worker that ingests CSP
  violation reports (deployed via `wrangler deploy` from that directory)

## Support

For issues or questions:

1. Check the **DEPLOYMENT.md** file (this document)
2. Review `.cloudflare/CHECKLIST.md` for verification steps
3. Check [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
4. Review [Hugo Documentation](https://gohugo.io/documentation/)
