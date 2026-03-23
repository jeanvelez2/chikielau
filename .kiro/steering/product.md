# Product Overview

Chikielau is a bilingual (EN/ES) dark-themed book review website with a celestial aesthetic, hosted at chikielau.com. The site features book reviews with star ratings, a live Instagram feed integration, newsletter signup, and a contact form.

## Core Features

- Book reviews with 5-star rating system across fiction, fantasy, historical fiction, and sci-fi
- Live Instagram feed (6 posts default, configurable up to 25) with client-side caching (1 hour)
- Automatic Instagram token refresh via Vercel Cron (monthly) + GitHub Actions backup
- Newsletter signup (footer form + timed/scroll-triggered modal)
- Contact form with Gmail SMTP email delivery via nodemailer
- Bilingual support (English/Spanish) with `data-i18n` attributes and localStorage persistence
- Animated starfield background
- SEO: Open Graph meta tags, Schema.org JSON-LD structured data

## Brand Identity

- Dark celestial theme with gold accents
- Typography: Playfair Display (headings), Lato (body) via Google Fonts
- Color palette:
  - Backgrounds: #1A1A1A (primary), #2C2C2C (secondary)
  - Accent: #D4AF37 (gold)
  - Text: #FFF8E7 (cream primary), #D7CCC8 (secondary), #BCAAA4 (muted)
  - Gold light: #F4E4C1, Cream secondary: #F5F5DC

## Pages

- `index.html` — Homepage: hero, featured reviews, Instagram feed, newsletter modal
- `blog.html` / `blog-full.html` — Blog listing (coming soon)
- `blog-post.html` — Individual blog post template
- `shop.html` / `shop-full.html` — Shop listing (coming soon)
- `about.html` — Bio, reading stats, favorite genres
- `contact.html` — Contact form
- `newsletter.html` — Newsletter page

## Social Presence

- Instagram: @chikielau
- TikTok: @chikielau
- Goodreads: chikielau
