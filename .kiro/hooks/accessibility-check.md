# Hook: Accessibility Check
# Triggers when HTML files are modified
# Ensures accessibility standards are maintained

version: 1
triggers:
  - type: on_file_change
    pattern: "*.html"

instructions: |
  When HTML is modified, check for accessibility compliance in the changed sections:

  Check for:
  1. All `<img>` tags have descriptive `alt` attributes (not empty, not just filenames)
  2. Interactive elements (buttons, links) have accessible names via text content, `aria-label`, or `aria-labelledby`
  3. Toggle buttons use `aria-expanded`
  4. Modals use `aria-hidden` when closed
  5. Form inputs have associated `<label>` elements or `aria-label`
  6. Icon-only links have `aria-label` describing the destination
  7. Color contrast: text uses `--color-text-primary` (#FFF8E7) or `--color-text-secondary` (#D7CCC8) on dark backgrounds — avoid `--color-text-muted` (#BCAAA4) for essential content
  8. Focus management: modals trap focus, ESC closes overlays

  Only flag new accessibility issues in the changed code — don't audit the entire file.
  Skip test/temporary HTML files (e.g., `test-*.html`).
