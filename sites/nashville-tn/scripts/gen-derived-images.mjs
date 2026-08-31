/** Derived imagery built locally: the resources checklist mockup and the
 *  site-wide OG card. No credits, no placeholders — both are real artwork. */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

/* ── Printable checklist mockup ───────────────────────────────────────── */
const rows = [
  'Will you pump the tank completely?',
  'Will you measure sludge and scum depth?',
  'Will you open both access points?',
  'Will you inspect the inlet and outlet baffles?',
  'Will you clean and inspect the effluent filter?',
  'What would make the price change on site?',
  'Do you charge extra to hand-dig a buried lid?',
  'Will I get a written record of what was found?',
  'What interval do you recommend, and why?',
  'Where is the septage disposed of?',
];
const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="828" viewBox="0 0 640 828">
  <rect width="640" height="828" fill="#ffffff"/>
  <rect x="0" y="0" width="640" height="96" fill="#1E4634"/>
  <text x="40" y="45" font-family="Bitter,Georgia,serif" font-size="25" font-weight="700" fill="#ffffff">The Septic Pre-Hire Checklist</text>
  <text x="40" y="72" font-family="system-ui,sans-serif" font-size="14.5" fill="#C8D3CC">Ten questions to ask before you book — including us</text>
  ${rows.map((r, i) => {
    const y = 140 + i * 63;
    return `<rect x="40" y="${y - 22}" width="26" height="26" rx="4" fill="none" stroke="#C2571A" stroke-width="2.4"/>
      <text x="84" y="${y - 3}" font-family="system-ui,sans-serif" font-size="16.5" fill="#1A1D1B">${r.replace(/&/g, '&amp;')}</text>
      <line x1="40" y1="${y + 22}" x2="600" y2="${y + 22}" stroke="#E2DCD1" stroke-width="1"/>`;
  }).join('')}
  <text x="40" y="800" font-family="system-ui,sans-serif" font-size="13" fill="#4A524D">615 Septic Tank Pumping · Nashville and Davidson County · (615) 234-9048</text>
</svg>`;
await sharp(Buffer.from(sheet), { density: 200 }).resize(640, 828)
  .webp({ quality: 88 }).toFile('public/images/resources-checklist-preview.webp');

/* ── Site-wide OG card, built over the home hero ──────────────────────── */
const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0" stop-color="#0d1f17" stop-opacity="0.95"/>
    <stop offset="0.55" stop-color="#0d1f17" stop-opacity="0.55"/>
    <stop offset="1" stop-color="#0d1f17" stop-opacity="0.15"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <text x="64" y="452" font-family="Bitter,Georgia,serif" font-size="58" font-weight="700" fill="#ffffff">615 Septic Tank Pumping</text>
  <text x="64" y="512" font-family="system-ui,sans-serif" font-size="29" fill="#E8E2D6">Septic pumping, cleaning and emergency service</text>
  <text x="64" y="556" font-family="system-ui,sans-serif" font-size="29" fill="#E8E2D6">across Nashville and Davidson County</text>
  <rect x="64" y="584" width="132" height="6" rx="3" fill="#C2571A"/>
</svg>`;
await sharp('public/images/home-hero.webp')
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .webp({ quality: 84 }).toFile('public/images/og-default.webp');
await sharp('public/images/og-default.webp').jpeg({ quality: 82, mozjpeg: true }).toFile('public/images/og-default.jpg');

console.log('derived images written');
