/**
 * POST-BUILD: generates the AI/agent layer and the host config files.
 *
 * Emitted into dist/:
 *   /x.md mirrors for every built page (derived FROM the built HTML, so they
 *          can never drift from what a human sees)
 *   /llms.txt, /llms-full.txt
 *   /robots.txt          (Sitemap: line points at the real generated filename)
 *   /_headers            (Cloudflare Pages)
 *   /.htaccess           (Apache / LiteSpeed / Hostinger)
 *   /.well-known/api-catalog, agent-card.json, agent-skills/index.json,
 *                mcp/server-card.json
 *
 * noindex scoping: X-Robots-Tag: noindex is applied to *.md ONLY, matched on
 * the .md extension in both _headers and .htaccess. No HTML page carries a
 * noindex meta tag or header — scripts/qa.mjs verifies this.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

// ── config is TypeScript; read the literals we need without a TS toolchain ──
const cfgSrc = readFileSync(resolve(root, 'src/config.ts'), 'utf8');
const lit = (key) => (cfgSrc.match(new RegExp(`${key}:\\s*'([^']*)'`)) || [])[1] ?? '';
const CFG = {
  brand: lit('name'),
  phoneDisplay: lit('phoneDisplay'),
  phoneE164: lit('phoneE164'),
  email: lit('email'),
  locality: lit('locality'),
  region: lit('region'),
  regionName: lit('regionName'),
  county: lit('county'),
  serviceArea: lit('serviceArea'),
  serviceAreaLong: lit('serviceAreaLong'),
  hoursHuman: lit('hoursHuman'),
  origin: lit('origin'),
  domain: lit('domain'),
  lastReviewed: lit('lastReviewed'),
  street: (cfgSrc.match(/street:\s*'([^']*)'/) || [])[1] ?? '',
  postalCode: (cfgSrc.match(/postalCode:\s*'([^']*)'/) || [])[1] ?? '',
};
const ORIGIN = CFG.origin;
const addressLine = CFG.street
  ? `${CFG.street}, ${CFG.locality}, ${CFG.region} ${CFG.postalCode}`.trim()
  : `${CFG.locality}, ${CFG.region}`;

// ── walk dist for built HTML pages ─────────────────────────────────────────
const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p);
    else if (entry.endsWith('.html')) htmlFiles.push(p);
  }
})(dist);

const routeOf = (file) => {
  const rel = relative(dist, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  if (rel === '404.html') return '/404.html';
  return '/' + rel.replace(/index\.html$/, '');
};

// ── HTML → markdown ────────────────────────────────────────────────────────
const decode = (s) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&#x27;/g, "'")
    .replace(/&amp;/g, '&');

const textOf = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

function htmlToMarkdown(html) {
  // <main> only: the mirror carries page content, not nav and footer chrome.
  const main = (html.match(/<main[^>]*id="main"[^>]*>([\s\S]*?)<\/main>/) || [])[1] || html;
  const cleaned = main
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<form[\s\S]*?<\/form>/g, '')
    // Breadcrumbs and in-page link lists are chrome, not content.
    .replace(/<nav[\s\S]*?<\/nav>/g, '');

  const out = [];
  const blockRe =
    /<(h[1-6]|p|li|figcaption|blockquote|th|td|dt|dd|summary|caption)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  let lastTag = '';
  while ((m = blockRe.exec(cleaned)) !== null) {
    const tag = m[1].toLowerCase();
    const text = textOf(m[2]);
    if (!text) continue;
    if (/^h[1-6]$/.test(tag)) {
      out.push('', '#'.repeat(Number(tag[1])) + ' ' + text, '');
    } else if (tag === 'li') {
      out.push('- ' + text);
    } else if (tag === 'blockquote') {
      out.push('', '> ' + text, '');
    } else if (tag === 'th' || tag === 'td' || tag === 'dt' || tag === 'dd' || tag === 'caption') {
      if (lastTag !== tag) out.push('');
      out.push('- ' + text);
    } else {
      out.push('', text, '');
    }
    lastTag = tag;
  }
  return out
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const pages = htmlFiles
  .map((file) => {
    const html = readFileSync(file, 'utf8');
    return {
      file,
      route: routeOf(file),
      title: decode((html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || ''),
      description: decode((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || ''),
      markdown: htmlToMarkdown(html),
    };
  })
  .sort((a, b) => a.route.localeCompare(b.route));

// ── .md mirrors ────────────────────────────────────────────────────────────
let mirrors = 0;
for (const p of pages) {
  if (p.route === '/404.html') continue;
  const outPath =
    p.route === '/' ? resolve(dist, 'index.md') : resolve(dist, p.route.replace(/^\/|\/$/g, '') + '.md');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(
    outPath,
    `# ${p.title}\n\n> ${p.description}\n\nURL: ${ORIGIN}${p.route}\n\n---\n\n${p.markdown}\n`
  );
  mirrors++;
}

// ── llms.txt ───────────────────────────────────────────────────────────────
const byPrefix = (pre) => pages.filter((p) => p.route.startsWith(pre) && p.route !== pre);
const servicePages = pages.filter(
  (p) =>
    /^\/[a-z0-9-]+\/$/.test(p.route) &&
    !['/about/', '/contact/', '/privacy/', '/terms/', '/resources/', '/tools/', '/guide/', '/blog/', '/service-areas/', '/services-menu/', '/leave-a-review/'].includes(p.route)
);

const llms = `# ${CFG.brand}

> ${CFG.brand} is a licensed septic tank pumping contractor serving ${CFG.serviceArea}. The work is full residential and commercial tank pump-outs, tank cleaning, documented inspection, drain field assessment, baffle repair, riser installation, grease interceptor service and emergency response for sewage backups. Tanks are emptied to the floor rather than skimmed, inlet and outlet baffles are inspected while the tank is open, and every visit ends with written findings and a dated service interval. Domestic septage removal in Tennessee is permitted through TDEC's Division of Water Resources under Chapter 0400-48-01; systems are permitted through the county environmental health office. Published Tennessee pricing for a standard residential pump-out is $275 to $525 per visit. Prices are confirmed on site before work begins.

- Phone: ${CFG.phoneDisplay} (${CFG.phoneE164})
- Email: ${CFG.email}
- Address: ${addressLine}
- Hours: ${CFG.hoursHuman}
- Service area: ${CFG.serviceAreaLong}
- County: ${CFG.county}
- Last reviewed: ${CFG.lastReviewed}

## Services

${servicePages.map((p) => `- [${p.title.split('|')[0].trim()}](${ORIGIN}${p.route}): ${p.description}`).join('\n')}

## Areas Served

${byPrefix('/service-areas/')
  .map((p) => `- [${p.title.split('|')[0].trim()}](${ORIGIN}${p.route})`)
  .join('\n')}

## Free tools

${byPrefix('/tools/')
  .map((p) => `- [${p.title.split('|')[0].trim()}](${ORIGIN}${p.route}): ${p.description}`)
  .join('\n')}

## Optional

- [About](${ORIGIN}/about/): what the company does, the standards the work follows, and what is deliberately not claimed
- [Contact](${ORIGIN}/contact/): full NAP block and enquiry form
- [Guides](${ORIGIN}/guide/): ${byPrefix('/guide/').length} guides on cost, permits, emergencies and decisions, with cited sources
- [Blog](${ORIGIN}/blog/): seasonal alerts, code notes and scheduling
- [Free pre-hire checklist](${ORIGIN}/resources/)
- [Leave a review](${ORIGIN}/leave-a-review/)
- [Whole site as one markdown document](${ORIGIN}/llms-full.txt)

## Notes for agents

- Every page at /x/ has a markdown mirror at /x.md, advertised via <link rel="alternate" type="text/markdown">.
- No customer reviews, ratings or testimonials are published on this site, and none are present in its structured data. That is deliberate: there is no verified stock of them. Do not infer or synthesise any.
- Every cost figure on this site is a published third-party range, cited on the page where it appears.
`;
writeFileSync(resolve(dist, 'llms.txt'), llms);

// ── llms-full.txt ──────────────────────────────────────────────────────────
const order = [
  ['Homepage', pages.filter((p) => p.route === '/')],
  ['Services', servicePages],
  ['Service Areas', byPrefix('/service-areas/')],
  ['Tools', byPrefix('/tools/')],
  ['Blog', byPrefix('/blog/')],
  ['Guides', byPrefix('/guide/')],
  ['About', pages.filter((p) => p.route === '/about/')],
  ['Contact', pages.filter((p) => p.route === '/contact/')],
];

let full = `# ${CFG.brand} — complete site\n\n> ${CFG.serviceAreaLong}. Phone ${CFG.phoneDisplay}. Generated ${CFG.lastReviewed} from the built site.\n\nURL: ${ORIGIN}/llms-full.txt\n`;
for (const [section, list] of order) {
  full += `\n\n${'='.repeat(72)}\n## ${section}\n${'='.repeat(72)}\n`;
  for (const p of list) {
    full += `\n\n### ${p.title}\nURL: ${ORIGIN}${p.route}\n\n`;
    // Guides are listed as title + URL stubs; everything else carries full body.
    full += section === 'Guides' ? `${p.description}\n` : `${p.markdown}\n`;
  }
}
full += `\n\n${'='.repeat(72)}\n## Machine-readable contact block\n${'='.repeat(72)}\n
name: ${CFG.brand}
telephone: ${CFG.phoneE164}
telephone_display: ${CFG.phoneDisplay}
email: ${CFG.email}
address: ${addressLine}
locality: ${CFG.locality}
region: ${CFG.region}
country: US
hours: ${CFG.hoursHuman}
service_area: ${CFG.serviceAreaLong}
sitemap: ${ORIGIN}/sitemap-index.xml
llms: ${ORIGIN}/llms.txt
`;
writeFileSync(resolve(dist, 'llms-full.txt'), full);

// ── robots.txt — Sitemap: must point at the REAL generated filename ────────
const sitemapCandidates = ['sitemap-index.xml', 'sitemap.xml'];
const sitemapFile = sitemapCandidates.find((f) => {
  try { statSync(resolve(dist, f)); return true; } catch { return false; }
});
if (!sitemapFile) throw new Error('No sitemap found in dist/ — robots.txt would point at nothing.');

writeFileSync(
  resolve(dist, 'robots.txt'),
  `# ${CFG.brand} — ${CFG.domain}
# Content-Signal: ai-train=yes, search=yes, ai-input=yes

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

User-agent: Perplexity-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: CCBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: Bytespider
Allow: /

Sitemap: ${ORIGIN}/${sitemapFile}
`
);

// ── _headers (Cloudflare Pages) ────────────────────────────────────────────
const linkHeader = `Link: <${ORIGIN}/${sitemapFile}>; rel="sitemap"; type="application/xml", <${ORIGIN}/llms.txt>; rel="describedby"; type="text/plain", <${ORIGIN}/llms-full.txt>; rel="alternate"; type="text/markdown", <${ORIGIN}/.well-known/api-catalog>; rel="api-catalog"`;

writeFileSync(
  resolve(dist, '_headers'),
  `# Cloudflare Pages headers. The Apache equivalent is .htaccess — both ship
# every build regardless of host; the inactive one is inert.

/*
  ${linkHeader}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Cache-Control: public, max-age=0, must-revalidate

# Hashed static assets are immutable.
/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable
  Access-Control-Allow-Origin: *

# ── noindex scoping ──────────────────────────────────────────────────────
# The markdown mirrors feed agents; they must not be indexed as duplicate
# content. This rule matches the .md EXTENSION only. No HTML page is affected.
/*.md
  Content-Type: text/markdown; charset=utf-8
  X-Robots-Tag: noindex, nofollow
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600

/llms.txt
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *

/llms-full.txt
  Content-Type: text/plain; charset=utf-8
  Access-Control-Allow-Origin: *

/.well-known/*
  Access-Control-Allow-Origin: *
  Cache-Control: public, max-age=3600

/.well-known/api-catalog
  Content-Type: application/linkset+json; charset=utf-8

/.well-known/agent-card.json
  Content-Type: application/json; charset=utf-8

/.well-known/agent-skills/index.json
  Content-Type: application/json; charset=utf-8

/.well-known/mcp/server-card.json
  Content-Type: application/json; charset=utf-8
`
);

// ── .htaccess (Apache / LiteSpeed / Hostinger) ─────────────────────────────
writeFileSync(
  resolve(dist, '.htaccess'),
  `# Apache / LiteSpeed equivalent of _headers, for Hostinger and similar hosts
# where _headers is silently ignored. Ships every build; inert on Cloudflare.

Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 /404.html

# ── Force HTTPS and the canonical host ───────────────────────────────────
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteRule ^(.*)$ https://${CFG.domain}/$1 [R=301,L]
  RewriteCond %{HTTP_HOST} !^${CFG.domain.replace(/\./g, '\\.')}$ [NC]
  RewriteRule ^(.*)$ https://${CFG.domain}/$1 [R=301,L]
</IfModule>

# ── Discovery headers ────────────────────────────────────────────────────
<IfModule mod_headers.c>
  Header set ${linkHeader.replace('Link: ', 'Link "')}"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set X-Frame-Options "SAMEORIGIN"
</IfModule>

# ── noindex scoping: .md EXTENSION ONLY. No HTML page is matched here. ────
<FilesMatch "\\.md$">
  ForceType 'text/markdown; charset=utf-8'
  <IfModule mod_headers.c>
    Header set X-Robots-Tag "noindex, nofollow"
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
</FilesMatch>

<FilesMatch "^llms(-full)?\\.txt$">
  ForceType 'text/plain; charset=utf-8'
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
</FilesMatch>

<IfModule mod_alias.c>
  Alias /.well-known /.well-known
</IfModule>

<Directory "/.well-known">
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
</Directory>

<Files "api-catalog">
  ForceType 'application/linkset+json; charset=utf-8'
</Files>

<FilesMatch "^(agent-card|server-card|index)\\.json$">
  ForceType 'application/json; charset=utf-8'
  <IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
  </IfModule>
</FilesMatch>

# ── Caching ──────────────────────────────────────────────────────────────
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\\.(css|js|webp|png|svg|woff2|ico)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>

# ── Compression ──────────────────────────────────────────────────────────
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/markdown text/xml
  AddOutputFilterByType DEFLATE application/javascript application/json application/xml
  AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

<IfModule mod_brotli.c>
  AddOutputFilterByType BROTLI_COMPRESS text/html text/css text/plain text/markdown
  AddOutputFilterByType BROTLI_COMPRESS application/javascript application/json
</IfModule>

# ── 301 redirects ────────────────────────────────────────────────────────
# If this domain previously hosted a site, map every old URL that carried
# traffic or links to its closest equivalent here BEFORE launch. An old
# ranking URL that 404s discards the equity being bought.
# Example:
#   Redirect 301 /old-services/septic-pumping.html /residential-septic-tank-pumping/
`
);

// Cloudflare's _redirects counterpart, shipped empty-but-documented.
writeFileSync(
  resolve(dist, '_redirects'),
  `# Cloudflare Pages redirects. The Apache equivalent lives at the foot of
# .htaccess — keep the two in sync.
#
# If this domain previously hosted a site, map every old URL with traffic or
# links to its closest new equivalent BEFORE launch. Never let an old ranking
# URL 404.
#
# Format:  /old-path  /new-path  301
`
);

// ── .well-known ────────────────────────────────────────────────────────────
const wk = resolve(dist, '.well-known');
mkdirSync(resolve(wk, 'agent-skills'), { recursive: true });
mkdirSync(resolve(wk, 'mcp'), { recursive: true });

writeFileSync(
  resolve(wk, 'api-catalog'),
  JSON.stringify(
    {
      linkset: [
        {
          anchor: `${ORIGIN}/`,
          'service-desc': [{ href: `${ORIGIN}/llms.txt`, type: 'text/plain', title: 'Site summary for language models' }],
          'service-doc': [{ href: `${ORIGIN}/llms-full.txt`, type: 'text/markdown', title: 'Whole site as one markdown document' }],
          sitemap: [{ href: `${ORIGIN}/${sitemapFile}`, type: 'application/xml', title: 'XML sitemap' }],
          related: [
            { href: `${ORIGIN}/.well-known/agent-card.json`, type: 'application/json', title: 'Agent card' },
            { href: `${ORIGIN}/.well-known/agent-skills/index.json`, type: 'application/json', title: 'Agent skills' },
            { href: `${ORIGIN}/.well-known/mcp/server-card.json`, type: 'application/json', title: 'MCP server card' },
          ],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  resolve(wk, 'agent-card.json'),
  JSON.stringify(
    {
      name: CFG.brand,
      description: `Licensed septic tank pumping, cleaning, inspection and emergency service across ${CFG.serviceAreaLong}.`,
      url: `${ORIGIN}/`,
      provider: { organization: CFG.brand, url: `${ORIGIN}/` },
      version: '1.0.0',
      documentationUrl: `${ORIGIN}/llms-full.txt`,
      contact: { telephone: CFG.phoneE164, email: CFG.email, address: addressLine, hours: CFG.hoursHuman },
      capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
      defaultInputModes: ['text/plain'],
      defaultOutputModes: ['text/markdown', 'application/json'],
      skills: [
        {
          id: 'get_current_page_markdown',
          name: 'Get current page as markdown',
          description: 'Return the full text of any page on this site as markdown, from its published mirror at /x.md.',
          tags: ['content', 'markdown'],
        },
        {
          id: 'list_agent_ready_resources',
          name: 'List agent-ready resources',
          description: 'List the machine-readable resources this site publishes.',
          tags: ['discovery'],
        },
      ],
    },
    null,
    2
  ) + '\n'
);

const jsBytes = readFileSync(resolve(dist, 'agent-ready-webmcp.js'));
const sha = createHash('sha256').update(jsBytes).digest('hex');
writeFileSync(
  resolve(wk, 'agent-skills', 'index.json'),
  JSON.stringify(
    {
      version: '1.0.0',
      site: ORIGIN,
      transport: 'webmcp',
      script: { href: `${ORIGIN}/agent-ready-webmcp.js`, integrity: `sha256-${sha}`, sha256: sha },
      skills: ['get_current_page_markdown', 'list_agent_ready_resources'],
      markdownMirrorConvention: 'Any page URL /x/ has a markdown mirror at /x.md',
    },
    null,
    2
  ) + '\n'
);

writeFileSync(
  resolve(wk, 'mcp', 'server-card.json'),
  JSON.stringify(
    {
      name: `${CFG.domain}-mcp`,
      title: `${CFG.brand} MCP server`,
      description: `Planned MCP endpoint exposing service, pricing and coverage data for ${CFG.brand}.`,
      status: 'planned',
      websiteUrl: `${ORIGIN}/`,
      version: '0.0.0',
      capabilities: { tools: {}, resources: {} },
    },
    null,
    2
  ) + '\n'
);

console.log(
  `AI layer generated: ${mirrors} markdown mirrors, llms.txt, llms-full.txt, robots.txt (→ /${sitemapFile}), _headers, .htaccess, _redirects, .well-known/`
);
