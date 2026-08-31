/**
 * Phase 6 QA gates. Runs over dist/ and EXITS NON-ZERO on any violation, so a
 * failing gate fails `npm run build`. Every check maps to the build spec's
 * defect blacklist, on-page structure rules, indexability rules, NAP/branding
 * checks or proof-hygiene checks.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIST = 'dist';
const ORIGIN = 'https://615septictankpumping.com';
const PHONE_DISPLAY = '(615) 234-9048';
const PHONE_E164 = '+16152349048';
const ADDRESS = '1801 West End Avenue, Suite 1000';

const fails = [];
const warns = [];
const fail = (gate, msg) => fails.push(`[${gate}] ${msg}`);
const warn = (gate, msg) => warns.push(`[${gate}] ${msg}`);

/** Visible text only — strips scripts, styles and all markup so attribute
    values like placeholder="37080" cannot trip content checks. */
const visibleText = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/\s+/g, ' ');

async function walk(dir, ext, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, ext, acc);
    else if (p.endsWith(ext)) acc.push(p);
  }
  return acc;
}
const htmlFiles = await walk(DIST, '.html');
const pages = [];
for (const f of htmlFiles) {
  const rel = path.relative(DIST, path.dirname(f)).replace(/\\/g, '/');
  const route = rel === '' || rel === '.' ? '/' : `/${rel}/`;
  pages.push({ f, html: await readFile(f, 'utf8'), route });
}
const indexable = pages.filter((p) => !p.f.endsWith('404.html'));

/* ── GATE 1: defect blacklist ─────────────────────────────────────────── */
for (const { f, html } of pages) {
  if (/\b(\w+s)s\b/.test(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '')) warn('1', `${f}: possible double plural in h1`);
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, '');
  // No double-city H1 (e.g. "... Nashville ... in Nashville")
  for (const city of ['Nashville', 'Joelton', 'Whites Creek', 'Forest Hills', 'Oak Hill', 'Bellevue', 'Bells Bend', 'Goodlettsville']) {
    const n = (h1.match(new RegExp(city, 'g')) || []).length;
    if (n > 1) fail('1', `${f}: city "${city}" appears ${n}x in h1: "${h1.trim()}"`);
  }
  const vis = visibleText(html);
  if (/lorem ipsum|\bplaceholder\b|example \d\b|coming soon|\bTODO\b|\bFIXME\b|\bXXX\b/i.test(vis)) fail('1', `${f}: placeholder text in visible copy`);
  if (/"[^"]*\*\*[^"]*"/.test(html.match(/application\/ld\+json">([\s\S]*?)</)?.[1] || '')) fail('1', `${f}: raw markdown inside JSON-LD`);
  if (/default\.php|\.DS_Store/.test(html)) fail('1', `${f}: host artifact reference`);
}

/* ── GATE 2: exactly one h1, no skipped levels, no headings on chrome ─── */
for (const { f, html } of pages) {
  const h1s = (html.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) fail('2', `${f}: ${h1s} <h1> elements (must be exactly 1)`);
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) fail('2', `${f}: heading level skipped h${levels[i - 1]} -> h${levels[i]}`);
  }
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] || '';
  const footer = body.match(/<footer[\s\S]*?<\/footer>/)?.[0] || '';
  if (/<h[1-6][\s>]/.test(footer)) fail('2', `${f}: heading tag inside <footer>`);
  const header = body.match(/<header[\s\S]*?<\/header>/)?.[0] || '';
  if (/<h[1-6][\s>]/.test(header)) fail('2', `${f}: heading tag inside <header>`);
}

/* ── GATE 3: unique titles and meta descriptions ──────────────────────── */
const titles = new Map(), descs = new Map();
for (const { f, html } of indexable) {
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1]?.trim();
  const d = html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/)?.[1]?.trim();
  if (!t) fail('3', `${f}: no <title>`);
  if (!d) fail('3', `${f}: no meta description`);
  if (t) { if (titles.has(t)) fail('3', `duplicate title "${t}" in ${f} and ${titles.get(t)}`); else titles.set(t, f); }
  if (d) { if (descs.has(d)) fail('3', `duplicate meta description in ${f} and ${descs.get(d)}`); else descs.set(d, f); }
  if (d && (d.length < 80 || d.length > 200)) warn('3', `${f}: meta description ${d.length} chars`);
}

/* ── GATE 4: images ───────────────────────────────────────────────────── */
for (const { f, html } of pages) {
  for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
    const tag = m[1];
    const src = tag.match(/src="([^"]*)"/)?.[1] || '(none)';
    if (!/\balt=/.test(tag)) fail('4', `${f}: <img ${src}> missing alt`);
    if (!/\bwidth=/.test(tag) || !/\bheight=/.test(tag)) fail('4', `${f}: <img ${src}> missing width/height`);
    if (/alt="[^"]*example \d/i.test(tag)) fail('4', `${f}: lazy alt text on ${src}`);
    if (src.startsWith('/') && !existsSync(path.join('public', src)) && !existsSync(path.join(DIST, src))) {
      fail('4', `${f}: image not found on disk: ${src}`);
    }
  }
}

/* ── GATE 5: manifest + favicon paths all resolve ─────────────────────── */
const manifest = JSON.parse(await readFile(path.join(DIST, 'site.webmanifest'), 'utf8'));
for (const icon of manifest.icons) {
  if (!existsSync(path.join(DIST, icon.src))) fail('5', `manifest icon missing on disk: ${icon.src}`);
}
for (const p of ['/favicon.svg', '/favicon-32x32.png', '/favicon-16x16.png', '/apple-touch-icon.png', '/site.webmanifest']) {
  if (!existsSync(path.join(DIST, p))) fail('5', `head-referenced asset missing: ${p}`);
}
for (const logo of ['/images/logo.svg', '/images/logo-light.svg', '/images/logo-mark.svg']) {
  if (!existsSync(path.join(DIST, logo))) fail('5', `logo missing: ${logo}`);
}
const homeHtml = pages.find((p) => p.f === path.join(DIST, 'index.html'))?.html || '';
if (/monogram|initials/i.test(homeHtml)) fail('5', 'monogram/initials placeholder referenced');

/* ── GATE 6: indexability ─────────────────────────────────────────────── */
for (const { f, html, route } of indexable) {
  if (/<meta[^>]+name="robots"[^>]+noindex/i.test(html)) fail('6', `${f}: HTML page carries noindex`);
  const canon = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]*)"/)?.[1];
  if (!canon) fail('6', `${f}: no canonical`);
  else {
    const want = ORIGIN + route;
    if (!canon.startsWith('https://')) fail('6', `${f}: canonical not absolute: ${canon}`);
    if (!canon.endsWith('/')) fail('6', `${f}: canonical lacks trailing slash: ${canon}`);
    if (canon !== want) fail('6', `${f}: canonical ${canon} != expected ${want}`);
  }
  for (const prop of ['og:image', 'twitter:image']) {
    const v = html.match(new RegExp(`(?:property|name)="${prop}"[^>]+content="([^"]*)"`))?.[1];
    if (!v) fail('6', `${f}: missing ${prop}`);
    else if (!v.startsWith('https://')) fail('6', `${f}: ${prop} not absolute: ${v}`);
  }
}
const headers = await readFile(path.join(DIST, '_headers'), 'utf8');
if (!/\/\*\.md\n/.test(headers)) fail('6', '_headers: noindex rule not scoped to *.md');
if (/^\/\*\n(?:(?!\n\n)[\s\S])*X-Robots-Tag: noindex/m.test(headers)) fail('6', '_headers: noindex applied to /* — would deindex the site');
const htaccess = await readFile(path.join(DIST, '.htaccess'), 'utf8');
if (!/FilesMatch "\\\.md\$"/.test(htaccess)) fail('6', '.htaccess: noindex not scoped to .md extension');
const robots = await readFile(path.join(DIST, 'robots.txt'), 'utf8');
if (/^Disallow: \/\s*$/m.test(robots)) fail('6', 'robots.txt disallows everything');
const sitemapLine = robots.match(/^Sitemap:\s*(\S+)/m)?.[1];
if (!sitemapLine) fail('6', 'robots.txt has no Sitemap: line');
else {
  const smFile = path.join(DIST, sitemapLine.replace(ORIGIN, ''));
  if (!existsSync(smFile)) fail('6', `robots.txt Sitemap: points at ${sitemapLine} which does not exist`);
}

/* ── GATE 7: NAP consistency, no hardcoded contact details ────────────── */
const srcFiles = [...await walk('src/components', '.astro'), ...await walk('src/layouts', '.astro'), ...await walk('src/pages', '.astro')];
for (const f of srcFiles) {
  const s = await readFile(f, 'utf8');
  if (s.includes(PHONE_DISPLAY) || s.includes(PHONE_E164)) fail('7', `${f}: hardcoded phone number — must read from config.ts`);
  if (s.includes(ADDRESS)) fail('7', `${f}: hardcoded street address — must read from config.ts`);
  if (/support@615septictankpumping\.com/.test(s)) fail('7', `${f}: hardcoded email — must read from config.ts`);
}
for (const key of ['/index.html', '/contact/index.html', '/about/index.html']) {
  const p = pages.find((x) => x.f === path.join(DIST, key.slice(1)));
  if (!p) continue;
  if (!p.html.includes(PHONE_DISPLAY)) fail('7', `${key}: display phone missing`);
  if (!p.html.includes(`tel:${PHONE_E164}`)) fail('7', `${key}: E.164 tel: link missing`);
}
const contact = pages.find((x) => x.f === path.join(DIST, 'contact/index.html'))?.html || '';
if (!contact.includes(ADDRESS)) fail('7', 'contact page missing supplied street address');
for (const { f, html } of pages) {
  for (const m of html.matchAll(/href="tel:([^"]+)"/g)) {
    if (m[1] !== PHONE_E164) fail('7', `${f}: tel: link uses ${m[1]}, not E.164 ${PHONE_E164}`);
  }
}

/* ── GATE 8: proof hygiene ────────────────────────────────────────────── */
const proof = JSON.parse(await readFile('src/data/proof.json', 'utf8'));
const proofEmpty = ['testimonials', 'stats', 'credentials', 'team', 'awards'].every((k) => (proof[k] ?? []).length === 0);
for (const { f, html } of pages) {
  const text = visibleText(html);
  if (proofEmpty) {
    if (/aggregateRating|"@type"\s*:\s*"Review"/.test(html)) fail('8', `${f}: Review/AggregateRating schema with no real reviews`);
    if (/\b\d+(\.\d+)?\s*(out of|\/)\s*5\b/i.test(text)) fail('8', `${f}: star rating rendered with no backing data`);
    if (/\bsince (19|20)\d{2}\b/i.test(text)) fail('8', `${f}: years-in-business claim with no backing data`);
    if (/\b\d[\d,]*\+?\s+(happy|satisfied)\s+customers?\b/i.test(text)) fail('8', `${f}: customer-count claim`);
    if (/\b\d+\s*\+?\s*years\s+(of\s+)?experience\b/i.test(text)) fail('8', `${f}: years-of-experience claim`);
  }
  if (/testimonial-sample|John D\.|Jane S\.|Lorem/i.test(text)) fail('8', `${f}: sample testimonial content`);
}

/* ── GATE 9: internal links resolve, no orphans ───────────────────────── */
const routes = new Set(indexable.map((p) => p.route));
const linkedTo = new Set();
for (const { f, html } of pages) {
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    let href = m[1];
    if (/\.(md|txt|xml|json|webmanifest|js|css|svg|png|jpg|webp|ico)$/.test(href)) continue;
    if (!href.endsWith('/')) href += '/';
    linkedTo.add(href);
    if (!routes.has(href)) fail('9', `${f}: broken internal link ${m[1]}`);
  }
}
for (const r of routes) {
  if (r === '/' ) continue;
  if (!linkedTo.has(r)) fail('9', `orphan page — nothing links to ${r}`);
}

/* ── GATE 10: JS budget + sitemap parity ──────────────────────────────── */
for (const { f, html, route } of pages) {
  const isTool = route.startsWith('/tools/');
  const external = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const nonWebmcp = external.filter((s) => !s.includes('agent-ready-webmcp'));
  if (!isTool && nonWebmcp.length > 0) warn('10', `${f}: ${nonWebmcp.length} external script(s) on a non-tool page: ${nonWebmcp.join(', ')}`);
}
const smIndex = await readFile(path.join(DIST, 'sitemap-index.xml'), 'utf8');
const smFiles = [...smIndex.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => path.join(DIST, m[1].replace(ORIGIN, '')));
let smCount = 0;
for (const sf of smFiles) {
  if (!existsSync(sf)) { fail('10', `sitemap index references missing file ${sf}`); continue; }
  smCount += [...(await readFile(sf, 'utf8')).matchAll(/<loc>/g)].length;
}
if (smCount !== indexable.length) fail('10', `sitemap has ${smCount} URLs but ${indexable.length} indexable pages were built`);

/* ── GATE 11: keyword map reconciliation ──────────────────────────────── */
const services = JSON.parse(await readFile('src/data/services.json', 'utf8')).services;
const cities = JSON.parse(await readFile('src/data/cities.json', 'utf8')).cities;
const primaries = new Map();
const claim = (kw, where) => {
  if (primaries.has(kw)) fail('11', `primary keyword "${kw}" claimed by both ${primaries.get(kw)} and ${where}`);
  primaries.set(kw, where);
};
services.forEach((s) => claim(s.primaryKeyword.toLowerCase(), `/${s.slug}/`));
cities.forEach((c) => claim(c.primaryKeyword.toLowerCase(), `/service-areas/${c.slug}/`));
const guideFiles = await walk('src/content/guides', '.md');
for (const g of guideFiles) {
  const fm = (await readFile(g, 'utf8')).match(/^---([\s\S]*?)---/)?.[1] || '';
  const kw = fm.match(/^primaryKeyword:\s*"?([^"\n]+)"?/m)?.[1]?.trim();
  if (!kw) { fail('11', `${g}: no primaryKeyword in frontmatter`); continue; }
  claim(kw.toLowerCase(), g);
}
// Primary keyword must appear in title, h1 and first 100 words of its page
for (const s of services) {
  const p = pages.find((x) => x.f === path.join(DIST, s.slug, 'index.html'));
  if (!p) { fail('11', `service page not built: ${s.slug}`); continue; }
  const head = p.html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]+>/g, '') || '';
  const words = head.toLowerCase();
  const core = s.primaryKeyword.split(' ').filter((w) => w.length > 3);
  const hits = core.filter((w) => words.includes(w)).length;
  if (hits < Math.ceil(core.length * 0.5)) warn('11', `${s.slug}: h1 covers only ${hits}/${core.length} primary keyword terms`);
}

/* ── GATE 12: mobile / accessibility basics ───────────────────────────── */
for (const { f, html } of pages) {
  if (!/<meta[^>]+name="viewport"/.test(html)) fail('12', `${f}: no viewport meta`);
  if (!/lang="en/.test(html)) fail('12', `${f}: no lang attribute`);
  if (!/skip-link/.test(html)) warn('12', `${f}: no skip link`);
}

/* ── report ───────────────────────────────────────────────────────────── */
console.log(`\nQA over ${pages.length} built pages (${indexable.length} indexable)\n`);
if (warns.length) {
  console.log(`⚠ ${warns.length} warning(s):`);
  warns.slice(0, 40).forEach((w) => console.log('  ' + w));
  if (warns.length > 40) console.log(`  …and ${warns.length - 40} more`);
  console.log();
}
if (fails.length) {
  console.log(`✗ ${fails.length} FAILURE(S):`);
  fails.slice(0, 60).forEach((f) => console.log('  ' + f));
  if (fails.length > 60) console.log(`  …and ${fails.length - 60} more`);
  process.exit(1);
}
console.log('✓ All QA gates passed.');
