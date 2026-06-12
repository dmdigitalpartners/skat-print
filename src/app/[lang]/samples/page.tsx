import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import { LANGS } from '@/config/routes'
import SamplesForm from '@/components/sections/SamplesForm'

export async function generateStaticParams() {
  return LANGS.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslation(lang)
  return {
    title: t.meta.samples.title,
    description: t.meta.samples.description,
    alternates: {
      canonical: `/${lang}/samples`,
      languages: { en: '/en/samples', bg: '/bg/samples' },
    },
  }
}

export default async function SamplesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang
  const s = t.samples

  return (
    <main className="container-site py-16 md:py-24">
      <div className="max-w-2xl mx-auto">
        {/* Page header */}
        <div className="mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-4">
            <span className="block w-5 h-px bg-[var(--color-accent)]" />
            {s.page_eyebrow}
            <span className="block w-5 h-px bg-[var(--color-accent)]" />
          </span>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-4">
            {s.page_heading}
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed">
            {s.page_subheading}
          </p>
        </div>

        <SamplesForm t={t} lang={currentLang} />
      </div>
    </main>
  )
}
