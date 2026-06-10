@AGENTS.md

# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (starts Next.js dev server at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed via npx. Chrome cache is at `~/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Tech Stack
- Framework: Next.js (app router, TypeScript)
- Styling: Tailwind CSS v4
- Animations: Framer Motion
- Deployment target: Vercel (via GitHub — see Deployment Workflow below)

## Deployment Workflow — MANDATORY
Every change must follow this exact sequence. No exceptions.

```
Local changes → git commit → git push origin develop → PR/merge to main → Vercel auto-deploys
```

### Branch rules
- `develop` — all active work happens here; push freely
- `main` — production only; never commit directly; only merge from develop

### Before every deploy
1. Stage and commit all changes with a descriptive message (what changed and why)
2. Push to `develop`: `git push origin develop`
3. Merge to `main` when ready for production: merge develop → main, then push main
4. Tag production releases: `git tag vX.Y.Z -m "vX.Y.Z — description"` then `git push origin vX.Y.Z`

### Commit message format
`type: short description of what changed`
Types: `feat` (new feature), `fix` (bug fix), `chore` (config/tooling), `style` (visual-only), `content` (copy/translations)

### Never
- Push directly to Vercel via `npx vercel --prod` (bypasses GitHub history)
- Commit directly to `main`
- Deploy without a corresponding GitHub commit

### Vercel connection
- GitHub repo: https://github.com/dani-aisystems/skat-print
- Production branch: `main` (auto-deploys on push)
- Preview deployments: `develop` branch

### Rollback
To revert to any previous version: `git revert <commit-sha>` or `git checkout tags/vX.Y.Z`

## Brand Assets
- Always check the `brand_assets/` folder before designing. It contains logos, brand guidelines, and skat-info.
- Logo (EN): `brand_assets/logo-en.png`
- Logo (BG): `brand_assets/logo-bg.png`
- Brand guidelines: `brand_assets/brand-guidelines.png`
- Business info: `brand_assets/skat-info.md`
- Media assets live in `public/assets/` (hero, about, portfolio, video, logos subfolders)
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color
- Delete temporary screenshots after each major build phase (or when instructed)
