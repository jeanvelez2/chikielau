# Template 2: Celestial Bookshelf

## Description

**Celestial Bookshelf** is a bold, asymmetric website template designed for bookstagrammers and literary content creators who want to make a dramatic statement. This template embraces a dark celestial aesthetic with deep black backgrounds, striking gold accents, and an artistic, unconventional layout that breaks away from traditional design patterns.

Perfect for creators who want their book reviews and recommendations to stand out with a sophisticated, gallery-like presentation that feels both modern and timeless.

## Design Philosophy

### Asymmetric & Artistic
Unlike traditional grid-based layouts, Celestial Bookshelf uses asymmetric compositions, split-screen designs, and unexpected element placement to create visual interest and guide the eye through content in a dynamic way.

### Dark Celestial Theme
The dramatic dark color palette creates an intimate, cozy atmosphere reminiscent of reading by candlelight under the stars. Deep blacks provide a sophisticated backdrop that makes book covers and gold accents pop with intensity.

### Bold Typography
Large, confident typography paired with elegant serif headings creates a strong visual hierarchy. The contrast between delicate script elements and bold sans-serif body text reinforces the celestial elegance meets modern edge aesthetic.

### Star Rating System
A unique celestial-themed star rating system integrates seamlessly with the brand identity, using gold stars that match the logo's moon and star motif.

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Black Primary | `#1A1A1A` | Main background, primary surfaces |
| Black Secondary | `#2C2C2C` | Secondary backgrounds, cards |
| Black Tertiary | `#3A3A3A` | Hover states, borders |
| Gold Primary | `#D4AF37` | Accent color, CTAs, highlights |
| Gold Light | `#F4E4C1` | Subtle gold accents, hover effects |
| Gold Dark | `#B8941F` | Active states, pressed buttons |

### Supporting Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| Cream Primary | `#FFF8E7` | Primary text color, headings |
| Cream Secondary | `#F5F5DC` | Secondary text, subtle highlights |
| Neutral Warm 1 | `#D7CCC8` | Muted text, metadata |
| Neutral Warm 2 | `#BCAAA4` | Placeholder text, disabled states |

### Semantic Colors

- **Text Primary**: `#FFF8E7` (Cream) - Main body text
- **Text Secondary**: `#D7CCC8` - Dates, metadata, captions
- **Accent**: `#D4AF37` (Gold) - Links, buttons, highlights
- **Error**: `#E57373` - Form validation errors
- **Success**: `#81C784` - Success messages

## Typography

### Font Pairings

**Headings**: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (Serif)
- Elegant, high-contrast serif font
- Weights used: 400 (Regular), 600 (Semi-Bold), 700 (Bold)
- Perfect for dramatic headlines and book titles

**Body Text**: [Lato](https://fonts.google.com/specimen/Lato) (Sans-Serif)
- Clean, modern sans-serif with excellent readability
- Weights used: 300 (Light), 400 (Regular), 700 (Bold)
- Ideal for long-form content and descriptions

### Font Sizes

**Mobile (Base)**:
- Body text: 16px
- H1: 32px
- H2: 28px
- H3: 24px
- H4: 20px

**Desktop (768px+)**:
- Body text: 18px
- H1: 48px
- H2: 36px
- H3: 28px
- H4: 24px

### Google Fonts Link

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

## Template Features

### Unique Components

1. **Split-Screen Hero**: Asymmetric homepage hero with branding on left, book cover grid on right
2. **Side/Hamburger Navigation**: Collapsible navigation with celestial icons (stars, moons)
3. **Star Rating System**: Custom 5-star rating display matching the celestial logo aesthetic
4. **Full-Width Instagram Gallery**: Dramatic 4-6 column Instagram feed integration
5. **Asymmetric Blog Grid**: Artistic, magazine-style blog post layout with varying card sizes
6. **Dark Theme Product Cards**: Book recommendations with gold CTAs on dark backgrounds

### Core Pages

- **Homepage** (`index.html`): Split-screen hero, featured reviews, Instagram gallery
- **Blog Archive** (`blog.html`): Asymmetric grid of blog post previews with star ratings
- **Single Blog Post** (`blog-post.html`): Full review with star rating and book details
- **About** (`about.html`): Personal story and brand information
- **Shop** (`shop.html`): Book recommendations with affiliate links
- **Contact** (`contact.html`): Contact form with validation

## Customization Guide

### Changing Colors

All colors are defined as CSS custom properties in `css/variables.css`. To customize:

1. Open `css/variables.css`
2. Locate the `/* ===== Brand Colors ===== */` section
3. Update the hex values:

```css
:root {
  --color-black-primary: #1A1A1A;    /* Change to your dark background */
  --color-gold-primary: #D4AF37;     /* Change to your accent color */
  --color-cream-primary: #FFF8E7;    /* Change to your text color */
}
```

**Dark Theme Tips**:
- Keep backgrounds very dark (#1A1A1A to #2C2C2C range) for dramatic effect
- Ensure text colors have high contrast (use cream/white tones)
- Test gold accent colors for visibility on dark backgrounds
- Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) to verify WCAG compliance

### Updating the Logo

1. Replace `assets/images/logo.svg` with your logo file
2. Recommended dimensions: 200x200px (SVG preferred for scalability)
3. Ensure logo works on dark backgrounds
4. Update the alt text in all HTML files:

```html
<img src="assets/images/logo.svg" alt="Your Brand Name Logo">
```

### Changing Fonts

1. Visit [Google Fonts](https://fonts.google.com/)
2. Select your font pairings (one serif for headings, one sans-serif for body)
3. Copy the Google Fonts link and replace in all HTML `<head>` sections
4. Update `css/variables.css`:

```css
:root {
  --font-primary: 'Your Heading Font', Georgia, serif;
  --font-secondary: 'Your Body Font', Arial, sans-serif;
}
```

**Recommended Font Pairings for Dark Themes**:
- Playfair Display + Lato (current)
- Cormorant Garamond + Work Sans
- Libre Baskerville + Open Sans
- Crimson Text + Raleway

### Adding Blog Posts

#### Blog Archive Page (`blog.html`)

Add new post cards to the `.blog-grid` section:

```html
<article class="post-card">
  <a href="blog-post-your-title.html" class="post-card-link">
    <div class="post-card-image">
      <img src="assets/images/your-book-cover.jpg" alt="Book Title by Author" loading="lazy">
    </div>
    <div class="post-card-content">
      <div class="star-rating" data-rating="4.5" aria-label="Rating: 4.5 out of 5 stars">
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star filled">★</span>
        <span class="star half">★</span>
      </div>
      <h3 class="post-card-title">Your Book Review Title</h3>
      <p class="post-card-meta">
        <time datetime="2026-01-15">January 15, 2026</time>
      </p>
      <p class="post-card-excerpt">
        Brief excerpt of your review (2-3 sentences)...
      </p>
    </div>
  </a>
</article>
```

#### Single Blog Post Page

1. Duplicate `blog-post.html` and rename (e.g., `blog-post-your-title.html`)
2. Update the content sections:
   - Featured image
   - Title and metadata
   - Star rating
   - Review content
   - Book details

### Modifying Navigation

Navigation links are in the `<nav class="main-nav">` section of each HTML file:

```html
<ul class="nav-list">
  <li><a href="index.html" class="nav-link">Home</a></li>
  <li><a href="blog.html" class="nav-link">Blog</a></li>
  <li><a href="about.html" class="nav-link">About</a></li>
  <li><a href="shop.html" class="nav-link">Shop</a></li>
  <li><a href="contact.html" class="nav-link">Contact</a></li>
  <!-- Add new pages here -->
</ul>
```

**Important**: Update navigation in ALL HTML files to maintain consistency.

## Hostinger Deployment

### Step 1: Prepare Files

1. Download/copy the entire `template-2-celestial-bookshelf` folder
2. Ensure all files are present:
   - 6 HTML files
   - `css/` folder with stylesheets
   - `js/` folder with scripts
   - `assets/` folder with images

### Step 2: Upload to Hostinger

1. Log in to your Hostinger account
2. Navigate to **File Manager** in your hosting control panel
3. Go to the `public_html` directory (or your domain's root folder)
4. Upload all files and folders from the template
5. Maintain the directory structure exactly as provided

### Step 3: Configure Domain

1. Ensure your domain points to the correct directory
2. Test by visiting `yourdomain.com` in a browser
3. Verify all pages load correctly and navigation works

### Step 4: Set Up Forms (Optional)

Hostinger provides form handling services. To connect your contact and newsletter forms:

1. In Hostinger control panel, go to **Website** → **Forms**
2. Create a new form endpoint
3. Update the `action` attribute in your forms:

```html
<form action="https://your-hostinger-form-endpoint.com" method="POST">
```

Alternatively, use third-party services like Formspree or Netlify Forms.

## Newsletter Integration

### Mailchimp Integration

1. **Create Mailchimp Account**: Sign up at [mailchimp.com](https://mailchimp.com)
2. **Create Audience**: Set up your email list
3. **Generate Embedded Form**:
   - Go to Audience → Signup forms → Embedded forms
   - Copy the form HTML code
4. **Update Template Forms**:
   - Replace the `action` attribute in newsletter forms (footer and modal)
   - Update hidden fields as needed

```html
<form action="https://your-mailchimp-url.com/subscribe/post" method="POST">
  <input type="hidden" name="u" value="your-user-id">
  <input type="hidden" name="id" value="your-list-id">
  <input type="email" name="EMAIL" placeholder="Your email" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

### ConvertKit Integration

1. **Create ConvertKit Account**: Sign up at [convertkit.com](https://convertkit.com)
2. **Create Form**:
   - Go to Grow → Landing Pages & Forms
   - Create a new inline form
   - Copy the form embed code or form URL
3. **Update Template**:
   - Replace form `action` with ConvertKit form URL
   - Or embed the ConvertKit form code directly

```html
<form action="https://app.convertkit.com/forms/your-form-id/subscriptions" method="POST">
  <input type="email" name="email_address" placeholder="Your email" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

## Instagram Feed Integration

### Option 1: SnapWidget (Recommended for Beginners)

1. Visit [snapwidget.com](https://snapwidget.com)
2. Choose "Instagram Widget"
3. Customize your feed (layout, number of posts, colors)
4. Generate embed code
5. Paste into the `.instagram-feed` section in `index.html`:

```html
<section class="instagram-feed">
  <div class="section-container">
    <h2 class="section-title">Follow My Reading Journey</h2>
    <!-- Paste SnapWidget embed code here -->
  </div>
</section>
```

### Option 2: Elfsight

1. Visit [elfsight.com](https://elfsight.com/instagram-feed-instashow/)
2. Create Instagram Feed widget
3. Customize appearance (dark theme, 6 columns)
4. Copy embed code
5. Paste into template

### Option 3: Manual Grid (Static)

For a simple static display:

```html
<div class="instagram-grid">
  <a href="https://instagram.com/p/your-post-id" target="_blank" rel="noopener" class="instagram-item">
    <img src="assets/images/instagram/post-1.jpg" alt="Instagram post description" loading="lazy">
  </a>
  <!-- Repeat for 6-12 posts -->
</div>
```

Update images manually when you want to refresh the feed.

## Image Guidelines

### Logo
- **Dimensions**: 200x200px (SVG preferred)
- **Format**: SVG, PNG with transparency
- **File size**: Under 50KB
- **Background**: Transparent or works on dark backgrounds

### Blog Featured Images
- **Dimensions**: 1200x630px (Open Graph optimized)
- **Aspect ratio**: 1.91:1
- **Format**: JPG or WebP
- **File size**: Under 300KB
- **Optimization**: Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app)

### Book Covers
- **Dimensions**: 400x600px
- **Aspect ratio**: 2:3 (standard book cover ratio)
- **Format**: JPG or WebP
- **File size**: Under 150KB
- **Quality**: High enough to show cover details clearly

### Social Media Icons
- **Dimensions**: 32x32px or 64x64px
- **Format**: SVG (scalable) or PNG
- **Colors**: Gold (#D4AF37) with transparent background
- **Location**: `assets/images/icons/`

### Background Images
- **Dimensions**: 1920x1080px minimum
- **Format**: JPG or WebP
- **File size**: Under 500KB
- **Optimization**: Compress heavily, use progressive JPG

## Affiliate Link Management

### Adding Affiliate Links

1. **Shop Page** (`shop.html`): Update product cards with your affiliate URLs

```html
<div class="product-card">
  <div class="product-image">
    <img src="assets/images/books/book-cover.jpg" alt="Book Title by Author">
  </div>
  <div class="product-info">
    <h3 class="product-title">Book Title</h3>
    <p class="product-author">by Author Name</p>
    <div class="star-rating" data-rating="5">
      <!-- Star rating HTML -->
    </div>
    <p class="product-description">
      Why you recommend this book...
    </p>
    <a href="https://your-affiliate-link.com" class="btn-cta" target="_blank" rel="noopener">
      Buy Now
    </a>
  </div>
</div>
```

2. **Blog Posts**: Add affiliate links within review content

```html
<p>
  If you're interested in reading this book, you can 
  <a href="https://your-affiliate-link.com" target="_blank" rel="noopener" class="affiliate-link">
    purchase it here
  </a>.
</p>
```

### Affiliate Link Best Practices

- Always use `target="_blank"` to open in new tab
- Always include `rel="noopener"` for security
- Consider adding `rel="sponsored"` for SEO transparency
- Disclose affiliate relationships (add disclaimer in footer or about page)
- Test links regularly to ensure they're not broken

### Popular Affiliate Programs for Books

- **Amazon Associates**: [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
- **Bookshop.org**: [bookshop.org/pages/affiliates](https://bookshop.org/pages/affiliates)
- **Barnes & Noble**: [barnesandnoble.com/affiliates](https://www.barnesandnoble.com/h/affiliate-program)
- **Book Depository**: [bookdepository.com/help/topic/HelpId/11](https://www.bookdepository.com/help/topic/HelpId/11)

## Form Backend Integration

The template includes client-side form validation, but you'll need a backend service to actually receive form submissions.

### Option 1: Formspree (Easiest)

1. Sign up at [formspree.io](https://formspree.io)
2. Create a new form
3. Copy your form endpoint
4. Update contact form:

```html
<form action="https://formspree.io/f/your-form-id" method="POST" class="contact-form">
```

### Option 2: Netlify Forms

If hosting on Netlify:

1. Add `netlify` attribute to form:

```html
<form name="contact" method="POST" data-netlify="true" class="contact-form">
  <input type="hidden" name="form-name" value="contact">
  <!-- Rest of form fields -->
</form>
```

2. Netlify automatically handles form submissions

### Option 3: Custom Backend

For full control, create your own backend:

1. Set up a server (Node.js, PHP, Python, etc.)
2. Create an endpoint to receive form data
3. Update form `action` attribute
4. Handle email sending server-side

## Dark Theme Customization Tips

### Maintaining Readability

- **Text contrast**: Ensure cream/white text (#FFF8E7) has sufficient contrast against dark backgrounds
- **Minimum contrast ratio**: 7:1 for normal text, 4.5:1 for large text (WCAG AAA)
- **Test with tools**: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Working with Gold Accents

- **Primary gold** (#D4AF37): Use for CTAs, links, and important highlights
- **Light gold** (#F4E4C1): Use for hover states and subtle accents
- **Dark gold** (#B8941F): Use for active/pressed states
- **Avoid overuse**: Gold should accent, not dominate

### Image Considerations

- **Book covers**: Ensure covers are high-quality and visible on dark backgrounds
- **Add borders**: Consider subtle borders around images for definition
- **Test visibility**: Some book covers may blend into dark backgrounds

### Accessibility on Dark Themes

- **Focus indicators**: Ensure keyboard focus is visible (gold outline works well)
- **Link colors**: Gold links should be clearly distinguishable from body text
- **Button contrast**: Gold buttons must have sufficient contrast with backgrounds
- **Test with screen readers**: Verify all content is accessible

## Browser Compatibility

This template is tested and compatible with:

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions (macOS and iOS)
- **Edge**: Latest 2 versions

### Known Issues

- **Internet Explorer**: Not supported (uses modern CSS features)
- **Older browsers**: May not display CSS Grid correctly (graceful degradation included)

## Responsive Breakpoints

The template uses mobile-first responsive design with these breakpoints:

- **Mobile**: 320px - 767px (base styles)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

Test your customizations at all breakpoints to ensure responsive behavior.

## Performance Optimization

### Image Optimization

- Use [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app) to compress images
- Convert to WebP format for better compression (with JPG fallback)
- Use `loading="lazy"` attribute on images below the fold (already implemented)

### CSS and JavaScript

- CSS is already minified for production
- JavaScript uses vanilla JS (no heavy frameworks)
- Minimal external dependencies (only Google Fonts)

### Hosting Recommendations

- Use a CDN for faster global delivery
- Enable Gzip compression on your server
- Use HTTP/2 for improved performance
- Consider Cloudflare for additional optimization

## Accessibility Features

This template is built with WCAG 2.1 AA compliance:

- ✅ Semantic HTML5 structure
- ✅ Proper heading hierarchy (h1-h6)
- ✅ Alt text for all images
- ✅ ARIA labels for icon buttons
- ✅ Keyboard navigation support
- ✅ Form labels and error messages
- ✅ Sufficient color contrast ratios
- ✅ Focus indicators for interactive elements

### Testing Accessibility

- Use browser DevTools Lighthouse audit
- Test with keyboard navigation (Tab, Enter, Esc keys)
- Use screen reader (NVDA, JAWS, or VoiceOver) to verify content
- Check color contrast with automated tools

## Support and Resources

### Documentation

- [HTML5 Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

### Tools

- [Google Fonts](https://fonts.google.com)
- [TinyPNG](https://tinypng.com) - Image compression
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [HTML Validator](https://validator.w3.org/)
- [CSS Validator](https://jigsaw.w3.org/css-validator/)

### Community

- [Stack Overflow](https://stackoverflow.com) - Technical questions
- [CSS-Tricks](https://css-tricks.com) - CSS tutorials and tips
- [MDN Web Docs](https://developer.mozilla.org) - Comprehensive web documentation

## License

This template is provided for use by Chikielau. Customize freely for your brand needs.

---

**Template Version**: 1.0  
**Last Updated**: January 2026  
**Created for**: Chikielau Brand

For questions or support, please refer to the documentation links above or consult with a web developer.
