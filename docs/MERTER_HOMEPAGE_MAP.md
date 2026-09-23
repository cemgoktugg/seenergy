# MERTER HOMEPAGE MAP

The **observed** top-to-bottom section order of https://www.merterelektronik.com/,
read from the rendered page. This is not an example order and not a proposed
information architecture — it is what the reference actually renders, and it is
the order the reconstruction follows.

Regenerate with:

```
node scripts/visual/band-map.mjs
node scripts/visual/capture-analysis.mjs
```

Raw data: `reference-analysis/measurements/reference-bands__*.json`,
`reference-analysis/<viewport>/bands.json`.
Evidence: `reference-analysis/desktop-1440/home-full.png` (1440 × 6045).

---

## Desktop @1440 — container 1320px, document height 6045px

| # | Section | y | Band h | Content geometry |
| --- | --- | --- | --- | --- |
| 01 | **Utility bar** | 0 | 31 | bg `rgb(241,241,241)`, centred promo + 4 right links |
| 02 | **Masthead** | 31 | 101 | logo 271×58 · search 612×41 · b2b · account · cart |
| 03 | **Main navigation** | 132 | 43 | bg `rgb(253,172,12)`, 12 items across a 1400px track |
| 04 | **Hero slider** | 185 | 439 | slider 1320×423, radius 10, 5 slides, 5 dots, no arrows |
| 05 | **Campaign tiles ×4** | 633 | 195 | cell 335×175, tile 315×175, alternating orange / white |
| 06 | **Wide image banner** | 828 | 284 | banner 1320×264, radius 10 |
| 07 | **Promo tile + 4 products** | 1112 | 357 | promo 335 wide + product rail 985 wide |
| 08 | **Section banner** ("ALL IN ONE") | 1478 | 91 | image banner 1320×71 |
| 09 | **Product row ×4** | 1569 | 371 | 4 cards across 1320 |
| 10 | **Section banner** ("OTO TEYPLER") | 1935 | 118 | image banner 1320×98 |
| 11 | **Product row ×4** (slider) | 2053 | 376 | 4 cards, owl slider |
| 12 | **PRODUCT TABS + 15 products** | 2459 | 1194 | strip 1320×48, then 5 × 3 grid |
| 13 | **Campaign tiles ×4** (2nd) | 3663 | 175 | same component as 05 |
| 14 | **"Blog & Markalarımız" bar** | 3858 | 50 | full-container orange bar, radius 10 |
| 15 | **Blog cards ×4** | 3928 | 322 | card 315×322, radius 10, x = 60 / 395 / 730 / 1065 |
| 16 | **Dual promo tiles ×2** | 4270 | 263 | tile 650×263, radius 10, x = 60 / 730 |
| 17 | **Brand wall** | 4553 | 365 | 47 logos, tile ≈119×70 |
| 18 | **SEO editorial text** | 4928 | 220 | heading `19.2px/400` + paragraphs |
| 19 | **Trust row ×4** | 5148 | ~130 | white cards, radius 10, icon + title + subtitle |
| 20 | **Newsletter bar** | ~5290 | ~70 | full-bleed orange, 5 social icons + email + "Kayıt Ol" |
| 21 | **Popüler Kategoriler** | ~5380 | ~280 | 6 columns of category links |
| 22 | **Corporate footer + legal** | ~5660 | ~385 | 5 link columns, contact block, QR, legal line |

Sections 19–22 sit inside one 861px band (`y=5148`), which is why the band
mapper reports them together.

### Section pitch

The vertical rhythm is tight — this is a dense commercial page:

```
hero ends 624   → tiles start 633    gap  9
tiles end 828   → banner start 828   gap  0
banner end 1112 → promo start 1112   gap  0
promo end 1469  → banner start 1478  gap  9
banner end 1569 → row start 1569     gap  0
row end 1940    → banner start 1935  overlap (banner has 15px top padding)
tabs start 2459 with margin-top 30
```

Band backgrounds alternate between transparent (page grey shows through) and
explicit `rgb(246,246,246)`; padding is typically `10px` top and bottom, `15px`
above a section banner.

---

## Desktop @1366 — container 1240px, document height 5944px

Identical section order. Only the horizontal numbers change:

| Section | @1440 | @1366 |
| --- | --- | --- |
| Container | 1320 | 1240 |
| Hero | 1320×423 | 1240×~413 |
| Product card | 248 (cell 268) | 232 (cell 252) |
| Tab grid | 5 columns | 5 columns |
| Header | 175 | 175 |

---

## Mobile @390 — container 374px, document height 8210px

Not a naive reflow of the desktop layout. What actually changes:

| # | Section | y | h | Change from desktop |
| --- | --- | --- | --- | --- |
| 01 | **Header** | 0 | **51** | Single row. Hamburger · **search icon** · logo · b2b · account · cart. The search *field* is gone. |
| 02 | **Hero slider** | 51 | 128 | Full container width, much shorter; dots overlay the bottom |
| 03 | **Campaign tiles** | 189 | 214 | **2 × 2** instead of 1 × 4 |
| 04 | **Wide banner** | 413 | 75 | Same component, scaled |
| 05 | **Product rail** | 889 | 351 | Horizontal scroll |
| 06 | **Product rail** | 1288 | 351 | Horizontal scroll |
| 07 | **Product tabs + grid** | 1649 | 2679 | Tab strip **scrolls horizontally**, second pill clipped at the right edge; grid becomes **2 columns** |
| 08 | **Tiles / blog / promo** | 4328 | 2616 | Stacked |
| 09 | **Footer stack** | 6467 | 1707 | Stacked columns |

Mobile card: **165 wide** (cell 185), height 317. Same anatomy as desktop —
image, cargo badge top-right, instalment strip over the image bottom, brand +
heart, 2-line name, price.

### Recorded mobile behaviours (brief §27)

* Search moves from a 612px field to an **icon** in the header row.
* Categories move from the orange nav bar into a **full-width (390px) drawer**.
* Product grids go **5 → 2** columns; the 4-across rows become scroll rails.
* Campaign tiles go **4 across → 2 × 2**.
* The tab strip stays visible and **scrolls horizontally** rather than stacking
  or collapsing into a select.

---

## Reconstruction status

Measured after the reconstruction pass (`node scripts/visual/geometry-diff.mjs`):

| Reference section | Local | Outcome |
| --- | --- | --- |
| 04 Hero slider | present | re-timed to 5000ms dwell / 800ms slide, arrows removed |
| 05 Campaign tiles | present | 4 × 315×175, alternating |
| 06 Wide banner | present | 5:1 ratio |
| 07 Promo + 4 products | present | rebuilt as 335 promo + 985 rail (was 5 equal cells) |
| 08–09 Banner + 4 products | present | banner ratio 1320/71 |
| 10–11 Banner + 4 products | present | banner ratio 1320/98 |
| **12 PRODUCT TABS + 15** | **added** | **was missing entirely — a 1194px band** |
| 13 Campaign tiles (2nd) | present | — |
| 14 Blog bar | present | — |
| 15 Blog cards | present | title block raised to the measured 133px |
| 16 Dual promo | present | 650 × 263 |
| 17 Brand wall | present | 30 → 45 marks, 70px tiles, 5 rows |
| 18 SEO text | present | densified to the measured 19.2/11.5px scale |
| 19–22 Footer stack | present | moved to the 1400 chrome track, accordions on mobile |
| — | extra banner + 5-col grid | **removed** — occupied the tabs' position |

Resulting document height: **6039 vs 6045 at 1440 (−6)**, **5936 vs 5944 at
1366 (−8)**, **8373 vs 8210 at 390 (+163)**. The tab strip lands at y=2459 at
1440, exactly on the reference.
