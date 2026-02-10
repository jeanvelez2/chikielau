# Project Structure

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

Each template follows an identical structure for consistency:

```
template-name/
├── index.html                 # Homepage
├── blog.html                  # Blog archive page
├── blog-post.html             # Single post template
├── about.html                 # About page
├── shop.html                  # Shop/recommendations page
├── contact.html               # Contact page
├── css/
│   ├── variables.css         # CSS custom properties (colors, fonts, spacing)
│   ├── styles.css            # Main stylesheet
│   └── components.css        # Reusable component styles (optional)
├── js/
│   ├── script.js             # Main JavaScript
│   └── components.js         # Component-specific JS (optional)
├── assets/
│   ├── images/
│   │   ├── logo.png          # Chikielau logo
│   │   ├── placeholders/     # Example images for content
│   │   └── icons/            # Social media icons (Instagram, TikTok, Goodreads)
│   └── fonts/                # Web fonts (if self-hosted)
└── README.md                 # Template-specific documentation
```

## File Naming Conventions

- **HTML files**: Lowercase with hyphens (e.g., `blog-post.html`)
- **CSS files**: Lowercase with hyphens (e.g., `variables.css`)
- **JavaScript files**: Lowercase with hyphens (e.g., `script.js`)
- **Image files**: Descriptive lowercase with hyphens (e.g., `book-cover-placeholder.jpg`)
- **Directories**: Lowercase with hyphens (e.g., `template-1-literary-lounge`)

## Page Structure

All HTML pages follow this consistent structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Meta tags: charset, viewport, description, Open Graph -->
  <title>Page Title - Chikielau</title>
  <!-- CSS links -->
  <!-- Font links (Google Fonts) -->
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
  
  <!-- JavaScript files -->
</body>
</html>
```

## Component Organization

### Reusable Components

Each template includes these core components:

1. **Header Component**: Logo, navigation, mobile menu toggle
2. **Footer Component**: Newsletter form, social media icons, copyright
3. **Blog Post Card**: Preview card with image, title, excerpt, metadata
4. **Product Card**: Book recommendation with cover, description, CTA button
5. **Newsletter Modal**: Popup signup form with dismiss functionality
6. **Instagram Feed**: Integration area for Instagram content

### Template-Specific Components

- **Template 1**: Featured book carousel, "Currently Reading" section
- **Template 2**: Star rating component, split-screen hero
- **Template 3**: "Book of the Month" section, sticky header

## CSS Organization

### variables.css
Contains all CSS custom properties:
- Brand colors (gold, black, cream, neutrals)
- Typography (font families, sizes, line heights)
- Spacing scale (xs, sm, md, lg, xl)
- Layout values (container width, header height, border radius)
- Transitions (speed, easing)

### styles.css
Main stylesheet structure:
1. CSS reset/normalize
2. Base typography and body styles
3. Layout utilities
4. Component styles
5. Page-specific styles
6. Responsive media queries (mobile-first)

## JavaScript Organization

### script.js
Main JavaScript file includes:
- Mobile menu toggle functionality
- Form validation functions
- Newsletter modal logic
- Carousel functionality (Template 1)
- Sticky header behavior (Template 3)

### Code Structure Pattern
```javascript
// Configuration
const CONFIG = {
  modalDelay: 5000,
  carouselInterval: 5000
};

// Utility functions
function validateEmail(email) { ... }
function showError(input, message) { ... }

// Component initialization
function initMobileMenu() { ... }
function initNewsletterModal() { ... }
function initForms() { ... }

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNewsletterModal();
  initForms();
});
```

## Asset Management

### Images
- **Logo**: 200x200px PNG with transparent background
- **Blog featured images**: 1200x630px (Open Graph optimized)
- **Book covers**: 400x600px (2:3 aspect ratio)
- **Social icons**: SVG format with gold accents
- **Placeholders**: Provided in each template for reference

### Fonts
- Loaded via Google Fonts CDN (preferred)
- Or self-hosted in `assets/fonts/` directory
- Always include fallback font stacks

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
