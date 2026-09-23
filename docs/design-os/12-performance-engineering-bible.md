# E-Commerce Design Operating System

# Module 12 — Performance Engineering Bible

## Next.js Performance Architecture for Premium Fashion Commerce

---

# 1. Purpose

Performance is part of the customer experience.

The storefront must feel:

```text
Immediate
Stable
Smooth
Responsive
Lightweight
Reliable
```

A premium interface that feels slow is not premium.

Performance must be considered during:

```text
Architecture
↓
Component Design
↓
Image Strategy
↓
Data Strategy
↓
Animation
↓
Implementation
↓
Build
↓
Deployment
↓
Monitoring
```

---

# 2. Performance Philosophy

Do not optimize only for Lighthouse.

Optimize for real customers.

Priority:

```text
1. Fast first content
2. Fast primary image
3. Stable layout
4. Fast interaction
5. Smooth scrolling
6. Low JavaScript cost
7. Efficient navigation
8. Lighthouse quality
```

---

# 3. Core Web Vitals Targets

Target production performance:

```text
LCP ≤ 2.5s

INP ≤ 200ms

CLS ≤ 0.1
```

Preferred internal target:

```text
LCP ≤ 2.0s

INP ≤ 150ms

CLS ≤ 0.05
```

Do not design exactly at the failure threshold.

Maintain performance headroom.

---

# 4. Performance Testing Conditions

Test under realistic conditions.

Include:

```text
Mobile viewport
Mid-range device
Throttled network
Cold cache
Warm cache
Production build
Real images
Realistic product counts
```

Do not judge performance only through:

```text
npm run dev
```

Development mode is not representative of production performance.

---

# 5. Performance Budget

Recommended initial storefront budget:

```text
Initial JS:
≤ 170 KB compressed preferred

Critical CSS:
As small as practical

Hero media:
≤ 300 KB preferred mobile
≤ 500 KB preferred desktop

Product thumbnail:
~40–120 KB depending on dimensions

Fonts:
Only required families and weights

Third-party JS:
Minimal
```

These are budgets, not excuses to reduce visual quality unnecessarily.

---

# PART I — NEXT.JS ARCHITECTURE

# 6. Server Components First

Default to Server Components.

Use Client Components only when required for:

```text
State
Effects
Browser APIs
Direct interaction
Interactive animation
Client-only libraries
```

Examples that may require Client Components:

```text
Cart drawer
Wishlist button
Variant selector
Product gallery
Mobile menu
Search overlay
Filter drawer
```

Examples that usually do not:

```text
Product title
Product description
Editorial copy
Footer
Static category navigation
SEO content
Brand story
```

---

# 7. Client Boundary Rule

Never add:

```tsx
"use client"
```

at a high-level page or layout solely because one child component needs interaction.

Bad:

```text
Entire PDP
→ Client Component
```

Preferred:

```text
PDP Server Component

├── GalleryClient
├── ProductInformation
├── VariantSelectorClient
├── DeliveryInformation
└── Recommendations
```

Keep the client boundary as low as practical.

---

# 8. Client Island Architecture

Think in interactive islands.

Example:

```text
Server-rendered page

├── Static header structure
│
├── Interactive SearchTrigger
│
├── Product content
│
├── Interactive VariantSelector
│
├── Interactive AddToCart
│
└── Static editorial content
```

This reduces:

```text
Hydration
JavaScript
Memory
Main-thread work
```

---

# 9. Avoid Unnecessary State

Do not store values in React state when they can be:

```text
Derived
URL-based
Server-rendered
CSS-controlled
Native HTML behavior
```

Bad:

```text
isMobile
windowWidth
cardHovered
sectionVisible
```

for every component.

Use CSS media queries and native capabilities whenever possible.

---

# 10. URL State

Useful commerce state should live in the URL when appropriate.

Examples:

```text
Search query
Category
Sort
Filters
Page
```

Benefits:

```text
Shareable
Recoverable
Server-renderable
Back-button friendly
Reduced client complexity
```

---

# PART II — RENDERING STRATEGY

# 11. Static Rendering

Use static rendering for content that rarely changes.

Examples:

```text
About
Magazine article
Editorial campaign
Size guide
Care guide
Brand story
```

---

# 12. Dynamic Rendering

Use dynamic rendering only when genuinely necessary.

Examples may include:

```text
Personalized account data
User-specific wishlist
Cart
Real-time inventory
```

Do not make an entire route dynamic because one small region changes.

---

# 13. Streaming

Use streaming where it improves perceived speed.

Example PDP:

```text
Immediate:

Product name
Price
Main image
Variant selector
CTA

Stream later:

Reviews
Recommendations
Recently viewed
Editorial recommendations
```

Purchase-critical content must not wait for secondary content.

---

# 14. Suspense Boundaries

Use localized Suspense boundaries.

Preferred:

```text
Product Page

├── Critical Product Content
├── Reviews Suspense
├── Recommendations Suspense
└── Recently Viewed Suspense
```

Avoid one giant page-level Suspense boundary.

---

# 15. Loading Hierarchy

Loading priority:

```text
1. Header
2. Primary product/hero image
3. Product title
4. Price
5. Variant controls
6. Primary CTA
7. Supporting product content
8. Recommendations
9. Editorial content
```

---

# PART III — IMAGE PERFORMANCE

# 16. Image Principle

Images are one of the most important parts of a fashion storefront.

Do not sacrifice image quality.

Instead optimize:

```text
Dimensions
Format
Compression
Loading
Responsive sizes
Crop
Priority
```

---

# 17. Next Image

Use:

```tsx
import Image from "next/image";
```

for suitable storefront images.

Provide:

```text
width + height

or

fill + stable parent aspect ratio
```

Never allow image dimensions to be unknown.

---

# 18. Responsive Sizes

Every responsive image must have an accurate:

```tsx
sizes
```

Example product grid:

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

Incorrect `sizes` can cause unnecessarily large image downloads.

---

# 19. Product Image Aspect Ratio

Define stable ratios.

Possible catalog ratio:

```text
4:5
```

or:

```text
3:4
```

Use one primary catalog ratio consistently.

Reserve the layout before the image loads.

---

# 20. Hero Images

The LCP image must be identified intentionally.

For the primary above-the-fold hero:

```text
High loading priority
Correct responsive size
Correct crop
Optimized compression
No unnecessary JS dependency
```

Do not lazy-load the LCP image.

---

# 21. Mobile Hero Asset

Prefer dedicated mobile imagery when the desktop composition does not translate well.

Example:

```text
hero-desktop.avif

hero-mobile.avif
```

This improves:

```text
Composition
File size
LCP
Visual quality
```

---

# 22. Image Formats

Preferred:

```text
AVIF
WebP
```

with appropriate fallback handled by the image pipeline.

JPEG may remain suitable for certain source workflows.

PNG should generally be reserved for:

```text
Transparency
Graphics requiring lossless quality
```

Do not use multi-megabyte PNG photography.

---

# 23. Image Compression

Compression must preserve:

```text
Fabric texture
Lace detail
Skin tone
Product color
Fine stitching
```

Fashion imagery must not become visibly degraded for a small performance gain.

---

# 24. Product Thumbnail Budget

For catalog cards, target approximately:

```text
40–120 KB
```

depending on:

```text
Resolution
Compression
Image complexity
Display size
```

Do not serve 2000px images into 300px product cards.

---

# 25. Gallery Loading

PDP gallery strategy:

```text
Main image:
high priority

Next likely image:
normal priority

Remaining images:
lazy load
```

Do not preload the entire gallery.

---

# 26. Secondary Hover Image

Do not load every secondary image at maximum priority.

Possible strategy:

```text
Primary image → immediate

Secondary image → normal/lazy

Additional imagery → only PDP
```

Test whether secondary-image hover justifies network cost on large grids.

---

# 27. Offscreen Images

Use lazy loading for:

```text
Below-fold product cards
Editorial sections
Recommendations
Recently viewed
Footer media
```

---

# 28. Blur Placeholder

Use blur placeholders selectively.

Good:

```text
Hero
Large editorial imagery
PDP primary media
```

Optional:

```text
Product grid
```

Avoid expensive placeholder generation if it provides little visual value.

---

# PART IV — VIDEO PERFORMANCE

# 29. Video Principle

Campaign video can create premium visual impact but is expensive.

Use only where the benefit justifies:

```text
Network cost
Battery cost
CPU/GPU cost
Mobile cost
```

---

# 30. Hero Video

Requirements:

```text
Muted
Plays inline
Optimized
Poster image
No audio download unless needed
Reduced-motion fallback
Mobile fallback
```

Do not make hero video mandatory for understanding the page.

---

# 31. Video Loading

Recommended:

```text
Poster immediately

Video after critical page content

Pause when offscreen
```

Do not preload large video files before the hero poster or primary CTA is available.

---

# 32. Mobile Video

On mobile, strongly consider:

```text
Static image

Shorter clip

Lower-resolution clip
```

instead of the desktop video.

---

# PART V — FONT PERFORMANCE

# 33. Font Principle

Typography is part of the premium identity.

But every font weight adds cost.

---

# 34. Next Font

Use:

```text
next/font
```

when appropriate.

Benefits:

```text
Self-hosting
Optimization
Reduced layout shift
Preloading
Privacy
```

---

# 35. Font Families

Recommended maximum:

```text
1 primary family

+

1 editorial/display family if genuinely necessary
```

Do not use four font families for luxury appearance.

---

# 36. Font Weights

Load only required weights.

Example:

```text
400
500
600
```

If editorial headings require:

```text
300
```

load it intentionally.

Avoid loading:

```text
100–900
```

unless a variable font is efficiently used.

---

# 37. Variable Fonts

Prefer a variable font when it meaningfully reduces requests and file size.

Do not request axes that are never used.

---

# 38. Font Display

Prevent invisible text.

Use appropriate font-display behavior.

The page must remain readable while custom fonts load.

---

# 39. Font Layout Shift

Use compatible fallback metrics where possible.

Avoid dramatic shifts in:

```text
Hero headings
Navigation
Buttons
Product titles
Prices
```

---

# PART VI — CSS PERFORMANCE

# 40. CSS Principle

Prefer CSS for simple visual behavior.

Use CSS for:

```text
Hover
Focus
Simple transitions
Responsive layouts
Basic accordion transitions
Visual states
```

Do not use JavaScript for styling that CSS handles better.

---

# 41. Tailwind Discipline

If Tailwind CSS is used:

* use design tokens
* avoid arbitrary values everywhere
* create reusable component patterns
* keep responsive utilities intentional

Bad:

```text
mt-[73px]
w-[427px]
left-[13px]
```

throughout the project.

Use arbitrary values only when the design genuinely requires them.

---

# 42. Global CSS

Keep global CSS focused on:

```text
Tokens
Reset
Typography
Shared primitives
Accessibility helpers
```

Avoid placing page-specific styling into a giant global file.

---

# 43. Expensive CSS

Use carefully:

```text
backdrop-filter
blur
large shadows
mix-blend-mode
complex masks
large clip-path animation
```

These can be visually useful but expensive when applied across large areas.

---

# 44. Backdrop Blur

Premium headers often use blur.

Use it selectively.

Avoid:

```text
Large full-screen backdrop blur
Multiple overlapping blurred layers
Blur on scrolling product grids
```

---

# PART VII — JAVASCRIPT BUDGET

# 45. JavaScript Principle

JavaScript should enable commerce.

It should not recreate browser features unnecessarily.

---

# 46. Avoid Client-Side Everything

Do not build the storefront as:

```text
Large client-side SPA
```

when Next.js server rendering can provide most of the interface.

---

# 47. Dependency Evaluation

Before adding a dependency, ask:

```text
What problem does it solve?

Can native browser APIs solve it?

Can CSS solve it?

What is its bundle cost?

Is it tree-shakeable?

Will it force Client Components?

Is it actively maintained?
```

---

# 48. Large Libraries

Avoid importing a complete utility or icon library when only a few functions are needed.

Prefer:

```text
Named imports
Tree-shakeable packages
Small focused libraries
```

---

# 49. Icon Strategy

Use a consistent icon library.

Do not load:

```text
Multiple icon libraries
Large SVG sprite systems unnecessarily
```

Icons should be optimized SVG.

---

# 50. Motion Library

Use Motion for React only where needed.

Good:

```text
Drawer
Drag
Shared layout
Complex presence
```

CSS is sufficient for:

```text
Button hover
Focus
Simple card image transition
Underline
Simple fade
```

---

# 51. Dynamic Imports

Use dynamic import for expensive client-only functionality.

Candidates:

```text
Advanced gallery lightbox
Large size recommendation tool
Complex video player
Optional personalization
Rarely used modal feature
```

Do not dynamically import tiny components without reason.

---

# PART VIII — HYDRATION

# 52. Hydration Principle

Hydration is not free.

Reduce the amount of HTML requiring client-side React activation.

---

# 53. Hydration Hotspots

Common risks:

```text
Mega menu
Product grid
Variant selector
Cart
Wishlist
Search
Filters
Carousels
```

Audit these components carefully.

---

# 54. Avoid Hydrating Static Cards

A product card does not automatically need to be a Client Component.

Possible structure:

```text
ProductCard Server Component

├── Product image
├── Product name
├── Price
└── WishlistButton Client Component
```

Do not hydrate the entire card for one heart button.

---

# 55. Hydration Mismatch

Avoid client/server differences caused by:

```text
Date
Random values
Window dimensions
Local storage
Browser-only data
```

Handle them intentionally.

Hydration warnings must not be ignored.

---

# PART IX — PRODUCT GRID PERFORMANCE

# 56. Product Grid Principle

Product grids are one of the highest-risk areas because they combine:

```text
Many images
Many links
Wishlist controls
Badges
Prices
Hover states
Responsive layout
```

---

# 57. Grid Rendering

Do not render hundreds of products at once.

Use:

```text
Pagination
Load more
Controlled infinite scroll
```

depending on the experience.

---

# 58. Initial Product Count

A reasonable starting range may be:

```text
12–24 products
```

depending on:

```text
Viewport
Card complexity
Image weight
Business requirements
```

---

# 59. Infinite Scroll

If used:

* preserve browser history
* preserve scroll position
* expose reachable footer
* support keyboard navigation
* update URL/state appropriately
* avoid unbounded DOM growth

Load More may be better for a premium storefront.

---

# 60. Product Card Complexity

Avoid adding to every card:

```text
Multiple videos
Large swatch systems
Complex carousel
Heavy animation
Full variant logic
```

Keep the catalog card lightweight.

Move complexity to:

```text
Quick add
Product page
```

---

# 61. Hover Image Cost

For 24 visible products:

```text
24 primary images

+

24 hover images
```

can double image cost.

Load secondary images strategically.

---

# 62. Wishlist Cost

Wishlist buttons may be client islands.

Do not turn the entire grid into one large Client Component solely for wishlist state.

---

# PART X — CAROUSEL PERFORMANCE

# 63. Carousel Principle

Do not initialize a heavy carousel library for every horizontal product rail.

Native:

```text
overflow-x
scroll-snap
```

may be enough.

---

# 64. Product Rail

Prefer:

```css
overflow-x: auto;
scroll-snap-type: x mandatory;
```

for simple rails.

Add JavaScript only for features that genuinely require it.

---

# 65. Hidden Slides

Do not eagerly render and load large numbers of invisible slides.

---

# 66. Autoplay

Avoid autoplay product carousels.

It creates:

```text
CPU work
Motion
Interaction conflicts
Accessibility problems
```

without significant commerce value.

---

# PART XI — HEADER PERFORMANCE

# 67. Header Principle

The header exists on every page.

It must remain lightweight.

---

# 68. Mega Menu

Do not eagerly download all editorial mega-menu imagery at highest priority.

Load:

```text
Navigation text immediately

Editorial media normally/lazily
```

---

# 69. Search

Do not load a large search engine bundle on initial page render if search has not been opened.

Load advanced search functionality on interaction where appropriate.

---

# 70. Header Scroll Logic

Avoid expensive continuous scroll calculations.

Prefer:

```text
CSS
Intersection Observer
Simple threshold logic
```

---

# PART XII — THIRD-PARTY SCRIPTS

# 71. Third-Party Principle

Third-party scripts are performance debt.

Examples:

```text
Analytics
Ads
Chat widgets
Heatmaps
Reviews
Social embeds
Tracking
A/B testing
```

Every script must justify its cost.

---

# 72. Script Priority

Classify:

```text
Critical

Post-interaction

Idle

Consent-dependent
```

Do not load everything before the customer can see the product.

---

# 73. Next Script

Use:

```text
next/script
```

with an appropriate loading strategy.

Do not paste uncontrolled scripts directly into the document.

---

# 74. Consent

Marketing and analytics scripts that require consent must not execute prematurely.

Performance and privacy architecture should work together.

---

# 75. Chat Widgets

Do not load large chat widgets immediately.

Possible strategy:

```text
Small launcher

↓

Customer opens

↓

Widget code loads
```

---

# 76. Social Embeds

Avoid heavy Instagram/TikTok embeds on critical storefront pages.

Prefer optimized preview media linking to the original platform when appropriate.

---

# PART XIII — DATA AND NETWORK

# 77. Network Principle

Do not fetch data the customer cannot yet use.

---

# 78. Request Waterfalls

Avoid:

```text
Page request

↓

Product request

↓

Price request

↓

Inventory request

↓

Recommendation request
```

where requests can be parallelized or combined.

---

# 79. Parallel Fetching

Independent data should load concurrently.

Example:

```text
Product

Price

Inventory
```

when architecture permits.

Secondary:

```text
Reviews

Recommendations
```

can stream separately.

---

# 80. Duplicate Requests

Do not fetch the same product data separately in:

```text
Page

Breadcrumb

Gallery

Purchase panel

Recommendations
```

Use appropriate shared server data access.

---

# 81. Overfetching

Request only required fields.

Product card may need:

```text
id
slug
name
price
thumbnail
badge
basic color info
```

It does not need:

```text
Full description
All gallery images
Complete review objects
All variant metadata
```

---

# PART XIV — CACHING

# 82. Cache Principle

Cache stable data aggressively.

Refresh dynamic commerce data intentionally.

---

# 83. Stable Data

Examples:

```text
Categories
Navigation
Editorial content
Size guide
Care guide
Static product copy
```

may be cached longer.

---

# 84. Dynamic Data

Examples:

```text
Inventory
User cart
Wishlist
Personalized recommendations
```

require more careful cache rules.

---

# 85. Cache Invalidation

Prefer intentional invalidation.

Do not disable caching globally because one piece of data changes frequently.

---

# PART XV — PREFETCHING

# 86. Prefetch Principle

Prefetch what the customer is likely to need.

Do not prefetch everything.

---

# 87. Product Links

Next.js may prefetch linked routes.

Review large product grids carefully.

Do not generate excessive background network activity.

---

# 88. Intent-Based Prefetch

For expensive resources, consider intent signals such as:

```text
Hover
Focus
Viewport proximity
Touch start
```

when appropriate.

---

# 89. Cart Prefetch

Cart UI code may be loaded early if cart interaction is highly likely and bundle cost is small.

Large optional features should wait.

---

# PART XVI — CLS PREVENTION

# 90. CLS Principle

Nothing should unexpectedly jump.

Reserve dimensions for:

```text
Images
Hero
Product cards
Badges
Price
Error messages
Sticky bars
Recommendations
Ads if ever used
```

---

# 91. Image CLS

Always define dimensions or aspect ratio.

---

# 92. Font CLS

Use optimized fonts and compatible fallback metrics.

---

# 93. Price CLS

Reserve enough space for:

```text
Regular price

Sale price

Previous price
```

Do not allow price layout to jump when discount data loads.

---

# 94. Error CLS

Where practical, reserve or smoothly manage validation message space.

Avoid shifting an entire form after submission.

---

# 95. Sticky Bar CLS

Sticky bars should overlay or occupy known space.

Do not insert them unpredictably into normal document flow.

---

# PART XVII — LCP OPTIMIZATION

# 96. LCP Principle

Identify the LCP element on every major page template.

Examples:

```text
Homepage → Hero image

Category → Heading or first product image

PDP → Primary product image

Magazine → Article hero
```

---

# 97. Homepage LCP

Optimize:

```text
Hero asset
Hero HTML
Font loading
Header
Critical CSS
```

Avoid making the hero dependent on a large client-side animation library before rendering.

---

# 98. PDP LCP

Primary product image should:

```text
Render immediately
Have stable dimensions
Use correct source size
Avoid unnecessary JS
```

---

# 99. LCP Anti-Patterns

Avoid:

```text
Lazy-loading LCP image

Huge hero video

Client-rendered hero

Large render-blocking scripts

Incorrect image sizes

Multiple competing priority images
```

---

# PART XVIII — INP OPTIMIZATION

# 100. INP Principle

Interaction must feel immediate.

Critical interactions:

```text
Open menu
Open search
Select size
Select color
Add to cart
Open cart
Apply filter
Change quantity
```

---

# 101. Main Thread

Avoid long JavaScript tasks.

Break expensive work into smaller tasks where necessary.

Do not process large product datasets synchronously in the browser if the server can do it.

---

# 102. Variant Selection

Selecting a size must not trigger expensive rerendering of the entire PDP.

Localize state.

---

# 103. Filter Interaction

Do not run expensive filtering across thousands of products synchronously in the client unless intentionally designed for it.

Prefer server/query-based filtering for real catalog scale.

---

# 104. Search

Debounce network search appropriately.

Do not debounce visual typing feedback.

---

# PART XIX — MEMORY

# 105. Memory Principle

Long browsing sessions must remain stable.

Watch:

```text
Infinite scroll DOM growth
Large image galleries
Event listeners
Timers
Observers
Motion instances
Video
```

---

# 106. Cleanup

Client components must clean up:

```text
Listeners
Observers
Timers
Subscriptions
```

when unmounted.

---

# 107. Gallery Memory

Do not keep unnecessarily large decoded images active indefinitely.

---

# PART XX — MOBILE PERFORMANCE

# 108. Mobile Principle

Mobile is the strictest performance environment.

Assume:

```text
Slower CPU
Less memory
Slower network
Battery constraints
Thermal constraints
```

---

# 109. Mobile Simplification

Reduce:

```text
Video
Parallax
Blur
Large animation
Preloaded imagery
Heavy JS
```

without reducing product clarity.

---

# 110. Mobile Hero

Prioritize:

```text
Fast poster/image
Readable headline
Immediate CTA
```

over cinematic effects.

---

# 111. Mobile Product Grid

Two-column grids can display many images simultaneously.

Ensure image dimensions and loading strategy are correct.

---

# PART XXI — DEVELOPMENT DISCIPLINE

# 112. Production Testing

Before approving performance:

```bash
npm run build
npm run start
```

Test the production build.

Do not approve based solely on dev mode.

---

# 113. Build Warnings

Resolve:

```text
Hydration warnings
Image warnings
Font warnings
Duplicate keys
Large dependency warnings
Unexpected dynamic rendering
```

Do not normalize warnings as acceptable.

---

# 114. Bundle Analysis

Periodically inspect bundle size.

Look for:

```text
Duplicate libraries
Large icon packages
Unused dependencies
Unexpected client bundles
Large motion libraries
Date libraries
Utility duplication
```

---

# 115. Performance Regression

Every major feature should be compared against the previous baseline.

Examples:

```text
New mega menu
New gallery
New personalization
New campaign hero
New analytics
New chat widget
```

A visually small feature can cause a large performance regression.

---

# PART XXII — PAGE-SPECIFIC PERFORMANCE

# 116. Homepage

Priority:

```text
Header
Hero
First category/product section
```

Defer:

```text
Lower editorial sections
Instagram/social
Recently viewed
Large footer media
```

---

# 117. Category Page

Priority:

```text
Heading
Product count
Filters
First product row
```

Avoid:

```text
Loading every product
Loading every secondary image
Heavy client filtering
```

---

# 118. Product Detail Page

Priority:

```text
Primary image
Name
Price
Color
Size
CTA
```

Defer:

```text
Reviews
Recommendations
Recently viewed
Editorial modules
```

---

# 119. Search Page

Priority:

```text
Input
Query
Result count
First results
```

Keep search interaction lightweight.

---

# 120. Cart

Priority:

```text
Cart items
Quantity
Total
Checkout CTA
```

Recommendations must never delay cart functionality.

---

# PART XXIII — PERFORMANCE ANTI-PATTERNS

# 121. Never Do

```text
"use client" on entire application

Lazy-load the LCP image

Load all product images immediately

Load all gallery images as priority

Use desktop images on mobile unnecessarily

Load all font weights

Add multiple icon libraries

Use JavaScript for CSS behavior

Load giant carousel libraries for simple rails

Render hundreds of products at once

Load chat widget immediately

Load social embeds above fold

Run heavy filtering on every keystroke

Ignore hydration warnings

Use multi-megabyte hero PNGs

Use autoplay video without fallback

Animate large blurred layers continuously

Prefetch everything

Disable caching globally

Use one giant Suspense boundary

Wait for recommendations before rendering PDP

Test performance only on desktop
```

---

# PART XXIV — LIGHTHOUSE QUALITY GATES

# 122. Lighthouse Targets

Production target:

```text
Performance ≥ 90

Accessibility ≥ 95

Best Practices ≥ 95

SEO ≥ 95
```

Preferred:

```text
Accessibility = 100

Best Practices = 100

SEO = 100
```

Performance may vary by environment, but major regressions require investigation.

---

# 123. Lighthouse Rule

Never optimize the score by harming:

```text
Product image quality
Accessibility
SEO content
Purchase usability
Brand experience
```

The goal is a fast real site, not a synthetic-score trick.

---

# PART XXV — PERFORMANCE ACCEPTANCE TESTS

# 124. Global Performance Acceptance

```text
[ ] Production build succeeds

[ ] No hydration warnings

[ ] Server Components are default

[ ] Client boundaries are localized

[ ] LCP element is identified

[ ] LCP image is not lazy-loaded

[ ] Responsive image sizes are correct

[ ] Images have stable dimensions

[ ] Fonts are optimized

[ ] Only necessary font weights load

[ ] CLS remains within target

[ ] Critical interactions remain responsive

[ ] Third-party scripts are controlled

[ ] Reduced-motion mode reduces expensive effects

[ ] Mobile assets are optimized
```

---

# 125. Product Grid Acceptance

```text
[ ] Initial product count is controlled

[ ] Images use correct dimensions

[ ] Secondary images are not over-prioritized

[ ] Product cards are not unnecessarily hydrated

[ ] Wishlist is isolated

[ ] Grid animations remain lightweight

[ ] Pagination/load-more strategy is scalable

[ ] Large catalogs do not create massive DOM trees
```

---

# 126. PDP Acceptance

```text
[ ] Primary product image loads quickly

[ ] Product information renders without unnecessary JS

[ ] Variant state is localized

[ ] Gallery does not preload everything

[ ] Reviews are secondary

[ ] Recommendations are secondary

[ ] Add-to-cart remains responsive

[ ] Sticky CTA does not create layout shift
```

---

# 127. Mobile Acceptance

```text
[ ] Dedicated mobile hero asset exists where needed

[ ] Heavy video is removed or reduced

[ ] Product images match mobile display size

[ ] Motion is simplified

[ ] Blur effects are controlled

[ ] JavaScript remains limited

[ ] Touch interactions respond immediately

[ ] Scrolling remains smooth
```

---

# PART XXVI — AI IMPLEMENTATION RULES

# 128. AI Performance Rules

When an AI coding agent creates or modifies storefront code, it must:

1. Default to Server Components.
2. Add `"use client"` only when required.
3. Keep Client Component boundaries small.
4. Identify the likely LCP element.
5. Optimize the LCP resource intentionally.
6. Use `next/image` where appropriate.
7. Provide accurate `sizes`.
8. Reserve image dimensions.
9. Avoid eager loading below-fold media.
10. Avoid unnecessary dependencies.
11. Prefer CSS over JS for simple interactions.
12. Avoid unnecessary hydration.
13. Parallelize independent server data requests.
14. Prevent request waterfalls.
15. Avoid overfetching.
16. Use caching intentionally.
17. Defer secondary commerce content.
18. Control third-party scripts.
19. Test production builds.
20. Protect Core Web Vitals.

---

# 129. AI Dependency Rule

Before installing any new frontend package, the coding agent must answer internally:

```text
Is this already possible with:

CSS?

Browser APIs?

React?

Next.js?

Existing project dependency?
```

Only install the package if the answer is no or the package provides substantial implementation value.

---

# 130. AI Image Rule

Before adding an image, determine:

```text
Display dimensions

Aspect ratio

Mobile crop

Desktop crop

Loading priority

Expected file size

Alt behavior
```

Do not insert arbitrary high-resolution assets.

---

# 131. AI Client Component Rule

Before adding:

```tsx
"use client"
```

determine which exact requirement needs it.

If only one child requires interaction, isolate that child.

---

# 132. Performance Self-Review

```text
[ ] Is this component required above the fold?

[ ] Does it require JavaScript?

[ ] Can it remain a Server Component?

[ ] Can CSS handle the interaction?

[ ] Is the dependency necessary?

[ ] Are images correctly sized?

[ ] Is the image priority correct?

[ ] Is this likely the LCP element?

[ ] Are dimensions reserved?

[ ] Are fonts optimized?

[ ] Is data fetched only once?

[ ] Can requests run in parallel?

[ ] Can secondary content stream later?

[ ] Is caching appropriate?

[ ] Could this create CLS?

[ ] Could this create a long main-thread task?

[ ] Does this hurt INP?

[ ] Does it remain smooth on mobile?

[ ] Does reduced motion reduce performance cost?

[ ] Is third-party code deferred?

[ ] Does production build remain clean?

[ ] Did the feature increase bundle size significantly?

[ ] Does the visual benefit justify the performance cost?
```

---

# 133. Performance Commandment

For every new visual feature ask:

```text
What does the customer gain?

What does the browser pay?
```

If browser cost is high and customer value is low:

```text
Do not build it.
```

---

# 134. Premium Performance Principle

Premium does not mean:

```text
More JavaScript
More animation
More video
More libraries
More effects
```

Premium means:

```text
Better typography

Better photography

Better spacing

Better hierarchy

Better interaction

Better speed
```

---

# 135. Final Principle

The storefront must feel fast before metrics are inspected.

The customer should experience:

```text
Tap

↓

Response

Search

↓

Results

Select size

↓

Immediate state

Add to cart

↓

Immediate confirmation

Navigate

↓

Useful content
```

There should be no moment where the customer wonders:

```text
"Çalıştı mı?"
```

When uncertain:

```text
Render on the server.

Ship less JavaScript.

Load fewer resources.

Prioritize the product.

Optimize the image.

Defer secondary content.

Avoid unnecessary dependencies.

Protect layout stability.

Test on mobile.

Measure production.
```
