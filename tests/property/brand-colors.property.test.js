/**
 * Property-Based Tests for Brand Color Usage
 * Feature: chikielau-website-templates
 * 
 * These tests verify that all CSS files use only the approved brand color palette.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const path = require('path');
const {
  getCSSFiles,
  readCSSFile,
  extractHexColors,
  normalizeHexColor,
  isColorInPalette
} = require('../helpers/css-parser');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Approved brand color palette (from Requirements 2.2)
const BRAND_COLORS = [
  '#D4AF37', // Gold primary
  '#F4E4C1', // Gold light
  '#1A1A1A', // Black primary
  '#2C2C2C', // Black secondary
  '#FFF8E7', // Cream primary
  '#F5F5DC', // Cream secondary
  '#D7CCC8', // Neutral warm 1
  '#BCAAA4'  // Neutral warm 2
];

// Additional allowed colors for transparency and special cases
const ALLOWED_EXCEPTIONS = [
  '#FFFFFF', // White (for text, backgrounds)
  '#000000', // Pure black (for text, shadows)
  '#FFF',    // White shorthand
  '#000'     // Black shorthand
];

/**
 * Property 5: Brand color usage
 * **Validates: Requirements 2.2**
 * 
 * For any template's CSS files, color values should only use the specified 
 * brand palette hex codes: #D4AF37, #F4E4C1, #1A1A1A, #2C2C2C, #FFF8E7, 
 * #F5F5DC, #D7CCC8, #BCAAA4.
 */
test('Property 5: All CSS files use only brand palette colors', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFiles = getCSSFiles(templatePath);
        
        // Should have at least one CSS file
        if (cssFiles.length === 0) {
          console.error(`\nNo CSS files found in ${template}`);
          return false;
        }
        
        let allColorsValid = true;
        const invalidColors = [];
        
        // Check each CSS file
        for (const cssFile of cssFiles) {
          const content = readCSSFile(cssFile);
          const hexColors = extractHexColors(content);
          
          // Check each hex color
          for (const color of hexColors) {
            const normalized = normalizeHexColor(color);
            
            // Check if color is in brand palette or allowed exceptions
            const isValid = isColorInPalette(color, BRAND_COLORS) || 
                           isColorInPalette(color, ALLOWED_EXCEPTIONS);
            
            if (!isValid) {
              allColorsValid = false;
              invalidColors.push({
                file: path.relative(process.cwd(), cssFile),
                color: normalized
              });
            }
          }
        }
        
        if (!allColorsValid) {
          console.error(`\nInvalid colors found in ${template}:`);
          invalidColors.forEach(({ file, color }) => {
            console.error(`  ${file}: ${color}`);
          });
          console.error(`\nAllowed brand colors:`, BRAND_COLORS);
          console.error(`Allowed exceptions:`, ALLOWED_EXCEPTIONS);
        }
        
        return allColorsValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 5a: CSS files contain brand colors
 * **Validates: Requirements 2.2**
 * 
 * Each template's CSS files should actually use the brand colors
 * (not just avoid invalid colors).
 */
test('Property 5a: CSS files contain at least one brand color', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFiles = getCSSFiles(templatePath);
        
        if (cssFiles.length === 0) {
          console.error(`\nNo CSS files found in ${template}`);
          return false;
        }
        
        let hasBrandColors = false;
        
        // Check each CSS file
        for (const cssFile of cssFiles) {
          const content = readCSSFile(cssFile);
          const hexColors = extractHexColors(content);
          
          // Check if any color is from the brand palette
          for (const color of hexColors) {
            if (isColorInPalette(color, BRAND_COLORS)) {
              hasBrandColors = true;
              break;
            }
          }
          
          if (hasBrandColors) break;
        }
        
        if (!hasBrandColors) {
          console.error(`\nNo brand colors found in ${template} CSS files`);
          console.error(`Expected to find at least one of:`, BRAND_COLORS);
        }
        
        return hasBrandColors;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 5b: Specific CSS files use only brand colors
 * **Validates: Requirements 2.2**
 * 
 * Test each individual CSS file to ensure it uses only brand colors.
 */
test('Property 5b: Each CSS file individually uses only brand colors', () => {
  // Get all CSS files from all templates
  const allCSSFiles = [];
  
  for (const template of TEMPLATES) {
    const templatePath = path.join(process.cwd(), template);
    const cssFiles = getCSSFiles(templatePath);
    allCSSFiles.push(...cssFiles.map(file => ({ template, file })));
  }
  
  if (allCSSFiles.length === 0) {
    console.error('\nNo CSS files found in any template');
    assert.fail('No CSS files found');
  }
  
  fc.assert(
    fc.property(
      fc.constantFrom(...allCSSFiles),
      ({ template, file }) => {
        const content = readCSSFile(file);
        const hexColors = extractHexColors(content);
        
        const invalidColors = [];
        
        for (const color of hexColors) {
          const normalized = normalizeHexColor(color);
          const isValid = isColorInPalette(color, BRAND_COLORS) || 
                         isColorInPalette(color, ALLOWED_EXCEPTIONS);
          
          if (!isValid) {
            invalidColors.push(normalized);
          }
        }
        
        if (invalidColors.length > 0) {
          console.error(`\nInvalid colors in ${path.relative(process.cwd(), file)}:`);
          console.error(`  Colors: ${[...new Set(invalidColors)].join(', ')}`);
        }
        
        return invalidColors.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 5c: Brand colors are consistently defined
 * **Validates: Requirements 2.2**
 * 
 * All templates should define the same brand colors in their variables.
 */
test('Property 5c: All templates define the same brand colors', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const variablesFile = path.join(templatePath, 'css', 'variables.css');
        
        // Check if variables.css exists
        const fs = require('fs');
        if (!fs.existsSync(variablesFile)) {
          console.error(`\nMissing variables.css in ${template}`);
          return false;
        }
        
        const content = readCSSFile(variablesFile);
        const hexColors = extractHexColors(content);
        
        // Check that all brand colors are defined
        let allBrandColorsDefined = true;
        const missingColors = [];
        
        for (const brandColor of BRAND_COLORS) {
          const found = hexColors.some(color => 
            normalizeHexColor(color) === normalizeHexColor(brandColor)
          );
          
          if (!found) {
            allBrandColorsDefined = false;
            missingColors.push(brandColor);
          }
        }
        
        if (!allBrandColorsDefined) {
          console.error(`\nMissing brand colors in ${template}/css/variables.css:`);
          console.error(`  Missing: ${missingColors.join(', ')}`);
        }
        
        return allBrandColorsDefined;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 5d: No unapproved colors in any template
 * **Validates: Requirements 2.2**
 * 
 * Comprehensive check across all templates and all CSS files.
 */
test('Property 5d: No unapproved colors across all templates', () => {
  const allInvalidColors = [];
  
  for (const template of TEMPLATES) {
    const templatePath = path.join(process.cwd(), template);
    const cssFiles = getCSSFiles(templatePath);
    
    for (const cssFile of cssFiles) {
      const content = readCSSFile(cssFile);
      const hexColors = extractHexColors(content);
      
      for (const color of hexColors) {
        const normalized = normalizeHexColor(color);
        const isValid = isColorInPalette(color, BRAND_COLORS) || 
                       isColorInPalette(color, ALLOWED_EXCEPTIONS);
        
        if (!isValid) {
          allInvalidColors.push({
            template,
            file: path.relative(process.cwd(), cssFile),
            color: normalized
          });
        }
      }
    }
  }
  
  if (allInvalidColors.length > 0) {
    console.error('\n=== INVALID COLORS FOUND ===');
    allInvalidColors.forEach(({ template, file, color }) => {
      console.error(`${template}/${file}: ${color}`);
    });
    console.error('\n=== ALLOWED COLORS ===');
    console.error('Brand colors:', BRAND_COLORS.join(', '));
    console.error('Exceptions:', ALLOWED_EXCEPTIONS.join(', '));
  }
  
  assert.strictEqual(allInvalidColors.length, 0, 
    `Found ${allInvalidColors.length} invalid color(s) across all templates`);
});
