import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import { VALID_INDUSTRIES, LANGS } from '@/config/routes'

export async function generateStaticParams() {
  return LANGS.flatMap(lang =>
    VALID_INDUSTRIES.map(industry => ({ lang, industry }))
  )
}

function slugToKey(slug: string): string {
  return slug.replace(/-/g, '_')
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; industry: string }>
}): Promise<Metadata> {
  const { lang, industry } = await params
  if (!(VALID_INDUSTRIES as readonly string[]).includes(industry)) return {}
  const t = getTranslation(lang)
  const key = slugToKey(industry) as keyof typeof t.industries
  const data = t.industries[key] as { meta_title: string; meta_description: string } | undefined
  if (!data || typeof data !== 'object' || !('meta_title' in data)) return {}
  return {
    title: data.meta_title,
    description: data.meta_description,
    alternates: {
      canonical: `/${lang}/industries/${industry}`,
      languages: {
        en: `/en/industries/${industry}`,
        bg: `/bg/industries/${industry}`,
      },
    },
  }
}

interface IndustryData {
  meta_title: string
  meta_description: string
  hero_headline: string
  hero_subheadline: string
  intro: string
  capabilities_heading: string
  capabilities: string[]
  process_heading: string
  process_steps: { title: string; desc: string }[]
  use_cases_heading: string
  use_cases: string[]
  faq_heading: string
  faq: { q: string; a: string }[]
  case_study_index: number
  cta_label: string
  related_product_slugs: string[]
  related_industry_slugs: string[]
}

interface CaseStudy {
  client: string
  problem: string
  constraint: string
  solution: string
  result: string
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ lang: string; industry: string }>
}) {
  const { lang, industry } = await params
  if (!(VALID_INDUSTRIES as readonly string[]).includes(industry)) notFound()

  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang
  const key = slugToKey(industry) as keyof typeof t.industries
  const data = t.industries[key] as IndustryData | undefined
  if (!data || typeof data !== 'object' || !('hero_headline' in data)) notFound()

  const caseStudy = t.case_studies[data.case_study_index] as CaseStudy | undefined
  const ind = t.industries

  // Human-readable labels for related slugs
  const industryLabels: Record<string, string> = {
    'food-packaging': lang === 'bg' ? 'Хранителни опаковки' : 'Food Packaging',
    'cosmetics-packaging': lang === 'bg' ? 'Козметични опаковки' : 'Cosmetics Packaging',
    'wine-spirits-packaging': lang === 'bg' ? 'Вино & Алкохол' : 'Wine & Spirits',
    'retail-pos-displays': lang === 'bg' ? 'Търговски POS дисплеи' : 'Retail POS Displays',
  }
  const productLabels: Record<string, string> = {
    'pos-displays': lang === 'bg' ? 'POS дисплеи' : 'POS Displays',
    'food-packaging': lang === 'bg' ? 'Хранителни опаковки' : 'Food Packaging',
    'alcohol-packaging': lang === 'bg' ? 'Алкохолни опаковки' : 'Alcohol Packaging',
    'cosmetics-packaging': lang === 'bg' ? 'Козметични опаковки' : 'Cosmetics Packaging',
    'custom-packaging': lang === 'bg' ? 'Персонализирани опаковки' : 'Custom Packaging',
  }

  const baseUrl = 'https://skatprint.bg'
  const industrySchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: lang === 'bg' ? 'Начало' : 'Home', item: `${baseUrl}/${lang}` },
          { '@type': 'ListItem', position: 2, name: ind.eyebrow, item: `${baseUrl}/${lang}/products` },
          { '@type': 'ListItem', position: 3, name: data.hero_headline, item: `${baseUrl}/${lang}/industries/${industry}` },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map((item: { q: string; a: string }) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(industrySchema) }}
      />
      {/* Hero */}
      <section className="bg-[var(--color-primary-dark)] text-white py-20 md:py-28">
        <div className="container-site max-w-3xl">
          <div className="mb-4">
            <Link
              href={`/${currentLang}/products`}
              className="text-xs text-white/50 hover:text-white/80 transition-colors uppercase tracking-widest font-condensed font-semibold"
            >
              {ind.back_to_industries}
            </Link>
          </div>
          <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-5">
            <span className="block w-5 h-px bg-[var(--color-accent)]" />
            {ind.eyebrow}
          </span>
          <h1 className="font-display font-bold text-3xl md:text-5xl leading-tight mb-5">
            {data.hero_headline}
          </h1>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            {data.hero_subheadline}
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={`/${currentLang}/samples`}
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-[background-color] shadow-[var(--shadow-accent)]"
            >
              {data.cta_label}
            </Link>
            <Link
              href={`/${currentLang}/contact`}
              className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] border border-white/30 text-white text-sm font-medium hover:border-white/60 hover:bg-white/5 transition-[border-color,background-color]"
            >
              {ind.get_quote_cta}
            </Link>
          </div>
        </div>
      </section>

      {/* Main content */}
      <section className="container-site py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 lg:gap-16">
          {/* Left: main content */}
          <div className="space-y-14">
            {/* Intro */}
            <p className="text-[var(--color-text)] text-lg leading-relaxed">
              {data.intro}
            </p>

            {/* Capabilities */}
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--color-text)] mb-6">
                {data.capabilities_heading}
              </h2>
              <ul className="space-y-3">
                {data.capabilities.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-none mt-1 w-4 h-4 rounded-full bg-[var(--color-accent-subtle)] flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    </span>
                    <span className="text-[var(--color-text)] leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--color-text)] mb-6">
                {data.process_heading}
              </h2>
              <ol className="space-y-5">
                {data.process_steps.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-none w-7 h-7 rounded-full bg-[var(--color-accent)] text-white text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--color-text)] mb-1">{step.title}</p>
                      <p className="text-[var(--color-text-muted)] leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Use cases */}
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--color-text)] mb-6">
                {data.use_cases_heading}
              </h2>
              <ul className="space-y-2">
                {data.use_cases.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[var(--color-text-muted)]">
                    <span className="flex-none mt-2 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Case study */}
            {caseStudy && (
              <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-6 md:p-8">
                <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-4">
                  {lang === 'bg' ? 'Казус' : 'Case Study'}
                </p>
                <p className="font-semibold text-[var(--color-text)] mb-5">{caseStudy.client}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['problem', 'constraint', 'solution', 'result'] as const).map(field => (
                    <div key={field} className="p-4 rounded-[var(--radius-sm)] bg-[var(--color-bg)]">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                        {lang === 'bg'
                          ? { problem: 'Проблем', constraint: 'Ограничение', solution: 'Решение', result: 'Резултат' }[field]
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </p>
                      <p className="text-sm text-[var(--color-text)] leading-relaxed">{caseStudy[field]}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ */}
            <div>
              <h2 className="font-display font-bold text-2xl text-[var(--color-text)] mb-6">
                {data.faq_heading}
              </h2>
              <div className="space-y-4">
                {data.faq.map((item, i) => (
                  <div key={i} className="border-b border-[var(--color-border)] pb-4">
                    <p className="font-semibold text-[var(--color-text)] mb-2">{item.q}</p>
                    <p className="text-[var(--color-text-muted)] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-8 lg:sticky lg:top-24 self-start">
            {/* Related products */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
                {ind.related_products}
              </p>
              <div className="flex flex-col gap-2">
                {data.related_product_slugs.map(slug => (
                  <Link
                    key={slug}
                    href={`/${currentLang}/products/${slug}`}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color]"
                  >
                    <span>{productLabels[slug] ?? slug}</span>
                    <span aria-hidden className="opacity-40">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Related industries */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] p-5">
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
                {ind.related_industries}
              </p>
              <div className="flex flex-col gap-2">
                {data.related_industry_slugs.map(slug => (
                  <Link
                    key={slug}
                    href={`/${currentLang}/industries/${slug}`}
                    className="flex items-center justify-between gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-text)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color]"
                  >
                    <span>{industryLabels[slug] ?? slug}</span>
                    <span aria-hidden className="opacity-40">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA card */}
            <div
              className="rounded-[var(--radius-lg)] p-5 text-white"
              style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)' }}
            >
              <p className="font-semibold mb-2">{data.cta_label}</p>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                {lang === 'bg' ? 'Отговаряме в рамките на 4 работни часа.' : 'We respond within 4 business hours.'}
              </p>
              <Link
                href={`/${currentLang}/samples`}
                className="block w-full text-center text-sm font-semibold bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] text-white py-2.5 px-4 rounded-[var(--radius-sm)] transition-[background-color]"
              >
                {ind.request_samples_cta} →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
