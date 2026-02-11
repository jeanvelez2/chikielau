/**
 * Unit Tests for Template 2: Star Rating Component
 * Tests the star rating component structure and CSS
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Template 2: Star Rating Component', () => {
  let stylesCSS;
  // Setup moved inline
  function getSetup() {
    const cssPath = path.join(__dirname, '../../template-2-celestial-bookshelf/css/styles.css');
    stylesCSS = fs.readFileSync(cssPath, 'utf-8');
  }


  describe('CSS Implementation', () => {
    it('should have star-rating component styles', () => {
      getSetup();
      assert.ok(stylesCSS.includes('.star-rating'));
    });

    it('should have filled star styles', () => {
      assert.ok(stylesCSS.includes('.star-rating .star.filled'));
    });

    it('should have half star styles', () => {
      assert.ok(stylesCSS.includes('.star-rating .star.half'));
    });

    it('should have empty star styles', () => {
      assert.ok(stylesCSS.includes('.star-rating .star.empty'));
    });

    it('should use gold color for filled stars', () => {
      assert.ok(stylesCSS.includes('var(--color-gold-primary)'));
    });

    it('should implement half-star with clip-path', () => {
      assert.ok(stylesCSS.includes('clip-path'));
    });

    it('should have size variations (small, large)', () => {
      assert.ok(stylesCSS.includes('.star-rating.small'));
      assert.ok(stylesCSS.includes('.star-rating.large'));
    });

    it('should have text-shadow for celestial glow effect', () => {
      assert.ok(stylesCSS.includes('text-shadow'));
    });
  });


  describe('HTML Structure Examples', () => {
    it('blog-post.html should have star rating example in comments', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('star-rating'));
      assert.ok(html.includes('data-rating'));
    });

    it('shop.html should have star rating example in comments', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/shop.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('star-rating'));
      assert.ok(html.includes('data-rating'));
    });
  });


  describe('Accessibility Features', () => {
    it('example should include role="img"', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('role="img"'));
    });

    it('example should include aria-label with rating', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('aria-label="Rating:'));
      assert.ok(html.includes('out of 5 stars"'));
    });

    it('example should include screen reader text', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('sr-only'));
      assert.ok(html.includes('Rating:'));
    });

    it('stars should have aria-hidden="true"', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('aria-hidden="true"'));
    });
  });


  describe('Star Rating Variations', () => {
    it('should support full star ratings (5 stars)', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/shop.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('data-rating="5"'));
      assert.ok(html.includes('class="star filled"'));
    });

    it('should support half star ratings (4.5 stars)', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('data-rating="4.5"'));
      assert.ok(html.includes('class="star half"'));
    });
  });


  describe('Documentation', () => {
    it('should have star rating guide documentation', () => {
      const guidePath = path.join(__dirname, '../../template-2-celestial-bookshelf/STAR-RATING-GUIDE.md');
      assert.ok(fs.existsSync(guidePath));
    });

    it('guide should document all rating values (0 to 5 with half increments)', () => {
      const guidePath = path.join(__dirname, '../../template-2-celestial-bookshelf/STAR-RATING-GUIDE.md');
      const guide = fs.readFileSync(guidePath, 'utf-8');
      
      // Check for all possible ratings
      assert.ok(guide.includes('0 stars'));
      assert.ok(guide.includes('0.5 stars'));
      assert.ok(guide.includes('1 star'));
      assert.ok(guide.includes('1.5 stars'));
      assert.ok(guide.includes('2 stars'));
      assert.ok(guide.includes('2.5 stars'));
      assert.ok(guide.includes('3 stars'));
      assert.ok(guide.includes('3.5 stars'));
      assert.ok(guide.includes('4 stars'));
      assert.ok(guide.includes('4.5 stars'));
      assert.ok(guide.includes('5 stars'));
    });

    it('guide should document accessibility features', () => {
      const guidePath = path.join(__dirname, '../../template-2-celestial-bookshelf/STAR-RATING-GUIDE.md');
      const guide = fs.readFileSync(guidePath, 'utf-8');
      
      assert.ok(guide.includes('Accessibility'));
      assert.ok(guide.includes('role="img"'));
      assert.ok(guide.includes('aria-label'));
      assert.ok(guide.includes('sr-only'));
    });

    it('guide should document size variations', () => {
      const guidePath = path.join(__dirname, '../../template-2-celestial-bookshelf/STAR-RATING-GUIDE.md');
      const guide = fs.readFileSync(guidePath, 'utf-8');
      
      assert.ok(guide.includes('small'));
      assert.ok(guide.includes('large'));
      assert.ok(guide.includes('Size Variations'));
    });

    it('guide should document usage in blog posts and product cards', () => {
      const guidePath = path.join(__dirname, '../../template-2-celestial-bookshelf/STAR-RATING-GUIDE.md');
      const guide = fs.readFileSync(guidePath, 'utf-8');
      
      assert.ok(guide.includes('Usage in Blog Posts'));
      assert.ok(guide.includes('Usage in Product Cards'));
    });
  });


  describe('Brand Consistency', () => {
    it('should use celestial theme gold color', () => {
      assert.ok(stylesCSS.includes('--color-gold-primary'));
    });

    it('should match logo aesthetic with glow effect', () => {
      // Check for text-shadow that creates celestial glow
      const glowMatch = stylesCSS.match(/text-shadow.*rgba\(212, 175, 55/);
      assert.ok(glowMatch);
    });
  });


  describe('Component Structure', () => {
    it('should use data-rating attribute for rating value', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('data-rating='));
    });

    it('should use span elements for individual stars', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('<span class="star'));
    });

    it('should use star character (★)', () => {
      const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog-post.html');
      const html = fs.readFileSync(htmlPath, 'utf-8');
      
      assert.ok(html.includes('★'));
    });
  });
});
