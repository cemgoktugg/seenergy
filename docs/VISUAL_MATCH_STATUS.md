# VISUAL MATCH STATUS

Measured state of the VOLTA homepage reconstruction against
**https://www.merterelektronik.com/**.

Regenerate every number below with:

```
npm run dev                                   # must be serving on :3100
node scripts/visual/geometry-diff.mjs         # the real check
node scripts/visual/compare-pair.mjs reference-analysis/compare/ref-1440.png \
     reference-analysis/compare/local-1440.png reference-analysis/compare/diff-1440.png
```

> **Why geometry, not a pixel percentage.** Our brand, imagery, product
> photography and copy are deliberately different from the reference (brief §10),
> so a large share of changed pixels is *expected*. A raw diff percentage
> therefore cannot answer "is the layout right?" — `geometry-diff.mjs` compares
> container widths, header height, card sizes and landmark positions, which are
> the things that actually have to match. The pixel diffs are kept for locating
> divergence, not for scoring.

---

## 1. Structural geometry — the graded check

### desktop 1440 × 900

| Metric | Reference | Local | Δ |
| --- | --- | --- | --- |
| Document height | 6045 | 6039 | **−6** (0.1%) |
| Container | 1320 | 1320 | **0** |
| Header height | 175 | 175 | **0** |
| Search input width | 612 | 608 | −4 |
| Product card (5-across) | 248 × 357 | **248 × 357** | **0** |
| Product card (4-across) | 315 × 357 | **315 × 357** | **0** |
| Product card (rail) | 235 × 357 | 231 × 357 | −4 |
| Tab strip y | 2459 | **2459** | **0** |
| Brand wall y | 4543 | 4539 | −4 |
| hero → tab strip | 2274 | 2284 | +10 |
| tab strip → brand wall | 2084 | 2080 | −4 |

### desktop 1366 × 768

| Metric | Reference | Local | Δ |
| --- | --- | --- | --- |
| Document height | 5944 | 5936 | **−8** (0.13%) |
| Container | 1240 | 1240 | **0** |
| Header height | 175 | 175 | **0** |
| Search input width | 560 | 573 | +13 |
| Product card (5-across) | 232 × 357 | **232 × 357** | **0** |
| Product card (4-across) | 295 × 357 | **295 × 357** | **0** |
| Tab strip y | 2395 | 2396 | +1 |
| Brand wall y | 4457 | 4436 | −21 |

### mobile 390 × 844

| Metric | Reference | Local | Δ |
| --- | --- | --- | --- |
| Document height | 8210 | 8373 | +163 (2.0%) |
| Container | 374 | 374 | **0** |
| Header height | 51 | 51 | **0** |
| Product card | 183 × 317 | **182 × 317** | −1 |
| Hero y | 189 | **189** | **0** |
| Tab strip y | 1648 | 1623 | −25 |
| header → hero | 138 | **138** | **0** |

---

## 2. Pixel diff — for locating divergence only

| Viewport | Canvas | Changed | Note |
| --- | --- | --- | --- |
| 1440 | 1440 × 6039 | 32.9% | asset/copy difference dominates |
| 1366 | 1366 × 5936 | 33.5% | " |
| 390 | 390 × 8210 | 34.5% | " |

Diff images: `reference-analysis/compare/diff-{1440,1366,390}.png`
(magenta = changed). The per-band breakdown printed by `compare-pair.mjs`
concentrates in the image-heavy bands — hero, campaign tiles, banners, blog
cards, brand wall — which is where our own artwork legitimately differs.

---

## 3. Section order

1:1 with the reference at all three viewports, with no missing or extra
sections. See `docs/MERTER_HOMEPAGE_MAP.md`.

The largest single correction in this pass was adding the
**"Haftanın Ürünleri / Yeni Ürünler / Çok Satanlar" tabbed block** (a 1194px
band, ~20% of the page) which the previous build omitted entirely, and removing
the two unrelated sections that stood in its place.

---

## 4. Component-level match

| Component | Status |
| --- | --- |
| Three-row 175px header | **exact** (31 / 101 / 43) |
| Desktop-header breakpoint at 1200 | **exact** (was 1024) |
| Stepped container ladder | **exact** at all 13 measured widths |
| Full-width 5-column mega menu | **exact** — 1400 × 219 at x=20, y=174, radius `0 0 10px 10px`, shadow `0 3px 6px rgba(0,0,0,.16)`, heading `15px/500 rgb(255,146,0)` |
| Product card anatomy | **exact** — 235/195px fixed media block, 120px detail block, no CTA or stepper at rest |
| Product tabs | **exact** — 48px pills, `rgb(248,158,30)` / `rgb(221,221,221)` |
| Hero | **exact** — 1320 × 423, radius 10, 0 arrows, 5000ms dwell, 800ms slide |
| Card hover | **exact** — `0 3px 10px rgba(0,0,0,.16)`, 44px slide-up cart bar, 300ms, height unchanged |
| Mobile footer accordions | reproduced |
| Mobile header order | reproduced (hamburger · search · logo · b2b · account · cart) |

---

## 5. Known remaining differences

| # | Item | Size | Why it is still open |
| --- | --- | --- | --- |
| 1 | Mobile document height | +163 (2.0%) | Residual is below the tab strip; our footer stack is slightly taller than the reference's. |
| 2 | `brandWall → popularCategories` | −91 @1440 | Our SEO editorial block carries less copy than the reference's. Text volume, not layout. |
| 3 | Search width @1366 | +13 | The pill tracks the container at a fixed 47%; the reference's ratio drifts slightly by breakpoint. |
| 4 | Search typeahead panel | not built | Reference shows a 661 × 600 suggestion panel. Local search submits to `/arama`. |
| 5 | Brand-wall mark density | — | Our mock brand SVGs draw a small icon+label inside each 119 × 70 tile; the reference's logos fill more of theirs. Mock-asset quality, not layout. |
| 6 | Hero dot active state | unverified | The reference's active/idle dot colours read identically through the probe (the colour sits on an inner node). Flagged rather than guessed. |
| 7 | Category / product detail routes | placeholder | This phase is scoped to the homepage; `/[...slug]` states plainly that the section is not built rather than faking a catalogue. |

---

## 6. Verification commands actually run

```
npx tsc --noEmit                      # clean
npx eslint .                          # clean
npx playwright test responsive-smoke  # 8 passed
npm run quality:full                  # PASS: lint, typecheck, responsive-smoke, build
node scripts/visual/geometry-diff.mjs # numbers in §1
```
