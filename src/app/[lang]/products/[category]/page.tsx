import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import { buildPageMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/config/site'
import SectionWrapper from '@/components/ui/SectionWrapper'
import CTABanner from '@/components/sections/CTABanner'
import PortfolioGrid from '@/components/sections/PortfolioGrid'
import PageHero from '@/components/ui/PageHero'
import SpecsAccordion from '@/components/ui/SpecsAccordion'
import { VALID_CATEGORIES, type CategorySlug } from '@/config/routes'
import { categoriesWithGroupHeadings } from '@/lib/portfolio-data'

export function generateStaticParams() {
  const langs = ['en', 'bg']
  return langs.flatMap((lang) =>
    VALID_CATEGORIES.map((category) => ({ lang, category }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; category: string }>
}): Promise<Metadata> {
  const { lang, category } = await params
  const t = getTranslation(lang)
  const detail = t.product_detail[category as CategorySlug]
  if (!detail) return {}
  return buildPageMetadata({
    title: `${detail.heading} — Skat Print`,
    description: detail.intro,
    path: `/products/${category}`,
    lang,
  })
}

export default async function ProductCategoryPage({
  params,
}: {
  params: Promise<{ lang: string; category: string }>
}) {
  const { lang, category } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang

  if (!VALID_CATEGORIES.includes(category as CategorySlug)) notFound()

  const detail = t.product_detail[category as CategorySlug]

  const baseUrl = SITE_URL
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: lang === 'bg' ? 'Начало' : 'Home', item: `${baseUrl}/${lang}` },
          { '@type': 'ListItem', position: 2, name: t.nav.products, item: `${baseUrl}/${lang}/products` },
          { '@type': 'ListItem', position: 3, name: detail.heading, item: `${baseUrl}/${lang}/products/${category}` },
        ],
      },
      {
        '@type': 'Product',
        name: detail.heading,
        description: detail.intro,
        brand: { '@type': 'Brand', name: 'Skat Print' },
        manufacturer: { '@type': 'Organization', name: 'Skat Print', url: baseUrl },
        url: `${baseUrl}/${lang}/products/${category}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <PageHero eyebrow={t.nav.products} heading={detail.heading} intro={detail.intro} />

      {/* Body */}
      <SectionWrapper className="!pb-8 md:!pb-10">
        <div className="max-w-3xl">
          {detail.body.split('\n\n').map((para, i) => (
            <p key={i} className="text-[var(--color-text-muted)] leading-relaxed mb-5 last:mb-0">
              {para}
            </p>
          ))}
          <SpecsAccordion heading={t.product_detail.specs_heading} specs={detail.specs} />
        </div>
      </SectionWrapper>

      {/* Gallery */}
      <PortfolioGrid
        t={t}
        lang={currentLang}
        filterCategory={category as CategorySlug}
        galleryHeading={t.product_detail.gallery_heading}
        className="!pt-8 md:!pt-12"
        showGroupHeadings={categoriesWithGroupHeadings.includes(category as CategorySlug)}
      />

      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
