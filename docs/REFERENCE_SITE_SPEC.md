# REFERENCE_SITE_SPEC.md

Measured specification of **https://www.merterelektronik.com/** — the visual
blueprint for this reconstruction.

Every number here was read out of the rendered page with Playwright
(`scripts/visual/probe-reference.mjs`), not estimated from HTML and not
recalled from memory. Raw data: `reference/_probe/homepage__*.json`.
Screenshots: `reference/desktop-1440/`, `reference/desktop-1366/`,
`reference/mobile-390/`, slices in `reference/_slices/`.

Captured 2026-08-14 at 1440×900, 1366×768 and 390×844.

---

## 1. Global

| Property | Measured |
| --- | --- |
| Font family | **Montserrat**, sans-serif |
| Base font size | 12.8px |
| Page background | `rgb(246, 246, 246)` |
| Body text colour | `rgb(0, 0, 0)` / `rgb(51, 51, 51)` |
| Document height @1440 | 6045px |
| Document height @1366 | 5944px |
| Document height @390 | 8210px |

### Container

| Viewport | Container width | Side gutter |
| --- | --- | --- |
| 1440 | **1320px** | 60px |
| 1366 | **1240px** | 63px |
| 390 | **374px** | 8px |

Container is fluid at roughly **91.7%** of viewport width, capped near 1320px.
Occurrence count confirms dominance: 1320px appears on 124 elements at 1440.

### Brand colours

| Token | Value | Used for |
| --- | --- | --- |
| Brand primary (amber) | `rgb(253, 172, 12)` | nav bar, promo tiles, section bars, newsletter strip |
| Utility bar background | `rgb(241, 241, 241)` | top bar |
| Header background | `rgb(255, 255, 255)` | main header row |
| Card border | `rgb(240, 240, 240)` | product cards |
| Price colour | `rgb(79, 84, 86)` | product price |
| Danger / VAT + old price | `rgb(247, 29, 40)` | "KDV Dahil", struck price |
| Badge gold | `rgb(255, 215, 0)` | "3 TAKSİT" inside instalment strip |
| Instalment strip | dark navy `#1e2a3a`-range | "PEŞİN FİYATINA 3 TAKSİT" |

---

## 2. Header — three stacked rows, 175px total @desktop

Measured `header` box: `0,0 1440×175`, `position: static` (not sticky).

| Row | Element | Height | Background |
| --- | --- | --- | --- |
| 1 · utility | `#top-bar.header-top` | **31px** | `rgb(241, 241, 241)` |
| 2 · main | `#masthead.header-main` | **101px** | `rgb(255, 255, 255)` |
| 3 · nav | `#wide-nav.header-bottom` | **43px** | `rgb(253, 172, 12)` |

### Row 1 — utility bar (31px)

- Centre: scrolling promo text, 16px / 700, `rgb(64, 63, 68)`,
  e.g. "1000 TL ÜZERİ ÜCRETSİZ KARGO"
- Right: icon+label links — Hakkımızda · İletişim · Toptan Sipariş ·
  Yetkili Satıcımız Olun

### Row 2 — main header (101px)

| Element | Measured |
| --- | --- |
| Logo | 270.9 × 58.3 at x=20, y=51.8 |
| Search input | **612.1 × 41** at x=457.4, y=60.5 |
| Search font size | 16px, placeholder "Arama" |
| Search radius | `21px 0 0 21px` — pill left, submit button closes the right |
| Search submit | circular amber button on the right end of the field |
| Right actions | b2b pill badge, account circle, cart circle with counter badge |

**The search field is 46% of the container width.** It is the single most
prominent element of the header and must not be reduced to an icon.

### Row 3 — primary navigation (43px)

Full-bleed amber bar. 12 top-level items, white bold labels, wrapping to two
lines, separated by thin vertical dividers:

```
Uydu Sistemleri · Tv Yedek Parça · Kumanda Çeşitleri · Seslendirme Sistemleri ·
Güvenlik Sistemleri · Adaptör, Akü, Pil · Oto Ses ve Görüntü ·
Oem Ve Çevre Birimleri · Led ve Aydınlatma · Ev, Yaşam ve Teknoloji ·
Hırdavat ve Tamir Malzemeleri · Kablo Çeşitleri
```

### Mobile header (390) — 51px, single row

Hamburger · search icon · centred logo · b2b badge · account · cart.
The amber nav bar is not rendered; categories move into the drawer.

---

## 3. Homepage page map (observed order)

```
01  utility bar                          31px
02  main header                         101px
03  primary navigation (amber)           43px
04  hero slider                    ~1320×445, radius ~12px, 6 dots
05  category promo strip            4 tiles, ~313×175
06  wide campaign banner            1320×~180
07  product row + promo tile        1 promo tile + 4 product cards
08  section banner (image)          1320×~66, centred white title
09  product grid                    4 columns
10  section banner (image)          "OTO TEYPLER"
11  product grid                    4 columns
12  product grid                    5 columns
13  category promo strip            4 tiles
14  section bar (flat amber)        "Blog & Markalarımız", ~46px
15  blog cards                      4 columns, image + centred title
16  dual gold banners               2 × half width
17  brand logo grid                 white card, 10 columns × 5 rows, greyscale
18  SEO editorial text              centred h1 25.6 / h2 19.2 / body
19  trust row                       4 cards, icon + title + subtitle
20  newsletter + social bar         full-bleed amber
21  footer                          "Popüler Kategoriler" + link columns
```

Floating: WhatsApp support button (bottom-left, fixed), newsletter modal.

Two distinct section-header styles are used, and both must be reproduced:

1. **Image banner** — 1320 × ~66px, decorative photo background, centred white
   title ("ALL IN ONE Bilgisayarlar", "OTO TEYPLER").
2. **Flat amber bar** — 1320 × ~46px, solid `rgb(253,172,12)`, centred white
   title ("Blog & Markalarımız").

There are **no `<h2>` section headings** in the commercial part of the page —
the titles live inside these banners. `<h1>`/`<h2>` appear only in the SEO
block near the footer.

---

## 4. Product card — the highest-similarity requirement

Measured from `div.productItem.badge-applied`.

| Property | 5-col variant | 4-col variant |
| --- | --- | --- |
| Card size | **248 × 357** | **315 × 357** |
| Image area | **235 × 235** | 235 × 235 |
| Detail block | 246 × 120 | 313 × 120 |
| CTA | 246 × **44** | 313 × 44 |

| Property | Measured |
| --- | --- |
| Card background | `rgb(255,255,255)` |
| Card radius | **10px** |
| Card border | **1px solid `rgb(240,240,240)`** |
| Image radius | `10px 10px 0 0` |
| Image fit | reference uses `fill`; **we use `contain`** (see §6) |

### Anatomy, top to bottom

1. **Badge**, top corner — "Süper Fırsat" (blue pill) / "Ücretsiz Kargo"
   (green pill) / "TÜKENDİ" (grey full-width strip when out of stock)
2. **Product image**, square, white field
3. **Instalment strip** overlaying the bottom of the image — dark navy,
   "PEŞİN FİYATINA **3 TAKSİT**", card icon, `3 TAKSİT` in gold 10px/800
4. **Brand** — 13px / 700, `rgb(51,51,51)`
5. **Wishlist heart** — right-aligned on the brand row
6. **Product name** — 12px / 400, two lines, truncated with ellipsis
7. **Price** — **24px / 700**, `rgb(79,84,86)`
8. **Compare-at price** — struck through, red, smaller
9. **"KDV Dahil"** — 14px / 700, `rgb(247,29,40)`
10. **"Sepete Ekle"** CTA — 18px / 400, white on amber, 44px tall, radius 10px

The reference reveals the CTA on hover (measured background is transparent at
rest). Per the reconstruction brief §17 our implementation keeps it
**persistent** — same 44px height and visual weight, always visible.

---

## 5. Grids and rhythm

| Section | Columns @1440 | Card width | Gap |
| --- | --- | --- | --- |
| Product grid (4-col) | 4 | ~313px | ~22px |
| Product grid (5-col) | 5 | ~248px | ~20px |
| Promo tile + products | 1 tile (313) + 4 cards | ~230–245px | ~15px |
| Category promo strip | 4 | ~313px × 175px | ~20px |
| Blog cards | 4 | ~313px | ~22px |
| Brand logo grid | 10 | ~120px | — |
| Trust row | 4 | ~325px × 78px | ~20px |

Vertical rhythm between major sections: **~24–32px**. This is a dense
commercial layout — section gaps are small by design and must stay small.

### Mobile (390)

- Category promo strip → **2 columns**, ~178px wide
- Product sections → **horizontal scroll rails**, ~165px cards, next card peeks
- Section banners → full width, ~28px tall
- Hero → ~120px tall

---

## 6. What we deliberately change

| Reference | Ours | Why |
| --- | --- | --- |
| Logo, wordmark, brand names | Own placeholder brand + generated brand marks | Trademark |
| Product photography, banners | Generated mock imagery in `/public/mock/` | Copyright |
| Marketing and legal copy | Own Turkish copy | Copyright |
| `object-fit: fill` on product images | `object-fit: contain` | Brief §16 — electronics must not be distorted or cropped |
| CTA revealed on hover | Persistent CTA | Brief §17 — purchase actions stay visible |
| No focus styling | Token-based focus ring | Accessibility (ECDOS 10) |
| Non-semantic `div` structure | Landmarks, headings, lists | Accessibility (ECDOS 10) |

Layout, proportion, density, hierarchy and section order are **not** in this
table. Those are reproduced.

---

## 7. Observed behaviour

| Element | Behaviour |
| --- | --- |
| Utility bar promo | Horizontally scrolling text |
| Hero | Auto-advancing slider, 6 dot controls, no visible arrows |
| Nav | Amber bar, dropdown on hover (`nav-dropdown-has-arrow`) |
| Product card | Wishlist toggle; cart action; whole card links to detail |
| Card badges | Stock state shown as a "TÜKENDİ" strip over the image |
| Mobile rails | Native horizontal scroll with snap, partial next card visible |
| WhatsApp | Fixed bottom-left support button |
| Newsletter | Modal on load, dismissible |
