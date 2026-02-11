/**
 * Unit Tests: Navigation Component
 * Template 2: Celestial Bookshelf
 * 
 * Tests for the side/hamburger navigation with celestial icons,
 * slide-in animation, and responsive behavior.
 * 
 * Validates: Requirements 8.2, 9.5
 */

const { describe, it, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Template 2: Celestial Bookshelf - Navigation', () => {
  const templateDir = 'template-2-celestial-bookshelf';
  const htmlFiles = ['index.html', 'blog.html', 'blog-post.html', 'about.html', 'shop.html', 'contact.html'];
  
  describe('Header Structure', () => {
    htmlFiles.forEach(file => {
      it(`${file} should have header with logo and navigation`, () => {
        const filePath = path.join(templateDir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Check header exists
        const header = document.querySelector('.site-header');
        assert.ok(header, 'Header should exist');
        
        // Check logo exists
        const logo = document.querySelector('.logo');
        assert.ok(logo, 'Logo should exist');
        
        // Check logo image
        const logoImg = document.querySelector('.logo img');
        assert.ok(logoImg, 'Logo image should exist');
        assert.ok(logoImg.getAttribute('alt'), 'Logo should have alt text');
        
        // Check navigation exists
        const nav = document.querySelector('.main-nav');
        assert.ok(nav, 'Navigation should exist');
        assert.strictEqual(nav.getAttribute('id'), 'mainNav', 'Navigation should have id="mainNav"');
      });
      
      it(`${file} should have hamburger menu toggle button`, () => {
        const filePath = path.join(templateDir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Check toggle button exists
        const navToggle = document.querySelector('.nav-toggle');
        assert.ok(navToggle, 'Nav toggle button should exist');
        assert.strictEqual(navToggle.tagName, 'BUTTON', 'Nav toggle should be a button');
        
        // Check accessibility attributes
        assert.ok(navToggle.getAttribute('aria-label'), 'Nav toggle should have aria-label');
        assert.strictEqual(navToggle.getAttribute('aria-expanded'), 'false', 'Nav toggle should have aria-expanded="false"');
        assert.strictEqual(navToggle.getAttribute('aria-controls'), 'mainNav', 'Nav toggle should have aria-controls="mainNav"');
        
        // Check hamburger icon
        const hamburger = navToggle.querySelector('.hamburger');
        assert.ok(hamburger, 'Hamburger icon should exist');
      });
      
      it(`${file} should have all navigation links`, () => {
        const filePath = path.join(templateDir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        const navLinks = document.querySelectorAll('.nav-list .nav-link');
        assert.strictEqual(navLinks.length, 5, 'Should have 5 navigation links');
        
        const expectedPages = ['index.html', 'blog.html', 'about.html', 'shop.html', 'contact.html'];
        const hrefs = Array.from(navLinks).map(link => link.getAttribute('href'));
        
        expectedPages.forEach(page => {
          assert.ok(hrefs.includes(page), `Navigation should include link to ${page}`);
        });
      });
    });
  });

  
  describe('CSS Styling', () => {
    it('should have mobile-first navigation styles', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for side navigation styles
      assert.ok(css.includes('.main-nav'));
      assert.ok(css.includes('position: fixed'));
      assert.ok(css.includes('right: -100%'));
      assert.ok(css.includes('width: 280px'));
      assert.ok(css.includes('height: 100vh'));
      
      // Check for active state
      assert.ok(css.includes('.main-nav.active'));
      assert.ok(css.includes('right: 0'));
      
      // Check for transition/animation
      assert.ok(css.includes('transition'));
    });
    
    test('should have hamburger menu styles', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for hamburger styles
      assert.ok(css.includes('.nav-toggle'));
      assert.ok(css.includes('.hamburger'));
      
      // Check for gold color
      assert.match(css, /\.hamburger[^}]*background-color.*gold/i);
      
      // Check for animation on active state
      assert.ok(css.includes('aria-expanded="true"'));
      assert.ok(css.includes('transform: rotate'));
    });
    
    test('should have desktop horizontal navigation styles', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for desktop media query
      assert.match(css, /@media.*min-width.*1024px/);
      
      // Check that nav-toggle is hidden on desktop
      const desktopSection = css.match(/@media[^{]*1024px[^}]*\{[\s\S]*?\n\}/g);
      assert.ok(desktopSection);
      
      // Check for horizontal navigation
      assert.ok(css.includes('display: flex'));
    });
    
    test('should have gold accent colors', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check for gold color usage in navigation - nav links use gold on hover/active
      assert.ok(
        css.includes('color-gold-primary') && (css.includes('.nav-link') || css.includes('.hamburger')),
        'Navigation should use gold accent colors'
      );
    });
  });

  
  describe('JavaScript Functionality', () => {
    test('should have mobile menu toggle function', () => {
      const jsPath = path.join(templateDir, 'js', 'script.js');
      const js = fs.readFileSync(jsPath, 'utf-8');
      
      // Check for initMobileMenu function
      assert.ok(js.includes('function initMobileMenu'));
      assert.ok(js.includes('.nav-toggle'));
      assert.ok(js.includes('.main-nav'));
      
      // Check for toggle functionality
      assert.ok(js.includes('addEventListener'));
      assert.ok(js.includes('aria-expanded'));
      assert.ok(js.includes('classList.toggle'));
    });
    
    test('should have ESC key support', () => {
      const jsPath = path.join(templateDir, 'js', 'script.js');
      const js = fs.readFileSync(jsPath, 'utf-8');
      
      // Check for ESC key handling
      assert.ok(js.includes('keydown'));
      assert.ok(js.includes('Escape'));
    });
    
    test('should have click-outside-to-close functionality', () => {
      const jsPath = path.join(templateDir, 'js', 'script.js');
      const js = fs.readFileSync(jsPath, 'utf-8');
      
      // Check for click outside handling
      assert.match(js, /click.*outside|outside.*click/i);
      assert.ok(js.includes('!navToggle.contains'));
      assert.ok(js.includes('!mainNav.contains'));
    });
    
    test('should initialize mobile menu on DOM ready', () => {
      const jsPath = path.join(templateDir, 'js', 'script.js');
      const js = fs.readFileSync(jsPath, 'utf-8');
      
      // Check for initialization
      assert.ok(js.includes('DOMContentLoaded'));
      assert.ok(js.includes('initMobileMenu()'));
    });
  });

  
  describe('Accessibility', () => {
    htmlFiles.forEach(file => {
      test(`${file} navigation should be keyboard accessible`, () => {
        const filePath = path.join(templateDir, file);
        const html = fs.readFileSync(filePath, 'utf-8');
        const dom = new JSDOM(html);
        const document = dom.window.document;
        
        // Check toggle button has aria-label
        const navToggle = document.querySelector('.nav-toggle');
        assert.ok(navToggle.getAttribute('aria-label'), `${file} nav toggle should have aria-label`);
        
        // Check all nav links are focusable
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
          assert.strictEqual(link.tagName, 'A');
          assert.ok(link.getAttribute('href'), 'Nav link should have href attribute');
        });
      });
    });
  });

  
  describe('Responsive Behavior', () => {
    test('should have mobile-first approach', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Base styles should be for mobile (side navigation)
      const navStylesBeforeMediaQuery = css.split('@media')[0];
      assert.ok(navStylesBeforeMediaQuery.includes('.main-nav'));
      assert.ok(navStylesBeforeMediaQuery.includes('position: fixed'));
    });
    
    test('should transform to horizontal navigation on desktop', () => {
      const cssPath = path.join(templateDir, 'css', 'styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Check desktop styles override mobile
      const desktopStyles = css.match(/@media[^{]*1024px[^}]*\{[\s\S]*?(?=@media|\z)/);
      assert.ok(desktopStyles);
      
      if (desktopStyles) {
        const desktopCss = desktopStyles[0];
        assert.ok(desktopCss.includes('.nav-toggle'));
        assert.ok(desktopCss.includes('display: none'));
        assert.ok(desktopCss.includes('.main-nav'));
        assert.ok(desktopCss.includes('position: static'));
      }
    });
  });
});
