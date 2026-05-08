# Cloudflare Zone Configuration — matthewjamison.dev

> Desired state for the Cloudflare zone serving `matthewjamison.dev`.
> Cmd+click any link below to open that exact dashboard page.
>
> **Account ID:** `9fe16a00e3fedbfd2be304559fc7f777`
> **Zone:** `matthewjamison.dev`

---

## Quick links

- **Zone home:** [https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev)
- **Speed → Optimization:** [https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization)
- **Security → Bots:** [https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/security/bots](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/security/bots)
- **Caching → Configuration:** [https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/caching/configuration](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/caching/configuration)
- **Analytics & Logs → Web Analytics:** [https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/analytics/web](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/analytics/web)

---

## Desired feature state

| Feature | Desired | Why | Where |
|---|---|---|---|
| Rocket Loader | **OFF** | Adds 498ms render-blocking JS (`cdn-cgi/scripts/.../rocket-loader.min.js`). Site already uses `defer` on its own scripts; Rocket Loader's interception is net-negative. | [Speed → Optimization → Content Optimization](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization) → "Rocket Loader" toggle |
| Bot Fight Mode | **OFF** | Injects `cdn-cgi/challenge-platform/scripts/jsd/main.js` (~10KB, 1044ms scripting bootup time on mobile). Flags monitoring + Lighthouse runs as bots. WAF + Turnstile cover real bot threats more cheaply. | [Security → Bots](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/security/bots) → "Bot Fight Mode" toggle |
| Auto Minify (HTML/CSS/JS) | **OFF** | Hugo already minifies via `--minify`. Double-minification adds a parse pass on the edge for no gain. | [Speed → Optimization → Content Optimization](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization) — note: Auto Minify was deprecated by CF in 2024; only check it's not still on if your zone predates that. |
| Brotli compression | **ON** | Better than gzip; browsers that support it transfer ~15% less. | [Speed → Optimization → Content Optimization](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization) → "Brotli" |
| Early Hints | **ON** | Lets CF send `103 Early Hints` for preload links before the origin response. Pairs well with the woff2 preloads in `head.html`. | [Speed → Optimization → Content Optimization](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/speed/optimization) → "Early Hints" |
| HTTP/3 (with QUIC) | **ON** | Reduces RTT cost for repeat visitors. | [Network](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/network) → "HTTP/3 (with QUIC)" |
| 0-RTT Connection Resumption | **ON** | Faster TLS handshake on repeat connections. | [Network](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/network) → "0-RTT Connection Resumption" |
| Always Use HTTPS | **ON** | Already enforced by HSTS in `static/_headers`. Belt + suspenders. | [SSL/TLS → Edge Certificates](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/ssl-tls/edge-certificates) → "Always Use HTTPS" |
| Web Analytics | **ON** | Provides RUM data (`cloudflareinsights.com` beacon) used in CSP allowlist. | [Analytics & Logs → Web Analytics](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/analytics/web) |

---

## After toggling, verify

```bash
# 1. Confirm CF stops injecting Rocket Loader and challenge-platform JS:
curl -s https://matthewjamison.dev/ | grep -oE 'rocket-loader|cdn-cgi/challenge-platform' | sort -u
# Expect: no output (or only "cdn-cgi/challenge-platform" if Bot Fight Mode is still on)

# 2. Re-run mobile Lighthouse:
lighthouse https://matthewjamison.dev/ \
  --only-categories=performance \
  --output=json --output-path=/tmp/lh-prod.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet

jq '{perf: .categories.performance.score, lcp: .audits."largest-contentful-paint".displayValue, tbt: .audits."total-blocking-time".numericValue}' /tmp/lh-prod.json
# Target: perf >= 0.95, LCP <= 2.5s, TBT < 200ms
```

---

## If Rocket Loader / Bot Fight Mode toggles look correct in dashboard but production still injects

Possibilities, in order of likelihood:

1. **Wrong zone selected.** Confirm dashboard top-bar reads `matthewjamison.dev`, not `gatewaytechaeo.com` or any *.pages.dev.
2. **CF caching the HTML response.** Even though `cf-cache-status: DYNAMIC` is reported, transform features like Rocket Loader can be cached separately. Purge: [Caching → Configuration](https://dash.cloudflare.com/9fe16a00e3fedbfd2be304559fc7f777/matthewjamison.dev/caching/configuration) → "Purge Everything".
3. **Browser cache on dashboard side.** Hard-refresh the dashboard tab (Cmd+Shift+R) and verify the toggle state.
4. **Tiered caching with stale config at upper tier.** Wait 5 minutes; CF propagation is normally ≤60s but tiered cache can extend.

If all four ruled out and behavior persists, file a CF support ticket with the zone name and observed `curl -sI https://matthewjamison.dev/` headers.

---

## Optional follow-up: Configure-as-code

Cloudflare zone settings can be managed via Terraform (`cloudflare_zone_settings_override` resource) or the CF API directly. For a single-developer project this is overkill; for a multi-operator setup, codify in `infra/cloudflare/`. Out of scope for this AEO refactor.

---

## Reference

- Rocket Loader: https://developers.cloudflare.com/speed/optimization/content/rocket-loader/
- Bot Fight Mode: https://developers.cloudflare.com/bots/get-started/free/
- Early Hints: https://developers.cloudflare.com/cache/about/early-hints/
- HTTP/3 + QUIC: https://developers.cloudflare.com/speed/optimization/protocol/http3/
