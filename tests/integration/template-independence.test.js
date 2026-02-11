// Integration tests for template independence
// Validates: Requirements 1.5
// Ensures no cross-template file references and each template can be deployed independently

const test = require('node:test');
const assert = require('node:assert');
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

test('Template Independence: No cross-template file references in HTML', () => {
  const violations = [];
  
  for (const template of TEMPLATES) {
    const otherTemplates = TEMPLATES.filter(t => t !== template);
    
    for (const htmlFile of HTML_FILES) {
      const filePath = path.join(template, htmlFile);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      // Check all src and href attributes
      $('[src], [href]').each((i, elem) => {
        const src = $(elem).attr('src');
        const href = $(elem).attr('href');
        const attr = src || href;
        
        if (attr) {
          // Check if attribute references another template directory
          for (const otherTemplate of otherTemplates) {
            if (attr.includes(otherTemplate)) {
              violations.push({
                template,
                file: htmlFile,
                attribute: src ? 'src' : 'href',
                value: attr,
                referencesTemplate: otherTemplate
              });
            }
          }
        }
      });
    }
  }
  
  if (violations.length > 0) {
    console.log('\n=== CROSS-TEMPLATE REFERENCES FOUND ===');
    violations.forEach(v => {
      console.log(`${v.template}/${v.file}: ${v.attribute}="${v.value}" references ${v.referencesTemplate}`);
    });
  }
  
  assert.strictEqual(violations.length, 0, `Found ${violations.length} cross-template reference(s)`);
});

test('Template Independence: No cross-template file references in CSS', () => {
  const violations = [];
  
  for (const template of TEMPLATES) {
    const otherTemplates = TEMPLATES.filter(t => t !== template);
    const cssDir = path.join(template, 'css');
    
    if (!fs.existsSync(cssDir)) {
      continue;
    }
    
    const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
    
    for (const cssFile of cssFiles) {
      const content = fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
      
      // Check for references to other template directories in url() or @import
      for (const otherTemplate of otherTemplates) {
        if (content.includes(otherTemplate)) {
          violations.push({
            template,
            file: `css/${cssFile}`,
            referencesTemplate: otherTemplate
          });
        }
      }
    }
  }
  
  if (violations.length > 0) {
    console.log('\n=== CROSS-TEMPLATE CSS REFERENCES FOUND ===');
    violations.forEach(v => {
      console.log(`${v.template}/${v.file} references ${v.referencesTemplate}`);
    });
  }
  
  assert.strictEqual(violations.length, 0, `Found ${violations.length} cross-template CSS reference(s)`);
});

test('Template Independence: No cross-template file references in JavaScript', () => {
  const violations = [];
  
  for (const template of TEMPLATES) {
    const otherTemplates = TEMPLATES.filter(t => t !== template);
    const jsDir = path.join(template, 'js');
    
    if (!fs.existsSync(jsDir)) {
      continue;
    }
    
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    
    for (const jsFile of jsFiles) {
      const content = fs.readFileSync(path.join(jsDir, jsFile), 'utf-8');
      
      // Check for references to other template directories
      for (const otherTemplate of otherTemplates) {
        if (content.includes(otherTemplate)) {
          violations.push({
            template,
            file: `js/${jsFile}`,
            referencesTemplate: otherTemplate
          });
        }
      }
    }
  }
  
  if (violations.length > 0) {
    console.log('\n=== CROSS-TEMPLATE JS REFERENCES FOUND ===');
    violations.forEach(v => {
      console.log(`${v.template}/${v.file} references ${v.referencesTemplate}`);
    });
  }
  
  assert.strictEqual(violations.length, 0, `Found ${violations.length} cross-template JS reference(s)`);
});

test('Template Independence: Each template has all required files for independent deployment', () => {
  const requiredFiles = [
    'index.html',
    'blog.html',
    'blog-post.html',
    'about.html',
    'shop.html',
    'contact.html',
    'css/variables.css',
    'css/styles.css',
    'js/script.js',
    'README.md'
  ];
  
  const requiredDirs = [
    'css',
    'js',
    'assets',
    'assets/images',
    'assets/images/icons',
    'assets/images/placeholders'
  ];
  
  const missingFiles = [];
  
  for (const template of TEMPLATES) {
    // Check required files
    for (const file of requiredFiles) {
      const filePath = path.join(template, file);
      if (!fs.existsSync(filePath)) {
        missingFiles.push({ template, type: 'file', path: file });
      }
    }
    
    // Check required directories
    for (const dir of requiredDirs) {
      const dirPath = path.join(template, dir);
      if (!fs.existsSync(dirPath)) {
        missingFiles.push({ template, type: 'directory', path: dir });
      }
    }
  }
  
  if (missingFiles.length > 0) {
    console.log('\n=== MISSING REQUIRED FILES/DIRECTORIES ===');
    missingFiles.forEach(m => {
      console.log(`${m.template}: Missing ${m.type} - ${m.path}`);
    });
  }
  
  assert.strictEqual(missingFiles.length, 0, `Found ${missingFiles.length} missing required file(s)/directory(ies)`);
});

test('Template Independence: All file references within template use relative paths', () => {
  const absolutePathViolations = [];
  
  for (const template of TEMPLATES) {
    for (const htmlFile of HTML_FILES) {
      const filePath = path.join(template, htmlFile);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      // Check all src and href attributes for absolute paths (excluding external URLs)
      $('[src], [href]').each((i, elem) => {
        const src = $(elem).attr('src');
        const href = $(elem).attr('href');
        const attr = src || href;
        
        if (attr) {
          // Check for absolute file paths (starting with / but not //)
          if (attr.startsWith('/') && !attr.startsWith('//') && !attr.startsWith('http')) {
            absolutePathViolations.push({
              template,
              file: htmlFile,
              attribute: src ? 'src' : 'href',
              value: attr
            });
          }
        }
      });
    }
  }
  
  if (absolutePathViolations.length > 0) {
    console.log('\n=== ABSOLUTE PATH REFERENCES FOUND ===');
    absolutePathViolations.forEach(v => {
      console.log(`${v.template}/${v.file}: ${v.attribute}="${v.value}"`);
    });
  }
  
  assert.strictEqual(absolutePathViolations.length, 0, `Found ${absolutePathViolations.length} absolute path reference(s)`);
});

test('Template Independence: Each template can be deployed to a subdirectory', () => {
  // This test verifies that all internal links work with relative paths
  // which is essential for subdirectory deployment
  
  const issues = [];
  
  for (const template of TEMPLATES) {
    for (const htmlFile of HTML_FILES) {
      const filePath = path.join(template, htmlFile);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      // Check internal navigation links
      $('a[href]').each((i, elem) => {
        const href = $(elem).attr('href');
        
        // Check if it's an internal HTML link
        if (href && href.endsWith('.html') && !href.startsWith('http')) {
          // Verify the target file exists in the same template
          const targetPath = path.join(template, href);
          if (!fs.existsSync(targetPath)) {
            issues.push({
              template,
              file: htmlFile,
              brokenLink: href,
              targetPath
            });
          }
        }
      });
      
      // Check CSS links
      $('link[rel="stylesheet"]').each((i, elem) => {
        const href = $(elem).attr('href');
        
        if (href && !href.startsWith('http')) {
          const targetPath = path.join(template, href);
          if (!fs.existsSync(targetPath)) {
            issues.push({
              template,
              file: htmlFile,
              brokenLink: href,
              targetPath,
              type: 'CSS'
            });
          }
        }
      });
      
      // Check script sources
      $('script[src]').each((i, elem) => {
        const src = $(elem).attr('src');
        
        if (src && !src.startsWith('http')) {
          const targetPath = path.join(template, src);
          if (!fs.existsSync(targetPath)) {
            issues.push({
              template,
              file: htmlFile,
              brokenLink: src,
              targetPath,
              type: 'JavaScript'
            });
          }
        }
      });
    }
  }
  
  if (issues.length > 0) {
    console.log('\n=== BROKEN INTERNAL LINKS FOUND ===');
    issues.forEach(issue => {
      console.log(`${issue.template}/${issue.file}: ${issue.type || 'Link'} "${issue.brokenLink}" -> ${issue.targetPath} (NOT FOUND)`);
    });
  }
  
  assert.strictEqual(issues.length, 0, `Found ${issues.length} broken internal link(s)`);
});

test('Template Independence: No shared assets between templates', () => {
  // Verify that each template has its own assets directory
  // and doesn't reference assets from other templates
  
  const sharedAssetViolations = [];
  
  for (const template of TEMPLATES) {
    const otherTemplates = TEMPLATES.filter(t => t !== template);
    
    for (const htmlFile of HTML_FILES) {
      const filePath = path.join(template, htmlFile);
      
      if (!fs.existsSync(filePath)) {
        continue;
      }
      
      const content = fs.readFileSync(filePath, 'utf-8');
      const $ = cheerio.load(content);
      
      // Check image sources
      $('img[src]').each((i, elem) => {
        const src = $(elem).attr('src');
        
        if (src && !src.startsWith('http')) {
          // Check if image references another template's assets
          for (const otherTemplate of otherTemplates) {
            if (src.includes(otherTemplate)) {
              sharedAssetViolations.push({
                template,
                file: htmlFile,
                asset: src,
                referencesTemplate: otherTemplate
              });
            }
          }
        }
      });
    }
    
    // Check CSS for background images
    const cssDir = path.join(template, 'css');
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css'));
      
      for (const cssFile of cssFiles) {
        const content = fs.readFileSync(path.join(cssDir, cssFile), 'utf-8');
        
        // Check for url() references to other templates
        for (const otherTemplate of otherTemplates) {
          if (content.includes(otherTemplate)) {
            sharedAssetViolations.push({
              template,
              file: `css/${cssFile}`,
              referencesTemplate: otherTemplate
            });
          }
        }
      }
    }
  }
  
  if (sharedAssetViolations.length > 0) {
    console.log('\n=== SHARED ASSET REFERENCES FOUND ===');
    sharedAssetViolations.forEach(v => {
      console.log(`${v.template}/${v.file}: References ${v.referencesTemplate} assets`);
    });
  }
  
  assert.strictEqual(sharedAssetViolations.length, 0, `Found ${sharedAssetViolations.length} shared asset reference(s)`);
});

test('Template Independence: Each template has unique logo and icons', () => {
  const logoIssues = [];
  
  for (const template of TEMPLATES) {
    // Check for logo
    const logoDir = path.join(template, 'assets', 'images');
    if (fs.existsSync(logoDir)) {
      const logoFiles = fs.readdirSync(logoDir).filter(f => 
        f.toLowerCase().includes('logo') && (f.endsWith('.png') || f.endsWith('.svg') || f.endsWith('.jpg'))
      );
      
      if (logoFiles.length === 0) {
        logoIssues.push({
          template,
          issue: 'No logo file found in assets/images'
        });
      }
    } else {
      logoIssues.push({
        template,
        issue: 'assets/images directory not found'
      });
    }
    
    // Check for social media icons
    const iconsDir = path.join(template, 'assets', 'images', 'icons');
    if (fs.existsSync(iconsDir)) {
      const iconFiles = fs.readdirSync(iconsDir);
      const requiredIcons = ['instagram', 'tiktok', 'goodreads'];
      
      for (const iconName of requiredIcons) {
        const hasIcon = iconFiles.some(f => f.toLowerCase().includes(iconName));
        if (!hasIcon) {
          logoIssues.push({
            template,
            issue: `Missing ${iconName} icon in assets/images/icons`
          });
        }
      }
    } else {
      logoIssues.push({
        template,
        issue: 'assets/images/icons directory not found'
      });
    }
  }
  
  if (logoIssues.length > 0) {
    console.log('\n=== LOGO/ICON ISSUES FOUND ===');
    logoIssues.forEach(issue => {
      console.log(`${issue.template}: ${issue.issue}`);
    });
  }
  
  assert.strictEqual(logoIssues.length, 0, `Found ${logoIssues.length} logo/icon issue(s)`);
});
