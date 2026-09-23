# INFORMATION_ARCHITECTURE_ELECTRONICS.md

Extends `docs/design-os/06-layout-grid-system.md`,
`07a-component-foundations-navigation.md` and `13-seo-discoverability-bible.md`.

---

## 1. Category architecture

Fourteen top-level categories, each with real subcategories. Hierarchy, not a
flat wall of a hundred links (master brief §9, ECDOS 07A §11: 5–9 primary
navigation items, the rest reached through the mega menu).

```
Uydu & TV Sistemleri      uydu-tv-sistemleri
├── Uydu Alıcı            ├── 4K Uydu Alıcı      ├── LNB
├── Çanak Anten           ├── Merkezi Sistem     ├── TV LED Bar
├── TV Yedek Parça        └── Kumanda

Ses Sistemleri            ses-sistemleri
├── Hoparlör              ├── Bluetooth Hoparlör ├── Mikrofon
├── Amfi                  ├── Mikser             ├── Profesyonel Ses
└── Enstrüman Aksesuarları

Güvenlik & Kamera         guvenlik-kamera
├── IP Kamera             ├── Wi-Fi Kamera       ├── DVR / NVR
├── Kamera Seti           ├── Alarm Sistemleri   ├── Fotokapan
└── Kamera Aksesuarları

Bilgisayar & Aksesuar     bilgisayar-aksesuar
├── Network               ├── Depolama           ├── Adaptör & Şarj
├── Kablo & Çevirici      ├── Klavye & Mouse     └── Bilgisayar Bileşenleri

Telefon & Mobil Aksesuar  telefon-mobil-aksesuar
├── Şarj Cihazı           ├── Powerbank          ├── Kulaklık
├── Telefon Kablosu       └── Tutucu & Stand

Oto Elektronik            oto-elektronik
├── Oto Teyp              ├── Oto Multimedya     ├── Oto Hoparlör
├── Oto Amfi              ├── Araç Kamerası      └── Oto Aksesuar

LED & Aydınlatma          led-aydinlatma
├── LED Şerit             ├── LED Panel          ├── Projektör
├── Ampul                 ├── LED Sürücü         └── Aydınlatma Aksesuarı

Elektronik Malzemeler     elektronik-malzemeler
├── Direnç & Kondansatör  ├── Entegre & Transistör
├── Röle & Switch         ├── Konnektör          ├── Devre Kartı
└── Lehim Malzemeleri

Güç & Enerji              guc-enerji
├── Güç Kaynağı           ├── Adaptör            ├── Kesintisiz Güç Kaynağı
├── Batarya & Pil         ├── İnvertör           └── Solar

Ölçüm & Teknik Cihazlar   olcum-teknik-cihazlar
├── Multimetre            ├── Osiloskop          ├── Kablo Test Cihazı
├── Termal Kamera         └── Ölçüm Aksesuarları

Kablo & Bağlantı          kablo-baglanti
├── Anten Kablosu         ├── Network Kablosu    ├── HDMI Kablosu
├── Ses Kablosu           ├── Enerji Kablosu     └── Konnektör & Jak

Ev Teknolojileri          ev-teknolojileri
├── Akıllı Ev             ├── Küçük Ev Aleti     ├── Klima & Isıtıcı
└── Temizlik Teknolojisi

Hobi & Teknik Ürünler     hobi-teknik-urunler
├── Arduino & Raspberry   ├── Drone & RC         ├── 3D Yazıcı
└── Maker Setleri

Aletler & Sarf            aletler-sarf
├── El Aleti              ├── Havya & İstasyon   ├── Kesici & Sıyırıcı
└── Sarf Malzeme
```

Category slugs are lowercase, hyphenated, ASCII-folded Turkish (ECDOS 13 §5):
`Güvenlik & Kamera → guvenlik-kamera`.

---

## 2. Routes

```
/                            Homepage
/kategori/[slug]             Category and subcategory PLP (one shell)
/urun/[slug]                 Product detail
/markalar                    Brand index
/marka/[slug]                Brand page
/arama                       Search results
/yeni-urunler                New products
/cok-satanlar                Best sellers
/kampanyalar                 Campaigns / deals
/karsilastir                 Comparison            noindex
/favoriler                   Wishlist              noindex
/sepet                       Cart                  noindex
/toptan-satis                Wholesale
/bayi-basvurusu              Dealer application
/kurumsal                    Corporate
/hakkimizda                  About
/iletisim                    Contact
/blog                        Technical guides index
/blog/[slug]                 Guide
not-found.tsx                404
robots.ts · sitemap.ts
```

`/kategori/[slug]` resolves both levels. A subcategory is a category whose
`parent` is set; the shell reads the resolved node and its descendants, so
`/kategori/ses-sistemleri` and `/kategori/bluetooth-hoparlor` share one
implementation and one filter engine.

`/yeni-urunler`, `/cok-satanlar` and `/kampanyalar` are the same catalogue shell
over a different product predicate — not three copies.

### Canonicals and indexing (ECDOS 13 §15–§20)

- A canonical **never carries parameters**. `/kategori/ses-sistemleri?marka=magicvoice&siralama=fiyat-artan`
  canonicalises to `/kategori/ses-sistemleri`.
- Cart, wishlist, compare and search are `noindex, follow` and absent from the
  sitemap.
- Filter combinations are UX state, not landing pages (§40–§42). Dedicated facet
  routes are a merchandising decision that mock data cannot justify, so none are
  invented; `lib/catalog.ts` already resolves a facet to a product set, so
  adding one later is a page file.

---

## 3. Header

Three bands, aligned to the page container.

### Utility bar (desktop ≥ lg only, 32px)
`Toptan Satış · Bayi Ol · Sipariş Takibi · Yardım` — plus the shipping cut-off
statement. Quiet: `--text-tertiary`, 12px, no fills. Never visually dominant.

### Main header (72–80px desktop, 60px mobile)
```
LOGO        [ ——— large search field ——— ]        Hesabım  Favoriler  Sepet
```
The search field is the widest element in the header at every size ≥ md, because
an electronics catalogue is searched more than it is browsed. Below md the field
collapses to an icon that opens the full-screen overlay, and the header becomes
`Menü · Logo · Ara · Sepet` (ECDOS 09 §18 — one structure, used consistently).

### Primary navigation (48px, desktop)
```
Tüm Kategoriler ▾   Uydu & TV   Ses   Güvenlik   Bilgisayar   Oto   Aydınlatma
                                  Yeni Ürünler   Çok Satanlar   Markalar
                                  Kampanyalar   Toptan Satış
```
"Tüm Kategoriler" opens the full fourteen-category panel. Six high-value
categories sit inline. Commercial and B2B links are right-aligned so the
category set reads as one group.

**Scroll behaviour.** The header compresses by 12px and the utility bar hides.
`--header-height` and `--header-offset` are separate tokens and every sticky
offset in the storefront is pinned to the *compressed* value, so nothing beneath
the customer moves while the header animates (ECDOS 11 §36; the same resolution
the previous build recorded).

---

## 4. Mega menu

Opens on hover after **140ms** and immediately on keyboard focus (ECDOS 07A §11:
100–180ms; dropdowns must never open by accident). Escape closes and returns
focus. Click on a top-level item navigates to that category, because every
top-level item is a real destination and everything in the panel is reachable
from the page it leads to.

Layout — navigation groups ~68%, editorial ~32% (06 §37):

```
┌───────────────────────────────────────────────┬──────────────────┐
│ TV & UYDU        SES           GÜVENLİK       │  [Category art]  │
│ Uydu Alıcı       Hoparlör      IP Kamera      │                  │
│ 4K Uydu Alıcı    Mikrofon      Wi-Fi Kamera   │  Profesyonel Ses │
│ LNB              Amfi          DVR / NVR      │  Sahne, stüdyo   │
│ TV LED Bar       Mikser        Kamera Seti    │  ve toplantı …   │
│ Kumanda          Bluetooth     Alarm          │  Kategoriyi keşfet→│
├───────────────────────────────────────────────┴──────────────────┤
│ Tüm kategorileri görüntüle →          Toptan satış ve bayilik →   │
└──────────────────────────────────────────────────────────────────┘
```

Group titles are `.text-eyebrow`. Three to five groups, never a wall of text.
The panel height is content-driven and stays inside 360–560px (07A §12).

Below `lg` the mega menu is not reused: mobile gets a **drill-down drawer**
(07A §13, 09 §19) with a persistent back action and a maximum of three levels.

---

## 5. Search

The highest-priority interactive system in the build.

### What it matches

Product name · brand · model · SKU · category · subcategory · key specs ·
compatibility values · synonyms.

Query normalisation folds Turkish characters and case in both directions, so
`sutyen`-style near-misses work here as `uydu alici` → `Uydu Alıcı`,
`sarj` → `şarj`, `guc kaynagi` → `Güç Kaynağı`. A synonym map in
`data/search.ts` bridges customer vocabulary to catalogue vocabulary:

```
teyp ↔ oto teyp, araç radyosu      adaptör ↔ güç adaptörü, trafo
kamera ↔ güvenlik kamerası          çanak ↔ çanak anten, offset anten
lan ↔ ethernet, network             ups ↔ kesintisiz güç kaynağı
hoparlör ↔ speaker                  şerit led ↔ led şerit
```

Exact SKU and model matches are ranked above every other signal, so `PM-27447`
returns one product first.

### Overlay structure (ECDOS 07C §38)

```
[ input, focused on open, Escape closes, focus returns ]

Son aramalar          ← localStorage, individually removable, clear-all
Önerilen aramalar     ← curated, honest (not "trending" — no analytics exists)
Kategoriler           ← matched category rows
Markalar              ← matched brand rows
Ürünler               ← up to 6: art, brand, name, model, price, stock
[ "…" için tüm sonuçları görüntüle → ]
```

Groups are labelled and never merged into one undifferentiated list (07C §39).
Arrow keys walk results, Enter opens the active one, Escape closes. The active
descendant is announced through a polite live region — count only, not every
keystroke (10 §54).

**No debounce.** Search is a synchronous `useMemo` over a local catalogue with no
request to cancel; a 150–300ms delay would add latency and nothing else
(07C recorded decision). The full §73 set — debounce, cancellation, ordering
protection, minimum length — becomes mandatory the moment a remote index backs
this.

---

## 6. Homepage sequence

Commercial and editorial sections alternate (ECDOS 08 §11) so the page never
becomes four product grids in a row.

```
 1  Announcement bar          rotating, pausable, 3 operational messages
 2  Header
 3  Hero                      one dominant campaign, one primary CTA — LCP
 4  Category discovery        8 visual category cards
 5  Haftanın Fırsatları       6 markdowns, real old/new price, no countdown
 6  Yeni Ürünler              rail
 7  Editorial banner          Profesyonel Ses — dark section
 8  Çok Satanlar              tabbed: Tümü · Ses · Oto · Güvenlik · Bilgisayar
 9  Profesyoneller İçin       5 solution cards — the B2B differentiator
10  Popüler Markalar          brand rail
11  Trust layer               5 configurable operational statements
12  B2B CTA                   Toptan Satış + Bayi Başvurusu
13  Teknik Rehber             5 article cards
14  Son Gezdiklerin           localStorage, absent when empty
15  Newsletter                restrained
16  Footer                    5 groups, accordion below sm
```

Sections 3 and 4 answer "who is this"; 5–8 answer "what can I buy"; 9 and 12
answer "do you serve professionals"; 11 and 13 answer "can I trust this".

**LCP per template** (ECDOS 12 §96):

| Route | LCP element |
| --- | --- |
| `/` | Hero media panel + headline |
| `/kategori/[slug]` | Category H1 / first product row |
| `/urun/[slug]` | Primary product media |
| `/arama` | Result heading |
| `/blog/[slug]` | Article H1 |

---

## 7. Footer

Five groups, accordion below `sm` and open above it, implemented as
`details`/`summary` so the groups are open in the no-JS HTML
(ECDOS 07D §46 and the README standing rule).

```
Alışveriş        Kurumsal          Yardım            Kategoriler       Marka
Yeni Ürünler     Toptan Satış      Sipariş Takibi    Uydu & TV         Hakkımızda
Çok Satanlar     Bayi Başvurusu    Kargo & Teslimat  Ses Sistemleri    İletişim
Kampanyalar      Kurumsal Teklif   İade & Değişim    Güvenlik          Teknik Rehber
Markalar         Proje Çözümleri   Garanti           Bilgisayar        Mağazalar
Tüm Kategoriler                    Sıkça Sorulanlar  Oto Elektronik
```

Legal row: KVKK, gizlilik, mesafeli satış, çerez. Social links are **absent**
rather than pointing at `#` — VOLTA is an original brand with no accounts, and
four focusable anchors that navigate nowhere are exactly what 07D §28/§46 rules
out. The `socialLinks` shape stays in `data/site.ts` with a note so real handles
rewire in one change.

---

## 8. Mobile bottom navigation

**Not built.** ECDOS 07A §15 permits it only when repeated access justifies
permanent screen space, and §Conflict Rules forbids showing it with a sticky
purchase action or a full-screen drawer. This storefront has a sticky PDP buy
bar, a full-screen filter drawer, a full-screen search overlay and a compare
tray — four surfaces that would each need to negotiate with a fifth permanent
bar at the bottom of a phone. The header keeps search and cart within thumb
reach at 60px, and the mobile menu covers categories. Adding the bar would cost
44px of every screen to duplicate two controls that are already reachable.

Recorded as a decision, not an omission.
