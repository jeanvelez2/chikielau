# Instagram Auto-Refresh with GitHub Actions

This guide shows you how to set up automatic Instagram token refresh using GitHub Actions (completely free!).

## Why GitHub Actions?

- ✅ Completely free (no Vercel Pro plan needed)
- ✅ Runs automatically every month
- ✅ Easy to monitor and trigger manually
- ✅ Works with any Vercel plan

## Prerequisites

- GitHub repository for your website
- Vercel account (any plan, including free Hobby)
- Instagram Basic Display API set up (see INSTAGRAM_SETUP.md)

## Quick Setup (5 Steps)

### Step 1: Get Your Long-Lived Instagram Token

Follow steps 1-4 from `INSTAGRAM_SETUP.md` to get your long-lived Instagram access token.

**Quick version:**
1. Create Facebook App
2. Add Instagram Basic Display
3. Generate token
4. Exchange for long-lived token using this URL:

```
https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={APP_SECRET}&access_token={SHORT_LIVED_TOKEN}
```

### Step 2: Get Vercel API Credentials

#### 2a. Get Vercel API Token
1. Go to [Vercel Account Settings → Tokens](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name: "Instagram Token Refresh"
4. Scope: "Full Account"
5. Click "Create" and copy the token

#### 2b. Get Project ID
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Login and get project ID
vercel login
vercel project ls
```

Or find it in Vercel Dashboard → Your Project → Settings → General

#### 2c. Get Team ID (if applicable)
Only needed if you're on a Vercel team. Find it in:
- Vercel Dashboard → Team Settings → General → Team ID

### Step 3: Configure Vercel Environment Variables

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables (select all environments: Production, Preview, Development):

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `INSTAGRAM_ACCESS_TOKEN` | Your long-lived token | Step 1 |
| `CRON_SECRET` | Random string (e.g., `openssl rand -base64 32`) | Generate a secure random string |
| `VERCEL_API_TOKEN` | Your Vercel API token | Step 2a |
| `VERCEL_PROJECT_ID` | Your project ID | Step 2b |
| `VERCEL_TEAM_ID` | Your team ID (optional) | Step 2c (only if on a team) |

**Generate CRON_SECRET:**
```bash
# Mac/Linux
openssl rand -base64 32

# Or use: https://www.random.org/strings/
```

### Step 4: Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `CRON_SECRET` | Same value as in Vercel | Must match Vercel env var |
| `VERCEL_DEPLOYMENT_URL` | `https://yourdomain.com` | Your production URL |

**Important:** `CRON_SECRET` must be identical in both Vercel and GitHub!

### Step 5: Deploy and Test

#### 5a. Push to GitHub
```bash
git add .
git commit -m "Add Instagram auto-refresh with GitHub Actions"
git push
```

#### 5b. Deploy to Vercel
```bash
vercel --prod
```

#### 5c. Test the Workflow
1. Go to your GitHub repository
2. Click "Actions" tab
3. Click "Refresh Instagram Token" workflow
4. Click "Run workflow" → "Run workflow"
5. Wait for it to complete (should show green checkmark)

## How It Works

1. **GitHub Actions** runs the workflow on the 1st of every month at midnight UTC
2. The workflow calls your `/api/cron-refresh` endpoint
3. The endpoint:
   - Refreshes your Instagram token (extends by 60 days)
   - Updates the `INSTAGRAM_ACCESS_TOKEN` in Vercel automatically
4. Your Instagram feed continues working seamlessly

## Monitoring

### Check Workflow Status
- Go to GitHub → Actions tab
- See all past runs and their status
- Green checkmark = success
- Red X = failure (you'll get notified)

### Check Vercel Logs
- Go to Vercel Dashboard → Your Project → Logs
- Filter by "cron-refresh"
- See detailed execution logs

### Manual Trigger
If you need to refresh before the scheduled time:
1. Go to GitHub → Actions
2. Click "Refresh Instagram Token"
3. Click "Run workflow"
4. Click "Run workflow" button

## Troubleshooting

### Workflow fails with 401 Unauthorized
- Check that `CRON_SECRET` matches in both GitHub and Vercel
- Verify it's set in all Vercel environments

### Workflow fails with 500 error
- Check Vercel logs for detailed error
- Verify all environment variables are set correctly
- Ensure `VERCEL_API_TOKEN` has correct permissions

### Token not updating
- Verify `VERCEL_PROJECT_ID` is correct
- Check that `VERCEL_API_TOKEN` has "Full Account" scope
- If on a team, ensure `VERCEL_TEAM_ID` is set

### Workflow doesn't run automatically
- GitHub Actions cron can have delays (up to 15 minutes)
- Check the "Actions" tab for any errors
- Try running manually to verify it works

### Instagram posts not loading
- Check browser console for errors
- Verify token is valid: visit `/api/instagram` directly
- Check Vercel logs for API errors

## Schedule Customization

Edit `.github/workflows/refresh-instagram-token.yml` to change when it runs:

```yaml
schedule:
  - cron: '0 0 15 * *'  # 15th of every month at midnight UTC
  - cron: '0 0 1,15 * *'  # 1st and 15th of every month
  - cron: '0 0 * * 0'  # Every Sunday at midnight
```

[Cron syntax reference](https://crontab.guru/)

## Cost

**Completely free!**
- GitHub Actions: 2,000 minutes/month free (this uses ~1 minute/month)
- Vercel Hobby plan: Free
- Instagram API: Free

## Security Best Practices

✅ Never commit secrets to Git
✅ Use GitHub Secrets for sensitive data
✅ Use Vercel Environment Variables for API tokens
✅ `CRON_SECRET` protects your refresh endpoint
✅ Tokens are only accessible server-side

## Backup: Manual Refresh

If GitHub Actions fails, you can manually refresh:

```bash
# Using curl
curl -X POST https://yourdomain.com/api/cron-refresh \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

Or use the manual refresh endpoint:

```bash
curl -X POST https://yourdomain.com/api/refresh-token \
  -H "x-refresh-secret: YOUR_CRON_SECRET" \
  -H "Content-Type: application/json"
```

This returns the new token. Update `INSTAGRAM_ACCESS_TOKEN` in Vercel manually.

## Next Steps

1. ✅ Set up is complete!
2. 📅 Token will refresh automatically on the 1st of every month
3. 📊 Monitor via GitHub Actions tab
4. 🎉 Your Instagram feed stays live forever

## Support

- GitHub Actions issues: Check the Actions tab for error logs
- Vercel issues: Check Vercel logs
- Instagram API issues: [Instagram Basic Display Docs](https://developers.facebook.com/docs/instagram-basic-display-api)

## FAQ

**Q: Do I need Vercel Pro?**
A: No! This works with the free Hobby plan.

**Q: How often does it run?**
A: Once per month on the 1st at midnight UTC. You can customize this.

**Q: Can I test it before the scheduled time?**
A: Yes! Use the "Run workflow" button in GitHub Actions.

**Q: What if it fails?**
A: You'll see a red X in GitHub Actions. Check the logs and run manually if needed.

**Q: Is this secure?**
A: Yes! All secrets are encrypted in GitHub and Vercel. The endpoint is protected by `CRON_SECRET`.

**Q: Can I use this with other hosting providers?**
A: Yes! Just adjust the API endpoint URL and environment variable management.
