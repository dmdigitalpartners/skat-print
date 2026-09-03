'use client'

import { Fragment } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import Badge from '@/components/ui/Badge'
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

export default function PortfolioGrid({
  t,
  lang,
  filterCategory,
  galleryHeading,
  className = '',
  showGroupHeadings = false,
}: Props) {
  const reduced = useReducedMotion()

  const categoryItem = t.products_section.items.find((item) => item.slug === filterCategory)
  const categoryLabel = categoryItem?.title ?? filterCategory

  const displayed = portfolioItems.filter((item) => item.category === filterCategory)

  return (
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
          <div className="columns-2 md:columns-3 gap-3 md:gap-4">
            {displayed.map((item, idx) => {
              const prevGroup = idx > 0 ? displayed[idx - 1].group : undefined
              const showHeading = showGroupHeadings && !!item.group && item.group !== prevGroup
              // The ungrouped leading tile (the manifest's hero entry — it never
              // carries a `group`) sits alone before the first heading forces a
              // column break, which would otherwise strand it in column 1 with
              // two empty columns beside it. Spanning it full-width instead reads
              // as an intentional lead banner rather than a layout gap.
              const isLeadingTile = showGroupHeadings && idx === 0 && !item.group

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
                  <motion.div
                    className={`group relative mb-3 md:mb-4 break-inside-avoid overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-light-surface)] ${isLeadingTile ? '[column-span:all]' : ''}`}
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
                      className="block w-full h-auto transition-transform duration-500 group-hover:scale-105"
                      loading={idx < 6 ? 'eager' : 'lazy'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-250">
                      <Badge>{categoryLabel}</Badge>
                    </div>
                  </motion.div>
                </Fragment>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
