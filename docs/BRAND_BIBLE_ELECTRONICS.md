# BRAND_BIBLE_ELECTRONICS.md

## VOLTA — Visual and Verbal Identity

Extends `docs/design-os/01-brand-bible.md` (identity philosophy),
`02-visual-language.md`, `04-typography-system.md` and `05-color-system.md`.
Those modules define the standard. This document makes the choices.

---

## 1. Name and positioning

**VOLTA**

> Teknoloji ve elektroniğin adresi.

A modern technology and electronics destination where consumer electronics,
professional equipment, electrical components, accessories and specialist
products can be found and understood quickly.

The name reads identically in Turkish and internationally, carries an
electrical meaning without being literal, and is short enough to sit as a
wordmark next to a dense search field.

### Attributes

Precise · Modern · Technical · Trustworthy · Fast · Commercial · Calm

### Not

Loud · Gaming · Neon · Marketplace · Discount-driven · Cluttered · Cold

ECDOS 01 lists "editorial, feminine, warm" among the personality traits of the
generic fashion brand it describes. Those three are the fashion specialisation,
not the standard. This build substitutes **precise, technical, exact** and keeps
every other value — calm, refined, modern, confident, minimal, premium — intact.

---

## 2. Colour system

> **Superseded — SEENERGY identity.** The client supplied a real logo and
> ordered the storefront rebranded to it, so the palette below is no longer the
> orange/blue scheme this section originally prescribed. Recorded rather than
> rewritten, because two things here are worth keeping straight:
>
> 1. The original scheme (`--cta: #c2410c`, blue identity) was **never
>    implemented**. The build took its amber from the measured reference site,
>    so doc and code had already drifted before the rebrand; the rebrand widened
>    the gap and this note closes it.
> 2. The reference-measurement documents — `REFERENCE_SITE_SPEC.md`,
>    `MERTER_REFERENCE_BLUEPRINT.md`, the map files — still describe
>    merterelektronik.com's amber accurately and are **not** edited. A record of
>    what the reference site is stays true regardless of what we build.
>
> **2026-09-29 — final logo.** The client then supplied the logo as it will be
> used: a silver lockup, "SEENERGY / Güvenlik Teknolojileri A.Ş"
> (`img/seenergy-logo-original.jpg`, cut to `public/brand/` — see
> `src/components/brand-mark.tsx`). It replaced the hand-drawn gradient S in
> the header, the sticky bar and the favicon.
>
> **2026-09-29 — steel palette.** At the client's request the palette was then
> retuned to the silver mark. The four gradient tokens keep their names and
> become a steel ramp — `grad-1` silver `rgb(184 190 199)`, `grad-2` steel
> `rgb(98 106 119)`, `grad-3` graphite `rgb(52 57 66)`, `grad-4` black
> `rgb(22 24 29)` — and the action colour moves from indigo to graphite
> `rgb(28 31 37)` (white 16.5:1; hover `rgb(64 71 82)`, 9.4:1). A separate
> `--color-focus` `rgb(120 128 140)` clears 3:1 on white and on the chrome.
> Campaign tones "mor" and "turkuaz" are shown in the admin as Grafit and
> Gümüş; their stored keys did not change. Every value and its measured
> contrast is in `src/app/globals.css`. **The teal / indigo / purple
> description below is the previous identity**, kept as the record of it.

Cool neutrals (ECDOS 05 §8: cool neutrals are the electronics temperature)
carrying **one** chromatic identity, because the logo is itself a gradient and a
near-black rather than a family of hues:

- **chrome** — the category navigation bar, the header stack, the instalment
  strip, dark data bands. Near-black `rgb(20 22 28)`, taken from the wordmark's
  own ink. Structure.
- **the gradient** — teal `#12A5A5` → blue `#2E55C8` → indigo `#4A2E9C` →
  purple `#742D8E`, the logo mark's own ramp. Identity. It appears on
  structure only: caps, rails, hairlines, the newsletter band. Never behind
  body copy.
- **indigo** — add-to-cart, filters, the "Tüm Kategoriler" control, active
  states. The commercial action, and nothing else.

Indigo is the action colour for a contrast reason, not a taste one: white text
measures **8.4:1** on `rgb(74 46 156)` and **2.8:1** on the teal stop, so teal
can carry graphics and rules but never a white label.

Distribution target still follows 05 §51: **~80% neutral, ~12% product and
editorial colour, ~8% brand and state.** The gradient is a small proportion of a
page by area; it is loud because it is rare.

### Primitive ramp

```css
--color-grey-0:   #ffffff;   --color-grey-500: #b4bdca;
--color-grey-25:  #fbfcfd;   --color-grey-600: #8a94a6;
--color-grey-50:  #f7f8fa;   --color-grey-700: #667085;
--color-grey-100: #f1f3f7;   --color-grey-800: #4a5566;
--color-grey-200: #e8ecf2;   --color-grey-900: #26303f;
--color-grey-300: #e3e7ed;   --color-grey-950: #101826;
--color-grey-400: #d3d9e2;

--color-navy-700: #163a76;   --color-navy-900: #0a1f44;
--color-navy-800: #102c5c;   --color-navy-950: #071733;

--color-blue-50:  #eff6ff;   --color-blue-400: #5aa2f5;
--color-blue-100: #dbeafe;   --color-blue-500: #2b7fe3;
--color-blue-200: #bfdbfe;   --color-blue-600: #1565c7;
--color-blue-300: #93c5fd;   --color-blue-700: #0f4fa0;
                             --color-blue-800: #0e3f7e;

/* SEENERGY: the logo mark's four stops, plus the chrome its wordmark is set in.
   Implemented in src/app/globals.css as --color-grad-1..4 and --color-chrome. */
--color-grad-1: #12a5a5;     --color-grad-3: #4a2e9c;
--color-grad-2: #2e55c8;     --color-grad-4: #742d8e;

--color-indigo-600: #4a2e9c; --color-indigo-800: #3a2480;
--color-indigo-50:  #eeebfc; --color-indigo-700: #5b34b8;

--color-chrome-900: #14161c; --color-chrome-700: #343a46;
--color-chrome-800: #20242d;
```

### Semantic layer

Components name roles, never primitives, never hex (05 §42, §55).

| Token | Value | Role |
| --- | --- | --- |
| `--surface-base` | `grey-0` | Cards, panels, drawers |
| `--surface-page` | `grey-50` | Page canvas |
| `--surface-subtle` | `grey-100` | Alternating sections, quiet fills |
| `--surface-muted` | `grey-200` | Skeletons, inert fills |
| `--surface-inverse` | `navy-900` | Category nav, footer, dark bands |
| `--surface-inverse-soft` | `navy-800` | Second level inside a dark band |
| `--text-primary` | `grey-950` | Body and headings — 17.8:1 on white |
| `--text-secondary` | `grey-800` | Meta, descriptions — 7.6:1 |
| `--text-tertiary` | `grey-700` | Non-critical metadata — 5.0:1 |
| `--text-on-inverse` | `#b9c6dd` | Secondary type on navy — 8.1:1 |
| `--border-subtle` | `grey-200` | Hairlines inside quiet groups |
| `--border-default` | `grey-300` | Cards, inputs, dividers |
| `--border-strong` | `grey-500` | Selected, hovered, emphasis |
| `--brand-primary` | `blue-600` | Links, active nav, selected — 5.7:1 |
| `--brand-hover` | `blue-700` | Hover / active of the above — 8.0:1 |
| `--brand-soft` | `blue-50` | Tinted brand backgrounds, chips |
| `--brand-strong` | `blue-800` | Brand type on soft brand fills — 10.1:1 |
| `--brand-on-inverse` | `blue-300` | Brand type on navy — 7.4:1 |
| `--cta` | `indigo-600` | Add to cart, filters, category control — 8.4:1 |
| `--cta-hover` | `indigo-800` | Hover / pressed of the above — 10.9:1 |
| `--cta-soft` / `--cta-strong` | `indigo-50` / `indigo-700` | Outline CTA |
| `--success` | `#0f7a3d` | In stock, confirmation — 5.4:1 |
| `--warning` | `#9a5b00` | Low stock, caution — 5.4:1 |
| `--danger` | `#c0342b` | Validation, unavailable — 5.6:1 |
| `--promotion` | `--danger` | Markdown percentage, on a tinted chip — 5.6:1 |
| `--rating` | `#e8a317` | Star glyphs only (see §9) |
| `--price-current` | `--text-primary` | Always neutral (05 §16) |
| `--price-previous` | `--text-tertiary` | Struck through, never louder |

Every value above was contrast-checked against its own surface before it was
written down, and the ratios are in `src/app/globals.css` beside the token.

### Rules

- **Indigo is the buying action and nothing else.** ECDOS 05 §19 prefers a
  neutral primary button; this build departs from it deliberately, because a
  neutral button in Turkish electronics retail reads as disabled. The stop
  chosen is the one that carries a white label: `#4a2e9c` at 8.4:1, where the
  teal stop manages 2.8:1 and could not.
- **The gradient never competes with the action.** The gradient is where the
  brand *is*; indigo is what you *do*. A card has exactly one indigo element,
  and the gradient appears on structure — a 3px cap, a rail, a hairline — never
  as a fill behind text.
- **Teal is graphics, never a label.** Rules, dots, progress segments and the
  instalment strip's emphasis. The moment teal would carry white type, it is the
  wrong token.
- **Semantic colour is reserved for state** (05 §14). Success is stock, not
  decoration. `--promotion` carries markdowns so `--danger` never has to.
- **The current price stays neutral** whether or not the product is discounted
  (05 §16). Electronics retail routinely paints prices red; that is the
  marketplace signal this brand is defined against.
- **Colour is never the only signal** (05 §33). Stock states name their count.
  Unavailable variants strike through and carry `aria-disabled`. Selected
  swatches carry a ring *and* a tick *and* `aria-checked`.
- **No full-page gradients, no glass, no neon.** Depth comes from tinted
  surfaces and hairlines. The only gradients in the build are the scrims that
  make white type legible over a banner photograph.
- **No dark mode.** ECDOS 05 §29 defines dark mode as a complete remap with its
  own contrast matrix; shipping an unverified one would be worse than not
  shipping it. The architecture is ready: every semantic token resolves through
  a primitive, so a `[data-theme="dark"]` block repoints one layer. Dark
  *sections* (§28) exist and are tokenised.

### Category colour

Categories share one neutral UI (05 §39). They are distinguished by their
product photography and their content, never by a per-category hue. A storefront
with fourteen accent colours is a marketplace.

---

## 3. Typography

### Family

**Inter** — one family, loaded as a variable font through `next/font`, weights
400/500/600/700 only (04 §39, 12 §36).

Inter is chosen for numeric quality above all: electronics commerce is prices,
model numbers, voltages, wattages, resolutions and part codes. Inter ships
`tabular-nums`, a slashed-zero option, unambiguous `1`/`l`/`I`, and complete
Turkish coverage (`ç ğ ı İ ö ş ü`).

**No display serif.** ECDOS 04 §5 offers four pairings; three are fashion
pairings and the fourth (Geist + DM Serif) adds a display face this brand has no
job for. Importing the previous project's Cormorant Garamond would be exactly
the blind carry-over the brief forbids. Restraint here is also a performance
decision (12 §35).

### Numeric discipline

```css
font-variant-numeric: tabular-nums;
```

is applied to prices, specification values, stock counts, quantities and
comparison tables. Model numbers and SKUs additionally use
`font-feature-settings: "ss01"` — Inter's disambiguation set — so that
`PM-27447` and `MVH-S320BT` cannot be misread.

### Scale

From the 04 §8 modular scale, tightened one step from the first draft. A
commercial storefront is read at a glance, not at length: a 4.25rem display and
a 1.125rem body belong to an editorial page, and at that size the homepage
carried three sections where it now carries six. No value outside the table, no
`text-[…]` in JSX.

| Class | Size | Weight | Use |
| --- | --- | --- | --- |
| `.text-display` | `clamp(1.875rem, 1.25rem + 2.6vw, 3rem)` | 700 | Hero banner headline |
| `.text-page-title` | `clamp(1.5rem, 1.2rem + 1.3vw, 2.125rem)` | 700 | Page H1, banner titles |
| `.text-section-title` | `clamp(1.25rem, 1.1rem + .7vw, 1.625rem)` | 700 | Section H2 |
| `.text-card-title` | `1.0625rem` | 600 | Card and panel headings |
| `.text-product-title` | `0.875rem` → `0.9375rem` | 500 | Product card name |
| `.text-price` | `1.0625rem` | 700 | Card price, tabular |
| `.text-price-lg` | `clamp(1.5rem, 1.3rem + .8vw, 1.875rem)` | 700 | PDP price |
| `.text-body-lg` | `clamp(1rem, .96rem + .2vw, 1.0625rem)` | 400 | Lead copy |
| `.text-body` | `0.9375rem` | 400 | Body |
| `.text-body-sm` | `0.875rem` | 400 | Secondary, most UI text |
| `.text-label` | `0.8125rem` | 600 | Form and spec labels |
| `.text-caption` | `0.75rem` | 400 | Meta, counts, shipping lines |
| `.text-eyebrow` | `0.6875rem`, `0.09em` uppercase | 700 | Section eyebrow |
| `.text-badge` | `0.6875rem` | 700 | Badges |
| `.text-button` | `0.9375rem` | 600 | Buttons |
| `.text-mono` | `0.75rem`, tabular, `ss01` | 400 | SKU, model |
| `.text-wordmark` | `1.5rem` | 800 | Logo only |

Sentence case everywhere (04 §32) except the two uppercase roles above and the
"TÜM KATEGORİLER" control, which is uppercase because it is the one navigation
element that must win against everything beside it. Inputs are ≥16px so mobile
does not zoom (04 §22).

---

## 4. Geometry

**One radius system** (02 §Corner Radius), on the commercial scale rather than
the editorial one — a 24–40px radius everywhere is the signature of a startup
landing page, and it makes a dense product grid look like a toy:

```css
--radius-sm:   8px;   /* badges, tags, chips, small controls */
--radius-md:  10px;   /* buttons, inputs, the search field */
--radius-lg:  14px;   /* cards, media frames, banners */
--radius-xl:  16px;   /* sheets, drawers, large surfaces */
--radius-full: 999px  /* pills and circular icon buttons only */
```

**Container.** `.container-page` is `min(100% - Xrem, 95rem)` — 1520px at the
cap, stepping its gutter 32 → 48 → 64 → 80px. Electronics retail should use the
screen; an 1140px column wastes a 1440px display and forces four product columns
where five fit.

**Section rhythm** is 40px mobile → 56px tablet → 72px desktop
(`.section-rhythm`), with a 24/32px compact variant. This is deliberately
tighter than the 112–160px an editorial page would use: the storefront is
product-heavy and the customer should reach products inside the first scroll.

**Breakpoints** add `xs: 380px`, move `2xl` to **1440px** and add `3xl: 1728px`
(06 §8). 1440 is a real compositional step here — it is where the filtered
catalogue gains a fourth column and the homepage category strip stays at nine
across without stretching. Tailwind's stock 1536 `2xl` left 1440 displays
rendering the 1280 layout.

**Shadows are almost invisible** (02 §Shadows). Five tokens, all cool-tinted:
`--shadow-layer` (raised), `--shadow-card` (`0 4px 18px rgb(16 24 38 / 5%)` —
card hover), `--shadow-overlay` (popover, menu), `--shadow-float` (drawer,
modal), `--shadow-bar` (sticky bar). Separation comes from tinted surfaces and
hairlines; a card at rest has a border, not a shadow.

**Icons** are Lucide at one stroke width, set globally:

```css
svg.lucide { stroke-width: 1.5; }
```

Icons never decorate (02 §Icons). Every icon is either paired with a label or is
`aria-hidden` inside a control that has one.

---

## 5. Product media

Electronics photography is not fashion photography, and the difference drives
the whole media system.

| | Fashion | Electronics |
| --- | --- | --- |
| Ratio | 4:5 portrait | **5:4 tile, 4:3 gallery** landscape |
| Subject | Model in a scene | The product, whole, in silhouette |
| Frame | Edge-to-edge | Depends on context — see below |

**The product page contains, the listing fills.** On the PDP nothing may be
cropped: a cropped connector is a useless photograph, so `MediaFrame` owns the
ratio and the padding and the image sits `object-fit: contain` inside it — a
rack amplifier and a micro-USB adapter both read correctly in the same frame.

In a listing tile the rule inverts, and this is a correction made from the
rendered page rather than from the code. The mock set is *photographic* — real
scenes, not cut-outs on white — so containing it left a small picture floating
in white bands on every card, which reads as an unfinished component and is
exactly what §12 of the brief rules out. Cards therefore use `bleed` +
`object-fit: cover`: the photograph fills the tile edge to edge. When real
cut-out product photography replaces the mock set, `ProductCard` moves back to
`contain` — one prop.

Campaign and editorial imagery may go full-bleed and may crop.

### Until real assets exist

**Nothing hotlinks a remote URL and nothing renders generated placeholder
artwork** (master brief §12). Both were tried and both were wrong: remote URLs
break, and the vector `ProductArt` glyphs the first draft shipped were precisely
the "ugly generated SVG product boxes" the brief forbids — they have been
deleted.

Instead, `/public/mock/{hero,banners,categories,products,brands}/` holds 49
CC0/CC-BY photographs downloaded from Wikimedia Commons and the Openverse
public-domain pool by `scripts/fetch-mock-images.mjs` and
`scripts/fetch-commons-images.mjs`. Attribution for every file is in
`public/mock/CREDITS.json`.

`src/data/images.ts` is **the single place any image path is written**. No
component hard-codes a path. Replacing the mock set with real photography is an
edit to that one file plus the files on disk.

Because the set has fewer photographs than the catalogue has products,
`productPools` lists every shot that can *lead* a card for a given `artKind`,
and `data/products.ts` deals each pool out round-robin across that kind's
products. Without it, a "Ses Sistemleri" listing showed the same studio monitor
in three of its eight tiles. Two rules govern what may enter a pool: a photo of
a *person* is not a product photograph, and a photograph that misdescribes the
product (a street-lamp head on a 60 × 60 LED panel) is worse than the same
correct photograph repeated. Files rejected on those grounds are listed in
`images.ts` with the reason.

---

## 6. Motion

Five durations, four easings, nothing else (11 §5, §6, §8). Implemented in CSS
— overlay presence uses `transition-behavior: allow-discrete` on the scrim plus
transform and opacity on the panel — so no animation library ships to the
client.

```css
--duration-instant: 80ms;   --ease-standard: cubic-bezier(.2,0,0,1);
--duration-fast:    140ms;  --ease-enter:    cubic-bezier(.16,1,.3,1);
--duration-normal:  220ms;  --ease-exit:     cubic-bezier(.4,0,1,1);
--duration-slow:    320ms;  --ease-emphasis: cubic-bezier(.22,1,.36,1);
--duration-emphasis:480ms;
```

Exits are faster than entrances (11 §8). Direct input is acknowledged inside
100ms (11 §13). Reduced motion **substitutes** rather than deletes (11 §82):
translation becomes opacity, stagger collapses, scale is removed, durations stay
perceptible so state changes remain legible.

Every animation in this build names the usability problem it solves:

| Motion | Problem solved |
| --- | --- |
| Header compression on scroll | Reclaims vertical space, signals scrolled state |
| Mega menu opacity + 6px rise | Shows where the panel came from |
| Search overlay | Same |
| Product media crossfade on hover | Reveals the second view without a click |
| Cart drawer from the right edge | Spatial origin of the cart button |
| Compare tray from the bottom | Shows selection accumulating |
| Accordion height | Connects trigger to panel |
| Section reveal, first paint only | Orders a long page on arrival |

Forbidden here, whatever ECDOS permits generally: RGB glow, 3D card tilt,
cursor effects, particles, scroll hijacking, parallax, page transitions, ambient
video. Technology design does not require science fiction.

---

## 7. Voice

Turkish. Short, exact, confident, technically literate, never shouting.

**Correct**

```
Teknolojiyi keşfet.
4 × 50 W çıkış gücü, Bluetooth 5.0 bağlantı.
Aynı gün kargo — 16:00'a kadar verilen siparişlerde.
Kurumsal fiyatlar ve proje bazlı teklif.
```

**Never**

```
ÇILGIN İNDİRİM!!!
SON 3 ÜRÜN, ACELE ET!
Dünyanın en kaliteli ürünleri
%100 memnuniyet garantisi
```

Numbers are written the way the industry writes them: `4 × 50 W`, `12 V / 2 A`,
`Bluetooth 5.3`, `IP66`, `4K UHD`, `Cat 6 U/UTP`, `2.500 ₺`. A specification is
a fact, so it is written as a fact, with its unit, and never rounded into
marketing language.

Full rules in `CONTENT_GUIDE_ELECTRONICS.md`.

---

## 8. Quality gate

Every page answers ECDOS 01's five questions before it is considered done:

1. Does it look premium?
2. Is the hierarchy obvious?
3. Is the interface calm?
4. Is the next action clear?
5. Would this page strengthen trust in the brand?

Plus two this project adds:

6. **Could a technician find the exact part, and could a consumer understand it?**
7. **Would the client recognise their own storefront in it?** The brief's test is
   that the customer thinks *"evet, tam istediğim yapı bu — ama çok daha modern"*
   and not *"bu tamamen başka bir site olmuş."* Structure, density and section
   order stay familiar; typography, spacing, cards, imagery and motion are what
   get modernised.

---

## 9. Mock review data

The build shows a star rating and a review count on cards, on the purchase panel
and in the deal block. **All of it is fabricated for visual design only**, and
that is stated at every layer it passes through:

- `deriveRating()` in `src/data/define-product.ts` carries a
  `MOCK REVIEW DATA — VISUAL DESIGN ONLY` banner. It hashes the product id, so
  the same product shows the same figures across builds and the layout can be
  judged with realistic values present.
- The value and the count are drawn from **different halves** of the hash. An
  earlier version took both from `hash % n`, which locked them together and made
  a listing sorted by rating show five identical scores in a row.
- The `<Rating>` component repeats the warning and its `sr-only` text says
  *"örnek veri"*.
- `ProductSEO` has **no rating field**, so `productSchema()` structurally cannot
  emit `aggregateRating` or `review`. `tests/catalog-integrity.test.ts` asserts
  it. Fabricated review structured data is the one thing the brief calls out by
  name, and the type system — not a convention — prevents it.
- Nothing in the build sorts a customer-facing list by rating, because that would
  present invented data as a ranking.

When real reviews arrive, the rating becomes a data field, the mock derivation
is deleted, and `ProductSEO` gains the field that allows the schema — in that
order.
