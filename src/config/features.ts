// Central switch for features built and content-complete, but withheld from
// production for business reasons. Flip a flag to `true` — and change
// nothing else — to bring the feature back.
export const FEATURES = {
  /**
   * Blog. Content, components and routes are all still in the repo; only
   * discovery and public access are disabled. Re-enabling restores:
   *  - the footer nav link (src/components/layout/Footer.tsx)
   *  - the /[lang]/blog and /[lang]/blog/[slug] routes and their sitemap
   *    entries (src/app/sitemap.ts)
   * See src/app/[lang]/blog/page.tsx and src/app/[lang]/blog/[slug]/page.tsx
   * for how the flag gates each route.
   */
  blog: false,
} as const
