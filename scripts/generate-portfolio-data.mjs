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
import { manifest, POS_GROUP_LABELS } from './portfolio-manifest.mjs'

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
  const categoriesWithGroupHeadings = new Set()

  // Contiguity check state: a `group` slug must appear in one unbroken run
  // across the manifest. If it reappears after the scan has moved on to a
  // different group, a future one-line manifest edit would silently produce
  // a duplicate, non-adjacent heading on the live page — fail the build
  // instead.
  let lastGroup = null
  const seenGroups = new Set()

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

    // pos-displays gallery entries carry a `group` slug that resolves to a
    // bilingual heading label (PortfolioGrid.tsx renders one whenever the
    // group changes between adjacent tiles). Every other entry must NOT
    // have one — fail loud rather than silently rendering a stray heading
    // or silently omitting one that was meant to be there.
    let group
    let groupBg
    if (entry.category === 'pos-displays' && entry.role === 'gallery') {
      if (!entry.group) {
        throw new Error(`Missing 'group' on pos-displays gallery entry ${entry.dest}`)
      }
      const label = POS_GROUP_LABELS[entry.group]
      if (!label) {
        throw new Error(`Unknown pos-displays group slug '${entry.group}' on ${entry.dest}`)
      }
      if (entry.group !== lastGroup) {
        if (seenGroups.has(entry.group)) {
          throw new Error(
            `Non-contiguous pos-displays group '${entry.group}': it reappears after another group. ` +
              `Entries sharing a group must be adjacent in the manifest.`
          )
        }
        seenGroups.add(entry.group)
        lastGroup = entry.group
      }
      group = label.label
      groupBg = label.labelBg
      categoriesWithGroupHeadings.add(entry.category)
    } else if (entry.group) {
      throw new Error(`Unexpected 'group' on non-pos-displays-gallery entry ${entry.dest}`)
    }

    // Manifest order is preserved; the manifest lists each category's hero first.
    bucket.push({ entry, src, width, height, group, groupBg })
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
    '  // Subgroup heading (e.g. "Floor Displays"), set only for categories in',
    '  // categoriesWithGroupHeadings below. PortfolioGrid.tsx renders one whenever',
    '  // this differs from the previous tile\'s group.',
    '  group?: string',
    '  groupBg?: string',
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
    for (const { entry, src, width, height, group, groupBg } of items) {
      const groupFields = group ? ` group: ${quote(group)}, groupBg: ${quote(groupBg)},` : ''
      lines.push(
        `  { src: ${quote(src)}, alt: ${quote(entry.alt)}, altBg: ${quote(entry.altBg)}, ` +
          `category: '${slug}', width: ${width}, height: ${height},${groupFields} },`
      )
    }
    lines.push('')
  }

  // Drop the trailing blank line before the closing bracket.
  lines.pop()
  lines.push(']', '')

  // Derived from the data itself (not hardcoded) so a page component can ask
  // "does this category have subgroup headings?" without a literal string
  // comparison against 'pos-displays'.
  lines.push(
    '// Categories whose gallery tiles carry `group`/`groupBg` and should render',
    '// subgroup headings (see PortfolioGrid.tsx\'s `showGroupHeadings` prop).',
    'export const categoriesWithGroupHeadings: PortfolioCategory[] = [',
    ...[...categoriesWithGroupHeadings].sort().map((slug) => `  '${slug}',`),
    ']',
    ''
  )

  await writeFile(DATA_FILE, lines.join('\n'), 'utf-8')
  console.log(`Wrote ${total} portfolio items to ${path.relative(REPO_ROOT, DATA_FILE)}`)
  for (const [slug, heading] of CATEGORIES) {
    console.log(`  ${heading.padEnd(21)} ${byCategory.get(slug).length}`)
  }
  console.log(`  categoriesWithGroupHeadings: ${[...categoriesWithGroupHeadings].join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
