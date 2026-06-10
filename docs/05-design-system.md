# Phase 5 — Design System

## Brand Identity

Derived from logo analysis, brand guidelines PNG, and existing site.

## Typography

| Role | Font | Weights | Use |
|---|---|---|---|
| Display | Barlow | 700, 800 | Hero headlines, section headings, large CTAs |
| Body | DM Sans | 400, 500 | Paragraphs, UI labels, navigation |
| Accent | Barlow Condensed | 500, 600 | Category badges, tags, metadata, captions |

Loaded via Google Fonts. Only the weights listed are loaded to minimize font payload.

## Color Palette

```css
:root {
  /* Brand */
  --color-primary: #1A2B4A;       /* deep navy — authority, industrial */
  --color-primary-dark: #0F1C33;  /* darker navy — hover, depth */
  --color-accent: #E8502A;        /* copper-orange — CTAs, active states */
  --color-accent-hover: #C93D1A;  /* darker accent for hover */

  /* Backgrounds */
  --color-bg: #0B0F1A;            /* near-black — primary dark bg */
  --color-bg-surface: #141929;    /* card surfaces on dark bg */
  --color-bg-light: #F5F4F2;      /* off-white — light sections */
  --color-bg-light-surface: #EDECEA; /* cards on light bg */

  /* Text */
  --color-text: #F0EDE8;          /* warm white — on dark bg */
  --color-text-dark: #1A1A1A;     /* near-black — on light bg */
  --color-text-muted: #9BA3B2;    /* muted — on dark bg */
  --color-text-muted-dark: #6B7280; /* muted — on light bg */

  /* UI */
  --color-border: #2A3550;        /* subtle border on dark */
  --color-border-light: #E2E0DC;  /* subtle border on light */

  /* Semantic */
  --color-success: #2D9E6B;
  --color-error: #E84646;
  --color-warning: #D97706;
}
```

## Spacing Scale (4px base)

```css
:root {
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-32: 8rem;     /* 128px */
}
```

## Border Radius Scale

```css
:root {
  --radius-sm: 2px;
  --radius-md: 6px;
  --radius-lg: 12px;
  --radius-xl: 20px;
  --radius-full: 9999px;
}
```

## Shadow / Elevation System

```css
:root {
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 16px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.5);
  --shadow-accent: 0 4px 24px rgba(232,80,42,0.25);
  --shadow-primary: 0 4px 24px rgba(26,43,74,0.4);
}
```

## Component Patterns

### Buttons
- **Primary:** accent bg (#E8502A), white text, 44px min height, rounded-md, hover darkens accent
- **Secondary:** transparent bg, accent border + accent text, same sizing
- **Ghost:** transparent bg, muted text, no border, for low-emphasis actions

### Cards
- **Service Card:** dark surface (#141929), border, icon + title + description + link
- **Portfolio Card:** image fill, overlay with category badge that slides up on hover (always partially visible on mobile)
- **Testimonial/Stat:** accent border-left, number large, label muted

### Navigation
- Desktop: horizontal, sticky, blur backdrop on scroll
- Mobile: hamburger → Framer Motion slide-down panel

### Language Toggle
- Pill style: `BG | EN`
- Active lang: accent background
- Inactive: transparent, muted text
- Switches URL prefix on click

## Section Spacing (mobile-first)

- **Section padding:** `py-16 md:py-20 lg:py-24`
- **Container max-width:** 1280px, `px-4 md:px-8 lg:px-12`
- **Grid gap:** `gap-4 md:gap-6 lg:gap-8`
