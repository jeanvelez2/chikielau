const { test } = require('node:test');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

/**
 * Property 54: README completeness
 * **Validates: Requirements 17.1-17.8**
 * 
 * For any template's README.md file, it should contain sections for:
 * - Template description (17.1)
 * - Design philosophy (17.1)
 * - Color palette (17.2)
 * - Font specifications (17.3)
 * - Customization guide (17.4)
 * - Hostinger integration (17.5)
 * - Newsletter integration (17.6)
 * - Instagram integration (17.7)
 * - Image guidelines (17.8)
 */

const REQUIRED_SECTIONS = [
  { name: 'Template Description', keywords: ['template description', 'design philosophy'], requirement: '17.1' },
  { name: 'Color Palette', keywords: ['color palette', 'hex code', '#'], requirement: '17.2' },
  { name: 'Typography', keywords: ['font', 'typography', 'google fonts'], requirement: '17.3' },
  { name: 'Customization Guide', keywords: ['customization', 'changing colors', 'updating logo', 'adding blog posts', 'modifying navigation'], requirement: '17.4' },
  { name: 'Hostinger Deployment', keywords: ['hostinger', 'deployment', 'upload', 'file manager'], requirement: '17.5' },
  { name: 'Newsletter Integration', keywords: ['mailchimp', 'convertkit', 'newsletter'], requirement: '17.6' },
  { name: 'Instagram Integration', keywords: ['instagram', 'snapwidget', 'elfsight', 'embed'], requirement: '17.7' },
  { name: 'Image Guidelines', keywords: ['image dimension', 'logo:', '200x200', 'blog featured', '1200x630', 'book cover', '400x600'], requirement: '17.8' }
];

test('Property 54: README completeness - all required sections present', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        // Check if README exists
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        // Check each required section
        const missingSections = [];
        for (const section of REQUIRED_SECTIONS) {
          const hasSection = section.keywords.some(keyword => content.includes(keyword.toLowerCase()));
          if (!hasSection) {
            missingSections.push(`${section.name} (Req ${section.requirement})`);
          }
        }
        
        if (missingSections.length > 0) {
          console.error(`Template ${templateDir} README missing sections: ${missingSections.join(', ')}`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54a: README contains template description and design philosophy', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasDescription = content.includes('template description') || content.includes('description');
        const hasPhilosophy = content.includes('design philosophy') || content.includes('philosophy');
        
        return hasDescription && hasPhilosophy;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54b: README contains color palette with hex codes', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8');
        
        // Check for color palette section
        const hasColorSection = content.toLowerCase().includes('color palette') || content.toLowerCase().includes('color');
        
        // Check for hex codes (format: #XXXXXX)
        const hexCodeRegex = /#[0-9A-Fa-f]{6}/g;
        const hexCodes = content.match(hexCodeRegex);
        const hasHexCodes = hexCodes && hexCodes.length >= 4; // At least 4 brand colors
        
        return hasColorSection && hasHexCodes;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54c: README contains font specifications with Google Fonts links', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasFontSection = content.includes('font') || content.includes('typography');
        const hasGoogleFonts = content.includes('google fonts') || content.includes('fonts.google.com');
        
        return hasFontSection && hasGoogleFonts;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54d: README contains customization guide', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        // Check for key customization topics
        const hasCustomization = content.includes('customization');
        const hasColorChange = content.includes('changing colors') || content.includes('change color');
        const hasLogoUpdate = content.includes('updating logo') || content.includes('update logo') || content.includes('replace logo');
        const hasBlogPosts = content.includes('adding blog posts') || content.includes('add blog');
        const hasNavigation = content.includes('modifying navigation') || content.includes('navigation');
        
        return hasCustomization && (hasColorChange || hasLogoUpdate || hasBlogPosts || hasNavigation);
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54e: README contains Hostinger deployment instructions', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasHostinger = content.includes('hostinger');
        const hasDeployment = content.includes('deployment') || content.includes('upload') || content.includes('deploy');
        const hasFileManager = content.includes('file manager') || content.includes('public_html');
        
        return hasHostinger && hasDeployment;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54f: README contains newsletter service integration', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasMailchimp = content.includes('mailchimp');
        const hasConvertKit = content.includes('convertkit');
        const hasNewsletter = content.includes('newsletter');
        
        return hasNewsletter && (hasMailchimp || hasConvertKit);
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54g: README contains Instagram feed integration instructions', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasInstagram = content.includes('instagram');
        const hasIntegrationOptions = content.includes('snapwidget') || content.includes('elfsight') || content.includes('embed');
        
        return hasInstagram && hasIntegrationOptions;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54h: README contains image dimension guidelines', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasImageGuidelines = content.includes('image dimension') || content.includes('image size');
        const hasLogoDimensions = content.includes('200') && content.includes('200'); // 200x200px
        const hasBlogDimensions = content.includes('1200') && content.includes('630'); // 1200x630px
        const hasBookCoverDimensions = content.includes('400') && content.includes('600'); // 400x600px
        
        return hasImageGuidelines || (hasLogoDimensions && hasBlogDimensions && hasBookCoverDimensions);
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54i: README contains affiliate link management documentation', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasAffiliate = content.includes('affiliate');
        const hasLinkManagement = content.includes('link') || content.includes('amazon') || content.includes('bookshop');
        
        return hasAffiliate && hasLinkManagement;
      }
    ),
    { numRuns: 100 }
  );
});

test('Property 54j: README contains form backend integration guide', () => {
  fc.assert(
    fc.property(
      fc.constantFrom('template-1-literary-lounge', 'template-2-celestial-bookshelf', 'template-3-moonlit-pages'),
      (templateDir) => {
        const readmePath = path.join(templateDir, 'README.md');
        
        if (!fs.existsSync(readmePath)) {
          return false;
        }
        
        const content = fs.readFileSync(readmePath, 'utf-8').toLowerCase();
        
        const hasForm = content.includes('form');
        const hasBackend = content.includes('backend') || content.includes('integration') || content.includes('formspree') || content.includes('netlify');
        
        return hasForm && hasBackend;
      }
    ),
    { numRuns: 100 }
  );
});
