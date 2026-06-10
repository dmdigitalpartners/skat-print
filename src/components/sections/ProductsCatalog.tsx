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
            <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] mb-4">
              {t.products_section.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg max-w-xl leading-relaxed">
              {t.products_section.subtitle}
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5">
          {t.products_section.items.map((product, idx) => (
            <ScrollReveal
              key={product.slug}
              delay={idx * 0.08}
              className={idx < 3 ? 'col-span-1 md:col-span-2' : 'col-span-1 md:col-span-3'}
            >
              <Link
                href={`/${lang}/products/${product.slug}`}
                className="group relative block aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-bg-surface)]"
              >
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading={idx < 2 ? 'eager' : 'lazy'}
                />

                {/* Desktop: bottom-to-top gradient */}
                <div className="absolute inset-0 hidden md:block bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                {/* Mobile: bottom-to-top gradient */}
                <div className="absolute inset-0 md:hidden bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Desktop content: bottom-anchored strip */}
                <div className="absolute bottom-0 left-0 right-0 hidden md:flex flex-col gap-1.5 px-5 pb-5">
                  <h3 className="font-display font-bold text-base text-white truncate">
                    {product.title}
                  </h3>
                  <p className="text-white/75 text-xs truncate">
                    {product.description}
                  </p>
                  <span className="text-xs font-semibold text-[var(--color-accent)] transition-opacity duration-200 group-hover:opacity-75">
                    {t.products_section.item_cta} →
                  </span>
                </div>

                {/* Mobile content: bottom strip */}
                <div className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-1.5 md:hidden">
                  <h3 className="font-display font-bold text-sm text-white leading-tight line-clamp-2">
                    {product.title}
                  </h3>
                  <span className="text-xs font-semibold text-[var(--color-accent)] transition-opacity duration-200 group-hover:opacity-75">
                    {t.products_section.item_cta} →
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
