/**
 * Property-Based Tests for Image Alt Attributes
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about image alt attributes
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
 * Property 37: Image alt attributes
 * **Validates: Requirements 12.3**
 * 
 * For any img element in any HTML file, it should have an alt attribute 
 * with descriptive text (or empty string for decorative images).
 */
test('Property 37: All images have alt attributes', () => {
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
        
        // Get all img elements
        const images = document.querySelectorAll('img');
        
        // If no images, test passes
        if (images.length === 0) {
          return true;
        }
        
        // Check each image for alt attribute
        const imagesWithoutAlt = [];
        
        images.forEach((img) => {
          // Check if img has alt attribute (can be empty string)
          if (!img.hasAttribute('alt')) {
            const src = img.getAttribute('src') || 'no-src';
            const id = img.getAttribute('id') || 'no-id';
            const className = img.getAttribute('class') || 'no-class';
            
            imagesWithoutAlt.push({
              src,
              id,
              className
            });
          }
        });
        
        // Report any images without alt attributes
        if (imagesWithoutAlt.length > 0) {
          console.error(`\nImages without alt attributes in ${template}/${htmlFile}:`);
          imagesWithoutAlt.forEach((img) => {
            console.error(`  - <img src="${img.src}" id="${img.id}" class="${img.className}">`);
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
 * Property 37a: Alt attributes are not null
 * **Validates: Requirements 12.3**
 * 
 * All img elements should have an alt attribute that is not null.
 */
test('Property 37a: Image alt attributes are not null', () => {
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
        const images = document.querySelectorAll('img');
        
        if (images.length === 0) {
          return true; // No images
        }
        
        // Check each image's alt attribute is not null
        const imagesWithNullAlt = [];
        
        images.forEach((img) => {
          const alt = img.getAttribute('alt');
          
          if (alt === null) {
            const src = img.getAttribute('src') || 'no-src';
            imagesWithNullAlt.push(src);
          }
        });
        
        if (imagesWithNullAlt.length > 0) {
          console.error(`\nImages with null alt attributes in ${template}/${htmlFile}:`);
          imagesWithNullAlt.forEach((src) => {
            console.error(`  - <img src="${src}">`);
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
 * Property 37b: Content images have descriptive alt text
 * **Validates: Requirements 12.3**
 * 
 * Images that are not decorative (not in icons directory, not logo) 
 * should have non-empty alt text.
 */
test('Property 37b: Content images have descriptive alt text', () => {
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
        const images = document.querySelectorAll('img');
        
        if (images.length === 0) {
          return true; // No images
        }
        
        // Check content images have descriptive alt text
        const contentImagesWithEmptyAlt = [];
        
        images.forEach((img) => {
          const src = img.getAttribute('src') || '';
          const alt = img.getAttribute('alt');
          
          // Skip if no alt attribute
          if (alt === null) {
            return;
          }
          
          // Determine if this is a content image (not decorative)
          const isIcon = src.includes('/icons/') || src.includes('icon');
          const isDecorativeBackground = src.includes('background') || src.includes('pattern');
          
          // Content images should have non-empty alt text
          if (!isIcon && !isDecorativeBackground && alt.trim() === '') {
            contentImagesWithEmptyAlt.push({
              src,
              alt
            });
          }
        });
        
        if (contentImagesWithEmptyAlt.length > 0) {
          console.error(`\nContent images with empty alt text in ${template}/${htmlFile}:`);
          contentImagesWithEmptyAlt.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}">`);
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
 * Property 37c: Logo images have descriptive alt text
 * **Validates: Requirements 12.3, 2.1**
 * 
 * Logo images should have descriptive alt text (not empty).
 */
test('Property 37c: Logo images have descriptive alt text', () => {
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
        
        // Find logo images
        const logoImages = Array.from(document.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src') || '';
          return src.toLowerCase().includes('logo');
        });
        
        if (logoImages.length === 0) {
          return true; // No logo images
        }
        
        // Check logo images have non-empty alt text
        const logosWithEmptyAlt = [];
        
        logoImages.forEach((img) => {
          const alt = img.getAttribute('alt');
          
          if (alt === null || alt.trim() === '') {
            const src = img.getAttribute('src') || 'no-src';
            logosWithEmptyAlt.push(src);
          }
        });
        
        if (logosWithEmptyAlt.length > 0) {
          console.error(`\nLogo images with empty alt text in ${template}/${htmlFile}:`);
          logosWithEmptyAlt.forEach((src) => {
            console.error(`  - <img src="${src}">`);
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
 * Property 37d: Book cover images have descriptive alt text
 * **Validates: Requirements 12.3**
 * 
 * Book cover images should have descriptive alt text including book title.
 */
test('Property 37d: Book cover images have descriptive alt text', () => {
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
        
        // Find book cover images (in product cards or blog posts)
        const bookCoverImages = Array.from(document.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src') || '';
          const className = img.getAttribute('class') || '';
          const parentClass = img.parentElement ? img.parentElement.getAttribute('class') || '' : '';
          
          return src.includes('book') || 
                 src.includes('cover') || 
                 className.includes('book') || 
                 className.includes('cover') ||
                 parentClass.includes('product') ||
                 parentClass.includes('post-card');
        });
        
        if (bookCoverImages.length === 0) {
          return true; // No book cover images
        }
        
        // Check book cover images have non-empty alt text
        const coversWithEmptyAlt = [];
        
        bookCoverImages.forEach((img) => {
          const alt = img.getAttribute('alt');
          
          if (alt === null || alt.trim() === '') {
            const src = img.getAttribute('src') || 'no-src';
            coversWithEmptyAlt.push(src);
          }
        });
        
        if (coversWithEmptyAlt.length > 0) {
          console.error(`\nBook cover images with empty alt text in ${template}/${htmlFile}:`);
          coversWithEmptyAlt.forEach((src) => {
            console.error(`  - <img src="${src}">`);
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
 * Property 37e: Decorative images can have empty alt text
 * **Validates: Requirements 12.3**
 * 
 * Decorative images (icons, backgrounds) can have empty alt text (alt="")
 * but must still have the alt attribute present.
 */
test('Property 37e: Decorative images have alt attribute (can be empty)', () => {
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
        
        // Find decorative images (icons, backgrounds)
        const decorativeImages = Array.from(document.querySelectorAll('img')).filter(img => {
          const src = img.getAttribute('src') || '';
          return src.includes('/icons/') || 
                 src.includes('icon') || 
                 src.includes('background') || 
                 src.includes('pattern');
        });
        
        if (decorativeImages.length === 0) {
          return true; // No decorative images
        }
        
        // Check decorative images have alt attribute (can be empty)
        const decorativeWithoutAlt = [];
        
        decorativeImages.forEach((img) => {
          if (!img.hasAttribute('alt')) {
            const src = img.getAttribute('src') || 'no-src';
            decorativeWithoutAlt.push(src);
          }
        });
        
        if (decorativeWithoutAlt.length > 0) {
          console.error(`\nDecorative images without alt attribute in ${template}/${htmlFile}:`);
          decorativeWithoutAlt.forEach((src) => {
            console.error(`  - <img src="${src}"> (should have alt="" for decorative images)`);
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
 * Property 37f: All images in product cards have alt attributes
 * **Validates: Requirements 12.3, 7.2**
 * 
 * All images within product card components should have alt attributes.
 */
test('Property 37f: Product card images have alt attributes', () => {
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
        
        // Find product cards
        const productCards = document.querySelectorAll('.product-card, [class*="product"]');
        
        if (productCards.length === 0) {
          return true; // No product cards
        }
        
        // Check images within product cards
        const productImagesWithoutAlt = [];
        
        productCards.forEach((card) => {
          const images = card.querySelectorAll('img');
          
          images.forEach((img) => {
            if (!img.hasAttribute('alt')) {
              const src = img.getAttribute('src') || 'no-src';
              productImagesWithoutAlt.push(src);
            }
          });
        });
        
        if (productImagesWithoutAlt.length > 0) {
          console.error(`\nProduct card images without alt attributes in ${template}/${htmlFile}:`);
          productImagesWithoutAlt.forEach((src) => {
            console.error(`  - <img src="${src}">`);
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
 * Property 37g: All images in blog post cards have alt attributes
 * **Validates: Requirements 12.3, 4.1**
 * 
 * All images within blog post card components should have alt attributes.
 */
test('Property 37g: Blog post card images have alt attributes', () => {
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
        
        // Find blog post cards
        const postCards = document.querySelectorAll('.post-card, [class*="post-card"], article.post, article[class*="post"]');
        
        if (postCards.length === 0) {
          return true; // No post cards
        }
        
        // Check images within post cards
        const postImagesWithoutAlt = [];
        
        postCards.forEach((card) => {
          const images = card.querySelectorAll('img');
          
          images.forEach((img) => {
            if (!img.hasAttribute('alt')) {
              const src = img.getAttribute('src') || 'no-src';
              postImagesWithoutAlt.push(src);
            }
          });
        });
        
        if (postImagesWithoutAlt.length > 0) {
          console.error(`\nBlog post card images without alt attributes in ${template}/${htmlFile}:`);
          postImagesWithoutAlt.forEach((src) => {
            console.error(`  - <img src="${src}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
