# E-Commerce Design Operating System

# Module 07B — Commerce Components

---

## 1. Purpose

Commerce components directly influence:

* product discovery
* purchase confidence
* variant selection
* add-to-cart rate
* cart clarity
* product comparison
* perceived product quality
* conversion

These components must combine premium visual design with precise functional behavior.

A commerce component is never complete if it only looks attractive.

It must also help the customer make a confident purchase decision.

---

## 2. Core Commerce Principles

### 2.1 Product First

The product image, product name, price, available variants, and purchase action must remain easy to understand.

Decorative UI must never compete with product information.

### 2.2 Selection Must Be Obvious

Customers must always understand:

* which color is selected
* which size is selected
* whether an option is unavailable
* whether an item was added to cart
* whether a product is saved
* what will happen next

### 2.3 Errors Must Be Prevented

Do not wait until the customer clicks “Sepete ekle” to reveal obvious selection requirements.

Guide the customer before failure.

### 2.4 Information Density Must Be Controlled

Product cards should remain scannable.

Product detail pages can contain more information, but purchase-critical content must remain concise and close together.

### 2.5 Mobile Purchase Actions Must Remain Reachable

Important commerce actions should be easy to reach with one hand.

Do not force users to scroll repeatedly between product information and the purchase button.

---

# PART I — PRODUCT DISCOVERY

---

## 3. Product Card

### Purpose

The Product Card introduces a product and supports fast comparison, wishlist activity, and product-page navigation.

### Anatomy

```text
Product media
Optional badge
Wishlist action
Optional quick-add action
Product category or collection
Product name
Price
Optional previous price
Optional color information
Optional stock message
```

### Required Information

Every standard product card should include:

* primary image
* product name
* current price
* product-page link

Recommended optional information:

* category or collection
* previous price
* color count
* selected badge
* wishlist
* quick add

Do not expose every product attribute directly on the card.

### Image Ratio

Recommended for lingerie and fashion:

```text
4:5
```

Alternative editorial ratio:

```text
3:4
```

Use one dominant ratio within the same grid.

### Image Behavior

Pointer devices may support:

* primary image
* secondary image on hover
* slight image scale
* quick-add reveal

Touch devices must not depend on hover.

### Hover Image Transition

Recommended:

```text
Opacity transition: 180–260ms
Image scale: 1 → 1.015 or 1.02
```

Avoid strong zoom effects.

### Product Name

Recommended:

```text
14–16px
Maximum: 2 lines
```

The product name must not be truncated so aggressively that products become indistinguishable.

### Price Hierarchy

Current price:

```text
14–16px
Medium or semibold
High contrast
```

Previous price:

```text
13–15px
Lower contrast
Strikethrough
```

Discount messaging must remain restrained.

### Badge Placement

Recommended:

* top-left of image
* one primary badge
* maximum two when necessary

Avoid covering the product body, face, or important garment details.

### Wishlist Placement

Recommended:

* top-right of image
* minimum 40×40px target
* clear default and selected state

### Quick Add

Quick Add may appear:

* below the image
* as a controlled image overlay
* after hover on pointer devices
* as a persistent compact action on mobile when justified

Quick Add must not cause layout shift.

### Variants

```text
Standard
Compact
Editorial
Horizontal
Recommendation
Recently Viewed
```

Each variant must reuse the same product data and price logic.

### Loading State

Skeleton must preserve:

* media ratio
* product-name lines
* price position
* total card height

### Unavailable Product

Use:

* subdued image treatment
* explicit “Tükendi” label
* disabled quick-add
* product detail access may remain available

Do not hide unavailable products without merchandising reason.

### Accessibility

* entire card must not contain conflicting nested interactive elements
* product title link must be clear
* image alt text must describe the product
* wishlist button requires an accessible label
* status changes must be announced
* hover-only information must have a touch and keyboard equivalent

### Performance

* use responsive images
* lazy-load below-the-fold cards
* avoid mounting heavy dialogs inside every card
* centralize quick-add modal logic
* prevent duplicated product data

### Acceptance Criteria

```text
[ ] Image ratio is consistent
[ ] Product name is readable
[ ] Price hierarchy is clear
[ ] Wishlist target is accessible
[ ] Hover does not cause layout shift
[ ] Touch users receive equivalent functionality
[ ] Unavailable state is explicit
[ ] Images are optimized
[ ] Card remains scannable
[ ] Card feels product-led, not container-led
```

---

## 4. Product Grid

### Purpose

The Product Grid enables efficient browsing and comparison.

### Column Rules

Recommended:

```text
Small mobile: 2
Large mobile: 2
Tablet: 3
Desktop: 4
Wide desktop: 4–5
```

Do not increase column count if product cards become difficult to understand.

### Grid Density

Supported density modes:

```text
Comfortable
Standard
Compact
```

For premium fashion, use Comfortable or Standard by default.

### Gaps

Recommended:

```text
Mobile horizontal: 12–16px
Mobile vertical: 28–40px

Tablet horizontal: 20–24px
Tablet vertical: 40–56px

Desktop horizontal: 24–32px
Desktop vertical: 56–72px
```

### Grid Controls

May include:

* product count
* sorting
* filters
* density selector
* active filters
* view selector

Do not overcrowd the toolbar.

### Loading

Use a fixed number of skeleton cards that match the expected viewport.

### Empty State

Include:

* clear heading
* short explanation
* active-filter reset
* category discovery action
* search alternative where relevant

### Pagination

Supported methods:

* numbered pagination
* load more
* controlled infinite loading

For premium commerce, “Daha fazla göster” often provides a clearer experience than endless loading.

### Accessibility

* product count should update accessibly
* filtering should preserve understandable focus
* grid must use list semantics where appropriate
* loading changes should not unexpectedly move focus

---

## 5. Product Rail

### Purpose

The Product Rail displays curated products in a horizontal sequence.

Use for:

* new arrivals
* complete the look
* recently viewed
* related products
* best sellers

### Desktop Behavior

Options:

* fixed visible columns with arrow navigation
* horizontal drag
* partial next-card preview

### Mobile Behavior

Use native-feeling horizontal scrolling.

Recommended:

* snap points
* visible next-card edge
* no tiny carousel dots
* sufficient card width

### Rules

* do not auto-rotate
* preserve keyboard controls
* disable arrows at boundaries
* announce position only when useful
* do not trap vertical scrolling

### Performance

Render only necessary products.

Avoid multiple heavy carousels above the fold.

---

## 6. Price Component

### Purpose

The Price component formats and displays all price states consistently.

### Supported States

```text
Standard
Discounted
Range
From Price
Unavailable
Member Price
Installment Information
```

### Required Props

Conceptually:

```ts
type PriceProps = {
  amount: number;
  currency: string;
  compareAtAmount?: number;
  locale?: string;
};
```

### Formatting

Use `Intl.NumberFormat`.

For Turkish locale:

```text
2.490,00 ₺
```

or brand-approved compact display:

```text
2.490 ₺
```

Use one format consistently.

### Discounted Price

Recommended order:

```text
Current price
Previous price
Optional discount percentage
```

Do not make the discount label more prominent than the actual price.

### Range Price

Use:

```text
1.290 ₺ – 1.690 ₺
```

or:

```text
1.290 ₺'den başlayan fiyatlarla
```

Choose based on whether the range is meaningful before variant selection.

### Accessibility

Screen readers should receive a coherent price phrase.

Avoid separate fragments that are read in a confusing order.

---

# PART II — PRODUCT OPTIONS

---

## 7. Color Swatch

### Purpose

Color Swatches allow customers to select or preview product colors.

### Anatomy

```text
Visual swatch
Accessible color name
Selected indicator
Unavailable indicator
Optional tooltip
```

### Recommended Size

```text
Visual swatch: 24–32px
Interactive target: 40–44px
```

### Shapes

Recommended:

* circle
* small rounded square

Use one style consistently.

### Light Colors

Light or white swatches require a visible border.

### Dark Colors

Dark swatches require a visible outer selection ring.

### Patterned Products

Use:

* texture thumbnail
* split swatch
* small image preview

Do not reduce complex patterns to an inaccurate solid color.

### Selected State

Use at least two indicators:

* outer ring
* checkmark
* visible color-name update
* selected text state

### Unavailable State

Use:

* diagonal line
* reduced opacity
* disabled state
* explicit tooltip or label

### Accessibility

Each option must expose:

* color name
* selected state
* availability
* keyboard interaction

Do not use color alone.

---

## 8. Standard Size Selector

### Purpose

Used for products with sizes such as:

```text
XS
S
M
L
XL
```

### Anatomy

```text
Group label
Selected size
Size options
Size guide link
Optional fit note
Error message
```

### Recommended Option Size

```text
Minimum: 44×44px
Preferred width: 48–64px
```

### Selected State

Use:

* strong border
* high-contrast background or text
* programmatic checked state

### Unavailable State

Use:

* visible strike-through
* subdued text
* disabled interaction
* accessible unavailable label

### Low Stock

Do not alter the size-button color alone.

Show concise text such as:

```text
Son 2 ürün
```

### Missing Selection

Before add-to-cart:

* visually highlight the group
* provide a concise message
* move focus to the group when appropriate

Example:

```text
Lütfen beden seçin.
```

### Accessibility

Treat as a radio group when only one size can be selected.

Arrow-key support may be implemented when consistent with the chosen primitive.

---

## 9. Bra Size Selector

### Purpose

The Bra Size Selector supports combined band and cup selections without overwhelming the user.

### Supported Sizes

Examples:

```text
70A
70B
75B
75C
80B
80C
85C
85D
```

### Recommended Interaction Pattern

Use two coordinated selectors:

```text
Bant ölçüsü
Kup ölçüsü
```

The final variant is derived from their combination.

Alternative:

* grouped combined-size grid

Use the pattern that minimizes unavailable combinations.

### Recommended Flow

```text
1. Select band size
2. Available cup sizes update
3. Final combined size is confirmed
```

### Requirements

* preserve previous valid selection where possible
* clearly disable invalid combinations
* never silently change a selected size
* expose final combined size near the purchase action
* link directly to the size guide

### Example

```text
Bant: 75
Kup: C
Seçilen beden: 75C
```

### Unavailable Combination

If the selected cup is unavailable after changing the band:

* clear the invalid cup selection
* explain the change
* keep focus predictable

### Mobile Layout

Use:

* horizontally wrapping buttons
* two clearly separated groups
* no dense spreadsheet-style table

### Accessibility

Each group must have:

* visible label
* programmatic group name
* selected state
* unavailable state
* error message association

---

## 10. Size Guide Trigger

### Purpose

Provides confidence before size selection.

### Recommended Label

```text
Beden rehberi
```

or:

```text
Bedenimi bul
```

Use different actions only when they lead to different experiences.

### Placement

Place close to the size label, not at the bottom of the page.

### Interaction

May open:

* modal
* drawer
* dedicated page
* guided size finder

### Accessibility

The trigger must explain what opens.

Example accessible label:

```text
Beden rehberini aç
```

---

## 11. Quantity Selector

### Purpose

Allows customers to modify product quantity.

### Anatomy

```text
Decrease button
Quantity value
Increase button
```

### Recommended Size

```text
Height: 40–48px
Button target: minimum 40×40px
```

### Rules

* minimum normally equals 1
* maximum respects stock
* disabled controls remain understandable
* direct numeric input may be supported for large quantities
* prevent invalid values

### Cart Updates

When quantity changes:

* update subtotal
* expose progress
* announce the updated quantity and price
* avoid excessive full-page loading

---

## 12. Stock Status

### Supported States

```text
Available
Low Stock
Unavailable
Preorder
Backorder
```

### Copy Examples

```text
Stokta
Son 3 ürün
Tükendi
Ön sipariş
Tahmini gönderim: 12–15 Ağustos
```

### Rules

* do not create false urgency
* use real stock data in production
* show timing for preorder or backorder
* do not rely on color alone
* place near variants or purchase action

---

# PART III — PURCHASE ACTIONS

---

## 13. Add-to-Cart Button

### Purpose

The primary purchase action.

### Label States

```text
Sepete ekle
Beden seçin
Sepete ekleniyor…
Sepete eklendi
Tükendi
Ön sipariş ver
```

### Rules

* keep the label explicit
* preserve button width during state changes
* prevent duplicate submissions
* do not disable without explaining why
* missing selections should lead to guidance
* show success feedback

### Success Behavior

After adding:

* update cart count
* show toast or cart drawer
* preserve product-page context
* avoid forced route change

### Error Behavior

Show:

* concise error
* recovery option
* preserved selection state

### Accessibility

* expose busy state
* announce success
* do not move focus unexpectedly
* error must be programmatically associated

---

## 14. Quick Add

### Purpose

Allows a product to be added without visiting the detail page.

### Appropriate Use

Best for products with:

* familiar sizing
* simple variants
* repeated purchases
* clear images

### Interaction Options

* inline size row
* compact popover
* bottom sheet on mobile
* centralized modal

### Rules

* require explicit size selection
* do not auto-select a size
* show selected color
* provide product-page link
* close after success or provide clear feedback

### Mobile

Use a bottom sheet when inline selection becomes cramped.

### Performance

Do not render one full dialog per card.

Use one reusable quick-add surface with selected product data.

---

## 15. Wishlist Button

### Purpose

Allows customers to save products for later.

### States

```text
Not saved
Saved
Saving
Error
```

### Icon Behavior

Outline to filled treatment may be used.

The state must also be available programmatically.

### Feedback

Recommended:

* subtle icon transition
* toast confirmation
* wishlist count update

### Authentication

For frontend-only prototypes:

* persist in `localStorage`

For production:

* allow guest save
* merge on sign-in when appropriate

Do not block wishlist use behind sign-in unless required by business logic.

### Accessibility

Use:

```text
aria-pressed
```

Labels:

```text
Favorilere ekle
Favorilerden çıkar
```

---

## 16. Sticky Mobile Add-to-Cart Bar

### Purpose

Keeps the purchase action reachable on mobile after the primary purchase panel scrolls away.

### Anatomy

```text
Optional compact price
Optional selected variant
Primary add-to-cart action
```

### Height

Recommended:

```text
64–80px plus safe area
```

### Display Logic

Show after:

* main add-to-cart action leaves the viewport

Hide when:

* main action is visible
* cart drawer is open
* keyboard blocks the interface
* modal or size guide is open
* footer context makes it unnecessary

### Rules

* do not cover content
* include safe-area padding
* avoid conflict with bottom navigation
* preserve clear disabled or selection-required states

### Accessibility

The sticky action must not duplicate confusing focus targets while the original action is visible.

---

# PART IV — PRODUCT MEDIA

---

## 17. Product Gallery

### Purpose

The gallery communicates product form, detail, fit, fabric, and styling.

### Required Media Types

Recommended:

* front view
* back view
* side or fit view
* fabric detail
* lifestyle image
* optional short video

### Desktop Patterns

```text
Two-column editorial grid
Vertical stack
Main image with thumbnails
Mixed-size gallery
```

### Mobile Pattern

```text
Swipeable single-image carousel
```

### Rules

* image counter should be visible where useful
* swipe must feel native
* product details should remain sharp
* preserve aspect ratios
* do not hide navigation controls
* do not autoplay video with sound

### Image Zoom

Supported options:

* click to open lightbox
* controlled hover zoom
* pinch zoom on mobile
* high-resolution detail view

Hover zoom must not interfere with scrolling.

### Thumbnails

Recommended size:

```text
64–88px
```

Selected thumbnail must be clearly indicated.

### Video

Requirements:

* muted by default
* no autoplay on mobile by default
* poster image
* controls
* captions when speech or meaningful audio exists
* lightweight loading

### Accessibility

* descriptive alt text
* carousel controls labeled
* selected slide exposed
* keyboard navigation supported
* lightbox focus trapped
* Escape closes lightbox

### Performance

* prioritize only the first critical image
* lazy-load subsequent media
* use responsive `sizes`
* avoid loading full-resolution zoom assets immediately

---

## 18. Image Lightbox

### Purpose

Allows detailed product inspection.

### Anatomy

```text
Close action
Large media
Previous and next controls
Image count
Optional thumbnails
```

### Rules

* preserve focus
* support Escape
* support arrow keys
* lock background scroll
* support zoom responsibly
* provide a clear close action

Do not make the lightbox the only way to view important product detail.

---

## 19. Product Media Badge

May communicate:

* video
* 360 view
* new color
* close-up detail

Use small, clear labels or icons.

Do not cover critical product areas.

---

# PART V — CART COMPONENTS

---

## 20. Cart Item

### Purpose

Displays a selected product and allows quantity or removal actions.

### Anatomy

```text
Product image
Product name
Selected color
Selected size
Unit price
Quantity
Subtotal
Remove action
Optional move-to-wishlist action
Stock or delivery warning
```

### Layout

Desktop:

```text
Image
Product information
Quantity
Price
Actions
```

Mobile:

```text
Image beside product information
Quantity and actions below
```

### Product Image

Recommended ratio:

```text
3:4 or 4:5
```

Recommended size:

```text
Mobile width: 88–112px
Desktop width: 112–144px
```

### Variant Information

Use concise labels:

```text
Renk: Bordo
Beden: 75C
```

### Remove Action

Use text or icon with clear label.

Removal should:

* update totals
* provide undo where practical
* announce the change

### Quantity Update

Use local progress feedback rather than blocking the entire cart.

### Unavailable Item

If stock changes:

* show clear warning
* prevent checkout for affected item
* preserve item for correction
* offer remove or alternative selection

### Accessibility

* product image links to product
* quantity controls labeled
* remove action names the product
* updates announced
* keyboard sequence remains logical

---

## 21. Cart Drawer

### Purpose

Provides immediate cart feedback without removing customers from the shopping context.

### Anatomy

```text
Header
Cart count
Close action
Scrollable item list
Shipping progress
Subtotal
Primary checkout action
Secondary cart-page link
Optional recommendation
```

### Width

```text
Mobile: 100%
Tablet: 420–480px
Desktop: 440–520px
```

### Zones

```text
Sticky header
Scrollable content
Sticky footer
```

### Open Triggers

* cart icon
* successful add-to-cart
* explicit “Sepeti görüntüle” action

### After Add-to-Cart

Recommended behavior:

* drawer opens or compact confirmation appears
* newly added item is visible
* focus behavior remains predictable
* shopping context can be resumed easily

### Shipping Progress

Show only when business logic supports it.

Example:

```text
Ücretsiz kargoya 450 ₺ kaldı.
```

Progress must be based on real subtotal rules in production.

### Recommendations

Limit to:

```text
1–3 relevant items
```

Do not allow recommendations to push checkout below the fold.

### Empty State

Include:

```text
Sepetiniz boş.
Yeni gelenleri keşfedin.
```

One strong action is usually enough.

### Motion

Recommended:

```text
Overlay fade: 160–220ms
Drawer transition: 280–360ms
```

### Accessibility

* use accessible dialog or drawer primitive
* trap focus
* lock body scroll
* Escape closes
* focus returns to trigger
* cart updates announced
* background is not interactive

### Performance

* do not re-render the entire application for quantity changes
* keep cart calculations centralized
* virtualize only when unusually large carts justify it
* lazy-load recommendations

---

## 22. Full Cart Page

### Purpose

Allows detailed review before checkout.

### Desktop Layout

```text
Cart items: 65–70%
Order summary: 30–35%
```

### Mobile Layout

```text
Single column
Summary after cart items
Optional sticky checkout action
```

### Required Information

* products
* variants
* quantities
* prices
* subtotal
* shipping information
* promotion code
* total or estimated total
* checkout action

### Trust Information

May include:

* secure payment
* delivery estimate
* easy returns
* customer support

Keep trust content concise.

### Promo Code

Do not make the promo-code field visually dominant.

Use:

* collapsible field
* secondary placement
* clear success and error states

### Empty Cart

Include:

* clear heading
* short message
* category or new-arrivals action
* optional recently viewed products

---

## 23. Order Summary

### Purpose

Summarizes pricing clearly before checkout.

### Anatomy

```text
Subtotal
Discount
Shipping
Tax where applicable
Estimated total
Currency
Primary action
```

### Rules

* align numeric values
* use tabular numerals
* explain estimated values
* do not hide mandatory costs
* update immediately after cart changes
* total must have strongest hierarchy

### Sticky Desktop Summary

May be sticky, but must stop before footer content.

---

## 24. Shipping Progress

### Purpose

Communicates progress toward a shipping benefit.

### Anatomy

```text
Message
Progress indicator
Optional threshold amount
```

### Rules

* use real thresholds
* support currency formatting
* update immediately
* handle achieved state
* do not create false urgency

### Achieved State

Example:

```text
Ücretsiz kargo kazandınız.
```

Use success styling with text, not color alone.

---

# PART VI — PRODUCT DETAIL SUPPORT

---

## 25. Product Information Accordion

### Recommended Sections

```text
Ürün detayları
Materyal ve bakım
Kargo ve teslimat
İade ve değişim
```

### Rules

* critical purchase information should not be hidden unnecessarily
* only one-open or multi-open behavior must remain consistent
* headings must be clear
* content must be concise and structured

### Accessibility

Use native disclosure patterns or accessible accordion primitives.

---

## 26. Fit Information

### Purpose

Reduces size uncertainty.

May include:

```text
Dar kalıp
Standart kalıp
Rahat kalıp
Model ölçüleri
Modelin giydiği beden
Destek seviyesi
Dolgu bilgisi
```

### Rules

* use plain language
* avoid universal guarantees
* keep close to size selection
* link to detailed guide where needed

---

## 27. Complete-the-Look Component

### Purpose

Supports coordinated purchase discovery.

### Recommended Content

```text
2–4 matching products
```

### Rules

* products must genuinely coordinate
* selected variants remain independent
* allow direct product-page access
* quick add may be provided
* do not force bundles

---

## 28. Recently Viewed

### Purpose

Helps customers return to previously explored products.

### Rules

* persist locally for guest users
* avoid duplicates
* exclude current product where appropriate
* limit visible history
* provide privacy-respecting clearing if required

---

# PART VII — COMMERCE FEEDBACK

---

## 29. Add-to-Cart Toast

### Purpose

Confirms successful addition without interrupting browsing.

### Content

```text
Product added
Selected variant
Optional cart action
```

Example:

```text
Luna Balkonet Sütyen sepete eklendi.
Sepeti görüntüle
```

### Duration

Recommended:

```text
4–6 seconds
```

Pause when hovered or focused.

### Rules

* do not duplicate a simultaneously open cart drawer
* allow dismissal
* announce success accessibly
* avoid celebratory confetti in premium contexts

---

## 30. Variant Selection Error

### Purpose

Explains missing or invalid selections.

### Placement

* directly near the selector
* optionally summarized near add-to-cart
* move focus only when necessary

### Copy

Preferred:

```text
Lütfen beden seçin.
```

Avoid:

```text
Hata oluştu.
```

---

## 31. Cart Update Error

Examples:

```text
Bu beden artık stokta yok.
Miktar güncellenemedi. Tekrar deneyin.
```

Preserve the previous valid cart state whenever possible.

---

# PART VIII — DATA AND STATE RULES

---

## 32. Product Variant Model

Recommended conceptual structure:

```ts
type ProductVariant = {
  id: string;
  color: string;
  size: string;
  stock: number;
  price?: number;
  sku: string;
};
```

Bra variants may include:

```ts
type BraVariant = ProductVariant & {
  bandSize: number;
  cupSize: string;
};
```

Do not derive availability from display labels alone.

---

## 33. Selection State

Store:

```text
Selected product
Selected color
Selected size
Selected variant ID
Quantity
Availability
```

The final purchasable unit must resolve to a valid variant.

Do not send loosely combined labels to the cart.

---

## 34. Cart State

Each cart line should preserve:

```text
Product ID
Variant ID
Product name
Image
Color
Size
Quantity
Unit price
Currency
Availability
```

In production, authoritative prices and stock must be validated server-side.

---

## 35. Local Persistence

For frontend prototypes, persist:

* cart
* wishlist
* recently viewed

Use hydration-safe access.

Requirements:

* version stored data
* handle malformed values
* provide sensible fallback
* avoid blocking initial render
* do not store unnecessary personal data

---

# PART IX — DO / DON'T

---

## 36. Do

* Keep product images dominant.
* Make selected variants obvious.
* Use real semantic states.
* Preserve dimensions during loading.
* Provide immediate purchase feedback.
* Optimize mobile purchase actions.
* Use one centralized variant model.
* Keep price formatting consistent.
* Explain unavailable options.
* Preserve shopping context after add-to-cart.
* Make cart totals easy to scan.
* Use accessible option controls.
* Test long Turkish product names.
* Test combined bra sizes.
* Design empty and error states.

---

## 37. Don’t

* Auto-select a size.
* Hide variant errors until late.
* Depend on hover for purchase actions.
* Use color alone for selection.
* Show too many badges.
* Open multiple feedback surfaces at once.
* Force users to the cart after every addition.
* Make recommendations more prominent than checkout.
* Use fake stock urgency.
* Let quick add cause layout shift.
* Load all gallery media immediately.
* Hide costs in the order summary.
* Make unavailable options look selectable.
* Store only display labels instead of variant IDs.
* Use generic error messages.

---

# PART X — ACCEPTANCE STANDARDS

---

## 38. Product Discovery Acceptance

```text
[ ] Product images use consistent ratios
[ ] Product names and prices are scannable
[ ] Wishlist works by keyboard and touch
[ ] Quick add has clear variant selection
[ ] Hover behavior has a touch equivalent
[ ] Grid remains useful at all breakpoints
[ ] Loading and empty states are complete
```

---

## 39. Product Detail Acceptance

```text
[ ] Selected color is obvious
[ ] Selected size is obvious
[ ] Bra-size combinations resolve correctly
[ ] Unavailable variants are explicit
[ ] Add-to-cart feedback is immediate
[ ] Gallery is usable by keyboard and touch
[ ] Sticky mobile action does not cover content
[ ] Size guide is easy to reach
[ ] Fit information is understandable
[ ] Critical purchase information is close together
```

---

## 40. Cart Acceptance

```text
[ ] Cart lines show correct variants
[ ] Quantity updates totals correctly
[ ] Removed items provide clear feedback
[ ] Empty state is complete
[ ] Shipping progress uses valid logic
[ ] Recommendations do not obstruct checkout
[ ] Drawer focus management works
[ ] Order summary is transparent
[ ] Currency formatting is consistent
[ ] Stock changes are handled clearly
```

---

## 41. AI Implementation Rules

When an AI agent creates or modifies a commerce component, it must:

1. Identify the exact purchase decision the component supports.
2. Use the centralized product and variant model.
3. Implement all relevant availability states.
4. Never auto-select a size.
5. Provide keyboard and touch equivalence.
6. Preserve layout during loading and feedback.
7. Use locale-aware price formatting.
8. Resolve a real variant before cart insertion.
9. Maintain clear selected and unavailable states.
10. Test mobile purchase reachability.
11. Test combined bra sizes.
12. Complete the commerce self-review checklist.

---

## 42. Self-Review Checklist

```text
[ ] Is the product visually dominant?

[ ] Is the product name readable?

[ ] Is the price hierarchy clear?

[ ] Is the selected color obvious?

[ ] Is the selected size obvious?

[ ] Are unavailable options explicit?

[ ] Is color never the only state indicator?

[ ] Does bra-size selection prevent invalid combinations?

[ ] Is the final variant ID resolved correctly?

[ ] Is add-to-cart feedback immediate?

[ ] Is duplicate submission prevented?

[ ] Does quick add work on touch devices?

[ ] Does wishlist expose its state?

[ ] Does the gallery support keyboard and swipe?

[ ] Are images loaded efficiently?

[ ] Does the sticky mobile action avoid conflicts?

[ ] Are cart-line variants accurate?

[ ] Do quantity updates preserve context?

[ ] Are totals formatted correctly?

[ ] Are stock changes handled?

[ ] Are empty states complete?

[ ] Are errors specific and recoverable?

[ ] Does the cart drawer manage focus?

[ ] Are recommendations secondary to checkout?

[ ] Does the complete experience feel calm and premium?
```

---

## 43. Final Principle

Commerce components must reduce hesitation.

The customer should always understand:

```text
What the product is.

Which option is selected.

How much it costs.

Whether it is available.

What happens after the next action.
```

When uncertain:

```text
Clarify the selection.

Protect product prominence.

Reduce purchase friction.

Show honest availability.

Keep feedback immediate.

Preserve customer context.
```
