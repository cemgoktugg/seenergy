# E-Commerce Design Operating System

# Module 10 — Accessibility Bible

## WCAG-Oriented Accessible Premium Commerce

---

# 1. Purpose

Accessibility is a core product requirement.

The storefront must support customers using:

* keyboard navigation
* screen readers
* touch interfaces
* zoom
* browser text scaling
* reduced-motion preferences
* high-contrast settings
* alternative input devices
* voice control
* low-vision tools

The target standard is:

```text
WCAG 2.2 Level AA
```

Accessibility must be considered during:

```text
Design
↓
Component Architecture
↓
Implementation
↓
Content
↓
Testing
↓
QA
```

It must not be treated as a final audit step.

---

# 2. Core Principle

The same customer journey must remain possible without:

```text
Mouse
Hover
Color perception
Animation
Perfect vision
Precise touch
```

The primary commerce journey must remain accessible:

```text
Homepage
↓
Navigation
↓
Category
↓
Filters
↓
Product
↓
Variant
↓
Size
↓
Add to Cart
↓
Cart
```

---

# 3. Accessibility Priority

When visual design conflicts with accessibility:

```text
1. Understanding
2. Operability
3. Purchase capability
4. Error recovery
5. Accessibility
6. Visual refinement
7. Decorative effect
```

Accessibility is not optional visual polish.

---

# PART I — SEMANTIC HTML

# 4. Native HTML First

Use semantic HTML whenever possible.

Preferred:

```html
<header>
<nav>
<main>
<section>
<article>
<footer>

<button>
<a>
<input>
<select>
<textarea>

<fieldset>
<legend>

<h1>
<h2>
<h3>
```

Avoid recreating native controls with generic elements.

Bad:

```html
<div onclick="addToCart()">
  Sepete ekle
</div>
```

Preferred:

```html
<button type="button">
  Sepete ekle
</button>
```

---

# 5. Button vs Link

Use a link when navigation occurs.

```text
Link = Go somewhere
```

Use a button when an action occurs.

```text
Button = Do something
```

Examples:

```text
Koleksiyonu keşfet → Link

Sepete ekle → Button

Beden rehberi → Button or Link depending on implementation

Favorilere ekle → Button

Ürün detayına git → Link
```

Do not style links as buttons and then give them incorrect semantics.

---

# 6. Landmark Structure

Every page should provide meaningful landmarks.

Recommended:

```text
Header

Primary Navigation

Main Content

Optional complementary content

Footer
```

There should normally be one primary:

```html
<main>
```

per page.

---

# 7. Skip Link

Provide:

```text
Ana içeriğe geç
```

as the first keyboard-accessible element.

It should become visible on focus.

Target:

```html
<main id="main-content">
```

---

# PART II — HEADING STRUCTURE

# 8. Heading Hierarchy

Every page should normally contain one logical `h1`.

Example PDP:

```text
H1 — Luna Balkonet Sütyen

H2 — Ürün detayları

H2 — Materyal ve bakım

H2 — Değerlendirmeler

H2 — Benzer ürünler
```

Do not select heading levels according to visual size.

---

# 9. Visual vs Semantic Typography

A visually small heading may still be:

```html
<h2>
```

A large decorative statement does not automatically need to be:

```html
<h1>
```

Semantic structure and visual styling must remain separate.

---

# PART III — KEYBOARD ACCESSIBILITY

# 10. Keyboard Principle

Every interactive feature must work with:

```text
Tab
Shift + Tab
Enter
Space
Escape
Arrow keys where appropriate
```

No critical commerce feature may require a mouse.

---

# 11. Logical Tab Order

Keyboard order should follow visual and reading order.

Avoid:

```text
Header
↓
Footer
↓
Product
↓
Navigation
```

Correct:

```text
Header
↓
Navigation
↓
Main Content
↓
Product Controls
↓
Supporting Content
↓
Footer
```

---

# 12. Positive Tabindex

Avoid:

```html
tabindex="1"
tabindex="2"
tabindex="3"
```

Prefer natural DOM order.

Use:

```html
tabindex="0"
```

only when necessary.

Use:

```html
tabindex="-1"
```

for programmatic focus targets where appropriate.

---

# 13. Keyboard Traps

The user must never become trapped unintentionally.

Exceptions:

```text
Modal
Drawer
Full-screen menu
```

may intentionally trap focus while open.

The user must always have a clear way to close them.

---

# PART IV — FOCUS SYSTEM

# 14. Focus Visibility

Every interactive element must have a visible focus state.

Required for:

```text
Links
Buttons
Inputs
Swatches
Size selectors
Product cards
Tabs
Accordions
Carousel controls
Navigation
```

Never use:

```css
outline: none;
```

without an accessible replacement.

---

# 15. Focus Ring

Recommended:

```text
2–3px visible ring

2–4px offset
```

The ring must remain visible against:

```text
White
Black
Brand backgrounds
Images
Cards
Overlays
```

---

# 16. Focus Must Not Be Obscured

Sticky elements must not cover focused content.

Examples:

```text
Sticky header
Sticky add-to-cart
Bottom navigation
Cookie banner
```

Use appropriate:

```css
scroll-margin-top
scroll-padding
```

and bottom spacing.

---

# 17. Focus Restoration

After closing:

```text
Modal
Drawer
Search
Mega Menu
Bottom Sheet
```

return focus to the control that opened it.

Example:

```text
[Beden rehberi]

↓

Size Guide Modal

↓

Close

↓

Focus → [Beden rehberi]
```

---

# PART V — COLOR & CONTRAST

# 18. Text Contrast

Target WCAG AA.

Normal text:

```text
Minimum 4.5:1
```

Large text:

```text
Minimum 3:1
```

Large text generally means approximately:

```text
24px regular
or
18.66px bold
```

Do not rely on visual estimation.

Test contrast programmatically.

---

# 19. UI Component Contrast

Important control boundaries and states should generally reach:

```text
3:1
```

against adjacent colors where WCAG requires it.

Examples:

```text
Input border
Checkbox
Radio
Selected swatch
Focus indicator
Slider
```

---

# 20. Color Is Not Enough

Never communicate meaning only through color.

Bad:

```text
Green = available
Red = unavailable
```

Preferred:

```text
Available → normal option

Unavailable → disabled styling + text/semantic state
```

Example:

```text
75C — Tükendi
```

---

# 21. Sale Pricing

Do not rely only on red color.

Use structure:

```text
1.490 ₺

Önceki fiyat:
1.990 ₺
```

Screen readers must understand the relationship.

---

# PART VI — TEXT & ZOOM

# 22. Text Scaling

The interface must remain usable with increased text size.

Test:

```text
200% browser zoom
```

and platform text scaling where relevant.

Avoid fixed-height containers containing text.

---

# 23. Reflow

At high zoom:

* content should reflow
* controls should remain accessible
* text should not overlap
* page-level horizontal scrolling should not appear unnecessarily

Intentional horizontal regions may remain scrollable.

---

# 24. Small Text

Avoid body or functional text below:

```text
14px
```

Recommended body:

```text
16px
```

Legal and metadata text may be smaller but must remain readable and sufficiently contrasted.

---

# PART VII — IMAGES

# 25. Alternative Text

Meaningful images require useful alt text.

Example product image:

```text
Bordo dantel balkonet sütyen, önden görünüm
```

Avoid:

```text
image1.jpg
```

or:

```text
ürün resmi
```

---

# 26. Decorative Images

Decorative imagery should use:

```html
alt=""
```

so screen readers can ignore it.

---

# 27. Product Gallery Alt Text

Gallery images should differentiate views.

Example:

```text
Luna bordo balkonet sütyen, önden görünüm

Luna bordo balkonet sütyen, arkadan görünüm

Luna bordo balkonet sütyen, dantel detay
```

Avoid repeating the exact same alt text for every image.

---

# 28. Images Containing Text

Avoid placing essential information only inside images.

Campaign text should normally exist as real HTML text.

---

# PART VIII — ICONS

# 29. Decorative Icons

Decorative icons should be hidden from assistive technologies.

Example:

```html
aria-hidden="true"
```

---

# 30. Icon Buttons

Icon-only buttons require accessible names.

Bad:

```html
<button>
  <HeartIcon />
</button>
```

Preferred:

```html
<button aria-label="Favorilere ekle">
  <HeartIcon aria-hidden="true" />
</button>
```

---

# 31. Dynamic Icon Labels

When state changes:

```text
Favorilere ekle
```

should become:

```text
Favorilerden kaldır
```

The accessible name should reflect the current action.

---

# PART IX — FORMS

# 32. Form Labels

Every field requires a programmatically associated label.

Preferred:

```html
<label for="email">
  E-posta adresi
</label>

<input id="email" type="email" />
```

Placeholder is not a label.

---

# 33. Required Fields

Use semantic indication:

```html
required
```

where appropriate.

Explain the required-field convention clearly.

Do not rely solely on:

```text
*
```

---

# 34. Input Instructions

Provide instructions before the customer makes an error when the format is not obvious.

Example:

```text
Telefon numarası

Başında 0 olmadan 10 hane girin.
```

---

# 35. Error Association

Use:

```html
aria-invalid="true"
aria-describedby="email-error"
```

Example:

```text
Geçerli bir e-posta adresi girin.
```

The screen reader must be able to associate the error with the field.

---

# 36. Error Summary

For long forms, provide an error summary near the top after failed submission.

Example:

```text
Formda 3 alanı kontrol etmeniz gerekiyor.

• E-posta adresi
• Telefon numarası
• Teslimat adresi
```

Each item may link to the invalid field.

---

# 37. Do Not Clear Forms

After submission failure:

Preserve:

```text
Name
Email
Address
Selections
Consent
```

except sensitive data where security requires otherwise.

---

# PART X — PRODUCT VARIANTS

# 38. Variant Accessibility

Variant selection must expose:

```text
Group name
Option
Selected state
Availability
Disabled state
```

Do not create visually styled `div` elements without semantics.

---

# 39. Size Selector

Recommended implementation:

```text
fieldset
legend
radio group
```

Example concept:

```text
Beden

○ XS
● S
○ M
○ L
```

Screen reader should understand:

```text
Beden, radio group

S, selected
```

---

# 40. Unavailable Size

Unavailable variants should communicate both state and reason.

Example:

```text
75C — Tükendi
```

Avoid merely reducing opacity.

---

# 41. Color Swatches

Color swatches require text alternatives.

Visual:

```text
●
```

Accessible name:

```text
Bordo
```

Selected:

```text
Bordo, seçili
```

Do not expect users to infer color solely from visual swatches.

---

# 42. Color Names

Use meaningful customer-facing color names.

Preferred:

```text
Bordo
Siyah
Fildişi
Gül kurusu
```

Avoid internal values:

```text
#981F32
COL-001
Variant 3
```

---

# PART XI — BRA SIZE ACCESSIBILITY

# 43. Bra Size Groups

Bra sizing should expose two clear groups:

```text
Bant ölçüsü

Kup ölçüsü
```

Each group must have:

* label
* options
* selected state
* unavailable state

---

# 44. Combined Size Announcement

After both values resolve:

```text
Seçilen beden: 75C
```

should be available visually and to assistive technology.

Use a polite live region where appropriate.

---

# 45. Invalid Combination

If:

```text
80 + C
```

is unavailable:

Do not silently select another value.

Announce:

```text
80 bant ölçüsünde C kup mevcut değil.
Başka bir kup seçin.
```

---

# 46. Size Guide Accessibility

The size guide must support:

```text
Keyboard
Screen reader
Zoom
Touch
```

Measurement diagrams require text instructions.

Do not rely solely on body diagrams.

---

# 47. Size Tables

Use semantic table markup where the content is tabular.

Required:

```html
<table>
<thead>
<tbody>
<tr>
<th>
<td>
```

Provide row and column headings.

On mobile, preserve relationships.

Do not convert a meaningful size table into inaccessible styled `div`s.

---

# PART XII — NAVIGATION

# 48. Primary Navigation

Use semantic:

```html
<nav aria-label="Ana navigasyon">
```

Current page may use:

```html
aria-current="page"
```

---

# 49. Mega Menu

Mega menu must support:

```text
Keyboard
Escape
Focus management
Clear expanded state
```

Opening a mega menu must not unexpectedly move focus unless the interaction model requires it.

---

# 50. Mobile Menu

When opened:

* focus moves inside
* background becomes unavailable
* focus is trapped
* Escape closes
* close button is reachable
* focus returns to menu trigger

---

# 51. Breadcrumb

Use:

```html
<nav aria-label="İçerik yolu">
```

Current page:

```html
aria-current="page"
```

Avoid making the current page unnecessarily clickable.

---

# PART XIII — SEARCH

# 52. Search Landmark

Search may use:

```html
role="search"
```

or semantic search structure.

Input must have a meaningful accessible name.

---

# 53. Autocomplete

Autocomplete must communicate:

```text
Expanded state
Suggestion count
Active suggestion
Selected suggestion
```

Do not build complex autocomplete without correct keyboard behavior.

---

# 54. Search Loading

Announce meaningful changes such as:

```text
6 öneri bulundu.
```

Do not announce every keystroke.

---

# PART XIV — FILTERS

# 55. Filter Groups

Use:

```text
fieldset + legend
```

where appropriate.

Example:

```text
Renk

□ Siyah
□ Bordo
□ Fildişi
```

---

# 56. Applied Filter Announcement

After applying filters:

```text
3 filtre uygulandı. 24 ürün bulundu.
```

may be announced through a polite live region.

---

# 57. Filter Drawer

Must follow dialog/drawer focus behavior:

```text
Open
↓
Focus enters
↓
Background disabled
↓
Keyboard remains inside
↓
Apply / Close
↓
Focus returns
```

---

# PART XV — DIALOGS, DRAWERS & SHEETS

# 58. Dialog Semantics

Use native:

```html
<dialog>
```

or correctly implemented dialog semantics.

Required:

```text
Accessible name
Focus management
Focus trap
Escape handling
Background isolation
Focus restoration
```

---

# 59. Dialog Title

Every modal should have a programmatically associated title.

Example:

```text
Beden rehberi
```

Avoid anonymous dialogs.

---

# 60. Close Button

Close controls require clear accessible names.

Example:

```text
Beden rehberini kapat
```

instead of only:

```text
X
```

---

# 61. Background Inertness

When a blocking dialog is open, background content must not remain keyboard-accessible.

Use appropriate inertness / dialog behavior.

---

# 62. Nested Dialogs

Avoid nested dialogs.

Instead:

* update the existing dialog
* navigate inside it
* close and open the next task intentionally

---

# PART XVI — ACCORDIONS & TABS

# 63. Accordion

Trigger should be a button.

Required state:

```html
aria-expanded
```

Associate trigger and panel.

Collapsed content must not contain focusable hidden controls.

---

# 64. Tabs

Use proper tab semantics when implementing true tabs.

Support:

```text
Arrow keys
Home
End
Tab
```

where appropriate to the chosen ARIA pattern.

Do not add tab semantics to ordinary navigation links unnecessarily.

---

# PART XVII — CAROUSELS

# 65. Carousel Principle

Carousels are high-risk accessibility components.

Use them only when they improve the experience.

---

# 66. Carousel Controls

Provide:

```text
Previous
Next
Pause if auto-rotating
Slide context
```

Buttons need accessible names.

Example:

```text
Sonraki ürün
Önceki ürün
```

---

# 67. Autoplay

Avoid autoplay.

If used:

* provide pause
* stop on focus
* stop on hover where relevant
* respect reduced motion
* avoid short timing

---

# 68. Product Gallery

Screen reader users should understand:

```text
Image 1 of 6

Image 2 of 6
```

where useful.

Do not flood the accessibility tree with hidden duplicate slides.

---

# PART XVIII — MOTION

# 69. Reduced Motion

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

Reduce or disable:

```text
Parallax
Large transforms
Auto-scrolling
Animated zoom
Decorative reveals
Background movement
```

---

# 70. Essential Motion

If motion communicates important state:

Provide a non-motion equivalent.

Example:

Do not communicate cart success only through an animated cart icon.

Also show:

```text
Sepete eklendi
```

---

# 71. Flashing Content

Avoid content flashing more than safe accessibility thresholds.

Do not use aggressive promotional flashing.

---

# PART XIX — VIDEO

# 72. Video Controls

User-controlled videos should provide:

```text
Play
Pause
Volume
Fullscreen where relevant
```

Autoplay videos must be muted.

---

# 73. Captions

Videos containing speech or meaningful audio require captions.

Important visual information may require audio description or equivalent text.

---

# 74. Decorative Video

Decorative campaign video should not create screen-reader noise.

Provide:

* accessible fallback
* reduced-motion alternative
* poster image

---

# PART XX — TOASTS & LIVE REGIONS

# 75. Live Region Principle

Use live regions for important dynamic changes.

Examples:

```text
Ürün sepete eklendi.

Favorilere eklendi.

24 ürün bulundu.

Kupon uygulandı.
```

---

# 76. Politeness

Use:

```text
polite
```

for normal updates.

Reserve assertive announcements for urgent situations.

Do not interrupt the screen reader for trivial changes.

---

# 77. Duplicate Announcements

Avoid announcing the same event through:

```text
Button label
Toast
Live region
Drawer title
```

all at once.

Choose a controlled announcement strategy.

---

# PART XXI — CART ACCESSIBILITY

# 78. Add-to-Cart

After successful addition:

* provide visible feedback
* announce success
* update cart count accessibly
* preserve current product context

Do not force focus into the cart drawer unless opening the drawer is a deliberate interaction pattern.

If the drawer opens automatically, focus management must be intentional.

---

# 79. Cart Quantity

Quantity control must expose:

```text
Ürün adedi

Azalt

Current quantity

Artır
```

Example accessible names:

```text
Luna Balkonet Sütyen adedini azalt

Luna Balkonet Sütyen adedini artır
```

---

# 80. Remove Product

Accessible label should identify the product.

Preferred:

```text
Luna Balkonet Sütyen ürününü sepetten kaldır
```

Not simply:

```text
Sil
```

---

# 81. Undo Removal

If undo exists:

```text
Luna Balkonet Sütyen sepetten çıkarıldı.

Geri al
```

The message must remain available long enough to interact with.

---

# PART XXII — WISHLIST

# 82. Wishlist State

Heart control should expose state.

Example:

```text
Favorilere ekle
```

after activation:

```text
Favorilerden kaldır
```

Visual heart fill alone is insufficient.

---

# PART XXIII — PRODUCT BADGES

# 83. Badge Accessibility

Relevant badges should be available as text.

Examples:

```text
Yeni

Çok satan

İndirimli
```

Do not expose decorative badges multiple times to screen readers.

---

# 84. Stock Urgency

If genuine stock information is shown:

```text
Stokta 2 adet kaldı.
```

it must be available to assistive technology.

Never create fake urgency.

---

# PART XXIV — CONTENT ACCESSIBILITY

# 85. Link Text

Avoid generic links:

```text
Buraya tıklayın
Daha fazla
Detay
```

Prefer:

```text
Beden rehberini görüntüle

İade koşullarını incele

Yeni koleksiyonu keşfet
```

---

# 86. Language

Set the correct page language.

Example Turkish storefront:

```html
<html lang="tr">
```

Mark meaningful foreign-language passages when necessary.

---

# 87. Abbreviations

Avoid unexplained internal terminology.

If technical product terminology is necessary, explain it in customer language.

---

# PART XXV — ERROR ACCESSIBILITY

# 88. Error Principle

Errors must be:

```text
Visible

Specific

Associated

Recoverable
```

---

# 89. Variant Error

Example:

```text
Lütfen beden seçin.
```

Then:

* focus or move attention to the size selector
* preserve other selections
* associate the error with the selector

---

# 90. Network Error

Example:

```text
Ürün bilgileri yüklenemedi.

Tekrar deneyin.
```

The retry action must be keyboard-accessible.

---

# 91. Cart Error

Example:

```text
Bu ürünün adedi güncellenemedi.

Mevcut adet: 1

Tekrar dene
```

Do not silently fail.

---

# PART XXVI — TOUCH ACCESSIBILITY

# 92. Touch Target Size

Minimum target:

```text
44 × 44px
```

Important targets include:

```text
Close
Menu
Search
Cart
Wishlist
Size
Color
Quantity
Carousel arrows
```

---

# 93. Target Spacing

Controls should not require pixel-perfect tapping.

Keep sufficient space between:

```text
Remove
Quantity
Wishlist
Close
```

---

# 94. Gesture Alternatives

Any gesture interaction must have an alternative.

Examples:

```text
Swipe gallery → Previous / Next controls

Swipe drawer closed → Close button

Pinch zoom → Zoom controls where needed
```

Do not require gestures exclusively.

---

# PART XXVII — COGNITIVE ACCESSIBILITY

# 95. Predictability

Keep patterns consistent.

Examples:

```text
Cart icon always opens cart.

Heart always means wishlist.

Underlined text means link.

Primary button styling has consistent meaning.
```

---

# 96. Clear Language

Use:

```text
Sepete ekle
```

instead of:

```text
Ürün işlemini gerçekleştir
```

Use customer language.

---

# 97. Avoid Overload

Reduce simultaneous:

```text
Banners
Popups
Notifications
Animations
Recommendations
```

Customers should be able to focus on one task.

---

# 98. Destructive Actions

Use explicit language.

Preferred:

```text
Adresi sil
```

Avoid:

```text
Onayla
```

when confirming deletion.

---

# PART XXVIII — ACCESSIBLE AUTHENTICATION READINESS

# 99. Authentication

Future account flows must support:

* password managers
* paste
* autocomplete
* clear password requirements
* show/hide password
* understandable errors

Do not block password paste.

---

# 100. One-Time Codes

If OTP is introduced:

* support paste
* use appropriate autocomplete
* allow resend
* explain expiration
* avoid extremely short countdown pressure
* preserve the entered identifier

---

# PART XXIX — ACCESSIBILITY TESTING

# 101. Automated Testing

Automated tools may detect:

```text
Missing labels

Contrast problems

Invalid ARIA

Heading issues

Duplicate IDs

Missing alt text
```

But automated testing is not sufficient.

---

# 102. Manual Keyboard Test

For every release, manually test:

```text
Homepage

Navigation

Search

Category

Filters

Product

Color

Size

Bra size

Size guide

Add to cart

Cart

Wishlist
```

using only the keyboard.

---

# 103. Screen Reader Testing

Critical flows should be tested with representative screen readers.

Examples:

```text
VoiceOver + Safari

NVDA + Chrome/Firefox
```

Where available, test additional combinations.

---

# 104. Zoom Test

Test at:

```text
200%
```

and high browser zoom.

Review:

* clipping
* overlap
* sticky bars
* navigation
* forms
* dialogs
* product variants

---

# 105. Reduced Motion Test

Enable:

```text
Reduce Motion
```

Verify:

* hero remains understandable
* navigation works
* product gallery works
* cart feedback remains visible
* no essential information disappears

---

# 106. Contrast Test

Test:

```text
Body text

Muted text

Buttons

Links

Inputs

Focus

Disabled states

Badges

Text over images

Sale pricing
```

---

# PART XXX — CORE ACCESSIBILITY JOURNEY

# 107. Required Journey Test

A customer using only keyboard and screen-reader-compatible controls must be able to:

```text
Open homepage

↓

Open navigation

↓

Choose Sütyen

↓

Filter products

↓

Open product

↓

Review product information

↓

Select Bordo

↓

Select 75

↓

Select C

↓

Hear "Seçilen beden 75C"

↓

Add to cart

↓

Hear confirmation

↓

Open cart

↓

Change quantity

↓

Proceed toward checkout
```

No step may depend exclusively on:

```text
Hover

Color

Pointer

Gesture

Animation
```

---

# PART XXXI — ACCESSIBILITY ANTI-PATTERNS

# 108. Never Do

```text
Clickable divs

Placeholder-only labels

Color-only state

Invisible focus

Hover-only menus

Auto-selected product size

Unlabeled icon buttons

Fake disabled controls

Positive tabindex ordering

Keyboard traps

Unannounced cart changes

Image-only text

Inaccessible custom selects

Tiny touch targets

Gesture-only interaction

Autoplay sound

Uncontrolled animation

Low-contrast luxury typography

Screen-reader duplicate content

Hidden focusable elements

Nested modals
```

---

# PART XXXII — ACCEPTANCE CRITERIA

# 109. Global Accessibility Acceptance

```text
[ ] Page language is defined
[ ] Skip link exists
[ ] Landmarks are semantic
[ ] Heading hierarchy is logical
[ ] Links and buttons use correct semantics
[ ] Focus is visible
[ ] Keyboard order is logical
[ ] No unexpected keyboard traps exist
[ ] Text contrast meets target
[ ] UI states are not color-only
[ ] Meaningful images have useful alt text
[ ] Decorative images are ignored
[ ] Icon buttons have accessible names
[ ] Forms have labels
[ ] Errors are associated with fields
[ ] Zoom does not break layout
[ ] Reduced motion is supported
```

---

# 110. Commerce Accessibility Acceptance

```text
[ ] Product cards are keyboard accessible
[ ] Product names are meaningful links
[ ] Price relationships are understandable
[ ] Color swatches have names
[ ] Size selector exposes selected state
[ ] Unavailable sizes expose status
[ ] Bra band and cup groups are labeled
[ ] Combined bra size is announced
[ ] Invalid combinations are explained
[ ] Add-to-cart errors identify missing selection
[ ] Cart updates are announced
[ ] Quantity controls identify the product
[ ] Remove controls identify the product
[ ] Wishlist state is exposed
[ ] Filters announce meaningful result changes
[ ] Search suggestions are keyboard accessible
```

---

# 111. Overlay Accessibility Acceptance

```text
[ ] Dialog has an accessible title
[ ] Focus enters the dialog
[ ] Background is unavailable
[ ] Focus remains inside
[ ] Escape works where appropriate
[ ] Close button has an accessible name
[ ] Focus returns to opener
[ ] Mobile keyboard does not hide controls
[ ] Bottom sheet has a non-gesture close method
```

---

# PART XXXIII — AI IMPLEMENTATION RULES

# 112. AI Accessibility Rules

When an AI coding agent creates or modifies any storefront component, it must:

1. Prefer native semantic HTML.
2. Use buttons for actions and links for navigation.
3. Preserve logical DOM order.
4. Provide visible focus states.
5. Provide accessible names for icon controls.
6. Avoid color-only meaning.
7. Associate labels and errors correctly.
8. Support keyboard operation.
9. Manage focus for overlays.
10. Support reduced motion.
11. Preserve usability at 200% zoom.
12. Provide text alternatives for meaningful imagery.
13. Make variant states understandable to assistive technology.
14. Announce meaningful commerce state changes.
15. Avoid unnecessary ARIA.
16. Never use ARIA to repair fundamentally incorrect HTML when native HTML can solve the problem.
17. Complete accessibility acceptance tests before considering the component finished.

---

# 113. Accessibility Self-Review

```text
[ ] Can I use this without a mouse?

[ ] Can I understand this without color?

[ ] Can I understand this without animation?

[ ] Can a screen reader identify every control?

[ ] Does every icon button have a name?

[ ] Is focus always visible?

[ ] Is focus order logical?

[ ] Are modal focus rules correct?

[ ] Are form labels persistent?

[ ] Are errors specific?

[ ] Are errors associated?

[ ] Are product variants understandable?

[ ] Are unavailable variants explained?

[ ] Is bra sizing accessible?

[ ] Is the selected combined size announced?

[ ] Does add-to-cart provide accessible feedback?

[ ] Are cart updates announced?

[ ] Does the interface survive 200% zoom?

[ ] Does reduced motion preserve meaning?

[ ] Are touch targets comfortable?

[ ] Are gesture alternatives available?

[ ] Is all important text real HTML text?

[ ] Are images described appropriately?

[ ] Are headings semantic?

[ ] Is the experience still premium without sacrificing accessibility?
```

---

# 114. Final Principle

Accessible commerce does not require a visually compromised experience.

The goal is:

```text
Premium design
+
Clear semantics
+
Predictable interaction
+
Inclusive access
+
Strong commerce UX
```

Every customer should be able to understand:

```text
What the product is.

What it costs.

Which options exist.

Which option is selected.

Whether it is available.

What action happens next.

Whether the action succeeded.

How to recover when something fails.
```

When uncertain:

```text
Use native HTML.

Make the state visible.

Give the control a name.

Keep focus visible.

Explain the error.

Do not depend on color.

Do not depend on hover.

Do not depend on motion.

Test with keyboard.

Protect the purchase journey.
```
