# 615 Septic Tank Pumping — Nashville, TN

Static local lead-generation site. Astro 5 + Tailwind 4, built to the
R&R Master Site Prompt v1.3 spec.

```bash
npm install
npm run dev      # local dev server
npm run build    # icons → derived images → astro build → AI layer → QA gates
npm run qa       # re-run QA gates against an existing dist/
npm run images   # regenerate photography via kie.ai (needs KIE_AI_API_KEY)
```

`npm run build` fails on any QA gate violation, so a broken build cannot ship.

## Read these first

| File | What it covers |
|---|---|
| **[HANDOFF.md](HANDOFF.md)** | Pre-launch edits, the NAP swap, deployment, the review kit, dormant proof slots |
| **[DONE.md](DONE.md)** | Phase completion, QA results, recorded deviations, post-launch checklist |
| **[RESEARCH.md](RESEARCH.md)** | Keyword map, audited competitor teardown, the 38-question list, area evidence, price-band sources |

## Before it goes live

Everything that needs changing lives in **`src/config.ts`**:

1. `ANALYTICS.provider` / `.id` — currently `null`; the tag ships live once set
2. `SITE.domain` / `.origin` — confirm before generating canonicals
3. `/leave-a-review/` — replace the inert review-destination link with the real Google review URL

The NAP, form endpoint and domain supplied at build time are already in place.

## Two things this site deliberately does not do

**No fabricated social proof.** No reviews, ratings, testimonials, certifications,
job counts or years-in-business claims anywhere, because none exist yet. The
testimonial, stat, credential and team components are wired to
`src/data/proof.json` and return `null` on empty arrays. QA gate 8 fails the
build if any of it appears without backing.

**No iframes.** No Google Maps embed, no YouTube, no social widgets. Service-area
maps are inline SVG linking out to Google Maps.

## What carries the trust load instead

Published price ranges on every service page, a cost estimator that answers
without an email address, a comparison table of DIY vs cheap vs proper work, the
Davidson County regulatory material no competitor covers, and 29 guides with
sourced figures.

## Homepage

The homepage body is wired to `src/data/homepage.json`, which currently holds
factual content drawn from RESEARCH.md pending the operator's own copy. Swapping
it in is a single-file edit; `src/pages/index.astro` needs no changes.
