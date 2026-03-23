# Project Recommendations — Round 2

*Generated: March 22, 2026*
*Status: All 40 items implemented ✅*

---

## 🔴 Critical / Security

### 1. ✅ Timing-Unsafe Secret Comparisons Everywhere
Every secret/token comparison uses `===` or `!==`, which is vulnerable to timing attacks. Affected files:
- `api/_lib/config.js` — `adminAuth()` compares `x-admin-secret`
- `api/health.js` — `CRON_SECRET` bearer token
- `api/newsletter-confirm.js` — HMAC confirm token
- `api/newsletter-unsubscribe.js` — HMAC unsub token
- `api/newsletter-preferences.js` — HMAC unsub token
- `api/cron-newsletter.js` — `CRON_SECRET`
- `api/cron-refresh.js` — `CRON_SECRET`
- `api/refresh-token.js` — `INSTAGRAM_TOKEN_SECRET`

**Fix**: Use `crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))` with length pre-check.

### 2. ✅ No Security Headers
No `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`, or `Permissions-Policy` on any route. This is the biggest infrastructure gap.

**Fix**: Add a global headers block in `vercel.json` for all routes.

### 3. ✅ `</script>` Injection in Inline Script Blocks
`newsletter-unsubscribe.js` and `newsletter-preferences.js` escape email/token for JS string context but don't prevent `</script>` injection. If an email contains `</script><script>alert(1)</script>`, the HTML parser closes the script tag before JS executes.

**Fix**: Also replace `</` with `<\/` in the escaped values.

### 4. ✅ `markdownToHtml` Allows `javascript:` URIs
The function escapes HTML then re-introduces `href` and `src` attributes from markdown syntax. Input like `[click](javascript:alert(1))` or `![img](javascript:alert(1))` would produce executable links/images.

**Fix**: Validate that URLs in markdown links/images start with `http://`, `https://`, or `/`.

### 5. ✅ CSV Export Vulnerable to Formula Injection
`api/admin/subscribers.js` CSV export only escapes double quotes. If email or source starts with `=`, `+`, `-`, `@`, it's interpreted as a formula in Excel/Google Sheets.

**Fix**: Prefix cell values starting with those characters with a single quote `'`.

### 6. ✅ CSRF Token Validation is Ineffective
`adminAuth()` only checks that `x-csrf-token` exists and is ≥16 chars. No server-side token to compare against. Any random string passes.

**Fix**: Either implement proper CSRF tokens (generate on login, validate on mutation) or remove the check to avoid false sense of security.

---

## 🟠 Performance

### 7. ✅ N+1 Redis Queries in Archive and Subscribers
- `newsletter-archive.js`: Fetches ALL newsletter IDs then queries each individually
- `admin/subscribers.js`: Same pattern for subscriber data

**Fix**: Use Redis `MGET` or pipeline commands to batch queries.

### 8. ✅ No Pagination on Admin Endpoints
- `admin/subscribers.js` GET returns ALL subscribers at once
- `admin/bounced.js` and `admin/unsub-reasons.js` hardcode limit of 50

**Fix**: Add `?page=N&limit=N` query parameters.

### 9. ✅ Bulk Import Sends Emails Without Delay
`admin/subscribers.js` bulk import sends up to 500 confirmation emails sequentially with no delay. Could hit Gmail rate limits.

**Fix**: Add 250ms delay between sends (matching `sendNewsletter` pattern).

### 10. ✅ `instagram.js` No Rate Limiting
Public endpoint with no rate limiting. Each cache-miss request hits the Instagram API.

**Fix**: Add rate limiting similar to `contact.js`.

### 11. ✅ Theme Toggle `localStorage` Not Wrapped in try/catch
`js/script.js` line 403: `localStorage.getItem('theme')` on initial load is outside try/catch. The `setItem` on click IS wrapped, but the initial read isn't.

**Fix**: Wrap the initial `getItem` in try/catch.

### 12. ✅ `instagram.js` localStorage Not Wrapped in try/catch
All `localStorage` calls in `js/instagram.js` (lines 74, 86, 103, 196) lack try/catch. Private browsing mode or storage quota errors will throw.

**Fix**: Wrap in try/catch like `translations.js` does.

---

## 🟡 Architecture & Code Quality

### 13. ✅ `cron-newsletter.js` Has No Duplicate Send Protection
No concurrency lock. If the cron job runs twice simultaneously (Vercel retry), the same newsletter could be sent twice. Also, failed newsletters revert to 'scheduled' and will retry, potentially sending duplicates to recipients who already received it.

**Fix**: Use a Redis lock (`SETNX`) before sending. Track sent recipients per newsletter.

### 14. ✅ `admin/newsletters.js` TOCTOU Race Condition
Between reading newsletter status and setting it to 'sending', another request could modify it.

**Fix**: Use Redis `WATCH`/`MULTI` or a `SETNX`-based lock.

### 15. ✅ `admin/newsletters.js` Multiple Sequential `hset` Calls
PATCH handler makes up to 3 separate `hset` calls for subject, body, and preheader.

**Fix**: Combine into a single `hset` call with all fields.

### 16. ✅ `admin/newsletters.js` Test Email Bypasses Validation
The `testEmail` branch returns before subject/body length validation runs. Test emails also have no email format validation.

**Fix**: Move validation before the test email branch.

### 17. ✅ Module-Level Redis Initialization
All newsletter and admin files initialize Redis at module scope. If Upstash env vars are missing, the module fails to load with a cryptic error.

**Fix**: Initialize Redis inside the handler or wrap in try/catch with a clear error message.

### 18. ✅ Build Script Has No Error Handling
`scripts/build.js` — if a CSS module file is missing, `readFileSync` throws an unhandled error. No warnings for HTML files that don't match the injection regex.

**Fix**: Add try/catch with descriptive error messages. Log warnings for skipped files.

### 19. ✅ Build Script Path Rewriting is Fragile
The regex `href="(?!http|#|mailto)` doesn't account for `tel:`, `data:`, or `javascript:` URIs. Also doesn't handle single-quoted attributes.

**Fix**: Expand the negative lookahead or use a proper HTML parser.

### 20. ✅ `contact.js` No `topic` Length Validation
`topic` field is used in email subject with no length cap. Only HTML-escaped.

**Fix**: Add `topic.length > 100` check.

### 21. ✅ Inconsistent Error Response Shapes
Some endpoints return `{ error: "message" }`, others return `{ error: "title", message: "details" }`. `cron-refresh.js` and `refresh-token.js` leak env var names and internal architecture details in error messages.

**Fix**: Standardize on `{ error: "message" }`. Remove internal details from error responses.

---

## 🔵 SEO & Content

### 22. ✅ RSS Feed Only Has 1 Item
12 review pages exist but `feed.xml` only contains 1 item. RSS items still point to `blog-post.html` template instead of `/reviews/*.html` canonical URLs.

**Fix**: Add all 12 reviews to the RSS feed with correct URLs.

### 23. ✅ `blog-post.html` Template in Sitemap
The generic template page is listed in the sitemap as content. With 12 individual review pages now existing, this creates duplicate/thin content.

**Fix**: Remove `blog-post.html` from sitemap, or redirect it to `blog-full.html`.

### 24. ✅ No `hreflang` Annotations for Bilingual Content
The site is EN/ES bilingual but has no `hreflang` annotations in the sitemap or HTML `<link>` tags. Google can't determine language targeting.

**Fix**: Add `<link rel="alternate" hreflang="en">` and `hreflang="es"` to HTML pages, or add `xhtml:link` elements to sitemap.

### 25. ✅ External Links Missing `rel="noreferrer"`
All external links use `rel="noopener"` but not `noreferrer`. The Referer header is sent to Instagram, TikTok, and Goodreads.

**Fix**: Change to `rel="noopener noreferrer"` in partials and all HTML files.

---

## 🟢 Accessibility

### 26. ✅ `<nav>` Missing `aria-label`
The header `<nav>` element has no `aria-label`. When multiple nav elements exist (header + potential footer), screen readers can't distinguish them.

**Fix**: Add `aria-label="Main navigation"` to the header `<nav>`.

### 27. ✅ Language Toggle Missing Group Role
The `.language-toggle` div should have `role="group"` and `aria-label="Language selection"` for screen readers.

**Fix**: Add attributes to the language toggle container in `partials/header.html`.

### 28. ✅ `admin.html` Missing `<noscript>`
All other pages have a `<noscript>` fallback. Admin page doesn't.

**Fix**: Add `<noscript>` tag to admin.html.

---

## 🟣 Operational & DevOps

### 29. ✅ GitHub Actions Secrets in Shell Commands
`${{ secrets.VERCEL_DEPLOYMENT_URL }}` and `${{ secrets.CRON_SECRET }}` are interpolated directly into shell `run` commands. If secret values contain shell metacharacters, this could cause injection.

**Fix**: Pass secrets as environment variables instead.

### 30. ✅ GitHub Actions Missing `permissions` Block
The workflow doesn't declare minimal permissions. Should explicitly set `permissions: {}` since it only makes HTTP calls.

**Fix**: Add `permissions: {}` to the workflow.

### 31. ✅ GitHub Actions `curl` Has No Timeout
If the server hangs, curl waits indefinitely.

**Fix**: Add `--max-time 30` to curl commands.

### 32. ✅ `robots.txt` Doesn't Block Enough
Only blocks `/admin.html` and `/api/admin/`. Missing: `/api/` (all API routes), `/partials/`, `/scripts/`, `/css/modules/`.

**Fix**: Expand disallow rules. Add `Sitemap:` directive.

### 33. ✅ No `engines` Field in `package.json`
No Node.js version specified. Vercel could use an unexpected version.

**Fix**: Add `"engines": { "node": ">=18" }`.

### 34. ✅ Dev Dependencies Not Declared
`sharp-cli` and `clean-css-cli` are used via `npx` in npm scripts but not in `devDependencies`. First-time users get prompted to install.

**Fix**: Add to `devDependencies` or document as optional.

### 35. ✅ CORS Allows Unnecessary HTTP Methods
`vercel.json` allows `DELETE` and `PUT` on all API routes. Most endpoints only need `GET` and `POST`.

**Fix**: Restrict to `GET, POST, OPTIONS`.

---

## 💡 Improvements

### 36. ✅ Add `cleanUrls` to Vercel Config
Enables `/about` instead of `/about.html`. Improves URL aesthetics and SEO.

### 37. ✅ Add Error Boundary to Build Script
Log which CSS modules were concatenated, which HTML files were processed, and warn about any issues. Makes debugging deployment failures easier.

### 38. ✅ Newsletter Archive Should Use Redis Pipeline
Replace the N+1 query loop with a single pipeline call for all newsletter data.

### 39. ✅ Add `text` Fallback to Contact Form Email
`contact.js` only sends `html`, no `text` property. Some email clients prefer plain text.

### 40. ✅ Pin GitHub Actions Runner Version
Change `ubuntu-latest` to `ubuntu-24.04` to prevent unexpected OS version changes.

---

## Summary

| Category | Total | Status |
|---|---|---|
| 🔴 Critical / Security | 6 | ✅ All implemented |
| 🟠 Performance | 6 | ✅ All implemented |
| 🟡 Architecture & Code Quality | 9 | ✅ All implemented |
| 🔵 SEO & Content | 4 | ✅ All implemented |
| 🟢 Accessibility | 3 | ✅ All implemented |
| 🟣 Operational & DevOps | 7 | ✅ All implemented |
| 💡 Improvements | 5 | ✅ All implemented |
| **Total** | **40** | **✅ Complete** |
