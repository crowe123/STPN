import { SITE, CONTACT, BRAND } from '../config';

/** Absolute URL with a trailing slash, for canonicals, schema @id and OG tags. */
export function abs(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const p = path.startsWith('/') ? path : `/${path}`;
  const withSlash = p.endsWith('/') || /\.[a-z0-9]{2,5}$/i.test(p) ? p : `${p}/`;
  return `${SITE.origin}${withSlash}`;
}

/** Title builder. Home passes its own; everything else gets the brand suffix. */
export function pageTitle(title: string, { bare = false } = {}): string {
  return bare ? title : `${title} | ${SITE.titleSuffix}`;
}

export const tel = `tel:${CONTACT.phoneE164}`;

/** Single-line NAP string — must render byte-identical everywhere it appears. */
export const napLine = [
  CONTACT.address.street,
  CONTACT.address.locality,
  `${CONTACT.address.region} ${CONTACT.address.postalCode}`,
].join(', ');

export const brandTriple = (predicate: string) => `${BRAND.name} ${predicate}`;

export function fmtDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
}

export function money(n: number): string {
  return `$${n.toLocaleString('en-US')}`;
}

/** Guards against the naive-pluralisation defects on the QA blacklist. */
export function possessive(name: string): string {
  return name.endsWith('s') ? `${name}'` : `${name}'s`;
}
