# Technology Stack

## Core Technologies

- **HTML5**: Semantic markup with proper document structure
- **CSS3**: Modern CSS with custom properties (CSS variables), Flexbox, and Grid
- **JavaScript (ES6+)**: Vanilla JavaScript only - no frameworks or libraries
- **No external dependencies**: All code self-contained except optional CDN fonts (Google Fonts)

## Build System

No build system required. Templates use pure HTML/CSS/JS that can be deployed directly.

## Testing Framework

**fast-check**: Property-based testing library for JavaScript/Node.js
- Minimum 100 iterations per property test
- Tests validate universal properties across all inputs

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Platform Compatibility

Templates are compatible with:
- **Hostinger**: Direct upload via File Manager (primary deployment target)
- **WordPress**: Can be converted to WordPress themes
- **Wix**: Can be adapted using Wix custom code features

## CSS Architecture

**CSS Custom Properties (Variables)**: Used for easy customization
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
  
  /* Typography, Spacing, Layout variables... */
}
```

**Design Patterns**:
- Component-based CSS with BEM-like naming conventions
- Mobile-first responsive design (base styles for mobile, progressive enhancement)
- Separation of concerns (structure/presentation/behavior)

## JavaScript Patterns

- Pure vanilla JavaScript (no jQuery, React, Vue, Angular, Bootstrap)
- Progressive enhancement (core functionality works without JS)
- Event delegation for dynamic content
- ES6+ features (arrow functions, const/let, template literals)

## Common Commands

### Testing
```bash
# Run all tests
npm test

# Run property-based tests only
npm run test:property

# Run unit tests only
npm run test:unit

# Run validation tests (HTML/CSS/Accessibility)
npm run test:validate
```

### Validation
```bash
# Validate HTML (W3C standards)
npm run validate:html

# Validate CSS
npm run validate:css

# Check accessibility (WCAG 2.1 AA)
npm run validate:a11y
```

### Development
```bash
# Install dependencies (for testing only)
npm install

# Serve locally (if using a local server)
npx serve .
```

## Performance Requirements

- Page load times: Under 3 seconds on standard broadband
- Image optimization: Under 500KB for photos, under 100KB for icons
- Lazy loading: Implemented for images below the fold
- Minimal HTTP requests: Under 5 external resources per page

## Accessibility Standards

- **WCAG 2.1 AA compliance** required
- Minimum contrast ratios: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigation support for all interactive elements
- ARIA labels where appropriate
- Semantic HTML5 elements throughout

## Code Quality Standards

- W3C HTML5 validation (zero errors)
- No inline styles or inline scripts
- Code comments explaining key sections
- Consistent naming conventions
- No framework dependencies
