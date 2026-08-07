// Single source of truth for the production origin. Used by metadata,
// robots.ts, sitemap.ts and JsonLd so the domain only needs to change here
// once the production domain is connected.
export const SITE_URL = 'https://skatprint.bg'

// Hostname portion (no protocol) — used where only the host is needed,
// e.g. comparing against the request Host header in middleware.
export const SITE_HOST = 'skatprint.bg'
