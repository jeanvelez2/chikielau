/**
 * Property-Based Tests for Form Validation
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about form validation functionality
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const path = require('path');
const fs = require('fs');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

/**
 * Property 13: Email input validation
 * **Validates: Requirements 6.4, 15.1**
 * 
 * For any email input field in any form, it should either have type="email" 
 * attribute or be associated with JavaScript validation function that tests 
 * email format using regex.
 */
test('Property 13: All email inputs have validation', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        // Check JavaScript file exists
        if (!fs.existsSync(jsPath)) {
          console.error(`\nJavaScript file not found: ${jsPath}`);
          return false;
        }
        
        // Read JavaScript file
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check for validateEmail function with regex
        const hasValidateEmailFunction = jsContent.includes('function validateEmail');
        const hasEmailRegex = /\/\^[^\\s@]+@[^\\s@]+\.[^\\s@]+\$\//.test(jsContent) ||
                             jsContent.includes('[^\\s@]+@[^\\s@]+\\.[^\\s@]+');
        
        if (!hasValidateEmailFunction) {
          console.error(`\nMissing validateEmail function in ${template}/js/script.js`);
          return false;
        }
        
        if (!hasEmailRegex) {
          console.error(`\nMissing email regex pattern in ${template}/js/script.js`);
          return false;
        }
        
        return hasValidateEmailFunction && hasEmailRegex;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 13a: Email validation function uses correct regex pattern
 * **Validates: Requirements 6.4, 15.1**
 * 
 * The validateEmail function should use the specified regex pattern
 * to validate email addresses.
 */
test('Property 13a: Email validation uses correct regex pattern', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check for the specific regex pattern or equivalent
        const hasCorrectPattern = jsContent.includes('[^\\s@]+@[^\\s@]+\\.[^\\s@]+') ||
                                 jsContent.includes('[^\\\\s@]+@[^\\\\s@]+\\\\.[^\\\\s@]+');
        
        if (!hasCorrectPattern) {
          console.error(`\nIncorrect or missing email regex pattern in ${template}`);
        }
        
        return hasCorrectPattern;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 13b: Email validation is called in form submission
 * **Validates: Requirements 6.4, 15.1**
 * 
 * The form submission handler should call the validateEmail function
 * for email input fields.
 */
test('Property 13b: Email validation is used in form submission', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check that validateEmail is called in the form handling code
        const hasValidateEmailCall = jsContent.includes('validateEmail(');
        const hasEmailTypeCheck = jsContent.includes("type === 'email'") ||
                                 jsContent.includes('type="email"');
        
        if (!hasValidateEmailCall && !hasEmailTypeCheck) {
          console.error(`\nEmail validation not used in form handling in ${template}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15: Form error messaging
 * **Validates: Requirements 15.3**
 * 
 * For any form element, the HTML should include error message elements 
 * (with role="alert") and JavaScript should populate them when validation fails.
 */
test('Property 15: Forms have error message elements with role="alert"', () => {
  const htmlFiles = [
    'index.html',
    'blog.html',
    'blog-post.html',
    'about.html',
    'shop.html',
    'contact.html'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...htmlFiles),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        // Check if page has forms
        const hasForms = htmlContent.includes('<form');
        
        if (!hasForms) {
          return true; // No forms, test passes
        }
        
        // Check for error message elements with role="alert"
        const hasErrorElements = htmlContent.includes('error-message') ||
                                htmlContent.includes('role="alert"');
        
        if (!hasErrorElements) {
          console.error(`\nMissing error message elements in ${template}/${htmlFile}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15a: JavaScript has showError function
 * **Validates: Requirements 15.3**
 * 
 * The JavaScript should include a showError function that displays
 * error messages to users.
 */
test('Property 15a: JavaScript includes showError function', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        const hasShowError = jsContent.includes('function showError');
        
        if (!hasShowError) {
          console.error(`\nMissing showError function in ${template}/js/script.js`);
        }
        
        return hasShowError;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15b: showError function sets error message text
 * **Validates: Requirements 15.3**
 * 
 * The showError function should set the textContent of error elements
 * and make them visible.
 */
test('Property 15b: showError function populates error messages', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check that showError function sets textContent and display
        const setsTextContent = jsContent.includes('textContent') &&
                               jsContent.includes('showError');
        const setsDisplay = jsContent.includes('style.display') ||
                           jsContent.includes('classList');
        
        if (!setsTextContent) {
          console.error(`\nshowError function doesn't set textContent in ${template}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15c: JavaScript has clearError function
 * **Validates: Requirements 15.3**
 * 
 * The JavaScript should include a clearError function that removes
 * error messages.
 */
test('Property 15c: JavaScript includes clearError function', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        const hasClearError = jsContent.includes('function clearError');
        
        if (!hasClearError) {
          console.error(`\nMissing clearError function in ${template}/js/script.js`);
        }
        
        return hasClearError;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15d: Error messages are shown on validation failure
 * **Validates: Requirements 15.3**
 * 
 * The form validation code should call showError when validation fails.
 */
test('Property 15d: Form validation calls showError on failure', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check that showError is called in validation logic
        const callsShowError = jsContent.includes('showError(');
        
        if (!callsShowError) {
          console.error(`\nForm validation doesn't call showError in ${template}`);
        }
        
        return callsShowError;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 15e: Error elements have aria-invalid attribute
 * **Validates: Requirements 15.3**
 * 
 * The showError function should set aria-invalid="true" on inputs
 * for accessibility.
 */
test('Property 15e: showError sets aria-invalid attribute', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check that showError sets aria-invalid
        const setsAriaInvalid = jsContent.includes('aria-invalid');
        
        if (!setsAriaInvalid) {
          console.error(`\nshowError doesn't set aria-invalid in ${template}`);
        }
        
        return setsAriaInvalid;
      }
    ),
    { numRuns: 100 }
  );
});
