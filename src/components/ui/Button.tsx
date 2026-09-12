import Link from 'next/link'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost'

interface ButtonProps {
  variant?: Variant
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  'aria-label'?: string
}

const variants: Record<Variant, string> = {
  // --color-accent is too light for white text at 3.26:1 (fails WCAG AA);
  // --color-accent-text was already defined as the WCAG-AA-safe variant
  // (~4.7:1) — reused here as the fill instead of introducing a new color.
  primary:
    'bg-[var(--color-accent-text)] text-white hover:bg-[var(--color-accent-hover)] shadow-[var(--shadow-accent)]',
  secondary:
    'bg-white/10 backdrop-blur-sm border border-white/60 text-white hover:bg-white/20 hover:border-white',
  // Light-surface counterpart to `secondary` — used over the light desktop hero.
  outline:
    'bg-white/50 backdrop-blur-sm border border-[var(--color-primary)]/35 text-[var(--color-primary)] hover:bg-white/80 hover:border-[var(--color-primary)]/70 active:bg-white',
  ghost:
    'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]',
}

const base =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-6 rounded-[var(--radius-md)] font-medium text-sm transition-[background-color,box-shadow,border-color,opacity] duration-200 focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none'

export default function Button({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
  type = 'button',
  disabled,
  'aria-label': ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={cls} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
