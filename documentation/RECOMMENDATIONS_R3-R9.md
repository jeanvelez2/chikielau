# Project Recommendations — Rounds 3–9

*Implemented: March 22, 2026*
*Status: All 31 items implemented ✅*

---

## R3: Performance & Security Hardening (10 changes)

1. ✅ **CSP tightened** — Removed `fonts.googleapis.com` and `fonts.gstatic.com` from CSP since fonts are self-hosted. `font-src 'self'`, `style-src 'self' 'unsafe-inline'`.
2. ✅ **newsletter-track.js input validation** — `id` (≤64 chars) and `e` (≤254 chars) length-checked before Redis key use.
3. ✅ **newsletter-stats.js id validation** — Same Redis key injection fix, `id` param capped at 64 chars.
4. ✅ **newsletter-archive.js `noreferrer`** — Share link now `rel="noopener noreferrer"`.
5. ✅ **Admin endpoints `Cache-Control: no-store`** — All 5 admin endpoints (bounced, newsletter-stats, newsletters, subscribers, unsub-reasons).
6. ✅ **Static asset caching** — `Cache-Control: public, max-age=31536000, immutable` for `/assets/(.*)`, `/css/(.*)`, `/js/(.*)` in vercel.json.
7. ✅ **Script `defer`** — All script tags across all HTML files (except admin.html) have `defer`.
8. ✅ **Instagram function memory** — Reduced from 256MB to 128MB in vercel.json.
9. ✅ **DNS prefetch** — `<link rel="dns-prefetch" href="https://graph.instagram.com">` on index.html.
10. ✅ **JS cache-busting** — Added `?v=1` to all JS `<script src>` references across all HTML files.

---

## R4: Email Compliance & Resilience (4 changes)

1. ✅ **List-Unsubscribe-Post header** — Added `'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'` per RFC 8058 (Gmail/Yahoo requirement since Feb 2024) in `email.js sendNewsletter`.
2. ✅ **Rate limit fail-open** — `ratelimit.limit()` calls in `instagram.js`, `newsletter-subscribe.js`, `newsletter-unsubscribe.js` wrapped in try/catch. Allows request if Redis rate limiter is down.
3. ✅ **health.js error leakage** — Removed `err.message` from 503 response (could leak Redis connection details).
4. ✅ **ADMIN_SECRET null guard** — Private `hmacSecret()` helper in email.js throws `'ADMIN_SECRET not configured'` instead of cryptic TypeError.

---

## R5: SEO & Data Validation (5 changes)

1. ✅ **List-Unsubscribe-Post on retry sendMail** — The retry-failed code path in `newsletters.js PUT` was missing the header added in R4.
2. ✅ **scheduledAt date validation** — Added `isNaN(d.getTime())` check in `newsletters.js POST`. Previously `new Date("garbage")` silently passed.
3. ✅ **noindex on transactional pages** — Added `<meta name="robots" content="noindex">` to newsletter-confirm.js, newsletter-preferences.js, newsletter-unsubscribe.js.
4. ✅ **robots.txt archive exception** — Added `Allow: /api/newsletter-archive` (longest-match overrides `Disallow: /api/`).
5. ✅ **Sitemap: newsletter archive** — Added `https://chikielau.com/api/newsletter-archive` with `changefreq: weekly`. Sitemap now has 21 URLs.

---

## R6: Input Validation & Accessibility (3 changes)

1. ✅ **cron-refresh.js newToken validation** — Added `if (!newToken) return res.status(502)` after `refreshData.access_token` extraction. Prevents saving `undefined` to Vercel env.
2. ✅ **Instagram permalink validation** — `permalink: post.permalink?.startsWith('https://') ? post.permalink : '#'` in api/instagram.js server-side transform.
3. ✅ **autocomplete attributes** — Added `autocomplete="email"` to all email inputs across all HTML files + footer partial, `autocomplete="name"` to contact form name input.

---

## R7: Dead Code & Error Hardening (4 changes)

1. ✅ **Remove dead `requireEnv`** — Exported from config.js but never imported. Removed function + orphaned JSDoc. Remaining exports: `BASE_URL`, `safeCompare`, `adminAuth`.
2. ✅ **cron-refresh.js error leak** — Removed `errorData.error?.message` from client response. Now returns only generic `'Token refresh failed'`. Detailed error still logged server-side.
3. ✅ **refresh-token.js validation** — Added `data.access_token` null guard (returns 502) + `data.expires_in` NaN guard (returns `null` instead of `NaN`).
4. ✅ **Permissions-Policy: `interest-cohort=()`** — Opts out of Google FLoC/Topics tracking.

---

## R8: SEO & XSS Hardening (2 changes)

1. ✅ **404.html `noindex`** — Added `<meta name="robots" content="noindex">`. Search engines should never index 404 pages.
2. ✅ **admin.js `esc()` quote escaping** — Added `.replace(/"/g, '&quot;').replace(/'/g, '&#39;')` to prevent attribute breakout in `value="..."`, `data-*="..."`, `alt="..."` contexts. Bumped `admin.js?v=1` → `?v=2`.

---

## R9: CSP Hardening — Remove `unsafe-inline` from `script-src` (3 changes)

1. ✅ **Created `js/pages.js`** — Extracted inline scripts (reading progress bar + blog search filter) into one external file. Both guarded by element existence checks.
2. ✅ **Replaced 14 inline `<script>` blocks** — blog-full.html, blog-post.html, and all 12 review pages now use `<script src="js/pages.js?v=1" defer>`. Zero inline scripts remain in static HTML.
3. ✅ **CSP: `script-src 'self'`** — Removed `'unsafe-inline'` from global CSP. Two server-rendered endpoints (newsletter-preferences.js, newsletter-unsubscribe.js) override CSP via `res.setHeader` to allow their dynamic inline scripts.

---

## Summary

| Round | Changes | Status | Focus |
|-------|---------|--------|-------|
| R3 | 10 | ✅ | Performance & security headers |
| R4 | 4 | ✅ | Email compliance & resilience |
| R5 | 5 | ✅ | SEO & data validation |
| R6 | 3 | ✅ | Input validation & accessibility |
| R7 | 4 | ✅ | Dead code & error hardening |
| R8 | 2 | ✅ | SEO & XSS hardening |
| R9 | 3 | ✅ | CSP hardening |
| **Total** | **31** | **✅ Complete** | |
