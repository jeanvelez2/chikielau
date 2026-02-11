---
inclusion: always
---

# Product Overview

## Project Description

Three distinct, production-ready website templates for the Chikielau bookstagrammer brand. Each template is self-contained, fully functional, and deployable directly to Hostinger without build tools.

## Templates

### Template 1: Literary Lounge
- **Design Philosophy**: Magazine-style layout with warm, inviting aesthetics
- **Visual Style**: Cream tones, traditional horizontal navigation
- **Unique Features**: Featured book carousel, "Currently Reading" spotlight section
- **Directory**: `template-1-literary-lounge/`

### Template 2: Celestial Bookshelf
- **Design Philosophy**: Bold, modern design with dramatic contrast
- **Visual Style**: Black and gold color scheme, asymmetric layouts
- **Unique Features**: Side/hamburger navigation with celestial icons, star-rating system for books
- **Directory**: `template-2-celestial-bookshelf/`

### Template 3: Moonlit Pages
- **Design Philosophy**: Clean, minimalist storytelling focus
- **Visual Style**: Soft neutral palette, single-column layouts
- **Unique Features**: Sticky minimalist navigation, "Book of the Month" section
- **Directory**: `template-3-moonlit-pages/`

## Required Pages (All Templates)

Each template must include these six pages with identical functionality:
1. **index.html** - Homepage with hero section, featured content, newsletter signup
2. **blog.html** - Blog archive with post cards, pagination, categories
3. **blog-post.html** - Single post template with metadata, social sharing, related posts
4. **about.html** - About page with author bio, brand story, social links
5. **shop.html** - Book recommendations with affiliate links, covers, descriptions
6. **contact.html** - Contact form with validation, social media links

## Core Functionality Requirements

### Newsletter Integration
- Modal popup with configurable delay (default 5 seconds)
- Inline forms on homepage and footer
- Email validation before submission
- Compatible with Mailchimp and ConvertKit APIs
- Dismissible with localStorage persistence

### Instagram Feed Integration
- Placeholder sections for Instagram content
- Grid layout (2x3 or 3x3 depending on template)
- Ready for third-party widget integration (e.g., SnapWidget, Elfsight)

### Affiliate Link Support
- Book recommendation cards with "Buy Now" CTAs
- External link indicators (aria-label, icon)
- Proper `rel="noopener noreferrer"` attributes

### Responsive Design
- Mobile-first approach (base styles for 320px)
- Breakpoints: 768px (tablet), 1024px (desktop), 1440px (large desktop)
- Touch-friendly interactive elements (min 44x44px)
- Fluid typography and spacing

### Accessibility (WCAG 2.1 AA)
- Semantic HTML5 elements throughout
- Proper heading hierarchy (h1-h6)
- ARIA labels for interactive elements
- Keyboard navigation support
- Minimum contrast ratios: 4.5:1 (normal text), 3:1 (large text)
- Form labels and error messages
- Skip navigation links

## Brand Identity

### Chikielau Brand Essence
Cozy vintage library vibes meets celestial elegance - a sophisticated yet approachable aesthetic for book lovers.

### Visual Elements
- **Logo**: Gold celestial design with crescent moon and stars
- **Typography**: Elegant script fonts for headings, readable sans-serif for body
- **Primary Colors**: Metallic gold (#D4AF37), deep black (#1A1A1A), cream/ivory (#FFF8E7)
- **Accent Colors**: Warm neutrals, soft browns, muted golds

### Design Principles
- Warmth and approachability over cold minimalism
- Elegant but not pretentious
- Book-focused content presentation
- Clear visual hierarchy
- Generous whitespace

## Target Audience

### Primary Users
- Bookstagrammers establishing online presence beyond Instagram
- Book bloggers needing professional portfolio sites
- Content creators showcasing reviews and recommendations
- Authors building personal brand websites

### User Characteristics
- Non-technical users requiring easy customization
- Visual content creators comfortable with HTML/CSS basics
- Users deploying to Hostinger or similar shared hosting
- Users integrating with Mailchimp, ConvertKit, Instagram

### User Goals
- Professional online presence for book content
- Newsletter subscriber growth
- Affiliate revenue from book recommendations
- Instagram audience conversion to website visitors
- SEO visibility for book reviews

## Deployment Context

### Primary Platform: Hostinger
- Direct file upload via File Manager (no build process)
- Shared hosting environment
- Standard Apache/Nginx server
- No Node.js or build tools required
- Static HTML/CSS/JS only

### Alternative Platforms
- **WordPress**: Templates can be converted to WordPress themes
- **Wix**: Can be adapted using Wix custom code features
- **Netlify/Vercel**: Direct deployment of static files

## Quality Standards

### Performance
- Page load time: Under 3 seconds on standard broadband
- Image optimization: <500KB for photos, <100KB for icons
- Lazy loading for below-the-fold images
- Minimal external dependencies (<5 per page)

### Code Quality
- W3C HTML5 validation (zero errors)
- No inline styles or inline scripts
- Consistent naming conventions (BEM-like)
- Code comments for key sections
- Semantic, accessible markup

### Browser Compatibility
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## Key Constraints

### Technical Constraints
- **No frameworks**: Vanilla JavaScript only (no React, Vue, jQuery)
- **No build tools**: No webpack, Vite, or preprocessors
- **No external dependencies**: Self-contained except Google Fonts
- **Template independence**: Each template is fully self-contained with no cross-template dependencies

### Content Constraints
- All placeholder content must be book/reading-related
- Social media icons: Instagram, TikTok, Goodreads only
- Newsletter forms must support standard email service providers
- Affiliate links must include proper disclosure language

## Success Criteria

A template is considered complete when:
1. All six pages are functional and validated
2. WCAG 2.1 AA accessibility compliance verified
3. Responsive design tested across breakpoints (320px-1920px)
4. All interactive features work without JavaScript errors
5. Newsletter forms validate and submit correctly
6. Documentation is comprehensive and user-friendly
7. Template can be deployed to Hostinger without modifications
8. All property-based tests pass
9. Zero W3C validation errors
