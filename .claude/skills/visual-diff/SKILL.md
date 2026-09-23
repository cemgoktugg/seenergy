---
name: visual-diff
description: Capture the reference site and localhost at matched viewports, produce the pixel diff, read the measured percentages out of visual-diff.json, and locate where the changed pixels actually cluster with diff-hotspots. Use whenever a visual claim needs a number behind it, or when deciding which mismatch to fix next.
argument-hint: "[route-name] [viewport]"
user-invocable: true
---

# visual-diff

A percentage tells you **how much** differs. It never tells you **what** is
wrong. This skill produces the number, then goes and finds the defect.

## Arguments

`$ARGUMENTS` may supply `[route-name] [viewport]`.

- `route-name` — a `name` from `ROUTES` in `visual.config.mjs` (`home`,
  `category`, `product`). Omitted → `home`.
- `viewport` — `desktop-xl` (1440), `desktop` (1280), `tablet` (768),
  `mobile` (390). Omitted → all.

Reference: `https://www.merterelektronik.com`. Local: `http://localhost:3100`.

## The percentage is not the verdict

Local content and imagery legitimately differ from the reference. Our product
photography is generated mock art under `/public/mock/`, our copy is this
project's own Turkish copy, our brand is VOLTA. Those pixels will *never*
match, and they are not supposed to.

So:

- A raw diff percentage is **necessary and not sufficient**. It can stay high
  while the geometry is perfect, and it can look tolerable while a section is
  missing.
- Every diff run is paired with a **geometry check** — by eye on a cropped
  band, and by measurement from `deep-probe.mjs` / `band-map.mjs`.
- Never report a percentage as a pass without saying which bands you actually
  looked at.
- Masking genuine non-determinism (video, carousels, tickers) via
  `MASK_SELECTORS` is correct. Masking a real difference to move a number is
  cheating.

## Procedure

### 1 — Confirm you are capturing the right application

The dev server runs on **port 3100**. Port 3000 serves an unrelated project on
this machine. `npm run visual:local` prints the served `<title>` before
capturing — read that line every run. Wrong title, stop.

### 2 — Capture both sides at matched conditions

```
npm run visual:reference     # first run only; refuses to clobber the baseline
npm run visual:local
```

Both go through the identical stabilisation path in `capture-core.mjs` with
the `CAPTURE_ENV` values from `visual.config.mjs`: same viewport, device scale
factor 1, `light` scheme, `tr-TR`, `Europe/Istanbul`, reduced motion, font and
image waits, lazy-scroll pass, scroll reset, consent dismissal. A comparison
across different conditions is not evidence.

`npm run visual:update-baseline` is the only command that replaces the
reference baseline, and only when the user asks for it.

### 3 — Diff and report

```
npm run visual:compare
npm run visual:report
```

Read `artifacts/visual/reports/visual-diff.json` — read it, do not recall it.
Diff images land in `artifacts/visual/diff/`; magenta is changed pixels.

### 4 — Locate the pixels

```
node scripts/visual/diff-hotspots.mjs --worst
```

This reports the vertical bands the changed pixels cluster in, largest first.
Use it before deciding anything. A 9% page diff concentrated in one 400px band
is one bug; the same 9% spread evenly is a container or type-scale problem.

### 5 — Look at the band

A 6000px full-page PNG cannot be inspected as a whole. Cut out the hotspot:

```
node scripts/visual/crop.mjs artifacts/visual/local/home__desktop-xl__full.png 1180 640 /tmp/local-hero.png --scale 0.5
node scripts/visual/crop.mjs artifacts/visual/reference/home__desktop-xl__full.png 1180 640 /tmp/ref-hero.png --scale 0.5
```

Then look at both. If the band differs for a reason the percentage cannot
express — a missing section, a wrong column count — that is the finding, not
the number.

### 6 — Confirm the geometry with measurement

```
node scripts/visual/deep-probe.mjs --url http://localhost:3100 --out local-home --only desktop-1440
node scripts/visual/band-map.mjs   --url http://localhost:3100 --out local-bands --only desktop-1440
node scripts/visual/container-sweep.mjs --url http://localhost:3100 --out local-container
```

Compare against `reference-analysis/measurements/reference-*__*.json`. Pixels
say something moved; these say by how much and which box.

## Difference priority ladder

Classify every finding. Fix strictly downward — never P5 while a P1 is open.

| | Class | Covers |
| --- | --- | --- |
| **P1** | Geometry | container width, page gutters, band order, missing/extra section, grid column count, header row heights, card box size |
| **P2** | Proportion | aspect ratios, hero height, image box vs card, relative column widths |
| **P3** | Spacing / density | section rhythm, grid gaps, internal padding, items per row |
| **P4** | Typography | size, weight, line-height, letter-spacing |
| **P5** | Colour | background, text, border, accent |
| **P6** | Micro-styling | radius, border-width, shadow, hover polish |

A 40px container error is P1 and outranks a 2px radius error at P6, however
much more visible the radius feels.

## Thresholds

From `THRESHOLDS` and `CRITICAL_BANDS` in `visual.config.mjs`:

| Bar | Value |
| --- | --- |
| Initial acceptance | **≤ 5%** (`maxDiffPercent`) |
| Refinement target | **≤ 2%** (`targetDiffPercent`) |
| Full-page capture | ≤ 7% (`maxDiffPercentFullPage`) |
| `header+nav` band, 0–180px | **≤ 3%** |
| `hero` band, 180–720px | **≤ 4%** |
| pixelmatch tolerance | 0.1, anti-aliasing excluded |

Critical bands are measured from the top of the **viewport** screenshot, so
they apply to `__viewport.png` only.

## Reporting

Per route, per viewport, always as a table:

| Route | Viewport | Before | After | Target | Met |
| --- | --- | ---: | ---: | ---: | :---: |
| home | desktop-xl | 11.4% | 1.8% | 2% | yes |
| home | mobile | 14.2% | 3.6% | 2% | no |

Then state:

- the worst hotspot bands from `diff-hotspots.mjs --worst`, with their y-ranges
- what each is, classified P1–P6
- how much of the remaining percentage is mock imagery rather than geometry,
  and how you established that
- anything you could not measure

Never report a similarity figure you did not compute.

## Related

- `/reference-reconstruction` — the measurement and rebuild workflow.
- `/interaction-audit` — anything a static diff cannot see.
- `reference-visual-reviewer` — an unbiased read of the same screenshots.
