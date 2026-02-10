/**
 * Property-Based Tests for CTA Button Styling
 * Feature: chikielau-website-templates
 * 
 * These tests verify universal properties about CTA button styling
 * across all three templates using property-based testing with fast-check.
 */

const { test } = require('node:test');
const assert = require('node:assert');
const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const css = require('css');

// Template directories
const TEMPLATES = [
  'template-1-literary-lounge',
  'template-2-celestial-bookshelf',
  'template-3-moonlit-pages'
];

// Brand gold colors from requirements
const GOLD_COLORS = [
  '#D4AF37',  // --color-gold-primary
  '#F4E4C1',  // --color-gold-light
  '#d4af37',  // lowercase variant
  '#f4e4c1',  // lowercase variant
  'var(--color-gold-primary)',
  'var(--color-gold-light)'
];

/**
 * Helper function to parse CSS file
 * @param {string} filePath - Path to CSS file
 * @returns {object} - Parsed CSS AST
 */
function parseCssFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return css.parse(content);
}

/**
 * Helper function to find CSS rules matching a selector
 * @param {object} ast - CSS AST
 * @param {string} selector - CSS selector to find
 * @returns {Array} - Array of matching rules
 */
function findRulesBySelector(ast, selector) {
  const rules = [];
  
  function traverse(node) {
    if (node.type === 'rule') {
      if (node.selectors && node.selectors.some(s => s.includes(selector))) {
        rules.push(node);
      }
    }
    
    if (node.rules) {
      node.rules.forEach(traverse);
    }
    
    if (node.stylesheet && node.stylesheet.rules) {
      node.stylesheet.rules.forEach(traverse);
    }
  }
  
  traverse(ast);
  return rules;
}

/**
 * Helper function to get declaration value from a rule
 * @param {object} rule - CSS rule
 * @param {string} property - CSS property name
 * @returns {string|null} - Property value or null
 */
function getDeclarationValue(rule, property) {
  if (!rule.declarations) return null;
  
  const declaration = rule.declarations.find(d => 
    d.type === 'declaration' && d.property === property
  );
  
  return declaration ? declaration.value : null;
}

/**
 * Helper function to check if a color value is a gold brand color
 * @param {string} value - CSS color value
 * @returns {boolean} - True if value is a gold brand color
 */
function isGoldColor(value) {
  if (!value) return false;
  
  // Normalize the value (trim, lowercase)
  const normalized = value.trim().toLowerCase();
  
  // Check if it matches any gold color
  return GOLD_COLORS.some(goldColor => {
    const normalizedGold = goldColor.toLowerCase();
    return normalized === normalizedGold || normalized.includes(normalizedGold);
  });
}

/**
 * Helper function to check if a rule has hover pseudo-class
 * @param {Array} rules - Array of CSS rules
 * @param {string} baseSelector - Base selector (e.g., '.btn-cta')
 * @returns {boolean} - True if hover pseudo-class exists
 */
function hasHoverPseudoClass(rules, baseSelector) {
  return rules.some(rule => {
    if (!rule.selectors) return false;
    return rule.selectors.some(selector => {
      // Check for :hover or :focus pseudo-classes
      return selector.includes(baseSelector) && 
             (selector.includes(':hover') || selector.includes(':focus'));
    });
  });
}

/**
 * Helper function to check if hover state has different styling
 * @param {object} baseRule - Base CSS rule
 * @param {object} hoverRule - Hover CSS rule
 * @returns {boolean} - True if hover has different styling
 */
function hasDifferentHoverStyling(baseRule, hoverRule) {
  if (!baseRule || !hoverRule) return false;
  if (!baseRule.declarations || !hoverRule.declarations) return false;
  
  // Check if any property has a different value in hover state
  const baseProps = new Map();
  baseRule.declarations.forEach(d => {
    if (d.type === 'declaration') {
      baseProps.set(d.property, d.value);
    }
  });
  
  let hasDifference = false;
  hoverRule.declarations.forEach(d => {
    if (d.type === 'declaration') {
      const baseValue = baseProps.get(d.property);
      if (baseValue && baseValue !== d.value) {
        hasDifference = true;
      }
    }
  });
  
  return hasDifference;
}

/**
 * Property 22: CTA button styling
 * **Validates: Requirements 7.3**
 * 
 * For any CTA button's CSS, it should use gold brand colors and include
 * :hover pseudo-class with different styling.
 */
test('Property 22: CTA buttons use gold colors and have hover states', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFilePath = path.join(templatePath, 'css', 'styles.css');
        
        // Check if CSS file exists
        if (!fs.existsSync(cssFilePath)) {
          console.error(`\nCSS file does not exist in ${template}`);
          return false;
        }
        
        // Parse CSS
        const ast = parseCssFile(cssFilePath);
        
        // Find CTA button rules
        const ctaRules = findRulesBySelector(ast, '.btn-cta');
        
        if (ctaRules.length === 0) {
          console.error(`\nNo .btn-cta rules found in ${template}/css/styles.css`);
          return false;
        }
        
        // Check for gold color usage
        let usesGoldColor = false;
        const baseRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => s === '.btn-cta' || s.trim() === '.btn-cta');
        });
        
        if (baseRule) {
          const backgroundColor = getDeclarationValue(baseRule, 'background-color');
          const color = getDeclarationValue(baseRule, 'color');
          const borderColor = getDeclarationValue(baseRule, 'border-color');
          
          usesGoldColor = isGoldColor(backgroundColor) || 
                         isGoldColor(color) || 
                         isGoldColor(borderColor);
          
          if (!usesGoldColor) {
            console.error(`\n.btn-cta in ${template} does not use gold brand colors`);
            console.error(`  background-color: ${backgroundColor}`);
            console.error(`  color: ${color}`);
            console.error(`  border-color: ${borderColor}`);
            return false;
          }
        } else {
          console.error(`\nNo base .btn-cta rule found in ${template}`);
          return false;
        }
        
        // Check for hover pseudo-class
        const hasHover = hasHoverPseudoClass(ctaRules, '.btn-cta');
        
        if (!hasHover) {
          console.error(`\n.btn-cta in ${template} does not have :hover pseudo-class`);
          return false;
        }
        
        // Check if hover state has different styling
        const hoverRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => 
            s.includes('.btn-cta') && (s.includes(':hover') || s.includes(':focus'))
          );
        });
        
        const hasDifferentStyling = hasDifferentHoverStyling(baseRule, hoverRule);
        
        if (!hasDifferentStyling) {
          console.error(`\n.btn-cta:hover in ${template} does not have different styling from base state`);
          return false;
        }
        
        return true;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 22a: CTA buttons use gold background color
 * **Validates: Requirements 7.3**
 * 
 * CTA buttons should use gold brand color for background or border.
 */
test('Property 22a: CTA buttons use gold background or border color', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFilePath = path.join(templatePath, 'css', 'styles.css');
        
        if (!fs.existsSync(cssFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const ast = parseCssFile(cssFilePath);
        const ctaRules = findRulesBySelector(ast, '.btn-cta');
        
        if (ctaRules.length === 0) {
          return false;
        }
        
        const baseRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => s === '.btn-cta' || s.trim() === '.btn-cta');
        });
        
        if (!baseRule) {
          return false;
        }
        
        const backgroundColor = getDeclarationValue(baseRule, 'background-color');
        const borderColor = getDeclarationValue(baseRule, 'border-color');
        
        const usesGold = isGoldColor(backgroundColor) || isGoldColor(borderColor);
        
        if (!usesGold) {
          console.error(`\n.btn-cta in ${template} does not use gold for background or border`);
          console.error(`  background-color: ${backgroundColor}`);
          console.error(`  border-color: ${borderColor}`);
        }
        
        return usesGold;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 22b: CTA buttons have hover pseudo-class
 * **Validates: Requirements 7.3**
 * 
 * CTA buttons should have :hover or :focus pseudo-class defined.
 */
test('Property 22b: CTA buttons have hover or focus pseudo-class', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFilePath = path.join(templatePath, 'css', 'styles.css');
        
        if (!fs.existsSync(cssFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const ast = parseCssFile(cssFilePath);
        const ctaRules = findRulesBySelector(ast, '.btn-cta');
        
        if (ctaRules.length === 0) {
          return false;
        }
        
        const hasHover = hasHoverPseudoClass(ctaRules, '.btn-cta');
        
        if (!hasHover) {
          console.error(`\n.btn-cta in ${template} does not have :hover or :focus pseudo-class`);
        }
        
        return hasHover;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 22c: CTA button hover state has different styling
 * **Validates: Requirements 7.3**
 * 
 * CTA button hover state should have at least one different CSS property value.
 */
test('Property 22c: CTA button hover state has different styling', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFilePath = path.join(templatePath, 'css', 'styles.css');
        
        if (!fs.existsSync(cssFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const ast = parseCssFile(cssFilePath);
        const ctaRules = findRulesBySelector(ast, '.btn-cta');
        
        if (ctaRules.length === 0) {
          return false;
        }
        
        const baseRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => s === '.btn-cta' || s.trim() === '.btn-cta');
        });
        
        const hoverRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => 
            s.includes('.btn-cta') && (s.includes(':hover') || s.includes(':focus'))
          );
        });
        
        if (!baseRule || !hoverRule) {
          return false;
        }
        
        const hasDifferent = hasDifferentHoverStyling(baseRule, hoverRule);
        
        if (!hasDifferent) {
          console.error(`\n.btn-cta:hover in ${template} does not have different styling from base state`);
        }
        
        return hasDifferent;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 22d: CTA buttons exist in shop page HTML
 * **Validates: Requirements 7.3**
 * 
 * Shop pages should contain elements with btn-cta class.
 */
test('Property 22d: Shop pages contain CTA button elements', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const shopFilePath = path.join(templatePath, 'shop.html');
        
        if (!fs.existsSync(shopFilePath)) {
          console.error(`\nshop.html does not exist in ${template}`);
          return false;
        }
        
        const content = fs.readFileSync(shopFilePath, 'utf-8');
        
        // Check for btn-cta class in HTML
        const hasCtaClass = content.includes('btn-cta');
        
        if (!hasCtaClass) {
          console.error(`\nNo elements with btn-cta class found in ${template}/shop.html`);
        }
        
        return hasCtaClass;
      }
    ),
    { numRuns: 100 }
  );
});

/**
 * Property 22e: CTA button CSS includes transition property
 * **Validates: Requirements 7.3**
 * 
 * CTA buttons should have smooth transitions for hover effects.
 */
test('Property 22e: CTA buttons have transition property for smooth effects', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...TEMPLATES),
      (template) => {
        const templatePath = path.join(process.cwd(), template);
        const cssFilePath = path.join(templatePath, 'css', 'styles.css');
        
        if (!fs.existsSync(cssFilePath)) {
          return true; // Skip if file doesn't exist
        }
        
        const ast = parseCssFile(cssFilePath);
        const ctaRules = findRulesBySelector(ast, '.btn-cta');
        
        if (ctaRules.length === 0) {
          return false;
        }
        
        const baseRule = ctaRules.find(rule => {
          if (!rule.selectors) return false;
          return rule.selectors.some(s => s === '.btn-cta' || s.trim() === '.btn-cta');
        });
        
        if (!baseRule) {
          return false;
        }
        
        const transition = getDeclarationValue(baseRule, 'transition');
        
        const hasTransition = transition !== null && transition.trim().length > 0;
        
        if (!hasTransition) {
          console.error(`\n.btn-cta in ${template} does not have transition property`);
        }
        
        return hasTransition;
      }
    ),
    { numRuns: 100 }
  );
});
