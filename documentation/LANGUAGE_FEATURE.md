# Language Toggle Feature

## Overview
The website now supports bilingual content in English and Spanish. Users can switch between languages using the toggle in the header.

## Features

### Language Toggle Button
- Located in the header next to the navigation menu
- Shows "EN" and "ES" buttons
- Active language is highlighted in gold
- User preference is saved in localStorage

### Supported Languages
- **English (EN)** - Default language
- **Spanish (ES)** - Full translation

### Translated Content
The following sections are translated:
- Navigation menu (Home, Blog, About, Shop, Contact)
- Hero section (title, tagline, intro text, buttons)
- Featured posts section (titles, buttons)
- Instagram section (title, subtitle, button)
- Footer (newsletter, social links, copyright)
- Modal (newsletter signup)
- Form messages (errors, success messages)
- Accessibility labels (ARIA labels)

## How It Works

### Translation System
The translation system uses a JavaScript-based approach:

1. **translations.js** - Contains all translations in a structured object
2. **data-i18n attributes** - HTML elements marked for translation
3. **LanguageManager class** - Handles language switching and updates

### HTML Attributes
Elements use special attributes for translation:
- `data-i18n="key"` - Translates text content
- `data-i18n-placeholder="key"` - Translates placeholder text
- `data-i18n-aria="key"` - Translates ARIA labels

### Example Usage
```html
<!-- Text content -->
<h1 data-i18n="hero.title">Where Books Meet the Stars</h1>

<!-- Placeholder -->
<input data-i18n-placeholder="footer.newsletter.placeholder" placeholder="Your email address">

<!-- ARIA label -->
<button data-i18n-aria="aria.toggle.nav" aria-label="Toggle navigation menu">
```

## Adding New Translations

To add translations for new content:

1. Open `js/translations.js`
2. Add the key-value pair to both `en` and `es` objects:

```javascript
const translations = {
  en: {
    'new.key': 'English text',
    // ... other translations
  },
  es: {
    'new.key': 'Texto en español',
    // ... other translations
  }
};
```

3. Add the `data-i18n` attribute to your HTML:

```html
<p data-i18n="new.key">English text</p>
```

## Browser Support
- Works in all modern browsers
- Uses localStorage for persistence
- Gracefully degrades if localStorage is unavailable

## Files Modified
- `index.html` - Added language toggle and translation attributes
- `css/styles.css` - Added language toggle styles
- `js/translations.js` - New file with translation system
- `js/script.js` - Updated to use translations for form messages

## Future Enhancements
- Add more languages (French, Portuguese, etc.)
- Translate blog post content
- Add language detection based on browser settings
- Implement server-side translations for SEO
