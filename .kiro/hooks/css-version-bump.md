# Hook: CSS Version Bump
# Triggers when styles.css or variables.css is modified
# Reminds to bump the ?v= query string on all HTML pages

version: 1
triggers:
  - type: on_file_change
    pattern: "css/**/*.css"

instructions: |
  When CSS files are modified, remind the user to bump the `?v=` cache-busting query string
  on all HTML pages that reference the changed CSS file.

  Steps:
  1. Identify the current version number from the `?v=` query strings in HTML files
  2. Increment the version number by 1
  3. Update ALL HTML files in the project root that reference the changed CSS file
  4. Report which files were updated and the new version number

  Example: `css/styles.css?v=11` → `css/styles.css?v=12`

  HTML files to check: index.html, blog.html, blog-full.html, blog-post.html,
  shop.html, shop-full.html, about.html, contact.html, newsletter.html
