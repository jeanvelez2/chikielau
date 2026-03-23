# Design System

## Color Tokens

All colors are defined as CSS custom properties in `css/variables.css`.

### Brand Colors
| Token | Value | Usage |
|---|---|---|
| `--color-black-primary` | #1A1A1A | Page backgrounds |
| `--color-black-secondary` | #2C2C2C | Cards, inputs, secondary surfaces |
| `--color-gold-primary` | #D4AF37 | Accent, links, buttons, highlights |
| `--color-gold-light` | #F4E4C1 | Hover states, subtle gold accents |
| `--color-cream-primary` | #FFF8E7 | Primary text |
| `--color-cream-secondary` | #F5F5DC | Secondary light text |
| `--color-neutral-warm-1` | #D7CCC8 | Secondary text |
| `--color-neutral-warm-2` | #BCAAA4 | Muted text, captions |

### Semantic Aliases
| Token | Maps to | Purpose |
|---|---|---|
| `--color-text-primary` | #FFF8E7 | Body text |
| `--color-text-secondary` | #D7CCC8 | Subtitles, metadata |
| `--color-text-muted` | #BCAAA4 | Captions, hints |
| `--color-background-primary` | #1A1A1A | Page background |
| `--color-background-secondary` | #2C2C2C | Card/section background |
| `--color-accent` | #D4AF37 | Interactive elements |
| `--color-error` | #D4AF37 | Error states (gold for brand consistency) |
| `--color-success` | #D4AF37 | Success states (gold for brand consistency) |

## Typography

| Token | Value | Usage |
|---|---|---|
| `--font-primary` | 'Playfair Display', Georgia, serif | Headings |
| `--font-secondary` | 'Lato', 'Helvetica Neue', Arial, sans-serif | Body text |

### Heading Scale (mobile → tablet → desktop → large)
| Level | Mobile | 768px+ | 1024px+ | 1440px+ |
|---|---|---|---|---|
| H1 | 2rem | 3rem | 3.5rem | 4rem |
| H2 | 1.75rem | 2.5rem | 3rem | — |
| H3 | 1.5rem | 2rem | 2.25rem | — |
| H4 | 1.25rem | 1.5rem | — | — |

## Spacing Scale

| Token | Value |
|---|---|
| `--spacing-xs` | 0.5rem (8px) |
| `--spacing-sm` | 1rem (16px) |
| `--spacing-md` | 1.5rem (24px) |
| `--spacing-lg` | 2rem (32px) |
| `--spacing-xl` | 3rem (48px) |
| `--spacing-2xl` | 4rem (64px) |
| `--spacing-3xl` | 6rem (96px, 8rem at 1024px+) |

## Breakpoints

| Name | Value | Usage |
|---|---|---|
| Tablet | 768px | Two-column layouts, larger type |
| Desktop | 1024px | Full layouts, max spacing |
| Large | 1440px | Max heading sizes, wider padding |

## Shadows

| Token | Value |
|---|---|
| `--shadow-sm` | `0 2px 4px rgba(0,0,0,0.3)` |
| `--shadow-md` | `0 4px 8px rgba(0,0,0,0.4)` |
| `--shadow-lg` | `0 8px 16px rgba(0,0,0,0.5)` |
| `--shadow-gold` | `0 4px 12px rgba(212,175,55,0.3)` |

## Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `--z-index-dropdown` | 100 | Dropdowns, menus |
| `--z-index-sticky` | 200 | Sticky elements |
| `--z-index-fixed` | 300 | Fixed header |
| `--z-index-modal-backdrop` | 400 | Modal overlay |
| `--z-index-modal` | 500 | Modal content |
| `--z-index-tooltip` | 600 | Tooltips |

## Transitions

| Token | Value |
|---|---|
| `--transition-speed-fast` | 0.15s |
| `--transition-speed` | 0.3s |
| `--transition-speed-slow` | 0.5s |
| `--transition-easing` | ease-in-out |
| `--transition-easing-smooth` | cubic-bezier(0.4, 0, 0.2, 1) |

## Form Elements

- Input height: 48px (`--input-height`)
- Input background: #2C2C2C (`--input-background`)
- Focus border: #D4AF37 (`--input-focus-border-color`)
- Button height: 48px, padding: `0.75rem 2rem`, border-radius: 4px
