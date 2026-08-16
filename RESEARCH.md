# RESEARCH.md — 615 Septic Tank Pumping, Nashville TN

Phase 0 output for the R&R Master Site Prompt v1.3 build. Everything below is the
contract the rest of the build follows; Gate 6 reconciles the built site against it.

**Build date:** 2026-08-16 · **Niche:** septic tank pumping · **Metro:** Nashville, TN (Davidson County)

---

## 0.0 Inputs as supplied, and what was missing

| Input | Value used | Note |
|---|---|---|
| NICHE | Septic tank pumping | From the supplied article |
| CITY_METRO | Nashville, TN | From the supplied article |
| BRAND_NAME | 615 Septic Tank Pumping | From the supplied article, used verbatim |
| PHONE | (615) 555-0199 / +16155550199 | From the supplied article, used verbatim, never validated |
| ADDRESS | **NOT SUPPLIED** | See below |
| EMAIL | service@615septictankpumping.com | Derived from the domain; change in `src/config.ts` |
| DOMAIN | 615septictankpumping.com | Assumed; change in `src/config.ts` |
| SERVICE_AREA | "Nashville and Davidson County" | |
| FORM_ENDPOINT | **NOT SUPPLIED** | Forms render disabled rather than posting nowhere |
| PROOF_ASSETS | NONE | Expected state at build time |
| CITY_TIERS | Researched and proposed (below) | |
| EMERGENCY_NICHE | yes | |
| DESIGN_MOOD | Grounded utility trust | Deep pine + safety amber, industrial condensed display face |
| HOST | Both — `_headers` and `.htaccess` ship every build | |
| COMPETITORS | Researched from live SERP (below) | None supplied |
| REFERENCE_SITE | **NOT SUPPLIED** | See 0.5 |

### ADDRESS — operator action required

No street address was supplied. Per the NAP rule the builder never invents,
validates or questions an address, so rather than fabricate one the site ships as a
**service-area business**: `addressLocality` + `addressRegion` + `areaServed` +
`serviceArea` GeoCircle, with no street line anywhere.

`src/config.ts → CONTACT.address.street` and `.postalCode` are empty strings. Fill
them in and the full `PostalAddress` appears in the footer, contact page and JSON-LD
with no other edit. A virtual office, mailbox or coworking address is expected and
fine. **This does not block launch** — the site is coherent and consistent as-is.

### FORM_ENDPOINT — operator action required

`FORMS.enabled` is `false` and `FORMS.endpoint` is a visible placeholder. Every form
renders with its fields disabled and a short honest notice, rather than silently
posting a lead into a void. The phone route works everywhere. Set both values and
rebuild.

---

## 0.1 Keyword and demand map

Demand signals used, in priority order: manual SERP review of the money terms,
Google autocomplete, map-pack density for `septic tank pumping nashville`
(10+ businesses, i.e. real commercial demand), and published cost-guide data.
Tool volumes were treated as a floor, never a kill criterion — local septic terms
under-report badly and terms showing near-zero volume still produce calls.

### Intent segmentation

| Bucket | Example terms | Where they land |
|---|---|---|
| Emergency / BoFu | emergency septic service nashville, septic backing up, sewage in yard, 24 hour septic pumping | `/emergency-septic-service/`, urgency guides |
| Planned / BoFu | septic tank pumping nashville, septic pumping cost, septic tank cleaning, septic inspection nashville | Home, core service pages, cost guides |
| Long-tail service | rental property septic pumping, pre-sale septic inspection, septic pumping well water, karst lot septic | Long-tail service tier |
| Local modifiers | septic pumping bellevue / antioch / hermitage / joelton + ZIP variants | City tier |
| Informational (held OFF-site) | how does a septic tank work, septic tank history, are septic systems bad for the environment | Reddit/social distribution — see 0.3 |

---

## 0.45 KEYWORD MAP — the anti-cannibalisation artifact

One row per planned URL. **No primary keyword appears twice.** `npm run qa` gate 4
re-checks this against the built HTML on every build and fails on a duplicate or on
a keyword missing from a page's title, H1 or first 100 words.

### Money pages

| URL | Type | PRIMARY keyword | Supporting terms | Intent |
|---|---|---|---|---|
| `/` | Home | septic tank pumping nashville | septic pumping davidson county, licensed septic nashville | Planned BoFu |
| `/residential-septic-tank-pumping/` | Service | residential septic tank pumping nashville | home septic pumping, full pump-out | Planned BoFu |
| `/septic-tank-cleaning/` | Service | septic tank cleaning nashville | sludge removal, tank backflush | Planned BoFu |
| `/commercial-septic-pumping/` | Service | commercial septic pumping nashville | restaurant septic, business septic service | Planned BoFu |
| `/emergency-septic-service/` | Service | emergency septic service nashville | septic backup, 24 hour septic | Emergency BoFu |
| `/septic-tank-inspection/` | Service | septic tank inspection nashville | septic condition report, baffle inspection | Planned BoFu |
| `/drain-field-inspection/` | Service | drain field inspection nashville | leach field assessment, field failure | Planned BoFu |
| `/grease-trap-cleaning/` | Service | grease trap cleaning nashville | interceptor service, FOG removal | Planned BoFu |
| `/septic-tank-locating/` | Service | septic tank locating nashville | find septic tank, buried lid | Planned BoFu |
| `/septic-baffle-repair/` | Service | septic baffle repair nashville | outlet tee replacement | Planned BoFu |
| `/septic-tank-riser-installation/` | Service | septic tank riser installation nashville | septic lid to grade | Planned BoFu |
| `/pre-sale-septic-inspection/` | Long-tail | pre-sale septic inspection nashville | selling home septic, listing inspection | Planned BoFu |
| `/new-homeowner-septic-service/` | Long-tail | new homeowner septic service nashville | first septic service, baseline pump-out | Planned BoFu |
| `/rental-property-septic-pumping/` | Long-tail | rental property septic pumping nashville | landlord septic, portfolio septic | Planned BoFu |
| `/septic-pumping-well-water-homes/` | Long-tail | septic pumping well water homes nashville | well and septic setback, softener discharge | Planned BoFu |
| `/septic-service-karst-lots/` | Long-tail | septic service karst sinkhole lots nashville | limestone septic, solution feature setback | Planned BoFu |
| `/services-menu/` | Hub | septic services nashville tn | septic company nashville | Planned BoFu |

### City tier

| URL | Tier | PRIMARY keyword | Local angle |
|---|---|---|---|
| `/service-areas/bellevue/` | 1 | septic tank pumping bellevue tn | Ridge lots on thin soil over limestone vs Harpeth bottomland with a high water table — two different failure modes on one map |
| `/service-areas/antioch/` | 1 | septic tank pumping antioch tn | Older Cane Ridge / Mill Creek septic lots ringed by newer sewered subdivisions; high rental density; clay soil sensitive to compaction |
| `/service-areas/hermitage/` | 1 | septic tank pumping hermitage tn | Percy Priest shoreline + Stones River bottomland; pre-1990s concrete tanks with corroded cast outlet baffles |
| `/service-areas/donelson/` | 1 | septic tank pumping donelson tn | Post-war housing on 50–70 year old original tanks; Pennington Bend bottomland; airport-corridor rental turnover |
| `/service-areas/madison/` | 1 | septic tank pumping madison tn | 1950s–60s lots with access lids lost under six decades of landscaping; Neelys Bend bottomland |
| `/service-areas/green-hills/` | 2 | septic tank pumping green hills tn | Mostly sewered; exceptions are large older lots toward Radnor Lake; mature landscaping over buried ports; renovation/bedroom-count capacity issues |
| `/service-areas/goodlettsville/` | 2 | septic tank pumping goodlettsville tn | Steep hill-country lots where gravity put tanks well downhill; thin ridge soil; Davidson–Sumner county line splits the permit file |
| `/service-areas/old-hickory/` | 2 | septic tank pumping old hickory tn | Planned DuPont village with compact lots and no room for a replacement field; lakeside lots; seasonal occupancy |
| `/service-areas/joelton/` | 2 | septic tank pumping joelton tn | Most septic-dependent part of the county; near-universal private wells; water softener brine discharge; karst setbacks |
| `/service-areas/whites-creek/` | 3 | septic tank pumping whites creek tn | Creek bottom vs valley side; wells throughout |
| `/service-areas/bells-bend/` | 3 | septic tank pumping bells bend tn | Best soil in the county (river alluvium) limited by a water table that rises with the Cumberland |
| `/service-areas/forest-hills/` | 3 | septic tank pumping forest hills tn | Satellite city where septic is the norm; mature roots find penetrations; long private drives |
| `/service-areas/oak-hill/` | 3 | septic tank pumping oak hill tn | Large-lot satellite city; landscaping over buried ports; riser is the high-value fix |
| `/service-areas/una/` | 3 | septic tank pumping una tn | Older lots off Murfreesboro Pike predating the development around them; Mill Creek clay compaction |
| `/service-areas/pasquo/` | 3 | septic tank pumping pasquo tn | Far south-west karst country; fast-draining fields are a warning, not good news |

### Guides (BoFu-adjacent only)

| URL | Bucket | PRIMARY keyword | Parent service |
|---|---|---|---|
| `/guide/septic-tank-pumping-cost-nashville/` | cost | septic tank pumping cost nashville | residential pumping |
| `/guide/septic-tank-inspection-cost-nashville/` | cost | septic tank inspection cost nashville | tank inspection |
| `/guide/drain-field-replacement-cost-nashville/` | cost | drain field replacement cost nashville | drain field inspection |
| `/guide/grease-trap-cleaning-cost-nashville/` | cost | grease trap cleaning cost nashville | grease traps |
| `/guide/septic-permit-davidson-county/` | permits | septic permit davidson county | drain field inspection |
| `/guide/tennessee-septic-regulations-homeowners/` | permits | tennessee septic regulations | tank inspection |
| `/guide/does-homeowners-insurance-cover-septic-failure/` | insurance | homeowners insurance septic failure | emergency |
| `/guide/septic-inspection-required-to-sell-house-tennessee/` | permits | septic inspection required to sell house tennessee | pre-sale inspection |
| `/guide/sewage-backing-up-what-to-do/` | urgency | sewage backing up what to do | emergency |
| `/guide/septic-tank-overflowing-emergency/` | urgency | septic tank overflowing emergency | emergency |
| `/guide/signs-septic-tank-needs-pumping/` | urgency | signs septic tank needs pumping | residential pumping |
| `/guide/how-often-pump-septic-tank-nashville/` | decision | how often pump septic tank nashville | residential pumping |
| `/guide/septic-pumping-vs-cleaning-difference/` | decision | septic pumping vs cleaning | tank cleaning |
| `/guide/septic-tank-additives-do-they-work/` | decision | septic tank additives | tank cleaning |
| `/guide/how-to-find-septic-tank-location/` | decision | how to find septic tank location | tank locating |
| `/guide/septic-system-karst-sinkholes-middle-tennessee/` | decision | septic system karst sinkholes middle tennessee | karst lots |
| `/guide/what-not-to-put-down-a-septic-system/` | decision | what not to put down a septic system | new homeowner |

### Combine-vs-split decisions recorded

- **Pumping vs cleaning** — SPLIT. Searchers do not know these are used
  interchangeably by the trade, and the jobs genuinely differ (a vacuum pass vs
  agitation + backflush + second pass). `/septic-tank-cleaning/` owns "cleaning";
  `/residential-septic-tank-pumping/` owns "residential pumping"; the homepage owns
  the head term. A decision guide reconciles them.
- **Tank inspection vs drain field inspection** — SPLIT. Different components,
  different price, different trigger (transaction vs suspected failure).
- **Commercial vs rental** — SPLIT. Same truck, different buyer, different anxiety
  (health inspector vs tenant habitability).
- **Home vs a generic `/septic-tank-pumping/` page** — MERGED into the homepage. The
  homepage is the authority hub and targets the head term; a second page on the same
  term would cannibalise it, so no such page exists.
- **Pre-sale inspection vs new homeowner service** — SPLIT. Seller-side and
  buyer-side of the same transaction, opposite urgency and opposite deliverable.

---

## 0.2 Competitor teardown

Live SERP review for `septic tank pumping nashville tn` and neighbouring terms,
2026-08-16. Named operators appearing across Yelp / Angi / Porch / Thumbtack
listings and organic results include Septic Masters, Anglin Septic Tank Service,
Greenwood Septic Service, Backroad Septic, ABC Septic Pumping, ASAP Septic Service,
Maxwell Septic Pumping, A-1 Septic Tank Pumping, Music City Processing, Elitte
Septic Tank & Grease Trap, Mac Septic and Prodigy Trenchless.

### Gap table — what none of them do well

| Gap | Detail | Where this site exploits it |
|---|---|---|
| **Directory dependence** | Most local operators rank through Yelp/Angi/Porch/Thumbtack rather than their own site. Thin owned properties, often under 10 indexed pages. | 65 interlinked BoFu pages on one topic |
| **No published pricing** | Almost nobody publishes a range. One (Mac Septic) publishes a flat "$625 all-in", which is a number without a basis. | Published $275–$525 band with three cited sources, on the homepage, every service page and a dedicated cost guide |
| **No cost tool** | No local operator offers a calculator. | `/tools/septic-pumping-cost-estimator/` shows every multiplier and its source |
| **No triage tool** | Nobody helps a panicking homeowner decide whether this is an emergency. | `/tools/septic-system-assessment/` |
| **Zero city-level substance** | Service-area pages are lists of town names. None mention karst, Neelys Bend bottomland, or the corroded outlet baffles endemic to pre-1990s Davidson County tanks. | 15 city pages, each with hand-written local ground truth |
| **No permit/regulation content** | Nothing on the TDEC pumping-contractor permit, the two-inch truck lettering rule, or Davidson County's contract-county status. | Two permit guides + the truck-marking check in the free checklist |
| **No process transparency** | "We pump tanks." No mention of pre-pump readings, baffle inspection, or what separates a full pump-out from a skim. | The pre-pump readings are the site's central differentiator |
| **Review-led trust only** | Everything rests on star counts. | Trust carried by pricing transparency, method specificity, cited standards and tools |

### What we deliberately did NOT copy

Fabricated or unverifiable review counts, "family owned since 19XX" claims with no
basis, stock-photo crews, and embedded Google Maps iframes.

---

## 0.3 Information-gap mining — 34 questions

Each tagged to a parent service, an intent bucket, and an ON-SITE / OFF-SITE
classification. Commercial-adjacent questions become on-site guides; pure
informational curiosity is held back for off-site distribution so the money site
keeps its commercial classification.

### ON-SITE (built as guides)

| # | Question | Bucket | Parent |
|---|---|---|---|
| 1 | How much does septic pumping cost in Nashville? | cost | residential pumping |
| 2 | Why are quotes for the same house so different? | cost | residential pumping |
| 3 | What does a septic inspection cost, and why is it sold with a pump-out? | cost | tank inspection |
| 4 | What does a drain field replacement cost in Middle Tennessee? | cost | drain field |
| 5 | How much is grease trap cleaning for a small kitchen? | cost | grease traps |
| 6 | Do I need a permit to replace a drain field in Davidson County? | permits | drain field |
| 7 | Does my septic contractor need a state permit? How do I check? | permits | regulations |
| 8 | What does Tennessee actually require of a septic homeowner? | permits | tank inspection |
| 9 | Is a septic inspection required to sell a house in Tennessee? | permits | pre-sale |
| 10 | Does homeowners insurance cover a sewage backup? | insurance | emergency |
| 11 | Will insurance pay for a failed drain field? | insurance | emergency |
| 12 | Sewage is backing up — what do I do in the next ten minutes? | urgency | emergency |
| 13 | Sewage is surfacing in the yard — is that an emergency? | urgency | emergency |
| 14 | What are the signs a tank needs pumping right now? | urgency | residential pumping |
| 15 | How often should a Nashville tank be pumped? | decision | residential pumping |
| 16 | Is pumping the same as cleaning? | decision | tank cleaning |
| 17 | Do septic additives work? | decision | tank cleaning |
| 18 | How do I find a buried tank without wrecking the yard? | decision | tank locating |
| 19 | What does karst ground mean for my system? | decision | karst lots |
| 20 | What should never go down a septic system? | decision | new homeowner |

### ON-SITE (answered inside service/city page FAQs rather than as standalone guides)

21 Why does my system only back up when it rains? · 22 Is a fast-draining field good
news? · 23 Where is the tank likely to be on a sloping lot? · 24 Should a water
softener drain into the tank? · 25 How often should a rental be pumped? · 26 Is my
Antioch street on septic or sewer? · 27 Is a riser worth fitting? · 28 What is a
missing outlet baffle going to cost me? · 29 How far must a septic system be from a
private well? · 30 Which county holds my permit file?

### OFF-SITE (held back for Reddit / social distribution)

31 How does a septic tank actually work? · 32 Why do septic systems exist instead of
sewers? · 33 What happens to the waste after the truck leaves? · 34 Are septic
systems worse for the environment than sewer?

Rationale: AI Overviews appear on ~92% of informational local queries versus ~15% of
transactional ones. Publishing pure-informational content on a service site risks
reclassifying it as an informational blog and diluting commercial rankings. Those
four are answered off-site with links back.

---

## 0.4 Local ground truth — Davidson County

**Geology (the physical angle, used across the whole site).** Middle Tennessee is
karst: soluble limestone bedrock, a thin and clay-heavy soil mantle, and solution
features — sinkholes, swallets, fractured zones — that route water underground with
very little filtration. Environmental health offices in Davidson, Williamson,
Rutherford and Maury counties watch karst features carefully and enforce generous
setbacks from any visible solution feature, because a sinkhole can swallow a
drainfield and fractured limestone lets poorly treated effluent reach groundwater.

**Consequences that drive copy across the site:**

- A fast-draining drain field can mean effluent is short-circuiting through a
  fracture rather than percolating — no surface symptom, no treatment.
- A replacement field frequently cannot be permitted where the existing one sits.
- Clay soil accepts water slowly, so fields here are sized generously and are
  unusually sensitive to compaction and to surface water routed across them.
- River bottomland (Pennington Bend, Neelys Bend, Bells Bend, the Harpeth flats)
  saturates each spring, producing wet-weather-only failures that are a capacity
  finding, not a dead field.
- Pre-1990s concrete tanks had cast-in baffles; the corrosive gas space above the
  liquid dissolves them, leaving no above-ground symptom and years of scum reaching
  the field. Endemic in Donelson, Madison and Hermitage.
- Rural fringe properties (Joelton, Whites Creek, Bells Bend, Pasquo) pair a private
  well with the septic system on the same lot, and hard water means near-universal
  softeners discharging brine into tanks.

**Regulatory ground truth (cited throughout):**

- Subsurface sewage disposal is governed by Tenn. Comp. R. & Regs. Chapter 0400-48-01,
  administered by TDEC's Division of Water Resources through county environmental
  health offices.
- Davidson is a **contract county** (with Blount, Hamilton, Jefferson, Knox, Madison,
  Sevier, Shelby, Williamson) and may require an additional county permit.
- Construction permit required for any new system, repair or replacement. Review
  generally ~10 days, must complete within 45 days of application.
- Installation must be by a licensed SSDS installer; inspector signs off before backfill.
- Pumping contractors need a TDEC **Septic Tank Pumping Contractor** permit
  (Rule 0400-48-01-.20), applied for on form CN-0765.
- Septage removal vehicles must display firm name, address and removal permit number
  in lettering ≥2 inches, bold, on a contrasting background, plus a department sticker.
  **This is the homeowner-verifiable check used in the free checklist.**
- Tank capacity follows bedroom count (Rules .08 and .09); 750 gallons is the
  practical floor, 1,000–1,500 gallons covers most single-family homes; cast-in-place
  concrete tanks over 1,000 gallons need 6-inch minimum top and bottom thickness.

**Price bands (real basis, cited on every page that uses them):**

| Item | Range | Source |
|---|---|---|
| Standard residential pump-out, Tennessee | $275 – $525 per visit | septiccompaniesnearme.com Tennessee guide (2026) |
| Davidson County reported spread | $199 – $796 | homeyou.com Davidson County cleaning costs |
| Drain field replacement, Middle Tennessee | $6,000 – $10,000 | Mac Septic Spring Hill drainfield pricing |
| Drain field replacement, national 2026 | ~$5,000 – $20,000 | homeguide.com / Angi 2026 data |

**Wikidata IDs:** deliberately **omitted**. Confident IDs could not be verified for
the Nashville neighbourhood and satellite-city entities during this build, and a
fabricated `sameAs` is worse than an absent one. `cities.json → wikidataId` is `null`
throughout and the schema builder skips the property when null. Verifying and adding
them is a genuine post-launch improvement.

---

## 0.5 Reference-site design study

**No REFERENCE_SITE was supplied.** Rather than skip the highest-leverage step, the
benchmark was taken from the competitor set reviewed in 0.2 plus the design brief in
the build spec. Findings and the resulting decisions:

| Dimension | What the local competitor set does | What this build does |
|---|---|---|
| Typography | System fonts or a single Google-hosted sans; headings barely larger than body | Two self-hosted faces — Barlow Condensed (display, industrial trade register) + Source Sans 3 Variable (body, 17–19px). H2 at `text-3xl md:text-4xl` with a bottom-border separator; H3 `text-2xl md:text-3xl`; body `text-lg leading-relaxed` |
| Article structure | 300–600 word service pages, no FAQs, no sources | Core service pages ~1,100 words with editorial H2s, an 8-point inclusion list, a comparison table, related guides and a 5-question FAQ |
| Internal linking | 3–6 links per page, mostly nav | 25–45 contextual links per money page; every subpage opens with a brand mention anchor-linked up to the homepage hub |
| CTA rhythm | One phone number in the header | Header CTA + hero dual CTA + ticker + mid-page band + sticky mobile call bar + form + final band; CTA copy mirrors search intent |
| Layout | Full-width text, no rhythm | Asymmetric hero, alternating section backgrounds, sticky header with scroll shadow, cards with border + soft shadow + hover lift, sticky sidebars on long-form templates |
| Interactive tools | None found | Cost estimator + urgency assessment, both Preact islands, `client:visible` |
| Imagery | Stock photos and Google Maps iframes | No stock photography, no iframes. A hand-authored SVG system cross-section that teaches the mechanism the copy refers to, plus SVG service-area maps |
| Content gaps | See 0.2 gap table | — |

### Deliberate deviation: photography

The `gpt-image-2` skill specified in Phase 4 is **not available in this environment**,
so no photoreal jobsite imagery could be generated. Rather than substitute CSS
gradients (explicitly forbidden) or stock photos (dishonest), the build ships:

- A real, hand-authored SVG technical diagram used as the hero and on every service page
- SVG service-area maps per city, and an SVG mockup of the printable checklist
- A real SVG logo lockup and a complete generated favicon set + OG card

The photo batch list the operator should run is written out in `HANDOFF.md`, with the
exact prompts, aspect ratios, filenames and alt text, ready to drop into
`public/images/` and wire in.

---

## Service catalog (Gate 0 output)

**Core (10):** residential septic tank pumping · septic tank cleaning · commercial
septic pumping · emergency septic service · septic tank inspection · drain field
inspection · grease trap cleaning · septic tank locating · septic baffle repair ·
septic tank riser installation

**Long-tail (5):** pre-sale septic inspection · new homeowner septic service ·
rental property septic pumping · septic pumping for homes on well water · septic
service for karst and sinkhole-prone lots

Each long-tail page carries genuinely shifted content — different buyer, different
anxiety, different technical constraint — not a heading swap over the core template.

---

## Recorded exception: the homepage H1

The build spec requires each page's primary keyword in its **title, H1, URL and first
100 words**. The homepage is the supplied article, which must be used verbatim, and
its H1 is *"Licensed Septic Tank Pumping for Music City Homes"* — which does not
contain "Nashville".

The keyword is carried by the `<title>`, the URL, and the article's own opening
paragraphs (*"…with septic tank pumping in Nashville typically running $275 to $525
per visit"*, inside the first 40 words). The QA gate encodes this single documented
exception rather than silently passing; every other page satisfies the rule in full.

If the constraint is ever lifted, changing the H1 to lead with "Septic Tank Pumping
in Nashville, TN" is the one edit that would close it.
