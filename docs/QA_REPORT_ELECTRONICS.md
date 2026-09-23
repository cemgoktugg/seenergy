# QA_REPORT_ELECTRONICS.md

Final review against `docs/design-os/14-final-qa-launch-bible.md` and
`15-master-audit-implementation.md`.

Severity levels are Module 14 §4: **P0** blocker · **P1** critical · **P2**
important · **P3** enhancement.

---

## 1. Gate results

| Gate | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | Pass, 0 findings |
| Types | `npm run typecheck` | Pass, strict + `noUncheckedIndexedAccess` |
| Tests | `npm run test` | **95 passing**, 6 files |
| Build | `npm run build` | Pass, 220 pages prerendered, 0 warnings |

No hydration warnings, no image warnings, no duplicate keys, no unexpected
dynamic rendering (Module 12 §113).

### Test coverage (Module 15 §38)

| File | Cases | Covers |
| --- | --- | --- |
| `tests/pricing.test.ts` | 9 | Currency format, derived discount, screen-reader price phrase, stock vocabulary, badge cap and priority, Turkish folding, slugs |
| `tests/variant.test.ts` | 12 | Resolution, id construction, availability narrowing across axes, variant price/stock, impossible-combination messaging, default variant |
| `tests/catalog.test.ts` | 25 | Category scope, query parsing and rejection of foreign facets, AND/OR filter semantics, price bands, sorting, option counts, filter/sort/show-more URL construction, chip labels, registry integrity |
| `tests/search.test.ts` | 11 | SKU and model exact match, brand match, multi-word AND, closed-up spellings, Turkish folding both directions, synonyms, grouping, limits |
| `tests/store.test.ts` | 16 | Cart merge/clamp/floor, reversible removal restoring position, compare category guard and cap, wishlist toggle, recently-viewed dedupe, search-history dedupe, empty server snapshot |
| `tests/catalog-integrity.test.ts` | 22 | Unique ids/slugs/SKUs, ASCII slugs, every reference resolves, variant ids match the resolver, discount badge matches its prices, alt text, unhappy fixtures present, schema emits no rating |

---

## 2. Performance (Module 12)

Production build, First Load JS as reported by Next.js:

| Route | Before the client-payload fix | After | Budget §5 |
| --- | --- | --- | --- |
| `/` | 174 kB | **129 kB** | ≤170 kB |
| `/kategori/[slug]` | 175 kB | **130 kB** | ≤170 kB |
| `/urun/[slug]` | 176 kB | **131 kB** | ≤170 kB |
| `/karsilastir` | 167 kB | **114 kB** | ≤170 kB |
| `/sepet` | 117 kB | **121 kB** | ≤170 kB |
| Shared baseline | 103 kB | 103 kB | React + Next runtime |

Measured after the visual pass, so these figures include the photographic mock
set: images are network payload, not JavaScript, and the routes above did not
move when the generated SVG artwork was replaced with `next/image`.

**Every route is inside the §5 budget.** The previous ECDOS build recorded
253–264 kB and flagged it as an accepted overage; this build clears it, and the
two decisions that made the difference are recorded below.

### Fixed during the audit — P1

**The catalogue was leaking into the browser bundle.** `searchCatalog`,
`productById` and `ProductGrid` were all reachable from Client Components, so
every page that mounted the header shipped all 78 products with their
descriptions, specification tables and compatibility data — the overfetch
§81 rules out, measured at ~45 kB per route. Three changes:

1. Search moved to `/api/arama`, with the request control §73 then requires:
   180 ms debounce, `AbortController` cancellation, ordering protection via a
   monotonic request id, and a two-character minimum. This is also what §103
   asks for at real catalogue scale.
2. Wishlist, compare and recently-viewed store a **listing snapshot** in
   `localStorage` rather than an id needing a client-side lookup table.
3. Comparison moved to a Server Component reading ids from `?urunler=`, so the
   full specification tables render on the server. A comparison is now also
   shareable as a link.

**A statically rendered route handler received no query string.** `/api/arama`
was declared `force-static`; Next prerendered it once with an empty `q` and
every search returned zero results while the unit tests passed. Caught by
exercising the running server, not the test suite — Module 14 §2's point about
production verification being its own gate. Now `force-dynamic`.

### LCP element per template (§96)

| Route | LCP element | Notes |
| --- | --- | --- |
| `/` | Hero banner photograph | The **only** `priority` image on the page; everything below it lazy-loads |
| `/kategori/[slug]` | H1 / first product row | First two cards eligible for `priority` |
| `/urun/[slug]` | Primary gallery frame | `priority`, stable 4:3 ratio reserved |
| Listing rows | First card image | `priority` on the first row only |
| `/blog/[slug]` | Article H1 | |

### Other performance decisions

- **No animation library.** All motion is CSS; overlay presence uses
  `transition-behavior: allow-discrete` on the scrim plus transform/opacity on
  the panel. The previous ECDOS build accepted ~56 kB of Motion for six
  overlays; those six are implemented here in `Overlay.tsx` in CSS (§50).
- **No carousel library.** Rails are `overflow-x` + `scroll-snap` (§63/§64).
- **No state-management library.** ~150 lines over `useSyncExternalStore`
  (§47).
- **Filtering ships zero client JavaScript.** Because filter state is in the
  URL, every control is an anchor — which also means filters work without
  JavaScript and survive a reload.
- **`optimizePackageImports` for `lucide-react`** so only used icons ship (§48).

---

## 3. Accessibility (Module 10)

### Verified

- One `<h1>` per page — asserted against the rendered HTML of `/`, `/urun/…`,
  `/iletisim` and `/toptan-satis`.
- Skip link is the first focusable element and targets `#main-content`.
- `<html lang="tr">`.
- Focus ring defined once as a token on `:focus-visible`; no component
  restyles it; an inverse ring exists for dark sections. `outline: none`
  appears nowhere.
- Focus is not obscured: `scroll-padding-top` and `scroll-margin-top` are both
  pinned to `--header-offset`.
- Every overlay (mobile menu, cart drawer, filter drawer, search) routes
  through one implementation with focus entry, a focus trap, Escape, scroll
  lock that preserves position, focus restoration, and `inert` while closed.
- Icon-only controls carry accessible names; cart and quantity controls name
  their product (§79/§80).
- Wishlist and compare expose `aria-pressed`, and the accessible name states
  the *current action*, not the current state (§31).
- Variant options are a labelled `radiogroup`; unavailable options are
  `disabled`, struck through, and carry an `aria-disabled` explanation (§40).
- Specification and comparison tables are real tables with `scope="col"` and
  `scope="row"`; the mobile spec layout restyles the same markup (§47).
- Colour is never the only signal: stock states name their count, badges carry
  words, the differences toggle shows a tick, filter rows show a check mark.
- Live regions are polite and singular — the toast rail announces once rather
  than four surfaces announcing the same event (§77).
- Reduced motion substitutes rather than deletes: translation becomes opacity,
  stagger collapses, scale is removed, announcement rotation stops.
- Touch targets: every interactive control is ≥44px; smaller visual marks nest
  inside a larger target.
- No `href="#"` anywhere; no positive `tabindex`; no arbitrary z-index.

### Not verified — P2, honestly stated

- **No screen-reader session.** Module 10 §103 asks for VoiceOver + Safari and
  NVDA + Chrome; neither is available in this environment, and §101 is explicit
  that automated tooling is not a substitute. Names, roles, states, focus order
  and live regions are correct by construction and by markup review, but
  announcement quality and verbosity are unverified.
- **No axe run and no browser-driven keyboard walk.** The build now drives the
  machine's installed Chrome through `playwright-core` (`scripts/shoot.mjs`), so
  the *visual* half of Module 14 §32 is covered — but no axe pass and no
  scripted keyboard journey (§107) were run. The keyboard path is implemented
  and reviewed, not machine-verified.
- **200% zoom not measured in a browser.** The layout uses no fixed-height text
  containers and no `100vh`, which is what breaks at zoom, but this is
  reasoning rather than observation.

---

## 4. Responsive (Module 09)

### Composition decisions

| Width | Product grid | Header | Filters |
| --- | --- | --- | --- |
| 320–359 | 1 column | Menü · Logo · Ara · Sepet, search on its own line | Full-screen drawer |
| 360–767 | 2 columns | same | drawer |
| 768–1023 | 3 columns | same | drawer |
| 1024–1279 | 2 with sidebar / 4 without | Three bands: utility · logo+search+actions · category nav | Sticky sidebar |
| 1280–1439 | 3 with sidebar / 4 without | same | sidebar |
| ≥1440 (`2xl`) | 3 with sidebar / **5 without** | same | sidebar |

Container caps at **1520px** (`min(100% - Xrem, 95rem)`), gutters stepping
32 → 48 → 64 → 80px. Breakpoints add `xs: 380`, move `2xl` to **1440** and add
`3xl: 1728` per §8 — Tailwind's stock 1536 `2xl` left every 1440 display
rendering the 1280 layout, which is what produced three wide category tiles
where nine were intended.

### Recorded tension — P3

**One column below 360px.** Module 09 §21 says 320–430 should be two columns;
Module 06 §19 says a mobile card must not fall below 150px. At 320px with 16px
gutters and a 12px gap, a two-column card measures 143px — the two rules
disagree, and an electronics card carries seven lines of text (brand, name,
model, rating, price, stock, shipping, action) where a fashion card carries
three. This build honours §19 below 360 and §21 from 360 up, which covers every
common phone (375, 390, 414, 430). Recorded rather than resolved silently.

### Verified in a browser

`scripts/shoot.mjs` drives the installed Chrome at **390 / 768 / 1366 / 1440**,
scrolls each page, forces every image eager, waits for all of them to report
complete, then measures `documentElement.scrollWidth` against `clientWidth` and
captures a full-page screenshot.

| Route | 390 | 768 | 1366 | 1440 |
| --- | --- | --- | --- | --- |
| `/` | ok | ok | ok | ok |
| `/kategori/[slug]` | ok | ok | ok | ok |
| `/urun/[slug]` | ok | ok | ok | ok |
| `/arama` | ok | ok | ok | ok |
| `/karsilastir` | ok | ok | ok | ok |
| `/sepet` | ok | ok | ok | ok |
| `/favoriler` | ok | ok | ok | ok |

**No horizontal overflow at any width on any route, and zero console messages.**
(The favicon 404 that the first sweep reported was real: `src/app/icon.svg` was
missing and is now in place.) The screenshots themselves were reviewed, and the
defects they exposed are in §7 below.

One note on the harness, because it produced a false alarm first: a
`fullPage` screenshot does **not** reliably trigger native lazy loading, so
below-the-fold images came out blank and looked like broken components. The
script was wrong, not the page. It now sets `loading = "eager"` on every image
and waits on `img.complete && naturalWidth > 0` before capturing.

### Not verified — P2

Only four of the ten widths Module 09 §6 lists were measured, and no landscape
or short-height pass was run (§92). Nothing in the build uses `100vh`,
fixed-height text containers or duplicated mobile/desktop DOM trees.

---

## 5. SEO and GEO (Module 13)

- Unique title and description on every route through one fallback chain; no
  page can output `undefined | VOLTA`.
- Canonicals never carry parameters.
- Cart, wishlist, comparison and search are `noindex, follow`, disallowed in
  `robots.txt`, and absent from the sitemap. Verified against the served files.
- Sitemap: 210 canonical URLs (home, listings, 94 categories, 78 products, 15
  brands, 12 guides, 8 static). No filter combination appears — filter state is
  UX state, not a landing page (§40–§42).
- JSON-LD: Organization + WebSite on every page, BreadcrumbList on category,
  product and article routes, Product + Offer on the PDP, TechArticle on
  guides. `availability` reads the same predicate the page renders — asserted
  in tests for both an in-stock and a sold-out product.
- **No rating or review field exists in the structured data.** The interface
  does show a mock star rating (see §8), but `ProductSEO` has no
  `aggregateRating` property, so the schema *structurally cannot* carry one, and
  a test asserts the serialised output contains no rating or review key (§29).
  This is the one place where a type, rather than a convention, enforces the
  rule.
- Product facts are explicit server-rendered HTML: brand, model, SKU, grouped
  specifications, compatibility, warranty — verified by asserting `12 V / 5 A`
  and `5,5 × 2,5 mm` appear in the served PDP markup (§59).
- Guides answer the question in the lead paragraph, before any explanation
  (§60).

### Not built — recorded decision

**Facet landing pages (§41).** Which facets have real search demand is a
merchandising and analytics decision that mock data cannot justify; §41's own
test — meaningful demand, sufficient products, unique content, stable business
value — is unanswerable here. The architectural half is in place:
`lib/catalog.ts` already resolves a facet to a product set, so a landing route
is a page file rather than a rebuild.

---

## 6. Commerce behaviour verified against the running server

| Check | Result |
| --- | --- |
| `PM-27447` returns exactly one product, first | Pass |
| `cat6 kablo` finds `Cat 6 U/UTP Kablo` | Pass (see below) |
| `trafo` → adapters via synonym | Pass, 14 results |
| `guc kaynagi` → `Güç Kaynağı` via folding | Pass, 19 results |
| `bluetooth mikrofon` requires both words | Pass |
| `zzzz` returns the no-result state, not a blank page | Pass |
| Filter link changes the result set and adds a chip | Pass |
| Chip remove control names its filter | Pass |
| Empty filter result offers recovery | Pass |
| Sort by ascending price leads with the cheapest | Pass |
| Comparison from URL renders full spec rows | Pass |
| Differences toggle hides identical rows and says how many | Pass |
| Category-aware filters do not leak across categories | Pass, both directions |
| 404 route returns HTTP 404 | Pass |

**Fixed during the audit — P1.** `cat6 kablo` returned nothing. The catalogue
writes standards the way the industry writes them (`Cat 6`, `RG6`, `USB-C`)
while customers type them closed up. The index now carries a separator-stripped
form alongside the normal one, so both spellings match. This was one of the
brief's own example queries.

---

## 7. Visual pass (master brief §52)

The brief is explicit that the design may not be declared complete from code
inspection. The rendered homepage was reviewed at all four widths and the
following were corrected from what the screenshots showed, not from what the
source said.

| Defect seen | Cause | Fix |
| --- | --- | --- |
| Product photos floated as small pictures inside white bands | Tiles used `object-fit: contain`, correct for cut-outs and wrong for the photographic mock set | Cards render `bleed` + `cover`; the PDP still contains |
| Two cards in "Öne Çıkan Ürünler" rendered blank | **Screenshot harness**, not the page — `fullPage` does not trigger lazy loading | Fixed the script, not the component |
| Every rating in a row read `5,0` / `4,9` | The homepage's second block sorted by rating, and `deriveRating` drew value and count from the same `hash % n`, locking them together | Value and count now come from different halves of the hash; the block orders by category round-robin instead |
| A band of empty white under the hero category rail | The rail showed 11 of 14 categories in a column as tall as the banner stack | All 14, distributed |
| Search occupied ~61% of the header | `flex-1` with no cap | Capped at 44rem — 51% at 1440, inside the brief's 40–50% band |
| "Haftanın Fırsatı" grew to almost a full screen | A narrow detail column grows tall and the photograph beside it grows with it | Detail column widened to 31rem, three key specs instead of four |
| The same studio monitor in three of eight "Ses Sistemleri" tiles | One photograph per `artKind` | `productPools` + round-robin assignment in `data/products.ts` |
| A street-lamp head on a 60 × 60 LED panel; a person's portrait on a microphone card | Photographs admitted to the set that misdescribe the product | Both removed from selection and the reason recorded in `images.ts` |
| "Marka" and "Model" appeared twice in the comparison table | Fixed rows and spec-table rows both contribute those labels | Spec labels the fixed rows already cover are skipped |

**Generated SVG product artwork was deleted.** `ProductArt` still rendered in the
cart, the cart drawer, the search results, the compare tray and the comparison
table — the "ugly generated SVG product boxes" §12 rules out, and its glyphs
were drawing from `--color-cobalt-*` tokens that no longer exist. All five call
sites now use `ProductThumb` over the real mock photography.

---

## 8. Unhappy fixtures (Module 14 §10)

The catalogue deliberately ships the states that are usually written but never
exercised, and tests assert they remain present:

- One sold-out product (`Cellmate MG-10`) — card, PDP and schema all handle it.
- Five low-stock products — the "Son N ürün" state uses the real count.
- One sold-out **variant** (`NV-512` 2 TB) — the disabled, struck-through,
  announced option state.
- One two-axis variant product (`LS-5050`) with a genuinely impossible
  combination (10 m × 4000 K) — the "mevcut değil" explanation path.
- Bulky-shipping products where the shipping statement differs.
- Products with no downloads, and downloads with no file (the "Yakında" state).

---

## 9. Deliberate omissions

Each of these is a decision with a reason, not an oversight.

**Star ratings are shown, and they are fabricated.** Master brief §44 permits
mock review data purely for visual design provided it is clearly marked in
source and never reaches structured data. Both conditions are met and are
described in `BRAND_BIBLE_ELECTRONICS.md` §9: the derivation carries a
`MOCK REVIEW DATA — VISUAL DESIGN ONLY` banner, the component repeats it, the
screen-reader text says *örnek veri*, and `ProductSEO` has no field that could
carry a rating into JSON-LD.

| Not built | Why |
| --- | --- |
| Dark mode | Module 05 §29 defines it as a complete remap with its own contrast matrix. Shipping an unverified one is worse than not shipping it. Every semantic token resolves through a primitive, so a `[data-theme="dark"]` block would repoint one layer. |
| Mobile bottom navigation | Module 07A §15 permits it only when repeated access justifies permanent screen space, and its conflict rules forbid it alongside a sticky purchase action, a full-screen drawer and a compare tray — all four of which exist here. It would cost 44px of every screen to duplicate two controls already within thumb reach. |
| Written reviews and testimonials | No real data exists, and invented prose attributed to named customers is not a design placeholder. There is no review body, no reviewer name and no review section anywhere. |
| Social links | VOLTA has no accounts. Four focusable anchors that navigate nowhere are what §28/§46 rule out. The `socialLinks` shape stays in `data/site.ts` so real handles rewire in one change. |
| Checkout | Out of scope. The cart ends at a stated demo boundary rather than a fake confirmation. |
| Parallax, page transitions, ambient video | All permitted by Module 11 and none built. The brand's motion rule — every animation names the usability problem it solves — rules out all three. |
| Real product photography | None exists. The build uses 49 CC0/CC-BY photographs under `/public/mock`, referenced from the single registry `src/data/images.ts`, with attribution in `public/mock/CREDITS.json`. Replacing them is an edit to one file plus the files on disk. |
| A rating **sort** or a review count **filter** | Both would present fabricated data as a ranking. Nothing customer-facing orders by rating. |

---

## 10. Remaining P2 items

1. **Screen-reader verification** — the one accessibility claim this build
   cannot make.
2. **axe and a scripted keyboard journey.** The Chrome harness now exists
   (`scripts/shoot.mjs`), so this is a script away rather than an install away.
3. **The remaining six Module 09 §6 widths**, plus landscape, short-height and
   200% zoom.
4. **Cross-browser** — nothing has run in Safari or Firefox; iOS Safari in
   particular differs on `svh`, `overscroll-behavior` and scroll-snap.
5. **`themeColor: "#ffffff"`** in `app/layout.tsx` is a raw hex. It is viewport
   metadata rather than a component style and cannot read a CSS custom
   property, but it does duplicate `--surface-base` and will need updating
   alongside it.
6. **Extended category content** (Module 13 §38) — category pages link three
   related guides below the grid rather than carrying their own long-form
   sections. Duplicating guide material into categories is a content decision
   with a duplication risk, so it is flagged rather than guessed at.
7. **Photograph coverage.** Seven `artKind`s share a photograph with another
   kind and eight have only one shot, so a large listing still repeats an image.
   The pooling in `data/products.ts` spreads what exists; it cannot invent more.
   Listed in `images.ts`, and resolved by real photography rather than by code.
