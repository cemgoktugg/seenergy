import { cache } from 'react';

import { BRAND_SECTIONS, BRANDS, HERO_SIDE, HERO_SLIDES, SITE, TRUST_ITEMS } from '@/data/site';
import { medusa } from '@/lib/medusa/client';

/**
 * The storefront's editable content, from the SEENERGY Vitrin module in Medusa
 * (admin → Vitrin). Cached under the `vitrin` tag: an admin save calls
 * /api/revalidate and the next page view has it; otherwise it refreshes
 * within a minute on its own.
 *
 * If the request fails, the site falls back to the content that shipped in
 * src/data/site.ts rather than rendering an empty homepage.
 */

export interface HeroSlide {
  eyebrow: string;
  title: string;
  description: string;
  chips: string[];
  cta: string;
  href: string;
  image: string;
  /**
   * contain: a product shot or logo, shown whole on the light stage (default —
   *   it is what the shop actually uploads).
   * cover: a wide campaign photo that fills the stage edge to edge.
   */
  fit: 'contain' | 'cover';
  /** The light design only: a second title line, set in the accent red. */
  title_accent: string;
  /** The light design only: a wide photo behind the slide, its left side
   *  washed white under the copy. Empty: the slide's `image` on a light plate. */
  wide_image: string;
}

/** Campaign-card surface colours, chosen per card in the admin. */
export const TONES = ['koyu', 'mor', 'turkuaz', 'acik'] as const;
export type Tone = (typeof TONES)[number];

export interface Banner {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href: string;
  /** Optional background PHOTO; covers the card under a legibility scrim. */
  image?: string;
  /** Optional product picture, shown whole on a light plate. */
  productImage?: string;
  tone: Tone;
}

export interface BrandBand {
  brandHandle: string;
  tagline: string;
  logo: string;
  /** Brand artwork that replaces the logo header; empty = logo header. */
  banner: string;
  productIds: string[];
}

export interface TechBandContent {
  eyebrow: string;
  title: string;
  description: string;
  stats: { value: string; label: string }[];
  cta?: { label: string; href: string };
}

export type TrustIcon = 'truck' | 'badge' | 'lock' | 'refresh' | 'support';

export interface TrustItem {
  title: string;
  subtitle: string;
  icon: TrustIcon;
}

export interface BrandBoardItem {
  brandHandle: string;
  /** The square's banner (3 : 1); empty = not on the board. */
  banner: string;
  /** The light running round the frame. */
  accent: string;
  /** Shown on the Markalarımız authorised-brands card. */
  logo: string;
}

/** The board's artwork and frame colour until the admin sets its own
 *  (vitrin-upgrade-homepage-sections writes the same). */
const BOARD_PRESETS: Record<string, { banner: string; accent: string }> = {
  dahua: { banner: '/brand-board/dahua.jpg', accent: '#e60012' },
  hikvision: { banner: '/brand-board/hikvision.jpg', accent: '#e1251b' },
  unv: { banner: '/brand-board/unv.jpg', accent: '#0068b7' },
  neutron: { banner: '/brand-board/neutron.jpg', accent: '#1b8fe0' },
};

/** The board's first content, as the migration seeds it (vitrin-upgrade-brand-board). */
const BRAND_BOARD: BrandBoardItem[] = ['dahua', 'hikvision', 'unv', 'neutron'].map((handle) => ({
  brandHandle: handle,
  ...BOARD_PRESETS[handle],
  logo: `/brand-logos/${handle}.webp`,
}));

/** A logo tile: Markalarımız' registered brands and the brand wall. */
export interface BrandTile {
  name: string;
  href: string;
  logo: string;
}

/** Referanslarımız / Çözüm Ortaklarımız / Projelerimiz. */
export interface CompanyCard {
  key: 'referanslar' | 'cozum-ortaklari' | 'projeler';
  title: string;
  text: string;
  href: string;
  image: string;
}

/**
 * The homepage bands' own settings (admin → Vitrin → each band's "Düzenle").
 * Every value has the default the page shipped with, so a band whose block
 * is missing, or a field left empty, looks exactly as before.
 */
export const SECTION_DEFAULTS = {
  // design: oval = the dark oval panel (2026-10-30); acik = the light,
  // full-photo design (2026-10-30, the client's mock). Oval until switched.
  hero: { visible: true, design: 'oval', background: '/hero/seenergy-bina.webp' },
  'brand-board': { visible: true },
  rails: {
    visible: true,
    left_eyebrow: 'Bu hafta öne çıkanlar',
    left_title: 'Haftanın Ürünleri',
    left_href: '/kampanyalar/haftanin-urunleri',
    right_eyebrow: 'Rafa yeni girenler',
    right_title: 'Yeni Gelenler',
    right_href: '/yeni-gelenler',
  },
  deals: {
    visible: true,
    image: '/campaign/firsat-urunleri.webp',
    href: '/kampanyalar/super-firsat',
    button: 'Hemen incele',
    chip: 'Fırsat Ürünü',
  },
  featured: { visible: true, eyebrow: 'Keşfet', title: 'Öne Çıkanlar' },
  brands: { visible: true, eyebrow: 'Markalar', title: 'Markalarımız', action_label: 'Tüm markalar', action_href: '/markalar' },
  'brand-wall': { visible: true, button: 'Tümünü gör', href: '/markalar' },
  company: { visible: true, eyebrow: 'Kurumsal', title: 'Referanslar ve Projeler' },
  trust: { visible: true },
};

export type Sections = typeof SECTION_DEFAULTS;

/** Merge a band's saved data over its defaults: `visible` from "on"/"off",
 *  every other field a non-empty string or the default. */
function toSections(blocks: Block<Record<string, unknown>>[] | undefined): Sections {
  const out = structuredClone(SECTION_DEFAULTS) as Record<string, Record<string, string | boolean>>;
  for (const block of blocks ?? []) {
    const target = out[block.key ?? ''];
    if (!target) continue;
    for (const field of Object.keys(target)) {
      const value = block.data[field];
      if (field === 'visible') target.visible = value !== 'off';
      else if (typeof value === 'string' && value.trim()) target[field] = value.trim();
    }
  }
  return out as unknown as Sections;
}

const OWN_BRANDS: BrandTile[] = [
  { name: 'SEENERGY', href: '/marka/seenergy', logo: '/brands/seenergy.webp' },
  { name: 'SEENERGY Home', href: '/marka/seenergy-home', logo: '/brands/seenergy-home.webp' },
  { name: 'Racksan', href: '/marka/racksan', logo: '/brands/racksan.webp' },
];

const COMPANY_CARDS: CompanyCard[] = [
  {
    key: 'referanslar',
    title: 'Referanslarımız',
    text: 'Fabrikadan siteye, okuldan otoparka; farklı sektörlerde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlıyoruz.',
    href: '/referanslar',
    image: '',
  },
  {
    key: 'cozum-ortaklari',
    title: 'Çözüm Ortaklarımız',
    text: "Dahua, Hikvision, UNV, Neutron ve 30'dan fazla markayla birlikte çalışıyor; doğru ürünü yetkili kanaldan sunuyoruz.",
    href: '/cozum-ortaklarimiz',
    image: '',
  },
  {
    key: 'projeler',
    title: 'Projelerimiz',
    text: 'Keşiften kuruluma kadar yanınızdayız: kamera, kayıt, network ve uzak saha (4G, solar) projeleri için çözüm üretiyoruz.',
    href: '/projeler',
    image: '/hero/seenergy-cctv.webp',
  },
];

/**
 * The corporate pages' and /iletisim's own settings (admin → Vitrin → each
 * page's "Düzenle"). Every value is what the page shipped with, so a missing
 * block or an empty field shows exactly what it did before
 * (vitrin-upgrade-corporate-pages seeds the same values).
 */
export const PAGE_DEFAULTS = {
  referanslar: {
    eyebrow: 'Kurumsal',
    title: 'Referanslarımız',
    lede: 'Farklı sektörlerde güvenlik altyapısı kuran firmalara, kurulumculara ve proje ekiplerine ürün ve çözüm sağlıyoruz.',
    seo_description:
      'SEENERGY Güvenlik Teknolojileri; fabrika, site, mağaza, okul, sağlık ve otopark projelerinde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlar.',
    references_title: 'Çalıştığımız firmalar',
  },
  'cozum-ortaklarimiz': {
    eyebrow: 'Kurumsal',
    title: 'Çözüm Ortaklarımız',
    /** {sayi} = the number of brands on the wall. */
    lede: 'Kendi markamız SEENERGY ile birlikte {sayi} markanın ürünlerini sunuyoruz. Bir markaya tıklayarak ürünlerine ulaşabilirsiniz.',
    seo_description:
      'SEENERGY Güvenlik Teknolojileri olarak birlikte çalıştığımız markalar: Dahua, Hikvision, UNV, Neutron, Ruijie, TP-Link ve daha fazlası.',
  },
  projeler: {
    eyebrow: 'Kurumsal',
    title: 'Projelerimiz',
    lede: 'Tek bir kameradan yüzlerce kanallı kayıt sistemine kadar, projenize uygun ürünleri seçiyor ve proje boyunca yanınızda oluyoruz.',
    seo_description:
      'Kamera, kayıt, network ve uzak saha (4G, solar) güvenlik projeleri: keşiften kuruluma kadar ürün ve çözüm desteği.',
    projects_title: 'Tamamlanan projeler',
  },
  iletisim: {
    eyebrow: 'Bize ulaşın',
    title: 'İletişim',
    quote_eyebrow: 'Fiyat teklifi',
    quote_title: 'Fiyat Teklifi İsteyin',
    tagline: 'Güvenlik Teknolojileri A.Ş.',
    address_label: 'Adres',
    phone_label: 'Telefon',
    hours_label: 'Çalışma saatleri',
    call_label: 'Hemen arayın',
    directions_label: 'Yol tarifi al',
    staff_eyebrow: 'Ekibimiz',
    satis_title: 'Satış Departmanı',
    muhasebe_title: 'Muhasebe',
    ik_title: 'İnsan Kaynakları',
    form_eyebrow: 'Bize yazın',
    form_title: 'İletişim formu',
    submit_label: 'Mesajı gönder',
    success_title: 'Mesajınız alındı',
    quote_form_eyebrow: 'Teklif',
    quote_form_title: 'Teklif formu',
    quote_submit_label: 'Teklif iste',
    quote_success_title: 'Teklif talebiniz alındı',
    success_text: 'Mesai saatlerinde aynı gün, en geç bir iş günü içinde dönüş yapıyoruz.',
    seo_description:
      'SEENERGY Güvenlik Teknolojileri — İvedik OSB, Yenimahalle / Ankara. Telefon, e-posta, çalışma saatleri, satış, muhasebe ve insan kaynakları ekibimiz ve iletişim formu.',
  },
};

export type Pages = typeof PAGE_DEFAULTS;

/** /iletisim's "Konu" options; the site's ?konu= links pick the first five. */
export const CONTACT_TOPICS = ['Fiyat teklifi', 'Teknik destek', 'Siparişim hakkında', 'İade ve cayma', 'Garanti ve arıza', 'Genel bilgi'];

/** Saved page settings over their defaults: a non-empty string wins. */
function toPages(blocks: Block<Record<string, unknown>>[] | undefined): Pages {
  const out = structuredClone(PAGE_DEFAULTS) as Record<string, Record<string, string>>;
  for (const block of blocks ?? []) {
    const target = out[block.key ?? ''];
    if (!target) continue;
    for (const field of Object.keys(target)) {
      const value = block.data[field];
      if (typeof value === 'string' && value.trim()) target[field] = value.trim();
    }
  }
  return out as unknown as Pages;
}

/** One headed text section of a corporate page (admin → Vitrin → Metin bölümleri). */
export interface PageSection {
  page: 'referanslar' | 'cozum-ortaklarimiz' | 'projeler';
  heading: string;
  /** paragraf: blank line = new paragraph; liste / adimlar: one item a line. */
  style: 'paragraf' | 'liste' | 'adimlar';
  text: string;
}

/** What the pages carried before their sections moved to Vitrin. */
const PAGE_SECTIONS: PageSection[] = [
  {
    page: 'referanslar',
    heading: 'Hizmet verdiğimiz alanlar',
    style: 'liste',
    text: [
      'Fabrika ve depo: geniş alan ve çevre güvenliği, giriş-çıkış kontrolü, gece görüşlü kamera ve uzun süreli kayıt.',
      'Site ve konut: ortak alan, otopark ve giriş kameraları, interkom ve geçiş kontrol sistemleri.',
      'Mağaza ve AVM: kasa ve satış alanı izleme, renkli gece görüşü, uzaktan izleme.',
      'Okul ve kamu binaları: bina çevresi, koridor ve giriş güvenliği, yangın algılama.',
      'Sağlık: kesintisiz kayıt, network altyapısı ve alarm sistemleri.',
      'Otopark ve uzak saha: plaka ve araç izleme, elektrik ve internet hattı olmayan noktalar için 4G solar kameralar.',
    ].join('\n'),
  },
  {
    page: 'referanslar',
    heading: 'Referans listemiz',
    style: 'paragraf',
    text: 'Tamamladığımız projelerin ve çalıştığımız firmaların listesini, müşterilerimizin onayıyla, teklif sürecinde paylaşıyoruz. Benzer bir proje için örnek ve referans talep etmek isterseniz [kurumsal satış ve proje](/kurumsal) formundan bize yazabilirsiniz.',
  },
  {
    page: 'referanslar',
    heading: 'Birlikte çalıştığımız markalar',
    style: 'paragraf',
    text: "Kendi markamız SEENERGY'nin yanında Dahua, Hikvision, UNV ve Neutron gibi markaların ürünlerini sunuyoruz. Tüm markalar için [Çözüm Ortaklarımız](/cozum-ortaklarimiz) sayfasına göz atabilirsiniz.",
  },
  {
    page: 'cozum-ortaklarimiz',
    heading: 'Neden önemli?',
    style: 'paragraf',
    text: 'Ürünleri yetkili kanallardan, faturalı ve garantili olarak tedarik ediyoruz. Projenize uygun markayı ve modeli birlikte seçmek için [kurumsal satış ve proje](/kurumsal) formundan bize ulaşabilirsiniz.',
  },
  {
    page: 'projeler',
    heading: 'Proje türleri',
    style: 'liste',
    text: [
      'CCTV ve kayıt sistemleri: AHD ve IP kameralar, DVR/NVR kayıt cihazları, disk ve depolama planlaması.',
      'Network altyapısı: PoE ve ethernet switch, access point, router ve rack kabinet.',
      'Uzak saha: elektrik ve internet hattı olmayan noktalar için 4G SIM kartlı, solar panelli kameralar.',
      'Alarm, yangın ve geçiş kontrol: bina güvenliğini tamamlayan sistemler.',
    ].join('\n'),
  },
  {
    page: 'projeler',
    heading: 'Bir proje nasıl ilerler?',
    style: 'adimlar',
    text: [
      'İhtiyacı konuşuruz: alanı, kamera noktalarını, kayıt süresini ve bütçeyi birlikte belirleriz.',
      'Teklif hazırlarız: uyumlu ürünleri, adetleri ve fiyatları tek bir teklifte sunarız.',
      'Tedarik ederiz: ürünleri faturalı ve garantili olarak hızla sevk ederiz.',
      'Kurulumda destek oluruz: kurulum ve ayar aşamasında teknik destek veririz.',
    ].join('\n'),
  },
  {
    page: 'projeler',
    heading: 'Projeniz için teklif alın',
    style: 'paragraf',
    text: 'Proje detaylarını [kurumsal satış ve proje](/kurumsal) formundan iletin; size aynı gün dönüş yapalım. Daha önce yaptığımız benzer projeler için [Referanslarımız](/referanslar) sayfasına göz atabilirsiniz.',
  },
];

const SECTION_STYLES = ['paragraf', 'liste', 'adimlar'] as const;

const toPageSection = (data: Record<string, unknown>): PageSection | null => {
  const page = str(data.page);
  const heading = str(data.heading).trim();
  const text = str(data.text).trim();
  if (!(page in PAGE_DEFAULTS) || page === 'iletisim' || (!heading && !text)) return null;
  const style = (SECTION_STYLES as readonly string[]).includes(str(data.style)) ? (data.style as PageSection['style']) : 'paragraf';
  return { page: page as PageSection['page'], heading, style, text };
};

/** A client card on /referanslar (admin → Vitrin → Referanslar). */
export interface Reference {
  name: string;
  logo: string;
  sector: string;
  text: string;
  href: string;
}

/** A project card on /projeler (admin → Vitrin → Projeler). */
export interface Project {
  title: string;
  image: string;
  category: string;
  location: string;
  year: string;
  text: string;
}

const toTiles = (blocks: Block<Record<string, unknown>>[] | undefined, fallback: BrandTile[]): BrandTile[] =>
  blocks
    ? blocks
        .map((block) => ({ name: str(block.data.name).trim(), href: str(block.data.href).trim() || '/markalar', logo: str(block.data.logo) }))
        .filter((tile) => tile.name && tile.logo)
    : fallback;

/** Şirket bilgileri (admin → Vitrin → Şirket bilgileri). Empty = not shown. */
export interface Company {
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  mersis: string;
  taxOffice: string;
  taxNumber: string;
  kep: string;
  bankName: string;
  bankHolder: string;
  iban: string;
  /** The /iletisim banner's photo; empty = the logo stands in. */
  buildingImage: string;
  /** What "Yol tarifi al" asks Google Maps for; empty = legal name + city (see directionsHref). */
  mapQuery: string;
}

/** "Hafta içi … · Hafta sonu …" → one line each (the admin separates with ·). */
export const hoursLines = (hours: string) =>
  hours
    .split(/\s*[·\n]\s*/)
    .map((line) => line.trim())
    .filter(Boolean);

/** Until the block exists: the client's details (2026-10-28) and the old BANK_* env. */
const COMPANY_FALLBACK: Company = {
  legalName: 'SEENERGY Güvenlik Teknolojileri A.Ş.',
  phone: '(0312) 480 1 490',
  whatsapp: '',
  email: '',
  address: 'İvedik OSB Mahallesi, Melih Gökçek Bulvarı Köşe\nİvedik İş Merkezi 4BJ No: 85\nYenimahalle / Ankara',
  hours: 'Hafta içi 08:00 – 18:00 · Hafta sonu 08:00 – 15:00',
  buildingImage: '',
  mapQuery: '',
  mersis: '',
  taxOffice: '',
  taxNumber: '',
  kep: '',
  bankName: process.env.BANK_NAME ?? '',
  bankHolder: process.env.BANK_HOLDER ?? '',
  iban: process.env.BANK_IBAN ?? '',
};

/** The /iletisim departments, in page order (admin → Vitrin → Ekibimiz). */
export const DEPARTMENTS = [
  { key: 'satis', title: 'Satış Departmanı' },
  { key: 'muhasebe', title: 'Muhasebe' },
  { key: 'insan-kaynaklari', title: 'İnsan Kaynakları' },
] as const;

export interface StaffMember {
  department: (typeof DEPARTMENTS)[number]['key'];
  name: string;
  title: string;
  email: string;
  phone: string;
  photo: string;
}

export interface Vitrin {
  announcement: string;
  company: Company;
  /** /iletisim's people, in the admin's order. */
  staff: StaffMember[];
  slides: HeroSlide[];
  heroSide: Banner[];
  banners: Partial<Record<'wide' | 'dual-1' | 'dual-2' | 'super-firsat-promo', Banner>>;
  brandBands: BrandBand[];
  /** The four squares under the hero (admin → Vitrin → Marka panosu). */
  brandBoard: BrandBoardItem[];
  /** Each homepage band's settings: shown, headings, links, pictures. */
  sections: Sections;
  /** Markalarımız, left card. */
  ownBrands: BrandTile[];
  /** The moving logo wall. */
  brandWall: BrandTile[];
  companyCards: CompanyCard[];
  /** The corporate pages' and /iletisim's settings: headings, labels, texts. */
  pages: Pages;
  /** /iletisim's "Konu" options. */
  contactTopics: string[];
  /** The corporate pages' headed text sections, in the admin's order. */
  pageSections: PageSection[];
  /** /referanslar's client cards; empty = that part is not shown. */
  references: Reference[];
  /** /projeler's project cards; empty = that part is not shown. */
  projects: Project[];
  techBand: TechBandContent | null;
  trust: TrustItem[];
  /** List key → product ids, in the order the shop set. */
  lists: Record<string, string[]>;
}

type Block<T> = { id: string; key: string | null; data: T };

interface StoreVitrin {
  lists: Record<string, { title: string; product_ids: string[] }>;
  blocks: Partial<{
    announcement: Block<{ text: string }>[];
    'hero-slide': Block<HeroSlide>[];
    'hero-side': Block<RawBanner>[];
    banner: Block<RawBanner>[];
    'brand-band': Block<{ brand_handle: string; tagline: string; logo: string; banner?: string; product_ids?: string[] }>[];
    'brand-board': Block<{ brand_handle: string; logo: string; banner?: string; accent?: string }>[];
    section: Block<Record<string, unknown>>[];
    'own-brand': Block<Record<string, unknown>>[];
    'brand-wall': Block<Record<string, unknown>>[];
    'company-card': Block<Record<string, unknown>>[];
    page: Block<Record<string, unknown>>[];
    'page-section': Block<Record<string, unknown>>[];
    reference: Block<Record<string, unknown>>[];
    project: Block<Record<string, unknown>>[];
    'tech-band': Block<{
      eyebrow: string;
      title: string;
      description: string;
      stats: { value: string; label: string }[];
      cta_label?: string;
      cta_href?: string;
    }>[];
    trust: Block<TrustItem>[];
    company: Block<Record<string, unknown>>[];
    staff: Block<Record<string, unknown>>[];
  }>;
}

const str = (value: unknown) => (typeof value === 'string' ? value : '');

interface RawBanner {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  image?: string;
  product_image?: string;
  tone?: string;
}

const toBanner = (data: RawBanner): Banner => ({
  eyebrow: str(data.eyebrow) || undefined,
  title: str(data.title),
  subtitle: str(data.subtitle) || undefined,
  href: str(data.href) || '/',
  image: str(data.image) || undefined,
  productImage: str(data.product_image) || undefined,
  tone: (TONES as readonly string[]).includes(str(data.tone)) ? (data.tone as Tone) : 'koyu',
});

function toCompany(data: Record<string, unknown> | undefined): Company {
  if (!data) return COMPANY_FALLBACK;
  return {
    legalName: str(data.legal_name) || COMPANY_FALLBACK.legalName,
    phone: str(data.phone),
    whatsapp: str(data.whatsapp),
    email: str(data.email),
    address: str(data.address),
    hours: str(data.hours),
    mersis: str(data.mersis),
    taxOffice: str(data.tax_office),
    taxNumber: str(data.tax_number),
    kep: str(data.kep),
    // The storefront's BANK_* env still answers until the admin has a value.
    bankName: str(data.bank_name) || (process.env.BANK_NAME ?? ''),
    bankHolder: str(data.bank_holder) || (process.env.BANK_HOLDER ?? ''),
    iban: str(data.iban) || (process.env.BANK_IBAN ?? ''),
    buildingImage: str(data.building_image),
    mapQuery: str(data.map_query),
  };
}

const toStaff = (data: Record<string, unknown>): StaffMember | null => {
  const department = DEPARTMENTS.find((d) => d.key === data.department)?.key;
  const name = str(data.name).trim();
  if (!department || !name) return null;
  return {
    department,
    name,
    title: str(data.title).trim(),
    email: str(data.email).trim(),
    phone: str(data.phone).trim(),
    photo: str(data.photo),
  };
};

/** What the site showed before the Vitrin module existed. */
const FALLBACK: Vitrin = {
  announcement: SITE.promo,
  // The shipped artwork is wide campaign art, drawn to fill the stage.
  slides: HERO_SLIDES.map((slide) => ({
    ...slide,
    chips: [...slide.chips],
    fit: slide.fit === 'contain' ? ('contain' as const) : ('cover' as const),
    title_accent: '',
    wide_image: '',
  })),
  heroSide: HERO_SIDE.map((item) => ({ ...item })),
  banners: {},
  brandBands: BRAND_SECTIONS.map((band) => ({
    brandHandle: band.href.replace('/marka/', ''),
    tagline: band.tagline,
    logo: band.logo,
    banner: '',
    productIds: [],
  })),
  brandBoard: BRAND_BOARD,
  sections: SECTION_DEFAULTS,
  ownBrands: OWN_BRANDS,
  brandWall: BRANDS.map(({ name, href, image }) => ({ name, href, logo: image })),
  companyCards: COMPANY_CARDS,
  pages: PAGE_DEFAULTS,
  contactTopics: CONTACT_TOPICS,
  pageSections: PAGE_SECTIONS,
  references: [],
  projects: [],
  techBand: null,
  trust: TRUST_ITEMS.map((item) => ({ ...item })),
  company: COMPANY_FALLBACK,
  staff: [],
  lists: {},
};

export const loadVitrin = cache(async (): Promise<Vitrin> => {
  let raw: StoreVitrin;
  try {
    raw = await medusa<StoreVitrin>('/store/vitrin', { next: { revalidate: 60, tags: ['vitrin'] } });
  } catch {
    return FALLBACK;
  }

  const b = raw.blocks;
  const tech = b['tech-band']?.[0]?.data;
  const banners: Vitrin['banners'] = {};
  for (const block of b.banner ?? []) {
    if (block.key === 'wide' || block.key === 'dual-1' || block.key === 'dual-2' || block.key === 'super-firsat-promo') {
      banners[block.key] = toBanner(block.data);
    }
  }

  return {
    announcement: str(b.announcement?.[0]?.data.text),
    company: toCompany(b.company?.[0]?.data),
    staff: (b.staff ?? []).map((block) => toStaff(block.data)).filter((m): m is StaffMember => m !== null),
    slides: (b['hero-slide'] ?? [])
      .map((block) => ({
        ...block.data,
        chips: Array.isArray(block.data.chips) ? block.data.chips : [],
        fit: block.data.fit === 'cover' ? ('cover' as const) : ('contain' as const),
        title_accent: str(block.data.title_accent).trim(),
        wide_image: str(block.data.wide_image),
      }))
      // A slide without a picture would render a blank frame; skip it.
      .filter((slide) => slide.image && slide.title),
    heroSide: (b['hero-side'] ?? [])
      .sort((x, y) => str(x.key).localeCompare(str(y.key)))
      .map((block) => toBanner(block.data))
      .filter((item) => item.title),
    banners,
    brandBands: (b['brand-band'] ?? [])
      .map((block) => ({
        brandHandle: str(block.data.brand_handle),
        tagline: str(block.data.tagline),
        logo: str(block.data.logo),
        banner: str(block.data.banner),
        productIds: Array.isArray(block.data.product_ids) ? block.data.product_ids : [],
      }))
      .filter((band) => band.brandHandle),
    brandBoard: (b['brand-board'] ?? [])
      .map((block) => {
        const brandHandle = str(block.data.brand_handle);
        const preset = BOARD_PRESETS[brandHandle];
        return {
          brandHandle,
          banner: str(block.data.banner) || preset?.banner || '',
          accent: str(block.data.accent) || preset?.accent || '#8a93a3',
          logo: str(block.data.logo),
        };
      })
      .filter((item) => item.brandHandle)
      .slice(0, 4),
    sections: toSections(b.section),
    ownBrands: toTiles(b['own-brand'], OWN_BRANDS),
    brandWall: toTiles(b['brand-wall'], FALLBACK.brandWall),
    companyCards: COMPANY_CARDS.map((card) => {
      const data = b['company-card']?.find((block) => block.key === card.key)?.data;
      if (!data) return card;
      return {
        key: card.key,
        title: str(data.title).trim() || card.title,
        text: str(data.text).trim(),
        href: str(data.href).trim() || card.href,
        image: str(data.image) || card.image,
      };
    }),
    pages: toPages(b.page),
    contactTopics: (() => {
      const topics = b.page?.find((block) => block.key === 'iletisim')?.data.topics;
      const clean = Array.isArray(topics) ? topics.map((t) => str(t).trim()).filter(Boolean) : [];
      return clean.length ? clean : CONTACT_TOPICS;
    })(),
    // No block at all (before the seed ran) keeps the shipped sections; once
    // the group exists, an empty page is what the admin chose.
    pageSections: b['page-section']
      ? b['page-section'].map((block) => toPageSection(block.data)).filter((x): x is PageSection => x !== null)
      : PAGE_SECTIONS,
    references: (b.reference ?? [])
      .map((block) => ({
        name: str(block.data.name).trim(),
        logo: str(block.data.logo),
        sector: str(block.data.sector).trim(),
        text: str(block.data.text).trim(),
        href: str(block.data.href).trim(),
      }))
      .filter((ref) => ref.name),
    projects: (b.project ?? [])
      .map((block) => ({
        title: str(block.data.title).trim(),
        image: str(block.data.image),
        category: str(block.data.category).trim(),
        location: str(block.data.location).trim(),
        year: str(block.data.year).trim(),
        text: str(block.data.text).trim(),
      }))
      .filter((project) => project.title),
    techBand: tech
      ? {
          eyebrow: str(tech.eyebrow),
          title: str(tech.title),
          description: str(tech.description),
          stats: Array.isArray(tech.stats) ? tech.stats.filter((s) => s.value || s.label) : [],
          cta: tech.cta_label && tech.cta_href ? { label: tech.cta_label, href: tech.cta_href } : undefined,
        }
      : null,
    trust: (b.trust ?? []).map((block) => block.data).filter((item) => item.title),
    lists: Object.fromEntries(Object.entries(raw.lists).map(([key, list]) => [key, list.product_ids])),
  };
});
