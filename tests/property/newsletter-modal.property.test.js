/**
 * Property-Based Tests for Newsletter Modal
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about newsletter modal presence
 * and functionality across all three templates using property-based
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
 * Property 19: Newsletter modal presence
 * **Validates: Requirements 6.2**
 * 
 * For any template, at least one HTML page should contain a modal element
 * with newsletter signup form and dismissible close button.
 */
test('Property 19: Newsletter modal present with signup form and close button', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        
        // Check if at least one page has the newsletter modal
        let hasModalInTemplate = false;
        
        for (const htmlFile of HTML_FILES) {
          const filePath = path.join(templatePath, htmlFile);
          
          if (!fs.existsSync(filePath)) {
            continue;
          }
          
          const document = parseHtmlFile(filePath);
          
          // Look for modal element (by ID or class)
          const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
          
          if (modal) {
            // Check for newsletter form within modal
            const form = modal.querySelector('form');
            if (!form) {
              console.error(`\nModal found but no form in ${template}/${htmlFile}`);
              continue;
            }
            
            // Check for email input
            const emailInput = form.querySelector('input[type="email"]');
            if (!emailInput) {
              console.error(`\nModal form found but no email input in ${template}/${htmlFile}`);
              continue;
            }
            
            // Check for close button
            const closeButton = modal.querySelector('.modal-close, button[aria-label*="lose"]');
            if (!closeButton) {
              console.error(`\nModal found but no close button in ${template}/${htmlFile}`);
              continue;
            }
            
            hasModalInTemplate = true;
            break;
          }
        }
        
        if (!hasModalInTemplate) {
          console.error(`\nNo newsletter modal found in any page of ${template}`);
        }
        
        return hasModalInTemplate;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19a: Newsletter modal has proper ARIA attributes
 * **Validates: Requirements 6.2, 12.4**
 * 
 * The newsletter modal should have proper ARIA attributes for accessibility,
 * including role="dialog", aria-hidden, aria-labelledby, and aria-describedby.
 */
test('Property 19a: Newsletter modal has proper ARIA attributes', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Check for required ARIA attributes
        const hasRoleDialog = modal.getAttribute('role') === 'dialog';
        const hasAriaHidden = modal.hasAttribute('aria-hidden');
        const hasAriaLabelledby = modal.hasAttribute('aria-labelledby');
        const hasAriaDescribedby = modal.hasAttribute('aria-describedby');
        
        let allValid = true;
        
        if (!hasRoleDialog) {
          console.error(`\nModal missing role="dialog" in ${template}/${htmlFile}`);
          allValid = false;
        }
        
        if (!hasAriaHidden) {
          console.error(`\nModal missing aria-hidden attribute in ${template}/${htmlFile}`);
          allValid = false;
        }
        
        if (!hasAriaLabelledby) {
          console.error(`\nModal missing aria-labelledby attribute in ${template}/${htmlFile}`);
          allValid = false;
        }
        
        if (!hasAriaDescribedby) {
          console.error(`\nModal missing aria-describedby attribute in ${template}/${htmlFile}`);
          allValid = false;
        }
        
        return allValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19b: Newsletter modal close button has aria-label
 * **Validates: Requirements 6.2, 12.6**
 * 
 * The modal close button should have an aria-label for accessibility.
 */
test('Property 19b: Newsletter modal close button has aria-label', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Find close button
        const closeButton = modal.querySelector('.modal-close, button[aria-label*="lose"]');
        
        if (!closeButton) {
          console.error(`\nModal close button not found in ${template}/${htmlFile}`);
          return false;
        }
        
        const hasAriaLabel = closeButton.hasAttribute('aria-label');
        
        if (!hasAriaLabel) {
          console.error(`\nModal close button missing aria-label in ${template}/${htmlFile}`);
        }
        
        return hasAriaLabel;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19c: Newsletter modal form has email input with required attribute
 * **Validates: Requirements 6.2, 6.4**
 * 
 * The modal newsletter form should have an email input with required attribute.
 */
test('Property 19c: Newsletter modal form has required email input', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Find form within modal
        const form = modal.querySelector('form');
        
        if (!form) {
          console.error(`\nModal form not found in ${template}/${htmlFile}`);
          return false;
        }
        
        // Find email input
        const emailInput = form.querySelector('input[type="email"]');
        
        if (!emailInput) {
          console.error(`\nModal email input not found in ${template}/${htmlFile}`);
          return false;
        }
        
        const hasRequired = emailInput.hasAttribute('required');
        
        if (!hasRequired) {
          console.error(`\nModal email input missing required attribute in ${template}/${htmlFile}`);
        }
        
        return hasRequired;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19d: Newsletter modal form has submit button
 * **Validates: Requirements 6.2**
 * 
 * The modal newsletter form should have a submit button.
 */
test('Property 19d: Newsletter modal form has submit button', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Find form within modal
        const form = modal.querySelector('form');
        
        if (!form) {
          return false;
        }
        
        // Find submit button
        const submitButton = form.querySelector('button[type="submit"], button:not([type])');
        
        if (!submitButton) {
          console.error(`\nModal submit button not found in ${template}/${htmlFile}`);
        }
        
        return submitButton !== null;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19e: Newsletter modal email input has associated label
 * **Validates: Requirements 6.2, 12.7**
 * 
 * The modal email input should have an associated label for accessibility.
 */
test('Property 19e: Newsletter modal email input has associated label', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Find form within modal
        const form = modal.querySelector('form');
        
        if (!form) {
          return false;
        }
        
        // Find email input
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
          console.error(`\nModal email input missing associated label in ${template}/${htmlFile}`);
        }
        
        return hasLabel;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19f: Newsletter modal has error and success message elements
 * **Validates: Requirements 6.2, 15.3, 15.4**
 * 
 * The modal form should have error message and success message elements
 * for displaying validation feedback.
 */
test('Property 19f: Newsletter modal has error and success message elements', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Find form within modal
        const form = modal.querySelector('form');
        
        if (!form) {
          return false;
        }
        
        // Check for error message element
        const errorMessage = form.querySelector('.error-message, [role="alert"]');
        const hasErrorMessage = errorMessage !== null;
        
        // Check for success message element
        const successMessage = form.querySelector('.success-message, [role="status"]');
        const hasSuccessMessage = successMessage !== null;
        
        if (!hasErrorMessage) {
          console.error(`\nModal form missing error message element in ${template}/${htmlFile}`);
        }
        
        if (!hasSuccessMessage) {
          console.error(`\nModal form missing success message element in ${template}/${htmlFile}`);
        }
        
        return hasErrorMessage && hasSuccessMessage;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 19g: Newsletter modal is initially hidden
 * **Validates: Requirements 6.2**
 * 
 * The modal should be initially hidden (aria-hidden="true" or display:none).
 */
test('Property 19g: Newsletter modal is initially hidden', () => {
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
        
        // Look for modal element
        const modal = document.querySelector('#newsletterModal, .modal-overlay, [role="dialog"]');
        
        if (!modal) {
          return true; // No modal on this page, skip
        }
        
        // Check if modal is initially hidden
        const ariaHidden = modal.getAttribute('aria-hidden');
        const isHidden = ariaHidden === 'true';
        
        if (!isHidden) {
          console.error(`\nModal not initially hidden (aria-hidden="${ariaHidden}") in ${template}/${htmlFile}`);
        }
        
        return isHidden;
      }
    ),
    { numRuns: 100 }
  );
});
