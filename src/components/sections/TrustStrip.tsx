'use client'

import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'
import type { Translation } from '@/lib/useTranslation'

export default function TrustStrip({ t }: { t: Translation }) {
  const stats = [
    { number: parseInt(t.trust.stat_years_number), suffix: t.trust.stat_years_suffix, label: t.trust.stat_years_label },
    { number: parseInt(t.trust.stat_categories_number), suffix: t.trust.stat_categories_suffix, label: t.trust.stat_categories_label },
    { number: parseInt(t.trust.stat_clients_number), suffix: t.trust.stat_clients_suffix, label: t.trust.stat_clients_label },
  ]

  return (
    <section className="bg-[var(--color-bg-surface)] border-y border-[var(--color-border)] py-10 md:py-12">
      <div className="container-site">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-0">
          {/* Stats */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-8 md:gap-12 md:flex-1">
            {stats.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 0.1} className="text-center md:text-left">
                <div className="font-display font-bold text-4xl text-[var(--color-accent)]">
                  <CountUp to={stat.number} suffix={stat.suffix} />
                </div>
                <div className="text-sm text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
              </ScrollReveal>
            ))}
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-12 bg-[var(--color-border)] mx-12" />

          {/* Clients */}
          <ScrollReveal delay={0.3}>
            <p className="text-sm text-[var(--color-text-muted)] md:max-w-sm text-center md:text-left leading-relaxed">
              {t.trust.client_sentence}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
