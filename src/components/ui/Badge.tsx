interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export default function Badge({ children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-sm)] text-xs font-condensed font-semibold uppercase tracking-wide bg-[var(--color-bg)] text-[var(--color-accent)] border border-[var(--color-accent)]/30 ${className}`}
    >
      {children}
    </span>
  )
}
