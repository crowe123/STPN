import { BRAND, CONTACT, SITE } from '../config';
import { abs } from './site';
import services from '../data/services.json';
import cities from '../data/cities.json';

const ORG_ID = `${SITE.origin}/#organization`;
const SITE_ID = `${SITE.origin}/#website`;

/**
 * Shared organization node. Emits the supplied NAP verbatim.
 * Deliberately absent: aggregateRating, review, hasCredential, foundingDate,
 * numberOfEmployees. None of them are true yet, and inventing them is both a
 * ranking risk and an FTC one. knowsAbout carries the expertise signal instead —
 * it is true on day one regardless of company age.
 */
export function organizationNode() {
  return {
    '@type': [BRAND.schemaType, BRAND.schemaTypeFallback],
    '@id': ORG_ID,
    name: BRAND.name,
    legalName: BRAND.legalName,
    url: SITE.origin + '/',
    telephone: CONTACT.phoneE164,
    email: CONTACT.email,
    description: `${BRAND.name} is a septic tank pumping company serving ${CONTACT.serviceArea}, Tennessee.`,
    priceRange: '$$',
    image: abs(SITE.defaultOgImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: CONTACT.geo.lat, longitude: CONTACT.geo.lng },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: CONTACT.geo.lat, longitude: CONTACT.geo.lng },
      geoRadius: CONTACT.geo.radiusMeters,
    },
    areaServed: cities.cities.map((c) => ({
      '@type': 'City',
      name: c.name,
      ...(c.wikidataId ? { sameAs: `https://www.wikidata.org/wiki/${c.wikidataId}` } : {}),
      containedInPlace: { '@type': 'AdministrativeArea', name: c.county },
    })),
    knowsAbout: [
      'subsurface sewage disposal system', 'soil morphology assessment', 'percolation rate',
      'septic effluent filter', 'inlet baffle', 'outlet baffle', 'scum and sludge layers',
      'drain field lateral', 'distribution box', 'advanced treatment system',
      'subsurface drip disposal', 'low-pressure pipe system', 'karst solution feature',
      'setback distance', 'fats, oils and grease (FOG)', 'grease interceptor',
      'certified hauler manifest', 'septage', 'aerobic treatment unit', 'mound system',
    ],
    openingHoursSpecification: CONTACT.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days, opens: h.opens, closes: h.closes,
    })),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${BRAND.name} services`,
      itemListElement: services.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', '@id': abs(`/${s.slug}/`) + '#service', name: s.name },
        url: abs(`/${s.slug}/`),
      })),
    },
  };
}

export function websiteNode() {
  return {
    '@type': 'WebSite', '@id': SITE_ID, url: SITE.origin + '/',
    name: BRAND.name, publisher: { '@id': ORG_ID }, inLanguage: 'en-US',
  };
}

export function webPageNode(path: string, title: string, description: string, modified?: string) {
  return {
    '@type': 'WebPage', '@id': abs(path) + '#webpage', url: abs(path),
    name: title, description, isPartOf: { '@id': SITE_ID },
    about: { '@id': ORG_ID }, inLanguage: 'en-US',
    ...(modified ? { dateModified: modified } : {}),
  };
}

export function breadcrumbNode(path: string, trail: { name: string; href: string }[]) {
  return {
    '@type': 'BreadcrumbList', '@id': abs(path) + '#breadcrumb',
    itemListElement: trail.map((t, i) => ({
      '@type': 'ListItem', position: i + 1, name: t.name, item: abs(t.href),
    })),
  };
}

/** FAQPage built from the visible Q&A on the page — never from unrendered data. */
export function faqNode(path: string, faq: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage', '@id': abs(path) + '#faq',
    mainEntity: faq.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function serviceNode(s: any) {
  return {
    '@type': 'Service', '@id': abs(`/${s.slug}/`) + '#service',
    name: s.name, description: s.blurb, serviceType: s.name,
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'AdministrativeArea', name: CONTACT.county },
    url: abs(`/${s.slug}/`),
  };
}

export function howToNode(s: any) {
  return {
    '@type': 'HowTo', '@id': abs(`/${s.slug}/`) + '#howto',
    name: `How ${BRAND.name} handles ${s.name.toLowerCase()}`,
    step: s.process.map((p: any, i: number) => ({
      '@type': 'HowToStep', position: i + 1, name: p.title, text: p.body,
    })),
  };
}

/** City pages get a second business node scoped to that location. */
export function locationNode(c: any) {
  return {
    '@type': [BRAND.schemaType, BRAND.schemaTypeFallback],
    '@id': abs(`/service-areas/${c.slug}/`) + '#location',
    name: `${BRAND.name} — ${c.name}`,
    parentOrganization: { '@id': ORG_ID },
    telephone: CONTACT.phoneE164,
    url: abs(`/service-areas/${c.slug}/`),
    image: abs(SITE.defaultOgImage),
    address: {
      '@type': 'PostalAddress',
      streetAddress: CONTACT.address.street,
      addressLocality: CONTACT.address.locality,
      addressRegion: CONTACT.address.region,
      postalCode: CONTACT.address.postalCode,
      addressCountry: CONTACT.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: c.lat, longitude: c.lng },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.name}, ${c.state}`)}`,
    areaServed: {
      '@type': 'City', name: c.name,
      ...(c.wikidataId ? { sameAs: `https://www.wikidata.org/wiki/${c.wikidataId}` } : {}),
      containedInPlace: { '@type': 'AdministrativeArea', name: c.county },
    },
  };
}

export function articleNode(path: string, opts: {
  headline: string; description: string; published: string; modified: string; aboutServiceSlug?: string;
}) {
  return {
    '@type': 'Article', '@id': abs(path) + '#article',
    headline: opts.headline, description: opts.description,
    datePublished: opts.published, dateModified: opts.modified,
    author: { '@id': ORG_ID }, publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': abs(path) + '#webpage' },
    ...(opts.aboutServiceSlug ? { about: { '@id': abs(`/${opts.aboutServiceSlug}/`) + '#service' } } : {}),
  };
}

export function webApplicationNode(path: string, name: string, description: string) {
  return {
    '@type': 'WebApplication', '@id': abs(path) + '#app',
    name, description, url: abs(path),
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORG_ID },
  };
}

export function graph(nodes: object[]) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) };
}
