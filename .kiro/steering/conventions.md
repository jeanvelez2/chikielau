# Coding Conventions

## General Rules

- No build tools, bundlers, or transpilers — ship raw HTML/CSS/JS
- No frontend frameworks — vanilla JavaScript only
- Keep it simple: each file has a single clear responsibility
- All API functions use ESM (`export default async function handler(req, res)`)

## HTML

- All pages live in the project root (not in subdirectories)
- Every page includes `variables.css` and `styles.css` with cache-busting query strings (`?v=11`)
- Scripts loaded at end of `<body>`: `translations.js` first, then `script.js`, then page-specific scripts
- Use `data-i18n` attributes for translatable text, `data-i18n-placeholder` for inputs, `data-i18n-aria` for accessibility labels
- Include Open Graph meta tags and Schema.org JSON-LD on every page
- Use semantic HTML5 elements (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`)
- All images use `loading="lazy"` and descriptive `alt` text
- Forms include `.error-message` and `.success-message` elements for feedback
- Accessibility: `aria-expanded` on toggles, `aria-hidden` on modals, `aria-label` on icon links, `aria-invalid` on errored inputs

## CSS

- All design tokens defined in `variables.css` as CSS custom properties
- Never use hardcoded color/spacing values in `styles.css` — always reference `var(--token-name)`
- Mobile-first: base styles for mobile, then `@media (min-width: 768px)`, `1024px`, `1440px`
- BEM-inspired naming: `.block`, `.block__element`, `.block--modifier`
- Use the defined z-index scale (`--z-index-dropdown` through `--z-index-tooltip`)
- Transitions use `--transition-speed` and `--transition-easing` variables
- When updating CSS, bump the `?v=` query string on all HTML pages that reference it

## JavaScript

- No `var` — use `const` by default, `let` when reassignment is needed
- Functions: camelCase. Classes: PascalCase. Constants: UPPER_SNAKE_CASE
- Wrap all initialization in `DOMContentLoaded` listener
- Guard DOM queries: check element existence before attaching listeners (`if (!el) return`)
- Use `localStorage` with try/catch wrappers (via `setStorage`/`getStorage` helpers)
- Translation-aware: use `window.languageManager.translate(key)` for dynamic text
- Async/await for all API calls, with try/catch error handling
- No console.log in production — use `console.error` or `console.warn` only for actual issues

## API Functions (Vercel Serverless)

- One function per file in `/api`
- Validate HTTP method first, return 405 for wrong methods
- Validate all input fields, return 400 with descriptive error messages
- Auth-protected endpoints check headers before any processing
- Return consistent JSON shape: `{ success: true, ... }` or `{ error: "message" }`
- Use `process.env` for all secrets — never hardcode credentials
- Dynamic imports for heavy modules (`await import('nodemailer')`)
- Log errors with `console.error` for Vercel function logs

## Translation Keys

- Dot-notation namespacing: `section.subsection.element` (e.g., `hero.title`, `form.error.required`)
- Both `en` and `es` keys must always be added together
- HTML elements get `data-i18n="key"`, the default English text stays as innerHTML
