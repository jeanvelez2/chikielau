# Project Structure

## Directory Organization

```
.
├── api/                      # Vercel serverless functions
│   ├── contact.js           # Contact form handler (POST, Gmail SMTP)
│   ├── cron-refresh.js      # Automated token refresh (Bearer auth)
│   ├── instagram.js         # Instagram feed API (GET, cached)
│   └── refresh-token.js     # Manual token refresh (x-refresh-secret)
│
├── assets/                   # Static assets
│   ├── fonts/               # Custom fonts (currently empty)
│   └── images/              # Images and graphics
│       ├── icons/           # SVG social media icons
│       └── placeholders/    # Placeholder images for content
│
├── css/                      # Stylesheets
│   ├── variables.css        # CSS custom properties (design tokens)
│   └── styles.css           # Main stylesheet (~61KB)
│
├── js/                       # Client-side JavaScript
│   ├── script.js            # Core: mobile menu, modal, forms, contact submit
│   ├── instagram.js         # InstagramFeed class with localStorage caching
│   └── translations.js      # i18n system (EN/ES) with LanguageManager class
│
├── documentation/            # Project documentation
│   ├── README.md            # Main documentation
│   ├── CONTACT_FORM_SETUP.md
│   ├── GITHUB_ACTIONS_SETUP.md
│   ├── INSTAGRAM_SETUP.md
│   ├── LANGUAGE_FEATURE.md
│   └── TRADUCCION_COMPLETA.md
│
├── .github/                  # GitHub configuration
│   └── workflows/
│       └── refresh-instagram-token.yml  # Monthly cron backup
│
├── .kiro/                    # Kiro AI configuration
│   ├── steering/            # AI steering rules
│   └── hooks/               # Agent hooks (event-triggered)
│
├── *.html                    # HTML pages (root level)
├── package.json             # Node.js deps (nodemailer only)
├── vercel.json              # Vercel config (cron, CORS, functions)
└── .env.example             # Environment variables template
```

## HTML Pages

All HTML pages are in the root directory:
- `index.html` - Homepage with hero, featured posts, Instagram feed, newsletter modal
- `blog.html` - Blog listing page (coming soon)
- `blog-full.html` - Full blog listing
- `blog-post.html` - Individual blog post template
- `shop.html` - Shop page (coming soon)
- `shop-full.html` - Full shop listing
- `about.html` - About page with bio, reading stats, favorite genres
- `contact.html` - Contact page with form (submits to /api/contact)
- `newsletter.html` - Newsletter page

## Code Organization Patterns

### CSS Architecture

- **variables.css**: All design tokens (colors, spacing, typography, breakpoints, z-index, shadows)
- **styles.css**: Component styles organized by section
- Mobile-first responsive design
- CSS custom properties for theming
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- BEM-inspired class naming: `.component-name`, `.component-name__element`
- CSS files versioned via query string (`?v=11`)

### JavaScript Architecture

- **script.js**: Core functionality
  - `CONFIG` object for settings
  - Utility functions: `validateEmail`, `showError`, `clearError`, `setStorage`, `getStorage`
  - Component inits: `initMobileMenu`, `initNewsletterModal`, `initForms`
  - `submitContactForm` async function for API calls
  - All init via `DOMContentLoaded`
- **instagram.js**: `InstagramFeed` class
  - Constructor takes containerId + options
  - localStorage caching with TTL (1 hour)
  - Auto-initializes on DOMContentLoaded if `#instagram-feed` exists
- **translations.js**: Bilingual content management
  - `translations` object with `en`/`es` keys
  - `LanguageManager` class with localStorage persistence
  - Uses `data-i18n`, `data-i18n-placeholder`, `data-i18n-aria` attributes
  - Exposed as `window.languageManager`
- Vanilla JavaScript, no frameworks
- Event-driven architecture

### API Functions

- Each serverless function is a separate file in `/api`
- ESM: `export default async function handler(req, res)`
- Environment variables for configuration
- Error handling with appropriate HTTP status codes
- Dynamic `import('nodemailer')` in contact.js

## Naming Conventions

### Files
- HTML: kebab-case (e.g., `blog-post.html`)
- CSS: kebab-case (e.g., `variables.css`)
- JavaScript: camelCase (e.g., `instagram.js`)
- API functions: kebab-case (e.g., `cron-refresh.js`)

### CSS Classes
- BEM-inspired: `.component-name`, `.component-name__element`, `.component-name--modifier`

### JavaScript
- Functions: camelCase (e.g., `validateEmail`, `initMobileMenu`)
- Constants: UPPER_SNAKE_CASE (e.g., `CONFIG`)
- Classes: PascalCase (e.g., `InstagramFeed`, `LanguageManager`)
