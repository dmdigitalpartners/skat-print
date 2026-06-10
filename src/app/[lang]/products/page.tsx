import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }]
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  redirect(`/${lang}#products`)
}
