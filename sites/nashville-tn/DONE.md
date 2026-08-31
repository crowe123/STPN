# DONE.md — build record

Site: **615 Septic Tank Pumping**, Nashville TN
Spec: R&R Master Site Prompt **v1.3**
Location: `sites/nashville-tn/` · Branch: `claude/website-build-requirements-xwe56j`

---

## Phase completion

| Phase | Status | Notes |
|---|---|---|
| 0.1 Keyword & demand map | ✅ | Intent-segmented. No volume data — no DataForSEO credentials on this environment. |
| 0.2 Competitor teardown | ✅ | **Audited.** Pages fetched and parsed, sitemaps counted. |
| 0.3 Information-gap mining | ✅ | 38 questions, 35 on-site / 3 held off-site. Reddit mined; yielded one high-value angle. |
| 0.4 Local ground truth | ✅ | Metro Public Health sources fetched directly. |
| 0.45 Keyword map | ✅ | Uniqueness verified by script, enforced at build by QA gate 11. |
| 0.5 Reference-site study | ❌ | **Not performed — see deviations.** |
| 1 Architecture | ✅ | 17 services, 7 areas, 29 guides, 4 posts, 2 tools. |
| 2 Design system & scaffold | ✅ | Astro 5 + Tailwind 4 via `@tailwindcss/vite`. |
| 3 Templates & copy | ✅ | Homepage body pending operator supply. |
| 4 Images | ✅ | Model substitution — see deviations. |
| 5 SEO + schema + AI layer | ✅ | Per-page `@graph`, 71 `.md` mirrors, llms.txt, both host configs. |
| 6 QA gates | ✅ | 12 gates, build-failing. |
| 7 Build, deploy, handoff | ✅ | Docs complete; deployment requires operator credentials. |

---

## Recorded deviations

**1. Reference-site design study not performed (Phase 0.5).**
`nashvilleseptic.com` sits behind a Cloudflare bot challenge returning 403 to
every non-browser client. Every route was attempted: the origin directly and via
`http://`, `www.`, `/wp-json/`, `/sitemap_index.xml` and `/feed/`; the Wayback
Machine snapshot; and headless Chromium routed through the egress proxy with the
proxy CA pinned by SPKI. The archive and browser routes both failed at the proxy
relay with a repeatable transport error below the policy layer. The Cloudflare
challenge is the site's own access control and was not attacked.

Phase 2 therefore ran on the design system specified in the build prompt itself —
the mandatory long-form prose overrides, the `professional, warm` mood, the
niche-appropriate palette rule and the "must NOT look like" list — rather than on
a measured benchmark. Mitigating: the two competitors that *were* audited are not
design references worth matching (one ships no `h1` and 569 words, the other five
`h1`s and a stale sitemap), so the bar this market sets is low.

**2. Image model substituted (Phase 4).**
The spec mandates GPT Image 2. The supplied kie.ai key does not have
`gpt-image-2` enabled — the API returns "model name not supported" for that and
every OpenAI image variant tried. Generation used `google/nano-banana`, the
strongest model available on the key. Style direction was unchanged: documentary
photorealism, natural light, worn equipment, regional housing stock, no readable
text, faces angled away.

**3. Logo and favicons hand-authored rather than generated.**
The spec suggests generating logo lockups then recreating them as clean SVG. The
shipped asset is SVG either way, so the mark was authored directly as SVG — a
septic tank cross-section showing the three separated layers the service manages.
Favicons derive from it via sharp. This is cheaper, sharper at 32px, and avoids a
trace step. All five PNG sizes plus `favicon.svg` and the manifest are generated
at build time and verified by QA gate 5.

**4. Seven service areas, not nine.**
Areas are tiered on evidence. Goodlettsville was verified and kept. **Antioch was
dropped** — the only evidence found was a generic statement that unsewered
properties use septic, which is not evidence of density. **Belle Meade was
excluded on positive evidence**: it fits the large-lot profile exactly but
installed gravity and pressure sewers in 1983 and maintains 900+ households on
the pressure system. Building either page would have been a doorway page.

**5. Sub-city tier not built.**
Davidson-only scope leaves few genuinely distinct sub-places beyond the Tier-2
list. The spec prefers fewer, deeper pages.

**6. Per-service "Real jobs" galleries not built.**
Service pages carry a hero image each. The 4-image gallery and before/after pairs
per service are not included in this build. No fabricated before/after imagery
was substituted.

**7. Homepage body awaiting operator copy.**
Wired to `src/data/homepage.json`. Current contents are factual and sourced from
RESEARCH.md — no placeholder text, no invented claims — so the build ships
clean. Swapping in the supplied copy is a single-file edit.

**8. Astro pinned to 5.x, not the current 7.x.**
Deliberate. The gotchas appendix is explicit that content-collection APIs break
between majors, and this configuration is verified working. Recorded as a planned
migration rather than a drive-by upgrade.

---

## QA gates

`npm run build` runs all 12 gates and **exits non-zero on any violation**, so a
violating build cannot ship.

| Gate | Checks |
|---|---|
| 1 | Defect blacklist: naive pluralisation, double-city H1s, raw markdown in JSON-LD, placeholder text in visible copy, host artifacts |
| 2 | Exactly one `<h1>` per page; no skipped heading levels; no heading tags in `<header>` or `<footer>` |
| 3 | Titles and meta descriptions present and unique across every page |
| 4 | Every `<img>` has alt, width and height; no lazy alt text; every referenced image resolves on disk |
| 5 | Every manifest icon, favicon, apple-touch icon and logo path resolves in the build output |
| 6 | No HTML page carries noindex; `X-Robots-Tag: noindex` scoped to `.md` only in both `_headers` and `.htaccess`; absolute trailing-slash canonicals; absolute OG/Twitter image URLs; robots.txt disallows nothing and its Sitemap: filename exists |
| 7 | No hardcoded phone, address or email anywhere in components, layouts or pages; NAP present and byte-identical; every `tel:` uses E.164 |
| 8 | Proof hygiene: no Review/AggregateRating schema, star ratings, years-in-business, customer counts or sample testimonials without backing data in `proof.json` |
| 9 | Every internal link resolves; no orphan pages |
| 10 | JS budget on non-tool pages; sitemap URL count equals built indexable page count |
| 11 | Keyword map reconciliation — no primary keyword claimed by two pages |
| 12 | Viewport meta, lang attribute, skip link |

---

## Post-launch checklist

- [ ] Analytics provider + ID set in `src/config.ts`, verified firing with a real-time hit
- [ ] Form dry-run submitted and received at the Formspree endpoint
- [ ] Google review destination replacing the inert link on `/leave-a-review/`
- [ ] SSL active, HTTPS forced, no mixed content
- [ ] Submitted to Google Search Console
- [ ] Submitted to Bing Webmaster Tools + IndexNow
- [ ] Money pages force-indexed via GSC URL inspection
- [ ] **3–7 days after submission:** `site:615septictankpumping.com` run, indexation of homepage, all service pages, all area pages and all cost guides confirmed. Result recorded here.
- [ ] Lighthouse run on home + one service + one area page
- [ ] Monthly GSC indexation review scheduled
