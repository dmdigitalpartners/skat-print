# Skat Print

The marketing site for **Skat Print**, a packaging and commercial printing manufacturer (offset printing, corrugated board, laminating/finishing, die-cutting, covering/coating) based in Trud, Plovdiv, with a second location in Hisarya, Bulgaria. Skat Print produces POS/retail floor displays and packaging for food, cosmetics, and alcohol/spirits brands. The site is fully bilingual (Bulgarian/English) and exists to generate B2B quote requests and sample requests from industry buyers. Built and maintained by D&M Digital Partners.

## What it offers

- **Bilingual routing** (`/en/*`, `/bg/*`) with a language toggle that produces real, crawlable links for every page (not a client-side string swap).
- **Home, About, FAQ, Contact** — company story, trust signals, and a validated contact form.
- **Products catalogue** (`/products`, `/products/[category]`) — POS displays, food/alcohol/cosmetics/custom packaging.
- **Services** (`/services`, `/services/[service]`) — offset printing, corrugated board, laminating & finishing, die-cutting, covering & coating.
- **Industries** (`/industries/[industry]`) — food, cosmetics, wine & spirits, retail/POS.
- **Portfolio** — a real client-work gallery (named brands such as Coca-Cola, Fanta, Cadbury) with a lightbox viewer, grouped by structural category (e.g. floor displays).
- **Samples request** form, separate from the general contact form.
- **Blog** — content and routes exist (`src/content/blog/{bg,en}`, `next-mdx-remote`) but are currently disabled via a feature flag (see below).
- **Chatbot** (desktop only) with canned intent-matching responses and page-aware welcome messages.
- Mobile-specific UI: a sticky mobile conversion bar and a lighter, restructured hero.
- SEO: per-page metadata, JSON-LD (`src/lib/schema.ts`), a Google rating badge, sitemap, robots, and a generated OpenGraph image.

## How it works

- **Framework**: Next.js 16 (App Router, TypeScript, Turbopack), React 19.
- **Styling/animation**: Tailwind CSS v4, `framer-motion` for scroll/interaction animation.
- **i18n**: a `[lang]` dynamic segment (`en` | `bg`) drives routing; translation strings live in `src/translations/{bg,en}.json` and are read via `src/lib/useTranslation.ts`. `src/proxy.ts` and `src/components/ui/HtmlLang.tsx` keep the `<html lang>` and locale-aware redirects correct.
- **Content**: blog posts are MDX files with frontmatter (`gray-matter` + `next-mdx-remote`); portfolio images are described in `src/lib/portfolio-data.ts`.
- **Forms**: `react-hook-form` + `zod`, submitted to `src/app/api/contact/route.ts`, which sends via Resend and falls back to a Formspree endpoint if Resend fails.
- **Feature flags**: `src/config/features.ts` currently gates the blog off (content/components/routes remain in the repo; flipping `FEATURES.blog` to `true` restores the nav link and sitemap entries).
- **Security**: strict headers (CSP, HSTS, X-Frame-Options, etc.) in `next.config.ts`, with the CSP scoped to allow only Vercel Analytics scripts and Google Maps embeds (used on Contact).
- **Analytics**: Vercel Analytics.

### Where content lives

- `src/translations/bg.json` / `en.json` — nearly all UI copy, one JSON tree per language, mirrored key-for-key.
- `src/config/site.ts` — canonical production URL (used by metadata, robots, sitemap, JSON-LD).
- `src/config/contact.ts` — phone numbers, email, and both office addresses (localized address strings live in the translation files; phone numbers are centralized here since they don't vary by locale).
- `src/config/routes.ts` — the valid product-category, service, and industry slugs that drive the dynamic `[category]`/`[service]`/`[industry]` routes.
- `src/lib/portfolio-data.ts` — the portfolio image gallery.
- `src/content/blog/{bg,en}/*.mdx` — blog posts (currently unpublished).
- `docs/` — build-time planning docs (asset map, site audit, design system, sitemap/architecture, task list, content audit) kept for reference.

## Project structure

```text
src/
  app/
    [lang]/         Localized routes: home, about, blog, contact, faq,
                    industries/[industry], portfolio, products, products/[category],
                    services, services/[service], samples, privacy, terms
    api/contact/    Contact form handler (Resend + Formspree fallback)
  components/
    sections/       Page sections (Hero, ProductsCatalog, FAQSection, ContactForm…)
    ui/              Chatbot, MobileConversionBar, GoogleRatingBadge, PortfolioLightbox…
    layout/          Navbar, Footer, LanguageToggle
    seo/             JsonLd
  config/            site.ts, contact.ts, routes.ts, features.ts
  content/blog/      MDX blog posts (bg/en), currently flagged off
  lib/               blog.ts, metadata.ts, schema.ts, portfolio-data.ts, useTranslation.ts
  translations/      bg.json, en.json
docs/                Build planning/reference docs
brand_assets/         Logo + brand-guideline source files (local only, gitignored)
```

## Getting started

```bash
npm install
npm run dev     # next dev
npm run build   # next build
npm run start   # next start
npm run lint    # eslint
```

Environment variables (see `.env.example`):

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Primary email delivery for contact-form submissions via Resend. |
| `RESEND_TO_EMAIL` | Recipient for contact submissions; falls back to a parent-company address if unset (intentional). |
| `FORMSPREE_URL` | Fallback form endpoint used only if the Resend send fails. |

## Deployment

Linked to Vercel (`.vercel/project.json` → project `skat-print`). Per `CLAUDE.md`, deployment is **manual, not automatic on push**: active work happens on `develop`; a production release is cut by merging `develop` into `main` and then running `npx vercel --prod` from the project directory, followed by a `git tag`. Do not assume pushing to `main` alone deploys anything — the CLI step is required.

## Maintenance notes

- **Change copy**: edit the matching key in both `src/translations/bg.json` and `en.json` — the two files must stay structurally identical or a language will silently miss content.
- **Add a product/service/industry page**: add the slug to the relevant array in `src/config/routes.ts`, then add copy for it in both translation files.
- **Re-enable the blog**: flip `FEATURES.blog` to `true` in `src/config/features.ts`; the routes, components, and MDX content already exist.
- **Contact/phone changes**: edit `src/config/contact.ts`, not the translation files, for phone numbers (addresses do live in translations since they're genuinely localized).
- **Brand assets**: check `brand_assets/` before any visual work — it holds the logo files and brand-guideline reference and is intentionally gitignored (local-only, not deployed).
- **Screenshots/local QA**: `screenshot.mjs` / `screenshot-mobile.mjs` and `serve.mjs` are local Puppeteer-based tooling for visually comparing builds against reference designs, documented in `CLAUDE.md`.

---

Built and maintained by D&M Digital Partners.
