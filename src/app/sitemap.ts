import type { MetadataRoute } from 'next'

const BASE_URL = 'https://skatprint.bg'

const LANGS = ['en', 'bg']
const SERVICES = [
  'offset-printing',
  'corrugated-board',
  'laminating-finishing',
  'die-cutting',
  'covering-coating',
]
const PRODUCTS = [
  'pos-displays',
  'food-packaging',
  'alcohol-packaging',
  'cosmetics-packaging',
  'custom-packaging',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = []

  for (const lang of LANGS) {
    routes.push({ url: `${BASE_URL}/${lang}`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 })
    routes.push({ url: `${BASE_URL}/${lang}/services`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    routes.push({ url: `${BASE_URL}/${lang}/products`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 })
    routes.push({ url: `${BASE_URL}/${lang}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 })
    routes.push({ url: `${BASE_URL}/${lang}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 })
    routes.push({ url: `${BASE_URL}/${lang}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.7 })

    for (const service of SERVICES) {
      routes.push({
        url: `${BASE_URL}/${lang}/services/${service}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }

    for (const product of PRODUCTS) {
      routes.push({
        url: `${BASE_URL}/${lang}/products/${product}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return routes
}
