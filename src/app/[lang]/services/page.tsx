import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import SectionWrapper from '@/components/ui/SectionWrapper'
import CTABanner from '@/components/sections/CTABanner'
import PageHero from '@/components/ui/PageHero'
import { type ServiceSlug } from '@/config/routes'

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
  return {
    title: t.meta.services.title,
    description: t.meta.services.description,
    alternates: { canonical: `/${lang}/services`, languages: { en: '/en/services', bg: '/bg/services' } },
  }
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang

  return (
    <>
      <PageHero eyebrow={t.nav.services} heading={t.services_page.heading} intro={t.services_page.intro} />

      <SectionWrapper>
        <div className="divide-y divide-[var(--color-border)]">
          {t.services_section.items.map((service) => {
            const detail = t.service_detail[service.slug as ServiceSlug]
            return (
              <section key={service.slug} id={service.slug} className="py-10 first:pt-0 last:pb-0">
                <h2 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-text)] mb-3">
                  {detail.heading}
                </h2>
                <ul className="space-y-3">
                  {detail.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-3 text-[var(--color-text-muted)] leading-snug">
                      <span className="mt-1.5 flex-none w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" aria-hidden />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </div>
      </SectionWrapper>

      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
