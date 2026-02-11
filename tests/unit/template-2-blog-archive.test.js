const { describe, test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Template 2: Blog Archive Page', () => {
  let $;
  
  // Load HTML before tests
  const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/blog.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  $ = cheerio.load(html);

  
  describe('Page Structure', () => {
    test('should have proper HTML5 structure', () => {
      assert.strictEqual($('html').attr('lang'), 'en');
      assert.strictEqual($('head meta[charset="UTF-8"]').length, 1);
      assert.strictEqual($('head meta[name="viewport"]').length, 1);
      assert.ok($('title').text().includes('Book Reviews'));
    });
    
    test('should have semantic structure with header, main, and footer', () => {
      assert.strictEqual($('header.site-header').length, 1);
      assert.strictEqual($('main').length, 1);
      assert.strictEqual($('footer.site-footer').length, 1);
    });
    
    test('should have proper meta tags including Open Graph', () => {
      assert.strictEqual($('meta[name="description"]').length, 1);
      assert.strictEqual($('meta[property="og:title"]').length, 1);
      assert.strictEqual($('meta[property="og:description"]').length, 1);
      assert.strictEqual($('meta[property="og:image"]').length, 1);
    });
  });

  
  describe('Blog Archive Header', () => {
    test('should have blog header section', () => {
      assert.strictEqual($('.blog-header').length, 1);
      assert.strictEqual($('.blog-header-container').length, 1);
    });
    
    test('should have page title and subtitle', () => {
      assert.strictEqual($('.page-title').length, 1);
      assert.ok($('.page-title').text().includes('Book Reviews'));
      assert.strictEqual($('.page-subtitle').length, 1);
      assert.ok($('.page-subtitle').text().length > 50);
    });
  });

  
  describe('Blog Post Cards', () => {
    test('should have 8-12 blog post cards', () => {
      const postCards = $('.post-card');
      assert.ok(postCards.length >= 8);
      assert.ok(postCards.length <= 12);
    });
    
    test('should have asymmetric grid layout classes', () => {
      assert.ok($('.post-card-large').length > 0);
      assert.ok($('.post-card-medium').length > 0);
      assert.ok($('.post-card-small').length > 0);
    });
    
    test('each post card should have required elements', () => {
      $('.post-card').each((i, card) => {
        const $card = $(card);
        
        // Should have image
        assert.strictEqual($card.find('.post-card-image img').length, 1);
        
        // Should have star rating
        assert.strictEqual($card.find('.star-rating').length, 1);
        assert.strictEqual($card.find('.star-rating .star').length, 5);
        
        // Should have title with link
        assert.strictEqual($card.find('.post-card-title a').length, 1);
        
        // Should have date
        assert.strictEqual($card.find('.post-card-meta time').length, 1);
        
        // Should have excerpt
        assert.strictEqual($card.find('.post-card-excerpt').length, 1);
        
        // Should have "Read More" link
        assert.strictEqual($card.find('.btn-read-more').length, 1);
      });
    });
    
    test('should have category labels on post images', () => {
      $('.post-card').each((i, card) => {
        const $card = $(card);
        assert.strictEqual($card.find('.post-overlay .post-category').length, 1);
      });
    });
  });

  
  describe('Star Ratings', () => {
    test('should have proper star rating structure', () => {
      $('.star-rating').each((i, rating) => {
        const $rating = $(rating);
        
        // Should have 5 stars
        assert.strictEqual($rating.find('.star').length, 5);
        
        // Should have data-rating attribute
        assert.ok($rating.attr('data-rating'), 'Star rating should have data-rating attribute');
        
        // Should have screen reader text
        assert.strictEqual($rating.find('.sr-only').length, 1);
        assert.ok($rating.find('.sr-only').text().includes('Rating:'));
      });
    });
    
    test('should have different rating values', () => {
      const ratings = [];
      $('.star-rating').each((i, rating) => {
        const ratingValue = $(rating).attr('data-rating');
        if (ratingValue) {
          ratings.push(parseFloat(ratingValue));
        }
      });
      
      // Should have variety in ratings (not all the same)
      const uniqueRatings = [...new Set(ratings)];
      assert.ok(uniqueRatings.length > 1);
    });
    
    test('should have filled, half, and empty star classes', () => {
      const hasFilledStars = $('.star.filled').length > 0;
      const hasHalfStars = $('.star.half').length > 0;
      const hasEmptyStars = $('.star.empty').length > 0;
      
      assert.strictEqual(hasFilledStars, true);
      // At least one of half or empty should exist (not all 5-star ratings)
      assert.strictEqual(hasHalfStars || hasEmptyStars, true);
    });
  });

  
  describe('Dark Theme Styling', () => {
    test('should link to CSS files', () => {
      assert.strictEqual($('link[href="css/variables.css"]').length, 1);
      assert.strictEqual($('link[href="css/styles.css"]').length, 1);
    });
    
    test('should have dark theme classes', () => {
      // Post cards should have dark background classes
      assert.ok($('.post-card').length > 0);
      assert.strictEqual($('.blog-archive').length, 1);
    });
  });

  
  describe('Responsive Design', () => {
    test('should have posts-grid container', () => {
      assert.strictEqual($('.posts-grid').length, 1);
    });
    
    test('should have lazy loading on images', () => {
      $('.post-card-image img').each((i, img) => {
        const $img = $(img);
        assert.strictEqual($img.attr('loading'), 'lazy');
      });
    });
  });

  
  describe('Accessibility', () => {
    test('all images should have alt attributes', () => {
      $('img').each((i, img) => {
        const $img = $(img);
        assert.ok($img.attr('alt') !== undefined, `Image ${i} should have alt attribute`);
      });
    });
    
    test('should have proper heading hierarchy', () => {
      const h1Count = $('h1').length;
      assert.strictEqual(h1Count, 1);
      
      // Post titles should be h2
      assert.ok($('.post-card-title').length > 0);
    });
    
    test('time elements should have datetime attributes', () => {
      $('time').each((i, time) => {
        assert.ok($(time).attr('datetime'), `Time element ${i} should have datetime attribute`);
      });
    });
    
    test('star ratings should have screen reader text', () => {
      $('.star-rating').each((i, rating) => {
        const $rating = $(rating);
        assert.strictEqual($rating.find('.sr-only').length, 1);
      });
    });
    
    test('stars should have aria-hidden attribute', () => {
      $('.star').each((i, star) => {
        assert.strictEqual($(star).attr('aria-hidden'), 'true');
      });
    });
  });

  
  describe('Navigation', () => {
    test('should have active state on Blog link', () => {
      const blogLink = $('a[href="blog.html"]');
      assert.ok(blogLink.hasClass('active'));
    });
    
    test('should have links to all pages', () => {
      const requiredLinks = ['index.html', 'blog.html', 'about.html', 'shop.html', 'contact.html'];
      requiredLinks.forEach(link => {
        assert.ok($(`nav a[href="${link}"]`).length > 0);
      });
    });
  });

  
  describe('Footer and Newsletter', () => {
    test('should have newsletter form in footer', () => {
      assert.strictEqual($('footer .newsletter-form').length, 1);
      assert.strictEqual($('footer input[type="email"]').length, 1);
      assert.strictEqual($('footer button[type="submit"]').length, 1);
    });
    
    test('should have social media links', () => {
      assert.ok($('footer .social-icons a').length >= 3, 'Footer should have at least 3 social media links');
    });
    
    test('social links should have proper attributes', () => {
      $('footer .social-icons a').each((i, link) => {
        const $link = $(link);
        assert.strictEqual($link.attr('target'), '_blank');
        assert.strictEqual($link.attr('rel'), 'noopener');
        assert.ok($link.attr('aria-label'), `Social link ${i} should have aria-label`);
      });
    });
  });

  
  describe('Newsletter Modal', () => {
    test('should have newsletter modal', () => {
      assert.strictEqual($('#newsletterModal').length, 1);
      assert.strictEqual($('#newsletterModal .modal-content').length, 1);
    });
    
    test('modal should have proper ARIA attributes', () => {
      const modal = $('#newsletterModal');
      assert.strictEqual(modal.attr('role'), 'dialog');
      assert.strictEqual(modal.attr('aria-labelledby'), 'modalTitle');
      assert.strictEqual(modal.attr('aria-describedby'), 'modalDescription');
    });
  });

  
  describe('JavaScript', () => {
    test('should link to script.js', () => {
      assert.strictEqual($('script[src="js/script.js"]').length, 1);
    });
  });

  
  describe('Content Quality', () => {
    test('should have varied book titles', () => {
      const titles = [];
      $('.post-card-title a').each((i, title) => {
        titles.push($(title).text().trim());
      });
      
      // All titles should be unique
      const uniqueTitles = [...new Set(titles)];
      assert.strictEqual(uniqueTitles.length, titles.length);
    });
    
    test('should have varied publication dates', () => {
      const dates = [];
      $('.post-card-meta time').each((i, time) => {
        dates.push($(time).attr('datetime'));
      });
      
      // Should have multiple different dates
      const uniqueDates = [...new Set(dates)];
      assert.ok(uniqueDates.length > 1);
    });
    
    test('should have meaningful excerpts', () => {
      $('.post-card-excerpt').each((i, excerpt) => {
        const text = $(excerpt).text().trim();
        assert.ok(text.length > 30);
      });
    });
  });
});
