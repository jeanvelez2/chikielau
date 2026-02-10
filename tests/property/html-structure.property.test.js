/**
 * Property-Based Tests for HTML Structure
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about the HTML structure
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const assert = require('node:assert');
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
 * Property 10: Semantic HTML structure
 * **Validates: Requirements 3.4**
 * 
 * For any HTML page, the body should contain semantic elements:
 * header, main, and footer.
 */
test('Property 10: All HTML pages contain header, main, and footer elements', () => {
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
        
        // Check for semantic elements in body
        const body = document.body;
        if (!body) {
          console.error(`\nNo body element found in ${template}/${htmlFile}`);
          return false;
        }
        
        const header = body.querySelector('header');
        const main = body.querySelector('main');
        const footer = body.querySelector('footer');
        
        const hasHeader = header !== null;
        const hasMain = main !== null;
        const hasFooter = footer !== null;
        
        if (!hasHeader || !hasMain || !hasFooter) {
          console.error(`\nMissing semantic elements in ${template}/${htmlFile}:`);
          if (!hasHeader) console.error('  - Missing <header> element');
          if (!hasMain) console.error('  - Missing <main> element');
          if (!hasFooter) console.error('  - Missing <footer> element');
        }
        
        return hasHeader && hasMain && hasFooter;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10a: Header element is a direct child of body
 * **Validates: Requirements 3.4**
 * 
 * The header element should be a direct child of the body element
 * for proper semantic structure.
 */
test('Property 10a: Header element is direct child of body', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Check if header is a direct child of body
        const header = body.querySelector('header');
        if (!header) {
          return false;
        }
        
        const isDirectChild = header.parentElement === body;
        
        if (!isDirectChild) {
          console.error(`\nHeader is not a direct child of body in ${template}/${htmlFile}`);
        }
        
        return isDirectChild;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10b: Main element is a direct child of body
 * **Validates: Requirements 3.4**
 * 
 * The main element should be a direct child of the body element
 * for proper semantic structure.
 */
test('Property 10b: Main element is direct child of body', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Check if main is a direct child of body
        const main = body.querySelector('main');
        if (!main) {
          return false;
        }
        
        const isDirectChild = main.parentElement === body;
        
        if (!isDirectChild) {
          console.error(`\nMain is not a direct child of body in ${template}/${htmlFile}`);
        }
        
        return isDirectChild;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10c: Footer element is a direct child of body
 * **Validates: Requirements 3.4**
 * 
 * The footer element should be a direct child of the body element
 * for proper semantic structure.
 */
test('Property 10c: Footer element is direct child of body', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Check if footer is a direct child of body
        const footer = body.querySelector('footer');
        if (!footer) {
          return false;
        }
        
        const isDirectChild = footer.parentElement === body;
        
        if (!isDirectChild) {
          console.error(`\nFooter is not a direct child of body in ${template}/${htmlFile}`);
        }
        
        return isDirectChild;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10d: Only one header element per page
 * **Validates: Requirements 3.4**
 * 
 * Each HTML page should have exactly one header element at the body level
 * (not counting nested headers within articles or sections).
 */
test('Property 10d: Each page has exactly one header element at body level', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Count direct header children of body
        const directHeaders = Array.from(body.children).filter(
          child => child.tagName.toLowerCase() === 'header'
        );
        
        const hasExactlyOne = directHeaders.length === 1;
        
        if (!hasExactlyOne) {
          console.error(`\nExpected exactly 1 header at body level in ${template}/${htmlFile}, found ${directHeaders.length}`);
        }
        
        return hasExactlyOne;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10e: Only one main element per page
 * **Validates: Requirements 3.4**
 * 
 * Each HTML page should have exactly one main element.
 */
test('Property 10e: Each page has exactly one main element', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Count all main elements (there should only be one per document)
        const mainElements = document.querySelectorAll('main');
        
        const hasExactlyOne = mainElements.length === 1;
        
        if (!hasExactlyOne) {
          console.error(`\nExpected exactly 1 main element in ${template}/${htmlFile}, found ${mainElements.length}`);
        }
        
        return hasExactlyOne;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 10f: Only one footer element at body level
 * **Validates: Requirements 3.4**
 * 
 * Each HTML page should have exactly one footer element at the body level
 * (not counting nested footers within articles or sections).
 */
test('Property 10f: Each page has exactly one footer element at body level', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Count direct footer children of body
        const directFooters = Array.from(body.children).filter(
          child => child.tagName.toLowerCase() === 'footer'
        );
        
        const hasExactlyOne = directFooters.length === 1;
        
        if (!hasExactlyOne) {
          console.error(`\nExpected exactly 1 footer at body level in ${template}/${htmlFile}, found ${directFooters.length}`);
        }
        
        return hasExactlyOne;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43: Meta tags presence
 * **Validates: Requirements 13.2**
 * 
 * For any HTML page, the head should contain meta tags for:
 * charset, viewport, description, and Open Graph (og:title, og:description, og:image).
 */
test('Property 43: All HTML pages contain required meta tags', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          console.error(`\nFile does not exist: ${template}/${htmlFile}`);
          return false;
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        const head = document.head;
        
        if (!head) {
          console.error(`\nNo head element found in ${template}/${htmlFile}`);
          return false;
        }
        
        // Check for charset meta tag
        const charsetMeta = head.querySelector('meta[charset]');
        const hasCharset = charsetMeta !== null;
        
        // Check for viewport meta tag
        const viewportMeta = head.querySelector('meta[name="viewport"]');
        const hasViewport = viewportMeta !== null;
        
        // Check for description meta tag
        const descriptionMeta = head.querySelector('meta[name="description"]');
        const hasDescription = descriptionMeta !== null;
        
        // Check for Open Graph meta tags
        const ogTitleMeta = head.querySelector('meta[property="og:title"]');
        const hasOgTitle = ogTitleMeta !== null;
        
        const ogDescriptionMeta = head.querySelector('meta[property="og:description"]');
        const hasOgDescription = ogDescriptionMeta !== null;
        
        const ogImageMeta = head.querySelector('meta[property="og:image"]');
        const hasOgImage = ogImageMeta !== null;
        
        // Check if all required meta tags are present
        const allPresent = hasCharset && hasViewport && hasDescription && 
                          hasOgTitle && hasOgDescription && hasOgImage;
        
        if (!allPresent) {
          console.error(`\nMissing required meta tags in ${template}/${htmlFile}:`);
          if (!hasCharset) console.error('  - Missing charset meta tag');
          if (!hasViewport) console.error('  - Missing viewport meta tag');
          if (!hasDescription) console.error('  - Missing description meta tag');
          if (!hasOgTitle) console.error('  - Missing og:title meta tag');
          if (!hasOgDescription) console.error('  - Missing og:description meta tag');
          if (!hasOgImage) console.error('  - Missing og:image meta tag');
        }
        
        return allPresent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43a: Charset meta tag has valid value
 * **Validates: Requirements 13.2**
 * 
 * The charset meta tag should specify UTF-8 encoding.
 */
test('Property 43a: Charset meta tag specifies UTF-8', () => {
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
        
        const document = parseHtmlFile(filePath);
        const head = document.head;
        
        if (!head) {
          return false;
        }
        
        const charsetMeta = head.querySelector('meta[charset]');
        if (!charsetMeta) {
          return false;
        }
        
        const charset = charsetMeta.getAttribute('charset').toLowerCase();
        const isUtf8 = charset === 'utf-8';
        
        if (!isUtf8) {
          console.error(`\nCharset is not UTF-8 in ${template}/${htmlFile}: ${charset}`);
        }
        
        return isUtf8;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43b: Viewport meta tag has proper content
 * **Validates: Requirements 13.2**
 * 
 * The viewport meta tag should have content attribute for responsive design.
 */
test('Property 43b: Viewport meta tag has content attribute', () => {
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
        
        const document = parseHtmlFile(filePath);
        const head = document.head;
        
        if (!head) {
          return false;
        }
        
        const viewportMeta = head.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
          return false;
        }
        
        const content = viewportMeta.getAttribute('content');
        const hasContent = content !== null && content.trim().length > 0;
        
        if (!hasContent) {
          console.error(`\nViewport meta tag missing content in ${template}/${htmlFile}`);
        }
        
        return hasContent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43c: Description meta tag has non-empty content
 * **Validates: Requirements 13.2**
 * 
 * The description meta tag should have non-empty content attribute.
 */
test('Property 43c: Description meta tag has non-empty content', () => {
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
        
        const document = parseHtmlFile(filePath);
        const head = document.head;
        
        if (!head) {
          return false;
        }
        
        const descriptionMeta = head.querySelector('meta[name="description"]');
        if (!descriptionMeta) {
          return false;
        }
        
        const content = descriptionMeta.getAttribute('content');
        const hasContent = content !== null && content.trim().length > 0;
        
        if (!hasContent) {
          console.error(`\nDescription meta tag has empty content in ${template}/${htmlFile}`);
        }
        
        return hasContent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43d: Open Graph meta tags have non-empty content
 * **Validates: Requirements 13.2**
 * 
 * All Open Graph meta tags should have non-empty content attributes.
 */
test('Property 43d: Open Graph meta tags have non-empty content', () => {
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
        
        const document = parseHtmlFile(filePath);
        const head = document.head;
        
        if (!head) {
          return false;
        }
        
        // Check og:title
        const ogTitleMeta = head.querySelector('meta[property="og:title"]');
        if (!ogTitleMeta) {
          return false;
        }
        const ogTitleContent = ogTitleMeta.getAttribute('content');
        const hasOgTitle = ogTitleContent !== null && ogTitleContent.trim().length > 0;
        
        // Check og:description
        const ogDescriptionMeta = head.querySelector('meta[property="og:description"]');
        if (!ogDescriptionMeta) {
          return false;
        }
        const ogDescContent = ogDescriptionMeta.getAttribute('content');
        const hasOgDescription = ogDescContent !== null && ogDescContent.trim().length > 0;
        
        // Check og:image
        const ogImageMeta = head.querySelector('meta[property="og:image"]');
        if (!ogImageMeta) {
          return false;
        }
        const ogImageContent = ogImageMeta.getAttribute('content');
        const hasOgImage = ogImageContent !== null && ogImageContent.trim().length > 0;
        
        const allHaveContent = hasOgTitle && hasOgDescription && hasOgImage;
        
        if (!allHaveContent) {
          console.error(`\nOpen Graph meta tags with empty content in ${template}/${htmlFile}:`);
          if (!hasOgTitle) console.error('  - og:title has empty content');
          if (!hasOgDescription) console.error('  - og:description has empty content');
          if (!hasOgImage) console.error('  - og:image has empty content');
        }
        
        return allHaveContent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 43e: Meta tags are in the head element
 * **Validates: Requirements 13.2**
 * 
 * All meta tags should be located within the head element, not in the body.
 */
test('Property 43e: Meta tags are in head element, not body', () => {
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
        
        const document = parseHtmlFile(filePath);
        const body = document.body;
        
        if (!body) {
          return false;
        }
        
        // Check if there are any meta tags in the body (there shouldn't be)
        const metaInBody = body.querySelectorAll('meta');
        const noMetaInBody = metaInBody.length === 0;
        
        if (!noMetaInBody) {
          console.error(`\nFound ${metaInBody.length} meta tag(s) in body of ${template}/${htmlFile} (should be in head)`);
        }
        
        return noMetaInBody;
      }
    ),
    { numRuns: 100 }
  );
});
