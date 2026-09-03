import type { MetadataRoute } from 'next'
import { LANGS, VALID_CATEGORIES, VALID_INDUSTRIES } from '@/config/routes'
import { SITE_URL as BASE_URL } from '@/config/site'
import { FEATURES } from '@/config/features'
import { getPostSlugs } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  for (const lang of LANGS) {
    routes.push({ url: `${BASE_URL}/${lang}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 })
    routes.push({ url: `${BASE_URL}/${lang}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    // Note: /${lang}/products and /${lang}/services/${service} are
    // intentionally excluded — both are pure redirect() stubs (to
    // /${lang}#products and /${lang}/services#slug respectively) with no
    // unique content of their own, so they don't belong in a sitemap.
    routes.push({ url: `${BASE_URL}/${lang}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 })
    routes.push({ url: `${BASE_URL}/${lang}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
    routes.push({ url: `${BASE_URL}/${lang}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 })
    // privacy/terms are deliberately omitted: both set robots: { index: false }
    // in their own metadata, so listing them here would contradict that.

    // Blog is withheld from production — see src/config/features.ts. The
    // routes still 404 with noindex, but omitting them here too means the
    // sitemap never even points a crawler at them.
    if (FEATURES.blog) {
      routes.push({ url: `${BASE_URL}/${lang}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })

      for (const slug of getPostSlugs(lang)) {
        routes.push({
          url: `${BASE_URL}/${lang}/blog/${slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }

    for (const product of VALID_CATEGORIES) {
      routes.push({
        url: `${BASE_URL}/${lang}/products/${product}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }

    for (const industry of VALID_INDUSTRIES) {
      routes.push({
        url: `${BASE_URL}/${lang}/industries/${industry}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
      })
    }
  }

  return routes
}
