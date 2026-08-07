import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export interface PostMeta {
  title: string
  description: string
  date: string
  slug: string
  category: string
  lang: string
}

export interface Post extends PostMeta {
  content: string
}

export function getPostSlugs(lang: string): string[] {
  const dir = path.join(BLOG_DIR, lang)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => f.replace(/\.mdx$/, ''))
}

export function getPost(lang: string, slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, lang, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    slug: data.slug ?? slug,
    category: data.category ?? '',
    lang,
    content,
  }
}

export function getAllPosts(lang: string): PostMeta[] {
  return getPostSlugs(lang)
    .map(slug => {
      const post = getPost(lang, slug)
      if (!post) return null
      // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to omit `content` from the returned meta
      const { content: _, ...meta } = post
      return meta
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.date > b.date ? -1 : 1))
}
