'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getTranslation } from '@/lib/useTranslation'

export default function NotFound() {
  const pathname = usePathname() ?? ''
  const lang = pathname.startsWith('/en') ? 'en' : 'bg'
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
        <Link
          href={`/${lang}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          {t.not_found.cta}
        </Link>
      </div>
    </div>
  )
}
