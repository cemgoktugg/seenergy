# E-Commerce Design Operating System

# Module 07C — Forms, Filters, Search and Overlays

---

## 1. Purpose

This module defines the standards for:

* form controls
* product filtering
* sorting
* search
* modal windows
* drawers
* bottom sheets
* accordions
* tabs
* tooltips
* toast notifications

These components directly affect:

* product discovery
* task completion
* error prevention
* accessibility
* mobile usability
* conversion
* trust

Every interaction must feel predictable, calm, responsive, and visually consistent.

---

## 2. Core Principles

### 2.1 Native Behavior First

Use native HTML controls whenever they can provide the required behavior.

Prefer:

* `input`
* `select`
* `button`
* `textarea`
* `fieldset`
* `legend`
* `dialog`

Custom controls must provide equivalent keyboard, screen-reader, focus, and error behavior.

### 2.2 Labels Are Mandatory

Every input must have a visible or programmatically associated label.

Placeholder text is not a substitute for a label.

### 2.3 Errors Must Be Specific

Error messages must explain:

* what went wrong
* where it happened
* how the user can correct it

Avoid generic messages such as:

```text
Bir hata oluştu.
```

### 2.4 State Must Be Visible

Every interactive component must clearly expose relevant states:

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
Expanded
Collapsed
```

### 2.5 Mobile Requires Different Interaction

Desktop dropdowns, filter sidebars, and hover tools must not be copied directly to mobile.

Use touch-oriented patterns such as:

* bottom sheets
* full-screen search
* large rows
* sticky actions
* expandable groups

---

# PART I — FORM FOUNDATIONS

---

## 3. Form Field Anatomy

Recommended structure:

```text
Label
Optional indicator
Input or control
Helper text
Error or success message
```

Example:

```text
E-posta adresi
name@example.com
Kampanya ve koleksiyon duyuruları için kullanılacaktır.
```

---

## 4. Label

### Recommended Typography

```text
13–14px
Weight: 500–600
```

### Rules

* Position above the control by default.
* Keep wording concise.
* Use sentence case.
* Do not add colons unnecessarily.
* Required fields must be explained consistently.

Preferred:

```text
E-posta adresi
Telefon numarası
Teslimat adresi
```

Avoid:

```text
LÜTFEN E-POSTA ADRESİNİZİ GİRİNİZ:
```

---

## 5. Required and Optional Fields

Use one consistent convention.

Recommended:

* explain once that all fields are required unless marked optional
* mark optional fields with `(isteğe bağlı)`

Example:

```text
Adres tarifi (isteğe bağlı)
```

Avoid adding a red asterisk to every field without explanation.

---

## 6. Text Input

### Recommended Height

```text
Mobile: 48–52px
Desktop: 44–52px
```

### Internal Padding

```text
Horizontal: 14–16px
Vertical: 12–14px
```

### Typography

```text
16px on mobile
15–16px on desktop
```

Mobile input text should remain at least 16px to prevent unwanted browser zoom.

### States

```text
Default
Hover
Focus
Filled
Disabled
Read-only
Error
Success
Loading
```

### Focus

Use:

* visible border change
* focus ring
* sufficient contrast
* no layout shift

Do not remove the browser focus indication without replacing it.

---

## 7. Placeholder Text

Placeholder copy should provide an example or format.

Preferred:

```text
ornek@email.com
5XX XXX XX XX
Adınızı yazın
```

Avoid:

```text
E-posta adresi
Telefon
İsim
```

when those words already serve as labels.

Placeholder contrast must remain readable but visually secondary.

---

## 8. Helper Text

Helper text should clarify:

* format
* expected value
* consequence
* privacy
* limitation

Example:

```text
Sipariş bilgileri bu numaraya gönderilecektir.
```

Recommended typography:

```text
12–14px
Line height: 1.4–1.5
```

---

## 9. Error Message

### Required Qualities

Error messages must be:

* specific
* actionable
* concise
* attached to the relevant field

Preferred:

```text
Geçerli bir e-posta adresi girin.
Telefon numarası 10 haneli olmalıdır.
Bu alan boş bırakılamaz.
```

Avoid:

```text
Hatalı giriş.
Geçersiz.
Bir sorun oluştu.
```

### Accessibility

Use:

* `aria-invalid="true"`
* `aria-describedby`
* visible error message
* optional icon
* error summary for long forms

Color must not be the only signal.

---

## 10. Success State

Use only when confirmation is useful.

Examples:

* promotion code applied
* address validated
* email available
* newsletter subscription completed

Avoid turning every valid input green while the user types.

---

## 11. Textarea

### Recommended Minimum Height

```text
120–160px
```

### Rules

* allow vertical resizing where appropriate
* show character limit when relevant
* preserve labels
* avoid tiny fixed boxes
* prevent hidden overflow

---

## 12. Password Input

Include:

* visible label
* show or hide password action
* requirement guidance
* Caps Lock awareness where appropriate
* clear error messages

The visibility action must be keyboard-accessible and labeled.

---

## 13. Search Input

Search inputs may include:

```text
Search icon
Input
Clear action
Loading indicator
Submit action
```

### Rules

* use `type="search"`
* provide a clear button when text exists
* preserve query during temporary errors
* submit with Enter
* do not start expensive searching on every keystroke without debounce

Recommended debounce:

```text
150–300ms
```

for local or remote suggestions.

---

## 14. Select

### Native Select

Prefer native select for:

* country
* city
* simple fixed option groups
* compact forms

### Custom Select

Use only when needed for:

* searchable options
* rich option content
* multi-select
* complex filtering

Custom selects must support:

* keyboard navigation
* Escape
* type-ahead
* selected state
* screen readers
* focus restoration

Do not build custom selects from generic clickable `div` elements.

---

## 15. Checkbox

### Purpose

Use checkboxes when multiple options may be selected.

Examples:

* filters
* communication preferences
* terms approval
* multiple categories

### Recommended Size

```text
Visual control: 18–22px
Touch target: minimum 44×44px
```

### States

```text
Unchecked
Checked
Indeterminate
Disabled
Focus
Error
```

### Rules

* label must be clickable
* do not place the label too far from the control
* use the indeterminate state for partial groups
* avoid preselecting optional marketing consent

---

## 16. Radio Group

### Purpose

Use radio buttons when exactly one option must be selected.

Examples:

* delivery method
* payment method
* address
* sorting option
* fit preference

### Structure

Use:

```text
fieldset
legend
radio options
```

### Rules

* provide one clear group label
* selected state must be obvious
* labels must be clickable
* keyboard arrow navigation should work naturally

---

## 17. Switch

### Purpose

Use switches for immediate on or off settings.

Examples:

* stock-only filter
* notification preference
* dark theme
* remember preference

Do not use switches for actions that require a separate Save button.

Use checkboxes instead when the change is part of a form submission.

---

## 18. Range Slider

### Appropriate Uses

* price range
* measurement range
* product dimension range

### Requirements

* visible minimum and maximum
* numeric inputs or accessible value labels
* keyboard support
* clear active track
* no color-only meaning

For precise price filtering, paired numeric fields are often more usable than a slider alone.

---

## 19. Form Group Spacing

Recommended:

```text
Label to control: 8px
Control to helper text: 6–8px
Field to field: 20–28px
Form section to section: 32–48px
```

Do not compress checkout or account forms excessively.

---

## 20. Form Submission

Submission buttons must:

* use clear action labels
* prevent duplicate submission
* preserve dimensions during loading
* expose busy state
* display success or error clearly
* avoid clearing fields after failure

Examples:

```text
Adresi kaydet
Ödemeye devam et
Hesap oluştur
Abone ol
```

---

# PART II — FILTER SYSTEM

---

## 21. Filter System Purpose

Filters reduce large product sets into relevant results.

A filter system must help users answer:

```text
Hangi ürünler bana uygun?
Hangi bedenler mevcut?
Hangi renkleri istiyorum?
Hangi fiyat aralığında alışveriş yapıyorum?
```

Filters must not become a technical database interface.

---

## 22. Filter Categories

Typical fashion and lingerie filters:

```text
Kategori
Beden
Bant ölçüsü
Kup ölçüsü
Renk
Fiyat
Kalıp
Destek seviyesi
Dolgu
Balen
Materyal
Koleksiyon
Stok durumu
```

Only show filters that meaningfully affect the current result set.

---

## 23. Filter Priority

Order filters by customer importance.

Recommended order for lingerie:

```text
Kategori
Beden
Bant ölçüsü
Kup ölçüsü
Renk
Kalıp
Destek seviyesi
Fiyat
Materyal
Koleksiyon
```

Do not order filters according to database field order.

---

## 24. Desktop Filter Sidebar

### Recommended Width

```text
240–320px
```

### Behavior

* may remain sticky
* must stop before the footer
* groups may use accordions
* selected counts should be visible
* reset action must be available

### Rules

* do not collapse every important group by default
* avoid excessive sidebar height
* show result count after changes
* preserve scroll position when filters update

---

## 25. Horizontal Filter Bar

Useful when:

* there are few filter categories
* the catalog is visually led
* desktop space is limited
* filters open in popovers

Each control should expose:

* label
* selected count
* open state
* clear option

Avoid a row of ten or more cramped filter buttons.

---

## 26. Mobile Filter Drawer

Preferred pattern:

```text
Full-screen drawer
or
Bottom sheet
```

### Anatomy

```text
Header
Result count
Reset action
Scrollable filter groups
Sticky apply action
```

### Primary Action

Example:

```text
245 ürünü göster
```

### Rules

* do not update and close after every selection
* allow multiple selections
* maintain a visible reset action
* preserve selections on close
* provide safe-area padding
* prevent background interaction

---

## 27. Filter Group

### Anatomy

```text
Group title
Optional selected count
Expand or collapse action
Options
Optional search
Optional show-more action
```

### Rules

* expose selected state clearly
* use plain customer language
* show unavailable counts carefully
* do not display hundreds of options without search or grouping

---

## 28. Filter Option Count

Optional counts may appear:

```text
Siyah (42)
Bordo (18)
```

Counts should:

* update correctly
* remain secondary
* not imply unavailable products incorrectly
* be omitted if they slow the interface or create confusion

---

## 29. Active Filter Chips

Show selected filters above the product grid.

Each chip should include:

```text
Filter value
Remove action
```

Examples:

```text
75C ×
Bordo ×
Dantelli ×
```

Include:

```text
Tümünü temizle
```

when more than one filter is active.

### Accessibility

Remove buttons must include the filter name.

Example:

```text
Bordo filtresini kaldır
```

---

## 30. Applying Filters

Supported strategies:

### Immediate Update

Best for desktop and fast local filtering.

### Apply Button

Best for mobile and complex remote filtering.

### Hybrid

Desktop updates immediately.

Mobile applies changes through a sticky button.

Do not reload the complete page after every small filter action unless technically required.

---

## 31. Filter URL State

Filter state should be representable in the URL where appropriate.

Benefits:

* shareable results
* browser navigation
* reload persistence
* analytics
* SEO-safe canonical control

Example:

```text
/kadin?beden=75c&renk=bordo&siralama=yeni
```

Do not encode private or temporary personal data in the URL.

---

## 32. Empty Filter Results

When filters produce no results:

* explain that no products match
* show active filters
* provide reset action
* suggest removing one or more constraints
* avoid generic 404 styling

Example:

```text
Bu seçimlerle eşleşen ürün bulunamadı.
Filtrelerden birini kaldırarak tekrar deneyin.
```

---

## 33. Filter Loading

During updates:

* preserve grid geometry
* avoid flashing the entire page
* indicate the affected region
* disable duplicate requests
* retain selected filters

Do not clear the current products before replacement unless necessary.

---

# PART III — SORTING

---

## 34. Sort Control

Typical options:

```text
Önerilen
En yeniler
Fiyat: düşükten yükseğe
Fiyat: yüksekten düşüğe
Çok satanlar
En çok değerlendirilenler
```

Only include options supported by real data.

Do not create meaningless sort choices.

---

## 35. Sort UI

Desktop:

* native select
* custom select
* compact popover

Mobile:

* bottom sheet
* radio list

Current selection must always be visible.

Sorting should update:

* URL state where appropriate
* result order
* screen-reader status
* analytics event

---

# PART IV — SEARCH EXPERIENCE

---

## 36. Search Architecture

Search may include:

```text
Search trigger
Search overlay
Search input
Suggestions
Recent searches
Trending searches
Categories
Products
Results page
No-result state
```

Search must support both exploration and precise product lookup.

---

## 37. Search Trigger

Recommended placement:

* header utility area
* mobile header
* optional persistent desktop field

Use a recognizable search icon and accessible label.

Example:

```text
Aramayı aç
```

---

## 38. Search Overlay

### Recommended Patterns

Desktop:

```text
Large overlay below header
or
Full-screen search experience
```

Mobile:

```text
Full-screen search page or drawer
```

### Anatomy

```text
Search input
Close action
Recent searches
Trending searches
Suggested categories
Suggested products
View-all-results action
```

### Rules

* input receives focus on open
* Escape closes
* focus returns to trigger
* background interaction is disabled
* query remains visible
* loading does not shift the layout

---

## 39. Search Suggestions

Suggestions may include:

```text
Query completions
Categories
Collections
Products
Editorial content
```

Group results clearly.

Example:

```text
Önerilen aramalar
Kategoriler
Ürünler
Magazin
```

Do not merge every result type into one undifferentiated list.

---

## 40. Recent Searches

Recent searches may be stored locally.

Requirements:

* avoid storing sensitive queries unnecessarily
* provide clear individual removal or clear-all action
* limit the list
* do not show stale or irrelevant history forever

---

## 41. Trending Searches

Use real merchandising or analytics data in production.

Examples:

```text
Dikişsiz bralet
Balkonet sütyen
Saten gecelik
Yüksek bel külot
Modal pijama
```

Do not invent false popularity claims.

---

## 42. Product Search Result

Compact product results may include:

```text
Thumbnail
Product name
Category
Price
Availability
```

Recommended initial suggestion count:

```text
4–8 products
```

Include a clear action:

```text
Tüm sonuçları görüntüle
```

---

## 43. Search Result Page

Include:

* query
* result count
* spelling or query guidance
* filters
* sorting
* product grid
* no-result state
* related categories where appropriate

Heading example:

```text
“dantelli sütyen” için 42 sonuç
```

---

## 44. Search No-Result State

Include:

* searched query
* concise explanation
* spelling suggestion where valid
* recommended categories
* trending searches
* customer support path if useful

Preferred:

```text
“bordo ipek bralet” için sonuç bulunamadı.
Daha kısa bir ifade deneyebilir veya kategorileri inceleyebilirsiniz.
```

---

## 45. Search Keyboard Behavior

Support:

* Enter to submit
* Escape to close overlay
* arrow-key movement through suggestions where implemented
* visible active result
* Tab navigation
* screen-reader status updates

Avoid trapping focus inside autocomplete options unexpectedly.

---

## 46. Search Performance

Use:

* debounce
* request cancellation
* cached popular results
* lightweight initial overlay
* image optimization
* limited suggestion count

Do not send a new network request for every character without control.

---

# PART V — OVERLAYS

---

## 47. Overlay Principles

Overlays must be used only when they support focus or preserve context.

Supported types:

```text
Modal
Drawer
Bottom sheet
Popover
Tooltip
Toast
Lightbox
```

Do not use a modal when a normal page or inline section would be clearer.

---

## 48. Modal

### Appropriate Uses

* size guide
* confirmation
* focused form
* product quick view
* legal or explanatory detail
* destructive-action confirmation

### Anatomy

```text
Title
Optional description
Close action
Body
Optional footer actions
```

### Recommended Widths

```text
Small: 360–440px
Medium: 520–640px
Large: 720–960px
```

Mobile may use a near-full-screen modal or bottom sheet.

### Behavior

* focus moves inside on open
* focus remains trapped
* Escape closes unless critical operation prevents it
* focus returns to opener
* background scroll locks
* overlay click may close only when safe

### Rules

* title must describe the task
* avoid nested modals
* avoid excessive text
* keep actions predictable
* destructive action must be explicit

---

## 49. Confirmation Modal

Use only for meaningful risk.

Examples:

* remove saved address
* delete account
* discard unsaved changes

Do not show confirmation for easily reversible actions.

Preferred actions:

```text
Vazgeç
Adresi sil
```

Avoid:

```text
Hayır
Evet
```

Action labels should describe the outcome.

---

## 50. Drawer

### Appropriate Uses

* cart
* mobile navigation
* filters
* account panel
* quick product configuration

### Structure

```text
Sticky header
Scrollable content
Sticky footer action
```

### Width

```text
Mobile: 100%
Tablet: 420–480px
Desktop: 440–520px
```

### Rules

* avoid nested drawers
* avoid multiple internal scroll areas
* preserve focus
* lock background interaction
* keep close action visible

---

## 51. Bottom Sheet

### Appropriate Uses

* mobile filters
* sorting
* quick add
* size selection
* share actions
* short task flows

### Height

```text
Content-based
Maximum: approximately 85–92dvh
```

### Anatomy

```text
Optional drag handle
Title
Close action
Scrollable content
Sticky actions
Safe-area spacing
```

### Rules

* do not rely solely on swipe-to-close
* provide a visible close action
* keyboard opening must not hide fields
* preserve selected state after close where appropriate

---

## 52. Popover

Use for:

* small contextual controls
* filter options
* compact menus
* color information
* utility actions

Popover must:

* remain attached to its trigger
* avoid viewport overflow
* close with Escape
* support keyboard access
* not contain long workflows

---

## 53. Accordion

### Appropriate Uses

* product details
* filters
* FAQs
* mobile footer
* size-guide sections

### Anatomy

```text
Trigger
Title
Optional metadata
Icon
Panel
```

### Behavior

Supported modes:

```text
Single open
Multiple open
```

Choose deliberately and remain consistent.

### Accessibility

* trigger is a button
* expose `aria-expanded`
* connect trigger and panel
* support keyboard focus
* hidden content is not focusable

### Motion

Recommended:

```text
180–240ms
```

Avoid animating large heights with expensive layout work when simpler approaches are available.

---

## 54. Tabs

### Appropriate Uses

* related product groups
* product information views
* account sections
* compact comparison content

Do not use tabs when users need to compare content simultaneously.

### Accessibility

Use:

* tab list
* tab
* tab panel
* arrow-key navigation
* active state
* focus management

### Mobile

Tabs may become:

* horizontally scrollable
* accordion
* segmented control

depending on the content.

---

## 55. Tooltip

### Appropriate Uses

Tooltips clarify unfamiliar icons or short concepts.

Do not place essential instructions only inside tooltips.

### Rules

* open on hover and focus
* close on Escape
* remain readable
* avoid interactive content
* do not use on touch-only experiences as the only explanation

Recommended width:

```text
180–320px
```

---

## 56. Toast

### Appropriate Uses

* product saved
* item added
* link copied
* preference updated
* temporary error
* background action completed

### Position

Desktop:

```text
Top-right or bottom-right
```

Mobile:

```text
Top or bottom above sticky controls
```

### Duration

```text
Informational: 4–6 seconds
Important error: persistent until dismissed or resolved
```

### Rules

* pause on hover and focus
* provide dismiss action when needed
* limit simultaneous toasts
* avoid covering primary actions
* announce messages accessibly
* do not use toast for critical form errors

---

## 57. Toast Queue

Recommended maximum visible count:

```text
1–3
```

Repeated messages should be combined or replaced.

Avoid creating a large stack of notifications.

---

# PART VI — FOCUS AND SCROLL MANAGEMENT

---

## 58. Focus Entry

When an overlay opens:

* move focus to the first meaningful control
* or focus the dialog container when reading context is required

Do not automatically focus destructive actions.

---

## 59. Focus Trap

Modals, drawers, and full-screen menus must trap focus.

The user must not tab into hidden background content.

---

## 60. Focus Return

When an overlay closes:

* return focus to the original trigger
* if the trigger no longer exists, move focus to the nearest logical destination

---

## 61. Scroll Lock

When a blocking overlay opens:

* lock page scroll
* preserve current scroll position
* prevent page jump
* restore position on close

Do not create double-scroll experiences.

---

## 62. Escape Behavior

Escape should close:

* modal
* drawer
* bottom sheet
* popover
* tooltip
* search overlay
* mega menu

unless closing would cause data loss or interrupt a critical irreversible process.

---

# PART VII — LOADING, ERROR AND EMPTY STATES

---

## 63. Form Loading

During submission:

* preserve fields
* prevent duplicate submission
* show progress on the action
* avoid disabling the entire page unnecessarily
* preserve user-entered data after failure

---

## 64. Filter Loading

Use:

* subtle grid progress
* skeleton replacement only when needed
* preserved results where possible
* accessible status text

Avoid full-page spinners.

---

## 65. Search Loading

Show:

* lightweight input progress
* suggestion skeletons
* preserved query
* cancellation of outdated requests

Do not display “Sonuç bulunamadı” before the search is complete.

---

## 66. Overlay Loading

If modal content loads remotely:

* open only when basic shell is ready
* show geometry-matching skeleton
* preserve close action
* avoid trapping users inside an empty surface

---

# PART VIII — CONTENT RULES

---

## 67. Button and Action Copy

Use explicit verbs.

Preferred:

```text
Filtreleri uygula
Tümünü temizle
Aramayı temizle
Sepete ekle
Beden rehberini aç
Değişiklikleri kaydet
```

Avoid:

```text
Tamam
Gönder
Devam
Tıkla
```

when the result is not obvious.

---

## 68. Search Copy

Preferred:

```text
Ürün, kategori veya koleksiyon ara
Son aramalar
Popüler aramalar
Tüm sonuçları görüntüle
```

---

## 69. Filter Copy

Use customer-facing language.

Preferred:

```text
Destek seviyesi
Dolgulu
Balensiz
Standart kalıp
```

Avoid internal catalog terminology that customers may not understand.

---

## 70. Empty-State Copy

Keep it:

* clear
* calm
* useful
* non-judgmental

Example:

```text
Henüz bir filtre seçmediniz.
İhtiyacınıza uygun ürünleri daraltmak için filtreleri kullanabilirsiniz.
```

---

# PART IX — PERFORMANCE

---

## 71. Client-Side Boundaries

Do not turn entire pages into Client Components because one filter or modal is interactive.

Isolate:

* form state
* overlay behavior
* autocomplete
* filter controls
* toast management

Keep static content server-rendered where possible.

---

## 72. Event Handling

Avoid:

* unnecessary global listeners
* repeated resize listeners
* uncontrolled scroll handlers
* one modal instance per product card
* duplicated filter state

Use centralized, composable state.

---

## 73. Search Request Control

Implement:

* debounce
* stale request cancellation
* response ordering protection
* caching where useful
* minimum query length where appropriate

---

## 74. Overlay Rendering

Heavy overlay content should load only when needed.

However, avoid delays that make essential navigation or cart access feel unresponsive.

---

# PART X — DO / DON'T

---

## 75. Do

* Use visible labels.
* Use native controls where possible.
* Provide specific errors.
* Keep mobile actions touch-friendly.
* Represent filter state in the URL.
* Preserve user input after errors.
* Separate result types in search.
* Trap and restore focus correctly.
* Use bottom sheets for mobile-specific tasks.
* Keep toast messages concise.
* Preserve layout while loading.
* Use customer-friendly filter language.
* Test keyboard interaction.
* Test long Turkish labels.

---

## 76. Don’t

* Use placeholder text as the only label.
* Create inaccessible custom selects.
* Use color alone for errors.
* Update mobile filters after every tap and close the drawer.
* Hide the active sort choice.
* Invent false trending searches.
* Use a modal for every task.
* Nest modals or drawers.
* Place critical errors in toasts.
* Allow background interaction behind overlays.
* Remove focus outlines.
* Clear form data after failed submission.
* Trigger requests on every keystroke without debounce.
* Use generic “Bir hata oluştu” messages.
* Copy desktop filters directly to mobile.

---

# PART XI — ACCEPTANCE CRITERIA

---

## 77. Form Acceptance

```text
[ ] Every control has a label
[ ] Input height is touch-friendly
[ ] Mobile text size prevents unwanted zoom
[ ] Focus is visible
[ ] Errors are specific
[ ] Errors are programmatically associated
[ ] Submitted data remains after failure
[ ] Loading prevents duplicate submission
[ ] Required fields are explained consistently
[ ] Keyboard completion is possible
```

---

## 78. Filter Acceptance

```text
[ ] Filter order reflects customer priorities
[ ] Selected filters are visible
[ ] Individual filters can be removed
[ ] All filters can be reset
[ ] Mobile uses an appropriate drawer or sheet
[ ] Apply action shows result count where useful
[ ] Empty results provide recovery
[ ] URL state is preserved where appropriate
[ ] Product-grid geometry remains stable
[ ] Filter interaction works by keyboard
```

---

## 79. Search Acceptance

```text
[ ] Search input receives focus on open
[ ] Query can be cleared
[ ] Suggestions are grouped
[ ] Loading is visible
[ ] No-result state is useful
[ ] Keyboard navigation works
[ ] Escape closes the overlay
[ ] Focus returns to the trigger
[ ] Requests are debounced or controlled
[ ] Search history respects privacy
```

---

## 80. Overlay Acceptance

```text
[ ] Overlay type matches the task
[ ] Focus moves inside
[ ] Focus is trapped
[ ] Escape behavior is correct
[ ] Background scroll locks
[ ] Focus returns after close
[ ] Close action is visible
[ ] Mobile safe areas are supported
[ ] Content does not overflow the viewport
[ ] No nested overlay conflict exists
```

---

## 81. AI Implementation Rules

When an AI agent creates or modifies forms, filters, search, or overlays, it must:

1. Use native semantic controls where possible.
2. Add visible labels.
3. Define every relevant state.
4. Provide specific error messages.
5. Implement keyboard behavior.
6. Preserve focus and scroll correctly.
7. Create a distinct mobile interaction where needed.
8. Represent filter and sort state consistently.
9. Control search requests.
10. Avoid unnecessary Client Component scope.
11. Test loading, empty, error, and disabled states.
12. Complete the self-review checklist.

---

## 82. Self-Review Checklist

```text
[ ] Are native controls used where possible?

[ ] Does every input have a visible label?

[ ] Are helper and error messages clear?

[ ] Is focus visible?

[ ] Are required fields explained?

[ ] Are form errors actionable?

[ ] Is user data preserved after failure?

[ ] Are duplicate submissions prevented?

[ ] Are filter groups ordered by customer need?

[ ] Are selected filters visible?

[ ] Can filters be reset individually and together?

[ ] Does mobile filtering use a touch-friendly pattern?

[ ] Is the current sorting option visible?

[ ] Is search fast and predictable?

[ ] Are suggestions grouped clearly?

[ ] Is search history handled responsibly?

[ ] Does Escape close overlays?

[ ] Is focus trapped inside blocking overlays?

[ ] Does focus return to the opener?

[ ] Is background scrolling locked?

[ ] Are bottom sheets safe-area aware?

[ ] Are toasts concise and non-obstructive?

[ ] Are critical errors shown near the task?

[ ] Are loading states geometry-stable?

[ ] Are client-side boundaries localized?

[ ] Does the complete experience feel calm and premium?
```

---

## 83. Final Principle

Forms, filters, search, and overlays must reduce effort.

The customer should always understand:

```text
What information is required.

Which options are selected.

How results are changing.

Where focus currently is.

How to close or reverse an action.

What to do after an error.
```

When uncertain:

```text
Use native behavior.

Clarify the label.

Reduce the number of steps.

Keep state visible.

Preserve context.

Make recovery easy.
```
