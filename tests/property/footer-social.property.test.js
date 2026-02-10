/**
 * Property-Based Tests for Footer and Social Media
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about footer newsletter forms
 * and social media links across all three templates using property-based
 * testing with fast-check.
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
 * Property 20: Newsletter form in footer
 * **Validates: Requirements 6.3**
 * 
 * For any page in any template, the footer element should contain
 * a form with email input type.
 */
test('Property 20: Footer contains newsletter form with email input', () => {
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
        
        // Find footer element
        const footer = document.querySelector('footer');
        if (!footer) {
          console.error(`\nNo footer element found in ${template}/${htmlFile}`);
          return false;
        }
        
        // Check for form within footer
        const form = footer.querySelector('form');
        if (!form) {
          console.error(`\nNo form element found in footer of ${template}/${htmlFile}`);
          return false;
        }
        
        // Check for email input within the form
        const emailInput = form.querySelector('input[type="email"]');
        const hasEmailInput = emailInput !== null;
        
        if (!hasEmailInput) {
          console.error(`\nNo email input found in footer form of ${template}/${htmlFile}`);
        }
        
        return hasEmailInput;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 20a: Newsletter form has required email input
 * **Validates: Requirements 6.3, 6.4**
 * 
 * The email input in the footer newsletter form should have the required attribute.
 */
test('Property 20a: Footer newsletter email input has required attribute', () => {
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
        const footer = document.querySelector('footer');
        
        if (!footer) {
          return false;
        }
        
        const form = footer.querySelector('form');
        if (!form) {
          return false;
        }
        
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) {
          return false;
        }
        
        const hasRequired = emailInput.hasAttribute('required');
        
        if (!hasRequired) {
          console.error(`\nFooter email input missing required attribute in ${template}/${htmlFile}`);
        }
        
        return hasRequired;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 20b: Newsletter form has submit button
 * **Validates: Requirements 6.3**
 * 
 * The footer newsletter form should contain a submit button.
 */
test('Property 20b: Footer newsletter form has submit button', () => {
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
        const footer = document.querySelector('footer');
        
        if (!footer) {
          return false;
        }
        
        const form = footer.querySelector('form');
        if (!form) {
          return false;
        }
        
        // Check for submit button (button[type="submit"] or just button)
        const submitButton = form.querySelector('button[type="submit"], button:not([type])');
        const hasSubmitButton = submitButton !== null;
        
        if (!hasSubmitButton) {
          console.error(`\nNo submit button found in footer form of ${template}/${htmlFile}`);
        }
        
        return hasSubmitButton;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 20c: Newsletter form has action and method attributes
 * **Validates: Requirements 6.1**
 * 
 * The footer newsletter form should have action and method attributes
 * for compatibility with third-party services.
 */
test('Property 20c: Footer newsletter form has action and method attributes', () => {
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
        const footer = document.querySelector('footer');
        
        if (!footer) {
          return false;
        }
        
        const form = footer.querySelector('form');
        if (!form) {
          return false;
        }
        
        const hasAction = form.hasAttribute('action');
        const hasMethod = form.hasAttribute('method');
        
        if (!hasAction || !hasMethod) {
          console.error(`\nFooter form missing attributes in ${template}/${htmlFile}:`);
          if (!hasAction) console.error('  - Missing action attribute');
          if (!hasMethod) console.error('  - Missing method attribute');
        }
        
        return hasAction && hasMethod;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 20d: Newsletter form email input has label
 * **Validates: Requirements 12.7**
 * 
 * The email input should have an associated label for accessibility.
 */
test('Property 20d: Footer newsletter email input has associated label', () => {
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
        const footer = document.querySelector('footer');
        
        if (!footer) {
          return false;
        }
        
        const form = footer.querySelector('form');
        if (!form) {
          return false;
        }
        
        const emailInput = form.querySelector('input[type="email"]');
        if (!emailInput) {
          return false;
        }
        
        const inputId = emailInput.getAttribute('id');
        
        // Check for associated label (either wrapping or via for attribute)
        let hasLabel = false;
        
        // Check if input is wrapped in a label
        const parentLabel = emailInput.closest('label');
        if (parentLabel) {
          hasLabel = true;
        }
        
        // Check if there's a label with matching for attribute
        if (inputId) {
          const associatedLabel = document.querySelector(`label[for="${inputId}"]`);
          if (associatedLabel) {
            hasLabel = true;
          }
        }
        
        if (!hasLabel) {
          console.error(`\nFooter email input missing associated label in ${template}/${htmlFile}`);
        }
        
        return hasLabel;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 12: Social media link behavior
 * **Validates: Requirements 14.5**
 * 
 * For any social media link element, it should have target="_blank"
 * and rel="noopener" attributes.
 */
test('Property 12: Social media links have target="_blank" and rel="noopener"', () => {
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
        
        // Find all social media links (in footer or header)
        // Social media links typically contain social media domain names or are in social-related classes
        const socialLinks = document.querySelectorAll(
          'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
          'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
          '.social-icons a, .footer-social a, .social-media a'
        );
        
        if (socialLinks.length === 0) {
          // No social media links found - this might be okay for some pages
          // but we should at least check the footer
          const footer = document.querySelector('footer');
          if (footer) {
            const footerLinks = footer.querySelectorAll('a[href^="http"]');
            if (footerLinks.length === 0) {
              console.error(`\nNo social media links found in ${template}/${htmlFile}`);
              return false;
            }
          }
          return true;
        }
        
        // Check each social media link
        let allValid = true;
        socialLinks.forEach((link, index) => {
          const target = link.getAttribute('target');
          const rel = link.getAttribute('rel');
          
          const hasTargetBlank = target === '_blank';
          const hasRelNoopener = rel && rel.includes('noopener');
          
          if (!hasTargetBlank || !hasRelNoopener) {
            console.error(`\nSocial media link ${index + 1} in ${template}/${htmlFile} missing attributes:`);
            if (!hasTargetBlank) console.error(`  - Missing or incorrect target attribute (found: ${target})`);
            if (!hasRelNoopener) console.error(`  - Missing or incorrect rel attribute (found: ${rel})`);
            console.error(`  - Link href: ${link.getAttribute('href')}`);
            allValid = false;
          }
        });
        
        return allValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 12a: Social media links open in new tab
 * **Validates: Requirements 14.5**
 * 
 * All social media links should have target="_blank" to open in a new tab.
 */
test('Property 12a: All social media links have target="_blank"', () => {
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
        
        // Find social media links
        const socialLinks = document.querySelectorAll(
          'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
          'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
          '.social-icons a, .footer-social a, .social-media a'
        );
        
        if (socialLinks.length === 0) {
          return true; // No social links to check
        }
        
        let allHaveTarget = true;
        socialLinks.forEach((link) => {
          const target = link.getAttribute('target');
          if (target !== '_blank') {
            console.error(`\nSocial media link missing target="_blank" in ${template}/${htmlFile}: ${link.getAttribute('href')}`);
            allHaveTarget = false;
          }
        });
        
        return allHaveTarget;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 12b: Social media links have rel="noopener" for security
 * **Validates: Requirements 14.5**
 * 
 * All social media links should have rel="noopener" for security.
 */
test('Property 12b: All social media links have rel="noopener"', () => {
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
        
        // Find social media links
        const socialLinks = document.querySelectorAll(
          'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
          'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
          '.social-icons a, .footer-social a, .social-media a'
        );
        
        if (socialLinks.length === 0) {
          return true; // No social links to check
        }
        
        let allHaveNoopener = true;
        socialLinks.forEach((link) => {
          const rel = link.getAttribute('rel');
          if (!rel || !rel.includes('noopener')) {
            console.error(`\nSocial media link missing rel="noopener" in ${template}/${htmlFile}: ${link.getAttribute('href')}`);
            allHaveNoopener = false;
          }
        });
        
        return allHaveNoopener;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 12c: Social media links have aria-label for accessibility
 * **Validates: Requirements 12.6, 14.2**
 * 
 * Social media icon links should have aria-label attributes for accessibility.
 */
test('Property 12c: Social media links have aria-label attributes', () => {
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
        
        // Find social media links
        const socialLinks = document.querySelectorAll(
          'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
          'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
          '.social-icons a, .footer-social a, .social-media a'
        );
        
        if (socialLinks.length === 0) {
          return true; // No social links to check
        }
        
        let allHaveAriaLabel = true;
        socialLinks.forEach((link) => {
          // Check if link has aria-label or has visible text content
          const hasAriaLabel = link.hasAttribute('aria-label');
          const hasTextContent = link.textContent.trim().length > 0;
          
          // Link should have either aria-label or visible text
          if (!hasAriaLabel && !hasTextContent) {
            console.error(`\nSocial media link missing aria-label in ${template}/${htmlFile}: ${link.getAttribute('href')}`);
            allHaveAriaLabel = false;
          }
        });
        
        return allHaveAriaLabel;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 12d: Social media links are present in footer or header
 * **Validates: Requirements 14.2**
 * 
 * Social media links should be present in either the header or footer
 * of every page.
 */
test('Property 12d: Social media links present in header or footer', () => {
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
        const footer = document.querySelector('footer');
        
        if (!header && !footer) {
          return false;
        }
        
        // Check for social media links in header or footer
        let hasSocialLinks = false;
        
        if (header) {
          const headerSocialLinks = header.querySelectorAll(
            'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
            'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
            '.social-icons a, .social-media a'
          );
          if (headerSocialLinks.length > 0) {
            hasSocialLinks = true;
          }
        }
        
        if (footer) {
          const footerSocialLinks = footer.querySelectorAll(
            'a[href*="instagram"], a[href*="tiktok"], a[href*="goodreads"], ' +
            'a[href*="facebook"], a[href*="twitter"], a[href*="youtube"], ' +
            '.social-icons a, .footer-social a, .social-media a'
          );
          if (footerSocialLinks.length > 0) {
            hasSocialLinks = true;
          }
        }
        
        if (!hasSocialLinks) {
          console.error(`\nNo social media links found in header or footer of ${template}/${htmlFile}`);
        }
        
        return hasSocialLinks;
      }
    ),
    { numRuns: 100 }
  );
});
