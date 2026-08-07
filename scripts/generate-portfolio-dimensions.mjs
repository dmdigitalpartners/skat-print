// Reads every portfolio image's real pixel dimensions (via sharp) and writes
// `width`/`height` fields onto each entry in src/lib/portfolio-data.ts, so the
// gallery grid (PortfolioGrid.tsx) can render images at their true aspect
// ratio in a CSS multi-column masonry layout without cropping or distortion.
//
// Re-run this any time images are added/replaced under public/assets/portfolio/
// to regenerate accurate dimensions — never hand-edit the width/height fields.
//
// Usage: node scripts/generate-portfolio-dimensions.mjs

import sharp from 'sharp'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = path.resolve(__dirname, '..')
const DATA_FILE = path.join(REPO_ROOT, 'src', 'lib', 'portfolio-data.ts')
const PUBLIC_ROOT = path.join(REPO_ROOT, 'public')

async function run() {
  let source = await readFile(DATA_FILE, 'utf-8')

  // Add width/height to the interface, if not already present. Matched with
  // \r?\n throughout since this repo's source files use CRLF line endings.
  if (!source.includes('width: number')) {
    source = source.replace(
      /export interface PortfolioItem \{\r?\n([\s\S]*?)\r?\n\}/,
      (match, body) => `export interface PortfolioItem {\r\n${body}\r\n  width: number\r\n  height: number\r\n}`
    )
  }

  // Strip any previously-generated width/height fields before regenerating,
  // so re-running this script is idempotent.
  source = source.replace(/, width: \d+, height: \d+(?=\s*\})/g, '')

  const srcPattern = /src: '([^']+)'/g
  const matches = [...source.matchAll(srcPattern)]

  let updated = source
  let processed = 0

  for (const match of matches) {
    const relSrc = match[1]
    const filePath = path.join(PUBLIC_ROOT, relSrc)
    const metadata = await sharp(filePath).metadata()
    const { width, height } = metadata
    if (!width || !height) {
      throw new Error(`Could not read dimensions for ${relSrc}`)
    }

    // Insert width/height right after this entry's category field (end of
    // the object literal), matched by anchoring on the exact src string so
    // each replacement only touches its own entry.
    const entryPattern = new RegExp(
      `(src: '${relSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[\\s\\S]*?category: '[^']+')( \\})`
    )
    const before = updated
    updated = updated.replace(entryPattern, `$1, width: ${width}, height: ${height}$2`)
    if (updated === before) {
      throw new Error(`Failed to inject dimensions for ${relSrc} — pattern did not match`)
    }
    processed++
  }

  await writeFile(DATA_FILE, updated, 'utf-8')
  console.log(`Wrote width/height for ${processed} portfolio items to ${path.relative(REPO_ROOT, DATA_FILE)}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
