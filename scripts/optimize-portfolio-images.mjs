// Reads the curation manifest (scripts/portfolio-manifest.mjs) and produces optimized,
// web-ready derivatives under public/assets/portfolio/<category>/.
//
// Pipeline per image: auto-orient -> resize (long edge capped at 1600px, never upscale)
// -> normalize to sRGB -> re-encode as mozjpeg quality 80, metadata stripped.
//
// Usage: node scripts/optimize-portfolio-images.mjs

import sharp from 'sharp'
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifest } from './portfolio-manifest.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const DEST_ROOT = path.join(REPO_ROOT, 'public', 'assets', 'portfolio')

const MAX_DIMENSION = 1600
const JPEG_QUALITY = 80

function formatKB(bytes) {
  return `${(bytes / 1024).toFixed(1)}KB`
}

async function run() {
  const results = []
  let totalBefore = 0
  let totalAfter = 0

  for (const entry of manifest) {
    const destDir = path.join(DEST_ROOT, entry.category)
    await mkdir(destDir, { recursive: true })
    const destPath = path.join(destDir, entry.dest)

    const beforeStat = await stat(entry.source)
    totalBefore += beforeStat.size

    await sharp(entry.source)
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

  console.log('\n--- Summary ---')
  console.log(`Images processed: ${results.length}`)
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
