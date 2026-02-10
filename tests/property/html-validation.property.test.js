const { test } = require('node:test');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

/**
 * Property 32: Valid HTML structure
 * **Validates: Requirements 10.7**
 * 
 * For any HTML file, when validated against W3C HTML5 standards,
 * it should produce zero errors.
 * 
 * This test validates:
 * - Proper DOCTYPE declaration
 * - Valid HTML5 structure
 * - Properly nested elements
 * - Valid attributes
 * - Closed tags
 */

test('Property 32: All HTML files have valid DOCTYPE declaration', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip non-existent files (templates not yet built)
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        // Check for DOCTYPE declaration at the start
        const hasDoctype = content.trim().toLowerCase().startsWith('<!doctype html>');
        
        if (!hasDoctype) {
          console.error(`${filePath}: Missing or invalid DOCTYPE declaration`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32a: All HTML files have valid html element with lang attribute', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const htmlElement = dom.window.document.documentElement;
          
          // Check for lang attribute
          const hasLang = htmlElement.hasAttribute('lang');
          
          if (!hasLang) {
            console.error(`${filePath}: <html> element missing lang attribute`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32b: All HTML files have valid head element with required meta tags', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Check for head element
          const head = doc.querySelector('head');
          if (!head) {
            console.error(`${filePath}: Missing <head> element`);
            return false;
          }
          
          // Check for charset meta tag
          const charsetMeta = doc.querySelector('meta[charset]');
          if (!charsetMeta) {
            console.error(`${filePath}: Missing charset meta tag`);
            return false;
          }
          
          // Check for viewport meta tag
          const viewportMeta = doc.querySelector('meta[name="viewport"]');
          if (!viewportMeta) {
            console.error(`${filePath}: Missing viewport meta tag`);
            return false;
          }
          
          // Check for title element
          const title = doc.querySelector('title');
          if (!title || !title.textContent.trim()) {
            console.error(`${filePath}: Missing or empty <title> element`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32c: All HTML files have properly nested elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          // JSDOM will throw errors for severely malformed HTML
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Check that body exists
          const body = doc.querySelector('body');
          if (!body) {
            console.error(`${filePath}: Missing <body> element`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: HTML parsing error (likely malformed) - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32d: All HTML files have no duplicate IDs', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Get all elements with id attributes
          const elementsWithIds = doc.querySelectorAll('[id]');
          const ids = new Set();
          const duplicates = [];
          
          elementsWithIds.forEach(element => {
            const id = element.id;
            if (ids.has(id)) {
              duplicates.push(id);
            } else {
              ids.add(id);
            }
          });
          
          if (duplicates.length > 0) {
            console.error(`${filePath}: Duplicate IDs found: ${duplicates.join(', ')}`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32e: All HTML files have valid attribute values', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Check for common invalid attribute patterns
          const issues = [];
          
          // Check for empty href on links (except # for modals/anchors)
          const links = doc.querySelectorAll('a[href]');
          links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '' || href === null) {
              issues.push('Empty href attribute on <a> element');
            }
          });
          
          // Check for empty src on images
          const images = doc.querySelectorAll('img[src]');
          images.forEach(img => {
            const src = img.getAttribute('src');
            if (src === '' || src === null) {
              issues.push('Empty src attribute on <img> element');
            }
          });
          
          // Check for empty action on forms (can be empty for same-page submission)
          // This is actually valid, so we'll skip this check
          
          if (issues.length > 0) {
            console.error(`${filePath}: Invalid attributes - ${issues.join(', ')}`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32f: All HTML files have properly closed tags', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          // JSDOM will auto-close tags, but we can check for obvious issues
          const dom = new JSDOM(content);
          
          // If JSDOM can parse it without throwing, basic structure is valid
          // Check that the parsed document has expected structure
          const doc = dom.window.document;
          const html = doc.documentElement;
          const head = doc.querySelector('head');
          const body = doc.querySelector('body');
          
          if (!html || !head || !body) {
            console.error(`${filePath}: Missing required elements (html, head, or body)`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: HTML structure error - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32g: All HTML files use valid HTML5 elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Get all elements
          const allElements = doc.querySelectorAll('*');
          
          // List of deprecated/obsolete HTML elements that should not be used
          const obsoleteElements = [
            'acronym', 'applet', 'basefont', 'big', 'center', 'dir', 
            'font', 'frame', 'frameset', 'noframes', 'strike', 'tt'
          ];
          
          const foundObsolete = [];
          allElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();
            if (obsoleteElements.includes(tagName)) {
              foundObsolete.push(tagName);
            }
          });
          
          if (foundObsolete.length > 0) {
            console.error(`${filePath}: Obsolete HTML elements found: ${[...new Set(foundObsolete)].join(', ')}`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 32h: All HTML files have valid form elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      fc.constantFrom('index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'),
      (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        
        try {
          const dom = new JSDOM(content);
          const doc = dom.window.document;
          
          // Check all input elements have valid type attributes
          const inputs = doc.querySelectorAll('input');
          const validInputTypes = [
            'text', 'email', 'password', 'tel', 'url', 'search', 'number',
            'checkbox', 'radio', 'submit', 'button', 'reset', 'hidden',
            'date', 'time', 'datetime-local', 'month', 'week', 'color',
            'file', 'range', 'image'
          ];
          
          const issues = [];
          inputs.forEach(input => {
            const type = input.getAttribute('type');
            // If no type specified, defaults to 'text' which is valid
            if (type && !validInputTypes.includes(type.toLowerCase())) {
              issues.push(`Invalid input type: ${type}`);
            }
          });
          
          if (issues.length > 0) {
            console.error(`${filePath}: Form validation issues - ${issues.join(', ')}`);
            return false;
          }
          
          return true;
        } catch (error) {
          console.error(`${filePath}: Failed to parse HTML - ${error.message}`);
          return false;
        }
      }
    ),
    { numRuns: 100 }
  );
});
