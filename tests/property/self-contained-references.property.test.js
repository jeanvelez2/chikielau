// Feature: chikielau-website-templates, Property 3: Self-contained file references
// For any template, all file references (CSS links, script sources, image sources, hyperlinks)
// should use relative paths within that template directory with no external dependencies
// except optional CDN font links.
// Validates: Requirements 1.4, 1.5

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

test('Property 3: Self-contained file references - all file references use relative paths', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      async (templateDir, htmlFile) => {
        const filePath = path.join(templateDir, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        
        const externalRefs = [];
        
        // Check all src attributes (images, scripts)
        $('[src]').each((i, elem) => {
          const src = $(elem).attr('src');
          if (src) {
            // Allow Google Fonts and other CDN fonts
            if (src.startsWith('http://') || src.startsWith('https://')) {
              if (!src.includes('fonts.googleapis.com') && 
                  !src.includes('fonts.gstatic.com') &&
                  !src.includes('use.typekit.net')) {
                externalRefs.push({ file: htmlFile, type: 'src', value: src });
              }
            }
          }
        });
        
        // Check all href attributes (stylesheets, links)
        $('link[href], a[href]').each((i, elem) => {
          const href = $(elem).attr('href');
          const rel = $(elem).attr('rel');
          
          if (href) {
            // Allow external links for social media, affiliate links, and font stylesheets
            if (href.startsWith('http://') || href.startsWith('https://')) {
              // Allow fonts
              if (href.includes('fonts.googleapis.com') || 
                  href.includes('fonts.gstatic.com') ||
                  href.includes('use.typekit.net')) {
                return;
              }
              
              // Allow external links in anchor tags (social media, affiliate links)
              if ($(elem).is('a')) {
                return;
              }
              
              // Allow stylesheet links to fonts
              if (rel === 'stylesheet' || rel === 'preconnect') {
                return;
              }
              
              externalRefs.push({ file: htmlFile, type: 'href', value: href });
            }
          }
        });
        
        if (externalRefs.length > 0) {
          console.log(`External references found in ${templateDir}/${htmlFile}:`, externalRefs);
        }
        
        return externalRefs.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 3: Self-contained file references - CSS files use relative paths', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const cssDir = path.join(templateDir, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return true;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
        const externalRefs = [];
        
        for (const cssFile of cssFiles) {
          const content = fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
          
          // Check for absolute URLs in url() functions (except fonts)
          const urlMatches = content.match(/url\(['"]?(https?:\/\/[^'")\s]+)['"]?\)/gi);
          if (urlMatches) {
            for (const match of urlMatches) {
              const url = match.match(/https?:\/\/[^'")\s]+/)[0];
              if (!url.includes('fonts.googleapis.com') && 
                  !url.includes('fonts.gstatic.com') &&
                  !url.includes('use.typekit.net')) {
                externalRefs.push({ file: cssFile, value: url });
              }
            }
          }
        }
        
        if (externalRefs.length > 0) {
          console.log(`External references found in ${templateDir}/css:`, externalRefs);
        }
        
        return externalRefs.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 3: Self-contained file references - JavaScript files have no external dependencies', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.constantFrom(...TEMPLATES),
      async (templateDir) => {
        const jsDir = path.join(templateDir, 'js');
        
        if (!fs.existsSync(jsDir)) {
          return true;
        }
        
        const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
        const externalRefs = [];
        
        for (const jsFile of jsFiles) {
          const content = fs.readFileSync(path.join(jsDir, jsFile), 'utf-8');
          
          // Check for imports or requires of external libraries
          const importMatches = content.match(/import\s+.*\s+from\s+['"]([^'"]+)['"]/g);
          const requireMatches = content.match(/require\(['"]([^'"]+)['"]\)/g);
          
          if (importMatches) {
            for (const match of importMatches) {
              const module = match.match(/from\s+['"]([^'"]+)['"]/)[1];
              if (!module.startsWith('.') && !module.startsWith('/')) {
                externalRefs.push({ file: jsFile, type: 'import', value: module });
              }
            }
          }
          
          if (requireMatches) {
            for (const match of requireMatches) {
              const module = match.match(/require\(['"]([^'"]+)['"]\)/)[1];
              if (!module.startsWith('.') && !module.startsWith('/')) {
                externalRefs.push({ file: jsFile, type: 'require', value: module });
              }
            }
          }
        }
        
        if (externalRefs.length > 0) {
          console.log(`External dependencies found in ${templateDir}/js:`, externalRefs);
        }
        
        return externalRefs.length === 0;
      }
    ),
    { numRuns: 100 }
  );
});
