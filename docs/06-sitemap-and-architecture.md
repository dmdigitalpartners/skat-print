# Phase 6 — Sitemap & Architecture

## URL Structure

```
/ → 301 redirect to /bg/

/bg/              Bulgarian homepage (default language)
/bg/services      Services overview
/bg/services/pos-displays
/bg/services/wine-packaging
/bg/services/food-packaging
/bg/services/cosmetics-packaging
/bg/services/custom-packaging
/bg/portfolio     Full portfolio gallery (filterable)
/bg/about         Company story, factory, heritage
/bg/contact       Maps, form, addresses, phones

/en/              English homepage
/en/services      Services overview
/en/services/pos-displays
/en/services/wine-packaging
/en/services/food-packaging
/en/services/cosmetics-packaging
/en/services/custom-packaging
/en/portfolio
/en/about
/en/contact
```

## Routing Implementation

- `middleware.ts` — intercepts `/`, redirects to `/bg/`. Validates lang param is `bg` or `en`.
- `src/app/[lang]/` — dynamic route group for all pages
- `src/app/[lang]/services/[service]/` — 5 static service detail pages via `generateStaticParams`

## Language Routing Logic

```ts
// middleware.ts
const validLangs = ['bg', 'en']
// / → /bg/
// /bg/* → pass through
// /en/* → pass through
// /unknown/* → /bg/*
```

## Translation System

- `src/translations/bg.json` — Bulgarian copy
- `src/translations/en.json` — English copy
- `src/lib/useTranslation.ts` — server-side helper: `getTranslation(lang)` returns typed JSON
- Used in both `page.tsx` (server components) and client components via props

## Logo Switch

```tsx
<Image
  src={lang === 'bg' ? '/assets/logos/logo-bg.png' : '/assets/logos/logo-en.jpg'}
  alt="Skat Print"
/>
```

## Bilingual SEO

Each page exports `generateMetadata({ params: { lang } })` with:
- Unique `title` and `description` per page per language
- `openGraph.locale`: `bg_BG` or `en_US`
- `openGraph.url`: `https://www.skatoil.com/{lang}/{page}`
