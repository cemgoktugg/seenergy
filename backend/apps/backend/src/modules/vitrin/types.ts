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

export interface HeroSlideData {
  eyebrow: string
  title: string
  description: string
  chips: string[]
  cta: string
  href: string
  image: string
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
