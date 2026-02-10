/**
 * Property-Based Tests for No Framework Dependencies
 * Feature: chikielau-website-templates
 * 
 * These tests verify that templates use pure vanilla JavaScript
 * with no framework dependencies (jQuery, React, Vue, Angular, Bootstrap).
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const path = require('path');
const fs = require('fs');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// HTML files to check
const HTML_FILES = [
  'index.html',
  'blog.html',
  'blog-post.html',
  'about.html',
  'shop.html',
  'contact.html'
];

// Framework patterns to detect
const FRAMEWORK_PATTERNS = {
  jquery: [
    'jquery',
    'jQuery',
    '$(', 
    'jquery.min.js',
    'jquery.js'
  ],
  react: [
    'react',
    'React',
    'ReactDOM',
    'react.js',
    'react-dom.js',
    'react.min.js'
  ],
  vue: [
    'vue',
    'Vue',
    'vue.js',
    'vue.min.js',
    'new Vue('
  ],
  angular: [
    'angular',
    'Angular',
    'angular.js',
    'angular.min.js',
    'ng-app',
    'ng-controller'
  ],
  bootstrap: [
    'bootstrap',
    'Bootstrap',
    'bootstrap.js',
    'bootstrap.min.js',
    'bootstrap.css',
    'bootstrap.min.css'
  ]
};

/**
 * Property 29: No framework dependencies
 * **Validates: Requirements 10.1, 10.4**
 * 
 * For any HTML or JavaScript file, it should not contain imports or 
 * script sources for frameworks (jQuery, React, Vue, Angular, Bootstrap).
 */
test('Property 29: HTML files contain no framework script references', () => {
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
        
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        // Check for framework references in script tags
        const foundFrameworks = [];
        
        for (const [framework, patterns] of Object.entries(FRAMEWORK_PATTERNS)) {
          for (const pattern of patterns) {
            if (htmlContent.toLowerCase().includes(pattern.toLowerCase())) {
              foundFrameworks.push(`${framework}: "${pattern}"`);
            }
          }
        }
        
        if (foundFrameworks.length > 0) {
          console.error(`\nFramework dependencies found in ${template}/${htmlFile}:`);
          console.error(`  ${foundFrameworks.join(', ')}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29a: JavaScript files contain no framework imports
 * **Validates: Requirements 10.1, 10.4**
 * 
 * JavaScript files should not import or require framework libraries.
 */
test('Property 29a: JavaScript files contain no framework imports', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        if (!fs.existsSync(jsPath)) {
          console.error(`\nJavaScript file not found: ${jsPath}`);
          return false;
        }
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check for framework imports/requires
        const foundFrameworks = [];
        
        for (const [framework, patterns] of Object.entries(FRAMEWORK_PATTERNS)) {
          for (const pattern of patterns) {
            // Skip checking for $( in comments
            const lines = jsContent.split('\n');
            for (const line of lines) {
              const trimmedLine = line.trim();
              // Skip comments
              if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*') || trimmedLine.startsWith('*')) {
                continue;
              }
              
              if (line.toLowerCase().includes(pattern.toLowerCase())) {
                foundFrameworks.push(`${framework}: "${pattern}"`);
                break;
              }
            }
          }
        }
        
        if (foundFrameworks.length > 0) {
          console.error(`\nFramework dependencies found in ${template}/js/script.js:`);
          console.error(`  ${foundFrameworks.join(', ')}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29b: No CDN links to framework libraries
 * **Validates: Requirements 10.1, 10.4**
 * 
 * HTML files should not contain CDN links to framework libraries.
 */
test('Property 29b: No CDN links to framework libraries in HTML', () => {
  const frameworkCDNs = [
    'jquery.com',
    'code.jquery.com',
    'ajax.googleapis.com/ajax/libs/jquery',
    'cdnjs.cloudflare.com/ajax/libs/jquery',
    'unpkg.com/react',
    'unpkg.com/vue',
    'cdn.jsdelivr.net/npm/react',
    'cdn.jsdelivr.net/npm/vue',
    'cdn.jsdelivr.net/npm/angular',
    'maxcdn.bootstrapcdn.com',
    'stackpath.bootstrapcdn.com/bootstrap',
    'getbootstrap.com'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        const foundCDNs = [];
        
        for (const cdn of frameworkCDNs) {
          if (htmlContent.includes(cdn)) {
            foundCDNs.push(cdn);
          }
        }
        
        if (foundCDNs.length > 0) {
          console.error(`\nFramework CDN links found in ${template}/${htmlFile}:`);
          console.error(`  ${foundCDNs.join(', ')}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29c: JavaScript uses vanilla DOM methods
 * **Validates: Requirements 10.1, 10.4**
 * 
 * JavaScript should use vanilla DOM methods like querySelector,
 * addEventListener, etc., not framework-specific methods.
 */
test('Property 29c: JavaScript uses vanilla DOM methods', () => {
  const vanillaMethods = [
    'querySelector',
    'querySelectorAll',
    'addEventListener',
    'getElementById',
    'getElementsByClassName',
    'createElement',
    'appendChild'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js', 'script.js');
        
        if (!fs.existsSync(jsPath)) {
          return false;
        }
        
        const jsContent = fs.readFileSync(jsPath, 'utf-8');
        
        // Check for at least some vanilla DOM methods
        const usesVanillaMethods = vanillaMethods.some(method => 
          jsContent.includes(method)
        );
        
        if (!usesVanillaMethods) {
          console.error(`\nNo vanilla DOM methods found in ${template}/js/script.js`);
          console.error(`  Expected methods like: ${vanillaMethods.join(', ')}`);
        }
        
        return usesVanillaMethods;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29d: No framework-specific attributes in HTML
 * **Validates: Requirements 10.1, 10.4**
 * 
 * HTML should not contain framework-specific attributes like ng-app,
 * v-if, data-react-*, etc.
 */
test('Property 29d: No framework-specific attributes in HTML', () => {
  const frameworkAttributes = [
    'ng-app',
    'ng-controller',
    'ng-model',
    'ng-click',
    'v-if',
    'v-for',
    'v-model',
    'v-bind',
    'v-on',
    'data-react',
    'data-reactid',
    'data-reactroot'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...HTML_FILES),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        if (!fs.existsSync(filePath)) {
          return true;
        }
        
        const htmlContent = fs.readFileSync(filePath, 'utf-8');
        
        const foundAttributes = [];
        
        for (const attr of frameworkAttributes) {
          if (htmlContent.includes(attr)) {
            foundAttributes.push(attr);
          }
        }
        
        if (foundAttributes.length > 0) {
          console.error(`\nFramework-specific attributes found in ${template}/${htmlFile}:`);
          console.error(`  ${foundAttributes.join(', ')}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29e: CSS files contain no framework references
 * **Validates: Requirements 10.1, 10.4**
 * 
 * CSS files should not import or reference framework stylesheets.
 */
test('Property 29e: CSS files contain no framework imports', () => {
  const frameworkCSSPatterns = [
    'bootstrap',
    'foundation',
    'bulma',
    'tailwind',
    'materialize'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssDir = path.join(templatePath, 'css');
        
        if (!fs.existsSync(cssDir)) {
          return false;
        }
        
        const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
        
        for (const cssFile of cssFiles) {
          const cssPath = path.join(cssDir, cssFile);
          const cssContent = fs.readFileSync(cssPath, 'utf-8');
          
          const foundFrameworks = [];
          
          for (const pattern of frameworkCSSPatterns) {
            if (cssContent.toLowerCase().includes(pattern)) {
              foundFrameworks.push(pattern);
            }
          }
          
          if (foundFrameworks.length > 0) {
            console.error(`\nFramework CSS references found in ${template}/css/${cssFile}:`);
            console.error(`  ${foundFrameworks.join(', ')}`);
            return false;
          }
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 29f: Package.json has no framework dependencies
 * **Validates: Requirements 10.1, 10.4**
 * 
 * If package.json exists in template directory, it should not list
 * framework dependencies (only dev dependencies for testing are allowed).
 */
test('Property 29f: No framework dependencies in package.json', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const packageJsonPath = path.join(templatePath, 'package.json');
        
        // If no package.json, test passes (templates shouldn't have one)
        if (!fs.existsSync(packageJsonPath)) {
          return true;
        }
        
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        
        // Check dependencies (not devDependencies, those are for testing)
        if (packageJson.dependencies) {
          const deps = Object.keys(packageJson.dependencies);
          const frameworkDeps = deps.filter(dep => 
            dep.includes('jquery') ||
            dep.includes('react') ||
            dep.includes('vue') ||
            dep.includes('angular') ||
            dep.includes('bootstrap')
          );
          
          if (frameworkDeps.length > 0) {
            console.error(`\nFramework dependencies found in ${template}/package.json:`);
            console.error(`  ${frameworkDeps.join(', ')}`);
            return false;
          }
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});
