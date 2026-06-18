# Skat Print — Implementation Plan
> Last updated: 2026-06-15
> Status: In progress
> Active branch: redesign
> Baseline tag: v0-baseline
> Repo: https://github.com/dani-aisystems/skat-print

## How to resume in a new chat
1. Open this file from the repo
2. Paste the full contents into a new Claude conversation
3. Say: "Continue from where we left off. Here is the full plan."
4. Claude will read the plan, identify completed vs pending phases, and proceed.

## Completed Phases
<!-- Update this section as phases are completed -->
- [x] Phase 0 — Pre-Work
- [ ] Phase 0.5 — Visual Fix Batch (pending remaining desktop section feedback)
- [x] Phase 1 — Critical Security & SEO Fixes
- [x] Phase 2 — Analytics Event Layer
- [x] Phase 3 — Homepage Redesign
- [x] Phase 4 — Chatbot Mobile Drawer
- [x] Phase 5 — Sample Request Flow
- [x] Phase 6 — SEO: Keyword Map + Industry Pages
- [x] Phase 7 — Blog Scaffold
- [x] Phase 8 — Schema Markup
- [x] Phase 9 — Micro-Fixes
- [ ] Phase 10 — Chatbot Refactor (deferred — after mobile drawer confirmed in browser)
- [x] Phase 11 — Mobile Conversion Shortcuts

---

# SKAT Print — Complete End-to-End Website Audit & Implementation Plan

**Context:** B2B packaging manufacturer website (Skat Print, Bulgaria). Next.js + TypeScript + Tailwind CSS v4 + Framer Motion. Bilingual EN/BG. All phases 0–11 complete as of 2026-06-15. Plan below is the canonical reference for future work and serves as the locked spec for any further AI-driven implementation.

---

## LOCKED RULES — Read Before Any Code Change

### GitHub Baseline Protocol (Must Run First)
Repository: `https://github.com/dani-aisystems/skat-print`. No separate backup repo.
Before any code changes:
1. Push current codebase to `main` on `dani-aisystems/skat-print` as-is — this is the baseline snapshot
2. Tag: `git tag v0-baseline`
3. Create `redesign` branch from `v0-baseline` — all new work on `redesign` only
4. `main` untouched until client approval

### Preservation Rules (Non-Negotiable)
- All existing `/public` assets: untouched
- All existing translation keys: additions only — no deletions or renames
- All existing routes: continue to work — no route deleted, only new ones added
- All existing component props/interfaces: only new props added with defaults
- Header redesign (completed, approved): visual reference for all new sections — do not revisit
- If any task touches more than 3 files simultaneously: split into sub-steps with a checkpoint

### Change Philosophy
Small, targeted, reversible changes only. Each task is a surgical addition, not a rewrite. Add the missing layers (trust, conversion, SEO) without destabilizing what already works.

---

## Phase 0.5 — Visual Fix Batch (Blocking — Implement Before Phase 1)

Desktop visual fixes reported after launch review. Implement and deploy as one commit before any further feature work.

**A.** `src/components/sections/ProductsCatalog.tsx` line 40-42 — remove col-span ternary, give all 5 cards `'col-span-1 md:col-span-2'`
**B.** Same file — Custom & Gift image should self-correct after A; re-deploy ensures asset is on Vercel
**C.** Same file lines 90-98 — CTA: remove `text-right`, `text-sm` → `text-base`, remove `gap-1.5` + `<span aria-hidden>→</span>`
**D.** `src/components/sections/Differentiators.tsx` line 83 — `"flex flex-wrap gap-3"` → `"flex flex-wrap md:flex-nowrap gap-3"`

Commit: `style: desktop visual fixes batch 1 — card size, CTA, cert row`

---

## Phase 0 — Pre-Work (Before Any Feature Work)

### P0.1 Baseline Commit & Branch Setup
Push current codebase to `main` on `https://github.com/dani-aisystems/skat-print`. Tag `v0-baseline`. Create `redesign` branch. All subsequent work on `redesign` only.

### P0.2 Create `src/config/routes.ts`
Extract `VALID_CATEGORIES` and `VALID_SERVICES` from all duplicate locations into one file. Update all importing files in the same session (find all occurrences, replace in one pass).

### P0.3 Create `.env.example`
```
RESEND_API_KEY=
RESEND_TO_EMAIL=office@skat-print.com
# Fallback: office@skatoil.com (parent company — intentional)
FORMSPREE_URL=
```

### P0.4 Fix `<html lang>` Hardcoding
Add `LocaleLayout` wrapper inside `[lang]/layout.tsx` rendering `<html lang={lang}>`.

### P0.5 Fix Sitemap
Remove `/[lang]/products` and `/[lang]/portfolio` (redirect-only). Add actual category pages.

---

## Phase 1 — Critical Security & SEO Fixes

### 1.1 Rate Limiting on `/api/contact`
In-memory sliding window, no external dependencies. 5 requests per minute per IP, implemented directly in `route.ts`. Return 429 with a user-friendly message.

### 1.2 CSRF Protection
Validate `Origin` header in `route.ts`. Reject requests not originating from the site's own domain.

### 1.3 OG Image — Placeholder
- Create `public/og-default.jpg` (1200×630): solid `#141C27` background, centered "SKAT Print" in Montserrat white, cyan `#0098D4` accent rule
- Add to root layout metadata: `openGraph: { images: ['/og-default.jpg'] }`
- Add `// TODO: replace with designed asset` comment in metadata config
- Add per-page `openGraph.images` in all `generateMetadata` functions (use same default for now)

### 1.4 Privacy & Terms Pages
Create `src/app/[lang]/privacy/page.tsx` and `src/app/[lang]/terms/page.tsx`. Minimal placeholder content with:
```
// TODO: replace with actual legal copy reviewed by counsel
```
Keep footer links. Add to sitemap.

### 1.5 Fix Wrong Fallback Email
In `contact/route.ts`, add `// intentional fallback — parent company (Skat Oil)` comment on the `office@skatoil.com` line. Log a `console.warn` if `RESEND_TO_EMAIL` is not set. Do NOT throw.

### 1.6 HTTP Headers in `next.config.ts`
```ts
async headers() {
  return [
    { source: '/assets/:path*', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    { source: '/:path*', headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
    ]},
  ]
}
```

### 1.7 Image Optimization Config
```ts
images: { formats: ['image/avif', 'image/webp'], deviceSizes: [640, 750, 828, 1080, 1280, 1440] }
```

### 1.8 Resource Hints
Add `preconnect` for `fonts.googleapis.com` and `fonts.gstatic.com`, `dns-prefetch` for `maps.googleapis.com` in root layout.

---

## Phase 2 — Analytics Event Layer

### 2.1 Create `src/lib/analytics.ts`
```ts
export function trackEvent(name: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return
  // GA4 gtag stub — expand when GA4 is fully wired
  window.gtag?.('event', name, props)
}
```
Add `src/types/gtag.d.ts` with proper `Window` augmentation (removes unsafe casts from Chatbot).

### 2.2 Instrument High-Value Events Only
Wire `trackEvent` calls for:
- `cta_click` — props: `{ section, label }` — on every CTA button click
- `form_submitted` — props: `{ form_type }` — on contact form success
- `chatbot_opened` — on FAB click
- `chatbot_lead_qualified` — when chatbot enters callback/pricing success state

No scroll depth, no A/B testing — deferred to future session.

---

## Phase 3 — Homepage Redesign (Existing Section Queue)

Follow the iteration collaboration process for each section. Use completed header as the sole visual reference. No new tokens — all colors, spacing, and typography from `tokens.css`.

**Order:** Hero → ProductsCatalog → VideoSection → Differentiators → CTABanner → Footer

### 3.1 Hero Section
- Value proposition headline: "Bulgaria's Precision Packaging Partner Since 1995"
- Subheadline addressing buyer pain: "Fast turnaround, EU-certified materials, flexible MOQs for brands of all sizes"
- Primary CTA: "Request Free Samples" (links to sample request flow)
- Secondary CTA: "Browse Our Catalog"
- Stats bar: raise label text to minimum `text-[11px]`; raise `text-white/45` to `text-white/70`
- Fix `text-6xl md:text-6xl` redundancy
- Fix mobile CTA `!important` overrides — add `size="sm"` to Button component instead
- After hero: "Trusted By" logo strip (homepage only)

### 3.2 Trusted By Logo Strip (New Section — Homepage Only)
New `src/components/sections/TrustedBy.tsx`.
- Position: immediately below Hero, above ProductsCatalog
- Content: **6 entries**, rendered as bordered text pills in muted color (no images until real logos provided). Labels: "EU Food Brand", "Austrian Cosmetics Group", "Polish Retail Chain", "German Pharma Co.", "French Winery", "Nordic FMCG Brand"
- Each pill: `inline-flex border border-[var(--color-border)] rounded-full px-4 py-2 text-sm text-[var(--color-text-muted)] font-medium`
- Add `{/* // replace with <Image> when real logos provided */}` comment inside each pill
- Design: white background, horizontal scroll on mobile, centered row on desktop — matches header's paper-white aesthetic

### 3.3 ProductsCatalog Section
Present findings and options per iteration process.

### 3.4 VideoSection
Present findings and options per iteration process.

### 3.5 Differentiators Section
Add certifications block. AI determines which certifications a Bulgarian B2B packaging manufacturer of this profile would typically hold:
- ISO 9001:2015 (Quality Management) — almost certain
- FSC Chain of Custody — common for paper/cardboard manufacturers
- EU REACH compliance — relevant for materials
- Add as certification badge grid with `// verify with client` comment on each entry

### 3.6 CTABanner Section
- Headline: "Get Your Custom Quote Today"
- Subtext: "We respond within 4 business hours."
- Add "within 4 business hours" to both `en.json` and `bg.json` as `cta.response_time`
- Add `trackEvent('cta_click', { section: 'cta_banner', label })` on button click

### 3.7 Footer Redesign
- EU Funded Project badge/seal: add to footer using the grant reference `BG16RFOP002-3.001-0074-C01`
  - Small EU flag + "Co-funded by the European Union" text + project code
  - Links to or displays the PDF when provided (placeholder link for now)
  - Position: bottom of footer, secondary prominence — credibility signal, not legal boilerplate
- Ensure Privacy/Terms links now resolve correctly
- `trackEvent` on all footer CTA clicks

---

## Phase 4 — Chatbot: Mobile Drawer

**Critical rule:** Read and preserve the entire existing conversation flow in `Chatbot.tsx` exactly. Mobile drawer is new functionality layered on top. No logic changes. No refactor. Refactor (Phase 10) happens only after mobile drawer is confirmed working.

### 4.1 Mobile Chat Drawer
- Breakpoint: below `md` (768px) — show full-screen drawer instead of FAB+panel
- Drawer: `fixed inset-0 z-50`, slides up from bottom
- Header: company name + close button
- Body: same `<MessageList>` and `<FollowUpChips>` as desktop
- Trigger: floating chat button anchored to bottom-right (same as FAB, but opens drawer not panel)
- Session state: shared — switching viewport doesn't reset conversation
- Add `trackEvent('chatbot_opened')` on both FAB and mobile trigger

### 4.2 Chatbot Lead Flow Handoff
- After lead qualification (pricing or callback success state), append a final message: "Our team responds within 4 business hours."
- Add a prominent "Send My Request" button that submits collected lead data to `/api/contact` with `type: 'chatbot-lead'`
- `trackEvent('chatbot_lead_qualified')` fires at this moment
- Add translation keys: `chatbot.response_time_promise` in both JSON files

---

## Phase 5 — Sample Request Flow

### 5.1 Sample Request Page
New route: `/[lang]/samples`
- 3-step flow (AI decides UX, constrained to ≤3 steps):
  - Step 1: Select product categories (checkboxes using `VALID_CATEGORIES` — no new categories invented)
  - Step 2: Shipping address + company name + email
  - Step 3: Confirmation — "Your sample request has been sent. We respond within 4 business hours."
- **Validation:** company name (required, min 2 chars), email (required, valid format), at least 1 category selected. Shipping address optional. Show inline error per field on blur. Disable submit while invalid.
- **API error handling:** on non-2xx from `/api/contact`, show "Something went wrong — please try again or email us directly" with the `office@skat-print.com` fallback.
- Submits to existing `/api/contact` with `type: 'sample-request'` flag in the body; use rate limit key `'sample-request'` separate from `'contact'` so a high-frequency sample requester doesn't lock out the main contact form. ⚠️ **Note:** `/api/contact/route.ts` currently uses a single in-memory rate limit bucket per IP. When implementing, add a second `rateLimitMap` keyed as `${ip}:sample` to isolate the two flows.
- Add `trackEvent('form_submitted', { form_type: 'sample_request' })` on success

### 5.2 Update CTAs to Point to Sample Flow
- Hero primary CTA: `/[lang]/samples`
- CTABanner secondary CTA: `/[lang]/samples`

---

## Phase 6 — SEO: Keyword Map + Industry Pages

### 6.1 Keyword Map (Deliver First, Before Any Page Creation)
Deliver as markdown table. EU-wide focus. One primary keyword + three secondary per page. Format:

| Page | Primary Keyword | Secondary 1 | Secondary 2 | Secondary 3 |
|------|----------------|-------------|-------------|-------------|
| /en/industries/food-packaging | food packaging manufacturer Bulgaria | ... | ... | ... |
| ... | | | | |

Cover: all 4 industry pages + all existing product category pages + homepage.

### 6.2 Industry Landing Pages
Priority order: food-packaging → cosmetics-packaging → wine-spirits-packaging → retail-pos-displays

Route: `src/app/[lang]/industries/[industry]/page.tsx`

Each page contains (AI generates copy):
- Hero: problem-first headline matching primary keyword
- Content: ~800 words total, structured as: intro (150w) → capabilities for this industry (200w) → process overview (150w) → use cases (150w) → FAQ block (150w, 3 questions)
- Related products: links to relevant `VALID_CATEGORIES` pages
- Case study excerpt: anonymized EU client, Problem → Constraint → Solution → Result format (e.g., "Mid-size German cosmetics brand, 40,000-unit run")
- CTA: industry-specific ("Request Cosmetics Packaging Samples")
- EN primary, BG via existing i18n system (add keys to both JSON files)

### 6.3 Case Studies — AI-Generated Anonymized
3 case studies, realistic EU client archetypes:
1. German cosmetics brand, 40,000-unit run — packaging brief change at 3-week deadline
2. Austrian organic food brand — FSC-certified substrate requirement, retail shelf specs
3. Polish retail chain — POS display campaign, 15 SKUs, coordinated delivery to 80 stores

Format: Problem → Constraint → Solution → Result. No real company names. Add to `translations/` as `case_studies[]`.

### 6.4 Testimonials — AI-Generated
3 realistic B2B testimonials. Include: first name + last initial, job title, company type, country. No real company names.
Example: "Anna K., Procurement Manager, Mid-size Cosmetics Brand, Austria"
Add to `translations/` as `testimonials[]`.

### 6.5 Update `products/[category]/page.tsx` — Real Content, Not Redirect
Remove `redirect()`. Render actual product category content (reuse `ProductsCatalog` filtered to category). Add schema markup per category. Add "Related Industries" links. Add to sitemap.
**Migration note:** once this is live, `/[lang]/products` is the canonical hub and `/#products` on the homepage is no longer the primary destination. The homepage section still exists but is no longer the SEO target — do not add a canonical tag or redirect from it. Both can coexist.

### 6.6 Hub-and-Spoke Internal Linking
- `/products`: hub page listing all categories (real page, not redirect)
- Each category page: links back to `/products` hub + 2 related industry pages
- Each industry page: links to 2–3 relevant category pages + 1 related industry
- Blog scaffold articles: link to relevant product/industry pages

---

## Phase 7 — Blog Scaffold

### 7.1 Route Structure
`src/app/[lang]/blog/` — static MDX files only. No CMS integration. Foundation only.

Structure:
```
src/content/blog/
  en/
    how-to-choose-food-packaging.mdx
  bg/
    how-to-choose-food-packaging.mdx
src/app/[lang]/blog/
  page.tsx           — blog index
  [slug]/page.tsx    — blog post
```

### 7.2 MDX Frontmatter Schema (Locked)
All MDX files must use this exact frontmatter. Do not add or remove fields without updating the `blog.ts` parser.
```yaml
---
title: string         # page <title> and H1
description: string   # meta description (≤160 chars)
date: YYYY-MM-DD      # ISO date, used for sort order
lang: en | bg         # must match the content/blog/{lang}/ directory
status: draft | published   # only published posts appear in the index
---
```

### 7.3 One Example Article
"How to Choose the Right Packaging for Food Products"
- ~600 words, structured with H2/H3
- Links to food-packaging industry page and relevant product categories
- SEO: title tag, meta description, og:image from default

---

## Phase 8 — Schema Markup

### 8.1 FAQPage Schema
Add to `src/app/[lang]/faq/page.tsx`. Pull questions from `t.faq.items`.

### 8.2 Organization Schema
Add to root layout alongside existing `LocalBusiness`. Include logo, social profiles (if any), contact point.

### 8.3 BreadcrumbList Schema
Add to product category pages and industry pages.

### 8.4 Product Schema
Add to each product category page.

---

## Phase 9 — Micro-Fixes (Sweep Pass)

Apply all micro-optimizations in one focused pass:
- `Eyebrow` component extracted (5 files updated)
- Contact info centralized in `src/config/contact.ts` (Chatbot, JsonLd, contact/route.ts)
- Eyebrow contrast: `#0098D4` → `#007CAB` on light backgrounds
- Hero stats label: `text-[9px]` → `text-[11px]`
- `text-white/45` → `text-white/70` in Hero dark sections
- Navbar hardcoded hex → design tokens
- PortfolioGrid empty state message
- Section padding: define `.section-lg` / `.section-md` in globals.css; apply consistently
- Card gap rhythm: standardize to `gap-6 md:gap-8`
- Form: add `*` required markers; error text to `text-sm text-red-700`
- Form success: emoji `✓` → SVG icon

---

## Phase 10 — Chatbot Refactor (After Mobile Drawer Confirmed Working)

**Prerequisite:** Phase 9 contact centralization in `Chatbot.tsx` (`import { CONTACT } from '@/config/contact'`) must already be committed. During the Phase 10 refactor, verify this import is carried into the new shell file — it must not be reverted to hardcoded strings.

Split the `Chatbot.tsx` file:
- `src/lib/chatbot-intents.ts` — extract `INTENTS` array (350+ lines)
- `src/hooks/useChatbotSession.ts` — extract all state + session storage logic
- `src/components/icons/ChatbotIcons.tsx` — inline SVG icons
- `src/components/ui/chatbot/ChatPanel.tsx`, `MessageList.tsx`, `FollowUpChips.tsx`, `ChatHeader.tsx`
- `Chatbot.tsx` becomes the assembly shell (~100 lines)

**Rule:** No behavior changes during this refactor. Output must be identical to pre-refactor. Test mobile drawer before starting.

---

## Phase 11 — Mobile Conversion Shortcuts

New `src/components/ui/MobileConversionBar.tsx`
- Visible only below `md` breakpoint
- Sticky bottom bar: `[📞 Call] [💬 WhatsApp] [✉ Quick Form]`
- Phone and WhatsApp from `src/config/contact.ts`
- "Quick Form" opens a 2-field drawer: email + message → submits to `/api/contact` with `type: 'mobile-quick'`
- Add `trackEvent('cta_click', { section: 'mobile_bar', label })` on each button

---

## Branch & Deploy Protocol

- All work on `redesign` branch
- Merge `redesign → main` only after **client sign-off on the Vercel preview URL**
- Tag merge commit: `git tag v1-launch -m "v1-launch — client approved"`
- Deploy: `npx vercel --prod` from `skat-print/` directory (deploys local assets + code)
- Never commit binary assets to git — they are deployed from local via Vercel CLI

---

## Verification Checklist (Per Phase)

After each phase, verify:
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Both `/en` and `/bg` routes for all new pages work
- [ ] No existing routes return 404 or broken layout
- [ ] All new translation keys exist in both `en.json` and `bg.json`
- [ ] No hardcoded strings outside translation files
- [ ] No new colors/spacing values outside `tokens.css`
- [ ] `trackEvent` calls fire correctly in browser console
- [ ] Deploy to Vercel production (per session-end deploy rule)

---

## Files Created / Modified Summary

**New files:**
- `src/config/routes.ts`
- `src/config/contact.ts`
- `src/lib/analytics.ts`
- `src/types/gtag.d.ts`
- `src/components/ui/Eyebrow.tsx`
- `src/components/ui/MobileConversionBar.tsx`
- `src/components/sections/TrustedBy.tsx`
- `src/app/[lang]/privacy/page.tsx`
- `src/app/[lang]/terms/page.tsx`
- `src/app/[lang]/samples/page.tsx`
- `src/app/[lang]/industries/[industry]/page.tsx`
- `src/app/[lang]/blog/page.tsx` + `[slug]/page.tsx`
- `src/content/blog/en/how-to-choose-food-packaging.mdx`
- `src/content/blog/bg/how-to-choose-food-packaging.mdx`
- `.env.example`
- `public/og-default.jpg`

**Modified files (key):**
- `next.config.ts` — headers + image config
- `src/app/layout.tsx` — resource hints, og:image
- `src/app/[lang]/layout.tsx` — `<html lang={lang}>`
- `src/app/sitemap.ts` — correct routes
- `src/app/api/contact/route.ts` — rate limiting, CSRF, comment on fallback email
- `src/translations/en.json` + `bg.json` — new keys only
- `src/components/ui/Chatbot.tsx` — mobile drawer, lead handoff CTA
- `src/components/layout/Footer.tsx` — EU badge

---

*Plan finalized: 2026-06-15. All decisions locked per user confirmation.*
