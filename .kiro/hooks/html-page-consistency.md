# Hook: HTML Page Consistency
# Triggers when any HTML file in the root is created or modified
# Ensures new pages follow the established template pattern

version: 1
triggers:
  - type: on_file_change
    pattern: "*.html"

instructions: |
  When an HTML page is created or modified, verify it follows the project's
  established patterns:

  Required elements:
  1. `<meta charset="UTF-8">` and `<meta name="viewport" ...>`
  2. `<meta name="description" ...>` with page-specific content
  3. Open Graph meta tags (`og:title`, `og:description`, `og:image`, `og:type`, `og:url`)
  4. Schema.org JSON-LD structured data in a `<script type="application/ld+json">` block
  5. CSS includes with version query string: `css/variables.css?v=11` and `css/styles.css?v=11`
  6. Scripts at end of `<body>` in order: `translations.js`, `script.js`, then page-specific
  7. Semantic HTML5 structure: `<header>`, `<main>`, `<footer>`
  8. `data-i18n` attributes on all user-visible text elements
  9. `lang="en"` on the `<html>` element
  10. Images use `loading="lazy"` and descriptive `alt` text

  Only flag items that are actually missing — don't re-report items that are already present.
  Skip test/temporary HTML files (e.g., `test-*.html`).
