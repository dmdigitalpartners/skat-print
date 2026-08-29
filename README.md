# Skat Print

Marketing website for Skat Print — custom corrugated packaging and POS display manufacturer (Скат Ойл ЕООД, trading as Скат Принт), based in Trud/Hisarya, Plovdiv region, Bulgaria, manufacturing since 1995.

Bilingual (Bulgarian / English) Next.js site covering products, services, industries, samples requests, and a blog.

## Tech stack

- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Content:** MDX blog posts, JSON translation files (`src/translations/`)
- **Deployment:** Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (falls back to the next available port if 3000 is in use).

Locale-prefixed routes live under `src/app/[lang]/` (`bg` default, `en` available). Site copy is centralized in `src/translations/en.json` and `src/translations/bg.json`.

## Media assets

`public/assets/` and `public/favicon/` are tracked in version control — they are required for Git-based Vercel builds. `brand_assets/` is intentionally excluded (see `.gitignore`): it is design-source material, unreferenced by the site, and kept only on local machines that hold those files.

## Deployment workflow

See `CLAUDE.md` for the full branching and deployment workflow (`develop` → `main` → Vercel).

## License

Proprietary — all rights reserved. This is commissioned client work; no license is granted for reuse or redistribution.
