import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/ui/Chatbot'
import JsonLd from '@/components/seo/JsonLd'
import { getTranslation } from '@/lib/useTranslation'
import type { Lang } from '@/lib/useTranslation'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }]
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const t = getTranslation(lang)
  const currentLang = (lang === 'bg' ? 'bg' : 'en') as Lang

  return (
    <>
      <JsonLd lang={currentLang} />
      <Navbar t={t} lang={currentLang} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
      <Footer t={t} lang={currentLang} />
      <Chatbot t={t} lang={currentLang} />
      <Analytics />
    </>
  )
}
