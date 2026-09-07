import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'
import SectionHeader from '@/components/ui/SectionHeader'
import type { Translation, Lang } from '@/lib/useTranslation'

interface Props {
  t: Translation
  lang: Lang
  hideHeader?: boolean
}

export default function ProductsCatalog({ t, lang, hideHeader }: Props) {
  return (
    <section id="products" className="section-padding bg-[var(--color-bg)]">
      <div className="container-site">
        {!hideHeader && (
          <SectionHeader
            eyebrow={t.products_section.eyebrow}
            heading={t.products_section.title}
            description={t.products_section.subtitle}
          />
        )}

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {t.products_section.items.map((product, idx) => {
            // POS Displays leads the range and is the most visual category, so on
            // mobile it takes the full width as a featured card and the remaining
            // four fall into a clean 2×2 — five cards in two columns would
            // otherwise leave the last one stranded beside an empty cell.
            // Desktop is untouched: every card keeps md:col-span-2 in the 6-col track.
            const featured = idx === 0
            return (
            <ScrollReveal
              key={product.slug}
              delay={idx * 0.08}
              className={`${featured ? 'col-span-2' : 'col-span-1'} md:col-span-2`}
            >
              <Link
                href={`/${lang}/products/${product.slug}`}
                // The featured card is square rather than a wide banner: these
                // product photographs are all portrait, and a 3:2 crop cut the
                // branding off the top and bottom of the display. A square trims
                // only the surplus studio background.
                className={`group relative block overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)] ${
                  featured ? 'aspect-square md:aspect-[4/5]' : 'aspect-[4/5]'
                }`}
              >
                {/* Image well — fills the card edge-to-edge. Each product's
                    image was chosen for a close aspect-ratio match to this
                    card (see products_section.items), so the cover crop is
                    a light, even trim on one axis, not a hard cut. */}
                <div className="absolute inset-0">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes={
                      featured
                        ? '(max-width: 767px) 100vw, 33vw'
                        : '(max-width: 767px) 50vw, 33vw'
                    }
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    loading={idx < 2 ? 'eager' : 'lazy'}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                {/* Desktop content: bottom-anchored */}
                <div className="absolute bottom-0 left-0 right-0 hidden md:flex flex-col gap-1.5 px-5 pb-5">
                  <h3 className="font-display font-bold text-base text-white truncate">
                    {product.title}
                  </h3>
                  <p className="text-white/75 text-xs truncate">
                    {product.description}
                  </p>
                  {/* CTA: hidden by default, revealed on hover */}
                  <span className="text-xs font-semibold text-[var(--color-accent)] opacity-0 translate-y-1 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
                    {t.products_section.item_cta} →
                  </span>
                </div>

                {/* Mobile content: always visible */}
                <div
                  className={`absolute bottom-0 left-0 right-0 flex flex-col gap-1.5 md:hidden ${
                    featured ? 'p-4' : 'p-3'
                  }`}
                >
                  <h3
                    className={`font-display font-bold text-white leading-tight line-clamp-2 ${
                      featured ? 'text-base' : 'text-sm'
                    }`}
                  >
                    {product.title}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--color-accent)]">
                    {t.products_section.item_cta} →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
            )
          })}
        </div>

        {/* Section footer CTA — an outlined secondary control, not a text link.
             It reads as an entry point to the catalogue while staying clearly
             below the filled "Request a Quote" primary in the hierarchy.
             Colour is --color-accent-text (the AA-safe variant) because this is
             small text on a light background. */}
        <div className="mt-8 md:mt-10">
          {/* Was `/portfolio`, which itself just redirects to `/products`,
               which redirects to this same section's own anchor — a
               pointless double-redirect back to where the user already is.
               Send them straight to a real gallery page instead. */}
          <Link
            href={`/${lang}/products/${t.products_section.items[0].slug}`}
            className="group inline-flex items-center gap-2.5 min-h-[44px] px-5 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm md:text-base font-semibold text-[var(--color-accent-text)] transition-[background-color,border-color,color] duration-200 hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-subtle)] focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2"
          >
            {t.products_section.view_portfolio}
            <svg
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
              className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            >
              <path d="M4 10h11M11 5.5 15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
