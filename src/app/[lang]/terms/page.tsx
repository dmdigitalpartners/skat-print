// TODO: replace placeholder content with actual terms of service reviewed by legal counsel

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
    title: isEn ? 'Terms of Use — Skat Print' : 'Условия за ползване — Скат Принт',
    description: isEn
      ? 'Terms governing your use of the Skat Print website and services.'
      : 'Условия, регулиращи използването на уебсайта и услугите на Скат Принт.',
    robots: { index: false },
    alternates: {
      canonical: `/${lang}/terms`,
      languages: { en: '/en/terms', bg: '/bg/terms' },
    },
  }
}

const contentEn = [
  {
    heading: 'Acceptance of Terms',
    body: 'By accessing the Skat Print website, you agree to these terms of use. If you do not agree, please do not use this website.',
  },
  {
    heading: 'Use of Website',
    body: 'This website is intended for B2B enquiries related to custom packaging and POS display manufacturing. All content is provided for informational purposes only.',
  },
  {
    heading: 'Intellectual Property',
    body: 'All content on this website — including text, images, logos, and design — is the property of Skat Print Ltd and is protected by Bulgarian and EU copyright law. You may not reproduce or redistribute any content without written permission.',
  },
  {
    heading: 'Accuracy of Information',
    body: 'We strive to keep information accurate and up to date. However, Skat Print makes no warranties about the completeness or accuracy of the content on this website.',
  },
  {
    heading: 'Limitation of Liability',
    body: 'Skat Print is not liable for any damages arising from your use of this website or reliance on information provided herein.',
  },
  {
    heading: 'Governing Law',
    body: 'These terms are governed by the laws of the Republic of Bulgaria. Any disputes shall be subject to the jurisdiction of Bulgarian courts.',
  },
  {
    heading: 'Changes to Terms',
    body: 'We reserve the right to update these terms at any time. Continued use of the website constitutes acceptance of the updated terms.',
  },
  {
    heading: 'Contact',
    body: 'For questions about these terms: office@skat-print.com',
  },
]

const contentBg = [
  {
    heading: 'Приемане на условията',
    body: 'Достъпвайки уебсайта на Скат Принт, вие се съгласявате с тези условия за ползване. Ако не сте съгласни, моля не използвайте уебсайта.',
  },
  {
    heading: 'Използване на уебсайта',
    body: 'Уебсайтът е предназначен за B2B запитвания, свързани с производство на персонализирани опаковки и POS дисплеи. Цялото съдържание е предоставено само с информационна цел.',
  },
  {
    heading: 'Интелектуална собственост',
    body: 'Цялото съдържание на уебсайта — включително текстове, изображения, лога и дизайн — е собственост на Скат Принт ЕООД и е защитено от авторското право на България и ЕС. Не може да се възпроизвежда или разпространява без писмено разрешение.',
  },
  {
    heading: 'Точност на информацията',
    body: 'Стремим се информацията да бъде точна и актуална. Скат Принт не дава гаранции за пълнотата или точността на съдържанието.',
  },
  {
    heading: 'Ограничаване на отговорността',
    body: 'Скат Принт не носи отговорност за щети, произтичащи от използването на уебсайта или от разчитане на предоставената информация.',
  },
  {
    heading: 'Приложимо право',
    body: 'Тези условия се регулират от законодателството на Република България. Всички спорове са подсъдни на български съдилища.',
  },
  {
    heading: 'Промени в условията',
    body: 'Запазваме правото да актуализираме условията по всяко време. Продължаващото използване на уебсайта означава приемане на актуализираните условия.',
  },
  {
    heading: 'Контакт',
    body: 'За въпроси относно тези условия: office@skat-print.com',
  },
]

export default async function TermsPage({
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
        heading={isEn ? 'Terms of Use' : 'Условия за ползване'}
        intro={
          isEn
            ? 'Terms governing your use of this website and our services.'
            : 'Условия, регулиращи използването на уебсайта и нашите услуги.'
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
