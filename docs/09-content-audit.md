# Content Audit — Skat Print Website

**Date:** 2026-07-12
**Scope:** Every user-facing string on the site (`dm-web-design.vercel.app`, planned production domain `skatprint.bg`), both `bg` and `en` locales — 12 page-content units, 2 system pages, and 4 cross-cutting shared components.

**Sources used, in priority order:**
1. `docs/02-existing-site-audit.md` — internal audit of the company's real legacy site.
2. Live facts gathered directly from **skatoil.com** (the company's real, currently-live site) during this audit — company terminology, legal registration number, addresses, certifications (absence of).
3. General web/business-directory research on "Skat Oil" / "Скат Ойл" ЕООД.
4. `docs/progress-snapshot.md`, `docs/08-audit-report.md` — build-process logs, used only to establish provenance of specific claims (e.g., whether a stat was sourced or invented mid-build).

**Caveat:** `CLAUDE.md` references `brand_assets/skat-info.md` as the richest company-profile document, but that folder is gitignored/local-only and was not present in this workspace copy. Per the client's direction, this audit proceeds without it. Anything that document might have clarified is marked **unverifiable — flag for client** below rather than guessed at.

**A note on how "Terminology" findings are counted:** the single biggest issue in this audit — Bulgarian copy using "гофрирана" instead of the company's actual trade term "велпапе" — occurs on nearly every Bulgarian page. Rather than log it as a dozen-plus duplicate Critical findings, it is logged **once**, at Critical severity, in the Terminology Glossary below, with a full location list. Per-page sections note only when a page has a terminology issue *beyond* this systemic one.

---

## Executive Summary — Critical & High Findings

| # | Issue | Location | Priority |
|---|---|---|---|
| 1 | Company legal registration number (EIK) is wrong | `bg.json`/`en.json` footer + `contact_page` (line 311, 313) | **Critical** |
| 2 | Sitewide terminology: "гофрирана" used instead of the company's actual term "велпапе"/"микровелпапе" | 61 occurrences across `bg.json`, `Chatbot.tsx`, `JsonLd.tsx`, `portfolio-data.ts` | **Critical** |
| 3 | Chatbot lists a phone number that matches no other source on the site | `Chatbot.tsx:876,880` — `+359 42 600 500` | **Critical** |
| 4 | Chatbot claims "meets EU packaging standards" — no certification is named or documented anywhere | `Chatbot.tsx:321,323` | **Critical** |
| 5 | Contact email is inconsistent: `office@skatoil.com` sitewide vs. `office@skat-print.com` in the chatbot | `Chatbot.tsx:254,256,883,889` vs. `footer.emails.main`, `JsonLd.tsx:31`, `api/contact/route.ts:35` | High |
| 6 | Chatbot states specific business hours ("Mon–Fri, 9am–6pm Sofia time") found nowhere else and unconfirmed by any source | `Chatbot.tsx:254,256` | High |
| 7 | Four statistics have no supporting source anywhere: "100+ Active Clients," "3,500+ Orders Delivered," "37 Production Specialists," "2021 — 29% Growth, revenue €1.87M" | `trust.stat_clients_number`, `about_stats.projects`, `about_stats.team`, `about_page.milestones[4]` (both locale files) | High |
| 8 | Contact form validation errors render in English even on the Bulgarian page (no custom Zod messages) | `src/components/sections/ContactForm.tsx:10-17` | High |
| 9 | 404 page is hardcoded English-only and always links back to `/bg`, even from an `/en/...` URL | `src/app/not-found.tsx` | High |

*~~10. Portfolio missing meta~~ — retracted. `/portfolio` is a redirect-only stub to `/products` (no independent content), same pattern as the services sub-routes; the real gallery lives inside `/products/[category]`, which already has correct meta. See the Portfolio section below.*

Full reasoning, sourcing, and every remaining Medium/Low finding follow below, organized by page and then by cross-cutting component.

---

## Terminology Glossary

**Headline finding (Critical, sitewide):** the real company's own site, skatoil.com, self-identifies with the header line *"ВЕЛПАПЕ – Каширани опаковки, кутии, кашони, стелажи, стопери. Производство велпапе, микровелпапе"* — the terms **велпапе** (corrugated board) and **микровелпапе** (micro-corrugated board) are the company's actual trade vocabulary, used with zero exceptions on the real site. The new site instead uses the generic/calqued term **"гофрирана/гофриран/гофрирани"** — confirmed **61 occurrences**: 57 in `bg.json`, 3 in `Chatbot.tsx`, 1 in `JsonLd.tsx`, plus several more in `portfolio-data.ts`'s `altBg` fields (e.g. "Гофриран стелаж," "Гофрирана тава за плодове"). **Zero** occurrences of "велпапе" or "микровелпапе" exist anywhere in the codebase (reproducible: `grep -c "гофрир" -r src` vs `grep -c "велпапе" -r src`).

This is exactly the pattern the client's own brief called out by name — using "гофрирана плоча" where the company says "велпапе" — and it affects nearly every Bulgarian-language page: Home (`hero.subheadline`, `hero.mobile_desc`, `services_section`, `video_section`, `products_section`), all 5 product detail pages, all 5 service detail entries, FAQ, Differentiators, Footer tagline, About (story, capability cards), the Chatbot, and the JSON-LD structured data.

**Recommendation:** replace every Bulgarian-language instance of "гофрирана/гофриран/гофрирани" with "велпапе" (for standard corrugated board) or "микровелпапе" (for micro-corrugated, i.e. the ~1.5mm E-wave material) to match the company's real, established vocabulary. This does not require touching `en.json` — English-language copy correctly uses "corrugated," which is the accurate English gloss.

**Second terminology gap (Medium, BG only):** the real company distinguishes **каширане** (paper lamination bonded onto board, up to 103cm width) from **ламиниране**/foil lamination as two separate processes. The new site's `bg.json` collapses both into "ламиниране" throughout (`services_section.items[2]`, `service_detail.laminating-finishing`, `service_detail.covering-coating`), which is imprecise for a trade audience that knows the distinction.
- *Recommend:* use "каширане" specifically for the paper-onto-board bonding process, reserving "ламиниране" for foil/film finishing, matching `docs/02-existing-site-audit.md`'s own terminology.

**One confirmed-correct, worth flagging positively:** `docs/02-existing-site-audit.md` records the company's own phrase for stands/stoppers as *"мълчаливия продавач"* ("the silent seller"). The new site's `product_detail.pos-displays.body` and `service_detail.pos-displays.body` both correctly use "мълчаливите продавачи" (the silent sellers) — this is an authentic, accurate use of the company's real voice and should be preserved as a model for how the rest of the site should read.

---

## Numeric & Statistical Claims Register

| Claim | Location (en.json / bg.json keys) | Status | Source / reasoning |
|---|---|---|---|
| Founded 1995 | `hero.eyebrow_year`, `footer.founded`, `about_page.founding`, `about_page.milestones[0]`, `JsonLd.tsx:14`, `Chatbot.tsx` (about intent) | **Confirmed correct** | Matches `docs/02-existing-site-audit.md` and skatoil.com directly |
| "30+ Years in Business" | `trust.stat_years_*`, `differentiators.items[2]`, `about_stats.years` | **Confirmed correct** | 2026 − 1995 = 31 years; "30+" holds |
| "5 Product Categories" | `trust.stat_categories_*` | **Confirmed correct** | Matches the 5 actual `product_detail` categories |
| Lead time "10–15 working days" | `faq.sidebar.detail_lead`, `about_stats.leadtime_display`, `Chatbot.tsx` (delivery, how_it_works intents) | **Confirmed correct** | Internally consistent across every mention |
| MOQ "500 units," "typically 500 units upward" | `faq.items[0]`, `faq.sidebar.detail_moq` | **Confirmed correct (but see inconsistency below)** | Internally consistent within `faq`; contradicted by chatbot, see next row |
| Chatbot: minimum order "500 to 1,000 pieces" for "standard folding boxes" | `Chatbot.tsx:194-197` | **Confirmed inconsistent (Medium)** | FAQ frames 500 as a floor ("upward"); chatbot frames 500–1,000 as a range, and introduces a product term ("folding boxes") not used anywhere else on the site |
| Press specs: Roland 52×74cm, Heidelberg 71×102cm | `services_section`, `faq.items[3]`, `service_detail.offset-printing` | **Confirmed correct** | Matches `docs/02-existing-site-audit.md` and skatoil.com |
| Board thicknesses N/E/B-wave 1mm/1.5mm/3mm, five-layer | `service_detail.corrugated-board`, `product_detail.cosmetics-packaging.specs` | **Confirmed correct** | Matches `docs/02-existing-site-audit.md` |
| Covering/lamination width up to 103cm | `service_detail.covering-coating` | **Confirmed correct** | Matches `docs/02-existing-site-audit.md` |
| "100% Recyclable Materials" | `differentiators.items[3]`, `faq.items[5]`, product detail bodies | **Confirmed correct** | Matches both `docs/02-existing-site-audit.md` and skatoil.com's own sustainability claims |
| EIK 825131194 / VAT BG825131194 | `footer.eik`, `footer.vat` (both locale files, line 311/313) | **Confirmed WRONG (Critical)** | Real company registration is **EIK 100110** per skatoil.com's own contact page and independent business-directory listings |
| "100+ Active Clients" | `trust.stat_clients_number` | **Unverifiable — flag for client** | No source confirms or denies this figure |
| "3,500+ Orders Delivered" | `about_stats.projects` | **Unverifiable — flag for client** | `docs/progress-snapshot.md` shows this was added as a "locked decision" mid-build with no cited source |
| "37 Production Specialists" | `about_stats.team` | **Unverifiable — flag for client** | Same as above |
| "2021 — 29% Growth — Revenue reaches €1.87M" | `about_page.milestones[4]` | **Unverifiable — flag for client** | Same as above; a specific revenue figure is a notably risky claim to publish unsourced |
| "2000 — First Export," "2010 — Roland Press," "2015 — Vertical Integration" | `about_page.milestones[1-3]` | **Unverifiable — flag for client** | Plausible and consistent with the company's known equipment/history, but no source confirms the specific years |
| Chatbot: `+359 42 600 500` | `Chatbot.tsx:876` | **Confirmed WRONG or unverifiable (Critical)** | Matches neither of the two real numbers used everywhere else (+359 888 35 15 53 Trud, +359 887 46 10 28 Hisarya); format (042 landline) doesn't match the mobile-number pattern used elsewhere |
| Chatbot: "Mon–Fri, 9am–6pm Sofia time" | `Chatbot.tsx:254,256` | **Unverifiable — flag for client** | No other source states business hours |
| "meets EU packaging standards" | `Chatbot.tsx:321,323` | **Confirmed wrong by absence (Critical)** | `docs/02-existing-site-audit.md` explicitly notes no ISO/FSC certification was found; no certification is named anywhere in the codebase |
| Copyright range "2009–2026" | `footer.copyright` | **Ambiguous (Low)** | Unexplained relative to the 1995 founding date; could read as contradicting "30 years" claims to an attentive customer |

---

## Per-Page Audit

### 1. Home
*Sources: `meta.home`, `hero`, `trust`, `services_section`, `video_section`, `products_section`, `differentiators`, `cta_banner`*

**Accuracy:** Correct — founding year, press names, product category count, client names, recyclability claim (see registers above). **Incorrect/unverifiable** — "100+ Active Clients" (`trust.stat_clients_number`) is unsupported (High, see register). **Missing** — no explicit statement of industries served as a standalone list; industries are only implied through product category names (Content Improvement opportunity, Medium — see "Content Improvements" below).

**Terminology:** BG copy uses "гофрирани опаковки" (`hero.mobile_desc`), "гофрирана плоча" (`services_section.items[1].description`, `video_section.subheading`) — part of the sitewide Critical finding above, not a separate issue.

**Content Improvements:** `hero.eyebrow_industry` reads "Опаковки & Печат" — an ampersand inside otherwise natural Bulgarian prose reads as an anglicism; recommend "Опаковки и печат" (Low). `trust.client_sentence` lists six brands (Coca-Cola, LIDL, Johnnie Walker, Stella Artois, Finlandia, Jack Daniel's) — cross-reference with About page below, where the same list drops one name (Medium, logged once under About).

---

### 2. Products (index)
*Sources: `products_page`, `meta.products`*

**Accuracy:** Correct and consistent with the 5 real product lines. No incorrect or missing information found at the index level.

**Terminology:** BG subheading uses "по-специализирани" language cleanly; no terminology issue beyond the sitewide гофрирана/велпапе pattern (not present on this specific page — index copy is short and doesn't use the term).

**Content Improvements:** None beyond sitewide recommendations.

---

### 3–7. Products / {POS Displays, Food Packaging, Wine & Spirits, Cosmetics & Perfumery, Custom & Gift}
*Source: `product_detail.<category>` — also supplies each page's `<title>`/meta description (confirmed: these pages do NOT read from `meta.products`, they synthesize meta from `product_detail.<category>.heading`/`.intro`)*

**Accuracy:** Materials, finishes, and process descriptions (die-cutting, embossing, foil finishes, moisture-resistant variants, BiB) all match `docs/02-existing-site-audit.md`'s documented product lines. No factual errors found in the specs lists themselves.

**Terminology:** Every one of the 5 categories' `body` and `specs` text uses "гофриран/а/и" repeatedly (part of the sitewide Critical finding). The POS Displays category correctly uses "мълчаливите продавачи" (see Glossary — a positive example).

**Content Improvements:**
- **Duplicate/drifting content (Medium):** `product_detail.<category>` and `service_detail.<category>` (5 of the 5 categories also appear a second time under `service_detail`, keyed slightly differently — `alcohol-packaging` in `product_detail` vs `wine-packaging` in `service_detail`) contain near-identical body copy that has already started to drift: `product_detail.pos-displays.body` says "...offset print quality we apply to **all our packaging**" and "...delivered ready to deploy," while `service_detail.pos-displays.body` says "...offset print quality we apply to **luxury packaging**" and "...advertising campaign specification." A customer who reads both the Products and Services pages could notice the inconsistent framing. Recommend consolidating to one canonical copy block per category, referenced from both places, rather than maintaining two independently-editable copies.
- **Key-naming inconsistency (Low):** `product_detail` uses the key `alcohol-packaging` while `service_detail` uses `wine-packaging` for the same category — purely a code-maintainability note, invisible to the end user, but worth fixing to prevent future content drift.

---

### 8. Services (index + 5 anchor sections)
*Sources: `services_page`, `services_section` (Home teaser), `service_detail` — Note: `/services/[service]` routes are pure `redirect()` stubs to `/services#slug` with no independent copy of their own; audited here, not as separate pages.*

**Accuracy:** Manufacturing capability descriptions (offset printing, corrugated board production, laminating/finishing, die-cutting, covering/coating) match `docs/02-existing-site-audit.md`'s documented processes and equipment. No factual errors.

**Terminology:** Same sitewide гофрирана/велпапе issue applies throughout; additionally, the каширане/ламиниране conflation noted in the Glossary applies specifically to `service_detail.laminating-finishing` and `service_detail.covering-coating`.

**Content Improvements:** None beyond the terminology fixes above.

**Technical note (Low):** `src/app/sitemap.ts` submits all 5 `/services/[service]` redirect-stub URLs to search engines even though they carry no unique content and immediately redirect. Not incorrect, but unnecessary — recommend excluding redirect-only routes from the sitemap.

---

### 9. About
*Sources: `about_page`, `about_stats`, `meta.about`*

**Accuracy:** Founding story, philosophy, and capability claims are consistent with `docs/02-existing-site-audit.md`'s recorded company philosophy ("ecologically friendly family business that evolves alongside our clients and the market" ≈ `about_page.story`'s "ecologically responsible operation that evolves alongside our clients and the market" — a faithful paraphrase). **Incorrect/unverifiable:** the `milestones` timeline's 2021 revenue/growth figure and the `about_stats` team/orders numbers (see Numeric Claims Register — High).

**Missing/inconsistent (Medium):** `about_page.story_brands` lists only **five** brands — `["Coca-Cola", "Johnnie Walker", "LIDL", "Stella Artois", "Finlandia"]` — while the Home page's `trust.client_sentence` lists **six**, including Jack Daniel's. Since `story_brands_more` already says "and many more," dropping Jack Daniel's here isn't strictly false, but it's an inconsistency a careful reader could notice between two pages making the same kind of claim. Recommend syncing both lists.

**Terminology:** `about_page.capability_cards[0].copy` says "от гофрираната плоча до готовата опаковка" — part of the sitewide issue.

**Content Improvements:** `timeline_heading`: "Three Decades of Progress"/"Три десетилетия напред" is accurate (31 years ≈ three decades) but sits awkwardly next to individual milestones that are themselves unverified (see register) — recommend resolving the numeric-claims register items before publishing this section as-is.

---

### 10. Portfolio
*Correction from the original research pass: `src/app/[lang]/portfolio/page.tsx` is a pure `redirect('/${lang}/products')` stub with no rendered content of its own — the same pattern as the 5 `/services/[service]` routes. There is no independent "Portfolio" page. The `PortfolioGrid` component and `src/lib/portfolio-data.ts` are actually rendered **inside each `/products/[category]` page**, which already reads its meta title/description from `product_detail.<category>` (see Products section above) — so no separate meta entry is needed. The earlier findings H6 ("Portfolio missing meta") and M7 ("Portfolio missing from sitemap") in the original executive summary were based on incomplete research and do not apply; both are retracted below. `/portfolio` is a legacy/bookmark redirect, correctly excluded from `sitemap.ts` for the same reason the 5 services stubs are borderline candidates for exclusion.*

**Accuracy:** Gallery alt-text (rendered within the product category pages) accurately matches the 5 official product categories and image content.

**Terminology:** BG `altBg` fields in `src/lib/portfolio-data.ts` repeated "гофриран/а" (e.g., "Гофриран стелаж," "Гофрирана тава за плодове," "Гофрирана опаковка за алкохол") — part of the sitewide Critical finding, now fixed alongside the rest of the site (see Implementation Log).

---

### 11. FAQ
*Sources: `faq`, `meta.faq`*

**Accuracy:** MOQ, lead time, printing method, materials, and shipping answers are internally consistent and consistent with the rest of the site (see Numeric Claims Register). The claim that offset gives "significantly sharper results than flexographic printing on corrugated board" is a reasonable, defensible industry claim and matches the equipment described elsewhere (Roland/Heidelberg offset presses) — no issue.

**Terminology:** `faq.items[5].answer` and `faq.items[3].answer` use "гофрирана плоча"/"гофрирана"; part of the sitewide issue.

**Content Improvements:** None beyond terminology.

---

### 12. Contact
*Sources: `contact_page` (incl. `eik`/`vat` — see register), `ContactForm.tsx`, `src/app/api/contact/route.ts`, `meta.contact`*

**Accuracy:** Addresses and phone numbers for both locations (Trud/Plovdiv, Hisarya) match skatoil.com's published contact details exactly — confirmed correct. **Incorrect (Critical):** the EIK/VAT numbers are wrong (see register — this is the page where the wrong number will actually be displayed to a customer needing it for an invoice or contract).

**Inconsistent branding (Medium):** `contact_page.locations[1].map_title` reads **"Skat Oil, Hisarya Production Base"** (bg: "Скат Ойл, Производствена база Хисаря") while the Trud location's `map_title` reads **"Skat Print, Village of Trud"** (bg: "Скат Принт, с. Труд") — and the `footer.locations` array uses "Skat Print" consistently for both. Using "Skat Oil" only for the Hisarya map label, when every other customer-facing mention uses "Skat Print," risks a customer thinking these are two different companies when checking a map link. Recommend using "Skat Print" consistently for both `map_title` values, reserving "Skat Oil"/ЕООД strictly for the legal-entity line near the EIK/VAT.

**Forms (High):** `ContactForm.tsx`'s Zod schema (`z.string().min(2)`, `.min(1)`, `.min(5)`) defines no custom error messages. React Hook Form + Zod will therefore render its **default English validation messages** even when the form is displayed on `/bg/contact` (e.g., an English "String must contain at least X character(s)" appearing under a Bulgarian-labeled field). This breaks the localized experience for Bulgarian visitors filling out the form. Recommend adding explicit bg/en error messages to the schema, sourced from the translation files.

**Content Improvements:** Form copy itself (labels, placeholders, submit/success/error states) is clear, appropriately simple, and consistent between locales — no changes needed there beyond the validation-message fix above.

---

### 13. 404 / Not Found
*Source: `src/app/not-found.tsx`*

**Accuracy/Missing (High):** This page is fully hardcoded in English ("Page not found," "The page you're looking for doesn't exist or has been moved.," "← Back to Home") with no Bulgarian variant, and its link unconditionally points to `/bg` regardless of whether the visitor was browsing in `/en/...` or `/bg/...`. A Bulgarian visitor who mistypes a URL sees English text; an English visitor who hits a 404 gets redirected back into the Bulgarian site rather than staying in English. Recommend making this page locale-aware, using the translation files like every other page.

---

## Cross-Cutting Shared Components

### Navbar (`nav`)
No issues found — labels are short, accurate, and consistent between locales.

### Footer (`footer`)
- **Critical:** wrong EIK/VAT (see register).
- **Low:** `footer.copyright` for EN reads "© Skat Oil Ltd. 2009–2026," while `footer.legal_entity` on the same page reads "Skat Oil EOOD" — two different English glosses of the same legal form ("Ltd." vs "EOOD") appearing in different fields of the same footer. Recommend picking one consistent English rendering (EOOD is the more precise/accurate legal-form abbreviation; "Ltd." is an approximation).
- **Low:** the "2009–2026" copyright start year is unexplained against the "since 1995" founding claim used everywhere else on the same page (`footer.founded`: "Est. 1995"). Likely reflects when the website/domain was first put online rather than company founding, but as written it could read as an inconsistency to an attentive visitor. Recommend a footnote or simply using the founding year for consistency.

### Contact Form (`ContactForm.tsx`, `contact_page.form`)
See Contact page section above (High — English-only validation errors on the Bulgarian page).

### Chatbot (`Chatbot.tsx` — all UI chrome + all 17 intents reviewed)
- **Critical:** phone number `+359 42 600 500` (callback-success card) matches no other source on the site.
- **Critical:** "meets EU packaging standards" claim (materials intent) is unsubstantiated.
- **High:** email `office@skat-print.com` (contact intent + callback-success card) contradicts the sitewide `office@skatoil.com`.
- **High:** business hours "Mon–Fri, 9am–6pm Sofia time" (contact intent) appear nowhere else and are unconfirmed.
- **Medium:** minimum-order intent states "500 to 1,000 pieces" for "standard folding boxes" — a product term used nowhere else on the site, and a range that doesn't match the FAQ's "500 units upward" framing.
- **Medium:** the lead-qualification flow's product-type chips (`'Food & Beverage', 'Cosmetics', 'Retail & POS', 'Alcohol', 'Other'`) don't match the site's actual 5 product category names (POS Displays & Shelving, Food Packaging, Wine & Spirits Packaging, Cosmetics & Perfumery, Custom & Gift Packaging) — "Custom & Gift Packaging" has no equivalent chip (folded into generic "Other"), and naming diverges elsewhere too. Recommend aligning chip labels to the real category names so a lead's stated interest maps cleanly to a real product line.
- **Low:** the chatbot consistently refers to the company as **"SKAT Print"** (all capitals) in its response text, while every other part of the site (nav, footer, headings) uses **"Skat Print"** (title case). Recommend matching the site's established capitalization.
- **Low:** the `location` intent's trigger list includes `'stara zagora'`/`'стара загора'` alongside Trud/Plovdiv/Hisarya — Stara Zagora is not mentioned as a company location anywhere else in any source. This may be a leftover from a template or a genuine undocumented location; recommend confirming with the client and removing the trigger if it's not real.
- **Low:** shipping_countries intent says the company ships "across Bulgaria and export to EU countries **and beyond**" — "and beyond" implies non-EU/global reach not claimed anywhere else on the site (FAQ and Hero both say "across Europe"). Minor overreach; recommend matching the more conservative sitewide claim unless the client confirms broader reach.
- **Terminology:** `materials` intent (both locales) repeats "гофриран картон"/"corrugated cardboard" — part of the sitewide Critical finding.

### Meta Titles & Descriptions / SEO (`meta.*`, `JsonLd.tsx`, `src/app/layout.tsx`, `sitemap.ts`)
- **High:** Portfolio page has no dedicated meta entry (see Portfolio section above).
- **Medium:** Portfolio missing from `sitemap.ts` (see Portfolio section above).
- **Medium:** `JsonLd.tsx` and `sitemap.ts` both hardcode `https://skatprint.bg` as the canonical/base URL. Confirm this domain is actually live and pointed at the production deployment before launch — if it isn't yet, structured data and the sitemap will reference a URL that doesn't resolve.
- **Medium:** `JsonLd.tsx`'s bilingual `description` field independently reproduces the гофрирани/гофрирана terminology issue (bg: "Производство на гофрирани опаковки...") — this is outside the translation JSON entirely and must be fixed separately, alongside `bg.json`.
- **Low:** `JsonLd.tsx`'s address array gives `addressRegion: 'Plovdiv'` for the Trud location but omits `addressRegion` entirely for the Hisarya location — a minor structured-data completeness gap, not customer-visible but worth fixing for consistency.
- **Low:** `JsonLd.tsx` sets `priceRange: '$$'` — an arbitrary, unsourced pricing-tier signal not stated or implied anywhere else on the site. Recommend removing unless the client confirms a specific positioning.
- **Low:** all 5 `/services/[service]` redirect-stub routes are included in `sitemap.ts` despite carrying no unique content (see Services section above).

---

## Content Improvements — Sitewide Positioning Opportunities

Beyond the specific accuracy/terminology fixes above, three opportunities apply across the whole site:

1. **No dedicated "Industries Served" section exists anywhere.** Industries (food, cosmetics, beverage/alcohol, retail) are only implied through the 5 product category names. A short, explicit "Who We Work With" section — naming the actual industries and pairing them with the real client list — would make the site's positioning clearer to a new visitor without requiring them to infer it from the product catalog. (Medium — positioning opportunity, not an accuracy issue.)
2. **No explicit guarantee/warranty language exists anywhere** on the site (confirmed via sitewide search for "guarantee"/"гаранция" — zero results). The closest analog is the `differentiators` section (quality control, vertical integration, reliability, materials). If the company does offer any form of quality guarantee or reorder/reprint policy, making it explicit would build trust; if not, this is simply worth noting as a deliberate choice rather than an oversight. (Low — flag for client discussion.)
3. **Technical language throughout `product_detail`/`service_detail` bodies is written at a fairly high trade-fluency level** (flute names, wave thicknesses, structural terminology) without a plain-language summary line for a first-time, non-technical buyer. Consider a one-sentence, benefits-first opener per category (e.g., "Sturdy, good-looking boxes that survive shipping and look right on shelf" before the technical detail) so both technical procurement buyers and non-technical brand managers get what they need. (Medium — clarity/positioning, not accuracy.)

---

## Consolidated Master Issue List

| ID | Location | Priority | Category | Summary |
|---|---|---|---|---|
| C1 | `footer.eik`/`vat` (en+bg, L311,313) | Critical | Accuracy | Wrong company registration number (825131194 vs. real 100110) |
| C2 | `bg.json` (57×), `Chatbot.tsx` (3×), `JsonLd.tsx` (1×), `portfolio-data.ts` | Critical | Terminology | "гофрирана" used instead of company's real term "велпапе"/"микровелпапе" |
| C3 | `Chatbot.tsx:876,880` | Critical | Accuracy | Unverified/wrong phone number `+359 42 600 500` |
| C4 | `Chatbot.tsx:321,323` | Critical | Accuracy | Unsubstantiated "meets EU packaging standards" claim |
| H1 | `Chatbot.tsx:254,256,883,889` | High | Accuracy | Email `office@skat-print.com` contradicts sitewide `office@skatoil.com` |
| H2 | `Chatbot.tsx:254,256` | High | Accuracy | Unverified business hours claim |
| H3 | `trust.stat_clients_number`, `about_stats.projects`/`.team`, `about_page.milestones[4]` | High | Accuracy | Four unsourced statistics (100+ clients, 3,500+ orders, 37 specialists, €1.87M/29% growth) |
| H4 | `ContactForm.tsx:10-17` | High | Content/UX | Form validation errors render in English on the Bulgarian page |
| H5 | `src/app/not-found.tsx` | High | Content/UX | 404 page hardcoded English-only, locale-blind link |
| ~~H6~~ | ~~Portfolio~~ | — | — | *Retracted — `/portfolio` is a redirect stub, not an independent page; no meta gap exists* |
| M1 | `about_page.story_brands` vs `trust.client_sentence` | Medium | Accuracy | Brand list inconsistent between Home and About (Jack Daniel's dropped) |
| M2 | `Chatbot.tsx:194-197` vs `faq.items[0]` | Medium | Accuracy | MOQ framing inconsistent (500–1,000 vs. 500-and-up) |
| M3 | `Chatbot.tsx` lead-flow chips | Medium | Terminology | Product-type chips don't match real category names |
| M4 | `contact_page.locations[1].map_title` | Medium | Terminology | "Skat Oil" used for Hisarya map label vs. "Skat Print" elsewhere |
| M5 | `service_detail.laminating-finishing`/`.covering-coating`, `services_section.items[2]` | Medium | Terminology | "ламиниране" used for both каширане and foil lamination, conflating two distinct processes |
| M6 | `product_detail.*` vs `service_detail.*` | Medium | Content | Near-duplicate category copy already drifting out of sync |
| ~~M7~~ | ~~`src/app/sitemap.ts`~~ | — | — | *Retracted — Portfolio is a redirect, correctly excluded from the sitemap* |
| M8 | `JsonLd.tsx`, `sitemap.ts` | Medium | Operational | Both hardcode `skatprint.bg`; confirm domain is live before launch |
| M9 | `JsonLd.tsx` description | Medium | Terminology | Independently repeats the гофрирана/велпапе issue outside translation files |
| M10 | Sitewide | Medium | Content | No explicit "Industries Served" section |
| M11 | `product_detail`/`service_detail` bodies | Medium | Content | Highly technical language with no plain-language opener for non-trade buyers |
| L1 | `hero.eyebrow_industry` (bg) | Low | Style | "&" reads as anglicism in Bulgarian prose |
| L2 | `footer.copyright` vs `footer.legal_entity` (en) | Low | Consistency | "Skat Oil Ltd." vs "Skat Oil EOOD" — two English glosses of the same entity |
| L3 | `footer.copyright` | Low | Clarity | "2009–2026" range unexplained against 1995 founding claim |
| L4 | `Chatbot.tsx` response text | Low | Style | "SKAT Print" (all-caps) vs. sitewide "Skat Print" |
| L5 | `Chatbot.tsx` location intent triggers | Low | Accuracy | "Stara Zagora" trigger with no corresponding documented location |
| L6 | `Chatbot.tsx` shipping_countries intent | Low | Accuracy | "and beyond" overstates reach vs. sitewide "across Europe" |
| L7 | `JsonLd.tsx` address array | Low | Completeness | Hisarya entry missing `addressRegion` |
| L8 | `JsonLd.tsx` | Low | Accuracy | Unsourced `priceRange: '$$'` |
| L9 | `sitemap.ts` | Low | SEO | Redirect-only service routes included in sitemap |
| L10 | `product_detail`/`service_detail` keys | Low | Consistency | `alcohol-packaging` vs `wine-packaging` key naming |
| — | Sitewide | Low | Content | No guarantee/warranty language exists — confirm this is deliberate |

---

## Appendix

### A. Translation-key → route/component traceability

| Namespace | Consumed by |
|---|---|
| `meta.*` | `generateMetadata()` in each `page.tsx` (except Portfolio and Products/[category], see notes above) |
| `nav`, `footer` | `Navbar.tsx`, `Footer.tsx` |
| `hero`, `trust`, `services_section`, `video_section`, `products_section`, `differentiators`, `cta_banner` | Home page sections |
| `products_page`, `product_detail.*` | Products index + `/products/[category]` |
| `services_page`, `service_detail.*` | Services index (anchor sections) |
| `faq` | FAQ page |
| `about_page`, `about_stats` | About page |
| `contact_page` | Contact page + `ContactForm.tsx` |
| `chatbot` | Chatbot UI chrome only — response content is hardcoded in `Chatbot.tsx`, not translation-driven |
| — | `JsonLd.tsx`, `not-found.tsx`, `portfolio-data.ts` bypass translations entirely (see body of report) |

### B. Open questions for the client

1. What is the correct EIK/VAT registration number? (Site currently shows 825131194; skatoil.com and directories show 100110 — confirm which is current/correct.)
2. Are "100+ Active Clients," "3,500+ Orders Delivered," "37 Production Specialists," and the 2021 "€1.87M / 29% growth" milestone real, approved figures, or placeholders that need replacing before launch?
3. Is `+359 42 600 500` a real company number that should be added to the site's contact info everywhere, or an error to remove from the chatbot?
4. Does the company hold any certification that would support "meets EU packaging standards," or should this claim be softened/removed?
5. Is "Stara Zagora" a real, undocumented company location?
6. Is `skatprint.bg` registered and pointed at this deployment yet?

### C. Operational note (not a content-copy priority item, included for completeness)

`docs/08-audit-report.md` records `RESEND_TO_EMAIL` in `.env.local` currently pointed at a personal Gmail address rather than `office@skatoil.com`, and `src/app/api/contact/route.ts` sends from Resend's sandbox address (`onboarding@resend.dev`) rather than a verified company domain. Neither is a copy/content issue, but both affect whether the site's own promise — `contact_page.form.success_body`: "We'll follow up within one business day" — is actually deliverable in production. Worth resolving before launch alongside the content fixes above.
