# Chikielau - Celestial Book Reviews Website

A beautiful, dark-themed book review website with Instagram integration and automatic token refresh.

## Features

- 📚 Book reviews with star ratings
- 📸 Live Instagram feed integration
- 🔄 Automatic Instagram token refresh (no manual updates!)
- 📱 Fully responsive design
- ⭐ Starfield animated background
- 📧 Newsletter signup
- 🎨 Dark celestial aesthetic

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- Vercel Serverless Functions
- Instagram Basic Display API
- GitHub Actions for automation

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd chikielau-website
```

### 2. Set Up Instagram Feed

Follow the detailed guide in `GITHUB_ACTIONS_SETUP.md` for automatic token refresh (recommended).

Or see `INSTAGRAM_SETUP.md` for manual setup.

**Quick summary:**
1. Create Facebook App with Instagram Basic Display
2. Get long-lived access token
3. Configure Vercel environment variables
4. Set up GitHub Secrets
5. Deploy!

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 4. Configure Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

- `INSTAGRAM_ACCESS_TOKEN` - Your Instagram token
- `CRON_SECRET` - Random secure string
- `VERCEL_API_TOKEN` - Vercel API token
- `VERCEL_PROJECT_ID` - Your project ID
- `VERCEL_TEAM_ID` - Team ID (if applicable)

### 5. Set Up GitHub Secrets

In GitHub → Settings → Secrets, add:

- `CRON_SECRET` - Same as Vercel
- `VERCEL_DEPLOYMENT_URL` - Your production URL

## Project Structure

```
.
├── api/
│   ├── instagram.js          # Fetch Instagram posts
│   ├── cron-refresh.js        # Auto token refresh
│   └── refresh-token.js       # Manual token refresh
├── assets/
│   ├── images/                # Images and placeholders
│   └── fonts/                 # Custom fonts
├── css/
│   ├── styles.css             # Main styles
│   └── variables.css          # CSS variables
├── js/
│   ├── script.js              # Main JavaScript
│   └── instagram.js           # Instagram feed client
├── .github/
│   └── workflows/
│       └── refresh-instagram-token.yml  # GitHub Actions
├── index.html                 # Homepage
├── blog.html                  # Blog (coming soon)
├── shop.html                  # Shop (coming soon)
├── about.html                 # About page
├── contact.html               # Contact page
├── vercel.json                # Vercel configuration
└── README.md                  # This file
```

## Instagram Integration

The Instagram feed automatically:
- Fetches your latest 6 posts
- Caches results for 1 hour
- Refreshes token every 30 days via GitHub Actions
- Updates Vercel environment variables automatically

**No manual maintenance required!**

## Customization

### Change Instagram Post Count

Edit `index.html`:
```javascript
window.instagramFeed = new InstagramFeed('instagram-feed', {
  limit: 12  // Change from 6 to any number (max 25)
});
```

### Modify Colors

Edit `css/variables.css`:
```css
--color-gold: #D4AF37;
--color-background: #1A1A1A;
/* etc. */
```

### Update Social Links

Edit the footer in any HTML file:
```html
<a href="https://instagram.com/yourusername">...</a>
```

## Development

### Local Development

```bash
# Install Vercel CLI for local API testing
npm i -g vercel

# Create .env file
cp .env.example .env
# Add your tokens to .env

# Run local dev server
vercel dev
```

### Testing Instagram Feed Locally

1. Add `INSTAGRAM_ACCESS_TOKEN` to `.env`
2. Run `vercel dev`
3. Visit `http://localhost:3000`

## Deployment

### Automatic Deployment (Recommended)

Connect your GitHub repo to Vercel:
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables
5. Deploy!

Every push to `main` branch auto-deploys.

### Manual Deployment

```bash
vercel --prod
```

## Monitoring

### GitHub Actions
- Go to GitHub → Actions tab
- See token refresh status
- Manually trigger if needed

### Vercel Logs
- Go to Vercel Dashboard → Logs
- Filter by function name
- See real-time execution

## Troubleshooting

### Instagram feed not loading
1. Check browser console for errors
2. Verify `INSTAGRAM_ACCESS_TOKEN` is set in Vercel
3. Check `/api/instagram` endpoint directly
4. Review Vercel function logs

### Token refresh failing
1. Check GitHub Actions logs
2. Verify `CRON_SECRET` matches in GitHub and Vercel
3. Ensure `VERCEL_API_TOKEN` has correct permissions
4. Check Vercel function logs

### Newsletter not working
The newsletter form is currently a placeholder. To make it functional:
1. Set up a service like Mailchimp, ConvertKit, or SendGrid
2. Update form action in HTML files
3. Add backend endpoint to handle submissions

## Security

- ✅ All secrets in environment variables
- ✅ `.env` file in `.gitignore`
- ✅ API endpoints protected by secrets
- ✅ No sensitive data in client-side code
- ✅ CORS configured properly

## Performance

- ⚡ Serverless functions for API calls
- 💾 Client-side caching (1 hour)
- 🖼️ Lazy loading images
- 📦 Minimal dependencies
- 🚀 CDN delivery via Vercel

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## License

All rights reserved © 2026 Chikielau

## Support

For issues or questions:
1. Check `GITHUB_ACTIONS_SETUP.md` for Instagram setup
2. Review Vercel and GitHub Actions logs
3. Check browser console for client-side errors

## Roadmap

- [ ] Blog post functionality
- [ ] Shop integration
- [ ] Newsletter backend integration
- [ ] Search functionality
- [ ] Dark/light mode toggle
- [ ] Reading progress tracker

## Credits

- Design: Custom celestial theme
- Icons: Custom SVG icons
- Fonts: Google Fonts (Playfair Display, Lato)
- Hosting: Vercel
- Automation: GitHub Actions
