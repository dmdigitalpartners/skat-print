'use client'

import { Fragment, useEffect, useState, type ReactNode } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Button from '@/components/ui/Button'
import type { Translation } from '@/lib/useTranslation'

/** How long each hero message stays on screen. */
const ROTATE_MS = 5000

/**
 * Stacks every hero variant in a single grid cell so the container is always
 * sized by the tallest one — the text can change without shifting anything
 * below it. Only opacity animates; inactive variants stay mounted but are
 * hidden from assistive tech and cannot be clicked or selected.
 */
function Stack({ activeIndex, items }: { activeIndex: number; items: ReactNode[] }) {
  return (
    <span className="grid">
      {items.map((node, i) => (
        <span
          key={i}
          aria-hidden={i !== activeIndex}
          className={`col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none ${
            i === activeIndex ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'
          }`}
        >
          {node}
        </span>
      ))}
    </span>
  )
}

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
  const variants = t.hero.variants
  const [index, setIndex] = useState(0)

  // Rotation is opt-out for reduced motion: the first variant simply stays.
  useEffect(() => {
    if (reduced || variants.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % variants.length), ROTATE_MS)
    return () => clearInterval(id)
  }, [reduced, variants.length])

  const activeIndex = reduced ? 0 : index

  return (
    <section className="relative flex flex-col overflow-hidden h-[calc(100dvh-var(--mobile-bar-height)-env(safe-area-inset-bottom))] md:h-[100dvh] md:bg-[var(--color-hero-wall)]">
      {/* Mobile background image — still the dark studio scene until a
          portrait version of the light product composition exists. */}
      <div className="absolute inset-0 md:hidden">
        <Image
          src="/assets/hero/hero-mobile.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          preload
          aria-hidden
        />
      </div>

      {/* Desktop background image — light studio composition. The products
          are staged in the right half of the frame so the copy sits on
          empty wall. The 60% anchor only matters on screens narrower than
          16:9: it takes more of the crop from the empty left wall, so the
          CYXO box on the far right is not cut off on 16:10 laptops. */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/assets/hero/hero-products-light.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-[60%_center]"
          preload
          aria-hidden
        />
      </div>

      {/* Mobile gradient overlays — keep the white copy legible on the dark image */}
      <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/95 via-black/50 to-black/15" />
      <div className="absolute inset-0 md:hidden bg-gradient-to-r from-black/20 via-transparent to-black/20" />

      {/* Tablet and small-laptop scrim. Below xl the text column reaches into
          the product cluster, so the wall colour is carried in behind the copy.
          From xl up the products clear the text on their own. */}
      <div className="absolute inset-0 hidden md:block xl:hidden bg-gradient-to-r from-[var(--color-hero-wall)]/90 via-[var(--color-hero-wall)]/60 to-transparent" />

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
        {/* Spacing is set per element rather than with a blanket space-y so the
            heading and its supporting line read as one composed block, with the
            larger break falling before the buttons. */}
        <motion.div
          variants={reduced ? undefined : stagger}
          initial="hidden"
          animate="show"
          className="w-full text-center"
        >
          {/* Eyebrow */}
          <motion.div variants={reduced ? undefined : item} className="mb-4">
            <span className="inline-flex items-center gap-2 text-[11px] font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)]">
              {t.hero.eyebrow_country}
              <span className="text-white/30">·</span>
              {t.hero.eyebrow_year}
              <span className="text-white/30">·</span>
              {t.hero.eyebrow_industry}
            </span>
          </motion.div>

          {/* Headline — slogan, the largest element */}
          {/* The two headline lines are separate blocks, so the only way a
              variant reaches three lines is one of them wrapping. The clamp
              scales the type with the viewport so the longest BG variant
              ("Вашата марка. / Видима на рафта.") still sets two lines at
              360px, without shrinking the type at 390px and above. */}
          <motion.h1
            variants={reduced ? undefined : item}
            className="font-display font-bold text-[clamp(1.95rem,8.4vw,2.6rem)] leading-[0.95] tracking-tight text-white mb-3"
          >
            <Stack
              activeIndex={activeIndex}
              items={variants.map((v, i) => (
                <Fragment key={i}>
                  <span className="block mb-1">{v.headline_line1}</span>
                  <span className="block">{v.headline_line2}</span>
                </Fragment>
              ))}
            />
          </motion.h1>

          {/* One-sentence description */}
          <motion.p
            variants={reduced ? undefined : item}
            className="text-[13px] text-white/60 leading-relaxed max-w-[340px] mx-auto mb-6"
          >
            <Stack activeIndex={activeIndex} items={variants.map((v) => v.mobile_desc)} />
          </motion.p>

          {/* CTAs — both visible, equal width, single line each */}
          <motion.div
            variants={reduced ? undefined : item}
            className="flex items-center gap-3"
          >
            <Button
              href={`/${lang}/contact`}
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

      {/* ── Mobile stats bar — in normal flow, always at bottom of section.
           Clearance for the fixed MobileConversionBar (+ iOS safe area) is
           reserved once, on the section's own height above — no margin
           needed here, or the reservation doubles up and leaves a blank
           gap between this bar and the fixed bar below it. ── */}
      <div className="md:hidden relative z-10 border-t border-white/10 bg-black/70 backdrop-blur-md">
        {/* Shortened labels on mobile: the full wording ran to three and four
            lines in a ~110px column. capabilities_short says the same thing in
            the same validated terminology; desktop keeps the full version. */}
        <div className="grid grid-cols-3 divide-x divide-white/10 py-3">
          {t.trust.capabilities_short.map((capability) => (
            <div key={capability} className="flex flex-col items-center justify-center px-1.5">
              <div className="text-[10px] text-white/70 font-condensed uppercase tracking-wider leading-tight text-center">
                {capability}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Desktop layout ────────────────────────────── */}
      {/* Dark copy on the light wall. The wall behind the text is a mid taupe
          (~#D1C9C2), which is too dark for the muted grey and the cyan as text,
          so both are carried in navy; cyan stays on the decorative rule. */}
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
              <span className="inline-flex items-center gap-2 text-[11px] font-condensed font-semibold uppercase tracking-widest text-[var(--color-primary)] mb-5">
                <span className="block w-5 h-px bg-[var(--color-accent)] shrink-0" />
                {t.hero.eyebrow_country}
                <span className="text-[var(--color-primary)]/30">·</span>
                {t.hero.eyebrow_year}
                <span className="text-[var(--color-primary)]/30">·</span>
                {t.hero.eyebrow_industry}
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={reduced ? undefined : item}
              className="font-display font-bold text-[2.2rem] leading-[0.95] tracking-tight text-[var(--color-primary)] mb-5 sm:text-6xl md:text-6xl"
            >
              <Stack
                activeIndex={activeIndex}
                items={variants.map((v, i) => (
                  <Fragment key={i}>
                    <span className="block">{v.headline_line1}</span>
                    <span className="block">{v.headline_line2}</span>
                  </Fragment>
                ))}
              />
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={reduced ? undefined : item}
              className="text-base md:text-lg text-[var(--color-primary)]/80 leading-relaxed max-w-sm mb-8"
            >
              <Stack activeIndex={activeIndex} items={variants.map((v) => v.subheadline)} />
            </motion.p>

            {/* CTAs */}
            <motion.div variants={reduced ? undefined : item} className="flex items-center gap-3">
              <Button href={`/${lang}/contact`} variant="primary">
                {t.hero.cta_primary}
              </Button>
              <Button href={`/${lang}#products`} variant="outline">
                {t.hero.cta_secondary}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Desktop stats bar — absolute, frosted light glass over the photo ── */}
      <div className="hidden md:block absolute bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-bg)]/75 backdrop-blur-md z-10">
        <div className="container-site flex divide-x divide-[var(--color-border)] py-5">
          {t.trust.capabilities.map((capability) => (
            <div key={capability} className="flex-1 text-center">
              <div className="text-[11px] text-[var(--color-text-muted)] font-condensed uppercase tracking-wide">
                {capability}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
