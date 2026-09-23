---
name: visual-qa
description: Inspect the running local application for layout defects — container drift, misalignment, wrong spacing, overflow, text wrapping, broken image ratios, inconsistent cards and mobile breakage — using measured Playwright screenshots and computed geometry as evidence. Use before calling any visual work done.
argument-hint: "[route] [viewport]"
user-invocable: true
---

# visual-qa

Layout quality control. Not "does it look nice" — **does it measure correctly**.

Every finding must carry a number or a screenshot. A claim with neither is not
a finding.

## Arguments

`$ARGUMENTS` may supply `[route] [viewport]`. Defaults: `/` at all four
viewports in `visual.config.mjs`.

## Evidence is mandatory

When browser tooling is available, you must capture and actually look at
screenshots before reporting. Reading the JSX and reasoning about what it
probably renders is not QA.

```
npm run dev                                    # port 3100
node scripts/visual/capture-slices.mjs --local # full page + readable slices
```

Then open the slices. A 6000px screenshot is not readable in one piece; the
slices exist so it is.

## Checklist

Work through each. Report `PASS`, or the measured deviation.

### 1 — Container
- Every section resolves to the same content width.
- No section is accidentally full-bleed, and no full-bleed section is
  accidentally constrained.
- Measure: `document.querySelector('.container-main').getBoundingClientRect()`.

### 2 — Alignment
- Section left edges line up down the whole page.
- Card grids start and end on the container edge.
- Headings, banners and grids share one left edge.

### 3 — Spacing
- Vertical rhythm between sections is consistent and comes from
  `--space-section`, not ad-hoc margins.
- Grid gaps are uniform inside a section.
- No doubled margin between two adjacent sections.

### 4 — Dimensions
- Header rows match the measured reference: 31 / 101 / 43px.
- Product cards match: 248 (5-col) / 315 (4-col) wide, image area 235px tall.
- CTA height 44px.
- Hero ~445px — not a full-screen hero.

### 5 — Overflow
- No horizontal scrollbar at any viewport, including 320px.
- `document.documentElement.scrollWidth <= clientWidth + 1`.
- Wide content (tables, rails) scrolls inside its own container, not the page.

### 6 — Text wrapping
- Product names clamp to two lines and never push card heights apart.
- Nav labels wrap to at most two lines and stay inside their cell.
- No single word overflowing its box; no orphaned character on its own line.
- Long Turkish compounds ("Hırdavat ve Tamir Malzemeleri") are the stress test.

### 7 — Image ratios
- Product images use `object-fit: contain` and are never stretched.
- Banner images use `cover` and are never letterboxed.
- Every `img` has explicit dimensions or a fixed container, so nothing shifts
  as images decode.

### 8 — Card consistency
- All cards in a row are the same height.
- Badge, instalment strip, brand, name, price, CTA appear in the same place on
  every card.
- A card missing an optional element (no discount, no badge) still aligns with
  its neighbours.

### 9 — Mobile
- Header collapses to one row, search stays visible and full width.
- Category tiles drop to two columns.
- Product sections become horizontal rails with the next card peeking.
- Touch targets ≥44px.
- Drawer traps focus and closes on Escape.

### 10 — States
- Focus ring visible on every interactive element.
- Sold-out cards show the state and disable the CTA.
- Hover does not shift layout.

## Reporting

```
CONTAINER      PASS   1320px at 1440, 1240px at 1366
CARD HEIGHT    FAIL   422px measured, 409px expected (+13)
                      cause: KDV line adds a row the reference folds into the price block
MOBILE RAIL    PASS   next card peeks at 46% column width
OVERFLOW       FAIL   scrollWidth 1452 > clientWidth 1440 at 1440
                      offender: .brand-grid ul
```

Order findings by how much they distort the page, not by how easy they are to
fix. Do not edit code in this skill — report, then let the implementation pass
act on it.

## Related

- `/reference-clone` — measure the reference and reproduce its structure
- `/visual-iterate` — bounded convergence loop against measured diffs
