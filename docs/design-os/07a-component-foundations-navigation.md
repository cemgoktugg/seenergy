# E-Commerce Design Operating System

# Module 07A — Component Foundations & Navigation

---

## 1. Purpose

The Component Bible defines how reusable interface components must look, behave, respond, animate, perform, and remain accessible.

Every component must be:

* visually consistent
* functionally predictable
* responsive
* accessible
* performant
* reusable
* testable
* brand-aligned

A component is not complete when it only looks correct.

It is complete when all of its states, interactions, edge cases, and responsive behaviors are defined.

---

## 2. Component Philosophy

Components are the building blocks of the entire commerce experience.

They must create consistency without making every page look identical.

A good component system provides:

* shared visual language
* predictable interaction
* reduced code duplication
* faster development
* easier maintenance
* safer updates
* consistent accessibility
* stable performance

Components should be flexible enough to support editorial design while remaining controlled enough to preserve brand quality.

---

## 3. Core Component Principles

### 3.1 Reuse Before Creation

Before creating a new component:

1. Search the existing component library.
2. Check whether an existing component can be extended.
3. Avoid creating visually similar duplicates.
4. Add variants only when the use case is legitimate.

### 3.2 Variants Must Be Intentional

Every variant must answer:

* What problem does it solve?
* Where is it used?
* Why cannot the default component support it?
* Does it remain accessible?
* Does it increase maintenance cost?

Do not create variants only to match one isolated page.

### 3.3 Components Must Own Their States

Each component must define relevant states such as:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Success
Empty
Unavailable
Expanded
Collapsed
```

Not every component needs every state, but all relevant states must be documented.

### 3.4 Composition Before Configuration

Prefer small composable components over components with dozens of boolean properties.

Avoid APIs such as:

```tsx
<Component
  isLarge
  isDark
  isRounded
  hasIcon
  isCentered
  isCompact
  isAnimated
/>
```

Prefer meaningful variants and composition.

### 3.5 Semantic HTML First

Use native HTML elements whenever possible.

Examples:

* `button` for actions
* `a` for navigation
* `input` for input
* `dialog` or accessible dialog primitives for modals
* `nav` for navigation
* `header` for page header
* `section` for meaningful page sections
* `ul` and `li` for lists

Do not recreate native controls with generic `div` elements.

---

## 4. Component Architecture

Recommended architecture:

```text
Primitive Components
↓
Foundation Components
↓
Commerce Components
↓
Editorial Components
↓
Page Sections
↓
Page Templates
```

### Primitive Components

Examples:

* Button
* Link
* IconButton
* Input
* Checkbox
* Radio
* Switch
* Badge
* Divider
* Spinner
* Skeleton

### Foundation Components

Examples:

* Container
* Stack
* Cluster
* Grid
* Modal
* Drawer
* Accordion
* Tabs
* Tooltip
* Toast

### Commerce Components

Examples:

* ProductCard
* ProductGrid
* Price
* SizeSelector
* ColorSwatch
* QuantitySelector
* CartItem
* FilterGroup
* SearchResult

### Editorial Components

Examples:

* EditorialHero
* CampaignBanner
* StoryBlock
* LookbookCard
* QuoteBlock
* MagazineCard

### Page Sections

Examples:

* NewArrivalsSection
* CategoryDiscovery
* BestSellersSection
* NewsletterSection
* RecommendationsSection

---

## 5. Component File Structure

Recommended structure:

```text
components/
  button/
    button.tsx
    button.types.ts
    button.test.tsx
    button.stories.tsx
    index.ts
```

For smaller projects:

```text
components/ui/button.tsx
components/ui/input.tsx
components/commerce/product-card.tsx
components/navigation/site-header.tsx
```

Avoid placing every component in one folder without categorization.

Recommended categories:

```text
components/
  ui/
  layout/
  navigation/
  commerce/
  editorial/
  forms/
  feedback/
  overlays/
```

---

## 6. Component API Rules

Component props must be:

* typed
* minimal
* predictable
* documented
* composable

Avoid:

* unclear property names
* duplicate properties
* mutually conflicting properties
* deeply nested configuration objects
* unrestricted style overrides

Preferred:

```tsx
<Button variant="primary" size="large">
  Sepete ekle
</Button>
```

Avoid:

```tsx
<Button
  black
  big
  rounded={false}
  bold
  full
  hoverDark
>
  Sepete ekle
</Button>
```

---

## 7. Component Token Layers

Components should use:

```text
Global design tokens
↓
Semantic tokens
↓
Component tokens
↓
Variant tokens
```

Example:

```css
:root {
  --button-primary-bg: var(--action-primary-bg);
  --button-primary-text: var(--text-inverse);
  --button-primary-border: transparent;
  --button-primary-hover-bg: var(--action-primary-hover);
  --button-primary-radius: var(--radius-sm);
  --button-primary-height: 48px;
}
```

Avoid raw values inside component files.

---

## 8. Component State Documentation

Every component specification should include:

```text
Purpose
Anatomy
Variants
Sizes
States
Responsive behavior
Motion
Accessibility
Performance
Content rules
Do / Don't
Acceptance criteria
```

---

# PART I — NAVIGATION COMPONENTS

---

## 9. Announcement Bar

### Purpose

The announcement bar communicates high-priority, short-lived information.

Examples:

* free shipping threshold
* campaign message
* delivery notice
* collection launch
* store update

It must never become a permanent banner dump.

### Anatomy

```text
Optional icon
Message
Optional link
Optional close action
```

### Recommended Height

```text
Mobile: 32–40px
Desktop: 32–44px
```

### Content Rules

Maximum recommended length:

```text
Mobile: 60–80 characters
Desktop: 100–120 characters
```

Preferred:

```text
2.500 ₺ ve üzeri alışverişlerde ücretsiz kargo.
```

Avoid:

```text
BUGÜNE ÖZEL ÇILGIN FIRSATLAR İÇİN HEMEN TIKLAYIN!!!
```

### Variants

```text
Default
Brand
Inverse
Promotional
Informational
```

Do not use semantic error or success colors for generic campaigns.

### Interaction

If multiple messages exist:

* use controlled rotation
* do not rotate faster than 5 seconds
* pause on hover
* pause when focused
* allow manual navigation
* avoid automatic rotation on mobile where possible

### Accessibility

* use meaningful text
* links must have descriptive labels
* rotation must be pausable
* close buttons require accessible names
* do not hide critical operational information permanently

### Motion

Recommended:

```text
Fade: 160–220ms
Slide: maximum 8–12px
```

Avoid continuous marquee movement.

### Acceptance Criteria

```text
[ ] Message is concise
[ ] Contrast is sufficient
[ ] Link is obvious
[ ] Mobile text does not overflow
[ ] Rotation is controllable
[ ] Close action is accessible
[ ] Header layout does not shift unexpectedly
```

---

## 10. Site Header

### Purpose

The site header provides global navigation, brand recognition, search, account access, wishlist, and cart access.

It is one of the most important trust components.

### Anatomy

```text
Announcement bar
Primary header
Logo
Desktop navigation
Utility actions
Mobile navigation trigger
Optional search
Optional secondary navigation
```

### Recommended Heights

```text
Mobile: 56–72px
Tablet: 64–76px
Desktop: 72–88px
```

The announcement bar is not included in these values.

### Header Variants

```text
Solid
Transparent
Overlay
Inverse
Compact
Sticky
```

### Transparent Header Rules

Use only when:

* hero image supports readable contrast
* logo has a suitable inverse version
* icons remain visible
* scroll transition is implemented
* mobile readability is tested

When scrolling, transition to:

* solid surface
* readable text
* stable border or subtle shadow
* consistent logo treatment

### Sticky Behavior

Recommended:

```text
Sticky after 0–40px scroll
Hide-on-scroll only when justified
Reappear on upward scroll
```

Avoid:

* aggressive disappearing headers
* layout jumps
* multiple sticky bars
* excessive blur
* large shadow changes

### Header Container

Must align with the page grid.

Recommended desktop structure:

```text
Logo: left
Primary navigation: center or left-center
Utility actions: right
```

### Logo Rules

* maintain clear space
* preserve aspect ratio
* do not resize on every scroll state
* provide alternate version for dark backgrounds
* use accessible home link label

### Utility Actions

Recommended order:

```text
Search
Account
Wishlist
Cart
```

On mobile:

```text
Menu
Logo
Search
Cart
```

or:

```text
Logo
Search
Cart
Menu
```

Choose one and preserve consistency.

### Icon Button Size

```text
Visual icon: 20–24px
Touch target: minimum 44×44px
```

### Cart Count

Requirements:

* visible
* not oversized
* readable at one and two digits
* maximum display may use `99+`
* announced accessibly when updated

### Header Motion

Recommended:

```text
Background transition: 180–260ms
Text color transition: 160–220ms
Header transform: 220–320ms
```

Use one consistent easing token.

### Accessibility

* header must use semantic `header`
* navigation must use `nav`
* logo must link to homepage
* icon buttons need labels
* keyboard focus must remain visible
* dropdown triggers must expose expanded state
* escape must close open menus
* focus must return correctly
* sticky header must not cover focused content

### Performance

* avoid turning the complete header into one large Client Component
* isolate interactive sections
* avoid continuous scroll listeners
* prefer CSS and Intersection Observer
* throttle any necessary scroll events

### Acceptance Criteria

```text
[ ] Header aligns with page grid
[ ] Logo remains stable
[ ] All actions are reachable
[ ] Transparent state remains readable
[ ] Sticky state does not jump
[ ] Mobile header is not cramped
[ ] Touch targets are sufficient
[ ] Keyboard navigation works
[ ] Menus close with Escape
[ ] Cart count updates accessibly
[ ] No unnecessary client-side rendering
```

---

## 11. Desktop Navigation

### Purpose

Desktop navigation gives fast access to primary product categories and editorial destinations.

### Anatomy

```text
Navigation list
Navigation item
Optional dropdown trigger
Active indicator
Optional promotional item
```

### Item Count

Recommended:

```text
5–9 primary items
```

If more are required:

* combine into categories
* use a mega menu
* move secondary links elsewhere

### Typography

Recommended:

```text
14–16px
Weight: 400–500
```

### Spacing

Recommended:

```text
Gap: 24–40px
```

Do not reduce spacing until items feel crowded.

### Active State

Use one or more:

* underline
* text emphasis
* subtle color
* small indicator

Do not rely only on a tiny color shift.

### Hover Behavior

Dropdowns should not open accidentally.

Recommended hover delay:

```text
Open: 100–180ms
Close: 160–240ms
```

Support pointer movement between trigger and menu.

### Accessibility

* use list semantics
* dropdown trigger must be a button
* expose `aria-expanded`
* support keyboard opening
* support arrow or tab navigation consistently
* do not create hover-only access

---

## 12. Mega Menu

### Purpose

The mega menu helps users discover large category structures while preserving an editorial brand experience.

It should feel curated, not like a marketplace directory.

### Anatomy

```text
Menu container
Category groups
Links
Featured collection
Editorial imagery
Optional promotional link
Footer links
```

### Recommended Width

```text
Full viewport width
Content aligned to page container
```

### Recommended Height

```text
Auto based on content
Usually 360–560px
```

Avoid filling the full viewport unless content requires it.

### Layout

Recommended:

```text
Navigation groups: 55–70%
Editorial content: 30–45%
```

Use:

```text
3–5 navigation groups
1–2 editorial images
1 featured collection
```

### Link Hierarchy

```text
Group title
Primary category links
Secondary utility links
```

Group titles must be visually distinct.

### Editorial Media

May include:

* campaign image
* collection image
* product feature
* seasonal story

Rules:

* no autoplay video
* no overly dense text
* image ratio must be intentional
* image must not overpower navigation

### Open Behavior

Supported methods:

* hover with delay
* click
* keyboard activation

Click-based behavior is more predictable.

If hover is used, click must still work.

### Close Behavior

Close when:

* Escape is pressed
* user clicks outside
* another navigation item opens
* route navigation begins
* focus intentionally leaves the menu

Do not close while pointer moves between trigger and panel.

### Motion

Recommended:

```text
Opacity: 0 → 1
Translate Y: -4px → 0
Duration: 180–260ms
```

Avoid dramatic scale animations.

### Focus Management

When opened by keyboard:

* focus may enter the first meaningful link
* trigger remains associated
* Escape returns focus to trigger
* hidden menu content must not remain focusable

### Mobile Behavior

Do not reuse desktop mega menu directly.

Mobile should use:

* accordion groups
* nested navigation view
* full-screen drawer
* clear back navigation

### Performance

* lazy-load editorial images if not immediately needed
* avoid mounting every complex menu panel at all times
* do not fetch menu data on hover
* keep category data centralized

### Acceptance Criteria

```text
[ ] Menu feels curated
[ ] Category hierarchy is clear
[ ] No overcrowding
[ ] Editorial media supports discovery
[ ] Pointer movement does not close menu accidentally
[ ] Keyboard navigation works
[ ] Escape closes menu
[ ] Focus returns correctly
[ ] Mobile uses a separate interaction pattern
[ ] No layout shift occurs
```

---

## 13. Mobile Menu

### Purpose

The mobile menu provides complete site navigation using a touch-friendly, focused experience.

### Preferred Pattern

Use a full-screen drawer or full-height side drawer.

Avoid narrow desktop-style dropdowns.

### Anatomy

```text
Header
Close button
Primary navigation
Expandable category groups
Utility links
Account link
Language or currency selector
Customer service links
Optional campaign image
```

### Width

```text
Mobile: 100%
Tablet: 420–520px if side drawer
```

### Navigation Levels

Recommended maximum:

```text
3 levels
```

Avoid deep nested menus.

### Interaction Patterns

Supported options:

#### Accordion

Best for moderate category depth.

#### Drill-Down

Best for large catalogs.

Structure:

```text
Main menu
→ Category
→ Subcategory
```

Must include a clear back action.

### Touch Targets

Minimum:

```text
44×44px
```

Recommended navigation row height:

```text
52–64px
```

### Scroll Behavior

* menu body scrolls
* header may remain sticky
* body behind menu is locked
* avoid nested scroll areas
* preserve scroll position after close

### Motion

Recommended:

```text
Drawer open: 280–360ms
Nested page transition: 220–300ms
Accordion: 180–240ms
```

### Accessibility

* menu trigger exposes expanded state
* drawer receives focus
* focus remains trapped
* Escape closes menu
* close button is first or easily reachable
* hidden background must not remain interactive
* focus returns to menu trigger

### Acceptance Criteria

```text
[ ] All primary categories are reachable
[ ] Touch targets are sufficient
[ ] Back navigation is obvious
[ ] Body scroll locks correctly
[ ] Menu supports screen readers
[ ] Focus is trapped
[ ] Escape closes
[ ] Utility links are visible
[ ] No cramped text
[ ] No desktop interaction is copied directly
```

---

## 14. Breadcrumbs

### Purpose

Breadcrumbs show page hierarchy and provide orientation.

They are particularly useful on:

* product pages
* category pages
* collection pages
* editorial articles
* search result subpages

### Anatomy

```text
Home
Separator
Parent category
Separator
Current page
```

### Recommended Depth

```text
2–4 levels
```

Avoid displaying excessively deep technical taxonomy.

### Typography

```text
12–14px
```

### Separator

Use:

* chevron
* slash
* simple divider

Do not use decorative symbols.

### Mobile Behavior

Options:

* show last parent only
* horizontally scroll
* truncate intermediate levels
* provide compact back link

Never allow breadcrumbs to wrap into four or five lines.

### Accessibility

* use `nav` with breadcrumb label
* use ordered list
* current page uses `aria-current="page"`
* decorative separators are hidden from screen readers

---

## 15. Bottom Navigation

### Purpose

Bottom navigation provides fast access to essential mobile destinations.

Use only when repeated access justifies permanent screen space.

### Recommended Items

```text
Home
Categories
Search
Wishlist
Cart
```

Recommended count:

```text
4–5 items
```

### Height

```text
56–72px plus safe area
```

### Rules

* use short labels
* icons must remain recognizable
* selected state must be clear
* cart count must remain readable
* do not hide primary checkout controls
* consider overlap with sticky add-to-cart bars

### Conflict Rules

Do not show bottom navigation simultaneously with:

* full-screen drawer
* critical checkout sticky action
* modal
* keyboard-open state where it obstructs input

### Accessibility

* icons need labels
* selected item uses `aria-current`
* touch target minimum 44px
* contrast must remain sufficient

---

# PART II — ACTION COMPONENTS

---

## 16. Button

### Purpose

Buttons initiate actions.

They must communicate hierarchy, state, and feedback clearly.

### Variants

```text
Primary
Secondary
Tertiary
Destructive
Inverse
Link
```

### Sizes

```text
Small
Medium
Large
```

Recommended heights:

```text
Small: 36–40px
Medium: 44–48px
Large: 52–56px
```

### Anatomy

```text
Optional leading icon
Label
Optional trailing icon
Optional loading indicator
```

### Primary Button

Use for:

* add to cart
* checkout
* save
* submit
* main page action

Limit to one dominant primary action per visual region.

### Secondary Button

Use for:

* alternative actions
* continue shopping
* open guide
* compare
* secondary CTA

### Tertiary Button

Use for:

* lower-priority actions
* inline actions
* navigation-like actions

### Destructive Button

Use only for:

* delete
* remove permanently
* cancel destructive operation

Do not use destructive styling for normal cart removal unless the action is irreversible.

### Full-Width Buttons

Appropriate for:

* mobile add-to-cart
* checkout
* modal confirmation
* form submission

Avoid full-width buttons in wide desktop layouts without reason.

### States

```text
Default
Hover
Focus
Active
Disabled
Loading
Success
```

### Loading State

Requirements:

* preserve button dimensions
* prevent duplicate submission
* show progress
* maintain accessible label
* do not replace label with only a spinner

Preferred:

```text
Sipariş oluşturuluyor…
```

### Icon Spacing

```text
Gap: 8px
```

### Motion

Recommended:

```text
Color transition: 120–180ms
Transform: maximum 1–2px
Loading transition: 140–200ms
```

Avoid excessive scale or bounce.

### Accessibility

* use native `button`
* define correct `type`
* maintain visible focus
* disabled state must be programmatic
* icon-only buttons require labels
* loading state should expose busy status

### Acceptance Criteria

```text
[ ] Variant matches action priority
[ ] Label uses a clear verb
[ ] Size matches context
[ ] Focus is visible
[ ] Loading preserves dimensions
[ ] Disabled state is understandable
[ ] Touch target is sufficient
[ ] Primary actions are not duplicated
```

---

## 17. Icon Button

### Purpose

Icon buttons support compact, familiar actions.

Examples:

* search
* close
* wishlist
* menu
* cart
* zoom
* share

### Size

```text
Visual icon: 18–24px
Control size: 40–48px
```

### Rules

* use familiar icons
* provide accessible label
* provide tooltip on desktop when meaning is not obvious
* do not mix multiple icon styles
* keep stroke width consistent

### Selected State

For wishlist or filters:

* change icon treatment
* expose pressed state
* optionally provide micro-feedback

Use:

```text
aria-pressed
```

when appropriate.

---

## 18. Text Link

### Purpose

Text links navigate users to another destination.

### Rules

* use anchors for navigation
* provide visible hover and focus state
* underline or another clear affordance
* do not style navigation links as buttons unless necessary
* external links may indicate destination when context requires it

### Inline Links

Inline links should usually be underlined.

Navigation links may use controlled underline motion.

### Accessibility

Link text must describe the destination.

Avoid:

```text
Buraya tıklayın
Devamı
Daha fazla
```

Prefer:

```text
Beden rehberini incele
Kargo ve iade koşullarını görüntüle
```

---

# PART III — FEEDBACK FOUNDATIONS

---

## 19. Badge

### Purpose

Badges communicate short, high-priority labels.

Examples:

* Yeni
* Çok Satan
* Sınırlı
* Online Özel
* Tükendi
* Düşük Stok

### Variants

```text
Neutral
Brand
Success
Warning
Error
Inverse
```

### Rules

* use concise labels
* maximum one or two badges per product card
* do not cover important image areas
* do not use every badge in bright colors
* badges must not create false urgency

### Size

```text
Height: 22–28px
Padding inline: 8–10px
```

### Typography

```text
11–13px
Weight: 500–600
```

---

## 20. Divider

### Purpose

Dividers separate related content areas.

Use when spacing alone is not sufficient.

### Variants

```text
Horizontal
Vertical
Inset
Full-width
```

### Rules

* use subtle border token
* avoid dividing every small group
* maintain consistent margins
* do not use heavy black lines

---

## 21. Skeleton

### Purpose

Skeletons preserve layout and indicate that content is loading.

### Rules

* match final geometry
* match image ratio
* match expected text lines
* preserve component dimensions
* avoid excessive shimmering
* respect reduced motion

### Motion

Recommended shimmer duration:

```text
1200–1800ms
```

A calm opacity pulse may feel more premium.

### Accessibility

Skeletons should not be announced individually.

The parent region may expose a loading status.

---

## 22. Spinner

### Purpose

Spinners communicate short, indeterminate processing.

Use for:

* small button actions
* brief inline updates
* local loading states

Do not use a spinner as the main page loading experience when skeletons are possible.

### Recommended Size

```text
16–24px inline
24–40px standalone
```

### Accessibility

Provide hidden loading text or busy state.

---

## 23. Component Acceptance Standard

Every component must satisfy:

```text
[ ] Purpose is clear
[ ] API is typed
[ ] States are complete
[ ] Tokens are used
[ ] Responsive behavior is defined
[ ] Keyboard interaction works
[ ] Focus is visible
[ ] Motion follows the Motion System
[ ] Loading behavior is stable
[ ] Error behavior is defined
[ ] Content rules are documented
[ ] Performance cost is reasonable
[ ] No duplicate component exists
```

---

## 24. AI Implementation Rules

When an AI agent creates or modifies a component, it must:

1. Search for an existing equivalent.
2. Use semantic HTML.
3. Use approved design tokens.
4. Define every relevant state.
5. Implement mobile behavior intentionally.
6. Add keyboard interactions.
7. Add visible focus states.
8. Respect reduced motion.
9. Avoid unnecessary Client Components.
10. Run component-level acceptance checks.
11. Document any new variant.
12. Avoid one-off visual hacks.

---

## 25. Self-Review Checklist

```text
[ ] Is this component necessary?

[ ] Does an equivalent already exist?

[ ] Is its purpose clear?

[ ] Is its API minimal and typed?

[ ] Are variants intentional?

[ ] Are all relevant states implemented?

[ ] Are design tokens used?

[ ] Is semantic HTML used?

[ ] Does it support keyboard interaction?

[ ] Is focus visible?

[ ] Does it work on mobile?

[ ] Does it work on tablet?

[ ] Does it remain stable on desktop?

[ ] Is motion subtle and consistent?

[ ] Does it respect reduced motion?

[ ] Does it avoid layout shift?

[ ] Is loading behavior defined?

[ ] Is empty behavior defined?

[ ] Is error behavior defined?

[ ] Is content guidance documented?

[ ] Is performance acceptable?

[ ] Does it feel consistent with the brand?

[ ] Does it feel premium?

[ ] Can another developer reuse it safely?
```

---

## 26. Final Principle

A premium component library should reduce decisions without reducing creativity.

Every component should feel like part of one system.

When uncertain:

```text
Reuse before creating.

Simplify the API.

Define every state.

Protect accessibility.

Preserve consistency.

Remove unnecessary variants.
```
