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

export interface BrandBoardItem {
  brandHandle: string;
  logo: string;
}

/** The board's first content, as the migration seeds it (vitrin-upgrade-brand-board). */
const BRAND_BOARD: BrandBoardItem[] = ['dahua', 'hikvision', 'unv', 'neutron'].map((handle) => ({
  brandHandle: handle,
  logo: `/brand-logos/${handle}.webp`,
}));

/** Şirket bilgileri (admin → Vitrin → Şirket bilgileri). Empty = not shown. */
export interface Company {
  legalName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  mapUrl: string;
  mersis: string;
  taxOffice: string;
  taxNumber: string;
  kep: string;
  bankName: string;
  bankHolder: string;
  iban: string;
  /** The /iletisim banner's photo; empty = the logo stands in. */
  buildingImage: string;
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
  mapUrl: '',
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
    'brand-board': Block<{ brand_handle: string; logo: string }>[];
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
    mapUrl: str(data.map_url),
    mersis: str(data.mersis),
    taxOffice: str(data.tax_office),
    taxNumber: str(data.tax_number),
    kep: str(data.kep),
    // The storefront's BANK_* env still answers until the admin has a value.
    bankName: str(data.bank_name) || (process.env.BANK_NAME ?? ''),
    bankHolder: str(data.bank_holder) || (process.env.BANK_HOLDER ?? ''),
    iban: str(data.iban) || (process.env.BANK_IBAN ?? ''),
    buildingImage: str(data.building_image),
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
      .map((block) => ({ brandHandle: str(block.data.brand_handle), logo: str(block.data.logo) }))
      .filter((item) => item.brandHandle)
      .slice(0, 4),
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
