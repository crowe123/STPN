# DONE.md — build status

**Site:** 615 Septic Tank Pumping · Nashville, TN
**Spec:** R&R Master Site Prompt v1.3
**Built:** 2026-08-16 · **Pages:** 65 content + a designed 404 (plan: 60–70)
**Stack:** Astro 5.18 (static) · Tailwind 4 via `@tailwindcss/vite` · Preact 4 islands · sharp

---

## Phase completion

| Phase | Status | Output |
|---|---|---|
| 0 — Research & discovery | ✅ | `RESEARCH.md` — keyword map (31 primaries, no duplicates), competitor gap table, 34-question list, 15 city tiers with local angles, 15-service catalog, design benchmark |
| 0.45 — Keyword map | ✅ | In `RESEARCH.md`; enforced by QA gate 4 on every build |
| 1 — Architecture | ✅ | 65 URLs, homepage-as-hub linking, everything data-driven from `src/config.ts` + `src/data/*.json` |
| 2 — Design system & scaffold | ✅ | Deep pine / safety amber palette, Barlow Condensed + Source Sans 3 self-hosted, prose overrides, 20 components, real SVG logo + full favicon set |
| 3 — Page templates & copy | ✅ | Homepage = supplied article verbatim; 15 service, 15 city, 17 guide, 4 blog, 3 tool, plus about/contact/resources/review/legal/404 |
| 4 — Images | ⚠️ Partial | See "Images" below — the image-generation skill is not available in this environment |
| 5 — SEO / schema / AI layer | ✅ | Per-page `@graph`, 65 markdown mirrors, llms.txt, llms-full.txt, `_headers`, `.htaccess`, `_redirects`, robots.txt, 4 `.well-known` artifacts, WebMCP shim |
| 6 — QA gates | ✅ | 0 failures, 1 expected warning (form endpoint). Visual verification done in Chromium at 375/768/1280 |
| 7 — Build, deploy, handoff | ✅ | `dist/` built; both host configs shipped; `HANDOFF.md` written |

---

## QA gates — final run

```
1.  VERBATIM ARTICLE ......... ✓ all 53 article blocks render unmodified; H1 matches
2.  HEADING STRUCTURE ........ ✓ exactly one h1 on all 65 pages; no skipped levels
3.  TITLES / METAS / CANON ... ✓ all unique; all ≤165 chars; self-referencing absolute canonicals
4.  KEYWORD MAP .............. ✓ 31 primaries, zero duplicates, each in title/H1/first-100-words
5.  INDEXABILITY ............. ✓ zero HTML noindex; X-Robots-Tag scoped to .md in both host configs
6.  SITEMAP PARITY ........... ✓ 65 URLs, 1:1 with built pages
7.  NAP CONSISTENCY .......... ✓ byte-identical everywhere; zero hardcoded NAP outside config.ts
8.  PROOF HYGIENE ............ ✓ no reviews, ratings, counts, history or placeholder copy in dist/
9.  DEFECT BLACKLIST ......... ✓ 14 checks incl. JSON-LD validity, absolute OG images, icon paths
10. INTERNAL LINKING ......... ✓ zero broken links, zero orphans, guide↔service reachability
11. AI LAYER + JS BUDGET ..... ✓ 12 artifacts present; non-tool pages ship 1 deferred file + 1 inline module
12. HTTPS / MOBILE ........... ✓ zero mixed content; sticky call bar in HTML on every page
13. PAGE COUNT ............... ✓ 65 (plan 60–70)

QA GATES PASSED — 0 failures, 1 warning
```

Run it any time with `npm run qa`; it also runs automatically at the end of `npm run build`.

### The one warning

`FORM_ENDPOINT is still the placeholder`. Deliberate. Forms render with fields
disabled and an honest notice rather than posting a lead into a void. Set
`FORMS.endpoint` and `FORMS.enabled = true` in `src/config.ts` and rebuild.

---

## Visual verification (Chromium, not just a green build)

Checked at **375 / 768 / 1280** across home, service, city, guide, guide hub, blog,
tools, contact, service-areas, resources and 404:

- ✅ Zero horizontal overflow at any width
- ✅ Zero broken images; every graphic renders
- ✅ Guides and blog posts render as formatted HTML, not raw markdown
- ✅ Guide and blog indexes list every entry (17 and 4) — read from the collection, never a hardcoded array
- ✅ City pages render their unique hand-written content
- ✅ Mobile menu opens; services submenu expands
- ✅ Multi-step form starts on step 1 with step 2 hidden
- ✅ Cost estimator recomputes live — verified `$290–$590` → `$415–$1,010` on input change
- ✅ Urgency assessment scores and returns a classification — verified "Treat this as an emergency"
- ✅ Service cards are whole-card tap targets; navigation confirmed by click at 375 and 1280
- ✅ Tap targets ≥44px at 375px everywhere except inline prose links and the sr-only skip link

The only console errors are `ERR_TUNNEL_CONNECTION_FAILED` for the Plausible tag,
which is the sandbox proxy blocking the external host — not a site defect.

---

## Recorded deviations from the spec

**1. Homepage is the supplied article, verbatim.**
Instructed. The article renders exactly as extracted from the source .docx — no word,
heading level, list item or table cell changed, added, removed or reordered. It is
extracted mechanically by `scripts/extract-article.mjs` rather than re-typed, and QA
gate 1 diffs the rendered page against `src/data/homepage-article.txt` on every build.
Consequences:

- The spec's 11–12 section homepage recipe is replaced by the article's own structure.
  Site chrome (hero CTAs, ticker, hub link blocks, lead form, final CTA band) sits
  *around* the article and never inside it.
- The article's H1 does not contain "Nashville", so the homepage primary keyword is
  carried by the title, URL and first 40 words instead. Documented as a single
  explicit exception in QA gate 4 and in `RESEARCH.md`.
- The article's own 6-question FAQ is mirrored 1:1 into `FAQPage` schema.

**2. No photographic imagery.** The `gpt-image-2` skill is not available in this
environment. Rather than ship CSS gradients (forbidden) or stock photos (dishonest),
the build uses hand-authored SVG: a technical system cross-section, per-city
service-area maps, and a checklist mockup. Real assets, not placeholders — but the
photo batch list is in `HANDOFF.md` and should be run before launch.

**3. Static map instead of a Google Maps embed.** Per the v1.3 operator note: iframes
are the heaviest thing on a page and the location signal survives without them. The
`StaticMap` component generates an inline SVG coverage graphic wrapped in a link out
to Google Maps.

**4. No street address in NAP.** Not supplied. The site markes up as a service-area
business (locality + region + `areaServed` + `serviceArea` GeoCircle) rather than
inventing an address. One config edit adds it. See `HANDOFF.md`.

**5. `@astrojs/tailwind` not used.** It is a Tailwind-3-era integration. Tailwind 4
is wired through `@tailwindcss/vite`, which is the supported path and sidesteps the
major-version lock warned about in the build-gotchas appendix.

**6. Wikidata `sameAs` omitted.** IDs for the Nashville neighbourhood and satellite-city
entities could not be verified during the build, and a fabricated `sameAs` is worse
than an absent one. `wikidataId` is `null` throughout and the schema builder skips the
property. Worth adding post-launch once verified.

---

## Build-gotchas appendix — how each was handled

| Symptom | Handling in this build |
|---|---|
| Tailwind utilities not applying | Tailwind 4 via `@tailwindcss/vite`; `@astrojs/tailwind` deliberately not installed |
| Content collection not found | Config at `src/content.config.ts` (Astro 5 location) |
| Collection returns nothing | `loader: glob({ pattern, base })`; no `type: 'content'` anywhere |
| Post renders as raw markdown | Standalone `render()` from `astro:content`; never `entry.render()`, never `set:html` of a body |
| `entry.slug` undefined | `entry.id` used for all URL generation |
| Dynamic route collides with index | `getStaticPaths` filters empty ids |
| Blog/guide index empty | Both indexes call `getCollection()`; QA gate 11 + visual check confirm every entry lists |
| Broken images across posts | No frontmatter image paths; QA gate 9 asserts every `<img>` has alt/width/height and every referenced icon resolves on disk |
| Headings cramped in articles | `.prose-site` overrides applied and visually verified |
| Breadcrumb component crashes | Single `trail` prop shape used by every caller, matching the schema builder |
| Gradient blocks where photos should be | None — real SVG artwork instead |

---

## Post-launch, not yet done

These need the live domain and cannot be completed from the build environment:

- [ ] Set `FORMS.endpoint` + `FORMS.enabled`, rebuild, and dry-run a submission
- [ ] Set the real `SITE.domain` / `SITE.origin` if it differs from the assumed one
- [ ] Fill `CONTACT.address.street` and `.postalCode` when available
- [ ] Set the analytics provider ID and verify a real-time hit
- [ ] Enable SSL, force `http→https` and non-canonical host → canonical host
- [ ] Map any 301 redirects if this domain replaced an earlier site (`.htaccess` / `_redirects`)
- [ ] Submit to Google Search Console and Bing Webmaster Tools, plus IndexNow
- [ ] Force-index every money page (services, cities, cost guides) via GSC URL inspection
- [ ] **3–7 days after submission: run `site:615septictankpumping.com` and confirm the
      homepage, all 15 service pages, all 15 city pages and all 4 cost guides are
      present. Re-request indexing for anything missing. Record the result here.**
- [ ] Lighthouse on home + one service + one city page against the live host
- [ ] Run the image batch from `HANDOFF.md` and wire the photos in
- [ ] Verify and add Wikidata IDs to `cities.json`

### Post-launch indexation check — result

_Not yet run. Due 3–7 days after sitemap submission._

| Page type | Expected | Indexed | Action |
|---|---|---|---|
| Homepage | 1 | — | — |
| Service pages | 15 | — | — |
| City pages | 15 | — | — |
| Cost guides | 4 | — | — |
