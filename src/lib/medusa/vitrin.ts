import { cache } from 'react';

import { BRAND_SECTIONS, HERO_SIDE, HERO_SLIDES, SITE, TRUST_ITEMS } from '@/data/site';
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

export interface Vitrin {
  announcement: string;
  slides: HeroSlide[];
  heroSide: Banner[];
  banners: Partial<Record<'wide' | 'dual-1' | 'dual-2' | 'super-firsat-promo', Banner>>;
  brandBands: BrandBand[];
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
    'tech-band': Block<{
      eyebrow: string;
      title: string;
      description: string;
      stats: { value: string; label: string }[];
      cta_label?: string;
      cta_href?: string;
    }>[];
    trust: Block<TrustItem>[];
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

/** What the site showed before the Vitrin module existed. */
const FALLBACK: Vitrin = {
  announcement: SITE.promo,
  // The shipped artwork is wide campaign art, drawn to fill the stage.
  slides: HERO_SLIDES.map((slide) => ({ ...slide, chips: [...slide.chips], fit: 'cover' as const })),
  heroSide: HERO_SIDE.map((item) => ({ ...item })),
  banners: {},
  brandBands: BRAND_SECTIONS.map((band) => ({
    brandHandle: band.href.replace('/marka/', ''),
    tagline: band.tagline,
    logo: band.logo,
    banner: '',
    productIds: [],
  })),
  techBand: null,
  trust: TRUST_ITEMS.map((item) => ({ ...item })),
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
    slides: (b['hero-slide'] ?? [])
      .map((block) => ({
        ...block.data,
        chips: Array.isArray(block.data.chips) ? block.data.chips : [],
        fit: block.data.fit === 'cover' ? ('cover' as const) : ('contain' as const),
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
