/**
 * Derives the full favicon set from the square brand mark, and writes the
 * manifest. Every path referenced in <head> and site.webmanifest must resolve
 * to a real file in the build output — QA gate 5 checks this.
 */
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const MARK = 'public/images/logo-mark.svg';
const THEME = '#1E4634';
const svg = await readFile(MARK);

const png = (size, out) =>
  sharp(svg, { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toFile(out);

await mkdir('public', { recursive: true });
await Promise.all([
  png(16, 'public/favicon-16x16.png'),
  png(32, 'public/favicon-32x32.png'),
  png(180, 'public/apple-touch-icon.png'),
  png(192, 'public/icon-192.png'),
  png(512, 'public/icon-512.png'),
]);
await writeFile('public/favicon.svg', svg);

await writeFile('public/site.webmanifest', JSON.stringify({
  name: '615 Septic Tank Pumping',
  short_name: '615 Septic',
  description: 'Septic tank pumping in Nashville and Davidson County.',
  start_url: '/',
  display: 'standalone',
  background_color: '#FAF7F1',
  theme_color: THEME,
  icons: [
    { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
  ],
}, null, 2));

console.log('icons + manifest written');
