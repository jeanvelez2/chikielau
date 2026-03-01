# Project Structure

## Directory Organization

```
.
├── api/                      # Vercel serverless functions
│   ├── contact.js           # Contact form handler
│   ├── cron-refresh.js      # Automated token refresh
│   ├── instagram.js         # Instagram feed API
│   └── refresh-token.js     # Manual token refresh
│
├── assets/                   # Static assets
│   ├── fonts/               # Custom fonts (currently empty)
│   └── images/              # Images and graphics
│       ├── icons/           # SVG social media icons
│       └── placeholders/    # Placeholder images for content
│
├── css/                      # Stylesheets
│   ├── variables.css        # CSS custom properties (design tokens)
│   └── styles.css           # Main stylesheet
│
├── js/                       # Client-side JavaScript
│   ├── script.js            # Main application logic
│   ├── instagram.js         # Instagram feed client
│   └── translations.js      # i18n translations (EN/ES)
│
├── documentation/            # Project documentation
│   ├── README.md            # Main documentation
│   ├── CONTACT_FORM_SETUP.md
│   ├── GITHUB_ACTIONS_SETUP.md
│   ├── INSTAGRAM_SETUP.md
│   └── LANGUAGE_FEATURE.md
│
├── .github/                  # GitHub configuration
│   └── workflows/           # GitHub Actions workflows
│
├── .kiro/                    # Kiro AI configuration
│   └── steering/            # AI steering rules
│
├── *.html                    # HTML pages (root level)
├── package.json             # Node.js dependencies
├── vercel.json              # Vercel configuration
└── .env.example             # Environment variables template
```

## HTML Pages

All HTML pages are in the root directory:
- `index.html` - Homepage with hero, featured posts, Instagram feed
- `blog.html` - Blog listing page
- `blog-full.html` - Full blog listing
- `blog-post.html` - Individual blog post template
- `shop.html` - Shop page
- `shop-full.html` - Full shop listing
- `about.html` - About page
- `contact.html` - Contact page with form
- `newsletter.html` - Newsletter page

## Code Organization Patterns

### CSS Architecture

- **variables.css**: All design tokens (colors, spacing, typography, breakpoints)
- **styles.css**: Component styles organized by section
- Mobile-first responsive design
- CSS custom properties for theming
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)

### JavaScript Architecture

- **script.js**: Core functionality (mobile menu, modal, forms, validation)
- **instagram.js**: Instagram feed client with caching
- **translations.js**: Bilingual content management
- Vanilla JavaScript, no frameworks
- Event-driven architecture
- Utility functions at top of files

### API Functions

- Each serverless function is a separate file in `/api`
- Export default async handler function
- Environment variables for configuration
- Error handling with appropriate HTTP status codes
- CORS headers configured in `vercel.json`

## Naming Conventions

### Files
- HTML: kebab-case (e.g., `blog-post.html`)
- CSS: kebab-case (e.g., `variables.css`)
- JavaScript: camelCase (e.g., `instagram.js`)
- API functions: kebab-case (e.g., `cron-refresh.js`)

### CSS Classes
- BEM-inspired: `.component-name`, `.component-name__element`, `.component-name--modifier`
- Examples: `.post-card`, `.post-card-image`, `.post-card-large`

### JavaScript
- Functions: camelCase (e.g., `validateEmail`, `initMobileMenu`)
- Constants: UPPER_SNAKE_CASE (e.g., `CONFIG`, `API_URL`)
- Classes: PascalCase (e.g., `InstagramFeed`)

## Asset Organization

### Images
- Brand assets: Root of `/assets/images`
- Icons: `/assets/images/icons` (SVG format)
- Placeholders: `/assets/images/placeholders` (SVG format)
- Use descriptive names: `book-cover-1.svg`, `blog-featured-1.svg`

### Fonts
- Custom fonts go in `/assets/fonts`
- Currently using Google Fonts (Playfair Display, Lato)

## Configuration Files

- `.env.example` - Template for environment variables
- `vercel.json` - Vercel platform configuration
- `package.json` - Node.js dependencies and metadata
- `.gitignore` - Git ignore patterns
