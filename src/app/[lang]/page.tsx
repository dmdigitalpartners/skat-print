import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import Hero from '@/components/sections/Hero'
import VideoSection from '@/components/sections/VideoSection'
import ProductsCatalog from '@/components/sections/ProductsCatalog'
import Differentiators from '@/components/sections/Differentiators'
import CTABanner from '@/components/sections/CTABanner'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslation(lang)
  return {
    title: t.meta.home.title,
    description: t.meta.home.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', bg: '/bg' },
    },
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang

  return (
    <>
      <Hero t={t} lang={currentLang} />
      <ProductsCatalog t={t} lang={currentLang} />
      <VideoSection t={t} />
      <Differentiators t={t} />
      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
