# E-Commerce Design Operating System

# Module 14 — Final QA, Testing & Launch Bible

## Production Readiness, Regression Prevention and Release Quality Gates

---

# 1. Purpose

This module defines how the storefront is reviewed, tested, approved, and released.

A page is not complete because:

* it looks correct in one viewport
* it works on the developer’s computer
* the build succeeds
* the happy path works
* no obvious console error appears

A storefront is complete only when its:

```text
Design

UX

Responsive behavior

Accessibility

Performance

SEO

Commerce state

Content

Error recovery

Production build
```

have all passed documented quality gates.

---

# 2. Core Philosophy

Quality assurance is not the final phase of development.

It is a continuous system.

Every meaningful feature should move through:

```text
Definition

↓

Implementation

↓

Component Review

↓

Journey Review

↓

Cross-Device Review

↓

Regression Testing

↓

Production Verification
```

Do not leave every test until the project appears visually finished.

---

# 3. Definition of Done

A feature is complete only when:

```text
Its primary state works.

Its edge cases work.

Its loading state works.

Its empty state works.

Its error state works.

Its mobile state works.

Its keyboard state works.

Its reduced-motion state works.

Its production build works.
```

Visual completion alone is insufficient.

---

# 4. Quality Priority Levels

All findings must receive a severity level.

## P0 — Release Blocker

The storefront cannot launch.

Examples:

```text
Checkout or cart path is broken.

Add-to-cart does not work.

Critical route returns an error.

Sensitive data is exposed.

Major accessibility trap exists.

Production build fails.

Primary mobile experience is unusable.

Pricing or product variant is incorrect.

Severe legal or consent issue exists.
```

P0 issues must be fixed immediately.

---

## P1 — Critical

Major customer or business harm is likely.

Examples:

```text
Size selection is confusing or incorrect.

Cart total is inconsistent.

Navigation is inaccessible.

Product image fails on a major viewport.

Core Web Vitals are severely degraded.

Search does not return expected results.

Return conditions are misleading.

Major SEO pages are not indexable.
```

P1 issues should be resolved before launch.

---

## P2 — Important

The experience works, but quality is meaningfully reduced.

Examples:

```text
Spacing inconsistency

Weak loading state

Poor tablet layout

Minor focus issue

Incorrect image crop

Unclear secondary copy

Visual regression

Small animation inconsistency
```

P2 issues should be resolved before final approval where practical.

---

## P3 — Enhancement

The experience is acceptable, but refinement is possible.

Examples:

```text
Micro-interaction polish

Minor copy refinement

Additional test coverage

Small editorial improvement

Optional animation improvement
```

P3 issues may be placed in the post-launch backlog.

---

# 5. Release Gates

A release must pass these gates:

```text
Gate 1 — Build

Gate 2 — Functional

Gate 3 — Commerce

Gate 4 — Responsive

Gate 5 — Accessibility

Gate 6 — Performance

Gate 7 — SEO

Gate 8 — Content

Gate 9 — Browser and Device

Gate 10 — Production Smoke Test
```

Failure in any P0 or P1 gate blocks launch.

---

# PART I — TEST ENVIRONMENTS

# 6. Development Environment

Used for:

* rapid implementation
* component inspection
* local state testing
* debugging
* initial responsive review

Do not use development mode as the final performance benchmark.

---

# 7. Production Build Environment

Before approval, run:

```bash
npm run lint
npm run typecheck
npm run build
npm run start
```

If no `typecheck` script exists, use the project’s TypeScript verification command.

Production review must use the optimized build.

---

# 8. Staging Environment

The staging environment should closely resemble production.

Verify:

```text
Environment variables

Image domains

CDN behavior

Caching

Redirects

Metadata

Robots behavior

Analytics configuration

Consent behavior

External links
```

Do not expose a staging environment as an indexable production duplicate.

---

# 9. Production Environment

After deployment, perform smoke testing against the real domain.

Do not assume staging guarantees production correctness.

Potential differences include:

```text
CDN

Domain

Cookies

HTTPS

Headers

Caching

Third-party scripts

Redirects

Environment variables
```

---

# PART II — TEST DATA

# 10. Test Data Principle

Testing only ideal products creates false confidence.

Use products with varied states.

Required fixtures:

```text
Standard product

Discounted product

New product

Best seller

Out-of-stock product

Low-stock product

Product with one color

Product with many colors

Product with standard sizes

Product with bra sizes

Product with unavailable combinations

Product with long name

Product with long description

Product without reviews

Product with many gallery images
```

---

# 11. Price Test Data

Test:

```text
₺99

₺1.499

₺12.999

Discounted price

Same price across variants

Different price across variants

Missing compare-at price

Zero or invalid price protection
```

No invalid price should appear as:

```text
NaN

undefined

₺0
```

unless zero pricing is intentional.

---

# 12. Product Name Stress Tests

Test names such as:

```text
Luna Dantel Balkonet Sütyen

Second Skin Dikişsiz Hafif Destekli Balensiz Bralet

Uzun Kollu Modal Düğmeli Rahat Kesim Pijama Takımı
```

Verify:

* product card wrapping
* PDP heading
* cart item
* search result
* metadata
* mobile layout

---

# 13. Variant Test Data

Standard sizes:

```text
XS
S
M
L
XL
XXL
```

Bra sizes:

```text
70A
70B
70C
75A
75B
75C
75D
80B
80C
80D
85C
85D
90D
```

Include invalid combinations.

Example:

```text
70D unavailable
80A unavailable
90B unavailable
```

---

# PART III — AUTOMATED QUALITY CHECKS

# 14. Linting

Lint must pass without unresolved important warnings.

Do not ignore:

```text
Unused variables

Invalid hooks

Missing dependencies

Accessibility warnings

Image warnings

Unsafe patterns

Duplicate imports
```

---

# 15. TypeScript

Type checking must pass.

Never hide unresolved issues using:

```ts
any
```

or:

```ts
// @ts-ignore
```

without a documented, exceptional reason.

---

# 16. Production Build

The production build must succeed without:

```text
Route failure

Metadata failure

Hydration issue

Missing environment variable

Image configuration error

Dynamic rendering surprise

Invalid static generation
```

---

# 17. Unit Tests

Recommended for:

```text
Price formatting

Discount calculation

Variant resolution

Bra-size combinations

Cart totals

Shipping threshold

URL filter parsing

Search normalization

Data validation
```

Commerce logic should not rely only on visual testing.

---

# 18. Component Tests

Recommended for:

```text
Button states

Wishlist state

Size selector

Bra-size selector

Quantity control

Filter chips

Cart item

Accordion

Modal

Drawer

Toast
```

Test behavior, not implementation details.

---

# 19. Integration Tests

Recommended flows:

```text
Select product variant

Add product to cart

Update quantity

Remove item

Apply filter

Search product

Open and close drawer

Use size guide result

Persist wishlist

Restore cart state
```

---

# 20. End-to-End Tests

Critical E2E journeys:

```text
Homepage → Category → PDP → Cart

Search → PDP → Cart

Category → Filter → PDP → Cart

PDP → Size Guide → Size Selection → Cart

Wishlist → PDP → Cart

Mobile Menu → Category → PDP → Cart
```

These flows should be tested in a production-like environment.

---

# PART IV — FUNCTIONAL QA

# 21. Navigation QA

Verify:

```text
Logo opens homepage

All primary navigation links work

Mega menu opens correctly

Mega menu closes correctly

Mobile drill-down works

Breadcrumb links work

Browser Back works

Browser Forward works

404 appears for invalid paths

External links open appropriately
```

---

# 22. Header QA

Test:

```text
Transparent state

Solid state

Sticky state

Scroll direction behavior

Logo contrast

Cart count

Wishlist count

Search trigger

Mobile menu trigger

Focus visibility

Short viewport height
```

---

# 23. Search QA

Test:

```text
Empty query

Single-character query

Valid query

Typo query

Turkish-character query

No-result query

Long query

Clear action

Keyboard submit

Suggestion navigation

Recent searches

Search overlay close
```

---

# 24. Filter QA

Test:

```text
Single filter

Multiple filters

Remove one filter

Clear all filters

Unavailable combination

No-result state

Filter URL

Browser Back

Page reload

Mobile apply action

Desktop immediate update

Result count
```

---

# 25. Sorting QA

Verify:

```text
Recommended

Newest

Best sellers

Price ascending

Price descending
```

The current option must be visible and persist appropriately.

---

# 26. Product Card QA

Test:

```text
Primary image

Secondary image

Wishlist

Quick add

Badge

Long product name

Discounted price

Unavailable product

Keyboard focus

Touch behavior
```

---

# 27. Product Gallery QA

Test:

```text
Swipe

Previous and next controls

Thumbnails

Image counter

Zoom

Lightbox

Video

Keyboard navigation

Escape

Slow image load

Failed image
```

---

# 28. Color Selection QA

Verify:

```text
Selected color is visible

Gallery updates

Availability updates

Price updates if relevant

URL updates if relevant

Size is preserved when valid

Invalid size is cleared with explanation
```

---

# 29. Standard Size QA

Test:

```text
No selection

Valid selection

Unavailable size

Low-stock size

Changing selection

Add-to-cart validation

Keyboard navigation

Screen-reader state
```

---

# 30. Bra Size QA

Test every critical rule:

```text
Band selected first

Cup selected first if supported

Valid combination

Invalid combination

Changing band while cup remains valid

Changing band while cup becomes invalid

Selected combined size

Unavailable variant

Size-guide result

Add-to-cart resolution
```

No size may be silently substituted.

---

# 31. Add-to-Cart QA

Test:

```text
No size selected

Valid product

Out-of-stock product

Rapid repeated click

Slow response

Failed response

Success feedback

Cart count update

Cart drawer opening

Local persistence
```

---

# 32. Wishlist QA

Test:

```text
Add

Remove

Repeated click

Persistence

Empty state

Unavailable product

Move to cart

Keyboard interaction

Accessible label
```

---

# 33. Cart QA

Verify:

```text
Correct product

Correct color

Correct size

Correct unit price

Correct quantity

Correct subtotal

Correct discount

Correct shipping progress

Remove

Undo

Variant edit

Empty cart

Persistence

Refresh

Multiple products
```

---

# 34. Newsletter QA

Test:

```text
Empty email

Invalid email

Valid email

Repeated submission

Loading

Success

Failure

Consent

Keyboard

Screen-reader announcement
```

---

# PART V — RESPONSIVE QA

# 35. Required Viewports

Test:

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

1920 × 1080
```

These are reference targets.

---

# 36. Height Testing

Test short screens carefully.

Critical examples:

```text
320 × 568

667 × 375 landscape

1366 × 768 laptop
```

Check:

* sticky panels
* modal buttons
* hero CTA
* purchase action
* mobile keyboard
* menu height

---

# 37. Orientation QA

Test:

```text
Portrait → Landscape

Landscape → Portrait
```

Verify preservation of:

```text
Selected product

Selected size

Selected color

Gallery position

Filter state

Cart state

Open modal when appropriate
```

---

# 38. Zoom QA

Test at:

```text
125%

150%

200%
```

Verify:

```text
No content overlap

No clipped controls

No hidden actions

No unreadable navigation

No broken product grid

No inaccessible sticky elements
```

---

# 39. Mobile Safe-Area QA

Test:

```text
Sticky add-to-cart

Bottom navigation

Bottom sheet

Full-screen menu

Cart drawer
```

with safe-area insets.

---

# PART VI — ACCESSIBILITY QA

# 40. Keyboard-Only Test

Complete these paths without mouse:

```text
Homepage navigation

Mega menu

Search

Filters

Product cards

Gallery

Color selection

Standard size

Bra size

Size guide

Add to cart

Cart quantity

Remove item

Newsletter
```

---

# 41. Focus QA

Verify:

```text
Focus is always visible

Focus order is logical

Focus does not disappear

Sticky UI does not cover focus

Modal traps focus

Drawer traps focus

Focus returns after close
```

---

# 42. Screen Reader QA

Critical announcements:

```text
Menu expanded

Search suggestions count

Filters applied

Results count

Color selected

Size selected

Combined bra size selected

Product added

Cart quantity changed

Product removed

Form error

Form success
```

Avoid duplicate announcements.

---

# 43. Contrast QA

Test:

```text
Primary text

Secondary text

Muted text

Links

Buttons

Focus rings

Inputs

Disabled controls

Badges

Sale price

Text over imagery

Dark sections
```

---

# 44. Reduced-Motion QA

Verify:

```text
Hero remains clear

Navigation remains understandable

Drawers still communicate spatial change

Parallax is removed

Autoplay motion is reduced

Product-card functionality remains

Cart feedback remains visible
```

---

# 45. High-Contrast and Forced-Color QA

Where supported, inspect:

```text
Buttons

Form controls

Focus

Selected variants

Checkboxes

Radio controls

Links
```

Do not rely on background images or subtle borders alone.

---

# PART VII — VISUAL QA

# 46. Visual Consistency

Audit:

```text
Typography

Spacing

Color

Borders

Radius

Shadows

Icon size

Button hierarchy

Image ratio

Section rhythm

Loading states
```

---

# 47. Pixel Review

Check high-value areas:

```text
Header

Hero

Primary category section

Product card

PDP purchase panel

Bra-size selector

Cart drawer

Mobile filter

Newsletter

Footer
```

Do not spend excessive time on decorative perfection while critical flows remain incomplete.

---

# 48. Screenshot Regression

Recommended screenshot targets:

```text
Homepage desktop

Homepage mobile

Category desktop

Category mobile

PDP desktop

PDP mobile

Cart drawer

Filter drawer

Search overlay

Empty states

404
```

Use regression comparison when the project supports it.

---

# 49. Visual Regression Tolerance

Investigate:

```text
Unexpected spacing changes

Missing fonts

Image crop changes

Color changes

Component movement

Text wrapping changes

Hidden controls

Scrollbar changes
```

Not every pixel difference is a bug, but every unexpected change should be reviewed.

---

# PART VIII — CONTENT QA

# 50. Copy Review

Review all customer-facing copy for:

```text
Natural Turkish

Correct spelling

Consistent terminology

Respectful language

Clear CTA

Clear errors

No placeholder copy

No internal technical language

No false urgency

No unsupported claims
```

---

# 51. Terminology Consistency

Choose and preserve preferred terms.

Example:

```text
Sütyen

Balkonet

Bralet

Bant ölçüsü

Kup ölçüsü

Beden rehberi

Sepete ekle
```

Do not randomly switch between:

```text
Balkonet / Balconette / Balconet

Kup / Cup

Sepete ekle / Satın al / Hemen al
```

without purpose.

---

# 52. Sensitive Copy QA

For lingerie and body-related experiences, review:

```text
Body language

Size language

Fit guidance

Model descriptions

Return restrictions

Hygiene conditions

Adult-only positioning
```

Avoid:

* body shaming
* medical claims
* universal fit guarantees
* explicit sexual language
* ambiguous-age presentation

---

# 53. Legal and Policy Copy

Verify real accuracy for:

```text
Returns

Hygiene restrictions

Shipping

Privacy

Marketing consent

Payment

Cookies

Terms
```

Mock or placeholder policy content must not be mistaken for final legal copy.

---

# PART IX — SEO QA

# 54. Metadata QA

Verify every important route:

```text
Unique title

Meta description

Canonical

Open Graph title

Open Graph description

Open Graph image

Robots directives
```

---

# 55. Heading QA

Verify:

```text
One logical H1

Sequential hierarchy

No heading used only for visual styling

No missing page title
```

---

# 56. Structured Data QA

Validate:

```text
Organization

WebSite

BreadcrumbList

Product

Offer
```

where applicable.

Ensure:

```text
Visible content matches schema.

Price matches.

Availability matches.

No fake reviews exist.
```

---

# 57. Sitemap QA

Check:

```text
Canonical pages included

No cart

No internal search

No broken URLs

No redirect URLs

No invalid products

No unnecessary filter combinations
```

---

# 58. Robots QA

Verify production does not accidentally contain:

```text
noindex

Disallow: /
```

on valuable routes.

Verify staging does not become an indexable duplicate.

---

# 59. Link QA

Check:

```text
Broken internal links

Broken external links

Incorrect redirect

Wrong locale link

Empty href

Placeholder #
```

No production action should point to:

```text
#
```

unless intentionally intercepted with correct semantics.

---

# PART X — PERFORMANCE QA

# 60. Core Web Vitals

Review:

```text
LCP

INP

CLS
```

on:

```text
Homepage

Category

PDP

Search

Cart
```

---

# 61. Image QA

Verify:

```text
Correct dimensions

Correct sizes attribute

Correct loading priority

Correct compression

Correct mobile crop

No oversized PNG

No lazy-loaded LCP

No every-image priority
```

---

# 62. JavaScript QA

Inspect:

```text
Large client bundles

Unexpected Client Components

Unused packages

Duplicate libraries

Large icon packages

Motion cost

Hydration warnings
```

---

# 63. Third-Party QA

Verify:

```text
Consent behavior

Script loading priority

Chat loading

Analytics

Heatmaps

Social embeds

Review widgets
```

Third-party failure must not break core commerce.

---

# 64. Slow-Network QA

Test using throttled network.

Review:

```text
Hero

Product grid

Gallery

Search

Filters

Add to cart

Cart drawer

Images

Fonts
```

The storefront must remain understandable before every asset finishes.

---

# PART XI — BROWSER QA

# 65. Browser Matrix

Recommended:

```text
Chrome latest

Safari latest

Firefox latest

Edge latest

iOS Safari

Android Chrome
```

Support older versions according to the project’s actual browser policy.

---

# 66. Browser-Specific Risks

Inspect:

```text
Safari viewport height

Safari sticky behavior

iOS input zoom

Backdrop filter

Dialog behavior

Scroll locking

Date/number formatting

Font rendering

Safe-area handling
```

---

# 67. Touch and Pointer QA

Test:

```text
Mouse

Trackpad

Touchscreen laptop

Phone touch

Tablet touch
```

Hover enhancements must not be required.

---

# PART XII — STATE PERSISTENCE QA

# 68. Browser Navigation

Verify browser Back and Forward preserve:

```text
Filter state

Sort state

Search query

Scroll position

Loaded products

Selected product context
```

---

# 69. Refresh

After refresh, check:

```text
Cart

Wishlist

Recently viewed

URL filters

Search query where appropriate
```

---

# 70. Local Storage Failure

Handle:

```text
Malformed stored data

Old data version

Unavailable storage

Private browsing limitations
```

The application should recover gracefully.

---

# PART XIII — ERROR AND EDGE-CASE QA

# 71. Network Failure

Test failed loading for:

```text
Products

Search

Recommendations

Cart update

Newsletter

Images
```

Every failure requires a recovery path.

---

# 72. Empty States

Verify:

```text
Empty cart

Empty wishlist

No search results

No filter results

No reviews

No recent products

Invalid collection
```

---

# 73. Missing Product

Invalid product slug should produce:

```text
Correct 404 status

Useful recovery

Search

Category links

No broken structured data
```

---

# 74. Product State Change

Simulate:

```text
Product becomes unavailable

Selected size sells out

Price changes

Promotion ends

Product is removed
```

The customer must receive clear information.

---

# 75. Large Data

Test:

```text
100+ search results

Many filter values

20 cart items

Many colors

Many sizes

Long magazine article
```

Do not assume only small datasets.

---

# PART XIV — SECURITY AND PRIVACY READINESS

# 76. Frontend Security Review

Check:

```text
No secret API keys in frontend code

No private data in local storage unnecessarily

No unsafe HTML injection

No untrusted URL execution

No sensitive debug output

No exposed environment secrets
```

---

# 77. External Links

For new-tab links, use appropriate security attributes where required.

Do not open every external link in a new tab automatically.

---

# 78. User-Generated Content

If later supported:

```text
Sanitize content

Moderate images

Protect against script injection

Handle reporting

Respect consent
```

---

# 79. Privacy

Review:

```text
Analytics

Search history

Wishlist

Recently viewed

Personalization

Newsletter

Consent
```

Collect only necessary data.

---

# PART XV — ANALYTICS QA READINESS

# 80. Event Quality

Analytics events should represent meaningful actions.

Examples:

```text
view_item_list

select_item

view_item

select_size

select_color

add_to_wishlist

add_to_cart

view_cart

remove_from_cart

search

filter_apply
```

Do not create dozens of meaningless hover events.

---

# 81. Event Integrity

Verify events contain correct:

```text
Product ID

Variant ID

Category

Price

Currency

Quantity

Search query

Filter value
```

Do not send private or sensitive information unnecessarily.

---

# 82. Duplicate Events

Test for:

```text
Double add-to-cart event

Repeated page-view event

Duplicate search event

Duplicate impression event
```

React rerenders must not create duplicate analytics.

---

# PART XVI — RELEASE PROCESS

# 83. Release Checklist Ownership

Every release should identify owners for:

```text
Engineering

Design

Content

SEO

Accessibility

Business validation
```

One person may own multiple areas in a small team, but ownership must be explicit.

---

# 84. Pre-Release Freeze

Before final launch:

* avoid unnecessary package upgrades
* avoid major design changes
* avoid unreviewed dependency additions
* avoid broad refactoring
* focus on blockers and verified improvements

---

# 85. Release Candidate

Create a release candidate only after:

```text
Build passes

Critical journeys pass

P0 issues equal zero

P1 issues equal zero or have explicit approval

Content is reviewed

Production configuration is verified
```

---

# 86. Deployment Verification

Immediately after deployment, verify:

```text
Homepage loads

Category loads

PDP loads

Images load

Search opens

Add-to-cart works

Cart opens

Metadata is correct

Robots is correct

Sitemap is accessible

No console errors

HTTPS works
```

---

# 87. Rollback Plan

Before launch, know:

```text
How to restore the previous deployment

How to disable a broken feature

How to remove a harmful third-party script

How to communicate an incident
```

Do not launch without a recovery path.

---

# PART XVII — POST-LAUNCH MONITORING

# 88. First-Hour Monitoring

Review:

```text
Errors

404s

Failed requests

Add-to-cart failures

Search failures

Performance

Mobile behavior

Analytics events
```

---

# 89. First-Week Monitoring

Review:

```text
Real Core Web Vitals

Top search queries

Zero-result searches

Product exits

Filter usage

Cart abandonment signals

Device-specific failures

Customer support feedback
```

---

# 90. Real User Monitoring

Synthetic tests are useful.

Real-user performance and errors are more representative.

Monitor:

```text
LCP

INP

CLS

JavaScript errors

Failed API requests

Route failures
```

without collecting unnecessary personal data.

---

# 91. Post-Launch Backlog

Classify findings:

```text
Immediate hotfix

Next patch

Next sprint

Long-term optimization
```

Do not let P0 or P1 issues disappear into a general backlog.

---

# PART XVIII — PAGE-SPECIFIC QA CHECKLISTS

# 92. Homepage

```text
[ ] Hero loads quickly
[ ] Main CTA works
[ ] Navigation contrast is correct
[ ] Category links work
[ ] Product rails work
[ ] Editorial images crop correctly
[ ] Newsletter works
[ ] Trust content is accurate
[ ] Mobile hero is intentional
[ ] No immediate disruptive popup
```

---

# 93. Category Page

```text
[ ] H1 is correct
[ ] Product count is correct
[ ] Filters work
[ ] Sort works
[ ] Active chips work
[ ] Grid is responsive
[ ] Back navigation restores state
[ ] No-result state works
[ ] Pagination/load more works
[ ] Metadata is unique
```

---

# 94. Product Detail Page

```text
[ ] Product data is correct
[ ] Gallery works
[ ] Color selection works
[ ] Standard size works
[ ] Bra size works
[ ] Invalid combinations are prevented
[ ] Size guide works
[ ] Add-to-cart works
[ ] Delivery content is accurate
[ ] Return conditions are accurate
[ ] Structured data is valid
[ ] Mobile sticky CTA works
```

---

# 95. Cart

```text
[ ] Product information is correct
[ ] Variant information is correct
[ ] Quantity works
[ ] Removal works
[ ] Undo works
[ ] Totals are accurate
[ ] Shipping progress is accurate
[ ] Empty state works
[ ] Checkout action dominates
[ ] Recommendations remain secondary
```

---

# 96. Search

```text
[ ] Input works
[ ] Suggestions work
[ ] Typo tolerance works where supported
[ ] Turkish characters work
[ ] Recent search works
[ ] Clear works
[ ] No-result state works
[ ] Results page works
[ ] Filters work
[ ] Search metadata is controlled
```

---

# 97. Size Guide

```text
[ ] Modal/page opens
[ ] Measurement instructions are clear
[ ] Tables are accessible
[ ] Mobile layout works
[ ] Bra calculator logic works
[ ] Result returns to PDP
[ ] Guidance is not presented as a guarantee
[ ] Support option is real
```

---

# PART XIX — DESIGN REVIEW SCORECARD

# 98. Scoring Model

Each major page may be scored from 1 to 5.

Categories:

```text
Brand

Visual hierarchy

Typography

Spacing

Photography

Commerce clarity

Mobile quality

Accessibility

Performance

Content

Trust
```

---

# 99. Score Meaning

```text
1 — Broken

2 — Weak

3 — Acceptable

4 — Strong

5 — World-class
```

A launch candidate should normally have:

```text
No category below 3

Critical commerce areas at least 4

Accessibility and functional quality passing independently
```

A high visual score cannot compensate for broken commerce.

---

# PART XX — BUG REPORT STANDARD

# 100. Bug Report Format

Every issue should contain:

```text
Title

Severity

Environment

Page

Viewport

Precondition

Steps

Expected result

Actual result

Screenshot/video

Console/network evidence

Suggested owner
```

---

# 101. Example Bug

```text
Title:
75C size becomes 80B after band change

Severity:
P1

Environment:
Production build, Chrome, 390 × 844

Page:
PDP — Luna Balkonet Sütyen

Steps:
1. Select 75
2. Select C
3. Change band to 80

Expected:
C remains selected if valid, or clears with explanation.

Actual:
System silently selects B.

Impact:
Customer may add the wrong size.
```

---

# PART XXI — AI QA WORKFLOW

# 102. AI Audit Order

When an AI coding agent audits the storefront, it must inspect in this order:

```text
1. Build and runtime errors

2. P0 commerce failures

3. P1 customer journey failures

4. Responsive failures

5. Accessibility failures

6. Performance failures

7. SEO failures

8. Visual inconsistencies

9. Motion and polish

10. Optional enhancements
```

Do not begin with decorative polish while functional blockers remain.

---

# 103. AI Evidence Rule

An AI agent must not state that a feature works without evidence.

Evidence may include:

```text
Code inspection

Automated test

Production build

Browser interaction test

Screenshot

Console output

Network output
```

Avoid unsupported statements such as:

```text
Everything is perfect.
All pages are fully responsive.
Accessibility is complete.
```

---

# 104. AI Change Rule

Before modifying code, the agent must:

1. Identify the failed requirement.
2. Identify affected files.
3. Identify regression risk.
4. Make the smallest coherent change.
5. Re-run relevant tests.
6. Report remaining limitations.

---

# 105. AI Regression Rule

After a change, re-test:

```text
The original issue

Related components

Mobile version

Keyboard behavior

Production build
```

A local fix that breaks another state is not acceptable.

---

# 106. AI Stop Conditions

The agent must not declare completion while:

```text
Build fails

Type errors remain

P0 issue remains

P1 commerce issue remains

Required route is missing

Critical responsive state is broken

Core keyboard journey is blocked
```

---

# PART XXII — MASTER ACCEPTANCE MATRIX

# 107. Build Gate

```text
[ ] Dependencies install
[ ] Lint passes
[ ] Type check passes
[ ] Production build passes
[ ] Production server starts
[ ] No critical warnings
[ ] No hydration errors
```

---

# 108. Functional Gate

```text
[ ] Navigation works
[ ] Search works
[ ] Filters work
[ ] Sorting works
[ ] Product pages work
[ ] Variants work
[ ] Wishlist works
[ ] Cart works
[ ] Empty states work
[ ] Error recovery works
```

---

# 109. Commerce Gate

```text
[ ] Correct product enters cart
[ ] Correct variant enters cart
[ ] Correct price enters cart
[ ] Quantity is accurate
[ ] Totals are accurate
[ ] Unavailable variants are prevented
[ ] Bra sizing resolves correctly
[ ] No size is auto-selected
[ ] Purchase feedback is immediate
```

---

# 110. Responsive Gate

```text
[ ] 320px works
[ ] 375px works
[ ] 390px works
[ ] 430px works
[ ] Tablet works
[ ] Laptop works
[ ] Desktop works
[ ] Ultra-wide works
[ ] Landscape works
[ ] 200% zoom works
```

---

# 111. Accessibility Gate

```text
[ ] Skip link works
[ ] Landmarks are correct
[ ] Headings are logical
[ ] Keyboard journey works
[ ] Focus is visible
[ ] Dialog focus works
[ ] Variants are accessible
[ ] Bra sizing is accessible
[ ] Dynamic changes are announced
[ ] Reduced motion works
[ ] Contrast passes
```

---

# 112. Performance Gate

```text
[ ] LCP is optimized
[ ] CLS is controlled
[ ] INP is acceptable
[ ] Images are responsive
[ ] Fonts are optimized
[ ] Client boundaries are localized
[ ] No major bundle regression
[ ] Third-party scripts are controlled
[ ] Mobile scrolling is smooth
```

---

# 113. SEO Gate

```text
[ ] Titles are unique
[ ] Descriptions exist
[ ] Canonicals are correct
[ ] H1 is correct
[ ] Sitemap is valid
[ ] Robots is valid
[ ] Structured data is truthful
[ ] Internal links work
[ ] No accidental noindex
[ ] Important content is server-rendered
```

---

# 114. Content Gate

```text
[ ] No lorem ipsum
[ ] No placeholder brands
[ ] No fake claims
[ ] No fake reviews
[ ] Terminology is consistent
[ ] Turkish copy is natural
[ ] Return conditions are accurate
[ ] Adult-only imagery rules are respected
[ ] Product facts are clear
```

---

# 115. Launch Gate

```text
[ ] P0 = 0
[ ] P1 = 0 or explicitly approved
[ ] Production environment verified
[ ] Rollback path exists
[ ] Monitoring is ready
[ ] Business owner approved
[ ] Design owner approved
[ ] Engineering owner approved
```

---

# PART XXIII — FINAL AI IMPLEMENTATION RULES

# 116. AI QA Rules

When an AI coding agent performs final QA, it must:

1. Read every ECDOS module.
2. Inspect the complete repository.
3. Run lint, type checking, and production build.
4. Identify all required routes.
5. Map primary customer journeys.
6. Classify findings as P0, P1, P2, or P3.
7. Fix P0 issues first.
8. Fix P1 issues second.
9. Verify responsive behavior.
10. Verify keyboard and focus behavior.
11. Verify commerce state accuracy.
12. Verify performance architecture.
13. Verify metadata and schema.
14. Verify content integrity.
15. Re-run tests after each meaningful group of changes.
16. Report evidence.
17. Report unresolved limitations honestly.
18. Never declare perfection without proof.

---

# 117. Final QA Self-Review

```text
[ ] Did I test the production build?

[ ] Did I inspect every required route?

[ ] Did I test the main customer journeys?

[ ] Did I test mobile and desktop independently?

[ ] Did I test short viewport heights?

[ ] Did I test keyboard navigation?

[ ] Did I test focus management?

[ ] Did I test standard sizes?

[ ] Did I test bra-size combinations?

[ ] Did I test invalid variants?

[ ] Did I test cart totals?

[ ] Did I test persistence?

[ ] Did I test empty states?

[ ] Did I test errors?

[ ] Did I test slow loading?

[ ] Did I test metadata?

[ ] Did I test robots and sitemap?

[ ] Did I test image performance?

[ ] Did I inspect Client Component boundaries?

[ ] Did I classify findings by severity?

[ ] Did I fix blockers before polishing?

[ ] Did I re-test after changes?

[ ] Did I provide evidence?

[ ] Did I disclose remaining limitations?
```

---

# 118. Final Principle

A storefront is ready to launch only when it is:

```text
Beautiful

Usable

Accurate

Accessible

Fast

Discoverable

Recoverable

Stable
```

The final question is not:

```text
Does the site look finished?
```

The final questions are:

```text
Can customers find products?

Can they understand them?

Can they select the correct size?

Can they add the correct variant?

Can they recover from errors?

Can they complete the journey on mobile?

Can they complete it using keyboard?

Does the production build remain fast and stable?

Can the business trust the information displayed?
```

When uncertain:

```text
Test the real journey.

Use realistic data.

Check the smallest screen.

Check the shortest screen.

Use the keyboard.

Break the network.

Try the invalid state.

Verify the price.

Verify the variant.

Inspect the production build.

Fix blockers before polish.

Do not launch assumptions.
```
