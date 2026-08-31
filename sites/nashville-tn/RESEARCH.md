# RESEARCH.md — 615 Septic Tank Pumping (Nashville, TN)

Phase 0 research artifact for the R&R Master Site Prompt v1.3 build.
Everything below is the contract the rest of the build follows.

**Build inputs (as supplied, used verbatim per the NAP rule):**

| Field | Value |
|---|---|
| NICHE | Septic tank pumping |
| CITY_METRO | Nashville, TN |
| BRAND_NAME | 615 Septic Tank Pumping |
| DOMAIN | 615septictankpumping.com |
| PHONE | (615) 234-9048 · E.164 `+16152349048` |
| ADDRESS | 1801 West End Avenue, Suite 1000, Nashville, TN 37203 |
| EMAIL | support@615septictankpumping.com |
| FORM_ENDPOINT | `https://formspree.io/f/xljegqlz` |
| REFERENCE_SITE | nashvilleseptic.com |
| COMPETITORS | maxwellseptic.com · elitteseptictank.com · nashvilleseptic.com |
| DESIGN_MOOD | professional, warm |
| HOST | Cloudflare Pages |
| EMERGENCY_NICHE | Yes |
| PROOF_ASSETS | **NONE** — no reviews, ratings, certifications, staff or operating history exist at build time |

Two input corrections recorded: the supplied email contained a comma
(`615septictankpumping,com`) read as `.com`; the phone was supplied unformatted
and is rendered `(615) 234-9048` for display, `+16152349048` for every `tel:`
and for schema.

---

## Research status — egress opened mid-build

The environment originally denied all outbound page fetches. An allowlist was
opened during Phase 0, which unblocked the competitor teardown, the Davidson
County regulatory sources, Wikipedia entity extraction and the kie.ai image
pipeline (verified: 80 credits available).

| Workstream | Status |
|---|---|
| 0.1 Keyword & demand map | Complete. Volume data unavailable (no DataForSEO credentials); intent segmentation and demand proxies used per spec. |
| 0.2 Competitor teardown | **Complete and audited** — pages fetched, headings parsed, sitemaps counted. |
| 0.3 Information-gap mining | Complete. Reddit remains outside the allowlist; questions drawn from PAA/cost-guide surface and the Davidson regulatory material. |
| 0.4 Local ground truth | **Complete** — Metro Public Health sources fetched directly. |
| 0.45 Keyword map | Complete, uniqueness verified by script. |
| 0.5 Reference-site design study | **STILL BLOCKED** — see that section. |
| Phase 4 images | **Unblocked** — api.kie.ai reachable and authenticated. |

Still outside the allowlist: `web.archive.org`, `www.reddit.com`.
`nashvilleseptic.com` is allowlisted but sits behind a Cloudflare bot challenge
that returns 403 to non-browser clients; defeating that challenge is the site's
own access-control decision and was not attempted.

---

## 0.4 — LOCAL GROUND TRUTH (the moat)

Three facts do the heavy lifting on this site. All three are true, sourced, and
absent from every competitor's search surface.

### 1. Middle Tennessee is karst country

Nashville sits in the Central Basin, where limestone dissolves into sinkholes,
caves and fractured bedrock. Soils are frequently shallow over rock, with a clay
loam above. Three consequences bear directly on septic:

- **Sinkholes can swallow a drainfield.** County environmental health offices in
  Davidson, Williamson, Rutherford and Maury watch karst features closely and
  enforce generous setbacks from any visible solution feature.
- **Fractured limestone lets poorly treated effluent reach groundwater** without
  the filtration a proper soil column provides — which is why a failing tank in
  this region is a groundwater problem, not just a yard problem.
- **Slow-draining soils push drainfields to the large end of the sizing range.**
  Middle TN fields skew big, which makes a field replacement here more expensive
  than the national average — and makes routine pumping worth proportionally more.

### 2. The sewer buildout explains exactly who is still on septic

By the mid-1950s roughly **150,000 Davidson County residents lived in unsewered
subdivisions**. The countywide project to extend sewers through the suburbs began
soon after Metro consolidation and ran **into the early 1990s**.

This is the single most useful local fact on the site. It means septic in the 615
is not randomly distributed — it is the ring the sewer project never reached:
north Davidson (Joelton, Whites Creek, Scottsboro, Bells Bend), the southwestern
fringe (Pasquo), and everything past the county line. It also dates the housing
stock: systems installed 1970–1999 in those areas are now 25–55 years old, past
the point where baffles corrode and effluent filters were never fitted at all.

**Strategic consequence:** service-area pages must follow septic density, not the
metro map. Green Hills, Donelson, Madison and most of Antioch are sewered; a city
page for them would be a doorway page targeting demand that does not exist.

### 3. The regulatory layer is unusually citable here

| Fact | Source |
|---|---|
| Septic tank pumping contractors are governed by **Tenn. Comp. R. & Regs. 0400-48-01-.20** | TN Secretary of State / Cornell LII |
| Davidson County is a **TDEC contract county** — administers its own septic program on top of state rules | TDEC Subsurface Sewage Disposal Program |
| A buyer's agent must present the option of a sewer inspection under **TREC Rule 1260-2-.37**; TN does not universally require pre-sale pumping, but inspection in practice requires it | TREC / TN real-estate guidance |
| In Tennessee it is **illegal to advertise a home for more bedrooms than its septic is approved for** | TN real-estate guidance |
| Metro Water Services FOG program: **grease traps serviced ≥ every 30 days, interceptors ≥ every 90 days**, the **25% rule** (service when FOG + solids reach 25% of capacity), certified hauler manifests, **three-year record retention** | Metro Water Services, Nashville |
| TDEC permitting requires a site evaluation including **soil morphology assessment by a soil scientist** | TDEC SSDS |
| **Davidson County's reserve-area rule:** a septic system must be **completely contained within its own parcel** with specific setbacks, *and* the parcel must retain **sufficient area to replace the system** if it fails. Non-compliance "leads to significant problems for current or future owners" and "on very rare occasions, a residence may be condemned." | Metro Public Health Dept., Health Department Notice Regarding Properties With Septic Systems |
| Metro's **Environmental Engineering Services** (615-340-5604) will help a homeowner site a revised property boundary so the reserve area survives a lot split | Metro Public Health Dept. |
| Metro runs a **"How Many Bedrooms?" lookup** — approval date, inspection dates, and the bedroom count a residence is approved for | Metro Public Health Dept. |
| Metro's septic division does soils interpretation, SSDS design, **percolation-test monitoring**, and groundwater protection | Metro Public Health Dept. |
| **1946:** Davidson County raised minimum residential lot sizes to **half an acre** to give septic drain fields room; areas with poorer soils — **Oak Hill and Hillwood named specifically** — were required to have *larger* lots still | Nashville Scene, *How Sewage Shaped Spacious Lots* |
| Mid-century Davidson County had **34.5 sq mi of unsewered urban/suburban area** plus **90 sq mi of unsewered less-built-up area** | Nashville City & Davidson County Planning Commissions |

### Real price bands (sourced — these drive the calculator and every cost guide)

| Item | Range | Source basis |
|---|---|---|
| Septic pumping, Tennessee | **$275 – $525** | TN state cost guide |
| Septic cleaning, Davidson County (2025 actuals) | **$199 – $796** | Davidson County homeowner-reported |
| Septic pumping, national average | **$428** (typical $292–$564) | Angi 2026 |
| Difficult access surcharge (buried lid, landscaping, frozen ground) | **+$50 – $200** | national cost guides |
| Riser installation (lid brought to grade) | **$300 – $600** | national cost guides |
| Baffle replacement | **$150 – $600** | HomeGuide |
| Effluent filter replacement | **$230 – $280** | trade sources |
| Baffle/filter check during routine pumping | **$0 – $50** | most pumpers include it |
| Drainfield rejuvenation / minor repair | **$1,000 – $5,000** | national cost guides |
| Drainfield repair, Nashville | **$2,000 – $10,000+** | Nashville-specific |
| Drainfield replacement, Tennessee | **$7,000 – $15,000+** | TN-specific; varies with soil and design |
| Full system replacement | **$15,000 – $30,000** | TN regional |
| Recommended pumping interval | **3–5 years**; 2–3 with garbage disposal, more occupants or a small tank | TDOH / TDEC guidance |

**The money hook** (the niche's "you pay only your deductible" equivalent):

> A pumping runs a few hundred dollars. A drainfield that fails because nobody
> pumped runs five figures — and in Middle Tennessee's slow-draining karst soils
> the replacement field is bigger, so it costs more here than the national number.

That single comparison is fully sourced, answers the visitor's real question, and
occupies the slot where competitors put a star row.

### Service areas — Davidson County only

Scope decision: **Davidson County only.** Tiers follow septic density, evidenced
per area. Where evidence is absent, the page is not built — the doorway rule
applies at every tier.

The 1946 lot-size rule is the key to this map. Half-acre minimums, and larger
where soils were poor, produced exactly the large-lot Davidson neighbourhoods
that are still on septic today. Where the postwar sewer extension later reached,
septic disappeared; where it did not, those big lots still have tanks in them.

**Tier 1 — primary (strong evidence)**

| Area | Local angle | Evidence |
|---|---|---|
| Joelton | Rural NW Davidson community of farms and suburban lots, 37080. Housing predominantly built 1970–1999 — three/four-bedroom single-family plus mobile homes — so systems are 25–55 years old, past baffle-corrosion age and predating routine effluent filters. Never reached by the Metro sewer extension. | Neighborhood profile + sewer-extension history |
| Whites Creek | Unincorporated, ~10 miles NW of downtown, 37189. Same unsewered northern belt and same housing era as Joelton. | Neighborhood profile |
| Forest Hills | Incorporated city inside Davidson County that **retained its independent charter at the 1963 consolidation**; large lots, mature trees, no commercial development — the built form the 1946 septic lot-size rule produced. | Wikipedia + Nashville Scene |
| Oak Hill | Incorporated city, pop. **4,891** (2020), home of the Tennessee Governor's Mansion. **Named explicitly in the 1946 regulations as a poorer-soil area required to have larger-than-half-acre lots.** The single best-evidenced septic area in the county. | Wikipedia + Nashville Scene |
| Bellevue / Pasquo | Southwestern fringe along **State Route 100**; Pasquo is a neighbourhood of Nashville within Bellevue. Harpeth-side ridges and valleys, outside the dense sewer grid. | Wikipedia |

**Tier 2 — secondary (moderate evidence)**

| Area | Local angle | Evidence |
|---|---|---|
| Bells Bend & Scottsboro | Agricultural peninsula in the Cumberland's northwest bend; Bells Bend has roughly **238 residents**. Floodplain bottomland against limestone bluff — a distinctive and difficult septic setting. | Population + geography |
| Antioch / Cane Ridge | Southeastern growth fringe, developed outward past the sewer line before recent annexation of services. | Moderate — verify against Metro sewer service map before writing |
| Goodlettsville | Northern Davidson edge straddling the Sumner County line, outside the core grid. | Moderate — verify before writing |

**Excluded, with evidence — this is the doorway rule doing real work**

| Area | Why not |
|---|---|
| **Belle Meade** | **Sewered.** The city installed gravity sewers plus a pressure sewer system in **1983**, with capacity for all households; **900+ households on the city-maintained pressure system**. Despite being a large-lot, high-value area that looks like an obvious target, it has almost no septic demand. |
| Green Hills, Donelson, Madison, Hermitage, Berry Hill, inner Antioch, urban Nashville | Reached by the postwar sewer extension. A page here targets demand that does not exist. |

Verification method for the two Tier-2 "verify" rows: Metro's parcel-level
property information and the "How Many Bedrooms?" septic-approval lookup can
confirm septic presence per parcel before either page is written.

**Sub-city tier:** now feasible (Wikipedia is reachable), but held to zero this
build — Davidson-only leaves few genuinely distinct sub-places beyond the Tier-2
list, and the spec prefers fewer, deeper pages.

---

## 0.2 — COMPETITOR TEARDOWN (audited)

Pages fetched and parsed directly; sitemaps counted. Findings are measured, not
inferred, except where marked.

### maxwellseptic.com

| Dimension | Finding |
|---|---|
| Title | "Maxwell Septic Pumping in Nashville, TN & Surrounding Areas" |
| **H1** | **None. The page has no `<h1>` at all.** Headings begin at h2. |
| Heading use | `h2` used for the company name, the phone number and "Contact Us" — headings as styling, not structure. `h3` carries "Voted #1 Septic business in Nashville!" and "Join our thousands of happy customers!" |
| Body word count | **569 words** |
| Published pricing | **None** — zero currency figures on the page |
| Schema | **None** — no JSON-LD, no `@type` anywhere |
| Iframes | 1 (third-party embed) |
| Indexable pages | **9 URLs** in `page-sitemap.xml` — home, sample-page, thank-you, privacy-policy, grease-service, septic-inspections, repair-installation, riser-installations, contact. Plus one post: `hello-world` (unedited WordPress default). |
| Ownership | Links to FusionSite corporate legal pages; billing on `portal.fusionsiteservices.com`. A roll-up property, not an independent local operator. |

**The headline finding.** `maxwellseptic.com`'s sitemap index also submits a
`custom-pages-sitemap.xml` containing **~280 city and county pages on a different
domain** — `maxwellsepticpumping.com` — as flat `.html` files. A sitemap may only
list URLs on the host that serves it, so those pages are cross-submitted
invalidly. Their coverage sprawls across Tennessee, Kentucky and Alabama
(Owensboro KY, Muscle Shoals AL, Bowling Green KY), i.e. far outside any
plausible service radius, and the sitemap even lists a stylesheet
(`output.css`) as a page.

Sampling `Septic-Service-Nashville.html` confirms they are template doorway
pages, and the template is broken:

> **H1: "Septic Service *Rentals* in Nashville, Tennessee — Maxwell Septic"**

"Rentals" is leftover from an unrelated rental-equipment template — precisely the
naive-templating defect on this build's own QA blacklist. The page also repeats
`h3` for "Over 25 Years of Experience" / "Exemplary Quality Service" / "Rapid and
Reliable Delivery" — generic filler with no local substance.

### www.elitteseptictank.com

| Dimension | Finding |
|---|---|
| Title | "Elitte Septic Tank & Grease Trap Service \|615-504-7178" (no space after the pipe) |
| **H1** | **Five `<h1>` elements on one page** — "Elitte Septic Tank & Grease Trap Service has a solution…", "Septic Tanks", "Septic Tanks Inspections", "Grease Traps", "Residential/Commercial", "Industrial" |
| Heading order | Chaotic: h2 → h2 → h3 → h3 → h3 → **h1** → h3 → h2 → h2 → h3 → h2 → h3 → h2 → h3 → **h1 ×5** → h4. Levels skipped in both directions. |
| Heading use | `h2` for "Pay Here" and the phone number |
| Body word count | **683 words** |
| Published pricing | One figure — a `$35` "Good Neighbor Discount". No service pricing. |
| Schema | **None** |
| Meta description | Truncated mid-sentence ("residential, commercial,") |
| Real social proof | **Yes** — genuine linked Google reviews from named reviewers, and a named owner, Robert Foster, with 24+ years' experience. This is the one competitor with real, verifiable trust signals. |
| Sitemap | 34 entries, and **stale** — it lists an obsolete flat-HTML architecture (`index.html`, `indexNEW.html`, `residential.html`, `restaurant.html`) while the live site serves WordPress-style paths (`/services/`, `/septic-tank-inspections/`). Blog URLs are unrewritten query strings (`/blog/?p=39`), including RSS feeds and author/category archives submitted as content. |
| Forms | No on-page form; conversion routes out to a third-party portal (`app.paywholesail.com`) |

### nashvilleseptic.com (also the nominated reference site)

Behind a Cloudflare bot challenge; not audited. `robots.txt` is readable and
shows a Yoast-generated block with `Disallow:` empty (nothing blocked) and a
sitemap at `/sitemap_index.xml`, which itself returns 403 to non-browser clients.
WordPress + Yoast is therefore confirmed; nothing else is.

### Gap table — what none of them have

Confidence is now **measured** rather than inferred, except the two rows marked.

| Gap | Evidence | Confidence |
|---|---|---|
| **No schema markup on any competitor** | Zero `@type` occurrences in both audited homepages | Measured |
| **Broken heading structure on every audited competitor** | Maxwell: no h1 at all. Elitte: five h1s and skipped levels. | Measured |
| **Thin homepages** | 569 and 683 words | Measured |
| **No published pricing** | Maxwell $0 figures; Elitte one $35 discount | Measured |
| **Tiny indexable footprint** | Maxwell: 9 real pages, one of them an unedited `hello-world` post | Measured |
| **Doorway city pages, and broken ones** | ~280 cross-domain template pages with a "Septic Service Rentals" H1 | Measured |
| **Invalid cross-domain sitemap submission** | `maxwellseptic.com` submits `maxwellsepticpumping.com` URLs | Measured |
| **Stale sitemap advertising a dead architecture** | Elitte lists `indexNEW.html` etc. | Measured |
| **No cost calculator** | None found on any Middle TN septic operator | Search surface |
| **No karst / geology content** | The karst → drainfield link appears in geology and installer sources, never in a pumper's marketing | Search surface |
| **No Davidson County regulatory content** | Nobody writes about the reserve-area rule, the bedroom-approval lookup, or Environmental Engineering Services | Measured (absent from audited sites) |
| **No real-estate-transaction content** | TREC Rule 1260-2-.37 and the bedroom-advertising law unaddressed | Measured |
| **No grease-trap compliance content** | Metro Water's 30/90-day and 25% rules unaddressed, despite both competitors selling grease service | Measured |

**Where they are genuinely strong, and what it means.** Elitte has real Google
reviews and a real named owner with a real service history. This site has none of
that and will not fabricate any. That asymmetry is the whole reason the trust
load moves to published pricing, the reserve-area and bedroom-approval material,
the calculator, and the comparison table — content that is true on day one and
that neither competitor has bothered to write.

---

## 0.3 — INFORMATION-GAP MINING ⚠️ PARTIAL (Reddit blocked)

34 questions. Each tagged to a parent service, an intent bucket, and an ON-SITE /
OFF-SITE classification. Per the guide-scope rule, only commercial-adjacent
buckets (cost, insurance/permits/code, urgency, vs/decision) become on-site
guides; pure-informational curiosity is held back for off-site distribution so
the money site keeps its commercial classification.

| # | Question | Parent service | Bucket | On/Off |
|---|---|---|---|---|
| 1 | How much does septic tank pumping cost in Nashville? | Pumping | cost | ON |
| 2 | Why is septic tank pumping so expensive? | Pumping | cost | ON |
| 3 | Is septic tank pumping a scam / do I really need it? | Pumping | vs-decision | ON |
| 4 | How often should a septic tank be pumped in Tennessee? | Pumping | process | ON |
| 5 | What happens if you never pump your septic tank? | Pumping | danger-urgency | ON |
| 6 | Does a garbage disposal change how often I pump? | Pumping | process | ON |
| 7 | What are the signs a septic tank is full? | Pumping | danger-urgency | ON |
| 8 | Sewage is backing up into my house — what do I do right now? | Emergency | what-to-do-now | ON |
| 9 | Why is the grass over my drainfield greener than the rest? | Drainfield | danger-urgency | ON |
| 10 | My drains gurgle — is that the septic or the plumbing? | Pumping | vs-decision | ON |
| 11 | Standing water over the tank after rain — emergency or not? | Drainfield | danger-urgency | ON |
| 12 | What does a drainfield replacement cost in Middle Tennessee? | Drainfield | cost | ON |
| 13 | Can a failing drainfield be repaired instead of replaced? | Drainfield | vs-decision | ON |
| 14 | Does a sinkhole on my lot threaten my drainfield? | Karst service | danger-urgency | ON |
| 15 | Why do drainfields in Middle TN have to be bigger? | Drainfield | process | ON |
| 16 | What is the difference between pumping and cleaning? | Cleaning | vs-decision | ON |
| 17 | Do I need a septic inspection to sell my house in Tennessee? | Real-estate inspection | insurance-permits | ON |
| 18 | Who pays for the septic inspection, buyer or seller? | Real-estate inspection | cost | ON |
| 19 | Can I advertise more bedrooms than my septic is approved for? | Real-estate inspection | insurance-permits | ON |
| 20 | What does a pre-sale septic inspection cost? | Real-estate inspection | cost | ON |
| 21 | Do I need a permit to repair my septic system in Davidson County? | Inspection | insurance-permits | ON |
| 22 | Does my lot have room to replace the septic if it fails? | Inspection | insurance-permits | ON |
| 23 | Who regulates septic pumpers in Tennessee? | Pumping | insurance-permits | ON |
| 24 | Does homeowners insurance cover a septic failure? | Drainfield | insurance-permits | ON |
| 25 | How often must a restaurant grease trap be cleaned in Nashville? | Grease trap | insurance-permits | ON |
| 26 | What is the 25% rule for grease traps? | Grease trap | insurance-permits | ON |
| 27 | How long must grease-trap service records be kept? | Grease trap | insurance-permits | ON |
| 28 | Nobody can find my septic tank lid — what now? | Locating | what-to-do-now | ON |
| 29 | Is a septic riser worth the money? | Riser install | vs-decision | ON |
| 30 | What is an effluent filter and does my tank have one? | Effluent filter | process | ON |
| 31 | How do I know if my baffle has failed? | Baffle repair | danger-urgency | ON |
| 35 | How many bedrooms is my Davidson County septic approved for? | Inspection | insurance-permits | ON |
| 36 | Can I split my lot if it has a septic system? | Inspection | insurance-permits | ON |
| 32 | Do septic additives / treatments actually work? | Pumping | vs-decision | OFF |
| 33 | How does a septic system actually work? | — | informational | OFF |
| 34 | Is it safe to plant a garden over a drainfield? | — | informational | OFF |

33 on-site, 3 held off-site — 36 total.

---

## 0.45 — KEYWORD MAP (the anti-cannibalization contract)

One row per planned URL. **Every primary keyword appears exactly once.** Every
primary must land in that page's title, H1, URL slug and first 100 words.

### Homepage

| URL | Type | PRIMARY keyword | Supporting terms | Intent |
|---|---|---|---|---|
| `/` | Home | septic tank pumping nashville tn | septic pumping 615, septic service nashville | Transactional / head |

> **Homepage body copy is supplied by the operator** and is not written in this
> build. Chrome, schema, and the surrounding sections are built; the body is
> inserted at Gate 3 on request.

### Core service pages (flat at root, no `/services/` prefix)

| URL | PRIMARY keyword | Intent |
|---|---|---|
| `/residential-septic-tank-pumping/` | residential septic tank pumping nashville | Transactional |
| `/septic-tank-cleaning/` | septic tank cleaning nashville | Transactional |
| `/emergency-septic-service/` | emergency septic service nashville | Emergency BOFU |
| `/septic-tank-inspection/` | septic tank inspection nashville | Transactional |
| `/real-estate-septic-inspection/` | septic inspection for home sale tennessee | Transactional, distinct buyer |
| `/drain-field-repair/` | drain field repair nashville | Transactional |
| `/commercial-septic-pumping/` | commercial septic pumping nashville | Transactional B2B |
| `/grease-trap-cleaning/` | grease trap cleaning nashville | Transactional B2B |
| `/septic-tank-locating/` | septic tank locating nashville | Transactional |

### Long-tail service pages (~600–800 words, not in nav)

| URL | PRIMARY keyword | Intent |
|---|---|---|
| `/septic-tank-riser-installation/` | septic tank riser installation | Transactional long-tail |
| `/septic-effluent-filter-cleaning/` | septic effluent filter cleaning | Transactional long-tail |
| `/septic-baffle-repair/` | septic baffle repair | Transactional long-tail |
| `/septic-service-for-sinkhole-and-karst-lots/` | septic system sinkhole lot tennessee | Situational long-tail |
| `/mobile-home-septic-tank-pumping/` | mobile home septic tank pumping | Housing-stock long-tail |
| `/rental-property-septic-pumping/` | rental property septic pumping | Buyer-type long-tail |
| `/septic-pumping-for-homes-on-well-water/` | septic pumping well water home | Situational long-tail |

### Service-area pages

| URL | PRIMARY keyword |
|---|---|
| `/service-areas/` | septic service areas davidson county |
| `/service-areas/joelton/` | septic tank pumping joelton tn |
| `/service-areas/whites-creek/` | septic tank pumping whites creek tn |
| `/service-areas/forest-hills/` | septic tank pumping forest hills tn |
| `/service-areas/oak-hill/` | septic tank pumping oak hill tn |
| `/service-areas/bellevue/` | septic tank pumping bellevue nashville |
| `/service-areas/bells-bend/` | septic tank pumping bells bend nashville |
| `/service-areas/antioch/` | septic tank pumping antioch tn |
| `/service-areas/goodlettsville/` | septic tank pumping goodlettsville tn |

### Guides (BoFu-adjacent only)

| URL | PRIMARY keyword |
|---|---|
| `/guide/` | septic guides middle tennessee |
| `/guide/septic-tank-pumping-cost-nashville/` | septic tank pumping cost nashville |
| `/guide/why-is-septic-pumping-so-expensive/` | why is septic tank pumping so expensive |
| `/guide/do-i-really-need-my-septic-pumped/` | do i really need my septic tank pumped |
| `/guide/how-often-pump-septic-tank-tennessee/` | how often to pump septic tank tennessee |
| `/guide/what-happens-if-you-never-pump/` | what happens if you never pump your septic tank |
| `/guide/signs-septic-tank-is-full/` | signs septic tank is full |
| `/guide/sewage-backing-up-what-to-do/` | sewage backing up in house what to do |
| `/guide/standing-water-over-septic-tank/` | standing water over septic tank |
| `/guide/drain-field-replacement-cost-tennessee/` | drain field replacement cost tennessee |
| `/guide/repair-or-replace-drain-field/` | repair or replace drain field |
| `/guide/why-middle-tennessee-drain-fields-are-bigger/` | middle tennessee drain field size karst |
| `/guide/sinkhole-near-drain-field/` | sinkhole near drain field tennessee |
| `/guide/pumping-vs-cleaning-difference/` | septic pumping vs cleaning difference |
| `/guide/septic-inspection-selling-home-tennessee/` | septic inspection selling home tennessee |
| `/guide/who-pays-septic-inspection-home-sale/` | who pays for septic inspection |
| `/guide/septic-bedroom-count-advertising-tennessee/` | septic approved bedrooms tennessee |
| `/guide/septic-permit-davidson-county/` | septic permit davidson county |
| `/guide/davidson-county-septic-reserve-area/` | septic reserve area davidson county |
| `/guide/how-many-bedrooms-is-my-septic-approved-for/` | how many bedrooms is my septic approved for |
| `/guide/splitting-a-lot-with-a-septic-system/` | subdividing property with septic tennessee |
| `/guide/who-regulates-septic-pumpers-tennessee/` | tennessee septic pumping contractor regulations |
| `/guide/does-insurance-cover-septic-failure/` | does homeowners insurance cover septic failure |
| `/guide/grease-trap-cleaning-frequency-nashville/` | grease trap cleaning frequency nashville |
| `/guide/grease-trap-25-percent-rule/` | grease trap 25 percent rule |
| `/guide/cant-find-septic-tank-lid/` | how to find septic tank lid |
| `/guide/are-septic-risers-worth-it/` | are septic tank risers worth it |
| `/guide/what-is-an-effluent-filter/` | what is a septic effluent filter |
| `/guide/failed-septic-baffle-signs/` | signs of a failed septic baffle |

### Tools, resources, blog, company, legal

| URL | PRIMARY keyword |
|---|---|
| `/tools/` | septic tools and calculators |
| `/tools/septic-pumping-cost-estimator/` | septic pumping cost estimator |
| `/tools/septic-system-assessment/` | septic system urgency assessment |
| `/resources/` | septic maintenance checklist download |
| `/leave-a-review/` | leave a review 615 septic tank pumping |
| `/blog/` | septic blog middle tennessee |
| `/blog/spring-thaw-septic-checklist/` | spring septic maintenance middle tennessee |
| `/blog/what-a-septic-pumping-job-looks-like/` | what happens during septic pumping |
| `/blog/williamson-county-rule-change-explained/` | williamson county septic rule change |
| `/blog/fall-septic-preparation-tennessee/` | fall septic preparation tennessee |
| `/about/` | about 615 septic tank pumping |
| `/contact/` | contact septic company nashville |
| `/privacy/` · `/terms/` | (legal, noindex-free, priority 0.1) |

**Page count: 73 URLs** (1 home + 16 service + 9 area incl. hub + 28 guide +
hub + 3 tools + resources + review + 5 blog + 2 company + 2 legal + 404), inside
the ~60–70 band once the 404 and hub pages are discounted. Davidson-only scope
trades city-page count for guide depth — which is the correct trade, since the
audited competitors have 9 and ~34 indexable pages respectively.

### Cannibalization resolutions (combine-vs-split test applied)

| Contested pair | Resolution |
|---|---|
| Homepage vs `/residential-septic-tank-pumping/` | Home owns the head term `septic tank pumping nashville tn`; the service page owns the qualified `residential septic tank pumping nashville`. **Split** — the modifier signals a different searcher than the bare head term. |
| `/septic-tank-cleaning/` vs `/residential-septic-tank-pumping/` | **Split.** Searchers do not know these mean nearly the same thing, and the difference (full solids removal vs liquid draw-down) is real and explainable. Guide 14 carries the comparison. |
| `/septic-tank-inspection/` vs `/real-estate-septic-inspection/` | **Split.** Different buyer entirely — homeowner maintenance vs a transaction on a closing clock, with different code content (TREC rule, bedroom-count law). |
| `/drain-field-repair/` vs guide `drain field replacement cost tennessee` | **Split.** Service page owns the repair transaction; the guide owns the replacement cost query and links up. |
| `/commercial-septic-pumping/` vs `/grease-trap-cleaning/` | **Split.** Overlapping audience, distinct compliance obligation and distinct search language. |
| `/emergency-septic-service/` vs guide `sewage backing up what to do` | **Split.** Guide captures the panic query and converts to the emergency page. |

---

## 0.1 — KEYWORD & DEMAND MAP

Autocomplete harvesting and DataForSEO volumes were both unavailable
(egress-blocked; no API credentials). Segmentation is by intent, which per the
spec beats volume: #1 for a 50/mo emergency term beats #20 for the head term.

**Emergency / BOFU — the money terms**
septic tank pumping nashville tn · emergency septic service nashville · septic
backup nashville · 24 hour septic pumping · same day septic pumping ·
septic tank pumping near me · septic emergency {city}

**Planned / BOFU**
septic tank pumping cost nashville · septic tank cleaning nashville · septic
inspection nashville · drain field repair nashville · grease trap cleaning
nashville · commercial septic pumping · septic tank locating · septic riser
installation · septic pumping {each tier-1/2 city}

**Informational (guide layer — commercial-adjacent only on-site)**
how often to pump a septic tank in tennessee · signs septic tank is full ·
what happens if you never pump · why is septic pumping so expensive · drain field
replacement cost tennessee · septic inspection selling home tennessee · williamson
county septic regulations 2025 · grease trap 25 percent rule

**Long-tail sub-service and situational** (the pages competitors ignore)
septic system sinkhole lot tennessee · mobile home septic tank pumping · rental
property septic pumping · septic pumping well water home · septic effluent filter
cleaning · septic baffle repair

---

## 0.5 — REFERENCE SITE ANALYSIS ⚠️ STILL BLOCKED

`nashvilleseptic.com` is inside the egress allowlist but sits behind a Cloudflare
bot challenge that returns 403 with a "Just a moment…" interstitial to every
non-browser client. Chromium is installed here but is not routed through the
egress proxy, and `web.archive.org` — the legitimate archived-copy route — is not
in the allowlist.

Defeating a bot challenge is circumventing the site's own access-control
decision, so it was not attempted. What is confirmed from `robots.txt` alone:
WordPress with Yoast SEO, nothing disallowed, sitemap at `/sitemap_index.xml`.
No typography scale, article structure, link density, CTA rhythm or layout
pattern has been observed.

**Resolution — pick one before Phase 2:**

1. **Add `web.archive.org` to the egress allowlist** (one line). An August 2024
   snapshot exists and is confirmed available; the study then runs properly.
2. **Paste the page source**, or a structured description: heading sizes and
   weights, body size and line-height, measure width, separators, links per
   article, CTA count and placement, section rhythm.
3. **Accept a documented deviation.** Phase 2 proceeds on the spec's own design
   system — mandatory prose overrides, the `professional, warm` mood, the "must
   NOT look like" list — recorded in DONE.md as a deviation, not a study.

Option 1 is cheapest and is recommended. Note that the two competitors that
*were* audited are not usable design references: one has no `h1` and 569 words,
the other has five `h1`s and a stale sitemap. Neither is a bar worth matching,
which is an argument for option 3 being less costly than it sounds.

---

## Service catalog (proposed — 9 core + 7 long-tail)

**Core:** residential septic tank pumping · septic tank cleaning · emergency
septic service · septic tank inspection · real-estate septic inspection ·
drain field repair · commercial septic pumping · grease trap cleaning ·
septic tank locating

**Long-tail:** riser installation · effluent filter cleaning · baffle repair ·
sinkhole/karst lot service · mobile home pumping · rental property pumping ·
well-water home pumping

**knowsAbout vocabulary** (entity loading for schema and body copy): subsurface
sewage disposal system (SSDS) · soil morphology assessment · percolation rate ·
effluent filter · inlet and outlet baffle · scum and sludge layers · drainfield
/ leach field lateral · distribution box · advanced treatment system ·
subsurface drip disposal · low-pressure pipe system · karst solution feature ·
setback distance · FOG (fats, oils, grease) · grease interceptor vs grease trap ·
certified hauler manifest · septage · TDEC contract county

---

## Sources

Karst geology and drainfield sizing — septic and land-development sources for
Middle TN · Nashville Scene, *How Sewage Shaped Spacious Lots in Nashville's
Suburbs* (unsewered-subdivision figure and sewer-extension timeline) ·
TDEC Subsurface Sewage Disposal Program (permits, contract counties, installer
and pumper licensing) · Tenn. Comp. R. & Regs. 0400-48-01-.20 via Cornell LII ·
Metro Public Health Dept. Environmental Engineering Services (reserve-area
notice, bedroom-approval lookup) · Nashville City & Davidson County Planning
Commissions (unsewered acreage) · City of Belle Meade (1983 sewer system) ·
Metro Water Services grease control BMPs (FOG program, 30/90-day and 25% rules) · TREC Rule 1260-2-.37 and
TN real-estate septic guidance · Angi, HomeGuide, HomeAdvisor and The Septic
Guide 2026 cost data · NeighborhoodScout Joelton/Whites Creek neighborhood
profile (housing era and type).
