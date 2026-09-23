# MERTER INTERACTION MAP

Measured interaction and animation behaviour of **https://www.merterelektronik.com/**.

A still screenshot cannot tell you whether an element moved, how far, how long it
took or what curve it used. None of it is inferable from a PNG. Every entry below
was produced by driving the live page with Playwright — scrolling it, hovering it,
typing into it, clicking its tabs, sampling it over time — and reading
`getBoundingClientRect()` / `getComputedStyle()` before and after. Screenshots are
attached as **evidence of state**, not as the source of the timing numbers.

This is evidence, not opinion. Where a value was not measured it says
**not measured**. Nothing here is filled in from intuition.

Raw data:

* `reference-analysis/measurements/reference-interactions.json`
* `reference-analysis/measurements/reference-detail.json`
* `reference-analysis/measurements/reference-detail2.json`

Evidence images: `reference-analysis/interactions/`.

Consistent with `docs/MERTER_REFERENCE_BLUEPRINT.md` §7 and §8, which summarise
this file for implementation.

**How to regenerate**

```
node scripts/visual/interaction-probe.mjs   # scroll / nav hover / search / slider / tabs / card hover / drawer
node scripts/visual/detail-probe.mjs        # mega-menu columns, card hover, tab pills, hero dots
```

Probe runs recorded in this document: `2026-08-18T10:49:52Z` (interaction-probe),
`2026-08-18T10:53:48Z` and `2026-08-18T10:54:38Z` (detail-probe).

---

## 1. Header on scroll

**There is no scroll behaviour.** The header is `position: static` and is scrolled
off the page like any other block.

| Sample | scrollTop | `top` | Height | `position` | `box-shadow` | `transform` |
| --- | --- | --- | --- | --- | --- | --- |
| At top | 0 | 0 | **175** | `static` | `none` | `none` |
| Scrolled down | 1200 | −1200 | **175** | `static` | `none` | `none` |
| Scrolled back up | 700 | −700 | **175** | `static` | `none` | `none` |

`isSticky: false`. `heightChanged: false`. `stickyPart: null` at all three
positions — the probe looked for a separately-pinned sub-bar and found none.
Declared `transition: all` (no duration, so nothing animates).
Background reads `rgba(0, 0, 0, 0)` at all three positions.

* **Trigger** — none. Scroll produces no state change.
* **Direction** — not applicable; the header translates with the document only.
* **Duration** — not applicable.
* **Easing** — not applicable.
* **Delay** — not applicable.
* **Exit behaviour** — not applicable; no state is entered.
* **Evidence** — `ref-header-top.png`, `ref-header-scrolled.png`, `ref-header-scrollup.png`
  (three identical 175px headers, differing only in what is behind them).

> **Conclusion: do not implement a sticky header.** No condensed bar, no shadow
> on scroll, no height change, no hide-on-scroll-down/show-on-scroll-up.

---

## 2. Navigation hover → mega menu

Hovering a top-level nav item opens a **full-width, five-column mega menu**
directly under the 175px header. Four categories were probed.

### Panel

| Property | Measured value |
| --- | --- |
| Selector | `div.menu-wrap` |
| Box | x=**20**, y=**174**, width **1400** |
| Height | varies by category: **114 / 210 / 234** |
| `position` | `absolute` |
| `z-index` | `6` |
| Background | `rgb(255, 255, 255)` |
| `border-radius` | `0px 0px 10px 10px` |
| `box-shadow` | `rgba(0, 0, 0, 0.16) 0px 3px 6px` |
| `padding` | `0px 20px` |
| `opacity` when open | `1` |
| `transform` | `none` |
| Declared transition | `all` (no duration) |

### Columns

**5 columns**, each **220px** wide, first at x=**170**, pitch **220**
(170 / 390 / 610 / 830 / 1050), all at y=185, height 188.

| Element | Size / weight | Colour |
| --- | --- | --- |
| Column heading | `15px / 500`, line-height 15px | `rgb(255, 146, 0)` |
| Column link | `13px / 400`, line-height 19px | `rgb(83, 83, 83)` |
| Link line pitch | **24px** | — |

Link counts observed per category: **31, 22, 13, 29**
(panel heights 210 / 210 / 114 / 234 respectively).
Per-column link counts in the sampled category: 7 / 8 / 8 / 5 / 3.

> Measurement conflict, resolved in favour of the targeted probe:
> `interaction-probe` records `columns: 1` for this panel — its generic column
> counter did not recognise the column elements. `detail-probe` measures five
> boxes at x=170/390/610/830/1050, each 220 × 188, each with its own orange
> heading. **Five columns** is the correct reading.

### Trigger

| State | Background | Colour |
| --- | --- | --- |
| At rest | transparent (`rgba(0,0,0,0)`) | `rgb(255, 255, 255)` |
| Hover | `rgb(255, 255, 255)` | `rgb(255, 176, 89)` |

Trigger box 78 × 22, `12px / 600`, `padding: 0px 5px`, `border-radius: 0px`.

* **Trigger** — pointer hover on a top-level nav item.
* **Direction** — panel appears in place, anchored to y=174 (the header baseline)
  and to the left container edge at x=20. `transform: none` — it does **not**
  slide or scale in.
* **Duration** — trigger colour/background **100ms**. Panel: no duration declared
  (`transition: all` with no time component).
* **Easing** — trigger `ease-in-out`. Panel: not measured.
* **Delay** — none declared on the trigger transition. Any hover-intent delay
  before opening: **not measured**.
* **Exit behaviour** — **not measured.** The probe captured the open state only;
  no close timing or close direction was recorded.
* **Evidence** — `ref-nav-0-open.png`, `ref-nav-1-open.png`, `ref-nav-2-open.png`,
  `ref-nav-3-open.png`, `ref-megamenu-open.png`.

---

## 3. Search

| Property | Measured value |
| --- | --- |
| Input box | x=**457**, y=**61**, **612 × 41** |
| Placeholder | `Arama` |
| `border-radius` | `21px 0px 0px 21px` (left-rounded; the submit button closes the pill) |
| `border` | `0px none` |
| Background | `rgb(255, 255, 255)` |
| `font-size` | **16px** |
| Declared transition | **`0.3s`** |

**On focus:** `box-shadow: none`, `outline: rgb(125,125,125) none 3px` — the
outline style is `none`, so there is **no visible focus outline or shadow change**.

**On typing `kamera`:** a suggestion panel appears.

| Property | Measured value |
| --- | --- |
| Selector | `div.ticimax-search-content.sTemp2` |
| Box | x=**457** (aligned to the field), y=**102** (immediately below), **661 × 600** |
| Background | `rgb(255, 255, 255)` |
| `border-radius` | **18px** |
| `box-shadow` | `rgba(0, 0, 0, 0.4) 0px 6px 10px` |
| Items | **26** |

* **Trigger** — keystrokes in the search field (focus alone produced no visible change).
* **Direction** — panel opens downward from the field, left edges aligned at x=457.
  It is **wider than the field** (661 vs 612).
* **Duration** — field transition **300ms**. Panel appearance duration: not measured.
* **Easing** — not measured.
* **Delay** — debounce before the panel appears: not measured.
* **Exit behaviour** — not measured.
* **Evidence** — `ref-search-typing.png`.

---

## 4. Hero slider

| Property | Measured value |
| --- | --- |
| Box | x=**60**, y=**185**, **1320 × 423** |
| `border-radius` | **10px** |
| Slides | **5** |
| Pagination dots | **5**, **12 × 12**, `border-radius: 100%`, `rgb(187, 187, 187)`, `margin: 0px 3px` |
| Dot position | y=**405** — *inside* the slider box, not below it |
| Arrows | **0** |
| Autoplay interval | **5000ms** |
| Stage transition | **0.8s**, timing `ease` |

Autoplay was sampled for 16 seconds. Slide changes at
**814 / 5806 / 10815 / 15815 ms** → deltas of 4992 / 5009 / 5000 ms. The stage
advances by a horizontal `translateX` (a transform of
`matrix(1, 0, 0, 1, -2640, 0)` was captured mid-run — two slide widths of offset).

Measured active-dot style is identical to the inactive style
(`rgb(187,187,187)`, width 12); no distinct active-dot treatment was captured.

> Measurement conflict, resolved in favour of the targeted probe: the generic
> `div.owl-carousel.owl-theme` match in `interaction-probe` reported
> **6 dots, 2 arrows** and a stage transition of **`0s`**. That selector matches
> more than the hero (the page carries other Owl carousels, and Owl clones
> slides), so its counts and its mid-transition `0s` read are unreliable.
> `detail-probe`, which targets the hero box at x=60 y=185, reports **5 dots,
> 0 arrows, `0.8s` `ease`** in two independent runs. The 5000ms autoplay figure
> is unaffected — it comes from timestamp sampling, not from the selector.

* **Trigger** — autoplay (unattended), plus pagination-dot click.
* **Direction** — horizontal, stage translates on the X axis.
* **Duration** — **800ms** per slide transition.
* **Easing** — `ease`.
* **Delay** — **5000ms** dwell between transitions.
* **Exit behaviour** — continuous loop; the outgoing slide translates out on the
  same 800ms `ease` stage move. No fade, no separate exit timing.
* **Evidence** — `ref-hero-slide-a.png`, `ref-hero-slide-b.png`.

> **Zero arrows.** Do not add previous/next controls.

---

## 5. Product tabs

Labels: **Haftanın Ürünleri**, **Yeni Ürünler**, **Çok Satanlar**.

| Property | Measured value |
| --- | --- |
| Strip | x=**60**, **1320 × 48** |
| Pills | **3**, each **432 × 48**, gap **8** |
| Pill x positions | 64 / 504 / 944 |
| `border-radius` | **10px** |
| Active | background `rgb(248, 158, 30)`, colour `rgb(255,255,255)`, `14px / 700`, class `ticimaxTabHead_active` |
| Inactive | background `rgb(221, 221, 221)`, colour `rgb(0,0,0)`, `14px / 400`, no class |
| Declared transition | `all` |
| Panel | **5 columns × 3 rows = 15 products** |

Switching tabs swaps the active class and **re-renders the panel**. No slide, no
crossfade, no height animation, no stagger.

> Measurement conflict, recorded rather than resolved: `detail-probe` reads the
> pill transition as `all`, while `interaction-probe` reads the same pills as
> `background 0.1s ease-in-out, color 0.1s ease-in-out` — the shorthand used by
> the nav triggers and buttons. Either way the pill colour change is fast or
> instant; the panel swap is not animated. Do not build a slow tab transition on
> the strength of the `all` reading.

* **Trigger** — click on a pill.
* **Direction** — none. The panel content is replaced in place.
* **Duration** — pill colour/background: declared `all` with no duration. Content
  swap: no transition measured.
* **Easing** — not measured.
* **Delay** — not measured.
* **Exit behaviour** — the outgoing panel is removed, not animated out.
* **Evidence** — `ref-tab-before.png`, `ref-tab-after.png`.

---

## 6. Product card hover

**This is the most important record in this document, and it was initially
mis-measured.** A generic "find a card" selector picked up a promotional tile
rather than a real product card and reported *no change on hover* — no shadow, no
revealed button, `changed: {}`. That null result is still what sits in the
`cardHover` block of all three JSON files. The corrected measurement targeted
`.productItem` filtered to elements that actually contain a price, and it shows a
clear hover state. **Use the corrected values below; treat the `cardHover` blocks
in the JSON as a known bad sample.**

| | At rest | On hover |
| --- | --- | --- |
| `box-shadow` | `none` | **`rgba(0, 0, 0, 0.16) 0px 3px 10px`** |
| `.mycartIcon` | `opacity: 0` | **`opacity: 1`, `display: flex`, 233 × 44** |
| Brand + favourite row | visible | **covered** by the cart bar |
| Card height | **357** | **357** — unchanged |
| `transform` | `none` | no scale, no translate, no tilt |

The revealed element is a full-width orange **"Sepete Ekle"** bar that sits *over*
the brand/favourite row. It does not push layout: the card is 357px tall in both
states, so the grid never reflows on hover.

**Quantity steppers are never shown.** `.urunListeAdet`, `.qtyMinus`, `.qtyPlus`
and `.txtSepetAdet` are `display: none` in **both** states, on the homepage **and**
on the category page `/guvenlik-sistemleri`.

* **Trigger** — pointer hover anywhere on the card.
* **Direction** — the cart bar reveals over the brand/favourite row (a cover, not
  an append). The card itself does not move.
* **Duration** — **300ms** on the revealed bar. The button's own colour change is
  **100ms**.
* **Easing** — bar: not declared beyond the `transform 0.3s, opacity 0.3s`
  shorthand (no timing function given → browser default `ease`). Button:
  `ease-in-out`.
* **Delay** — none declared in either transition shorthand.
* **Exit behaviour** — the transition is declared on the element itself, so it
  applies symmetrically on un-hover; no separate exit duration was measured.
* **Evidence** — `ref-card-A-default.png`, `ref-card-B-hover.png`.
  (`ref-card-default.png` / `ref-card-hover.png` and
  `ref-product-default.png` / `ref-product-hover.png` are from the earlier, bad
  sample — do not use them as evidence of "no hover change".)

Declared transitions in full:

```
revealed cart bar   transform 0.3s, opacity 0.3s
button              background 0.1s ease-in-out, color 0.1s ease-in-out
```

---

## 7. Mobile drawer

Measured at the **390 × 844** viewport.

| Property | Measured value |
| --- | --- |
| Trigger | `div.mobile-menu-item.mobile-item-button`, x=10, y=14, **19 × 22** |
| Panel | `div.newHeaderNav`, x=**0**, y=**0**, **390 × 844** |
| Width | **390** — the full viewport width, edge to edge |
| Background | `rgb(255, 255, 255)` |
| `transform` when open | `none` |
| Declared transition | `all` (no duration) |
| Links | 388 |

* **Trigger** — tap the hamburger button.
* **Direction** — not measured. `transform: none` in the open state, so the probe
  captured no slide offset; the entry direction was not recorded.
* **Duration** — not measured (`transition: all` carries no time component).
* **Easing** — not measured.
* **Delay** — not measured.
* **Exit behaviour** — not measured.
* **Evidence** — `ref-mobile-menu-closed.png`, `ref-mobile-menu-open.png`.

---

## 8. Timing summary

| Interaction | Duration | Easing | Delay |
| --- | --- | --- | --- |
| Hero autoplay dwell | **5000ms** | — | — |
| Hero slide transition | **800ms** | `ease` | — |
| Card hover reveal (`transform`, `opacity`) | **300ms** | not declared | none |
| Search field | **300ms** | not declared | none |
| Nav trigger background / colour | **100ms** | `ease-in-out` | none |
| Button background / colour | **100ms** | `ease-in-out` | none |
| Mega-menu panel open | not measured | not measured | not measured |
| Search suggestion panel | not measured | not measured | not measured |
| Tab content swap | none (re-render) | — | — |
| Mobile drawer | not measured | not measured | not measured |

These are **five distinct durations** — 5000 / 800 / 300 / 300 / 100 — carrying
different jobs. **Do not collapse them onto a single shared duration token.** A
100ms button hover and an 800ms hero transition are not the same value expressed
twice.

---

## 9. Implementation rules derived from these measurements

**Do not:**

1. Add a sticky, condensed, hide-on-scroll or shadow-on-scroll header. The
   reference header is `position: static` at a constant 175px. Measured.
2. Add previous/next arrows to the hero. Arrow count is **0**.
3. Add quantity steppers to the product card. They are `display: none` in both
   states, on both page types.
4. Invent 3D tilt, parallax, scroll-reveal, stagger-in, magnetic buttons, or any
   scroll-linked motion. None of it exists on the reference at any measured
   scroll position, and none of it appears in any declared transition.
5. Scale, translate or lift the card geometrically on hover. The card is 357px
   tall before and after; only the shadow and the revealed bar change.
6. Animate the tab panel. Content switches by re-render — no slide, no crossfade.
7. Collapse the timings into one token. Keep 5000 / 800 / 300 / 100 distinct.
8. Give the mega menu an entry transform. `transform: none` — it appears anchored
   in place at y=174.

**Do:**

1. Reproduce the card hover as a **cover-the-brand-row reveal** — an absolutely
   positioned 233 × 44 bar over the existing brand/favourite row, transitioning
   `transform` and `opacity` over 300ms — not as an appended button that changes
   the card's height.
2. Add the hover shadow `rgba(0, 0, 0, 0.16) 0px 3px 10px` to the card, and keep
   `box-shadow: none` at rest.
3. Build the nav panel full-width (1400 at the 1440 viewport), 5 columns × 220px
   at pitch 220 starting x=170, radius `0 0 10px 10px`, shadow
   `rgba(0,0,0,0.16) 0px 3px 6px`, `z-index: 6`.
4. Keep hero autoplay at 5000ms dwell / 800ms `ease` transition, with 5 pagination
   dots at 12 × 12 positioned **inside** the slider at y=405.
5. Keep trigger and button colour transitions at 100ms `ease-in-out` — fast enough
   to feel like a state change rather than an animation.
6. Open the mobile drawer to the full viewport width (390 at the 390 viewport).
7. Where this document says **not measured**, either measure it before building it
   or choose a defensible default and mark it as a declared deviation — do not
   record a guess here as if it were evidence.
