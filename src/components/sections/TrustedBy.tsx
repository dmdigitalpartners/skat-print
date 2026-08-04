'use client'

import { useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'
import GoogleRatingBadge from '@/components/ui/GoogleRatingBadge'

interface Props {
  t: Translation
}

const Star = ({ className = 'w-4 h-4 sm:w-5 sm:h-5' }: { className?: string }) => (
  <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
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
      <div className="container-site py-16 md:py-20">
        {/* Centered heading + subheading */}
        <div className="flex flex-col items-center gap-3 md:gap-4 mb-10 md:mb-12 text-center">
          <p className="text-xs md:text-sm font-condensed font-semibold uppercase tracking-widest text-white/60">
            {t.trusted_by.eyebrow}
          </p>
          <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl text-white tracking-tight leading-tight max-w-2xl">
            {t.trusted_by.heading}
          </h2>
          <p className="text-sm md:text-base text-white/65 leading-relaxed max-w-lg">
            {t.trusted_by.subheading}
          </p>
        </div>

        {/* Testimonial marquee */}
        <div className="overflow-hidden" aria-label={t.trusted_by.eyebrow}>
          <ul
            className={reduced ? 'flex gap-7 flex-wrap justify-center' : 'flex gap-7 md:gap-8 animate-marquee'}
            role="list"
          >
            {cards.map((item, i) => (
              <li key={i} className="flex-none">
                <div className="flex flex-col justify-between px-6 py-6 sm:px-7 sm:py-7 rounded-[var(--radius-lg)] border border-white/15 bg-white/5 w-[300px] sm:w-[360px] h-full">
                  <div>
                    <div className="flex gap-1 text-[var(--color-accent)] mb-3" aria-hidden>
                      {Array.from({ length: item.rating }).map((_, s) => (
                        <Star key={s} />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-white/85 leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                  </div>
                  <span className="text-sm font-semibold text-white mt-6 pt-4 border-t border-white/10">
                    {item.name}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Rating badge — below the conveyor */}
        <div className="flex justify-center mt-10 md:mt-12">
          <GoogleRatingBadge t={t} />
        </div>
      </div>
    </section>
  )
}
