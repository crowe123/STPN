# How to publish a received review

One edit switches the testimonial section on for the first time.

## Steps

1. Open `src/data/proof.json`
2. Add an object to the `testimonials` array:

```json
{
  "text": "The review, exactly as they wrote it.",
  "name": "Sarah M.",
  "city": "Joelton",
  "date": "2026-09-14",
  "source": "Google"
}
```

3. Run `npm run build`
4. Redeploy `dist/`

The `Testimonials` component reads that array and returns `null` while it is
empty. Adding the first entry makes the section appear.

## Non-negotiable rules

- **Only genuinely received reviews.** Never invent, never adapt, never write "representative" examples.
- **Unincentivised.** Nothing may be offered in exchange.
- **Unedited**, beyond truncating for length. Do not fix grammar, do not improve wording.
- **Attributed** to the platform it came from.
- **First name and last initial only**, plus their area.

Fabricated or AI-generated reviews carry FTC penalties up to $53,088 per
violation. QA gate 8 fails the build if rating or testimonial content appears
without backing data in `proof.json`.

## Turning on schema ratings

`aggregateRating` stays `null` until **at least three real reviews** render
visibly on the page. Only then set it, and only to the true average of the
reviews actually shown.
