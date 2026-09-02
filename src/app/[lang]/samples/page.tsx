import { redirect } from 'next/navigation'

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }]
}

// The free-sample offer was withdrawn — SKAT does not send free samples. The
// route is kept as a redirect (not deleted) so existing inbound links and
// bookmarks land on the quote request instead of a 404, matching how
// /products and /portfolio are handled.
export default async function SamplesPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  redirect(`/${lang}/contact`)
}
