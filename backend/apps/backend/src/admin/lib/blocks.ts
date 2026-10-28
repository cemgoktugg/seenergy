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
  /** Keyed groups whose slots differ (the homepage bands): fields per key. */
  fieldsFor?: (key: string | null) => FieldDef[]
  /** Keyed groups: the slots the site still uses, in page order. Other
   *  blocks of the group stay in the database but are not offered. */
  slots?: string[]
  newItem?: () => Record<string, unknown>
}

export const fieldsOf = (def: GroupDef, key: string | null) => def.fieldsFor?.(key) ?? def.fields

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
  "dual-1": "Sol kart: Tescilli markalarımız (logolar 'Tescilli markalarımız'dan gelir)",
  "dual-2": "Sağ kart: Yetkili satıcılık (logolar 'Marka panosu'ndan gelir)",
  "super-firsat-promo": "Süper Fırsat kartı (mor kart)",
}

export const slotName = (key: string | null) => (key ? SLOT_NAMES[key] ?? key : "")

/** The /iletisim departments (staff blocks' `department`). */
export const DEPARTMENT_NAMES: Record<string, string> = {
  satis: "Satış Departmanı",
  muhasebe: "Muhasebe",
  "insan-kaynaklari": "İnsan Kaynakları",
}

/* --- homepage bands (`section`) ------------------------------------------- */

const visible: FieldDef = {
  name: "visible",
  label: "Sitede",
  type: "choice",
  options: [
    { value: "on", label: "Gösteriliyor" },
    { value: "off", label: "Gizli" },
  ],
  hint: "Gizli seçerseniz bölüm ana sayfadan kalkar; içeriği silinmez, istediğiniz zaman geri açabilirsiniz.",
}

function brandTileFields(logoHint: string): FieldDef[] {
  return [
    { name: "name", label: "Marka adı", type: "text", required: true, hint: "Logonun üzerine gelince ve ekran okuyucularda söylenir." },
    { ...link, hint: "Logo tıklanınca açılacak sayfa. Örn. /marka/dahua" },
    { name: "logo", label: "Logo", type: "image", required: true, hint: `Şeffaf (PNG/WebP) veya beyaz arka planlı logo. ${logoHint}` },
  ]
}

/** The bands, in page order (the `section` slots). */
export const SECTION_KEYS = ["hero", "brand-board", "rails", "deals", "featured", "brands", "brand-wall", "company", "trust"]

export const SECTION_NAMES: Record<string, string> = {
  hero: "Ana slayt",
  "brand-board": "Marka panosu",
  rails: "Haftanın Ürünleri ve Yeni Gelenler",
  deals: "Fırsat Ürünleri",
  featured: "Öne Çıkanlar",
  brands: "Markalarımız",
  "brand-wall": "Marka duvarı",
  company: "Referanslar ve Projeler",
  trust: "Güven satırı",
}

const COMPANY_CARD_NAMES: Record<string, string> = {
  referanslar: "Referanslarımız kartı",
  "cozum-ortaklari": "Çözüm Ortaklarımız kartı",
  projeler: "Projelerimiz kartı",
}

const heading = (eyebrow: string, title: string): FieldDef[] => [
  { name: "eyebrow", label: "Üst etiket", type: "text", placeholder: eyebrow, hint: "Başlığın üstündeki küçük, büyük harfli yazı." },
  { name: "title", label: "Başlık", type: "text", placeholder: title, required: true },
]

const SECTION_FIELDS: Record<string, FieldDef[]> = {
  hero: [
    {
      name: "background",
      label: "Koyu alanın arka plan fotoğrafı",
      type: "image",
      hint: "Slaytların yazı tarafındaki koyu alanın arkasında, bütün slaytlarda görünür; üzerine yazılar okunsun diye koyu bir gölge gelir. Görselin sağ tarafı gösterilir. Boş bırakırsanız düz koyu zemin olur.",
    },
  ],
  rails: [
    { name: "left_eyebrow", label: "Sol raf — üst etiket", type: "text", placeholder: "Bu hafta öne çıkanlar" },
    { name: "left_title", label: "Sol raf — başlık", type: "text", placeholder: "Haftanın Ürünleri", required: true },
    { name: "left_href", label: "Sol raf — 'Tümü' bağlantısı", type: "link", placeholder: "/kampanyalar/haftanin-urunleri" },
    { name: "right_eyebrow", label: "Sağ raf — üst etiket", type: "text", placeholder: "Rafa yeni girenler" },
    { name: "right_title", label: "Sağ raf — başlık", type: "text", placeholder: "Yeni Gelenler", required: true },
    { name: "right_href", label: "Sağ raf — 'Tümü' bağlantısı", type: "link", placeholder: "/yeni-gelenler" },
  ],
  deals: [
    {
      name: "image",
      label: "Bölüm görseli",
      type: "image",
      hint: "Dört ürünün solundaki dikey görsel; bölümün başlığı da bu görselin üzerinde yazar. Telefonda ürünlerin üstünde 2 : 1 bir şerit olarak gösterilir.",
    },
    { name: "href", label: "Görselin bağlantısı", type: "link", placeholder: "/kampanyalar/super-firsat" },
    { name: "button", label: "Görselin üzerindeki buton", type: "text", placeholder: "Hemen incele" },
    { name: "chip", label: "Ürünlerin üzerindeki etiket", type: "text", placeholder: "Fırsat Ürünü", hint: "Bu bölümdeki her ürün kartının sol üstünde yazar." },
  ],
  featured: heading("Keşfet", "Öne Çıkanlar"),
  brands: [
    ...heading("Markalar", "Markalarımız"),
    { name: "action_label", label: "Sağdaki bağlantının yazısı", type: "text", placeholder: "Tüm markalar" },
    { name: "action_href", label: "Sağdaki bağlantı", type: "link", placeholder: "/markalar" },
  ],
  "brand-wall": [
    { name: "button", label: "Buton yazısı", type: "text", placeholder: "Tümünü gör" },
    { name: "href", label: "Buton bağlantısı", type: "link", placeholder: "/markalar" },
  ],
  company: heading("Kurumsal", "Referanslar ve Projeler"),
}

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
    title: "Markalarımız kartları",
    where: "Öne Çıkanlar'ın altındaki 'Markalarımız' bölümünün iki kartı: soldaki koyu kart (Tescilli markalarımız) ve sağdaki açık kart (Yetkili satıcılık). Kartlardaki logolar ayrı düzenlenir.",
    repeatable: false,
    itemName: "kart",
    itemTitle: (_d, _i, key) => slotName(key),
    slots: ["dual-1", "dual-2"],
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text" },
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "subtitle", label: "Alt başlık", type: "text", hint: "Yalnızca soldaki koyu kartta, başlığın altında gösterilir." },
      { ...link, hint: "Kartın 'İncele' butonu tıklanınca açılacak sayfa." },
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
      {
        name: "hours",
        label: "Çalışma saatleri",
        type: "text",
        placeholder: "Hafta içi 08:00 – 18:00 · Hafta sonu 08:00 – 15:00",
        hint: "Satırları · işaretiyle ayırın; İletişim sayfasında her biri ayrı satırda gösterilir.",
      },
      {
        name: "map_query",
        label: "Haritadaki işletme adı (isteğe bağlı)",
        type: "text",
        placeholder: "SEENERGY Güvenlik Teknolojileri A.Ş., Yenimahalle, Ankara",
        hint: "İletişim sayfasındaki 'Yol tarifi al' düğmesi, ziyaretçinin konumundan Google Haritalar'daki işletme kaydınıza araçla rota açar. Boşsa şirket unvanı ve adresin son satırı (ilçe / il) kullanılır. Yalnızca Google'daki işletme adınız farklıysa doldurun.",
      },
      {
        name: "building_image",
        label: "Şirket binası fotoğrafı",
        type: "image",
        hint: "İletişim sayfasında, 'İletişim' başlığının hemen yanında görünür. Boşsa SEENERGY binasının fotoğrafı kullanılır; yerleşim o fotoğraftaki büyük S'ye göre ayarlıdır (S başlığın yanına gelir). Başka bir fotoğraf yüklerseniz yerleşimi geliştiriciye ayarlatın.",
      },
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
      "Ana slaytın hemen altındaki ikişer ikişer dört marka bannerı; tıklanınca markanın sayfası açılır. Buradaki sırayla ilk dört marka gösterilir. Logoları ayrıca 'Markalarımız' bölümündeki Yetkili satıcılık kartında görünür.",
    repeatable: true,
    itemName: "marka",
    itemTitle: (d, i) => `${i + 1}. ${d.brand_handle || "marka seçilmedi"}`,
    fields: [
      {
        name: "brand_handle",
        label: "Marka",
        type: "brand",
        required: true,
        hint: "Banner tıklanınca bu markanın sayfası açılır. Ürünlerin markasını Ürün Yönetimi'nden seçersiniz.",
      },
      {
        name: "banner",
        label: "Banner görseli",
        type: "image",
        required: true,
        hint: "Yatay görsel, 3 : 1 oranında gösterilir (örn. 1800 × 600 piksel). Önemli yazı ve ürünleri ortada tutun; kenarlardan az bir pay kırpılabilir.",
      },
      {
        name: "accent",
        label: "Çerçeve ışığının rengi",
        type: "text",
        placeholder: "#e60012",
        hint: "Bannerın çevresinde dolaşan ışığın rengi; markanın kendi rengi. # ile başlayan renk kodu.",
      },
      {
        name: "logo",
        label: "Logo",
        type: "image",
        required: true,
        hint: "Şeffaf (PNG/WebP) veya beyaz arka planlı logo. 'Markalarımız' bölümündeki Yetkili satıcılık kartında gösterilir.",
      },
    ],
    newItem: () => ({ brand_handle: "", banner: "", accent: "", logo: "" }),
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
  staff: {
    title: "Ekibimiz (İletişim sayfası)",
    where:
      "İletişim sayfasında, şirket bannerının altında departman departman gösterilen çalışanlar: Satış Departmanı, Muhasebe, İnsan Kaynakları. Her departmanda buradaki sırayla dizilir. E-posta veya telefon boşsa o satır gösterilmez; telefon boşsa şirketin telefonu yazılır.",
    repeatable: true,
    itemName: "çalışan",
    itemTitle: (d, i) => `${i + 1}. ${DEPARTMENT_NAMES[d.department] ?? "Departman seçilmedi"} — ${d.name || "isim girilmedi"}`,
    fields: [
      {
        name: "department",
        label: "Departman",
        type: "choice",
        options: [
          { value: "satis", label: "Satış Departmanı" },
          { value: "muhasebe", label: "Muhasebe" },
          { value: "insan-kaynaklari", label: "İnsan Kaynakları" },
        ],
      },
      { name: "name", label: "İsim Soyisim", type: "text", required: true },
      { name: "title", label: "Unvan (isteğe bağlı)", type: "text", placeholder: "Satış Temsilcisi" },
      { name: "email", label: "E-posta", type: "text", placeholder: "isim@seenergy.com.tr" },
      {
        name: "phone",
        label: "Telefon",
        type: "text",
        placeholder: "0532 000 00 00",
        hint: "Yalnızca numara; tıklanınca aranır. Boşsa şirketin telefonu yazılır.",
      },
      {
        name: "photo",
        label: "Fotoğraf",
        type: "image",
        hint: "Yatay ya da kare, yüzü ortada bir fotoğraf. Kart 4:3 oranında, üstten hizalı kırpar. Boşsa bir kişi simgesi gösterilir.",
      },
    ],
    newItem: () => ({ department: "satis", name: "", title: "", email: "", phone: "", photo: "" }),
  },
  section: {
    title: "Bölüm ayarları",
    where: "Ana sayfadaki bölümlerin başlıkları, bağlantıları, görselleri ve sitede gösterilip gösterilmeyeceği.",
    repeatable: false,
    itemName: "bölüm",
    itemTitle: (_d, _i, key) => SECTION_NAMES[key ?? ""] ?? key ?? "",
    slots: SECTION_KEYS,
    fields: [visible],
    fieldsFor: (key) => [visible, ...(SECTION_FIELDS[key ?? ""] ?? [])],
  },
  "own-brand": {
    title: "Tescilli markalarımız",
    where:
      "'Markalarımız' bölümündeki soldaki koyu kartın logoları (SEENERGY, SEENERGY Home, Racksan). Buradaki sırayla, yan yana üç tane sığar.",
    repeatable: true,
    itemName: "marka",
    itemTitle: (d, i) => `${i + 1}. ${d.name || "isimsiz"}`,
    fields: brandTileFields("Beyaz bir kutunun içinde gösterilir."),
    newItem: () => ({ name: "", href: "/marka/", logo: "" }),
  },
  "brand-wall": {
    title: "Marka duvarı",
    where:
      "'Markalarımız' bölümünün altında iki sıra halinde kayan marka logoları. Markalar sırayla ikiye bölünür: ilk yarısı üst sırada, ikinci yarısı alt sırada.",
    repeatable: true,
    itemName: "marka",
    itemTitle: (d, i) => `${i + 1}. ${d.name || "isimsiz"}`,
    fields: brandTileFields("Bütün logolar aynı 120 × 32 kutuya, sığdığı kadar büyük çizilir."),
    newItem: () => ({ name: "", href: "/marka/", logo: "" }),
  },
  "company-card": {
    title: "Referanslar ve Projeler kartları",
    where: "Ana sayfanın altındaki üç kart: Referanslarımız, Çözüm Ortaklarımız, Projelerimiz.",
    repeatable: false,
    itemName: "kart",
    itemTitle: (_d, _i, key) => COMPANY_CARD_NAMES[key ?? ""] ?? key ?? "",
    slots: ["referanslar", "cozum-ortaklari", "projeler"],
    fields: [],
    fieldsFor: (key) => [
      { name: "title", label: "Başlık", type: "text", required: true },
      { name: "text", label: "Açıklama", type: "textarea" },
      { ...link, hint: "Kart tıklanınca açılacak sayfa." },
      ...(key === "projeler"
        ? [
            {
              name: "image",
              label: "Kart görseli",
              type: "image" as const,
              hint: "Kartın üstündeki açık zeminde, tamamı görünecek şekilde gösterilir. Şeffaf veya beyaz arka planlı görsel en iyi sonucu verir.",
            },
          ]
        : []),
    ],
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
  "one-cikan": "'Keşfet · Öne Çıkanlar' bölümü: 4 × 5 ızgara (ilk 20).",
  "cok-satan": "Şu an ana sayfada gösterilmiyor (sekmeli bölüm kaldırıldı).",
  "super-firsat": "'Fırsat Ürünleri' bölümü: Öne Çıkanlar'ın hemen üstünde 4 ürün (ilk 4). Tümü sayfası /kampanyalar/super-firsat.",
}

export const LIST_LIMITS: Record<string, number> = {
  haftanin: 12,
  yeni: 12,
  "cok-satan": 12,
  "super-firsat": 4,
  "one-cikan": 20,
}
