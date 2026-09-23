# MODULE 15 — MASTER CLAUDE CODE AUDIT & IMPLEMENTATION PROMPT

You are working inside an existing Next.js frontend project for a premium lingerie, underwear, sleepwear, and loungewear ecommerce brand.

The storefront has already been designed and implemented to some extent.

Your task is not to create another plan, rewrite the entire project from scratch, or produce only a visual review.

Your task is to:

1. Inspect the complete repository.
2. Read the complete E-Commerce Design Operating System documentation.
3. Audit the current implementation against those standards.
4. Classify all findings by severity.
5. Fix the problems directly in the codebase.
6. Verify the result through production-level checks.
7. Report evidence and remaining limitations honestly.

The website is frontend-only.

Do not add:

* backend services
* database
* payment provider
* authentication provider
* CMS
* external ecommerce API

Unless an existing integration already exists and must be preserved, use typed mock data and frontend state.

---

# 1. REQUIRED ROLE

Act simultaneously as:

* Senior Creative Director
* Premium Fashion Art Director
* Senior Ecommerce UX Designer
* Senior Next.js Architect
* TypeScript Engineer
* Responsive Design Specialist
* Accessibility Specialist
* Motion Designer
* Performance Engineer
* Technical SEO Specialist
* Commerce QA Lead
* Release Manager

However, work in the correct priority order.

Do not begin with decorative polish while functional, commerce, responsive, accessibility, performance, or build failures remain.

---

# 2. FIRST REQUIRED ACTIONS

Before changing any code:

1. Inspect the complete repository tree.
2. Read the root `CLAUDE.md`.
3. Read `.claude/skills/premium-fashion-ui/SKILL.md`.
4. Read all project documentation.
5. Locate and read every ECDOS module.

Expected modules may include files representing:

* Brand Bible
* Visual Language
* Motion System
* Typography System
* Color System
* Layout and Grid System
* Component Bible
* UX Bible
* Responsive and Mobile Experience Bible
* Accessibility Bible
* Motion and Interaction Bible
* Performance Engineering Bible
* SEO and Discoverability Bible
* Final QA, Testing and Launch Bible

The exact filenames may differ.

Search the project rather than assuming paths.

6. Inspect:

   * `package.json`
   * Next.js version
   * TypeScript configuration
   * Tailwind configuration
   * global styles
   * fonts
   * route structure
   * shared components
   * mock data
   * client-state logic
   * localStorage logic
   * metadata
   * image configuration
   * lint scripts
   * test scripts
   * build scripts

7. Create a private working task list.

8. Begin implementation after the audit.

Do not stop after providing an audit report.

---

# 3. PROJECT IDENTITY

This is a premium lingerie and intimate fashion storefront for adult customers.

The brand must feel:

* refined
* elegant
* modern
* confident
* soft
* tasteful
* editorial
* trustworthy
* fashion-forward
* commercially usable

It must never feel:

* explicit
* pornographic
* fetish-oriented
* cheap
* childish
* overly provocative
* generic
* template-like
* SaaS-like
* marketplace-like
* excessively pink
* crowded
* promotional-banner-heavy

All models and imagery must clearly represent adults.

The interface must remain suitable for a mainstream premium fashion ecommerce brand.

---

# 4. CORE DESIGN CONCEPT

Preserve and strengthen the existing concept:

## Soft Editorial Luxury

The preferred design language includes:

* warm ivory or cream foundation
* deep neutral typography
* one restrained brand accent
* strong editorial photography
* elegant serif and modern sans-serif pairing
* generous but controlled whitespace
* refined asymmetry
* clean product grids
* subtle motion
* premium mobile experience
* clear commerce hierarchy

Do not redesign the brand identity unless the existing visual language clearly violates the documentation.

Prefer refinement over unnecessary reinvention.

---

# 5. AUDIT SEVERITY MODEL

Classify every finding as:

## P0 — Release Blocker

Examples:

* production build fails
* required route crashes
* add-to-cart is broken
* incorrect product or variant enters cart
* cart cannot be used
* critical mobile journey is unusable
* secret data is exposed
* severe keyboard trap exists
* required page does not render

## P1 — Critical

Examples:

* size selection is incorrect
* bra-size combinations silently change
* incorrect price or stock is displayed
* critical navigation is inaccessible
* major responsive failure exists
* search or filters are unusable
* primary LCP architecture is severely broken
* important SEO pages are not discoverable
* return or product information is misleading

## P2 — Important

Examples:

* spacing inconsistency
* weak visual hierarchy
* missing loading state
* poor tablet layout
* missing focus state
* inconsistent typography
* weak product-card behavior
* suboptimal client boundaries
* incorrect image crop
* incomplete metadata

## P3 — Enhancement

Examples:

* optional micro-interaction
* editorial refinement
* minor copy improvement
* optional animation polish
* additional test coverage

Fix in this order:

```text
P0
↓
P1
↓
P2
↓
P3 when time and risk allow
```

---

# 6. REQUIRED ROUTE AUDIT

Locate the actual route structure.

Verify that the project contains or intentionally maps equivalent routes for:

* `/`
* `/yeni-gelenler`
* `/cok-satanlar`
* `/sutyen`
* `/kulot`
* `/bralet`
* `/body`
* `/gecelik`
* `/pijama`
* `/ev-giyimi`
* `/setler`
* `/koleksiyonlar`
* `/koleksiyon/[slug]`
* `/urun/[slug]`
* `/arama`
* `/favoriler`
* `/sepet`
* `/beden-rehberi`
* `/hakkimizda`
* `/magazin`
* `/magazin/[slug]`
* custom `not-found.tsx`

Do not create duplicate routes if the project already uses a valid alternate taxonomy.

If a required route is missing, implement it using existing shared components and typed data.

---

# 7. AUDIT AND IMPLEMENTATION ORDER

Work in the following order.

## Stage 1 — Repository and Build Health

Inspect and fix:

* dependency problems
* invalid imports
* TypeScript errors
* lint errors
* route errors
* hydration problems
* missing assets
* broken image configuration
* invalid metadata
* console errors
* invalid React nesting
* duplicate keys
* broken environment assumptions

Run the available verification commands.

Do not continue decorative work while the project does not build.

---

## Stage 2 — Commerce-Critical Logic

Audit:

* product data model
* product variant model
* price formatting
* selected color
* selected size
* bra band size
* bra cup size
* variant resolution
* stock availability
* add-to-cart
* quantity updates
* cart lines
* wishlist
* recently viewed
* localStorage persistence

The final cart item must resolve to a real product variant ID.

Do not store only display labels.

---

## Stage 3 — Bra Size System

This is a critical requirement.

The experience must support combinations such as:

* 70A
* 70B
* 70C
* 75A
* 75B
* 75C
* 75D
* 80B
* 80C
* 80D
* 85C
* 85D
* 90D

Use two coordinated groups where appropriate:

```text
Bant ölçüsü
Kup ölçüsü
```

Required behavior:

1. Selecting a band updates available cups.
2. Selecting a cup resolves a real combined variant.
3. Valid selections are preserved.
4. If the customer changes the band and the selected cup remains valid, preserve it.
5. If the selected cup becomes invalid, clear it and explain why.
6. Never silently substitute another cup or band.
7. Show the final selected size visibly.
8. Make the selected size available to assistive technology.
9. Prevent unavailable combinations from entering the cart.
10. Keep the size guide near the selector.

Example error:

```text
80 bant ölçüsünde C kup şu anda mevcut değil.
Lütfen başka bir kup seçin.
```

No product size may be auto-selected by default.

---

## Stage 4 — Main Customer Journeys

Audit and implement these journeys:

### Journey A

```text
Homepage
→ Category
→ Product
→ Select color
→ Select size
→ Add to cart
→ Cart
```

### Journey B

```text
Search
→ Results
→ Product
→ Add to cart
```

### Journey C

```text
Category
→ Filters
→ Sorting
→ Product
→ Browser Back
→ Previous filter and scroll state
```

### Journey D

```text
Product
→ Size guide
→ Recommended size
→ Return to product
→ Select size
→ Add to cart
```

### Journey E

```text
Product
→ Wishlist
→ Wishlist page
→ Move to cart
```

### Journey F

```text
Mobile menu
→ Category
→ Product
→ Sticky add-to-cart
→ Cart
```

Preserve customer context wherever practical.

---

# 8. HEADER AND NAVIGATION AUDIT

Audit:

* announcement bar
* transparent homepage state
* solid internal-page state
* sticky transition
* logo placement
* navigation spacing
* icon spacing
* search
* account placeholder
* wishlist
* cart
* mega menu
* mobile menu
* body scroll locking
* focus management

Desktop navigation should remain curated.

Recommended primary items:

* Yeni
* Sütyen
* Külot
* Bralet
* Gecelik & Pijama
* Ev Giyimi
* Koleksiyonlar
* Magazin

Do not create a marketplace-style navigation with too many top-level links.

---

# 9. MEGA MENU AUDIT

The mega menu must feel editorial and premium.

It should include:

* clear category groups
* customer-facing language
* selected collections
* one or two editorial images
* restrained motion
* keyboard access
* Escape behavior
* correct focus return
* stable pointer behavior

Do not reuse the desktop mega menu directly on mobile.

Mobile must use:

* accordion navigation
* drill-down navigation
* or a full-screen drawer

---

# 10. HOMEPAGE AUDIT

Audit the complete homepage.

The homepage should normally include:

1. Announcement bar
2. Premium header
3. Strong hero campaign
4. Primary category discovery
5. New arrivals
6. Editorial split or collection story
7. Best sellers
8. Shop by mood or need
9. Size-confidence section
10. Lookbook or shoppable editorial
11. Seasonal collection campaign
12. Brand manifesto
13. Magazine content
14. Trust content
15. Newsletter
16. Premium footer

Do not add sections merely to satisfy a count.

Every section must support:

* discovery
* brand
* trust
* product understanding
* commerce

Remove repetitive or weak sections.

---

# 11. HERO AUDIT

The homepage hero must:

* communicate the brand within five seconds
* have one logical `h1`
* include one clear primary CTA
* optionally include one secondary CTA
* use adult, tasteful imagery
* preserve readable contrast
* have intentional mobile art direction
* avoid hiding the product or model
* load efficiently
* avoid delaying interaction

Recommended motion:

* restrained image scale
* short text reveal
* no scroll hijacking
* no continuous zoom
* reduced-motion fallback

---

# 12. PRODUCT CARD AUDIT

Every standard product card must provide:

* consistent image ratio
* primary image
* optional secondary image on hover-capable devices
* product name
* price
* optional previous price
* one restrained badge where relevant
* wishlist
* quick add where appropriate
* touch-equivalent behavior
* loading state
* unavailable state

Product cards must not:

* depend on hover
* change layout height on hover
* show excessive metadata
* use several badges
* use fake urgency
* contain inaccessible nested interactive controls

Audit large product grids for performance.

---

# 13. PRODUCT LISTING AUDIT

Category and collection pages must provide:

* breadcrumb
* category heading
* concise useful introduction
* product count
* filters
* sorting
* active filter chips
* product grid
* loading state
* empty state
* controlled pagination or load more
* browser-state restoration

Filters should use customer priorities.

For lingerie:

* Category
* Size
* Band size
* Cup size
* Color
* Model
* Support level
* Padding
* Underwire
* Price
* Material
* Collection

Do not expose useless filters.

---

# 14. SEARCH AUDIT

Search must support:

* full-screen or large overlay
* focused search input
* recent searches
* trending searches
* suggestions
* categories
* products
* result page
* no-result recovery
* Turkish characters
* common typo tolerance where practical
* controlled request behavior

Do not invent false popularity claims.

For frontend-only mock mode, clearly maintain suggestions inside centralized typed data.

---

# 15. PRODUCT DETAIL PAGE AUDIT

The PDP is the highest-priority page.

Audit:

* gallery
* product title
* price
* collection/category
* color selection
* standard size
* bra sizing
* fit information
* support information
* padding information
* underwire information
* material
* care
* stock
* quantity
* add-to-cart
* wishlist
* delivery
* returns
* product details
* complete the look
* related products
* recently viewed

Desktop:

* gallery left
* sticky purchase panel right

Mobile:

* swipeable gallery
* purchase-critical information early
* sticky add-to-cart after original CTA leaves view

Do not hide sizing information inside deep accordions.

---

# 16. SIZE GUIDE AUDIT

The size guide must support:

* dedicated page
* PDP trigger
* modal or drawer
* keyboard
* screen reader
* mobile
* zoom
* text instructions
* semantic size tables

Include guidance for:

* underbust measurement
* bust measurement
* waist
* hip
* standard sizing
* bra sizing
* fit troubleshooting

Do not present size results as a universal guarantee.

Preferred copy:

```text
Ölçülerinize göre başlangıç için 75C bedeni deneyebilirsiniz.
```

---

# 17. CART AUDIT

Audit:

* cart drawer
* full cart page
* item image
* product name
* selected color
* selected size
* quantity
* unit price
* subtotal
* remove
* undo
* move to wishlist
* shipping progress
* promo field
* recommendations
* checkout demo action

Recommendations must remain secondary to checkout.

Cart drawer structure:

```text
Sticky header
Scrollable items
Sticky summary and checkout action
```

Mobile cart drawer should generally be full-screen.

---

# 18. WISHLIST AUDIT

Wishlist must support:

* guest usage
* localStorage persistence
* hydration-safe initialization
* add
* remove
* empty state
* product availability
* move to cart
* accessible pressed state

Do not require sign-in for the frontend prototype.

---

# 19. RESPONSIVE AUDIT

Test and fix at:

* 320px
* 375px
* 390px
* 430px
* 768px
* 1024px
* 1280px
* 1440px
* 1728px

Also inspect:

* mobile landscape
* short laptop heights
* 200% zoom
* keyboard-open mobile layouts

Responsive design must recompose.

Do not merely reduce desktop widths.

---

# 20. MOBILE PRIORITY AUDIT

Mobile must be treated as the primary commerce environment.

Verify:

* header
* full-screen menu
* search
* 2-column product grid
* product-card readability
* gallery swipe
* size selector
* bra-size selector
* bottom sheets
* filter drawer
* cart drawer
* sticky add-to-cart
* safe areas
* touch targets
* keyboard behavior

Minimum touch target:

```text
44 × 44px
```

Preferred primary commerce target:

```text
48 × 48px
```

Avoid competing sticky bottom interfaces.

---

# 21. ACCESSIBILITY AUDIT

Target WCAG-oriented Level AA behavior.

Audit:

* semantic HTML
* page language
* skip link
* landmarks
* heading hierarchy
* buttons vs links
* visible focus
* logical tab order
* keyboard journey
* icon labels
* form labels
* error associations
* text contrast
* UI contrast
* color-independent states
* product-image alt text
* reduced motion
* 200% zoom
* dialog focus
* drawer focus
* focus restoration
* live-region announcements

The complete purchase journey must be possible without a mouse.

---

# 22. PRODUCT VARIANT ACCESSIBILITY

Use native or accessible radio-group semantics for exclusive selections.

Expose:

* group name
* option name
* selected state
* availability
* disabled state

Color swatches require customer-facing names.

Example:

```text
Bordo
Siyah
Fildişi
Gül kurusu
```

Never expose raw hex values as the only accessible name.

---

# 23. MOTION AUDIT

Audit all motion against the Motion System.

Use existing duration and easing tokens.

Prefer:

* opacity
* transform
* small distance
* fast direct feedback
* restrained spatial motion

Avoid:

* scroll hijacking
* continuous CTA pulsing
* large card lift
* 3D tilt
* bouncing menus
* confetti
* long staggered product grids
* decorative cursor effects
* autoplay sound

Direct feedback must begin within approximately 100ms.

Reduced-motion mode must preserve meaning.

---

# 24. PERFORMANCE AUDIT

Audit:

* Server Components
* Client Component boundaries
* `"use client"` scope
* image dimensions
* `next/image`
* `sizes`
* hero priority
* lazy loading
* gallery loading
* hover-image cost
* font loading
* third-party scripts
* dependency cost
* hydration
* request duplication
* Suspense boundaries
* bundle size
* layout shift

Default to Server Components.

Do not convert complete pages to Client Components for small interactions.

Identify the likely LCP element on every major template.

---

# 25. IMAGE PERFORMANCE AUDIT

Verify:

* correct dimensions
* stable aspect ratios
* correct image priority
* mobile-specific hero crop
* optimized catalog thumbnails
* no multi-megabyte PNG photography
* no eager loading for all gallery media
* no priority flag on every image
* accurate alt text
* correct product color representation

Product imagery must remain visually premium.

Do not destroy lace, texture, skin tone, or fabric detail through excessive compression.

---

# 26. TYPOGRAPHY AUDIT

Audit:

* font families
* font loading
* Turkish character support
* heading hierarchy
* type scale
* line height
* letter spacing
* paragraph width
* price typography
* product-card typography
* button typography
* responsive scaling

Use no more than two font families unless already justified by the brand system.

Remove random font sizes.

Prefer semantic typography tokens.

---

# 27. COLOR AUDIT

Audit:

* semantic tokens
* neutral consistency
* brand accent use
* button hierarchy
* surface hierarchy
* text contrast
* border contrast
* selected states
* error states
* focus rings
* text over imagery
* dark sections

Do not introduce raw hex values inside components unless unavoidable and documented.

Color must not be the only state indicator.

---

# 28. LAYOUT AUDIT

Audit:

* page containers
* gutters
* section spacing
* product grids
* card gaps
* hero composition
* PDP split
* filter width
* cart width
* modal width
* text width
* z-index
* sticky behavior
* safe areas
* horizontal overflow

Use the approved layout and spacing tokens.

Remove arbitrary spacing hacks.

---

# 29. CONTENT AUDIT

All user-facing copy must be:

* natural Turkish
* concise
* premium
* respectful
* customer-facing
* free of placeholder text
* free of fake urgency
* free of unsupported claims
* free of body-shaming language
* free of explicit sexual language

Remove:

* lorem ipsum
* placeholder brand names
* broken machine translations
* excessive exclamation marks
* internal technical terminology

All models and image descriptions must clearly represent adults.

---

# 30. TRUST AUDIT

Verify accurate or clearly placeholder-ready areas for:

* delivery
* shipping threshold
* return and exchange
* hygiene-related restrictions
* payment methods
* secure payment
* customer support
* size assistance
* material and care

Do not state operational promises as fact unless supported by project data or clearly marked configurable mock content.

---

# 31. SEO AUDIT

Audit:

* metadata
* unique titles
* meta descriptions
* canonical URLs
* H1
* semantic route slugs
* Open Graph
* Twitter metadata
* robots
* sitemap
* breadcrumb schema
* product schema readiness
* Offer schema readiness
* internal linking
* server-rendered product facts
* alt text
* 404 behavior

Do not emit production structured data containing fake:

* reviews
* ratings
* stock
* prices
* guarantees

Centralize SEO helpers where appropriate.

---

# 32. AI AND GEO DISCOVERABILITY

Ensure important product facts exist as structured visible HTML.

Examples:

```text
Model
Support level
Underwire
Padding
Strap type
Closure
Coverage
Material
Care
Fit
```

Do not hide all product information inside marketing prose.

Use consistent terminology across:

* categories
* products
* search
* filters
* metadata
* guides

Important guides should answer the main question early.

---

# 33. LOADING, EMPTY AND ERROR STATES

Audit all important states.

Required examples:

* product-grid skeleton
* page skeleton
* empty cart
* empty wishlist
* no search results
* no filtered results
* missing product
* invalid collection
* image failure
* product loading failure
* cart-update failure
* newsletter failure
* unavailable variant
* price change readiness

Every state must provide a useful recovery path.

---

# 34. FRONTEND STATE AUDIT

For frontend-only persistence, verify:

* localStorage access is hydration-safe
* malformed stored data is handled
* data is versioned where useful
* no unnecessary personal data is stored
* cart state persists
* wishlist state persists
* recently viewed persists
* invalid stored variants are safely discarded or corrected

Do not block initial server rendering on localStorage.

---

# 35. COMPONENT ARCHITECTURE AUDIT

Look for:

* duplicated buttons
* duplicated drawers
* duplicated modals
* duplicated product cards
* one-off spacing hacks
* oversized components
* giant prop interfaces
* unnecessary boolean variants
* repeated product data
* inaccessible generic wrappers

Prefer:

* reusable primitives
* semantic variants
* composition
* typed APIs
* centralized data
* centralized formatting
* centralized variant resolution

---

# 36. REQUIRED SHARED COMPONENTS

Verify or create reusable equivalents for:

* AnnouncementBar
* SiteHeader
* DesktopNavigation
* MegaMenu
* MobileMenu
* SearchOverlay
* CartDrawer
* WishlistButton
* ProductCard
* ProductGrid
* ProductRail
* Price
* ColorSwatch
* SizeSelector
* BraSizeSelector
* QuantitySelector
* FilterDrawer
* SortMenu
* ActiveFilterChips
* EditorialHero
* EditorialSplit
* CategoryCard
* LookbookHotspot
* SectionHeader
* SizeGuideModal
* Accordion
* Modal
* Drawer
* BottomSheet
* Toast
* NewsletterForm
* EmptyState
* ProductSkeleton
* Footer

Do not recreate a component if a valid reusable equivalent already exists.

---

# 37. IMPLEMENTATION DISCIPLINE

When fixing an issue:

1. Identify the requirement that failed.
2. Identify affected files.
3. Identify regression risks.
4. Make the smallest coherent change.
5. Reuse existing tokens and components.
6. Re-test the original issue.
7. Re-test related components.
8. Re-test mobile.
9. Re-test keyboard behavior.
10. Re-run build-related verification.

Do not perform broad uncontrolled rewrites.

---

# 38. TESTING REQUIREMENTS

Use the project’s existing test stack.

Where tests exist, update or add tests for critical logic.

Prioritize automated testing for:

* price formatting
* variant resolution
* bra-size combinations
* cart totals
* shipping threshold
* URL filters
* localStorage parsing
* search normalization

Prioritize interaction tests for:

* size selection
* bra-size selection
* add-to-cart
* cart quantity
* wishlist
* filters
* modal
* drawer
* accordion
* mobile menu

Do not spend excessive time adding low-value tests while major implementation issues remain.

---

# 39. REQUIRED COMMANDS

Determine the correct commands from `package.json`.

Run the available equivalents of:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

Then run the production application where possible.

Do not claim a command passed if it was not actually executed.

If a command does not exist, report that clearly.

---

# 40. REQUIRED VIEWPORT REVIEW

Review at:

```text
320 × 568
375 × 667
390 × 844
430 × 932
768 × 1024
1024 × 768
1280 × 800
1366 × 768
1440 × 900
1728 × 1117
```

Prioritize:

* homepage
* category
* search
* PDP
* size guide
* wishlist
* cart
* mobile menu
* filter drawer
* cart drawer
* 404

Fix visible overflow, clipping, overlap, and interaction failures.

---

# 41. REQUIRED KEYBOARD JOURNEY

Verify the following journey without a pointer:

```text
Open homepage
↓
Use primary navigation
↓
Open Sütyen category
↓
Open filters
↓
Select a filter
↓
Open a product
↓
Select a color
↓
Select band size
↓
Select cup size
↓
Confirm combined size
↓
Add product to cart
↓
Open cart
↓
Change quantity
↓
Remove or continue
```

No step may depend exclusively on:

* hover
* color
* gesture
* animation
* mouse

---

# 42. VISUAL POLISH PASS

Only after P0 and P1 findings are resolved, perform a visual polish pass.

Audit:

* typography rhythm
* whitespace
* image crop
* button hierarchy
* icon consistency
* borders
* radii
* shadows
* product-card rhythm
* header quality
* mega-menu presentation
* mobile composition
* empty states
* skeletons
* footer structure

The site should not look like a default Tailwind or ecommerce template.

However, do not add unnecessary effects merely to make it look more designed.

---

# 43. FINAL QUALITY STANDARD

The finished storefront should communicate:

```text
Premium
Elegant
Soft
Modern
Trustworthy
Adult
Tasteful
Editorial
Commercial
Fast
```

It must simultaneously provide:

* clear discovery
* correct variant selection
* excellent mobile usability
* accessible interaction
* immediate feedback
* strong product imagery
* fast loading
* stable layout
* useful SEO architecture
* consistent Turkish content

---

# 44. COMPLETION CONDITIONS

Do not declare completion while any of these remain:

* production build failure
* unresolved TypeScript error
* unresolved P0 issue
* unresolved P1 commerce issue
* missing critical route
* broken main mobile journey
* broken keyboard journey
* incorrect bra-size resolution
* incorrect cart variant
* critical hydration warning
* major page-level horizontal overflow
* inaccessible blocking modal or drawer

---

# 45. FINAL REPORT FORMAT

After implementation and verification, provide a concise but complete report using this structure:

## 1. Repository Assessment

* stack
* architecture
* current strengths
* major initial risks

## 2. Findings Summary

```text
P0:
P1:
P2:
P3:
```

Include the final remaining counts, not only initial counts.

## 3. Critical Fixes Completed

List the actual problems fixed.

## 4. Design and UX Improvements

Include:

* homepage
* navigation
* product cards
* listing pages
* PDP
* size guide
* mobile
* cart
* wishlist
* search

## 5. Commerce Logic Improvements

Include:

* variants
* bra sizing
* add-to-cart
* cart
* persistence
* price formatting

## 6. Accessibility Improvements

Include:

* semantics
* keyboard
* focus
* labels
* announcements
* reduced motion
* zoom

## 7. Performance Improvements

Include:

* Server/Client boundaries
* images
* fonts
* loading
* bundle/dependencies
* LCP/CLS/INP-oriented changes

## 8. SEO Improvements

Include:

* metadata
* canonical
* schema
* routes
* sitemap
* robots
* product facts

## 9. Files Changed

List important files and explain the purpose of each change.

## 10. Verification Evidence

Report actual commands run and their results.

Example:

```text
npm run lint — passed
npm run typecheck — passed
npm run test — 42 passed
npm run build — passed
```

Do not invent results.

## 11. Remaining Limitations

Clearly disclose:

* frontend-only limitations
* mock-data limitations
* missing backend validation
* browser testing not performed
* unavailable external services
* remaining P2/P3 items

---

# 46. FINAL INSTRUCTION

Do not return only an audit or plan.

Inspect the project, classify the findings, implement the fixes, run the available verification commands, and report the evidence.

Begin now.
