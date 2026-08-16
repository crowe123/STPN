# HANDOFF.md — 615 Septic Tank Pumping

Everything needed to take this site live, hand it to a tenant, or clone it to
another niche.

---

## 1. The five-minute version

```bash
npm install
npm run build          # generates icons → builds → generates AI layer → runs QA gates
# upload dist/ to the host
```

`npm run build` fails on any QA violation. If it prints `QA GATES PASSED`, the build
is shippable.

---

## 2. BEFORE LAUNCH — required edits

Every one of these is in **`src/config.ts`**. Nothing else needs touching.

| # | What | Where | Current value |
|---|---|---|---|
| 1 | **Form endpoint** | `FORMS.endpoint` + `FORMS.enabled` | `https://REPLACE-ME.example.com/f/615-septic`, `enabled: false` |
| 2 | **Street address** | `CONTACT.address.street`, `.postalCode` | empty — site runs as a service-area business |
| 3 | **Domain** | `SITE.domain`, `SITE.origin` | `615septictankpumping.com` (assumed) |
| 4 | **Analytics** | `ANALYTICS.provider`, `.id` | Plausible, data-domain = site domain |
| 5 | **Email** | `CONTACT.email` | `service@615septictankpumping.com` (derived) |

Then `npm run build` and redeploy. The QA gates will confirm nothing drifted.

### On the form endpoint

While `FORMS.enabled` is `false`, every form on the site renders with its fields
disabled and a short honest notice pointing at the phone number. This is deliberate:
a decorative form that posts nowhere loses real leads silently. Set a LocusPilot
submit URL or a Formspree endpoint, flip `enabled` to `true`, rebuild, then submit a
real test enquiry and confirm it arrives.

### On the address

No street address was supplied at build time, so nothing was invented. The site
currently marks up as a service-area business: `addressLocality` + `addressRegion`,
plus `areaServed` City nodes and a `serviceArea` GeoCircle. Fill in `street` and
`postalCode` and the full `PostalAddress` appears automatically in the footer, the
contact page and the JSON-LD — identically in all three, because they all read the
same values. A virtual office, mailbox or coworking address is expected and fine.

---

## 3. The NAP swap procedure (renter handoff)

1. Open `src/config.ts`.
2. Change `BRAND.name`, `CONTACT.phoneDisplay`, `CONTACT.phoneE164`,
   `CONTACT.email`, `CONTACT.address.*`, `CONTACT.hours*`, `FORMS.endpoint`,
   `SITE.domain` and `SITE.origin`.
3. `npm run build`.
4. Upload `dist/`.

### Every place the NAP surfaces (all read from that one file)

| Surface | Detail |
|---|---|
| Header | Display phone + "Call now" label |
| Sticky mobile call bar | `tel:` E.164 + display number |
| Footer | Full NAP block: name, address, phone, email, hours |
| Contact page | NAP definition list + service area in words |
| About page | Contact sidebar |
| Every service page | Hero call button + sidebar emergency box + CTA bands |
| Every city page | Hero call button + sidebar + CTA band |
| Every guide and blog post | Mid-article band, sidebar, bottom band |
| Tools | Calculator result panel, quiz result CTA |
| JSON-LD | `telephone`, `email`, `PostalAddress`, `areaServed`, `serviceArea`, per-city `#location` nodes |
| `/llms.txt` and `/llms-full.txt` | Fact bullets + machine-readable contact block |
| 65 markdown mirrors | Derived from the built HTML, so they follow automatically |

**QA gate 7 enforces this.** It fails the build if any component hardcodes a phone
number, if any `tel:` link is not the E.164 value, or if the display number is
missing from any page. You cannot accidentally half-swap the NAP.

Meta descriptions in `services.json` / `cities.json` use a `{PHONE}` token rather
than a literal number, expanded at render time — so the swap really is one file.

---

## 4. Where everything lives

```
src/
  config.ts              ← IDENTITY. The single renter-handoff file.
  content.config.ts      ← Astro 5 collection definitions (glob loader)
  data/
    services.json        ← 15 services: copy, process, FAQs, pricing basis, links
    cities.json          ← 15 areas: local angle, neighbourhoods, landmarks, FAQs
    calculator.json      ← estimator inputs, multipliers, formula text, sources
    quiz.json            ← 9 questions, weights, 4 result tiers
    proof.json           ← DORMANT PROOF SLOTS — all empty by design
    homepage-article.json ← the supplied article, mechanically extracted
    homepage-article.txt  ← plain-text reference the QA gate diffs against
  content/guides/        ← 17 markdown guides
  content/blog/          ← 4 markdown posts
  lib/data.ts            ← typed accessors over the JSON
  lib/schema.ts          ← every JSON-LD node builder
  components/            ← 20 components incl. 4 dormant proof components
  components/islands/    ← the 2 Preact islands
  pages/                 ← routes
scripts/
  gen-icons.mjs          ← favicon set + OG card from the SVG mark
  gen-ai-layer.mjs       ← .md mirrors, llms.txt, robots, _headers, .htaccess, .well-known
  qa.mjs                 ← 13 QA gate groups; fails the build
  extract-article.mjs    ← one-off: source .docx → homepage-article.json/.txt
```

---

## 5. Dormant proof slots — activating them

`src/data/proof.json` has five empty arrays. Every component that reads them returns
`null` on empty — no empty section, no heading with nothing under it, no "coming
soon". The layout is designed to read as complete without them, with the pricing band
and comparison table holding the slot competitors give to a star row.

| Slot | Component | What switches on |
|---|---|---|
| `testimonials[]` | `Testimonials.astro` | A full review section on the homepage **and** `aggregateRating` in the organization schema (at 3+ entries) |
| `stats[]` | `StatBand.astro` | A four-figure band under the homepage ticker |
| `credentials[]` | `CredentialList.astro` | A certification list in service-page and about-page sidebars **and** `hasCredential` in schema |
| `team[]` | `TeamGrid.astro` | A team section on the about page |
| `awards[]` | (reserved) | Not currently rendered |
| `reviewPlatform` | `leave-a-review` page | Turns the fallback form into a one-tap link to Google / Facebook / Trustpilot |

### Adding a real review

Paste into `testimonials[]`:

```json
{
  "text": "Exactly as written by the customer. Truncate if long; do not otherwise edit.",
  "name": "Sarah M.",
  "city": "Bellevue",
  "date": "2026-09-14",
  "source": "Google"
}
```

Set `reviewPlatform.name` and `.url` too, then `npm run build`.

**Rules that are not negotiable.** Only genuinely received, unincentivised reviews.
No edits beyond truncation. Nothing offered in exchange. The FTC Consumer Review Rule
carries penalties up to **$53,088 per violation** for fabricated or AI-generated
reviews, and QA gate 8 fails the build if review text, star ratings, review counts,
years-in-business or job counts appear anywhere in `dist/` without real backing.

---

## 6. Review-collection kit (ships with the build)

**`/leave-a-review/`** — short, mobile-first, one tap through to the review
destination once `reviewPlatform.url` is set, with a fallback form that captures
written feedback plus explicit permission to publish.

### SMS template — send when the job is complete and the customer is happy

> Thanks for having us out today — the tank's clear and your next service is due
> {DATE}. If the job was done right, a quick review helps the next person in
> {AREA} choose: {REVIEW_LINK}
> — {NAME}, 615 Septic Tank Pumping

### Email template — send 2–4 hours after the visit

> **Subject:** Your septic service report — and a quick favour
>
> Hi {FIRST_NAME},
>
> Your service report is attached: sludge depth was {X} inches, the baffles were
> {CONDITION}, and your next pump-out is due {DATE}.
>
> If the visit was worth it, would you leave a short review? It takes about a minute
> and it is the main way people in {AREA} find a septic contractor they can trust.
>
> {REVIEW_LINK}
>
> If anything wasn't right, reply to this email or call {PHONE} and we'll put it
> right first.
>
> — {NAME}, 615 Septic Tank Pumping · {PHONE}

### Printable QR leave-behind

A 100 × 150 mm card for the truck. Layout: the logo mark at the top, "How did we
do?" in Barlow Condensed, a QR code encoding `REVIEW_LINK` at roughly 50 mm square,
the URL in plain text under it (people photograph the card), and the phone number at
the foot. Generate the QR from the final review URL; nothing in the build hardcodes
it.

### Instruction sheet — turning a received review into a live one

1. Open `src/data/proof.json`.
2. Add an object to `testimonials[]` with the text, first name + last initial, area,
   date and source platform.
3. `npm run build`.
4. Upload `dist/`.

That single edit switches the testimonial section on for the first time and, at three
or more entries, adds `aggregateRating` to the schema. Nothing else is required.

---

## 7. Deployment

Both host configs ship every build; the inactive one is inert.

### Cloudflare Pages

Upload `dist/` (drag-and-drop or Wrangler) and add the custom domain. `_headers` and
`_redirects` work natively. Confirm the CDN cache is active for the zone.

### Hostinger / any Apache or LiteSpeed host

Upload the **contents** of `dist/` into `public_html`. `_headers` is silently ignored
there — `.htaccess` reproduces the same rules: the `Link:` discovery headers,
`text/markdown` + `X-Robots-Tag: noindex` for `*.md`, JSON content types and CORS for
`.well-known`, `ErrorDocument 404 /404.html`, HTTPS and canonical-host redirects,
long-lived cache headers on hashed assets, and gzip/brotli.

Make sure hidden files are uploaded — `.htaccess` starts with a dot and some FTP
clients skip it by default.

### Both hosts

- Enable SSL and force `http → https` **and** non-canonical host → canonical host
  before submitting anything to Search Console.
- Long-lived `Cache-Control` on `/_astro/*`, images and fonts; short TTL on HTML.
- If this domain previously hosted a site, map every old URL with traffic or links to
  its closest new equivalent **before** launch. Templates are at the foot of
  `.htaccess` and in `_redirects`.

---

## 8. Search Console, Bing and indexing

1. Verify the property in Google Search Console and Bing Webmaster Tools.
2. Submit `https://{domain}/sitemap-index.xml` to both.
3. Submit the URL list to IndexNow — ChatGPT's local results correlate ~87% with Bing,
   so Bing indexation matters more than it looks.
4. **Force-index the money pages.** Do not wait for organic crawl discovery; new
   sites' long-tail pages otherwise sit "discovered, not indexed" for weeks. Request
   indexing via GSC URL inspection for: the homepage, all 15 service pages, all 15
   city pages, and the four cost guides.
5. **3–7 days later**, run `site:{domain}` and confirm each of those is actually
   present. Submitting a sitemap is not the same as being indexed. Re-request
   anything missing and record the result in `DONE.md`.
6. Monthly: review GSC indexation state. "Crawled, not indexed" means a page is not
   good enough or the site lacks authority for it — improve or prune it rather than
   adding more.

---

## 9. Image batch — the one outstanding build task

No photographic imagery ships with this build (the image-generation skill was not
available in the build environment). What ships instead is real SVG artwork, not
placeholders: a technical system cross-section, per-city coverage maps, a checklist
mockup, the logo lockup and the full favicon set.

To add photography, generate the batch below, convert to WebP (**hero ≤150 KB, cards
≤80 KB**), generate a mobile-width variant for `srcset`, drop into `public/images/`,
and add an `<img>` with explicit `width`/`height` where the `SystemDiagram` currently
sits on the hero (keep the diagram lower on the page — it earns its place).

**Style is locked:** documentary photorealism, real-jobsite feel, natural light, worn
equipment, believable Middle Tennessee housing stock. **No readable text in images**,
faces angled away or cropped, no glossy stock sheen, no illustration.

| Filename | Prompt | Ratio |
|---|---|---|
| `vacuum-truck-hose-set-into-exposed-concrete-septic-tank-lid-nashville.webp` | Documentary photo, mid-morning natural light: a septic vacuum hose run across a lawn into an exposed concrete tank access port in the back yard of a modest 1960s brick ranch house, Middle Tennessee. Worn equipment, damp soil at the port, no readable text. | 16:9 2K |
| `technician-measuring-sludge-depth-through-open-septic-access-port.webp` | Documentary photo: gloved hands lowering a measuring stick into an open septic tank access port, tank contents visible and dark, technician cropped at the shoulders, natural overcast light. | 16:9 2K |
| `corroded-concrete-outlet-baffle-stub-inside-emptied-septic-tank.webp` | Close documentary photo inside an emptied concrete septic tank showing a corroded stub where the cast outlet baffle has dissolved away, damp concrete walls, work light from above. | 4:3 |
| `green-polyethylene-septic-riser-lid-flush-in-lawn-davidson-county.webp` | Documentary photo: a green polyethylene septic riser lid set slightly proud in a mown lawn, bolt heads visible, late-afternoon light, suburban Middle Tennessee back yard. | 4:3 |
| `sewage-surfacing-over-saturated-drain-field-wet-grass.webp` | Documentary photo: a dark, saturated patch of lawn over a drain field after heavy rain, standing water and matted grass, grey overcast light, no people. | 16:9 2K |
| `pump-truck-on-long-gravel-drive-wooded-ridge-lot-joelton.webp` | Documentary photo: a septic pump truck part-way up a long gravel drive on a wooded ridge lot, bare winter hardwoods, thin soil and limestone outcrop at the verge. | 16:9 2K |
| `restaurant-grease-interceptor-lid-lifted-hardened-fat-cap.webp` | Documentary photo: an in-ground grease interceptor with the lid lifted in a restaurant service yard at dawn, hardened pale fat cap visible, no readable signage. | 4:3 |
| `distribution-box-lid-lifted-showing-lateral-outlets.webp` | Documentary photo: a concrete distribution box with the lid lifted, showing lateral outlet pipes and effluent level, soil and roots at the edge of the excavation. | 4:3 |

Plus a card image per service (4:3), a hero per city page (16:9), and a "real jobs"
set of four per core service once actual jobs exist and can be photographed. **Never
present a generated image as a photograph of a real customer's property.**

Alt text is per-image and descriptive of what is actually depicted plus the city —
never "Service example 1". `services.json` already carries `heroImageAlt` and
`cardImageAlt` fields for each service, written and ready.

---

## 10. Cloning to another niche

1. Copy the repo.
2. Rewrite `src/config.ts` (identity, tokens, nav).
3. Rewrite `src/data/services.json` and `cities.json` for the new niche and metro.
4. Rewrite `src/data/calculator.json` and `quiz.json` — both are fully config-driven,
   including the currency and units block for international clones.
5. Replace `src/content/guides/` and `src/content/blog/`.
6. Swap the palette in `src/styles/global.css` `@theme` and the `TOKENS` mirror in
   config; every clone gets its own identity.
7. Redraw `public/favicon.svg` and `src/components/Logo.astro`, then `npm run icons`.
8. Delete `src/pages/index.astro`'s verbatim-article handling if the new site's
   homepage is built from sections rather than a supplied article, and remove QA
   gate 1 with it.
9. `npm run build` — the QA gates will tell you what you missed.
