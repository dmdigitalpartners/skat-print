# Phase H — Audit Report

**Date:** 2026-05-20  
**Build:** `npm run build` — 27 static pages, 0 TypeScript errors ✅  
**Staging URL:** Pending (Vercel CLI installed, `vercel login` required — see deploy instructions below)

---

## Issues Found & Fix Status

| # | Page / Component | Issue | Severity | Fixed |
|---|-----------------|-------|----------|-------|
| 1 | `/bg/` Hero | Eyebrow "Bulgaria — since 1995" hardcoded EN on BG page | Medium | ✅ Added `hero.eyebrow` key to both translation files; `Hero.tsx` uses `{t.hero.eyebrow}` |
| 2 | `/bg/contact` Map #2 | Hisarya map embed had placeholder coordinates | Medium | ✅ Updated to Hisarya town-center coords |
| 3 | `CTABanner` | Button secondary variant + override classes = styling conflict | Low | ✅ Replaced `<Button variant="secondary">` with direct `<Link>` and explicit white border/text classes |
| 4 | About page | ScrollReveal import added but JSX not wrapped | Low | ✅ Story paragraphs, factory image, philosophy + sustainability all wrapped in `<ScrollReveal>` |
| 5 | `LanguageToggle` | Container div lacked `aria-label` | Low | ✅ Added `aria-label="Switch language"` |
| 6 | `ContactForm` | Select element had no `aria-invalid` wiring | Low | ✅ Added `aria-invalid={errors.product_type ? 'true' : undefined}` |
| 7 | API route | `from`/`to` hardcoded — blocked Resend testing | Medium | ✅ `from` → `onboarding@resend.dev`; `to` → `process.env.RESEND_TO_EMAIL ?? 'office@skatoil.com'` |
| 8 | `.env.local` | File didn't exist | Medium | ✅ Created with `RESEND_API_KEY` and `RESEND_TO_EMAIL=daniel.aisystems@gmail.com` |
| 9 | `next.config.ts` | Turbopack workspace-root warning on every build | Low | ✅ Set `turbopack.root: path.resolve(__dirname)` |
| 10 | `src/app/layout.tsx` | No favicon defined — showing default Next.js favicon | Low | ✅ Generated 16×16, 32×32, 180×180 PNGs via `sips`; wired in `metadata.icons` |

---

## Deferred (Low priority, not blocking deploy)

| # | Issue | Notes |
|---|-------|-------|
| 1 | Contact map #2 Hisarya — town-center coords, not exact street address | Client should open maps.google.com → navigate to "Хисаря, ул. Йордан Йовков 8" → Share → Embed map → copy iframe `src` |
| 2 | Favicon is a resized JPEG-sourced PNG — not a crisp icon | Acceptable for staging; for production, generate from a vector source |

---

## Env Var Notes

| Variable | Value | Purpose |
|----------|-------|---------|
| `RESEND_API_KEY` | `re_cLUE68RV_...` (in `.env.local`) | Enables Resend email on dev/staging |
| `RESEND_TO_EMAIL` | `daniel.aisystems@gmail.com` | Test recipient — change to `office@skatoil.com` for production |

**When going live:**
1. Swap `RESEND_TO_EMAIL` → `office@skatoil.com`
2. Verify `skatoil.com` or `skatprint.bg` domain in Resend dashboard
3. Change `from` in `src/app/api/contact/route.ts` → `noreply@skatprint.bg` (or `noreply@skatoil.com`)

**On Vercel staging:** Add env vars in the Vercel project dashboard → Settings → Environment Variables, or pass via `vercel env add`.

---

## Staging Deploy Instructions

```bash
cd "/Users/daniel/Documents/Claude Code/SKAT Site/skat-print"
vercel login          # opens browser — log in with GitHub/email
vercel                # deploys to staging (NOT --prod)
```

After deploy:
- [ ] Test language toggle (`/bg/` ↔ `/en/`)
- [ ] Submit contact form — verify email arrives at `daniel.aisystems@gmail.com`
- [ ] Check all nav routes
- [ ] Verify favicons appear in browser tab

---

## Production Deploy Checklist (when ready)

- [ ] Update `RESEND_TO_EMAIL` → `office@skatoil.com`
- [ ] Update `from` in API route → `noreply@skatprint.bg`
- [ ] Verify domain in Resend
- [ ] Point DNS to Vercel (add custom domain in Vercel dashboard)
- [ ] Run `vercel --prod`
- [ ] Confirm sitemap at `https://skatprint.bg/sitemap.xml`
- [ ] Submit sitemap to Google Search Console
