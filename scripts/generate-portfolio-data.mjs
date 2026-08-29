// Generates src/lib/portfolio-data.ts from the curation manifest
// (scripts/portfolio-manifest.mjs) plus the real pixel dimensions of the
// optimized files under public/assets/portfolio/.
//
// The manifest is the single source of truth: src paths, bilingual alt text and
// category all come from it, and width/height are measured off the files that
// scripts/optimize-portfolio-images.mjs produced. Those dimensions let
// PortfolioGrid.tsx render every tile at its true aspect ratio in the CSS
// multi-column masonry without cropping or distortion.
//
// Run scripts/optimize-portfolio-images.mjs first — this script reads the files
// it writes. Never hand-edit src/lib/portfolio-data.ts; edit the manifest and
// re-run both scripts.
//
// Usage: node scripts/generate-portfolio-data.mjs

import sharp from 'sharp'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifest } from './portfolio-manifest.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(REPO_ROOT, 'src', 'lib', 'portfolio-data.ts')
const PUBLIC_ROOT = path.join(REPO_ROOT, 'public')

// Order of the blocks in the generated file, with the heading used in each
// block's count comment.
const CATEGORIES = [
  ['pos-displays', 'POS Displays'],
  ['food-packaging', 'Food Packaging'],
  ['alcohol-packaging', 'Alcohol Packaging'],
  ['cosmetics-packaging', 'Cosmetics Packaging'],
  ['custom-packaging', 'Custom Packaging'],
]

// Emit a single-quoted TS string literal, escaping backslashes and apostrophes
// (several alt strings contain words like "children's").
function quote(value) {
  const escaped = String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
  return `'${escaped}'`
}

async function run() {
  const byCategory = new Map(CATEGORIES.map(([slug]) => [slug, []]))

  for (const entry of manifest) {
    const bucket = byCategory.get(entry.category)
    if (!bucket) {
      throw new Error(`Unknown category '${entry.category}' for ${entry.dest}`)
    }

    const src = `/assets/portfolio/${entry.category}/${entry.dest}`
    const { width, height } = await sharp(path.join(PUBLIC_ROOT, src)).metadata()
    if (!width || !height) {
      throw new Error(`Could not read dimensions for ${src}`)
    }

    // Manifest order is preserved; the manifest lists each category's hero first.
    bucket.push({ entry, src, width, height })
  }

  const lines = [
    'export type PortfolioCategory =',
    ...CATEGORIES.map(([slug]) => `  | '${slug}'`),
    '',
    'export interface PortfolioItem {',
    '  src: string',
    '  alt: string',
    '  altBg: string',
    '  category: PortfolioCategory',
    '  // Real pixel dimensions of the optimized file, used to render each gallery',
    '  // tile at its true aspect ratio (no cropping/distortion) in PortfolioGrid.tsx.',
    '  width: number',
    '  height: number',
    '}',
    '',
    '// GENERATED FILE — do not edit by hand.',
    '// Source of truth: scripts/portfolio-manifest.mjs',
    '// Regenerate with:',
    '//   node scripts/optimize-portfolio-images.mjs',
    '//   node scripts/generate-portfolio-data.mjs',
    'export const portfolioItems: PortfolioItem[] = [',
  ]

  let total = 0
  for (const [slug, heading] of CATEGORIES) {
    const items = byCategory.get(slug)
    total += items.length
    lines.push(`  // ${heading} (${items.length})`)
    for (const { entry, src, width, height } of items) {
      lines.push(
        `  { src: ${quote(src)}, alt: ${quote(entry.alt)}, altBg: ${quote(entry.altBg)}, ` +
          `category: '${slug}', width: ${width}, height: ${height} },`
      )
    }
    lines.push('')
  }

  // Drop the trailing blank line before the closing bracket.
  lines.pop()
  lines.push(']', '')

  await writeFile(DATA_FILE, lines.join('\n'), 'utf-8')
  console.log(`Wrote ${total} portfolio items to ${path.relative(REPO_ROOT, DATA_FILE)}`)
  for (const [slug, heading] of CATEGORIES) {
    console.log(`  ${heading.padEnd(21)} ${byCategory.get(slug).length}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
