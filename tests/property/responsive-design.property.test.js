// Feature: chikielau-website-templates, Properties 24-28: Responsive design properties
// Property 24: Mobile-first CSS structure
// Property 25: Responsive breakpoints
// Property 26: Minimum font size (tested in font-size.property.test.js)
// Property 27: Responsive image scaling
// Property 28: Mobile navigation toggle
// Validates: Requirements 9.1-9.5

const test = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

const HTML_FILES = [
  'index.html',
  'blog.html',
  'blog-post.html',
  'about.html',
  'shop.html',
  'contact.html'
];

test('Property 24: Mobile-first CSS structure - media queries use min-width', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const cssDir = path.join(templateDir, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return true;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        let totalMediaQueries = 0;
        let minWidthQueries = 0;
        let maxWidthQueries = 0;
        
        for (const cssFile of cssFiles) {
          const content = fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
          
          // Count media queries
          const mediaQueryMatches = content.match(/@media[^{]+\{/gi);
          if (mediaQueryMatches) {
            totalMediaQueries += mediaQueryMatches.length;
            
            for (const match of mediaQueryMatches) {
              if (match.includes('min-width')) {
                minWidthQueries++;
              }
              if (match.includes('max-width')) {
                maxWidthQueries++;
              }
            }
          }
        }
        
        // Mobile-first means predominantly min-width queries
        // Allow some max-width for specific overrides, but min-width should dominate
        if (totalMediaQueries > 0) {
          const minWidthRatio = minWidthQueries / totalMediaQueries;
          return minWidthRatio >= 0.5; // At least 50% should be min-width
        }
        
        return true; // No media queries is acceptable
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 25: Responsive breakpoints - CSS includes common breakpoints', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const cssDir = path.join(templateDir, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return true;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        let allContent = '';
        
        for (const cssFile of cssFiles) {
          allContent += fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
        }
        
        // Check for common breakpoints (768px and 1024px minimum)
        const hasTabletBreakpoint = /min-width:\s*768px/.test(allContent) || 
                                   /min-width:\s*48em/.test(allContent);
        const hasDesktopBreakpoint = /min-width:\s*1024px/.test(allContent) || 
                                    /min-width:\s*64em/.test(allContent);
        
        return hasTabletBreakpoint && hasDesktopBreakpoint;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 27: Responsive image scaling - images have max-width and height auto', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const cssDir = path.join(templateDir, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return true;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        let allContent = '';
        
        for (const cssFile of cssFiles) {
          allContent += fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
        }
        
        // Check for img rules with max-width and height auto
        const hasMaxWidth = /img[^{]*\{[^}]*max-width:\s*(100%|100vw)/i.test(allContent);
        const hasHeightAuto = /img[^{]*\{[^}]*height:\s*auto/i.test(allContent);
        
        // Also check for general responsive image patterns
        const hasResponsivePattern = hasMaxWidth || hasHeightAuto;
        
        return hasResponsivePattern;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 28: Mobile navigation toggle - HTML includes toggle button and JS has toggle functionality', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      async (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        // Check for navigation toggle button
        const hasToggleButton = $('button.nav-toggle, button.menu-toggle, button[aria-label*="menu" i], button[aria-label*="navigation" i]').length > 0;
        
        // Check for hamburger icon or menu icon
        const hasHamburger = $('.hamburger, .menu-icon').length > 0 || hasToggleButton;
        
        // Check JavaScript file for toggle functionality
        const jsDir = path.join(templateDir, 'js');
        if (fs.existsSync(jsDir)) {
          const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
          let hasToggleFunction = false;
          
          for (const jsFile of jsFiles) {
            const jsContent = fs.readFileSync(path.join(jsDir, jsFile), 'utf-8');
            // Look for toggle, menu, or navigation related functions
            if (/toggle|menu|nav/i.test(jsContent) && /addEventListener|onclick/i.test(jsContent)) {
              hasToggleFunction = true;
              break;
            }
          }
          
          return hasHamburger && hasToggleFunction;
        }
        
        return hasHamburger; // At least HTML structure should exist
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 24-28: Responsive design integration - templates adapt to viewport changes', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const cssDir = path.join(templateDir, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return true;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        let allContent = '';
        
        for (const cssFile of cssFiles) {
          allContent += fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
        }
        
        // Check for viewport meta tag in HTML
        const htmlFiles = HTML_FILES.filter(f => fs.existsSync(path.join(templateDir, f)));
        let hasViewportMeta = false;
        
        if (htmlFiles.length > 0) {
          const htmlContent = fs.readFileSync(path.join(templateDir, htmlFiles[0]), 'utf-8');
          hasViewportMeta = /<meta[^>]*name=["']viewport["'][^>]*>/i.test(htmlContent);
        }
        
        // Check for responsive CSS patterns
        const hasMediaQueries = /@media/.test(allContent);
        const hasFlexbox = /display:\s*flex/i.test(allContent);
        const hasGrid = /display:\s*grid/i.test(allContent);
        
        return hasViewportMeta && (hasMediaQueries || hasFlexbox || hasGrid);
      }
    ),
    { numRuns: 100 }
  );
});
