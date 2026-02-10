/**
 * Property-Based Tests for Logo and Navigation
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about logo presence and navigation links
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

// Required navigation pages
const REQUIRED_NAV_PAGES = [
  'index.html',
  'blog.html',
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
 * Property 4: Logo presence on all pages
 * **Validates: Requirements 2.1**
 * 
 * For any HTML page in any template, the document should contain an img element
 * with source pointing to the logo file.
 */
test('Property 4: All HTML pages contain logo image', () => {
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
        
        // Look for logo image - check for img elements with src containing 'logo'
        const logoImages = Array.from(document.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src');
          return src && src.toLowerCase().includes('logo');
        });
        
        const hasLogo = logoImages.length > 0;
        
        if (!hasLogo) {
          console.error(`\nNo logo image found in ${template}/${htmlFile}`);
          console.error('  Expected: img element with src containing "logo"');
        }
        
        return hasLogo;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 4a: Logo image has alt attribute
 * **Validates: Requirements 2.1, 12.3**
 * 
 * The logo image should have an alt attribute for accessibility.
 */
test('Property 4a: Logo image has alt attribute', () => {
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
        
        // Find logo image
        const logoImages = Array.from(document.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src');
          return src && src.toLowerCase().includes('logo');
        });
        
        if (logoImages.length === 0) {
          return false; // No logo found
        }
        
        // Check if logo has alt attribute
        const logoHasAlt = logoImages.every(img => {
          const alt = img.getAttribute('alt');
          return alt !== null; // Alt can be empty string for decorative images
        });
        
        if (!logoHasAlt) {
          console.error(`\nLogo image missing alt attribute in ${template}/${htmlFile}`);
        }
        
        return logoHasAlt;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 4b: Logo image is in header element
 * **Validates: Requirements 2.1**
 * 
 * The logo image should be located within the header element for proper structure.
 */
test('Property 4b: Logo image is within header element', () => {
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
        const header = document.querySelector('header');
        
        if (!header) {
          return false; // No header found
        }
        
        // Look for logo image within header
        const logoInHeader = Array.from(header.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src');
          return src && src.toLowerCase().includes('logo');
        });
        
        const hasLogoInHeader = logoInHeader.length > 0;
        
        if (!hasLogoInHeader) {
          console.error(`\nLogo image not found in header of ${template}/${htmlFile}`);
        }
        
        return hasLogoInHeader;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 9: Complete navigation links
 * **Validates: Requirements 3.3**
 * 
 * For any page in any template, the navigation element should contain links
 * (href attributes) to all 6 pages.
 */
test('Property 9: Navigation contains links to all required pages', () => {
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
        
        // Find navigation element
        const nav = document.querySelector('nav');
        
        if (!nav) {
          console.error(`\nNo nav element found in ${template}/${htmlFile}`);
          return false;
        }
        
        // Get all links within navigation
        const navLinks = Array.from(nav.querySelectorAll('a')).map(a => {
          const href = a.getAttribute('href');
          return href ? href.trim() : '';
        });
        
        // Check if all required pages are linked
        const missingPages = REQUIRED_NAV_PAGES.filter(page => {
          // Check for exact match or without .html extension
          const pageWithoutExt = page.replace('.html', '');
          return !navLinks.some(link => 
            link === page || 
            link === pageWithoutExt ||
            link === `./${page}` ||
            link === `./${pageWithoutExt}`
          );
        });
        
        const allPagesLinked = missingPages.length === 0;
        
        if (!allPagesLinked) {
          console.error(`\nMissing navigation links in ${template}/${htmlFile}:`);
          console.error(`  Missing pages: ${missingPages.join(', ')}`);
          console.error(`  Found links: ${navLinks.join(', ')}`);
        }
        
        return allPagesLinked;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 9a: Navigation element exists on all pages
 * **Validates: Requirements 3.3**
 * 
 * Every HTML page should have a nav element.
 */
test('Property 9a: All pages have navigation element', () => {
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
        const nav = document.querySelector('nav');
        
        const hasNav = nav !== null;
        
        if (!hasNav) {
          console.error(`\nNo nav element found in ${template}/${htmlFile}`);
        }
        
        return hasNav;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 9b: Navigation is within header element
 * **Validates: Requirements 3.3**
 * 
 * The navigation element should be located within the header for proper structure.
 */
test('Property 9b: Navigation element is within header', () => {
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
        const header = document.querySelector('header');
        
        if (!header) {
          return false; // No header found
        }
        
        // Check if nav is within header
        const navInHeader = header.querySelector('nav');
        const hasNavInHeader = navInHeader !== null;
        
        if (!hasNavInHeader) {
          console.error(`\nNavigation element not found in header of ${template}/${htmlFile}`);
        }
        
        return hasNavInHeader;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 9c: Navigation links are anchor elements
 * **Validates: Requirements 3.3**
 * 
 * All navigation links should be proper anchor (a) elements with href attributes.
 */
test('Property 9c: All navigation links are anchor elements with href', () => {
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
        const nav = document.querySelector('nav');
        
        if (!nav) {
          return false; // No nav found
        }
        
        // Get all anchor elements in nav
        const anchors = nav.querySelectorAll('a');
        
        if (anchors.length === 0) {
          console.error(`\nNo anchor elements found in navigation of ${template}/${htmlFile}`);
          return false;
        }
        
        // Check if all anchors have href attribute
        const allHaveHref = Array.from(anchors).every(a => {
          const href = a.getAttribute('href');
          return href !== null && href.trim().length > 0;
        });
        
        if (!allHaveHref) {
          console.error(`\nSome navigation links missing href attribute in ${template}/${htmlFile}`);
        }
        
        return allHaveHref;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 9d: Navigation has minimum number of links
 * **Validates: Requirements 3.3**
 * 
 * Navigation should have at least 5 links (for the 5 required pages).
 */
test('Property 9d: Navigation has at least 5 links', () => {
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
        const nav = document.querySelector('nav');
        
        if (!nav) {
          return false; // No nav found
        }
        
        const navLinks = nav.querySelectorAll('a');
        const hasMinimumLinks = navLinks.length >= 5;
        
        if (!hasMinimumLinks) {
          console.error(`\nNavigation has only ${navLinks.length} links in ${template}/${htmlFile}, expected at least 5`);
        }
        
        return hasMinimumLinks;
      }
    ),
    { numRuns: 100 }
  );
});
