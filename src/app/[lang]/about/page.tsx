import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CTABanner from '@/components/sections/CTABanner'
import VideoSection from '@/components/sections/VideoSection'
import Differentiators from '@/components/sections/Differentiators'
import PageHero from '@/components/ui/PageHero'
import CountUp from '@/components/ui/CountUp'
import Timeline from '@/components/ui/Timeline'
import { getYearsSince } from '@/lib/constants'

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
  return {
    title: t.meta.about.title.replace('{years}', String(getYearsSince())),
    description: t.meta.about.description,
    alternates: { canonical: `/${lang}/about`, languages: { en: '/en/about', bg: '/bg/about' } },
  }
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang
  const a = t.about_page
  const s = t.about_stats

  return (
    <>
      <PageHero eyebrow={t.nav.about} heading={a.heading} intro={a.founding} />

      {/* Stats Strip — dark surface, continuous with hero */}
      <div style={{ backgroundColor: 'var(--color-bg-dark-surface)' }} className="py-14 md:py-16 border-t border-[var(--color-border-dark)]">
        <div className="container-site">
          <div className="grid grid-cols-3 divide-x divide-[var(--color-border-dark)] gap-6 md:gap-10 max-w-2xl mx-auto">
            {/* Years */}
            <div className="flex flex-col items-center text-center px-3 md:px-6">
              <div className="font-display font-bold text-3xl md:text-5xl text-[var(--color-accent)] leading-none mb-2">
                <CountUp to={getYearsSince()} suffix="" />
              </div>
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted-dark)]">
                {s.years_label}
              </p>
            </div>

            {/* Lead Time */}
            <div className="flex flex-col items-center text-center px-3 md:px-6">
              <div className="font-display font-bold text-3xl md:text-5xl text-[var(--color-accent)] leading-none mb-2">
                {s.leadtime_display}
              </div>
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted-dark)]">
                {s.leadtime_label}
              </p>
            </div>

            {/* Units Produced */}
            <div className="flex flex-col items-center text-center px-3 md:px-6">
              <div className="font-display font-bold text-3xl md:text-5xl text-[var(--color-accent)] leading-none mb-2">
                {s.units_number}{s.units_suffix}
              </div>
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted-dark)]">
                {s.units_label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Story Block 1 — Heritage: text left with H2 + pull-quote + brand strip, image right */}
      <section className="section-padding" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="container-site">
          <div className="max-w-3xl">
            <ScrollReveal>
              <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-5">
                <span className="block w-5 h-px bg-[var(--color-accent)]" />
                {a.story_eyebrow}
              </span>
              <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-6">
                {a.story_heading}
              </h2>
              <p className="hidden md:block text-lg text-[var(--color-text-muted)] leading-relaxed mb-6">
                {a.story}
              </p>
              <p className="md:hidden text-base text-[var(--color-text-muted)] leading-relaxed mb-6">
                {a.story_short}
              </p>

              {/* Pull-quote */}
              <blockquote className="pl-4 border-l-2 border-[var(--color-accent)] mb-8">
                <p className="text-base font-display font-semibold text-[var(--color-text)] leading-snug italic">
                  &ldquo;{a.story_pullquote}&rdquo;
                </p>
              </blockquote>

              {/* Brand trust strip */}
              <div className="pt-6 border-t border-[var(--color-border)]">
                <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                  {a.story_brands_label}
                </p>
                <div className="flex flex-wrap items-center gap-y-2">
                  {a.story_brands.map((brand) => (
                    <span key={brand} className="flex items-center">
                      <span className="text-sm font-condensed font-bold uppercase tracking-wider text-[var(--color-text)]">
                        {brand}
                      </span>
                      <span className="mx-3 text-[var(--color-border)]" aria-hidden>·</span>
                    </span>
                  ))}
                  <span className="text-sm text-[var(--color-text-muted)] italic">
                    {a.story_brands_more}
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Story Block 2 — Capability proof: 3-column cards, no image */}
      <section className="section-padding" style={{ backgroundColor: '#F3F7FB', borderTop: '1px solid #E2E9F3' }}>
        <div className="container-site">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-5">
              <span className="block w-5 h-px bg-[var(--color-accent)]" />
              {a.capability_eyebrow}
            </span>
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-[var(--color-text)] leading-tight mb-14 md:mb-16 max-w-3xl">
              {a.capability_heading}
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {a.capability_cards.map((card, i) => (
              <ScrollReveal key={i} delay={i * 0.12}>
                <div
                  className="p-8 rounded-[var(--radius-lg)] h-full"
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E9F3',
                  }}
                >
                  <div
                    className="font-display font-bold text-5xl leading-none mb-5"
                    style={{ color: 'var(--color-accent)', opacity: 0.15 }}
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-display font-bold text-lg text-[var(--color-text)] mb-3">
                    {card.heading}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                    {card.copy}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiators — clean white section */}
      <Differentiators t={t} sectionStyle={{ backgroundColor: '#FFFFFF' }} />

      {/* Milestones Timeline — light cool section */}
      <Timeline
        milestones={a.milestones}
        eyebrow={a.timeline_eyebrow}
        heading={a.timeline_heading}
        sectionStyle={{ backgroundColor: '#F3F7FB' }}
      />

      {/* Video */}
      <VideoSection t={t} />

      <CTABanner t={t} lang={currentLang} />
    </>
  )
}
