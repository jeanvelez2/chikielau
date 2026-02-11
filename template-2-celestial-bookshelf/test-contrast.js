// Color Contrast Ratio Calculator
// WCAG 2.1 AA Requirements: Normal text (4.5:1), Large text (3:1)

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

// Template 2 Color Combinations
const tests = [
  { name: 'Cream on Black (primary text)', fg: '#FFF8E7', bg: '#1A1A1A', type: 'normal' },
  { name: 'Warm Neutral on Black (secondary text)', fg: '#D7CCC8', bg: '#1A1A1A', type: 'normal' },
  { name: 'Gold on Black (accent/links)', fg: '#D4AF37', bg: '#1A1A1A', type: 'normal' },
  { name: 'Black on Gold (buttons)', fg: '#1A1A1A', bg: '#D4AF37', type: 'normal' },
  { name: 'Cream on Secondary Black', fg: '#FFF8E7', bg: '#2C2C2C', type: 'normal' },
  { name: 'Muted on Black (placeholder text)', fg: '#BCAAA4', bg: '#1A1A1A', type: 'normal' },
  { name: 'Gold Light on Black (hover)', fg: '#F4E4C1', bg: '#1A1A1A', type: 'normal' }
];

console.log('='.repeat(80));
console.log('Template 2: Celestial Bookshelf - Color Contrast Analysis');
console.log('WCAG 2.1 AA Requirements: Normal text (4.5:1), Large text (3:1)');
console.log('='.repeat(80));
console.log('');

let allPass = true;

tests.forEach(test => {
  const ratio = getContrastRatio(test.fg, test.bg);
  const required = test.type === 'normal' ? 4.5 : 3.0;
  const passes = ratio >= required;
  
  if (!passes) allPass = false;
  
  const status = passes ? '✓ PASS' : '✗ FAIL';
  const statusIcon = passes ? '✓' : '✗';
  
  console.log(`${statusIcon} ${test.name}`);
  console.log(`   Foreground: ${test.fg} | Background: ${test.bg}`);
  console.log(`   Contrast Ratio: ${ratio.toFixed(2)}:1 (Required: ${required}:1)`);
  console.log(`   Status: ${status}`);
  console.log('');
});

console.log('='.repeat(80));
console.log(`Overall Result: ${allPass ? '✓ ALL TESTS PASS' : '✗ SOME TESTS FAIL'}`);
console.log('='.repeat(80));

// Exit with appropriate code
process.exit(allPass ? 0 : 1);
