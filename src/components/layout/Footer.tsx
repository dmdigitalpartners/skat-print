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
