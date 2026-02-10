/**
 * Property-Based Tests for Heading Hierarchy
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about heading hierarchy
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Required HTML files
const HTML_FILES = [
  'index.html',
  'blog.html',
  'blog-post.html',
  'about.html',
  'shop.html',
  'contact.html'
];

/**
 * Helper function to parse HTML file and return DOM
 * @param {string} filePath - Path to HTML file
 * @returns {Document} - Parsed DOM document
 */
function parseHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(content);
  return dom.window.document;
}

/**
 * Helper function to get all heading elements from a document
 * @param {Document} document - DOM document
 * @returns {Array} - Array of heading elements with their levels
 */
function getHeadings(document) {
  const headings = [];
  
  for (let level = 1; level <= 6; level++) {
    const elements = document.querySelectorAll(`h${level}`);
    elements.forEach((element) => {
      headings.push({
        level,
        element,
        text: element.textContent.trim()
      });
    });
  }
  
  // Sort by document order using compareDocumentPosition
  // DOCUMENT_POSITION_FOLLOWING = 4
  headings.sort((a, b) => {
    const position = a.element.compareDocumentPosition(b.element);
    return position & 4 ? -1 : 1;
  });
  
  return headings;
}

/**
 * Property 39: Heading hierarchy
 * **Validates: Requirements 12.5**
 * 
 * For any HTML page, it should contain exactly one h1 element and 
 * heading levels should be sequential (no skipping from h2 to h4).
 */
test('Property 39: Each page has exactly one h1 element', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error(`\nFile does not exist: ${template}/${htmlFile}`);
          return false;
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all h1 elements
        const h1Elements = document.querySelectorAll('h1');
        const h1Count = h1Elements.length;
        
        if (h1Count !== 1) {
          console.error(`\nExpected exactly 1 h1 element in ${template}/${htmlFile}, found ${h1Count}`);
          
          if (h1Count === 0) {
            console.error('  - No h1 element found');
          } else {
            console.error(`  - Found ${h1Count} h1 elements:`);
            h1Elements.forEach((h1, index) => {
              console.error(`    ${index + 1}. "${h1.textContent.trim()}"`);
            });
          }
          
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39a: Heading levels are sequential (no skipping)
 * **Validates: Requirements 12.5**
 * 
 * Heading levels should not skip (e.g., h2 should not be followed by h4).
 * Each heading level should only increase by 1 at most.
 */
test('Property 39a: Heading levels are sequential without skipping', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all headings in document order
        const headings = getHeadings(document);
        
        if (headings.length === 0) {
          console.error(`\nNo headings found in ${template}/${htmlFile}`);
          return false;
        }
        
        // Check for level skipping
        const violations = [];
        
        for (let i = 1; i < headings.length; i++) {
          const prevLevel = headings[i - 1].level;
          const currentLevel = headings[i].level;
          
          // If level increases, it should only increase by 1
          if (currentLevel > prevLevel && currentLevel - prevLevel > 1) {
            violations.push({
              index: i,
              prevLevel,
              prevText: headings[i - 1].text,
              currentLevel,
              currentText: headings[i].text,
              skip: currentLevel - prevLevel
            });
          }
        }
        
        if (violations.length > 0) {
          console.error(`\nHeading level skipping violations in ${template}/${htmlFile}:`);
          violations.forEach((v) => {
            console.error(`  - h${v.prevLevel} "${v.prevText}" → h${v.currentLevel} "${v.currentText}" (skipped ${v.skip - 1} level${v.skip - 1 > 1 ? 's' : ''})`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39b: First heading is h1
 * **Validates: Requirements 12.5**
 * 
 * The first heading element in the document should be an h1.
 */
test('Property 39b: First heading element is h1', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all headings in document order
        const headings = getHeadings(document);
        
        if (headings.length === 0) {
          return false; // No headings found
        }
        
        const firstHeading = headings[0];
        const isH1 = firstHeading.level === 1;
        
        if (!isH1) {
          console.error(`\nFirst heading is not h1 in ${template}/${htmlFile}:`);
          console.error(`  - Found h${firstHeading.level}: "${firstHeading.text}"`);
        }
        
        return isH1;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39c: h1 element has non-empty text content
 * **Validates: Requirements 12.5**
 * 
 * The h1 element should have meaningful, non-empty text content.
 */
test('Property 39c: h1 element has non-empty text content', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get h1 element
        const h1 = document.querySelector('h1');
        
        if (!h1) {
          return false; // No h1 found
        }
        
        const text = h1.textContent.trim();
        const hasContent = text.length > 0;
        
        if (!hasContent) {
          console.error(`\nh1 element has empty text content in ${template}/${htmlFile}`);
        }
        
        return hasContent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39d: All heading elements have non-empty text content
 * **Validates: Requirements 12.5**
 * 
 * All heading elements (h1-h6) should have meaningful, non-empty text content.
 */
test('Property 39d: All heading elements have non-empty text content', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all headings
        const headings = getHeadings(document);
        
        if (headings.length === 0) {
          return false; // No headings found
        }
        
        // Check for empty headings
        const emptyHeadings = headings.filter(h => h.text.length === 0);
        
        if (emptyHeadings.length > 0) {
          console.error(`\nEmpty heading elements in ${template}/${htmlFile}:`);
          emptyHeadings.forEach((h) => {
            console.error(`  - h${h.level} has no text content`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39e: Heading hierarchy is logical for screen readers
 * **Validates: Requirements 12.5**
 * 
 * The heading structure should provide a logical outline for screen readers.
 * After h1, subsequent headings should form a proper hierarchy.
 */
test('Property 39e: Heading hierarchy forms logical document outline', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all headings
        const headings = getHeadings(document);
        
        if (headings.length === 0) {
          return false; // No headings found
        }
        
        // Check that we have at least h1
        const hasH1 = headings.some(h => h.level === 1);
        
        if (!hasH1) {
          console.error(`\nNo h1 element found in ${template}/${htmlFile} - cannot form logical outline`);
          return false;
        }
        
        // Check that all headings after h1 are properly nested
        // (This is already covered by the sequential test, but we verify the overall structure)
        let maxLevelSeen = 1;
        const structureIssues = [];
        
        for (let i = 0; i < headings.length; i++) {
          const heading = headings[i];
          
          // Track maximum level seen so far
          if (heading.level > maxLevelSeen + 1) {
            structureIssues.push({
              level: heading.level,
              text: heading.text,
              maxLevelSeen
            });
          }
          
          maxLevelSeen = Math.max(maxLevelSeen, heading.level);
        }
        
        if (structureIssues.length > 0) {
          console.error(`\nHeading hierarchy issues in ${template}/${htmlFile}:`);
          structureIssues.forEach((issue) => {
            console.error(`  - h${issue.level} "${issue.text}" appears before any h${issue.maxLevelSeen + 1}`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39f: No heading level exceeds h6
 * **Validates: Requirements 12.5**
 * 
 * HTML only supports heading levels h1 through h6.
 * This test ensures no invalid heading elements exist.
 */
test('Property 39f: No invalid heading levels beyond h6', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all headings
        const headings = getHeadings(document);
        
        // Check that no heading level exceeds 6
        const invalidHeadings = headings.filter(h => h.level > 6);
        
        if (invalidHeadings.length > 0) {
          console.error(`\nInvalid heading levels in ${template}/${htmlFile}:`);
          invalidHeadings.forEach((h) => {
            console.error(`  - h${h.level} "${h.text}" (max level is h6)`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 39g: Heading hierarchy is consistent across pages
 * **Validates: Requirements 12.5**
 * 
 * All pages within a template should follow similar heading patterns
 * (all start with h1, use similar level progressions).
 */
test('Property 39g: All pages in template start with h1', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        
        // Check all HTML files in this template
        const pagesWithoutH1 = [];
        
        HTML_FILES.forEach((htmlFile) => {
          const filePath = path.join(templatePath, htmlFile);
          
          if (!fs.existsSync(filePath)) {
            return; // Skip if file doesn't exist
          }
          
          const document = parseHtmlFile(filePath);
          const h1Elements = document.querySelectorAll('h1');
          
          if (h1Elements.length !== 1) {
            pagesWithoutH1.push({
              file: htmlFile,
              count: h1Elements.length
            });
          }
        });
        
        if (pagesWithoutH1.length > 0) {
          console.error(`\nPages without exactly one h1 in ${template}:`);
          pagesWithoutH1.forEach((page) => {
            console.error(`  - ${page.file}: ${page.count} h1 element${page.count !== 1 ? 's' : ''}`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
