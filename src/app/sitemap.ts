import type { MetadataRoute } from 'next'
import { LANGS, VALID_SERVICES, VALID_CATEGORIES, VALID_INDUSTRIES } from '@/config/routes'
import { SITE_URL as BASE_URL } from '@/config/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  for (const lang of LANGS) {
    routes.push({ url: `${BASE_URL}/${lang}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 })
    routes.push({ url: `${BASE_URL}/${lang}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    routes.push({ url: `${BASE_URL}/${lang}/products`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    routes.push({ url: `${BASE_URL}/${lang}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 })
    routes.push({ url: `${BASE_URL}/${lang}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
    routes.push({ url: `${BASE_URL}/${lang}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 })
    routes.push({ url: `${BASE_URL}/${lang}/samples`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    routes.push({ url: `${BASE_URL}/${lang}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 })
    routes.push({ url: `${BASE_URL}/${lang}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 })
    routes.push({ url: `${BASE_URL}/${lang}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 })

    for (const service of VALID_SERVICES) {
      routes.push({
        url: `${BASE_URL}/${lang}/services/${service}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
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
