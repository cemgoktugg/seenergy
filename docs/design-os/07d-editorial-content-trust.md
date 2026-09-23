# E-Commerce Design Operating System

# Module 07D — Editorial, Content and Trust Components

---

## 1. Purpose

This module defines components that shape:

* brand storytelling
* campaign presentation
* category discovery
* editorial rhythm
* customer trust
* content engagement
* email acquisition
* after-purchase confidence
* perceived brand quality

These components must support commerce without turning the website into a collection of promotional banners.

Editorial and trust components should make products more desirable, the brand more memorable, and purchasing decisions more confident.

---

## 2. Core Principles

### 2.1 Storytelling Must Support Commerce

Editorial content should answer at least one of these questions:

* Why does this collection matter?
* How does this product fit into the customer’s life?
* What makes the material, fit, or design distinctive?
* How should the product be worn, used, or cared for?
* Why should the customer trust the brand?

If editorial content does not clarify, inspire, or support purchase confidence, it should be removed.

### 2.2 Photography Leads

For fashion, lingerie, beauty, jewelry, and lifestyle commerce, photography should carry most of the emotion.

Typography and layout must support the imagery.

Decorative graphics should not compete with the product.

### 2.3 Trust Must Be Specific

Trust is created through:

* clear delivery information
* honest return conditions
* precise sizing guidance
* material details
* secure payment information
* customer service access
* consistent policies

Generic claims such as “En kaliteli ürünler” do not create credible trust.

### 2.4 Editorial Rhythm Requires Variety

Avoid stacking multiple identical image-and-text blocks.

Use controlled variation in:

* scale
* image ratio
* alignment
* background
* content density
* composition

Variation must remain part of one visual system.

---

# PART I — HERO COMPONENTS

---

## 3. Editorial Hero

### Purpose

The Editorial Hero establishes the strongest first impression and communicates the primary campaign, collection, or brand message.

### Anatomy

```text
Background media
Optional overlay
Eyebrow
Headline
Supporting copy
Primary CTA
Optional secondary CTA
Optional campaign metadata
```

### Hero Variants

```text
Full-Bleed Image
Split Media and Content
Centered Editorial
Image with Protected Text Zone
Video Hero
Product-Led Hero
```

### Recommended Height

```text
Mobile: 70–90svh
Desktop: 80–100svh
```

A shorter hero may be used on functional category pages.

### Content Limits

Recommended:

```text
Eyebrow: 2–5 words
Headline: 2–10 words
Supporting copy: 1–3 short sentences
Primary CTA: 1
Secondary CTA: maximum 1
```

Avoid using the hero as a complete product catalog or campaign terms area.

### Headline Rules

The headline should be:

* concise
* distinctive
* readable
* emotionally clear
* appropriate for the image

Preferred:

```text
Kendin için seç.
Yeni sezon. Yeni his.
Yumuşak dokular, güçlü silüetler.
```

Avoid:

```text
Yeni Sezon Premium ve En Kaliteli Ürünlerimizi Çok Avantajlı Fiyatlarla Hemen Keşfedin
```

### CTA Hierarchy

Primary CTA should lead to the main commercial destination.

Examples:

```text
Koleksiyonu keşfet
Yeni gelenleri incele
Çok satanları görüntüle
```

Secondary CTA may lead to:

* campaign story
* lookbook
* size guide
* alternate category

Do not place three or more equally strong CTAs.

### Text Placement

Text must occupy a deliberate image-safe area.

Do not place text over:

* faces
* critical garment details
* visually noisy backgrounds
* high-contrast image edges

Use art-directed mobile images when necessary.

### Overlay

Use only when readability requires it.

Recommended:

* subtle directional gradient
* soft neutral panel
* controlled dark overlay

Avoid heavy black overlays that flatten the image.

### Motion

Allowed:

* controlled image scale
* opacity reveal
* short vertical text reveal
* subtle layered entrance

Recommended:

```text
Media entrance: 500–900ms
Headline reveal: 350–600ms
CTA reveal: 300–450ms
```

Avoid delaying access to primary actions.

### Mobile

On mobile:

* keep text within a safe readable area
* prevent CTA overlap
* limit headline line count
* use full-width or near-full-width CTA when appropriate
* consider separate image crop
* avoid tiny copy over large imagery

### Accessibility

* use a single logical `h1`
* decorative images use empty alt
* meaningful campaign images receive useful alt text
* text contrast must be tested
* video must not autoplay with sound
* motion must respect reduced-motion preferences

### Performance

* prioritize only the true above-the-fold image
* use responsive sources
* provide fixed dimensions or aspect ratio
* use poster image for video
* avoid heavy desktop media on mobile

### Acceptance Criteria

```text
[ ] Message is understood within five seconds
[ ] H1 is unique and clear
[ ] Primary CTA is obvious
[ ] Text remains readable across breakpoints
[ ] Image crop protects product and model
[ ] Motion does not delay shopping
[ ] Mobile composition is intentional
[ ] Hero media is optimized
[ ] No unnecessary promotional clutter exists
```

---

## 4. Product-Led Hero

### Purpose

Highlights a specific product or small collection with stronger commercial focus.

### Anatomy

```text
Product or campaign image
Product or collection name
Short value statement
Price or starting price where appropriate
Primary CTA
Optional secondary detail
```

### Rules

* do not recreate a complete product-detail panel
* keep price treatment secondary to the campaign
* use only for hero-worthy products
* preserve clear destination after click
* avoid vague “Shop now” copy when a more specific action is possible

---

## 5. Video Hero

### Appropriate Use

Use only when motion communicates:

* fit
* fabric movement
* lifestyle
* campaign atmosphere
* product detail

### Requirements

* muted by default
* no autoplay sound
* poster image
* visible controls when user interaction is expected
* pause when offscreen
* reduced-motion fallback
* mobile image fallback where appropriate

### Avoid

* long cinematic intros
* large file size
* looping without purpose
* text becoming unreadable
* blocking interaction until video loads

---

# PART II — CAMPAIGN AND CATEGORY COMPONENTS

---

## 6. Campaign Banner

### Purpose

Promotes a campaign, collection, launch, or seasonal story.

### Variants

```text
Full-width image
Split campaign
Text-only statement
Dark editorial banner
Product collage
```

### Content

Recommended:

```text
Eyebrow
Campaign title
One short description
One CTA
```

### Rules

* one dominant message
* no excessive legal or promotional terms inside the banner
* link the entire visual area only when interaction remains clear
* preserve text contrast
* use campaign-specific color tokens, not random colors

### Recommended Height

```text
Mobile: 420–640px
Desktop: 520–760px
```

Shorter banners may be used between product sections.

---

## 7. Category Card

### Purpose

Helps customers enter a primary product category visually.

### Anatomy

```text
Category image
Category title
Optional short descriptor
Optional link indicator
```

### Recommended Ratios

```text
Portrait: 3:4 or 4:5
Landscape: 3:2
Square: 1:1
```

Use one ratio system within the same group.

### Variants

```text
Image Overlay
Image with Text Below
Editorial Large
Compact Discovery
```

### Content Rules

Category title should normally be one or two lines.

Preferred:

```text
Sütyen
Ev giyimi
Dantel koleksiyonu
```

Avoid long marketing descriptions.

### Hover

Pointer devices may use:

* subtle image scale
* underline movement
* light overlay adjustment

Touch devices must retain clear affordance without hover.

### Accessibility

* card destination must be clear
* avoid nested links
* use meaningful alt text when image conveys category information
* text must remain readable over imagery

---

## 8. Shop-by-Mood Card

### Purpose

Supports emotional or lifestyle-based discovery.

Examples:

```text
Günlük rahatlık
Gece şıklığı
Hafta sonu konforu
Zarif dantel
```

### Rules

* mood names must map to real product groups
* do not invent categories that lead to empty results
* use imagery that clearly communicates the mood
* keep copy concise
* landing page should preserve the same visual promise

---

## 9. Collection Feature

### Purpose

Introduces a collection through image, story, and selected products.

### Anatomy

```text
Collection title
Short story
Campaign image
Optional product rail
Primary CTA
```

### Recommended Product Count

```text
3–6 selected products
```

Do not show the complete collection inside the feature.

### Layout

May use:

* large image with supporting text
* split composition
* image plus product rail
* editorial collage

### Rules

* focus on one collection
* preserve a clear transition to shopping
* avoid excessive explanatory text
* keep product selection curated

---

# PART III — STORYTELLING COMPONENTS

---

## 10. Editorial Split

### Purpose

Combines visual storytelling with concise content.

### Anatomy

```text
Primary image
Optional secondary image
Eyebrow
Heading
Body copy
CTA
```

### Desktop Layout

Recommended:

```text
Media: 55–65%
Content: 35–45%
```

### Mobile Layout

Usually:

```text
Media
Content
```

Reading order must match DOM order.

### Rules

* paragraph width must remain controlled
* one visual should be dominant
* overlapping elements must remain intentional
* do not force horizontal layout on small screens

---

## 11. Story Block

### Purpose

Communicates a material, craft, brand, fit, or lifestyle story.

### Examples

* fabric origin
* comfort philosophy
* fit development
* collection inspiration
* care guidance
* brand values

### Anatomy

```text
Title
Short editorial body
Optional image or video
Optional quote
Optional CTA
```

### Content Length

Recommended:

```text
50–180 words
```

Longer content should move to an editorial page.

### Rules

* use concrete information
* avoid generic brand claims
* break long copy into readable sections
* support with relevant imagery

---

## 12. Brand Manifesto

### Purpose

Expresses the brand belief in a memorable, concise format.

### Recommended Format

```text
One strong statement
One supporting paragraph
Optional brand link
```

### Recommended Width

```text
560–760px
```

### Example Direction

```text
İç giyim yalnızca görünen değil, hissettiren bir seçimdir.

Her parça; konforu, özgüveni ve kişisel stili desteklemek için tasarlandı.
```

### Rules

* avoid empty luxury clichés
* do not present unsupported sustainability claims
* keep tone human
* use generous spacing
* do not insert many CTAs

---

## 13. Quote Block

### Purpose

Highlights a meaningful statement within editorial content.

### Anatomy

```text
Quote
Optional attribution
Optional context
```

### Rules

* use real attributed quotes only
* brand-written statements should not imitate customer testimonials
* keep quote length controlled
* do not overuse decorative quotation marks

---

## 14. Material Story

### Purpose

Explains fabric, feel, care, and product benefit.

### Recommended Content

```text
Material name
Texture or feel
Functional benefit
Care note
Relevant products
```

### Rules

* use accurate material information
* distinguish composition from marketing language
* do not make medical or unsupported performance claims
* link to relevant products or collections

---

# PART IV — LOOKBOOK AND SHOPPABLE CONTENT

---

## 15. Lookbook

### Purpose

Shows products in styled, lifestyle-oriented combinations.

### Supported Formats

```text
Editorial image grid
Full-screen campaign sequence
Shoppable image
Story-driven collection page
```

### Rules

* each look must lead to real products
* product identification must remain clear
* imagery should inspire without blocking purchase access
* provide a product list alternative to visual hotspots
* mobile interaction must be touch-friendly

---

## 16. Shoppable Hotspot

### Anatomy

```text
Hotspot trigger
Product preview
Product name
Price
Product link
Optional quick add
```

### Trigger Size

```text
Visual marker: 20–28px
Interactive target: minimum 44×44px
```

### Positioning

Do not place hotspots:

* too close together
* over faces
* over critical garment details
* near viewport edges without collision handling

### Interaction

Desktop:

* click preferred
* hover preview optional

Mobile:

* tap to open
* bottom sheet may be used
* second tap or explicit action opens product

### Accessibility

* each hotspot requires a descriptive label
* keyboard access is mandatory
* open state must be exposed
* provide a non-visual product list
* popover must remain within viewport

### Performance

* load preview content on demand
* centralize popover logic
* avoid one heavy component instance per hotspot

---

## 17. Look Card

### Purpose

Presents a complete outfit or coordinated product group.

### Anatomy

```text
Look image
Look title
Product count
Optional short description
Shop-the-look action
```

### Rules

* products must genuinely belong together
* do not force all items into a bundle
* clearly show if some items are unavailable
* preserve individual product access

---

# PART V — MAGAZINE AND CONTENT COMPONENTS

---

## 18. Magazine Card

### Purpose

Introduces editorial content that supports trust, education, SEO, and brand storytelling.

### Anatomy

```text
Article image
Category
Title
Optional summary
Date or reading time
Link
```

### Variants

```text
Featured
Standard
Horizontal
Compact
```

### Image Ratios

Recommended:

```text
Featured: 16:9 or 3:2
Standard: 4:5 or 3:2
Compact: 1:1 or 4:3
```

### Content Rules

Article titles should be informative.

Preferred:

```text
Doğru sütyen bedeni nasıl bulunur?
Dantel ürünlerin bakımı nasıl yapılır?
Günlük iç giyimde kumaş seçimi
```

Avoid vague titles such as:

```text
Bilmeniz gereken her şey
Tarzınızı değiştirin
İlham veren detaylar
```

unless the context is already clear.

### Accessibility

* article title must be the primary link text
* avoid wrapping the entire card with nested controls
* image alt text should not repeat the title unnecessarily
* reading time must not be the only content descriptor

---

## 19. Featured Article

### Purpose

Highlights one important editorial story.

### Layout

Recommended:

```text
Large media
Article category
Large title
Short summary
Read action
```

### Rules

* one featured article per section
* title must remain readable
* summary should be concise
* avoid visually competing with the main commerce hero

---

## 20. Article Metadata

May include:

```text
Category
Author
Published date
Updated date
Reading time
```

### Rules

* use real information
* avoid showing all metadata when unnecessary
* use localized date formatting
* distinguish updated date when content has materially changed

---

## 21. Related Content

Recommended count:

```text
3–4 articles
```

Use relevance rather than chronology alone.

Do not place unrelated posts merely to fill space.

---

# PART VI — NEWSLETTER AND ACQUISITION

---

## 22. Newsletter Section

### Purpose

Collects permission-based email subscriptions while reinforcing brand value.

### Anatomy

```text
Heading
Short value statement
Email field
Submit action
Consent or privacy copy
Success state
Error state
```

### Copy

Preferred:

```text
Yeni koleksiyonlar, stil hikâyeleri ve özel davetler.

E-posta adresiniz
Abone ol
```

Avoid:

```text
İndirimleri kaçırmamak için hemen mailinizi bırakın!!!
```

### Value Proposition

Explain what the customer receives.

Examples:

* collection announcements
* editorial stories
* selected offers
* event invitations
* restock notifications

Do not promise exclusive access unless it exists.

### Layout

Mobile:

```text
Stacked input and button
```

Desktop:

```text
Inline form or centered stacked form
```

Recommended maximum width:

```text
420–640px
```

### Validation

Use:

* visible label
* email validation
* specific error
* preserved value after failure
* success confirmation

### Success State

Example:

```text
Teşekkürler. Yeni koleksiyonlardan ilk siz haberdar olacaksınız.
```

Do not immediately replace the complete section with a blank confirmation.

### Consent

If marketing consent is required:

* keep wording explicit
* do not preselect optional consent
* link to privacy information
* avoid combining unrelated permissions

### Accessibility

* email field has a label
* error is associated
* success is announced
* loading prevents duplicate submission
* button remains descriptive

---

## 23. Newsletter Popup

### Appropriate Use

Use sparingly and only when:

* timing is respectful
* value is clear
* dismissal is easy
* repeat frequency is limited

### Do Not Show

* immediately on first page load
* during checkout
* over an open cart
* repeatedly after dismissal
* before the customer understands the brand

### Preferred Triggers

* meaningful browsing time
* exit intent on desktop
* second or later session
* campaign-specific user action

### Mobile

Avoid large obstructive popups.

Use a bottom sheet or inline acquisition block when possible.

---

# PART VII — TRUST COMPONENTS

---

## 24. Trust Bar

### Purpose

Communicates important shopping assurances.

### Recommended Items

```text
Secure payment
Easy return
Fast delivery
Customer support
```

Recommended count:

```text
3–4 items
```

### Anatomy

```text
Optional icon
Short title
Optional one-line detail
```

### Rules

* use only true operational promises
* keep language concise
* do not overload with certifications
* avoid generic icons without text
* link to detailed policy where useful

### Example

```text
Kolay iade
İade koşullarını inceleyin.
```

Avoid:

```text
%100 Müşteri Memnuniyeti Garantisi
```

unless it is a real, defined guarantee.

---

## 25. Delivery Information Card

### Purpose

Clarifies shipping timing and conditions.

May include:

* estimated dispatch
* delivery range
* free-shipping threshold
* location-dependent note
* preorder timing

### Rules

* avoid promising exact dates without reliable logistics data
* distinguish dispatch from delivery
* update based on location when supported
* place near purchase action or cart summary

---

## 26. Return Information Card

### Purpose

Reduces hesitation by explaining return conditions.

### Content

Recommended:

```text
Return period
Condition requirements
Excluded product categories
Return method
Policy link
```

For lingerie and hygiene-sensitive products, exclusions must be stated clearly and legally accurately in production.

Do not imply universal returns when product-category restrictions exist.

---

## 27. Secure Payment Block

### Purpose

Provides payment confidence near cart or checkout.

May include:

* encrypted payment statement
* supported payment methods
* payment provider marks
* installment information

### Rules

* use real payment methods only
* avoid oversized payment logos
* do not claim security certifications without evidence
* keep visual treatment secondary to checkout action

---

## 28. Customer Support Card

### Purpose

Provides a clear path when customers need help.

May include:

```text
Live chat
WhatsApp
Phone
Email
Help center
Working hours
```

### Rules

* show real support availability
* distinguish instant from delayed channels
* avoid listing inactive contact methods
* keep support close to high-anxiety areas such as size guide, cart, and returns

---

## 29. Size Confidence Block

### Purpose

Reduces uncertainty in fit-sensitive categories.

### Anatomy

```text
Short heading
Measurement guidance
Size guide link
Optional fit assistant
Customer support path
```

### Example

```text
Doğru bedeni birlikte bulalım.

Ölçüm rehberini inceleyin veya beden desteği alın.
```

### Rules

* do not promise perfect fit
* use non-judgmental language
* keep the guide easy to access
* support both standard and bra sizing

---

# PART VIII — REVIEWS AND SOCIAL PROOF

---

## 30. Review Summary

### Purpose

Summarizes verified customer feedback.

### Anatomy

```text
Average rating
Review count
Rating distribution
Write-review action
```

### Rules

* use real review data only
* distinguish verified purchase where supported
* do not invent ratings in prototypes unless clearly labeled as mock content
* display review count near rating
* allow customers to understand distribution, not only average

---

## 31. Review Card

### Anatomy

```text
Rating
Review title
Review body
Reviewer identifier
Date
Verified status
Selected variant
Fit feedback
Optional image
```

### Rules

* preserve original customer meaning
* moderate abusive or illegal content through documented policy
* do not selectively hide negative but legitimate reviews
* expose selected size or fit information where useful
* allow reporting inappropriate content

---

## 32. Fit Feedback Summary

For fashion and lingerie, reviews may include:

```text
Dar
Tam kalıp
Bol
Destek seviyesi
Konfor
```

### Rules

* explain how data is calculated
* use enough responses before showing a summary
* do not present a few reviews as statistically reliable
* avoid medical or body-judgment language

---

## 33. Review Filters

May include:

* rating
* fit
* size
* verified purchase
* with photos
* most helpful
* newest

Do not overload the review interface with unnecessary filters.

---

## 34. No-Review State

Preferred:

```text
Bu ürün için henüz değerlendirme yok.

İlk deneyiminizi paylaşabilirsiniz.
```

Do not show empty stars without explanation.

---

## 35. Testimonials

Testimonials may be used for:

* brand service
* fit assistance
* delivery experience
* customer support
* collection experience

### Rules

* use real, consented statements
* attribute accurately
* do not present brand-written marketing copy as customer speech
* do not overuse large quote carousels

---

## 36. User-Generated Content Gallery

### Purpose

Shows customer styling and social proof.

### Requirements

* explicit content rights
* adult models for lingerie-related imagery
* clear moderation
* product linking where supported
* reporting mechanism where public
* accessible captions

Do not automatically pull social content without review and permission.

---

# PART IX — FAQ AND DISCLOSURE COMPONENTS

---

## 37. FAQ Section

### Purpose

Answers recurring customer questions without obstructing shopping.

### Recommended Categories

```text
Beden ve kalıp
Kargo
İade ve değişim
Ürün bakımı
Ödeme
Sipariş
```

### Anatomy

```text
Section heading
Question accordions
Optional support CTA
```

### Rules

* use actual customer questions
* answer directly
* keep answers concise
* link to detailed policies when necessary
* do not hide critical legal terms only inside FAQ

---

## 38. Policy Disclosure

Use for:

* hygiene-related return restrictions
* preorder timing
* promotion conditions
* subscription consent
* product-care limitations

### Rules

* place near the relevant action
* use plain language
* link to complete terms
* do not rely on tiny low-contrast text
* require explicit acknowledgement only when legally or operationally necessary

---

# PART X — EMPTY, ERROR AND STATUS CONTENT

---

## 39. Empty State

### Purpose

Provides recovery when content is absent.

### Anatomy

```text
Optional illustration or icon
Heading
Short explanation
Primary recovery action
Optional secondary action
```

### Recommended Uses

* empty cart
* empty wishlist
* no search results
* no filtered results
* no order history
* no saved addresses
* no reviews

### Rules

* explain why the state exists
* provide one clear next step
* avoid blaming the customer
* avoid oversized decorative illustrations
* keep commercial recommendations relevant

---

## 40. Empty Cart

Preferred:

```text
Sepetiniz boş.

Yeni gelenleri keşfederek alışverişe başlayabilirsiniz.

Yeni gelenleri incele
```

Optional:

* recently viewed products
* category shortcuts

Do not fill the empty cart with aggressive promotions.

---

## 41. Empty Wishlist

Preferred:

```text
Favorilerinizi burada saklayabilirsiniz.

Beğendiğiniz ürünleri kalp simgesiyle kaydedin.

Yeni gelenleri keşfet
```

---

## 42. No Search Results

Preferred:

```text
“ipek bordo bralet” için sonuç bulunamadı.

Daha kısa bir arama deneyebilir veya kategorileri inceleyebilirsiniz.
```

Include:

* query
* suggestions
* category links
* search reset

---

## 43. Error State

### Anatomy

```text
Clear heading
Specific explanation
Recovery action
Optional support path
```

Examples:

```text
Ürünler yüklenemedi.
Bağlantınızı kontrol ederek tekrar deneyin.

Tekrar dene
```

Avoid vague codes as primary customer-facing content.

---

## 44. 404 Page

### Purpose

Helps customers recover from an invalid route.

Include:

* clear message
* homepage action
* category links
* search
* optional editorial image

Preferred:

```text
Bu sayfa artık burada değil.

Yeni koleksiyonları keşfedebilir veya aradığınız ürünü arayabilirsiniz.
```

Do not use only a large “404” number without recovery options.

---

## 45. Maintenance State

Include:

* clear status
* expected availability only when reliable
* support or alternative channel
* no false countdown
* accessible plain-text information

---

# PART XI — FOOTER

---

## 46. Footer

### Purpose

Provides secondary navigation, policies, support, trust, and brand closure.

### Anatomy

```text
Newsletter
Primary footer navigation
Customer service
Policies
About
Social links
Payment methods
Locale controls
Copyright
Legal links
```

### Desktop Layout

Recommended:

```text
4–6 navigation columns
Newsletter as a distinct area
Legal row at bottom
```

### Mobile Layout

Recommended:

```text
Newsletter
Accordion navigation groups
Social links
Locale controls
Legal links
```

### Information Groups

Suggested:

```text
Alışveriş
Müşteri hizmetleri
Marka
Magazin
Yasal
```

### Rules

* group links logically
* avoid duplicating the complete header navigation
* do not overload with every internal route
* keep policy links reachable
* make support information easy to find
* use accordion behavior consistently on mobile

### Social Links

Use only active channels.

Icon-only social links require accessible names.

### Payment Marks

Use real supported payment methods.

Keep marks visually restrained.

### Locale and Currency

Show only when the website supports switching.

Do not create non-functional selectors.

### Accessibility

* use semantic footer
* headings organize link groups
* links remain keyboard accessible
* accordion triggers expose state
* contrast remains sufficient
* copyright text remains readable

---

# PART XII — CONTENT SYSTEM RULES

---

## 47. Editorial Copy Tone

Copy should feel:

* concise
* calm
* confident
* human
* elegant
* informative

Avoid:

* excessive exclamation marks
* empty luxury language
* fake scarcity
* overly long slogans
* machine-translated wording
* body-shaming language
* sexualized or explicit phrasing

---

## 48. CTA Language

Preferred:

```text
Koleksiyonu keşfet
Hikâyeyi oku
Ürünleri incele
Beden rehberini görüntüle
Tüm yazıları keşfet
```

Avoid:

```text
Tıkla
Buraya git
Daha fazla
Hemen al
```

when more specific language is available.

---

## 49. Trust Copy

Trust copy must be operationally accurate.

Preferred:

```text
14 gün içinde kolay iade
Siparişler 1–2 iş gününde hazırlanır
Güvenli ödeme
Beden desteği
```

Use only when these statements are true.

Avoid unsupported claims:

```text
En güvenilir alışveriş
Kusursuz kalite garantisi
Dünyanın en iyi kumaşları
```

---

## 50. Sensitive Product Language

For lingerie and body-related content:

* use respectful language
* avoid judgment
* avoid ideal-body assumptions
* avoid implying that one body type is normal
* avoid medical claims
* keep size guidance practical
* ensure all visual models are adults

---

# PART XIII — PERFORMANCE AND ACCESSIBILITY

---

## 51. Image Performance

Editorial components often carry heavy media.

Required:

* responsive image sizes
* lazy-load below-the-fold media
* use appropriate formats
* preserve aspect ratio
* avoid loading desktop images on mobile
* prioritize only critical media
* centralize image sources

---

## 52. Carousel Performance

For editorial or testimonial carousels:

* do not auto-rotate unless justified
* render only necessary slides
* avoid multiple large carousels
* preserve controls
* use CSS scroll snapping where suitable

---

## 53. Accessibility Requirements

All editorial and trust components must support:

* logical heading order
* descriptive links
* meaningful alt text
* visible focus
* sufficient contrast
* keyboard interaction
* reduced motion
* readable text widths
* non-color state indicators
* accessible accordions and carousels

---

# PART XIV — DO / DON'T

---

## 54. Do

* Use editorial content to support purchase decisions.
* Keep campaign messages focused.
* Make category destinations obvious.
* Use specific trust information.
* Keep newsletter value clear.
* Use real review data.
* Provide recovery in empty states.
* Keep footer navigation grouped.
* Use respectful body and size language.
* Optimize large editorial imagery.
* Test text over real images.
* Preserve mobile readability.
* Use adult models in lingerie content.
* Keep CTAs specific.

---

## 55. Don’t

* Turn the homepage into a banner stack.
* Use vague luxury clichés.
* Invent testimonials or ratings.
* Show unsupported guarantees.
* Use trust icons without meaningful copy.
* Place hotspots too close together.
* Depend on hover for shoppable content.
* Show newsletter popups immediately.
* Hide return restrictions.
* Use overly sexualized language.
* Use ambiguous-age models.
* Overload the footer.
* Fill empty states with irrelevant promotions.
* Use autoplay carousels without control.
* Repeat identical editorial layouts.

---

# PART XV — ACCEPTANCE CRITERIA

---

## 56. Editorial Acceptance

```text
[ ] Each editorial section has a clear purpose
[ ] Photography remains dominant
[ ] Headings are concise
[ ] CTA hierarchy is clear
[ ] Layout adds rhythm
[ ] Text width is controlled
[ ] Mobile crop is tested
[ ] Motion is restrained
[ ] Media is optimized
[ ] No unsupported claims exist
```

---

## 57. Trust Acceptance

```text
[ ] Trust messages are specific
[ ] Delivery statements are accurate
[ ] Return conditions are visible
[ ] Payment information is real
[ ] Support channels are active
[ ] Size guidance is easy to reach
[ ] Trust is not communicated by icons alone
[ ] Critical policy information is readable
```

---

## 58. Review Acceptance

```text
[ ] Review data is genuine or clearly marked as mock
[ ] Rating count is visible
[ ] Verified status is accurate
[ ] Fit feedback explains its source
[ ] Negative legitimate reviews are not hidden
[ ] Empty review state is complete
[ ] Review controls are accessible
```

---

## 59. Newsletter Acceptance

```text
[ ] Value proposition is clear
[ ] Email field has a label
[ ] Consent is explicit where required
[ ] Errors are specific
[ ] Success is announced
[ ] Mobile layout is usable
[ ] Popup timing is respectful
[ ] Repeat frequency is controlled
```

---

## 60. Footer Acceptance

```text
[ ] Link groups are logical
[ ] Policies are reachable
[ ] Support is easy to find
[ ] Mobile accordions work
[ ] Social links are active and labeled
[ ] Payment marks are accurate
[ ] Locale controls are functional
[ ] Footer does not feel overcrowded
```

---

## 61. AI Implementation Rules

When an AI agent creates or modifies editorial, content, or trust components, it must:

1. Define the commercial or trust purpose.
2. Use existing content and layout tokens.
3. Keep photography product-appropriate.
4. Avoid unsupported claims.
5. Use clear, specific CTA language.
6. Design a distinct mobile composition.
7. Add accessible interaction patterns.
8. Optimize editorial media.
9. Include loading, empty, and error states where relevant.
10. Use real data or clearly labeled mock data.
11. Respect adult-only imagery requirements for lingerie.
12. Complete the editorial and trust self-review checklist.

---

## 62. Self-Review Checklist

```text
[ ] Does this component support commerce or trust?

[ ] Is the primary message clear?

[ ] Is photography stronger than decoration?

[ ] Is the CTA specific?

[ ] Is the text concise?

[ ] Does the section add visual rhythm?

[ ] Is text readable over imagery?

[ ] Is mobile art direction intentional?

[ ] Are all claims accurate?

[ ] Are return and delivery messages honest?

[ ] Is size language respectful?

[ ] Are all models clearly adults?

[ ] Are reviews genuine or clearly mocked?

[ ] Does newsletter copy explain the value?

[ ] Are empty states useful?

[ ] Are error states recoverable?

[ ] Is footer navigation organized?

[ ] Are images optimized?

[ ] Is keyboard access complete?

[ ] Is reduced motion supported?

[ ] Does the component feel calm and premium?
```

---

## 63. Final Principle

Editorial and trust components should make the customer feel:

```text
I understand the brand.

I understand the product.

I know what to do next.

I trust the conditions.

I feel confident continuing.
```

When uncertain:

```text
Clarify the story.

Use stronger photography.

Reduce promotional noise.

Make the trust statement specific.

Protect customer confidence.

Connect inspiration to shopping.
```
