---
inclusion: always
---

# Project Structure & Architecture Conventions

## Root Directory Organization

```
chikielau-templates/
├── .kiro/
│   ├── specs/
│   │   └── chikielau-website-templates/
│   │       ├── requirements.md
│   │       ├── design.md
│   │       └── tasks.md
│   └── steering/
│       ├── product.md
│       ├── tech.md
│       └── structure.md
├── template-1-literary-lounge/
├── template-2-celestial-bookshelf/
├── template-3-moonlit-pages/
└── README.md (root-level overview)
```

## Template Directory Structure

**CRITICAL**: Each template is completely self-contained with identical structure. When creating or modifying files:
- Use relative paths within the template directory only
- Never reference files from other templates
- Maintain consistent directory structure across all templates

```
template-{number}-{name}/
├── index.html                 # Homepage
├── blog.html                  # Blog archive page
├── blog-post.html             # Single post template
├── about.html                 # About page
├── shop.html                  # Shop/recommendations page
├── contact.html               # Contact page
├── css/
│   ├── variables.css         # CSS custom properties (ALWAYS edit this for theme changes)
│   └── styles.css            # Main stylesheet
├── js/
│   └── script.js             # Main JavaScript (vanilla ES6+)
├── assets/
│   ├── images/
│   │   ├── logo.svg          # Chikielau logo (SVG preferred)
│   │   ├── placeholders/     # Example images
│   │   └── icons/            # Social media icons (Instagram, TikTok, Goodreads)
│   └── fonts/                # Self-hosted fonts (optional)
└── README.md                 # Template documentation
```

## File Naming Conventions

**Always use lowercase with hyphens (kebab-case)**:
- HTML: `blog-post.html`, `about.html`
- CSS: `variables.css`, `styles.css`
- JavaScript: `script.js`, `form-validation.js`
- Images: `book-cover-placeholder.jpg`, `hero-image.png`
- Directories: `template-1-literary-lounge`, `assets/images/placeholders`

## HTML Page Structure Template

**All HTML pages MUST follow this structure**:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="[Page-specific description]">
  <!-- Open Graph meta tags -->
  <title>[Page Title] - Chikielau</title>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/styles.css">
  <!-- Google Fonts link -->
</head>
<body>
  <header class="site-header">
    <!-- Logo and navigation -->
  </header>
  
  <main>
    <!-- Page-specific content -->
  </main>
  
  <footer class="site-footer">
    <!-- Newsletter form, social links, copyright -->
  </footer>
  
  <!-- Newsletter modal (if applicable) -->
  
  <script src="js/script.js"></script>
</body>
</html>
```

**Rules**:
- No inline styles or inline scripts
- CSS files loaded in `<head>` (variables.css before styles.css)
- JavaScript files loaded at end of `<body>`
- Semantic HTML5 elements required (`<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`)
- Proper heading hierarchy (single `<h1>` per page, sequential h2-h6)

## Component Architecture

### Core Components (Required in All Templates)

When creating or modifying templates, ensure these components exist:

1. **Header Component** (`.site-header`)
   - Logo with link to homepage
   - Navigation menu (`<nav>` with `<ul>` list)
   - Mobile menu toggle button (hamburger icon)
   - ARIA labels for accessibility

2. **Footer Component** (`.site-footer`)
   - Newsletter signup form with email validation
   - Social media icon links (Instagram, TikTok, Goodreads)
   - Copyright notice
   - Proper `rel="noopener noreferrer"` on external links

3. **Blog Post Card** (`.blog-post-card`)
   - Featured image with alt text
   - Post title (h2 or h3)
   - Excerpt/preview text
   - Metadata (date, category, read time)
   - "Read More" link

4. **Product Card** (`.product-card`)
   - Book cover image with alt text
   - Book title and author
   - Description/review excerpt
   - "Buy Now" CTA button with affiliate link
   - Proper external link attributes

5. **Newsletter Modal** (`.newsletter-modal`)
   - Popup form with email input
   - Close/dismiss button
   - localStorage persistence (don't show again)
   - Configurable delay (default 5 seconds)

6. **Instagram Feed Section** (`.instagram-feed`)
   - Grid layout (2x3 or 3x3)
   - Placeholder for widget integration
   - Responsive grid behavior

### Template-Specific Components

**Template 1 (Literary Lounge)**:
- Featured book carousel with navigation arrows
- "Currently Reading" spotlight section

**Template 2 (Celestial Bookshelf)**:
- Star rating component (1-5 stars, visual and semantic)
- Split-screen hero layout
- Side/hamburger navigation with celestial icons

**Template 3 (Moonlit Pages)**:
- "Book of the Month" featured section
- Sticky minimalist header on scroll

## CSS Architecture

### variables.css Structure

**ALWAYS define these CSS custom properties**:

```css
:root {
  /* Brand Colors */
  --color-gold-primary: #D4AF37;
  --color-gold-light: #F4E4C1;
  --color-black-primary: #1A1A1A;
  --color-black-secondary: #2C2C2C;
  --color-cream-primary: #FFF8E7;
  --color-cream-secondary: #F5F5DC;
  
  /* Typography */
  --font-heading: 'Font Name', serif;
  --font-body: 'Font Name', sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;
  
  /* Spacing Scale */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 3rem;
  --spacing-xl: 4rem;
  
  /* Layout */
  --container-max-width: 1200px;
  --header-height: 80px;
  --border-radius: 8px;
  
  /* Transitions */
  --transition-speed: 0.3s;
  --transition-easing: ease-in-out;
}
```

**Rules**:
- Use CSS variables for all colors, spacing, and typography
- Never hardcode color values in styles.css
- Update variables.css for theme customization

### styles.css Organization

**Follow this order**:

1. CSS Reset/Normalize
2. Base Styles (html, body, typography)
3. Layout Utilities (.container, .grid, .flex)
4. Component Styles (header, footer, cards, forms)
5. Page-Specific Styles (homepage, blog, shop)
6. Media Queries (mobile-first: 768px, 1024px, 1440px)

**Naming Convention**: Use BEM-like class names
- Block: `.blog-post-card`
- Element: `.blog-post-card__title`
- Modifier: `.blog-post-card--featured`

## JavaScript Architecture

### script.js Structure

**Follow this pattern**:

```javascript
// 1. Configuration constants
const CONFIG = {
  modalDelay: 5000,
  carouselInterval: 5000,
  mobileBreakpoint: 768
};

// 2. Utility functions
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function showError(input, message) {
  // Error display logic
}

// 3. Component initialization functions
function initMobileMenu() {
  // Mobile menu toggle logic
}

function initNewsletterModal() {
  // Modal display and localStorage logic
}

function initForms() {
  // Form validation and submission
}

// 4. Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNewsletterModal();
  initForms();
});
```

**Rules**:
- Use vanilla JavaScript only (no jQuery, React, Vue)
- Use ES6+ features (const/let, arrow functions, template literals)
- Use event delegation for dynamic content
- Progressive enhancement (core functionality works without JS)
- Add comments for complex logic

## Asset Specifications

### Image Requirements

**Logo**:
- Format: SVG (preferred) or PNG with transparency
- Dimensions: 200x200px
- Location: `assets/images/logo.svg`

**Blog Featured Images**:
- Dimensions: 1200x630px (Open Graph optimized)
- Format: JPG or PNG
- Max size: 500KB

**Book Covers**:
- Aspect ratio: 2:3 (e.g., 400x600px)
- Format: JPG or PNG
- Max size: 200KB

**Social Icons**:
- Format: SVG only
- Style: Gold accents matching brand
- Icons needed: Instagram, TikTok, Goodreads

### Font Loading

**Preferred**: Google Fonts CDN
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=[Font+Name]&display=swap" rel="stylesheet">
```

**Alternative**: Self-hosted in `assets/fonts/`
- Always include fallback font stacks
- Use `font-display: swap` for performance

## Template Independence

**Critical Rule**: Each template must be completely self-contained with no cross-template dependencies.

- All file references use relative paths within the template directory
- No shared CSS or JavaScript files between templates
- Each template can be deployed independently
- Identical directory structure ensures consistency

## Documentation Structure

### Template README.md
Each template's README includes:
1. Template description and design philosophy
2. Color palette reference with hex codes
3. Font specifications and Google Fonts links
4. Customization guide (colors, logo, content)
5. Hostinger deployment instructions
6. Newsletter service integration (Mailchimp/ConvertKit)
7. Instagram feed integration options
8. Image dimension guidelines
9. Affiliate link management
10. Form backend integration

### Root README.md
Project overview including:
- Description of all three templates
- Quick start guide for each template
- System requirements and browser compatibility
- Links to individual template READMEs
- License and contact information

## Testing Structure

```
tests/
├── unit/                      # Specific examples and edge cases
│   ├── template-structure.test.js
│   ├── component-rendering.test.js
│   ├── form-validation.test.js
│   └── template-specific.test.js
├── property/                  # Universal properties (PBT)
│   ├── file-structure.property.test.js
│   ├── html-validity.property.test.js
│   ├── accessibility.property.test.js
│   ├── responsive.property.test.js
│   └── documentation.property.test.js
├── validation/                # Standards compliance
│   ├── html-validator.test.js
│   ├── css-validator.test.js
│   └── accessibility-validator.test.js
└── helpers/                   # Test utilities
    ├── file-utils.js
    ├── html-parser.js
    └── css-parser.js
```

## Development Workflow

1. Create base directory structure for all templates
2. Develop and test Template 1 completely
3. Develop and test Template 2 completely
4. Develop and test Template 3 completely
5. Run cross-template validation
6. Complete all documentation
7. Final testing and quality assurance

## Key Principles

- **Modularity**: Components are reusable and clearly separated
- **Consistency**: Identical structure across all three templates
- **Independence**: Each template is self-contained and deployable
- **Simplicity**: No build tools, no complex dependencies
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Documentation**: Clear instructions for non-technical users
