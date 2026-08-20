import type { Lang } from '@/lib/useTranslation'
import { SITE_URL } from '@/config/site'
import { CONTACT } from '@/config/contact'

export default function JsonLd({ lang }: { lang: Lang }) {
  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Organization'],
    name: 'Skat Print',
    alternateName: 'Скат Принт',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/assets/logos/${lang === 'bg' ? 'logo-bg-new.png' : 'logo-en-new.png'}`,
    },
    description:
      lang === 'bg'
        ? 'Производство на опаковки от велпапе, POS дисплеи и решения за печат от 1995 г. с. Труд, Пловдив.'
        : 'Custom corrugated packaging, POS displays and print solutions since 1995. Village of Trud, Plovdiv.',
    foundingDate: '1995',
    // Customer-facing office only — schema.org doesn't cleanly support an
    // address array on a single LocalBusiness node. The Hisarya production
    // site is still fully listed on the Contact page, just not duplicated
    // here into a shape Google's structured-data guidance doesn't recognize.
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Village of Trud',
      addressRegion: 'Plovdiv',
      addressCountry: 'BG',
      streetAddress: 'Stopanski dvor No. 2',
    },
    telephone: [CONTACT.phone_primary, CONTACT.phone_secondary],
    email: CONTACT.email,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: CONTACT.phone_primary,
      availableLanguage: ['English', 'Bulgarian'],
    },
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Skat Print',
    url: SITE_URL,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
