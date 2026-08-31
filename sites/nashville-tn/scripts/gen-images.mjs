/**
 * Phase 4 image generation via kie.ai.
 *
 * DEVIATION ON RECORD: the build spec mandates GPT Image 2. This account's key
 * does not have gpt-image-2 enabled (the API returns "model name not supported"),
 * so generation uses google/nano-banana, the strongest image model available on
 * the key. Style direction is unchanged.
 *
 * Credit budget is the binding constraint: 4 credits per nano-banana image.
 * Logo, favicons and the checklist mockup are hand-authored SVG rather than
 * generated, which the spec wants as SVG anyway and costs no credits.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const KEY = process.env.KIE_AI_API_KEY;
if (!KEY) { console.error('KIE_AI_API_KEY not set. Source .env first.'); process.exit(1); }

const API = 'https://api.kie.ai/api/v1';
const MODEL = 'google/nano-banana';
const OUT = 'public/images';
const RAW = '.image-cache';

const STYLE = [
  'Documentary photorealism, shot on a full-frame DSLR with a 35mm lens.',
  'Natural overcast daylight, no studio lighting, no glossy stock-photo sheen.',
  'Real working equipment showing wear and use. Middle Tennessee residential setting:',
  'mature hardwoods, limestone outcrops, brick and vinyl-sided single-family homes from the 1970s to 1990s.',
  'Absolutely no text, no lettering, no signage, no logos, no watermarks anywhere in the image.',
  'No faces toward camera — any person is angled away, cropped at the shoulders, or seen from behind.',
  'Muted natural colour, slight grain, candid composition.',
].join(' ');

/** [outputName, aspect, subject] — every prompt is a specific, real scene. */
const JOBS = [
  ['home-hero', '16:9', 'A septic pump truck with a thick black suction hose running across a mown lawn to an open concrete septic tank lid in the foreground, on a large wooded residential property. The tank access is uncovered showing dark concrete. Autumn hardwoods behind.'],
  ['services/residential-septic-tank-pumping-hero', '16:9', 'Close view of an open concrete septic tank riser lid set flush in grass, with a heavy black vacuum hose lowered into the dark opening, gloved hands steadying it at the rim. Suburban back lawn.'],
  ['services/septic-tank-cleaning-hero', '16:9', 'The interior of an emptied concrete septic tank photographed from above through the open access, damp grey concrete walls washed clean, the outlet baffle visible on the far wall.'],
  ['services/emergency-septic-service-hero', '16:9', 'A septic service truck parked on a residential driveway at dusk with its work lights on, hose reel unspooled, wet ground reflecting the light. Urgent but orderly.'],
  ['services/septic-tank-inspection-hero', '16:9', 'A technician in work gloves kneeling beside an open septic tank access, holding a measuring rod down into the tank, clipboard resting on the grass beside the opening. Seen from behind and to the side.'],
  ['services/real-estate-septic-inspection-hero', '16:9', 'An open septic tank access in the front lawn of a tidy brick suburban house with a mown yard, the house softly out of focus behind, suggesting a property being assessed before sale.'],
  ['services/drain-field-repair-hero', '16:9', 'A narrow excavated trench across a back lawn exposing perforated drain field pipe in gravel, soil neatly heaped alongside, a shovel standing upright in the spoil.'],
  ['services/commercial-septic-pumping-hero', '16:9', 'A large vacuum tanker truck parked behind a small commercial building on an asphalt lot, hoses connected to an in-ground access cover, early morning light.'],
  ['services/grease-trap-cleaning-hero', '16:9', 'An opened in-ground grease interceptor lid on a restaurant service yard, thick hose running to a tanker, stainless kitchen door and stacked crates in the background.'],
  ['services/septic-tank-locating-hero', '16:9', 'A gloved hand pushing a slim metal soil probe into a lawn, a second probe already standing in the turf a few feet away marking a found tank edge, wooded suburban yard.'],
  ['areas/joelton-hero', '16:9', 'A rural ridge-top property in Middle Tennessee with a modest single-storey home and a mobile home further along the lot, gravel drive, tall hardwoods, rolling farmland falling away behind.'],
  ['areas/whites-creek-hero', '16:9', 'A low-lying rural property in a creek bottom, damp green grass, a small older house on a slight rise, bare winter trees along a creek line, standing water at the field edge.'],
  ['areas/forest-hills-hero', '16:9', 'A large wooded residential lot with a substantial brick house set well back, mature oaks, deep manicured lawn, long curving driveway, no commercial buildings anywhere.'],
  ['areas/oak-hill-hero', '16:9', 'A spacious estate lot with a stone-and-brick house behind old hardwood trees, gently sloping lawn, dense mature planting, quiet residential lane.'],
  ['areas/bellevue-hero', '16:9', 'A house on a steep wooded hillside lot descending toward a river valley in Middle Tennessee, limestone outcrop visible in the slope, dense trees, two-lane road below.'],
  ['areas/bells-bend-hero', '16:9', 'Flat agricultural bottomland inside a river bend, a farmhouse and metal barn, hay field, limestone bluff rising in the far distance, wide open sky.'],
  ['areas/goodlettsville-hero', '16:9', 'A suburban-rural fringe property with a 1980s ranch house, wide side lawn, a raised earth mound drain field visible as a low grassy rise beside the yard.'],
  ['services/septic-tank-riser-installation-hero', '16:9', 'A green plastic septic riser lid set flush in a mown lawn with fresh soil backfilled neatly around its collar, a second riser a few feet away, suburban back yard.'],
  ['services/septic-effluent-filter-cleaning-hero', '16:9', 'A gloved hand lifting a cylindrical plastic effluent filter cartridge out of an open septic tank outlet, dark residue on the cartridge, tank opening below.'],
  ['services/septic-baffle-repair-hero', '16:9', 'Looking down into an emptied concrete septic tank at the outlet baffle on the far wall, visible corrosion and pitting along the concrete above the waterline.'],
  ['services/septic-service-for-sinkhole-and-karst-lots-hero', '16:9', 'A rural Middle Tennessee lot with a shallow circular depression in the grass and grey limestone outcrops breaking through thin soil nearby, scattered hardwoods.'],
  ['services/mobile-home-septic-tank-pumping-hero', '16:9', 'A single-wide mobile home on a rural lot with skirting partly removed at one corner exposing ground access, gravel drive, tall grass and trees behind.'],
  ['services/rental-property-septic-pumping-hero', '16:9', 'A modest rented single-family house with a plain mown yard and a service truck parked at the kerb, hose running toward an opened access point in the side lawn.'],
  ['services/short-term-rental-septic-service-hero', '16:9', 'A well-presented rural guest house with a wide deck and outdoor seating, mown lawn, and a discreet septic access lid visible in the grass at the edge of the frame.'],
  ['services/septic-pumping-for-homes-on-well-water-hero', '16:9', 'A rural property with a small concrete well head casing in the foreground grass and a house set back beyond it, mature trees, a clear separation of open lawn between.'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(pathname, init) {
  const res = await fetch(`${API}${pathname}`, {
    ...init,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  return res.json();
}

async function credits() {
  const j = await api('/chat/credit', { method: 'GET' });
  return j?.data ?? 0;
}

async function createTask(prompt, aspect) {
  const j = await api('/jobs/createTask', {
    method: 'POST',
    body: JSON.stringify({ model: MODEL, input: { prompt, image_size: aspect, output_format: 'png' } }),
  });
  if (j.code !== 200) throw new Error(`createTask ${j.code}: ${j.msg}`);
  return j.data.taskId;
}

async function waitFor(taskId, label) {
  for (let i = 0; i < 60; i++) {
    await sleep(5000);
    const j = await api(`/jobs/recordInfo?taskId=${taskId}`, { method: 'GET' });
    const d = j?.data;
    if (!d) continue;
    if (d.state === 'success') {
      const parsed = JSON.parse(d.resultJson || '{}');
      const url = parsed?.resultUrls?.[0] || parsed?.resultUrl;
      if (!url) throw new Error(`${label}: success but no URL in ${d.resultJson}`);
      return url;
    }
    if (d.state === 'fail') throw new Error(`${label}: ${d.failMsg || d.failCode}`);
    process.stdout.write('.');
  }
  throw new Error(`${label}: timed out`);
}

/** Hero <=150KB, cards <=80KB. WebP, plus a mobile srcset variant. */
async function processImage(buf, outRel) {
  const { stat } = await import('node:fs/promises');
  const full = path.join(OUT, `${outRel}.webp`);
  const mob = path.join(OUT, `${outRel}-800.webp`);
  await mkdir(path.dirname(full), { recursive: true });
  const meta = await sharp(buf).metadata();
  const budget = 150 * 1024;
  let size = Infinity;
  for (const q of [80, 72, 64, 56, 48, 40]) {
    await sharp(buf).resize(1600, null, { withoutEnlargement: true }).webp({ quality: q }).toFile(full);
    ({ size } = await stat(full));
    if (size <= budget) break;
  }
  await sharp(buf).resize(800, null, { withoutEnlargement: true }).webp({ quality: 70 }).toFile(mob);
  const { size: msize } = await stat(mob);
  return { src: `${meta.width}x${meta.height}`, kb: Math.round(size / 1024), mkb: Math.round(msize / 1024) };
}

const only = process.argv[2];
console.log(`Credits before: ${await credits()}`);
await mkdir(RAW, { recursive: true });

let made = 0, skipped = 0;
for (const [name, aspect, subject] of JOBS) {
  if (only && !name.includes(only)) continue;
  const outPath = path.join(OUT, `${name}.webp`);
  if (existsSync(outPath)) { skipped++; console.log(`  skip (exists) ${name}`); continue; }

  const prompt = `${subject} ${STYLE}`;
  process.stdout.write(`  ${name} `);
  try {
    const id = await createTask(prompt, aspect);
    const url = await waitFor(id, name);
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    await writeFile(path.join(RAW, `${name.replace(/\//g, '_')}.png`), buf);
    const r = await processImage(buf, name);
    console.log(` ok ${r.src} — ${r.kb}KB / ${r.mkb}KB mobile`);
    made++;
  } catch (e) {
    console.log(` FAILED: ${e.message}`);
  }
}
console.log(`\nGenerated ${made}, skipped ${skipped}. Credits after: ${await credits()}`);
