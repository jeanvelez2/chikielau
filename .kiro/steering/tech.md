# Tech Stack

## Core Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Hosting**: Vercel (serverless platform)
- **Backend**: Vercel Serverless Functions (Node.js, ESM `export default`)
- **APIs**: Instagram Basic Display API
- **Automation**: GitHub Actions (monthly token refresh backup)
- **Email**: Gmail SMTP via nodemailer

## Dependencies

- `nodemailer` (^6.9.7) - Email handling for contact form
- No frontend frameworks or build tools — plain HTML/CSS/JS served statically

## Vercel Configuration (`vercel.json`)

- Serverless functions in `/api` directory
- Instagram API function: 1024MB memory, 10s max duration
- CORS headers: `Access-Control-Allow-Origin: *` on `/api/*`
- Cron job: `0 0 1 * *` (1st of each month at midnight UTC) → `/api/cron-refresh`

## Environment Variables

### Vercel
- `INSTAGRAM_ACCESS_TOKEN` - Instagram API long-lived token
- `CRON_SECRET` - Bearer token for cron endpoint auth
- `VERCEL_API_TOKEN` - For automated env var updates
- `VERCEL_PROJECT_ID` - Project identifier
- `VERCEL_TEAM_ID` - Team identifier (optional)
- `GMAIL_USER` - Gmail address for contact form
- `GMAIL_APP_PASSWORD` - Gmail app password (16-char)
- `INSTAGRAM_TOKEN_SECRET` - Secret for manual refresh endpoint

### GitHub Secrets
- `CRON_SECRET` - Must match Vercel value
- `VERCEL_DEPLOYMENT_URL` - Production URL (e.g., `https://chikielau.com`)

## API Endpoints

| Endpoint | Method | Purpose | Auth |
|---|---|---|---|
| `/api/instagram` | GET | Fetch Instagram posts (default 6, max 25) | None |
| `/api/contact` | POST | Submit contact form → Gmail SMTP | None |
| `/api/cron-refresh` | GET/POST | Auto token refresh (Vercel Cron + GitHub Actions) | `Authorization: Bearer {CRON_SECRET}` |
| `/api/refresh-token` | POST | Manual token refresh | `x-refresh-secret` header |

## Common Commands

```bash
# Local development
npm i -g vercel
vercel dev          # http://localhost:3000

# Deploy
vercel --prod       # or push to main for auto-deploy
```

## Performance

- Client-side localStorage caching (1 hour for Instagram feed)
- CDN delivery via Vercel Edge Network
- `Cache-Control: s-maxage=3600, stale-while-revalidate` on Instagram API
- Lazy loading for images (`loading="lazy"`)
- No build step — zero bundle overhead
