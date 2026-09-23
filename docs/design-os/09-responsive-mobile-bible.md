# E-Commerce Design Operating System

# Module 09 — Responsive & Mobile Experience Bible

## Premium Commerce Across Every Screen

---

# 1. Purpose

This module defines how the ecommerce experience adapts across:

* small mobile devices
* standard mobile devices
* large mobile devices
* tablets
* laptops
* desktop screens
* ultra-wide displays
* touch devices
* pointer devices
* portrait orientation
* landscape orientation

Responsive design must not be treated as a final adjustment.

It is a foundational design requirement.

The interface must feel intentionally designed at every size.

---

# 2. Core Philosophy

Responsive design is not:

```text
Desktop
↓
Shrunk desktop
```

Responsive design is:

```text
Same brand
Same purpose
Same information
Different composition
Different interaction
Different priority
```

Each viewport must provide the best possible experience for its context.

---

# 3. Responsive Priorities

When adapting a layout, prioritize:

```text
1. Content clarity
2. Primary commerce actions
3. Touch and keyboard usability
4. Product-image quality
5. Reading order
6. Performance
7. Visual rhythm
8. Decorative composition
```

Never preserve a decorative desktop composition if it harms mobile usability.

---

# 4. Device-Agnostic Principle

Do not design for specific device models.

Design for layout pressure.

Breakpoints should respond to:

* content wrapping
* card width
* navigation density
* form usability
* image composition
* interaction type
* available height

Do not add a breakpoint only because a new phone model exists.

---

# 5. Breakpoint System

Recommended reference breakpoints:

```text
xs: 320px
sm: 375px
sm+: 390px
md-mobile: 430px
tablet: 768px
laptop: 1024px
desktop: 1280px
large-desktop: 1440px
wide: 1728px
ultra-wide: 1920px+
```

These are test targets, not mandatory CSS breakpoints.

The actual breakpoint should appear where the layout needs to change.

---

# 6. Primary Test Widths

Every major page must be reviewed at:

```text
320px
375px
390px
430px
768px
1024px
1280px
1440px
1728px
```

Critical commerce pages must also be tested at:

```text
360px landscape
667px landscape
812px landscape
```

---

# 7. Mobile-First Implementation

Base styles should target the smallest supported viewport.

Then enhance progressively.

Preferred:

```css
.component {
  /* mobile foundation */
}

@media (min-width: 768px) {
  /* tablet enhancement */
}

@media (min-width: 1024px) {
  /* desktop composition */
}
```

Avoid building desktop first and overriding everything for mobile.

---

# 8. Minimum Supported Width

The layout must remain usable at:

```text
320 CSS pixels
```

At this width:

* no page-level horizontal scrolling
* no clipped purchase action
* no unreadable product cards
* no overlapping labels
* no hidden close button
* no inaccessible navigation
* no broken form fields

Intentional horizontal scroll is allowed only for components such as:

* product rails
* tabs
* swatch rows
* image galleries

---

# PART I — GLOBAL RESPONSIVE SYSTEM

# 9. Page Gutters

Recommended page gutters:

```text
320–374px: 16px
375–479px: 16–20px
480–767px: 20–24px
768–1023px: 24–32px
1024–1279px: 32–40px
1280–1439px: 40–48px
1440px+: 48–64px
```

Do not allow component-specific gutters to conflict with the page container.

---

# 10. Container Widths

Recommended:

```text
Compact content: 560–720px
Editorial text: 680–760px
Standard commerce: 1200–1440px
Wide editorial: 1440–1600px
```

On ultra-wide displays, increase outer margins rather than stretching every component.

---

# 11. Vertical Spacing

Recommended section spacing:

```text
Small mobile: 56–72px
Large mobile: 64–88px
Tablet: 80–112px
Laptop: 96–128px
Desktop: 112–160px
Wide desktop: 128–176px
```

Functional pages may use tighter spacing.

Examples:

```text
Cart
Checkout
Account
Search results
Filters
```

---

# 12. Responsive Typography

Typography should scale fluidly but remain controlled.

Example:

```css
.hero-title {
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  line-height: 0.98;
}
```

Rules:

* define minimum and maximum values
* test Turkish words
* prevent one-word orphan lines where possible
* do not shrink body text below comfortable reading size
* do not use desktop display sizes on mobile

---

# 13. Text Width

Recommended maximum line lengths:

```text
Body: 55–75 characters
Editorial introduction: 45–65 characters
Product description: 45–70 characters
Mobile supporting copy: 28–42 characters per line
```

Do not allow body copy to span the full desktop viewport.

---

# 14. Responsive Recomposition Checklist

At each major breakpoint review:

```text
Reading order
Component order
Image crop
Column count
CTA position
Text wrapping
Sticky behavior
Touch target size
Navigation pattern
Filter pattern
Modal pattern
Loading geometry
Footer behavior
```

Do not review only width and spacing.

---

# PART II — MOBILE EXPERIENCE

# 15. Mobile UX Principle

Mobile is a primary shopping environment.

It must feel:

```text
Fast
Direct
Touch-friendly
Visually rich
Easy to scan
Easy to recover
```

Mobile should not feel like a simplified or incomplete version of desktop.

---

# 16. Thumb Zones

Primary actions should remain within comfortable reach.

High-priority mobile actions include:

```text
Add to cart
Checkout
Apply filters
Close drawer
Select size
Open cart
Search
```

Avoid placing critical actions only at the top-right corner of long pages.

---

# 17. Touch Targets

Minimum recommended target:

```text
44 × 44px
```

Preferred for primary commerce controls:

```text
48 × 48px
```

Visual icons may remain smaller inside the target.

Do not place two small actions too close together.

Recommended minimum gap:

```text
8px
```

---

# 18. Mobile Page Header

Recommended height:

```text
56–72px
```

Common structures:

```text
Menu | Logo | Search | Cart
```

or:

```text
Logo | Search | Cart | Menu
```

Use one structure consistently.

Do not squeeze full desktop navigation into the header.

---

# 19. Mobile Navigation

Preferred patterns:

```text
Full-screen menu
Full-height drawer
Drill-down navigation
Accordion navigation
```

Avoid:

```text
Tiny dropdown menus
Hover-dependent submenus
Three-column mobile mega menu
```

Primary categories should remain visible near the top.

---

# 20. Mobile Search

Search should open as:

```text
Full-screen search
or
Dedicated search page
```

The input should receive focus immediately.

The keyboard must not cover:

* clear action
* suggestions
* submit action
* close action

---

# 21. Mobile Product Grid

Recommended:

```text
320–430px: 2 columns
```

One-column grids may be used for:

* editorial products
* premium campaign collections
* unusually detailed product cards

Recommended gaps:

```text
Horizontal: 12–16px
Vertical: 28–40px
```

Cards must not become too narrow.

---

# 22. Mobile Product Card

Required:

* clear product image
* readable name
* readable price
* accessible wishlist
* no hover dependency

Optional:

* persistent compact quick add
* color count
* one badge

Avoid:

* multiple overlay controls
* tiny swatches
* three-line product metadata
* large promotional labels
* text over product images

---

# 23. Mobile Product Rail

Use:

* horizontal scrolling
* scroll snap
* partial next-card visibility
* no automatic rotation

Recommended card width:

```text
72–84% of viewport for editorial rail
42–48% of viewport for product rail
```

Do not make rails so wide that only one product is visible without design reason.

---

# 24. Mobile Hero

Recommended height:

```text
70–90svh
```

Rules:

* use mobile-specific image crop
* protect text contrast
* limit headline to 2–4 lines
* keep actions visible
* avoid placing content under browser chrome
* test short-height screens

A hero should not require scrolling before the CTA becomes visible.

---

# 25. Mobile Hero CTA

Use:

* full-width button
* stacked actions
* high-contrast primary action

Recommended spacing:

```text
12px between stacked buttons
```

Do not use two visually equal CTAs when one action is primary.

---

# 26. Mobile Image Art Direction

Desktop and mobile often need different crops.

Use separate assets or responsive art direction when:

* face is lost
* product is cropped incorrectly
* text overlaps the subject
* important garment detail disappears
* image becomes visually empty

Do not rely on `object-position: center` for every campaign image.

---

# 27. Mobile PDP Structure

Recommended order:

```text
Gallery
Product name
Price
Color
Size
Size help
Fit information
Primary CTA
Delivery and returns
Product details
Complete the look
Reviews
Related products
Recently viewed
```

Purchase-critical content must appear before long editorial content.

---

# 28. Mobile Product Gallery

Recommended:

* horizontal swipe
* clear image counter
* tap to zoom
* optional thumbnail strip
* visible media type

Avoid:

* tiny pagination dots as the only indicator
* autoplay video
* vertical image stack with ten full-resolution images above purchase controls

---

# 29. Mobile Variant Selection

Size and color controls must:

* wrap cleanly
* remain at least 44px
* show selected state clearly
* show unavailable state clearly
* avoid horizontal clipping

For many options, use:

```text
Scrollable row
or
Structured wrapping grid
```

Do not force every option into a single row.

---

# 30. Mobile Bra Size Selection

Recommended:

```text
Bant ölçüsü
[70] [75] [80] [85]

Kup
[A] [B] [C] [D]
```

Requirements:

* groups visually separated
* selected combined size visible
* invalid combinations disabled
* size guide nearby
* no spreadsheet-style layout

---

# 31. Sticky Mobile Add-to-Cart

Recommended height:

```text
64–80px plus safe area
```

Structure:

```text
Price | Add to Cart
```

or:

```text
Selected size | Add to Cart
```

Display only when the original action is no longer visible.

Hide during:

* modal
* bottom sheet
* cart drawer
* on-screen keyboard
* checkout
* full-screen gallery

---

# 32. Mobile Cart Drawer

Preferred:

```text
Full-screen
```

Structure:

```text
Sticky header
Scrollable items
Sticky summary and checkout
```

Do not use a narrow desktop drawer on small screens.

---

# 33. Mobile Filters

Preferred:

```text
Full-screen filter drawer
```

or:

```text
Large bottom sheet
```

Include:

```text
Filter title
Reset
Scrollable groups
Sticky apply action
```

Example:

```text
24 ürünü göster
```

---

# 34. Mobile Sorting

Use a bottom sheet or full-width radio list.

Do not use a tiny native select if the options are difficult to scan.

---

# 35. Mobile Modal Strategy

Use:

```text
Bottom sheet for short selection tasks
Full-screen modal for complex tasks
Centered modal only for short confirmation
```

Avoid centered desktop-style modals on narrow screens.

---

# 36. Mobile Forms

Rules:

* one column
* 16px input text
* clear keyboard types
* full-width controls
* persistent labels
* sufficient spacing
* sticky submit only when helpful

Use appropriate input types:

```text
email
tel
number
search
```

---

# 37. Mobile Keyboard Handling

When the keyboard opens:

* focused field remains visible
* sticky bottom bars move or hide
* modal content remains scrollable
* submit action remains reachable
* page does not jump unexpectedly

Test both iOS and Android behavior where possible.

---

# 38. Mobile Bottom Navigation

Use only when it materially improves repeated navigation.

Recommended maximum:

```text
5 items
```

Possible items:

```text
Ana Sayfa
Kategoriler
Ara
Favoriler
Sepet
```

Do not use bottom navigation if it conflicts with:

* sticky PDP action
* checkout action
* bottom sheets
* browser safe area

---

# 39. Mobile Safe Areas

Support:

```css
padding-bottom: env(safe-area-inset-bottom);
padding-left: env(safe-area-inset-left);
padding-right: env(safe-area-inset-right);
```

Required for:

* bottom navigation
* sticky add-to-cart
* full-screen drawer
* bottom sheet
* landscape layouts

---

# 40. Mobile Landscape

Landscape creates reduced height.

Review:

* hero height
* header height
* sticky panels
* modal height
* image gallery
* keyboard overlap

Do not force `100vh` layouts that hide actions.

Use:

```text
svh
dvh
content-based height
```

carefully.

---

# PART III — TABLET EXPERIENCE

# 41. Tablet Principle

Tablet must be treated as its own design state.

It is not:

```text
Large mobile
```

and not:

```text
Small desktop
```

Tablet often combines:

* touch interaction
* larger visual space
* limited width
* portrait and landscape rotation

---

# 42. Tablet Navigation

Options:

```text
Compact desktop navigation
Mobile drawer
Hybrid navigation
```

Choose based on link density.

Do not display desktop navigation if spacing becomes cramped.

---

# 43. Tablet Product Grid

Recommended:

```text
Portrait tablet: 3 columns
Landscape tablet: 3–4 columns
```

Card width must remain sufficient for product names and prices.

---

# 44. Tablet PDP

Possible layouts:

### Portrait

```text
Gallery
Purchase panel
```

or:

```text
Gallery above
Purchase content below
```

### Landscape

```text
Gallery: 55–60%
Purchase panel: 40–45%
```

Sticky purchase behavior must be tested with touch scrolling.

---

# 45. Tablet Filters

Options:

* full-screen drawer
* side drawer
* top filter bar
* collapsible sidebar in landscape

Do not force a permanent sidebar if the product grid becomes too narrow.

---

# 46. Tablet Modal and Drawer

Recommended widths:

```text
Drawer: 420–520px
Modal: 520–720px
```

Use full-screen treatment for complex workflows in portrait orientation.

---

# 47. Tablet Hover Assumptions

Many tablets support touch only.

Do not rely on:

* hover image swap
* hover menus
* tooltip-only meaning
* hidden quick actions

Use feature detection where needed.

---

# PART IV — LAPTOP & DESKTOP EXPERIENCE

# 48. Laptop Principle

Laptop layouts need desktop efficiency without excessive spacing.

Common width:

```text
1024–1366px
```

This range must be tested carefully because many designs are created only for 1440px.

---

# 49. Laptop Navigation

Review:

* logo width
* navigation gaps
* utility icons
* language selector
* campaign links

Do not reduce text until unreadable.

Instead:

* combine categories
* reduce gap moderately
* move secondary links
* use mega menu

---

# 50. Laptop Product Grid

Recommended:

```text
3–4 columns
```

Do not force five columns on 1024–1280px screens.

---

# 51. Desktop PDP

Recommended:

```text
Gallery: 58–65%
Purchase panel: 35–42%
```

Purchase panel width:

```text
420–520px
```

Large screens should not create an overly wide purchase column.

---

# 52. Desktop Hero

Desktop may support:

* asymmetrical typography
* split media
* large campaign crop
* controlled overlaps
* larger text

However, primary CTA must remain immediately identifiable.

---

# 53. Desktop Product Card Hover

Allowed:

* second image
* slight image scale
* quick add
* wishlist emphasis
* text-link underline

Avoid:

* large card movement
* 3D tilt
* cursor-follow effects
* multiple simultaneous animations

---

# 54. Desktop Mega Menu

Use:

```text
3–5 navigation groups
1–2 editorial assets
```

Content must align with page container.

Do not fill the entire viewport with category links.

---

# 55. Desktop Sticky Elements

Allowed:

* header
* filter sidebar
* PDP purchase panel
* cart summary

Rules:

* offset by header height
* stop before footer
* avoid competing sticky elements
* test short laptop heights
* preserve keyboard focus visibility

---

# PART V — WIDE & ULTRA-WIDE SCREENS

# 56. Wide Screen Principle

Do not stretch the interface indefinitely.

At:

```text
1728px+
```

increase:

* outer margins
* campaign media selectively
* editorial scale
* controlled grid width

Do not increase:

* body text width
* product-card width excessively
* navigation spacing without limit
* form width

---

# 57. Ultra-Wide Containers

Recommended maximum:

```text
1440–1600px
```

Certain editorial media may extend beyond this.

Functional content should remain constrained.

---

# 58. Ultra-Wide Product Grids

Maximum recommended:

```text
5 columns
```

Six columns may be used only when product-card width remains comfortable.

Do not create marketplace density on a premium storefront.

---

# 59. Ultra-Wide Hero

A full-bleed hero may use the entire screen.

Text should still align to the main content grid.

Do not center all content merely because the screen is wide.

---

# PART VI — RESPONSIVE IMAGES

# 60. Image Source Strategy

Use responsive image sources.

Required:

* correct width and height
* `sizes` attribute
* modern format
* mobile crop where needed
* lazy loading below fold
* priority only for critical images

---

# 61. Product Image Sizes

Example:

```tsx
<Image
  fill
  sizes="
    (max-width: 767px) 50vw,
    (max-width: 1023px) 33vw,
    (max-width: 1439px) 25vw,
    20vw
  "
  alt={product.name}
/>
```

Actual values must match the layout.

---

# 62. Campaign Art Direction

Use separate media when the subject placement differs dramatically.

Example:

```text
Desktop:
Model positioned right, text left

Mobile:
Closer crop, model centered, text below
```

Do not download a 3000px desktop image for a 375px phone when avoidable.

---

# 63. Product Color Accuracy

Responsive optimization must not alter product colors.

Avoid:

* aggressive compression
* theme-based recoloring
* overlays on product catalog images
* inconsistent color profiles

---

# 64. Image Loading Priority

Prioritize:

```text
Header logo
Primary hero image
First visible product images
```

Lazy-load:

```text
Below-fold product cards
Editorial sections
Recommendations
Footer media
```

Do not mark every image as priority.

---

# PART VII — RESPONSIVE INTERACTION

# 65. Pointer and Touch Detection

Use interaction capability rather than width alone where possible.

Relevant media queries:

```css
@media (hover: hover) and (pointer: fine) {
  /* pointer enhancements */
}
```

Use hover effects only for devices that truly support hover.

---

# 66. Hover Equivalence

Any hover-revealed feature must also be accessible through:

* persistent touch action
* focus state
* menu
* product page
* tap interaction

Hover may enhance, never gate functionality.

---

# 67. Keyboard Across Breakpoints

Keyboard users may use desktop, tablet, or mobile-sized windows.

Do not assume:

```text
Small screen = touch only
Large screen = mouse only
```

Keyboard access must work at every width.

---

# 68. Orientation Changes

When rotating:

* preserve current product
* preserve form input
* preserve filters
* preserve gallery position where possible
* avoid closing dialogs
* recalculate layout safely

Do not reset state after orientation change.

---

# PART VIII — RESPONSIVE COMPONENT TRANSFORMATIONS

# 69. Header Transformation

```text
Mobile:
Compact header + drawer

Tablet:
Compact or hybrid header

Desktop:
Full navigation + mega menu
```

Keep brand identity consistent across forms.

---

# 70. Filter Transformation

```text
Mobile:
Full-screen drawer

Tablet:
Drawer or compact bar

Desktop:
Sidebar or horizontal controls
```

Selected filters remain visible in all versions.

---

# 71. Sort Transformation

```text
Mobile:
Bottom sheet

Tablet:
Select or popover

Desktop:
Compact select / popover
```

Use one shared sort state.

---

# 72. Product Gallery Transformation

```text
Mobile:
Swipe carousel

Tablet:
Carousel or single-column stack

Desktop:
Multi-image grid or image stack
```

Do not duplicate product data or media logic for each layout.

---

# 73. Cart Transformation

```text
Mobile:
Full-screen drawer or page

Tablet:
Wide drawer

Desktop:
Side drawer + full cart page
```

Cart state must remain shared.

---

# 74. Footer Transformation

```text
Mobile:
Accordion sections

Tablet:
2–3 columns

Desktop:
4–6 columns
```

Newsletter may move position based on layout.

---

# 75. Modal Transformation

```text
Mobile:
Bottom sheet or full-screen

Tablet:
Large modal or drawer

Desktop:
Centered modal
```

The task should remain the same despite the presentation change.

---

# PART IX — RESPONSIVE CONTENT PRIORITY

# 76. Content Priority Rules

When space is limited:

Keep:

```text
Product
Price
Variant
Primary action
Availability
Delivery
```

Reduce or move:

```text
Decorative copy
Secondary metadata
Long descriptions
Multiple editorial images
Redundant navigation
```

Never hide critical purchase information solely to preserve visual minimalism.

---

# 77. Mobile Content Reduction

Reduction should use:

* concise copy
* progressive disclosure
* accordions
* shorter labels
* prioritization

Do not remove useful content completely if customers need it for purchase confidence.

---

# 78. Desktop Content Expansion

Desktop may reveal:

* more editorial context
* richer image layouts
* visible filters
* secondary navigation
* hover enhancements

Do not add content that creates inconsistency with mobile.

---

# PART X — RESPONSIVE PERFORMANCE

# 79. Performance Principle

Mobile performance is a design constraint.

The mobile experience should not download every desktop asset.

---

# 80. Responsive JavaScript

Avoid rendering both complete desktop and mobile component trees and hiding one with CSS.

Preferred:

* shared semantic structure
* CSS recomposition
* localized conditional rendering where necessary
* progressive enhancement

Duplicated trees may cause:

* accessibility confusion
* duplicate IDs
* larger bundles
* duplicated state
* hidden focusable elements

---

# 81. Client Component Boundaries

Keep client-side code localized.

Examples:

```text
Mobile menu
Search overlay
Product gallery
Filters
Variant selector
Cart
```

Do not make the full page interactive because one mobile drawer requires state.

---

# 82. Responsive Media Loading

Avoid:

* loading desktop video on mobile
* loading all gallery images immediately
* loading hidden mega-menu media
* rendering hidden carousel slides unnecessarily

---

# 83. Layout Shift

Reserve space for:

* header
* product media
* badges
* price
* sticky actions
* newsletter
* trust blocks

Responsive changes must not create unexpected layout jumps.

---

# PART XI — RESPONSIVE ACCESSIBILITY

# 84. Reflow

The interface must support:

```text
320 CSS px width
200% zoom
```

without requiring horizontal page scrolling.

Exceptions:

* product rail
* image gallery
* intentional data table

---

# 85. Reading Order

Visual reordering must not create a different screen-reader or keyboard sequence.

DOM order should follow the logical mobile reading order.

Desktop grids can visually reposition content where safe.

---

# 86. Focus Visibility

Sticky headers and bottom bars must not cover focused elements.

Use:

```css
scroll-margin-top
```

and suitable bottom spacing where needed.

---

# 87. Touch and Focus Combination

Controls must support both:

* visible keyboard focus
* comfortable touch target

Do not remove focus styling because the design is optimized for touch.

---

# 88. Motion and Responsive Context

Reduce motion on:

* small screens
* low-power devices
* short viewport heights
* reduced-motion preference

Heavy parallax often performs poorly on mobile and should usually be disabled.

---

# PART XII — RESPONSIVE TESTING

# 89. Page Test Matrix

Test these pages at all critical widths:

```text
Homepage
Category
Search
Product detail
Size guide
Wishlist
Cart
Magazine
404
```

---

# 90. Component Test Matrix

Test:

```text
Header
Mobile menu
Mega menu
Product card
Product grid
Product rail
Filters
Sort
Search overlay
Color swatch
Size selector
Bra size selector
Gallery
Quick add
Cart drawer
Modal
Bottom sheet
Newsletter
Footer
```

---

# 91. Content Stress Tests

Test with:

```text
Long Turkish product name
Long German category name
Large price
Discount price
99+ cart count
Seven color options
Ten size options
Unavailable variants
Long error message
Empty results
One product only
Very large product count
```

---

# 92. Height Stress Tests

Test on:

```text
Short laptop screen
Mobile landscape
Browser with visible address bar
On-screen keyboard open
Large accessibility text
```

Width testing alone is not sufficient.

---

# 93. Real Interaction Tests

Test:

```text
Tap
Swipe
Scroll
Keyboard
Mouse
Trackpad
Orientation change
Browser back
Zoom
Reduced motion
Slow network
```

---

# PART XIII — RESPONSIVE ANTI-PATTERNS

# 94. Avoid

```text
Desktop compressed into mobile

Tiny two-column product cards

Hover-only purchase actions

Fixed-height text containers

100vh mobile bugs

Multiple sticky bottom bars

Hidden navigation items without alternative

Desktop modal on 320px screen

Five-column laptop product grid

Uncontrolled ultra-wide stretching

Horizontal page overflow

Image crop hiding product

Duplicated mobile and desktop DOM trees

Touch controls below 44px

Unreachable close action

Keyboard hidden behind sticky footer
```

---

# PART XIV — ACCEPTANCE TESTS

# 95. Mobile Acceptance

```text
[ ] Works at 320px
[ ] No page-level horizontal overflow
[ ] Header remains usable
[ ] Navigation is touch-friendly
[ ] Hero CTA is visible
[ ] Product cards remain readable
[ ] Product gallery supports swipe
[ ] Size controls remain usable
[ ] Bra-size selection remains clear
[ ] Sticky add-to-cart does not cover content
[ ] Filters use an appropriate mobile pattern
[ ] Cart checkout remains reachable
[ ] Keyboard does not hide fields
[ ] Safe areas are supported
[ ] Landscape is usable
```

---

# 96. Tablet Acceptance

```text
[ ] Tablet has an intentional composition
[ ] Navigation is not cramped
[ ] Product grid uses suitable columns
[ ] PDP layout works in portrait
[ ] PDP layout works in landscape
[ ] Filters do not over-compress the grid
[ ] Touch interaction does not depend on hover
[ ] Drawers and modals use appropriate width
```

---

# 97. Laptop Acceptance

```text
[ ] Navigation fits without tiny text
[ ] Product grid does not become too dense
[ ] Sticky PDP panel works on short screens
[ ] Header height remains controlled
[ ] Category filters preserve product width
[ ] Hero content remains visible
[ ] No 1440px-only assumptions exist
```

---

# 98. Desktop Acceptance

```text
[ ] Layout uses space without overstretching
[ ] Product images remain prominent
[ ] Hover enhances but does not gate functionality
[ ] Mega menu remains curated
[ ] PDP composition is balanced
[ ] Text widths remain controlled
[ ] Sticky elements do not conflict
```

---

# 99. Ultra-Wide Acceptance

```text
[ ] Containers remain constrained
[ ] Body text does not stretch
[ ] Product grid remains premium
[ ] Outer margins increase appropriately
[ ] Hero remains art-directed
[ ] Content does not float awkwardly in the center
```

---

# PART XV — AI IMPLEMENTATION RULES

# 100. AI Responsive Rules

When an AI coding agent creates or modifies a page, it must:

1. Start from the smallest supported width.
2. Define the mobile reading order first.
3. Identify where the composition genuinely needs to change.
4. Avoid device-specific assumptions.
5. Test touch, pointer, and keyboard behavior.
6. Preserve the same commerce state across layouts.
7. Use art-directed media where required.
8. Avoid rendering duplicate hidden component trees.
9. Protect mobile performance.
10. Support safe areas.
11. Test portrait and landscape.
12. Complete the responsive acceptance checklist.

---

# 101. Responsive Self-Review Checklist

```text
[ ] Does the page work at 320px?

[ ] Is there any page-level horizontal overflow?

[ ] Are gutters consistent?

[ ] Is the mobile reading order correct?

[ ] Are primary actions easy to reach?

[ ] Are touch targets at least 44px?

[ ] Does the hero work on short screens?

[ ] Is mobile imagery art-directed?

[ ] Are product cards readable?

[ ] Are product grids appropriately dense?

[ ] Does PDP information appear in the right order?

[ ] Does bra sizing remain understandable?

[ ] Does sticky add-to-cart avoid conflicts?

[ ] Are filters mobile-specific?

[ ] Does the keyboard hide any actions?

[ ] Are safe areas supported?

[ ] Does tablet have an intentional layout?

[ ] Does laptop work below 1440px?

[ ] Does desktop use space effectively?

[ ] Are ultra-wide containers constrained?

[ ] Are hover features optional?

[ ] Does keyboard interaction work at every width?

[ ] Is state preserved across orientation changes?

[ ] Are images loaded responsively?

[ ] Are duplicate hidden DOM trees avoided?

[ ] Does the experience feel like the same premium brand everywhere?
```

---

# 102. Final Principle

Responsive design must preserve the brand without preserving the same layout.

The customer should receive:

```text
The same clarity.

The same confidence.

The same product quality.

The same purchase capability.
```

—but through the composition that best fits the screen.

When uncertain:

```text
Design mobile first.

Recompose instead of shrinking.

Protect the primary action.

Preserve product scale.

Use touch-friendly controls.

Constrain wide layouts.

Test height as well as width.

Keep one coherent experience.
```
