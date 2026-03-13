import sharp from 'sharp'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const brandDir = join(__dirname, '../public/brand')

const exports = [
  // Logo mark — multiple sizes
  { src: 'logo-mark.svg',          dest: 'logo-mark-512.png',      width: 512,  height: 512 },
  { src: 'logo-mark.svg',          dest: 'logo-mark-256.png',      width: 256,  height: 256 },
  { src: 'logo-mark.svg',          dest: 'logo-mark-128.png',      width: 128,  height: 128 },
  { src: 'logo-mark.svg',          dest: 'logo-mark-64.png',       width: 64,   height: 64  },
  // Wordmark
  { src: 'logo-wordmark.svg',      dest: 'logo-wordmark.png',      width: 780,  height: 240 },
  { src: 'logo-wordmark-white.svg',dest: 'logo-wordmark-white.png',width: 780,  height: 240 },
  // Product icons — Stripe (800×800 recommended)
  { src: 'icon-solo.svg',          dest: 'icon-solo-800.png',      width: 800,  height: 800 },
  { src: 'icon-solo.svg',          dest: 'icon-solo-400.png',      width: 400,  height: 400 },
  { src: 'icon-growing.svg',       dest: 'icon-growing-800.png',   width: 800,  height: 800 },
  { src: 'icon-growing.svg',       dest: 'icon-growing-400.png',   width: 400,  height: 400 },
  // OG image (1200×630 for social sharing)
  { src: 'og-image.svg',           dest: 'og-image.png',           width: 1200, height: 630 },
  // Favicon sizes
  { src: 'favicon.svg',            dest: 'favicon-32.png',         width: 32,   height: 32  },
  { src: 'favicon.svg',            dest: 'favicon-192.png',        width: 192,  height: 192 },
  { src: 'favicon.svg',            dest: 'favicon-512.png',        width: 512,  height: 512 },
  // Apple touch icon
  { src: 'logo-mark.svg',          dest: 'apple-touch-icon.png',   width: 180,  height: 180 },
]

let ok = 0, fail = 0

for (const { src, dest, width, height } of exports) {
  try {
    const svgBuffer = readFileSync(join(brandDir, src))
    await sharp(svgBuffer)
      .resize(width, height)
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(join(brandDir, dest))
    console.log(`✓  ${dest.padEnd(30)} ${width}×${height}`)
    ok++
  } catch (e) {
    console.error(`✗  ${dest}: ${e.message}`)
    fail++
  }
}

console.log(`\n${ok} exported, ${fail} failed`)
console.log(`\nStripe product images:`)
console.log(`  Solo Practice    →  public/brand/icon-solo-800.png`)
console.log(`  Growing Practice →  public/brand/icon-growing-800.png`)
console.log(`\nOG image → public/brand/og-image.png (1200×630)`)
console.log(`Favicon  → public/brand/favicon-32.png`)
