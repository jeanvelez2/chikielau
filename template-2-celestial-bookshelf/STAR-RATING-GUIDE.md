# Star Rating Component Guide

## Overview

The star rating component is a unique feature of Template 2: Celestial Bookshelf. It displays book ratings using gold celestial-themed stars that match the logo aesthetic.

## Features

- **Gold stars** matching the celestial theme (#D4AF37)
- **Half-star support** for ratings like 4.5, 3.5, etc.
- **Accessible** with screen reader text
- **Responsive** sizing options (small, default, large)
- **Glowing effect** with subtle text-shadow for celestial feel

## Basic Usage

### Full Star Rating (5 stars)

```html
<div class="star-rating" data-rating="5" role="img" aria-label="Rating: 5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 5 out of 5 stars</span>
</div>
```

### Half Star Rating (4.5 stars)

```html
<div class="star-rating" data-rating="4.5" role="img" aria-label="Rating: 4.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4.5 out of 5 stars</span>
</div>
```

### Partial Rating (3 stars)

```html
<div class="star-rating" data-rating="3" role="img" aria-label="Rating: 3 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 3 out of 5 stars</span>
</div>
```

## Star Classes

- **`.filled`** - Full gold star
- **`.half`** - Half-filled star (left half gold, right half empty)
- **`.empty`** - Empty star outline

## Size Variations

### Small Rating

```html
<div class="star-rating small" data-rating="4">
  <!-- stars here -->
</div>
```

### Default Rating

```html
<div class="star-rating" data-rating="4">
  <!-- stars here -->
</div>
```

### Large Rating

```html
<div class="star-rating large" data-rating="4">
  <!-- stars here -->
</div>
```

## With Rating Text

```html
<div class="star-rating" data-rating="4.5" role="img" aria-label="Rating: 4.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4.5 out of 5 stars</span>
</div>
<span class="rating-text">4.5 / 5</span>
```

## All Possible Ratings

### 0 stars
```html
<div class="star-rating" data-rating="0" role="img" aria-label="Rating: 0 out of 5 stars">
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 0 out of 5 stars</span>
</div>
```

### 0.5 stars
```html
<div class="star-rating" data-rating="0.5" role="img" aria-label="Rating: 0.5 out of 5 stars">
  <span class="star half" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 0.5 out of 5 stars</span>
</div>
```

### 1 star
```html
<div class="star-rating" data-rating="1" role="img" aria-label="Rating: 1 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 1 out of 5 stars</span>
</div>
```

### 1.5 stars
```html
<div class="star-rating" data-rating="1.5" role="img" aria-label="Rating: 1.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 1.5 out of 5 stars</span>
</div>
```

### 2 stars
```html
<div class="star-rating" data-rating="2" role="img" aria-label="Rating: 2 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 2 out of 5 stars</span>
</div>
```

### 2.5 stars
```html
<div class="star-rating" data-rating="2.5" role="img" aria-label="Rating: 2.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 2.5 out of 5 stars</span>
</div>
```

### 3 stars
```html
<div class="star-rating" data-rating="3" role="img" aria-label="Rating: 3 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 3 out of 5 stars</span>
</div>
```

### 3.5 stars
```html
<div class="star-rating" data-rating="3.5" role="img" aria-label="Rating: 3.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 3.5 out of 5 stars</span>
</div>
```

### 4 stars
```html
<div class="star-rating" data-rating="4" role="img" aria-label="Rating: 4 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star empty" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4 out of 5 stars</span>
</div>
```

### 4.5 stars
```html
<div class="star-rating" data-rating="4.5" role="img" aria-label="Rating: 4.5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star half" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 4.5 out of 5 stars</span>
</div>
```

### 5 stars
```html
<div class="star-rating" data-rating="5" role="img" aria-label="Rating: 5 out of 5 stars">
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="star filled" aria-hidden="true">★</span>
  <span class="sr-only">Rating: 5 out of 5 stars</span>
</div>
```

## Accessibility Features

1. **`role="img"`** - Tells screen readers to treat the rating as an image
2. **`aria-label`** - Provides the rating value to screen readers
3. **`aria-hidden="true"`** on stars - Hides decorative star symbols from screen readers
4. **`.sr-only` text** - Provides screen reader-only text with the rating
5. **`data-rating` attribute** - Stores the numeric rating value for potential JavaScript use

## Usage in Blog Posts

```html
<article class="blog-post">
  <header class="post-header">
    <h1>Review: The Midnight Library</h1>
    <div class="post-meta">
      <time datetime="2026-01-15">January 15, 2026</time>
      <div class="star-rating" data-rating="4.5" role="img" aria-label="Rating: 4.5 out of 5 stars">
        <span class="star filled" aria-hidden="true">★</span>
        <span class="star filled" aria-hidden="true">★</span>
        <span class="star filled" aria-hidden="true">★</span>
        <span class="star filled" aria-hidden="true">★</span>
        <span class="star half" aria-hidden="true">★</span>
        <span class="sr-only">Rating: 4.5 out of 5 stars</span>
      </div>
    </div>
  </header>
  <div class="post-content">
    <p>Your review content...</p>
  </div>
</article>
```

## Usage in Product Cards

```html
<div class="product-card">
  <div class="product-image">
    <img src="book-cover.jpg" alt="Book Title by Author">
  </div>
  <div class="product-info">
    <h3 class="product-title">Book Title</h3>
    <p class="product-author">by Author Name</p>
    <div class="star-rating" data-rating="5" role="img" aria-label="Rating: 5 out of 5 stars">
      <span class="star filled" aria-hidden="true">★</span>
      <span class="star filled" aria-hidden="true">★</span>
      <span class="star filled" aria-hidden="true">★</span>
      <span class="star filled" aria-hidden="true">★</span>
      <span class="star filled" aria-hidden="true">★</span>
      <span class="sr-only">Rating: 5 out of 5 stars</span>
    </div>
    <p class="product-description">Why I recommend this book...</p>
    <a href="affiliate-link" class="btn-gold">Buy Now</a>
  </div>
</div>
```

## Customization

### Change Star Color

Edit `css/variables.css`:

```css
--color-gold-primary: #D4AF37; /* Change this to your preferred color */
```

### Change Star Size

The star size is based on font-size. You can:

1. Use the built-in size classes (`.small`, `.large`)
2. Add custom CSS:

```css
.star-rating.custom-size {
  font-size: 2.5rem;
}
```

### Remove Glow Effect

Edit `css/styles.css` and remove the `text-shadow` property:

```css
.star-rating .star.filled::before {
  content: '★';
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-gold-primary);
  /* Remove this line: */
  /* text-shadow: 0 0 8px rgba(212, 175, 55, 0.5); */
}
```

## Browser Compatibility

The star rating component uses:
- CSS `clip-path` for half-stars (supported in all modern browsers)
- CSS custom properties (supported in all modern browsers)
- Unicode star character (★) - universally supported

Fallback: If CSS fails to load, users will still see star characters (★).

## Notes

- Always include the `data-rating` attribute for potential JavaScript enhancements
- Always include screen reader text for accessibility
- The component is purely CSS-based and requires no JavaScript
- Stars are decorative and use `aria-hidden="true"` to avoid redundant screen reader announcements
