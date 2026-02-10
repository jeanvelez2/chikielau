/**
 * Property-Based Tests for Font Size Requirements
 * Feature: chikielau-website-templates
 * 
 * These tests verify that body text meets minimum font size requirements
 * for readability and accessibility.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const path = require('path');
const {
  getCSSFiles,
  readCSSFile,
  extractBodyTextFontSizes,
  parseFontSizeToPixels
} = require('../helpers/css-parser');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Minimum font size for body text (Requirements 9.3, 18.3)
const MIN_BODY_FONT_SIZE_PX = 16;

/**
 * Property 26: Minimum font size
 * **Validates: Requirements 9.3, 18.3**
 * 
 * For any body text CSS rule, the font-size should be at least 16px.
 */
test('Property 26: Body text has minimum 16px font size', () => {
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
        
        let allFontSizesValid = true;
        const invalidFontSizes = [];
        
        // Check each CSS file
        for (const cssFile of cssFiles) {
          const content = readCSSFile(cssFile);
          const bodyTextFontSizes = extractBodyTextFontSizes(content);
          
          // Check each body text font-size
          for (const fontSizeDecl of bodyTextFontSizes) {
            const pixelSize = parseFontSizeToPixels(fontSizeDecl.value);
            
            // Skip if we can't parse (e.g., CSS variables)
            if (pixelSize === null) {
              continue;
            }
            
            // Check if font size is below minimum
            if (pixelSize < MIN_BODY_FONT_SIZE_PX) {
              allFontSizesValid = false;
              invalidFontSizes.push({
                file: path.relative(process.cwd(), cssFile),
                selectors: fontSizeDecl.selectors,
                value: fontSizeDecl.value,
                pixelSize: pixelSize.toFixed(2) + 'px'
              });
            }
          }
        }
        
        if (!allFontSizesValid) {
          console.error(`\nBody text with font size below ${MIN_BODY_FONT_SIZE_PX}px found in ${template}:`);
          invalidFontSizes.forEach(({ file, selectors, value, pixelSize }) => {
            console.error(`  ${file}`);
            console.error(`    Selectors: ${selectors}`);
            console.error(`    Value: ${value} (${pixelSize})`);
          });
          console.error(`\nMinimum required: ${MIN_BODY_FONT_SIZE_PX}px`);
        }
        
        return allFontSizesValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 26a: Base font size is at least 16px
 * **Validates: Requirements 9.3, 18.3**
 * 
 * The base font size (typically on body or html) should be at least 16px.
 */
test('Property 26a: Base font size is at least 16px', () => {
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
        
        let baseFontSizeValid = true;
        const baseFontSizes = [];
        
        // Check each CSS file for body/html font-size
        for (const cssFile of cssFiles) {
          const content = readCSSFile(cssFile);
          
          // Look for body or html font-size declarations
          const bodyMatch = content.match(/body\s*\{[^}]*font-size\s*:\s*([^;]+);/i);
          const htmlMatch = content.match(/html\s*\{[^}]*font-size\s*:\s*([^;]+);/i);
          
          if (bodyMatch) {
            const value = bodyMatch[1].trim();
            const pixelSize = parseFontSizeToPixels(value);
            
            if (pixelSize !== null) {
              baseFontSizes.push({
                file: path.relative(process.cwd(), cssFile),
                selector: 'body',
                value,
                pixelSize
              });
              
              if (pixelSize < MIN_BODY_FONT_SIZE_PX) {
                baseFontSizeValid = false;
              }
            }
          }
          
          if (htmlMatch) {
            const value = htmlMatch[1].trim();
            const pixelSize = parseFontSizeToPixels(value);
            
            if (pixelSize !== null) {
              baseFontSizes.push({
                file: path.relative(process.cwd(), cssFile),
                selector: 'html',
                value,
                pixelSize
              });
              
              if (pixelSize < MIN_BODY_FONT_SIZE_PX) {
                baseFontSizeValid = false;
              }
            }
          }
        }
        
        if (!baseFontSizeValid) {
          console.error(`\nBase font size below ${MIN_BODY_FONT_SIZE_PX}px found in ${template}:`);
          baseFontSizes.forEach(({ file, selector, value, pixelSize }) => {
            if (pixelSize < MIN_BODY_FONT_SIZE_PX) {
              console.error(`  ${file}`);
              console.error(`    Selector: ${selector}`);
              console.error(`    Value: ${value} (${pixelSize.toFixed(2)}px)`);
            }
          });
        }
        
        return baseFontSizeValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 26b: No body text uses small font sizes
 * **Validates: Requirements 9.3, 18.3**
 * 
 * Comprehensive check across all templates for body text font sizes.
 */
test('Property 26b: No body text uses font size below 16px across all templates', () => {
  const allInvalidFontSizes = [];
  
  for (const template of TEMPLATES) {
    const templatePath = path.join(process.cwd(), template);
    const cssFiles = getCSSFiles(templatePath);
    
    for (const cssFile of cssFiles) {
      const content = readCSSFile(cssFile);
      const bodyTextFontSizes = extractBodyTextFontSizes(content);
      
      for (const fontSizeDecl of bodyTextFontSizes) {
        const pixelSize = parseFontSizeToPixels(fontSizeDecl.value);
        
        // Skip if we can't parse (e.g., CSS variables)
        if (pixelSize === null) {
          continue;
        }
        
        if (pixelSize < MIN_BODY_FONT_SIZE_PX) {
          allInvalidFontSizes.push({
            template,
            file: path.relative(process.cwd(), cssFile),
            selectors: fontSizeDecl.selectors,
            value: fontSizeDecl.value,
            pixelSize: pixelSize.toFixed(2) + 'px'
          });
        }
      }
    }
  }
  
  if (allInvalidFontSizes.length > 0) {
    console.error('\n=== BODY TEXT WITH FONT SIZE BELOW 16PX ===');
    allInvalidFontSizes.forEach(({ template, file, selectors, value, pixelSize }) => {
      console.error(`${template}/${file}:`);
      console.error(`  Selectors: ${selectors}`);
      console.error(`  Value: ${value} (${pixelSize})`);
    });
    console.error(`\n=== REQUIREMENT ===`);
    console.error(`Minimum body text font size: ${MIN_BODY_FONT_SIZE_PX}px`);
  }
  
  assert.strictEqual(allInvalidFontSizes.length, 0, 
    `Found ${allInvalidFontSizes.length} body text font size(s) below ${MIN_BODY_FONT_SIZE_PX}px`);
});

/**
 * Property 26c: CSS variables for font sizes are reasonable
 * **Validates: Requirements 9.3, 18.3**
 * 
 * Check that CSS variable definitions for font sizes meet minimum requirements.
 */
test('Property 26c: CSS variable font sizes are at least 16px for body text', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const variablesFile = path.join(templatePath, 'css', 'variables.css');
        
        // Check if variables.css exists
        const fs = require('fs');
        if (!fs.existsSync(variablesFile)) {
          // Variables file is optional, so this is not a failure
          return true;
        }
        
        const content = readCSSFile(variablesFile);
        const invalidVariables = [];
        
        // Look for font-size variable definitions
        // Match patterns like: --font-size-base: 16px;
        const variablePattern = /--(font-size-[^:]+):\s*([^;]+);/gi;
        let match;
        
        while ((match = variablePattern.exec(content)) !== null) {
          const varName = match[1];
          const value = match[2].trim();
          const pixelSize = parseFontSizeToPixels(value);
          
          // Check if this is a base/body font size variable
          if (varName.includes('base') || varName.includes('body')) {
            if (pixelSize !== null && pixelSize < MIN_BODY_FONT_SIZE_PX) {
              invalidVariables.push({
                variable: `--${varName}`,
                value,
                pixelSize: pixelSize.toFixed(2) + 'px'
              });
            }
          }
        }
        
        if (invalidVariables.length > 0) {
          console.error(`\nFont size variables below ${MIN_BODY_FONT_SIZE_PX}px in ${template}:`);
          invalidVariables.forEach(({ variable, value, pixelSize }) => {
            console.error(`  ${variable}: ${value} (${pixelSize})`);
          });
        }
        
        return invalidVariables.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});
