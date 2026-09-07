'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Lang } from '@/lib/useTranslation'

interface Props {
  lang: Lang
  variant?: 'dark' | 'light'
}

const LANGS: Lang[] = ['bg', 'en']

/**
 * Swap the leading locale segment, keeping the rest of the path.
 *
 * Every route is /{lang}/... (see src/proxy.ts, which redirects anything else),
 * so this is a prefix swap rather than a route lookup — no route names are
 * hardcoded. The `(?=\/|$)` boundary matters: without it a path such as
 * /bgsomething would have its first two characters rewritten.
 */
export function swapLangPath(pathname: string | null, target: Lang): string {
  if (!pathname || pathname === '/') return `/${target}`
  const swapped = pathname.replace(/^\/(bg|en)(?=\/|$)/, `/${target}`)
  // Anything that did not start with a locale (shouldn't reach here) falls
  // back to that locale's home rather than producing a broken URL.
  return swapped.startsWith(`/${target}`) ? swapped : `/${target}`
}

export default function LanguageToggle({ lang, variant = 'dark' }: Props) {
  const pathname = usePathname()

  // Both the dark- and light-navbar variants render identically once
  // expressed as tokens (they used to be separately hardcoded hex values
  // that happened to duplicate --color-border/--color-text-muted/--color-text).
  void variant
  const borderCls = 'border-[var(--color-border)]'
  const inactiveCls = 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'

  return (
    <div
      aria-label="Switch language"
      className={`flex items-center rounded-full border overflow-hidden text-sm font-medium ${borderCls}`}
    >
      {LANGS.map((l) => {
        const isActive = lang === l
        return (
          // Real links, not buttons with router.push: crawlers can follow the
          // alternate-language URL, and the usual browser affordances
          // (middle-click, open in new tab, copy link) work.
          <Link
            key={l}
            href={swapLangPath(pathname, l)}
            hrefLang={l}
            scroll={false}
            aria-current={isActive ? 'page' : undefined}
            className={`px-3 py-1 transition-colors duration-200 uppercase tracking-wide ${
              isActive ? 'bg-[var(--color-accent-text)] text-white' : inactiveCls
            }`}
          >
            {l}
          </Link>
        )
      })}
    </div>
  )
}
