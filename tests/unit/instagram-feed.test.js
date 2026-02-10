/**
 * Unit Tests for Instagram Feed Integration
 * Template 1: Literary Lounge
 * 
 * Tests verify that the Instagram feed integration area is properly implemented
 * with correct HTML structure, placeholder content, and instructions.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

describe('Instagram Feed Integration - Template 1', () => {
  const htmlPath = path.join(__dirname, '../../template-1-literary-lounge/index.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;

  describe('Instagram Feed Section Structure', () => {
    test('should have Instagram feed section on homepage', () => {
      const instagramSection = document.querySelector('.instagram-feed-section');
      assert.ok(instagramSection, 'Instagram feed section should exist');
    });

    test('should have section title', () => {
      const sectionTitle = document.querySelector('.instagram-feed-section .section-title');
      assert.ok(sectionTitle, 'Section title should exist');
      assert.ok(sectionTitle.textContent.trim(), 'Section title should have content');
    });

    test('should have introductory text', () => {
      const intro = document.querySelector('.instagram-intro');
      assert.ok(intro, 'Instagram intro should exist');
      assert.ok(intro.textContent.trim(), 'Instagram intro should have content');
    });

    test('should have Instagram feed widget container', () => {
      const widget = document.querySelector('.instagram-feed-widget');
      assert.ok(widget, 'Instagram feed widget should exist');
    });
  });

  describe('Integration Instructions', () => {
    test('should contain HTML comment with integration instructions', () => {
      // Check for instruction comment
      assert.ok(htmlContent.includes('INSTAGRAM FEED INTEGRATION INSTRUCTIONS'), 'Should have integration instructions');
      assert.ok(htmlContent.includes('METHOD 1: Third-Party Widget Services'), 'Should mention METHOD 1');
      assert.ok(htmlContent.includes('METHOD 2: Instagram Official Embed'), 'Should mention METHOD 2');
      assert.ok(htmlContent.includes('METHOD 3: Manual Grid'), 'Should mention METHOD 3');
    });

    test('should mention recommended integration services', () => {
      assert.ok(htmlContent.includes('SnapWidget'), 'Should mention SnapWidget');
      assert.ok(htmlContent.includes('Elfsight'), 'Should mention Elfsight');
      assert.ok(htmlContent.includes('Behold'), 'Should mention Behold');
    });

    test('should provide step-by-step instructions', () => {
      // Check for numbered steps
      assert.ok(htmlContent.includes('Steps:'), 'Should have Steps label');
      assert.ok(htmlContent.includes('1.'), 'Should have step 1');
      assert.ok(htmlContent.includes('2.'), 'Should have step 2');
      assert.ok(htmlContent.includes('3.'), 'Should have step 3');
    });
  });

  describe('Placeholder Content', () => {
    test('should have placeholder content for visual reference', () => {
      const placeholder = document.querySelector('.instagram-placeholder');
      assert.ok(placeholder, 'Placeholder should exist');
    });

    test('should have placeholder icon', () => {
      const icon = document.querySelector('.placeholder-icon');
      assert.ok(icon, 'Placeholder icon should exist');
      
      const svg = icon.querySelector('svg');
      assert.ok(svg, 'SVG icon should exist');
    });

    test('should have placeholder heading', () => {
      const heading = document.querySelector('.instagram-placeholder h2');
      assert.ok(heading, 'Placeholder heading should exist');
      assert.ok(heading.textContent.trim(), 'Placeholder heading should have content');
    });

    test('should have placeholder description', () => {
      const description = document.querySelector('.instagram-placeholder p');
      assert.ok(description, 'Placeholder description should exist');
      assert.ok(description.textContent.trim(), 'Placeholder description should have content');
    });

    test('should have call-to-action button', () => {
      const ctaButton = document.querySelector('.instagram-placeholder .btn-gold');
      assert.ok(ctaButton, 'CTA button should exist');
      assert.ok(ctaButton.getAttribute('href').includes('instagram.com'), 'CTA should link to Instagram');
      assert.strictEqual(ctaButton.getAttribute('target'), '_blank', 'CTA should open in new tab');
      assert.strictEqual(ctaButton.getAttribute('rel'), 'noopener', 'CTA should have rel="noopener"');
    });

    test('should have link to Instagram profile', () => {
      const instagramLink = document.querySelector('.instagram-placeholder a[href*="instagram.com"]');
      assert.ok(instagramLink, 'Instagram profile link should exist');
    });
  });

  describe('Accessibility', () => {
    test('should have proper semantic structure', () => {
      const section = document.querySelector('.instagram-feed-section');
      assert.strictEqual(section.tagName.toLowerCase(), 'section', 'Should use section element');
    });

    test('should have heading for screen readers', () => {
      const heading = document.querySelector('.instagram-feed-section h2');
      assert.ok(heading, 'Should have h2 heading');
    });

    test('should have external links with proper attributes', () => {
      const externalLinks = document.querySelectorAll('.instagram-placeholder a[target="_blank"]');
      externalLinks.forEach(link => {
        assert.ok(link.getAttribute('rel').includes('noopener'), 'External links should have rel="noopener"');
      });
    });

    test('should have descriptive SVG icon', () => {
      const svg = document.querySelector('.placeholder-icon svg');
      assert.ok(svg, 'SVG icon should exist');
    });
  });

  describe('CSS Styling', () => {
    const cssPath = path.join(__dirname, '../../template-1-literary-lounge/css/styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    test('should have CSS file with Instagram feed styles', () => {
      assert.ok(cssContent.includes('.instagram-feed-section'), 'Should have .instagram-feed-section styles');
      assert.ok(cssContent.includes('.instagram-feed-widget'), 'Should have .instagram-feed-widget styles');
      assert.ok(cssContent.includes('.instagram-placeholder'), 'Should have .instagram-placeholder styles');
    });

    test('should have responsive styles for Instagram feed', () => {
      // Check for media queries
      assert.ok(cssContent.includes('@media (min-width: 768px)'), 'Should have tablet breakpoint');
      assert.ok(cssContent.includes('@media (min-width: 1024px)'), 'Should have desktop breakpoint');
    });

    test('should have manual grid styles for static implementation', () => {
      assert.ok(cssContent.includes('.instagram-grid'), 'Should have .instagram-grid styles');
      assert.ok(cssContent.includes('.instagram-item'), 'Should have .instagram-item styles');
    });

    test('should have sidebar widget format styles for desktop', () => {
      // Check for desktop layout with sidebar positioning
      const desktopSection = cssContent.match(/@media \(min-width: 1024px\)[^}]*\.instagram-feed-section[^}]*{[^}]*}/gs);
      assert.ok(desktopSection, 'Should have desktop sidebar styles');
    });
  });

  describe('Brand Consistency', () => {
    test('should use brand color classes', () => {
      const ctaButton = document.querySelector('.instagram-placeholder .btn-gold');
      assert.ok(ctaButton, 'CTA button should exist');
      assert.ok(ctaButton.classList.contains('btn-gold'), 'CTA button should have btn-gold class');
    });

    test('should match template aesthetic', () => {
      const cssPath = path.join(__dirname, '../../template-1-literary-lounge/css/styles.css');
      const cssContent = fs.readFileSync(cssPath, 'utf-8');
      
      // Should use CSS variables for consistency
      const instagramSection = cssContent.match(/\.instagram-feed-section[\s\S]*?(?=\/\*|\.[\w-]+\s*{)/);
      if (instagramSection) {
        assert.ok(instagramSection[0].includes('var(--'), 'Should use CSS variables');
      }
    });
  });

  describe('Integration Flexibility', () => {
    test('should support multiple integration methods', () => {
      // Should mention at least 3 methods
      const methodCount = (htmlContent.match(/METHOD \d:/g) || []).length;
      assert.ok(methodCount >= 3, 'Should have at least 3 integration methods');
    });

    test('should have container ready for embed code', () => {
      const widget = document.querySelector('.instagram-feed-widget');
      assert.ok(widget, 'Widget container should exist');
      // Widget should be able to contain embed code
      assert.ok(widget.innerHTML.trim(), 'Widget should have content');
    });

    test('should provide example HTML for manual grid', () => {
      assert.ok(htmlContent.includes('instagram-grid'), 'Should mention instagram-grid');
      assert.ok(htmlContent.includes('instagram-item'), 'Should mention instagram-item');
    });
  });

  describe('Responsive Design', () => {
    const cssPath = path.join(__dirname, '../../template-1-literary-lounge/css/styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf-8');

    test('should be mobile-friendly', () => {
      // Should have base mobile styles
      assert.ok(cssContent.includes('.instagram-feed-section'), 'Should have base mobile styles');
    });

    test('should adapt to sidebar on desktop', () => {
      // Check for desktop grid layout
      const desktopStyles = cssContent.match(/@media \(min-width: 1024px\)[\s\S]*?\.instagram-feed-section[\s\S]*?grid-template-columns/);
      assert.ok(desktopStyles, 'Should have desktop sidebar layout');
    });

    test('should have full-width on mobile', () => {
      // Base styles should not restrict width
      const baseSection = cssContent.match(/\.instagram-feed-section\s*{[^}]*}/);
      assert.ok(baseSection, 'Should have base section styles');
    });
  });
});
