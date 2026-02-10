# Design Document: Chikielau Website Templates

## Overview

This design document outlines the technical architecture and implementation approach for three distinct website templates for the Chikielau bookstagrammer brand. Each template will be a complete, independent package built with pure HTML5, CSS3, and minimal vanilla JavaScript, optimized for deployment on Hostinger and compatible with WordPress and Wix.

The three templates—"Literary Lounge", "Celestial Bookshelf", and "Moonlit Pages"—share core functionality but differ significantly in visual design, layout structure, and user experience approach. All templates prioritize mobile-first responsive design, accessibility compliance (WCAG 2.1 AA), and ease of customization for non-technical users.

### Design Philosophy

Each template embodies the Chikielau brand identity of "cozy vintage library vibes meets celestial elegance" while offering distinct aesthetic interpretations:

- **Template 1 (Literary Lounge)**: Traditional, magazine-inspired with warm cream tones
- **Template 2 (Celestial Bookshelf)**: Bold, artistic with dramatic black and gold contrast
- **Template 3 (Moonlit Pages)**: Minimalist, storytelling-focused with soft neutral palette

## Architecture

### High-Level Structure

Each template follows a modular, component-based architecture organized in a consistent directory structure:

```
template-name/
├── index.html                 # Homepage
├── blog.html                  # Blog archive page
├── blog-post.html             # Single post template
├── about.html                 # About page
├── shop.html                  # Shop/recommendations page
├── contact.html               # Contact page
├── css/
│   ├── styles.css            # Main stylesheet
│   ├── variables.css         # CSS custom properties
│   └── components.css        # Reusable component styles
├── js/
│   ├── script.js             # Main JavaScript
│   └── components.js         # Component-specific JS
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── placeholders/     # Placeholder images
│   │   └── icons/            # Social media icons
│   └── fonts/                # Web fonts (if self-hosted)
└── README.md                 # Template documentation
```

### Technology Stack

- **HTML5**: Semantic markup with proper document structure
- **CSS3**: Modern CSS with custom properties (CSS variables), Flexbox, and Grid
- **JavaScript (ES6+)**: Vanilla JavaScript for interactivity (no frameworks)
- **No external dependencies**: All code self-contained except optional CDN fonts

### Design Patterns

1. **Component-Based CSS**: Reusable classes following BEM-like naming conventions
2. **Mobile-First Responsive**: Base styles for mobile, progressive enhancement for larger screens
3. **Progressive Enhancement**: Core functionality works without JavaScript
4. **Separation of Concerns**: Structure (HTML), presentation (CSS), behavior (JS) clearly separated

## Components and Interfaces

### Core Components

#### 1. Header Component

**Purpose**: Provides site branding, navigation, and consistent top-of-page experience

**Structure**:
```html
<header class="site-header">
  <div class="header-container">
    <div class="logo">
      <img src="assets/images/logo.png" alt="Chikielau Logo">
    </div>
    <nav class="main-nav">
      <ul class="nav-list">
        <li><a href="index.html">Home</a></li>
        <li><a href="blog.html">Blog</a></li>
        <li><a href="about.html">About</a></li>
        <li><a href="shop.html">Shop</a></li>
        <li><a href="contact.html">Contact</a></li>
      </ul>
    </nav>
    <button class="nav-toggle" aria-label="Toggle navigation">
      <span class="hamburger"></span>
    </button>
  </div>
</header>
```

**Variations by Template**:
- Template 1: Traditional horizontal navigation bar, logo left-aligned
- Template 2: Side navigation or hamburger menu with celestial icons
- Template 3: Sticky minimalist top bar with centered logo option

**CSS Variables**:
```css
--header-bg-color
--header-text-color
--header-height
--logo-max-width
```

**JavaScript Behavior**:
- Mobile menu toggle functionality
- Sticky header on scroll (Template 3)
- Active page highlighting

#### 2. Footer Component

**Purpose**: Provides newsletter signup, social links, and site information

**Structure**:
```html
<footer class="site-footer">
  <div class="footer-container">
    <div class="footer-newsletter">
      <h3>Join My Book Club</h3>
      <form class="newsletter-form" action="#" method="post">
        <input type="email" placeholder="Your email" required>
        <button type="submit" class="btn-gold">Subscribe</button>
      </form>
    </div>
    <div class="footer-social">
      <a href="#" aria-label="Instagram"><img src="assets/images/icons/instagram.svg" alt=""></a>
      <a href="#" aria-label="TikTok"><img src="assets/images/icons/tiktok.svg" alt=""></a>
      <a href="#" aria-label="Goodreads"><img src="assets/images/icons/goodreads.svg" alt=""></a>
    </div>
    <div class="footer-info">
      <p>&copy; 2026 Chikielau. All rights reserved.</p>
    </div>
  </div>
</footer>
```

**Features**:
- Newsletter signup form with email validation
- Social media icon links with hover effects
- Copyright and legal information

#### 3. Blog Post Card Component

**Purpose**: Displays blog post preview with image, title, excerpt, and metadata

**Structure**:
```html
<article class="post-card">
  <div class="post-card-image">
    <img src="placeholder.jpg" alt="Book cover">
  </div>
  <div class="post-card-content">
    <h3 class="post-card-title">
      <a href="blog-post.html">Review: Book Title</a>
    </h3>
    <p class="post-card-meta">
      <time datetime="2026-01-15">January 15, 2026</time>
    </p>
    <p class="post-card-excerpt">
      Brief excerpt of the review...
    </p>
    <a href="blog-post.html" class="btn-read-more">Read More</a>
  </div>
</article>
```

**Responsive Behavior**:
- Mobile: Stacked layout (image top, content below)
- Tablet: Side-by-side or 2-column grid
- Desktop: 3-column grid or magazine-style layout

#### 4. Product Card Component

**Purpose**: Displays book recommendation with affiliate link

**Structure**:
```html
<div class="product-card">
  <div class="product-image">
    <img src="book-cover.jpg" alt="Book Title by Author">
  </div>
  <div class="product-info">
    <h3 class="product-title">Book Title</h3>
    <p class="product-author">by Author Name</p>
    <p class="product-description">
      Brief description of why this book is recommended...
    </p>
    <a href="https://affiliate-link.com" class="btn-cta" target="_blank" rel="noopener">
      Buy Now
    </a>
  </div>
</div>
```

**Features**:
- Hover effects on image and button
- Gold CTA button with brand styling
- Responsive grid layout (1-2-3-4 columns based on screen size)

#### 5. Newsletter Modal Component

**Purpose**: Popup newsletter signup to capture email addresses

**Structure**:
```html
<div class="modal-overlay" id="newsletterModal">
  <div class="modal-content">
    <button class="modal-close" aria-label="Close modal">&times;</button>
    <div class="modal-body">
      <h2>Join the Book Club</h2>
      <p>Get weekly book recommendations and exclusive content!</p>
      <form class="modal-form" action="#" method="post">
        <input type="email" placeholder="Your email address" required>
        <button type="submit" class="btn-gold">Subscribe</button>
      </form>
    </div>
  </div>
</div>
```

**JavaScript Behavior**:
- Display after 5 seconds or on scroll to 50% of page
- Dismissible with close button or clicking outside
- Set cookie to prevent showing again for 30 days
- Keyboard accessible (ESC key closes)

#### 6. Instagram Feed Component

**Purpose**: Display Instagram posts within the website

**Implementation Options**:

**Option A: Embed Code (Recommended for non-technical users)**
```html
<div class="instagram-feed">
  <!-- User pastes embed code from SnapWidget, Elfsight, or Instagram -->
  <div class="instagram-embed-placeholder">
    <!-- Embed code goes here -->
  </div>
</div>
```

**Option B: Manual Grid (Static)**
```html
<div class="instagram-grid">
  <a href="instagram-post-url" class="instagram-item">
    <img src="post-image.jpg" alt="Instagram post description">
  </a>
  <!-- Repeat for 6-12 posts -->
</div>
```

**Variations by Template**:
- Template 1: Sidebar widget (vertical stack)
- Template 2: Full-width gallery (4-6 columns)
- Template 3: Integrated into blog feed (alternating posts)

#### 7. Featured Book Carousel Component (Template 1)

**Purpose**: Showcase featured books in rotating carousel

**Structure**:
```html
<div class="featured-carousel">
  <div class="carousel-container">
    <div class="carousel-slide active">
      <img src="book1.jpg" alt="Featured Book 1">
      <div class="carousel-caption">
        <h3>Book Title</h3>
        <p>Brief description</p>
        <a href="blog-post.html" class="btn-gold">Read Review</a>
      </div>
    </div>
    <!-- Additional slides -->
  </div>
  <button class="carousel-prev" aria-label="Previous slide">&larr;</button>
  <button class="carousel-next" aria-label="Next slide">&rarr;</button>
  <div class="carousel-indicators">
    <button class="indicator active" aria-label="Slide 1"></button>
    <button class="indicator" aria-label="Slide 2"></button>
  </div>
</div>
```

**JavaScript Behavior**:
- Auto-advance every 5 seconds
- Manual navigation with prev/next buttons
- Indicator dots for direct slide access
- Pause on hover
- Touch/swipe support for mobile

#### 8. Star Rating Component (Template 2)

**Purpose**: Display book ratings with celestial-themed stars

**Structure**:
```html
<div class="star-rating" data-rating="4.5">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4.5 out of 5 stars</span>
</div>
```

**CSS Styling**:
- Gold stars matching logo aesthetic
- Half-star support using CSS clip-path or gradient
- Accessible with screen reader text

#### 9. Currently Reading Section (Template 1)

**Purpose**: Highlight current book being read

**Structure**:
```html
<section class="currently-reading">
  <h2>Currently Reading</h2>
  <div class="reading-card">
    <img src="current-book.jpg" alt="Current book cover">
    <div class="reading-info">
      <h3>Book Title</h3>
      <p class="author">by Author Name</p>
      <div class="reading-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: 65%"></div>
        </div>
        <p class="progress-text">65% complete</p>
      </div>
      <p class="reading-thoughts">My thoughts so far...</p>
    </div>
  </div>
</section>
```

#### 10. Book of the Month Section (Template 3)

**Purpose**: Feature monthly book recommendation

**Structure**:
```html
<section class="book-of-month">
  <div class="botm-badge">Book of the Month</div>
  <div class="botm-content">
    <img src="featured-book.jpg" alt="Book of the Month cover">
    <div class="botm-details">
      <h2>Book Title</h2>
      <p class="author">by Author Name</p>
      <p class="description">Why this book is special...</p>
      <a href="blog-post.html" class="btn-gold">Read Full Review</a>
      <a href="affiliate-link" class="btn-outline">Buy Now</a>
    </div>
  </div>
</section>
```

### Form Components

#### Contact Form

**Structure**:
```html
<form class="contact-form" action="#" method="post">
  <div class="form-group">
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required>
    <span class="error-message" role="alert"></span>
  </div>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email" required>
    <span class="error-message" role="alert"></span>
  </div>
  <div class="form-group">
    <label for="message">Message</label>
    <textarea id="message" name="message" rows="5" required></textarea>
    <span class="error-message" role="alert"></span>
  </div>
  <button type="submit" class="btn-gold">Send Message</button>
  <div class="success-message" role="status"></div>
</form>
```

**JavaScript Validation**:
```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validateForm(formElement) {
  let isValid = true;
  const inputs = formElement.querySelectorAll('input[required], textarea[required]');
  
  inputs.forEach(input => {
    if (!input.value.trim()) {
      showError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !validateEmail(input.value)) {
      showError(input, 'Please enter a valid email address');
      isValid = false;
    } else {
      clearError(input);
    }
  });
  
  return isValid;
}
```

## Data Models

### Page Structure Model

Each HTML page follows a consistent structure:

```
Document
├── <!DOCTYPE html>
├── <html lang="en">
│   ├── <head>
│   │   ├── Meta tags (charset, viewport, description)
│   │   ├── Title
│   │   ├── Open Graph tags
│   │   ├── Favicon links
│   │   ├── CSS links
│   │   └── Font links
│   └── <body>
│       ├── <header> (Site Header Component)
│       ├── <main>
│       │   └── Page-specific content
│       ├── <footer> (Site Footer Component)
│       ├── Newsletter Modal (if applicable)
│       └── <script> tags
```

### CSS Custom Properties (Variables)

Each template defines a consistent set of CSS variables for easy customization:

```css
:root {
  /* Brand Colors */
  --color-gold-primary: #D4AF37;
  --color-gold-light: #F4E4C1;
  --color-black-primary: #1A1A1A;
  --color-black-secondary: #2C2C2C;
  --color-cream-primary: #FFF8E7;
  --color-cream-secondary: #F5F5DC;
  --color-neutral-warm-1: #D7CCC8;
  --color-neutral-warm-2: #BCAAA4;
  
  /* Typography */
  --font-primary: 'Font Name', serif;
  --font-secondary: 'Font Name', sans-serif;
  --font-size-base: 16px;
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-h3: 1.5rem;
  --line-height-base: 1.6;
  --line-height-heading: 1.2;
  
  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  
  /* Layout */
  --container-max-width: 1200px;
  --header-height: 80px;
  --border-radius: 8px;
  
  /* Transitions */
  --transition-speed: 0.3s;
  --transition-easing: ease-in-out;
}
```

### Blog Post Data Structure

While templates use static HTML, the structure anticipates CMS integration:

```javascript
// Conceptual data model for blog posts
{
  id: "unique-post-id",
  title: "Book Review: Title",
  slug: "book-review-title",
  author: "Chikielau",
  publishDate: "2026-01-15",
  featuredImage: {
    url: "path/to/image.jpg",
    alt: "Book cover description"
  },
  excerpt: "Brief summary...",
  content: "Full HTML content...",
  categories: ["Fiction", "Fantasy"],
  tags: ["book-review", "5-stars"],
  rating: 4.5
}
```

### Product/Book Data Structure

```javascript
// Conceptual data model for shop items
{
  id: "unique-product-id",
  title: "Book Title",
  author: "Author Name",
  coverImage: {
    url: "path/to/cover.jpg",
    alt: "Book cover"
  },
  description: "Why I recommend this book...",
  affiliateLink: "https://amazon.com/...",
  rating: 5,
  category: "Fiction"
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### File Structure and Independence Properties

Property 1: Complete file structure
*For any* template directory, it should contain all required files: 6 HTML files (index.html, blog.html, blog-post.html, about.html, shop.html, contact.html), css directory with stylesheets, js directory with scripts, assets directory with images and fonts subdirectories, and README.md file.
**Validates: Requirements 1.2**

Property 2: Consistent directory structure
*For all* three templates, the directory structure and file organization should be identical (same subdirectories, same file types in same locations).
**Validates: Requirements 1.3**

Property 3: Self-contained file references
*For any* template, all file references (CSS links, script sources, image sources, hyperlinks) should use relative paths within that template directory with no external dependencies except optional CDN font links.
**Validates: Requirements 1.4, 1.5**

### Brand Identity Properties

Property 4: Logo presence on all pages
*For any* HTML page in any template, the document should contain an img element with source pointing to the logo file.
**Validates: Requirements 2.1**

Property 5: Brand color usage
*For any* template's CSS files, color values should only use the specified brand palette hex codes: #D4AF37, #F4E4C1, #1A1A1A, #2C2C2C, #FFF8E7, #F5F5DC, #D7CCC8, #BCAAA4.
**Validates: Requirements 2.2**

Property 6: Responsive logo scaling
*For any* logo img element's CSS, it should include max-width property to ensure responsive scaling.
**Validates: Requirements 2.5**

### Page Structure Properties

Property 7: Six pages per template
*For any* template directory, it should contain exactly 6 HTML page files with the specified names.
**Validates: Requirements 3.1**

Property 8: Consistent header and footer structure
*For all* pages within a single template, the header and footer HTML structure should be identical (same elements, same classes, same navigation links).
**Validates: Requirements 3.2**

Property 9: Complete navigation links
*For any* page in any template, the navigation element should contain links (href attributes) to all 6 pages.
**Validates: Requirements 3.3**

Property 10: Semantic HTML structure
*For any* HTML page, the body should contain semantic elements: header, main, and footer.
**Validates: Requirements 3.4**

### Content and Link Properties

Property 11: Valid internal links
*For any* internal link (href to another page) in any template, the target file should exist in the template directory.
**Validates: Requirements 4.3**

Property 12: Social media link behavior
*For any* social media link element, it should have target="_blank" and rel="noopener" attributes.
**Validates: Requirements 14.5**

### Form Validation Properties

Property 13: Email input validation
*For any* email input field in any form, it should either have type="email" attribute or be associated with JavaScript validation function that tests email format using regex.
**Validates: Requirements 6.4, 15.1**

Property 14: Required field validation
*For any* form with required fields, it should either have required attributes on inputs or JavaScript validation that checks for empty values.
**Validates: Requirements 15.2**

Property 15: Form error messaging
*For any* form element, the HTML should include error message elements (with role="alert") and JavaScript should populate them when validation fails.
**Validates: Requirements 15.3**

Property 16: Form success confirmation
*For any* form element, the HTML should include a success message element (with role="status").
**Validates: Requirements 15.4**

Property 17: Form submission prevention
*For any* form's JavaScript validation function, it should call preventDefault() when validation fails.
**Validates: Requirements 15.5**

### Newsletter Integration Properties

Property 18: Newsletter form structure compatibility
*For any* newsletter form element, it should have action and method attributes and contain an email input, making it compatible with third-party services.
**Validates: Requirements 6.1**

Property 19: Newsletter modal presence
*For any* template, at least one HTML page should contain a modal element with newsletter signup form and dismissible close button.
**Validates: Requirements 6.2**

Property 20: Newsletter form in footer
*For any* page in any template, the footer element should contain a form with email input type.
**Validates: Requirements 6.3**

### Product Card Properties

Property 21: Complete product card structure
*For any* product card element on the shop page, it should contain child elements for: image, title, author, description, and CTA link/button.
**Validates: Requirements 7.2**

Property 22: CTA button styling
*For any* CTA button's CSS, it should use gold brand colors and include :hover pseudo-class with different styling.
**Validates: Requirements 7.3**

Property 23: Responsive product grid
*For any* product card container's CSS, it should use CSS Grid or Flexbox with media queries for responsive column layout.
**Validates: Requirements 7.6**

### Responsive Design Properties

Property 24: Mobile-first CSS structure
*For any* template's CSS files, base styles should be for mobile viewport and media queries should use min-width (not max-width) for progressive enhancement.
**Validates: Requirements 9.1**

Property 25: Responsive breakpoints
*For any* template's CSS files, it should include media queries at common breakpoints (at least 768px and 1024px).
**Validates: Requirements 9.2**

Property 26: Minimum font size
*For any* body text CSS rule, the font-size should be at least 16px.
**Validates: Requirements 9.3, 18.3**

Property 27: Responsive image scaling
*For any* img element's CSS, it should include max-width: 100% and height: auto properties.
**Validates: Requirements 9.4**

Property 28: Mobile navigation toggle
*For any* template, the HTML should include a navigation toggle button element and JavaScript should include toggle functionality for mobile menu.
**Validates: Requirements 9.5**

### Code Quality Properties

Property 29: No framework dependencies
*For any* HTML or JavaScript file, it should not contain imports or script sources for frameworks (jQuery, React, Vue, Angular, Bootstrap).
**Validates: Requirements 10.1, 10.4**

Property 30: Separation of concerns
*For any* HTML file, it should not contain inline style attributes or inline script tags (except for external script loading).
**Validates: Requirements 10.2, 10.3**

Property 31: Code comments presence
*For any* CSS or JavaScript file, it should contain comment syntax (/* */ or //) explaining key sections.
**Validates: Requirements 10.6**

Property 32: Valid HTML structure
*For any* HTML file, when validated against W3C HTML5 standards, it should produce zero errors.
**Validates: Requirements 10.7**

### Performance Properties

Property 33: Optimized image file sizes
*For any* image file in assets directory, the file size should be reasonable for its dimensions (under 500KB for photos, under 100KB for icons).
**Validates: Requirements 11.1**

Property 34: Lazy loading for images
*For any* img element that appears below the fold (not in hero/header), it should include loading="lazy" attribute.
**Validates: Requirements 11.4**

Property 35: Minimal HTTP requests
*For any* HTML page, the number of external CSS link tags plus external script tags should be minimized (ideally under 5 total).
**Validates: Requirements 11.5**

### Accessibility Properties

Property 36: Color contrast ratios
*For any* text color and background color combination in CSS, the contrast ratio should meet WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 12.2**

Property 37: Image alt attributes
*For any* img element in any HTML file, it should have an alt attribute with descriptive text (or empty string for decorative images).
**Validates: Requirements 12.3**

Property 38: Keyboard navigation support
*For any* interactive element (a, button, input, textarea, select), it should not have tabindex="-1" or negative tabindex values.
**Validates: Requirements 12.4**

Property 39: Heading hierarchy
*For any* HTML page, it should contain exactly one h1 element and heading levels should be sequential (no skipping from h2 to h4).
**Validates: Requirements 12.5**

Property 40: ARIA labels for icon buttons
*For any* button element without visible text content, it should have aria-label or aria-labelledby attribute.
**Validates: Requirements 12.6**

Property 41: Form input labels
*For any* input, textarea, or select element, it should have an associated label element (via for attribute matching id, or wrapping label).
**Validates: Requirements 12.7**

### SEO Properties

Property 42: Semantic HTML5 elements
*For any* HTML page, it should use semantic elements (article, section, nav, aside, header, footer) rather than generic div elements for major content areas.
**Validates: Requirements 13.1**

Property 43: Meta tags presence
*For any* HTML page, the head should contain meta tags for: charset, viewport, description, and Open Graph (og:title, og:description, og:image).
**Validates: Requirements 13.2**

Property 44: Clean URL structure
*For any* internal link href attribute, it should use clean filenames (descriptive-name.html) without query parameters.
**Validates: Requirements 13.3**

### Social Media Properties

Property 45: Social media icon files
*For any* template, the assets/images/icons directory should contain icon files for Instagram, TikTok, and Goodreads.
**Validates: Requirements 14.1**

Property 46: Social media links on all pages
*For any* page in any template, either the header or footer should contain links to social media profiles with appropriate icon images.
**Validates: Requirements 14.2**

Property 47: Social icon styling
*For any* social media icon's CSS, it should use gold brand colors and include :hover pseudo-class styling.
**Validates: Requirements 14.3**

### Typography Properties

Property 48: Web-safe font loading
*For any* HTML page, font loading should use either Google Fonts link tag or CSS font-family with system font stack fallbacks.
**Validates: Requirements 18.2**

Property 49: Proper line height
*For any* body text CSS rule, the line-height should be between 1.5 and 1.8.
**Validates: Requirements 18.4**

Property 50: Font fallback stack
*For any* font-family CSS declaration, it should include at least 2 fonts in the stack (primary font plus fallback).
**Validates: Requirements 18.6**

### Asset Management Properties

Property 51: Placeholder images presence
*For any* template, the assets/images/placeholders directory should contain example images for different content types.
**Validates: Requirements 19.1**

Property 52: Image layout integrity
*For any* img element's CSS, it should include object-fit property to maintain layout when images are replaced.
**Validates: Requirements 19.3**

Property 53: Organized image directory
*For any* image file referenced in HTML, it should be located within the assets/images directory structure.
**Validates: Requirements 19.4**

### Documentation Properties

Property 54: README completeness
*For any* template's README.md file, it should contain sections for: template description, design philosophy, color palette, font specifications, customization guide, Hostinger integration, newsletter integration, Instagram integration, and image guidelines.
**Validates: Requirements 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 18.5, 19.5**

Property 55: Documentation for affiliate links
*For any* template's README.md file, it should contain a section explaining how to add and manage affiliate links.
**Validates: Requirements 7.5**

Property 56: Documentation for form integration
*For any* template's README.md file, it should contain a section explaining how to connect forms to backend services.
**Validates: Requirements 6.5, 15.6**

## Error Handling

### Form Validation Errors

**Email Format Validation**:
```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address'
    };
  }
  return { valid: true };
}
```

**Empty Field Validation**:
```javascript
function validateRequired(value, fieldName) {
  if (!value || value.trim() === '') {
    return {
      valid: false,
      message: `${fieldName} is required`
    };
  }
  return { valid: true };
}
```

**Error Display**:
```javascript
function showError(inputElement, message) {
  const errorElement = inputElement.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('error');
    inputElement.setAttribute('aria-invalid', 'true');
  }
}

function clearError(inputElement) {
  const errorElement = inputElement.parentElement.querySelector('.error-message');
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('error');
    inputElement.removeAttribute('aria-invalid');
  }
}
```

### JavaScript Graceful Degradation

All JavaScript functionality should be implemented with progressive enhancement:

- **Newsletter Modal**: If JavaScript fails, footer form still works
- **Mobile Menu**: If JavaScript fails, CSS-only fallback or all links visible
- **Carousel**: If JavaScript fails, first slide visible with CSS
- **Form Validation**: HTML5 validation attributes as fallback

### Image Loading Errors

**Fallback for Missing Images**:
```css
img {
  background-color: var(--color-cream-primary);
  border: 1px solid var(--color-neutral-warm-1);
}

img::before {
  content: '';
  display: block;
  padding-top: 66.67%; /* 3:2 aspect ratio */
}

img::after {
  content: 'Image not found';
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--color-neutral-warm-2);
}
```

### Browser Compatibility Fallbacks

**CSS Grid Fallback**:
```css
/* Flexbox fallback for older browsers */
.product-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Modern grid for supporting browsers */
@supports (display: grid) {
  .product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }
}
```

**CSS Custom Properties Fallback**:
```css
.btn-gold {
  background-color: #D4AF37; /* Fallback */
  background-color: var(--color-gold-primary);
}
```

## Testing Strategy

### Dual Testing Approach

This project requires both **unit tests** and **property-based tests** for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and integration points
- **Property tests**: Verify universal properties across all inputs through randomization

### Unit Testing Focus Areas

Unit tests should focus on:

1. **Specific Examples**:
   - Template 1 has exactly the expected files
   - Blog archive page contains post card elements
   - Shop page contains product card elements
   - Each template's color scheme matches specification

2. **Edge Cases**:
   - Empty form submission attempts
   - Invalid email format submissions
   - Missing image files
   - Very long text content

3. **Integration Points**:
   - Newsletter modal displays and dismisses correctly
   - Mobile menu toggle functionality
   - Carousel navigation and auto-advance
   - Form submission with validation

4. **Template-Specific Features**:
   - Template 1: Carousel functionality, Currently Reading section
   - Template 2: Star rating display, split-screen hero
   - Template 3: Book of the Month section, sticky navigation

### Property-Based Testing Configuration

**Testing Library**: Use **fast-check** (for JavaScript/Node.js testing environment)

**Configuration**:
- Minimum **100 iterations** per property test
- Each test must reference its design document property
- Tag format: `Feature: chikielau-website-templates, Property {number}: {property_text}`

**Example Property Test Structure**:
```javascript
const fc = require('fast-check');

// Feature: chikielau-website-templates, Property 3: Self-contained file references
test('all file references use relative paths within template', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        // Check all src and href attributes
        const externalRefs = [];
        $('[src], [href]').each((i, elem) => {
          const attr = $(elem).attr('src') || $(elem).attr('href');
          if (attr && (attr.startsWith('http://') || attr.startsWith('https://')) && !attr.includes('fonts.googleapis.com')) {
            externalRefs.push(attr);
          }
        });
        
        return externalRefs.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: chikielau-website-templates, Property 9: Complete navigation links
test('navigation contains links to all 6 pages', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const navLinks = $('nav a').map((i, el) => $(el).attr('href')).get();
        const requiredPages = ['index.html', 'blog.html', 'about.html', 'shop.html', 'contact.html'];
        
        return requiredPages.every(page => navLinks.includes(page) || navLinks.includes(page.replace('.html', '')));
      }
    ),
    { numRuns: 100 }
  );
});

// Feature: chikielau-website-templates, Property 37: Image alt attributes
test('all images have alt attributes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const imagesWithoutAlt = $('img').filter((i, elem) => {
          return !$(elem).attr('alt') && $(elem).attr('alt') !== '';
        }).length;
        
        return imagesWithoutAlt === 0;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Validation Testing

**HTML Validation**:
- Use W3C HTML validator API or local validator
- Test all HTML files in all templates
- Zero errors required for compliance

**CSS Validation**:
- Use W3C CSS validator or stylelint
- Check for syntax errors and browser compatibility

**Accessibility Testing**:
- Use axe-core or pa11y for automated accessibility testing
- Verify WCAG 2.1 AA compliance
- Test color contrast ratios programmatically

**Responsive Testing**:
- Test at breakpoints: 320px, 375px, 768px, 1024px, 1440px, 1920px
- Verify layout integrity at each breakpoint
- Check for horizontal scrolling issues

### Manual Testing Checklist

While automated tests cover most properties, some aspects require manual verification:

1. **Visual Design Quality**:
   - Brand aesthetic consistency
   - Typography readability and pairing
   - Color harmony and visual hierarchy
   - Spacing and alignment

2. **Cross-Browser Testing**:
   - Chrome (latest 2 versions)
   - Firefox (latest 2 versions)
   - Safari (latest 2 versions)
   - Edge (latest 2 versions)

3. **User Experience**:
   - Navigation intuitiveness
   - Form submission flow
   - Mobile menu usability
   - Touch target sizes on mobile

4. **Performance**:
   - Page load times (target: under 3 seconds)
   - Image loading behavior
   - Smooth scrolling and animations

### Test Organization

```
tests/
├── unit/
│   ├── template-structure.test.js
│   ├── component-rendering.test.js
│   ├── form-validation.test.js
│   └── template-specific.test.js
├── property/
│   ├── file-structure.property.test.js
│   ├── html-validity.property.test.js
│   ├── accessibility.property.test.js
│   ├── responsive.property.test.js
│   └── documentation.property.test.js
├── validation/
│   ├── html-validator.test.js
│   ├── css-validator.test.js
│   └── accessibility-validator.test.js
└── helpers/
    ├── file-utils.js
    ├── html-parser.js
    └── css-parser.js
```

## Implementation Notes

### Development Workflow

1. **Create Base Structure**: Set up directory structure for all three templates
2. **Develop Template 1**: Complete implementation of Literary Lounge
3. **Test Template 1**: Run all tests and validate
4. **Develop Template 2**: Complete implementation of Celestial Bookshelf
5. **Test Template 2**: Run all tests and validate
6. **Develop Template 3**: Complete implementation of Moonlit Pages
7. **Test Template 3**: Run all tests and validate
8. **Cross-Template Validation**: Verify consistency and independence
9. **Documentation**: Complete all README files
10. **Final Testing**: Run full test suite and manual checks

### Code Reusability

While templates are independent, development can leverage:
- **Shared component patterns**: Copy and adapt components between templates
- **Common CSS utilities**: Reusable utility classes (with template-specific styling)
- **JavaScript modules**: Similar functionality (forms, modals) with template-specific styling

### Customization Points

Each template should have clear customization points documented:
- CSS variables for colors and spacing
- HTML sections marked with comments
- JavaScript configuration objects
- Image replacement guidelines

### Platform Integration Notes

**Hostinger Website Builder**:
- Templates can be uploaded as custom HTML
- Forms may need Hostinger form handler integration
- Consider Hostinger's built-in features for contact forms

**WordPress Integration**:
- Templates can be converted to WordPress themes
- HTML structure maps to WordPress template hierarchy
- Forms can integrate with WordPress plugins (Contact Form 7, WPForms)

**Wix Integration**:
- Templates serve as design reference for Wix Editor
- Code can be added via Wix's custom code features
- Forms integrate with Wix Forms app

## Conclusion

This design provides a comprehensive blueprint for creating three distinct, professional website templates for the Chikielau brand. Each template balances aesthetic uniqueness with functional consistency, ensuring brand identity while offering varied user experiences. The modular, well-documented approach enables both technical and non-technical users to deploy and customize these templates effectively.
