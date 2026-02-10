/**
 * Property-Based Tests for Product Card Structure
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about product card structure
 * on shop pages across all three templates using property-based testing with fast-check.
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
 * Helper function to check if an element contains a child matching a selector
 * @param {Element} element - Parent element
 * @param {string} selector - CSS selector
 * @returns {boolean} - True if child element exists
 */
function hasChildElement(element, selector) {
  return element.querySelector(selector) !== null;
}

/**
 * Property 21: Complete product card structure
 * **Validates: Requirements 7.2**
 * 
 * For any product card element on the shop page, it should contain child elements for:
 * image, title, author, description, and CTA link/button.
 */
test('Property 21: All product cards have complete structure', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        // Check if shop.html exists
        if (!fs.existsSync(shopFilePath)) {
          console.error(`\nshop.html does not exist in ${template}`);
          return false;
        }
        
        // Parse HTML
        const document = parseHtmlFile(shopFilePath);
        
        // Find all product cards
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          console.error(`\nNo product cards found in ${template}/shop.html`);
          return false;
        }
        
        // Check each product card for required structure
        let allCardsValid = true;
        
        productCards.forEach((card, index) => {
          const cardNumber = index + 1;
          const missingElements = [];
          
          // Check for image element
          const hasImage = card.querySelector('img') !== null;
          if (!hasImage) {
            missingElements.push('image (img element)');
          }
          
          // Check for title element (h3 or any heading with product-title class)
          const hasTitle = card.querySelector('h3, .product-title') !== null;
          if (!hasTitle) {
            missingElements.push('title (h3 or .product-title)');
          }
          
          // Check for author element
          const hasAuthor = card.querySelector('.product-author') !== null;
          if (!hasAuthor) {
            missingElements.push('author (.product-author)');
          }
          
          // Check for description element
          const hasDescription = card.querySelector('.product-description') !== null;
          if (!hasDescription) {
            missingElements.push('description (.product-description)');
          }
          
          // Check for CTA link/button (a or button element)
          const hasCTA = card.querySelector('a, button') !== null;
          if (!hasCTA) {
            missingElements.push('CTA link/button (a or button element)');
          }
          
          if (missingElements.length > 0) {
            console.error(`\nProduct card ${cardNumber} in ${template}/shop.html is missing:`);
            console.error(`  ${missingElements.join(', ')}`);
            allCardsValid = false;
          }
        });
        
        return allCardsValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21a: Product cards contain image elements
 * **Validates: Requirements 7.2**
 * 
 * Every product card should have an image element for the book cover.
 */
test('Property 21a: All product cards contain image elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        const cardsWithoutImages = Array.from(productCards).filter(card => {
          return card.querySelector('img') === null;
        });
        
        if (cardsWithoutImages.length > 0) {
          console.error(`\n${cardsWithoutImages.length} product card(s) missing image in ${template}/shop.html`);
        }
        
        return cardsWithoutImages.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21b: Product cards contain title elements
 * **Validates: Requirements 7.2**
 * 
 * Every product card should have a title element (typically h3).
 */
test('Property 21b: All product cards contain title elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        const cardsWithoutTitles = Array.from(productCards).filter(card => {
          return card.querySelector('h3, .product-title') === null;
        });
        
        if (cardsWithoutTitles.length > 0) {
          console.error(`\n${cardsWithoutTitles.length} product card(s) missing title in ${template}/shop.html`);
        }
        
        return cardsWithoutTitles.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21c: Product cards contain author elements
 * **Validates: Requirements 7.2**
 * 
 * Every product card should have an author element.
 */
test('Property 21c: All product cards contain author elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        const cardsWithoutAuthors = Array.from(productCards).filter(card => {
          return card.querySelector('.product-author') === null;
        });
        
        if (cardsWithoutAuthors.length > 0) {
          console.error(`\n${cardsWithoutAuthors.length} product card(s) missing author in ${template}/shop.html`);
        }
        
        return cardsWithoutAuthors.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21d: Product cards contain description elements
 * **Validates: Requirements 7.2**
 * 
 * Every product card should have a description element.
 */
test('Property 21d: All product cards contain description elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        const cardsWithoutDescriptions = Array.from(productCards).filter(card => {
          return card.querySelector('.product-description') === null;
        });
        
        if (cardsWithoutDescriptions.length > 0) {
          console.error(`\n${cardsWithoutDescriptions.length} product card(s) missing description in ${template}/shop.html`);
        }
        
        return cardsWithoutDescriptions.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21e: Product cards contain CTA link/button elements
 * **Validates: Requirements 7.2**
 * 
 * Every product card should have a CTA link or button element.
 */
test('Property 21e: All product cards contain CTA link/button elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        const cardsWithoutCTA = Array.from(productCards).filter(card => {
          return card.querySelector('a, button') === null;
        });
        
        if (cardsWithoutCTA.length > 0) {
          console.error(`\n${cardsWithoutCTA.length} product card(s) missing CTA link/button in ${template}/shop.html`);
        }
        
        return cardsWithoutCTA.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21f: Product card images have alt attributes
 * **Validates: Requirements 7.2, 12.3**
 * 
 * All images in product cards should have alt attributes for accessibility.
 */
test('Property 21f: All product card images have alt attributes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        let allImagesHaveAlt = true;
        
        productCards.forEach((card, index) => {
          const images = card.querySelectorAll('img');
          images.forEach(img => {
            const alt = img.getAttribute('alt');
            if (alt === null) {
              console.error(`\nProduct card ${index + 1} image missing alt attribute in ${template}/shop.html`);
              allImagesHaveAlt = false;
            }
          });
        });
        
        return allImagesHaveAlt;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21g: Product card CTA links have proper attributes
 * **Validates: Requirements 7.2**
 * 
 * CTA links in product cards should have href attributes and proper target/rel for external links.
 */
test('Property 21g: Product card CTA links have href attributes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        if (productCards.length === 0) {
          return false;
        }
        
        let allLinksValid = true;
        
        productCards.forEach((card, index) => {
          const links = card.querySelectorAll('a');
          links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href.trim().length === 0) {
              console.error(`\nProduct card ${index + 1} CTA link missing href in ${template}/shop.html`);
              allLinksValid = false;
            }
          });
        });
        
        return allLinksValid;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 21h: Shop page contains at least one product card
 * **Validates: Requirements 7.1, 7.2**
 * 
 * The shop page should contain at least one product card.
 */
test('Property 21h: Shop page contains at least one product card', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          console.error(`\nshop.html does not exist in ${template}`);
          return false;
        }
        
        const document = parseHtmlFile(shopFilePath);
        const productCards = document.querySelectorAll('.product-card');
        
        const hasProductCards = productCards.length > 0;
        
        if (!hasProductCards) {
          console.error(`\nNo product cards found in ${template}/shop.html`);
        }
        
        return hasProductCards;
      }
    ),
    { numRuns: 100 }
  );
});
