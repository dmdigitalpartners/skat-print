'use client'

import { useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'

interface Props {
  t: Translation
}

export default function TrustedBy({ t }: Props) {
  const reduced = useReducedMotion()
  const logos = [...t.trusted_by.items, ...t.trusted_by.items]

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}
    >
      <div className="container-site py-10 md:py-12">
        {/* Centered heading */}
        <p className="text-center text-xs md:text-sm font-condensed font-semibold uppercase tracking-widest text-white/60 mb-6 md:mb-8">
          {t.trusted_by.eyebrow}
        </p>

        {/* Logo marquee */}
        <div className="overflow-hidden" aria-label={t.trusted_by.eyebrow}>
          <ul
            className={reduced ? 'flex gap-6 flex-wrap justify-center' : 'flex gap-6 animate-marquee'}
            role="list"
          >
            {logos.map((item, i) => (
              <li key={i} className="flex-none">
                <div className="flex flex-col items-center justify-center px-5 py-3 rounded-[var(--radius-sm)] border border-white/15 bg-white/5 min-w-[120px]">
                  <span className="text-[11px] font-semibold text-white leading-tight text-center">
                    {item.label}
                  </span>
                  <span className="text-[9px] text-white/50 leading-tight mt-0.5">
                    {item.detail}
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
