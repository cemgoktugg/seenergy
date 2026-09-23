# CONTENT_GUIDE_ELECTRONICS.md

Extends `docs/design-os/07d-editorial-content-trust.md` Part XII and
`13-seo-discoverability-bible.md` Parts XIV–XV.

All customer-facing copy is Turkish.

---

## 1. Tone

Short · exact · confident · technically literate · never shouting.

The reader may be a consumer who wants a speaker or a technician who needs a
specific part. Copy that patronises the first or under-informs the second fails
both. The resolution is **layering**: a plain sentence first, the exact figures
immediately after.

```
Bluetooth 5.0 ile kablosuz bağlanır.
Çıkış gücü 4 × 50 W, ön çıkış 1 çift RCA.
```

Not:

```
Muhteşem ses deneyimi için tasarlanmış efsane ürün!
```

---

## 2. Numbers and units

A specification is a fact and is written as one, with its unit, unrounded.

| Correct | Wrong |
| --- | --- |
| `4 × 50 W` | `200W`, `4x50w` |
| `12 V / 2 A` | `12v 2a` |
| `Bluetooth 5.3` | `BT5.3`, `Bluetooth v5.3` |
| `4K UHD (3840 × 2160)` | `4K!!` |
| `Cat 6 U/UTP` | `cat6` |
| `IP66` | `ıp66` |
| `2.500 ₺` | `2500 TL`, `₺2500` |
| `24 ay garanti` | `2 yıl garanti` (inconsistent with the data field) |

Thin space before the unit, `×` for multiplication (not `x`), `·` as the inline
separator between spec fragments. Prices always through `formatPrice()`.

Model numbers and SKUs are never lowercased, never broken across lines, and are
rendered in `.text-mono` so `MVH-S320BT` and `PM-27447` cannot be misread.

---

## 3. Terminology — one word per concept

ECDOS 13 §61 requires entity consistency. Electronics vocabulary drifts badly
in Turkish, so the canonical customer-facing term is fixed here and used
everywhere: navigation, filters, specs, search synonyms, guides and metadata.

| Canonical | Also accepted in search, never in UI |
| --- | --- |
| Uydu Alıcı | receiver, dijital alıcı, dijitürk cihazı |
| Çanak Anten | offset anten, çanak |
| LNB | lnb head, feed |
| Merkezi Sistem | multiswitch, santral |
| Hoparlör | speaker, kolon |
| Amfi | anfi, amplifikatör |
| Mikser | mixer, mikser masası |
| IP Kamera | ağ kamerası, network kamera |
| DVR / NVR | kayıt cihazı, recorder |
| Fotokapan | trail camera, av kamerası |
| Adaptör | trafo, güç adaptörü, şarj adaptörü |
| Güç Kaynağı | power supply, smps |
| Kesintisiz Güç Kaynağı | UPS |
| İnvertör | inverter, dönüştürücü |
| Oto Teyp | araç radyosu, teyp |
| Oto Multimedya | android teyp, multimedya oynatıcı |
| LED Şerit | şerit led, bant led |
| LED Sürücü | led trafo, driver |
| Multimetre | ölçü aleti, avometre |
| Anten Kablosu | koaksiyel kablo, rg6 |
| Network Kablosu | ethernet kablosu, lan kablosu, cat kablo |
| Powerbank | taşınabilir şarj cihazı |

`data/search.ts` encodes the right-hand column as synonyms so customers can use
their own words while the interface keeps one vocabulary.

Both `sürüm` and `versiyon` appear in the sector; this build uses **`sürüm`**
everywhere. `Adet` is the unit of quantity, never `parça`.

---

## 4. Claims policy

**Permitted** — because they are operational facts held in `data/site.ts` and
marked as configurable placeholders:

```
16:00'a kadar verilen siparişler aynı gün kargoya verilir.
2.500 ₺ ve üzeri siparişlerde kargo ücretsiz.
14 gün içinde iade.
Tüm ürünler faturalıdır.
24 ay üretici garantisi.
Teknik destek: hafta içi 09:00–18:00
```

**Forbidden** anywhere in the build:

```
%100 memnuniyet garantisi
Türkiye'nin en ucuzu
Dünyanın en kaliteli ürünleri
Son 3 ürün! Acele et!
Bu ürüne 47 kişi bakıyor
Kampanya 02:14:33 içinde bitiyor
Orijinallik sertifikalı            ← no certificate exists
En hızlı kargo                     ← unmeasurable superlative
```

**No reviews, no ratings, no testimonials, no awards, no certifications** exist
in this build. Not in the data, not in the UI, not in structured data
(ECDOS 07D §30/§35/§55, 13 §29/§82). `%100` never appears as a marketing figure.

Where a fact is genuinely unknown, the interface says so rather than filling the
gap: a document with no file reads `Yakında` and is not a link; a product with
no declared warranty omits the row rather than assuming 24 months.

---

## 5. Microcopy

### Actions — name the destination or the outcome (07A §16/§18, 10 §85)

```
✓ Sepete ekle              ✗ Satın al
✓ Kategoriyi keşfet        ✗ Devamı
✓ Tüm sonuçları görüntüle  ✗ Daha fazla
✓ Teknik özellikleri gör   ✗ Detay
✓ Toptan satış koşulları   ✗ Tıklayın
✓ 48 ürünü göster          ✗ Uygula
✓ Magic Voice filtresini kaldır   ✗ ×
```

### State

```
Stokta · Son 3 ürün · Tükendi
Kapasite seçin                      ← CTA before a variant resolves
Sepete ekleniyor… · Sepete eklendi
256 GB kapasitede Beyaz renk şu anda mevcut değil.
```

### Errors — specific, actionable, attached (07C §9)

```
✓ Geçerli bir e-posta adresi girin.
✓ Telefon numarasını başında 0 olmadan 10 hane girin.
✓ Firma adı boş bırakılamaz.
✗ Hata oluştu.  ✗ Geçersiz.  ✗ Bir sorun oluştu.
```

### Empty states — calm, non-judgemental, one clear next step (07D §39)

```
Sepetiniz boş.
Kategorilerden başlayabilir veya arama yapabilirsiniz.
[ Tüm kategoriler ]

Favori listeniz boş.
Beğendiğiniz ürünleri kalp simgesiyle kaydedin.

"cat9 kablo" için sonuç bulunamadı.
Daha kısa bir ifade deneyebilir veya kategorileri inceleyebilirsiniz.

Karşılaştırma listesi boş.
Aynı kategoriden en fazla 4 ürünü karşılaştırabilirsiniz.
```

### Placeholders show the format, never repeat the label (07C §7)

```
ornek@firma.com          5XX XXX XX XX          Firma unvanı
Ürün, marka veya model ara
```

---

## 6. Guide content

Technical guides serve UX, SEO and GEO simultaneously (ECDOS 13 §60: answer the
question in the first paragraph, then explain).

### Structure

```
H1  — the question, verbatim
Lead — the direct answer in 1–2 sentences
H2  — explanation
H2  — how to choose / practical steps
H2  — common mistakes
     Related category and product links
```

### Clusters shipped

```
Güç
├── 12 V adaptör nasıl seçilir?
├── 12 V ve 24 V sistemler arasındaki fark nedir?
└── Kesintisiz güç kaynağı (UPS) nasıl seçilir?

Ses
├── Hoparlör watt değeri ne anlama gelir?
└── Bluetooth 5.0 ve 5.3 arasındaki fark nedir?

Güvenlik
├── IP kamera ile Wi-Fi kamera arasındaki fark nedir?
└── NVR ve DVR arasındaki fark nedir?

Uydu & TV
├── Uydu alıcı seçerken nelere dikkat edilmeli?
└── LNB çeşitleri nelerdir?

Aydınlatma
├── Lümen nedir, kaç lümen yeterlidir?
└── Kelvin renk sıcaklığı ne anlama gelir?

Kablo
└── Cat 5e, Cat 6 ve Cat 6a kabloları arasındaki fark nedir?
```

Each guide links to the categories and products it discusses, and each relevant
category links back (13 §46/§47). No guide is written to hold keywords; every
one answers a question a customer actually asks before buying.

---

## 7. Metadata patterns

```
Home        VOLTA | Elektronik, Teknoloji ve Profesyonel Ekipman
Category    {Kategori} Modelleri ve Fiyatları | VOLTA
Subcategory {Alt kategori} | {Kategori} | VOLTA
Product     {Marka} {Ürün adı} {Model} | VOLTA
Brand       {Marka} Ürünleri | VOLTA
Guide       {Başlık} | VOLTA Teknik Rehber
```

Descriptions are written for a human deciding whether to click, 120–158
characters, and never keyword-stuffed (13 §13). No page may output
`undefined | VOLTA`: `lib/seo/metadata.ts` enforces a
product → category → site fallback chain (13 §14).

---

## 8. Alt text

Describes the actual image and its view (10 §25/§27, 13 §49):

```
✓ Pioneer MVH-S320BT oto teyp, önden görünüm
✓ Magic Voice MV-2100 mikser, üstten kontrol paneli görünümü
✗ ürün resmi   ✗ oto teyp   ✗ image1
```

Decorative art carries `alt=""` and `aria-hidden`. Generated product art is
decorative *only* when the product name is already the accessible name of the
link that contains it; otherwise it carries the descriptive alt.
