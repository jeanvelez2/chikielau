const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

test('Template 2: Instagram Gallery Section', async (t) => {
  let dom;
  let document;
  
  const htmlPath = path.join(__dirname, '../../template-2-celestial-bookshelf/index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  dom = new JSDOM(html);
  document = dom.window.document;
  
  await t.test('Instagram Gallery HTML Structure', async (t) => {
    await t.test('should have instagram-gallery section', () => {
      const instagramSection = document.querySelector('.instagram-gallery');
      assert.ok(instagramSection, 'Instagram gallery section should exist');
      assert.strictEqual(instagramSection.tagName, 'SECTION');
    });
    
    await t.test('should have section header with title and subtitle', () => {
      const sectionHeader = document.querySelector('.instagram-gallery .section-header');
      assert.ok(sectionHeader, 'Section header should exist');
      
      const title = sectionHeader.querySelector('.section-title');
      assert.ok(title, 'Section title should exist');
      assert.ok(title.textContent.includes('Follow My Reading Journey'));
      
      const subtitle = sectionHeader.querySelector('.section-subtitle');
      assert.ok(subtitle, 'Section subtitle should exist');
      assert.ok(subtitle.textContent.length > 0);
    });
    
    await t.test('should have instagram-feed container', () => {
      const instagramFeed = document.querySelector('.instagram-feed');
      assert.ok(instagramFeed, 'Instagram feed container should exist');
    });
    
    await t.test('should have integration instructions comment', () => {
      const instagramFeed = document.querySelector('.instagram-feed');
      const html = instagramFeed.innerHTML;
      assert.ok(html.includes('INSTAGRAM INTEGRATION INSTRUCTIONS'));
      assert.ok(html.includes('SnapWidget'));
      assert.ok(html.includes('Elfsight'));
      assert.ok(html.includes('Instagram Native Embed'));
    });
    
    await t.test('should have placeholder grid with 6 items', () => {
      const placeholderGrid = document.querySelector('.instagram-placeholder-grid');
      assert.ok(placeholderGrid, 'Placeholder grid should exist');
      
      const items = placeholderGrid.querySelectorAll('.instagram-item');
      assert.strictEqual(items.length, 6, 'Should have 6 Instagram items');
    });
    
    await t.test('each instagram item should have image and overlay', () => {
      const items = document.querySelectorAll('.instagram-item');
      
      items.forEach((item, index) => {
        const img = item.querySelector('img');
        assert.ok(img, `Item ${index + 1} should have an image`);
        assert.ok(img.getAttribute('src').includes('instagram-'));
        assert.ok(img.getAttribute('alt'));
        assert.strictEqual(img.getAttribute('loading'), 'lazy');
        
        const overlay = item.querySelector('.instagram-overlay');
        assert.ok(overlay, `Item ${index + 1} should have an overlay`);
        
        const icon = overlay.querySelector('.instagram-icon');
        assert.ok(icon, `Item ${index + 1} should have an icon`);
      });
    });
    
    await t.test('should have CTA button to follow on Instagram', () => {
      const cta = document.querySelector('.instagram-gallery .section-cta');
      assert.ok(cta, 'CTA section should exist');
      
      const button = cta.querySelector('a.btn-gold');
      assert.ok(button, 'CTA button should exist');
      assert.ok(button.textContent.includes('Follow on Instagram'));
      assert.ok(button.getAttribute('href').includes('instagram.com'));
      assert.strictEqual(button.getAttribute('target'), '_blank');
      assert.strictEqual(button.getAttribute('rel'), 'noopener');
    });
  });
  
  await t.test('Instagram Gallery CSS Styles', async (t) => {
    await t.test('should have CSS file with instagram gallery styles', () => {
      const cssPath = path.join(__dirname, '../../template-2-celestial-bookshelf/css/styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      assert.ok(css.includes('.instagram-gallery'));
      assert.ok(css.includes('.instagram-container'));
      assert.ok(css.includes('.instagram-feed'));
      assert.ok(css.includes('.instagram-placeholder-grid'));
      assert.ok(css.includes('.instagram-item'));
      assert.ok(css.includes('.instagram-overlay'));
    });
    
    await t.test('should have responsive grid styles', () => {
      const cssPath = path.join(__dirname, '../../template-2-celestial-bookshelf/css/styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      // Mobile: 2 columns (base style)
      assert.ok(/\.instagram-placeholder-grid\s*{[^}]*grid-template-columns:\s*repeat\(2,\s*1fr\)/.test(css), 'Should have 2 column grid for mobile');
      
      // Tablet: 3 columns - check that it exists in the 768px media query section
      assert.ok(css.includes('/* Instagram Gallery: 2-3 columns on tablet */'), 'Should have tablet Instagram gallery comment');
      assert.ok(css.includes('grid-template-columns: repeat(3, 1fr)'), 'Should have 3 column grid for tablet');
      
      // Desktop: 6 columns - check that it exists in the 1024px media query section
      assert.ok(css.includes('/* Instagram Gallery: 4-6 columns on desktop */'), 'Should have desktop Instagram gallery comment');
      assert.ok(css.includes('grid-template-columns: repeat(6, 1fr)'), 'Should have 6 column grid for desktop');
    });
    
    await t.test('should have hover effects on instagram items', () => {
      const cssPath = path.join(__dirname, '../../template-2-celestial-bookshelf/css/styles.css');
      const css = fs.readFileSync(cssPath, 'utf-8');
      
      assert.ok(css.includes('.instagram-item:hover'));
      assert.ok(css.includes('.instagram-overlay'));
      assert.ok(/opacity:\s*0/.test(css));
      assert.ok(/\.instagram-item:hover\s+\.instagram-overlay[^}]*opacity:\s*1/.test(css));
    });
  });
  
  await t.test('Instagram Gallery Accessibility', async (t) => {
    await t.test('all images should have descriptive alt text', () => {
      const images = document.querySelectorAll('.instagram-item img');
      
      images.forEach((img, index) => {
        const alt = img.getAttribute('alt');
        assert.ok(alt, `Image ${index + 1} should have alt text`);
        assert.ok(alt.length > 0);
        assert.notStrictEqual(alt, '');
      });
    });
    
    await t.test('images should have lazy loading', () => {
      const images = document.querySelectorAll('.instagram-item img');
      
      images.forEach((img, index) => {
        assert.strictEqual(img.getAttribute('loading'), 'lazy', `Image ${index + 1} should have lazy loading`);
      });
    });
    
    await t.test('CTA link should have proper attributes for external link', () => {
      const ctaLink = document.querySelector('.instagram-gallery .section-cta a');
      
      assert.strictEqual(ctaLink.getAttribute('target'), '_blank');
      assert.strictEqual(ctaLink.getAttribute('rel'), 'noopener');
    });
  });
  
  await t.test('Instagram Gallery Placeholder Images', async (t) => {
    await t.test('all placeholder images should exist', () => {
      for (let i = 1; i <= 6; i++) {
        const imagePath = path.join(
          __dirname,
          '../../template-2-celestial-bookshelf/assets/images/placeholders',
          `instagram-${i}.svg`
        );
        assert.ok(fs.existsSync(imagePath), `instagram-${i}.svg should exist`);
      }
    });
    
    await t.test('placeholder images should be valid SVG files', () => {
      for (let i = 1; i <= 6; i++) {
        const imagePath = path.join(
          __dirname,
          '../../template-2-celestial-bookshelf/assets/images/placeholders',
          `instagram-${i}.svg`
        );
        const content = fs.readFileSync(imagePath, 'utf-8');
        assert.ok(content.includes('<svg'));
        assert.ok(content.includes('</svg>'));
      }
    });
  });
  
  await t.test('Instagram Gallery Integration Documentation', async (t) => {
    await t.test('should have clear instructions for integration', () => {
      const instagramFeed = document.querySelector('.instagram-feed');
      const html = instagramFeed.innerHTML;
      
      // Check for service options
      assert.ok(html.includes('Option 1: SnapWidget'));
      assert.ok(html.includes('Option 2: Elfsight'));
      assert.ok(html.includes('Option 3: Instagram Native Embed'));
      
      // Check for responsive information
      assert.ok(html.includes('Mobile: 1-2 columns'));
      assert.ok(html.includes('Tablet: 2-3 columns'));
      assert.ok(html.includes('Desktop: 4-6 columns'));
    });
  });
});
