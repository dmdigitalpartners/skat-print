'use client'
import { useRouter, usePathname } from 'next/navigation'
import type { Lang } from '@/lib/useTranslation'

interface Props {
  lang: Lang
  variant?: 'dark' | 'light'
}

export default function LanguageToggle({ lang, variant = 'dark' }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = (target: Lang) => {
    const href = pathname.replace(/^\/(bg|en)/, `/${target}`) || `/${target}`
    router.push(href, { scroll: false })
  }

  const borderCls = variant === 'light' ? 'border-[#DDD9D3]' : 'border-[var(--color-border)]'
  const inactiveCls =
    variant === 'light'
      ? 'text-[#5E6679] hover:text-[#0D1117]'
      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'

  return (
    <div
      aria-label="Switch language"
      className={`flex items-center rounded-full border overflow-hidden text-sm font-medium ${borderCls}`}
    >
      {(['bg', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => handleSwitch(l)}
          className={`px-3 py-1 transition-colors duration-200 uppercase tracking-wide ${
            lang === l ? 'bg-[var(--color-accent)] text-white' : inactiveCls
          }`}
          aria-current={lang === l ? 'page' : undefined}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
