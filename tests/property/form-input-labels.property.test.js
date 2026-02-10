/**
 * Property-Based Tests for Form Input Labels
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about form input labels
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
 * Helper function to check if an input has an associated label
 * @param {Element} input - Input element to check
 * @param {Document} document - DOM document
 * @returns {boolean} - True if input has associated label
 */
function hasAssociatedLabel(input, document) {
  const inputId = input.getAttribute('id');
  
  // Check if input is wrapped by a label
  let parent = input.parentElement;
  while (parent) {
    if (parent.tagName && parent.tagName.toLowerCase() === 'label') {
      return true;
    }
    parent = parent.parentElement;
  }
  
  // Check if there's a label with matching for attribute
  if (inputId) {
    const label = document.querySelector(`label[for="${inputId}"]`);
    if (label) {
      return true;
    }
  }
  
  return false;
}

/**
 * Property 41: Form input labels
 * **Validates: Requirements 12.7**
 * 
 * For any input, textarea, or select element, it should have an associated 
 * label element (via for attribute matching id, or wrapping label).
 */
test('Property 41: All form inputs have associated labels', () => {
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
        
        // Get all input, textarea, and select elements
        const inputs = document.querySelectorAll('input, textarea, select');
        
        // If no form inputs, test passes
        if (inputs.length === 0) {
          return true;
        }
        
        // Check each input for associated label
        const inputsWithoutLabels = [];
        
        inputs.forEach((input) => {
          // Skip hidden inputs and submit/button inputs
          const inputType = input.getAttribute('type');
          if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') {
            return;
          }
          
          // Check if input has associated label
          if (!hasAssociatedLabel(input, document)) {
            const inputInfo = {
              tag: input.tagName.toLowerCase(),
              type: inputType || 'text',
              id: input.getAttribute('id') || 'no-id',
              name: input.getAttribute('name') || 'no-name'
            };
            inputsWithoutLabels.push(inputInfo);
          }
        });
        
        // Report any inputs without labels
        if (inputsWithoutLabels.length > 0) {
          console.error(`\nInputs without associated labels in ${template}/${htmlFile}:`);
          inputsWithoutLabels.forEach((input) => {
            console.error(`  - <${input.tag}> type="${input.type}" id="${input.id}" name="${input.name}"`);
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
 * Property 41a: Label for attribute matches input id
 * **Validates: Requirements 12.7**
 * 
 * When a label uses the for attribute, it should match an existing input id.
 */
test('Property 41a: Label for attributes match input ids', () => {
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
        
        // Get all labels with for attribute
        const labels = document.querySelectorAll('label[for]');
        
        if (labels.length === 0) {
          return true; // No labels with for attribute
        }
        
        // Check each label's for attribute matches an input id
        const unmatchedLabels = [];
        
        labels.forEach((label) => {
          const forAttr = label.getAttribute('for');
          const matchingInput = document.getElementById(forAttr);
          
          if (!matchingInput) {
            unmatchedLabels.push(forAttr);
          }
        });
        
        if (unmatchedLabels.length > 0) {
          console.error(`\nLabels with unmatched for attributes in ${template}/${htmlFile}:`);
          unmatchedLabels.forEach((forAttr) => {
            console.error(`  - label[for="${forAttr}"] has no matching input with id="${forAttr}"`);
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
 * Property 41b: Inputs with labels have unique ids
 * **Validates: Requirements 12.7**
 * 
 * When inputs are associated with labels via id/for, the ids should be unique.
 */
test('Property 41b: Input ids are unique within each page', () => {
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
        
        // Get all inputs with ids
        const inputs = document.querySelectorAll('input[id], textarea[id], select[id]');
        
        if (inputs.length === 0) {
          return true; // No inputs with ids
        }
        
        // Check for duplicate ids
        const idCounts = {};
        inputs.forEach((input) => {
          const id = input.getAttribute('id');
          if (id) {
            idCounts[id] = (idCounts[id] || 0) + 1;
          }
        });
        
        const duplicateIds = Object.keys(idCounts).filter(id => idCounts[id] > 1);
        
        if (duplicateIds.length > 0) {
          console.error(`\nDuplicate input ids in ${template}/${htmlFile}:`);
          duplicateIds.forEach((id) => {
            console.error(`  - id="${id}" appears ${idCounts[id]} times`);
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
 * Property 41c: Wrapping labels contain only one input
 * **Validates: Requirements 12.7**
 * 
 * When a label wraps an input, it should contain exactly one input element.
 */
test('Property 41c: Wrapping labels contain exactly one input', () => {
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
        
        // Get all label elements
        const labels = document.querySelectorAll('label');
        
        if (labels.length === 0) {
          return true; // No labels
        }
        
        // Check each label that doesn't have a for attribute
        const labelsWithMultipleInputs = [];
        
        labels.forEach((label) => {
          const hasForAttr = label.hasAttribute('for');
          
          if (!hasForAttr) {
            // Count inputs within this label
            const inputsInLabel = label.querySelectorAll('input, textarea, select');
            
            if (inputsInLabel.length > 1) {
              labelsWithMultipleInputs.push({
                text: label.textContent.trim().substring(0, 50),
                count: inputsInLabel.length
              });
            }
          }
        });
        
        if (labelsWithMultipleInputs.length > 0) {
          console.error(`\nLabels with multiple inputs in ${template}/${htmlFile}:`);
          labelsWithMultipleInputs.forEach((label) => {
            console.error(`  - Label "${label.text}..." contains ${label.count} inputs`);
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
 * Property 41d: Labels have meaningful text content
 * **Validates: Requirements 12.7**
 * 
 * Label elements should have non-empty text content for screen readers.
 */
test('Property 41d: Labels have non-empty text content', () => {
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
        
        // Get all label elements
        const labels = document.querySelectorAll('label');
        
        if (labels.length === 0) {
          return true; // No labels
        }
        
        // Check each label has text content
        const emptyLabels = [];
        
        labels.forEach((label) => {
          const text = label.textContent.trim();
          
          if (text.length === 0) {
            const forAttr = label.getAttribute('for') || 'no-for';
            emptyLabels.push(forAttr);
          }
        });
        
        if (emptyLabels.length > 0) {
          console.error(`\nLabels with empty text content in ${template}/${htmlFile}:`);
          emptyLabels.forEach((forAttr) => {
            console.error(`  - label[for="${forAttr}"] has no text content`);
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
 * Property 41e: All form inputs are accessible
 * **Validates: Requirements 12.7**
 * 
 * All form inputs (except hidden, submit, button) should have either:
 * - An associated label element, OR
 * - An aria-label attribute, OR
 * - An aria-labelledby attribute
 */
test('Property 41e: All form inputs have accessible labels or ARIA attributes', () => {
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
        
        // Get all input, textarea, and select elements
        const inputs = document.querySelectorAll('input, textarea, select');
        
        if (inputs.length === 0) {
          return true; // No form inputs
        }
        
        // Check each input for accessibility
        const inaccessibleInputs = [];
        
        inputs.forEach((input) => {
          // Skip hidden inputs and submit/button inputs
          const inputType = input.getAttribute('type');
          if (inputType === 'hidden' || inputType === 'submit' || inputType === 'button') {
            return;
          }
          
          // Check for label, aria-label, or aria-labelledby
          const hasLabel = hasAssociatedLabel(input, document);
          const hasAriaLabel = input.hasAttribute('aria-label');
          const hasAriaLabelledby = input.hasAttribute('aria-labelledby');
          
          if (!hasLabel && !hasAriaLabel && !hasAriaLabelledby) {
            const inputInfo = {
              tag: input.tagName.toLowerCase(),
              type: inputType || 'text',
              id: input.getAttribute('id') || 'no-id',
              name: input.getAttribute('name') || 'no-name'
            };
            inaccessibleInputs.push(inputInfo);
          }
        });
        
        if (inaccessibleInputs.length > 0) {
          console.error(`\nInaccessible inputs (no label or ARIA) in ${template}/${htmlFile}:`);
          inaccessibleInputs.forEach((input) => {
            console.error(`  - <${input.tag}> type="${input.type}" id="${input.id}" name="${input.name}"`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
