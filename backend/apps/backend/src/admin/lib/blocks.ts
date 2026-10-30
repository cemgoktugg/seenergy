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
      name: "design",
      label: "Tasarım",
      type: "choice",
      options: [
        // "oval" is the stored value of the default; since 2026-10-30 it is
        // the poster design (the dark oval it named was replaced that day).
        { value: "oval", label: "Afiş — görsel olduğu gibi, kırpılmadan gösterilir (varsayılan)" },
        { value: "acik", label: "Açık tasarım — beyaz zemin, kırmızı vurgulu başlık" },
      ],
      hint: "Afiş: hazır tasarlanmış görselleriniz (logo, başlık, özellikler üzerinde) hiç kırpılmadan, üstüne yazı konmadan gösterilir; slaytın tamamı tıklanır. Açık tasarım: sitenin kendi başlığı ve butonu geniş bir fotoğrafın üstünde. İstediğiniz zaman geri dönebilirsiniz.",
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

/* --- corporate pages and İletişim (`page`, `page-section`, …) ---------------- */

/** The pages with their own settings card, in the order the map lists them. */
export const PAGE_KEYS = ["referanslar", "cozum-ortaklarimiz", "projeler", "iletisim"]

export const PAGE_NAMES: Record<string, string> = {
  referanslar: "Referanslarımız sayfası",
  "cozum-ortaklarimiz": "Çözüm Ortaklarımız sayfası",
  projeler: "Projelerimiz sayfası",
  iletisim: "İletişim sayfası",
}

const pageHeader = (eyebrow: string, title: string): FieldDef[] => [
  { name: "eyebrow", label: "Üst etiket", type: "text", placeholder: eyebrow, hint: "Başlığın üstündeki küçük, büyük harfli yazı." },
  { name: "title", label: "Sayfa başlığı", type: "text", placeholder: title, hint: "Sayfadaki büyük başlık; tarayıcı sekmesinde ve konum satırında da yazar." },
  { name: "lede", label: "Giriş yazısı", type: "textarea", hint: "Başlığın altındaki kısa paragraf." },
  {
    name: "seo_description",
    label: "Arama motoru açıklaması",
    type: "textarea",
    hint: "Google sonuçlarında başlığın altında görünen 1–2 cümle. Sayfada gösterilmez.",
  },
]

const PAGE_FIELDS: Record<string, FieldDef[]> = {
  referanslar: [
    ...pageHeader("Kurumsal", "Referanslarımız"),
    {
      name: "references_title",
      label: "Referans kartlarının başlığı",
      type: "text",
      placeholder: "Çalıştığımız firmalar",
      hint: "'Referanslar' listesine en az bir firma eklendiğinde, kartların üstünde yazar.",
    },
  ],
  "cozum-ortaklarimiz": pageHeader("Kurumsal", "Çözüm Ortaklarımız").map((field) =>
    field.name === "lede"
      ? {
          ...field,
          hint: "Başlığın altındaki kısa paragraf. {sayi} yazdığınız yere marka sayısı gelir. Logolar Vitrin → Marka duvarı'ndan gelir.",
        }
      : field
  ),
  projeler: [
    ...pageHeader("Kurumsal", "Projelerimiz"),
    {
      name: "projects_title",
      label: "Proje kartlarının başlığı",
      type: "text",
      placeholder: "Tamamlanan projeler",
      hint: "'Projeler' listesine en az bir proje eklendiğinde, kartların üstünde yazar.",
    },
  ],
  iletisim: [
    { name: "eyebrow", label: "Kutudaki üst etiket", type: "text", placeholder: "Bize ulaşın" },
    { name: "title", label: "Kutudaki büyük başlık", type: "text", placeholder: "İletişim" },
    { name: "quote_eyebrow", label: "Teklif modunda üst etiket", type: "text", placeholder: "Fiyat teklifi", hint: "Ürün sayfalarındaki 'Teklif İste' ile gelindiğinde." },
    { name: "quote_title", label: "Teklif modunda başlık", type: "text", placeholder: "Fiyat Teklifi İsteyin" },
    { name: "tagline", label: "Siyah paneldeki logo altı yazısı", type: "text", placeholder: "Güvenlik Teknolojileri A.Ş." },
    { name: "address_label", label: "'Adres' etiketi", type: "text", placeholder: "Adres" },
    { name: "phone_label", label: "'Telefon' etiketi", type: "text", placeholder: "Telefon" },
    { name: "hours_label", label: "'Çalışma saatleri' etiketi", type: "text", placeholder: "Çalışma saatleri" },
    { name: "call_label", label: "Arama butonu", type: "text", placeholder: "Hemen arayın" },
    { name: "directions_label", label: "Yol tarifi butonu", type: "text", placeholder: "Yol tarifi al" },
    { name: "staff_eyebrow", label: "Ekip bölümlerinin üst etiketi", type: "text", placeholder: "Ekibimiz" },
    { name: "satis_title", label: "Satış ekibinin başlığı", type: "text", placeholder: "Satış Departmanı" },
    { name: "muhasebe_title", label: "Muhasebe ekibinin başlığı", type: "text", placeholder: "Muhasebe" },
    { name: "ik_title", label: "İnsan kaynakları ekibinin başlığı", type: "text", placeholder: "İnsan Kaynakları" },
    { name: "form_eyebrow", label: "Formun üst etiketi", type: "text", placeholder: "Bize yazın" },
    { name: "form_title", label: "Formun başlığı", type: "text", placeholder: "İletişim formu" },
    {
      name: "topics",
      label: "Konu seçenekleri",
      type: "tags",
      hint: "Formdaki 'Konu' listesi. Sitedeki bağlantılar 'Fiyat teklifi', 'Teknik destek', 'Siparişim hakkında', 'İade ve cayma', 'Garanti ve arıza' konularını önceden seçer; bunları silerseniz o bağlantılar konu seçmeden açılır.",
    },
    { name: "submit_label", label: "Gönder butonu", type: "text", placeholder: "Mesajı gönder" },
    { name: "success_title", label: "Gönderilince çıkan başlık", type: "text", placeholder: "Mesajınız alındı" },
    { name: "quote_form_eyebrow", label: "Teklif formunun üst etiketi", type: "text", placeholder: "Teklif" },
    { name: "quote_form_title", label: "Teklif formunun başlığı", type: "text", placeholder: "Teklif formu" },
    { name: "quote_submit_label", label: "Teklif formunun gönder butonu", type: "text", placeholder: "Teklif iste" },
    { name: "quote_success_title", label: "Teklif gönderilince çıkan başlık", type: "text", placeholder: "Teklif talebiniz alındı" },
    {
      name: "success_text",
      label: "Gönderilince çıkan açıklama",
      type: "textarea",
      placeholder: "Mesai saatlerinde aynı gün, en geç bir iş günü içinde dönüş yapıyoruz.",
    },
    {
      name: "seo_description",
      label: "Arama motoru açıklaması",
      type: "textarea",
      hint: "Google sonuçlarında görünen 1–2 cümle. Sayfada gösterilmez.",
    },
  ],
}

/** The pages a text section can belong to. */
const SECTION_PAGES = [
  { value: "referanslar", label: "Referanslarımız" },
  { value: "cozum-ortaklarimiz", label: "Çözüm Ortaklarımız" },
  { value: "projeler", label: "Projelerimiz" },
]

export const sectionPageName = (page: string) => SECTION_PAGES.find((p) => p.value === page)?.label ?? "Sayfa seçilmedi"

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
    where: "Ana sayfanın en üstündeki büyük, kayan görsel alanı.",
    repeatable: true,
    itemName: "slayt",
    itemTitle: (d, i) => `${i + 1}. slayt — ${d.title || "başlıksız"}`,
    fields: [
      { name: "eyebrow", label: "Üst etiket", type: "text", placeholder: "Akıllı ev ve güvenlik" },
      {
        name: "title",
        label: "Başlık",
        type: "text",
        required: true,
        hint: "Afiş tasarımında sayfada yazılmaz (afişin kendi yazısı var); görme engelli ziyaretçilerin ekran okuyucusu bunu okur. Açık tasarımda başlık olarak görünür.",
      },
      {
        name: "title_accent",
        label: "Başlığın kırmızı satırı",
        type: "text",
        placeholder: "güçlü teknoloji.",
        hint: "Yalnızca açık tasarımda: başlığın altında kırmızıyla yazılan ikinci satır. Boş bırakılabilir.",
      },
      { name: "description", label: "Açıklama", type: "textarea" },
      { name: "chips", label: "Öne çıkan maddeler", type: "tags", hint: "En fazla 3 kısa madde." },
      { name: "cta", label: "Buton yazısı", type: "text", required: true, placeholder: "Alışverişe Başla" },
      link,
      {
        name: "image",
        label: "Görsel",
        type: "image",
        required: true,
        hint: "Afiş tasarımında olduğu gibi gösterilir. En iyisi alanın oranında, yatay 3 : 1 bir afiş (ör. 1980 × 660 piksel): alanı tam doldurur. Kare afiş de olur — iki yanı görselin bulanık hâliyle dolar, hiçbir yeri kırpılmaz.",
      },
      {
        name: "fit",
        label: "Görsel yerleşimi",
        type: "choice",
        options: [
          { value: "contain", label: "Ürün görseli — tamamı görünsün (önerilen)" },
          { value: "cover", label: "Fotoğraf — alanı kaplasın" },
        ],
        hint: "Afiş ve ürün görselleri için 'tamamı görünsün'. 'Alanı kaplasın' görseli kenarlarından kırpar — yalnızca tam 3 : 1 hazırlanmış görseller için.",
      },
      {
        name: "wide_image",
        label: "Geniş fotoğraf (açık tasarım)",
        type: "image",
        hint: "Yalnızca açık tasarımda: yazısız, slaytı kaplayan bir fotoğraf; ürünü sağ yarıya yerleştirin. Önerilen 1920 × 840 piksel. Afiş tasarımı bu alanı kullanmaz.",
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
      title_accent: "",
      wide_image: "",
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
        label: "İletişim kutusunun arka planı",
        type: "image",
        hint: "İletişim sayfasındaki adres / telefon / çalışma saatleri kutusunun arka planı. Boşsa SEENERGY'nin kendi tasarımı kullanılır (bina, solda yarı saydam beyaz kavis). Yeni bir görsel yüklerseniz sol yarısı açık renkli olmalı ve yaklaşık 1423 × 1105 oranında olmalı; yazılar o açık alanın üstüne gelir.",
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
  page: {
    title: "Sayfa ayarları",
    where: "Kurumsal sayfaların ve İletişim sayfasının başlıkları, giriş yazıları, etiketleri, butonları ve arama motoru açıklaması. Boş bırakılan alanda sitenin ilk metni kullanılır.",
    repeatable: false,
    itemName: "sayfa",
    itemTitle: (_d, _i, key) => PAGE_NAMES[key ?? ""] ?? key ?? "",
    slots: PAGE_KEYS,
    fields: [],
    fieldsFor: (key) => PAGE_FIELDS[key ?? ""] ?? [],
  },
  "page-section": {
    title: "Sayfa bölümleri",
    where:
      "Kurumsal sayfalardaki başlıklı metin bölümleri, buradaki sırayla. Her bölüm bir başlık ve bir metinden oluşur; metin paragraf, madde listesi ya da numaralı adımlar olarak gösterilir.",
    repeatable: true,
    itemName: "bölüm",
    itemTitle: (d, i) => `${i + 1}. ${sectionPageName(d.page)} — ${d.heading || "başlıksız"}`,
    fields: [
      { name: "page", label: "Sayfa", type: "choice", options: SECTION_PAGES },
      { name: "heading", label: "Bölüm başlığı", type: "text", required: true },
      {
        name: "style",
        label: "Görünüm",
        type: "choice",
        options: [
          { value: "paragraf", label: "Paragraf" },
          { value: "liste", label: "Madde listesi" },
          { value: "adimlar", label: "Numaralı adımlar" },
        ],
      },
      {
        name: "text",
        label: "Metin",
        type: "textarea",
        required: true,
        hint: "Paragraf: boş bir satır yeni paragraf başlatır. Liste ve adımlar: her satır bir madde; 'Etiket: açıklama' yazarsanız etiket kalın olur. Bağlantı için [yazı](/sayfa) yazın, örn. [kurumsal satış](/kurumsal).",
      },
    ],
    newItem: () => ({ page: "referanslar", heading: "", style: "paragraf", text: "" }),
  },
  reference: {
    title: "Referanslar",
    where:
      "Referanslarımız sayfasında, giriş yazısının altında kartlar halinde gösterilen firmalar, buradaki sırayla. Liste boşsa bu kısım sayfada hiç görünmez. Yalnızca adını yayınlamaya izin veren müşterileri ekleyin.",
    repeatable: true,
    itemName: "referans",
    itemTitle: (d, i) => `${i + 1}. ${d.name || "isimsiz"}`,
    fields: [
      { name: "name", label: "Firma / kurum adı", type: "text", required: true },
      { name: "logo", label: "Logo", type: "image", hint: "Şeffaf (PNG/WebP) veya beyaz arka planlı logo. Boşsa kartta firmanın adı yazar." },
      { name: "sector", label: "Sektör", type: "text", placeholder: "Fabrika ve depo" },
      { name: "text", label: "Kısa açıklama", type: "textarea", placeholder: "64 kameralı IP sistem ve merkezi kayıt" },
      { name: "href", label: "Bağlantı (isteğe bağlı)", type: "link", hint: "Doldurulursa kart tıklanınca açılır; firmanın sitesi ya da bir proje sayfası." },
    ],
    newItem: () => ({ name: "", logo: "", sector: "", text: "", href: "" }),
  },
  project: {
    title: "Projeler",
    where:
      "Projelerimiz sayfasında, giriş yazısının altında fotoğraflı kartlar halinde gösterilen projeler, buradaki sırayla. Liste boşsa bu kısım sayfada hiç görünmez.",
    repeatable: true,
    itemName: "proje",
    itemTitle: (d, i) => `${i + 1}. ${d.title || "başlıksız"}`,
    fields: [
      { name: "title", label: "Proje adı", type: "text", required: true, placeholder: "Lojistik deposu kamera sistemi" },
      { name: "image", label: "Fotoğraf", type: "image", hint: "Yatay fotoğraf; kart 4 : 3 oranında, ortadan kırparak gösterir." },
      { name: "category", label: "Proje türü", type: "text", placeholder: "CCTV ve kayıt" },
      { name: "location", label: "Yer", type: "text", placeholder: "Ankara" },
      { name: "year", label: "Yıl", type: "text", placeholder: "2026" },
      { name: "text", label: "Açıklama", type: "textarea", placeholder: "48 IP kamera, 2 NVR, 30 gün kayıt" },
    ],
    newItem: () => ({ title: "", image: "", category: "", location: "", year: "", text: "" }),
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
