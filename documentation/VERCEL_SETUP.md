# Vercel Deployment & Setup Guide

## Prerequisites

- [Vercel account](https://vercel.com/signup) (free tier works)
- [GitHub account](https://github.com) with this repo pushed
- [Gmail account](https://mail.google.com) with 2FA enabled
- [Instagram Developer account](https://developers.facebook.com) (for feed)
- [Upstash account](https://upstash.com) (free tier works — for Redis)

---

## 1. Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework Preset: **Other** (no framework)
4. Build Command: leave empty (static site, no build step needed)
5. Output Directory: leave empty (root)
6. Click **Deploy**

The first deploy will fail because environment variables aren't set yet. That's fine.

---

## 2. Environment Variables

Go to **Project Settings → Environment Variables** in Vercel and add each one below.

### Required — Core

| Variable | Value | How to get it |
|----------|-------|---------------|
| `GMAIL_USER` | `<your-email>@gmail.com` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | 16-character app password | Gmail → Security → 2FA → App Passwords → generate one for "Mail" |
| `ADMIN_SECRET` | Random 32+ char string | Run `openssl rand -hex 32` in terminal |
| `CRON_SECRET` | Random 32+ char string | Run `openssl rand -hex 32` in terminal |

### Required — Upstash Redis

| Variable | Value | How to get it |
|----------|-------|---------------|
| `UPSTASH_REDIS_REST_URL` | `https://...upstash.io` | Upstash Console → Create Database → REST API section |
| `UPSTASH_REDIS_REST_TOKEN` | Token string | Same page, copy the REST token |

> The `@upstash/redis` library auto-detects these two variables via `Redis.fromEnv()`. No code references them directly.

### Required — Instagram Feed

| Variable | Value | How to get it |
|----------|-------|---------------|
| `INSTAGRAM_ACCESS_TOKEN` | Long-lived token | See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) |
| `INSTAGRAM_TOKEN_SECRET` | Random 32+ char string | Run `openssl rand -hex 32` — used for manual token refresh endpoint |

### Required — Auto Token Refresh

| Variable | Value | How to get it |
|----------|-------|---------------|
| `VERCEL_API_TOKEN` | `tok_...` | Vercel → Settings → Tokens → Create |
| `VERCEL_PROJECT_ID` | `prj_...` | Vercel → Project Settings → General → Project ID |
| `VERCEL_TEAM_ID` | `team_...` (or leave blank) | Vercel → Team Settings → General → Team ID. Only needed if project is under a team. |

### Optional

| Variable | Value | Notes |
|----------|-------|-------|
| `BASE_URL` | `https://chikielau.com` | Auto-detected from `VERCEL_URL` if not set. Only needed if using a custom domain and want explicit control. |

---

## 3. Gmail App Password Setup

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already on
3. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Select app: **Mail**, device: **Other** → name it "Chikielau"
5. Copy the 16-character password (no spaces)
6. Set as `GMAIL_APP_PASSWORD` in Vercel

---

## 4. Upstash Redis Setup

1. Go to [console.upstash.com](https://console.upstash.com)
2. Click **Create Database**
3. Name: `chikielau` (or anything)
4. Region: pick closest to your Vercel deployment (e.g., `us-east-1`)
5. Type: **Regional** (free tier)
6. After creation, go to the **REST API** tab
7. Copy `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
8. Add both to Vercel environment variables

Redis is used for: newsletter subscribers, newsletter storage, rate limiting, bounce tracking, open tracking, unsubscribe reasons.

---

## 5. Instagram Token Setup

See [INSTAGRAM_SETUP.md](INSTAGRAM_SETUP.md) for the full walkthrough. Quick summary:

1. Create a Facebook Developer App
2. Add Instagram Basic Display product
3. Add yourself as a test user and accept
4. Generate a short-lived token
5. Exchange for a long-lived token (60 days)
6. Set as `INSTAGRAM_ACCESS_TOKEN` in Vercel

The token auto-refreshes monthly via Vercel Cron (`/api/cron-refresh`).

---

## 6. GitHub Actions Setup (Backup Token Refresh)

This is a backup in case the Vercel cron misses a run.

1. Go to your GitHub repo → **Settings → Secrets and variables → Actions**
2. Add these repository secrets:

| Secret | Value |
|--------|-------|
| `CRON_SECRET` | Same value as in Vercel |
| `VERCEL_DEPLOYMENT_URL` | `https://chikielau.com` (your production URL) |

The workflow runs monthly on the 1st at midnight UTC and can also be triggered manually via **Actions → Refresh Instagram Token → Run workflow**.

---

## 7. Custom Domain (Optional)

1. Vercel → Project Settings → Domains
2. Add your domain (e.g., `chikielau.com`)
3. Add the DNS records Vercel provides to your domain registrar:
   - `A` record → `76.76.21.21`
   - `CNAME` for `www` → `cname.vercel-dns.com`
4. Wait for DNS propagation (usually minutes, up to 48h)
5. Vercel auto-provisions SSL

---

## 8. Redeploy

After setting all environment variables:

1. Go to **Deployments** tab in Vercel
2. Click the **⋮** menu on the latest deployment
3. Click **Redeploy**

Or push any commit to trigger a new deployment.

---

## 9. Verify Everything Works

| Check | URL | Expected |
|-------|-----|----------|
| Homepage | `/` | Page loads with starfield background |
| Instagram feed | `/` (scroll down) | 6 Instagram posts appear |
| Contact form | `/contact` | Submit → success message |
| Health check | `/api/health` | `{"status":"ok"}` |
| Newsletter subscribe | Footer email form | Confirmation email sent |
| Admin panel | `/admin` | Login with `ADMIN_SECRET` |
| Newsletter archive | `/api/newsletter-archive` | JSON array of newsletters |

---

## Environment Variables Summary

```
# Core
GMAIL_USER=<email>@gmail.com
GMAIL_APP_PASSWORD=<16-char-app-password>
ADMIN_SECRET=<random-32-hex>
CRON_SECRET=<random-32-hex>

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://<your-db>.upstash.io
UPSTASH_REDIS_REST_TOKEN=<your-token>

# Instagram
INSTAGRAM_ACCESS_TOKEN=<long-lived-token>
INSTAGRAM_TOKEN_SECRET=<random-32-hex>

# Vercel API (for auto token refresh)
VERCEL_API_TOKEN=<tok_...>
VERCEL_PROJECT_ID=<prj_...>
VERCEL_TEAM_ID=<team_...>  # only if using a team

# Optional
BASE_URL=https://chikielau.com
```

---

## Troubleshooting

**Contact form not sending email**
- Verify `GMAIL_USER` and `GMAIL_APP_PASSWORD` are correct
- Ensure 2FA is enabled on the Gmail account
- Check Vercel function logs: Project → Logs → filter by `/api/contact`

**Instagram feed not loading**
- Check `INSTAGRAM_ACCESS_TOKEN` is a valid long-lived token
- Test directly: `/api/instagram` should return JSON with posts
- Token may have expired — trigger manual refresh: `POST /api/refresh-token` with `x-refresh-secret` header

**Admin panel returns 401**
- Verify `ADMIN_SECRET` matches what you're entering
- The admin panel uses this as the login password

**Redis errors / newsletter not working**
- Verify both `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set
- Test: `/api/health` should return `{"status":"ok"}`
- Check Upstash console to confirm the database is active

**Cron jobs not running**
- Vercel Cron requires a paid plan (Pro or higher) for custom schedules
- On the free Hobby plan, use the GitHub Actions workflow as the primary refresh method
- Check Vercel → Project → Settings → Cron Jobs to see execution history
