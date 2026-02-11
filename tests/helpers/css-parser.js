/**
 * CSS parsing utility functions for testing
 */

const fs = require('fs');

/**
 * Extract all color values from CSS content
 * Matches hex colors, rgb/rgba, hsl/hsla, and named colors
 * @param {string} cssContent - The CSS file content
 * @returns {Object} - Object with color values and their locations
 */
function extractColors(cssContent) {
  const colors = [];
  
  // Regex patterns for different color formats
  const hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
  const rgbPattern = /rgba?\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(?:,\s*[\d.]+\s*)?\)/gi;
  const hslPattern = /hsla?\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*(?:,\s*[\d.]+\s*)?\)/gi;
  
  // Extract hex colors
  let match;
  while ((match = hexPattern.exec(cssContent)) !== null) {
    colors.push({
      value: match[0].toUpperCase(),
      type: 'hex',
      index: match.index
    });
  }
  
  // Extract rgb/rgba colors
  while ((match = rgbPattern.exec(cssContent)) !== null) {
    colors.push({
      value: match[0],
      type: 'rgb',
      index: match.index
    });
  }
  
  // Extract hsl/hsla colors
  while ((match = hslPattern.exec(cssContent)) !== null) {
    colors.push({
      value: match[0],
      type: 'hsl',
      index: match.index
    });
  }
  
  return colors;
}

/**
 * Extract only hex color values from CSS content
 * Filters out colors in comments
 * @param {string} cssContent - The CSS file content
 * @returns {string[]} - Array of hex color values (uppercase)
 */
function extractHexColors(cssContent) {
  // First, remove all comments from the CSS content
  // Remove /* ... */ style comments
  let cleanedContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove // style comments (though less common in CSS)
  cleanedContent = cleanedContent.replace(/\/\/.*$/gm, '');
  
  const hexPattern = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})\b/g;
  const colors = [];
  let match;
  
  while ((match = hexPattern.exec(cleanedContent)) !== null) {
    colors.push(match[0].toUpperCase());
  }
  
  return colors;
}

/**
 * Check if a color is a CSS variable reference
 * @param {string} line - The CSS line to check
 * @returns {boolean} - True if the line uses a CSS variable for color
 */
function isColorVariable(line) {
  // Check if line contains var(--color-...) or var(--something)
  return /var\s*\(\s*--[^)]+\s*\)/i.test(line);
}

/**
 * Extract color values that are NOT CSS variable references
 * This finds hardcoded color values in CSS
 * @param {string} cssContent - The CSS file content
 * @returns {Object[]} - Array of color objects with value, type, line number
 */
function extractHardcodedColors(cssContent) {
  const lines = cssContent.split('\n');
  const hardcodedColors = [];
  
  lines.forEach((line, index) => {
    // Skip lines that are comments
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) {
      return;
    }
    
    // Skip lines that use CSS variables
    if (isColorVariable(line)) {
      return;
    }
    
    // Skip lines that are defining CSS variables (in :root or other selectors)
    if (line.includes('--color-') || line.includes('--') && line.includes(':')) {
      // This is a variable definition, not usage
      // But we still want to check the value being assigned
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        const value = line.substring(colonIndex + 1).trim();
        // Only check the value part, not the variable name
        const colors = extractColors(value);
        colors.forEach(color => {
          hardcodedColors.push({
            ...color,
            line: index + 1,
            context: line.trim()
          });
        });
      }
      return;
    }
    
    // Extract colors from this line
    const colors = extractColors(line);
    colors.forEach(color => {
      hardcodedColors.push({
        ...color,
        line: index + 1,
        context: line.trim()
      });
    });
  });
  
  return hardcodedColors;
}

/**
 * Normalize hex color to 6-digit uppercase format
 * @param {string} hex - Hex color (e.g., #FFF or #FFFFFF)
 * @returns {string} - Normalized 6-digit hex color
 */
function normalizeHexColor(hex) {
  // Remove # if present
  let color = hex.replace('#', '').toUpperCase();
  
  // Expand 3-digit hex to 6-digit
  if (color.length === 3) {
    color = color.split('').map(c => c + c).join('');
  }
  
  return '#' + color;
}

/**
 * Check if a hex color matches any in the allowed palette
 * @param {string} hexColor - The hex color to check
 * @param {string[]} allowedColors - Array of allowed hex colors
 * @returns {boolean} - True if color is in the allowed palette
 */
function isColorInPalette(hexColor, allowedColors) {
  const normalized = normalizeHexColor(hexColor);
  const normalizedPalette = allowedColors.map(c => normalizeHexColor(c));
  return normalizedPalette.includes(normalized);
}

/**
 * Get all CSS files from a directory
 * @param {string} dirPath - The directory path
 * @returns {string[]} - Array of CSS file paths
 */
function getCSSFiles(dirPath) {
  const cssFiles = [];
  
  function traverse(currentPath) {
    if (!fs.existsSync(currentPath)) {
      return;
    }
    
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = `${currentPath}/${entry.name}`;
      
      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        traverse(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.css')) {
        cssFiles.push(fullPath);
      }
    }
  }
  
  traverse(dirPath);
  return cssFiles;
}

/**
 * Read CSS file content
 * @param {string} filePath - The CSS file path
 * @returns {string} - The file content
 */
function readCSSFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Extract font-size declarations from CSS content
 * @param {string} cssContent - The CSS file content
 * @returns {Object[]} - Array of font-size declarations with value, unit, line number
 */
function extractFontSizes(cssContent) {
  const fontSizes = [];
  const lines = cssContent.split('\n');
  
  // Regex to match font-size declarations
  // Matches: font-size: 16px, font-size: 1.5rem, font-size: var(--font-size-base), etc.
  const fontSizePattern = /font-size\s*:\s*([^;]+);/gi;
  
  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('/*') || line.trim().startsWith('*') || line.trim().startsWith('//')) {
      return;
    }
    
    let match;
    const pattern = /font-size\s*:\s*([^;]+);/gi;
    while ((match = pattern.exec(line)) !== null) {
      const value = match[1].trim();
      fontSizes.push({
        value,
        line: index + 1,
        context: line.trim()
      });
    }
  });
  
  return fontSizes;
}

/**
 * Parse a font-size value and convert to pixels
 * @param {string} value - The font-size value (e.g., "16px", "1rem", "1.5em")
 * @param {number} baseFontSize - The base font size in pixels (default 16px)
 * @returns {number|null} - The font size in pixels, or null if cannot be parsed
 */
function parseFontSizeToPixels(value, baseFontSize = 16) {
  // Remove whitespace
  value = value.trim();
  
  // Check if it's a CSS variable
  if (value.startsWith('var(')) {
    // Cannot determine size from variable reference
    return null;
  }
  
  // Check if it's a keyword
  const keywords = {
    'xx-small': 9,
    'x-small': 10,
    'small': 13,
    'medium': 16,
    'large': 18,
    'x-large': 24,
    'xx-large': 32,
    'smaller': baseFontSize * 0.85,
    'larger': baseFontSize * 1.2
  };
  
  if (keywords[value]) {
    return keywords[value];
  }
  
  // Parse numeric value with unit
  const match = value.match(/^([\d.]+)(px|rem|em|pt|%)?$/);
  if (!match) {
    return null;
  }
  
  const number = parseFloat(match[1]);
  const unit = match[2] || 'px';
  
  switch (unit) {
    case 'px':
      return number;
    case 'rem':
      return number * baseFontSize;
    case 'em':
      return number * baseFontSize;
    case 'pt':
      return number * (4/3); // 1pt = 4/3 px
    case '%':
      return (number / 100) * baseFontSize;
    default:
      return null;
  }
}

/**
 * Check if a CSS selector is for body text
 * Body text includes: body, p, li, td, th, div, span, article, section, etc.
 * Excludes: headings (h1-h6), small, code, pre, etc.
 * @param {string} selector - The CSS selector
 * @returns {boolean} - True if selector is for body text
 */
function isBodyTextSelector(selector) {
  // Normalize selector
  selector = selector.trim().toLowerCase();
  
  // Exclude headings
  if (/\bh[1-6]\b/.test(selector)) {
    return false;
  }
  
  // Exclude small text elements
  if (/\b(small|code|pre|kbd|samp|caption)\b/.test(selector)) {
    return false;
  }
  
  // Include body text elements
  if (/\b(body|p|li|td|th|div|span|article|section|main|aside|footer|header|nav)\b/.test(selector)) {
    return true;
  }
  
  // Include class selectors that might be body text
  // (e.g., .post-content, .description, .text, etc.)
  if (selector.includes('.')) {
    return true;
  }
  
  return false;
}

/**
 * Extract font-size declarations for body text from CSS content
 * @param {string} cssContent - The CSS file content
 * @returns {Object[]} - Array of body text font-size declarations
 */
function extractBodyTextFontSizes(cssContent) {
  const bodyTextFontSizes = [];
  
  // Split CSS into rules
  // This is a simplified parser - it may not handle all edge cases
  const rules = cssContent.split('}');
  
  for (const rule of rules) {
    if (!rule.includes('{')) continue;
    
    const [selectorPart, declarationPart] = rule.split('{');
    if (!declarationPart) continue;
    
    const selectors = selectorPart.split(',').map(s => s.trim());
    
    // Check if any selector is for body text
    const hasBodyTextSelector = selectors.some(isBodyTextSelector);
    
    if (hasBodyTextSelector) {
      // Extract font-size from declarations
      const fontSizeMatch = declarationPart.match(/font-size\s*:\s*([^;]+);/i);
      if (fontSizeMatch) {
        const value = fontSizeMatch[1].trim();
        bodyTextFontSizes.push({
          value,
          selectors: selectors.join(', '),
          context: rule.trim().substring(0, 100) + '...'
        });
      }
    }
  }
  
  return bodyTextFontSizes;
}

module.exports = {
  extractColors,
  extractHexColors,
  extractHardcodedColors,
  isColorVariable,
  normalizeHexColor,
  isColorInPalette,
  getCSSFiles,
  readCSSFile,
  extractFontSizes,
  parseFontSizeToPixels,
  isBodyTextSelector,
  extractBodyTextFontSizes
};
