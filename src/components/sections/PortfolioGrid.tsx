'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import PortfolioLightbox from '@/components/ui/PortfolioLightbox'
import type { Translation, Lang } from '@/lib/useTranslation'
import { portfolioItems, type PortfolioCategory } from '@/lib/portfolio-data'

interface Props {
  t: Translation
  lang: Lang
  filterCategory: PortfolioCategory
  galleryHeading: string
  className?: string
  // Renders a subgroup heading (e.g. "Floor Displays") above each run of
  // tiles that share an item.group — only pos-displays has group data today
  // (see categoriesWithGroupHeadings in portfolio-data.ts). Every other
  // category renders exactly as before: a flat masonry grid, no headings.
  showGroupHeadings?: boolean
}

function IconZoomIn({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4M11 8v6M8 11h6" />
    </svg>
  )
}

export default function PortfolioGrid({
  t,
  lang,
  filterCategory,
  galleryHeading,
  className = '',
  showGroupHeadings = false,
}: Props) {
  const reduced = useReducedMotion() ?? false
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])
  const restoreIndexRef = useRef<number | null>(null)

  const displayed = useMemo(
    () => portfolioItems.filter((item) => item.category === filterCategory),
    [filterCategory],
  )

  const goToIndex = useCallback((index: number) => {
    restoreIndexRef.current = index
    setActiveIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setActiveIndex(null)
  }, [])

  useEffect(() => {
    if (activeIndex !== null) return

    const target = restoreIndexRef.current
    if (target === null) return
    restoreIndexRef.current = null

    const tile = tileRefs.current[target]
    if (!tile) return

    tile.focus({ preventScroll: true })
    tile.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' })
  }, [activeIndex, reduced])

  return (
    <>
      <section className={`section-padding bg-[var(--color-bg-light)] ${className}`}>
        <div className="container-site">
          <div className="mb-8 md:mb-10">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text)]">
              {galleryHeading}
            </h2>
          </div>

          {displayed.length === 0 ? (
            <p className="text-[var(--color-text-muted)] text-sm py-8">
              {lang === 'bg' ? 'Няма намерени проекти в тази категория.' : 'No projects found in this category.'}
            </p>
          ) : (
            // Multi-column masonry, not a fixed grid: every tile renders at its
            // own real aspect ratio (width/height from portfolio-data.ts, see
            // scripts/generate-portfolio-data.mjs) instead of being forced
            // into a uniform square and cropped. Each column reflows
            // independently, so one unusually tall/wide image only extends its
            // own column and never overlaps a neighbor.
            <div className="columns-2 gap-3 md:columns-3 md:gap-4">
              {displayed.map((item, idx) => {
                const prevGroup = idx > 0 ? displayed[idx - 1].group : undefined
                const showHeading = showGroupHeadings && !!item.group && item.group !== prevGroup
                return (
                  <Fragment key={item.src}>
                    {showHeading && (
                      <h3 className="[column-span:all] mb-3 mt-8 first:mt-0 md:mb-4 md:mt-10">
                        <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)]">
                          <span className="block h-px w-5 shrink-0 bg-[var(--color-accent)]" />
                          {lang === 'bg' ? item.groupBg : item.group}
                        </span>
                      </h3>
                    )}
                    <motion.button
                      type="button"
                      ref={(element) => { tileRefs.current[idx] = element }}
                      onClick={() => goToIndex(idx)}
                      aria-label={`${t.lightbox.aria_enlarge}: ${lang === 'bg' ? item.altBg : item.alt}`}
                      className={`group relative mb-3 block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-light-surface)] p-0 text-left md:mb-4`}
                      initial={reduced ? false : { opacity: 0, y: 12 }}
                      whileInView={reduced ? {} : { opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 0.4, ease: 'easeOut', delay: (idx % 6) * 0.04 }}
                    >
                      <Image
                        src={item.src}
                        alt={lang === 'bg' ? item.altBg : item.alt}
                        width={item.width}
                        height={item.height}
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="block h-auto w-full transition-transform duration-500 group-hover:scale-105 group-focus-visible:scale-105"
                        loading={idx < 6 ? 'eager' : 'lazy'}
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[var(--color-bg-dark)]/80 text-white opacity-0 shadow-[0_4px_14px_rgba(15,28,51,0.22)] transition-[opacity,transform] duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                      >
                        <IconZoomIn className="h-4 w-4" />
                      </span>
                    </motion.button>
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <PortfolioLightbox
        items={displayed}
        index={activeIndex}
        t={t}
        lang={lang}
        onIndexChange={goToIndex}
        onClose={closeLightbox}
      />
    </>
  )
}
