# 615 Septic Tank Pumping — Nashville, TN

Static local lead-generation site. Astro 5 + Tailwind 4, built to the
R&R Master Site Prompt v1.3 spec.

**65 content pages** — homepage, 15 service pages, 15 service-area pages, 17 guides,
4 blog posts, 2 interactive tools, plus about, contact, resources, review, legal and
a designed 404.

```bash
npm install
npm run dev      # local dev server
npm run build    # icons → build → AI layer → QA gates (fails on any violation)
npm run qa       # re-run the QA gates against an existing dist/
```

## Read these first

| File | What it covers |
|---|---|
| **[HANDOFF.md](HANDOFF.md)** | Required pre-launch edits, the NAP swap procedure, deployment for both hosts, the review kit, the outstanding image batch |
| **[DONE.md](DONE.md)** | Phase completion, the full QA gate results, visual verification, recorded deviations, post-launch checklist |
| **[RESEARCH.md](RESEARCH.md)** | Keyword map, competitor gap table, the 34-question list, city tiers with local ground truth, price-band sources |

## Before it goes live

Everything that needs changing lives in **`src/config.ts`**:

1. `FORMS.endpoint` + `FORMS.enabled` — forms render disabled until a real POST URL is set
2. `CONTACT.address.street` / `.postalCode` — currently empty; the site runs as a service-area business
3. `SITE.domain` / `SITE.origin` — assumed, confirm before generating canonicals
4. `ANALYTICS.provider` / `.id` — the tag ships live, not commented out

Then `npm run build`. QA gate 7 fails the build if any component hardcodes a phone
number or address, so the swap cannot be half-done.

## Two things this site deliberately does not do

**No fabricated social proof.** There are no reviews, ratings, testimonials,
certifications, job counts or years-in-business claims anywhere, because none exist
yet. The testimonial, stat, credential and team components ship wired to
`src/data/proof.json` and return `null` on empty arrays. Adding a real review to that
file and rebuilding switches the section — and its schema — on. QA gate 8 fails the
build if any of it appears without backing.

**No iframes.** No Google Maps embed, no YouTube, no social widgets. Service-area
maps are inline SVG linking out to Google Maps; the septic system cross-section is
hand-authored SVG that teaches the mechanism the copy refers to.

## Homepage

The homepage body is a supplied article rendered **verbatim**. It is extracted
mechanically from the source document by `scripts/extract-article.mjs` rather than
re-typed, and QA gate 1 diffs the rendered page against
`src/data/homepage-article.txt` on every build — the build fails if a single word
changes. Site chrome sits around it and never inside it.
