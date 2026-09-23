import type { BlockGroup } from "./vitrin"

/**
 * What each part of the homepage is, in the words of the person editing it.
 *
 * The block editor renders its form from these definitions, so adding a field
 * to a banner is one line here — not a new screen. `where` is shown above the
 * form: people edit confidently when they know which part of the site moves.
 */

export type FieldType = "text" | "textarea" | "image" | "link" | "tags" | "stats" | "icon" | "brand" | "products"

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  hint?: string
  required?: boolean
  placeholder?: string
}

export interface GroupDef {
  title: string
  where: string
  /** Repeatable groups can add, remove, reorder and hide items. */
  repeatable: boolean
  /** How one item is called in buttons ("Slayt ekle"). */
  itemName: string
  /** Heading for each item, from its data. */
  itemTitle: (data: Record<string, any>, index: number, key: string | null) => string
  fields: FieldDef[]
  newItem?: () => Record<string, unknown>
}

const link: FieldDef = {
  name: "href",
  label: "Bağlantı",
  type: "link",
  hint: "Tıklanınca açılacak sayfa. Örn. /kategori/uydu-sistemleri veya /marka/orbisat",
  required: true,
}

const SLOT_NAMES: Record<string, string> = {
  "hero-side-1": "Sağ üst kart",
  "hero-side-2": "Sağ alt kart",
  wide: "Geniş banner (ürün raflarının altında)",
  "dual-1": "Çift banner — sol (koyu bölüm)",
  "dual-2": "Çift banner — sağ (koyu bölüm)",
  "super-firsat-promo": "Süper Fırsat kartı (mor kart)",
}

export const slotName = (key: string | null) => (key ? SLOT_NAMES[key] ?? key : "")

export const GROUPS: Record<BlockGroup, GroupDef> = {
  announcement: {
    title: "Duyuru çubuğu",
    where: "Sitenin en üstündeki ince koyu şerit. Her sayfada görünür.",
    repeatable: false,
    itemName: "duyuru",
    itemTitle: () => "Duyuru metni",
    fields: [
      {
        name: "text",
        label: "Metin",
        type: "text",
        required: true,
        hint: "Kısa tutun; büyük harfle yazılır. Örn. 1000 TL ÜZERİ ÜCRETSİZ KARGO",
      },
    ],
  },
  "hero-slide": {
    title: "Ana slayt",
    where: "Ana sayfanın en üstündeki büyük, kayan görsel alanı (sol taraf).",
    repeatable: true,
    itemName: "slayt",
    itemTitle: (d, i) => `${i + 1}. slayt — ${d.title || "başlıksız"}`,
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text", placeholder: "Akıllı ev ve güvenlik" },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "description", label: "Açıklama", type: "textarea" },
      { name: "chips", label: "Öne çıkan maddeler", type: "tags", hint: "En fazla 3 kısa madde." },
      { name: "cta", label: "Buton yazısı", type: "text", required: true, placeholder: "Alışverişe Başla" },
      link,
      { name: "image", label: "Görsel", type: "image", required: true, hint: "Yatay görsel, en az 1600×900 px." },
    ],
    newItem: () => ({
      eyebrow: "",
      title: "Yeni slayt",
      description: "",
      chips: [],
      cta: "Alışverişe Başla",
      href: "/",
      image: "",
    }),
  },
  "hero-side": {
    title: "Slayt yanı kartlar",
    where: "Ana slaytın sağındaki iki kampanya kartı.",
    repeatable: false,
    itemName: "kart",
    itemTitle: (_d, _i, key) => slotName(key),
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text" },
      { name: "title", label: "Başlık", type: "text", required: true },
      link,
      { name: "image", label: "Arka plan görseli", type: "image", required: true },
    ],
  },
  banner: {
    title: "Bannerlar",
    where: "Ana sayfa boyunca yer alan kampanya görselleri.",
    repeatable: false,
    itemName: "banner",
    itemTitle: (_d, _i, key) => slotName(key),
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text" },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "subtitle", label: "Alt başlık", type: "text" },
      link,
      { name: "image", label: "Görsel", type: "image", required: true },
    ],
  },
  "brand-band": {
    title: "Marka vitrinleri",
    where:
      "Ana sayfada alt alta dizilen marka bölümleri (logo + 4 ürün). İlk dördünden sonra 'Neden SEENERGY' bandı gelir.",
    repeatable: true,
    itemName: "marka vitrini",
    itemTitle: (d, i) => `${i + 1}. ${d.brand_handle || "marka seçilmedi"}`,
    fields: [
      { name: "brand_handle", label: "Marka", type: "brand", required: true },
      { name: "tagline", label: "Kısa açıklama", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", required: true },
      {
        name: "product_ids",
        label: "Gösterilecek ürünler",
        type: "products",
        hint: "Boş bırakırsanız markanın ilk 4 ürünü otomatik gösterilir.",
      },
    ],
    newItem: () => ({ brand_handle: "", tagline: "", logo: "", product_ids: [] }),
  },
  "tech-band": {
    title: "Neden SEENERGY bandı",
    where: "Marka vitrinlerinin arasındaki koyu, tam genişlik bölüm ve rakamlar.",
    repeatable: false,
    itemName: "bant",
    itemTitle: () => "Bant içeriği",
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text" },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "description", label: "Açıklama", type: "textarea" },
      { name: "stats", label: "Rakamlar", type: "stats", hint: "Örn. 12.000+ / Katalogdaki ürün çeşidi" },
      { name: "cta_label", label: "Buton yazısı", type: "text" },
      { name: "cta_href", label: "Buton bağlantısı", type: "link" },
    ],
  },
  trust: {
    title: "Güven satırı",
    where: "Ana sayfanın en altındaki dört kutu (ücretsiz kargo, iade…).",
    repeatable: true,
    itemName: "kutu",
    itemTitle: (d, i) => `${i + 1}. ${d.title || "başlıksız"}`,
    fields: [
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "subtitle", label: "Alt yazı", type: "text" },
      { name: "icon", label: "Simge", type: "icon", required: true },
    ],
    newItem: () => ({ title: "", subtitle: "", icon: "badge" }),
  },
}

export const TRUST_ICONS: { value: string; label: string }[] = [
  { value: "truck", label: "Kargo aracı" },
  { value: "badge", label: "Rozet" },
  { value: "lock", label: "Kilit" },
  { value: "refresh", label: "İade oku" },
  { value: "support", label: "Destek" },
]

/** Lists: where each one appears on the site. */
export const LIST_PLACES: Record<string, string> = {
  haftanin: "Üstteki 'Haftanın Ürünleri' rafı (ilk 8) ve alttaki sekmeli bölüm (ilk 12).",
  yeni: "'Yeni Gelenler' rafı (ilk 8) ve sekmeli bölümdeki 'Yeni Ürünler' (ilk 12).",
  "cok-satan": "Sekmeli bölümdeki 'Çok Satanlar' (ilk 12).",
  "super-firsat": "Mor 'Süper Fırsat' kartının yanındaki 4 ürün.",
}

export const LIST_LIMITS: Record<string, number> = {
  haftanin: 12,
  yeni: 12,
  "cok-satan": 12,
  "super-firsat": 4,
}
