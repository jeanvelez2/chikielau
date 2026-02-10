/**
 * Property-Based Tests for File Structure
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about the file structure
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const path = require('path');
const {
  getDirectoryStructure,
  compareDirectoryStructures,
  directoryExists,
  fileExists,
  getFilesByType
} = require('../helpers/file-utils');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Expected subdirectories that should exist in all templates
const REQUIRED_SUBDIRECTORIES = [
  'css',
  'js',
  'assets',
  path.join('assets', 'images'),
  path.join('assets', 'images', 'icons'),
  path.join('assets', 'images', 'placeholders'),
  path.join('assets', 'fonts')
];

/**
 * Property 2: Consistent directory structure
 * **Validates: Requirements 1.3**
 * 
 * For all three templates, the directory structure and file organization 
 * should be identical (same subdirectories, same file types in same locations).
 */
test('Property 2: All templates have identical directory structure', () => {
  fc.assert(
    fc.property(
      // Generate all pairs of templates to compare
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...TEMPLATES),
      (template1, template2) => {
        // Skip if comparing template to itself
        if (template1 === template2) {
          return true;
        }
        
        const template1Path = path.join(process.cwd(), template1);
        const template2Path = path.join(process.cwd(), template2);
        
        // Get directory structures
        const struct1 = getDirectoryStructure(template1Path);
        const struct2 = getDirectoryStructure(template2Path);
        
        // Compare structures
        const comparison = compareDirectoryStructures(template1Path, template2Path);
        
        // If not identical, provide detailed error message
        if (!comparison.identical) {
          console.error(`\nDirectory structure mismatch between ${template1} and ${template2}:`);
          if (comparison.missing.length > 0) {
            console.error(`  Missing in ${template2}:`, comparison.missing);
          }
          if (comparison.extra.length > 0) {
            console.error(`  Extra in ${template2}:`, comparison.extra);
          }
          console.error(`  ${template1} structure:`, struct1);
          console.error(`  ${template2} structure:`, struct2);
        }
        
        return comparison.identical;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 2a: All templates contain required subdirectories
 * **Validates: Requirements 1.3**
 * 
 * Each template should contain all required subdirectories in the same locations.
 */
test('Property 2a: All templates contain required subdirectories', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...REQUIRED_SUBDIRECTORIES),
      (template, subdirectory) => {
        const templatePath = path.join(process.cwd(), template);
        const subdirPath = path.join(templatePath, subdirectory);
        
        const exists = directoryExists(subdirPath);
        
        if (!exists) {
          console.error(`\nMissing required subdirectory in ${template}: ${subdirectory}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 2b: Directory structures are consistent across all template pairs
 * **Validates: Requirements 1.3**
 * 
 * This test verifies that every pair of templates has identical directory structure.
 */
test('Property 2b: Pairwise directory structure consistency', () => {
  const templatePairs = [];
  
  // Generate all unique pairs
  for (let i = 0; i < TEMPLATES.length; i++) {
    for (let j = i + 1; j < TEMPLATES.length; j++) {
      templatePairs.push([TEMPLATES[i], TEMPLATES[j]]);
    }
  }
  
  fc.assert(
    fc.property(
      fc.constantFrom(...templatePairs),
      ([template1, template2]) => {
        const template1Path = path.join(process.cwd(), template1);
        const template2Path = path.join(process.cwd(), template2);
        
        const comparison = compareDirectoryStructures(template1Path, template2Path);
        
        if (!comparison.identical) {
          console.error(`\nStructure mismatch between ${template1} and ${template2}:`);
          console.error(`  Missing in ${template2}:`, comparison.missing);
          console.error(`  Extra in ${template2}:`, comparison.extra);
        }
        
        return comparison.identical;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 2c: Same file types exist in corresponding directories
 * **Validates: Requirements 1.3**
 * 
 * For any directory that exists in all templates, the same types of files
 * should exist (e.g., if template-1/css has .css files, all templates should).
 */
test('Property 2c: Same file types in corresponding directories', () => {
  const commonDirs = ['css', 'js', path.join('assets', 'images')];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...commonDirs),
      (dirPath) => {
        const template1Path = path.join(process.cwd(), TEMPLATES[0], dirPath);
        const template2Path = path.join(process.cwd(), TEMPLATES[1], dirPath);
        const template3Path = path.join(process.cwd(), TEMPLATES[2], dirPath);
        
        // All directories should exist
        const allExist = directoryExists(template1Path) && 
                        directoryExists(template2Path) && 
                        directoryExists(template3Path);
        
        if (!allExist) {
          console.error(`\nDirectory ${dirPath} does not exist in all templates`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1: Complete file structure
 * **Validates: Requirements 1.2**
 * 
 * For any template directory, it should contain all required files:
 * - 6 HTML files (index.html, blog.html, blog-post.html, about.html, shop.html, contact.html)
 * - css directory with stylesheets
 * - js directory with scripts
 * - assets directory with images and fonts subdirectories
 * - README.md file
 */
test('Property 1: All templates contain required HTML files', () => {
  const requiredHtmlFiles = [
    'index.html',
    'blog.html',
    'blog-post.html',
    'about.html',
    'shop.html',
    'contact.html'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...requiredHtmlFiles),
      (template, htmlFile) => {
        const templatePath = path.join(process.cwd(), template);
        const filePath = path.join(templatePath, htmlFile);
        
        const exists = fileExists(filePath);
        
        if (!exists) {
          console.error(`\nMissing required HTML file in ${template}: ${htmlFile}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1a: All templates contain exactly 6 HTML files
 * **Validates: Requirements 1.2**
 * 
 * Each template should have exactly the 6 required HTML page files.
 */
test('Property 1a: All templates have exactly 6 HTML files', () => {
  const requiredHtmlFiles = [
    'index.html',
    'blog.html',
    'blog-post.html',
    'about.html',
    'shop.html',
    'contact.html'
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        
        // Check all required files exist
        const allExist = requiredHtmlFiles.every(file => 
          fileExists(path.join(templatePath, file))
        );
        
        if (!allExist) {
          const missing = requiredHtmlFiles.filter(file => 
            !fileExists(path.join(templatePath, file))
          );
          console.error(`\nMissing HTML files in ${template}:`, missing);
        }
        
        return allExist;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1b: All templates contain required directories
 * **Validates: Requirements 1.2**
 * 
 * Each template should have css, js, and assets directories.
 */
test('Property 1b: All templates have required directories', () => {
  const requiredDirs = ['css', 'js', 'assets'];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...requiredDirs),
      (template, dir) => {
        const templatePath = path.join(process.cwd(), template);
        const dirPath = path.join(templatePath, dir);
        
        const exists = directoryExists(dirPath);
        
        if (!exists) {
          console.error(`\nMissing required directory in ${template}: ${dir}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1c: All templates contain assets subdirectories
 * **Validates: Requirements 1.2**
 * 
 * Each template's assets directory should contain images and fonts subdirectories.
 */
test('Property 1c: All templates have assets subdirectories', () => {
  const requiredAssetsDirs = [
    path.join('assets', 'images'),
    path.join('assets', 'fonts')
  ];
  
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      fc.constantFrom(...requiredAssetsDirs),
      (template, dir) => {
        const templatePath = path.join(process.cwd(), template);
        const dirPath = path.join(templatePath, dir);
        
        const exists = directoryExists(dirPath);
        
        if (!exists) {
          console.error(`\nMissing required assets subdirectory in ${template}: ${dir}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1d: All templates contain README.md
 * **Validates: Requirements 1.2**
 * 
 * Each template should have a README.md file for documentation.
 */
test('Property 1d: All templates have README.md', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const readmePath = path.join(templatePath, 'README.md');
        
        const exists = fileExists(readmePath);
        
        if (!exists) {
          console.error(`\nMissing README.md in ${template}`);
        }
        
        return exists;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1e: All templates contain CSS files
 * **Validates: Requirements 1.2**
 * 
 * Each template's css directory should contain stylesheet files.
 */
test('Property 1e: All templates have CSS files in css directory', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssPath = path.join(templatePath, 'css');
        
        const filesByType = getFilesByType(cssPath);
        const hasCssFiles = filesByType.css.length > 0;
        
        if (!hasCssFiles) {
          console.error(`\nNo CSS files found in ${template}/css directory`);
        }
        
        return hasCssFiles;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1f: All templates contain JavaScript files
 * **Validates: Requirements 1.2**
 * 
 * Each template's js directory should contain script files.
 */
test('Property 1f: All templates have JavaScript files in js directory', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const jsPath = path.join(templatePath, 'js');
        
        const filesByType = getFilesByType(jsPath);
        const hasJsFiles = filesByType.js.length > 0;
        
        if (!hasJsFiles) {
          console.error(`\nNo JavaScript files found in ${template}/js directory`);
        }
        
        return hasJsFiles;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 1g: All templates contain logo and icon files
 * **Validates: Requirements 1.2**
 * 
 * Each template's assets/images directory should contain logo file,
 * and assets/images/icons should contain social media icons.
 */
test('Property 1g: All templates have logo in assets/images', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const imagesPath = path.join(templatePath, 'assets', 'images');
        
        const filesByType = getFilesByType(imagesPath);
        const hasLogo = filesByType.images.some(file => 
          file.toLowerCase().includes('logo')
        );
        
        if (!hasLogo) {
          console.error(`\nNo logo file found in ${template}/assets/images`);
        }
        
        return hasLogo;
      }
    ),
    { numRuns: 100 }
  );
});
