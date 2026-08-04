'use client'

import { useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'
import GoogleRatingBadge from '@/components/ui/GoogleRatingBadge'

interface Props {
  t: Translation
}

const Star = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3" aria-hidden>
    <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.8l-5.2 2.72.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
  </svg>
)

export default function TrustedBy({ t }: Props) {
  const reduced = useReducedMotion()
  const cards = [...t.trusted_by.items, ...t.trusted_by.items]

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}
    >
      <div className="container-site py-10 md:py-12">
        {/* Centered heading + rating badge */}
        <div className="flex flex-col items-center gap-4 mb-6 md:mb-8">
          <p className="text-center text-xs md:text-sm font-condensed font-semibold uppercase tracking-widest text-white/60">
            {t.trusted_by.eyebrow}
          </p>
          <GoogleRatingBadge t={t} />
        </div>

        {/* Testimonial marquee */}
        <div className="overflow-hidden" aria-label={t.trusted_by.eyebrow}>
          <ul
            className={reduced ? 'flex gap-6 flex-wrap justify-center' : 'flex gap-6 animate-marquee'}
            role="list"
          >
            {cards.map((item, i) => (
              <li key={i} className="flex-none">
                <div className="flex flex-col justify-between px-5 py-4 rounded-[var(--radius-sm)] border border-white/15 bg-white/5 w-[260px] h-full">
                  <div className="flex gap-0.5 text-[var(--color-accent)] mb-2" aria-hidden>
                    {Array.from({ length: item.rating }).map((_, s) => (
                      <Star key={s} />
                    ))}
                  </div>
                  <p className="text-xs text-white/85 leading-relaxed mb-3">&ldquo;{item.quote}&rdquo;</p>
                  <span className="text-[11px] font-semibold text-white">
                    {item.name} <span className="font-normal text-white/50">— {t.trusted_by.source_label}</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
