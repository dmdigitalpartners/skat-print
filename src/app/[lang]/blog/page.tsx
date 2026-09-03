import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LANGS } from '@/config/routes'
import { FEATURES } from '@/config/features'
import { getAllPosts } from '@/lib/blog'
import { buildPageMetadata } from '@/lib/metadata'

export async function generateStaticParams() {
  // Blog is withheld from production — see src/config/features.ts. No
  // params means Next never prerenders these routes.
  if (!FEATURES.blog) return []
  return LANGS.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  if (!FEATURES.blog) return { robots: { index: false, follow: false } }
  const { lang } = await params
  const isBg = lang === 'bg'
  return buildPageMetadata({
    title: isBg ? 'Блог — Скат Принт' : 'Blog — Skat Print',
    description: isBg
      ? 'Ръководства и статии за опаковки, печат и производство от екипа на Скат Принт.'
      : 'Packaging guides, production insights, and industry articles from the Skat Print team.',
    path: '/blog',
    lang,
  })
}

export default async function BlogIndexPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  if (!FEATURES.blog) notFound()
  const { lang } = await params
  const isBg = lang === 'bg'
  const posts = getAllPosts(lang)

  return (
    <div className="container-site py-16 md:py-24 max-w-3xl mx-auto">
      <div className="mb-12">
        <span className="inline-flex items-center gap-2 text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent-text)] mb-4">
          <span className="block w-5 h-px bg-[var(--color-accent)]" />
          {isBg ? 'Ресурси' : 'Resources'}
        </span>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-[var(--color-text)]">
          {isBg ? 'Блог' : 'Packaging Insights'}
        </h1>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--color-text-muted)]">
          {isBg ? 'Скоро ще бъдат публикувани статии.' : 'Articles coming soon.'}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--color-border)]">
          {posts.map(post => (
            <article key={post.slug} className="py-8 first:pt-0">
              <p className="text-xs font-condensed font-semibold uppercase tracking-widest text-[var(--color-accent)] mb-2">
                {post.category}
              </p>
              <Link
                href={`/${lang}/blog/${post.slug}`}
                className="group block"
              >
                <h2 className="font-display font-bold text-xl text-[var(--color-text)] group-hover:text-[var(--color-accent)] transition-colors mb-2">
                  {post.title}
                </h2>
              </Link>
              <p className="text-[var(--color-text-muted)] leading-relaxed mb-3">
                {post.description}
              </p>
              <div className="flex items-center justify-between">
                <time className="text-xs text-[var(--color-text-muted)]" dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
                <Link
                  href={`/${lang}/blog/${post.slug}`}
                  className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                >
                  {isBg ? 'Прочети →' : 'Read →'}
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
