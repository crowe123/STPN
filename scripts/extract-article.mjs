/**
 * ONE-OFF EXTRACTOR — run once against the supplied article .docx to produce
 * src/data/homepage-article.json and src/data/homepage-article.txt.
 *
 * The homepage must render the supplied article WITHOUT ALTERATION. Extracting
 * it mechanically rather than re-typing it is what guarantees that, and
 * homepage-article.txt is the reference `npm run qa` diffs the built page
 * against on every build.
 *
 * Usage: node scripts/extract-article.mjs <path-to.docx>
 * The .docx itself is not committed; the extracted JSON and TXT are.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = process.argv[2];
if (!src) {
  console.error('usage: node scripts/extract-article.mjs <article.docx>');
  process.exit(1);
}

const xml = execFileSync('unzip', ['-p', src, 'word/document.xml'], { maxBuffer: 64 << 20 }).toString('utf8');

const decode = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');

const paraText = (p) => decode((p.match(/<w:t[^>]*>[\s\S]*?<\/w:t>/g) || []).join(''));
const paraStyle = (p) => (p.match(/w:pStyle w:val="([^"]+)"/) || [])[1] || '';

const body = xml.match(/<w:body>([\s\S]*)<\/w:body>/)[1];

// Split the body into top-level tables and everything else, in document order.
const blocks = [];
const topLevel = body.match(/<w:tbl>[\s\S]*?<\/w:tbl>|<w:p\b[\s\S]*?<\/w:p>|<w:p\/>/g) || [];

for (const node of topLevel) {
  if (node.startsWith('<w:tbl')) {
    const rows = (node.match(/<w:tr\b[\s\S]*?<\/w:tr>/g) || []).map((tr) =>
      (tr.match(/<w:tc>[\s\S]*?<\/w:tc>/g) || []).map((tc) =>
        (tc.match(/<w:p\b[\s\S]*?<\/w:p>|<w:p\/>/g) || []).map(paraText).join(' ').trim()
      )
    );
    if (rows.length) blocks.push({ type: 'table', head: rows[0], rows: rows.slice(1) });
    continue;
  }
  const text = paraText(node).trim();
  if (!text) continue;
  const style = paraStyle(node);
  if (/^Heading1$/.test(style)) blocks.push({ type: 'h1', text });
  else if (/^Heading2$/.test(style)) blocks.push({ type: 'h2', text });
  else if (/^Heading3$/.test(style)) blocks.push({ type: 'h3', text });
  else if (/ListParagraph/.test(style)) blocks.push({ type: 'li', text });
  else blocks.push({ type: 'p', text });
}

// Coalesce consecutive li blocks into ul blocks.
const out = [];
for (const b of blocks) {
  if (b.type === 'li') {
    const last = out[out.length - 1];
    if (last?.type === 'ul') last.items.push(b.text);
    else out.push({ type: 'ul', items: [b.text] });
  } else out.push(b);
}

writeFileSync(resolve(root, 'src/data/homepage-article.json'), JSON.stringify(out, null, 2) + '\n');

// Plain-text reference used by scripts/qa.mjs to prove the rendered page is
// byte-identical to the supplied article.
const flat = out
  .flatMap((b) => {
    if (b.type === 'ul') return b.items;
    if (b.type === 'table') return [b.head.join(' | '), ...b.rows.map((r) => r.join(' | '))];
    return [b.text];
  })
  .join('\n');
writeFileSync(resolve(root, 'src/data/homepage-article.txt'), flat + '\n');

console.log(`extracted ${out.length} blocks → src/data/homepage-article.json`);
console.log(out.map((b) => b.type).join(' '));
