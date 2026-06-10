import Link from 'next/link'
import SectionWrapper from '@/components/ui/SectionWrapper'
import ScrollReveal from '@/components/ui/ScrollReveal'
import type { Translation, Lang } from '@/lib/useTranslation'

interface Props {
  t: Translation
  lang: Lang
}

export default function ServicesGrid({ t, lang }: Props) {
  return (
    <SectionWrapper>
      <div className="mb-10 md:mb-14">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-[var(--color-text)] mb-4">
          {t.products_section.title}
        </h2>
        <p className="text-[var(--color-text-muted)] text-lg max-w-2xl leading-relaxed">
          {t.products_section.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {t.products_section.items.map((product, i) => (
          <ScrollReveal key={product.slug} delay={i * 0.08}>
            <Link
              href={`/${lang}/products/${product.slug}`}
              className="group flex flex-col h-full p-6 md:p-8 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] hover:border-[var(--color-accent)]/50 hover:shadow-[var(--shadow-accent)] transition-[border-color,box-shadow] duration-300"
            >
              <h3 className="font-display font-bold text-xl text-[var(--color-text)] mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                {product.title}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed mb-4 flex-1">
                {product.description}
              </p>
              <span className="mt-auto text-xs font-condensed font-semibold uppercase tracking-wide text-[var(--color-accent)] flex items-center gap-1">
                {t.products_section.cta}
                <span aria-hidden>→</span>
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  )
}
