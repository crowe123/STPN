# HANDOFF — 615 Septic Tank Pumping (Nashville, TN)

Everything a tenant or operator needs to take this site live and run it.

---

## 1. Required before launch

| # | What | Where | Status |
|---|---|---|---|
| 1 | Analytics provider + measurement ID | `src/config.ts` → `ANALYTICS` | **Not set.** Currently `null`. The tag ships live, not commented out, as soon as you set it. |
| 2 | Google review destination | `src/pages/leave-a-review.astro` | **Placeholder link is inert by design** rather than pointing somewhere wrong. Replace with the Business Profile review URL once live. |
| 3 | Confirm domain | `src/config.ts` → `SITE.domain` / `.origin` | Set to `615septictankpumping.com`. Confirm before first deploy — it generates every canonical, OG URL and schema `@id`. |
| 4 | Homepage body copy | `src/data/homepage.json` | Awaiting operator copy. Current content is factual and shippable. |
| 5 | Rotate the kie.ai key | `.env` (gitignored) | The key used to generate imagery was shared in a chat transcript. Rotate it. |

Already supplied and in place: brand name, phone, address, email, form endpoint.

---

## 2. The NAP swap procedure

All business identity lives in **`src/config.ts`**. Nothing in `src/components/`,
`src/layouts/` or `src/pages/` hardcodes a phone number, address or email —
**QA gate 7 fails the build if anything does**, so the swap cannot be done
halfway.

To hand this site to a different tenant:

1. Edit `BRAND` and `CONTACT` in `src/config.ts`
2. Edit `FORMS.endpoint`
3. Edit `SITE.domain` and `SITE.origin`
4. `npm run build`
5. Redeploy `dist/`

**Every place the NAP surfaces**, all fed from that one file — verify these after a swap:

- Header phone link and the "Get a Price" button
- Sticky mobile call bar
- Footer NAP block, email and hours
- Contact page: the large phone CTA, the address block, hours, service-area wording
- Every service page sidebar emergency box
- Every service-area page sidebar
- Every guide sidebar
- JSON-LD `PostalAddress`, `telephone`, `email`, `areaServed`, `serviceArea` on every page
- City-page `#location` nodes with per-area `geo`
- `/llms.txt` fact bullets and `/llms-full.txt`
- `/.well-known/agent-card.json`
- Every `.md` mirror (regenerated on build)
- Privacy and terms pages

Run `npm run qa` after any swap. Gate 7 checks display phone, E.164 `tel:` links
and the street address are present and byte-identical.

---

## 3. Deployment

Both host configs ship on every build regardless of target. The inactive one is inert.

### Cloudflare Pages (the chosen host)

`_headers` works natively. Upload the **contents** of `dist/`.

**Via dashboard:** Workers & Pages → Create → Pages → Upload assets → drag the
contents of `dist/` → Deploy. Then add the custom domain under the project's
Custom domains tab.

**Via Wrangler:**
```bash
npx wrangler pages project create 615-septic-tank-pumping --production-branch main
npx wrangler pages deploy dist --project-name 615-septic-tank-pumping
```
Wrangler needs `CLOUDFLARE_API_TOKEN` (Pages:Edit) and `CLOUDFLARE_ACCOUNT_ID`.

After deploy: add the custom domain, confirm SSL is active, force HTTPS, and
confirm CDN caching is enabled for the zone.

### Hostinger or any Apache/LiteSpeed host

Upload the contents of `dist/` into `public_html`. `_headers` is silently ignored
there — `.htaccess` reproduces the same rules: discovery `Link:` headers,
`text/markdown` + `X-Robots-Tag: noindex` scoped to `.md` only, JSON content
types and CORS for `.well-known`, `ErrorDocument 404 /404.html`, long-lived
cache headers on hashed assets, gzip, and an http→https redirect.

### Both

- Long-lived `Cache-Control` on `/_astro/*`, `/images/*`, `/fonts/*`; short TTL on HTML
- Enable SSL and force HTTPS **before** submitting anything to Search Console
- Redirect non-canonical host → canonical host

---

## 4. Post-launch, in order

1. **Verify analytics fires** with a real-time hit. It is live in the build, not commented out.
2. **Test the form** — submit a real entry and confirm it arrives at the Formspree endpoint.
3. **Submit to Google Search Console** and **Bing Webmaster Tools**. ChatGPT local results correlate strongly with Bing, so Bing is not optional.
4. **Submit via IndexNow.**
5. **Force-index the money pages** — request indexing for the homepage, all 17 service pages, all 7 area pages and the cost guides via GSC URL inspection. New sites otherwise sit in "discovered, not indexed" for weeks.
6. **3–7 days later, verify indexation.** Run `site:615septictankpumping.com` and confirm the homepage, every service page, every area page and every cost guide are actually present. Submitting a sitemap is not the same as being indexed. Re-request anything missing, and record the result in DONE.md.
7. **Monthly**, monitor GSC indexation state. Pages stuck at "crawled, not indexed" are not good enough or lack authority — improve or prune them rather than adding more.

If this domain previously hosted a site, map every old URL with traffic or links
to its closest new equivalent and add redirects before launch. None are shipped,
because nothing indicates a prior site.

---

## 5. The review-collection kit

The fastest route to a populated testimonial section is real reviews arriving quickly.

**`/leave-a-review/`** — mobile-first, one tap to the review destination, with a
fallback form that captures written feedback plus explicit permission to publish.

**Request templates** — `src/data/review-requests/`.

**To publish a received review:** add it to `src/data/proof.json` under
`testimonials` with `text`, `name` (first name + last initial), `city`, `date`
and `source` (the platform it came from), then rebuild. That single edit switches
the testimonial section on, with its schema, for the first time.

**Rules that are not negotiable.** Reviews must be genuinely received,
unincentivised, and unedited beyond truncation for length. Only real reviews may
be published or marked up in schema. Fabricated or AI-generated reviews carry FTC
penalties up to $53,088 per violation. QA gate 8 fails the build if rating or
testimonial content appears without backing data.

---

## 6. Dormant proof slots

All of these are built, wired and render **nothing** until real data exists.

| Component | Data source | Activates when |
|---|---|---|
| `Testimonials.astro` | `proof.json` → `testimonials[]` | ≥1 real received review |
| `StatBand.astro` | `proof.json` → `stats[]` | Real, verifiable operating figures |
| `CredentialList.astro` | `proof.json` → `credentials[]` | A real certification or licence |
| `TeamGrid.astro` | `proof.json` → `team[]` | A real named person |
| `aggregateRating` in schema | `proof.json` → `aggregateRating` | ≥3 real reviews rendering visibly on the page |

Each returns `null` on an empty array — no empty section, no heading with nothing
under it, no "coming soon". The layout is designed to read as complete without them.

---

## 7. Content operations

- **Add a service:** append to `src/data/services.json`. The page, nav entry, schema, sitemap entry and `.md` mirror all follow automatically. Give it a unique `primaryKeyword` — QA gate 11 fails on a duplicate.
- **Add a service area:** append to `src/data/cities.json`. Requires `localAngle` (3–4 paragraphs of genuinely local prose) and 5 area-specific FAQs. **Do not add an area without something real to say about septic there** — that is a doorway page, and it is the rule that kept Antioch and Belle Meade off this site.
- **Add a guide:** a markdown file in `src/content/guides/`. Frontmatter is schema-validated. Keep to the commercial-adjacent buckets — cost, insurance/permits, urgency, decision guides. Pure-informational curiosity content stays off this site.
- **Regenerate imagery:** `npm run images` with `KIE_AI_API_KEY` set. Existing files are skipped, so delete one to regenerate it.

---

## 8. What is deliberately absent

No reviews, ratings, testimonials, certifications, awards, team bios, founding
year, job counts or years-in-business claims. No stock photos of people
presented as staff or customers. No iframes. No third-party JavaScript beyond
the analytics tag you configure. No AggregateRating or Review schema.

These are not omissions to be filled in with plausible-sounding content. They are
absent because they are not true yet, and the site is designed to convert without
them.
