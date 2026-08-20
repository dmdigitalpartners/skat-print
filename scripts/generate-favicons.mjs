// Regenerates public/favicon/* as true PNGs from the source logo mark.
// The existing files were JPEG bytes mislabeled with a .png extension —
// this replaces them with real PNGs matching the `type: 'image/png'`
// already declared in layout.tsx and manifest.json.
import sharp from 'sharp'
import path from 'path'

const SRC = path.join(process.cwd(), 'brand_assets/logo-en.png')
const OUT_DIR = path.join(process.cwd(), 'public/favicon')

async function run() {
  // The source is a wide lockup (icon mark + wordmark); the icon mark
  // itself is the leftmost square-ish portion. Crop it out, trim residual
  // whitespace, then pad to a true square on a white card (matches the
  // header's logo treatment — clean white card, no glassmorphism).
  const full = sharp(SRC)
  const meta = await full.metadata()
  // Source is 1200x556; the hexagon mark itself occupies roughly the first
  // 490px of width — crop tighter than the full height to avoid bleeding
  // into the "S" of the wordmark, then trim residual whitespace.
  const iconMark = await sharp(SRC)
    .extract({ left: 0, top: 0, width: 490, height: meta.height })
    .trim()
    .toBuffer()

  const squared = await sharp(iconMark)
    .resize(1024, 1024, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png()
    .toBuffer()

  const targets = [
    { file: 'favicon-16x16.png', size: 16 },
    { file: 'favicon-32x32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
  ]

  for (const { file, size } of targets) {
    await sharp(squared)
      .resize(size, size)
      .png()
      .toFile(path.join(OUT_DIR, file))
    console.log(`wrote ${file} (${size}x${size})`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
