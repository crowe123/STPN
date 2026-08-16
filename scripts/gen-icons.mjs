/**
 * Generates the favicon set and the site-wide OG image from the SVG mark.
 * Run:  npm run icons     (also runs as part of `npm run build`)
 *
 * Every path emitted here is referenced by <head> or site.webmanifest, and
 * scripts/qa.mjs fails the build if any referenced icon path is missing from dist/.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(resolve(root, 'public/favicon.svg'));

const out = (p) => resolve(root, 'public', p);
mkdirSync(resolve(root, 'public/images'), { recursive: true });

const png = (size, path, background) =>
  sharp(svg, { density: 512 })
    .resize(size, size, background ? { fit: 'contain', background } : undefined)
    .png({ compressionLevel: 9 })
    .toFile(out(path))
    .then(() => console.log(`  ✓ ${path}  ${size}×${size}`));

// ── OG / twitter card image ────────────────────────────────────────────────
// Built from the same geometry as the mark, with the wordmark set as text.
// Rendered by resvg inside sharp, which has no webfont access, so the OG image
// deliberately uses a widely-available condensed face rather than Barlow.
const OG_W = 1200;
const OG_H = 630;
// textLength pins every line to a known width so the card composes identically
// whether or not a condensed face is installed on the build machine.
const F = 'font-family="Liberation Sans Narrow, Arial Narrow, DejaVu Sans Condensed, Helvetica, sans-serif"';
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}">
  <rect width="${OG_W}" height="${OG_H}" fill="#0D2C1F"/>
  <rect x="0" y="0" width="${OG_W}" height="14" fill="#E4700D"/>
  <g transform="translate(96,86) scale(2.6)">
    <clipPath id="t"><rect x="13.75" y="21.75" width="36.5" height="24.5" rx="3"/></clipPath>
    <rect x="15" y="33" width="34" height="14" fill="#E4700D" clip-path="url(#t)"/>
    <rect x="13.75" y="21.75" width="36.5" height="24.5" rx="3" fill="none" stroke="#FFFFFF" stroke-width="3.5"/>
    <path d="M20 15.5v20.5M44 15.5v24" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M20 15.5h-6M44 15.5h6" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round"/>
  </g>
  <text x="96" y="360" ${F} font-size="94" font-weight="700" fill="#FFFFFF">615 SEPTIC</text>
  <text x="96" y="452" ${F} font-size="94" font-weight="700" fill="#FFFFFF">TANK PUMPING</text>
  <text x="96" y="518" ${F} font-size="38" font-weight="400" fill="#B9CFC2">Nashville &#183; Davidson County, Tennessee</text>
  <text x="96" y="576" ${F} font-size="33" font-weight="700" fill="#E4700D">LICENSED &#183; FULL PUMP-OUT &#183; WRITTEN FINDINGS</text>
</svg>`;

const run = async () => {
  console.log('Generating icon set from public/favicon.svg');
  await png(16, 'favicon-16x16.png');
  await png(32, 'favicon-32x32.png');
  await png(180, 'apple-touch-icon.png');
  await png(192, 'icon-192.png');
  await png(512, 'icon-512.png');

  // .ico for legacy /favicon.ico requests (32px PNG payload is accepted by all
  // current browsers; sharp has no ico encoder so the png bytes are wrapped).
  const p32 = await sharp(svg, { density: 512 }).resize(32, 32).png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(32, 6);
  header.writeUInt8(32, 7);
  header.writeUInt8(0, 8);
  header.writeUInt8(0, 9);
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(p32.length, 14);
  header.writeUInt32LE(22, 18);
  writeFileSync(out('favicon.ico'), Buffer.concat([header, p32]));
  console.log('  ✓ favicon.ico  32×32');

  await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(out('images/og-default.png'));
  console.log(`  ✓ images/og-default.png  ${OG_W}×${OG_H}`);
  await sharp(Buffer.from(ogSvg)).webp({ quality: 88 }).toFile(out('images/og-default.webp'));
  console.log('  ✓ images/og-default.webp');
};

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
