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

# Launch readiness — SOIRA

Produced against Design OS Module 14 (Final QA, Testing & Launch Bible),
§102 audit order, §107–§115 gates, §116 QA rules and the §117 self-review.

Measured on the **production build** (`next build` → `next start`), Chrome via
Playwright, at 320 / 360 / 375 / 390 / 430 / 768 / 1024 / 1280 / 1440 / 1728 px
plus 200 % zoom and three landscape sizes.

Build under test: 99 prerendered routes, 61 products, 91 sitemap URLs.

---

## Summary

Nine defects were found and fixed. Five of them were only reachable at phone or
tablet width, because until this pass automated accessibility checking had run
at desktop width only. Nothing outstanding is classified P0 or P1.

| Severity | Found | Fixed | Open |
| --- | --- | --- | --- |
| P0 — blocks launch | 0 | — | 0 |
| P1 — breaks a journey or fails WCAG A/AA | 4 | 4 | 0 |
| P2 — degrades quality | 5 | 5 | 0 |
| P3 — polish | 0 | — | 0 |

Separately, four **limitations** are disclosed at the end. They are not defects;
they are things this environment cannot prove.

---

## Findings

### P1-1 · Size radiogroup had no accessible name on every XS–XL product

`components/product/product-purchase.tsx` passed `labelId="pdp-size"` to
`StandardSizeSelector`, which set `aria-labelledby="pdp-size"` — but no element
carried that id. The bra branch labels its own two subgroups, so the defect was
invisible on the product usually opened for testing.

*Evidence.* Accessibility tree via CDP, before: the group on
`/urun/elara-tul-bralet` resolved `aria-labelledby` to `null`. After: the
heading `Beden seçimi` carries the id and the group is named.
Every ARIA IDREF on 25 routes × 2 viewports + 2 open overlays now resolves.

### P1-2 · The mobile product gallery could not be operated by keyboard

The swipeable gallery is a `<ul class="overflow-x-auto">` whose slides are
images — no focusable content, and the container itself was not focusable, so a
keyboard user could not scroll it (WCAG 2.1.1). axe:
`scrollable-region-focusable` on every PDP below `lg`.

*Fix.* The scroller takes `tabIndex={0}` and `aria-label="{ürün} görselleri"`.
The dot controls below it remain.

*Evidence.* Focus lands on `UL` "Luna Dantelli Balkonet Sütyen görselleri" with
a 2 px solid ring; `ArrowRight` scrolls 0 → 390 px and the live counter moves to
"Görsel 2 / 3".

### P1-3 · Heading order broke below `lg` on every catalogue route

The only `<h2>` on a listing page lived inside the filter sidebar, which is not
rendered under `lg` (it moves into a bottom sheet). The outline therefore went
`h1` → `h3` on phones and tablets. Same shape on a populated `/favoriler` at all
widths.

*Fix.* The results are a named section: a visually-hidden `<h2>` in
`catalog-view.tsx` and `wishlist-view.tsx`.

*Evidence.* axe `heading-order` on 8 routes at 390 px and 11 at 768 px before;
zero after, across 23 routes × 2 viewports plus populated cart and wishlist.

### P1-4 · Unnamed link in the tab order on the cart page

The cart line's thumbnail link took its accessible name from the photo's alt
text, and got none at all when a line's product had no image — axe `link-name`.

*Fix.* `aria-label="{ürün adı} ürün sayfasına git"`, matching the product card.

### P2-1 · No sold-out product in the catalogue (Module 14 §10)

Minimum stock across 61 products was 6, and every product had at least one
available size. The "Tükendi" card plate, the disabled purchase panel, the
`OutOfStock` schema branch, the size-filter exclusion and the cart's
unavailable-line guard were therefore written but never exercised by real data.

*Fix.* `elara-tul-bralet` is now stock 0 with every size unavailable.

*Evidence.* Card on `/bralet` renders the label and a subdued image;
`/bralet?beden=M` excludes it; the PDP shows "Şu anda stokta yok", a disabled
"Tükendi" CTA, all five sizes `aria-disabled`, and
`availability: https://schema.org/OutOfStock`. A forced click on a sold-out cup
leaves `aria-checked=false` and the previous valid selection intact.

### P2-2 · No low-stock product (Module 14 §10)

`LOW_STOCK_THRESHOLD` is 5; nothing in the catalogue was at or below it, so the
"Son N adet" line could not appear.

*Fix.* `noor-saten-bustiyer` is now stock 3.

*Evidence.* PDP shows "Son 3 adet" in `--stock-low` (5.9:1 on surface,
4.9:1 on the tinted section) while schema stays `InStock`.

### P2-3 · Sold-out cards were not visually subdued

Module 07B asks for a subdued image *as well as* the explicit label. Only the
label was present. Verifiable for the first time once P2-1 gave the site a
sold-out product.

*Fix.* `opacity-65 saturate-[0.8]` on the media link — the label plate is a
sibling, so it keeps full contrast.

### P2-4 · Magazine image links were named after the photograph

Each magazine card has two links to the same article. The image link's
accessible name came from the alt text — "Omuz ve askı detayı" — which does not
identify the destination.

*Fix.* `aria-label="{başlık} yazısını oku"`, matching the product-card pattern.

### P2-5 · `aria-controls` pointed at unmounted panels

Mega-menu panels and accordion panels mount only while open, so the triggers
referenced element ids that were not in the document. Present on every route
(the header) and on the PDP and `/hakkimizda` accordions.

*Fix.* `aria-controls` is set only while the panel is open; `aria-expanded`
carries the state either way.

---

## Gates

### §107 Build

`npm run lint` clean · `tsc --noEmit` clean · `next build` compiles and
prerenders 99 routes. No `any` in application code. No console output on five
representative routes.

### §108 Functional

| Check | Result |
| --- | --- |
| Required routes (CLAUDE.md list) | 21/21 → 200 |
| Custom not-found | `/kesinlikle-yok` → 404 with the branded page |
| Invalid product / collection / article | 404 |
| Internal link crawl | 100 internal hrefs from 91 sitemap pages, 92 distinct targets, **0** broken, 0 `#` placeholders |
| Back / forward with filters | `/sutyen` 24 → `?renk=siyah` 22 → back 24 → forward 22, URL restored |
| Load-more and return | 12 → 16 cards, `?goster` in the URL, 16 restored on back at the same scroll position |
| Rapid interaction | Three add-to-cart clicks → one line, quantity 3, no errors |

### §109 Commerce

| Check | Result |
| --- | --- |
| Cart arithmetic | 20 lines × 2 × ₺1.190 → ₺47.600 shown; no `NaN`, `undefined` or `₺0` |
| Large cart layout | 20 lines render, 0 px horizontal overflow |
| Bra combinations | Band 70 offers A(sold out)/B/C; band 85 offers B/C/D(sold out); switching band keeps a valid cup and re-announces "Seçilen beden: 85B" |
| Invalid variant | Forced click on a disabled cup is ignored — `aria-checked=false`, selection unchanged |
| Failed add | Focus moves to the band group, `role="alert"` explains what is missing |
| Remove and undo | Line removed, undo offered, line restored at its original index |
| Persistence | Cart, wishlist and recently-viewed survive reload; the rail excludes the product being viewed and needs two others before it renders |

### §110 Responsive

16 routes swept at eight widths plus 200 % zoom — no horizontal overflow, no
clipped content, no overlapping controls. Landscape 667×375, 812×375, 740×360
and 1280×600: hero fits, both CTAs visible without scrolling. Orientation change
mid-session keeps the selected size and the route. Gutters resolve 16 px at
320–374, 20 px from 375. Mobile rail item is 47 % of the viewport with
`snap-x mandatory`.

### §111 Accessibility

axe-core (WCAG 2.1 A/AA + best practice) — **clean** on 23 routes at 390 px and
768 px, 12 routes at 1440 px, plus populated cart and wishlist and two open
overlays. Keyboard journey of 20 steps from skip link to checkout passes,
including filter application, colour and size selection, live-region
announcements, quantity controls, dialog focus trap over 40 tabs and focus
restoration. Every ARIA IDREF resolves; no duplicate ids; every control has an
accessible name (verified through the accessibility tree, not `textContent`).

### §112 Performance

| Route | JS | CSS | Fonts | LCP | CLS |
| --- | --- | --- | --- | --- | --- |
| `/` | 253.3 KB | 15.5 KB | 127.5 KB | 1156 ms | 0 |
| `/sutyen` | 264.5 KB | 15.5 KB | 127.5 KB | 1168 ms | 0 |
| `/urun/[slug]` | 264.5 KB | 15.5 KB | 127.5 KB | 1084 ms | 0 |
| `/sepet` | 256.9 KB | 15.5 KB | 127.5 KB | 712 ms | 0.0055 |
| `/magazin` | 253.3 KB | 15.5 KB | 127.5 KB | 816 ms | 0 |

LCP is an eagerly-loaded `next/image` on every content route. Product grid and
card are Server Components; the client islands inside a card are the wishlist
button and the quick-add trigger. On a throttled 400 kbps / 400 ms connection
the PDP shows its title, price and CTA at DOMContentLoaded.

JS remains **83–94 KB above** Module 12 §5's target. See limitations.

### §113 SEO

21 routes: 21 unique titles, all with description, canonical, Open Graph and
Twitter metadata, exactly one `h1`, `lang="tr"`. `/sepet`, `/favoriler` and
`/arama` are `noindex, follow` and absent from the sitemap; commerce routes are
`index, follow`. Canonicals drop query parameters. PDP emits Organization,
Product and BreadcrumbList; the homepage emits Organization and WebSite with a
`SearchAction`. Offer availability is derived from the same predicate the page
renders — verified in both directions now that a sold-out product exists. No
rating, review or aggregate fields anywhere. Product facts are present in
server HTML with JavaScript disabled.

### §114 Content

No lorem ipsum, no `TODO`/`FIXME`, no `#` links, no placeholder copy in shipped
text. Prices use `tr-TR` and `₺`. Turkish copy reads naturally. No invented
reviews, ratings, certifications, awards or sustainability claims. Size guidance
is non-medical and hedged ("başlangıç noktası"). Returns copy is qualified and
links to the policy.

### §115 Launch

Frontend-only as specified: no backend, database, payment provider, auth, CMS or
external commerce API. Checkout is explicitly a non-functional demo. 849 KB of
client script scanned for credential patterns — no matches.

---

## §117 self-review

| Question | Answer |
| --- | --- |
| Production build tested | Yes — every number above |
| Every required route inspected | Yes — 21 required, 99 prerendered, 91 in sitemap |
| Main journeys tested | Browse → filter → PDP → variant → cart → checkout; search; wishlist |
| Mobile and desktop tested independently | Yes — and the difference is where four of nine defects were |
| Short viewport heights | Yes — four landscape sizes |
| Keyboard navigation and focus | Yes — 20-step journey, trap, restoration |
| Standard sizes, bra combinations, invalid variants | Yes |
| Cart totals | Yes — 1-line and 20-line |
| Persistence | Yes — including corrupt-storage recovery |
| Empty states | Yes — filtered listing, search, wishlist, cart; each offers a way forward |
| Errors | Yes — 404s, corrupt storage, failed add |
| Slow loading | Yes — 400 kbps / 400 ms |
| Metadata, robots, sitemap | Yes |
| Image performance and client boundaries | Yes |
| Findings classified, blockers first, re-tested, evidence given | Yes |
| Limitations disclosed | Below |

---

## Limitations

**Browser matrix.** Everything here was measured in Chrome. Safari and Firefox
were not exercised, and iOS Safari matters most — `svh`, `overscroll-behavior`
and scroll-snap behave differently there, and the sticky purchase bar and the
mobile gallery are the two places most likely to differ.

**Screen readers.** Names, roles, states, live regions and focus order are
verified programmatically. No VoiceOver, NVDA or JAWS session has been run, so
how the announcements actually *sound* — verbosity, ordering, interruptions —
is unverified.

**JavaScript budget.** Module 12 §5 targets ~170 KB; routes land at 253–265 KB.
Motion is retained for six `AnimatePresence` overlays (cart drawer, mobile menu,
filter sheet, size guide, quick add, toasts) where an exit animation is what
makes a dismissal legible. Removing it is a real reduction available at a real
cost; it has not been taken.

**Photography.** All imagery is placeholder stock chosen for one consistent art
direction. Art direction proper — per-breakpoint crops, a consistent model and
styling language, true fabric macro shots — needs a real shoot. Every path lives
in `data/images.ts` so replacement is a single-file change.

**Real-device testing.** Viewport emulation is not a device. Touch accuracy,
scroll momentum, and the on-screen keyboard's effect on sticky elements have
not been checked on hardware.
