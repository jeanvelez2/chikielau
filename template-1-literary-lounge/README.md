# Literary Lounge - Chikielau Website Template

## Template Description

**Literary Lounge** is a magazine-style website template designed for bookstagrammers, book bloggers, and literary content creators. This template embodies the Chikielau brand philosophy of "cozy vintage library vibes meets celestial elegance" through its warm cream tones, traditional horizontal navigation, and inviting layout.

### Design Philosophy

Literary Lounge creates a welcoming, sophisticated space that feels like stepping into a beautifully curated independent bookstore. The design emphasizes:

- **Magazine-Style Layout**: Grid-based content organization with varying card sizes for visual interest
- **Cozy Elegance**: Warm cream and ivory backgrounds (#FFF8E7, #F5F5DC) paired with metallic gold accents (#D4AF37)
- **Traditional Navigation**: Classic horizontal menu bar that's familiar and easy to use
- **Featured Content**: Prominent carousel showcasing your best book reviews
- **Reading Journey**: "Currently Reading" section that connects with your audience

This template is perfect for creators who want a professional, polished look that still feels warm and approachable—like a conversation with a friend over coffee about your favorite books.

---

## Color Palette

### Primary Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Gold Primary** | `#D4AF37` | CTA buttons, accents, hover states, celestial elements |
| **Gold Light** | `#F4E4C1` | Subtle backgrounds, borders, highlights |
| **Cream Primary** | `#FFF8E7` | Main background color, card backgrounds |
| **Cream Secondary** | `#F5F5DC` | Alternate section backgrounds, subtle contrast |

### Supporting Colors

| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Black Primary** | `#1A1A1A` | Body text, headings, high contrast elements |
| **Black Secondary** | `#2C2C2C` | Secondary text, footer background |
| **Neutral Warm 1** | `#D7CCC8` | Borders, dividers, subtle accents |
| **Neutral Warm 2** | `#BCAAA4` | Muted text, metadata, secondary information |

### Color Customization

To change the color scheme, edit the CSS variables in `css/variables.css`:

```css
:root {
  --color-gold-primary: #D4AF37;    /* Change to your accent color */
  --color-cream-primary: #FFF8E7;   /* Change to your background color */
  /* ... other colors */
}
```

---

## Typography

### Font Pairings

This template uses a classic serif + sans-serif pairing that balances elegance with readability:

#### Primary Font (Headings)
- **Font**: Playfair Display
- **Type**: Serif
- **Weights**: 400 (Regular), 600 (Semi-Bold), 700 (Bold)
- **Google Fonts Link**: [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
- **Usage**: Headings (h1-h6), logo text, featured content titles

#### Secondary Font (Body)
- **Font**: Lato
- **Type**: Sans-serif
- **Weights**: 300 (Light), 400 (Regular), 700 (Bold)
- **Google Fonts Link**: [Lato](https://fonts.google.com/specimen/Lato)
- **Usage**: Body text, navigation, buttons, form inputs

### Typography Specifications

- **Base Font Size**: 16px (minimum for accessibility)
- **Body Line Height**: 1.6 (optimal for reading comfort)
- **Heading Line Height**: 1.2 (tighter for visual impact)
- **H1 Size**: 2.5rem (40px)
- **H2 Size**: 2rem (32px)
- **H3 Size**: 1.5rem (24px)

### Alternative Font Suggestions

If you want to customize the typography, here are recommended pairings that maintain the cozy elegance aesthetic:

1. **Elegant Classic**: Cormorant Garamond (serif) + Open Sans (sans-serif)
2. **Modern Vintage**: Libre Baskerville (serif) + Source Sans Pro (sans-serif)
3. **Romantic Literary**: Crimson Text (serif) + Nunito Sans (sans-serif)
4. **Sophisticated Warmth**: Merriweather (serif) + Raleway (sans-serif)

To change fonts, update the Google Fonts link in the HTML `<head>` and modify the CSS variables:

```css
:root {
  --font-primary: 'Your Heading Font', serif;
  --font-secondary: 'Your Body Font', sans-serif;
}
```

---

## Customization Guide

### Changing Colors

1. Open `css/variables.css`
2. Locate the "Brand Colors" section
3. Replace hex codes with your desired colors
4. Save the file—changes apply site-wide automatically

**Example**:
```css
/* Change gold to rose gold */
--color-gold-primary: #B76E79;
--color-gold-light: #E8C4C8;
```

### Updating the Logo

1. **Prepare your logo**:
   - Recommended size: 200×200px
   - Format: PNG with transparent background or SVG
   - File name: `logo.svg` or `logo.png`

2. **Replace the logo file**:
   - Navigate to `assets/images/`
   - Replace the existing `logo.svg` with your logo file
   - Keep the same filename, or update all references in HTML files

3. **Update logo in HTML** (if changing filename):
   - Open each HTML file (index.html, blog.html, etc.)
   - Find: `<img src="assets/images/logo.svg" alt="...">`
   - Update the `src` and `alt` attributes

### Adding Blog Posts

#### Method 1: Duplicate Existing Post

1. Make a copy of `blog-post.html`
2. Rename it (e.g., `my-new-review.html`)
3. Edit the content:
   - Update the `<title>` tag
   - Change the heading (`<h1>`)
   - Replace the featured image
   - Update the publication date
   - Write your review content

#### Method 2: Add to Blog Archive

1. Open `blog.html`
2. Find the blog post cards section
3. Copy an existing post card:

```html
<article class="post-card">
  <div class="post-card-image">
    <img src="assets/images/placeholders/your-book.jpg" alt="Book cover description">
  </div>
  <div class="post-card-content">
    <h3 class="post-card-title">
      <a href="your-post.html">Your Review Title</a>
    </h3>
    <p class="post-card-meta">
      <time datetime="2026-01-15">January 15, 2026</time>
    </p>
    <p class="post-card-excerpt">
      Brief excerpt of your review...
    </p>
    <a href="your-post.html" class="btn-read-more">Read More</a>
  </div>
</article>
```

4. Update the content and link to your new post file

### Modifying Navigation

1. Open any HTML file
2. Find the `<nav class="main-nav">` section
3. Add, remove, or edit navigation links:

```html
<ul class="nav-list">
  <li><a href="index.html" class="nav-link">Home</a></li>
  <li><a href="blog.html" class="nav-link">Blog</a></li>
  <li><a href="about.html" class="nav-link">About</a></li>
  <li><a href="shop.html" class="nav-link">Shop</a></li>
  <li><a href="contact.html" class="nav-link">Contact</a></li>
  <!-- Add new page -->
  <li><a href="new-page.html" class="nav-link">New Page</a></li>
</ul>
```

4. **Important**: Update navigation on ALL pages to maintain consistency

### Customizing the Carousel

1. Open `index.html`
2. Find the `<div class="featured-carousel">` section
3. To add a new slide, copy an existing slide structure:

```html
<div class="carousel-slide">
  <div class="carousel-image">
    <img src="assets/images/placeholders/your-book.jpg" alt="Book title and author">
  </div>
  <div class="carousel-caption">
    <h3>Book Title</h3>
    <p class="carousel-author">by Author Name</p>
    <p class="carousel-description">Your compelling description...</p>
    <a href="your-review.html" class="btn-gold">Read Review</a>
  </div>
</div>
```

4. The carousel automatically handles any number of slides

### Updating "Currently Reading" Section

1. Open `index.html`
2. Find the `<section class="currently-reading">` section
3. Update the book information:
   - Replace the book cover image
   - Change the title and author
   - Update the progress bar width (style="width: 65%")
   - Edit your thoughts text

```html
<div class="progress-fill" style="width: 75%"></div>
<p class="progress-text">75% complete</p>
```

---

## Hostinger Deployment Instructions

### Step 1: Prepare Your Files

1. Download or copy the entire `template-1-literary-lounge` folder
2. Ensure all files are present:
   - 6 HTML files (index.html, blog.html, blog-post.html, about.html, shop.html, contact.html)
   - css/ folder with styles.css and variables.css
   - js/ folder with script.js
   - assets/ folder with images and fonts

### Step 2: Upload to Hostinger

1. Log in to your Hostinger account
2. Navigate to **hPanel** → **File Manager**
3. Go to the `public_html` directory (or your domain's root folder)
4. Click **Upload Files**
5. Select all files and folders from the template directory
6. Wait for upload to complete

**Alternative**: Use FTP client (FileZilla):
- Host: Your domain or IP address
- Username: Your Hostinger FTP username
- Password: Your Hostinger FTP password
- Port: 21
- Drag and drop files to `public_html`

### Step 3: Configure Forms

The template includes two forms that need backend configuration:

#### Newsletter Forms (Footer + Modal)

**Option A: Use Hostinger's Form Handler**
1. In hPanel, go to **Website** → **Forms**
2. Create a new form
3. Copy the form action URL
4. Update the form action in your HTML files:

```html
<form class="newsletter-form" action="YOUR_HOSTINGER_FORM_URL" method="post">
```

**Option B: Use Third-Party Service** (see Newsletter Integration section below)

#### Contact Form

1. In hPanel, go to **Website** → **Forms**
2. Create a contact form with fields: name, email, message
3. Copy the form action URL
4. Update `contact.html`:

```html
<form class="contact-form" action="YOUR_HOSTINGER_FORM_URL" method="post">
```

### Step 4: Test Your Website

1. Visit your domain in a web browser
2. Test all navigation links
3. Submit test forms to verify they work
4. Check on mobile devices
5. Verify images load correctly

### Troubleshooting

- **Images not loading**: Check file paths are correct and case-sensitive
- **Forms not working**: Verify form action URLs are correct
- **CSS not applying**: Clear browser cache and check CSS file paths
- **Mobile menu not working**: Ensure script.js is loading correctly

---

## Newsletter Service Integration

### Mailchimp Integration

#### Step 1: Create Mailchimp Form

1. Log in to [Mailchimp](https://mailchimp.com)
2. Go to **Audience** → **Signup forms** → **Embedded forms**
3. Select **Naked** form style
4. Copy the form HTML code

#### Step 2: Extract Form Action URL

From the Mailchimp code, find the `<form>` tag and copy the `action` URL:

```html
<form action="https://yoursite.us1.list-manage.com/subscribe/post?u=xxxxx&id=xxxxx" method="post">
```

#### Step 3: Update Your Forms

Replace the form action in both the footer and modal:

**Footer Form** (in all HTML files):
```html
<form class="newsletter-form" action="YOUR_MAILCHIMP_ACTION_URL" method="post">
  <input type="email" name="EMAIL" placeholder="Your email" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

**Modal Form** (in index.html and other pages with modal):
```html
<form class="modal-form" action="YOUR_MAILCHIMP_ACTION_URL" method="post">
  <input type="email" name="EMAIL" placeholder="Your email address" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

**Important**: Change `name="email"` to `name="EMAIL"` (Mailchimp requires uppercase)

### ConvertKit Integration

#### Step 1: Create ConvertKit Form

1. Log in to [ConvertKit](https://convertkit.com)
2. Go to **Grow** → **Landing Pages & Forms**
3. Create a new **Inline** form
4. Customize the form (or use minimal styling)
5. Click **Publish**

#### Step 2: Get Form Embed Code

1. Click **Embed** on your form
2. Select **HTML** option
3. Copy the form code

#### Step 3: Extract Form Details

From the ConvertKit code, find:
- Form action URL (looks like: `https://app.convertkit.com/forms/XXXXXX/subscriptions`)
- Form ID

#### Step 4: Update Your Forms

```html
<form class="newsletter-form" action="https://app.convertkit.com/forms/YOUR_FORM_ID/subscriptions" method="post">
  <input type="email" name="email_address" placeholder="Your email" required>
  <button type="submit" class="btn-gold">Subscribe</button>
</form>
```

**Important**: ConvertKit uses `name="email_address"` (not "email" or "EMAIL")

### Alternative: JavaScript Integration

For a more seamless experience without page redirects, use AJAX form submission:

1. Keep the form action URL from Mailchimp or ConvertKit
2. Add custom JavaScript to handle submission
3. Display success/error messages without leaving the page

(This requires additional JavaScript coding—contact a developer if needed)

---

## Instagram Feed Integration

### Option 1: SnapWidget (Recommended for Beginners)

**Free and easy to set up**

1. Visit [SnapWidget.com](https://snapwidget.com)
2. Click **Create Widget** → **Instagram**
3. Choose **Grid** layout
4. Connect your Instagram account
5. Customize:
   - Number of photos: 6-9
   - Layout: 3 columns
   - Spacing: Medium
   - Theme: Match your brand colors
6. Copy the embed code
7. Paste into your HTML:

**Homepage** (index.html):
```html
<section class="instagram-feed">
  <div class="container">
    <h2 class="section-title">Follow My Reading Journey</h2>
    <!-- Paste SnapWidget code here -->
    <div class="instagram-embed-placeholder">
      [YOUR SNAPWIDGET CODE]
    </div>
  </div>
</section>
```

### Option 2: Elfsight (Premium Features)

**More customization options, free and paid plans**

1. Visit [Elfsight.com](https://elfsight.com/instagram-feed-instashow/)
2. Create an account
3. Click **Create Widget**
4. Connect Instagram and customize:
   - Layout: Grid
   - Columns: 3
   - Number of posts: 9
   - Show captions: Optional
   - Color scheme: Match your brand
5. Copy the embed code
6. Paste into your HTML (same location as SnapWidget above)

### Option 3: Native Instagram Embed

**For individual posts**

1. Open Instagram in a web browser
2. Navigate to the post you want to embed
3. Click the **three dots** (•••) → **Embed**
4. Copy the embed code
5. Paste into your HTML

**Note**: Native embeds work best for featuring specific posts, not for creating a feed grid.

### Option 4: Manual Grid (No Third-Party Service)

**Full control, but requires manual updates**

1. Save your Instagram images to `assets/images/instagram/`
2. Update the Instagram section in your HTML:

```html
<section class="instagram-feed">
  <div class="container">
    <h2 class="section-title">Follow My Reading Journey</h2>
    <div class="instagram-grid">
      <a href="https://instagram.com/p/YOUR_POST_ID" class="instagram-item" target="_blank" rel="noopener">
        <img src="assets/images/instagram/post-1.jpg" alt="Instagram post description">
      </a>
      <a href="https://instagram.com/p/YOUR_POST_ID" class="instagram-item" target="_blank" rel="noopener">
        <img src="assets/images/instagram/post-2.jpg" alt="Instagram post description">
      </a>
      <!-- Repeat for 6-9 posts -->
    </div>
    <a href="https://instagram.com/YOUR_USERNAME" class="btn-gold" target="_blank" rel="noopener">
      Follow on Instagram
    </a>
  </div>
</section>
```

3. The CSS is already styled for a responsive grid

### Instagram Feed Placement

In the Literary Lounge template, the Instagram feed appears:
- **Homepage**: Below the "Currently Reading" section, sidebar-style on desktop
- **About Page**: At the bottom, showcasing your visual content

---

## Image Dimension Guidelines

### Logo

- **Dimensions**: 200×200px (square)
- **Format**: SVG (preferred) or PNG with transparent background
- **File Size**: Under 50KB
- **Location**: `assets/images/logo.svg`

### Blog Featured Images

- **Dimensions**: 1200×630px (1.91:1 ratio)
- **Format**: JPG or PNG
- **File Size**: Under 300KB (optimize for web)
- **Usage**: Blog post cards, single post headers, Open Graph images
- **Location**: `assets/images/placeholders/` or `assets/images/blog/`

**Optimization Tip**: Use tools like [TinyPNG](https://tinypng.com) or [Squoosh](https://squoosh.app) to compress images without losing quality.

### Book Covers

- **Dimensions**: 400×600px (2:3 ratio)
- **Format**: JPG
- **File Size**: Under 150KB
- **Usage**: Product cards, carousel, "Currently Reading" section
- **Location**: `assets/images/placeholders/` or `assets/images/books/`

**Note**: Book covers should maintain the 2:3 aspect ratio (standard book proportions). The CSS uses `object-fit: cover` to handle slight variations.

### Social Media Icons

- **Dimensions**: 24×24px or 32×32px
- **Format**: SVG (preferred) or PNG
- **File Size**: Under 10KB each
- **Location**: `assets/images/icons/`
- **Included Icons**: Instagram, TikTok, Goodreads

### Background Images (Optional)

- **Dimensions**: 1920×1080px (Full HD)
- **Format**: JPG
- **File Size**: Under 500KB (heavily optimize)
- **Usage**: Hero sections, decorative backgrounds

### Instagram Feed Images

- **Dimensions**: 1080×1080px (square) or 1080×1350px (portrait)
- **Format**: JPG
- **File Size**: Under 200KB each
- **Usage**: Manual Instagram grid (if not using embed service)

### Image Organization

```
assets/images/
├── logo.svg                    # Site logo
├── og-image.jpg                # Open Graph image (1200×630px)
├── placeholders/               # Example images
│   ├── book-1.jpg              # 400×600px
│   ├── book-2.jpg
│   ├── featured-1.jpg          # 1200×630px
│   └── ...
├── icons/                      # Social media icons
│   ├── instagram.svg
│   ├── tiktok.svg
│   └── goodreads.svg
└── instagram/                  # Instagram feed images (optional)
    ├── post-1.jpg
    └── ...
```

---

## Affiliate Link Management

### Adding Affiliate Links to Shop Page

1. Open `shop.html`
2. Find the product cards section
3. Each product card has a "Buy Now" button:

```html
<div class="product-card">
  <div class="product-image">
    <img src="assets/images/placeholders/book-cover.jpg" alt="Book Title by Author">
  </div>
  <div class="product-info">
    <h3 class="product-title">Book Title</h3>
    <p class="product-author">by Author Name</p>
    <p class="product-description">
      Why you recommend this book...
    </p>
    <a href="YOUR_AFFILIATE_LINK_HERE" class="btn-cta" target="_blank" rel="noopener">
      Buy Now
    </a>
  </div>
</div>
```

4. Replace `YOUR_AFFILIATE_LINK_HERE` with your actual affiliate link

### Affiliate Link Best Practices

#### Amazon Associates

**Example Link**:
```
https://www.amazon.com/dp/PRODUCT_ID/?tag=your-tag-20
```

**Tips**:
- Always use your unique affiliate tag
- Link directly to the product page (not search results)
- Use the short link format for cleaner URLs

#### Bookshop.org

**Example Link**:
```
https://bookshop.org/a/YOUR_AFFILIATE_ID/BOOK_ISBN
```

**Tips**:
- Supports independent bookstores
- Good alternative to Amazon
- Clear affiliate disclosure appreciated by readers

#### Other Affiliate Programs

- **Barnes & Noble**: Use their affiliate program links
- **Book Depository**: Affiliate links available
- **Kobo**: Affiliate program for ebooks

### Legal Requirements

**Always include an affiliate disclosure**. Add this to your pages with affiliate links:

**In `shop.html`** (add near the top):
```html
<div class="affiliate-disclosure">
  <p><em>This page contains affiliate links. If you purchase through these links, I may earn a small commission at no additional cost to you. Thank you for supporting my work!</em></p>
</div>
```

**In `blog-post.html`** (if including affiliate links in reviews):
```html
<aside class="disclosure">
  <p><strong>Disclosure:</strong> This post contains affiliate links. Purchases made through these links help support this blog at no extra cost to you.</p>
</aside>
```

### Tracking Affiliate Performance

1. **Use UTM Parameters** (optional):
```
https://www.amazon.com/dp/PRODUCT_ID/?tag=your-tag-20&utm_source=website&utm_medium=shop_page&utm_campaign=book_recs
```

2. **Check Your Affiliate Dashboard**:
   - Amazon Associates: Check clicks and conversions
   - Bookshop.org: View earnings and popular books
   - Adjust your recommendations based on what resonates

### Updating Multiple Links

If you need to update many affiliate links at once:

1. Use Find & Replace in your code editor
2. Find: `https://www.amazon.com/dp/`
3. Replace with: `https://www.amazon.com/dp/` (with your tag added)
4. Review each replacement to ensure accuracy

---

## Form Backend Integration

The template includes two types of forms that require backend integration:

### 1. Newsletter Forms

**Locations**: Footer (all pages) + Modal popup (homepage)

**Integration Options**:
- **Mailchimp**: See "Newsletter Service Integration" section above
- **ConvertKit**: See "Newsletter Service Integration" section above
- **Hostinger Forms**: Use Hostinger's built-in form handler
- **Custom Backend**: Connect to your own API endpoint

### 2. Contact Form

**Location**: `contact.html`

#### Option A: Hostinger Form Handler

1. Log in to Hostinger hPanel
2. Navigate to **Website** → **Forms**
3. Create a new form with fields:
   - Name (text)
   - Email (email)
   - Message (textarea)
4. Copy the form action URL
5. Update `contact.html`:

```html
<form class="contact-form" action="YOUR_HOSTINGER_FORM_URL" method="post">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
  </div>
  <button type="submit" class="btn-gold">Send Message</button>
</form>
```

#### Option B: Formspree (Third-Party Service)

**Free tier available, easy setup**

1. Visit [Formspree.io](https://formspree.io)
2. Create an account
3. Create a new form
4. Copy your form endpoint
5. Update `contact.html`:

```html
<form class="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="post">
  <!-- form fields remain the same -->
</form>
```

**Benefits**:
- No backend coding required
- Spam protection included
- Email notifications
- Form submissions dashboard

#### Option C: Netlify Forms

**If hosting on Netlify**

1. Add `netlify` attribute to your form:

```html
<form class="contact-form" name="contact" method="post" data-netlify="true">
  <input type="hidden" name="form-name" value="contact">
  <!-- form fields remain the same -->
</form>
```

2. Deploy to Netlify
3. Forms automatically work—submissions appear in Netlify dashboard

#### Option D: Custom PHP Backend

**If you have PHP hosting**

1. Create `process-contact.php`:

```php
<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $message = htmlspecialchars($_POST['message']);
    
    $to = "your-email@example.com";
    $subject = "Contact Form Submission from $name";
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";
    $headers = "From: $email";
    
    if (mail($to, $subject, $body, $headers)) {
        echo "success";
    } else {
        echo "error";
    }
}
?>
```

2. Update form action:

```html
<form class="contact-form" action="process-contact.php" method="post">
```

### Form Validation

The template includes JavaScript validation that works with all backend options:

- **Email format validation**: Checks for valid email structure
- **Required field validation**: Ensures no empty submissions
- **Error messages**: Displays helpful feedback
- **Success confirmation**: Shows success message after submission

The validation runs before form submission, providing immediate feedback to users.

---

## Browser Compatibility

This template is tested and compatible with:

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions (macOS and iOS)
- **Edge**: Latest 2 versions

### Mobile Browsers

- **Safari iOS**: iOS 13+
- **Chrome Android**: Latest version
- **Samsung Internet**: Latest version

### Known Limitations

- **Internet Explorer 11**: Not supported (uses modern CSS features like Grid and Custom Properties)
- **Older Mobile Browsers**: May have limited support for some animations

---

## Support and Resources

### Template Files

- **HTML Files**: 6 pages (index, blog, blog-post, about, shop, contact)
- **CSS Files**: 2 files (variables.css, styles.css)
- **JavaScript Files**: 1 file (script.js)
- **Assets**: Logo, placeholder images, social icons

### Additional Resources

- **Google Fonts**: [fonts.google.com](https://fonts.google.com)
- **Image Optimization**: [TinyPNG](https://tinypng.com), [Squoosh](https://squoosh.app)
- **Color Palette Tools**: [Coolors](https://coolors.co), [Adobe Color](https://color.adobe.com)
- **Accessibility Checker**: [WAVE](https://wave.webaim.org)

### Getting Help

If you encounter issues:

1. **Check file paths**: Ensure all links are correct and case-sensitive
2. **Clear browser cache**: Force refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
3. **Validate HTML**: Use [W3C Validator](https://validator.w3.org)
4. **Check console**: Open browser DevTools (F12) to see JavaScript errors

---

## License

This template is provided for use with the Chikielau brand. Customize and deploy as needed for your bookstagram or book blog website.

---

## Credits

**Template Design**: Literary Lounge - Chikielau Website Template  
**Typography**: Playfair Display & Lato (Google Fonts)  
**Color Palette**: Chikielau Brand Guidelines  

---

**Version**: 1.0  
**Last Updated**: January 2026

---

*Happy reading and happy blogging! 📚✨*
