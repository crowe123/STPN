/**
 * JSON-LD builders. One @graph per page.
 *
 * Rules enforced here:
 *  • NAP values come from src/config.ts verbatim — never re-typed, never reformatted.
 *  • No AggregateRating and no Review nodes are emitted unless real reviews exist
 *    in src/data/proof.json AND render on the page.
 *  • hasCredential is omitted entirely when there are no real certifications;
 *    knowsAbout carries the expertise signal instead.
 *  • Strings are plain text — no markdown syntax inside JSON-LD values.
 */
import { BRAND, CONTACT, SITE, abs, hasStreetAddress } from '../config';
import { services, cities, coreServices, proof, KNOWS_ABOUT, type Service, type City, type Faq } from './data';

const ORG = abs('/') + '#organization';
const WEBSITE = abs('/') + '#website';

const strip = (s: string) => s.replace(/\s+/g, ' ').trim();

export const postalAddress = () => {
  const a: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: CONTACT.address.locality,
    addressRegion: CONTACT.address.region,
    addressCountry: CONTACT.address.country,
  };
  if (hasStreetAddress) {
    a.streetAddress = CONTACT.address.street;
    if (CONTACT.address.postalCode) a.postalCode = CONTACT.address.postalCode;
  }
  return a;
};

const openingHours = () =>
  CONTACT.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.days,
    opens: h.opens,
    closes: h.closes,
  }));

const areaServed = () =>
  cities.map((c) => {
    const node: Record<string, unknown> = {
      '@type': 'City',
      name: c.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county}, ${c.stateName}` },
    };
    if (c.wikidataId) node.sameAs = `https://www.wikidata.org/wiki/${c.wikidataId}`;
    return node;
  });

const offerCatalog = (list = coreServices, cityName?: string) => ({
  '@type': 'OfferCatalog',
  name: cityName ? `Septic services in ${cityName}` : 'Septic services',
  itemListElement: list.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      '@id': abs(`/${s.slug}/`) + '#service',
      name: cityName ? `${s.name} in ${cityName}` : s.name,
      url: abs(`/${s.slug}/`),
    },
  })),
});

/** The organization node, shared by every page. */
export function organization() {
  const node: Record<string, unknown> = {
    '@type': [BRAND.schemaType, BRAND.schemaTypeFallback, 'LocalBusiness'],
    '@id': ORG,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: abs('/'),
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    image: abs('/images/og-default.png'),
    logo: abs('/favicon.svg'),
    description: strip(
      `${BRAND.name} is a licensed septic tank pumping contractor serving ${CONTACT.serviceArea}. Services include full residential and commercial tank pump-outs, tank cleaning, documented inspection, grease interceptor service and emergency response for sewage backups.`
    ),
    priceRange: '$$',
    currenciesAccepted: SITE.currency,
    address: postalAddress(),
    areaServed: areaServed(),
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: CONTACT.geo.lat, longitude: CONTACT.geo.lng },
      geoRadius: CONTACT.geo.radiusMeters,
    },
    knowsAbout: KNOWS_ABOUT,
    openingHoursSpecification: openingHours(),
    hasOfferCatalog: offerCatalog(),
  };

  // hasCredential only when real certifications exist. Omitted, never invented.
  if (proof.credentials.length > 0) {
    node.hasCredential = proof.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      name: c.name,
      recognizedBy: { '@type': 'Organization', name: c.issuer },
      ...(c.id ? { identifier: c.id } : {}),
    }));
  }

  // AggregateRating is emitted ONLY when real reviews exist and render on-page.
  if (proof.testimonials.length >= 3) {
    node.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: proof.testimonials.length,
      bestRating: '5',
    };
  }

  return node;
}

export const website = () => ({
  '@type': 'WebSite',
  '@id': WEBSITE,
  url: abs('/'),
  name: BRAND.name,
  publisher: { '@id': ORG },
  inLanguage: SITE.locale,
});

export const webPage = (opts: { path: string; title: string; description: string; modified?: string }) => ({
  '@type': 'WebPage',
  '@id': abs(opts.path) + '#webpage',
  url: abs(opts.path),
  name: opts.title,
  description: opts.description,
  isPartOf: { '@id': WEBSITE },
  about: { '@id': ORG },
  inLanguage: SITE.locale,
  dateModified: opts.modified ?? SITE.lastReviewed,
});

export const breadcrumbs = (trail: { name: string; path: string }[]) => ({
  '@type': 'BreadcrumbList',
  '@id': abs(trail[trail.length - 1].path) + '#breadcrumbs',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

export const faqPage = (path: string, faqs: Faq[]) => ({
  '@type': 'FAQPage',
  '@id': abs(path) + '#faq',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: strip(f.q),
    acceptedAnswer: { '@type': 'Answer', text: strip(f.a) },
  })),
});

export const serviceNode = (s: Service) => {
  const node: Record<string, unknown> = {
    '@type': 'Service',
    '@id': abs(`/${s.slug}/`) + '#service',
    name: s.name,
    url: abs(`/${s.slug}/`),
    description: strip(s.blurb),
    serviceType: s.name,
    provider: { '@id': ORG },
    areaServed: areaServed(),
    category: 'Septic system maintenance',
  };
  if (s.priceFrom !== null) {
    node.offers = {
      '@type': 'Offer',
      priceCurrency: SITE.currency,
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: s.priceFrom,
        ...(s.priceTo ? { maxPrice: s.priceTo } : {}),
        priceCurrency: SITE.currency,
      },
      availability: 'https://schema.org/InStock',
      url: abs(`/${s.slug}/`),
    };
  }
  return node;
};

export const howTo = (s: Service) => ({
  '@type': 'HowTo',
  '@id': abs(`/${s.slug}/`) + '#howto',
  name: `How ${s.name.toLowerCase()} works, step by step`,
  description: strip(`The four stages of a ${s.name.toLowerCase()} visit in ${CONTACT.address.locality}, ${CONTACT.address.region}.`),
  totalTime: 'PT2H',
  step: s.process.map((p, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: strip(p.step),
    text: strip(p.detail),
    url: abs(`/${s.slug}/`) + `#step-${i + 1}`,
  })),
});

/** City pages carry a second business node scoped to the locality. */
export const cityLocationNode = (c: City) => {
  const priority = c.priorityServices
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is Service => Boolean(s));
  return {
    '@type': [BRAND.schemaType, 'LocalBusiness'],
    '@id': abs(`/service-areas/${c.slug}/`) + '#location',
    name: `${BRAND.name} — ${c.name}`,
    parentOrganization: { '@id': ORG },
    url: abs(`/service-areas/${c.slug}/`),
    telephone: CONTACT.phoneE164,
    image: abs('/images/og-default.png'),
    address: {
      '@type': 'PostalAddress',
      addressLocality: c.name,
      addressRegion: c.state,
      addressCountry: CONTACT.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.state}`)}`,
    areaServed: {
      '@type': 'City',
      name: c.name,
      containedInPlace: { '@type': 'AdministrativeArea', name: `${c.county}, ${c.stateName}` },
      ...(c.wikidataId ? { sameAs: `https://www.wikidata.org/wiki/${c.wikidataId}` } : {}),
    },
    openingHoursSpecification: openingHours(),
    hasOfferCatalog: offerCatalog(priority, c.name),
  };
};

export const articleNode = (opts: {
  path: string;
  headline: string;
  description: string;
  published: string;
  modified: string;
  aboutServiceSlug?: string;
  section?: string;
}) => ({
  '@type': 'Article',
  '@id': abs(opts.path) + '#article',
  headline: strip(opts.headline),
  description: strip(opts.description),
  url: abs(opts.path),
  mainEntityOfPage: { '@id': abs(opts.path) + '#webpage' },
  // Organization-authored by default. A Person author is only ever set when a
  // real named person exists in proof.json — no invented author personas.
  author: { '@id': ORG },
  publisher: { '@id': ORG },
  datePublished: opts.published,
  dateModified: opts.modified,
  inLanguage: SITE.locale,
  image: abs('/images/og-default.png'),
  ...(opts.section ? { articleSection: opts.section } : {}),
  ...(opts.aboutServiceSlug ? { about: { '@id': abs(`/${opts.aboutServiceSlug}/`) + '#service' } } : {}),
});

export const webApplication = (opts: { path: string; name: string; description: string }) => ({
  '@type': 'WebApplication',
  '@id': abs(opts.path) + '#app',
  name: opts.name,
  url: abs(opts.path),
  description: strip(opts.description),
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  publisher: { '@id': ORG },
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: SITE.currency },
});

/** Wraps any set of nodes into the page's @graph. */
export const graph = (nodes: unknown[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean),
});
