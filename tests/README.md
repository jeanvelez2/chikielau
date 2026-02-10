# Chikielau Website Templates - Test Suite

This directory contains the comprehensive test suite for the Chikielau Website Templates project, including property-based tests, unit tests, and validation tests.

## Test Structure

```
tests/
├── property/                  # Property-based tests (PBT)
│   └── file-structure.property.test.js
├── unit/                      # Unit tests (specific examples)
├── validation/                # Standards compliance tests
└── helpers/                   # Test utilities
    └── file-utils.js
```

## Running Tests

```bash
# Run all tests
npm test

# Run property-based tests only
npm run test:property

# Run unit tests only
npm run test:unit

# Run validation tests only
npm run test:validate
```

## Property-Based Tests

Property-based tests use **fast-check** library to verify universal properties across all inputs through randomization. Each test runs a minimum of **100 iterations**.

### File Structure Properties

**Property 2: Consistent directory structure** (file-structure.property.test.js)
- **Validates: Requirements 1.3**
- Verifies all three templates have identical directory structures
- Tests include:
  - Property 2: All templates have identical directory structure
  - Property 2a: All templates contain required subdirectories
  - Property 2b: Pairwise directory structure consistency
  - Property 2c: Same file types in corresponding directories

## Test Helpers

### file-utils.js

Utility functions for file system operations in tests:

- `getDirectoryStructure(templateDir, baseDir)` - Get directory structure as sorted array
- `getFilesByType(dirPath)` - Categorize files by type (html, css, js, images, fonts)
- `directoryExists(dirPath)` - Check if directory exists
- `fileExists(filePath)` - Check if file exists
- `compareDirectoryStructures(template1, template2)` - Compare two template structures

## Test Configuration

- **Testing Framework**: Node.js built-in test runner
- **Property-Based Testing**: fast-check v3.15.0
- **Minimum Iterations**: 100 per property test
- **Test Format**: CommonJS modules

## Writing New Tests

### Property-Based Test Template

```javascript
const { test } = require('node:test');
const fc = require('fast-check');

/**
 * Property X: Description
 * **Validates: Requirements X.X**
 */
test('Property X: Description', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...inputs),
      (input) => {
        // Test logic
        return true; // or false
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Test Template

```javascript
const { test } = require('node:test');
const assert = require('node:assert');

test('should do something specific', () => {
  // Arrange
  const input = 'test';
  
  // Act
  const result = someFunction(input);
  
  // Assert
  assert.strictEqual(result, expected);
});
```

## Test Coverage

Current test coverage focuses on:
- ✅ Directory structure consistency across templates
- ⏳ File completeness (upcoming)
- ⏳ HTML validity and semantic structure (upcoming)
- ⏳ Accessibility compliance (upcoming)
- ⏳ Responsive design properties (upcoming)

## Notes

- All property tests must reference their design document property number
- Tests should provide detailed error messages for debugging
- Each test should be independent and not rely on other tests
- Property tests verify universal correctness across all valid inputs
- Unit tests verify specific examples and edge cases
