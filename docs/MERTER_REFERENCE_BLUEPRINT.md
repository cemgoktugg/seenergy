# MERTER REFERENCE BLUEPRINT

Measured facts about **https://www.merterelektronik.com/**, read out of the
rendered page with Playwright. Nothing here is remembered, inferred from a
screenshot, or copied from the site's source. Every number came from
`getBoundingClientRect()` / `getComputedStyle()` on the live DOM.

**How to regenerate everything in this file**

```
node scripts/visual/deep-probe.mjs          # geometry, card anatomy, style inventory, transitions
node scripts/visual/band-map.mjs            # homepage band sequence
node scripts/visual/container-sweep.mjs     # container + header across 13 widths
node scripts/visual/interaction-probe.mjs   # scroll / hover / slider / tabs / drawer
node scripts/visual/detail-probe.mjs        # mega-menu, card hover, tab pills, hero dots
node scripts/visual/capture-analysis.mjs    # full-page + per-band PNGs at 8 viewports
```

Raw output: `reference-analysis/measurements/*.json`.
Evidence images: `reference-analysis/<viewport>/`, `reference-analysis/interactions/`.

> **Asset rule.** Layout, geometry, proportion, spacing, density, component
> anatomy and interaction character are reproduced. The reference's name, logo,
> marketing copy and product photography are **not**. See §10.

---

## 1. Global

| Property | Measured value |
| --- | --- |
| Body background | `rgb(246, 246, 246)` |
| Card / panel background | `rgb(255, 255, 255)` |
| Primary font | **Montserrat** (666 text nodes); Inter appears 60× in embedded widgets |
| Base font size | `12.8px` on `body`; the dominant *rendered* size is `12px` |
| Body text colour | `rgb(51, 51, 51)` |
| Document height @1440 | 6045px |
| Document height @390 | 8210px |

### 1.1 Colour palette (by usage count, 1440)

| Role | Value | Count |
| --- | --- | --- |
| Primary orange — buttons, active tab, tiles | `rgb(248, 158, 30)` | 94 |
| Nav-bar orange | `rgb(253, 172, 12)` | 1 (the bar itself) |
| Mega-menu heading orange | `rgb(255, 146, 0)` | — |
| Nav trigger hover text | `rgb(255, 176, 89)` | — |
| Free-shipping green | `rgb(76, 175, 80)` | 73 |
| Instalment strip | `rgba(12, 20, 39, 0.9)` | 60 |
| Instalment gold text | `rgb(255, 215, 0)` | 60 |
| Page background | `rgb(246, 246, 246)` | 15 |
| Inactive tab | `rgb(221, 221, 221)` | 2 |
| Utility bar | `rgb(241, 241, 241)` | 1 |
| Discount red | `rgb(195, 19, 28)` | 4 |
| Price text | `rgb(79, 84, 86)` | 91 |
| Body text | `rgb(51, 51, 51)` | 277 |
| Muted text | `rgb(102, 102, 102)` | 40 |

Two distinct oranges are in play and they are **not** interchangeable: the nav
bar is `#FDAC0C`, everything interactive is `#F89E1E`.

### 1.2 Radius, border, shadow

| Property | Measured value |
| --- | --- |
| Dominant radius | **`10px`** (1501 elements) |
| Circular controls | `100%` (93), `50%` (4) |
| Tab / banner top-only | `10px 10px 0px 0px` (91) |
| Pill controls | `60px` (77), `21px` (6) |
| Card border | **`1px solid rgb(240, 240, 240)`** (91) |
| Instalment strip border | `1px solid rgba(253, 224, 71, 0.4)` (60) |
| Soft shadow | `rgba(0, 0, 0, 0.05) 0px 2px 10px` (10) |
| Card hover shadow | `rgba(0, 0, 0, 0.16) 0px 3px 10px` |
| Mega-menu shadow | `rgba(0, 0, 0, 0.16) 0px 3px 6px` |
| Search suggestion shadow | `rgba(0, 0, 0, 0.4) 0px 6px 10px` |

There is **no shadow on a product card at rest**. Elevation appears on hover only.

### 1.3 Typography scale (rendered, by frequency)

| size / weight | Used for |
| --- | --- |
| `12px / 400` (140) | Product names |
| `13px / 700` (91) | Product brand |
| `24px / 700` (91) | Product price |
| `18px / 400` (88) | Section / banner text |
| `11px / 500` (77) | "Ücretsiz Kargo" badge |
| `10px / 800` (60) | "3 TAKSİT" highlight |
| `12px / 600` (12) | Main nav items |
| `14px / 700` | Active tab label |
| `15px / 500` | Mega-menu column headings |
| `13px / 400` | Mega-menu links |
| `16px / 700` | Utility-bar promo line |
| `19.2px / 400` | SEO editorial heading |

---

## 2. Container and breakpoints

Measured with `container-sweep.mjs` — the container is **stepped, not fluid**.

| Viewport | Container | Gutter (each side) | Header height |
| --- | --- | --- | --- |
| 1920 | 1480 | 220 | 175 |
| 1600 | 1480 | 60 | 175 |
| **1440** | **1320** | 60 | **175** |
| **1366** | **1240** | 63 | **175** |
| 1280 | 1180 | 50 | 175 |
| 1200 | 1100 | 50 | 175 |
| 1024 | 983 | 21 | **51** |
| 900 | 864 | 18 | 51 |
| 768 | 737 | 16 | 51 |
| 430 | 413 | 9 | 51 |
| **390** | **374** | 8 | **51** |
| 375 | 360 | 8 | 51 |

Two facts that drive the whole reconstruction:

1. Container caps at **1480px**, and steps down: 1320 @1440, 1240 @1366,
   1180 @1280, 1100 @1200. Below 1200 it becomes ~96% fluid.
2. The three-row desktop header (175px) collapses to a **single 51px row**
   between 1200 and 1024. The desktop header breakpoint is therefore **1200px**,
   not the 1024px a Tailwind `lg:` default would give.

---

## 3. Header — 175px, three rows

Highest-priority reconstruction area (brief §14).

```
row 1  utility     y=0    h=31    bg rgb(241,241,241)   border-bottom 1px #fff
row 2  masthead    y=31   h=101   bg #fff               border-bottom 1px rgb(215,215,215)
row 3  navigation  y=132  h=43    bg rgb(253,172,12)    border-bottom 1px rgb(181,181,181)
                                                        total 175
```

`position: static` — see §7.1, the header does **not** stick.

### 3.1 Row 1 — utility bar (31px)

* Centred promo line: "TOPLU ALIMLARA AVANTAJLI FİYATLAR", `16px / 700`,
  `rgb(64, 63, 68)`.
* Right-aligned links with small icons: *Hakkımızda · İletişim · Toptan Sipariş ·
  Yetkili Satıcımız Olun*.

### 3.2 Row 2 — masthead (101px)

| Element | x | y | w | h |
| --- | --- | --- | --- | --- |
| Logo | 20 | 51.8 | **270.9** | **58.3** |
| Search input | 457.4 | 60.5 | **612.1** | **41** |
| Search pill (input + button) | 457 | 60.5 | ~668 | 41 |
| Account | 1334 | 62 | 38 | 38 |
| Cart badge | 1407 | 55 | 22 | 22 |

Search detail — the defining element of this header (brief §15):

| Property | Value |
| --- | --- |
| Placeholder | `Arama` |
| Font size | `16px` |
| Padding-left | `18px` |
| Radius | `21px 0 0 21px` on the input; the pill as a whole is fully rounded |
| Border | none on the input; the pill carries a 1px orange outline |
| Background | `#fff` |
| Transition | `0.3s` |
| Placeholder colour | `rgb(125, 125, 125)` |

Logo → search gap: 457.4 − (20 + 270.9) = **166.5px**.
Search → account gap: 1334 − 1125 ≈ **209px**.
Search width is **46.4% of the container** — it dominates the row, and must not
be shrunk to make the header look cleaner.

Right cluster, left to right: **b2b** orange pill badge, account circle, cart
circle with a red count badge.

### 3.3 Row 3 — navigation (43px)

* Bar background `rgb(253, 172, 12)`, full-bleed; items laid out across a
  **1400px** track starting at x=20 — note this is *wider* than the 1320
  content container, which starts at x=60. The header's nav row and the mega
  panel share this wider track; page content does not.
* **12 items**, labels `12px / 600`, white, centred, wrapping to two lines.
* Item widths are content-driven, not equal: 99.1, 96.1, 110.9, 131.5, 115.0,
  103.1, 115.3, 132.8, 111.7, 128.4, 164.5, 91.6 (sum 1400.4).
* Thin vertical dividers between items.
* Item padding `0 5px`; inner link box 78×22 for the first item.

Labels (observed order):

```
Uydu Sistemleri · Tv Yedek Parça · Kumanda Çeşitleri · Seslendirme Sistemleri ·
Güvenlik Sistemleri · Adaptör, Akü, Pil · Oto Ses ve Görüntü ·
Oem Ve Çevre Birimleri · Led ve Aydınlatma · Ev, Yaşam ve Teknoloji ·
Hırdavat ve Tamir Malzemeleri · Kablo Çeşitleri
```

### 3.4 Mobile header (51px, ≤1024)

Single row, left to right: **hamburger · search icon · logo · b2b · account ·
cart**. The search **field is not present** — it collapses to an icon. Recorded,
not assumed (brief §27).

---

## 4. Product card

Measured on the "Haftanın Ürünleri" grid at 1440.

```
grid cell   268 × 357     padding 0 10px, margin-bottom 20px
card        248 × 357     bg #fff, radius 10px, border 1px solid rgb(240,240,240)
                          no shadow at rest
image area  246 × 235     image 235 × 235, object-fit: fill (see §10)
detail area 246 × 120
```

**The media block is a fixed height, not a square.** Measured at 1440, every
card width reports the same 235px media height, and the detail block is 120px at
every viewport:

| Viewport | Card | Media area | Detail area |
| --- | --- | --- | --- |
| 1440 (5-across) | 248 × 357 | 246 × **235** | 246 × **120** |
| 1440 (4-across) | 315 × 357 | 313 × **235** | 313 × **120** |
| 1440 (rail) | 235 × 357 | 233 × **235** | 233 × **120** |
| 390 (2-across) | 183–185 × 317 | 181–183 × **195** | 181–183 × **120** |

Card height is therefore media + detail: 235 + 120 = 355 (+2 border) = 357 on
desktop, 195 + 120 = 315 (+2) = 317 on mobile. Treating the media block as
`aspect-square` instead makes a 4-across card 437px tall against a measured 357.

Row pitch = 357 + 20 = **377px**.

### 4.1 Anatomy (offsets relative to the card box)

| Part | x | y | w | h | Type |
| --- | --- | --- | --- | --- | --- |
| Image | 16.5 | 1 | 235 | 235 | — |
| "Ücretsiz Kargo" badge | 139.8 | 11 | 107.2 | 23 | `11px/500` white on `rgb(76,175,80)` |
| "Süper Fırsat" badge | top-left | | | | blue pill, alternative to the above |
| Instalment strip | 11 | 194 | 246 | 27 | `rgba(12,20,39,0.9)`, `10px/500` |
| ↳ card icon | 56.5 | 201 | 14 | 14 | gold `rgb(255,215,0)` |
| ↳ "Peşin Fiyatına" | 80.5 | 201 | 130.9 | 14 | white `10px/500` |
| ↳ "3 Taksit" | 162.4 | 201 | 49.1 | 14 | gold `10px/800` |
| Brand | 21 | 246 | 226 | 16 | `13px/700` `rgb(51,51,51)` |
| Favourite (heart outline) | 213 | 244 | 24 | 24 | right-aligned, same row as brand |
| Name | 21 | 272 | 226 | 40 | `12px/400`, **2 lines**, `rgb(51,51,51)` |
| Price | 21 | 318 | 137.5 | 29 | **`24px/700`** `rgb(79,84,86)` |
| Old price | inline after price | | | | red `rgb(217,83,79)`, struck through |

The instalment strip **overlays the bottom of the image**, it does not stack
below it. That is what keeps the media block at 235px.

### 4.2 What the card does **not** contain

Verified on both the homepage and `/guvenlik-sistemleri`:

* **No add-to-cart button at rest.** `.mycartIcon` (233×44) exists in the DOM at
  `opacity: 0` and is revealed on hover only — see §7.5.
* **No quantity stepper.** `.urunListeAdet`, `.qtyMinus`, `.qtyPlus`,
  `.txtSepetAdet` are all `display: none` at every state observed, hover
  included. Brief §21 is conditional on the control being visually present; it is
  not, so it is not reproduced on the card.
* **No "KDV Dahil" line.**
* No rating stars, no stock bar, no comparison checkbox.

### 4.3 Card width by viewport

| Viewport | Card width | Columns (tab grid) |
| --- | --- | --- |
| 1440 | 248 (cell 268) | 5 |
| 1366 | 232 (cell 252) | 5 |
| 390 | 165 (cell 185) | 2 |

Product sections that sit next to a promo tile run **4 across** at ~313px.

---

## 5. Section components

### 5.1 Hero slider

| Property | Value |
| --- | --- |
| Box | x=60, y=185, **1320 × 423** |
| Radius | `10px` |
| Slides | 5 |
| Pagination | 5 dots, 12×12, `border-radius: 100%`, `rgb(187,187,187)`, `margin 0 3px`, at y=405 (inside the slider, near the bottom) |
| Arrows | **0** — there are no prev/next arrows |
| Autoplay interval | **5000ms** (measured over a 16s sample) |
| Transition duration | **0.8s**, `ease` |

### 5.2 Campaign tiles

Four tiles, `315 × 175`, gap 20, filling the 1320 container. Backgrounds
**alternate orange / white**. Each has a two-line title and an "İNCELE" pill
button, with a product image bleeding to the right. This component appears twice
on the page.

### 5.3 Section banner

A full-container **image** banner with overlaid text — not a flat colour bar.

| Instance | Size |
| --- | --- |
| "ALL IN ONE Bilgisayarlar" | 1320 × 71 |
| "OTO TEYPLER" | 1320 × 98 |
| Wide "weko" banner | 1320 × 264 |

### 5.4 Product tabs — brief §22

| Property | Value |
| --- | --- |
| Strip | x=60, y=2459, **1320 × 48** |
| Tabs | 3, each **432 × 48**, gap **8** |
| Radius | `10px` |
| Active | bg `rgb(248,158,30)`, text `#fff`, `14px / 700`, class `ticimaxTabHead_active` |
| Inactive | bg `rgb(221,221,221)`, text `#000`, `14px / 400` |
| Panel | 5 columns × 3 rows = **15 products**, total band 1194px |

Labels: **Haftanın Ürünleri · Yeni Ürünler · Çok Satanlar**.

On mobile the strip **scrolls horizontally**; the pills keep their size and the
second tab is clipped at the right edge.

### 5.5 Brand wall

47 logos, tile ~118.8 × 70, band height 385.

### 5.6 Footer stack (band y=5148, h=861)

1. Trust row — 4 white cards, radius 10, icon in a pale circle, bold title +
   grey subtitle: *Ücretsiz Kargo / Orijinal Ürünler / Güvenli Alışveriş /
   Kolay İade*.
2. Newsletter bar — full-bleed orange; 5 circular social icons on the left, an
   email field + "Kayıt Ol" button on the right.
3. "Popüler Kategoriler" — 6 columns of category links.
4. Corporate footer columns + legal line.

---

## 6. Style inventory summary

Everything a component should need, in one place:

```
page bg           rgb(246,246,246)
card bg           #fff
card border       1px solid rgb(240,240,240)
card radius       10px
card hover shadow 0 3px 10px rgba(0,0,0,0.16)

orange primary    rgb(248,158,30)
orange nav        rgb(253,172,12)
orange heading    rgb(255,146,0)
green shipping    rgb(76,175,80)
instalment        rgba(12,20,39,0.9) + gold rgb(255,215,0)
text              rgb(51,51,51)
muted             rgb(102,102,102)
price             rgb(79,84,86)
old price         rgb(217,83,79)
inactive tab      rgb(221,221,221)
```

---

## 7. Interaction and motion

Measured by driving the live page, **not** inferred from screenshots. Full
detail in `docs/MERTER_INTERACTION_MAP.md`; the summary that matters for
implementation:

### 7.1 Header on scroll

`position: static`. Height stays 175px at scrollTop 0 / 700 / 1200. No sticky
bar, no condensed variant, no shadow, no transform. **Do not add a sticky
header.**

### 7.2 Navigation hover → mega menu

| Property | Value |
| --- | --- |
| Panel | x=20, y=174, **1400 × 210** (height varies by category: 114 / 210 / 234) |
| Position | `absolute`, `z-index: 6`, directly under the 175px header |
| Background | `#fff` |
| Radius | **`0 0 10px 10px`** |
| Shadow | `rgba(0,0,0,0.16) 0px 3px 6px` |
| Padding | `0 20px` |
| Columns | **5**, each **220px** wide, starting x=170, pitch 220 |
| Column heading | `15px / 500`, `rgb(255,146,0)` |
| Column links | `13px / 400`, `rgb(83,83,83)`, line pitch **24px** |
| Trigger transition | `background 0.1s ease-in-out, color 0.1s ease-in-out` |
| Trigger at rest | transparent bg, `#fff` text |
| Trigger on hover | **white bg, `rgb(255,176,89)` text** |

It is a **full-width 5-column mega menu**, not a narrow dropdown.

### 7.3 Search

* Focus: no visible outline or shadow change; transition `0.3s`.
* Typing shows a suggestion panel: x=457 (aligned to the field), y=102
  (immediately below), **661 × 600**, radius `18px`, shadow
  `rgba(0,0,0,0.4) 0 6px 10px`, 26 items.

### 7.4 Tabs

Class swap to `ticimaxTabHead_active`; declared transition `all`. Content
switches by re-rendering the panel — no slide, no elaborate motion.

### 7.5 Product-card hover — brief §20

| | At rest | On hover |
| --- | --- | --- |
| Shadow | `none` | `rgba(0,0,0,0.16) 0px 3px 10px` |
| Brand + favourite row | visible | **covered** |
| `.mycartIcon` | `opacity: 0` | `opacity: 1`, `display: flex`, **233 × 44** |
| Transform | `none` | `matrix(1,0,0,1,0,0)` |
| Card height | 357 | 357 (unchanged) |

Transition on the revealed bar: **`transform 0.3s, opacity 0.3s`**.

So: hovering a card fades and slides a full-width orange **"Sepete Ekle"** bar
over the brand/favourite row, and lifts the card with a soft shadow. The card
does not scale, translate or tilt, and its height does not change. Evidence:
`reference-analysis/interactions/ref-card-A-default.png` /
`ref-card-B-hover.png`.

### 7.6 Mobile drawer

Opens to a **390px** (full-viewport-width) panel.

### 7.7 Mobile footer accordions

At 390 the corporate footer columns — *Kurumsal*, *Müşteri İlişkileri*,
*Sipariş İşlemleri* — are **collapsed into chevron accordions**; only their
headings are visible until tapped. "Popüler Kategoriler" above them stays fully
expanded in two columns, and the trust row stacks to **one card per row**.

Rendering those 19 links expanded made the local mobile footer 492px taller
than the reference — it was the largest single mobile geometry error.
Evidence: `reference-analysis/mobile-390/Z-footer.png`.

---

## 8. Timing summary

| Interaction | Measured |
| --- | --- |
| Hero autoplay dwell | **5000ms** |
| Hero slide transition | **800ms**, `ease` |
| Card hover reveal | **300ms** (`transform`, `opacity`) |
| Nav trigger colour/bg | **100ms**, `ease-in-out` |
| Button bg/colour | **100ms**, `ease-in-out` |
| Search field | **300ms** |

Do not collapse these onto one shared duration token (brief §35).

---

## 9. What must **not** be modernized away

* Three-row header at 175px; the 51px single row below 1200.
* Search at ~46% of the container width.
* 12-item nav bar and the full-width 5-column mega menu.
* Section order and the 15-product tabbed block.
* Card information density: brand, 2-line name, large price, struck old price,
  shipping badge, instalment strip, hover-revealed cart bar.
* Commercial density — roughly 20 products above the brand wall.

## 10. Deliberate, declared deviations

| Reference | Ours | Why |
| --- | --- | --- |
| `object-fit: fill` on card images | `object-fit: contain` | The reference distorts product photos to fill a square. Brief §11 requires electronics not be cropped or distorted. |
| Real brand logos and product photography | Local mock SVGs under `/public/mock/` | Brief §10 — copyrighted assets are not reused. |
| "mert-er Elektronik" name and logo | Project's own brand | Brief §10. |
| Turkish marketing copy | Original copy per `docs/CONTENT_GUIDE_ELECTRONICS.md` | Brief §10. |

Everything else in this document is reproduced as measured.
