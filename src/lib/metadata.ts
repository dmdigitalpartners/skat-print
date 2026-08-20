import type { Metadata } from 'next'

interface BuildPageMetadataArgs {
  title: string
  description: string
  /** Route path after the /[lang] segment, e.g. '', '/services', `/products/${category}`. */
  path: string
  lang: string
  noIndex?: boolean
}

/**
 * Shared per-page metadata builder — canonical/hreflang plus Open Graph/Twitter.
 *
 * Next.js only fills og:title/og:description from a *truthy* openGraph.title/
 * description; the site-wide default in src/app/layout.tsx never set them, so
 * every page rendered empty og:title/og:description tags (Facebook/LinkedIn/
 * WhatsApp previews read those, not twitter:*, which happened to work via a
 * separate fallback to the plain title/description). This builder sets both
 * explicitly per page so link previews render correctly everywhere.
 */
export function buildPageMetadata({ title, description, path, lang, noIndex }: BuildPageMetadataArgs): Metadata {
  const canonical = `/${lang}${path}`
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: `/en${path}`,
        bg: `/bg${path}`,
        'x-default': `/bg${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      locale: lang === 'bg' ? 'bg_BG' : 'en_US',
    },
    twitter: {
      title,
      description,
    },
    ...(noIndex ? { robots: { index: false } } : {}),
  }
}
