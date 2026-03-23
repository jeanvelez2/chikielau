# Hook: API Function Validation
# Triggers when serverless functions in /api are modified
# Ensures consistent patterns across all API endpoints

version: 1
triggers:
  - type: on_file_change
    pattern: "api/**/*.js"

instructions: |
  When an API function is created or modified, verify it follows the project's
  serverless function conventions:

  Required patterns:
  1. Uses ESM export: `export default async function handler(req, res)`
  2. Validates HTTP method first and returns 405 for wrong methods
  3. Validates all input fields and returns 400 with descriptive error messages
  4. Returns consistent JSON: `{ success: true, ... }` or `{ error: "message" }`
  5. Uses `process.env` for secrets — no hardcoded credentials
  6. Uses `console.error` for error logging (not `console.log`)
  7. Auth-protected endpoints check auth headers before any processing
  8. Heavy modules use dynamic imports (`await import('modulename')`)

  Only flag patterns that are actually violated — don't re-report correct patterns.
