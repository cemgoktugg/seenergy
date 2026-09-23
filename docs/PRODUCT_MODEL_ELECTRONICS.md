# PRODUCT_MODEL_ELECTRONICS.md

## Catalogue data model

Extends `docs/design-os/07b-commerce-components.md` Part VIII (data and state
rules) and `13-seo-discoverability-bible.md` §81 (mock architecture must mirror
realistic future commerce data).

Source of truth: `src/types/product.ts`. This document explains *why* the shape
is what it is.

---

## 1. The core type

```ts
type ElectronicProduct = {
  id: string;
  slug: string;                      // stable, semantic, Turkish, ASCII-folded
  sku: string;                       // "VLT-PM-27447"
  brand: string;                     // brand slug → data/brands.ts
  model: string;                     // manufacturer model, e.g. "MVH-S320BT"

  name: string;
  shortDescription: string;          // ≤ 140 chars, one sentence, factual
  description: string;               // 2–4 paragraphs, answers §33 questions

  category: string;                  // category slug
  subcategory: string;               // subcategory slug

  price: number;                     // integer minor unit avoided: TRY, 2 dp max
  compareAtPrice?: number;           // strictly greater than price when present
  currency: "TRY";

  stock: number;                     // 0 = out of stock
  shippingType?: ShippingType;       // "same-day" | "free" | "standard" | "bulky"
  warrantyMonths?: number;

  images: ProductImage[];            // may be empty → generated art
  artKind: ProductArtKind;           // photography selector (data/images.ts)

  keySpecs: KeySpec[];               // 3–6, above the fold
  specifications: SpecGroup[];       // grouped, complete
  compatibility?: CompatibilityItem[];
  variants?: ProductVariant[];
  downloads?: ProductDownload[];
  badges?: ProductBadge[];

  facets: ProductFacets;             // machine-readable filter values
  relatedProductIds?: string[];
  similarProductIds?: string[];
  seo: ProductSEO;
};
```

---

## 2. Rules the model enforces

### 2.1 A cart line stores a resolved variant, never labels

ECDOS 15 §7 Stage 2 and 07B §33: the purchasable unit must resolve to a real
variant id before it can enter the cart. `lib/variant.ts` builds
`${slug}--${optionValueSlugs.join("--")}` and refuses to produce an id for a
combination that does not exist in `variants`. Products with no variants resolve
to `slug--default`.

### 2.2 Variants are electronics variants

Clothing size architecture is not reused. Variant option types are:

```
color · capacity · length · voltage · connector · packQuantity · power · memory
```

A variant carries its own `sku`, `stock`, and optional `price` — because a 5 m
HDMI cable genuinely costs more than a 1 m one, and a 256 GB card costs more
than 128 GB. Price deltas therefore live on the variant, and the PDP price
updates when a variant resolves.

`options` is an ordered list so the selector renders groups in a deliberate
order (capacity before colour, length before connector).

### 2.3 Key specs are a curated subset, not the head of the table

`keySpecs` is authored, 3–6 entries, and answers "will this work for me" at a
glance. It is not `specifications[0].rows.slice(0, 5)`. On a card, at most three
are shown (master brief §14).

### 2.4 Specifications are grouped

```ts
type SpecGroup = { title: string; rows: SpecRow[] };
type SpecRow  = { label: string; value: string; note?: string };
```

Groups are ordered from general to specific: `Genel → [domain groups] → Fiziksel`.
Values are strings because a specification is a *statement with a unit*
(`4 × 50 W`, `12 V / 2 A`, `IP66`), not a number. Rendering as a real
`<table>` per ECDOS 10 §47 preserves the row/column relationship for screen
readers; the mobile layout restyles the same table into stacked key/value rows
without changing the markup.

### 2.5 Facets are separate from specifications

Specifications are for humans. `facets` is for the filter engine:

```ts
type ProductFacets = {
  price: number;
  inStock: boolean;
  rating?: number;
  shipping: ShippingType;
  [attribute: string]: string | string[] | number | boolean | undefined;
};
```

Category-aware filters read `facets`, never parse spec strings. A filter group
declares which facet key it reads (`data/filters.ts`), so `Ses Sistemleri`
offers `power`, `bluetooth`, `connection`, `speakerType` and `Güvenlik & Kamera`
offers `resolution`, `nightVision`, `placement`, `storage` — and neither shows
the other's controls (master brief §18).

### 2.6 Compatibility is first-class

```ts
type CompatibilityItem = { label: string; values: string[]; note?: string };
```

Rendered by `CompatibilityInfo` as its own PDP section — not buried in the spec
table — because "will this fit my car / my TV / my system" is the question that
blocks the purchase. Examples: supported vehicle brands, TV panel models, socket
types, supported operating systems, compatible connector standards.

### 2.7 Downloads never point at `#`

ECDOS 07D §28/§46 and the README standing rule: a dead anchor is worse than an
absent one. `ProductDownload` carries `{ label, kind, href?, sizeLabel?, format }`.
When `href` is absent the item renders as a **non-interactive listed document**
with a "yakında" note. The downloads architecture is complete; the files are
what is missing, and the UI says so honestly.

### 2.8 Badges are capped

`badges` may contain any of `new · bestseller · discount · free-shipping ·
same-day · low-stock · out-of-stock`, but `ProductCard` renders at most **two**
(master brief §15, ECDOS 07A §19). Priority order is fixed in
`lib/badges.ts`: availability first, then commercial. A discount badge is
derived from `compareAtPrice`, never authored, so it cannot disagree with the
price.

---

## 3. Stock model

```ts
stock === 0            → "Tükendi"          danger, add-to-cart disabled + reason
stock <= LOW_STOCK (5) → "Son N ürün"       warning, count is real
stock  > LOW_STOCK     → "Stokta"           success
```

The count shown is the count in the data (ECDOS 07B §12, 10 §84). No urgency is
invented. The catalogue deliberately ships **one out-of-stock product and two
low-stock products** so those states are exercised rather than merely written
(ECDOS 14 §10).

---

## 4. Image strategy

```ts
type ProductImage = { src?: string; alt: string; view: string; width?: number; height?: number };
```

`ProductMedia` resolves in this order:

1. `image.src` present → `next/image` with an accurate `sizes` string
2. otherwise → the photograph registered for `product.artKind` in
   `src/data/images.ts`

`artKind` is what the product *looks like* (`speaker`, `microphone`, `amp`,
`mixer`, `camera`, `nvr`, `receiver`, `lnb`, `dish`, `adapter`, `psu`, `ups`,
`led`, `ledStrip`, `cable`, `network`, `storage`, `meter`, `carAudio`, `tool`,
`component`, `remote`, `powerbank`, `headphones`, `smartHome`, `board`), so it
doubles as the photo selector: a new product gets sensible imagery the moment
its kind is set.

Where a kind has more than one usable photograph, `productPools` lists them and
`data/products.ts` deals them out round-robin across that kind's products,
writing the result into `images[n].src`. This is why `src` is optional on the
type and yet populated for most of the catalogue.

Every media container has a **stable aspect ratio** (`--ratio-product` = 4/3),
a neutral bed, generous internal padding, and `object-fit: contain`. There is no
layout shift on load because nothing loads.

`alt` is always authored and always describes the view
(`"Pioneer MVH-S320BT oto teyp, önden görünüm"`), never `"ürün resmi"`
(ECDOS 10 §25/§27).

---

## 5. Mock-data honesty

Per ECDOS 13 §82 and 07D §30:

- Products, brands, models and specifications are **realistic but invented**.
  They are shaped like real sector products so that the layouts are stress-tested
  by real-world string lengths; they are not claims about real merchandise.
- **No ratings and no reviews exist anywhere in the build.** Not in the data, not
  in the card, not in the PDP, not in JSON-LD. ECDOS 07D §30 permits mock ratings
  only when clearly labelled as mock; shipping a labelled-fake star rating in a
  storefront that also emits Product schema is a worse outcome than having no
  review surface. `ProductSEO` has no `aggregateRating` field, so it cannot be
  emitted by accident. When real review data exists, 07D §30–§34 defines what to
  build and `rating` already exists on `facets` for the filter.
- Prices are plausible TRY values, formatted once through `formatPrice()`.
- Delivery, warranty and return statements are **configurable placeholders** in
  `data/site.ts`, marked as such, so no operational promise is hard-coded into a
  component.

`data/products.ts` is authored through a `defineProduct()` helper that fills
derived fields (`badges` from stock and `compareAtPrice`, `seo.title` from name
and brand) so those can never drift from the data they describe.

---

## 6. Structured data

`lib/seo/product-schema.ts` emits `Product` + `Offer` with only:

```
name · description · sku · mpn · brand · category · image · offers{
  price, priceCurrency, availability, url, itemCondition }
```

`availability` reads **the same predicate the page renders** (ECDOS 13 §22/§27,
README standing rule). No rating, no review, no fabricated fields. Utility
routes (cart, wishlist, compare, search) are `noindex, follow` and absent from
`sitemap.xml`.
