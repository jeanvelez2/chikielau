/**
 * Unit Tests for Template 2: Split-Screen Hero Section
 * Tests the structure and content of the dramatic split-screen hero
 */

const { describe, it, before } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Template 2: Split-Screen Hero Section', () => {
  let $;
  let document;
  // Setup moved inline
  function getSetup() {
    const html = fs.readFileSync(
      path.join(__dirname, '../../template-2-celestial-bookshelf/index.html'),
      'utf-8'
    );
    $ = cheerio.load(html);
  }


  describe('Hero Section Structure', () => {
    it('should have hero-split section', () => {
      getSetup();
      const heroSection = $('.hero-split');
      assert.ok(heroSection.length > 0);
      assert.strictEqual(heroSection.prop('tagName'), 'SECTION');
    });

    it('should have hero-container with two main sections', () => {
      const heroContainer = $('.hero-container');
      assert.ok(heroContainer.length > 0);
      
      const heroContent = $('.hero-content');
      const heroBooks = $('.hero-books');
      
      assert.ok(heroContent.length > 0);
      assert.ok(heroBooks.length > 0);
    });
  });


  describe('Left Side: Branding and Content', () => {
    it('should have hero title with proper text', () => {
      const heroTitle = $('.hero-title');
      assert.ok(heroTitle.length > 0);
      assert.strictEqual(heroTitle.prop('tagName'), 'H1');
      assert.ok(heroTitle.text().includes('Where Books Meet the Stars'));
    });

    it('should have hero tagline', () => {
      const heroTagline = $('.hero-tagline');
      assert.ok(heroTagline.length > 0);
      assert.ok(heroTagline.text().includes('celestial journey'));
    });

    it('should have hero intro text', () => {
      const heroIntro = $('.hero-intro');
      assert.ok(heroIntro.length > 0);
      assert.ok(heroIntro.text().trim().length > 50);
    });

    it('should have two CTA buttons', () => {
      const heroCta = $('.hero-cta');
      assert.ok(heroCta.length > 0);
      
      const buttons = heroCta.find('a');
      assert.strictEqual(buttons.length, 2);
      
      // Check button classes
      assert.ok(buttons.eq(0).hasClass('btn-gold'));
      assert.ok(buttons.eq(1).hasClass('btn-outline'));
      
      // Check button links
      assert.strictEqual(buttons.eq(0).attr('href'), 'blog.html');
      assert.strictEqual(buttons.eq(1).attr('href'), 'shop.html');
    });
  });


  describe('Right Side: Book Covers Grid', () => {
    it('should have books-grid with 6 book items', () => {
      const booksGrid = $('.books-grid');
      assert.ok(booksGrid.length > 0);
      
      const bookItems = booksGrid.find('.book-item');
      assert.strictEqual(bookItems.length, 6);
    });

    it('each book item should have proper structure', () => {
      const bookItems = $('.book-item');
      
      bookItems.each((index, item) => {
        const $item = $(item);
        
        // Check for image
        const img = $item.find('img');
        assert.ok(img.length > 0);
        assert.ok(img.attr('src').includes('book-cover'));
        assert.ok(img.attr('src').includes('.svg'));
        assert.ok(img.attr('alt'));
        
        // Check for overlay
        const overlay = $item.find('.book-overlay');
        assert.ok(overlay.length > 0);
        
        // Check for star rating
        const starRating = overlay.find('.star-rating');
        assert.ok(starRating.length > 0);
        assert.ok(starRating.hasClass('small'));
      });
    });

    it('book items should have unique positioning classes', () => {
      assert.ok($('.book-item-1').length > 0);
      assert.ok($('.book-item-2').length > 0);
      assert.ok($('.book-item-3').length > 0);
      assert.ok($('.book-item-4').length > 0);
      assert.ok($('.book-item-5').length > 0);
      assert.ok($('.book-item-6').length > 0);
    });

    it('should have star ratings with proper structure', () => {
      const starRatings = $('.book-overlay .star-rating');
      assert.strictEqual(starRatings.length, 6);
      
      starRatings.each((index, rating) => {
        const $rating = $(rating);
        const stars = $rating.find('.star');
        assert.strictEqual(stars.length, 5);
        
        stars.each((i, star) => {
          const $star = $(star);
          assert.strictEqual($star.attr('aria-hidden'), 'true');
          assert.strictEqual($star.text(), '★');
        });
      });
    });

    it('should have gold accent decoration element', () => {
      const booksAccent = $('.books-accent');
      assert.ok(booksAccent.length > 0);
    });
  });


  describe('Accessibility', () => {
    it('all images should have alt attributes', () => {
      const images = $('.hero-split img');
      images.each((index, img) => {
        assert.ok($(img).attr('alt') !== undefined);
      });
    });

    it('star ratings should have aria-hidden on decorative elements', () => {
      const stars = $('.hero-split .star');
      stars.each((index, star) => {
        assert.strictEqual($(star).attr('aria-hidden'), 'true');
      });
    });

    it('CTA buttons should have proper link structure', () => {
      const ctaLinks = $('.hero-cta a');
      ctaLinks.each((index, link) => {
        const $link = $(link);
        assert.ok($link.attr('href'));
        assert.ok($link.text().trim().length > 0);
      });
    });
  });


  describe('Responsive Design Classes', () => {
    it('should have proper container structure for responsive layout', () => {
      assert.ok($('.hero-container').length > 0);
      assert.ok($('.hero-content').length > 0);
      assert.ok($('.hero-books').length > 0);
    });

    it('should have proper text wrapper for content', () => {
      const heroText = $('.hero-text');
      assert.ok(heroText.length > 0);
      
      // Should contain all text elements
      assert.ok(heroText.find('.hero-title').length > 0);
      assert.ok(heroText.find('.hero-tagline').length > 0);
      assert.ok(heroText.find('.hero-intro').length > 0);
      assert.ok(heroText.find('.hero-cta').length > 0);
    });
  });


  describe('Content Quality', () => {
    it('hero title should be compelling and brand-appropriate', () => {
      const heroTitle = $('.hero-title');
      const titleText = heroTitle.text().toLowerCase();
      
      // Should contain celestial/book-related keywords
      assert.ok(
        titleText.includes('books') || 
        titleText.includes('stars') || 
        titleText.includes('celestial')
      );
    });

    it('hero intro should be substantial', () => {
      const heroIntro = $('.hero-intro');
      const introText = heroIntro.text().trim();
      
      // Should be at least 100 characters
      assert.ok(introText.length > 100);
      
      // Should contain relevant keywords
      assert.ok(
        introText.toLowerCase().includes('book') || 
        introText.toLowerCase().includes('review')
      );
    });

    it('CTA buttons should have clear action text', () => {
      const ctaButtons = $('.hero-cta a');
      
      ctaButtons.each((index, button) => {
        const buttonText = $(button).text().trim();
        assert.ok(buttonText.length > 5);
        assert.ok(buttonText.length < 30);
      });
    });
  });
});
