// Reviewed 2026-08 for accuracy against the site's actual data flows (forms,
// email processors, analytics). Not a substitute for sign-off by qualified
// legal counsel before launch — the underlying legal judgment calls
// (retention periods, liability language, GDPR basis) still need that review.

import type { Metadata } from 'next'
import SectionWrapper from '@/components/ui/SectionWrapper'
import PageHero from '@/components/ui/PageHero'
import { buildPageMetadata } from '@/lib/metadata'

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
  return buildPageMetadata({
    title: isEn ? 'Privacy Policy — Skat Print' : 'Политика за поверителност — Скат Принт',
    description: isEn
      ? 'How Skat Print collects, uses, and protects your personal data.'
      : 'Как Скат Принт събира, използва и защитава вашите лични данни.',
    path: '/privacy',
    lang,
    noIndex: true,
  })
}

const contentEn = [
  {
    heading: 'Data Controller',
    body: 'Skat Oil EOOD, Village of Trud, 4204, Plovdiv Province, Bulgaria. Email: office@skatoil.com',
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
    heading: 'Third-Party Service Providers',
    body: 'We use the following processors to operate this website and handle enquiries submitted through it: Resend (primary email delivery for form submissions), Formspree (fallback email delivery if Resend is unavailable), and Vercel (website hosting and anonymised analytics). These providers only receive the data needed to perform their function and do not use it for their own marketing purposes.',
  },
  {
    heading: 'Data Retention',
    body: 'Contact enquiry data is retained for up to 3 years. You may request deletion at any time by contacting us.',
  },
  {
    heading: 'Your Rights (GDPR)',
    body: 'Under the General Data Protection Regulation (GDPR), you have the right to access, correct, delete, or restrict processing of your personal data. To exercise these rights, contact office@skatoil.com.',
  },
  {
    heading: 'Cookies & Local Storage',
    body: 'We use Vercel Analytics, a cookieless analytics service that does not set cookies or store personally identifiable information. Our website chatbot uses your browser’s local storage (not cookies) to remember your conversation during a visit; this data stays on your device, is not used for tracking or advertising, and is not shared with third parties.',
  },
  {
    heading: 'Contact',
    body: 'For any privacy-related questions: office@skatoil.com',
  },
]

const contentBg = [
  {
    heading: 'Администратор на лични данни',
    body: 'Скат Ойл ЕООД, с. Труд, 4204, обл. Пловдив, България. Имейл: office@skatoil.com',
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
    heading: 'Доставчици на услуги (трети страни)',
    body: 'Използваме следните обработващи лични данни за работата на уебсайта и обработката на запитвания: Resend (основна услуга за изпращане на имейли от формите), Formspree (резервна услуга за изпращане на имейли при недостъпност на Resend) и Vercel (хостинг на уебсайта и анонимизирани анализи). Тези доставчици получават само данните, необходими за изпълнение на функцията им, и не ги използват за собствени маркетингови цели.',
  },
  {
    heading: 'Срок на съхранение',
    body: 'Данните от запитвания се съхраняват до 3 години. Можете да поискате изтриване по всяко време, като се свържете с нас.',
  },
  {
    heading: 'Вашите права (GDPR)',
    body: 'По силата на Общия регламент за защита на данните (GDPR) имате право на достъп, коригиране, изтриване или ограничаване на обработката на вашите лични данни. За упражняване на тези права: office@skatoil.com.',
  },
  {
    heading: 'Бисквитки и локално съхранение',
    body: 'Използваме Vercel Analytics — аналитична услуга без бисквитки, която не съхранява лично идентифицираща информация. Чатботът на нашия уебсайт използва локалното съхранение на браузъра ви (не бисквитки), за да запомни разговора ви по време на посещението; тези данни остават на вашето устройство, не се използват за проследяване или реклама и не се споделят с трети страни.',
  },
  {
    heading: 'Контакт',
    body: 'За въпроси, свързани с поверителността: office@skatoil.com',
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
          {isEn ? 'Last updated: August 2026' : 'Последна актуализация: август 2026'}
        </p>
      </SectionWrapper>
    </>
  )
}
