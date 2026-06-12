// TODO: replace placeholder content with actual privacy policy reviewed by legal counsel

import type { Metadata } from 'next'
import { getTranslation } from '@/lib/useTranslation'
import SectionWrapper from '@/components/ui/SectionWrapper'
import PageHero from '@/components/ui/PageHero'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const isEn = lang !== 'bg'
  return {
    title: isEn ? 'Privacy Policy — Skat Print' : 'Политика за поверителност — Скат Принт',
    description: isEn
      ? 'How Skat Print collects, uses, and protects your personal data.'
      : 'Как Скат Принт събира, използва и защитава вашите лични данни.',
    robots: { index: false },
    alternates: {
      canonical: `/${lang}/privacy`,
      languages: { en: '/en/privacy', bg: '/bg/privacy' },
    },
  }
}

const contentEn = [
  {
    heading: 'Data Controller',
    body: 'Skat Print Ltd (EIK 115088421), Village of Trud, 4204, Plovdiv Province, Bulgaria. Email: office@skat-print.com',
  },
  {
    heading: 'What Data We Collect',
    body: 'We collect contact information (name, company, email, phone) submitted through our contact and sample-request forms. We also collect anonymised website analytics data.',
  },
  {
    heading: 'How We Use Your Data',
    body: 'Your data is used solely to respond to your enquiry and provide the requested service. We do not sell, rent, or share your personal data with third parties for marketing purposes.',
  },
  {
    heading: 'Data Retention',
    body: 'Contact enquiry data is retained for up to 3 years. You may request deletion at any time by contacting us.',
  },
  {
    heading: 'Your Rights (GDPR)',
    body: 'Under the General Data Protection Regulation (GDPR), you have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact office@skat-print.com.',
  },
  {
    heading: 'Cookies',
    body: 'We use anonymous analytics cookies (Vercel Analytics). No personally identifiable information is stored in cookies. You can disable cookies in your browser settings.',
  },
  {
    heading: 'Contact',
    body: 'For any privacy-related questions: office@skat-print.com',
  },
]

const contentBg = [
  {
    heading: 'Администратор на лични данни',
    body: 'Скат Принт ЕООД (ЕИК 115088421), с. Труд, 4204, обл. Пловдив, България. Имейл: office@skat-print.com',
  },
  {
    heading: 'Какви данни събираме',
    body: 'Събираме данни за контакт (имена, компания, имейл, телефон), предоставени чрез формите за контакт и заявка за мостри. Събираме и анонимизирани данни за уеб анализи.',
  },
  {
    heading: 'Как използваме данните ви',
    body: 'Вашите данни се използват единствено за отговор на вашето запитване и предоставяне на исканата услуга. Ние не продаваме, отдаваме под наем или споделяме вашите лични данни с трети страни за маркетингови цели.',
  },
  {
    heading: 'Срок на съхранение',
    body: 'Данните от запитвания се съхраняват до 3 години. Можете да поискате изтриване по всяко време, като се свържете с нас.',
  },
  {
    heading: 'Вашите права (GDPR)',
    body: 'По силата на Общия регламент за защита на данните (GDPR) имате право на достъп, коригиране, изтриване или ограничаване на обработката на вашите лични данни. За упражняване на тези права: office@skat-print.com.',
  },
  {
    heading: 'Бисквитки',
    body: 'Използваме анонимни аналитични бисквитки (Vercel Analytics). В бисквитките не се съхранява лично идентифицираща информация. Можете да деактивирате бисквитките в настройките на браузъра си.',
  },
  {
    heading: 'Контакт',
    body: 'За въпроси, свързани с поверителността: office@skat-print.com',
  },
]

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const isEn = lang !== 'bg'
  const content = isEn ? contentEn : contentBg
  const t = getTranslation(lang)

  return (
    <>
      <PageHero
        eyebrow={isEn ? 'Legal' : 'Правна информация'}
        heading={isEn ? 'Privacy Policy' : 'Политика за поверителност'}
        intro={
          isEn
            ? 'How we collect, use, and protect your personal data.'
            : 'Как събираме, използваме и защитаваме вашите лични данни.'
        }
      />

      <SectionWrapper className="max-w-3xl">
        <div className="space-y-8">
          {content.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display font-bold text-xl text-[var(--color-text)] mb-2">
                {section.heading}
              </h2>
              <p className="text-[var(--color-text-muted)] leading-relaxed">{section.body}</p>
            </div>
          ))}
        </div>
        <p className="mt-12 text-xs text-[var(--color-text-muted)]">
          {isEn ? 'Last updated: June 2025' : 'Последна актуализация: юни 2025'}
        </p>
      </SectionWrapper>
    </>
  )
}
