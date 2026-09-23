> **Superseded — previous project.**
>
> This file documents **SOIRA**, the premium lingerie storefront the ECDOS
> modules in `design-os/` were previously applied to. It does **not** govern
> this build and its brand, palette, typography, sizing and product rules are
> all contradicted by the electronics documentation.
>
> Kept for reference only. The governing documents for this project are:
> [`QA_REPORT_ELECTRONICS.md`](QA_REPORT_ELECTRONICS.md)
>
> Reusable ECDOS modules in [`design-os/`](design-os/) are unedited and remain
> the quality standard.

---

# Module 15 — master audit and implementation

Report in the §45 format. Every number below came from a command or a browser
run against the production build; nothing is estimated.

---

## 1. Repository assessment

**Stack.** Next.js 16.3.0 App Router with Turbopack, React 19.2, TypeScript 5.9
strict, Tailwind CSS v4 (CSS-first `@theme inline`), `motion/react` v12,
lucide-react, `next/font`, `next/image`. Frontend only — no backend, database,
payment provider, auth, CMS or external commerce API, and none was added.

**Architecture.** Server Components by default; client islands for wishlist,
quick add, filters, search, cart, toasts and the purchase panel. 99 routes
prerendered. Content lives in `/data` as typed mock data, pure logic in `/lib`,
shared types in `/types`. Persistence is `localStorage` behind a
`useSyncExternalStore` store, so nothing blocks server rendering.

**Strengths on arrival.** The Design OS modules 01–14 had already been adopted
and verified: tokens are semantic and contrast-checked, axe is clean across 23
routes at three widths, the keyboard journey completes end to end, structured
data matches the visible page, and the layout holds from 320px to 1728px
including 200 % zoom.

**Major initial risks.** Two were real and both sat in commerce logic. The cart
keyed lines on display text rather than a resolved variant, and the bra
selector kept a cup in state after a band change had invalidated it. A third —
no test stack at all — meant neither would have been caught by anything the
repository could run itself.

---

## 2. Findings summary

Counts are *found* → *remaining*.

```text
P0:  0 → 0
P1:  4 → 0
P2:  3 → 0
P3:  1 → 1   (query-string commas are percent-encoded; cosmetic, left alone)
```

---

## 3. Critical fixes completed

### P1-1 · A band change left an invalid cup selected

Selecting 75 then D, then switching the band to 70 — a size no product is cut
in — kept `D` in state while it disappeared from the grid. Three things
followed: the size resolved to `70D`, the page said "70D bedeni şu anda
tükendi" about a combination that was never offered, and the button read
"Sepete ekle" when no add could succeed. Nothing wrong entered the cart (the
add handler already validated), so this is P1 rather than P0 — but §7 Stage
3.4–3.6 requires the cup to be cleared with an explanation, and it was not.

*Now:* `reconcileCup` keeps a cup that is still valid, clears one that is not,
and words the two failures apart — "70 sırt bedeninde D kap **bulunmuyor**" for
a size the product does not carry, "…**şu anda mevcut değil**" for one that has
sold out. The CTA returns to "Beden seçin".

*Evidence.* Before: `cups ["A[x]","B","C"] · note "70D bedeni şu anda tükendi…"
· cta "Sepete ekle"`. After: `note "70 sırt bedeninde D kap bulunmuyor. Lütfen
başka bir kap seç." · cta "Beden seçin"`.

### P1-2 · Cart lines stored display labels, not a variant

The line id was `slug::Fildişi::75B` and the stored colour was the display
name. A copy change to a colour would have orphaned every stored line, and
`cartLineIssue` could only re-check the size — a colour withdrawn from a
product went unnoticed and the line kept rendering as purchasable.

*Now:* `lib/variant.ts` resolves a combination against the catalogue before it
has an id, and the id is `slug--colorSlug--size` from stable slugs only. The
cart stores `colorSlug` alongside the display name, `addToCart` refuses a
variant that does not resolve, and `cartLineIssue` re-resolves the whole
variant. Lines written under the old scheme are looked up and repaired on read
rather than dropped.

*Evidence.* Journey A now ends `line stored as a variant id —
essential-gunluk-sutyen--siyah--75A`; `parseCart` upgrades a legacy line to the
same id in test.

### P1-3 · Band and cup filtered independently

Filtering to band 70 **and** cup D returned ten products. None of them is made
in 70D: each merely had *some* 70 size and *some* D size. §13 lists band and
cup as separate facets, but they describe one garment measurement, and a
customer filtering to a size expects to be able to buy it.

*Now:* when both facets are active they are matched as a combination.

*Evidence.* `applyFilters(products, {sirt:['70'], kap:['D']})` → 0, while band
70 alone and cup D alone each still return products. A regression test asserts
every result of `75` + `D` actually carries an available 75D.

### P1-4 · The size calculator disagreed with the size guide

The published cup table is 12–13 → A, 14–15 → B, 16–17 → C, 18–19 → D, and its
own worked example says a 74cm back with a 14cm difference is 75B. The
calculator used a different system (A from 10cm in 2.5cm steps) and answered
75**C** for the same measurements. Two size systems on one site, one of them
contradicting the page it sits on.

*Now:* the calculator reads the published table — 2cm steps from 12cm, floored
so each printed range maps to one cup.

*Evidence.* `suggestBraSize(74, 88) → 75B`, matching the guide's example; the
journey test asserts the two agree.

### P2-1 · Four high-severity advisories in production dependencies

`npm audit --omit=dev` reported `postcss`, `sharp` and `nanoid` advisories
reachable through Next 16.2.12. Next 16.3.0 clears all of them and sits inside
the existing `^16` range.

*Evidence.* `npm audit` → `found 0 vulnerabilities`, production and dev.

### P2-2 · No test stack

`npm run test` did not exist, so none of the logic §38 names had automated
cover. Vitest (dev-only) now runs 74 cases across pricing, variant resolution,
bra combinations, cart lines and totals, the shipping threshold, URL filters,
storage parsing, search normalisation and catalogue integrity. Two of the P1s
above were found by writing those tests.

### P2-3 · The 90 back was not supported

§7 Stage 3 lists `90D`. `BAND_SIZES` stopped at 85, so the combination could
not be selected, filtered, suggested or bought.

*Now:* the system carries a 90 band; five support-led everyday styles are
ranged in it; the guide's band table gained the 88–92cm row; the calculator
reaches it instead of clamping at 85. Styles not cut in a 90 back simply do not
offer it — no invented stock.

### P3-1 · Left open

`buildQueryString` percent-encodes the comma between multi-value facets
(`?renk=siyah%2Cfildisi`). It round-trips losslessly and is valid; decoding it
would only be cosmetic, so it stays.

---

## 4. Design and UX improvements

Modules 01–14 had already settled the visual system, so this pass was
deliberately not a redesign — §4 asks for refinement over reinvention and the
existing language does not conflict with the documentation. What changed is
behavioural:

- **PDP.** The CTA now reads the resolved variant, so it cannot offer an add
  that will fail. The invalid-combination message names the band and the cup
  and distinguishes "not made" from "sold out".
- **Listing pages.** A band + cup filter returns only products purchasable in
  that size.
- **Size guide.** The calculator and the printed table give the same answer.
- **Mobile, cart, wishlist, search, navigation, homepage, product cards.**
  Audited against §8–§20 and unchanged: each already met the module. Journey F
  (drawer → category → product → sticky bar → cart) and Journey E (wishlist →
  quick add → cart) both complete.

---

## 5. Commerce logic improvements

| Area | Change |
| --- | --- |
| Variants | New `lib/variant.ts`: `resolveVariant`, `variantId`, `isPurchasable`, `offeredBands`, `offeredCups`, `reconcileCup` |
| Bra sizing | Band change reconciles the cup; 90 back added; calculator aligned to the guide |
| Selection state | New `useVariantSelection` hook shared by the purchase panel and quick add — §35 "centralized variant resolution" |
| Add to cart | Refuses anything that does not resolve to an available variant |
| Cart | Lines keyed on the variant id; colour stored as slug plus display name; issues re-checked against the whole variant |
| Persistence | `parseCart`/`parseSlugList` moved to `lib/cart.ts`; legacy lines repaired, unrepairable ones discarded, hostile quantities clamped |
| Price formatting | Unchanged and now pinned by tests: `₺1.190`, `₺12.999`, no decimals, no non-breaking space |

---

## 6. Accessibility improvements

No new violations were found in this pass — Module 14 had already cleared axe
across 23 routes at 390, 768 and 1440px, plus populated cart and wishlist and
two open overlays, and that remains clean on this build. What this pass added:

- The invalid-combination message is a `role="alert"`, so a cleared cup is
  announced rather than merely disappearing.
- The resolved size continues to be announced through the existing
  `aria-live="polite"` region.
- The §41 keyboard journey was re-run end to end on the new selection code:
  20 steps from skip link to checkout, including band, cup, combined-size
  announcement, quantity change, dialog focus trap over 40 tabs and focus
  restoration.

---

## 7. Performance improvements

No regression and no new work was warranted. Measured on the final build:

| Route | JS | CSS | Fonts | LCP | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 253.7 KB | 15.5 KB | 127.5 KB | 1148 ms | 0 |
| `/sutyen` | 264.9 KB | 15.5 KB | 127.5 KB | 1160 ms | 0 |
| `/urun/[slug]` | 264.9 KB | 15.5 KB | 127.5 KB | 784 ms | 0 |
| `/sepet` | 257.4 KB | 15.5 KB | 127.5 KB | 176 ms | 0.0055 |
| `/magazin` | 253.7 KB | 15.5 KB | 127.5 KB | 1700 ms | 0 |

LCP is an eagerly-loaded `next/image` on every content route. The variant
refactor moved logic into `lib/` and a hook, which cost roughly 0.4 KB of
client JS — the shared hook replaced two duplicated state machines. Console is
clean across five routes.

---

## 8. SEO improvements

Audited, no changes required. 21 routes carry unique titles, descriptions,
canonicals, Open Graph and Twitter metadata, one `h1` and `lang="tr"`. Utility
routes are `noindex, follow` and absent from the 91-URL sitemap. Canonicals
drop query parameters. PDP emits Organization, Product and BreadcrumbList; the
homepage emits Organization and WebSite with a `SearchAction`. Offer
availability derives from the same predicate the page renders. No rating,
review or aggregate fields anywhere. Product facts — support, padding,
underwire, material, fit, care — are present in server HTML with JavaScript
disabled.

---

## 9. Files changed

| File | Purpose |
| --- | --- |
| `lib/variant.ts` | **New.** Variant resolution, stable ids, band/cup vocabulary, cup reconciliation |
| `hooks/use-variant-selection.ts` | **New.** The single selection state machine both purchase surfaces use |
| `tests/commerce.test.ts` | **New.** Pricing, variants, bra sizing, cart lines, totals, threshold, catalogue integrity |
| `tests/catalog.test.ts` | **New.** URL filters, filtering and sorting, search normalisation, storage parsing |
| `vitest.config.ts` | **New.** Node environment, `@` alias, `tests/**` only |
| `lib/cart.ts` | `cartLineIssue` re-resolves the whole variant; `parseCart`/`parseSlugList` moved here and made testable |
| `lib/catalog.ts` | `matchesBand` + `matchesCup` replaced by `matchesBraSize`, which treats the pair as a combination |
| `lib/bra-size.ts` | Cup steps aligned to the published table (2cm from 12cm, floored) |
| `components/providers/store-provider.tsx` | `addToCart` takes a colour slug and resolves before storing; parsers imported from `lib/cart` |
| `components/commerce/size-selector.tsx` | Takes the product, uses the shared helpers, renders the reconciliation notice |
| `components/commerce/quick-add-dialog.tsx` | Adopts `useVariantSelection` |
| `components/product/product-purchase.tsx` | Adopts `useVariantSelection`; CTA reads the resolved variant |
| `types/cart.ts` | `id` is the variant id; `colorSlug` added beside the display colour |
| `data/products.ts` | `braSizes({ soldOut, extended })`; 90 back on five support styles |
| `data/size-guide.ts` | 88–92cm → 90 band row |
| `data/categories.ts`, `data/category-routes.ts`, `data/editorial.ts` | Size-range copy updated to 90D |
| `package.json` | Next 16.3.0, `test` / `test:watch` scripts, Vitest dev dependency |
| `docs/design-os/15-master-audit-implementation.md` | The module, verbatim |
| `docs/design-os/README.md` | Registry row, seven standing rules, four recorded decisions |

---

## 10. Verification evidence

Commands actually run, on the final build:

```text
npm run lint       — passed (eslint, no output)
npm run typecheck  — passed (tsc --noEmit, no output)
npm run test       — 74 passed (2 files)
npm run build      — passed, 99 static pages
npm audit          — found 0 vulnerabilities
npm audit --omit=dev — found 0 vulnerabilities
```

Browser passes against `next start`, Chrome via Playwright:

| Pass | Result |
| --- | --- |
| §7 Journeys A–F | 29 checks, all pass — including variant-id storage, back restoring filter + scroll + chips, and the sticky-bar add |
| §40 viewport matrix | 10 viewports × 8 routes + mobile menu, filter drawer, cart drawer, size guide — 0px horizontal overflow, nothing clipped outside a scrollable rail |
| §41 keyboard journey | 20 steps, skip link to checkout, no pointer |
| axe (WCAG 2.1 A/AA + best practice) | clean — 23 routes × 390/768px, 12 × 1440px, populated cart and wishlist, two open overlays |
| Layout sweep (Module 06) | 16 routes × 8 widths + 200 % zoom — clean |
| Motion, responsive, SEO, UX, component suites | Modules 07B/07C/07D/08/09/11/13 — clean |
| Module 14 QA passes | link crawl, corrupt storage, 20-line cart, orientation, slow network, secret scan — clean |
| Performance | table in §7 above; console clean |

---

## 11. Remaining limitations

**Frontend only.** Checkout is a labelled demo. There is no server-side
validation of price, stock or variant: the client is the only authority, which
is correct for this build and would not be for a real one.

**Mock data.** 61 typed products with placeholder imagery. Stock numbers,
delivery estimates, the free-shipping threshold and the promo codes are
configurable fixtures, not operational facts.

**Browser matrix.** Everything was measured in Chrome. Safari and Firefox were
not exercised, and iOS Safari matters most — `svh`, `overscroll-behavior` and
scroll-snap differ there, and the sticky purchase bar and mobile gallery are
where that would show.

**Screen readers.** Names, roles, states, live regions and focus order are
verified programmatically. No VoiceOver, NVDA or JAWS session has been run, so
announcement quality is unverified.

**Real devices.** Viewport emulation is not hardware. Touch accuracy, scroll
momentum and the on-screen keyboard's effect on sticky elements are unchecked.

**JavaScript budget.** Routes land at 253–265 KB against Module 12 §5's ~170 KB
target. Motion is retained for six `AnimatePresence` overlays where the exit
animation is what makes a dismissal legible. Removing it is a real reduction at
a real cost; it has not been taken.

**Photography.** Placeholder stock chosen for one art direction. Per-breakpoint
crops, a consistent model and styling language and true fabric macros need a
shoot. Every path is in `data/images.ts`.

**Interaction tests.** §38's interaction list is covered by Playwright against
the production build, not by a component-level harness. Those passes are what
found the defects in Modules 09–15, but they are not unit tests and do not run
under `npm run test`.

**Remaining P3.** The percent-encoded comma in multi-value filter URLs.
