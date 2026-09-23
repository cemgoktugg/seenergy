# E-Commerce Design Operating System

# Module 13 — SEO & Discoverability Bible

## Next.js SEO, Structured Data, GEO & AI Discoverability Architecture

---

# 1. Purpose

The storefront must be discoverable by:

* Google
* Bing
* image search engines
* shopping/search systems
* social platforms
* AI assistants
* answer engines
* future commerce discovery systems

SEO is not a plugin.

SEO is architecture.

The frontend must be designed so that real commerce data can later be connected without rebuilding the information architecture.

---

# 2. Discoverability Model

Design for four discovery layers:

```text
Traditional Search
+
Visual Search
+
Commerce Search
+
AI / Answer Engines
```

The storefront must therefore provide:

```text
Semantic HTML
Clear information architecture
High-quality content
Structured product information
Machine-readable metadata
Strong internal relationships
Fast performance
Accessible content
```

---

# 3. Core Rule

Never hide important commercial information behind:

* client-only rendering
* hover
* animation
* tabs that remove content from the DOM unnecessarily
* images containing text
* JavaScript-only interactions

Important product information should exist in server-rendered HTML whenever practical.

---

# PART I — URL ARCHITECTURE

# 4. URL Philosophy

URLs must be:

```text
Readable
Stable
Predictable
Short
Semantic
```

Avoid:

```text
/product?id=837281
/category?cat=18
/p/4839274
```

Prefer:

```text
/sutyen
/kulot
/gecelik
/koleksiyonlar/dantel
/urun/luna-balkonet-sutyen
```

---

# 5. Turkish URL Rules

Use:

* lowercase
* hyphens
* normalized Latin characters where practical
* no spaces
* no unnecessary parameters

Example:

```text
Sütyen → /sutyen

İç Giyim → /ic-giyim

Dantelli Sütyen → /dantelli-sutyen
```

Once URLs are public, avoid changing them without redirects.

---

# 6. Proposed Taxonomy

Example architecture:

```text
/
├── /sutyen
│   ├── /balkonet-sutyen
│   ├── /bralet
│   ├── /destekli-sutyen
│   └── /straplez-sutyen
│
├── /kulot
│   ├── /string
│   ├── /hipster
│   └── /yuksek-bel
│
├── /gecelik
├── /body
├── /takim
├── /koleksiyonlar
├── /yeni-gelenler
├── /cok-satanlar
├── /beden-rehberi
├── /bakim-rehberi
└── /magazin
```

Do not create hundreds of thin categories simply to target keywords.

---

# 7. Product URL

Recommended:

```text
/urun/{product-slug}
```

Example:

```text
/urun/luna-dantel-balkonet-sutyen
```

The URL should normally remain stable when:

```text
color changes
size changes
stock changes
price changes
```

Do not create separate indexable pages for every size unless there is a genuine independent product/search intent.

---

# 8. Filter URLs

Filters may create URL parameters:

```text
/sutyen?renk=siyah&beden=75c
```

but this does not automatically mean the combination should be indexable.

Separate:

```text
UX filter state
```

from:

```text
SEO landing page
```

---

# PART II — NEXT.JS METADATA

# 9. Metadata Architecture

Use Next.js Metadata API.

Prefer:

```tsx
export const metadata
```

or:

```tsx
export async function generateMetadata()
```

depending on route data.

Do not manually scatter `<title>` logic across client components.

---

# 10. Homepage Title

Example structure:

```text
Brand Name | Premium Kadın İç Giyim
```

Avoid keyword stuffing:

```text
Sütyen İç Giyim Kadın Sütyen Külot Ucuz Sütyen Online...
```

---

# 11. Category Title

Recommended pattern:

```text
{Category} | Brand Name
```

Example:

```text
Balkonet Sütyen Modelleri | Brand Name
```

---

# 12. Product Title

Recommended:

```text
{Product Name} | Brand Name
```

Example:

```text
Luna Dantel Balkonet Sütyen | Brand Name
```

Do not fill product titles with every attribute.

---

# 13. Meta Description

Write human-readable descriptions.

Category example:

```text
Modern kesimler, zarif dantel detayları ve konfor odaklı tasarımlarla hazırlanan balkonet sütyen koleksiyonunu keşfedin.
```

Product example:

```text
Luna balkonet sütyen; zarif dantel dokusu, destekleyici formu ve modern silüetiyle günlük şıklık için tasarlandı.
```

Descriptions should help users decide whether to click.

---

# 14. Metadata Fallback

Define a metadata hierarchy:

```text
Product metadata
↓
Category metadata
↓
Site default metadata
```

No production page should accidentally output:

```text
undefined | Brand
```

---

# PART III — CANONICAL

# 15. Canonical Principle

Every indexable page should have a clear canonical URL.

Examples:

```text
/sutyen
/urun/luna-balkonet-sutyen
```

Filtered states should not automatically canonicalize to themselves.

---

# 16. Tracking Parameters

URLs such as:

```text
?utm_source=instagram
?utm_campaign=summer
```

must not create duplicate canonical content.

Canonical should point to the clean URL.

---

# PART IV — ROBOTS

# 17. Robots Strategy

Allow crawling of valuable pages.

Control low-value technical states.

Potential noindex candidates:

```text
Cart
Account utility pages
Internal search results
Temporary campaign states
Certain filter combinations
```

Do not block assets required to understand the page.

---

# 18. robots.txt

Next.js may provide:

```text
app/robots.ts
```

Use environment-aware configuration.

Never accidentally expose a production storefront with:

```text
Disallow: /
```

---

# PART V — SITEMAP

# 19. Sitemap Architecture

Use:

```text
app/sitemap.ts
```

or scalable sitemap generation.

Include valuable canonical URLs:

```text
Homepage
Categories
Collections
Products
Editorial content
Guides
```

---

# 20. Sitemap Quality

Do not include:

```text
Cart
Search query pages
Wishlist
Account
Every filter combination
Broken products
Redirect URLs
404 URLs
```

---

# 21. Large Catalog

If the catalog grows significantly:

```text
Sitemap Index

├── products-1.xml
├── products-2.xml
├── categories.xml
├── collections.xml
└── content.xml
```

Prepare architecture for scale.

---

# PART VI — STRUCTURED DATA

# 22. Structured Data Principle

Structured data must represent actual visible content.

Never create fake:

```text
Reviews
Ratings
Availability
Prices
Discounts
```

to obtain rich results.

---

# 23. Organization Schema

Homepage may provide organization/business information.

Potential fields:

```text
name
url
logo
sameAs
contact information where appropriate
```

Use accurate real business information only.

---

# 24. WebSite Schema

Homepage may provide:

```text
WebSite
```

structured data.

Add search-related schema only if the real site search implementation qualifies.

---

# 25. Breadcrumb Schema

Category and PDP pages should support:

```text
BreadcrumbList
```

Example:

```text
Ana Sayfa
>
Sütyen
>
Balkonet
>
Luna Balkonet Sütyen
```

Visible breadcrumb and structured breadcrumb should agree.

---

# 26. Product Schema

PDP architecture should be ready for:

```text
Product
```

with fields such as:

```text
name
description
image
sku
brand
color
material
offers
```

Only populate fields supported by real product data.

---

# 27. Offer Schema

When real commerce data is connected:

```text
Offer
```

may contain:

```text
price
priceCurrency
availability
url
itemCondition
```

Price and availability must reflect the visible page.

---

# 28. Product Variants

If the product model supports variants, structured data should reflect the real relationship appropriately.

Do not create fake independent products for:

```text
75B
75C
80B
80C
```

solely for SEO.

The schema implementation should follow the final backend/catalog model.

---

# 29. Review Schema

Only expose real eligible review data.

Never generate:

```text
4.9 / 5
```

because the design mockup contains stars.

During frontend-only development, fake ratings must not be emitted as production structured data.

---

# 30. JSON-LD Implementation

Prefer server-generated JSON-LD.

Keep schema logic centralized.

Possible architecture:

```text
/lib/seo/
├── organization.ts
├── product.ts
├── breadcrumb.ts
├── website.ts
└── collection.ts
```

Avoid duplicating schema logic inside page JSX.

---

# PART VII — PRODUCT PAGE SEO

# 31. PDP Content Hierarchy

Recommended:

```text
H1 Product Name

Price

Short product proposition

Variant selection

Purchase action

Product description

Fit / support information

Material

Care instructions

Delivery / returns

Size information

Related products
```

---

# 32. Product H1

One clear product heading.

Example:

```html
<h1>Luna Dantel Balkonet Sütyen</h1>
```

Do not turn:

```text
NEW COLLECTION
LUNA
BALKONET
BORDEAUX
```

into four competing H1 elements.

---

# 33. Product Description

Avoid generic manufacturer-style filler.

Good product copy answers:

```text
What is it?

How does it fit?

What support does it provide?

How does the fabric feel?

What is distinctive?

How should it be cared for?
```

---

# 34. Lingerie-Specific Product Information

Useful structured visible content may include:

```text
Model type

Cup structure

Underwire

Padding

Strap adjustability

Closure

Coverage

Support level

Material composition

Care instructions
```

This helps:

```text
Customers
Search engines
AI systems
Accessibility
```

---

# 35. Fit Information

Create useful language.

Example:

```text
Normal kalıptır. Her zaman kullandığınız bant ve kup ölçüsünü tercih edebilirsiniz.
```

or:

```text
Bant yapısı sıkıdır. İki bant ölçüsü arasında kalıyorsanız bir üst bant ölçüsünü değerlendirin.
```

Only make claims supported by actual product data.

---

# PART VIII — CATEGORY SEO

# 36. Category H1

Every primary category should have a meaningful H1.

Example:

```text
Balkonet Sütyen Modelleri
```

---

# 37. Category Intro

Provide concise useful context near the top.

Do not place a 1,500-word SEO wall above the products.

Recommended:

```text
50–150 useful words
```

where appropriate.

---

# 38. Extended Category Content

Longer educational content may appear after the product grid.

Possible sections:

```text
Balkonet sütyen nedir?

Kimler için uygundur?

Doğru beden nasıl seçilir?

Hangi kıyafetlerle kullanılır?

Bakımı nasıl yapılır?
```

This should be useful content, not keyword padding.

---

# 39. Internal Category Links

Contextually link related categories.

Example:

```text
Balkonet
→ Straplez
→ Bralet
→ Sütyen beden rehberi
```

Avoid giant blocks of keyword links.

---

# PART IX — FACETED NAVIGATION

# 40. Faceted SEO Principle

Filters create huge URL combinations.

Example:

```text
/sutyen
/sutyen?renk=siyah
/sutyen?renk=siyah&beden=75c
/sutyen?renk=siyah&beden=75c&destek=balenli
```

Not every combination deserves indexing.

---

# 41. Indexable Facets

A filter combination may deserve a dedicated SEO landing page if it has:

```text
Meaningful search demand
Sufficient products
Unique content
Stable business value
```

Example:

```text
/siyah-sutyen
/dantelli-sutyen
/straplez-sutyen
```

may be better than relying on raw filter URLs.

---

# 42. Thin Facets

Do not index combinations such as:

```text
75C + bordo + balenli + indirimli
```

unless there is a very strong reason.

---

# PART X — PAGINATION

# 43. Pagination Principle

Product discovery must remain crawlable.

If using:

```text
Load More
```

ensure products remain accessible through crawlable page states or equivalent architecture.

Do not rely exclusively on infinite scroll with no crawlable structure.

---

# 44. Pagination URLs

Possible:

```text
/sutyen?page=2
```

Maintain stable URL behavior and back navigation.

---

# PART XI — INTERNAL LINKING

# 45. Internal Linking Principle

Important pages should not become isolated.

Internal linking should connect:

```text
Homepage
↕
Category
↕
Subcategory
↕
Product
↕
Guide
↕
Editorial
```

---

# 46. Product-to-Content Links

Example:

```text
Product
→ Beden Rehberi

Product
→ Bakım Rehberi

Product
→ İade ve Değişim
```

---

# 47. Content-to-Commerce Links

Example:

```text
"Balkonet sütyen nasıl seçilir?"
↓
Balkonet category
↓
Relevant products
```

Editorial content should support commerce naturally.

---

# PART XII — IMAGE SEO

# 48. Image Naming

Prefer meaningful source names.

Example:

```text
luna-bordo-balkonet-sutyen-on.webp
luna-bordo-balkonet-sutyen-arka.webp
luna-bordo-balkonet-sutyen-dantel-detay.webp
```

Avoid:

```text
IMG_83281.webp
DSC00122.jpg
```

when asset workflows allow meaningful naming.

---

# 49. Alt Text

Alt text should describe the actual image.

Example:

```text
Bordo dantel balkonet sütyen, önden görünüm
```

Do not stuff keywords.

---

# 50. Image Context

Search engines understand imagery partly from surrounding content.

Place product images near:

```text
Product name
Color
Description
Relevant caption/context
```

---

# 51. Visual Search Readiness

Maintain:

```text
Clean product photography
Consistent product framing
High resolution
Accurate colors
Multiple angles
Detail imagery
```

This improves both UX and future visual-commerce discovery.

---

# PART XIII — SOCIAL METADATA

# 52. Open Graph

Provide:

```text
og:title
og:description
og:image
og:url
og:type
```

for important pages.

---

# 53. Product Share Image

Use a clean product image or branded product social image.

Avoid:

```text
Tiny product inside huge empty canvas
Text-heavy promotional image
Wrong color variant
Low-resolution thumbnail
```

---

# 54. Twitter/X Cards

Provide compatible card metadata where useful.

Use a large image card for product/editorial content where appropriate.

---

# PART XIV — CONTENT STRATEGY

# 55. Content Clusters

Build useful topic clusters.

Example:

```text
Sütyen

├── Sütyen beden rehberi
├── Kup ölçüsü nasıl alınır?
├── Bant ölçüsü nasıl alınır?
├── Balkonet sütyen nedir?
├── Bralet nedir?
├── Straplez sütyen seçimi
└── Sütyen bakımı
```

---

# 56. Customer Questions

Content should answer real questions.

Examples:

```text
Doğru sütyen bedeni nasıl bulunur?

Kup ölçüsü nasıl hesaplanır?

Balkonet sütyen kimlere uygundur?

Balenli ve balensiz sütyen farkı nedir?

Sütyen nasıl yıkanır?

İç çamaşırı hangi sıcaklıkta yıkanmalı?

Beyaz kıyafet altında hangi renk sütyen tercih edilir?
```

---

# 57. Content Quality

Every guide should provide:

```text
Clear answer
Useful explanation
Practical steps
Relevant products/categories
Original value
```

Avoid creating dozens of near-identical AI-generated articles.

---

# PART XV — AI / GEO DISCOVERABILITY

# 58. GEO Principle

The site should also be understandable to systems that synthesize answers rather than only display traditional search results.

This requires:

```text
Clear facts
Strong entity relationships
Consistent terminology
Structured data
Useful explanations
Reliable product attributes
Clear brand identity
```

---

# 59. Machine-Readable Product Facts

Product information should not exist only inside marketing prose.

Example visible structure:

```text
Model: Balkonet

Destek: Orta

Balen: Var

Dolgu: Hafif

Askı: Ayarlanabilir

Kapatma: Kopça

Materyal: %85 Polyamide, %15 Elastane

Bakım: Elde yıkama önerilir
```

This helps both customers and machines.

---

# 60. Direct Answer Content

Guides should answer important questions early.

Example:

```text
Balkonet sütyen nedir?

Balkonet sütyen, göğsün üst kısmını daha açık bırakan ve alttan destek sağlayan yatay kesimli bir sütyen modelidir.
```

Then provide deeper explanation.

Do not hide the answer after several paragraphs of introduction.

---

# 61. Entity Consistency

Use consistent names for:

```text
Brand
Product
Collection
Category
Material
Color
Product type
```

Do not call the same model:

```text
Balconette
Balkonet
Balconet
Half Cup
```

randomly across pages.

Define canonical customer-facing terminology.

---

# 62. Brand Entity

The brand should have consistent:

```text
Name
Logo
Description
Domain
Social profiles
Business information
```

across the site.

---

# 63. About Page

Create a strong About page explaining:

```text
Who the brand is

What it designs

Brand philosophy

Product approach

Material philosophy

Fit philosophy

Customer promise
```

Avoid vague copy such as:

```text
"Biz tutkuyla geleceği tasarlıyoruz."
```

without factual context.

---

# 64. Source-Worthy Content

Create content other sites and AI systems can reference.

Examples:

```text
Detailed bra measurement guide

Bra size conversion table

Fabric care guide

Lingerie terminology guide

Fit troubleshooting guide

Cup/band relationship explanation
```

---

# 65. Fit Troubleshooting

High-value guide example:

```text
Sütyen sırt bandı yukarı çıkıyorsa ne anlama gelir?

Kup taşması neden olur?

Askılar sürekli düşüyorsa ne yapılmalı?

Sütyenin ortası göğüs kafesine oturmuyorsa ne anlama gelir?
```

This content can become a major organic discovery asset.

---

# PART XVI — FAQ STRATEGY

# 66. FAQ Principle

Use FAQs because they help customers.

Do not create FAQ content solely for rich-result manipulation.

---

# 67. Product FAQs

Possible:

```text
Bu model dolgulu mu?

Balenli mi?

Askıları ayarlanabilir mi?

Kalıbı nasıl?

Nasıl yıkanmalı?
```

Answers should derive from actual product data.

---

# 68. Category FAQs

Possible:

```text
Balkonet sütyen nedir?

Balkonet sütyen kimlere uygundur?

Balkonet ve push-up arasındaki fark nedir?
```

---

# PART XVII — SEARCH INTENT ARCHITECTURE

# 69. Intent Types

Support:

```text
Transactional

Commercial investigation

Informational

Navigational
```

Examples:

```text
Transactional:
siyah balkonet sütyen

Commercial:
en rahat sütyen modelleri

Informational:
sütyen bedeni nasıl ölçülür

Navigational:
Brand Name beden rehberi
```

---

# 70. Intent-to-Page Mapping

Avoid making one page target every intent.

Example:

```text
/sutyen
→ broad commercial intent

/balkonet-sutyen
→ category intent

/beden-rehberi
→ informational intent

/urun/luna-balkonet-sutyen
→ transactional intent
```

---

# PART XVIII — ON-SITE SEARCH

# 71. Internal Search Data

Search should understand:

```text
Product name
Category
Collection
Color
Product type
Material
Key attributes
```

---

# 72. Search Synonyms

Prepare synonym architecture.

Examples:

```text
sütyen ↔ bra

külot ↔ slip

gecelik ↔ nightdress

balkonet ↔ balconette
```

Customer-facing language should still remain consistent.

---

# 73. Zero Results

Zero-result pages should provide:

```text
Clear message
Query correction
Related categories
Popular products
Alternative terms
```

Do not return a blank page.

---

# PART XIX — BROKEN & DISCONTINUED PRODUCTS

# 74. Temporary Out of Stock

Keep the product page live if the product will return.

Show:

```text
Tükendi
```

and appropriate alternatives.

Do not 404 temporarily unavailable products.

---

# 75. Permanently Discontinued Product

Possible strategies:

```text
Keep useful page + alternatives

or

301 redirect to the closest equivalent/category
```

Choose based on:

```text
Backlinks
Traffic
Replacement product
Search value
```

Do not redirect every discontinued product blindly to the homepage.

---

# 76. 404

Create a useful 404 page.

Provide:

```text
Search
Categories
New arrivals
Popular products
Homepage link
```

404 pages should return a real HTTP 404 status.

---

# PART XX — SEO + PERFORMANCE

# 77. SEO Performance Principle

SEO features must not destroy Core Web Vitals.

Avoid:

```text
Heavy SEO widgets
Large client-side schema generators
Huge hidden text blocks
Third-party scripts
```

Structured data should be lightweight.

---

# 78. Server Rendering

Important SEO content should be server-rendered.

Do not depend on:

```text
useEffect
```

to inject core product information.

---

# PART XXI — SEO + ACCESSIBILITY

# 79. Shared Foundation

SEO and accessibility both benefit from:

```text
Semantic HTML
Heading structure
Alt text
Descriptive links
Real text
Clear landmarks
```

Never damage accessibility for SEO.

---

# PART XXII — SEO + DESIGN

# 80. Premium Design Principle

SEO does not require ugly pages.

Avoid:

```text
Huge SEO text walls

Keyword clouds

Footer keyword spam

Hundreds of category links

Repeated paragraphs
```

Use:

```text
Editorial layout
Accordions where appropriate
Guides
Contextual internal links
Useful content sections
```

---

# PART XXIII — FRONTEND-ONLY DEVELOPMENT

# 81. Mock Data Rule

Because the current project is frontend-only, use mock product data.

But mock architecture should mirror realistic future commerce data.

Example:

```ts
type Product = {
  id: string
  slug: string
  name: string
  description: string
  productType: string
  color: string
  material: string
  images: ProductImage[]
  variants: ProductVariant[]
}
```

---

# 82. Fake SEO Data

Never accidentally publish fake structured data from mockups.

Development values such as:

```text
4.9 stars

1,284 reviews

Only 2 left

₺1,499
```

must be clearly mock data and easy to replace.

---

# PART XXIV — SEO FILE ARCHITECTURE

# 83. Recommended Structure

```text
src/
├── app/
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── layout.tsx
│   ├── page.tsx
│   ├── sutyen/
│   ├── koleksiyonlar/
│   └── urun/
│       └── [slug]/
│
├── components/
│
├── lib/
│   └── seo/
│       ├── metadata.ts
│       ├── product-schema.ts
│       ├── breadcrumb-schema.ts
│       ├── organization-schema.ts
│       └── website-schema.ts
│
└── data/
    └── mock-products.ts
```

Adapt this to the existing project rather than forcing unnecessary restructuring.

---

# PART XXV — SEO QUALITY GATES

# 84. Global SEO Acceptance

```text
[ ] Every important page has a unique title

[ ] Important pages have useful meta descriptions

[ ] One logical H1 exists

[ ] Heading hierarchy is semantic

[ ] Canonical URLs are correct

[ ] Important content is server-rendered

[ ] robots configuration is correct

[ ] Sitemap contains canonical valuable pages

[ ] Images have meaningful alt text

[ ] Internal links use descriptive anchors

[ ] Broken routes return correct status

[ ] Social metadata exists

[ ] Structured data reflects visible content

[ ] No fake review schema exists

[ ] Performance remains strong
```

---

# 85. Category SEO Acceptance

```text
[ ] Category URL is semantic

[ ] H1 describes the category

[ ] Intro copy is useful

[ ] Product grid is crawlable

[ ] Pagination/load-more architecture is crawlable

[ ] Related categories are linked naturally

[ ] Filter URLs are controlled

[ ] Thin facets are not automatically indexed

[ ] Category metadata is unique
```

---

# 86. PDP SEO Acceptance

```text
[ ] Product has a stable slug

[ ] Product name is H1

[ ] Product description exists as HTML

[ ] Price is visible as text

[ ] Product attributes are machine-readable text

[ ] Product imagery has useful alt text

[ ] Breadcrumb exists

[ ] Product schema is ready

[ ] Offer schema uses real data only

[ ] Availability matches visible state

[ ] Related content is linked

[ ] Size guide is reachable
```

---

# 87. GEO / AI Acceptance

```text
[ ] Brand identity is consistent

[ ] Product type terminology is consistent

[ ] Product attributes are explicit

[ ] Important questions receive direct answers

[ ] Guides provide original useful value

[ ] Product facts are not hidden in images

[ ] Product facts are not hidden behind JS

[ ] Entity relationships are clear

[ ] About page provides factual brand context

[ ] Content is written for humans first

[ ] Structured data supports visible facts

[ ] No fabricated claims exist
```

---

# PART XXVI — AI IMPLEMENTATION RULES

# 88. AI SEO Rules

When an AI coding agent creates or modifies an indexable storefront page, it must:

1. Determine the page search intent.
2. Define one logical H1.
3. Create unique metadata.
4. Use a semantic stable URL.
5. Add canonical handling.
6. Render important content on the server.
7. Preserve semantic heading hierarchy.
8. Provide descriptive image alt text.
9. Add meaningful internal links.
10. Avoid thin keyword content.
11. Keep filters separate from SEO landing pages.
12. Add structured data only when real data supports it.
13. Never fabricate ratings or reviews.
14. Keep structured data consistent with visible content.
15. Protect Core Web Vitals.
16. Preserve accessibility.
17. Keep product facts explicit.
18. Optimize for human understanding before search engines.
19. Make the page understandable to AI answer systems.
20. Run the SEO acceptance checklist before completion.

---

# 89. AI Content Rule

Never generate SEO copy using this strategy:

```text
Keyword
↓
Repeat keyword
↓
Repeat synonym
↓
Add generic paragraph
```

Instead:

```text
Customer question
↓
Direct answer
↓
Useful explanation
↓
Specific information
↓
Relevant commerce connection
```

---

# 90. AI Discoverability Rule

For every important product/category concept ask:

```text
Could a customer understand exactly what this is?

Could a search engine classify it?

Could an AI system extract the important facts?

Could another website reference this information?
```

If not, improve the content structure.

---

# PART XXVII — SELF REVIEW

# 91. SEO Self-Review

```text
[ ] Is the URL understandable?

[ ] Is the title useful?

[ ] Is the H1 clear?

[ ] Is important content visible without JavaScript?

[ ] Is the page intent obvious?

[ ] Are images described?

[ ] Is the canonical correct?

[ ] Is this page worth indexing?

[ ] Does it duplicate another page?

[ ] Are filters creating crawl waste?

[ ] Are internal links useful?

[ ] Is product information explicit?

[ ] Is structured data truthful?

[ ] Are mock reviews excluded?

[ ] Is the page fast?

[ ] Is it accessible?

[ ] Can an AI system understand the product?

[ ] Are important questions answered directly?

[ ] Is terminology consistent?

[ ] Does this content provide genuine value?
```

---

# 92. Final Principle

Do not build pages for algorithms.

Build pages that are extremely easy for:

```text
Customers
Search engines
Commerce systems
AI assistants
```

to understand.

The architecture should communicate:

```text
Who are we?

What do we sell?

What is this product?

Who is it for?

How does it fit?

What is it made from?

What does it cost?

Is it available?

How do I choose the right size?

How do I care for it?

What should I explore next?
```

When uncertain:

```text
Use semantic HTML.

Write the direct answer.

Expose the product facts.

Keep URLs clean.

Keep terminology consistent.

Link related knowledge.

Use truthful structured data.

Avoid duplicate pages.

Avoid keyword stuffing.

Protect speed.

Protect accessibility.

Write for humans first.
```
