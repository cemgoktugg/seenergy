/**
 * The shape of each vitrin block's `data`, by group.
 *
 * Shared by the admin forms, the API validation and the store response, so
 * the three cannot disagree about what a hero slide has.
 */

export type BlockGroup =
  | "announcement"
  | "hero-slide"
  | "hero-side"
  | "banner"
  | "brand-band"
  | "brand-board"
  | "company"
  | "tech-band"
  | "trust"
  | "staff"
  | "section"
  | "own-brand"
  | "brand-wall"
  | "company-card"
  | "page"
  | "page-section"
  | "reference"
  | "project"

/**
 * One homepage band's own settings (`section`, keyed by band: hero, rails,
 * deals, featured, brands, brand-wall, company, trust): whether it is shown
 * and its headings, links and pictures. Fields vary by band; missing ones
 * fall back to what the storefront shipped with.
 */
export type SectionData = { visible?: "on" | "off" } & Record<string, unknown>

/** A logo tile: the registered brands (`own-brand`) and the brand wall. */
export interface BrandTileData {
  name: string
  href: string
  logo: string
}

/** Referanslar / Çözüm Ortaklarımız / Projelerimiz (`company-card`, keyed). */
export interface CompanyCardData {
  title: string
  text: string
  href: string
  /** Projelerimiz only: the picture on its plate. */
  image?: string
}

/**
 * A corporate page's own settings (`page`, keyed: referanslar,
 * cozum-ortaklarimiz, projeler, iletisim): headings, the lede, the search
 * description, and on /iletisim every label, button and form text. Missing
 * or empty fields fall back to what the storefront shipped with.
 */
export type PageData = Record<string, unknown>

/** One text section of a corporate page (`page-section`, repeatable). */
export interface PageSectionData {
  page: "referanslar" | "cozum-ortaklarimiz" | "projeler"
  heading: string
  /** paragraf: blank line = new paragraph; liste / adimlar: one item per line,
   *  "Etiket: açıklama" sets the label in bold. [yazı](/yol) is a link. */
  style: "paragraf" | "liste" | "adimlar"
  text: string
}

/** One client on /referanslar (`reference`, repeatable). */
export interface ReferenceData {
  name: string
  logo: string
  sector: string
  text: string
  href: string
}

/** One finished project on /projeler (`project`, repeatable). */
export interface ProjectData {
  title: string
  image: string
  location: string
  year: string
  category: string
  text: string
}

export interface HeroSlideData {
  eyebrow: string
  title: string
  description: string
  chips: string[]
  cta: string
  href: string
  image: string
  fit?: "contain" | "cover"
  /** Light design only: the second title line, in the accent red. */
  title_accent?: string
  /** Light design only: the wide photo behind the slide. */
  wide_image?: string
}

/** Hero side tiles, the wide banner and the two dual banners. */
export interface BannerData {
  eyebrow?: string
  title: string
  subtitle?: string
  href: string
  image: string
}

export interface BrandBandData {
  /** Collection (brand) handle — the band shows that brand's products. */
  brand_handle: string
  tagline: string
  /** Optional brand artwork; when set it replaces the logo header. */
  banner?: string
  logo: string
  /** Optional hand-picked products; empty means "the brand's first four". */
  product_ids: string[]
}

/** One square of the brand board under the hero (the first four are shown). */
export interface BrandBoardData {
  /** Collection (brand) handle — the square links to its brand page. */
  brand_handle: string
  /** The square's banner artwork (3 : 1). */
  banner?: string
  /** The light running round the frame, e.g. "#e60012". */
  accent?: string
  /** The logo, shown on the "Markalarımız" authorised-brands card. */
  logo: string
}

export interface TechBandData {
  eyebrow: string
  title: string
  description: string
  stats: { value: string; label: string }[]
  cta_label: string
  cta_href: string
}

export interface TrustData {
  title: string
  subtitle: string
  icon: "truck" | "badge" | "lock" | "refresh" | "support"
}

/** The /iletisim departments, in the order the page shows them. */
export const STAFF_DEPARTMENTS = ["satis", "muhasebe", "insan-kaynaklari"] as const

/** One person on /iletisim, under their department. */
export interface StaffData {
  department: (typeof STAFF_DEPARTMENTS)[number]
  name: string
  title: string
  email: string
  phone: string
  photo: string
}

export interface AnnouncementData {
  text: string
}

/** The lists the storefront knows how to place. */
export const LIST_KEYS = ["haftanin", "yeni", "cok-satan", "super-firsat", "one-cikan"] as const
export type ListKey = (typeof LIST_KEYS)[number]
