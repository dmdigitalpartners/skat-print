import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { LANGS } from '@/config/routes'
import { getPost, getPostSlugs } from '@/lib/blog'
import { buildPageMetadata } from '@/lib/metadata'
import { SITE_URL } from '@/config/site'

export async function generateStaticParams() {
  return LANGS.flatMap(lang =>
    getPostSlugs(lang).map(slug => ({ lang, slug }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const post = getPost(lang, slug)
  if (!post) return {}
  return buildPageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${slug}`,
    lang,
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const post = getPost(lang, slug)
  if (!post) notFound()

  const isBg = lang === 'bg'

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: isBg ? 'bg' : 'en',
    url: `${SITE_URL}/${lang}/blog/${slug}`,
    publisher: { '@type': 'Organization', name: 'Skat Print', url: SITE_URL },
  }

  return (
    <div className="container-site py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-xs text-[var(--color-text-muted)]">
          <Link href={`/${lang}/blog`} className="hover:text-[var(--color-text)] transition-colors">
            {isBg ? '← Блог' : '← Blog'}
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-3">
            {post.category}
          </p>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text)] leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg leading-relaxed mb-4">
            {post.description}
          </p>
          <time
            className="text-xs text-[var(--color-text-muted)]"
            dateTime={post.date}
          >
            {new Date(post.date).toLocaleDateString(isBg ? 'bg-BG' : 'en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </header>

        {/* MDX content */}
        <div className="prose prose-neutral max-w-none [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-[var(--color-text)] [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-semibold [&_h3]:text-[var(--color-text)] [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-[var(--color-text)] [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-[var(--color-text)] [&_ol]:text-[var(--color-text)] [&_li]:mb-1.5 [&_strong]:font-semibold [&_strong]:text-[var(--color-text)] [&_a]:text-[var(--color-accent)] [&_a]:underline [&_a]:underline-offset-2 [&_table]:w-full [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-[var(--color-text-muted)] [&_th]:pb-2 [&_th]:border-b [&_th]:border-[var(--color-border)] [&_td]:py-2 [&_td]:border-b [&_td]:border-[var(--color-border)] [&_td]:text-[var(--color-text)] [&_td]:text-sm [&_hr]:border-[var(--color-border)] [&_hr]:my-8">
          <MDXRemote source={post.content} />
        </div>

        {/* Footer CTA */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row gap-4">
          <Link
            href={`/${lang}/samples`}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] bg-[var(--color-accent-text)] text-white font-semibold text-sm hover:bg-[var(--color-accent-hover)] transition-[background-color] shadow-[var(--shadow-accent)]"
          >
            {isBg ? 'Заявете мостри →' : 'Request Free Samples →'}
          </Link>
          <Link
            href={`/${lang}/contact`}
            className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-[var(--radius-md)] border border-[var(--color-border)] text-[var(--color-text)] text-sm font-medium hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-[border-color,color]"
          >
            {isBg ? 'Свържете се с нас' : 'Contact Our Team'}
          </Link>
        </div>
      </div>
    </div>
  )
}
