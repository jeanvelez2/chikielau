# Tech Stack

## Core Technologies

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (no frameworks)
- **Hosting**: Vercel (serverless platform)
- **Backend**: Vercel Serverless Functions (Node.js)
- **APIs**: Instagram Basic Display API
- **Automation**: GitHub Actions

## Dependencies

- `nodemailer` (^6.9.7) - Email handling for contact form

## Project Configuration

### Vercel Configuration (`vercel.json`)

- Serverless functions in `/api` directory
- Instagram API function: 1024MB memory, 10s max duration
- CORS headers configured for API endpoints
- Cron job: Monthly token refresh (1st of each month at midnight)

### Environment Variables

Required in Vercel:
- `INSTAGRAM_ACCESS_TOKEN` - Instagram API token
- `CRON_SECRET` - Security token for cron endpoints
- `VERCEL_API_TOKEN` - For automated token updates
- `VERCEL_PROJECT_ID` - Project identifier
- `VERCEL_TEAM_ID` - Team identifier (if applicable)

Required in GitHub Secrets:
- `CRON_SECRET` - Must match Vercel value
- `VERCEL_DEPLOYMENT_URL` - Production URL

## Common Commands

### Development

```bash
# Install Vercel CLI
npm i -g vercel

# Run local development server
vercel dev

# Access local site
# http://localhost:3000
```

### Deployment

```bash
# Deploy to production
vercel --prod

# Automatic deployment via GitHub
# Push to main branch triggers auto-deploy
```

### Testing

```bash
# Test Instagram API endpoint locally
# GET http://localhost:3000/api/instagram

# Test with custom limit
# GET http://localhost:3000/api/instagram?limit=12

# Test contact form
# POST http://localhost:3000/api/contact
```

## API Endpoints

- `/api/instagram` - Fetch Instagram posts (GET)
- `/api/contact` - Submit contact form (POST)
- `/api/cron-refresh` - Monthly token refresh (GET, cron-triggered)
- `/api/refresh-token` - Manual token refresh (GET)

## Performance Features

- Client-side caching (1 hour for Instagram feed)
- CDN delivery via Vercel
- Serverless functions for API calls
- Lazy loading for images
- Minimal dependencies
