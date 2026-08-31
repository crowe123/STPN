/**
 * Phase 5 — the AI/agent layer. Runs after `astro build`, over dist/.
 * Emits: llms.txt, llms-full.txt, per-page .md mirrors, robots.txt, _headers,
 * .htaccess, agent-ready-webmcp.js and the .well-known set.
 *
 * NOINDEX SCOPING: X-Robots-Tag: noindex applies to *.md ONLY. The patterns
 * below match the .md extension specifically — never a directory or a wildcard
 * that could catch HTML. QA gate 6 verifies no HTML page carries noindex.
 */
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const DIST = 'dist';
const cfg = await import('../src/config.ts').catch(() => null);
const ORIGIN = 'https://615septictankpumping.com';
const BRAND = '615 Septic Tank Pumping';
const PHONE = '(615) 234-9048';
const EMAIL = 'support@615septictankpumping.com';
const ADDRESS = '1801 West End Avenue, Suite 1000, Nashville, TN 37203';
const HOURS = 'Mon–Fri 7am–6pm, Sat 8am–2pm. Septic backups answered outside those hours.';
const AREA = 'Nashville and Davidson County, Tennessee';

const services = JSON.parse(await readFile('src/data/services.json', 'utf8')).services;
const cities = JSON.parse(await readFile('src/data/cities.json', 'utf8')).cities;

/* ── walk dist for built HTML pages ───────────────────────────────────── */
async function walk(dir, acc = []) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) await walk(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}
const files = await walk(DIST);

const strip = (h) => h
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<svg[\s\S]*?<\/svg>/gi, '')
  .replace(/<header[\s\S]*?<\/header>/gi, '')
  .replace(/<footer[\s\S]*?<\/footer>/gi, '')
  .replace(/<nav[\s\S]*?<\/nav>/gi, '');

function toMarkdown(html) {
  let s = strip(html);
  const main = s.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  s = main ? main[1] : s;
  s = s
    .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => `\n\n# ${clean(t)}\n`)
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => `\n\n## ${clean(t)}\n`)
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => `\n\n### ${clean(t)}\n`)
    .replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => `\n\n#### ${clean(t)}\n`)
    .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `- ${clean(t)}\n`)
    .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => `\n${clean(t)}\n`)
    .replace(/<summary[^>]*>([\s\S]*?)<\/summary>/gi, (_, t) => `\n**${clean(t)}**\n`)
    .replace(/<[^>]+>/g, ' ');
  return decode(s).replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}
const clean = (t) => decode(t.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();
const decode = (t) => t
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&mdash;/g, '—').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…')
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));

const pages = [];
for (const f of files) {
  const html = await readFile(f, 'utf8');
  const route = '/' + path.relative(DIST, path.dirname(f)).replace(/\\/g, '/');
  const url = route === '/.' || route === '/' ? '/' : `${route}/`;
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').trim();
  const desc = (html.match(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i)?.[1] || '').trim();
  pages.push({ url, title: decode(title), desc: decode(desc), body: toMarkdown(html), file: f });
}

/* ── per-page .md mirrors: /x/ -> /x.md ───────────────────────────────── */
let mirrors = 0;
for (const p of pages) {
  if (p.url === '/404/') continue;
  const rel = p.url === '/' ? 'index.md' : `${p.url.replace(/^\/|\/$/g, '')}.md`;
  const out = path.join(DIST, rel);
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, `# ${p.title}\n\n> ${p.desc}\n\nURL: ${ORIGIN}${p.url}\n\n${p.body}\n`);
  mirrors++;
}

/* ── llms.txt ─────────────────────────────────────────────────────────── */
const svcList = services.map((s) => `- [${s.name}](${ORIGIN}/${s.slug}/): ${s.blurb}`).join('\n');
const cityList = cities.map((c) => `- [${c.name}](${ORIGIN}/service-areas/${c.slug}/): ${c.county}, ${c.zip}`).join('\n');
await writeFile(path.join(DIST, 'llms.txt'), `# ${BRAND}

> ${BRAND} is a septic tank pumping company serving ${AREA}. It pumps, cleans and inspects residential and commercial septic systems, services grease traps and interceptors under Metro Water Services' FOG program, and diagnoses failing drain fields. Work follows Tenn. Comp. R. & Regs. 0400-48-01-.20 for septic tank pumping contractors and TDEC's Subsurface Sewage Disposal Program; Davidson County administers its own septic program as a TDEC contract county. Price ranges are published on every service page and a cost estimator is available without providing contact details.

- Phone: ${PHONE}
- Email: ${EMAIL}
- Address: ${ADDRESS}
- Hours: ${HOURS}
- Service area: ${AREA}

## Services

${svcList}

## Areas Served

${cityList}

## Optional

- [About](${ORIGIN}/about/): what the company does and the standards the work follows
- [Contact](${ORIGIN}/contact/)
- [Guides](${ORIGIN}/guide/): 29 guides on septic costs, Davidson County rules, urgency and repair decisions
- [Blog](${ORIGIN}/blog/)
- [Cost estimator](${ORIGIN}/tools/septic-pumping-cost-estimator/)
- [Urgency assessment](${ORIGIN}/tools/septic-system-assessment/)
- [Full text](${ORIGIN}/llms-full.txt)
`);

/* ── llms-full.txt: fixed order ───────────────────────────────────────── */
const order = (u) =>
  u === '/' ? 0
  : services.some((s) => u === `/${s.slug}/`) ? 1
  : u.startsWith('/service-areas/') ? 2
  : u.startsWith('/blog/') ? 3
  : u.startsWith('/guide/') ? 4
  : u === '/about/' ? 5
  : u === '/contact/' ? 6
  : 7;
const sorted = [...pages].filter((p) => p.url !== '/404/').sort((a, b) => order(a.url) - order(b.url) || a.url.localeCompare(b.url));
const full = sorted.map((p) => {
  const stub = p.url.startsWith('/guide/') && p.url !== '/guide/';
  return `# ${p.title}\nURL: ${ORIGIN}${p.url}\n\n> ${p.desc}\n${stub ? '' : `\n${p.body}\n`}`;
}).join('\n\n---\n\n');
await writeFile(path.join(DIST, 'llms-full.txt'), `# ${BRAND} — full site text\n\nURL: ${ORIGIN}/\n\n${full}\n`);

/* ── robots.txt ───────────────────────────────────────────────────────── */
await writeFile(path.join(DIST, 'robots.txt'), `# Content-Signal: ai-train=yes, search=yes, ai-input=yes
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Bingbot
Allow: /

Sitemap: ${ORIGIN}/sitemap-index.xml
`);

/* ── _headers (Cloudflare) ────────────────────────────────────────────── */
await writeFile(path.join(DIST, '_headers'), `/*
  Link: <${ORIGIN}/sitemap-index.xml>; rel="sitemap", <${ORIGIN}/llms.txt>; rel="alternate"; type="text/plain", <${ORIGIN}/llms-full.txt>; rel="alternate"; type="text/plain", <${ORIGIN}/.well-known/api-catalog>; rel="api-catalog"
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Cache-Control: public, max-age=0, must-revalidate

# Markdown mirrors only. The .md extension is matched explicitly so this rule
# can never apply to an HTML page.
/*.md
  Content-Type: text/markdown; charset=utf-8
  X-Robots-Tag: noindex

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/.well-known/*
  Access-Control-Allow-Origin: *
  Content-Type: application/json; charset=utf-8

/agent-ready-webmcp.js
  Cache-Control: public, max-age=86400
`);

/* ── .htaccess (Apache/LiteSpeed) — same rules, shipped regardless of host ── */
await writeFile(path.join(DIST, '.htaccess'), `ErrorDocument 404 /404.html
Options -Indexes
DirectoryIndex index.html

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Link "<${ORIGIN}/sitemap-index.xml>; rel=\\"sitemap\\", <${ORIGIN}/llms.txt>; rel=\\"alternate\\"; type=\\"text/plain\\", <${ORIGIN}/llms-full.txt>; rel=\\"alternate\\"; type=\\"text/plain\\", <${ORIGIN}/.well-known/api-catalog>; rel=\\"api-catalog\\""

  # Markdown mirrors ONLY — the pattern matches the .md extension explicitly so
  # it cannot apply to an HTML page.
  <FilesMatch "\\.md$">
    Header always set X-Robots-Tag "noindex"
    Header always set Content-Type "text/markdown; charset=utf-8"
  </FilesMatch>

  <FilesMatch "\\.(json|well-known)$">
    Header always set Access-Control-Allow-Origin "*"
  </FilesMatch>
</IfModule>

<IfModule mod_mime.c>
  AddType text/markdown .md
  AddType image/webp .webp
  AddType application/manifest+json .webmanifest
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|webp|jpg|png|svg|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript text/plain text/markdown application/json image/svg+xml
</IfModule>

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
`);

/* ── webmcp + .well-known ─────────────────────────────────────────────── */
const webmcp = `/* agent-ready webmcp shim. Registers two read-only tools against
   navigator.modelContext when present, and is a silent no-op when absent. */
(function () {
  var mc = typeof navigator !== 'undefined' && navigator.modelContext;
  if (!mc || typeof mc.registerTool !== 'function') return;
  function mdUrl() {
    var p = location.pathname;
    return location.origin + (p === '/' ? '/index.md' : p.replace(/\\/$/, '') + '.md');
  }
  try {
    mc.registerTool({
      name: 'get_current_page_markdown',
      description: 'Return the markdown mirror of the current page.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        var r = await fetch(mdUrl(), { headers: { Accept: 'text/markdown' } });
        return { content: [{ type: 'text', text: await r.text() }] };
      }
    });
    mc.registerTool({
      name: 'list_agent_ready_resources',
      description: 'List machine-readable resources published by this site.',
      inputSchema: { type: 'object', properties: {} },
      async execute() {
        return { content: [{ type: 'text', text: JSON.stringify({
          llms: location.origin + '/llms.txt',
          llmsFull: location.origin + '/llms-full.txt',
          sitemap: location.origin + '/sitemap-index.xml',
          pageMarkdown: mdUrl()
        }) }] };
      }
    });
  } catch (e) { /* no-op */ }
})();
`;
await writeFile(path.join(DIST, 'agent-ready-webmcp.js'), webmcp);

const wk = path.join(DIST, '.well-known');
await mkdir(wk, { recursive: true });
const { createHash } = await import('node:crypto');
const sha = createHash('sha256').update(webmcp).digest('hex');

await writeFile(path.join(wk, 'api-catalog'), JSON.stringify({
  linkset: [{
    anchor: `${ORIGIN}/`,
    'service-desc': [{ href: `${ORIGIN}/llms.txt`, type: 'text/plain' }],
    'service-doc': [{ href: `${ORIGIN}/llms-full.txt`, type: 'text/plain' }],
    item: [{ href: `${ORIGIN}/sitemap-index.xml`, type: 'application/xml' }],
  }],
}, null, 2));

await writeFile(path.join(wk, 'agent-card.json'), JSON.stringify({
  name: BRAND,
  description: `Septic tank pumping, cleaning, inspection and grease trap service across ${AREA}.`,
  url: `${ORIGIN}/`,
  provider: { organization: BRAND, url: `${ORIGIN}/` },
  contact: { telephone: PHONE, email: EMAIL, address: ADDRESS },
  capabilities: { streaming: false },
  skills: [
    { id: 'septic-pricing', name: 'Septic pricing information', description: 'Published price ranges for septic services in Davidson County.' },
    { id: 'service-area', name: 'Service area lookup', description: 'Which Davidson County areas are served and which remain on septic.' },
  ],
}, null, 2));

await mkdir(path.join(wk, 'agent-skills'), { recursive: true });
await writeFile(path.join(wk, 'agent-skills', 'index.json'), JSON.stringify({
  skills: [{
    name: 'agent-ready-webmcp',
    url: `${ORIGIN}/agent-ready-webmcp.js`,
    sha256: sha,
    description: 'Registers read-only page-markdown tools against navigator.modelContext.',
  }],
}, null, 2));

await mkdir(path.join(wk, 'mcp'), { recursive: true });
await writeFile(path.join(wk, 'mcp', 'server-card.json'), JSON.stringify({
  name: `${BRAND} MCP`, status: 'planned', url: null,
  description: 'An MCP endpoint for this site is planned but not yet available.',
}, null, 2));

console.log(`AI layer: ${mirrors} .md mirrors, llms.txt, llms-full.txt, robots.txt, _headers, .htaccess, webmcp + .well-known`);
