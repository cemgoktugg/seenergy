> **Superseded — previous project.**
>
> This file documents **SOIRA**, the premium lingerie storefront the ECDOS
> modules in `design-os/` were previously applied to. It does **not** govern
> this build and its brand, palette, typography, sizing and product rules are
> all contradicted by the electronics documentation.
>
> Kept for reference only. The governing documents for this project are:
> [`BRAND_BIBLE_ELECTRONICS.md`](BRAND_BIBLE_ELECTRONICS.md)
>
> Reusable ECDOS modules in [`design-os/`](design-os/) are unedited and remain
> the quality standard.

---

# DESIGN_SYSTEM.md — SOIRA

## Concept: Soft Editorial Luxury
A premium lingerie system built on warmth, restraint and material honesty. The brand should feel intimate rather than exposed, confident rather than loud, and luxurious without imitating legacy fashion houses.

## Brand Attributes
- Elegant
- Feminine
- Modern
- Confident
- Soft
- Tastefully sensual
- Trustworthy

## Visual Formula
70% warm neutral commerce foundation
20% fashion-editorial composition
10% burgundy accent and material close-up

## Colour System
Semantic CSS variables declared in `app/globals.css` and mapped into Tailwind with `@theme inline`.

| Token | Value | Use |
| --- | --- | --- |
| `--background` | `#F7F3EE` | page canvas, warm ivory |
| `--surface` | `#FFFFFF` | cards, panels, drawers |
| `--surface-subtle` | `#F0E9E1` | alternating sections, skeletons |
| `--foreground` | `#1B1512` | primary type, espresso near-black |
| `--muted-foreground` | `#7A6C63` | secondary type, meta |
| `--border` | `#E3DACF` | hairlines, inputs, dividers |
| `--border-strong` | `#CDBFB1` | selected states, focus outlines |
| `--accent` | `#6E2639` | single brand accent, deep burgundy |
| `--accent-hover` | `#571D2C` | accent hover/active |
| `--accent-foreground` | `#FDF8F5` | type on accent |
| `--accent-soft` | `#F2E6E7` | accent tint backgrounds, badges |
| `--success` | `#3F6B4F` | in-stock, confirmation |
| `--danger` | `#9E3B33` | validation, removal |
| `--ink` | `#100C0A` | inverted campaign surfaces |

One accent only. Burgundy carries CTAs, active filters, badges and the free-shipping meter. It never becomes a background wash.

## Type Scale
Display face **Cormorant Garamond**, UI face **Jost**.

| Token | Clamp | Face |
| --- | --- | --- |
| Display XL | `clamp(3rem, 1.2rem + 7.4vw, 7rem)` | serif |
| Display L | `clamp(2.5rem, 1.3rem + 5.2vw, 5rem)` | serif |
| H1 | `clamp(2.25rem, 1.4rem + 3.4vw, 4rem)` | serif |
| H2 | `clamp(1.875rem, 1.3rem + 2.4vw, 3.25rem)` | serif |
| H3 | `clamp(1.375rem, 1.1rem + 1.1vw, 2rem)` | serif |
| Body L | `clamp(1.0625rem, 1rem + 0.3vw, 1.25rem)` | sans |
| Body | `1rem` | sans |
| Small | `0.875rem` | sans |
| Utility | `0.75rem` uppercase, `0.14em` tracking | sans |

Display leading is tight (0.98–1.06). Body leading is comfortable (1.6–1.75). Italic serif is reserved for one accented word inside a heading, never a whole paragraph. Uppercase is limited to utility labels, eyebrows and buttons.

## Spacing
Base rhythm 4px. Section rhythm: 72px mobile, 112px tablet, 144px desktop. Container max width 1560px with 20/32/56px gutters.

## Media Ratios
- Product card and gallery: 4:5
- Portrait campaign: 2:3
- Editorial landscape: 16:9
- Category tile: 3:4
- Magazine card: 3:2
- Lookbook: 4:5 mobile, 16:10 desktop

Every image reserves its aspect ratio to prevent layout shift.

## Radii, Borders, Shadows
- Radius: `2px` default, `999px` only for pills/chips, `0` for full-bleed media
- Borders: 1px `--border`; selected controls use `--foreground`
- Shadows: only for floating layers (drawer, modal, sticky bar). No decorative card shadows.

## Components
Every component defines default, hover, focus-visible, active, selected, disabled, loading and empty states where relevant.

AnnouncementBar · SiteHeader · DesktopNavigation · MegaMenu · MobileMenu · SearchOverlay · CartDrawer · WishlistButton · ProductCard · ProductGrid · ProductRail · ColorSwatch · SizeSelector · BraSizeSelector · QuantitySelector · FilterPanel · FilterDrawer · SortMenu · ActiveFilterChips · EditorialHero · EditorialSplit · CategoryCard · MoodGrid · LookbookHotspot · SectionHeader · SizeGuideModal · Accordion · Modal · Drawer · Toast · NewsletterForm · EmptyState · ProductSkeleton · Footer

## Buttons
- Primary: solid `--foreground`, 2px radius, 44px min height, uppercase utility label
- Accent: solid `--accent` for commercial moments (add to cart, checkout)
- Secondary: 1px border on transparent
- Ghost/link: underline offset animation
- Never large pill buttons by default

## Product Card
Image dominant at 4:5 · calm name · scannable price with old/new hierarchy · colour swatches as secondary information · wishlist button top-right, never covering the garment · quick add revealed on hover/focus without layout shift · hover secondary image only on pointer devices · a single optional badge.

## Editorial Layout
Offset text blocks, oversized serif headlines, cropped campaign photography, alternating image/text, controlled overlap on large screens only. Mobile reflows into a clear linear story.

## Content Tone
Turkish copy is short, warm, confident and product-literate.

Examples:
- “Kendin için seç.”
- “Teninle uyumlu, gün boyu unutulan hafiflik.”
- “Doğru kalıp, iyi hissetmenin başlangıcı.”
- “Gece tonları, ince dantel detayları.”
- “Görünümünü tamamla.”

Avoid: empty luxury clichés, exclamation marks, artificial urgency, machine-translated phrasing, and any claim about health, body correction or guaranteed fit.
