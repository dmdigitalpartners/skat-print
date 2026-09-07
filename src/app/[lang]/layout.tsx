import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import DesktopChatbot from '@/components/ui/DesktopChatbot'
import MobileConversionBar from '@/components/ui/MobileConversionBar'
import JsonLd from '@/components/seo/JsonLd'
import HtmlLang from '@/components/ui/HtmlLang'
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
      <HtmlLang lang={currentLang} />
      <JsonLd lang={currentLang} />
      <Navbar t={t} lang={currentLang} />
      <main className="flex-1 overflow-x-hidden pb-[calc(var(--mobile-bar-height)+env(safe-area-inset-bottom)+16px)] md:pb-0">{children}</main>
      <Footer t={t} lang={currentLang} />
      <DesktopChatbot t={t} lang={currentLang} />
      <MobileConversionBar t={t} />
      <Analytics />
    </>
  )
}
