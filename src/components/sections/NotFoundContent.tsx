import Link from 'next/link'
import { getTranslation, type Lang } from '@/lib/useTranslation'

export default function NotFoundContent({ lang }: { lang: Lang }) {
  const t = getTranslation(lang)

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center px-4">
        <div className="font-display font-bold text-8xl md:text-9xl text-[var(--color-accent)] mb-4">404</div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-text)] mb-4">
          {t.not_found.heading}
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
          {t.not_found.body}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {t.not_found.cta}
          </Link>
          <Link
            href={`/${lang}/services`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t.nav.services}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t.nav.contact}
          </Link>
        </div>
      </div>
    </div>
  )
}
