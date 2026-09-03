// Regenerates the whole favicon set from the brand mark.
//
// History: the previous version cropped the mark, `.trim()`-ed it, then did
// `resize(1024, 1024, { fit: 'contain' })`. Because the hexagon mark is taller
// than it is wide, `contain` fit it by height — leaving 10px of white on each
// side and *zero* margin top and bottom. That asymmetry is what read as "two
// white vertical lines" beside the icon. It also sourced `brand_assets/`,
// which is gitignored and absent from most checkouts.
//
// This version sources the tracked logo lockup, extracts the mark by its
// measured ink box, and composes it onto the square canvas with explicitly
// computed padding. The mark's aspect ratio means horizontal padding is always
// larger than vertical — that is fine and intended. What matters is that
// left === right and top === bottom, so the whitespace reads as a deliberate
// inset rather than as stray strips.
//
// Run: node scripts/generate-favicons.mjs
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'public/assets/logos/logo-bg-new.png')
const OUT_DIR = path.join(ROOT, 'public/favicon')
const ICO_PATH = path.join(ROOT, 'src/app/favicon.ico')

// Ink box of the hexagon mark within logo-bg-new.png (1505x701), measured with
// a column-wise ink profile: the mark ends at x=577 and the wordmark starts at
// x=646. Re-measure if the logo lockup is ever replaced.
const MARK = { left: 10, top: 10, width: 568, height: 669 }

const CANVAS = 1024
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 }

// Share of the canvas height the mark occupies. The mark is the constrained
// axis (taller than wide), so this sets the vertical inset directly.
const MARK_HEIGHT_RATIO = 0.84
// Maskable icons must survive Android cropping the canvas to a circle, so the
// mark sits well inside the safe zone.
const MASKABLE_HEIGHT_RATIO = 0.6

/** Compose the mark, centred, on a square white canvas of `size` px. */
async function composeSquare(size, heightRatio) {
  const markHeight = Math.round(size * heightRatio)
  const markWidth = Math.round((markHeight * MARK.width) / MARK.height)

  const mark = await sharp(SRC)
    .extract(MARK)
    .resize(markWidth, markHeight, { kernel: 'lanczos3', fit: 'fill' })
    .toBuffer()

  // Split the leftover space so opposite sides match; any odd pixel goes to
  // the bottom/right, which is imperceptible and keeps the sum exact.
  const top = Math.floor((size - markHeight) / 2)
  const left = Math.floor((size - markWidth) / 2)

  return sharp(mark)
    .extend({
      top,
      bottom: size - markHeight - top,
      left,
      right: size - markWidth - left,
      background: WHITE,
    })
    .ensureAlpha()
    .png({ compressionLevel: 9 })
    .toBuffer()
}

/**
 * Pack PNG buffers into a multi-resolution ICO. sharp cannot write ICO, and
 * PNG-compressed ICO entries are supported by every browser we target.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(entries.length, 4)

  const directory = Buffer.alloc(16 * entries.length)
  let offset = header.length + directory.length

  entries.forEach(({ size, data }, i) => {
    const at = i * 16
    directory[at] = size === 256 ? 0 : size // 0 encodes 256
    directory[at + 1] = size === 256 ? 0 : size
    directory[at + 2] = 0 // palette colours (0 = truecolour)
    directory[at + 3] = 0 // reserved
    directory.writeUInt16LE(1, at + 4) // colour planes
    directory.writeUInt16LE(32, at + 6) // bits per pixel
    directory.writeUInt32LE(data.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += data.length
  })

  return Buffer.concat([header, directory, ...entries.map((e) => e.data)])
}

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const master = await composeSquare(CANVAS, MARK_HEIGHT_RATIO)

  const pngTargets = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'favicon-48x48.png', size: 48 },
    { file: 'favicon-96x96.png', size: 96 },
    { file: 'apple-touch-icon.png', size: 180 },
    { file: 'icon-192.png', size: 192 },
    { file: 'icon-512.png', size: 512 },
  ]

  for (const { file, size } of pngTargets) {
    await sharp(master)
      .resize(size, size, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT_DIR, file))
    console.log(`wrote public/favicon/${file} (${size}x${size})`)
  }

  const maskable = await composeSquare(512, MASKABLE_HEIGHT_RATIO)
  fs.writeFileSync(path.join(OUT_DIR, 'icon-maskable-512.png'), maskable)
  console.log('wrote public/favicon/icon-maskable-512.png (512x512, maskable)')

  const icoSizes = [16, 32, 48]
  const icoEntries = []
  for (const size of icoSizes) {
    icoEntries.push({
      size,
      data: await sharp(master)
        .resize(size, size, { kernel: 'lanczos3' })
        .png({ compressionLevel: 9 })
        .toBuffer(),
    })
  }
  fs.writeFileSync(ICO_PATH, buildIco(icoEntries))
  console.log(`wrote src/app/favicon.ico (${icoSizes.join(', ')})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
