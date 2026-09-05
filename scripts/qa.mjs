/**
 * QA GATES. Runs after every build; a FAIL exits non-zero and fails the build.
 *
 * Covers the defect blacklist, on-page structure, indexability, NAP consistency,
 * proof hygiene, internal linking, and — specific to this build — proof that the
 * homepage renders the supplied article verbatim.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

let failures = 0;
let warnings = 0;
const fail = (name, detail) => { failures++; console.log(`  ✗ FAIL  ${name}${detail ? `\n          ${detail}` : ''}`); };
const pass = (name, note) => console.log(`  ✓ ${name}${note ? `  — ${note}` : ''}`);
const warn = (name, detail) => { warnings++; console.log(`  ! WARN  ${name}${detail ? `\n          ${detail}` : ''}`); };
const section = (t) => console.log(`\n${t}\n${'─'.repeat(t.length)}`);

if (!existsSync(dist)) { console.error('dist/ not found — run astro build first.'); process.exit(1); }

// ── collect built pages ────────────────────────────────────────────────────
const htmlFiles = [];
(function walk(dir) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const routeOf = (f) => {
  const rel = relative(dist, f).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  return '/' + rel.replace(/index\.html$/, '');
};

const decode = (s) =>
  s.replace(/&nbsp;/g, ' ')
   .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
   .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
   .replace(/&#0?39;|&apos;|&#x27;/g, "'").replace(/&amp;/g, '&');
const strip = (s) => decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

const pages = htmlFiles.map((f) => {
  const html = readFileSync(f, 'utf8');
  return {
    file: f,
    route: routeOf(f),
    html,
    title: decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''),
    description: decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''),
    canonical: (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1] || '',
    headings: [...html.matchAll(/<(h[1-6])\b[^>]*>([\s\S]*?)<\/\1>/gi)].map((m) => ({
      level: Number(m[1][1]),
      text: strip(m[2]),
    })),
    text: strip((html.match(/<main[^>]*>([\s\S]*?)<\/main>/) || [, html])[1]),
  };
});

const contentPages = pages.filter((p) => p.route !== '/404.html');
console.log(`\nQA GATES — ${pages.length} built pages in dist/`);

// ═══════════════════════════════════════════════════════════════════════════
section('1. VERBATIM ARTICLE (homepage)');
{
  const ref = readFileSync(resolve(root, 'src/data/homepage-article.txt'), 'utf8').trim().split('\n');
  const home = pages.find((p) => p.route === '/');
  const regions = [...home.html.matchAll(/<article[^>]*data-verbatim-article[^>]*>([\s\S]*?)<\/article>/g)]
    .map((m) => m[1]).join('\n');
  const rendered = strip(regions);
  const missing = [];
  for (const line of ref) {
    // Table rows are flattened as "cell | cell | cell" in the reference; the
    // rendered table has no pipes, so each cell is checked individually.
    for (const cell of line.split(' | ')) {
      const needle = strip(cell);
      if (needle.length > 0 && !rendered.includes(needle)) missing.push(needle);
    }
  }
  if (missing.length === 0) {
    pass(`All ${ref.length} article blocks render verbatim on the homepage`);
  } else {
    fail('Homepage article has been altered', missing.slice(0, 3).map((m) => `missing: "${m.slice(0, 90)}…"`).join('\n          '));
  }
  const h1s = home.headings.filter((h) => h.level === 1);
  if (h1s.length === 1 && h1s[0].text === strip(ref[0])) pass('Homepage H1 is the article H1, unmodified');
  else fail('Homepage H1 does not match the article H1', `got: ${h1s.map((h) => h.text).join(' | ')}`);
}

// ═══════════════════════════════════════════════════════════════════════════
section('2. HEADING STRUCTURE');
{
  const multi = contentPages.filter((p) => p.headings.filter((h) => h.level === 1).length !== 1);
  multi.length === 0
    ? pass(`Exactly one <h1> on all ${contentPages.length} pages`)
    : fail('Pages without exactly one h1', multi.map((p) => `${p.route} (${p.headings.filter((h) => h.level === 1).length})`).join(', '));

  const skips = [];
  for (const p of contentPages) {
    let prev = 0;
    for (const h of p.headings) {
      if (prev && h.level > prev + 1) skips.push(`${p.route}: h${prev} → h${h.level} ("${h.text.slice(0, 45)}")`);
      prev = h.level;
    }
  }
  skips.length === 0 ? pass('No skipped heading levels') : fail('Skipped heading levels', skips.slice(0, 8).join('\n          '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('3. TITLES, METAS, CANONICALS');
{
  const dupT = Object.entries(contentPages.reduce((a, p) => ((a[p.title] ||= []).push(p.route), a), {})).filter(([, v]) => v.length > 1);
  dupT.length === 0 ? pass('All titles unique') : fail('Duplicate titles', dupT.map(([t, r]) => `"${t}" → ${r.join(', ')}`).join('\n          '));

  const dupD = Object.entries(contentPages.reduce((a, p) => ((a[p.description] ||= []).push(p.route), a), {})).filter(([, v]) => v.length > 1);
  dupD.length === 0 ? pass('All meta descriptions unique') : fail('Duplicate descriptions', dupD.map(([, r]) => r.join(', ')).join('\n          '));

  const noDesc = contentPages.filter((p) => !p.description);
  noDesc.length === 0 ? pass('Every page has a meta description') : fail('Missing descriptions', noDesc.map((p) => p.route).join(', '));

  const longDesc = contentPages.filter((p) => p.description.length > 165);
  longDesc.length === 0 ? pass('All meta descriptions ≤165 chars') : warn('Long meta descriptions', longDesc.map((p) => `${p.route} (${p.description.length})`).join(', '));

  const badCanon = contentPages.filter((p) => p.canonical !== `https://615septictankpumping.com${p.route}`);
  badCanon.length === 0
    ? pass('Self-referencing canonicals, absolute, trailing slash')
    : fail('Bad canonicals', badCanon.map((p) => `${p.route} → ${p.canonical}`).join('\n          '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('4. KEYWORD MAP RECONCILIATION');
{
  const services = JSON.parse(readFileSync(resolve(root, 'src/data/services.json'), 'utf8'));
  const cities = JSON.parse(readFileSync(resolve(root, 'src/data/cities.json'), 'utf8'));
  const map = [
    // The homepage H1 now carries the primary keyword directly (it was edited
    // for AIO/M retrieval — see the DEVIATION note in src/pages/index.astro), so
    // the former skipH1 exception no longer applies and the gate enforces it.
    { route: '/', kw: 'septic tank pumping nashville' },
    ...services.map((s) => ({ route: `/${s.slug}/`, kw: s.primaryKeyword.toLowerCase() })),
    ...cities.map((c) => ({ route: `/service-areas/${c.slug}/`, kw: c.primaryKeyword.toLowerCase() })),
  ];

  const dupKw = Object.entries(map.reduce((a, m) => ((a[m.kw] ||= []).push(m.route), a), {})).filter(([, v]) => v.length > 1);
  dupKw.length === 0 ? pass(`${map.length} primary keywords, none duplicated`) : fail('Cannibalised keywords', dupKw.map(([k, r]) => `${k} → ${r.join(', ')}`).join('\n'));

  // Keyword tokens must appear in title, H1 (unless excepted), and first 100 words.
  const problems = [];
  for (const m of map) {
    const p = pages.find((x) => x.route === m.route);
    if (!p) { problems.push(`${m.route}: page not built`); continue; }
    const tokens = m.kw.split(/\s+/).filter((t) => t.length > 2);
    const inAll = (hay) => tokens.every((t) => hay.toLowerCase().includes(t));
    if (!inAll(p.title)) problems.push(`${m.route}: "${m.kw}" not in title`);
    const h1 = p.headings.find((h) => h.level === 1)?.text ?? '';
    if (!m.skipH1 && !inAll(h1)) problems.push(`${m.route}: "${m.kw}" not in h1`);
    const first100 = p.text.split(/\s+/).slice(0, 100).join(' ');
    if (!inAll(first100)) problems.push(`${m.route}: "${m.kw}" not in first 100 words`);
  }
  problems.length === 0
    ? pass('Every primary keyword appears in title, H1 and first 100 words')
    : fail('Keyword placement', problems.join('\n          '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('5. INDEXABILITY');
{
  const noindexed = pages.filter((p) => /<meta[^>]+name=["']robots["'][^>]*noindex/i.test(p.html));
  noindexed.length === 0 ? pass('Zero HTML pages carry a noindex meta tag') : fail('HTML pages with noindex', noindexed.map((p) => p.route).join(', '));

  for (const [file, label] of [['_headers', '_headers'], ['.htaccess', '.htaccess']]) {
    const src = readFileSync(resolve(dist, file), 'utf8');
    const lines = src.split('\n');
    const idx = lines.findIndex((l) => /X-Robots-Tag/i.test(l));
    const scope = lines.slice(Math.max(0, idx - 12), idx).reverse().find((l) => /\.md/.test(l));
    scope
      ? pass(`${label}: X-Robots-Tag noindex scoped to .md only`, scope.trim())
      : fail(`${label}: noindex rule is not scoped to the .md extension`);
    if (/X-Robots-Tag[^\n]*noindex/i.test(src) && /\/\*\s*\n[^\n]*X-Robots-Tag[^\n]*noindex/i.test(src))
      fail(`${label}: a site-wide noindex rule would deindex the money pages`);
  }

  const robots = readFileSync(resolve(dist, 'robots.txt'), 'utf8');
  /^Disallow: \/\s*$/m.test(robots) ? fail('robots.txt disallows everything') : pass('robots.txt disallows nothing that should rank');
  const smName = (robots.match(/Sitemap:\s*\S+\/([^/\s]+)$/m) || [])[1];
  existsSync(resolve(dist, smName || ''))
    ? pass(`robots.txt Sitemap: points at a real file`, smName)
    : fail('robots.txt Sitemap: filename does not exist in dist/', smName);
}

// ═══════════════════════════════════════════════════════════════════════════
section('6. SITEMAP PARITY');
{
  const idx = readFileSync(resolve(dist, 'sitemap-index.xml'), 'utf8');
  const parts = [...idx.matchAll(/<loc>[^<]*\/([^/<]+\.xml)<\/loc>/g)].map((m) => m[1]);
  const urls = new Set();
  for (const part of parts) {
    const xml = readFileSync(resolve(dist, part), 'utf8');
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(new URL(m[1]).pathname);
  }
  const built = new Set(contentPages.map((p) => p.route));
  const missing = [...built].filter((r) => !urls.has(r));
  const extra = [...urls].filter((r) => !built.has(r));
  missing.length === 0 && extra.length === 0
    ? pass(`Sitemap ↔ built pages parity`, `${urls.size} URLs`)
    : fail('Sitemap parity', `missing from sitemap: ${missing.join(', ') || 'none'}\n          in sitemap but not built: ${extra.join(', ') || 'none'}`);
}

// ═══════════════════════════════════════════════════════════════════════════
section('7. NAP + BRANDING CONSISTENCY');
{
  const cfg = readFileSync(resolve(root, 'src/config.ts'), 'utf8');
  const phoneDisplay = (cfg.match(/phoneDisplay:\s*'([^']*)'/) || [])[1];
  const phoneE164 = (cfg.match(/phoneE164:\s*'([^']*)'/) || [])[1];
  const brand = (cfg.match(/name:\s*'([^']*)'/) || [])[1];

  const badTel = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/href="tel:([^"]+)"/g)) if (m[1] !== phoneE164) badTel.push(`${p.route} → ${m[1]}`);
  }
  badTel.length === 0 ? pass(`Every tel: link uses ${phoneE164}`) : fail('Non-E.164 tel: links', badTel.join(', '));

  const noPhone = contentPages.filter((p) => !p.html.includes(phoneDisplay));
  noPhone.length === 0 ? pass(`Display number ${phoneDisplay} appears on every page`) : fail('Pages missing the display number', noPhone.map((p) => p.route).join(', '));

  // Byte-identical NAP on the pages that carry the full block.
  for (const r of ['/', '/contact/', '/about/']) {
    const p = pages.find((x) => x.route === r);
    p.html.includes(brand) && p.html.includes(phoneDisplay)
      ? pass(`NAP present and identical on ${r}`)
      : fail(`NAP drift on ${r}`);
  }
  const llms = readFileSync(resolve(dist, 'llms.txt'), 'utf8');
  llms.includes(phoneDisplay) && llms.includes(phoneE164) && llms.includes(brand)
    ? pass('llms.txt carries the identical NAP')
    : fail('llms.txt NAP drift');

  // No hardcoded NAP anywhere outside config.ts.
  const srcFiles = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.(astro|ts|tsx)$/.test(p) && !p.endsWith('config.ts')) srcFiles.push(p);
    }
  })(resolve(root, 'src'));
  const hard = srcFiles.filter((f) => {
    const s = readFileSync(f, 'utf8');
    return s.includes(phoneE164) || (s.includes(phoneDisplay) && !s.includes('CONTACT.phoneDisplay'));
  });
  hard.length === 0
    ? pass('No hardcoded phone number in any component — all read from src/config.ts')
    : fail('Hardcoded NAP in components', hard.map((f) => relative(root, f)).join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('8. PROOF HYGIENE (no fabricated social proof)');
{
  const banned = [
    [/\baggregateRating\b/i, 'AggregateRating schema'],
    [/"@type"\s*:\s*"Review"/i, 'Review schema'],
    [/\b\d+(\.\d+)?\s*(out of|\/)\s*5\b/i, 'a star rating'],
    [/\b\d{2,}\+?\s*(five[- ]star|5[- ]star)\s*reviews?\b/i, 'a review count'],
    [/\bserving .{0,30}\bsince\s+(19|20)\d{2}\b/i, 'a years-in-business claim'],
    [/\b(over|more than)\s+[\d,]+\s+(jobs|tanks|customers|homes)\s+(served|completed|pumped)\b/i, 'a job count'],
    [/lorem ipsum/i, 'lorem ipsum'],
    [/\bexample\s+\d\b/i, 'an "example N" placeholder'],
    [/\bcoming soon\b/i, '"coming soon"'],
    [/placeholder\s+(text|content|copy|review|image|name)/i, 'placeholder content'],
    [/\b(TBD|TODO|FIXME|XXX)\b/, 'an unfinished marker'],
    [/your (text|content|review) here/i, 'dummy copy'],
    [/<!--\s*replace later/i, 'a replace-later comment'],
  ];
  const hits = [];
  for (const p of pages) for (const [re, label] of banned) if (re.test(p.html)) hits.push(`${p.route}: ${label}`);
  hits.length === 0
    ? pass('No fabricated reviews, ratings, counts, history or placeholder text anywhere in dist/')
    : fail('Proof-hygiene violations', hits.join('\n          '));

  const proof = JSON.parse(readFileSync(resolve(root, 'src/data/proof.json'), 'utf8'));
  const empty = ['testimonials', 'stats', 'credentials', 'team', 'awards'].filter((k) => proof[k].length > 0);
  empty.length === 0
    ? pass('All dormant proof slots empty; components render nothing')
    : warn('Proof slots populated — verify every entry is real and verifiable', empty.join(', '));

  // Dormant components must emit nothing at all when empty.
  const hollow = pages.filter((p) => /<section[^>]*>\s*<div[^>]*>\s*<\/div>\s*<\/section>/.test(p.html));
  hollow.length === 0 ? pass('No hollow sections from empty proof components') : fail('Hollow sections', hollow.map((p) => p.route).join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('9. DEFECT BLACKLIST');
{
  const checks = [];
  // naive pluralisation and doubled city names
  for (const p of pages) {
    if (/\b(\w+s)\s+Works\b/.test(p.text)) checks.push(`${p.route}: naive pluralisation ("… Works")`);
    for (const h of p.headings) {
      const c = (h.text.match(/\bNashville\b/g) || []).length;
      if (c > 1) checks.push(`${p.route}: doubled city in heading "${h.text}"`);
    }
    if (/```|\*\*|\[.+\]\(.+\)/.test((p.html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/) || [])[1] || ''))
      checks.push(`${p.route}: markdown syntax inside JSON-LD`);
  }
  checks.length === 0 ? pass('No naive pluralisation, doubled-city headings or markdown in JSON-LD') : fail('Defect blacklist', checks.join('\n          '));

  // JSON-LD must parse on every page that emits it.
  const bad = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try { JSON.parse(m[1]); } catch (e) { bad.push(`${p.route}: ${e.message}`); }
    }
  }
  bad.length === 0 ? pass('All JSON-LD parses') : fail('Invalid JSON-LD', bad.join('\n          '));

  const noSchema = contentPages.filter((p) => !p.html.includes('application/ld+json'));
  noSchema.length === 0 ? pass('Every content page emits a JSON-LD @graph') : fail('Pages without schema', noSchema.map((p) => p.route).join(', '));

  // OG/twitter images absolute (donor bug).
  const relOg = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/<meta (?:property|name)="(og:image|twitter:image)" content="([^"]*)"/g))
      if (!m[2].startsWith('https://')) relOg.push(`${p.route}: ${m[1]}=${m[2]}`);
  }
  relOg.length === 0 ? pass('All OG/twitter image URLs absolute') : fail('Relative social image URLs', relOg.join(', '));

  // Every <img> has width/height/alt/loading.
  const imgIssues = [];
  for (const p of pages) {
    for (const m of p.html.matchAll(/<img\b[^>]*>/g)) {
      const tag = m[0];
      const need = ['alt=', 'width=', 'height='].filter((a) => !tag.includes(a));
      if (need.length) imgIssues.push(`${p.route}: <img> missing ${need.join(', ')}`);
    }
  }
  imgIssues.length === 0 ? pass('Every <img> carries alt, width and height') : fail('Image attributes', imgIssues.slice(0, 6).join('\n          '));

  // Manifest and <head> icon paths must resolve on disk.
  const manifest = JSON.parse(readFileSync(resolve(dist, 'site.webmanifest'), 'utf8'));
  const iconPaths = new Set(manifest.icons.map((i) => i.src));
  for (const m of pages[0].html.matchAll(/<link rel="(?:icon|apple-touch-icon|manifest)"[^>]*href="([^"]+)"/g)) iconPaths.add(m[1]);
  const missingIcons = [...iconPaths].filter((p) => !existsSync(resolve(dist, p.replace(/^\//, ''))));
  missingIcons.length === 0
    ? pass(`All ${iconPaths.size} referenced icon/manifest paths exist in dist/`)
    : fail('Referenced icons missing from the build', missingIcons.join(', '));

  // Form must POST somewhere real, and carry the honeypot.
  const cfg = readFileSync(resolve(root, 'src/config.ts'), 'utf8');
  const endpoint = (cfg.match(/endpoint:\s*'([^']*)'/) || [])[1];
  const enabled = /enabled:\s*true/.test(cfg);
  const formPages = pages.filter((p) => /<form\b/.test(p.html));
  const noAction = formPages.filter((p) => !/<form[^>]+action="https?:\/\//.test(p.html));
  noAction.length === 0 ? pass(`All ${formPages.length} pages with forms POST to an absolute endpoint`) : fail('Forms with no action', noAction.map((p) => p.route).join(', '));
  const noHoneypot = formPages.filter((p) => !p.html.includes('_website_url'));
  noHoneypot.length === 0 ? pass('Honeypot field present on every form') : fail('Forms without honeypot', noHoneypot.map((p) => p.route).join(', '));
  if (!enabled || /REPLACE-ME/.test(endpoint))
    warn('FORM_ENDPOINT is still the placeholder — forms render disabled by design. Set FORMS.endpoint and FORMS.enabled in src/config.ts before launch.');

  // Designed 404 with recovery links.
  const p404 = pages.find((p) => p.route === '/404.html');
  p404 && (p404.html.match(/<a\b/g) || []).length > 12
    ? pass('Designed 404 page with recovery links')
    : fail('404 page missing or has too few recovery links');
}

// ═══════════════════════════════════════════════════════════════════════════
section('10. INTERNAL LINKING');
{
  const routes = new Set(contentPages.map((p) => p.route));
  const broken = new Map();
  const inbound = new Map([...routes].map((r) => [r, 0]));
  for (const p of pages) {
    for (const m of p.html.matchAll(/href="(\/[^"#?]*)"/g)) {
      const href = m[1];
      if (/\.(xml|txt|json|js|mjs|css|webmanifest|svg|png|jpe?g|webp|ico|md|woff2?)$/.test(href)) continue;
      if (routes.has(href)) { if (p.route !== href) inbound.set(href, inbound.get(href) + 1); }
      else { const s = broken.get(p.route) || new Set(); s.add(href); broken.set(p.route, s); }
    }
  }
  broken.size === 0
    ? pass('Zero broken internal links across the whole build')
    : fail('Broken internal links', [...broken].map(([r, s]) => `${r} → ${[...s].join(', ')}`).join('\n          '));

  const orphans = [...inbound].filter(([r, n]) => n === 0 && r !== '/');
  orphans.length === 0 ? pass('No orphan pages — every page has an inbound internal link') : fail('Orphan pages', orphans.map(([r]) => r).join(', '));

  // Homepage-as-hub: every subpage must link its brand mention back to /.
  const noUpLink = contentPages.filter((p) => p.route !== '/' && !/<a[^>]+href="\/"/.test(p.html));
  noUpLink.length === 0 ? pass('Every subpage links back up to the homepage hub') : fail('Pages not linking to the homepage', noUpLink.map((p) => p.route).join(', '));

  // Every guide must be reachable from its parent service page.
  const svc = JSON.parse(readFileSync(resolve(root, 'src/data/services.json'), 'utf8'));
  const unreached = [];
  for (const p of contentPages.filter((x) => x.route.startsWith('/guide/') && x.route !== '/guide/')) {
    const slug = p.route.replace(/^\/guide\/|\/$/g, '');
    const parents = svc.filter((s) => s.guideSlugs.includes(slug)).map((s) => `/${s.slug}/`);
    const linked = parents.some((r) => pages.find((x) => x.route === r)?.html.includes(`/guide/${slug}/`));
    if (!linked) unreached.push(p.route);
  }
  unreached.length === 0 ? pass('Every guide is linked from its parent service page') : fail('Guides not reachable from a service page', unreached.join(', '));

  // City pages link to 3 siblings.
  const cities = JSON.parse(readFileSync(resolve(root, 'src/data/cities.json'), 'utf8'));
  const badSiblings = cities.filter((c) => {
    const p = pages.find((x) => x.route === `/service-areas/${c.slug}/`);
    return c.nearbyCities.filter((n) => p.html.includes(`/service-areas/${n}/`)).length < 3;
  });
  badSiblings.length === 0 ? pass('Every city page links to 3 sibling cities') : fail('City pages with <3 sibling links', badSiblings.map((c) => c.slug).join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('11. AI LAYER + JS BUDGET');
{
  for (const f of ['llms.txt', 'llms-full.txt', 'robots.txt', '_headers', '.htaccess', '_redirects',
                   '.well-known/api-catalog', '.well-known/agent-card.json',
                   '.well-known/agent-skills/index.json', '.well-known/mcp/server-card.json',
                   'agent-ready-webmcp.js', 'index.md']) {
    existsSync(resolve(dist, f)) ? pass(`dist/${f}`) : fail(`Missing artifact: dist/${f}`);
  }

  const noMirror = contentPages.filter((p) => {
    const md = p.route === '/' ? 'index.md' : p.route.replace(/^\/|\/$/g, '') + '.md';
    return !existsSync(resolve(dist, md));
  });
  noMirror.length === 0 ? pass(`Markdown mirror for all ${contentPages.length} pages`) : fail('Missing .md mirrors', noMirror.map((p) => p.route).join(', '));

  const noAlt = contentPages.filter((p) => !/rel="alternate" type="text\/markdown"/.test(p.html));
  noAlt.length === 0 ? pass('Every page advertises its markdown mirror in <head>') : fail('Pages not advertising a mirror', noAlt.map((p) => p.route).join(', '));

  // JS budget: non-tool pages ship only the webmcp file + the inline module.
  const toolRoutes = ['/tools/septic-pumping-cost-estimator/', '/tools/septic-system-assessment/'];
  const overBudget = contentPages
    .filter((p) => !toolRoutes.includes(p.route))
    .filter((p) => [...p.html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].some((m) => m[1] !== '/agent-ready-webmcp.js' && !m[1].includes('plausible')));
  overBudget.length === 0
    ? pass('Non-tool pages ship only the webmcp file, the analytics tag and one inline module')
    : fail('Extra JS on non-tool pages', overBudget.map((p) => p.route).join(', '));

  // Analytics must be live, not commented out.
  const noAnalytics = contentPages.filter((p) => !/plausible\.io|googletagmanager\.com/.test(p.html));
  noAnalytics.length === 0
    ? pass('Analytics tag ships live on every page')
    : fail('Pages without an analytics tag', noAnalytics.map((p) => p.route).join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('12. HTTPS / MIXED CONTENT / MOBILE');
{
  const http = [];
  for (const p of pages) for (const m of p.html.matchAll(/(?:href|src|content)="(http:\/\/[^"]+)"/g))
    if (!m[1].startsWith('http://www.w3.org') && !m[1].startsWith('http://schema.org')) http.push(`${p.route}: ${m[1]}`);
  http.length === 0 ? pass('No http:// asset, link, canonical or schema URL — zero mixed content') : fail('Mixed content', http.join('\n          '));

  const noViewport = pages.filter((p) => !/name="viewport"/.test(p.html));
  noViewport.length === 0 ? pass('Viewport meta on every page') : fail('Missing viewport', noViewport.map((p) => p.route).join(', '));

  const noThemeColor = pages.filter((p) => !/name="theme-color"/.test(p.html));
  noThemeColor.length === 0 ? pass('theme-color on every page') : fail('Missing theme-color', noThemeColor.map((p) => p.route).join(', '));

  const noCallBar = contentPages.filter((p) => !/data-cta="sticky-call-bar"/.test(p.html));
  noCallBar.length === 0 ? pass('Sticky mobile call bar rendered in HTML on every page') : fail('Pages without the sticky call bar', noCallBar.map((p) => p.route).join(', '));
}

// ═══════════════════════════════════════════════════════════════════════════
section('13. PAGE COUNT');
{
  const plan = { min: 60, max: 70 };
  contentPages.length >= plan.min && contentPages.length <= plan.max
    ? pass(`${contentPages.length} content pages built`, `Phase 1 plan: ${plan.min}–${plan.max}`)
    : warn(`${contentPages.length} content pages built, plan was ${plan.min}–${plan.max}`);
}

// ═══════════════════════════════════════════════════════════════════════════
console.log(`\n${'═'.repeat(62)}`);
if (failures === 0) {
  console.log(`QA GATES PASSED — 0 failures, ${warnings} warning${warnings === 1 ? '' : 's'}`);
  console.log('═'.repeat(62) + '\n');
} else {
  console.log(`QA GATES FAILED — ${failures} failure${failures === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}`);
  console.log('═'.repeat(62) + '\n');
  process.exit(1);
}
