# Phase 7 — Task List

Updated continuously throughout build.

## Status Key
- [x] Complete
- [~] In progress
- [ ] Pending

---

## Pre-Build

- [x] TASK-000 — Skills installation logged (docs/00-install-log.md)
- [x] TASK-001 — ChatGPT hero image deleted
- [x] TASK-002 — Existing site audit complete (docs/02-existing-site-audit.md)
- [x] TASK-003 — Documentation files written (docs/01 through 07)

## Phase A — Scaffold & Foundation

- [x] TASK-A01 — Next.js 14 scaffolded (App Router, TypeScript, Tailwind)
- [x] TASK-A02 — Dependencies installed (framer-motion, react-hook-form, zod, resend, @vercel/analytics)
- [ ] TASK-A03 — tokens.css created
- [ ] TASK-A04 — tailwind.config.ts updated with token references
- [ ] TASK-A05 — middleware.ts (language routing)
- [ ] TASK-A06 — bg.json + en.json (full translations)
- [ ] TASK-A07 — useTranslation.ts hook
- [ ] TASK-A08 — portfolio-data.ts typed asset array

## Phase B — Layout Components

- [ ] TASK-B01 — Navbar.tsx
- [ ] TASK-B02 — Footer.tsx
- [ ] TASK-B03 — LanguageToggle.tsx

## Phase C — UI Primitives

- [ ] TASK-C01 — Button.tsx
- [ ] TASK-C02 — Card.tsx
- [ ] TASK-C03 — Badge.tsx
- [ ] TASK-C04 — SectionWrapper.tsx

## Phase D — Section Components

- [ ] TASK-D00 — Read brand-guidelines.png, verify/adjust color tokens
- [ ] TASK-D01 — Hero.tsx (CSS-only dark bg, Framer stagger)
- [ ] TASK-D02 — TrustStrip.tsx (stats + client names)
- [ ] TASK-D03 — ServicesGrid.tsx (5 cards)
- [ ] TASK-D04 — VideoSection.tsx (cinematic dark, HTML5 video)
- [ ] TASK-D05 — PortfolioGrid.tsx (filterable, hover overlays)
- [ ] TASK-D06 — Differentiators.tsx (4 columns)
- [ ] TASK-D07 — CTABanner.tsx
- [ ] TASK-D08 — ContactForm.tsx (5-field, RHF + Zod)

## Phase E — Pages

- [ ] TASK-E01 — Root layout.tsx (Navbar, Footer, Analytics, JsonLd)
- [ ] TASK-E02 — [lang]/page.tsx (Homepage)
- [ ] TASK-E03 — [lang]/services/page.tsx
- [ ] TASK-E04 — [lang]/services/[service]/page.tsx (5 services)
- [ ] TASK-E05 — [lang]/portfolio/page.tsx
- [ ] TASK-E06 — [lang]/about/page.tsx
- [ ] TASK-E07 — [lang]/contact/page.tsx (2 maps, form, contact info)
- [ ] TASK-E08 — api/contact/route.ts (Resend → Formspree fallback)
- [ ] TASK-E09 — not-found.tsx (custom 404)
- [ ] TASK-E10 — sitemap.ts
- [ ] TASK-E11 — robots.ts

## Phase F — Assets

- [ ] TASK-F01 — Create public/assets/ directory structure
- [ ] TASK-F02 — Copy + rename all portfolio images
- [ ] TASK-F03 — Copy logos
- [ ] TASK-F04 — Copy + rename video (company-intro.mp4)
- [ ] TASK-F05 — Generate favicon files from logo-en.jpg

## Phase G — SEO

- [ ] TASK-G01 — JsonLd.tsx (two-location schema)
- [ ] TASK-G02 — generateMetadata on every page (BG + EN)

## Phase H — Polish

- [ ] TASK-H01 — Framer Motion animations (hero stagger, scroll-reveal, page transitions)
- [ ] TASK-H02 — useReducedMotion wrappers
- [ ] TASK-H03 — Responsive verification (375px, 393px, 768px, 1024px, 1440px)
- [ ] TASK-H04 — Touch targets audit (44px minimum)
- [ ] TASK-H05 — Image optimization (sizes attr, lazy loading)
- [ ] TASK-H06 — Accessibility (aria-labels, semantic HTML, focus states)
- [ ] TASK-H07 — `npm run build` — zero TypeScript errors
