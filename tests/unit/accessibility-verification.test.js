/**
 * Accessibility Verification Tests for Template 1: Literary Lounge
 * 
 * This test suite verifies that all accessibility features are properly implemented
 * across all pages in Template 1, ensuring WCAG 2.1 AA compliance.
 * 
 * Requirements tested: 12.3, 12.4, 12.5, 12.6
 */

const { describe, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const TEMPLATE_DIR = 'template-1-literary-lounge';
const HTML_FILES = [
  'index.html',
  'blog.html',
  'blog-post.html',
  'about.html',
  'shop.html',
  'contact.html'
];

describe('Template 1 Accessibility Features', () => {
  
  describe('Image Alt Text (Requirement 12.3)', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: All images should have alt attributes`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const imagesWithoutAlt = [];
        $('img').each((i, elem) => {
          const $img = $(elem);
          const alt = $img.attr('alt');
          const src = $img.attr('src');
          
          // Alt attribute must exist (can be empty for decorative images)
          if (alt === undefined) {
            imagesWithoutAlt.push(src || `image at index ${i}`);
          }
        });
        
        assert.deepStrictEqual(imagesWithoutAlt, []);
      });
      
      test(`${file}: Logo images should have descriptive alt text`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const logoImg = $('.logo img');
        if (logoImg.length > 0) {
          const alt = logoImg.attr('alt');
          assert.ok(alt);
          assert.ok(alt.length > 5); // Should be descriptive
          assert.ok(alt.toLowerCase().includes('chikielau'));
        }
      });
    });
  });

  
  describe('ARIA Labels for Icon Buttons (Requirement 12.6)', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Hamburger menu button should have aria-label`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const navToggle = $('.nav-toggle, #navToggle');
        if (navToggle.length > 0) {
          const ariaLabel = navToggle.attr('aria-label');
          assert.ok(ariaLabel);
          assert.match(ariaLabel.toLowerCase(), /toggle|menu|navigation/);
        }
      });
      
      test(`${file}: Modal close button should have aria-label`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const modalClose = $('.modal-close');
        if (modalClose.length > 0) {
          const ariaLabel = modalClose.attr('aria-label');
          assert.ok(ariaLabel);
          assert.match(ariaLabel.toLowerCase(), /close/);
        }
      });
      
      test(`${file}: Social media icon links should have aria-labels`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const socialLinks = $('.social-icons a, .social-link');
        socialLinks.each((i, elem) => {
          const $link = $(elem);
          const ariaLabel = $link.attr('aria-label');
          const hasVisibleText = $link.find('span, strong').length > 0;
          
          // Either has aria-label or visible text
          if (!hasVisibleText) {
            assert.ok(ariaLabel);
          }
        });
      });
    });
    
    test('index.html: Carousel navigation buttons should have aria-labels', () => {
      const filePath = path.join(TEMPLATE_DIR, 'index.html');
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      const prevBtn = $('.carousel-prev');
      const nextBtn = $('.carousel-next');
      
      if (prevBtn.length > 0) {
        const ariaLabel = prevBtn.attr('aria-label');
        assert.ok(ariaLabel);
        assert.match(ariaLabel.toLowerCase(), /previous|prev/);
      }
      
      if (nextBtn.length > 0) {
        const ariaLabel = nextBtn.attr('aria-label');
        assert.ok(ariaLabel);
        assert.match(ariaLabel.toLowerCase(), /next/);
      }
    });
    
    test('index.html: Carousel indicator buttons should have aria-labels', () => {
      const filePath = path.join(TEMPLATE_DIR, 'index.html');
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      const indicators = $('.carousel-indicators .indicator');
      indicators.each((i, elem) => {
        const $indicator = $(elem);
        const ariaLabel = $indicator.attr('aria-label');
        assert.ok(ariaLabel);
        assert.match(ariaLabel.toLowerCase(), /slide|go to/);
      });
    });
  });

  
  describe('Heading Hierarchy (Requirement 12.5)', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Should have exactly one h1 element`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const h1Count = $('h1').length;
        assert.strictEqual(h1Count, 1);
      });
      
      test(`${file}: Heading levels should be sequential (no skipping)`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const headings = [];
        $('h1, h2, h3, h4, h5, h6').each((i, elem) => {
          const level = parseInt(elem.name.substring(1));
          headings.push(level);
        });
        
        // Check that we don't skip levels (e.g., h2 to h4)
        for (let i = 1; i < headings.length; i++) {
          const diff = headings[i] - headings[i - 1];
          // Difference should be -X (going back up), 0 (same level), or 1 (one level down)
          assert.ok(diff <= 1);
        }
      });
    });
  });

  
  describe('Keyboard Navigation Support (Requirement 12.4)', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Interactive elements should not have negative tabindex`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const interactiveElements = $('a, button, input, textarea, select');
        interactiveElements.each((i, elem) => {
          const $elem = $(elem);
          const tabindex = $elem.attr('tabindex');
          
          if (tabindex !== undefined) {
            const tabindexValue = parseInt(tabindex);
            assert.ok(tabindexValue >= 0);
          }
        });
      });
      
      test(`${file}: Form inputs should have associated labels`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const inputs = $('input:not([type="hidden"]), textarea, select');
        inputs.each((i, elem) => {
          const $input = $(elem);
          const id = $input.attr('id');
          const ariaLabel = $input.attr('aria-label');
          const ariaLabelledby = $input.attr('aria-labelledby');
          
          // Input should have either:
          // 1. An id with a corresponding label[for]
          // 2. An aria-label
          // 3. An aria-labelledby
          // 4. Be wrapped in a label
          
          let hasLabel = false;
          
          if (id) {
            const label = $(`label[for="${id}"]`);
            if (label.length > 0) hasLabel = true;
          }
          
          if (ariaLabel || ariaLabelledby) hasLabel = true;
          
          if ($input.parent('label').length > 0) hasLabel = true;
          
          assert.strictEqual(hasLabel, true);
        });
      });
    });
  });

  
  describe('Focus Indicators', () => {
    test('CSS should include focus-visible styles', () => {
      const cssPath = path.join(TEMPLATE_DIR, 'css/styles.css');
      const content = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for focus-visible styles
      assert.match(content, /:focus-visible/);
      assert.match(content, /outline.*gold/i);
    });
  });

  
  describe('ARIA Attributes for Complex Components', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Modal should have proper ARIA attributes`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const modal = $('#newsletterModal, .modal-overlay');
        if (modal.length > 0) {
          const ariaHidden = modal.attr('aria-hidden');
          const role = modal.attr('role');
          const ariaLabelledby = modal.attr('aria-labelledby');
          const ariaDescribedby = modal.attr('aria-describedby');
          
          assert.ok(ariaHidden !== undefined);
          assert.strictEqual(role, 'dialog');
          assert.ok(ariaLabelledby);
          assert.ok(ariaDescribedby);
        }
      });
      
      test(`${file}: Navigation menu should have proper ARIA attributes`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const navToggle = $('.nav-toggle, #navToggle');
        if (navToggle.length > 0) {
          const ariaExpanded = navToggle.attr('aria-expanded');
          const ariaControls = navToggle.attr('aria-controls');
          
          assert.ok(ariaExpanded !== undefined);
          assert.ok(ariaControls);
        }
      });
    });
    
    test('index.html: Progress bar should have ARIA attributes', () => {
      const filePath = path.join(TEMPLATE_DIR, 'index.html');
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      const progressBar = $('.progress-fill, [role="progressbar"]');
      if (progressBar.length > 0) {
        const role = progressBar.attr('role');
        const ariaValuenow = progressBar.attr('aria-valuenow');
        const ariaValuemin = progressBar.attr('aria-valuemin');
        const ariaValuemax = progressBar.attr('aria-valuemax');
        
        assert.strictEqual(role, 'progressbar');
        assert.ok(ariaValuenow !== undefined);
        assert.ok(ariaValuemin !== undefined);
        assert.ok(ariaValuemax !== undefined);
      }
    });
  });

  
  describe('Decorative Elements', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Decorative SVGs should have aria-hidden="true"`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        // Check decorative icons (those in .stat-icon, .placeholder-icon, etc.)
        const decorativeContainers = $('.stat-icon, .placeholder-icon, .celestial-accent, .reason-item svg');
        decorativeContainers.each((i, elem) => {
          const $elem = $(elem);
          
          // Decorative elements should have aria-hidden="true"
          if ($elem.is('svg') || $elem.find('svg').length > 0) {
            const svg = $elem.is('svg') ? $elem : $elem.find('svg');
            assert.strictEqual(svg.attr('aria-hidden'), 'true');
          }
        });
      });
    });
  });

  
  describe('Form Accessibility', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Error messages should have role="alert"`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const errorMessages = $('.error-message');
        errorMessages.each((i, elem) => {
          const $elem = $(elem);
          const role = $elem.attr('role');
          assert.strictEqual(role, 'alert');
        });
      });
      
      test(`${file}: Success messages should have role="status"`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const successMessages = $('.success-message');
        successMessages.each((i, elem) => {
          const $elem = $(elem);
          const role = $elem.attr('role');
          assert.strictEqual(role, 'status');
        });
      });
      
      test(`${file}: Required fields should have aria-required="true"`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const requiredInputs = $('input[required], textarea[required]');
        requiredInputs.each((i, elem) => {
          const $elem = $(elem);
          const ariaRequired = $elem.attr('aria-required');
          assert.strictEqual(ariaRequired, 'true');
        });
      });
    });
  });

  
  describe('Screen Reader Support', () => {
    HTML_FILES.forEach(file => {
      test(`${file}: Should have .sr-only class for screen reader only text`, () => {
        const filePath = path.join(TEMPLATE_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        // Check that .sr-only class is used for labels
        const srOnlyElements = $('.sr-only');
        
        // Should have at least some sr-only elements (for form labels)
        if ($('form').length > 0) {
          assert.ok(srOnlyElements.length > 0);
        }
      });
    });
    
    test('CSS should include .sr-only utility class', () => {
      const cssPath = path.join(TEMPLATE_DIR, 'css/styles.css');
      const content = fs.readFileSync(cssPath, 'utf-8');
      
      assert.match(content, /\.sr-only/);
      assert.match(content, /position:\s*absolute/);
      assert.match(content, /width:\s*1px/);
    });
  });
});
