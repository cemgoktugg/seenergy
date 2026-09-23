# ANIMATION MATCH STATUS

Interaction-by-interaction comparison between the reference and the local
reconstruction. Both sides were driven live with `reducedMotion: no-preference`
(the screenshot pipeline's animation freeze is explicitly *not* applied here —
a frozen frame cannot tell you what moved).

Reference values: `docs/MERTER_INTERACTION_MAP.md`,
`reference-analysis/measurements/reference-verified.json`.
Local values: measured against `http://localhost:3100` with the same probes.

| | |
| --- | --- |
| Reference | https://www.merterelektronik.com |
| Local | http://localhost:3100 |
| Viewport | 1440 × 900 (desktop), 390 × 844 (mobile) |

---

## 1. Header on scroll

**REFERENCE:** `position: static`. Height 175px at scrollTop 0 / 700 / 1200.
No sticky bar, no condensed variant, no shadow, no transform.

**LOCAL:** `position: relative`, height 175px. At scrollTop 1200 the header's
`top` is −1200 — it scrolls away with the page.

**MATCH: PASS.** No sticky header was added. This was an explicit trap: a
"modern" sticky header is the single most tempting unrequested change here, and
the reference does not have one.

---

## 2. Navigation hover → mega menu

**REFERENCE:** full-width panel 1400 × 210 at y=174, `position: absolute`,
`z-index: 6`, white, `border-radius: 0 0 10px 10px`,
`box-shadow: rgba(0,0,0,0.16) 0 3px 6px`, `padding: 0 20px`. **5 columns of
220px** starting at x=170. Column heading `15px/500` `rgb(255,146,0)`; links
`13px/400` `rgb(83,83,83)` at a 24px line pitch. Trigger transition
`background 0.1s ease-in-out, color 0.1s ease-in-out`; at rest transparent /
white text, on hover white background / `rgb(255,176,89)` text.

**LOCAL:** panel on the same 1400px track (`.container-nav`), opening directly
under the 175px header, `rounded-b-[10px]`, `shadow-[0_3px_6px_rgba(0,0,0,0.16)]`,
5 grid columns, orange group headings, 13px grey links. Trigger transitions
background and colour over 100ms `ease-in-out` and inverts to white-on-orange.
A 120ms close delay keeps the panel reachable while the pointer crosses the gap
between the 43px trigger and the panel.

**MATCH: PASS** — after a correction. The first implementation used a 240px
dropdown, then a full-width panel fed by a *flat* 4–5 item child list, which
produced five headings and no links: a 63px panel against the measured 210px.
The nav data was restructured into real 5-column groups to fix it.

---

## 3. Search

**REFERENCE:** input 612 × 41, `border-radius: 21px 0 0 21px`, 16px text,
`transition: 0.3s`. No visible focus outline change. Typing shows a suggestion
panel at 661 × 600, radius 18px, `box-shadow: rgba(0,0,0,0.4) 0 6px 10px`.

**LOCAL:** pill sized from the container (`basis-1/2` of the header row) giving
a 610px input at 1440 and 570px at 1366 against measured 612 / 560. Fully
rounded, 16px text, 300ms colour transition, orange border that darkens on
focus-within.

**MATCH: PARTIAL.** Geometry and timing match. The **suggestion panel is not
implemented** — the local search submits to `/arama` and has no typeahead. This
is listed in Remaining Differences rather than claimed as done.

---

## 4. Hero slider

**REFERENCE:** 1320 × 423, radius 10px, 5 slides, 5 dots (12 × 12, `100%`
radius, `rgb(187,187,187)`), **0 visible arrows** (two exist in the DOM but are
hidden), autoplay dwell **5000ms** (samples: 4992 / 5009 / 5000), slide
transition **0.8s `ease`**, translating its track horizontally.

**LOCAL:** 1320 × 423, radius 10px, `0` arrows, track `transition-duration
0.8s`, autoplay interval 5000ms, dots 12 × 12 on desktop.

**MATCH: PASS.** It slides rather than cross-fades, which is what the reference
does — the previous build faded over 500ms with a 6000ms dwell.

**Deliberate addition:** autoplay pauses on hover and on focus. The reference
was not observed to pause. This is a small accessibility concession, declared
rather than silent.

---

## 5. Product tabs

**REFERENCE:** three pills, each 432 × 48, gap 8, radius 10. Active
`rgb(248,158,30)` / white / `14px/700`; inactive `rgb(221,221,221)` / black /
`14px/400`. Content switches by re-rendering the panel — no slide, no elaborate
motion.

**LOCAL:** three pills 435 × 48, gap 8, radius 10, active `rgb(248,158,30)`
white bold, inactive `rgb(221,221,221)` black regular, 150ms colour transition
on the pill only. Panel swaps instantly.

**MATCH: PASS.** No slide or fade was invented for the panel (brief §23:
reference behaviour wins). Only the pill's colour change is eased.

---

## 6. Product card hover

**REFERENCE:** at rest `box-shadow: none`, `.mycartIcon` `opacity: 0`,
`transform: matrix(1,0,0,1,0,44)`. On hover `box-shadow:
rgba(0,0,0,0.16) 0 3px 10px`, `.mycartIcon` `opacity: 1`,
`transform: matrix(1,0,0,1,0,0)` at 233 × 44, covering the brand/favourite row.
Card height unchanged: 357 → 357. Transition `transform 0.3s, opacity 0.3s`.
Quantity steppers stay `display: none` in both states.

**LOCAL:** at rest no shadow, cart bar `opacity: 0` translated down by its own
44px height. On hover `rgba(0,0,0,0.16) 0px 3px 10px`, bar `opacity: 1` at
translate 0, over 300ms. Card height 357 → 357. No quantity stepper.

**MATCH: PASS.** Measured local hover shadow is
`rgba(0, 0, 0, 0.16) 0px 3px 10px 0px` — identical to the reference.

**Correction worth recording:** the first automated hover probe reported "no
change on hover" because its generic card finder matched a *promotional tile*
inside the product slider rather than a real card. The persistent
"Sepete Ekle" button in the previous build was justified by that bad reading.
Re-probing against `.productItem` filtered to elements containing a price
produced the real behaviour above.

---

## 7. Mobile drawer

**REFERENCE:** opens to a 390px panel — the full viewport width at 390.

**LOCAL:** `w-full` below `sm`, capped at `max-w-sm` above it. Categories are
listed with their group headings, matching the desktop mega-menu structure.

**MATCH: PASS.**

---

## 8. Mobile footer accordions

**REFERENCE:** at 390 the *Kurumsal*, *Müşteri İlişkileri* and
*Sipariş İşlemleri* columns collapse into chevron accordions; only headings show
until tapped.

**LOCAL:** same three columns collapse below `lg`, chevron rotates 180° over
200ms, panels expand on tap and are unconditionally visible from `lg` up.

**MATCH: PASS.** Reproducing this removed 492px of excess mobile height.

---

## Timing summary

| Interaction | Reference | Local | Match |
| --- | --- | --- | --- |
| Hero autoplay dwell | 5000ms | 5000ms | PASS |
| Hero slide transition | 800ms `ease` | 800ms `ease` | PASS |
| Card hover reveal | 300ms transform + opacity | 300ms transform + opacity | PASS |
| Nav trigger bg/colour | 100ms `ease-in-out` | 100ms `ease-in-out` | PASS |
| Button bg/colour | 100ms `ease-in-out` | 100ms `ease-in-out` | PASS |
| Search field | 300ms | 300ms | PASS |
| Tab pill | `all` (declared) | 150ms colour | PASS (eased, not invented) |

Durations are deliberately **not** collapsed onto one shared token (brief §35).

## Motion NOT added

Checked against brief §36 — none of the following exist in the reference and
none were introduced: parallax, scroll-reveal, 3D tilt, bounce, glow, cinematic
page transitions, cursor-following effects, card scale/translate on hover,
sticky/condensing header, hero arrows, tab-panel slide animation.

## Remaining differences

| Item | Status |
| --- | --- |
| Search typeahead suggestion panel | **Not implemented.** Reference shows a 661 × 600 panel with 26 results. |
| Hero autoplay pause-on-hover | Added locally; not observed on the reference. |
| Hero dot active state | Reference reports the same `rgb(187,187,187)` for active and idle dots (the colour sits on an inner `span` the probe did not reach); local uses a darker active dot. Unverified, flagged rather than claimed. |
