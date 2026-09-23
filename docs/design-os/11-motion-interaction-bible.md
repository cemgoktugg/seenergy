# E-Commerce Design Operating System

# Module 11 — Motion & Interaction Bible

## Premium Motion for Fashion and Lingerie Commerce

---

# 1. Purpose

Motion defines how the interface responds, transitions, confirms actions, reveals hierarchy, and preserves user orientation.

The motion system must improve:

* clarity
* perceived quality
* interaction feedback
* spatial understanding
* task continuity
* brand character
* perceived performance

Motion must never delay shopping, hide information, create discomfort, or turn the storefront into a visual demonstration.

The customer should notice that the experience feels smooth.

They should not be forced to notice the animation itself.

---

# 2. Core Philosophy

Premium motion is:

```text
Calm

Precise

Responsive

Purposeful

Consistent

Restrained
```

Premium motion is not:

```text
Slow

Dramatic

Constant

Decorative

Unpredictable

Attention-seeking
```

Every animation must answer at least one question:

```text
What changed?

Where did it come from?

Where did it go?

Was the action successful?

What should receive attention next?
```

If an animation answers none of these questions, remove it.

---

# 3. Motion Priorities

When motion decisions conflict, prioritize:

```text
1. Immediate interaction response
2. User orientation
3. State clarity
4. Accessibility
5. Performance
6. Brand expression
7. Decorative impact
```

Motion must never make a basic action feel slower.

---

# 4. Motion Categories

The system contains six categories:

```text
1. Feedback Motion
2. State Transition
3. Spatial Transition
4. Content Reveal
5. Navigation Transition
6. Ambient Motion
```

## Feedback Motion

Confirms a direct action.

Examples:

* button press
* wishlist save
* add to cart
* filter selection
* quantity update

## State Transition

Shows a component changing state.

Examples:

* accordion
* selected size
* active tab
* validation state
* expanded filter group

## Spatial Transition

Explains where content enters or exits.

Examples:

* drawer
* bottom sheet
* modal
* mega menu
* cart panel

## Content Reveal

Introduces content into the viewport.

Examples:

* editorial image
* section heading
* product grid
* campaign story

## Navigation Transition

Supports movement between pages or views.

Examples:

* category to product
* collection page
* mobile drill-down menu
* gallery lightbox

## Ambient Motion

Provides subtle life without communicating a direct action.

Examples:

* slow hero image movement
* muted campaign video
* gentle fabric motion

Ambient motion should be rare.

---

# 5. Motion Token Architecture

Use centralized semantic motion tokens.

Recommended layers:

```text
Primitive duration
↓
Primitive easing
↓
Semantic motion token
↓
Component motion token
```

Example:

```css
:root {
  --duration-instant: 80ms;
  --duration-fast: 140ms;
  --duration-normal: 220ms;
  --duration-slow: 320ms;
  --duration-emphasis: 480ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
  --ease-emphasis: cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

# 6. Duration Scale

Use a controlled duration system.

```text
Instant: 60–100ms

Fast: 120–180ms

Normal: 180–260ms

Slow: 280–380ms

Emphasis: 400–650ms
```

## Instant

Use for:

* direct pressed state
* checkbox feedback
* small icon changes
* active underline

## Fast

Use for:

* hover color
* focus ring
* button background
* wishlist state
* swatch selection

## Normal

Use for:

* accordion
* popover
* tooltip
* quick-add panel
* card image transition

## Slow

Use for:

* drawer
* bottom sheet
* mega menu
* modal
* page section reveal

## Emphasis

Use only for:

* hero introduction
* large editorial image
* campaign transition

Do not use emphasis timing for routine commerce actions.

---

# 7. Duration Selection Rule

Duration should generally increase with:

```text
Distance

Visual size

Content complexity

Perceived weight
```

Examples:

```text
Small icon: 120ms

Button feedback: 160ms

Popover: 200ms

Accordion: 220ms

Drawer: 320ms

Hero image: 600ms
```

Do not assign every animation the same duration.

---

# 8. Easing Library

Use a small, controlled easing library.

## Standard Easing

```css
cubic-bezier(0.2, 0, 0, 1)
```

Use for:

* state transitions
* hover
* most interface changes

## Enter Easing

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Use for:

* drawer opening
* modal entering
* content revealing
* bottom sheet opening

## Exit Easing

```css
cubic-bezier(0.4, 0, 1, 1)
```

Use for:

* dismissing
* collapsing
* leaving the viewport

Exit motion may be slightly faster than enter motion.

## Emphasis Easing

```css
cubic-bezier(0.22, 1, 0.36, 1)
```

Use for:

* large editorial media
* campaign headline
* important visual storytelling

---

# 9. Spring Motion

Spring animations may be used for:

* shared layout
* drag gestures
* mobile sheets
* selected filter chips
* wishlist icon feedback

Recommended spring character:

```text
Low bounce

Medium stiffness

High damping

Fast settlement
```

Avoid:

* rubbery buttons
* repeated bouncing
* elastic navigation
* playful overshoot in checkout flows

Premium motion should settle quickly.

---

# 10. Distance Scale

Use small translation distances.

Recommended:

```text
Micro feedback: 1–2px

Control reveal: 4–8px

Popover or menu: 4–12px

Section reveal: 12–24px

Drawer or sheet: based on actual edge position
```

Avoid generic:

```text
translateY(50px)
```

for every scroll reveal.

Large movement makes the interface feel theatrical and slow.

---

# 11. Scale System

Recommended scale ranges:

```text
Pressed button: 0.98–0.995

Image hover: 1.01–1.025

Modal entrance: 0.985–1

Wishlist feedback: 0.9 → 1.05 → 1

Selected control: 0.98 → 1
```

Avoid:

```text
Card hover: 1.1

Button hover: 1.2
```

Large scaling creates instability and visual noise.

---

# 12. Opacity System

Opacity transitions are the safest motion foundation.

Recommended:

```text
Hidden content: 0

Partial supporting layer: 0.6–0.85

Visible content: 1
```

Do not use opacity alone when spatial origin is important.

Examples:

* modal should use opacity plus slight scale
* drawer should move from its edge
* mega menu should use opacity plus small vertical translation

---

# 13. Interaction Response Time

Every direct user action should receive visible feedback within:

```text
100ms
```

Examples:

* button press
* swatch selection
* heart activation
* filter selection
* accordion trigger

The complete asynchronous action may take longer, but the interface must acknowledge input immediately.

---

# PART I — BUTTON AND CONTROL MOTION

# 14. Button Hover

Recommended:

```text
Background or text color transition: 120–180ms

Optional underline: 140–200ms

Optional translate: maximum 1px
```

Avoid moving buttons significantly on hover.

Buttons must remain stable targets.

---

# 15. Button Press

Recommended:

```text
Scale: 0.985–0.995

Duration: 60–100ms
```

Press feedback must feel tactile but not playful.

Do not apply scale when it creates text blurring or layout movement.

---

# 16. Button Loading

The loading transition must preserve dimensions.

Preferred flow:

```text
Sepete ekle

↓

Sepete ekleniyor…

↓

Sepete eklendi
```

Allowed motion:

* small spinner
* subtle label fade
* checkmark reveal

Avoid:

* replacing the complete button with an unrelated shape
* shrinking the button
* moving surrounding layout
* indefinite decorative animation

---

# 17. Primary CTA Motion

Primary CTAs may use slightly stronger feedback than secondary actions.

Allowed:

* contrast change
* subtle underline or icon movement
* pressed feedback
* success state

Avoid glowing, pulsing, or continuous CTA animation.

---

# 18. Icon Button Motion

Examples:

* search
* menu
* close
* cart
* wishlist

Recommended:

```text
Rotation: only when meaning supports it

Scale: maximum 1.05

Translation: 1–2px

Duration: 120–180ms
```

The close icon may rotate slightly during menu transformation, but dramatic spinning is not appropriate.

---

# 19. Wishlist Motion

Recommended sequence:

```text
Tap

↓

Immediate pressed state

↓

Outline becomes filled

↓

Small controlled scale

↓

Toast or accessible confirmation
```

Suggested timing:

```text
Press: 80ms

Fill transition: 140–180ms

Scale settlement: 180–240ms
```

Do not use confetti or floating hearts by default.

---

# 20. Checkbox and Radio Motion

Use:

* fast border transition
* checkmark opacity or draw
* selected background
* subtle control scale

Recommended:

```text
120–180ms
```

Do not delay visible selection until remote filtering completes.

---

# 21. Toggle Motion

Use a short physical slide.

Recommended:

```text
160–220ms
```

The thumb must reach the final state quickly.

Do not use an exaggerated spring.

---

# PART II — PRODUCT CARD MOTION

# 22. Product Card Principle

Product-card motion should increase product clarity, not make the card feel detached from the grid.

Allowed:

```text
Image swap

Small image scale

Quick-add reveal

Wishlist feedback

Link underline
```

Avoid lifting the whole card with large shadows.

---

# 23. Product Image Hover

Recommended:

```text
Scale: 1 → 1.015

Duration: 300–500ms

Easing: emphasis or standard
```

For a secondary image:

```text
Primary opacity: 1 → 0

Secondary opacity: 0 → 1

Duration: 200–300ms
```

Use only on hover-capable devices.

---

# 24. Product Card Quick Add

Pointer devices:

```text
Quick add enters from bottom by 6–12px

Opacity: 0 → 1

Duration: 180–240ms
```

Touch devices:

* persistent action
* tap-triggered sheet
* no hover dependency

Quick-add reveal must not change card height.

---

# 25. Product Badge Motion

Product badges should generally remain static.

Newly loaded or filtered products may fade in, but badges should not pulse or animate continuously.

---

# 26. Product Grid Reveal

Recommended:

* reveal only the first visible batch
* short stagger
* no repeated animation when scrolling back

Suggested:

```text
Item duration: 280–420ms

Stagger: 30–60ms

Translation: 8–16px
```

Do not stagger dozens of cards for several seconds.

Maximum practical stagger sequence:

```text
6–10 visible items
```

---

# 27. Product Filtering Transition

When filters update:

Preferred behavior:

```text
Current grid remains stable

↓

Local loading indication

↓

Results transition with short opacity change

↓

Product count updates
```

Avoid:

* blanking the entire page
* large vertical collapse
* animating every card offscreen individually
* returning to the top without explanation

---

# PART III — HERO AND EDITORIAL MOTION

# 28. Hero Motion Principle

Hero motion should establish atmosphere without delaying comprehension.

The headline and CTA should become usable quickly.

Recommended entrance order:

```text
Media

↓

Eyebrow

↓

Headline

↓

Supporting copy

↓

CTA
```

The full sequence should generally finish within:

```text
800–1200ms
```

---

# 29. Hero Image Motion

Allowed:

* slow initial scale down
* subtle fade
* controlled crop movement
* muted background video

Recommended initial effect:

```text
Scale: 1.03 → 1

Duration: 700–1200ms
```

Avoid continuous zoom loops.

---

# 30. Hero Text Reveal

Recommended:

```text
Opacity: 0 → 1

Translate Y: 8–18px → 0

Duration: 350–600ms
```

Delay between content groups:

```text
50–120ms
```

Do not animate each letter unless it is a rare campaign-specific moment with a reduced-motion alternative.

---

# 31. Masked Text Reveal

May be used for:

* short hero heading
* collection title
* editorial campaign statement

Rules:

* maximum 1–3 lines
* preserve readable DOM text
* avoid long delay
* reduced-motion shows text immediately
* clipping must not cut descenders or Turkish characters

---

# 32. Scroll Reveal

Use scroll reveal selectively.

Good candidates:

* editorial image
* section heading
* brand statement
* campaign split
* selected product section

Poor candidates:

* every product card
* form labels
* filter controls
* checkout content
* legal information

Recommended trigger:

```text
Element enters 10–25% of viewport
```

Animate only once unless there is a meaningful reason to repeat.

---

# 33. Editorial Image Reveal

Allowed:

* opacity
* subtle scale
* mask wipe
* small clip-path reveal

Recommended duration:

```text
450–750ms
```

Clip-path and mask effects must be tested for performance.

---

# 34. Parallax

Parallax should be rare.

Appropriate:

* one hero image
* one editorial campaign section
* subtle foreground and background depth

Recommended maximum relative movement:

```text
20–40px
```

Disable or simplify on:

* mobile
* touch devices
* reduced-motion preference
* low-height screens
* lower-performance environments

Do not use scroll hijacking.

---

# 35. Ambient Campaign Video

Requirements:

* muted
* loop only when appropriate
* no hard cuts
* poster fallback
* pause when offscreen
* reduced-motion fallback
* optimized mobile alternative

Ambient media must not interfere with reading or controls.

---

# PART IV — NAVIGATION MOTION

# 36. Header State Transition

Transparent-to-solid header:

```text
Background opacity

Text color

Border

Optional backdrop blur
```

Recommended:

```text
180–280ms
```

Avoid changing header height significantly during scroll.

Height changes create layout instability.

---

# 37. Hide-on-Scroll Header

Use only when vertical space is valuable.

Recommended behavior:

```text
Scroll down → header hides

Scroll up → header returns
```

Rules:

* use a sensible scroll threshold
* do not react to tiny scroll movements
* keep keyboard focus visible
* disable behavior when navigation is open
* avoid hiding during form interaction

---

# 38. Navigation Underline

Recommended:

```text
Scale X: 0 → 1

Transform origin based on direction

Duration: 140–200ms
```

Do not create thick animated bars under every navigation item.

---

# 39. Mega Menu Motion

Recommended opening:

```text
Overlay fade: 140–200ms

Panel opacity: 0 → 1

Translate Y: -6px → 0

Duration: 180–260ms
```

Category columns may use a very small stagger:

```text
20–40ms
```

Do not animate every individual link independently.

---

# 40. Mobile Menu Motion

Full-screen or side drawer:

```text
Overlay fade: 160–220ms

Drawer movement: 280–360ms

Content fade: 180–260ms
```

Nested drill-down:

```text
Current view: 0 → -12px

Next view: 12px → 0

Duration: 220–300ms
```

Avoid long horizontal page slides that resemble a mobile operating system clone.

---

# 41. Search Overlay Motion

Recommended:

```text
Overlay fade: 140–220ms

Search panel translation: -8px → 0

Input content visible immediately
```

Input focus must not wait for animation completion.

---

# PART V — OVERLAY MOTION

# 42. Modal Motion

Recommended entrance:

```text
Overlay opacity: 0 → 1

Modal opacity: 0 → 1

Scale: 0.985 → 1

Translate Y: 6px → 0
```

Duration:

```text
180–260ms
```

Exit:

```text
140–200ms
```

Do not use large scale changes.

---

# 43. Drawer Motion

The drawer must enter from the physical edge where it exists.

Desktop cart drawer:

```text
Translate X: 100% → 0

Duration: 280–360ms
```

Overlay:

```text
Opacity: 0 → 1

Duration: 160–220ms
```

Avoid spring bounce on cart or checkout drawers.

---

# 44. Bottom Sheet Motion

Recommended:

```text
Translate Y: 100% → 0

Duration: 280–360ms

Easing: enter
```

A very small overshoot may be acceptable when drag interaction is supported, but it must settle immediately.

---

# 45. Popover Motion

Recommended:

```text
Opacity: 0 → 1

Scale: 0.98 → 1

Translate: 4px from anchor

Duration: 140–200ms
```

Origin must match trigger position.

---

# 46. Tooltip Motion

Recommended:

```text
Delay before open: 300–500ms

Entrance: 100–160ms

Exit: 80–120ms
```

Focus-triggered tooltips may appear immediately or with a shorter delay.

Essential information must not rely on tooltip motion.

---

# 47. Accordion Motion

Recommended:

```text
Duration: 180–260ms
```

Animate:

* height or grid row
* opacity of content
* icon rotation

Icon rotation:

```text
0° → 180°
```

only if it clearly communicates expanded state.

Avoid slow accordion motion on filter panels.

---

# 48. Tabs Motion

Use restrained transition:

```text
Active indicator movement: 160–220ms

Panel opacity: 120–180ms
```

Do not slide complete content panels long distances unless spatial relationship is meaningful.

---

# PART VI — PRODUCT DETAIL MOTION

# 49. Gallery Transition

Mobile swipe should feel direct and physical.

For button navigation:

```text
Duration: 200–320ms
```

Avoid crossfading images with substantially different product positions if it creates visual confusion.

---

# 50. Thumbnail Selection

Use:

* border transition
* small opacity change
* active indicator

Recommended:

```text
120–180ms
```

Do not scale thumbnails significantly.

---

# 51. Color Change

When a customer changes color:

```text
Selection responds immediately

↓

Gallery loads the selected color

↓

Image transition remains stable

↓

Availability updates
```

Recommended gallery transition:

```text
Short opacity crossfade: 180–260ms
```

Do not clear the complete gallery to white.

Use a placeholder or preserve the previous image until the next image is ready.

---

# 52. Size Selection

Recommended:

```text
Immediate selected border/background

Duration: 100–160ms
```

Unavailable states remain static.

Do not animate unavailable sizes in a way that suggests they can be selected.

---

# 53. Bra Size Interaction

When band selection changes:

* selected band responds immediately
* cup availability updates clearly
* invalid cup state is removed with explanation
* selected combined size updates

Allowed motion:

```text
Cup option opacity: 120–180ms

Combined-size label fade: 140–200ms
```

Do not animate the entire selector out and back in.

---

# 54. Size Validation Error

When add-to-cart is attempted without size:

Use:

* short selector emphasis
* error text reveal
* focus movement where appropriate

Recommended emphasis:

```text
Border transition

Small background tint

Maximum 200ms
```

Avoid shaking the entire purchase panel.

If a shake is used at all, keep displacement minimal and provide reduced-motion fallback.

---

# 55. Sticky Add-to-Cart Motion

Show when the main purchase action leaves the viewport.

Recommended:

```text
Translate Y: 100% → 0

Duration: 220–300ms
```

Hide immediately when conflicting overlays open.

Avoid repeatedly showing and hiding due to small scroll threshold changes.

Use hysteresis or stable observer logic.

---

# PART VII — CART AND PURCHASE FEEDBACK

# 56. Add-to-Cart Sequence

Recommended sequence:

```text
Button press

↓

Loading state

↓

Success label or checkmark

↓

Cart count updates

↓

Cart drawer or toast appears
```

Total perceived sequence should begin immediately.

Do not delay feedback until every recommendation or cart calculation has loaded.

---

# 57. Cart Count Motion

Recommended:

```text
Old count fades or shifts slightly

New count appears

Small scale settlement
```

Duration:

```text
160–240ms
```

Do not use a repeated bounce every time the page renders.

---

# 58. Cart Drawer After Addition

The newly added item may receive a subtle highlight.

Recommended:

```text
Soft background tint: 400–800ms

Then return to normal
```

Do not flash bright colors.

---

# 59. Cart Quantity Update

Provide immediate control feedback.

When subtotal updates:

```text
Short opacity transition

or

Numeric crossfade
```

Avoid animating the entire order summary.

---

# 60. Cart Removal

Recommended:

```text
Item opacity: 1 → 0

Height collapses

Duration: 180–260ms
```

Provide undo feedback.

Do not remove the item so quickly that the customer cannot understand what happened.

---

# 61. Shipping Progress

Animate the progress bar width:

```text
Duration: 280–450ms
```

The message should update immediately and remain readable.

Do not animate from zero on every render.

---

# 62. Promo Code Feedback

Success:

* subtle success icon
* short field state transition
* order summary updates

Error:

* visible error
* small border transition
* no aggressive shaking

---

# PART VIII — FILTER AND SEARCH MOTION

# 63. Filter Selection

Selection feedback:

```text
100–160ms
```

Result loading may occur separately.

The selected control must never wait for the network response.

---

# 64. Active Filter Chips

When a chip is added or removed:

Use shared layout motion where appropriate.

Recommended:

```text
Duration: 180–260ms

Low-bounce spring or standard easing
```

The product toolbar must not jump unpredictably.

---

# 65. Product Count Update

Use:

* direct text replacement
* optional brief opacity transition

Do not count upward through dozens of numbers.

---

# 66. Search Suggestion Motion

Suggestions may:

```text
Fade in

Use small vertical transition

Update without moving the input
```

Recommended:

```text
140–220ms
```

Do not animate every suggestion separately with long stagger.

---

# 67. Search Result Replacement

Preserve:

* input
* query
* search shell
* category grouping

Only the results region should update.

Avoid full-screen white flashes.

---

# PART IX — PAGE AND VIEW TRANSITIONS

# 68. Page Transition Principle

Page transitions must preserve speed and orientation.

Use only when the framework and browser support them reliably.

Good uses:

* collection to product
* editorial story
* image-led campaign transition

Avoid heavy transitions for:

* checkout
* account forms
* search results
* filter updates

---

# 69. Basic Page Transition

Recommended:

```text
Outgoing opacity: 1 → 0.98

Incoming opacity: 0 → 1

Small translate: 4–8px

Total duration: 180–300ms
```

Navigation must begin immediately.

Do not wait for an exit animation before loading the next page.

---

# 70. View Transition API

May be used progressively for:

* product image continuity
* card-to-PDP transition
* editorial cover image
* collection title

Requirements:

* progressive enhancement
* reliable fallback
* no duplicated IDs
* reduced-motion support
* preserve browser navigation behavior

---

# 71. Shared Product Image Transition

Potential flow:

```text
Product card image

↓

Expands into PDP gallery image
```

Use only when:

* image identity is stable
* transition remains fast
* back navigation works
* low-performance devices receive fallback
* the user can still interact promptly

Do not hold the PDP until the animation completes.

---

# 72. Route Loading

The stable application shell should remain visible.

Use:

* page-level skeleton
* local suspense boundary
* progress indicator where useful

Avoid global spinning logos or large branded loading sequences.

---

# PART X — LOADING MOTION

# 73. Loading Principle

Loading motion must reduce uncertainty.

It should never become entertainment.

---

# 74. Skeleton Animation

Recommended options:

```text
Soft opacity pulse

Subtle shimmer
```

Preferred duration:

```text
1200–1800ms
```

Shimmer contrast should remain low.

Respect reduced motion by using a static skeleton or minimal opacity change.

---

# 75. Spinner Motion

Use for short local actions.

Recommended rotation:

```text
700–1000ms per revolution
```

Avoid multiple spinners on one screen.

---

# 76. Progress Indicator

Use determinate progress when the system knows the completion percentage.

Use indeterminate progress when it does not.

Do not show a fake percentage.

---

# 77. Image Loading

Use:

* neutral placeholder
* blur placeholder when appropriate
* stable aspect ratio
* short opacity reveal

Recommended image fade:

```text
160–280ms
```

Avoid revealing every product image with a dramatic animation.

---

# PART XI — TOAST AND STATUS MOTION

# 78. Toast Entrance

Desktop:

```text
Opacity: 0 → 1

Translate X or Y: 8–16px → 0

Duration: 180–260ms
```

Mobile:

```text
Translate Y: 12–20px → 0

Duration: 200–280ms
```

Toast placement must avoid sticky commerce controls.

---

# 79. Toast Exit

Recommended:

```text
140–220ms
```

Pause timeout while:

* hovered
* focused
* user is interacting with Undo

---

# 80. Error Message Reveal

Inline errors should appear with:

```text
Opacity: 0 → 1

Translate Y: -2px → 0

Duration: 120–180ms
```

Do not push nearby content with a dramatic shift.

Reserve error space where practical.

---

# PART XII — REDUCED MOTION

# 81. Reduced-Motion Principle

Reduced motion must preserve:

* state
* hierarchy
* feedback
* navigation
* successful action confirmation

It should remove unnecessary physical movement.

---

# 82. Global Reduced-Motion Strategy

Example:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
  }
}
```

Do not indiscriminately set every duration to zero if it causes abrupt or confusing state changes.

Prefer:

```text
Translation → opacity

Parallax → static image

Smooth scroll → immediate scroll

Large scale → no scale

Stagger → simultaneous reveal

Autoplay media → poster image
```

---

# 83. Reduced-Motion Component Rules

## Hero

* no image scale
* content visible immediately or short fade

## Product Cards

* no image zoom
* secondary image may crossfade

## Drawer

* may use short opacity or reduced translation
* still preserves spatial understanding

## Modal

* short fade
* no scale

## Toast

* short fade

## Shared Layout

* disable or shorten

## Parallax

* disable completely

---

# 84. Motion-Sensitive Content

Avoid:

* rapid zoom
* large background movement
* continuous horizontal motion
* rotating full-page elements
* simulated depth movement
* strobing
* uncontrolled autoplay

---

# PART XIII — PERFORMANCE

# 85. Performance Principle

Motion must remain smooth under real-world conditions.

Target:

```text
Stable 60 FPS where possible
```

Do not damage:

* input responsiveness
* scrolling
* image loading
* battery usage
* main-thread availability

---

# 86. Animate Safe Properties

Prefer:

```text
transform

opacity
```

Use carefully:

```text
clip-path

filter

backdrop-filter
```

Avoid repeatedly animating:

```text
width

height

top

left

box-shadow

large blur
```

unless the impact is tested.

---

# 87. Layout Animation

When animating layout:

* limit the affected region
* avoid large DOM trees
* avoid repeated measurement during scroll
* use CSS when possible
* test on mid-range mobile hardware

---

# 88. Scroll Event Rules

Avoid raw continuous scroll handlers.

Prefer:

* Intersection Observer
* CSS scroll-driven animation where supported
* requestAnimationFrame when necessary
* passive listeners

Do not calculate complex layout values on every scroll event.

---

# 89. Motion Library Usage

Use Motion for React only where it provides meaningful value.

Appropriate:

* shared layout
* drag
* presence
* orchestrated sequences
* complex drawer behavior

Use CSS transitions for:

* hover
* focus
* button states
* simple opacity
* simple transforms

Do not turn every element into a motion component.

---

# 90. Client Component Boundaries

Motion must not force large server-rendered sections into Client Components.

Isolate interactive motion.

Examples:

```text
Wishlist control

Cart drawer

Mobile menu

Gallery

Filter drawer

Hero motion wrapper
```

Keep static text and content server-rendered where possible.

---

# 91. Offscreen Motion

Pause or avoid motion when:

* content is offscreen
* page is hidden
* modal covers it
* browser tab is inactive

Campaign video should pause when it leaves the viewport.

---

# 92. Image and Video Performance

Do not combine:

* high-resolution video
* parallax
* blur
* multiple overlays
* continuous scale

in the same hero without performance testing.

---

# PART XIV — MOTION CONTENT RULES

# 93. Motion Must Match Tone

For premium lingerie and fashion:

Use:

```text
Soft entrances

Controlled fades

Small image movement

Refined spatial transitions

Calm feedback
```

Avoid:

```text
Cartoon bounce

Elastic menus

Gaming effects

Neon glow animation

Confetti

Fast flashing sale graphics
```

---

# 94. Motion Hierarchy

Only one motion event should dominate at a time.

Example:

When the cart drawer opens:

* drawer motion dominates
* background content remains calm
* cart count does not perform a second large animation
* recommendation cards do not stagger dramatically

---

# 95. Repetition

Repeated controls should use identical motion.

Examples:

* all primary buttons
* all accordions
* all drawers
* all product cards
* all selected chips

Inconsistent timing reduces perceived quality.

---

# PART XV — ANTI-PATTERNS

# 96. Never Use

```text
Scroll hijacking

Long intro loaders

Cursor-following decorative effects

Large card lifts

Excessive 3D tilt

Continuous CTA pulsing

Autoplay sound

Repeated bounce

Large-scale page zoom

Animation on every scroll event

Delayed button response

Multiple competing parallax layers

Confetti for normal cart actions

Hover-only interaction

Motion without reduced-motion fallback

Long stagger across full product grids

Animation that changes layout unexpectedly
```

---

# PART XVI — COMPONENT ACCEPTANCE TESTS

# 97. Button Motion Acceptance

```text
[ ] Feedback begins immediately
[ ] Button dimensions remain stable
[ ] Loading prevents duplicate action
[ ] Motion is restrained
[ ] Focus remains visible
[ ] Reduced motion preserves feedback
```

---

# 98. Product Card Motion Acceptance

```text
[ ] Product remains visually dominant
[ ] Hover does not move layout
[ ] Touch users receive equivalent actions
[ ] Secondary image transition is smooth
[ ] Quick add does not shift card height
[ ] Motion performs well in large grids
```

---

# 99. Hero Motion Acceptance

```text
[ ] Message is readable immediately
[ ] CTA is not delayed
[ ] Full sequence is short
[ ] Image motion remains subtle
[ ] Mobile motion is simplified
[ ] Reduced-motion fallback is complete
[ ] Hero remains performant
```

---

# 100. Navigation Motion Acceptance

```text
[ ] Menus respond promptly
[ ] Spatial origin is clear
[ ] Pointer movement is not disrupted
[ ] Keyboard operation remains correct
[ ] Focus is not delayed
[ ] Exit is slightly faster than entry
[ ] Mobile and desktop patterns are appropriate
```

---

# 101. Overlay Motion Acceptance

```text
[ ] Overlay opens from logical origin
[ ] Motion is under control
[ ] Focus enters immediately
[ ] Close action remains available
[ ] Background is stable
[ ] Reduced-motion behavior remains understandable
[ ] No nested motion conflict exists
```

---

# 102. Commerce Motion Acceptance

```text
[ ] Variant selection responds immediately
[ ] Missing-size error is clear
[ ] Add-to-cart feedback begins immediately
[ ] Cart count update is understandable
[ ] Cart drawer does not delay checkout
[ ] Quantity updates remain local
[ ] Removed items provide recovery
[ ] Shipping progress reflects real state
```

---

# PART XVII — MOTION QA

# 103. Device Testing

Test motion on:

```text
Mid-range Android phone

Modern iPhone

Tablet

Laptop with integrated graphics

Desktop
```

Do not test only on a powerful development computer.

---

# 104. Input Testing

Test with:

```text
Mouse

Trackpad

Touch

Keyboard

Screen reader

Reduced motion
```

---

# 105. Network Testing

Review motion under:

```text
Fast connection

Slow connection

Cached images

Uncached images

Failed request
```

Motion must not reveal blank surfaces or broken timing when data is delayed.

---

# 106. Frame Stability

Review:

* scroll smoothness
* hero video
* product grid
* drawer opening
* gallery swipe
* shared layout transition
* filter updates

Remove effects that create visible jank.

---

# PART XVIII — AI IMPLEMENTATION RULES

# 107. AI Motion Rules

When an AI coding agent creates or modifies motion, it must:

1. Define the usability purpose of the motion.
2. Use existing duration and easing tokens.
3. Prefer transform and opacity.
4. Respond to direct input within 100ms.
5. Avoid delaying navigation or purchase actions.
6. Use CSS for simple transitions.
7. Use a motion library only for complex behavior.
8. Localize Client Component boundaries.
9. Provide a reduced-motion alternative.
10. Avoid scroll hijacking.
11. Avoid continuous decorative animation.
12. Test touch and keyboard interaction.
13. Test on mobile-sized viewports.
14. Prevent layout shift.
15. Complete the motion acceptance checklist.

---

# 108. Motion Self-Review Checklist

```text
[ ] Does every animation have a purpose?

[ ] Does direct feedback begin immediately?

[ ] Are approved durations used?

[ ] Are approved easing curves used?

[ ] Are translation distances restrained?

[ ] Are scale values subtle?

[ ] Does motion preserve layout stability?

[ ] Is the primary CTA never delayed?

[ ] Are product cards calm?

[ ] Is hero motion short and controlled?

[ ] Are menus fast and predictable?

[ ] Do drawers enter from their physical edge?

[ ] Are modals restrained?

[ ] Does variant selection respond immediately?

[ ] Does add-to-cart provide clear feedback?

[ ] Are cart updates localized?

[ ] Is loading motion informative?

[ ] Are skeletons subtle?

[ ] Are offscreen animations paused?

[ ] Are heavy effects disabled on mobile?

[ ] Does reduced motion preserve all meaning?

[ ] Are transform and opacity preferred?

[ ] Are unnecessary Client Components avoided?

[ ] Is performance acceptable on mid-range hardware?

[ ] Does the complete motion language feel consistent?

[ ] Does the interface feel premium without feeling slow?
```

---

# 109. Final Principle

Motion should make the storefront easier to understand and more satisfying to use.

Customers should perceive:

```text
Immediate response

Clear state

Smooth continuity

Stable layout

Confident quality
```

They should not perceive:

```text
Delay

Noise

Distraction

Instability

Technical demonstration
```

When uncertain:

```text
Shorten the duration.

Reduce the distance.

Remove the bounce.

Use opacity.

Preserve the layout.

Respond immediately.

Simplify on mobile.

Support reduced motion.

Protect the purchase action.
```
