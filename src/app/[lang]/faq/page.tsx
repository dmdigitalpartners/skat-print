import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import { buildPageMetadata } from '@/lib/metadata'
import FAQSection from '@/components/sections/FAQSection'
import CTABanner from '@/components/sections/CTABanner'
import PageHero from '@/components/ui/PageHero'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslation(lang)
  return buildPageMetadata({
    title: t.meta.faq.title,
    description: t.meta.faq.description,
    path: '/faq',
    lang,
  })
}

export default async function FAQPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang
  const s = t.faq.sidebar

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: t.faq.items.map((item: { question: string; answer: string }) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero eyebrow={t.nav.faq} heading={t.faq.heading} intro={t.faq.subtitle} />

      <section className="section-padding bg-[var(--color-bg-light)]">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">

            {/* FAQ accordion */}
            <FAQSection t={t} layout="sidebar" />

            {/* Sample Request sidebar */}
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* Main CTA card */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 md:p-8">
                <h2 className="font-display font-bold text-xl text-[var(--color-text)] mb-3">
                  {s.heading}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-6">
                  {s.body}
                </p>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-2 w-full justify-center px-5 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-colors duration-200"
                >
                  {s.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Quick specs card */}
              <div className="bg-white border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
                <ul className="space-y-3">
                  {[s.detail_lead, s.detail_moq, s.detail_custom].map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-[var(--color-text-muted)]">
                      <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
