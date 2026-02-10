const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

describe('Blog Archive Page - Template 1', () => {
  const htmlPath = path.join(__dirname, '../../template-1-literary-lounge/blog.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  const $ = cheerio.load(html);
  
  test('should have proper semantic HTML structure', () => {
    assert.strictEqual($('header.site-header').length, 1, 'Should have one header');
    assert.strictEqual($('main').length, 1, 'Should have one main element');
    assert.strictEqual($('footer.site-footer').length, 1, 'Should have one footer');
  });
  
  test('should have blog header section with title and intro', () => {
    assert.strictEqual($('.blog-header').length, 1, 'Should have blog header section');
    assert.strictEqual($('.blog-header h1.page-title').length, 1, 'Should have h1 page title');
    assert.strictEqual($('.blog-header .page-intro').length, 1, 'Should have intro text');
    assert.ok($('.blog-header .page-intro').text().trim().length > 50, 'Intro should be substantive');
  });
  
  test('should have blog archive grid with 6-9 post cards', () => {
    assert.strictEqual($('.blog-archive-section').length, 1, 'Should have blog archive section');
    assert.strictEqual($('.blog-grid').length, 1, 'Should have blog grid');
    
    const postCards = $('.blog-grid .post-card');
    assert.ok(postCards.length >= 6, `Should have at least 6 post cards, found ${postCards.length}`);
    assert.ok(postCards.length <= 9, `Should have at most 9 post cards, found ${postCards.length}`);
  });
  
  test('should have featured large and wide post cards for magazine layout', () => {
    const largeCard = $('.blog-grid .post-card-large');
    assert.ok(largeCard.length >= 1, 'Should have at least one large featured card');
    
    const wideCard = $('.blog-grid .post-card-wide');
    assert.ok(wideCard.length >= 1, 'Should have at least one wide card');
  });
  
  test('each post card should have all required elements', () => {
    $('.blog-grid .post-card').each((i, card) => {
      const $card = $(card);
      
      // Check for image
      const image = $card.find('.post-card-image img');
      assert.strictEqual(image.length, 1, `Card ${i} should have image`);
      assert.ok(image.attr('src'), `Card ${i} image should have src`);
      assert.ok(image.attr('alt') !== undefined, `Card ${i} image should have alt text`);
      
      // Check for title with link
      const title = $card.find('.post-card-title');
      const titleLink = title.find('a');
      assert.strictEqual(title.length, 1, `Card ${i} should have title`);
      assert.strictEqual(titleLink.length, 1, `Card ${i} title should have link`);
      assert.ok(titleLink.attr('href'), `Card ${i} title link should have href`);
      
      // Check for date
      const time = $card.find('.post-card-meta time');
      assert.strictEqual(time.length, 1, `Card ${i} should have time element`);
      assert.ok(time.attr('datetime'), `Card ${i} time should have datetime attribute`);
      
      // Check for excerpt
      const excerpt = $card.find('.post-card-excerpt');
      assert.strictEqual(excerpt.length, 1, `Card ${i} should have excerpt`);
      assert.ok(excerpt.text().trim().length > 20, `Card ${i} excerpt should be substantive`);
      
      // Check for Read More button
      const readMore = $card.find('.btn-read-more');
      assert.strictEqual(readMore.length, 1, `Card ${i} should have Read More button`);
      assert.strictEqual(readMore.text().trim(), 'Read More', `Card ${i} Read More should have correct text`);
    });
  });
  
  test('featured large card should use h2 for title', () => {
    const largeCard = $('.blog-grid .post-card-large').first();
    const title = largeCard.find('.post-card-title');
    assert.strictEqual(title.prop('tagName'), 'H2', 'Large card should use H2 for title');
  });
  
  test('regular cards should use h2 for title', () => {
    const regularCards = $('.blog-grid .post-card').not('.post-card-large, .post-card-wide');
    regularCards.each((i, card) => {
      const title = $(card).find('.post-card-title');
      assert.strictEqual(title.prop('tagName'), 'H2', `Regular card ${i} should use H2`);
    });
  });
  
  test('all post cards should be article elements', () => {
    $('.blog-grid .post-card').each((i, card) => {
      assert.strictEqual($(card).prop('tagName'), 'ARTICLE', `Card ${i} should be an article element`);
    });
  });
  
  test('should have complete navigation to all pages', () => {
    const navLinks = $('.main-nav a');
    const hrefs = navLinks.map((i, link) => $(link).attr('href')).get();
    
    assert.ok(hrefs.includes('index.html'), 'Should link to index.html');
    assert.ok(hrefs.includes('blog.html'), 'Should link to blog.html');
    assert.ok(hrefs.includes('about.html'), 'Should link to about.html');
    assert.ok(hrefs.includes('shop.html'), 'Should link to shop.html');
    assert.ok(hrefs.includes('contact.html'), 'Should link to contact.html');
  });
  
  test('should have newsletter form in footer', () => {
    const footerForm = $('.site-footer .newsletter-form');
    assert.strictEqual(footerForm.length, 1, 'Should have newsletter form in footer');
    
    const emailInput = footerForm.find('input[type="email"]');
    assert.strictEqual(emailInput.length, 1, 'Should have email input');
    assert.ok(emailInput.attr('required') !== undefined, 'Email input should be required');
  });
  
  test('should have social media links with proper attributes', () => {
    const socialLinks = $('.site-footer .social-icons a');
    assert.ok(socialLinks.length >= 3, 'Should have at least 3 social links');
    
    socialLinks.each((i, link) => {
      const $link = $(link);
      assert.strictEqual($link.attr('target'), '_blank', `Social link ${i} should open in new tab`);
      assert.strictEqual($link.attr('rel'), 'noopener', `Social link ${i} should have rel="noopener"`);
      assert.ok($link.attr('aria-label'), `Social link ${i} should have aria-label`);
    });
  });
  
  test('should have newsletter modal', () => {
    const modal = $('#newsletterModal');
    assert.strictEqual(modal.length, 1, 'Should have newsletter modal');
    assert.strictEqual(modal.attr('role'), 'dialog', 'Modal should have dialog role');
    
    const closeBtn = modal.find('.modal-close');
    assert.strictEqual(closeBtn.length, 1, 'Modal should have close button');
    assert.ok(closeBtn.attr('aria-label'), 'Close button should have aria-label');
  });
  
  test('should link to CSS and JavaScript files', () => {
    assert.strictEqual($('link[href="css/variables.css"]').length, 1, 'Should link to variables.css');
    assert.strictEqual($('link[href="css/styles.css"]').length, 1, 'Should link to styles.css');
    assert.strictEqual($('script[src="js/script.js"]').length, 1, 'Should link to script.js');
  });
  
  test('should have SEO meta tags', () => {
    const description = $('meta[name="description"]').attr('content');
    assert.ok(description, 'Should have meta description');
    assert.ok(description.length > 50, 'Meta description should be substantive');
    
    assert.ok($('meta[property="og:title"]').attr('content'), 'Should have OG title');
    assert.ok($('meta[property="og:description"]').attr('content'), 'Should have OG description');
    assert.strictEqual($('meta[property="og:type"]').attr('content'), 'website', 'Should have OG type');
  });
  
  test('should have Chikielau logo', () => {
    const logo = $('.logo img');
    assert.strictEqual(logo.length, 1, 'Should have logo image');
    assert.ok(logo.attr('alt').includes('Chikielau'), 'Logo alt should mention Chikielau');
  });
});
