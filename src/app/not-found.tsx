import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
      <div className="text-center px-4">
        <div className="font-display font-bold text-8xl md:text-9xl text-[var(--color-accent)] mb-4">404</div>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-[var(--color-text)] mb-4">
          Page not found
        </h1>
        <p className="text-[var(--color-text-muted)] mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/bg"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent)] text-white font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
