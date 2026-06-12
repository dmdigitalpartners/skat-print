import { redirect } from 'next/navigation'
import { VALID_SERVICES, type ServiceSlug } from '@/config/routes'

export function generateStaticParams() {
  const langs = ['en', 'bg']
  return langs.flatMap((lang) =>
    VALID_SERVICES.map((service) => ({ lang, service }))
  )
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ lang: string; service: string }>
}) {
  const { lang, service } = await params
  const validSlug = VALID_SERVICES.includes(service as ServiceSlug) ? service : ''
  redirect(`/${lang}/services${validSlug ? `#${validSlug}` : ''}`)
}
