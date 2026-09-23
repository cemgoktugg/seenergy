# COMMERCE_RULES_ELECTRONICS.md

Extends `docs/design-os/07b-commerce-components.md`,
`07c-forms-filters-search-overlays.md` and `08-ux-bible.md`.

Where those modules give a lingerie example, the rule is kept and the example is
replaced. The substitution table is at the end.

---

## 1. Product card

Electronics cards carry more information than fashion cards and must still be
scannable. Anatomy, top to bottom:

```
┌──────────────────────────────┐
│ [badge]           [wishlist] │   ≤ 2 badges · 44px wishlist target
│                              │
│        product media         │   4:3 · contain · neutral bed · padded
│                              │
│                  [compare]   │   appears on hover/focus, persistent on touch
├──────────────────────────────┤
│ BRAND                        │   .text-caption, tertiary, uppercase-free
│ Product name over two lines  │   .text-product-title, max 2 lines
│ MVH-S320BT                   │   .text-mono, model — the technician's anchor
│ ● Bluetooth 5.0  ● 4×50 W    │   ≤ 3 key specs, never the whole table
│ 2.490 ₺   3.190 ₺   %22      │   current neutral · previous struck · promo
│ Stokta · Aynı gün kargo      │   stock + one shipping fact
│ [ Sepete ekle ]              │   full-width on the card
└──────────────────────────────┘
```

### Rules

- **Maximum three key specs.** `Bluetooth 5.3 · 60 W · 12 saat pil` — not the
  specification table (master brief §14).
- **Model is always shown.** It is the single field that distinguishes two
  otherwise identical listings, and it is what a professional searches for.
- **Maximum two badges** simultaneously (§15, ECDOS 07A §19). Priority:
  `out-of-stock > low-stock > discount > new > bestseller > free-shipping`.
- **Current price stays neutral** even when discounted (ECDOS 05 §16).
- **Card is not a Client Component.** It renders on the server; `WishlistButton`,
  `CompareButton` and `AddToCartButton` are the only islands (12 §54/§62).
- Hover crossfades to the second view where one exists, scale 1 → 1.015, 240ms,
  pointer devices only. Touch and keyboard get the same information without it
  (09 §66).
- Quick-add mounts **once** at the provider level, not once per card (07B §14).

### States

`standard · discounted · new · bestseller · free-shipping · same-day ·
low-stock · out-of-stock`

Out of stock: media desaturates slightly, an explicit "Tükendi" badge appears,
add-to-cart is replaced by a disabled control **with its reason stated**, and the
product page stays reachable (07B §3, 13 §74 — do not 404 a temporarily
unavailable product).

---

## 2. Price

One component, one formatter, one locale.

```
formatPrice(2490)  →  "2.490 ₺"
```

`Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY" })` places the
symbol first in CLDR data; this build renders it **last** — `2.490 ₺` — which is
07B §6's own Turkish example and the dominant convention in Turkish electronics
retail. The rule that matters is 07B §6's "use one format consistently", and
`formatPrice()` in `lib/format.ts` is the only source (README standing rule).

Discount percentage is **derived**, never authored:
`Math.round((compareAtPrice - price) / compareAtPrice * 100)`, rendered as
`%22 indirim` on the PDP and `%22` in the card chip. It cannot disagree with the
prices beside it.

Screen readers receive one coherent phrase, not three fragments (07B §6):
`"2.490 ₺, önceki fiyat 3.190 ₺, %22 indirim"`.

---

## 3. Stock and shipping

| State | Copy | Token | Signal beyond colour |
| --- | --- | --- | --- |
| In stock | `Stokta` | `--success` | Filled dot + word |
| Low stock | `Son 3 ürün` | `--warning` | The count itself |
| Out of stock | `Tükendi` | `--danger` | Word + disabled control + reason |

Shipping badges are operational facts from `data/site.ts`, not promises invented
per product: `Aynı gün kargo`, `Ücretsiz kargo`, `Kargo bedeli alıcıya ait`
(bulky). Every one is a configurable placeholder with a comment saying so, so no
component hard-codes a delivery claim (ECDOS 07D §24/§49).

**No countdown timers. No "N kişi bu ürüne bakıyor". No invented scarcity.**
(08 §93, 10 §84.)

---

## 4. Variant selection

Electronics variants, never clothing sizes:

```
Renk          Siyah · Beyaz · Gümüş
Kapasite      128 GB · 256 GB · 512 GB
Uzunluk       1 m · 3 m · 5 m · 10 m
Voltaj        12 V · 24 V
Konnektör     Type-C · Lightning · Micro USB
Paket Adedi   1 adet · 5 adet · 10 adet
Güç           30 W · 65 W · 100 W
```

### Rules (07B §32–§33, 15 §35)

- **Never auto-select.** State starts `null` for every option group.
- The add-to-cart label reads the missing group until it resolves —
  `Kapasite seçin`, not a disabled button with no explanation (07B §2.3/§13).
- An unavailable combination is **disabled, struck through and announced** —
  never selectable, never silently substituted (05 §33, 10 §45).
- Changing one option keeps the others when they remain valid; when a
  combination becomes impossible the interface **names it** rather than clearing
  silently: `256 GB kapasitede Beyaz renk şu anda mevcut değil.`
- A variant's own `price` and `stock` take effect immediately on resolution, so
  the panel price for a 5 m cable is the 5 m price.
- The resolved variant id reaches the cart; labels never do (15 §7 Stage 2).
- One state machine — `useVariantSelection` — serves the purchase panel and
  quick add (15 §35).

Products without variants resolve to `slug--default` so the cart line shape is
uniform.

---

## 5. Comparison

Electronics customers compare specifications; fashion customers do not. This is
the largest addition to ECDOS in this build.

### Rules

- **Same-category only.** A speaker and an NVR have no shared specification axis,
  so the compare button on a product from a different category than the current
  tray is disabled with the reason stated: `Yalnızca aynı kategorideki ürünler
  karşılaştırılabilir.`
- **Maximum four** products. The fifth attempt explains the limit.
- Tray is a bottom sheet on mobile, a floating bar on desktop. It shows each
  selection with a remove control naming the product, a clear-all, and the
  primary `Karşılaştır` action. It hides while the cart drawer, filter drawer or
  search overlay is open (07A §15 conflict rules).
- State lives in `localStorage` under a versioned key, hydration-safe.

### Comparison page

A real `<table>` with `<th scope="col">` product columns and `<th scope="row">`
attribute rows, so the relationship survives a screen reader (10 §47). Rows:

```
Media · Brand · Model · Price · Stock · Warranty · Shipping
then every specification label present in ANY selected product,
with "—" where a product does not declare it.
```

`Farklılıkları göster` filters to rows where the values differ — the actual
decision the customer is making. Below `md` the table scrolls horizontally
inside its own container with the attribute column pinned; the page body never
scrolls horizontally (09 §84).

---

## 6. Category-aware filters

A filter that cannot change the result set is noise. Each category declares its
own groups (`data/filters.ts`), each group names the `facets` key it reads.

**Global** — every category
```
Marka · Fiyat aralığı · Stok durumu · Kargo
```

**Ses Sistemleri** — `power · bluetooth · connection · speakerType · micType`
**Güvenlik & Kamera** — `resolution · connection · nightVision · placement · storage`
**Güç & Enerji** — `voltage · current · power · connector`
**Bilgisayar & Aksesuar** — `interface · capacity · speed · compatibility`
**LED & Aydınlatma** — `wattage · colorTemp · lumen · ipRating`
**Kablo & Bağlantı** — `length · connector · cableStandard · shielding`
**Oto Elektronik** — `power · connection · screenSize · vehicleFit`
**Uydu & TV** — `resolution · lnbType · connection · tuner`
**Ölçüm & Teknik** — `measureType · accuracy · display`

### Behaviour (07C §21–§33)

- Ordered by customer need, not database order.
- Desktop: sticky sidebar 264–288px, stops before the footer, key groups open.
- Mobile: full-screen drawer, multiple selections, **applies on the sticky
  action**, never closing after each tap. Primary action shows the count:
  `48 ürünü göster`.
- Every filter row is a ≥44px target and the whole `label` is the control.
- Selected filters appear as chips above the grid with a remove control that
  names the filter (`Magic Voice filtresini kaldır`) plus `Tümünü temizle`.
- State is in the URL query (`?marka=…&fiyat=…&siralama=…`), so results are
  shareable, back-navigable and restore on reload (07C §31).
- Option counts are shown and are real. Options that would return zero results
  given the other active filters are disabled rather than hidden, so the customer
  can see why.
- Empty result state names the active filters and offers to remove one.

### Sort

```
Önerilen · En yeniler · Fiyat: düşükten yükseğe · Fiyat: yüksekten düşüğe ·
Çok satanlar · İndirim oranı
```

Only options the data supports (07C §34). Native `<select>` on desktop, a
labelled radio list in a bottom sheet on mobile (09 §34).

### Grid continuity (08 §22)

Opening a product and coming back restores scroll, filters, sort **and the
loaded page count** — the loaded count lives in the query (`?goster=48`), so
there is a page for scroll restoration to restore to.

---

## 7. Product detail page

```
Breadcrumb

┌─────────────────────────────┬───────────────────────────┐
│                             │ MARKA                     │
│      Gallery                │ Ürün adı              H1  │
│      (contain, 4:3)         │ Model · SKU               │
│      counter, thumbnails    │                           │
│                             │ 2.490 ₺  3.190 ₺  %22     │
│                             │ Taksit bilgisi            │
│                             │                           │
│                             │ Öne çıkan özellikler ×5   │
│                             │ Varyant seçimi            │
│                             │ Adet                      │
│                             │ [ Sepete ekle ]           │
│                             │ [Favori] [Karşılaştır]    │
│                             │ Stok · Kargo · Garanti    │
└─────────────────────────────┴───────────────────────────┘

Ürün açıklaması        Teknik özellikler (grouped)
Kutu içeriği           Uyumluluk
Dokümanlar             Teslimat, iade ve garanti
İlgili ürünler         Benzer ürünler        Son gezdiklerin
```

Gallery 58–62%, panel 38–42%, panel max-width 480px (06 §28/§30, 09 §51).
The panel is sticky on `lg+` and stops before the supporting sections.

### Key specifications above the fold

Three to six, as compact rows with a small icon and a real label/value pair —
not a wall of coloured icons (master brief §21):

```
Çıkış gücü      4 × 50 W
Bluetooth       Sürüm 5.0
Bağlantı        USB · AUX · Bluetooth
Ekran           1.5" LCD
Garanti         24 ay
```

### Mobile order (09 §27)

Gallery → name → price → key specs → variants → CTA → stock/shipping/warranty →
specifications → compatibility → downloads → delivery → related.
Purchase-critical content precedes editorial content, always.

The sticky buy bar appears when the main CTA leaves the viewport, publishes
`--sticky-bar-height` so the toast rail can reserve it (07C §56), and hides
while any overlay or the on-screen keyboard is open (09 §31).

---

## 8. Specification presentation

Not an ugly HTML table (master brief §20). A grouped specification system:

```
GENEL
  Marka                Pioneer
  Model                MVH-S320BT
  Ürün tipi            Oto teyp

SES
  Çıkış gücü           4 × 50 W
  Ekolayzer            13 bant
  Ön çıkış             1 çift RCA

BAĞLANTI
  Bluetooth            5.0
  USB                  1 × ön panel
  AUX                  3.5 mm
```

Implemented as one `<table>` per group with a `<caption>` carrying the group
title. Desktop renders two aligned columns with hairline rows; below `md` the
same table restyles to stacked label/value pairs — same markup, so the semantic
relationship never depends on the viewport (10 §47, 09 §Mobile: technical tables
become stacked key/value rows).

Long groups collapse behind an accordion after the first two groups. The first
two groups are always open, because hiding purchase-critical information behind
a disclosure is exactly what 08 §42 forbids.

---

## 9. Compatibility

Its own PDP section, above the fold on mobile's second screen, because it is the
question that blocks purchase:

```
UYUMLULUK
  Desteklenen voltaj      12 V · 24 V
  Araç uyumluluğu         Standart 2-DIN yuvalı araçlar
  Konnektör tipi          ISO 10487
  Desteklenen format      MP3 · WMA · FLAC · WAV
```

Rendered by one reusable `CompatibilityInfo` component so the treatment is
identical whether the axis is vehicles, TV panels, operating systems or
connectors.

---

## 10. Cart

Line anatomy: media · brand · name · model · selected variant · quantity ·
unit price · line total · stock state · remove · move to wishlist.

- Removal is **reversible**: `removeFromCart` returns a restore function and the
  toast carries `Geri al` (08 §58, README standing rule).
- Removal styling is neutral, not `--danger` — it is not irreversible
  (07A §16).
- Quantity respects `variant.stock`; the maximum is explained when reached.
- Controls name their product: `Pioneer MVH-S320BT adedini artır`.
- Summary: `Ara toplam · İndirim · Kargo · Tahmini toplam`, tabular, total with
  the strongest hierarchy.
- Free-shipping progress uses the **real threshold** from `data/site.ts` and the
  actual subtotal, or is not shown.
- Checkout is a demo boundary and says so.

### After add-to-cart

Toast with `Sepeti gör`, not an automatic drawer. ECDOS 08 §75 ranks
inline → toast → drawer → modal and requires the least disruptive method capable
of communicating the result; 07B §21 permits either. A toast confirms the
addition, updates the count and offers the cart without taking the product page
away. The drawer stays one tap from the header and from the toast.

---

## 11. B2B surfaces

```
/toptan-satis        Wholesale: volume pricing, project quotes, dealer terms,
                     integration readiness, request form
/bayi-basvurusu      Dealer application: company details, sector, volume, message
/kurumsal            Corporate: tender, invoice, project supply, contact
```

Every form is a **frontend demo**. Each:

- validates on submit with field-specific Turkish errors, `aria-invalid` and
  `aria-describedby`
- preserves entered data after a failed submit (07C §63, 10 §37)
- prevents duplicate submission and preserves the button's dimensions
- shows a success state that **states plainly that no data was sent**
- never invents a response time or a dealer discount rate

A `Kurumsal teklif iste` entry also appears on the PDP for products where a
project purchase is plausible, prefilled with the model — which is the point of
having the model in the data.

---

## 12. Trust

Placed where the anxiety is (08 §81), not only in the footer:

| Surface | Statements |
| --- | --- |
| Product page | Faturalı ürün · Garanti · Kargo · İade · Teknik destek |
| Cart | Kargo · Ödeme · İade |
| Home | 5-item trust layer |
| Footer | Policy links |

All five PDP statements are configurable placeholders in `data/site.ts` with a
comment marking them as such. None asserts a certification, a guarantee
percentage or an award. `%100 memnuniyet garantisi` and equivalents do not appear
anywhere in the build (07D §24/§49).

---

## 13. ECDOS example substitutions

The rule is preserved; the fashion example is replaced.

| ECDOS reference | Original example | This build |
| --- | --- | --- |
| 07B §8/§9 | Standard and bra size selectors | `VariantSelector` over capacity, length, voltage, connector, colour, power, pack quantity |
| 07B §9 | Band + cup are one facet | Multi-axis variant combination must exist as a real variant before it resolves |
| 07B §10 | Beden rehberi trigger | `CompatibilityInfo` — the equivalent pre-purchase confidence tool |
| 07B §26 | Fit information (kalıp, destek, dolgu) | Key specifications + compatibility |
| 07C §22/§23 | Beden · Bant · Kup · Kalıp · Destek · Dolgu · Balen | Category-aware technical facets (§6 above) |
| 07D §26 | Lingerie hygiene return exclusion | Electronics return conditions: unopened packaging, accessory completeness, warranty-void seals |
| 07D §29 | Size confidence block | Compatibility confidence block |
| 07D §36/§50 | Adult-model and body-language rules | Not applicable; the sensitive-content rules are retained but have no surface here |
| 08 §35/§36/§98 | Bra size journey | Variant resolution journey (`COMMERCE_RULES` §4) |
| 08 §44–§50 | Size guide and calculator | Technical guides in `/blog` + `CompatibilityInfo` |
| 10 §43–§47 | Bra size accessibility | Variant group accessibility + semantic specification tables |
| 13 §34/§55/§65 | Lingerie content clusters | Electronics guide clusters (`CONTENT_GUIDE_ELECTRONICS.md` §6) |
| 06 §20 | Product ratio 3:4 / 4:5 | **Landscape** — 5:4 listing tile, 4:3 gallery. The product page contains and never crops; listing tiles fill (`BRAND_BIBLE_ELECTRONICS` §5) |
| 04 §5 | Serif display pairing | One family, Inter, numerics-first |
| 05 §6/§8 | Warm ivory / blush palette | Cool grey ramp + near-black chrome structure, SEENERGY gradient identity, indigo commerce (05 §8 assigns cool neutrals to electronics; see the supersession note in `BRAND_BIBLE_ELECTRONICS` §2) |
