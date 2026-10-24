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
  /** Collection (brand) handle — hovering the square lists its models. */
  brand_handle: string
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

export interface AnnouncementData {
  text: string
}

/** The lists the storefront knows how to place. */
export const LIST_KEYS = ["haftanin", "yeni", "cok-satan", "super-firsat", "one-cikan"] as const
export type ListKey = (typeof LIST_KEYS)[number]
