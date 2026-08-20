import Link from 'next/link'
import Image from 'next/image'
import type { Translation, Lang } from '@/lib/useTranslation'

interface Props {
  t: Translation
  lang: Lang
}

export default function Footer({ t, lang }: Props) {
  const base = `/${lang}`

  const navLinks = [
    { href: `${base}#products`, label: t.nav.products },
    { href: `${base}/services`, label: t.nav.services },
    { href: `${base}/about`, label: t.nav.about },
    { href: `${base}/faq`, label: t.nav.faq },
    { href: `${base}/contact`, label: t.nav.contact },
    { href: `${base}/blog`, label: t.nav.blog },
  ]

  return (
    <footer className="bg-[var(--color-bg-surface)] border-t border-[var(--color-border)]">
      <div className="container-site py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 lg:gap-16">
          {/* Brand */}
          <div>
            <Link href={base} className="inline-block mb-5">
              <Image
                src={lang === 'bg' ? '/assets/logos/logo-bg-new.png' : '/assets/logos/logo-en-new.png'}
                alt="Skat Print"
                width={120}
                height={56}
                className="object-contain h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed max-w-xs mb-4">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={t.footer.social_linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.44v6.3zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                {t.footer.social_linkedin_label}
              </a>
              <a
                href={t.footer.social_instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07c-1.28.06-2.15.26-2.91.56-.79.31-1.46.72-2.13 1.38-.66.67-1.07 1.34-1.38 2.13-.3.76-.5 1.63-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13-.67-.66-1.34-1.07-2.13-1.38-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.41-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z" />
                </svg>
                {t.footer.social_instagram_label}
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
              {t.footer.company_title}
            </h3>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-sm font-medium text-[var(--color-text)]">{t.footer.legal_entity}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t.footer.founded}</p>
                <p className="text-xs text-[var(--color-text-muted)]">{t.footer.region}</p>
              </div>
              <div className="flex flex-col gap-1 pt-1 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-text-muted)] font-medium">{t.footer.eik_label}:</span>{' '}
                  {t.footer.eik}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  <span className="text-[var(--color-text-muted)] font-medium">{t.footer.vat_label}:</span>{' '}
                  {t.footer.vat}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
              {t.footer.nav_title}
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-text-muted)] mb-4">
              {t.footer.contact_title}
            </h3>
            <div className="flex flex-col gap-5">
              {t.footer.locations.map((loc) => (
                <div key={loc.name}>
                  <p className="text-sm font-medium text-[var(--color-text)] mb-1">{loc.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">{loc.address}</p>
                  <a
                    href={`tel:${loc.phone.replace(/\s/g, '')}`}
                    className="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors duration-200"
                  >
                    {loc.phone}
                  </a>
                </div>
              ))}
              <div className="flex flex-col gap-1">
                {Object.values(t.footer.emails).map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--color-border)] flex flex-col gap-4">
          {/* EU funded project badge — credibility signal, link placeholder until PDF is provided */}
          <div className="flex items-center gap-2.5">
            {/* EU flag */}
            <div className="flex-none w-7 h-5 rounded-sm overflow-hidden border border-[var(--color-border)]" aria-hidden>
              <div className="w-full h-full bg-[#003399] flex items-center justify-center">
                <span className="text-[6px] text-[#FFCC00] leading-none select-none">★★★★★★★★★★★★</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-[var(--color-text-muted)] leading-none">{t.footer.eu_badge_label}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] opacity-60 leading-none mt-0.5">{t.footer.eu_badge_code}</span>
              <span className="text-[10px] text-[var(--color-text-muted)] opacity-80 leading-snug mt-1 max-w-xs">{t.footer.eu_badge_description}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-[var(--color-text-muted)]">{t.footer.copyright}</p>
            <div className="flex items-center gap-4">
              <Link
                href={`${base}/privacy`}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
              >
                {t.footer.links.privacy}
              </Link>
              <Link
                href={`${base}/terms`}
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors duration-200"
              >
                {t.footer.links.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
