/**
 * Property-Based Tests for ARIA Labels on Icon Buttons
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about ARIA labels on icon buttons
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
 * Helper function to check if a button has visible text content
 * @param {Element} button - Button element to check
 * @returns {boolean} - True if button has visible text content
 */
function hasVisibleTextContent(button) {
  // Get direct text content (not from child elements)
  let textContent = '';
  
  for (let node of button.childNodes) {
    if (node.nodeType === 3) { // Text node
      textContent += node.textContent;
    }
  }
  
  // Check if there's meaningful text (more than just whitespace or symbols)
  const trimmedText = textContent.trim();
  
  // If text is only symbols (like &times;, arrows, etc.), consider it as icon
  const symbolsOnly = /^[^\w\s]+$/.test(trimmedText);
  
  // Has visible text if there's text and it's not just symbols
  return trimmedText.length > 0 && !symbolsOnly;
}

/**
 * Helper function to check if a button has ARIA label
 * @param {Element} button - Button element to check
 * @returns {boolean} - True if button has aria-label or aria-labelledby
 */
function hasAriaLabel(button) {
  return button.hasAttribute('aria-label') || button.hasAttribute('aria-labelledby');
}

/**
 * Property 40: ARIA labels for icon buttons
 * **Validates: Requirements 12.6**
 * 
 * For any button element without visible text content, it should have 
 * aria-label or aria-labelledby attribute.
 */
test('Property 40: Icon buttons have aria-label or aria-labelledby', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist (template not yet implemented)
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all button elements
        const buttons = document.querySelectorAll('button');
        
        // If no buttons, test passes
        if (buttons.length === 0) {
          return true;
        }
        
        // Check each button without visible text for ARIA labels
        const iconButtonsWithoutAria = [];
        
        buttons.forEach((button) => {
          // Check if button has visible text content
          const hasText = hasVisibleTextContent(button);
          
          // If no visible text, it's an icon button and needs ARIA label
          if (!hasText) {
            const hasAria = hasAriaLabel(button);
            
            if (!hasAria) {
              const buttonInfo = {
                id: button.getAttribute('id') || 'no-id',
                class: button.getAttribute('class') || 'no-class',
                innerHTML: button.innerHTML.trim().substring(0, 50)
              };
              iconButtonsWithoutAria.push(buttonInfo);
            }
          }
        });
        
        // Report any icon buttons without ARIA labels
        if (iconButtonsWithoutAria.length > 0) {
          console.error(`\nIcon buttons without ARIA labels in ${template}/${htmlFile}:`);
          iconButtonsWithoutAria.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">${btn.innerHTML}...</button>`);
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
 * Property 40a: ARIA labels are non-empty
 * **Validates: Requirements 12.6**
 * 
 * When a button has an aria-label attribute, it should have non-empty text.
 */
test('Property 40a: ARIA labels have non-empty text', () => {
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
        
        // Get all buttons with aria-label
        const buttonsWithAriaLabel = document.querySelectorAll('button[aria-label]');
        
        if (buttonsWithAriaLabel.length === 0) {
          return true; // No buttons with aria-label
        }
        
        // Check each aria-label is non-empty
        const buttonsWithEmptyAriaLabel = [];
        
        buttonsWithAriaLabel.forEach((button) => {
          const ariaLabel = button.getAttribute('aria-label');
          
          if (!ariaLabel || ariaLabel.trim() === '') {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class'
            };
            buttonsWithEmptyAriaLabel.push(buttonInfo);
          }
        });
        
        if (buttonsWithEmptyAriaLabel.length > 0) {
          console.error(`\nButtons with empty aria-label in ${template}/${htmlFile}:`);
          buttonsWithEmptyAriaLabel.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}" aria-label="">`);
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
 * Property 40b: ARIA labelledby references valid element
 * **Validates: Requirements 12.6**
 * 
 * When a button has aria-labelledby, the referenced id should exist in the document.
 */
test('Property 40b: ARIA labelledby references valid element', () => {
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
        
        // Get all buttons with aria-labelledby
        const buttonsWithAriaLabelledby = document.querySelectorAll('button[aria-labelledby]');
        
        if (buttonsWithAriaLabelledby.length === 0) {
          return true; // No buttons with aria-labelledby
        }
        
        // Check each aria-labelledby references a valid element
        const buttonsWithInvalidReference = [];
        
        buttonsWithAriaLabelledby.forEach((button) => {
          const ariaLabelledby = button.getAttribute('aria-labelledby');
          
          if (!ariaLabelledby || ariaLabelledby.trim() === '') {
            buttonsWithInvalidReference.push({
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class',
              reason: 'empty aria-labelledby'
            });
          } else {
            // Check if referenced element exists
            const referencedElement = document.getElementById(ariaLabelledby);
            
            if (!referencedElement) {
              buttonsWithInvalidReference.push({
                id: button.getAttribute('id') || 'no-id',
                class: button.getAttribute('class') || 'no-class',
                reason: `aria-labelledby="${ariaLabelledby}" references non-existent element`
              });
            }
          }
        });
        
        if (buttonsWithInvalidReference.length > 0) {
          console.error(`\nButtons with invalid aria-labelledby in ${template}/${htmlFile}:`);
          buttonsWithInvalidReference.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">: ${btn.reason}`);
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
 * Property 40c: Navigation toggle buttons have ARIA labels
 * **Validates: Requirements 12.6**
 * 
 * Mobile navigation toggle buttons (hamburger menus) should have ARIA labels.
 */
test('Property 40c: Navigation toggle buttons have ARIA labels', () => {
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
        
        // Find navigation toggle buttons (common classes/ids)
        const navToggles = document.querySelectorAll('button.nav-toggle, button#navToggle, button[class*="menu-toggle"], button[class*="hamburger"]');
        
        if (navToggles.length === 0) {
          return true; // No navigation toggles
        }
        
        // Check each navigation toggle has ARIA label
        const navTogglesWithoutAria = [];
        
        navToggles.forEach((button) => {
          const hasAria = hasAriaLabel(button);
          
          if (!hasAria) {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class'
            };
            navTogglesWithoutAria.push(buttonInfo);
          }
        });
        
        if (navTogglesWithoutAria.length > 0) {
          console.error(`\nNavigation toggle buttons without ARIA labels in ${template}/${htmlFile}:`);
          navTogglesWithoutAria.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">`);
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
 * Property 40d: Modal close buttons have ARIA labels
 * **Validates: Requirements 12.6**
 * 
 * Modal close buttons (typically with × or close icon) should have ARIA labels.
 */
test('Property 40d: Modal close buttons have ARIA labels', () => {
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
        
        // Find modal close buttons (common classes)
        const modalCloseButtons = document.querySelectorAll('button.modal-close, button[class*="close"], button.close-modal');
        
        if (modalCloseButtons.length === 0) {
          return true; // No modal close buttons
        }
        
        // Check each modal close button has ARIA label
        const closeButtonsWithoutAria = [];
        
        modalCloseButtons.forEach((button) => {
          const hasAria = hasAriaLabel(button);
          
          if (!hasAria) {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class',
              innerHTML: button.innerHTML.trim()
            };
            closeButtonsWithoutAria.push(buttonInfo);
          }
        });
        
        if (closeButtonsWithoutAria.length > 0) {
          console.error(`\nModal close buttons without ARIA labels in ${template}/${htmlFile}:`);
          closeButtonsWithoutAria.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">${btn.innerHTML}</button>`);
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
 * Property 40e: Carousel navigation buttons have ARIA labels
 * **Validates: Requirements 12.6**
 * 
 * Carousel prev/next buttons and indicator buttons should have ARIA labels.
 */
test('Property 40e: Carousel navigation buttons have ARIA labels', () => {
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
        
        // Find carousel navigation buttons
        const carouselButtons = document.querySelectorAll(
          'button.carousel-prev, button.carousel-next, button.indicator, ' +
          'button[class*="carousel"], button[class*="slide"]'
        );
        
        if (carouselButtons.length === 0) {
          return true; // No carousel buttons
        }
        
        // Check each carousel button has ARIA label
        const carouselButtonsWithoutAria = [];
        
        carouselButtons.forEach((button) => {
          const hasAria = hasAriaLabel(button);
          
          if (!hasAria) {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class',
              innerHTML: button.innerHTML.trim().substring(0, 20)
            };
            carouselButtonsWithoutAria.push(buttonInfo);
          }
        });
        
        if (carouselButtonsWithoutAria.length > 0) {
          console.error(`\nCarousel buttons without ARIA labels in ${template}/${htmlFile}:`);
          carouselButtonsWithoutAria.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">${btn.innerHTML}...</button>`);
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
 * Property 40f: All buttons are accessible to screen readers
 * **Validates: Requirements 12.6**
 * 
 * All button elements should be accessible to screen readers either through:
 * - Visible text content, OR
 * - aria-label attribute, OR
 * - aria-labelledby attribute
 */
test('Property 40f: All buttons are accessible to screen readers', () => {
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
        
        // Get all button elements
        const buttons = document.querySelectorAll('button');
        
        if (buttons.length === 0) {
          return true; // No buttons
        }
        
        // Check each button is accessible
        const inaccessibleButtons = [];
        
        buttons.forEach((button) => {
          const hasText = hasVisibleTextContent(button);
          const hasAria = hasAriaLabel(button);
          
          // Button must have either visible text or ARIA label
          if (!hasText && !hasAria) {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class',
              innerHTML: button.innerHTML.trim().substring(0, 50)
            };
            inaccessibleButtons.push(buttonInfo);
          }
        });
        
        if (inaccessibleButtons.length > 0) {
          console.error(`\nInaccessible buttons (no text or ARIA) in ${template}/${htmlFile}:`);
          inaccessibleButtons.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}">${btn.innerHTML}...</button>`);
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
 * Property 40g: ARIA labels are descriptive and meaningful
 * **Validates: Requirements 12.6**
 * 
 * ARIA labels should be descriptive (more than 2 characters) and meaningful.
 */
test('Property 40g: ARIA labels are descriptive and meaningful', () => {
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
        
        // Get all buttons with aria-label
        const buttonsWithAriaLabel = document.querySelectorAll('button[aria-label]');
        
        if (buttonsWithAriaLabel.length === 0) {
          return true; // No buttons with aria-label
        }
        
        // Check each aria-label is descriptive
        const buttonsWithVagueAriaLabel = [];
        
        buttonsWithAriaLabel.forEach((button) => {
          const ariaLabel = button.getAttribute('aria-label');
          
          if (ariaLabel && ariaLabel.trim().length <= 2) {
            const buttonInfo = {
              id: button.getAttribute('id') || 'no-id',
              class: button.getAttribute('class') || 'no-class',
              ariaLabel: ariaLabel
            };
            buttonsWithVagueAriaLabel.push(buttonInfo);
          }
        });
        
        if (buttonsWithVagueAriaLabel.length > 0) {
          console.error(`\nButtons with vague aria-label (≤2 chars) in ${template}/${htmlFile}:`);
          buttonsWithVagueAriaLabel.forEach((btn) => {
            console.error(`  - <button id="${btn.id}" class="${btn.class}" aria-label="${btn.ariaLabel}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
