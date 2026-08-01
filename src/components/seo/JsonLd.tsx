import type { Lang } from '@/lib/useTranslation'

export default function JsonLd({ lang }: { lang: Lang }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Organization'],
    name: 'Skat Print',
    alternateName: 'Скат Принт',
    url: 'https://skatprint.bg',
    logo: {
      '@type': 'ImageObject',
      url: 'https://skatprint.bg/assets/logos/logo-en-new.png',
    },
    description:
      lang === 'bg'
        ? 'Производство на гофрирани опаковки, POS дисплеи и решения за печат от 1995 г. с. Труд, Пловдив.'
        : 'Custom corrugated packaging, POS displays and print solutions since 1995. Village of Trud, Plovdiv.',
    foundingDate: '1995',
    address: [
      {
        '@type': 'PostalAddress',
        addressLocality: 'Village of Trud',
        addressRegion: 'Plovdiv',
        addressCountry: 'BG',
        streetAddress: 'Stopanski dvor No. 2',
      },
      {
        '@type': 'PostalAddress',
        addressLocality: 'Hisarya',
        addressCountry: 'BG',
        streetAddress: '8 Yordan Yovkov St',
      },
    ],
    telephone: ['+359888351553', '+359887461028'],
    email: 'office@skatoil.com', // intentional fallback — parent company (Skat Oil)
    priceRange: '$$',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+359888351553',
      availableLanguage: ['English', 'Bulgarian'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
