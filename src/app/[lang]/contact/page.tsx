import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import { buildPageMetadata } from '@/lib/metadata'
import ContactForm from '@/components/sections/ContactForm'
import PageHero from '@/components/ui/PageHero'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const t = getTranslation(lang)
  return buildPageMetadata({
    title: t.meta.contact.title,
    description: t.meta.contact.description,
    path: '/contact',
    lang,
  })
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const c = t.contact_page

  // Google Maps embed URLs
  // Location 1: Skat Oil, Village of Trud — confirmed place marker
  // Location 2: Hisarya town — client should replace with the exact embed from maps.google.com
  const mapUrls = [
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2954.2639319840077!2d24.74342557699157!3d42.23017404329628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14acd29875d1e3af%3A0x25100bef58fdf254!2sSkat%20Oil!5e0!3m2!1sen!2sbg!4v1780901068002!5m2!1sen!2sbg',
    'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d11763.095604620705!2d24.7269473!3d42.5176126!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40a9ea7a27aacb85%3A0x270f2a0e104a0f49!2z0KHQutCw0YIg0J7QudC7!5e0!3m2!1sen!2sbg!4v1780901119602!5m2!1sen!2sbg',
  ]

  return (
    <>
      <PageHero eyebrow={t.nav.contact} heading={c.heading} intro={c.subheading} />

      <div className="bg-[var(--color-bg)] section-padding">
        <div className="container-site">
          {/* Two-column: form left, contact info right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-12 lg:mb-20">
            {/* Form */}
            <div>
              <ContactForm t={t} />
            </div>

            {/* Emails + Phones */}
            <div className="space-y-8 lg:self-center">
              {/* Emails */}
              <div>
                <h2 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                  {c.email_heading}
                </h2>
                <div className="flex flex-col gap-2">
                  {Object.values(t.footer.emails).map((email) => (
                    <a
                      key={email}
                      href={`mailto:${email}`}
                      className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-150"
                    >
                      {email}
                    </a>
                  ))}
                </div>
              </div>

              {/* Phones by office */}
              <div className="pt-8 border-t border-[var(--color-border)]">
                <h2 className="font-display font-bold text-sm uppercase tracking-widest text-[var(--color-text-muted)] mb-3">
                  {c.phone_heading}
                </h2>
                <div className="space-y-6">
                  {c.locations.map((loc) => (
                    <div key={loc.name}>
                      <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-1">
                        {loc.name}
                      </p>
                      <a
                        href={`tel:${loc.phone.replace(/\s/g, '')}`}
                        className="text-sm text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-150"
                      >
                        {loc.phone}
                      </a>
                      <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{loc.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Maps — full width below */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {c.locations.map((loc, i) => (
              <div key={loc.name}>
                <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                  {loc.name}
                </p>
                <div className="rounded-[var(--radius-md)] overflow-hidden h-56 md:h-72 bg-[var(--color-bg-surface)]">
                  <iframe
                    src={mapUrls[i]}
                    title={loc.map_title}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
