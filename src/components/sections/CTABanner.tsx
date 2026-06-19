'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import type { Translation, Lang } from '@/lib/useTranslation'
import { trackEvent } from '@/lib/analytics'

interface Props {
  t: Translation
  lang: Lang
}

export default function CTABanner({ t, lang }: Props) {
  const reduced = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-dark) 0%, var(--color-primary) 50%, var(--color-primary-light) 100%)' }}
    >
      {/* Subtle diagonal texture lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, white 0px, white 1px, transparent 1px, transparent 40px)',
        }}
      />

      {/* Accent glow top-right */}
      <div
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(10,153,222,0.15) 0%, transparent 70%)' }}
      />

      <motion.div
        className="relative container-site py-20 md:py-28 text-center max-w-3xl mx-auto"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        whileInView={reduced ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-6">
          <span className="block w-5 h-px bg-[var(--color-accent)]" />
          Skat Print
          <span className="block w-5 h-px bg-[var(--color-accent)]" />
        </span>
        <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-[1.05] mb-5">
          {t.cta_banner.heading}
        </h2>
        <p className={`text-white/70 text-lg md:text-xl mb-4 leading-relaxed mx-auto ${lang === 'bg' ? 'max-w-2xl' : 'max-w-xl'}`}>
          {t.cta_banner.subheading}
        </p>
        <p className="text-white/45 text-sm mb-10">
          {t.cta_banner.response_time}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={`/${lang}/contact`}
            onClick={() => trackEvent({ name: 'cta_click', section: 'cta_banner', label: t.cta_banner.button })}
            className="inline-flex items-center justify-center min-h-[52px] px-10 py-3.5 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-[background-color,box-shadow] duration-200 shadow-[var(--shadow-accent)] hover:shadow-[0_6px_32px_rgba(10,153,222,0.45)]"
          >
            {t.cta_banner.button}
          </Link>
          <Link
            href={`/${lang}/samples`}
            onClick={() => trackEvent({ name: 'cta_click', section: 'cta_banner', label: t.cta_banner.samples_cta })}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3.5 rounded-[var(--radius-md)] border border-white/30 text-white text-sm font-medium hover:border-white/60 hover:bg-white/5 transition-[border-color,background-color] duration-200"
          >
            {t.cta_banner.samples_cta}
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
