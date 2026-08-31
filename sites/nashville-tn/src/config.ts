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
 * NAP values are supplied by the operator and used verbatim. They are not
 * validated, geocoded or second-guessed: a virtual office and a tracking number
 * are expected at build stage. The only rule is that they appear byte-identical
 * everywhere — header, footer, contact page, JSON-LD PostalAddress, llms.txt.
 */

export const BRAND = {
  name: '615 Septic Tank Pumping',
  shortName: '615 Septic',
  legalName: '615 Septic Tank Pumping',
  tagline: 'Septic tank pumping for Davidson County homes on septic',
  /** Most specific schema.org LocalBusiness subtype for this niche. */
  schemaType: 'SepticSystemService' as const,
  /** Fallback for validators that do not recognise the niche subtype. */
  schemaTypeFallback: 'HomeAndConstructionBusiness' as const,
} as const;

export const CONTACT = {
  /** Display form — must render byte-identical everywhere. */
  phoneDisplay: '(615) 234-9048',
  /** E.164 — every tel: href and schema telephone. */
  phoneE164: '+16152349048',
  email: 'support@615septictankpumping.com',
  address: {
    street: '1801 West End Avenue, Suite 1000',
    locality: 'Nashville',
    region: 'TN',
    regionName: 'Tennessee',
    postalCode: '37203',
    country: 'US',
  },
  /** Coverage wording used verbatim in copy. */
  serviceArea: 'Nashville and Davidson County',
  serviceAreaLong: 'Nashville and Davidson County, Tennessee',
  county: 'Davidson County',
  /** Centre of the service radius (Nashville, TN). */
  geo: { lat: 36.1627, lng: -86.7816, radiusMeters: 40000 },
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '07:00', closes: '18:00' },
    { days: ['Saturday'], opens: '08:00', closes: '14:00' },
  ],
  hoursHuman: 'Mon–Fri 7am–6pm, Sat 8am–2pm. Septic backups answered outside those hours.',
  /** Stated only because it is true of the phone line, not as a credential. */
  emergencyLine: true,
} as const;

export const SITE = {
  domain: '615septictankpumping.com',
  origin: 'https://615septictankpumping.com',
  titleSuffix: '615 Septic Tank Pumping',
  defaultOgImage: '/images/og-default.webp',
  locale: 'en_US',
  /** Drives sitemap lastmod and the "Last updated" stamp on service pages. */
  lastReviewed: '2026-08-31',
} as const;

export const FORMS = {
  endpoint: 'https://formspree.io/f/xljegqlz',
  /** Forms render live only when an endpoint is present. */
  enabled: true,
  honeypotField: '_website_url',
} as const;

export const ANALYTICS = {
  /** OPERATOR ACTION: set provider + id. The tag ships live, never commented out. */
  provider: null as 'ga4' | 'plausible' | null,
  id: '' as string,
} as const;

/** Design tokens — mirrored into CSS custom properties in styles/global.css. */
export const THEME = {
  primary: '#1E4634',
  primaryDark: '#143024',
  primaryLight: '#2C6349',
  accent: '#C2571A',
  accentDark: '#9E4413',
  surface: '#FAF7F1',
  ink: '#1A1D1B',
  containerWidth: '1280px',
} as const;

export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services-menu/', children: true },
  { label: 'Service Areas', href: '/service-areas/' },
  { label: 'Guides', href: '/guide/' },
  { label: 'Free Tools', href: '/tools/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const;
