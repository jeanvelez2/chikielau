/**
 * Unit Tests: Currently Reading Section
 * Template 1: Literary Lounge
 * 
 * Tests for the Currently Reading spotlight section including structure,
 * progress bar, and responsive layout.
 * 
 * Validates: Requirements 8.1, 20.1
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

describe('Currently Reading Section - Unit Tests', () => {
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
    section = document.querySelector('.currently-reading-section');
  });
  
  describe('Section Structure', () => {
    it('should have a Currently Reading section on the homepage', () => {
      assert.ok(section, 'Currently Reading section should exist');
    });
    
    it('should have a section title', () => {
      const title = section.querySelector('.section-title');
      assert.ok(title, 'Section title should exist');
      assert.strictEqual(title.textContent.trim(), 'Currently Reading', 'Title should be "Currently Reading"');
    });
    
    it('should have a reading card container', () => {
      const card = section.querySelector('.reading-card');
      assert.ok(card, 'Reading card should exist');
    });
  });
  
  describe('Book Information', () => {
    it('should display book cover image', () => {
      const image = section.querySelector('.reading-image img');
      assert.ok(image, 'Book cover image should exist');
      assert.ok(image.getAttribute('src'), 'Image should have src attribute');
      assert.ok(image.getAttribute('alt'), 'Image should have alt text for accessibility');
    });
    
    it('should display book title', () => {
      const title = section.querySelector('.reading-title');
      assert.ok(title, 'Book title should exist');
      assert.ok(title.textContent.trim().length > 0, 'Title should have content');
    });
    
    it('should display book author', () => {
      const author = section.querySelector('.reading-author');
      assert.ok(author, 'Book author should exist');
      assert.ok(author.textContent.includes('by'), 'Author should be prefixed with "by"');
    });
    
    it('should have proper heading hierarchy', () => {
      const sectionTitle = section.querySelector('h2');
      const bookTitle = section.querySelector('h2.reading-title');
      
      assert.ok(sectionTitle, 'Section should have h2 heading');
      assert.ok(bookTitle, 'Book should have h2 heading');
    });
  });
  
  describe('Reading Progress Bar', () => {
    it('should have a progress bar container', () => {
      const progressBar = section.querySelector('.progress-bar');
      assert.ok(progressBar, 'Progress bar container should exist');
    });
    
    it('should have a progress fill element', () => {
      const progressFill = section.querySelector('.progress-fill');
      assert.ok(progressFill, 'Progress fill element should exist');
    });
    
    it('should have width style set on progress fill', () => {
      const progressFill = section.querySelector('.progress-fill');
      const widthStyle = progressFill.getAttribute('style');
      
      assert.ok(widthStyle, 'Progress fill should have inline style');
      assert.ok(widthStyle.includes('width'), 'Style should include width property');
    });
    
    it('should have ARIA attributes for accessibility', () => {
      const progressFill = section.querySelector('.progress-fill');
      
      assert.strictEqual(progressFill.getAttribute('role'), 'progressbar', 'Should have progressbar role');
      assert.ok(progressFill.hasAttribute('aria-valuenow'), 'Should have aria-valuenow attribute');
      assert.ok(progressFill.hasAttribute('aria-valuemin'), 'Should have aria-valuemin attribute');
      assert.ok(progressFill.hasAttribute('aria-valuemax'), 'Should have aria-valuemax attribute');
    });
    
    it('should have progress text displaying percentage', () => {
      const progressText = section.querySelector('.progress-text');
      assert.ok(progressText, 'Progress text should exist');
      assert.ok(progressText.textContent.includes('%'), 'Progress text should include percentage symbol');
      assert.ok(progressText.textContent.includes('complete'), 'Progress text should include "complete"');
    });
    
    it('should have matching percentage in ARIA and text', () => {
      const progressFill = section.querySelector('.progress-fill');
      const progressText = section.querySelector('.progress-text');
      
      const ariaValue = progressFill.getAttribute('aria-valuenow');
      const textValue = progressText.textContent.match(/(\d+)%/);
      
      if (textValue) {
        assert.strictEqual(ariaValue, textValue[1], 'ARIA value should match displayed percentage');
      }
    });
  });
  
  describe('Reading Thoughts', () => {
    it('should have a reading thoughts section', () => {
      const thoughts = section.querySelector('.reading-thoughts');
      assert.ok(thoughts, 'Reading thoughts section should exist');
    });
    
    it('should contain thought text content', () => {
      const thoughts = section.querySelector('.reading-thoughts p');
      assert.ok(thoughts, 'Thoughts paragraph should exist');
      assert.ok(thoughts.textContent.trim().length > 0, 'Thoughts should have content');
    });
  });
  
  describe('Responsive Layout Structure', () => {
    it('should have reading-image and reading-info containers for responsive layout', () => {
      const image = section.querySelector('.reading-image');
      const info = section.querySelector('.reading-info');
      
      assert.ok(image, 'Reading image container should exist');
      assert.ok(info, 'Reading info container should exist');
    });
    
    it('should have all info elements within reading-info container', () => {
      const info = section.querySelector('.reading-info');
      const title = info.querySelector('.reading-title');
      const author = info.querySelector('.reading-author');
      const progress = info.querySelector('.reading-progress');
      const thoughts = info.querySelector('.reading-thoughts');
      
      assert.ok(title, 'Title should be in reading-info');
      assert.ok(author, 'Author should be in reading-info');
      assert.ok(progress, 'Progress should be in reading-info');
      assert.ok(thoughts, 'Thoughts should be in reading-info');
    });
  });
  
  describe('CSS Classes', () => {
    it('should have all required CSS classes for styling', () => {
      const requiredClasses = [
        '.reading-card',
        '.reading-image',
        '.reading-info',
        '.reading-title',
        '.reading-author',
        '.reading-progress',
        '.progress-bar',
        '.progress-fill',
        '.progress-text',
        '.reading-thoughts'
      ];
      
      requiredClasses.forEach(className => {
        const element = section.querySelector(className);
        assert.ok(element, `Element with class ${className} should exist`);
      });
    });
  });
  
  describe('Content Quality', () => {
    it('should have descriptive alt text for book cover', () => {
      const image = section.querySelector('.reading-image img');
      const altText = image.getAttribute('alt');
      
      assert.ok(altText.length > 10, 'Alt text should be descriptive (more than 10 characters)');
      assert.ok(!altText.toLowerCase().includes('image'), 'Alt text should not include redundant "image" word');
    });
    
    it('should have substantive reading thoughts (not placeholder)', () => {
      const thoughts = section.querySelector('.reading-thoughts p');
      const thoughtText = thoughts.textContent.trim();
      
      assert.ok(thoughtText.length > 50, 'Thoughts should be substantive (more than 50 characters)');
      assert.ok(!thoughtText.toLowerCase().includes('lorem ipsum'), 'Should not contain Lorem Ipsum placeholder');
    });
  });
  
  describe('Integration with Page', () => {
    it('should be positioned after the carousel section', () => {
      const carousel = document.querySelector('.featured-carousel-section');
      const currentlyReading = document.querySelector('.currently-reading-section');
      
      assert.ok(carousel, 'Carousel section should exist');
      assert.ok(currentlyReading, 'Currently Reading section should exist');
      
      // Check that Currently Reading comes after carousel in DOM order
      const carouselPosition = Array.from(document.querySelectorAll('section')).indexOf(carousel);
      const readingPosition = Array.from(document.querySelectorAll('section')).indexOf(currentlyReading);
      
      assert.ok(readingPosition > carouselPosition, 'Currently Reading should come after carousel');
    });
    
    it('should be within the main element', () => {
      const main = document.querySelector('main');
      const sectionInMain = main.querySelector('.currently-reading-section');
      
      assert.ok(sectionInMain, 'Currently Reading section should be within main element');
    });
    
    it('should use container class for consistent layout', () => {
      const container = section.querySelector('.container');
      assert.ok(container, 'Section should use container class for consistent layout');
    });
  });
});
