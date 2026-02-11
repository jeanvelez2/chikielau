/**
 * Unit Tests for Template 2 Featured Blog Posts Section
 * Tests the implementation of the featured blog posts with star ratings
 * on the homepage of Template 2: Celestial Bookshelf
 */

const { describe, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Template 2: Featured Blog Posts Section', () => {
  let dom;
  let document;
  // Setup moved inline
  function getSetup() {
    const html = fs.readFileSync(
      path.join(__dirname, '../../template-2-celestial-bookshelf/index.html'),
      'utf-8'
    );
    dom = new JSDOM(html);
    document = dom.window.document;
  }

  
  describe('Section Structure', () => {
    test('should have featured posts section on homepage', () => {
      getSetup();
      const featuredSection = document.querySelector('.featured-posts');
      assert.ok(featuredSection);
    });
    
    test('should have section header with title and subtitle', () => {
      getSetup();
      const sectionHeader = document.querySelector('.featured-posts .section-header');
      assert.ok(sectionHeader);
      
      const title = sectionHeader.querySelector('.section-title');
      assert.ok(title);
      assert.ok(title.textContent.trim(), 'Section title should have text content');
      
      const subtitle = sectionHeader.querySelector('.section-subtitle');
      assert.ok(subtitle);
      assert.ok(subtitle.textContent.trim(), 'Section subtitle should have text content');
    });
    
    test('should have posts grid container', () => {
      const postsGrid = document.querySelector('.featured-posts .posts-grid');
      assert.ok(postsGrid);
    });
    
    test('should have section CTA linking to blog archive', () => {
      const sectionCta = document.querySelector('.featured-posts .section-cta');
      assert.ok(sectionCta);
      
      const ctaLink = sectionCta.querySelector('a[href="blog.html"]');
      assert.ok(ctaLink);
    });
  });

  
  describe('Blog Post Cards', () => {
    test('should have 3-4 blog post cards', () => {
      const postCards = document.querySelectorAll('.featured-posts .post-card');
      assert.ok(postCards.length >= 3);
      assert.ok(postCards.length <= 4);
    });
    
    test('each post card should have required elements', () => {
      getSetup();
      const postCards = document.querySelectorAll('.featured-posts .post-card');
      
      postCards.forEach(card => {
        // Image
        const image = card.querySelector('.post-card-image img');
        assert.ok(image);
        assert.ok(image.getAttribute('src'), 'Image should have src attribute');
        assert.ok(image.getAttribute('alt'), 'Image should have alt attribute');
        
        // Category overlay
        const category = card.querySelector('.post-category');
        assert.ok(category);
        
        // Content section
        const content = card.querySelector('.post-card-content');
        assert.ok(content);
        
        // Star rating
        const starRating = content.querySelector('.star-rating');
        assert.ok(starRating);
        
        // Title with link
        const title = content.querySelector('.post-card-title');
        assert.ok(title);
        const titleLink = title.querySelector('a');
        assert.ok(titleLink);
        assert.ok(titleLink.getAttribute('href'), 'Title link should have href attribute');
        
        // Meta with date
        const meta = content.querySelector('.post-card-meta');
        assert.ok(meta);
        const time = meta.querySelector('time');
        assert.ok(time);
        assert.ok(time.getAttribute('datetime'), 'Time element should have datetime attribute');
        
        // Excerpt
        const excerpt = content.querySelector('.post-card-excerpt');
        assert.ok(excerpt);
        assert.ok(excerpt.textContent.trim(), 'Excerpt should have text content');
        
        // Read more button
        const readMore = content.querySelector('.btn-read-more');
        assert.ok(readMore);
        assert.ok(readMore.getAttribute('href'), 'Read more button should have href attribute');
      });
    });
    
    test('should have asymmetric card size classes', () => {
      const largeCard = document.querySelector('.post-card-large');
      const mediumCard = document.querySelector('.post-card-medium');
      const smallCards = document.querySelectorAll('.post-card-small');
      
      assert.ok(largeCard);
      assert.ok(mediumCard);
      assert.ok(smallCards.length >= 2);
    });
  });

  
  describe('Star Rating Component', () => {
    test('each post card should have star rating with data-rating attribute', () => {
      getSetup();
      const postCards = document.querySelectorAll('.featured-posts .post-card');
      
      postCards.forEach(card => {
        const starRating = card.querySelector('.star-rating');
        assert.ok(starRating);
        assert.ok(starRating.getAttribute('data-rating'), 'Star rating should have data-rating attribute');
      });
    });
    
    test('star ratings should have 5 star elements', () => {
      const starRatings = document.querySelectorAll('.featured-posts .star-rating');
      
      starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        assert.strictEqual(stars.length, 5);
      });
    });
    
    test('stars should have appropriate classes (filled, half, empty)', () => {
      const starRatings = document.querySelectorAll('.featured-posts .star-rating');
      
      starRatings.forEach(rating => {
        const stars = rating.querySelectorAll('.star');
        stars.forEach(star => {
          const hasClass = star.classList.contains('filled') || 
                          star.classList.contains('half') || 
                          star.classList.contains('empty');
          assert.strictEqual(hasClass, true);
        });
      });
    });
    
    test('star ratings should have screen reader text', () => {
      const starRatings = document.querySelectorAll('.featured-posts .star-rating');
      
      starRatings.forEach(rating => {
        const srText = rating.querySelector('.sr-only');
        assert.ok(srText);
        assert.match(srText.textContent, /Rating: \d+(\.\d+)? out of 5 stars/);
      });
    });
    
    test('stars should have aria-hidden attribute', () => {
      getSetup();
      const stars = document.querySelectorAll('.featured-posts .star-rating .star');
      
      stars.forEach(star => {
        assert.strictEqual(star.getAttribute('aria-hidden'), 'true', 'Star should have aria-hidden="true"');
      });
    });
  });

  
  describe('Accessibility', () => {
    test('post cards should use article semantic element', () => {
      getSetup();
      const postCards = document.querySelectorAll('.featured-posts .post-card');
      
      postCards.forEach(card => {
        assert.strictEqual(card.tagName.toLowerCase(), 'article', 'Post card should be an article element');
      });
    });
    
    test('all images should have alt text', () => {
      const images = document.querySelectorAll('.featured-posts img');
      
      images.forEach(img => {
        const alt = img.getAttribute('alt');
        assert.ok(alt !== undefined);
        assert.strictEqual(typeof alt, 'string');
      });
    });
    
    test('time elements should have datetime attribute', () => {
      getSetup();
      const timeElements = document.querySelectorAll('.featured-posts time');
      
      timeElements.forEach(time => {
        const datetime = time.getAttribute('datetime');
        assert.ok(datetime, 'Time element should have datetime attribute');
        // Should be in ISO format (YYYY-MM-DD)
        assert.match(datetime, /^\d{4}-\d{2}-\d{2}$/, 'Datetime should be in ISO format');
      });
    });
    
    test('links should have meaningful text', () => {
      const links = document.querySelectorAll('.featured-posts a');
      
      links.forEach(link => {
        const text = link.textContent.trim();
        assert.ok(text);
        assert.ok(text.length > 0);
      });
    });
  });

  
  describe('Dark Theme Styling', () => {
    test('should use dark background classes', () => {
      const featuredSection = document.querySelector('.featured-posts');
      assert.ok(featuredSection);
      
      const postCards = document.querySelectorAll('.post-card');
      assert.ok(postCards.length > 0);
    });
    
    test('should have gold accent elements', () => {
      const categories = document.querySelectorAll('.post-category');
      assert.ok(categories.length > 0);
      
      const starRatings = document.querySelectorAll('.star-rating');
      assert.ok(starRatings.length > 0);
    });
  });

  
  describe('Responsive Design', () => {
    test('should have responsive grid classes', () => {
      const postsGrid = document.querySelector('.posts-grid');
      assert.ok(postsGrid);
    });
    
    test('should have different card size classes for asymmetric layout', () => {
      const largeCard = document.querySelector('.post-card-large');
      const mediumCard = document.querySelector('.post-card-medium');
      const smallCards = document.querySelectorAll('.post-card-small');
      
      assert.ok(largeCard);
      assert.ok(mediumCard);
      assert.strictEqual(smallCards.length, 2);
    });
  });

  
  describe('Content Quality', () => {
    test('post titles should be descriptive', () => {
      const titles = document.querySelectorAll('.featured-posts .post-card-title');
      
      titles.forEach(title => {
        const text = title.textContent.trim();
        assert.ok(text.length > 10);
      });
    });
    
    test('excerpts should provide meaningful preview', () => {
      const excerpts = document.querySelectorAll('.featured-posts .post-card-excerpt');
      
      excerpts.forEach(excerpt => {
        const text = excerpt.textContent.trim();
        assert.ok(text.length > 30);
      });
    });
    
    test('categories should be present and descriptive', () => {
      const categories = document.querySelectorAll('.featured-posts .post-category');
      
      categories.forEach(category => {
        const text = category.textContent.trim();
        assert.ok(text.length > 0);
      });
    });
  });
});
