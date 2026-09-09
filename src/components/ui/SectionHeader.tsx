import type { ReactNode } from 'react'

/**
 * The shared top-of-section block: eyebrow + H2 + optional description.
 *
 * Every homepage section used to hand-roll this, and the five copies had drifted
 * apart on eyebrow colour, eyebrow margin (mb-4 / mb-5 / mb-6), heading size,
 * description measure, and whether the accent rule was there at all. This is the
 * single definition; sections pass content and pick a tone/alignment.
 *
 * `tone` matters for contrast, not taste: on light backgrounds small accent text
 * must use --color-accent-text (#007CAB, the WCAG-AA variant), while on dark
 * backgrounds the brighter --color-accent (#0098D4) is the correct one.
 *
 * The page-level equivalent for <h1> banners is PageHero.tsx.
 */
interface SectionHeaderProps {
  eyebrow?: string
  heading: string
  description?: string
  /**
   * Shorter wording for mobile. When present, this renders below md and
   * `description` renders from md up. Both are in the DOM but exactly one is
   * displayed, and `display: none` keeps the other out of the accessibility
   * tree, so screen readers announce a single version. Same approach the Hero
   * already uses for its mobile_desc / subheadline pair.
   */
  descriptionShort?: string
  /** center is used by the two full-bleed bands (TrustedBy, CTABanner) */
  align?: 'left' | 'center'
  /** dark = sits on a dark background; light = sits on a light background */
  tone?: 'light' | 'dark'
  /** lg bumps the heading one step, for the closing CTA band only */
  size?: 'default' | 'lg'
  /** overrides the wrapper's bottom margin (Differentiators wants a larger one) */
  className?: string
  /** rendered under the description, inside the same centred column */
  children?: ReactNode
}

export default function SectionHeader({
  eyebrow,
  heading,
  description,
  descriptionShort,
  align = 'left',
  tone = 'light',
  size = 'default',
  className = 'mb-10 md:mb-12',
  children,
}: SectionHeaderProps) {
  const centered = align === 'center'
  const accent = tone === 'dark' ? 'var(--color-accent)' : 'var(--color-accent-text)'
  const headingColor = tone === 'dark' ? 'text-white' : 'text-[var(--color-text)]'
  const bodyColor = tone === 'dark' ? 'text-white/70' : 'text-[var(--color-text-muted)]'

  const rule = <span className="block w-5 h-px shrink-0" style={{ backgroundColor: accent }} />

  const descriptionCls = `leading-relaxed ${bodyColor} ${centered ? 'mx-auto' : ''} ${
    size === 'lg' ? 'text-lg md:text-xl max-w-2xl' : 'text-base md:text-lg max-w-xl'
  }`

  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      {eyebrow && (
        <span
          className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest mb-5"
          style={{ color: accent }}
        >
          {rule}
          {eyebrow}
          {centered && rule}
        </span>
      )}

      <h2
        className={`font-display font-bold tracking-tight leading-[1.05] md:text-balance ${headingColor} ${
          size === 'lg' ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl' : 'text-3xl sm:text-4xl md:text-5xl'
        } ${description || children ? 'mb-4 md:mb-5' : ''} ${centered ? 'mx-auto max-w-3xl md:max-w-4xl lg:max-w-5xl' : ''}`}
      >
        {heading}
      </h2>

      {description &&
        (descriptionShort ? (
          <>
            <p className={`${descriptionCls} md:hidden`}>{descriptionShort}</p>
            <p className={`${descriptionCls} hidden md:block`}>{description}</p>
          </>
        ) : (
          <p className={descriptionCls}>{description}</p>
        ))}

      {children}
    </div>
  )
}
