'use client'

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
}

export default function PortfolioGrid({ t, lang, filterCategory, galleryHeading, className = '' }: Props) {
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

        {displayed.length === 0 ? null : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {displayed.map((item, idx) => (
              <motion.div
                key={item.src}
                className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] bg-[var(--color-bg-light-surface)]"
                initial={reduced ? false : { opacity: 0, scale: 0.96 }}
                whileInView={reduced ? {} : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease: 'easeOut', delay: (idx % 9) * 0.06 }}
              >
                <Image
                  src={item.src}
                  alt={lang === 'bg' ? item.altBg : item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={idx < 6 ? 'eager' : 'lazy'}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-250" />
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-[opacity,transform] duration-250">
                  <Badge>{categoryLabel}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
