---
inclusion: always
---

# Technology Stack & Code Standards

## Core Technology Constraints

**CRITICAL**: This project uses ONLY vanilla web technologies with zero build tools or frameworks.

- **HTML5**: Semantic markup with proper document structure
- **CSS3**: Modern CSS with custom properties, Flexbox, Grid
- **JavaScript (ES6+)**: Vanilla JavaScript ONLY - absolutely no frameworks or libraries
- **Dependencies**: Self-contained except Google Fonts CDN (optional)
- **Build System**: NONE - all files deploy directly without compilation or bundling

When writing code:
- Never suggest React, Vue, Angular, jQuery, Bootstrap, or any framework
- Never suggest npm packages for runtime dependencies (testing packages are OK)
- Never suggest build tools (webpack, Vite, Parcel, etc.)
- All code must run directly in the browser without transpilation

## Testing Framework

**fast-check**: Property-based testing library for JavaScript/Node.js

When writing tests:
- Use minimum 100 iterations per property test
- Property tests validate universal properties across all inputs
- Unit tests verify specific examples and edge cases
- Both test types are required for comprehensive coverage

## Browser Support Targets

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

Write code compatible with these browsers without polyfills or transpilation.

## Deployment Platforms

**Primary**: Hostinger (direct file upload via File Manager)
**Secondary**: WordPress (convertible), Wix (adaptable)

All templates must be deployable as static files without server-side processing.

## CSS Architecture & Patterns

### CSS Custom Properties (Required)

**ALWAYS use CSS variables for theming**. Never hardcode colors, spacing, or typography values in styles.css.

Required variable structure in `variables.css`:
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

### CSS Design Patterns

When writing CSS:
- Use BEM-like naming: `.block`, `.block__element`, `.block--modifier`
- Mobile-first responsive design (base styles for 320px, enhance upward)
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Separate concerns: structure (HTML), presentation (CSS), behavior (JS)
- Load order: `variables.css` before `styles.css` in HTML `<head>`

### CSS File Organization

Order in `styles.css`:
1. CSS Reset/Normalize
2. Base Styles (html, body, typography)
3. Layout Utilities (.container, .grid, .flex)
4. Component Styles (header, footer, cards, forms)
5. Page-Specific Styles (homepage, blog, shop)
6. Media Queries (mobile-first progression)

## JavaScript Patterns & Standards

### Required Patterns

When writing JavaScript:
- Use ES6+ features: `const`/`let`, arrow functions, template literals, destructuring
- Progressive enhancement: core functionality must work without JS
- Event delegation for dynamic content
- DOMContentLoaded for initialization
- No global variables (use IIFE or modules)

### Code Structure Template

```javascript
// 1. Configuration constants
const CONFIG = {
  modalDelay: 5000,
  mobileBreakpoint: 768
};

// 2. Utility functions
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// 3. Component initialization
function initMobileMenu() {
  // Implementation
}

function initNewsletterModal() {
  // Implementation
}

// 4. Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNewsletterModal();
});
```

### Forbidden Patterns

Never use:
- jQuery or any DOM manipulation library
- Framework-specific syntax (JSX, Vue templates, Angular directives)
- npm packages for runtime functionality
- `var` keyword (use `const`/`let`)
- Inline event handlers in HTML (`onclick`, etc.)

## HTML Standards

### Required Structure

Every HTML page must include:
- `<!DOCTYPE html>` declaration
- `<html lang="en">` attribute
- Proper `<meta>` tags (charset, viewport, description)
- CSS in `<head>`: `variables.css` then `styles.css`
- JavaScript at end of `<body>`
- Semantic HTML5 elements: `<header>`, `<main>`, `<footer>`, `<nav>`, `<article>`, `<section>`

### Forbidden Patterns

Never use:
- Inline styles (`style="..."`)
- Inline scripts (`onclick="..."`, `<script>` in body except at end)
- Non-semantic divs where semantic elements exist
- Multiple `<h1>` tags per page
- Skip heading levels (h1 → h3 without h2)

## Accessibility Requirements (WCAG 2.1 AA)

When writing code, ensure:
- Minimum contrast ratios: 4.5:1 (normal text), 3:1 (large text, 18pt+)
- All interactive elements keyboard accessible (Tab, Enter, Space, Escape)
- ARIA labels on icon buttons and complex widgets
- Form inputs have associated `<label>` elements
- Images have descriptive `alt` attributes
- Focus indicators visible on all interactive elements
- Proper heading hierarchy (single h1, sequential h2-h6)
- Skip navigation links for keyboard users

## Performance Standards

When implementing features:
- Page load time: Under 3 seconds on standard broadband
- Image optimization: <500KB for photos, <100KB for icons/SVGs
- Lazy loading: Implement for images below the fold
- Minimal HTTP requests: <5 external resources per page
- Use `loading="lazy"` attribute on images
- Use `rel="preconnect"` for external domains (Google Fonts)

## Code Quality Requirements

### Validation

All code must pass:
- W3C HTML5 validation (zero errors)
- W3C CSS validation (zero errors)
- WCAG 2.1 AA accessibility checks

### Code Style

When writing code:
- Add comments explaining complex logic or non-obvious decisions
- Use consistent naming: kebab-case for files/classes, camelCase for JS variables
- No inline styles or inline scripts
- Proper indentation (2 spaces for HTML/CSS, 2 spaces for JS)
- Meaningful variable and function names

## Common Commands

### Testing
```bash
npm test                    # Run all tests
npm run test:property       # Property-based tests only
npm run test:unit           # Unit tests only
npm run test:validate       # HTML/CSS/Accessibility validation
```

### Validation
```bash
npm run validate:html       # W3C HTML validation
npm run validate:css        # CSS validation
npm run validate:a11y       # WCAG 2.1 AA accessibility check
```

### Development
```bash
npm install                 # Install test dependencies only
npx serve .                 # Local development server (optional)
```

## Critical Reminders for AI Assistants

1. **No frameworks**: If you suggest React, Vue, jQuery, or any framework, you are violating project constraints
2. **No build tools**: Code must run directly in browsers without compilation
3. **CSS variables first**: Always check `variables.css` before hardcoding values
4. **Mobile-first**: Write base styles for mobile, enhance for larger screens
5. **Accessibility**: Every interactive element needs keyboard support and ARIA labels
6. **Validation**: All HTML/CSS must pass W3C validation with zero errors
7. **Testing**: Write both unit tests (examples) and property tests (universal properties)
8. **Self-contained**: Each template is independent with no cross-template dependencies
