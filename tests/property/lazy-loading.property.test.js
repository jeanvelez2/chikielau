/**
 * Property-Based Tests for Lazy Loading
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about lazy loading for images
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Required HTML files
const HTML_FILES = [
  'index.html',
  'blog.html',
  'blog-post.html',
  'about.html',
  'shop.html',
  'contact.html'
];

/**
 * Helper function to parse HTML file and return DOM
 * @param {string} filePath - Path to HTML file
 * @returns {Document} - Parsed DOM document
 */
function parseHtmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const dom = new JSDOM(content);
  return dom.window.document;
}

/**
 * Helper function to determine if an image is in the hero/header section
 * @param {Element} img - Image element
 * @returns {boolean} - True if image is in hero/header (above the fold)
 */
function isAboveTheFold(img) {
  let element = img;
  
  // Traverse up the DOM tree to check if image is in header or hero section
  while (element && element.parentElement) {
    element = element.parentElement;
    
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    const className = element.className || '';
    const id = element.id || '';
    
    // Check if element is a header
    if (tagName === 'header') {
      return true;
    }
    
    // Check if element has hero-related classes or IDs
    const heroPatterns = [
      'hero',
      'banner',
      'masthead',
      'site-header',
      'header-container'
    ];
    
    const isHeroSection = heroPatterns.some(pattern => {
      return className.toLowerCase().includes(pattern) || 
             id.toLowerCase().includes(pattern);
    });
    
    if (isHeroSection) {
      return true;
    }
  }
  
  return false;
}

/**
 * Helper function to determine if an image is a logo
 * @param {Element} img - Image element
 * @returns {boolean} - True if image is a logo
 */
function isLogo(img) {
  const src = img.getAttribute('src') || '';
  const alt = img.getAttribute('alt') || '';
  const className = img.className || '';
  const id = img.id || '';
  
  return src.toLowerCase().includes('logo') ||
         alt.toLowerCase().includes('logo') ||
         className.toLowerCase().includes('logo') ||
         id.toLowerCase().includes('logo');
}

/**
 * Helper function to determine if an image is a small icon
 * @param {Element} img - Image element
 * @returns {boolean} - True if image is a small icon (social media, etc.)
 */
function isSmallIcon(img) {
  const src = img.getAttribute('src') || '';
  const className = img.className || '';
  const parentClass = img.parentElement ? img.parentElement.className || '' : '';
  
  // Check if it's in the icons directory or has icon-related classes
  return src.includes('/icons/') || 
         src.includes('icon') ||
         className.includes('icon') ||
         parentClass.includes('social') ||
         parentClass.includes('icon');
}

/**
 * Property 34: Lazy loading for images
 * **Validates: Requirements 11.4**
 * 
 * For any img element that appears below the fold (not in hero/header), 
 * it should include loading='lazy' attribute.
 */
test('Property 34: Images below the fold have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
          console.error(`\nFile does not exist: ${template}/${htmlFile}`);
          return false;
        }
        
        // Parse HTML
        const document = parseHtmlFile(filePath);
        
        // Get all img elements
        const images = document.querySelectorAll('img');
        
        // If no images, test passes
        if (images.length === 0) {
          return true;
        }
        
        // Check each image below the fold for lazy loading
        const imagesMissingLazyLoading = [];
        
        images.forEach((img) => {
          // Skip images that are above the fold (in header/hero)
          if (isAboveTheFold(img)) {
            return;
          }
          
          // Skip logo images (they're typically in header but might be elsewhere)
          if (isLogo(img)) {
            return;
          }
          
          // Skip small icons (social media icons, etc.) - they're small and load quickly
          if (isSmallIcon(img)) {
            return;
          }
          
          // Check if image has loading="lazy" attribute
          const loading = img.getAttribute('loading');
          
          if (loading !== 'lazy') {
            const src = img.getAttribute('src') || 'no-src';
            const alt = img.getAttribute('alt') || 'no-alt';
            const className = img.getAttribute('class') || 'no-class';
            
            imagesMissingLazyLoading.push({
              src,
              alt,
              className,
              loading: loading || 'none'
            });
          }
        });
        
        // Report any images below the fold without lazy loading
        if (imagesMissingLazyLoading.length > 0) {
          console.error(`\nImages below the fold without lazy loading in ${template}/${htmlFile}:`);
          imagesMissingLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}" class="${img.className}" loading="${img.loading}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34a: Header images do not require lazy loading
 * **Validates: Requirements 11.4**
 * 
 * Images in the header/hero section (above the fold) should NOT have 
 * lazy loading as they need to load immediately for LCP (Largest Contentful Paint).
 */
test('Property 34a: Header images do not have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        const images = document.querySelectorAll('img');
        
        if (images.length === 0) {
          return true; // No images
        }
        
        // Check header images don't have lazy loading
        const headerImagesWithLazyLoading = [];
        
        images.forEach((img) => {
          // Only check images in header/hero
          if (!isAboveTheFold(img)) {
            return;
          }
          
          const loading = img.getAttribute('loading');
          
          // Header images should not have loading="lazy"
          if (loading === 'lazy') {
            const src = img.getAttribute('src') || 'no-src';
            const alt = img.getAttribute('alt') || 'no-alt';
            
            headerImagesWithLazyLoading.push({
              src,
              alt
            });
          }
        });
        
        if (headerImagesWithLazyLoading.length > 0) {
          console.error(`\nHeader images with lazy loading in ${template}/${htmlFile} (should load eagerly for LCP):`);
          headerImagesWithLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34b: Logo images do not have lazy loading
 * **Validates: Requirements 11.4, 2.1**
 * 
 * Logo images should not have lazy loading as they are critical for 
 * brand identity and typically above the fold.
 */
test('Property 34b: Logo images do not have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find logo images
        const logoImages = Array.from(document.querySelectorAll('img')).filter(img => {
          return isLogo(img);
        });
        
        if (logoImages.length === 0) {
          return true; // No logo images
        }
        
        // Check logo images don't have lazy loading
        const logosWithLazyLoading = [];
        
        logoImages.forEach((img) => {
          const loading = img.getAttribute('loading');
          
          if (loading === 'lazy') {
            const src = img.getAttribute('src') || 'no-src';
            logosWithLazyLoading.push(src);
          }
        });
        
        if (logosWithLazyLoading.length > 0) {
          console.error(`\nLogo images with lazy loading in ${template}/${htmlFile} (logos should load immediately):`);
          logosWithLazyLoading.forEach((src) => {
            console.error(`  - <img src="${src}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34c: Content images in main section have lazy loading
 * **Validates: Requirements 11.4**
 * 
 * Images within the main content area (blog posts, product cards, etc.) 
 * should have lazy loading for performance optimization.
 */
test('Property 34c: Content images in main section have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find main element
        const mainElement = document.querySelector('main');
        
        if (!mainElement) {
          return true; // No main element
        }
        
        // Get all images in main element
        const mainImages = mainElement.querySelectorAll('img');
        
        if (mainImages.length === 0) {
          return true; // No images in main
        }
        
        // Check content images have lazy loading
        const contentImagesWithoutLazyLoading = [];
        
        mainImages.forEach((img) => {
          // Skip if image is in header/hero section within main
          if (isAboveTheFold(img)) {
            return;
          }
          
          // Skip logo images
          if (isLogo(img)) {
            return;
          }
          
          // Skip small icons (social media icons, etc.)
          if (isSmallIcon(img)) {
            return;
          }
          
          const loading = img.getAttribute('loading');
          
          if (loading !== 'lazy') {
            const src = img.getAttribute('src') || 'no-src';
            const alt = img.getAttribute('alt') || 'no-alt';
            const className = img.getAttribute('class') || 'no-class';
            
            contentImagesWithoutLazyLoading.push({
              src,
              alt,
              className
            });
          }
        });
        
        if (contentImagesWithoutLazyLoading.length > 0) {
          console.error(`\nContent images in main section without lazy loading in ${template}/${htmlFile}:`);
          contentImagesWithoutLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}" class="${img.className}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34d: Product card images have lazy loading
 * **Validates: Requirements 11.4, 7.2**
 * 
 * Images within product card components should have lazy loading 
 * as they are typically below the fold.
 */
test('Property 34d: Product card images have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find product cards
        const productCards = document.querySelectorAll('.product-card, [class*="product"]');
        
        if (productCards.length === 0) {
          return true; // No product cards
        }
        
        // Check images within product cards
        const productImagesWithoutLazyLoading = [];
        
        productCards.forEach((card) => {
          const images = card.querySelectorAll('img');
          
          images.forEach((img) => {
            const loading = img.getAttribute('loading');
            
            if (loading !== 'lazy') {
              const src = img.getAttribute('src') || 'no-src';
              productImagesWithoutLazyLoading.push(src);
            }
          });
        });
        
        if (productImagesWithoutLazyLoading.length > 0) {
          console.error(`\nProduct card images without lazy loading in ${template}/${htmlFile}:`);
          productImagesWithoutLazyLoading.forEach((src) => {
            console.error(`  - <img src="${src}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34e: Blog post card images have lazy loading
 * **Validates: Requirements 11.4, 4.1**
 * 
 * Images within blog post card components should have lazy loading 
 * as they are typically below the fold.
 */
test('Property 34e: Blog post card images have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find blog post cards
        const postCards = document.querySelectorAll('.post-card, [class*="post-card"], article.post, article[class*="post"]');
        
        if (postCards.length === 0) {
          return true; // No post cards
        }
        
        // Check images within post cards
        const postImagesWithoutLazyLoading = [];
        
        postCards.forEach((card) => {
          const images = card.querySelectorAll('img');
          
          images.forEach((img) => {
            const loading = img.getAttribute('loading');
            
            if (loading !== 'lazy') {
              const src = img.getAttribute('src') || 'no-src';
              const alt = img.getAttribute('alt') || 'no-alt';
              
              postImagesWithoutLazyLoading.push({
                src,
                alt
              });
            }
          });
        });
        
        if (postImagesWithoutLazyLoading.length > 0) {
          console.error(`\nBlog post card images without lazy loading in ${template}/${htmlFile}:`);
          postImagesWithoutLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34f: Footer images can have lazy loading
 * **Validates: Requirements 11.4**
 * 
 * Images in the footer (except social media icons which are small) 
 * can have lazy loading as they are at the bottom of the page.
 */
test('Property 34f: Footer content images have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find footer element
        const footerElement = document.querySelector('footer');
        
        if (!footerElement) {
          return true; // No footer element
        }
        
        // Get all images in footer
        const footerImages = footerElement.querySelectorAll('img');
        
        if (footerImages.length === 0) {
          return true; // No images in footer
        }
        
        // Check footer content images (not icons) have lazy loading
        const footerContentImagesWithoutLazyLoading = [];
        
        footerImages.forEach((img) => {
          const src = img.getAttribute('src') || '';
          
          // Skip social media icons (they're small and should load quickly)
          const isIcon = src.includes('/icons/') || src.includes('icon');
          
          if (isIcon) {
            return;
          }
          
          const loading = img.getAttribute('loading');
          
          if (loading !== 'lazy') {
            const alt = img.getAttribute('alt') || 'no-alt';
            
            footerContentImagesWithoutLazyLoading.push({
              src,
              alt
            });
          }
        });
        
        if (footerContentImagesWithoutLazyLoading.length > 0) {
          console.error(`\nFooter content images without lazy loading in ${template}/${htmlFile}:`);
          footerContentImagesWithoutLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 34g: Carousel images have lazy loading
 * **Validates: Requirements 11.4**
 * 
 * Images in carousel components (except the first/active slide) 
 * should have lazy loading for performance.
 */
test('Property 34g: Carousel images have lazy loading', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const document = parseHtmlFile(filePath);
        
        // Find carousel elements
        const carousels = document.querySelectorAll('.carousel, [class*="carousel"]');
        
        if (carousels.length === 0) {
          return true; // No carousels
        }
        
        // Check carousel images have lazy loading
        const carouselImagesWithoutLazyLoading = [];
        
        carousels.forEach((carousel) => {
          const images = carousel.querySelectorAll('img');
          
          images.forEach((img) => {
            const loading = img.getAttribute('loading');
            
            if (loading !== 'lazy') {
              const src = img.getAttribute('src') || 'no-src';
              const alt = img.getAttribute('alt') || 'no-alt';
              
              carouselImagesWithoutLazyLoading.push({
                src,
                alt
              });
            }
          });
        });
        
        if (carouselImagesWithoutLazyLoading.length > 0) {
          console.error(`\nCarousel images without lazy loading in ${template}/${htmlFile}:`);
          carouselImagesWithoutLazyLoading.forEach((img) => {
            console.error(`  - <img src="${img.src}" alt="${img.alt}">`);
          });
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
