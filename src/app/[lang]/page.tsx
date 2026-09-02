import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import { buildPageMetadata } from '@/lib/metadata'
import Hero from '@/components/sections/Hero'
import TrustedBy from '@/components/sections/TrustedBy'
import VideoSection from '@/components/sections/VideoSection'
import ProductsCatalog from '@/components/sections/ProductsCatalog'
import Differentiators from '@/components/sections/Differentiators'
import CTABanner from '@/components/sections/CTABanner'

// Revalidate daily so computed "years in business" figures self-correct
// after a new year turns over, without requiring a redeploy.
export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslation(lang)
  return buildPageMetadata({
    title: t.meta.home.title,
    description: t.meta.home.description,
    path: '',
    lang,
  })
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
      <TrustedBy t={t} />
      <ProductsCatalog t={t} lang={currentLang} />
      <VideoSection t={t} lang={currentLang} />
      <Differentiators t={t} />
      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
