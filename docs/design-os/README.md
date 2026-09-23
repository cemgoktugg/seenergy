# Luxury Commerce Design OS

Modules are delivered numbered and are the governing specification for this
project. They are stored here verbatim — do not paraphrase, summarise or edit a
module in place. If a module needs revision, replace the file with the new
version supplied.

## Modules

| Module | File | Status |
| --- | --- | --- |
| 01 — Brand Bible | `01-brand-bible.md` | Active |
| 02 — Visual Language | `02-visual-language.md` | Active |
| 03 — *(not yet received)* | — | Awaiting |
| 04 — Typography System | `04-typography-system.md` | Active |
| 05 — Color System | `05-color-system.md` | Active |
| 06 — Layout & Grid System | `06-layout-grid-system.md` | Active |
| 07A — Component Foundations & Navigation | `07a-component-foundations-navigation.md` | Active |
| 07B — Commerce Components | `07b-commerce-components.md` | Active |
| 07C — Forms, Filters, Search and Overlays | `07c-forms-filters-search-overlays.md` | Active |
| 07D — Editorial, Content and Trust | `07d-editorial-content-trust.md` | Active |
| 08 — UX Bible | `08-ux-bible.md` | Active |
| 09 — Responsive & Mobile Experience | `09-responsive-mobile-bible.md` | Active |
| 10 — Accessibility Bible | `10-accessibility-bible.md` | Active |
| 11 — Motion & Interaction | `11-motion-interaction-bible.md` | Active |
| 12 — Performance Engineering | `12-performance-engineering-bible.md` | Active |
| 13 — SEO & Discoverability | `13-seo-discoverability-bible.md` | Active |
| 14 — Final QA, Testing & Launch | `14-final-qa-launch-bible.md` | Active — report in [`../LAUNCH_READINESS.md`](../LAUNCH_READINESS.md) |
| 15 — Master Audit & Implementation | `15-master-audit-implementation.md` | Active — report in [`../AUDIT_MODULE_15.md`](../AUDIT_MODULE_15.md) |

## Standing rules extracted from the modules

These are the clauses that are violated most easily during day-to-day work, so
they are restated here and enforced in code where possible.

| Rule | Source | Enforced by |
| --- | --- | --- |
| Every animation must name the usability problem it solves | 01 · Motion Philosophy | Review; no ambient motion in the codebase |
| A markdown is never the loudest element on a page | 01 · Brand Personality | All product badges share one tone |
| One radius system — never mix values | 02 · Corner Radius | `--radius-xs` (2px) + `rounded-full` for pills only |
| One icon stroke width | 02 · Icons | `svg.lucide { stroke-width: 1.5 }` in `globals.css` |
| Shadows almost invisible, tokens only | 02 · Shadows | `--shadow-layer` / `--shadow-overlay` / `--shadow-float` / `--shadow-bar` |
| Remove a card border if usability survives | 02 · Cards | Tinted surfaces replace bordered boxes |
| Font sizes come only from the scale | 04 §8/§9 | `--font-size-*` tokens; no `text-[…]` in JSX |
| Components use semantic text classes | 04 §41 | `.text-display` … `.text-badge` in `globals.css` |
| Sentence case; uppercase never for emphasis | 04 §32 | `.text-button` sets no `text-transform` |
| Inputs ≥16px so mobile does not zoom | 04 §22 | All inputs `text-base` |
| One currency format | 04 §34 | `formatPrice()` is the only source |
| No unused font weights shipped | 04 §39 | Cormorant 400 only, two styles |
| No raw hex in components | 05 §42/§55 | Semantic tokens only; primitives live in `:root` and are never named from JSX |
| Semantic colour never used decoratively | 05 §14 | Success/warning/danger/info are reserved for state; `--promotion` carries markdowns |
| Current price stays neutral | 05 §16 | `Price` renders `--price-current` regardless of discount |
| Disabled controls stay readable | 05 §34 | `--disabled-*` tokens, never a blanket opacity |
| One overlay vocabulary | 05 §35 | `--overlay-scrim` / `--overlay-chip`; no inline `bg-ink/NN` |
| Focus ring is a token | 05 §23 | `--focus-ring*` on `:focus-visible`; components never restyle it |
| Colour is never the only signal | 05 §33 | Sold-out sizes strike + rule + `aria-disabled`; swatches ring + tick + `aria-checked`; stock states name the count |
| Stacking order is named, never numbered | 06 §46/§75 | `--z-base … --z-tooltip`; `.z-raised`/`.z-sticky`/`.z-header`/`.z-dropdown`/`.z-drawer`/`.z-modal`/`.z-toast`/`.z-skip-link` |
| Aspect ratios come from the token set | 06 §48 | `--ratio-*` + `.aspect-product`/`-portrait`/`-tall`/`-classic`/`-editorial`/`-wide`; no `aspect-<a>/<b>` in JSX |
| One product-grid definition | 06 §55 | `PRODUCT_GRID_CLASS` in `lib/layout.ts`, shared by the grid and its skeleton |
| Cards never fall below the §19 floor | 06 §17/§19 | `PRODUCT_GRID_COLUMNS.sidebar` holds the 4th column to 2xl when a filter rail shares the row |
| Percentage hotspots need a fixed frame ratio | 06 §40/§49 | Lookbook frame pinned to the photograph's native 4:3 |
| One gutter ladder, one section rhythm | 06 §10/§13 | `--gutter` 20/32/56/64; `.section-rhythm` 80/112/160 |
| No unused component variants or props | 07A §3.2/§6 | Every `Button` variant and prop has a call site; `loading` was removed rather than left dead |
| Dropdowns never open by accident | 07A §11 | 140ms hover-open delay on the mega menu; keyboard focus opens immediately |
| Interactive targets are ≥44px | 07A §13/§17 | Controls carry the target; a smaller visual mark nests inside |
| Destructive styling only for the irreversible | 07A §16 | Cart removal hovers neutral, not `--danger` |
| Announcement bar stays one line | 07A §9 | Copy is written to the 32–44px band, not the band stretched to the copy |
| Link and button labels name their destination | 07A §16/§18 | No "Devamı" / "Daha fazla" / "Tıkla" |
| One quick-add surface, not one per card | 07B §14 | `QuickAddProvider` mounts the dialog once; cards render only a trigger |
| Never auto-select a size | 07B §37 | Size state starts `null` on both the PDP and quick add |
| Guide before failure | 07B §2.3/§13 | The CTA reads "Beden seçin" until a size resolves |
| The combined bra size is stated, not assembled | 07B §9 | "Seçilen beden: 75B" beside the purchase action |
| A card answers the pointer in ≤260ms | 07B §3 | `--dur-card-media` 240ms, hover scale 1.02 |
| Toasts pause while hovered or focused | 07B §29 | Timer held on enter/focus, restarted on leave/blur |
| A toast never covers a sticky action | 07C §56 | The mobile buy bar publishes `--sticky-bar-height`; the toast rail reserves it |
| A placeholder shows the format, not the label | 07C §7 | `ornek@email.com`, never a repeat of the label text |
| A query can always be cleared | 07C §13 | Labelled "Aramayı temizle" in the overlay; the native control elsewhere |
| Filter options are ordered by customer need | 07C §23 | Kategori → Beden → Sırt → Kap → Renk → Kalıp → Destek → Fiyat |
| Every filter row is a ≥44px target | 07C §15 | The whole `label` row is the control, `min-h-11` |
| No link points at `#` | 07D §28/§46 | Dead social anchors removed; `socialLinks` waits for real handles |
| A return promise carries its exclusion | 07D §26/§38 | The hygiene rule is stated on the PDP and in the footer, not only in the FAQ |
| Consent copy links what it names | 07D §22 | The privacy policy is reachable from the sentence that invokes it |
| Footer groups collapse on mobile | 07D §46 | `details`/`summary`, open above `sm`, open in the no-JS HTML |
| No invented reviews, ratings or testimonials | 07D §30/§35/§55 | There is no review surface at all |
| Back from a product restores the listing | 08 §22 | Loaded page size lives in the query (`goster`), so scroll restoration has a page to restore to |
| A missing size moves the customer, not a message | 08 §39/§63 | Selector scrolled into view, first option focused, group outlined; both CTAs read "Beden seçin" |
| Cart removal is reversible | 08 §58 | `removeFromCart` returns a restore function; the toast carries "Geri al" |
| Size confidence has a tool, not just tables | 08 §46/§48/§49 | `BraSizeCalculator` in the size guide, worded as a starting point |
| Height is tested, not only width | 09 §6/§92 | 667×375, 812×375, 740×360 and 1280×600 are in the sweep |
| A viewport height is a floor, never a ceiling | 09 §24/§40 | The hero uses `min-height` only and sheds copy via the `short:` variant |
| A gallery states how many images there are | 09 §28 | Numeric counter beside the dot controls |
| Gutters follow the §9 ladder | 09 §9 | 16 / 20 / 32 / 56 / 64px, with the 16px step below 375 |
| The whole purchase journey runs on the keyboard | 10 §107 | `m10.mjs` walks homepage → nav → filter → variant → cart → checkout with Tab and Enter only |
| A control names what it acts on | 10 §79/§80 | Quantity and remove controls carry the product name |
| Every gallery view is described | 10 §25/§27 | Alt text is `product — view`, never empty on a real image |
| Never override an implicit role to add a label | 10 §112.15/§112.16 | `aria-labelledby` on the list, not `role="group"` |
| Five durations, four easings, no others | 11 §5/§6/§8 | `--duration-instant … -emphasis`, `--ease-standard/enter/exit/emphasis`; old names alias into them |
| Exits are faster than entrances | 11 §8/§42/§43 | Overlay and panel exits use `--ease-exit` at a shorter duration |
| Reduced motion substitutes, never deletes | 11 §82/§83 | Translation becomes opacity, stagger collapses, ambient motion stops — durations stay perceptible |
| Direct input is acknowledged inside 100ms | 11 §13 | Variant selection flips state before any transition completes |
| A product card is not a Client Component | 12 §54/§62 | Grid and card render on the server; wishlist and quick-add are the only islands |
| A fade does not justify hydration | 12 §50 | `.card-reveal` is CSS; Motion is reserved for presence and drag |
| Prices are never low-contrast text | 05 §11 | `--price-previous` is the secondary tone, which clears AA on tinted sections too |
| Schema states only what the page states | 13 §22/§27 | Availability reads the same predicate the PDP renders; no rating or review fields anywhere |
| Utility routes are noindex and out of the sitemap | 13 §17/§20 | Cart, wishlist and search: `noindex, follow`, absent from `sitemap.xml` |
| A canonical never carries parameters | 13 §16 | `/sutyen?utm_source=…&renk=siyah` → `https://soira.example/sutyen` |
| The catalogue carries unhappy fixtures | 14 §10 | One sold-out and one low-stock product, so those states ship exercised rather than merely written |
| Accessibility is checked at phone width too | 14 §32/§65 | axe runs at 390, 768 and 1440 — three violations existed only below `lg` |
| Every ARIA IDREF resolves | 14 §32 | `aria-controls` is dropped while the panel it names is unmounted |
| A link is named by its destination | 14 §32 | Media links carry an explicit label; a photo caption is not a link name |
| A cart line stores a resolved variant, not labels | 15 §7 Stage 2 | `lib/variant.ts` builds `slug--colorSlug--size`; the combination must exist before it has an id |
| Band and cup are one facet, not two | 15 §7/§13 | `70` + `D` returns nothing rather than every product with a 70 back *and* a D cup somewhere |
| A band change clears an invalid cup and says why | 15 §7 Stage 3.4–3.6 | Never substituted, never silently kept; "bulunmuyor" and "mevcut değil" are different facts |
| One state machine for variant selection | 15 §35 | `useVariantSelection` serves both the purchase panel and quick add |
| The size tools agree with the size guide | 15 §32 | The calculator reads the published cup table: 12–13 A, 14–15 B, 16–17 C, 18–19 D |
| Critical logic has automated cover | 15 §38 | `npm run test` — 74 cases over pricing, variants, bra sizing, cart, filters, storage, search |

## Precedence

When two documents disagree, the higher entry wins:

1. **`docs/design-os/01-brand-bible.md`** — permanent brand identity. Module 01
   states explicitly that it takes priority over any conflicting document.
2. Later Design OS modules (02, 03, …) — for the specifics they cover, provided
   they do not contradict Module 01.
3. `CLAUDE.md` — product scope and engineering rules for this build.
4. `docs/DESIGN_SYSTEM.md`, `docs/UX_SPEC.md`, `docs/IMPLEMENTATION_PLAN.md` —
   implementation-level detail.
5. `.claude/skills/premium-fashion-ui/SKILL.md` — working process.

Module 01 governs **identity**: values, personality, voice, colour philosophy,
motion philosophy, quality standard. It describes a "modern premium fashion
brand" generally; this build is the premium lingerie, underwear, sleepwear and
loungewear specialisation of it, and that product scope continues to live in
`CLAUDE.md`. The specialisation adds constraints — it never relaxes Module 01.

## Recorded decisions

Where a module offers an example rather than a requirement, the choice made
here is written down so the next pass does not relitigate it.

**Token vocabulary (05 §42–§48).** Module 05 illustrates its architecture with
names like `surface-base`, `text-primary` and `border-default`. This build
already had an equivalent role-based vocabulary in place — `--background`,
`--surface`, `--surface-subtle`, `--foreground`, `--muted-foreground`,
`--border` — used at roughly two hundred call sites. §42's actual requirement is
that components name a *role* rather than a hex, and §48's is that the name
describes the role rather than the appearance; both were already satisfied.
Renaming would have been a large mechanical diff with regression risk and no
user-facing gain, so the existing names were kept as the semantic layer, the
primitive layer was added beneath them, and every missing role was filled in.
The equivalence is:

| Module 05 example | This build |
| --- | --- |
| `surface-base` | `--surface` |
| `surface-subtle` / `surface-muted` | `--surface-subtle` |
| `surface-inverse` | `--ink` |
| `text-primary` | `--foreground` |
| `text-secondary` | `--muted-foreground` |
| `text-tertiary` | `--subtle-foreground` |
| `text-inverse` | `--background` (on `--ink`) |
| `border-default` | `--border` |
| `border-strong` / `border-interactive` | `--border-strong` / `--foreground` |
| `action-primary-*` | `Button` variants over `--foreground` / `--accent` |

**Dark mode (05 §29).** Not built. §29 is explicit that a dark theme is a full
remap of surfaces, text, borders, controls, imagery, shadows, focus rings and
semantic colours — and §30 adds that product photography needs its own handling
so garment colour stays accurate. This storefront has dark *sections* (§28),
which is a different thing and is tokenised. Building an untested theme nobody
asked for would add a second colour surface to maintain and a second contrast
matrix to verify. The architecture is ready for it: every semantic token
resolves through a primitive, so a `[data-theme="dark"]` block would only need
to repoint the semantic layer.

**Breakpoints (06 §8).** §8 recommends `xs 375 · sm 480 · md 768 · lg 1024 ·
xl 1280 · 2xl 1440 · 3xl 1728`. This build keeps Tailwind's `sm 640 / 2xl 1536`
and adds only `xs 430`, for two measured reasons. `2xl 1536` is load-bearing:
the catalogue's fourth column is held until `2xl`, and at 1440 a fourth column
measures 222px, which fails §19's 240px floor — moving the breakpoint to 1440
would reintroduce the defect it was added to fix. No `3xl` exists because
nothing recomposes past 1600px: the container caps at 1560 and the last gutter
step is a media query, so a breakpoint there would satisfy §8 while changing
nothing, which §8 itself forbids ("do not add breakpoints without a real
compositional need").

**Spacing tokens (06 §6/§7).** No parallel `--space-*` ladder was added.
Tailwind v4's `--spacing` base is already the 4px scale §5 asks for, and every
utility in the codebase resolves through it; a second ladder would be a
synonym, not a system, and §62 explicitly warns against piling on custom
spacing values. The semantic layer §7 describes exists where it earns its
keep — `.section-rhythm` for section gaps, `PRODUCT_GRID_CLASS` for grid gaps,
`--gutter` for page gutters.

**Layout primitives (06 §64/§65/§66/§67).** `Container` and `Section` exist;
`Stack`, `Cluster`, `Split`, `SidebarLayout`, `Bleed`, `AspectRatio` and
`StickyPanel` do not. In a Tailwind codebase `flex flex-col gap-6` *is* the
stack and `flex flex-wrap items-center gap-3` *is* the cluster; wrapping them
in components adds a prop API and an indirection without removing a single
decision. The primitives worth having here are the ones that encode a
*decision* rather than a CSS shorthand, and those are in place: the container
tiers, the section rhythm, the grid definition and the ratio utilities.

**Component folders (07A §5).** §5 suggests `ui/ layout/ navigation/ commerce/
editorial/ forms/ feedback/ overlays/`. This build uses `ui/ layout/ commerce/
catalog/ cart/ product/ editorial/ home/ search/ wishlist/ providers/`, which is
the same idea cut by domain rather than by widget kind — the rule §5 actually
states is "avoid placing every component in one folder without categorization",
and navigation lives in `layout/`, overlays and feedback in `ui/` and
`providers/`. Moving eleven folders to match an example list would churn every
import path in the app for no change in what anyone can find.

**Mega menu open behaviour (07A §12).** Hover opens the panel after 140ms and
keyboard focus opens it immediately, but a *click* on a top-level item navigates
to that category page rather than opening the panel. §12 prefers click-to-open;
this build keeps the link because every top-level item is a real destination and
the panel's contents are all reachable from the page it leads to. The rule §12
is protecting — "do not create hover-only access" — is met through focus. The
gap worth knowing about: a coarse pointer at ≥1024px (a large tablet in
landscape) gets the link, never the panel. Below 1024 the mobile drawer covers
that case.

**Currency placement (07B §6).** §6's Turkish examples put the symbol last
(`2.490,00 ₺`). This build renders `₺2.490`, which is what
`Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })` actually
produces — the symbol leads in the tr-TR CLDR data. Both orders appear in
Turkish retail, so the deciding rule is §6's own "use one format consistently"
plus CLAUDE.md's "prices must use `tr-TR` locale", and `formatPrice()` in
`lib/format.ts` remains the single source. The compact form (no `,00`) is the
brand-approved display §6 permits.

**Invalid bra combinations (07B §9).** §9 says to clear an invalid cup
selection after a band change *and* explain it. This build explains and keeps
the selection: it names the combination that is unavailable and invites a
different band or cup. §9 also forbids silently changing a selected size, and
in practice the cup a customer picked is usually the one they want — clearing
it costs them the information about *which* pairing failed. The unavailable
state is never selectable: the cell is `disabled` with a strike-through and a
diagonal rule, and the CTA will not resolve a variant that does not exist.

**Search debounce (07C §13/§46/§73).** No debounce. Both §13 and §73 are about
*expensive* work — network requests per keystroke, stale responses arriving out
of order. Search here is a synchronous `useMemo` over 61 local products with no
request to cancel, so a 150–300ms delay would add latency and nothing else. If a
remote index ever backs this, §73's full set — debounce, cancellation, ordering
protection, minimum query length — has to come with it.

**Toast position (07C §56).** §56 suggests top-right or bottom-right on desktop;
this build uses bottom-left. The cart drawer occupies the right edge and its own
actions sit at the bottom of that panel, so a bottom-right toast would land on
top of the checkout button it was announcing. Bottom-left keeps both visible.

**Newsletter field height (07C §6).** 56px against a recommended 44–52. It is
paired with a `size="lg"` submit button, which 07A §16 puts at 52–56, and the
two must share a height to sit on one line. The overlap of the two bands is a
single value (52px), reachable only by shrinking the button to the bottom of its
own range. The field is above the recommended maximum rather than below the
minimum, so nothing about it is hard to hit; it is left matched to its button.

**Reviews and social proof (07D §30–§36).** Not built, and deliberately so.
CLAUDE.md forbids inventing reviews, ratings, awards or certifications, and
§30/§35 agree — invented ratings are only permissible when clearly labelled as
mock content. Rather than ship a labelled-fake review block, the storefront has
no review surface at all: the trust it offers is the operational kind §2.3 asks
for (delivery timing, return conditions with their exclusions, size guidance,
payment methods, a support path). §34's no-review state does not apply because
there is no rating UI to be empty. When real review data exists, §30–§34 define
what to build.

**Social links (07D §46).** Removed rather than left pointing at `#`. SOIRA is
an original label with no accounts, and four focusable anchors that navigate
nowhere are exactly the inactive channels §28 and §46 rule out. The `socialLinks`
shape stays in `data/site.ts` with a note, so real handles can be dropped in and
rewired into the footer and mobile menu in one change. This is a reversible
choice, not a deletion of the design.

**Add-to-cart feedback: toast, not drawer (08 §40).** §40's preferred sequence
ends with the cart drawer opening. This build shows a toast with a "Sepeti gör"
link and leaves the customer where they were. §75 in the same module ranks
inline → toast → drawer → modal and says to choose *the least disruptive method
capable of communicating the result*; a toast confirms the addition, updates the
count and offers the cart without taking the product page away. 07B §21 allows
either ("drawer opens **or** compact confirmation appears"). The drawer remains
one tap away from the header and from the toast.

**Colour change does not reload the gallery (08 §33).** §33 asks that changing
colour update the gallery. It cannot here: `data/products.ts` holds one image set
per product, not per colour, so there is no second gallery to swap to. Swatch
selection updates the named colour, the resolved variant and the cart line
correctly. Closing this properly means per-colour imagery in the data model, not
a UI change — it is a photography and data gap, the same one Modules 01 and 02
already record.

**Cart variant editing (08 §57/§99).** Not built. §57 phrases it as "should
ideally", and the honest position is that this is a real gap rather than a
decision: editing size or colour in place needs the quick-add variant surface
rebound to an existing line and a re-resolve on save. Today a customer removes
the line and re-adds — which, since §58 landed, is at least reversible in one
tap. Flagged rather than quietly skipped.

**Adjacent variant targets (09 §17).** §17 asks for an 8px gap between small
actions. Colour swatches and size cells sit flush: each target is a full 44px,
and the row is a single radio group where the next target *is* the next option.
Separating them would open dead strips inside one control and widen the visible
rhythm past what the design carries. The rule is aimed at unrelated actions
placed close together; these are one control with adjacent segments.

**Mobile art direction (09 §26/§62).** Not implemented — every campaign image
uses one source with a tuned `object-position`. §26 wants a separate mobile crop
where the desktop framing fails, and the honest position is that this needs the
shoot to provide portrait crops, not a code change. `data/images.ts` is the one
file that would carry them. This is the same photography gap Modules 01 and 02
already record, seen from the responsive side.

**Screen-reader testing (10 §103).** Not done. §103 asks for VoiceOver+Safari and
NVDA+Chrome; this environment has neither, and §101 is explicit that automated
tooling is not a substitute. What *is* verified is everything a machine can
check — the §107 journey end to end on the keyboard, accessible names, live
regions, focus trapping and restoration, roles and states — and the semantics
those depend on. A real screen-reader pass on the PDP variant flow and the cart
remains outstanding, and is the one accessibility claim this build cannot make.

**Background inertness (10 §61).** Dialogs rely on a focus trap plus
`aria-modal="true"` rather than `inert` on the page behind them. §61's stated
requirement — background content must not remain keyboard-accessible — is met by
the trap, verified at 40 consecutive tabs inside the size guide, and
`aria-modal` is the ARIA mechanism that tells assistive tech to ignore the rest.
`inert` would be an improvement for older AT; it needs the overlays hoisted out
of the layout tree first.

**Header height on scroll (11 §36).** §36 says to avoid changing header height
during scroll because it destabilises layout. This header does compress, by
8–16px depending on breakpoint. The instability §36 is protecting against was
addressed before it appeared: `--header-height` and `--header-offset` are
separate tokens, and every sticky offset in the storefront is pinned to the
*compressed* value, so nothing beneath the customer moves while the header
animates. The change is a height transition on one fixed element, not a reflow.

**Scroll listener (11 §88).** §88 prefers Intersection Observer to raw scroll
handlers. The header's scrolled state uses a passive `scroll` listener through
`useSyncExternalStore`, whose snapshot is a single boolean (`scrollY > 24`).
React only re-renders when that boolean flips, so the per-event cost is one
property read and no layout work — which is what §88's rule exists to prevent.
The mobile buy bar, which needs element geometry, does use an Intersection
Observer.

**No parallax, no page transitions, no ambient video (11 §34/§68/§35).** All
three are permitted by the module and none are built. The Brand Bible's motion
philosophy — every animation must name the usability problem it solves — rules
out the first and third, and §68 warns page transitions must never delay
navigation. Their absence is a decision, not an omission.

**JavaScript budget (12 §5) — over, and by how much.** §5 prefers ≤170KB
compressed initial JS. Measured on production builds with a cold cache: **253KB
on the homepage, 264KB on catalogue and product pages**. The breakdown is
roughly 69KB React DOM, ~56KB Motion across two chunks, and the rest framework
runtime plus application code. Motion stays because §50 names drawer, presence
and drag as exactly its appropriate uses, and six overlays here depend on
`AnimatePresence` for exit animation that CSS cannot express. Closing the gap
means hand-writing presence for all six, which trades a known-good
implementation for bespoke code — a call worth making deliberately rather than
in passing. The number is recorded so a future decision starts from a
measurement, not a guess.

**Client-side filtering (12 §103/§12).** §103 prefers server or query-based
filtering "for real catalog scale". Filtering here runs client-side over 61
local products, which keeps every one of the 99 routes statically prerendered —
a property §11 values and §12 protects ("do not make an entire route dynamic
because one small region changes"). Reading `searchParams` on the server would
make each catalogue route dynamic. The cost is visible and measured: under 4×
CPU throttling the catalogue page's total blocking time is 688ms against 262ms
on the product page. At a real catalogue size the trade flips.

**SEO landing pages for facets (13 §41).** Not built. §41 suggests dedicated
routes such as `/siyah-sutyen` or `/dantelli-sutyen` where a facet has real
search demand. Which facets qualify is a merchandising and analytics decision,
not one this build can invent — §41's own test is "meaningful search demand,
sufficient products, unique content, stable business value", and none of those
are knowable from mock data. What is in place is the half that *is* an
architectural decision: filter combinations stay out of the sitemap, canonicals
ignore parameters, and `lib/catalog.ts` already resolves a facet to a product
set, so a landing route is a page file rather than a rebuild.

**Extended category content (13 §38).** Category intros are short by design
(§37: 50–150 words, no wall above the products). The longer educational
sections §38 places *after* the grid are not there; the same material currently
lives in `/magazin` and `/beden-rehberi`, which §55's content-cluster model also
supports. Moving or duplicating it into category pages is a content decision
with a duplication risk, so it is flagged rather than guessed at.

**Image file names (13 §48).** Product imagery is served from remote stock
assets whose filenames are opaque IDs. §48 qualifies its own rule — "when asset
workflows allow meaningful naming" — and this one does not. Alt text carries the
description instead, and `data/images.ts` is the single file where real,
well-named assets would land.

**Unused semantic families.** `--success-soft/-strong`, `--warning-soft/-strong`
and `--danger-soft/-strong` have no call site yet. §13 requires all four
families to exist with soft/default/strong variants, so they are defined and
contrast-checked; because they are declared through `@theme inline`, the unused
ones add nothing to the CSS bundle.

**Sold-out ranking (14 §10).** The catalogue now contains a sold-out product.
No module requires unavailable items to sort last, and 08 §"Unavailable
products may remain visible with status" only requires that they stay legible,
so the sort keys were left alone. Sinking sold-out items is a merchandising
decision, not a spec one.

**Corrupt storage is tolerated, not scrubbed (14 §70).** A malformed
`soira:cart:v1` renders the empty cart with no console error and is overwritten
by the next write. The bad value is left in place until then: it is already
unusable, and deleting storage the user did not ask us to delete is the more
dangerous default.

**Browser matrix (14 §65).** Every pass in this repository runs against
installed Chrome through Playwright. Safari and Firefox — and iOS Safari in
particular, where `svh`, `overscroll-behavior` and scroll-snap differ most —
have not been exercised. That is a real gap, not a resolved one.

**Screen-reader testing (14 §32).** Names, roles, states, live regions and
focus order are verified programmatically (axe plus the accessibility tree via
CDP). No VoiceOver, NVDA or JAWS session has been run, so announcement quality
and verbosity remain unverified.

**Band and cup wording (15 §7 Stage 3).** The module's example groups are
"Bant ölçüsü" and "Kup ölçüsü". The storefront has said "Sırt bedeni" and "Kap
bedeni" since Module 07B, in the selector, the size guide, the filters and the
schema. Both are correct Turkish for the same measurement; §32 asks for one
vocabulary across the site, so the existing pair stays and the new messages
match it.

**The 90 back (15 §7 Stage 3).** `90D` is on the module's list, so the size
system carries a 90 band. It is not applied to every style — claiming a band a
product is not cut in would be inventing stock. Five support-led everyday
shapes are ranged in it (`extended: true` in `data/products.ts`), which is how
an extended back grade is normally ranged, and the guide's band table gained
the matching 88–92cm row.

**Test stack (15 §38).** There was none, so §38's "use the project's existing
test stack" had nothing to use. Vitest was added as a dev dependency — it does
not reach the client bundle — and covers exactly the list §38 prioritises.
Interaction testing continues to run through Playwright against the production
build rather than a component harness; those two overlap less than they appear
to, and the browser passes are what caught the defects in Modules 09–15.

**Dependency advisories (15 §7 Stage 1).** `npm audit` reported four high
severity advisories in Next's transitive `postcss`, `sharp` and `nanoid`. Next
16.3.0 clears all of them and is inside the existing `^16` range, so the minor
bump was taken rather than pinning overrides.

## Applying a module

1. Read the module in full before changing code.
2. Audit the current build against it and write down real conflicts.
3. Fix the conflicts; do not invent adjacent work.
4. Re-run `npm run lint`, `npm run typecheck`, `npm run build` and the
   verification passes described in `CLAUDE.md`.
5. Record what changed and any remaining tension between the module and the
   build.
