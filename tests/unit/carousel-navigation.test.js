/**
 * Unit Tests: Carousel Navigation
 * Template 1: Literary Lounge
 * 
 * Tests for carousel prev/next button functionality, indicator dot navigation,
 * and auto-advance timing.
 * 
 * Validates: Requirements 8.1
 */

const { describe, it, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

describe('Carousel Navigation - Unit Tests', () => {
  let dom;
  let document;
  let window;
  let carousel;
  
  // Helper function to wait for a specific time
  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  // Helper function to get active slide index
  const getActiveSlideIndex = () => {
    const slides = document.querySelectorAll('.carousel-slide');
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) {
        return i;
      }
    }
    return -1;
  };
  
  // Helper function to get active indicator index
  const getActiveIndicatorIndex = () => {
    const indicators = document.querySelectorAll('.indicator');
    for (let i = 0; i < indicators.length; i++) {
      if (indicators[i].classList.contains('active')) {
        return i;
      }
    }
    return -1;
  };
  
  beforeEach(() => {
    // Load the HTML file
    const htmlPath = path.join(__dirname, '../../template-1-literary-lounge/index.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');
    
    // Remove script tags from HTML to prevent auto-loading
    htmlContent = htmlContent.replace(/<script[^>]*src=[^>]*><\/script>/gi, '');
    
    // Create a JSDOM instance
    dom = new JSDOM(htmlContent, {
      url: 'http://localhost',
      runScripts: 'outside-only'
    });
    
    document = dom.window.document;
    window = dom.window;
    
    // Load and execute the JavaScript in the window context
    const jsPath = path.join(__dirname, '../../template-1-literary-lounge/js/script.js');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    
    // Execute the script in the JSDOM window context
    const script = new vm.Script(jsContent);
    const context = dom.getInternalVMContext();
    script.runInContext(context);
    
    // Trigger DOMContentLoaded
    const event = new window.Event('DOMContentLoaded');
    document.dispatchEvent(event);
    
    carousel = document.querySelector('.featured-carousel');
  });
  
  afterEach(() => {
    // Clean up intervals and timeouts
    if (window) {
      // Clear any running intervals
      for (let i = 1; i < 1000; i++) {
        window.clearInterval(i);
        window.clearTimeout(i);
      }
    }
    if (dom) {
      dom.window.close();
    }
  });

  
  describe('Next Button Navigation', () => {
    it('should advance to the next slide when next button is clicked', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const initialSlide = getActiveSlideIndex();
      
      // Click next button
      nextBtn.click();
      
      const newSlide = getActiveSlideIndex();
      assert.strictEqual(newSlide, (initialSlide + 1) % 4, 'Should advance to next slide');
    });
    
    it('should wrap around to first slide when clicking next on last slide', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Navigate to last slide
      const indicators = carousel.querySelectorAll('.indicator');
      indicators[slides.length - 1].click();
      
      // Verify we're on the last slide
      assert.strictEqual(getActiveSlideIndex(), slides.length - 1, 'Should be on last slide');
      
      // Click next button
      nextBtn.click();
      
      // Should wrap to first slide
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should wrap to first slide');
    });
    
    it('should update indicator dots when next button is clicked', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const initialIndicator = getActiveIndicatorIndex();
      
      // Click next button
      nextBtn.click();
      
      const newIndicator = getActiveIndicatorIndex();
      assert.strictEqual(newIndicator, (initialIndicator + 1) % 4, 'Indicator should update to match slide');
    });
  });

  
  describe('Previous Button Navigation', () => {
    it('should go to the previous slide when prev button is clicked', () => {
      const prevBtn = carousel.querySelector('.carousel-prev');
      const nextBtn = carousel.querySelector('.carousel-next');
      
      // First go to slide 2
      nextBtn.click();
      const currentSlide = getActiveSlideIndex();
      assert.strictEqual(currentSlide, 1, 'Should be on slide 2');
      
      // Click prev button
      prevBtn.click();
      
      const newSlide = getActiveSlideIndex();
      assert.strictEqual(newSlide, 0, 'Should go back to slide 1');
    });
    
    it('should wrap around to last slide when clicking prev on first slide', () => {
      const prevBtn = carousel.querySelector('.carousel-prev');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Verify we're on the first slide
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should start on first slide');
      
      // Click prev button
      prevBtn.click();
      
      // Should wrap to last slide
      assert.strictEqual(getActiveSlideIndex(), slides.length - 1, 'Should wrap to last slide');
    });
    
    it('should update indicator dots when prev button is clicked', () => {
      const prevBtn = carousel.querySelector('.carousel-prev');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Click prev button from first slide
      prevBtn.click();
      
      const newIndicator = getActiveIndicatorIndex();
      assert.strictEqual(newIndicator, slides.length - 1, 'Indicator should update to match last slide');
    });
  });

  
  describe('Indicator Dot Navigation', () => {
    it('should navigate to specific slide when indicator dot is clicked', () => {
      const indicators = carousel.querySelectorAll('.indicator');
      
      // Click on third indicator (index 2)
      indicators[2].click();
      
      assert.strictEqual(getActiveSlideIndex(), 2, 'Should navigate to slide 3');
      assert.strictEqual(getActiveIndicatorIndex(), 2, 'Indicator 3 should be active');
    });
    
    it('should allow direct navigation to any slide via indicators', () => {
      const indicators = carousel.querySelectorAll('.indicator');
      
      // Test navigation to each slide
      for (let i = 0; i < indicators.length; i++) {
        indicators[i].click();
        assert.strictEqual(getActiveSlideIndex(), i, `Should navigate to slide ${i + 1}`);
        assert.strictEqual(getActiveIndicatorIndex(), i, `Indicator ${i + 1} should be active`);
      }
    });
    
    it('should update both slide and indicator when clicking indicator', () => {
      const indicators = carousel.querySelectorAll('.indicator');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Click on second indicator
      indicators[1].click();
      
      // Check that only the second slide is active
      assert.ok(slides[1].classList.contains('active'), 'Second slide should be active');
      assert.ok(!slides[0].classList.contains('active'), 'First slide should not be active');
      assert.ok(!slides[2].classList.contains('active'), 'Third slide should not be active');
      
      // Check that only the second indicator is active
      assert.ok(indicators[1].classList.contains('active'), 'Second indicator should be active');
      assert.ok(!indicators[0].classList.contains('active'), 'First indicator should not be active');
      assert.ok(!indicators[2].classList.contains('active'), 'Third indicator should not be active');
    });
  });

  
  describe('Auto-Advance Timing', () => {
    it('should auto-advance to next slide after 5 seconds', async () => {
      const initialSlide = getActiveSlideIndex();
      assert.strictEqual(initialSlide, 0, 'Should start on first slide');
      
      // Wait for auto-advance (5 seconds + small buffer)
      await wait(5100);
      
      const newSlide = getActiveSlideIndex();
      assert.strictEqual(newSlide, 1, 'Should auto-advance to second slide after 5 seconds');
    });
    
    it('should wrap around to first slide after auto-advancing from last slide', async () => {
      const indicators = carousel.querySelectorAll('.indicator');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Navigate to last slide
      indicators[slides.length - 1].click();
      assert.strictEqual(getActiveSlideIndex(), slides.length - 1, 'Should be on last slide');
      
      // Wait for auto-advance
      await wait(5100);
      
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should wrap to first slide');
    });
    
    it('should restart auto-advance timer after manual navigation', async () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      
      // Wait 2.5 seconds (not enough for auto-advance)
      await wait(2500);
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should still be on first slide');
      
      // Manually navigate
      nextBtn.click();
      assert.strictEqual(getActiveSlideIndex(), 1, 'Should be on second slide after manual navigation');
      
      // Wait another 2.5 seconds (timer should have reset, so still on slide 2)
      await wait(2500);
      assert.strictEqual(getActiveSlideIndex(), 1, 'Should still be on second slide (timer reset)');
      
      // Wait for full interval from manual navigation (2.5 more seconds = 5 total)
      await wait(2700);
      assert.strictEqual(getActiveSlideIndex(), 2, 'Should auto-advance to third slide after reset timer');
    });
  });

  
  describe('Pause on Hover', () => {
    it('should pause auto-advance when mouse enters carousel', async () => {
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should start on first slide');
      
      // Trigger mouseenter event
      const mouseEnterEvent = new window.MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true
      });
      carousel.dispatchEvent(mouseEnterEvent);
      
      // Wait more than 5 seconds
      await wait(5200);
      
      // Should still be on first slide (paused)
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should remain on first slide when paused');
    });
    
    it('should resume auto-advance when mouse leaves carousel', async () => {
      // Trigger mouseenter to pause
      const mouseEnterEvent = new window.MouseEvent('mouseenter', {
        bubbles: true,
        cancelable: true
      });
      carousel.dispatchEvent(mouseEnterEvent);
      
      // Wait a bit while paused
      await wait(1500);
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should still be on first slide while paused');
      
      // Trigger mouseleave to resume
      const mouseLeaveEvent = new window.MouseEvent('mouseleave', {
        bubbles: true,
        cancelable: true
      });
      carousel.dispatchEvent(mouseLeaveEvent);
      
      // Wait for auto-advance
      await wait(5100);
      
      // Should have advanced
      assert.strictEqual(getActiveSlideIndex(), 1, 'Should auto-advance after resume');
    });
  });

  
  describe('Keyboard Navigation', () => {
    it('should navigate to next slide when right arrow key is pressed', () => {
      const initialSlide = getActiveSlideIndex();
      
      // Trigger right arrow key
      const keyEvent = new window.KeyboardEvent('keydown', {
        key: 'ArrowRight',
        bubbles: true,
        cancelable: true
      });
      carousel.dispatchEvent(keyEvent);
      
      const newSlide = getActiveSlideIndex();
      assert.strictEqual(newSlide, (initialSlide + 1) % 4, 'Should advance to next slide with right arrow');
    });
    
    it('should navigate to previous slide when left arrow key is pressed', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      
      // First go to slide 2
      nextBtn.click();
      assert.strictEqual(getActiveSlideIndex(), 1, 'Should be on slide 2');
      
      // Trigger left arrow key
      const keyEvent = new window.KeyboardEvent('keydown', {
        key: 'ArrowLeft',
        bubbles: true,
        cancelable: true
      });
      carousel.dispatchEvent(keyEvent);
      
      assert.strictEqual(getActiveSlideIndex(), 0, 'Should go back to slide 1 with left arrow');
    });
  });

  
  describe('Edge Cases', () => {
    it('should handle rapid button clicks correctly', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      
      // Click next button multiple times rapidly
      nextBtn.click();
      nextBtn.click();
      nextBtn.click();
      
      // Should be on slide 4 (index 3)
      assert.strictEqual(getActiveSlideIndex(), 3, 'Should handle rapid clicks correctly');
    });
    
    it('should handle mixed navigation methods', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const prevBtn = carousel.querySelector('.carousel-prev');
      const indicators = carousel.querySelectorAll('.indicator');
      
      // Mix of navigation methods
      nextBtn.click(); // Go to slide 2
      assert.strictEqual(getActiveSlideIndex(), 1);
      
      indicators[3].click(); // Jump to slide 4
      assert.strictEqual(getActiveSlideIndex(), 3);
      
      prevBtn.click(); // Go back to slide 3
      assert.strictEqual(getActiveSlideIndex(), 2);
      
      nextBtn.click(); // Go to slide 4
      assert.strictEqual(getActiveSlideIndex(), 3);
    });
    
    it('should maintain only one active slide at a time', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const slides = carousel.querySelectorAll('.carousel-slide');
      
      // Navigate through slides
      for (let i = 0; i < 5; i++) {
        nextBtn.click();
        
        // Count active slides
        let activeCount = 0;
        slides.forEach(slide => {
          if (slide.classList.contains('active')) {
            activeCount++;
          }
        });
        
        assert.strictEqual(activeCount, 1, 'Should have exactly one active slide');
      }
    });
    
    it('should maintain only one active indicator at a time', () => {
      const nextBtn = carousel.querySelector('.carousel-next');
      const indicators = carousel.querySelectorAll('.indicator');
      
      // Navigate through slides
      for (let i = 0; i < 5; i++) {
        nextBtn.click();
        
        // Count active indicators
        let activeCount = 0;
        indicators.forEach(indicator => {
          if (indicator.classList.contains('active')) {
            activeCount++;
          }
        });
        
        assert.strictEqual(activeCount, 1, 'Should have exactly one active indicator');
      }
    });
  });
});
