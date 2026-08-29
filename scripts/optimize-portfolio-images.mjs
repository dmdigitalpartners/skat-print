// Reads the curation manifest (scripts/portfolio-manifest.mjs) and produces optimized,
// web-ready derivatives under public/assets/portfolio/<category>/.
//
// Pipeline per image: auto-orient -> resize (long edge capped at 1600px, never upscale)
// -> normalize to sRGB -> re-encode as mozjpeg quality 80, metadata stripped.
//
// The manifest is validated before anything is written, and files the manifest no longer
// claims are pruned afterwards, so the destination tree always mirrors the manifest exactly.
//
// Usage: node scripts/optimize-portfolio-images.mjs

import sharp from 'sharp'
import { mkdir, stat, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifest } from './portfolio-manifest.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const DEST_ROOT = path.join(REPO_ROOT, 'public', 'assets', 'portfolio')

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 80

// Must stay in sync with the PortfolioCategory union in src/lib/portfolio-data.ts.
const CATEGORIES = [
  'pos-displays',
  'food-packaging',
  'alcohol-packaging',
  'cosmetics-packaging',
  'custom-packaging',
]

// Only these extensions are ever pruned, so a stray README or subdirectory in the
// destination tree is left alone rather than silently deleted.
const PRUNABLE = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`
}

function resolveSource(source) {
  return path.isAbsolute(source) ? source : path.join(REPO_ROOT, source)
}

async function exists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

// Collect every problem before throwing, so one run reports the whole list.
async function validate() {
  const problems = []
  const seenDest = new Map()
  const heroes = new Map()

  for (const [i, entry] of manifest.entries()) {
    const where = `entry ${i} (${entry.dest ?? 'no dest'})`

    if (!CATEGORIES.includes(entry.category)) {
      problems.push(`${where}: unknown category '${entry.category}'`)
      continue
    }
    if (!entry.dest) {
      problems.push(`${where}: missing dest`)
      continue
    }

    const key = `${entry.category}/${entry.dest}`
    if (seenDest.has(key)) {
      problems.push(`${where}: duplicate dest '${key}', first seen at entry ${seenDest.get(key)}`)
    } else {
      seenDest.set(key, i)
    }

    if (!(await exists(resolveSource(entry.source)))) {
      problems.push(`${where}: source not found — ${entry.source}`)
    }

    if (entry.role === 'hero') {
      heroes.set(entry.category, (heroes.get(entry.category) ?? 0) + 1)
    }
  }

  for (const category of CATEGORIES) {
    const count = heroes.get(category) ?? 0
    if (count !== 1) {
      problems.push(`category '${category}': expected exactly 1 hero, found ${count}`)
    }
    if (!manifest.some((entry) => entry.category === category)) {
      problems.push(`category '${category}': no entries in the manifest`)
    }
  }

  if (problems.length > 0) {
    throw new Error(`Manifest is invalid — nothing was written:\n  - ${problems.join('\n  - ')}`)
  }
}

// Delete files the manifest no longer claims, scoped to the known category
// directories and to image extensions only.
async function prune(expected) {
  let removed = 0

  for (const category of CATEGORIES) {
    const dir = path.join(DEST_ROOT, category)
    if (!(await exists(dir))) continue

    for (const item of await readdir(dir, { withFileTypes: true })) {
      if (!item.isFile()) continue
      if (!PRUNABLE.has(path.extname(item.name).toLowerCase())) continue
      if (expected.get(category)?.has(item.name)) continue

      await rm(path.join(dir, item.name))
      console.log(`pruned ${category}/${item.name}`)
      removed++
    }
  }

  return removed
}

async function run() {
  await validate()

  const results = []
  const expected = new Map(CATEGORIES.map((category) => [category, new Set()]))
  let totalBefore = 0
  let totalAfter = 0

  for (const entry of manifest) {
    const destDir = path.join(DEST_ROOT, entry.category)
    await mkdir(destDir, { recursive: true })
    const destPath = path.join(destDir, entry.dest)
    expected.get(entry.category).add(entry.dest)

    const beforeStat = await stat(resolveSource(entry.source))
    totalBefore += beforeStat.size

    await sharp(resolveSource(entry.source))
      .rotate() // auto-orient from EXIF before it's stripped
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toColorspace('srgb')
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(destPath)

    const afterStat = await stat(destPath)
    totalAfter += afterStat.size

    results.push({
      category: entry.category,
      dest: entry.dest,
      before: beforeStat.size,
      after: afterStat.size,
    })

    console.log(
      `${entry.category}/${entry.dest}  ${formatKB(beforeStat.size)} -> ${formatKB(afterStat.size)}`
    )
  }

  const removed = await prune(expected)

  const perCategory = {}
  for (const result of results) {
    perCategory[result.category] ??= { count: 0, bytes: 0 }
    perCategory[result.category].count++
    perCategory[result.category].bytes += result.after
  }

  console.log('\n--- Summary ---')
  console.log(`Images processed: ${results.length}`)
  console.log(`Stale files pruned: ${removed}`)
  for (const category of CATEGORIES) {
    const { count, bytes } = perCategory[category]
    console.log(`  ${category.padEnd(21)} ${String(count).padStart(3)} images  ${(bytes / 1024 / 1024).toFixed(2)}MB`)
  }
  console.log(`Total before: ${(totalBefore / 1024 / 1024).toFixed(2)}MB`)
  console.log(`Total after:  ${(totalAfter / 1024 / 1024).toFixed(2)}MB`)
  console.log(
    `Reduction: ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
