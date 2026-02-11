/**
 * Unit Tests: Featured Blog Posts Section
 * Template 1: Literary Lounge
 * 
 * Tests for the featured blog posts section including post card structure,
 * responsive grid layout, and content elements.
 * 
 * Validates: Requirements 4.2
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Featured Blog Posts Section - Unit Tests', () => {
  let dom;
  let document;
  let section;
  
  beforeEach(() => {
    // Load the HTML file
    const htmlPath = path.join(__dirname, '../../template-1-literary-lounge/index.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Create a JSDOM instance
    dom = new JSDOM(htmlContent, {
      url: 'http://localhost'
    });
    
    document = dom.window.document;
    section = document.querySelector('.featured-posts-section');
  });

  
  describe('Section Structure', () => {
    it('should have a featured posts section on the homepage', () => {
      assert.ok(section, 'Featured posts section should exist');
    });
    
    it('should have a section title', () => {
      const title = section.querySelector('.section-title');
      assert.ok(title, 'Section title should exist');
      assert.ok(title.textContent.trim().length > 0, 'Title should have content');
    });
    
    it('should have a posts grid container', () => {
      const grid = section.querySelector('.posts-grid');
      assert.ok(grid, 'Posts grid should exist');
    });
  });

  
  describe('Blog Post Cards', () => {
    it('should have 3-4 blog post cards', () => {
      const cards = section.querySelectorAll('.post-card');
      assert.ok(cards.length >= 3 && cards.length <= 4, `Should have 3-4 post cards, found ${cards.length}`);
    });
    
    it('should use article element for semantic HTML', () => {
      const articles = section.querySelectorAll('article.post-card');
      assert.ok(articles.length >= 3, 'Post cards should use article element');
    });
    
    it('each card should have all required elements', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const image = card.querySelector('.post-card-image');
        const title = card.querySelector('.post-card-title');
        const meta = card.querySelector('.post-card-meta');
        const excerpt = card.querySelector('.post-card-excerpt');
        const readMore = card.querySelector('.btn-read-more');
        
        assert.ok(image, `Card ${index + 1} should have image container`);
        assert.ok(title, `Card ${index + 1} should have title`);
        assert.ok(meta, `Card ${index + 1} should have meta information`);
        assert.ok(excerpt, `Card ${index + 1} should have excerpt`);
        assert.ok(readMore, `Card ${index + 1} should have Read More link`);
      });
    });
  });

  
  describe('Post Card Images', () => {
    it('each card should have a featured image', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const img = card.querySelector('.post-card-image img');
        assert.ok(img, `Card ${index + 1} should have an image`);
        assert.ok(img.getAttribute('src'), `Card ${index + 1} image should have src attribute`);
      });
    });
    
    it('images should have descriptive alt text', () => {
      const images = section.querySelectorAll('.post-card-image img');
      
      images.forEach((img, index) => {
        const altText = img.getAttribute('alt');
        assert.ok(altText, `Image ${index + 1} should have alt attribute`);
        assert.ok(altText.length > 10, `Image ${index + 1} alt text should be descriptive`);
      });
    });
    
    it('images should be wrapped in links', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const imageLink = card.querySelector('.post-card-image a');
        assert.ok(imageLink, `Card ${index + 1} image should be wrapped in a link`);
        assert.ok(imageLink.getAttribute('href'), `Card ${index + 1} image link should have href`);
      });
    });
  });

  
  describe('Post Card Titles', () => {
    it('each card should have a title with proper heading level', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const title = card.querySelector('.post-card-title');
        const heading = card.querySelector('h2.post-card-title');
        
        assert.ok(title, `Card ${index + 1} should have title`);
        assert.ok(heading, `Card ${index + 1} title should be h2 element`);
      });
    });
    
    it('titles should contain links to blog posts', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const titleLink = card.querySelector('.post-card-title a');
        assert.ok(titleLink, `Card ${index + 1} title should contain a link`);
        assert.ok(titleLink.getAttribute('href'), `Card ${index + 1} title link should have href`);
        assert.ok(titleLink.textContent.trim().length > 0, `Card ${index + 1} title should have text content`);
      });
    });
    
    it('title links should point to blog post pages', () => {
      const titleLinks = section.querySelectorAll('.post-card-title a');
      
      titleLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        assert.ok(href.includes('blog-post.html') || href.includes('blog'), 
          `Card ${index + 1} title link should point to a blog post`);
      });
    });
  });

  
  describe('Post Card Meta Information', () => {
    it('each card should have publication date', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const meta = card.querySelector('.post-card-meta');
        const time = card.querySelector('.post-card-meta time');
        
        assert.ok(meta, `Card ${index + 1} should have meta section`);
        assert.ok(time, `Card ${index + 1} should have time element`);
      });
    });
    
    it('time elements should have datetime attribute', () => {
      const timeElements = section.querySelectorAll('.post-card-meta time');
      
      timeElements.forEach((time, index) => {
        const datetime = time.getAttribute('datetime');
        assert.ok(datetime, `Time element ${index + 1} should have datetime attribute`);
        // Check if datetime is in valid format (YYYY-MM-DD)
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(datetime), 
          `Time element ${index + 1} datetime should be in YYYY-MM-DD format`);
      });
    });
    
    it('time elements should have readable date text', () => {
      const timeElements = section.querySelectorAll('.post-card-meta time');
      
      timeElements.forEach((time, index) => {
        const text = time.textContent.trim();
        assert.ok(text.length > 0, `Time element ${index + 1} should have readable text`);
      });
    });
  });

  
  describe('Post Card Excerpts', () => {
    it('each card should have an excerpt', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const excerpt = card.querySelector('.post-card-excerpt');
        assert.ok(excerpt, `Card ${index + 1} should have excerpt`);
        assert.ok(excerpt.textContent.trim().length > 0, `Card ${index + 1} excerpt should have content`);
      });
    });
    
    it('excerpts should be substantive (not too short)', () => {
      const excerpts = section.querySelectorAll('.post-card-excerpt');
      
      excerpts.forEach((excerpt, index) => {
        const text = excerpt.textContent.trim();
        assert.ok(text.length > 30, `Card ${index + 1} excerpt should be substantive (more than 30 characters)`);
      });
    });
    
    it('excerpts should not contain Lorem Ipsum placeholder', () => {
      const excerpts = section.querySelectorAll('.post-card-excerpt');
      
      excerpts.forEach((excerpt, index) => {
        const text = excerpt.textContent.toLowerCase();
        assert.ok(!text.includes('lorem ipsum'), `Card ${index + 1} should not contain Lorem Ipsum placeholder`);
      });
    });
  });

  
  describe('Read More Links', () => {
    it('each card should have a Read More link', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const readMore = card.querySelector('.btn-read-more');
        assert.ok(readMore, `Card ${index + 1} should have Read More link`);
        assert.ok(readMore.getAttribute('href'), `Card ${index + 1} Read More should have href`);
      });
    });
    
    it('Read More links should have appropriate text', () => {
      const readMoreLinks = section.querySelectorAll('.btn-read-more');
      
      readMoreLinks.forEach((link, index) => {
        const text = link.textContent.trim();
        assert.ok(text.length > 0, `Read More link ${index + 1} should have text`);
        assert.ok(text.toLowerCase().includes('read'), `Read More link ${index + 1} should indicate reading action`);
      });
    });
    
    it('Read More links should point to blog posts', () => {
      const readMoreLinks = section.querySelectorAll('.btn-read-more');
      
      readMoreLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        assert.ok(href.includes('blog-post.html') || href.includes('blog'), 
          `Read More link ${index + 1} should point to a blog post`);
      });
    });
  });

  
  describe('Responsive Grid Layout', () => {
    it('should use CSS Grid for layout', () => {
      const grid = section.querySelector('.posts-grid');
      assert.ok(grid, 'Posts grid container should exist');
      assert.ok(grid.classList.contains('posts-grid'), 'Should have posts-grid class for CSS Grid styling');
    });
    
    it('post cards should be direct children of grid', () => {
      const grid = section.querySelector('.posts-grid');
      const cards = grid.querySelectorAll(':scope > .post-card');
      
      assert.ok(cards.length >= 3, 'Post cards should be direct children of grid for proper layout');
    });
  });

  
  describe('CSS Classes', () => {
    it('should have all required CSS classes for styling', () => {
      const requiredClasses = [
        '.posts-grid',
        '.post-card',
        '.post-card-image',
        '.post-card-content',
        '.post-card-title',
        '.post-card-meta',
        '.post-card-excerpt',
        '.btn-read-more'
      ];
      
      requiredClasses.forEach(className => {
        const element = section.querySelector(className);
        assert.ok(element, `Element with class ${className} should exist`);
      });
      
      // Also verify the section itself has the correct class
      assert.ok(section.classList.contains('featured-posts-section'), 
        'Section should have featured-posts-section class');
    });
  });

  
  describe('Accessibility', () => {
    it('should use semantic article elements', () => {
      const articles = section.querySelectorAll('article');
      assert.ok(articles.length >= 3, 'Should use semantic article elements for blog posts');
    });
    
    it('should have proper heading hierarchy', () => {
      const sectionTitle = section.querySelector('h2');
      const postTitles = section.querySelectorAll('h2.post-card-title');
      
      assert.ok(sectionTitle, 'Section should have h2 heading');
      assert.ok(postTitles.length >= 3, 'Post cards should have h2 headings');
    });
    
    it('all images should have alt attributes', () => {
      const images = section.querySelectorAll('img');
      
      images.forEach((img, index) => {
        assert.ok(img.hasAttribute('alt'), `Image ${index + 1} should have alt attribute`);
      });
    });
    
    it('time elements should use semantic HTML', () => {
      const timeElements = section.querySelectorAll('time');
      assert.ok(timeElements.length >= 3, 'Should use semantic time elements for dates');
    });
  });

  
  describe('Integration with Page', () => {
    it('should be positioned after the Currently Reading section', () => {
      const currentlyReading = document.querySelector('.currently-reading-section');
      const featuredPosts = document.querySelector('.featured-posts-section');
      
      assert.ok(currentlyReading, 'Currently Reading section should exist');
      assert.ok(featuredPosts, 'Featured Posts section should exist');
      
      // Check that Featured Posts comes after Currently Reading in DOM order
      const sections = Array.from(document.querySelectorAll('section'));
      const readingPosition = sections.indexOf(currentlyReading);
      const postsPosition = sections.indexOf(featuredPosts);
      
      assert.ok(postsPosition > readingPosition, 'Featured Posts should come after Currently Reading');
    });
    
    it('should be within the main element', () => {
      const main = document.querySelector('main');
      const sectionInMain = main.querySelector('.featured-posts-section');
      
      assert.ok(sectionInMain, 'Featured Posts section should be within main element');
    });
    
    it('should use container class for consistent layout', () => {
      const container = section.querySelector('.container');
      assert.ok(container, 'Section should use container class for consistent layout');
    });
  });

  
  describe('Content Structure', () => {
    it('each post card should have proper content hierarchy', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const content = card.querySelector('.post-card-content');
        assert.ok(content, `Card ${index + 1} should have content container`);
        
        // Check that all content elements are within the content container
        const title = content.querySelector('.post-card-title');
        const meta = content.querySelector('.post-card-meta');
        const excerpt = content.querySelector('.post-card-excerpt');
        const readMore = content.querySelector('.btn-read-more');
        
        assert.ok(title, `Card ${index + 1} title should be in content container`);
        assert.ok(meta, `Card ${index + 1} meta should be in content container`);
        assert.ok(excerpt, `Card ${index + 1} excerpt should be in content container`);
        assert.ok(readMore, `Card ${index + 1} Read More should be in content container`);
      });
    });
    
    it('post cards should have image and content as separate sections', () => {
      const cards = section.querySelectorAll('.post-card');
      
      cards.forEach((card, index) => {
        const image = card.querySelector('.post-card-image');
        const content = card.querySelector('.post-card-content');
        
        assert.ok(image, `Card ${index + 1} should have separate image section`);
        assert.ok(content, `Card ${index + 1} should have separate content section`);
      });
    });
  });
});
