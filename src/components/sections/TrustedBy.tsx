'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { Translation } from '@/lib/useTranslation'

interface Props {
  t: Translation
}

export default function TrustedBy({ t }: Props) {
  const reduced = useReducedMotion()

  return (
    <section className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <div className="container-site py-10 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
          {/* Eyebrow label */}
          <p className="flex-none text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] whitespace-nowrap">
            {t.trusted_by.eyebrow}
          </p>

          {/* Divider — desktop only */}
          <div className="hidden md:block flex-none w-px h-8 bg-[var(--color-border)]" aria-hidden />

          {/* Logo strip — horizontal scroll on mobile, wrap on desktop */}
          <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            <ul
              className="flex items-center gap-3 md:gap-4 flex-nowrap md:flex-wrap"
              role="list"
              aria-label={t.trusted_by.eyebrow}
            >
              {t.trusted_by.items.map((item, i) => (
                <motion.li
                  key={item.label}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-none"
                >
                  {/* Placeholder "logo" — text-based until real assets provided */}
                  <div className="flex flex-col items-center justify-center px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-surface)] min-w-[108px]">
                    <span className="text-[11px] font-semibold text-[var(--color-text)] leading-tight text-center">
                      {item.label}
                    </span>
                    <span className="text-[9px] text-[var(--color-text-muted)] leading-tight mt-0.5">
                      {item.detail}
                    </span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
