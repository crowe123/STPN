import servicesRaw from '../data/services.json';
import citiesRaw from '../data/cities.json';
import proofRaw from '../data/proof.json';

export interface ProcessStep { step: string; detail: string }
export interface Faq { q: string; a: string }
export interface Editorial { h2: string; body: string[] }

export interface Service {
  slug: string;
  tier: 'core' | 'longtail';
  navOrder: number;
  name: string;
  shortName: string;
  primaryKeyword: string;
  h1: string;
  title: string;
  description: string;
  blurb: string;
  priceFrom: number | null;
  priceTo: number | null;
  priceBasis: string;
  cardImageAlt: string;
  heroImageAlt: string;
  intro: string;
  symptoms: string[];
  whatsIncluded: string[];
  process: ProcessStep[];
  editorial: Editorial[];
  faq: Faq[];
  relatedServices: string[];
  guideSlugs: string[];
}

export interface City {
  slug: string;
  name: string;
  tier: 1 | 2 | 3;
  county: string;
  state: string;
  stateName: string;
  lat: number;
  lng: number;
  wikidataId: string | null;
  zips: string[];
  primaryKeyword: string;
  h1: string;
  title: string;
  description: string;
  responseTime: string;
  neighborhoods: string[];
  landmarks: string[];
  routes: string[];
  transit: string;
  nearbyCities: string[];
  priorityServices: string[];
  localAngle: string[];
  cityFaq: Faq[];
}

export const services = servicesRaw as unknown as Service[];
export const cities = citiesRaw as unknown as City[];

export const coreServices = services.filter((s) => s.tier === 'core').sort((a, b) => a.navOrder - b.navOrder);
export const longTailServices = services.filter((s) => s.tier === 'longtail').sort((a, b) => a.navOrder - b.navOrder);

export const primaryCities = cities.filter((c) => c.tier === 1);
export const secondaryCities = cities.filter((c) => c.tier === 2);
export const subCities = cities.filter((c) => c.tier === 3);

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
export const cityBySlug = (slug: string) => cities.find((c) => c.slug === slug);

/**
 * The one question every service page answers identically, appended to each
 * page's own FAQ set. Kept here so the wording cannot drift between pages.
 */
export const GLOBAL_FAQ: Faq = {
  q: 'What area does 615 Septic Tank Pumping cover?',
  a: 'Nashville and Davidson County, including Bellevue, Antioch, Hermitage, Donelson, Madison, Green Hills, Goodlettsville, Old Hickory, Joelton and the surrounding Middle Tennessee area. Call to confirm coverage for a specific address.',
};

/**
 * Proof data. Every array is empty at build time by design — the components
 * that read these return null rather than rendering an empty section.
 * See src/data/proof.json for the activation rules.
 */
export interface Testimonial { text: string; name: string; city: string; date: string; source: string }
export interface Stat { value: string; label: string }
export interface Credential { name: string; issuer: string; id?: string }
export interface TeamMember { name: string; role: string; bio: string }

export const proof = proofRaw as unknown as {
  testimonials: Testimonial[];
  stats: Stat[];
  credentials: Credential[];
  team: TeamMember[];
  awards: string[];
  reviewPlatform: { name: string; url: string };
};

export const hasTestimonials = proof.testimonials.length > 0;
export const hasStats = proof.stats.length > 0;
export const hasCredentials = proof.credentials.length > 0;
export const hasTeam = proof.team.length > 0;

/** The niche's real vocabulary — feeds schema knowsAbout and is used in copy. */
export const KNOWS_ABOUT = [
  'Septic tank pumping',
  'Subsurface sewage disposal systems',
  'Domestic septage removal and disposal',
  'Septic tank inspection',
  'Inlet and outlet baffle assessment',
  'Effluent filter service',
  'Sludge and scum depth measurement',
  'Drain field (soil absorption field) assessment',
  'Distribution box inspection',
  'Grease interceptor cleaning',
  'Septic tank riser installation',
  'Tennessee Rule 0400-48-01 subsurface sewage disposal regulations',
  'Karst and limestone site conditions in Middle Tennessee',
  'Private well and septic separation distances',
];
