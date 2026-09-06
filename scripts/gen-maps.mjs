/**
 * Generates one standalone coverage-map SVG per city into public/images/coverage/.
 * Run:  node scripts/gen-maps.mjs     (runs as part of `npm run build`)
 *
 * The artwork is identical to what StaticMap.astro used to inline. It moved to
 * files so pages carry real <img> elements — a page with no images takes a
 * measured AIO/M retrieval penalty, and inlining an identical 2 KB graphic on
 * every city page is wasted bytes besides.
 *
 * Placement is a deterministic hash of the city name, never Math.random, so a
 * rebuild that changes no data produces byte-identical files.
 *
 * Text uses an explicit system stack: an <img>-referenced SVG cannot see the
 * document's webfonts.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cities = JSON.parse(readFileSync(resolve(root, 'src/data/cities.json'), 'utf8'));
const outDir = resolve(root, 'public/images/coverage');
mkdirSync(outDir, { recursive: true });

const FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif";

// FNV-1a, matching the placement StaticMap.astro used when it inlined this.
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r2 = (n) => Math.round(n * 100) / 100;

function mapSvg(city) {
  const { name, state, neighborhoods = [] } = city;
  // Pins are spread evenly around a ring rather than dropped at hash-derived
  // angles. The old placement clustered them, and at card size the labels
  // collided with each other and with the city name. The seed still rotates the
  // ring so each city looks distinct, and the result is still deterministic.
  const seed = hash(name);
  // Pins carry no text. Neighbourhood names are set as HTML beneath the figure
  // instead: names like "Old Hickory Boulevard river crossing area" cannot fit
  // either side of a pin in a 400-unit frame, and every attempt to place them
  // in-image collided with a neighbour, the centre marker or the edge. As page
  // text they always fit, they are selectable, and a crawler can read them.
  const picked = neighborhoods.slice(0, 6);
  const start = (seed % 360) * (Math.PI / 180);
  const pins = picked.map((n, i) => {
    const a = start + (i / picked.length) * Math.PI * 2;
    const rx = 104 + ((seed >> (i * 4)) % 16);
    const ry = 48 + ((seed >> (i * 6)) % 12);
    return { name: n, x: r2(200 + Math.cos(a) * rx), y: r2(124 + Math.sin(a) * ry) };
  });

  const grid = [
    ...Array.from({ length: 12 }, (_, i) => `<line x1="${i * 36}" y1="0" x2="${i * 36}" y2="260"/>`),
    ...Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="${i * 36}" x2="400" y2="${i * 36}"/>`),
  ].join('');

  const pinMarkup = pins
    .map(
      (p) =>
        `<circle cx="${p.x}" cy="${p.y}" r="5.5" fill="#FFFFFF" stroke="#14432F" stroke-width="2.5"/>`
    )
    .join('');

  const label = `Service coverage around ${name}, ${state}, with ${pins.length} served areas marked`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" width="400" height="260" role="img" aria-label="${esc(label)}" font-family="${FONT}">
<title>${esc(label)}</title>
<rect width="400" height="260" fill="#F4F2ED"/>
<g stroke="#DFDCD3" stroke-width="1">${grid}</g>
<path d="M0 196 C 90 176, 150 214, 230 190 S 340 156, 400 172" fill="none" stroke="#B9CFC2" stroke-width="9" opacity="0.85"/>
<path d="M-10 92 C 80 104, 140 62, 214 78 S 330 116, 410 96" fill="none" stroke="#FFFFFF" stroke-width="7"/>
<path d="M-10 92 C 80 104, 140 62, 214 78 S 330 116, 410 96" fill="none" stroke="#DFDCD3" stroke-width="1"/>
<line x1="60" y1="-10" x2="128" y2="270" stroke="#FFFFFF" stroke-width="6"/>
<line x1="60" y1="-10" x2="128" y2="270" stroke="#DFDCD3" stroke-width="1"/>
<circle cx="200" cy="124" r="86" fill="#14432F" opacity="0.07"/>
<circle cx="200" cy="124" r="86" fill="none" stroke="#256B4A" stroke-width="2" stroke-dasharray="7 5"/>
${pinMarkup}
<g><path d="M200 108 c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill="#E4700D"/><circle cx="200" cy="124" r="5.5" fill="#FFFFFF"/></g>
<rect x="118" y="222" width="164" height="28" rx="14" fill="#FFFFFF" stroke="#DFDCD3" stroke-width="1"/>
<text x="200" y="241" text-anchor="middle" font-size="16" font-weight="700" fill="#0D2C1F">${esc(name)}, ${esc(state)}</text>
</svg>
`;
}

let n = 0;
for (const city of cities) {
  writeFileSync(resolve(outDir, `${city.slug}.svg`), mapSvg(city), 'utf8');
  n++;
}

// The county-wide overview used on /contact/ and /service-areas/. Nashville is
// not a row in cities.json (it is the hub, not a service area), so it is built
// here from the tier-1 city names as pins.
const overview = {
  name: 'Nashville',
  state: cities[0].state,
  neighborhoods: cities.filter((c) => c.tier === 1).map((c) => c.name),
};
writeFileSync(resolve(outDir, 'nashville.svg'), mapSvg(overview), 'utf8');
n++;

console.log(`  ✓ ${n} coverage maps → public/images/coverage/`);
