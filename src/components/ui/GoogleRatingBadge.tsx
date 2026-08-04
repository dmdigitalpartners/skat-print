import { GOOGLE_RATING } from '@/lib/constants'
import type { Translation } from '@/lib/useTranslation'

const Star = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden>
    <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.8l-5.2 2.72.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
  </svg>
)

export default function GoogleRatingBadge({ t }: { t: Translation }) {
  const content = (
    <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--radius-md)] border border-white/15 bg-white/5">
      <div className="flex gap-0.5 text-[var(--color-accent)]" aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} />
        ))}
      </div>
      <span className="h-3.5 w-px bg-white/20" aria-hidden />
      <span className="font-display font-bold text-sm text-white">{GOOGLE_RATING.score.toFixed(1)}</span>
      <span className="text-xs text-white/60">
        · {GOOGLE_RATING.reviewCount} {t.trusted_by.google_badge_suffix}
      </span>
    </div>
  )

  if (!GOOGLE_RATING.url) return content

  return (
    <a
      href={GOOGLE_RATING.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block hover:opacity-90 transition-opacity duration-200"
    >
      {content}
    </a>
  )
}
