# E-Commerce Design Operating System

# Module 06 — Layout & Grid System

---

## 1. Purpose

The layout and grid system defines how content is structured across every page and viewport.

It controls:

* alignment
* spacing
* page rhythm
* visual hierarchy
* responsive behavior
* product density
* editorial composition
* consistency
* usability
* perceived quality

A premium interface must never feel randomly assembled.

Every section, component, image, text block, and control must align to a clear spatial system.

---

## 2. Core Philosophy

The layout system must feel:

* calm
* spacious
* intentional
* flexible
* product-focused
* responsive
* editorial
* balanced
* consistent

Premium design is not created by placing more elements on the page.

It is created by arranging fewer elements with greater precision.

---

## 3. Layout Principles

### 3.1 Structure Before Decoration

Layout must establish hierarchy before color, motion, or visual effects are added.

### 3.2 Whitespace Is Functional

Whitespace improves:

* scanning
* comprehension
* product focus
* visual hierarchy
* perceived quality
* touch usability

Whitespace must never be treated as wasted space.

### 3.3 Alignment Creates Trust

Elements that appear related must align intentionally.

Misalignment reduces perceived quality even when users cannot explain why.

### 3.4 Density Must Match Context

Editorial pages may breathe more.

Commerce pages may use higher density.

Checkout pages must prioritize clarity.

Mobile layouts must remain efficient without becoming cramped.

### 3.5 Responsive Means Recomposition

Responsive design is not simply shrinking desktop layouts.

Layouts must recompose based on:

* screen width
* interaction method
* content priority
* reading order
* touch behavior
* image importance

---

## 4. Spatial Architecture

The system is built on six layers:

```text
1. Viewport
2. Page container
3. Section container
4. Grid
5. Component spacing
6. Internal element spacing
```

Each layer must use documented values.

Random margins and padding values are not allowed.

---

## 5. Base Spacing Unit

Use a 4px base unit.

All spacing values should normally be divisible by 4.

Recommended scale:

```text
0px
4px
8px
12px
16px
20px
24px
32px
40px
48px
56px
64px
80px
96px
112px
128px
160px
192px
```

Avoid arbitrary spacing such as:

```text
13px
27px
38px
71px
```

unless there is a documented optical adjustment.

---

## 6. Spacing Tokens

Recommended semantic tokens:

```css
:root {
  --space-0: 0rem;
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-14: 3.5rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;
  --space-28: 7rem;
  --space-32: 8rem;
  --space-40: 10rem;
  --space-48: 12rem;
}
```

---

## 7. Semantic Spacing Tokens

Raw spacing values should be mapped to semantic roles.

Recommended:

```text
Space Inline XS
Space Inline SM
Space Inline MD
Space Inline LG

Space Stack XS
Space Stack SM
Space Stack MD
Space Stack LG

Section Gap SM
Section Gap MD
Section Gap LG
Section Gap XL
```

Example:

```css
:root {
  --space-inline-sm: var(--space-3);
  --space-inline-md: var(--space-4);
  --space-inline-lg: var(--space-6);

  --space-stack-sm: var(--space-2);
  --space-stack-md: var(--space-4);
  --space-stack-lg: var(--space-6);

  --section-gap-sm: var(--space-16);
  --section-gap-md: var(--space-24);
  --section-gap-lg: var(--space-32);
  --section-gap-xl: var(--space-40);
}
```

---

## 8. Viewport Breakpoints

Use a mobile-first breakpoint system.

Recommended breakpoints:

```text
xs: 375px
sm: 480px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1440px
3xl: 1728px
```

Breakpoints should represent layout changes, not specific devices.

Do not add breakpoints without a real compositional need.

---

## 9. Container System

Use a consistent container strategy.

Recommended container tiers:

```text
Compact Container
Content Container
Standard Container
Wide Container
Full-Bleed Container
```

### Compact Container

Used for:

* forms
* editorial text
* account pages
* size guides
* checkout summaries

Recommended width:

```text
560–720px
```

### Content Container

Used for:

* articles
* brand stories
* long descriptions

Recommended width:

```text
720–900px
```

### Standard Container

Used for:

* most page content
* category pages
* product grids
* navigation

Recommended width:

```text
1200–1440px
```

### Wide Container

Used for:

* large editorial sections
* premium product grids
* campaign pages

Recommended width:

```text
1440–1600px
```

### Full-Bleed

Used for:

* hero imagery
* campaign banners
* editorial photography
* selected galleries

---

## 10. Container Gutters

Recommended page gutters:

```text
Mobile: 16px
Large mobile: 20px
Tablet: 24px
Small desktop: 32px
Desktop: 40px
Wide desktop: 48–64px
```

Example:

```css
.page-container {
  width: min(100% - 2rem, 90rem);
  margin-inline: auto;
}

@media (min-width: 768px) {
  .page-container {
    width: min(100% - 3rem, 90rem);
  }
}

@media (min-width: 1280px) {
  .page-container {
    width: min(100% - 5rem, 96rem);
  }
}
```

---

## 11. Grid System

Use a 12-column grid for flexible desktop compositions.

Recommended:

```text
Mobile: 4 columns
Tablet: 8 columns
Desktop: 12 columns
```

### Mobile Grid

```text
Columns: 4
Gutter: 12–16px
Outer margin: 16–20px
```

### Tablet Grid

```text
Columns: 8
Gutter: 16–24px
Outer margin: 24–32px
```

### Desktop Grid

```text
Columns: 12
Gutter: 24–32px
Outer margin: 40–64px
```

---

## 12. CSS Grid Example

```css
.layout-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  .layout-grid {
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .layout-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 2rem;
  }
}
```

---

## 13. Section Spacing

Recommended vertical spacing between major sections:

```text
Mobile: 64–88px
Tablet: 88–112px
Desktop: 112–160px
```

Functional pages may use tighter spacing.

Editorial pages may use larger spacing.

### Commerce Page Guidance

```text
Product grid sections: 64–112px
Filter-to-grid spacing: 24–40px
Product detail sections: 72–128px
Cart sections: 40–80px
Checkout sections: 32–64px
```

---

## 14. Internal Section Structure

Recommended structure:

```text
Section label
↓
Section title
↓
Supporting copy
↓
Primary content
↓
Optional action
```

Recommended spacing:

```text
Label to title: 8–12px
Title to description: 12–20px
Description to content: 24–48px
Content to action: 24–40px
```

---

## 15. Vertical Rhythm

Pages must maintain a predictable rhythm.

Recommended sequence:

```text
Header
↓
Hero or page intro
↓
Primary discovery
↓
Product section
↓
Editorial section
↓
Secondary product section
↓
Trust or content section
↓
Newsletter
↓
Footer
```

Avoid repeating identical product grids without visual relief.

Use editorial blocks to create rhythm.

---

## 16. Horizontal Rhythm

Horizontal spacing must remain consistent across:

* navigation
* filters
* buttons
* cards
* form fields
* product options
* icon groups

Related controls should use tighter gaps.

Unrelated groups should use larger gaps.

Recommended:

```text
Icon and label: 8px
Inline controls: 8–12px
Button groups: 12–16px
Navigation groups: 24–40px
Section actions: 24–32px
```

---

## 17. Product Grid System

Product grids are central to ecommerce layout.

Recommended column counts:

```text
Small mobile: 2 columns
Large mobile: 2 columns
Tablet: 3 columns
Small desktop: 3–4 columns
Desktop: 4 columns
Wide desktop: 4–5 columns
```

Do not use too many columns if product information becomes unreadable.

---

## 18. Product Grid Gaps

Recommended:

```text
Mobile horizontal gap: 12–16px
Mobile vertical gap: 28–40px

Tablet horizontal gap: 20–24px
Tablet vertical gap: 40–56px

Desktop horizontal gap: 24–32px
Desktop vertical gap: 56–72px
```

Vertical gaps should usually be larger than horizontal gaps.

---

## 19. Product Card Width

Recommended minimum width:

```text
Mobile: 150px
Tablet: 210px
Desktop: 240px
```

Product images must remain large enough to communicate quality and detail.

Do not force five-column layouts when cards become too narrow.

---

## 20. Product Image Ratios

Recommended ratios:

```text
Fashion products: 3:4 or 4:5
Editorial product cards: 2:3
Accessories: 1:1 or 4:5
Lifestyle cards: 16:9, 3:2, or 2:3
```

Use one dominant ratio per product grid.

Do not mix random ratios inside the same grid.

---

## 21. Category Grid

Category cards may use:

```text
2-column mobile
2–3-column tablet
3–4-column desktop
```

Premium category grids should prioritize image size over card quantity.

Recommended patterns:

* equal grid
* one large plus two small
* alternating portrait and landscape
* asymmetrical editorial composition

---

## 22. Hero Layout System

Hero layout should support:

* clear brand message
* strong campaign imagery
* visible CTA
* intentional crop
* mobile readability

Recommended hero types:

```text
Full-Bleed Image Hero
Split Hero
Centered Editorial Hero
Image-with-Overlay Hero
Text-and-Media Hero
```

---

## 23. Full-Bleed Hero

Recommended dimensions:

```text
Mobile: 70–90svh
Desktop: 80–100svh
```

Use `svh` or `dvh` carefully to avoid mobile browser height issues.

Text must remain readable across image crops.

---

## 24. Split Hero

Desktop:

```text
Media: 55–65%
Content: 35–45%
```

Mobile:

```text
Image first
Content below
```

or

```text
Text overlay with protected contrast area
```

Do not force side-by-side layouts on narrow screens.

---

## 25. Hero Safe Zones

Campaign imagery should include safe zones for:

* title
* body copy
* buttons
* navigation overlap
* mobile crop

Do not place text directly over faces or critical product details.

Use art-directed responsive images when necessary.

---

## 26. Editorial Layout System

Editorial layouts may intentionally break the standard grid.

Allowed techniques:

* offset columns
* image overlap
* asymmetric margins
* varied image sizes
* large text blocks
* controlled negative space

These techniques must remain aligned to the base grid.

Editorial freedom does not mean random positioning.

---

## 27. Asymmetry Rules

Asymmetry must feel balanced.

Use:

* one dominant visual
* one supporting text block
* controlled offset
* visual counterweight
* clear reading order

Avoid:

* unrelated floating elements
* arbitrary overlaps
* decorative misalignment
* layouts that collapse poorly on mobile

---

## 28. Product Detail Layout

Desktop recommendation:

```text
Gallery: 55–65%
Purchase panel: 35–45%
```

or

```text
Gallery: 7 columns
Purchase panel: 5 columns
```

Purchase panel may be sticky.

Sticky behavior must stop before footer or recommendation sections.

---

## 29. Product Gallery Layout

Recommended desktop patterns:

```text
Two-column image grid
Large image plus thumbnails
Vertical image stack
Mixed editorial gallery
```

Mobile:

```text
Swipeable single-column gallery
```

Do not load every large image above the fold.

---

## 30. Product Purchase Panel

Recommended maximum content width:

```text
420–520px
```

Keep:

* product title
* price
* variants
* primary CTA
* delivery information

within a compact, scannable structure.

Avoid over-wide purchase panels.

---

## 31. Filter Layout

Desktop options:

```text
Sticky left sidebar
Horizontal toolbar with drawer
Top filter bar
```

Recommended sidebar width:

```text
240–320px
```

Product grid must retain sufficient width.

Mobile:

```text
Bottom sheet or full-screen filter drawer
```

---

## 32. Search Layout

Search overlay or page should prioritize:

1. Search input
2. Suggestions
3. Categories
4. Products
5. Empty state

Recommended search result grid:

```text
Mobile: 2 columns
Tablet: 3 columns
Desktop: 4 columns
```

Avoid cramming too many results into the initial view.

---

## 33. Cart Layout

Desktop full cart:

```text
Cart items: 65–70%
Order summary: 30–35%
```

Mobile:

```text
Single column
Order summary below items
Sticky checkout action when appropriate
```

Cart drawer width:

```text
Mobile: 100%
Tablet: 420–480px
Desktop: 440–520px
```

---

## 34. Checkout Layout

Checkout must prioritize clarity over editorial expression.

Recommended desktop:

```text
Form: 60–65%
Order summary: 35–40%
```

Recommended content width:

```text
1100–1280px
```

Avoid wide empty forms stretching across the viewport.

---

## 35. Form Layout

Forms should use:

```text
Single column on mobile
One or two columns on desktop
```

Use two columns only for logically paired fields.

Examples:

* first name / last name
* city / district
* expiration / security code

Do not place long address fields in narrow columns.

---

## 36. Navigation Layout

Header layout must define:

* logo zone
* primary navigation
* utility actions
* mobile actions

Desktop header recommended height:

```text
64–88px
```

Mobile header recommended height:

```text
56–72px
```

Header content must align with page container gutters.

---

## 37. Mega Menu Layout

Recommended structure:

```text
Navigation groups: 55–70%
Editorial media: 30–45%
```

Use 3–5 clear groups.

Avoid marketplace-style mega menus with excessive categories.

Mega menu content should align with the main page grid.

---

## 38. Footer Layout

Recommended desktop:

```text
4–6 columns
```

Mobile:

```text
Accordion sections
Newsletter first or near top
```

Footer should feel substantial but not overcrowded.

Maintain clear grouping and spacing.

---

## 39. Magazine and Editorial Article Layout

Recommended article content width:

```text
640–760px
```

Supporting media may extend beyond the text column.

Article layout may use:

* full-width images
* pull quotes
* offset captions
* related product blocks
* editorial side notes

Maintain a clear reading path.

---

## 40. Lookbook Layout

Lookbook pages may use:

* full-screen imagery
* staggered editorial grid
* shoppable hotspots
* collection text
* related product rails

Mobile hotspots must not overlap excessively.

Provide accessible product lists as an alternative.

---

## 41. Responsive Recomposition

At each breakpoint, review:

* reading order
* content priority
* visual balance
* interaction type
* image crop
* control placement
* text width
* product density

Do not only modify column count.

---

## 42. Mobile Layout Rules

Required:

* 16–20px page gutters
* no horizontal overflow
* clear tap targets
* stable sticky controls
* readable product cards
* compact but calm spacing
* bottom sheets for filters
* full-width primary CTA where appropriate
* safe-area support

Use:

```css
padding-bottom: env(safe-area-inset-bottom);
```

when needed.

---

## 43. Tablet Layout Rules

Tablet must be treated as a distinct layout.

Do not let tablet inherit unsuitable desktop spacing.

Review:

* navigation density
* grid columns
* hero crop
* filter behavior
* cart drawer width
* typography wrapping
* image proportions

---

## 44. Wide Screen Rules

On very wide screens:

* do not stretch content infinitely
* preserve comfortable reading widths
* maintain grid integrity
* increase outer margins
* enlarge imagery selectively
* avoid excessive empty center space

Wide layouts should feel cinematic, not sparse.

---

## 45. Sticky Elements

Allowed sticky elements:

* header
* filter controls
* purchase panel
* checkout summary
* mobile add-to-cart bar

Rules:

* do not create multiple competing sticky layers
* account for header height
* provide clear boundaries
* test on short screens
* prevent content obstruction
* respect safe areas

---

## 46. Layer and Z-Index System

Use a documented z-index scale.

Recommended:

```css
:root {
  --z-base: 0;
  --z-raised: 10;
  --z-sticky: 20;
  --z-header: 30;
  --z-dropdown: 40;
  --z-drawer: 50;
  --z-modal: 60;
  --z-toast: 70;
  --z-tooltip: 80;
}
```

Avoid arbitrary values such as:

```text
999
9999
99999
```

---

## 47. Overlap Rules

Overlaps may be used for premium editorial compositions.

Allowed:

* image over section boundary
* text panel partially overlapping media
* controlled card overlap

Requirements:

* no important content hidden
* no mobile collision
* no unreadable text
* no overflow bugs
* alignment remains intentional

---

## 48. Aspect Ratio System

Define reusable aspect ratio tokens.

Recommended:

```css
:root {
  --ratio-square: 1 / 1;
  --ratio-product: 4 / 5;
  --ratio-portrait: 2 / 3;
  --ratio-landscape: 3 / 2;
  --ratio-wide: 16 / 9;
  --ratio-cinematic: 21 / 9;
}
```

Use consistent ratios for related components.

---

## 49. Image Cropping Rules

Use `object-fit: cover` when appropriate.

Use `object-position` intentionally.

Do not allow default center crop to hide:

* model faces
* product details
* campaign text
* garment structure

Art-direct images per breakpoint when needed.

---

## 50. Content Density Levels

Define three density levels:

```text
Editorial
Standard
Compact
```

### Editorial

Used for:

* campaigns
* storytelling
* lookbooks

Characteristics:

* large spacing
* large imagery
* fewer elements

### Standard

Used for:

* category pages
* product pages
* search

Characteristics:

* balanced density
* clear hierarchy
* moderate spacing

### Compact

Used for:

* cart
* checkout
* account
* utility panels

Characteristics:

* efficient
* highly scannable
* controlled spacing

---

## 51. Component Width Rules

Recommended:

```text
Button: content width or full width by context
Input: full width within form group
Modal: 360–720px
Drawer: 420–520px desktop
Tooltip: 180–320px
Toast: 280–420px
Accordion: container width
Newsletter form: 420–640px
```

Avoid inconsistent widths for similar components.

---

## 52. Modal Layout

Recommended modal widths:

```text
Small: 360–440px
Medium: 520–640px
Large: 720–960px
```

Mobile:

```text
Near full-screen or bottom sheet
```

Modal content must not exceed viewport height without internal scrolling.

---

## 53. Bottom Sheet Layout

Mobile bottom sheets should include:

* drag indicator when appropriate
* title
* close action
* scrollable body
* sticky actions
* safe-area padding

Recommended maximum height:

```text
85–92dvh
```

---

## 54. Drawer Layout

Drawers should not feel like narrow pages.

Use clear zones:

```text
Header
Scrollable content
Sticky footer action
```

Avoid excessive nested scrolling.

---

## 55. Skeleton Layout

Skeletons must match final geometry.

They should preserve:

* image ratio
* text line count
* button size
* card height
* grid spacing

Never use generic horizontal bars that do not resemble the final component.

---

## 56. Empty State Layout

Empty states should use:

* compact visual or icon
* clear heading
* short explanation
* one primary action
* optional secondary action

Do not center extremely large empty areas unless context supports it.

---

## 57. Error State Layout

Error states must appear near the affected content.

Page-level errors may use:

* clear title
* concise explanation
* recovery action
* support path

Avoid pushing errors into unrelated corners.

---

## 58. Loading Layout Stability

Prevent layout shift by reserving space for:

* images
* banners
* navigation
* product cards
* price blocks
* recommendations

Use fixed aspect ratios and known dimensions.

---

## 59. Alignment Rules

All components must align to one of:

* page grid
* section grid
* content column
* media edge
* optical center

Avoid arbitrary alignment.

Centered content should be truly centered or optically adjusted intentionally.

---

## 60. Optical Alignment

Some elements require optical correction:

* icons next to text
* circular buttons
* serif headlines
* asymmetric logos
* play icons
* arrow icons

Optical adjustments should be small and documented.

---

## 61. Grid Exceptions

Breaking the grid is allowed only when it strengthens:

* editorial impact
* product storytelling
* campaign hierarchy
* visual rhythm

Any grid exception must still:

* respond correctly
* preserve readability
* remain accessible
* collapse cleanly
* avoid overlap errors

---

## 62. Tailwind Layout Tokens

Recommended Tailwind extension:

```ts
export default {
  theme: {
    extend: {
      screens: {
        xs: "375px",
        sm: "480px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
        "3xl": "1728px",
      },
      maxWidth: {
        compact: "45rem",
        content: "56rem",
        standard: "90rem",
        wide: "100rem",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
      },
    },
  },
};
```

Do not add excessive custom spacing values.

---

## 63. Semantic Layout Utilities

Recommended reusable utilities:

```text
page-container
page-container-wide
content-container
section-spacing
section-spacing-compact
layout-grid
product-grid
editorial-grid
stack-sm
stack-md
stack-lg
cluster-sm
cluster-md
cluster-lg
```

Use semantic utilities to improve consistency.

---

## 64. Layout Component Examples

Recommended shared components:

```text
Container
Section
Stack
Cluster
Grid
Split
SidebarLayout
Bleed
AspectRatio
StickyPanel
```

These primitives should reduce repeated layout code.

---

## 65. Stack Primitive

A stack manages vertical spacing.

Example:

```tsx
<Stack gap="lg">
  <SectionHeader />
  <ProductGrid />
</Stack>
```

Avoid manually adding margins to every child.

---

## 66. Cluster Primitive

A cluster manages horizontal wrapping groups.

Used for:

* buttons
* filters
* tags
* navigation
* product options

Example behavior:

```text
display: flex
flex-wrap: wrap
align-items: center
gap: token
```

---

## 67. Split Primitive

A split supports two-column compositions.

Used for:

* hero
* product detail
* editorial section
* checkout
* cart

It must support configurable ratios and collapse order.

---

## 68. Sidebar Layout Primitive

Used for:

* category filters
* account navigation
* help center
* documentation

Recommended desktop sidebar width:

```text
240–320px
```

Mobile sidebar becomes:

* drawer
* accordion
* horizontal tabs

depending on context.

---

## 69. Layout Performance

Avoid layout patterns that cause:

* large reflows
* repeated measurement
* unnecessary JavaScript positioning
* excessive sticky calculations
* unstable image sizing
* nested scroll containers

Prefer CSS Grid and Flexbox.

Use JavaScript only when layout cannot be expressed reliably in CSS.

---

## 70. Layout Accessibility

Layout must preserve:

* logical DOM order
* correct reading order
* keyboard sequence
* heading hierarchy
* zoom support
* text reflow
* orientation support

Do not use visual reordering that creates an illogical keyboard or screen-reader sequence.

---

## 71. Zoom and Reflow

The layout should remain usable at:

```text
200% browser zoom
320 CSS px viewport width
```

Content must not require horizontal scrolling except for intentionally scrollable components.

---

## 72. Safe Areas

Support safe areas for:

* sticky mobile bars
* drawers
* full-screen menus
* bottom sheets
* landscape mobile layouts

Use:

```css
padding-inline: max(1rem, env(safe-area-inset-left));
padding-bottom: max(1rem, env(safe-area-inset-bottom));
```

when appropriate.

---

## 73. Localization and Layout

Layouts must support longer text.

Test:

* Turkish product names
* German category names
* English promotional labels
* longer button copy
* currency differences

Do not design only for short English strings.

---

## 74. Do Examples

### Do

* Use a consistent container system.
* Use documented spacing values.
* Recompose layouts at breakpoints.
* Preserve product image size.
* Use large section spacing selectively.
* Keep reading widths controlled.
* Use grid exceptions intentionally.
* Test tablet independently.
* Reserve space for images.
* Maintain logical DOM order.
* Use semantic layout primitives.
* Keep sticky layers controlled.

---

## 75. Don’t Examples

### Don’t

* Add random margins.
* Use every possible breakpoint.
* Stretch content across ultra-wide screens.
* Shrink desktop layouts mechanically.
* Mix multiple unrelated grid systems.
* Use five product columns when cards become unreadable.
* Place text over critical image areas.
* Use JavaScript for simple layout.
* Create nested scrolling without need.
* Use arbitrary z-index values.
* Break DOM order for visual effect.
* Ignore mobile safe areas.
* Overlap components without testing.

---

## 76. Layout Acceptance Criteria

A page is approved only if:

* all content aligns to a defined grid
* page gutters are consistent
* vertical rhythm is clear
* section spacing matches page purpose
* mobile is intentionally composed
* tablet is tested
* desktop remains balanced
* wide screens do not overstretch content
* product cards retain useful size
* reading widths remain comfortable
* images use consistent aspect ratios
* sticky elements do not conflict
* no unexpected horizontal overflow exists
* layout remains usable at 200% zoom
* DOM order remains logical
* skeletons preserve geometry
* no random spacing values exist
* layout primitives are reused

---

## 77. AI Implementation Rules

When an AI agent creates or modifies a page, it must:

1. Use the existing container system.
2. Use approved spacing tokens.
3. Choose a documented grid pattern.
4. Compose mobile first.
5. Test tablet separately.
6. Preserve logical DOM order.
7. Avoid arbitrary margins and widths.
8. Reserve image dimensions.
9. Limit sticky elements.
10. Complete the layout self-review checklist.

---

## 78. Self-Review Checklist

Before finalizing layout, verify:

```text
[ ] Is the page using an approved container?

[ ] Are gutters consistent?

[ ] Are all major elements aligned?

[ ] Is section spacing appropriate?

[ ] Is the page rhythm clear?

[ ] Are product cards large enough?

[ ] Are product grid gaps consistent?

[ ] Are image ratios intentional?

[ ] Is mobile independently composed?

[ ] Is tablet tested?

[ ] Is desktop balanced?

[ ] Are wide screens controlled?

[ ] Are text widths readable?

[ ] Are sticky elements non-conflicting?

[ ] Are safe areas supported?

[ ] Is DOM order logical?

[ ] Does keyboard order match visual order?

[ ] Are overlays and drawers sized correctly?

[ ] Do skeletons match final geometry?

[ ] Is layout shift minimized?

[ ] Are there arbitrary spacing values?

[ ] Are z-index values tokenized?

[ ] Is there any horizontal overflow?

[ ] Does the page work at 200% zoom?

[ ] Does the layout feel calm and premium?
```

---

## 79. Final Principle

A premium layout system should feel invisible.

The user should notice:

* products
* hierarchy
* imagery
* ease of use
* visual rhythm

They should not notice the grid itself.

When uncertain:

```text
Align.

Simplify.

Increase breathing room.

Protect reading width.

Preserve product scale.

Recompose instead of shrinking.
```
