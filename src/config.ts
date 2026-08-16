/**
 * SINGLE SOURCE OF TRUTH FOR BUSINESS IDENTITY (NAP) AND SITE-WIDE SETTINGS.
 *
 * This is the renter-handoff file. To hand this site to a tenant:
 *   1. edit the values below (phone, address, email, form endpoint, domain)
 *   2. npm run build
 *   3. redeploy dist/
 *
 * Nothing in src/components/, src/layouts/ or src/pages/ may hardcode a phone
 * number, address, email or form endpoint. `npm run qa` fails the build if it does.
 *
 * ── OPERATOR ACTION REQUIRED BEFORE LAUNCH ────────────────────────────────────
 *  • address.street / address.postalCode  — NOT SUPPLIED at build time. While
 *    they are empty the site renders and marks up as a service-area business
 *    (locality + region + service area, no street line). Fill them in and the
 *    full PostalAddress appears in the footer, contact page and JSON-LD with no
 *    other edits. A virtual office / mailbox / coworking address is fine.
 *  • forms.endpoint — currently the placeholder below; forms are rendered but
 *    intentionally disabled until a real POST URL is set (see forms.enabled).
 *  • domain — set to the real domain before generating canonicals/sitemap.
 *  • analytics — set provider + id; the tag ships live, not commented out.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const BRAND = {
  name: '615 Septic Tank Pumping',
  shortName: '615 Septic',
  legalName: '615 Septic Tank Pumping',
  tagline: 'Licensed septic tank pumping for Music City homes',
  /** Most specific schema.org LocalBusiness subtype for this niche. */
  schemaType: 'SepticSystemService' as const,
  /** Fallback for validators that do not know the niche subtype. */
  schemaTypeFallback: 'HomeAndConstructionBusiness' as const,
} as const;

export const CONTACT = {
  /** Display form — must appear byte-identical everywhere it is rendered. */
  phoneDisplay: '(615) 555-0199',
  /** E.164 — used for every tel: href and for schema telephone. */
  phoneE164: '+16155550199',
  email: 'service@615septictankpumping.com',
  /**
   * Street + ZIP are empty until the operator supplies them (see header note).
   * Locality/region/country are known and are always emitted.
   */
  address: {
    street: '',
    locality: 'Nashville',
    region: 'TN',
    regionName: 'Tennessee',
    postalCode: '',
    country: 'US',
  },
  /** Coverage wording used verbatim in copy. */
  serviceArea: 'Nashville and Davidson County',
  serviceAreaLong: 'Nashville, TN and the surrounding Middle Tennessee region',
  county: 'Davidson County',
  /** Geographic centre of the service radius (Nashville, TN). */
  geo: { lat: 36.1627, lng: -86.7816, radiusMeters: 40000 },
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
    { days: ['Saturday'], opens: '08:00', closes: '14:00' },
  ],
  /** Emergency intake is separate from office hours; stated only because it is true of the phone line. */
  emergencyLine: true,
  hoursHuman: 'Mon–Fri 7am–6pm, Sat 8am–2pm. Emergency backups answered outside those hours.',
} as const;

export const SITE = {
  domain: '615septictankpumping.com',
  origin: 'https://615septictankpumping.com',
  locale: 'en-US',
  currency: 'USD',
  /** Stamped into "Last updated" lines and sitemap lastmod. */
  lastReviewed: '2026-08-16',
  copyrightStart: 2026,
} as const;

export const FORMS = {
  /**
   * POST URL for every lead form on the site.
   * Placeholder — replace with the LocusPilot submit URL or Formspree endpoint.
   */
  endpoint: 'https://REPLACE-ME.example.com/f/615-septic',
  /**
   * While false, forms render with their fields disabled and a short notice
   * instead of silently posting nowhere. Flip to true once `endpoint` is real.
   */
  enabled: false,
  honeypotName: '_website_url',
} as const;

export const ANALYTICS = {
  /** 'ga4' | 'plausible' | 'none' */
  provider: 'plausible' as 'ga4' | 'plausible' | 'none',
  /** GA4 measurement ID, or the Plausible data-domain. Defaults to the site domain. */
  id: '615septictankpumping.com',
} as const;

/** Design tokens. Mirrored into src/styles/global.css :root — keep in sync. */
export const TOKENS = {
  primary: '#14432F',
  primaryDark: '#0D2C1F',
  primaryLight: '#256B4A',
  accent: '#E4700D',
  accentDark: '#B75505',
  ink: '#14201B',
  offwhite: '#F4F2ED',
  containerWidth: '1280px',
} as const;

/** Header navigation. Long-tail service pages and sub-city pages stay out by design. */
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services-menu/', children: 'services' as const },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Guides', href: '/guide/' },
  { label: 'Free Tools', href: '/tools/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;

/** Convenience helpers used across components. */
export const tel = `tel:${CONTACT.phoneE164}`;
export const abs = (path: string) => new URL(path, SITE.origin).href;

/**
 * Expands NAP tokens in content authored in the data JSONs.
 * Meta descriptions in services.json / cities.json write `{PHONE}` rather than
 * a literal number, so swapping the tenant's details stays a single edit here.
 */
export const napify = (s: string) =>
  s.replace(/\{PHONE\}/g, CONTACT.phoneDisplay).replace(/\{BRAND\}/g, BRAND.name);

/** True when a street address has been supplied; gates the full PostalAddress. */
export const hasStreetAddress = CONTACT.address.street.trim().length > 0;

/** One-line NAP address string. Identical wherever address text is printed. */
export const addressLine = hasStreetAddress
  ? `${CONTACT.address.street}, ${CONTACT.address.locality}, ${CONTACT.address.region} ${CONTACT.address.postalCode}`.trim()
  : `${CONTACT.address.locality}, ${CONTACT.address.region}`;
