# Hook: Translation Sync
# Triggers when translations.js is modified or new data-i18n attributes are added
# Ensures both EN and ES keys stay in sync

version: 1
triggers:
  - type: on_file_change
    pattern: "js/translations.js"

instructions: |
  When translations.js is modified, verify that the `en` and `es` objects in the
  `translations` constant have matching keys.

  Steps:
  1. Parse the `translations` object in `js/translations.js`
  2. Compare keys in `translations.en` vs `translations.es`
  3. Report any keys that exist in one language but not the other
  4. If missing keys are found, suggest the missing translations (provide placeholder
     text in the target language if the actual translation isn't known)

  Key format uses dot-notation namespacing: `section.subsection.element`
  (e.g., `hero.title`, `form.error.required`)
