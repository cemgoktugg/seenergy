/**
 * Homepage — assembled in the reference's observed band order.
 * The measured map is docs/MERTER_HOMEPAGE_MAP.md; band numbers below refer to
 * its table.
 *
 * The order is not rearranged to suit generic ecommerce advice: the client
 * chose this composition, and the brief makes it the source of truth.
 *
 * SPACING IS NOT SET HERE. Every band used to carry its own top padding —
 * pt-2.5, pt-3, pt-[30px], dt:pt-5, dt:pt-6: nineteen bands, five values, no
 * system, and measured gaps of 0 between sections. All of it now comes from
 * `--space-section` via <Section>, so the page's rhythm is retuned in one line
 * of globals.css rather than nineteen class lists.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

import { Hero } from '@/components/hero';
import { ProductCard } from '@/components/product-card';
import { BrandBoard, type BrandBoardEntry } from '@/components/brand-board';
import { BrandShowcase, type PartnerBrand } from '@/components/brand-showcase';
import { CompanyCards } from '@/components/company-cards';
import { ProductSlider } from '@/components/product-slider';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { Section } from '@/components/section';
import { SectionHeading } from '@/components/section-heading';
import {
  BrandGrid,
  ProductGrid,
  TrustRow,
} from '@/components/sections';
import { discountPercent, type Product } from '@/data/catalog';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';
/* The client's banners as supplied (img/1-4.jpeg, 2026-10-23) — no cut files,
   no padding, no extension; BrandBoard frames them (see its note). */
import dahuaBanner from '../../img/1.jpeg';
import hikvisionBanner from '../../img/2.jpeg';
import unvBanner from '../../img/3.jpeg';
import neutronBanner from '../../img/4.jpeg';

/** The client's img/1–4 banners, in reading order. */
const BRAND_BANNERS = [
  { handle: 'dahua', name: 'Dahua', image: dahuaBanner, accent: '#e60012' },
  { handle: 'hikvision', name: 'Hikvision', image: hikvisionBanner, accent: '#e1251b' },
  { handle: 'unv', name: 'UNV', image: unvBanner, accent: '#0068b7' },
  { handle: 'neutron', name: 'Neutron', image: neutronBanner, accent: '#1b8fe0' },
];

export default async function HomePage() {
  const [{ byId, brandFromSlug, mixed, products }, vitrin] = await Promise.all([
    loadCatalog(),
    loadVitrin(),
  ]);

  /**
   * A Vitrin list (admin → Vitrin), resolved against the catalogue. Ids of
   * products that were deleted or unpublished simply drop out. Until a list
   * exists the old deterministic pick stands in, so the page is never empty.
   */
  const pick = (key: string, count: number, fallbackOffset: number): Product[] => {
    const ids = vitrin.lists[key];
    if (!ids) return mixed(fallbackOffset, count);
    return ids
      .map((id) => byId(id))
      .filter((product): product is Product => Boolean(product))
      .slice(0, count);
  };

  /* "Fırsat Ürünleri": the shop's own pick (admin → Vitrin → Fırsat Ürünleri,
     the super-firsat list), first four. Until that list exists, the four
     deepest discounts that can be bought now — never a product without a
     struck price, which would make the band's name a claim it cannot keep. */
  const deals = vitrin.lists['super-firsat']
    ? pick('super-firsat', 4, 0)
    : products
        .filter((product) => product.price != null && product.compareAtPrice && product.stock > 0)
        .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0))
        .slice(0, 4);

  // Keep the admin's brand visibility; the supplied artwork sets image order.
  const brandBoard: BrandBoardEntry[] = BRAND_BANNERS
    .filter(({ handle }) => vitrin.brandBoard.some((item) => item.brandHandle === handle))
    .map(({ handle, name, image, accent }) => ({
      name: brandFromSlug(handle) ?? name,
      href: `/marka/${handle}`,
      image,
      accent,
    }));

  const banner = (key: keyof typeof vitrin.banners, fallback: NonNullable<(typeof vitrin.banners)['wide']>) =>
    vitrin.banners[key] ?? fallback;

  /* "Markalarımız": copy from the dual-1 / dual-2 banner slots, the
     authorised brands from the brand board (admin → Vitrin → Marka panosu). */
  const ownBrands = banner('dual-1', {
    eyebrow: 'Kendi markalarımız',
    title: 'Tescilli Markalarımız',
    href: '/marka/seenergy',
    tone: 'koyu',
  });
  const partnerCard = banner('dual-2', {
    eyebrow: 'Yetkili satıcılık',
    title: 'Resmi Yetkili Satıcısı Olduğumuz Markalar',
    href: '/markalar',
    tone: 'acik',
  });
  const partnerBrands: PartnerBrand[] = vitrin.brandBoard.map(({ brandHandle, logo }) => ({
    name: brandFromSlug(brandHandle) ?? (brandHandle.length <= 3 ? brandHandle.toUpperCase() : brandHandle.charAt(0).toUpperCase() + brandHandle.slice(1)),
    href: `/marka/${brandHandle}`,
    logo,
  }));

  return (
    <>
      {/* The homepage's only h1, visually hidden — it rode in the about block
          until that left the page. */}
      <h1 className="sr-only">SEENERGY Güvenlik Teknolojileri — güvenlik kameraları, kayıt cihazları ve network ürünleri</h1>

      {/* 04 — hero band. `first`: nothing precedes it, so it keeps the tight
             offset instead of being pushed down the fold.

             The slider alone, across the content container (2026-10-22, the
             client's call): the two campaign tiles beside it ("Süper Fırsat
             Ürünleri", "Toptan alım ve bayilik") are gone. An edge-to-edge
             version was tried the same day and taken back — the client
             wanted it aligned with the bands below, not the viewport. */}
      {vitrin.slides.length > 0 ? (
        <Section first label="Kampanyalar">
          <Hero slides={vitrin.slides} />
        </Section>
      ) : null}

      {/* 04b — four clickable brand banners, in a two-by-two grid. */}
      {brandBoard.length > 0 ? (
        <Section label="Markalar" compact>
          <BrandBoard items={brandBoard} />
        </Section>
      ) : null}

      {/* 05 — paired product sliders.
             The reference puts a 4-tile campaign strip here; the client asked
             for two compact product rails instead, so this band sells product
             rather than categories. The tile strip still appears at band 13. */}
      {/* `compact`: tied to the brand banners above — the client asked for
          less air between them (2026-10-23). */}
      <Section label="Haftanın ürünleri ve yeni gelenler" compact>
        <div className="grid grid-cols-1 gap-(--space-grid-gap) lg:grid-cols-2">
          <ProductSlider
            eyebrow="Bu hafta öne çıkanlar"
            title="Haftanın Ürünleri"
            channel="01"
            href="/kampanyalar/haftanin-urunleri"
            products={pick('haftanin', 8, 2)}
          />
          <ProductSlider
            eyebrow="Rafa yeni girenler"
            title="Yeni Gelenler"
            channel="02"
            href="/yeni-gelenler"
            products={pick('yeni', 8, 11)}
          />
        </div>
      </Section>

      {/* 12 — Keşfet · Öne Çıkanlar: one 4 × 4 grid (2026-10-24). It was a
             tabbed block (Haftanın Ürünleri / Yeni Ürünler / Çok Satanlar);
             the client wanted no tabs and no such labels here, only the
             featured products. Its own Vitrin list, "one-cikan" (first 20 —
             4 × 5 since 2026-10-27, the client asked for four more),
             edited in admin → Vitrin → Öne Çıkanlar; until the list exists a
             deterministic mix stands in. On a phone the band scrolls like the
             other homepage rails. */}
      {/* 11b — Fırsat Ürünleri (2026-10-26): four products directly above
             Öne Çıkanlar. Since 2026-10-27 the band opens with the client's
             own "Fırsat Ürünleri" artwork (img/fırsat.jpeg) as a tile beside
             the cards, the way the client showed it: tile + four cards in one
             row from `dt` (with a "Hemen incele" button); below it the artwork
             is a 2:1 strip over the cards, without the button, which would
             cover its lettering. The artwork carries the heading, so the h2 is for screen
             readers. */}
      {deals.length > 0 ? (
        <Section label="Fırsat ürünleri">
          <h2 className="sr-only">Fırsat Ürünleri</h2>
          <div className="grid gap-(--space-grid-gap) dt:grid-cols-[minmax(0,1.35fr)_repeat(4,minmax(0,1fr))]">
            <Link
              href="/kampanyalar/super-firsat"
              aria-label="Tüm fırsat ürünleri"
              className="group relative block aspect-[2/1] overflow-hidden rounded-(--card-radius) shadow-e1 dt:aspect-auto dt:h-full"
            >
              <Image
                src="/campaign/firsat-urunleri.webp"
                alt=""
                fill
                sizes="(min-width: 1200px) 320px, 100vw"
                className="object-cover transition-transform duration-(--duration-slow) ease-(--ease-out) group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-6 left-1/2 hidden h-9 -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-ink-fixed px-4 text-[13px] font-bold text-white shadow-e2 transition-colors duration-(--duration-fast) group-hover:bg-[rgb(195,19,28)] dt:inline-flex">
                Hemen incele
                <ArrowRight size={15} strokeWidth={2.5} aria-hidden />
              </span>
            </Link>
            {/* Two across on a phone, four from `sm`; from `dt` the wrapper
                dissolves and the cards join the tile's row. */}
            <div className="grid grid-cols-2 gap-(--space-grid-gap) sm:grid-cols-4 dt:contents">
              {deals.map((product) => (
                <ProductCard key={product.id} product={product} chip="Fırsat Ürünü" />
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Section label="Öne çıkan ürünler">
        <SectionHeading eyebrow="Keşfet" title="Öne Çıkanlar" />
        <div className="pt-3 dt:pt-4">
          <ProductGrid products={pick('one-cikan', 20, 4)} columns={4} featured />
        </div>
      </Section>

      {/* 12b — Markalarımız (2026-10-24): the two brand cards and the brand
             wall, moved up here from the dark blog band at the client's
             request and redesigned (see BrandShowcase). */}
      <Section label="Markalarımız">
        <SectionHeading eyebrow="Markalar" title="Markalarımız" action={{ label: 'Tüm markalar', href: '/markalar' }} />
        <div className="pt-3 dt:pt-4">
          <BrandShowcase own={ownBrands} partners={partnerCard} brands={partnerBrands} />
        </div>
        <div className="pt-(--space-grid-gap)">
          <BrandGrid />
        </div>
      </Section>

      {/* 13 — the second campaign-tile strip stood here. Removed when category
             discovery moved up to 04b: four category tiles at 73% depth, under
             a twelve-category board at 8%, is the same job done twice and the
             weaker instance is the late one. `CategoryTiles` and
             CATEGORY_TILES_SECONDARY both still exist, so restoring it is a
             two-line change if the client wants the strip back. */}

      {/* 14-17 — the second dark anchor, holding the blog.
             It was folded together from three weak light bands (blog, brand
             promos, brand wall) to give the page a light → dark → light →
             dark → footer rhythm. On 2026-10-24 the brand promos and the
             brand wall moved up under "Öne Çıkanlar" (12b) at the client's
             request; the band keeps the blog and its dark rhythm. */}
      {/* Referanslar, çözüm ortakları, projeler (2026-10-27): the blog
          cards this band carried gave way to them at the client's request;
          the blog itself stays at /blog. The same day it left the black
          full-bleed band for a light panel with a circuit-board ground (see
          CompanyCards), smaller, at the client's request. */}
      <Section>
        <CompanyCards />
      </Section>

      {/* 18 — Firmamız Hakkında stood here (2026-10-27) and was removed on
             2026-10-28 at the client's request: the statement belongs on
             /hakkimizda, where it now lives. */}

      {/* 19 — trust row. On the 1320 content track like every band above it:
             on the wider 1400 chrome track its boxes stood ~40px proud of the
             column on each side. */}
      <Section className="pb-6">
        <TrustRow items={vitrin.trust} />
      </Section>

      {/* Renders nothing. Arms the band reveal, and only once its observer
          exists — see reveal-on-scroll.tsx for why that order matters. */}
      <RevealOnScroll />
    </>
  );
}
