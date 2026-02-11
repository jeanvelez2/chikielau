/* ============================================
   Unit Tests: Template 2 Footer Component
   ============================================ */

const { describe, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const TEMPLATE_DIR = 'template-2-celestial-bookshelf';
const HTML_FILES = ['index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'];

describe('Template 2: Footer Component', () => {
  
  describe('Footer HTML Structure', () => {
    HTML_FILES.forEach(htmlFile => {
      test(`${htmlFile} should have footer with newsletter form`, () => {
        const filePath = path.join(TEMPLATE_DIR, htmlFile);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Check footer exists
        const footer = document.querySelector('.site-footer');
        assert.ok(footer);
        
        // Check newsletter section exists
        const newsletter = footer.querySelector('.footer-newsletter');
        assert.ok(newsletter);
        assert.ok(newsletter.querySelector('h3'));
        
        // Check newsletter form exists with proper attributes
        const form = footer.querySelector('.newsletter-form');
        assert.ok(form);
        assert.strictEqual(form.getAttribute('action'), '#');
        assert.strictEqual(form.getAttribute('method'), 'post');
        
        // Check email input with proper attributes
        const emailInput = form.querySelector('input[type="email"]');
        assert.ok(emailInput);
        assert.ok(emailInput.hasAttribute('required'));
        assert.ok(emailInput.hasAttribute('aria-required'));
        assert.strictEqual(emailInput.getAttribute('id'), 'footer-email');
        
        // Check label for email input
        const label = form.querySelector('label[for="footer-email"]');
        assert.ok(label);
        assert.ok(label.classList.contains('sr-only'));
        
        // Check submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        assert.ok(submitBtn);
        assert.ok(submitBtn.classList.contains('btn-gold'));
        
        // Check error and success message elements
        const errorMsg = form.querySelector('.error-message');
        assert.ok(errorMsg);
        assert.strictEqual(errorMsg.getAttribute('role'), 'alert');
        
        const successMsg = form.querySelector('.success-message');
        assert.ok(successMsg);
        assert.strictEqual(successMsg.getAttribute('role'), 'status');
      });
      
      test(`${htmlFile} should have social media icons with proper attributes`, () => {
        const filePath = path.join(TEMPLATE_DIR, htmlFile);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        const footer = document.querySelector('.site-footer');
        const socialSection = footer.querySelector('.footer-social');
        assert.ok(socialSection);
        
        // Check social icons container
        const socialIcons = socialSection.querySelector('.social-icons');
        assert.ok(socialIcons);
        
        // Check for Instagram, TikTok, and Goodreads links
        const socialLinks = socialIcons.querySelectorAll('a');
        assert.ok(socialLinks.length >= 3);
        
        socialLinks.forEach(link => {
          // Check target="_blank" and rel="noopener"
          assert.strictEqual(link.getAttribute('target'), '_blank');
          assert.strictEqual(link.getAttribute('rel'), 'noopener');
          
          // Check aria-label exists
          assert.ok(link.hasAttribute('aria-label'));
          
          // Check icon image exists
          const img = link.querySelector('img');
          assert.ok(img);
          assert.strictEqual(img.getAttribute('alt'), ''); // Decorative image
        });
      });
      
      test(`${htmlFile} should have copyright information`, () => {
        const filePath = path.join(TEMPLATE_DIR, htmlFile);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        const footer = document.querySelector('.site-footer');
        const footerInfo = footer.querySelector('.footer-info');
        assert.ok(footerInfo);
        
        const copyrightText = footerInfo.textContent;
        assert.ok(copyrightText.includes('2026'));
        assert.ok(copyrightText.includes('Chikielau'));
      });
    });
  });

  
  describe('Footer CSS Styling', () => {
    test('should have dark theme with gold accents', () => {
      const cssPath = path.join(TEMPLATE_DIR, 'css/styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check footer styling exists
      assert.ok(css.includes('.site-footer'));
      
      // Check for dark background color variable
      assert.ok(css.includes('background-color: var(--color-background-secondary)'));
      
      // Check for gold accent on headings
      assert.match(css, /\.footer-newsletter h3[\s\S]*?color: var\(--color-gold-primary\)/);
      assert.match(css, /\.footer-social h3[\s\S]*?color: var\(--color-gold-primary\)/);
      
      // Check for social icon hover effects with gold
      assert.match(css, /\.social-icons a:hover[\s\S]*?background-color: var\(--color-gold-primary\)/);
    });
    
    test('should have responsive layout', () => {
      const cssPath = path.join(TEMPLATE_DIR, 'css/styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for grid layout
      assert.match(css, /\.footer-content[\s\S]*?display: grid/);
      
      // Check for responsive adjustments (media queries)
      assert.ok(css.includes('@media'));
    });
  });

  
  describe('Footer Consistency', () => {
    test('all pages should have identical footer structure', () => {
      const footerStructures = HTML_FILES.map(htmlFile => {
        const filePath = path.join(TEMPLATE_DIR, htmlFile);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        const footer = document.querySelector('.site-footer');
        return footer ? footer.innerHTML.trim() : '';
      });
      
      // All footers should be identical
      const firstFooter = footerStructures[0];
      footerStructures.forEach((footer, index) => {
        assert.strictEqual(footer, firstFooter);
      });
    });
  });

  
  describe('Form Validation Integration', () => {
    test('JavaScript should include form validation functions', () => {
      const jsPath = path.join(TEMPLATE_DIR, 'js/script.js');
      const js = fs.readFileSync(jsPath, 'utf-8');
      
      // Check for email validation function
      assert.ok(js.includes('function validateEmail'));
      // Check for email validation regex pattern (the actual pattern in code)
      assert.ok(js.includes('[^\\s@]+@[^\\s@]+\\.[^\\s@]+'));
      
      // Check for error display functions
      assert.ok(js.includes('function showError'));
      assert.ok(js.includes('function clearError'));
      
      // Check for form initialization
      assert.ok(js.includes('function initForms'));
      assert.ok(js.includes('initForms()'));
    });
  });
});
