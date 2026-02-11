# Template 3: Moonlit Pages

## Overview

**Moonlit Pages** is a clean, single-column storytelling layout designed for the Chikielau bookstagrammer brand. This template emphasizes minimalist aesthetics with a warm neutral color palette, creating a serene and inviting reading experience. Perfect for content creators who want their words and book reviews to take center stage.

## Design Philosophy

Moonlit Pages embodies the essence of "cozy vintage library vibes meets celestial elegance" through:

- **Single-Column Layout**: Focuses attention on content without distractions
- **Warm Neutral Palette**: Soft beiges and taupes create a calming atmosphere
- **Sticky Minimalist Navigation**: Unobtrusive header that stays accessible
- **Book of the Month Feature**: Dedicated spotlight for monthly recommendations
- **Integrated Instagram Feed**: Seamlessly blends social content with blog posts
- **Storytelling Focus**: Typography and spacing optimized for long-form reading

## Color Palette

### Primary Colors
- **Gold Primary**: `#D4AF37` - Accent color for buttons, links, and highlights
- **Gold Light**: `#F4E4C1` - Hover states and subtle accents
- **Black Primary**: `#1A1A1A` - Primary text color
- **Black Secondary**: `#2C2C2C` - Secondary text and metadata

### Background Colors
- **Cream Primary**: `#FFF8E7` - Main background color
- **Cream Secondary**: `#F5F5DC` - Alternate background for cards and sections
- **Neutral Warm 1**: `#D7CCC8` - Header background and accents
- **Neutral Warm 2**: `#BCAAA4` - Footer background

### Usage Guidelines
- Use Black Primary for all body text to ensure readability
- Gold Primary should be used for interactive elements and accents only
- Maintain warm, neutral backgrounds throughout for consistency
- All color combinations meet WCAG 2.1 AA contrast requirements

## Typography

### Font Families

**Primary Font (Headings)**: Cormorant Garamond
- Elegant serif font for headings and titles
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Google Fonts: `Cormorant Garamond`

**Secondary Font (Body)**: Montserrat
- Clean sans-serif for body text and UI elements
- Weights: 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold)
- Google Fonts: `Montserrat`

### Font Sizes
- **Base**: 16px (body text)
- **Small**: 14px (metadata, captions)
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headings
- **H3**: 1.5rem (24px) - Subsection headings
- **H4**: 1.25rem (20px) - Card titles
- **H5**: 1.125rem (18px) - Small headings
- **H6**: 1rem (16px) - Smallest headings

### Google Fonts Link
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Template Features

### Six Essential Pages
1. **Homepage** (`index.html`) - Hero section, Book of the Month, blog feed with Instagram integration
2. **Blog Archive** (`blog.html`) - Single-column list of all blog posts
3. **Single Blog Post** (`blog-post.html`) - Full post with book review card and related posts
4. **About** (`about.html`) - Author bio, reading preferences, and social links
5. **Shop** (`shop.html`) - Book recommendations with affiliate links
6. **Contact** (`contact.html`) - Contact form and social media links

### Unique Template Features

#### Sticky Minimalist Header
- Header remains visible while scrolling
- Smooth transition when becoming sticky
- Maintains accessibility during scroll
- Optimized with `requestAnimationFrame` for performance

#### Book of the Month Section
- Prominent featured book display
- Badge indicator for special status
- Dual CTAs: "Read Full Review" and "Buy Now"
- Responsive layout (stacked on mobile, side-by-side on desktop)

#### Integrated Instagram Feed
- Instagram posts alternate with blog posts
- Placeholder areas for embed code
- Maintains single-column storytelling flow
- Easy to customize with your Instagram content

### Core Components

#### Newsletter Signup
- Footer form on every page
- Modal popup (appears after 5 seconds or 50% scroll)
- Dismissible with cookie to prevent repeated displays
- Compatible with Mailchimp and ConvertKit

#### Form Validation
- Real-time email validation
- Required field checking
- Clear error messages with ARIA support
- Success confirmation messages

#### Mobile Navigation
- Hamburger menu for mobile devices
- Smooth slide-in animation
- Keyboard accessible (ESC to close)
- Click-outside-to-close functionality

## Customization Guide

### Changing Colors

All colors are defined in `css/variables.css`. To customize:

1. Open `css/variables.css`
2. Locate the color variables under `/* Brand Colors */`
3. Replace hex values with your preferred colors
4. Save and refresh to see changes

Example:
```css
:root {
  --color-gold-primary: #D4AF37;  /* Change to your accent color */
  --color-cream-primary: #FFF8E7; /* Change to your background color */
}
```

**Important**: Ensure new colors maintain WCAG 2.1 AA contrast ratios (4.5:1 for normal text, 3:1 for large text). Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### Updating the Logo

1. Prepare your logo:
   - Recommended size: 200x200px
   - Format: PNG with transparent background or SVG
   - Optimize file size (< 50KB)

2. Replace logo files:
   - Save your logo as `assets/images/logo.svg` or `logo.png`
   - Update all references in HTML files if changing format

3. Adjust logo size (if needed):
   - Edit `.logo` class in `css/styles.css`
   - Modify `max-width` property

### Adding Blog Posts

#### Blog Archive Page (`blog.html`)

Add new post to the `.blog-list` section:

```html
<article class="blog-post-item">
  <div class="post-image">
    <a href="your-post.html">
      <img src="assets/images/placeholders/your-image.jpg" alt="Descriptive alt text" loading="lazy">
    </a>
  </div>
  <div class="post-content">
    <h2 class="post-title">
      <a href="your-post.html">Your Post Title</a>
    </h2>
    <p class="post-meta">
      <time datetime="2026-02-10">February 10, 2026</time>
    </p>
    <p class="post-excerpt">
      Your post excerpt goes here...
    </p>
    <a href="your-post.html" class="read-more">Read Full Review →</a>
  </div>
</article>
```

#### Creating New Blog Post Pages

1. Duplicate `blog-post.html`
2. Rename to your post slug (e.g., `my-book-review.html`)
3. Update the following:
   - Page title and meta description
   - Post title, date, and author
   - Featured image
   - Book information card
   - Post content
   - Related posts

### Modifying Navigation

Edit navigation in all HTML files (header section):

```html
<nav class="main-nav">
  <ul class="nav-list">
    <li><a href="index.html">Home</a></li>
    <li><a href="blog.html">Blog</a></li>
    <li><a href="about.html">About</a></li>
    <li><a href="shop.html">Shop</a></li>
    <li><a href="contact.html">Contact</a></li>
    <!-- Add new pages here -->
  </ul>
</nav>
```

**Important**: Update navigation on ALL pages to maintain consistency.

### Adding Book Recommendations (Shop Page)

Add new product card to `shop.html`:

```html
<div class="product-card">
  <div class="product-image">
    <img src="assets/images/placeholders/book-cover.jpg" alt="Book Title by Author">
  </div>
  <div class="product-info">
    <h3 class="product-title">Book Title</h3>
    <p class="product-author">by Author Name</p>
    <p class="product-description">
      Your recommendation and why you love this book...
    </p>
    <a href="YOUR-AFFILIATE-LINK" class="btn-cta" target="_blank" rel="noopener">Buy Now</a>
  </div>
</div>
```

## Hostinger Deployment

### Step 1: Prepare Files

1. Download/export all template files
2. Ensure all images are optimized
3. Test locally by opening `index.html` in a browser

### Step 2: Upload to Hostinger

1. Log in to Hostinger control panel
2. Navigate to **File Manager**
3. Go to `public_html` directory
4. Upload all template files:
   - All HTML files
   - `css/` folder
   - `js/` folder
   - `assets/` folder
   - `sitemap.xml`
   - `robots.txt`

### Step 3: Configure Domain

1. In Hostinger control panel, go to **Domains**
2. Point your domain to the `public_html` directory
3. Wait for DNS propagation (up to 24 hours)

### Step 4: Enable Performance Features

1. **LiteSpeed Cache**: Enable in control panel for faster loading
2. **Cloudflare CDN**: Optional, provides global content delivery
3. **SSL Certificate**: Enable free SSL for HTTPS

### Step 5: Test Your Site

1. Visit your domain
2. Test all pages and links
3. Verify forms work correctly
4. Check mobile responsiveness
5. Test on multiple browsers

## Newsletter Integration

### Mailchimp Integration

1. **Create Mailchimp Account**: Sign up at [mailchimp.com](https://mailchimp.com)

2. **Create Audience**: Set up your email list

3. **Get Embedded Form Code**:
   - Go to Audience → Signup forms → Embedded forms
   - Copy the form HTML code

4. **Update Template Forms**:
   - Locate newsletter forms in footer and modal
   - Replace `action="#"` with Mailchimp form action URL
   - Update form fields to match Mailchimp requirements

Example:
```html
<form class="newsletter-form" action="https://yoursite.us1.list-manage.com/subscribe/post?u=xxx&id=xxx" method="post">
  <input type="email" name="EMAIL" placeholder="Your email address" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

### ConvertKit Integration

1. **Create ConvertKit Account**: Sign up at [convertkit.com](https://convertkit.com)

2. **Create Form**:
   - Go to Forms → Create Form
   - Choose "Inline" form type
   - Customize design

3. **Get Embed Code**:
   - Click "Embed" button
   - Copy HTML embed code

4. **Update Template**:
   - Replace newsletter form HTML with ConvertKit embed code
   - Or use ConvertKit form action URL similar to Mailchimp

### Form Backend Services (Alternative)

If you prefer not to use Mailchimp/ConvertKit:

- **Formspree**: [formspree.io](https://formspree.io) - Simple form backend
- **Netlify Forms**: Free with Netlify hosting
- **Google Forms**: Free, but requires iframe embed
- **Custom PHP Script**: For advanced users with PHP hosting

## Instagram Feed Integration

### Option 1: SnapWidget (Recommended)

1. Visit [snapwidget.com](https://snapwidget.com)
2. Create free account
3. Choose "Instagram Feed" widget
4. Customize appearance to match template
5. Copy embed code
6. Paste into Instagram placeholder divs in `index.html`

### Option 2: Elfsight

1. Visit [elfsight.com](https://elfsight.com/instagram-feed-instashow/)
2. Create widget
3. Customize design
4. Copy embed code
5. Paste into template

### Option 3: Native Instagram Embed

1. Go to Instagram post you want to embed
2. Click "..." menu → "Embed"
3. Copy embed code
4. Paste into Instagram placeholder divs

### Manual Instagram Grid (No Third-Party Service)

Replace Instagram placeholder with manual grid:

```html
<div class="instagram-grid">
  <a href="https://instagram.com/p/YOUR-POST-ID" target="_blank" rel="noopener">
    <img src="assets/images/instagram/post-1.jpg" alt="Instagram post description">
  </a>
  <!-- Repeat for more posts -->
</div>
```

## Image Guidelines

### Recommended Dimensions

| Image Type | Dimensions | Format | Max Size |
|------------|------------|--------|----------|
| Logo | 200x200px | PNG/SVG | 50KB |
| Blog Featured | 1200x630px | JPEG | 200KB |
| Book Covers | 400x600px | JPEG | 150KB |
| Social Icons | Scalable | SVG | 10KB |
| Hero Images | 1920x1080px | JPEG | 300KB |
| Author Photo | 500x500px | JPEG | 100KB |

### Image Optimization Tools

- **TinyPNG**: [tinypng.com](https://tinypng.com) - Compress PNG and JPEG
- **Squoosh**: [squoosh.app](https://squoosh.app) - Advanced compression
- **SVGOMG**: [jakearchibald.github.io/svgomg](https://jakearchibald.github.io/svgomg/) - Optimize SVG

### Adding Images

1. Optimize image using tools above
2. Upload to appropriate folder in `assets/images/`
3. Update HTML `src` attribute with relative path
4. Add descriptive `alt` text for accessibility
5. Add `loading="lazy"` for images below the fold

## Affiliate Link Management

### Adding Affiliate Links

1. **Sign up for affiliate programs**:
   - Amazon Associates
   - Bookshop.org
   - Barnes & Noble Affiliate Program

2. **Generate affiliate links** for books you recommend

3. **Add to shop page**:
   - Replace `href="https://example.com/affiliate-link"` with your actual affiliate link
   - Keep `target="_blank"` and `rel="noopener"` attributes

4. **Disclosure**: Update shop page note with your affiliate disclosure

Example:
```html
<a href="https://amazon.com/dp/PRODUCT-ID?tag=YOUR-AFFILIATE-TAG" class="btn-cta" target="_blank" rel="noopener">
  Buy Now
</a>
```

### Affiliate Disclosure

The template includes a disclosure note on the shop page. Customize it:

```html
<div class="shop-note">
  <p>
    <strong>Note:</strong> As an Amazon Associate and affiliate partner, I earn from qualifying purchases. 
    These recommendations are books I genuinely love and believe you'll enjoy too. Your support through 
    these links helps me continue sharing book reviews and recommendations.
  </p>
</div>
```

## Form Backend Integration

### Contact Form Setup

The template includes client-side validation, but you need a backend to receive submissions.

#### Option 1: Formspree (Easiest)

1. Sign up at [formspree.io](https://formspree.io)
2. Create new form
3. Copy form endpoint URL
4. Update contact form action:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR-FORM-ID" method="post">
```

#### Option 2: Hostinger Email

1. Set up email account in Hostinger
2. Create PHP script to send emails
3. Update form action to point to PHP script

#### Option 3: Google Forms

1. Create Google Form
2. Get form action URL
3. Update template form (requires field name matching)

## Browser Compatibility

### Supported Browsers

- ✅ Chrome (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Edge (latest 2 versions)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Known Issues

- Internet Explorer 11: Not supported (uses modern CSS features)
- Older browsers: May not support CSS Grid, use Flexbox fallback

## Accessibility Features

This template is WCAG 2.1 AA compliant:

- ✅ All images have descriptive alt text
- ✅ Proper heading hierarchy (single H1, sequential levels)
- ✅ Keyboard navigation support
- ✅ Focus indicators on all interactive elements
- ✅ Skip to content link for keyboard users
- ✅ ARIA labels for icon buttons and modals
- ✅ Form labels associated with inputs
- ✅ Color contrast ratios meet AA standards
- ✅ Responsive design with touch-friendly targets
- ✅ Reduced motion support for accessibility

## Performance Optimization

### Built-in Optimizations

- Lazy loading for below-the-fold images
- Minimal JavaScript (vanilla, no frameworks)
- Mobile-first CSS approach
- Efficient event handling with delegation
- RequestAnimationFrame for smooth scrolling
- Passive event listeners for better performance

### Additional Recommendations

1. **Enable Gzip compression** on your server
2. **Use Hostinger LiteSpeed Cache** for automatic caching
3. **Optimize all images** before uploading
4. **Enable Cloudflare CDN** for global delivery
5. **Minify CSS and JavaScript** for production (optional)

See `PERFORMANCE-NOTES.md` for detailed optimization guide.

## Troubleshooting

### Forms Not Submitting

- Check form `action` attribute points to valid backend
- Verify email validation is working
- Check browser console for JavaScript errors
- Ensure required fields are filled

### Images Not Loading

- Verify image paths are correct (relative paths)
- Check file names match exactly (case-sensitive)
- Ensure images are in correct folders
- Verify image files were uploaded to server

### Mobile Menu Not Working

- Check JavaScript file is loaded
- Verify no JavaScript errors in console
- Ensure `nav-toggle` button has correct class
- Test in different browsers

### Sticky Header Issues

- Check CSS for `.sticky` class
- Verify JavaScript `initStickyHeader()` is running
- Test scroll behavior in different browsers
- Adjust `stickyHeaderOffset` in `js/script.js` if needed

### Newsletter Modal Not Appearing

- Check if cookie was set (prevents repeated displays)
- Clear browser cookies and test again
- Verify modal HTML is present in page
- Check JavaScript console for errors

## Support and Resources

### Documentation

- **ACCESSIBILITY-AUDIT.md**: Detailed accessibility compliance report
- **PERFORMANCE-NOTES.md**: Performance optimization guide
- **sitemap.xml**: SEO sitemap for search engines
- **robots.txt**: Search engine crawler instructions

### External Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Google Fonts](https://fonts.google.com/)
- [Hostinger Knowledge Base](https://support.hostinger.com/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Testing Tools

- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [W3C HTML Validator](https://validator.w3.org/)
- [WAVE Accessibility Tool](https://wave.webaim.org/)
- [GTmetrix](https://gtmetrix.com/)

## License

This template is part of the Chikielau Website Templates collection. All rights reserved.

## Credits

- **Design**: Chikielau Brand
- **Fonts**: Google Fonts (Cormorant Garamond, Montserrat)
- **Icons**: Custom SVG icons

---

**Template Version**: 1.0.0  
**Last Updated**: February 10, 2026  
**Template**: Moonlit Pages (Template 3)

For questions or support, please visit the contact page or reach out through social media.
