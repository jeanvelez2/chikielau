#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const write = (f, d) => fs.writeFileSync(path.join(ROOT, f), d);

// 1. Concatenate CSS modules
const moduleOrder = [
  'base', 'components', 'blog', 'instagram', 'footer',
  'hero', 'responsive', 'blog-post', 'shop', 'about', 'contact'
];
try {
  const css = moduleOrder.map(m => {
    const p = `css/modules/${m}.css`;
    if (!fs.existsSync(path.join(ROOT, p))) { console.warn(`WARN: Missing ${p}, skipping`); return ''; }
    return read(p);
  }).join('\n');
  write('css/styles.css', css);
  console.log(`CSS: ${moduleOrder.length} modules → css/styles.css (${(css.length / 1024).toFixed(1)}KB)`);

  // Minify: strip comments, collapse whitespace (lightweight, no dependency)
  const min = css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n\s*\n/g, '\n')
    .replace(/^\s+/gm, '')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}\n')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/;\}/g, '}');
  write('css/styles.min.css', min);
  console.log(`CSS: minified → css/styles.min.css (${(min.length / 1024).toFixed(1)}KB)`);
} catch (err) {
  console.error('CSS build failed:', err.message);
  process.exit(1);
}

// 2. Load partials
const header = read('partials/header.html').trim();
const footer = read('partials/footer.html').trim();

const activeMap = {
  'index.html': 'nav.home',
  'blog.html': 'nav.blog',
  'blog-full.html': 'nav.blog',
  'about.html': 'nav.about',
  'shop.html': 'nav.shop',
  'shop-full.html': 'nav.shop',
  'contact.html': 'nav.contact',
};

function injectPartials(file, prefix) {
  let html = read(file);
  let changed = false;
  const headerRe = /^[ \t]*(?:<!-- HEADER -->|<header class="site-header">[\s\S]*?<\/header>)/m;
  const footerRe = /^[ \t]*(?:<!-- FOOTER -->|<footer class="site-footer">[\s\S]*?<\/footer>)/m;

  if (headerRe.test(html)) {
    const navKey = activeMap[path.basename(file)];
    let h = prefix ? header.replace(/href="(?!http|#|mailto|tel:|data:)/g, `href="${prefix}`)
                          .replace(/src="(?!http|data:)/g, `src="${prefix}`) : header;
    if (navKey) {
      h = h.replace(
        new RegExp(`(class="nav-link"\\s+data-i18n="${navKey}")`),
        `class="nav-link active" data-i18n="${navKey}"`
      );
    }
    html = html.replace(headerRe, h);
    changed = true;
  }

  if (footerRe.test(html)) {
    let f = prefix ? footer.replace(/href="(?!http|#|mailto|tel:|data:)/g, `href="${prefix}`)
                          .replace(/src="(?!http|data:)/g, `src="${prefix}`) : footer;
    html = html.replace(footerRe, f);
    changed = true;
  }

  if (!changed) console.warn(`WARN: No header/footer markers found in ${file}`);
  if (changed) write(file, html);
  return changed;
}

// 3. Process root HTML files
let count = 0;
const rootFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') && f !== 'admin.html');
for (const file of rootFiles) {
  try { if (injectPartials(file, '')) count++; }
  catch (err) { console.error(`ERROR processing ${file}:`, err.message); }
}

// 4. Process review pages
const reviewDir = path.join(ROOT, 'reviews');
if (fs.existsSync(reviewDir)) {
  const reviewFiles = fs.readdirSync(reviewDir).filter(f => f.endsWith('.html'));
  for (const file of reviewFiles) {
    try { if (injectPartials(path.join('reviews', file), '../')) count++; }
    catch (err) { console.error(`ERROR processing reviews/${file}:`, err.message); }
  }
}

console.log(`HTML: ${count} files updated`);
