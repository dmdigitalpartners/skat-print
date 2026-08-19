import Image from 'next/image'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'
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
          <div className="mb-10 md:mb-12">
            {/* Eyebrow — matches rhythm of other sections */}
            <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-4">
              <span className="block w-5 h-px bg-[var(--color-accent)] shrink-0" />
              {t.products_section.eyebrow}
            </span>
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] mb-4">
              {t.products_section.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-xl leading-relaxed">
              {t.products_section.subtitle}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 md:gap-8">
          {t.products_section.items.map((product, idx) => (
            <ScrollReveal
              key={product.slug}
              delay={idx * 0.08}
              className="col-span-1 md:col-span-2"
            >
              <Link
                href={`/${lang}/products/${product.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)]"
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                  <span className="text-xs font-semibold text-[var(--color-accent)] opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                    {t.products_section.item_cta} →
                  </span>
                </div>

                {/* Mobile content: always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5 md:hidden">
                  <h3 className="font-display font-bold text-sm text-white leading-tight line-clamp-2">
                    {product.title}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--color-accent)]">
                    {t.products_section.item_cta} →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {/* Section footer CTA */}
        <div className="mt-8 md:mt-10">
          <Link
            href={`/${lang}/portfolio`}
            className="inline-flex items-center text-base font-semibold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors duration-200"
          >
            {t.products_section.view_portfolio}
          </Link>
        </div>
      </div>
    </section>
  )
}
