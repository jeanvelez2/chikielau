# Instagram Feed Setup Guide

This guide will help you set up the Instagram Basic Display API integration with **automatic token refresh** for your Vercel-hosted website. Once configured, your Instagram feed will stay live indefinitely without manual intervention.

## Prerequisites

- A Facebook Developer account
- An Instagram account (must be a Creator or Business account for API access)
- A Vercel account for deployment

## Step 1: Create a Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click "My Apps" → "Create App"
3. Select "Consumer" as the app type
4. Fill in the app details:
   - App Name: "Chikielau Website" (or your preferred name)
   - App Contact Email: Your email
5. Click "Create App"

## Step 2: Add Instagram Basic Display

1. In your app dashboard, click "Add Product"
2. Find "Instagram Basic Display" and click "Set Up"
3. Scroll down to "User Token Generator"
4. Click "Add or Remove Instagram Testers"
5. Add your Instagram account as a tester
6. Go to your Instagram account settings → Apps and Websites → Tester Invites
7. Accept the tester invite

## Step 3: Configure Instagram Basic Display

1. Back in the Facebook App dashboard, go to Instagram Basic Display → Basic Display
2. Fill in the required fields:
   - **Valid OAuth Redirect URIs**: `https://yourdomain.com/` (replace with your actual domain)
   - **Deauthorize Callback URL**: `https://yourdomain.com/`
   - **Data Deletion Request URL**: `https://yourdomain.com/`
3. Click "Save Changes"

## Step 4: Generate Long-Lived Access Token

### 4a. Generate Initial Token

1. In Instagram Basic Display settings, scroll to "User Token Generator"
2. Click "Generate Token" next to your Instagram account
3. Authorize the app when prompted
4. Copy the generated access token (short-lived, 1 hour)

### 4b. Exchange for Long-Lived Token

Open your browser and visit this URL (replace `{SHORT_LIVED_TOKEN}` with your token from 4a, and `{APP_ID}` and `{APP_SECRET}` from your Facebook App dashboard):

```
https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={APP_SECRET}&access_token={SHORT_LIVED_TOKEN}
```

You'll get a response like:
```json
{
  "access_token": "LONG_LIVED_TOKEN_HERE",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

Copy the `access_token` value - this is your long-lived token (valid for 60 days).

## Step 5: Get Vercel API Token

1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "Instagram Token Refresh"
4. Set scope to "Full Account"
5. Click "Create" and copy the token

## Step 6: Get Your Vercel Project ID

### Option A: Via Dashboard
1. Go to your project on Vercel
2. Go to Settings → General
3. Copy the "Project ID"

### Option B: Via CLI
```bash
vercel project ls
```

## Step 7: Configure Vercel Environment Variables

Go to your project on Vercel → Settings → Environment Variables and add:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `INSTAGRAM_ACCESS_TOKEN` | Your long-lived token from Step 4b | Instagram API access |
| `CRON_SECRET` | Generate a random string (e.g., use a password generator) | Protects cron endpoint |
| `VERCEL_API_TOKEN` | Token from Step 5 | Allows automatic env var updates |
| `VERCEL_PROJECT_ID` | Project ID from Step 6 | Your Vercel project |
| `VERCEL_TEAM_ID` | Your team ID (if using a team) | Optional, only if on a team |

**Important**: Select all environments (Production, Preview, Development) for each variable.

### Generate Random Secrets

For `CRON_SECRET`, use a strong random string. You can generate one with:

```bash
# On Mac/Linux
openssl rand -base64 32

# Or use an online generator
# https://www.random.org/strings/
```

## Step 8: Enable Vercel Cron Jobs

Vercel Cron is included in the `vercel.json` configuration. The cron job runs on the 1st of every month at midnight UTC to refresh your token automatically.

**Note**: Vercel Cron Jobs require a Pro plan or higher. If you're on the Hobby plan, see "Alternative: Manual Refresh" below.

## Step 9: Deploy to Vercel

```bash
# If first time deploying
vercel

# For subsequent deployments
vercel --prod
```

## Step 10: Verify Setup

1. Visit your deployed website
2. Check the "Follow My Reading Journey" section
3. Your latest Instagram posts should appear
4. The token will automatically refresh every 30 days

## How Automatic Refresh Works

1. **Vercel Cron** triggers `/api/cron-refresh` on the 1st of every month
2. The function refreshes your Instagram token (extends it by 60 days)
3. It automatically updates the `INSTAGRAM_ACCESS_TOKEN` environment variable in Vercel
4. Your site continues working without any manual intervention

## Alternative: Manual Refresh (Free Tier)

If you're on Vercel's free Hobby plan (which doesn't include Cron Jobs), you can manually refresh the token every 30 days:

### Option 1: Manual API Call

Every 30 days, make a POST request to your refresh endpoint:

```bash
curl -X POST https://yourdomain.com/api/refresh-token \
  -H "x-refresh-secret: YOUR_INSTAGRAM_TOKEN_SECRET" \
  -H "Content-Type: application/json"
```

This will return a new token. Update `INSTAGRAM_ACCESS_TOKEN` in Vercel dashboard.

### Option 2: External Cron Service

Use a free service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com/):

1. Create an account
2. Set up a monthly job to call: `https://yourdomain.com/api/cron-refresh`
3. Add header: `Authorization: Bearer YOUR_CRON_SECRET`
4. Schedule for monthly execution

### Option 3: GitHub Actions (Recommended for Free Tier)

Create `.github/workflows/refresh-instagram-token.yml`:

```yaml
name: Refresh Instagram Token

on:
  schedule:
    # Runs on the 1st of every month at 00:00 UTC
    - cron: '0 0 1 * *'
  workflow_dispatch: # Allows manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Refresh Instagram Token
        run: |
          curl -X POST https://yourdomain.com/api/cron-refresh \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

Add `CRON_SECRET` to your GitHub repository secrets.

## Troubleshooting

### "Instagram API not configured" error
- Make sure you've added the `INSTAGRAM_ACCESS_TOKEN` environment variable in Vercel
- Redeploy your site after adding the variable

### "Access token expired" error
- Your token has expired
- If auto-refresh is set up, check the cron job logs in Vercel
- If manual refresh, generate a new token following Step 4

### Cron job not running
- Verify you're on Vercel Pro plan or higher
- Check Vercel logs for cron execution
- Verify `CRON_SECRET` matches in both vercel.json and environment variables

### Token refresh fails
- Verify `VERCEL_API_TOKEN` has correct permissions
- Check `VERCEL_PROJECT_ID` is correct
- Ensure `INSTAGRAM_ACCESS_TOKEN` is a long-lived token (not short-lived)

### Posts not loading
- Check the browser console for errors
- Verify your Instagram account is public or you're using a Business/Creator account
- Make sure you have at least one post on your Instagram account

## Monitoring

To check if your token refresh is working:

1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by "cron-refresh"
3. You should see successful executions on the 1st of each month

## Security Notes

- Never commit tokens or secrets to Git
- Always use environment variables for sensitive data
- The `.env` file is already in `.gitignore`
- Tokens are only accessible server-side in API routes
- Client-side code never sees your access token
- The cron endpoint is protected by `CRON_SECRET`

## API Endpoints

Your site has three Instagram-related endpoints:

1. **`/api/instagram`** - Fetches Instagram posts (public)
2. **`/api/refresh-token`** - Manual token refresh (protected)
3. **`/api/cron-refresh`** - Automatic token refresh (protected, called by cron)

## Customization

### Change number of posts displayed

Edit `index.html` and modify the Instagram initialization:
```javascript
window.instagramFeed = new InstagramFeed('instagram-feed', {
  limit: 12  // Change from 6 to any number up to 25
});
```

### Adjust cache duration

Edit `js/instagram.js` and modify the options:
```javascript
cacheDuration: 7200000  // 2 hours in milliseconds (default is 1 hour)
```

### Change cron schedule

Edit `vercel.json` to change when the token refreshes:
```json
"schedule": "0 0 15 * *"  // 15th of every month at midnight UTC
```

## Support

For issues with:
- Instagram API: [Instagram Basic Display Documentation](https://developers.facebook.com/docs/instagram-basic-display-api)
- Vercel deployment: [Vercel Documentation](https://vercel.com/docs)
- Vercel Cron: [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- This implementation: Check browser console and Vercel logs for error messages

