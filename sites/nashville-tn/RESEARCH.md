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

## ⚠️ Research integrity notice — two workstreams could not be completed to spec

The build environment's egress policy denies all outbound page fetches. Blocked
hosts, each confirmed by a `connect_rejected` at the proxy:

`nashvilleseptic.com` · `maxwellseptic.com` · `www.elitteseptictank.com` ·
`en.wikipedia.org` · `www.nashville.gov` · `www.reddit.com` · `api.kie.ai`

Server-side web search is unaffected and is the source for everything in this
document. The consequences, stated plainly rather than papered over:

| Workstream | Status | What is missing |
|---|---|---|
| 0.2 Competitor teardown | **DEGRADED** | No H1/H2/H3 audit, no `site:` indexed page counts, no schema inventory, no page-speed measurement. Gap table below is inferred from search-surface evidence, not audited. |
| 0.5 Reference-site design study | **NOT DONE** | `nashvilleseptic.com` cannot be opened. No typography measurements, article structure, link density or CTA rhythm. Phase 2 has no measured benchmark. |
| 0.3 Information-gap mining | **PARTIAL** | Reddit API blocked. Questions below are drawn from search-surface PAA and cost-guide coverage, not from verbatim local forum threads. |
| 0.4 Sub-city Wikipedia extraction | **PARTIAL** | Wikipedia blocked, so the sub-city uniqueness method has no source. Sub-city tier is therefore **not built** rather than built thin. |
| Phase 4 Images | **BLOCKED** | `api.kie.ai` denied. No hero images, no gallery, no logo, no favicon set can be generated in this environment. |

Per the doorway rule and the no-placeholder rule, the response to a blocked
uniqueness source is to **not build the page**, not to build it thin. The
sub-city tier is omitted for that reason and can be added once egress is opened.

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
| Williamson County runs its own **Dept. of Sewage Disposal Management** (615-790-5751); regulations amended by the Board of Health 18 Mar 2025, **effective 1 July 2025**, adding advanced treatment systems, subsurface drip disposal, qualified-service-provider requirements, and changes to effluent filters, setbacks, slope and pump calculations | Williamson County TN |
| Cheatham County requires the **septic permit before the building permit** issues | Cheatham County TN |
| A buyer's agent must present the option of a sewer inspection under **TREC Rule 1260-2-.37**; TN does not universally require pre-sale pumping, but inspection in practice requires it | TREC / TN real-estate guidance |
| In Tennessee it is **illegal to advertise a home for more bedrooms than its septic is approved for** | TN real-estate guidance |
| Metro Water Services FOG program: **grease traps serviced ≥ every 30 days, interceptors ≥ every 90 days**, the **25% rule** (service when FOG + solids reach 25% of capacity), certified hauler manifests, **three-year record retention** | Metro Water Services, Nashville |
| TDEC permitting requires a site evaluation including **soil morphology assessment by a soil scientist** | TDEC SSDS |

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

### Candidate service areas — evidence per area

Tier assignment follows septic density, per the finding above.

**Tier 1 — primary (unsewered Davidson + nearest high-septic county seats)**

| Area | County | Evidence / local angle |
|---|---|---|
| Joelton | Davidson | Rural community of farms and suburban lots in NW Davidson, 37080. Housing predominantly built 1970–1999, three/four-bedroom single-family plus mobile homes — systems now 25–55 years old. Never reached by the Metro sewer extension. US-41A / I-24 corridor. |
| Whites Creek | Davidson | Unincorporated, ~10 miles NW of downtown, 37189. Same unsewered history and housing era as Joelton; shares the 37080/37189 rural belt. |
| Ashland City | Cheatham | County seat. Septic permit required before building permit issues; county Environmental Health at 615-687-7000. Cumberland River bottomland plus limestone ridge. |
| Kingston Springs / Pegram | Cheatham | Both municipalities working through aging municipal sewer capacity — Pegram allocated $650,000 for plant upgrades — so the surrounding unincorporated area stays on septic. Harpeth River valley, steep karst ridges. |
| Mount Juliet / rural Wilson County | Wilson | Rapid growth on the sewer fringe; county septic permitting handled by its own affiliate office rather than Codes & Zoning. |

**Tier 2 — secondary**

| Area | County | Evidence / local angle |
|---|---|---|
| Springfield / Greenbrier | Robertson | Agricultural county north of Davidson, largely septic outside the town cores. |
| Nolensville / College Grove | Williamson | Permitted through WCDSDM under the county's own regulations — the strictest local code in the metro, amended effective 1 July 2025. Large-lot subdivisions on advanced treatment and subsurface drip systems. |
| Gallatin / rural Sumner | Sumner | Lake-adjacent development on the Cumberland impoundments; septic common outside city limits. |
| Dickson | Dickson | Western Highland Rim — different soil profile from the Central Basin, deeper and more acidic. |

**Deliberately NOT built:** Green Hills, Donelson, Madison, Hermitage, inner
Antioch, Bellevue proper — sewered by the Metro extension, so a page there
targets demand that does not exist. This is the doorway rule applied honestly.

**Sub-city tier:** omitted this build. Bells Bend (~238 residents), Scottsboro,
Pasquo and Pleasant View are all genuine septic pockets, but the spec's
uniqueness method for that tier is Wikipedia entity extraction, and Wikipedia is
blocked. They get built when egress opens, not before.

---

## 0.2 — COMPETITOR TEARDOWN ⚠️ DEGRADED (see integrity notice)

What follows is search-surface evidence only. **No competitor page was opened.**
Indexed page counts, heading audits, schema inventory and speed measurements are
absent and must not be presented as though they were performed.

| Competitor | What the search surface shows |
|---|---|
| **maxwellseptic.com** | In business since 1997. Free estimates, emergency service, open 24/7. Broad multi-county service area explicitly listed: Davidson, Wilson, Robertson, Rutherford, Cheatham, Williamson, Macon, Trousdale, Sumner, Dickson. Operating history is their principal trust signal. |
| **nashvilleseptic.com** (also the reference site) | Positions on pumping, cleaning and maintenance for homeowners and businesses across Nashville and Middle Tennessee. Structure unknown — could not be opened. |
| **elitteseptictank.com** | Nothing surfaced in search. Structure, positioning and page count unknown. |
| **macseptic.com** (not a supplied competitor; notable) | Publishes a flat headline price — **"$625 All-In"** — and runs per-location pages (`/location/nashville-tn/`, `/locations/spring-hill-tn/drainfield/`). The only operator found publishing price on the search surface. |
| **prodigytrenchless.com** | Runs a service × city URL matrix (`/septic-service/septic-tank-pumping-nashville/`, `/davidson-county/nashville-tn/`) — the closest thing to a topical-authority structure among those seen. |
| Directory layer | HomeAdvisor, Angi, Yelp, Porch and Manta rank heavily for the money terms. Directories occupying the SERP is the standard rank-and-rent opening: they convert poorly and cannot answer a local question. |

### Gap table — exploitable absences

Confidence is marked honestly, since none of this was audited.

| Gap | Evidence | Confidence |
|---|---|---|
| **No published local price bands** | Only macSeptic publishes a number, and it is a single flat figure with no "what changes the price" breakdown. None of the three supplied competitors surfaces pricing. | High |
| **No cost calculator** | None found on any Middle TN septic operator. | High |
| **No karst/geology content** | The karst → drainfield connection appears in geology and installer sources, never in a pumper's marketing. This is the single largest content gap. | High |
| **No sewer-history localisation** | No operator explains *which* 615 areas are on septic or why. Every competitor lists counties; none explains the map. | High |
| **No Williamson County code content** | The 1 July 2025 amendments are a live, specific, searchable local change no operator has written about. | High |
| **No real-estate-transaction content** | TREC Rule 1260-2-.37, the bedroom-count advertising rule, and the pump-before-inspection reality are unaddressed. Realtors are a repeat-referral channel. | High |
| **No grease-trap compliance content** | Metro Water's 30/90-day and 25% rules are enforceable obligations restaurant operators search for. | High |
| **Thin long-tail service coverage** | Competitor URL patterns suggest core services plus city variants, not sub-service pages (risers, effluent filters, baffles, locating). | Medium — inferred from URL patterns only |
| **Directory-dominated SERP** | Angi/HomeAdvisor/Yelp/Porch rank for the money terms. | High |
| **Trust rests on operating history** | Maxwell leads with "since 1997" — a claim this site cannot and will not make, which is exactly why the trust load moves to pricing transparency, process detail and the calculator. | High |

**Demand proxies** (per spec, tool volumes are a floor, never a kill criterion):
map-pack density for "septic tank pumping Nashville" is populated enough to
support multiple directory aggregators and 6+ distinct operators, which is a real
demand signal. Google autocomplete harvesting could not be run — the endpoint is
egress-blocked.

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
| 22 | What changed in Williamson County's septic rules in July 2025? | Inspection | insurance-permits | ON |
| 23 | Who regulates septic pumpers in Tennessee? | Pumping | insurance-permits | ON |
| 24 | Does homeowners insurance cover a septic failure? | Drainfield | insurance-permits | ON |
| 25 | How often must a restaurant grease trap be cleaned in Nashville? | Grease trap | insurance-permits | ON |
| 26 | What is the 25% rule for grease traps? | Grease trap | insurance-permits | ON |
| 27 | How long must grease-trap service records be kept? | Grease trap | insurance-permits | ON |
| 28 | Nobody can find my septic tank lid — what now? | Locating | what-to-do-now | ON |
| 29 | Is a septic riser worth the money? | Riser install | vs-decision | ON |
| 30 | What is an effluent filter and does my tank have one? | Effluent filter | process | ON |
| 31 | How do I know if my baffle has failed? | Baffle repair | danger-urgency | ON |
| 32 | Do septic additives / treatments actually work? | Pumping | vs-decision | OFF |
| 33 | How does a septic system actually work? | — | informational | OFF |
| 34 | Is it safe to plant a garden over a drainfield? | — | informational | OFF |

31 on-site, 3 held off-site.

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
| `/service-areas/` | septic service areas middle tennessee |
| `/service-areas/joelton/` | septic tank pumping joelton tn |
| `/service-areas/whites-creek/` | septic tank pumping whites creek tn |
| `/service-areas/ashland-city/` | septic tank pumping ashland city tn |
| `/service-areas/kingston-springs/` | septic tank pumping kingston springs tn |
| `/service-areas/mount-juliet/` | septic tank pumping mount juliet tn |
| `/service-areas/springfield/` | septic tank pumping springfield tn |
| `/service-areas/nolensville/` | septic tank pumping nolensville tn |
| `/service-areas/gallatin/` | septic tank pumping gallatin tn |
| `/service-areas/dickson/` | septic tank pumping dickson tn |

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
| `/guide/williamson-county-septic-rules-2025/` | williamson county septic regulations 2025 |
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

**Page count: 74 URLs** (1 home + 16 service + 10 area + 28 guide + 3 tools +
1 resources + 1 review + 5 blog + 2 company + 2 legal + 404 + hubs), within the
~60–70 target with the sub-city tier omitted.

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

## 0.5 — REFERENCE SITE ANALYSIS ⚠️ NOT PERFORMED

`nashvilleseptic.com` is egress-blocked and could not be opened. No typography
scale, article structure, internal-link density, CTA rhythm, layout pattern or
content-gap analysis exists for it.

The spec calls this the highest-leverage step and the concrete spec for Phase 2,
and explicitly says not to reduce it to a glance. Presenting design judgment as
though it were a benchmark study would misrepresent the work, so this section is
left open rather than filled with invention.

**Resolution required before Phase 2** — one of:
1. Egress opened for `nashvilleseptic.com`, and this section is written properly.
2. The operator supplies the page source or a structured description (heading
   scale, body size and line-height, measure width, links per article, CTA
   count and placement, section rhythm).
3. The operator accepts a documented deviation: Phase 2 proceeds on the design
   system in the spec itself — prose overrides, `professional, warm` mood, the
   "must NOT look like" list — recorded in DONE.md as a deviation, not a study.

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
Williamson County TN Dept. of Sewage Disposal Management (2025 amendments) ·
Cheatham County TN building/septic permit sequence · Metro Water Services grease
control BMPs (FOG program, 30/90-day and 25% rules) · TREC Rule 1260-2-.37 and
TN real-estate septic guidance · Angi, HomeGuide, HomeAdvisor and The Septic
Guide 2026 cost data · NeighborhoodScout Joelton/Whites Creek neighborhood
profile (housing era and type).
