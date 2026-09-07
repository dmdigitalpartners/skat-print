# Phase 5 — Design System

> **This document is descriptive, not aspirational.** It was rewritten in the
> Batch 3 design pass after it was found to describe a palette and typeface
> pairing the site has never shipped (copper-orange `#E8502A` with Barlow /
> DM Sans). The authoritative source is always `src/styles/tokens.css`; this
> file explains it. If they disagree again, the CSS is right.

## Brand Identity

Derived from logo analysis, brand guidelines PNG, and existing site.

## Typography

| Role | Font | Weights | Use |
|---|---|---|---|
| Display (`font-display`) | Montserrat | 600, 700, 800 | Hero headlines, section headings, card titles |
| Body (default) | Inter | 400, 500, 600 | Paragraphs, UI labels, navigation |
| Accent (`font-condensed`) | Montserrat | 600 | Eyebrows, badges, metadata, capability strip |

Loaded with `next/font/google` in `src/app/layout.tsx` (self-hosted at build
time, `latin` + `cyrillic` subsets). `--font-condensed` deliberately resolves to
the same Montserrat family as `--font-display`; the name is historical, and
there is no separate condensed face loaded.

## Color Palette

The site is **light-first**. Dark values are used by specific bands (hero,
video, testimonials, CTA banner), not as a global default.

```css
:root {
  /* Brand */
  --color-primary: #1A2B4A;       /* deep navy — authority, industrial */
  --color-primary-dark: #0F1C33;  /* darker navy — mobile bar, gradients */
  --color-primary-light: #243563;
  --color-accent: #0098D4;        /* brand blue — CTAs, rules, active states */
  --color-accent-hover: #007DB5;
  --color-accent-text: #007CAB;   /* WCAG-AA variant: small text on light bg */
  --color-accent-subtle: rgba(0, 152, 212, 0.10);

  /* Light backgrounds (default) */
  --color-bg: #FAFAF8;
  --color-bg-surface: #F4F2ED;
  --color-bg-elevated: #EDEAE3;

  /* Dark section backgrounds */
  --color-bg-dark: #141C27;
  --color-bg-dark-surface: #1E2A3C;

  /* Text */
  --color-text: #1A1A1A;          /* on light bg */
  --color-text-muted: #5E6679;    /* muted on light bg */
  --color-text-dark: #EDE8E0;     /* on dark bg */
  --color-text-muted-dark: #8C95A8;

  /* UI */
  --color-border: #DDD9D3;
  --color-border-dark: #263148;

  /* Semantic */
  --color-success: #2D9E6B;
  --color-error: #E84646;
  --color-warning: #D97706;
}
```

**Accent rule that matters:** use `--color-accent-text` (`#007CAB`) for small
text on light backgrounds and `--color-accent` (`#0098D4`) on dark ones. The
brighter blue does not meet AA at small sizes on `--color-bg`.

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

### Section headers — `src/components/ui/SectionHeader.tsx`

Every top-of-section block (eyebrow + H2 + optional description) goes through
this one component. Before Batch 3 all five homepage sections hand-rolled it and
had drifted apart on eyebrow colour, eyebrow margin, heading size and
description measure. Do not hand-roll a new one.

- **Eyebrow** — `text-xs font-condensed font-semibold uppercase tracking-widest`,
  `mb-5`, preceded by a 20px hairline rule. `align="center"` puts a rule on both
  sides.
- **H2** — `font-display font-bold text-3xl sm:text-4xl md:text-5xl`,
  `tracking-tight leading-[1.05]`. `size="lg"` adds `lg:text-6xl` (CTA banner only).
- **Description** — `text-base md:text-lg max-w-xl`. Pass `descriptionShort` to
  render shorter wording below `md`.
- **Tone** — `tone="light"` on light backgrounds, `tone="dark"` on dark bands.
  This picks the correct accent (see the accent rule above), so set it rather
  than overriding colours.

`SectionWrapper` handles the band itself (background + `section-padding` +
`container-site`); `PageHero` is the `<h1>` page-banner equivalent.

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
