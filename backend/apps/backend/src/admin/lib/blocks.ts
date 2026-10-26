import type { BlockGroup } from "./vitrin"

/**
 * What each part of the homepage is, in the words of the person editing it.
 *
 * The block editor renders its form from these definitions, so adding a field
 * to a banner is one line here — not a new screen. `where` is shown above the
 * form: people edit confidently when they know which part of the site moves.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "link"
  | "tags"
  | "stats"
  | "icon"
  | "brand"
  | "products"
  | "choice"

export interface FieldDef {
  name: string
  label: string
  type: FieldType
  hint?: string
  required?: boolean
  placeholder?: string
  /** For "choice": the options, first one is the default. */
  options?: { value: string; label: string }[]
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

/* The campaign-card fields shared by the hero tiles and the banners. */
const tone: FieldDef = {
  name: "tone",
  label: "Renk tonu",
  type: "choice",
  options: [
    { value: "koyu", label: "Koyu" },
    // Keys from the earlier palette, kept so saved cards keep their tone.
    { value: "mor", label: "Grafit" },
    { value: "turkuaz", label: "Gümüş" },
    { value: "acik", label: "Açık" },
  ],
  hint: "Kartın zemin rengi. Yan yana duran kartlara farklı tonlar vermek sayfayı canlandırır.",
}

const productImage: FieldDef = {
  name: "product_image",
  label: "Ürün görseli",
  type: "image",
  hint: "Kartın sağında beyaz bir zemin üzerinde gösterilir. Şeffaf veya beyaz arka planlı ürün fotoğrafı en iyi sonucu verir.",
}

const backgroundPhoto: FieldDef = {
  name: "image",
  label: "Arka plan fotoğrafı (isteğe bağlı)",
  type: "image",
  hint: "Yalnızca gerçek bir kampanya fotoğrafınız varsa. Doldurulursa kartın tamamını kaplar ve ürün görseli gösterilmez.",
}

const SLOT_NAMES: Record<string, string> = {
  "hero-side-1": "Sağ üst kart",
  "hero-side-2": "Sağ alt kart",
  wide: "Marka panosu başlığı (dört marka karesinin üstündeki şerit)",
  "dual-1": "Markalarımız — sol kart: Tescilli markalarımız (SEENERGY logosu sabit)",
  "dual-2": "Markalarımız — sağ kart: Yetkili satıcılık (logolar Marka panosundan gelir)",
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
      { name: "image", label: "Görsel", type: "image", required: true },
      {
        name: "fit",
        label: "Görsel yerleşimi",
        type: "choice",
        options: [
          { value: "contain", label: "Ürün görseli — tamamı görünsün (önerilen)" },
          { value: "cover", label: "Fotoğraf — alanı kaplasın" },
        ],
        hint: "Ürün fotoğrafı veya logo için 'tamamı görünsün'. Kenarları kırpılabilecek geniş bir kampanya fotoğrafı için 'alanı kaplasın'.",
      },
    ],
    newItem: () => ({
      eyebrow: "",
      title: "Yeni slayt",
      description: "",
      chips: [],
      cta: "Alışverişe Başla",
      href: "/",
      image: "",
      fit: "contain",
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
      tone,
      productImage,
      backgroundPhoto,
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
      tone,
      productImage,
      backgroundPhoto,
    ],
  },
  company: {
    title: "Şirket bilgileri",
    where:
      "Sitenin her yerinde kullanılan iletişim ve şirket bilgileri: alt bilgi, İletişim sayfası, sözleşmeler (Mesafeli Satış, Ön Bilgilendirme, KVKK), sipariş onayındaki havale bilgileri. Boş bırakılan alan sitede gösterilmez.",
    repeatable: false,
    itemName: "şirket bilgisi",
    itemTitle: () => "Şirket bilgileri",
    fields: [
      { name: "legal_name", label: "Şirket unvanı", type: "text", required: true, placeholder: "SEENERGY Güvenlik Teknolojileri A.Ş.", hint: "Sözleşmelerde satıcı olarak yazılır." },
      { name: "phone", label: "Telefon", type: "text", placeholder: "0850 000 00 00" },
      { name: "whatsapp", label: "WhatsApp hattı", type: "text", placeholder: "0532 000 00 00", hint: "Doldurulursa iletişim sayfasında ve ürün sayfalarındaki teklif kutusunda WhatsApp düğmesi çıkar." },
      { name: "email", label: "E-posta", type: "text", placeholder: "info@ornek.com.tr" },
      { name: "address", label: "Adres", type: "textarea" },
      { name: "hours", label: "Çalışma saatleri", type: "text", placeholder: "Hafta içi 09:00 – 18:00, Cumartesi 09:00 – 14:00" },
      { name: "map_url", label: "Harita bağlantısı", type: "text", hint: "Google Haritalar'daki 'Paylaş' bağlantısı. İletişim sayfasında 'Yol tarifi al' düğmesi olur." },
      { name: "mersis", label: "MERSİS numarası", type: "text" },
      { name: "tax_office", label: "Vergi dairesi", type: "text" },
      { name: "tax_number", label: "Vergi numarası", type: "text" },
      { name: "kep", label: "KEP adresi", type: "text" },
      { name: "bank_name", label: "Banka adı (havale / EFT)", type: "text", hint: "Havale / EFT ile verilen siparişlerin onay sayfasında gösterilir." },
      { name: "bank_holder", label: "Hesap sahibi", type: "text" },
      { name: "iban", label: "IBAN", type: "text", placeholder: "TR00 0000 0000 0000 0000 0000 00", hint: "Gerçek IBAN girilene kadar müşteriye 'banka bilgileri ayrıca iletilecek' denir; yanlış bir hesaba ödeme yapılmaz." },
    ],
  },
  "brand-board": {
    title: "Marka panosu",
    where:
      "Ana slaytın hemen altındaki dört kare. Her karede bir markanın logosu durur; üzerine gelince o markanın modelleri listelenir. Buradaki sırayla ilk dört marka gösterilir.",
    repeatable: true,
    itemName: "marka",
    itemTitle: (d, i) => `${i + 1}. ${d.brand_handle || "marka seçilmedi"}`,
    fields: [
      {
        name: "brand_handle",
        label: "Marka",
        type: "brand",
        required: true,
        hint: "Karenin üzerine gelince bu markanın ürünleri listelenir. Ürünlerin markasını Ürün Yönetimi'nden seçersiniz.",
      },
      {
        name: "logo",
        label: "Logo",
        type: "image",
        required: true,
        hint: "Şeffaf (PNG/WebP) veya beyaz arka planlı logo. Karenin ortasında gösterilir.",
      },
    ],
    newItem: () => ({ brand_handle: "", logo: "" }),
  },
  "brand-band": {
    title: "Marka vitrinleri",
    where:
      "Ana sayfada alt alta dizilen marka bölümleri (marka bannerı veya logo + 4 ürün), buradaki sırayla. İlk dördünden sonra 'Neden SEENERGY' bandı gelir.",
    repeatable: true,
    itemName: "marka vitrini",
    itemTitle: (d, i) => `${i + 1}. ${d.brand_handle || "marka seçilmedi"}`,
    fields: [
      { name: "brand_handle", label: "Marka", type: "brand", required: true },
      { name: "tagline", label: "Kısa açıklama", type: "text", required: true },
      {
        name: "banner",
        label: "Marka bannerı",
        type: "image",
        hint: "Önerilen boyut 1600 × 340 piksel. Yüklenirse bölümün başlığı bu görsel olur ve tıklanınca markanın sayfası açılır; logo ve kısa açıklama gösterilmez. Görsel kırpılmaz, olduğu gibi gösterilir.",
      },
      { name: "logo", label: "Logo", type: "image", hint: "Banner yüklenmemişse başlıkta gösterilir." },
      {
        name: "product_ids",
        label: "Gösterilecek ürünler",
        type: "products",
        hint: "Boş bırakırsanız markanın ilk 4 ürünü otomatik gösterilir.",
      },
    ],
    newItem: () => ({ brand_handle: "", tagline: "", banner: "", logo: "", product_ids: [] }),
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
  haftanin: "Marka bannerlarının altındaki 'Haftanın Ürünleri' rafı (ilk 8).",
  yeni: "Marka bannerlarının altındaki 'Yeni Gelenler' rafı (ilk 8).",
  "one-cikan": "'Keşfet · Öne Çıkanlar' bölümü: 4 × 4 ızgara (ilk 16).",
  "cok-satan": "Şu an ana sayfada gösterilmiyor (sekmeli bölüm kaldırıldı).",
  "super-firsat": "'Fırsat Ürünleri' bölümü: Öne Çıkanlar'ın hemen üstünde 4 ürün (ilk 4). Tümü sayfası /kampanyalar/super-firsat.",
}

export const LIST_LIMITS: Record<string, number> = {
  haftanin: 12,
  yeni: 12,
  "cok-satan": 12,
  "super-firsat": 4,
  "one-cikan": 16,
}
