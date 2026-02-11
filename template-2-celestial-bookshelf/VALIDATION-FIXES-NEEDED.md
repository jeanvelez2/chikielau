# Template 2 Validation - Fixes Needed

## Quick Reference for Task 14.6

This document lists the specific fixes needed to pass all validation tests for Template 2 (Celestial Bookshelf).

---

## Fix 1: Font Size Issue (Priority 1 - Accessibility)

**File**: `css/variables.css`  
**Line**: 54  
**Issue**: `--font-size-sm: 0.875rem; /* 14px */` is below 16px minimum

**Current Code**:
```css
--font-size-sm: 0.875rem;    /* 14px */
```

**Fix**: Either remove this variable or ensure it's not used for body text. Check where `--font-size-sm` is used in styles.css and replace with `--font-size-base` or larger.

**Search Command**:
```bash
grep -r "font-size-sm" template-2-celestial-bookshelf/css/
```

---

## Fix 2: Heading Hierarchy in shop.html (Priority 1 - Accessibility)

**File**: `shop.html`  
**Lines**: 91, 111 (and subsequent product titles)  
**Issue**: Page jumps from h1 to h3, skipping h2

**Current Structure**:
```html
<h1 class="page-title">Book Recommendations</h1>
<!-- No h2 here -->
<h3 class="product-title">The Midnight Library</h3>
```

**Fix Option 1** (Recommended): Add an h2 section heading before products
```html
<h1 class="page-title">Book Recommendations</h1>
<p class="page-subtitle">...</p>

<h2 class="section-heading">Featured Books</h2>
<div class="products-grid">
  <div class="product-card">
    <h3 class="product-title">The Midnight Library</h3>
    ...
  </div>
</div>
```

**Fix Option 2**: Change all product titles from h3 to h2
```html
<h1 class="page-title">Book Recommendations</h1>
<div class="products-grid">
  <div class="product-card">
    <h2 class="product-title">The Midnight Library</h2>
    ...
  </div>
</div>
```

**Recommendation**: Use Fix Option 1 to maintain semantic structure and allow for future sections.

---

## Fix 3: Lazy Loading in blog-post.html (Priority 2 - Performance)

**File**: `blog-post.html`  
**Lines**: 131, 139, 261, 276, 291  
**Issue**: Images below the fold missing `loading="lazy"` attribute

### Images to Fix:

**1. Featured Image (Line 131)**:
```html
<!-- Current -->
<img src="assets/images/placeholders/blog-featured-1.svg" alt="The Midnight Library book cover">

<!-- Fixed -->
<img src="assets/images/placeholders/blog-featured-1.svg" alt="The Midnight Library book cover" loading="lazy">
```

**2. Book Cover in Content (Line 139)**:
```html
<!-- Current -->
<img src="assets/images/placeholders/book-cover-1.svg" alt="The Midnight Library by Matt Haig">

<!-- Fixed -->
<img src="assets/images/placeholders/book-cover-1.svg" alt="The Midnight Library by Matt Haig" loading="lazy">
```

**3. Related Post Images (Lines 261, 276, 291)**:
```html
<!-- Current -->
<img src="assets/images/placeholders/book-cover-2.svg" alt="Fourth Wing">

<!-- Fixed -->
<img src="assets/images/placeholders/book-cover-2.svg" alt="Fourth Wing" loading="lazy">
```

**Note**: Do NOT add lazy loading to:
- Logo image (line 98) - it's in the header, above the fold
- Social media icons (lines 344, 347, 350) - they're in the footer but are small icons

---

## Verification Steps

After making fixes, run these commands to verify:

### 1. Check Font Sizes
```bash
grep -n "font-size-sm" template-2-celestial-bookshelf/css/styles.css
```
Should return no results or only comments.

### 2. Check Heading Hierarchy
```bash
grep -n "<h[1-6]" template-2-celestial-bookshelf/shop.html
```
Should show h1, then h2, then h3 in sequential order.

### 3. Check Lazy Loading
```bash
grep -n 'loading="lazy"' template-2-celestial-bookshelf/blog-post.html
```
Should show at least 5 occurrences (featured image + book cover + 3 related posts).

### 4. Re-run Property Tests
```bash
npm run test:property
```
Should pass all Template 2 tests.

---

## Summary

**Total Fixes**: 3 issues affecting 5 specific locations  
**Estimated Time**: 10-15 minutes  
**Impact**: Improves accessibility compliance and page load performance

**Priority Order**:
1. Fix heading hierarchy (accessibility critical)
2. Fix font size usage (accessibility critical)
3. Add lazy loading (performance improvement)

---

## Test Results After Fixes

Expected results after implementing all fixes:

✅ Property 26: Minimum font size  
✅ Property 39a: Heading hierarchy sequential  
✅ Property 39e: Heading document outline  
✅ Property 34c: Lazy loading content images  
✅ Property 34e: Lazy loading blog card images  

**Status**: Template 2 will be fully compliant with all validation requirements.
