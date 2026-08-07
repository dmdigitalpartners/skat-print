'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '@/components/ui/Button'
import CountUp from '@/components/ui/CountUp'
import type { Translation } from '@/lib/useTranslation'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

interface Props {
  t: Translation
  lang: string
}

export default function Hero({ t, lang }: Props) {
  const reduced = useReducedMotion()

  return (
    <section className="relative flex flex-col overflow-hidden h-[calc(100dvh-64px)] md:h-[100dvh]">
      {/* Mobile background image */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/assets/hero/hero-mobile.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          aria-hidden
        />
      </div>

      {/* Desktop background image */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/assets/hero/hero-packaging-collection.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
          aria-hidden
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/15" />
      <div className="absolute inset-0 md:hidden bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")',
        }}
      />

      {/* ── Mobile layout ─────────────────────────────── */}
      <div className="md:hidden flex-1 flex flex-col items-center justify-center relative z-10 px-5 pt-16">
        <motion.div
          variants={reduced ? undefined : stagger}
          initial="hidden"
          animate="show"
          className="w-full text-center space-y-4"
        >
          {/* Eyebrow */}
          <motion.div variants={reduced ? undefined : item}>
            <span className="inline-flex items-center gap-2 text-[11px] font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              {t.hero.eyebrow_country}
              <span className="text-white/30">·</span>
              {t.hero.eyebrow_year}
              <span className="text-white/30">·</span>
              {t.hero.eyebrow_industry}
            </span>
          </motion.div>

          {/* Headline — slogan, the largest element */}
          <motion.h1
            variants={reduced ? undefined : item}
            className="font-display font-bold text-[2.6rem] leading-[0.92] tracking-tight text-white"
          >
            <span className="block mb-2">{t.hero.headline_line1}</span>
            <span className="block">{t.hero.headline_line2}</span>
          </motion.h1>

          {/* One-sentence description */}
          <motion.p
            variants={reduced ? undefined : item}
            className="text-[13px] text-white/60 leading-relaxed max-w-[340px] mx-auto"
          >
            {t.hero.mobile_desc}
          </motion.p>

          {/* CTAs — both visible, equal width, single line each */}
          <motion.div
            variants={reduced ? undefined : item}
            className="flex items-center gap-3 pt-1"
          >
            <Button
              href={`/${lang}/samples`}
              variant="primary"
              className="flex-1 !px-3 !text-[13px] whitespace-nowrap"
            >
              {t.hero.cta_primary}
            </Button>
            <Button
              href={`/${lang}#products`}
              variant="secondary"
              className="flex-1 !px-3 !text-[13px] whitespace-nowrap"
            >
              {t.hero.cta_secondary}
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Mobile stats bar — in normal flow, always at bottom of section ── */}
      <div className="md:hidden relative z-10 border-t border-white/10 bg-black/70 backdrop-blur-md mb-[calc(var(--mobile-bar-height)+env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-3 divide-x divide-white/10 py-3">
          <div className="flex flex-col items-center justify-center px-1.5">
            <div className="font-display font-bold text-[1.05rem] leading-none text-[var(--color-accent)]">
              <CountUp to={30} suffix="+" />
            </div>
            <div className="text-[10px] text-white/70 mt-1 font-condensed uppercase tracking-wider leading-tight text-center">{t.trust.stat_years_label}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-1.5">
            <div className="font-display font-bold text-[1.05rem] leading-none text-[var(--color-accent)]">
              <CountUp to={parseInt(t.trust.stat_categories_number)} suffix={t.trust.stat_categories_suffix} />
            </div>
            <div className="text-[10px] text-white/70 mt-1 font-condensed uppercase tracking-wider leading-tight text-center">{t.trust.stat_categories_label_mobile}</div>
          </div>
          <div className="flex flex-col items-center justify-center px-1.5">
            <div className="font-display font-bold text-[1.05rem] leading-none text-[var(--color-accent)]">
              <CountUp to={parseInt(t.trust.stat_units_number)} suffix={t.trust.stat_units_suffix} />
            </div>
            <div className="text-[10px] text-white/70 mt-1 font-condensed uppercase tracking-wider leading-tight text-center">{t.trust.stat_units_label}</div>
          </div>
        </div>
      </div>

      {/* ── Desktop layout ────────────────────────────── */}
      <div className="hidden md:flex flex-1 flex-col justify-center relative z-10 pb-20">
        <div className="container-site text-left">
          <motion.div
            variants={reduced ? undefined : stagger}
            initial="hidden"
            animate="show"
            className="max-w-2xl"
          >
            {/* Eyebrow */}
            <motion.div variants={reduced ? undefined : item}>
              <span className="inline-flex items-center gap-2 text-[11px] font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-5">
                <span className="block w-5 h-px bg-[var(--color-accent)] shrink-0" />
                {t.hero.eyebrow_country}
                <span className="text-white/30">·</span>
                {t.hero.eyebrow_year}
                <span className="text-white/30">·</span>
                {t.hero.eyebrow_industry}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={reduced ? undefined : item}
              className="font-display font-bold text-[2.2rem] leading-[0.95] tracking-tight text-white mb-5 sm:text-6xl md:text-6xl"
            >
              <span className="block">{t.hero.headline_line1}</span>
              <span className="block">{t.hero.headline_line2}</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={reduced ? undefined : item}
              className="text-base md:text-lg text-white/65 leading-relaxed max-w-sm mb-8"
            >
              {t.hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={reduced ? undefined : item} className="flex items-center gap-3">
              <Button href={`/${lang}/samples`} variant="primary">
                {t.hero.cta_primary}
              </Button>
              <Button href={`/${lang}#products`} variant="secondary">
                {t.hero.cta_secondary}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Desktop stats bar — absolute ── */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 border-t border-white/12 bg-black/55 backdrop-blur-md z-10">
        <div className="container-site flex divide-x divide-white/15 py-5">
          <div className="flex-1 text-center">
            <div className="font-display font-bold text-3xl text-[var(--color-accent)]">
              <CountUp to={30} suffix="+" />
            </div>
            <div className="text-[11px] text-white/55 mt-0.5 font-condensed uppercase tracking-wide">{t.trust.stat_years_label}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display font-bold text-3xl text-[var(--color-accent)]">
              <CountUp to={parseInt(t.trust.stat_categories_number)} suffix={t.trust.stat_categories_suffix} />
            </div>
            <div className="text-[11px] text-white/55 mt-0.5 font-condensed uppercase tracking-wide">{t.trust.stat_categories_label}</div>
          </div>
          <div className="flex-1 text-center">
            <div className="font-display font-bold text-3xl text-[var(--color-accent)]">
              <CountUp to={parseInt(t.trust.stat_units_number)} suffix={t.trust.stat_units_suffix} />
            </div>
            <div className="text-[11px] text-white/55 mt-0.5 font-condensed uppercase tracking-wide">{t.trust.stat_units_label}</div>
          </div>
        </div>
      </div>
    </section>
  )
}
