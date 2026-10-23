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

import { Hero } from '@/components/hero';
import { BrandBoard, type BrandBoardEntry } from '@/components/brand-board';
import { ProductSlider } from '@/components/product-slider';
import { ProductTabs } from '@/components/product-tabs';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { Section } from '@/components/section';
import { SectionHeading } from '@/components/section-heading';
import {
  BlogCards,
  BrandGrid,
  DualBanners,
  SeoEditorial,
  TrustRow,
} from '@/components/sections';
import type { Product } from '@/data/catalog';
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
  const [{ byId, brandFromSlug, mixed }, vitrin] = await Promise.all([
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

  return (
    <>
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
          less air between them (2026-10-23), and the panels take those
          banners' red and blue. */}
      <Section label="Haftanın ürünleri ve yeni gelenler" compact>
        <div className="grid grid-cols-1 gap-(--space-grid-gap) lg:grid-cols-2">
          <ProductSlider
            eyebrow="Bu hafta öne çıkanlar"
            title="Haftanın Ürünleri"
            href="/kampanyalar/haftanin-urunleri"
            products={pick('haftanin', 8, 2)}
            accent="red"
          />
          <ProductSlider
            eyebrow="Rafa yeni girenler"
            title="Yeni Gelenler"
            href="/yeni-gelenler"
            products={pick('yeni', 8, 11)}
            accent="blue"
          />
        </div>
      </Section>

      {/* 12 — tabbed product block: 3 tabs + 5×3 grid.
             The largest single section on the reference homepage. */}
      <Section>
        <ProductTabs
          tabs={[
            /* 12, not 15: the grid is four columns beside the vertical tab
               rail now, so twelve fills exactly three rows. Fifteen would
               leave a ragged final row of three. */
            /* The same Vitrin lists as the sliders above: the shop keeps
               "Haftanın Ürünleri" in one place, not two. */
            { id: 'haftanin', label: 'Haftanın Ürünleri', products: pick('haftanin', 12, 2) },
            { id: 'yeni', label: 'Yeni Ürünler', products: pick('yeni', 12, 11) },
            { id: 'cok-satan', label: 'Çok Satanlar', products: pick('cok-satan', 12, 23) },
          ]}
        />
      </Section>

      {/* 13 — the second campaign-tile strip stood here. Removed when category
             discovery moved up to 04b: four category tiles at 73% depth, under
             a twelve-category board at 8%, is the same job done twice and the
             weaker instance is the late one. `CategoryTiles` and
             CATEGORY_TILES_SECONDARY both still exist, so restoring it is a
             two-line change if the client wants the strip back. */}

      {/* 14-17 — the second dark anchor.
             Measured, the page ran light from the technical band at y=3960 all
             the way to the footer: 5.570px of unbroken white-on-grey. These
             three bands — blog, the brand promos, the brand wall — were also
             the weakest stretch, and the brand wall specifically was the
             deadest region on the page. Folding them into one chrome band gives
             the page a light → dark → light → dark → footer rhythm and puts a
             frame around the part that had none.
             The brand wall stays a WHITE panel inside the dark: the generated
             brand marks carry an opaque white plate, so on chrome they would
             render as 45 white rectangles. Framed rather than inverted. */}
      <Section track="bleed">
        <div className="relative overflow-hidden bg-chrome py-9 dt:py-14">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
          />
          <div className="container-main">
            <SectionHeading eyebrow="Bilgi ve markalar" title="Blog & Markalarımız" tone="dark" />
            <div className="pt-2.5 dt:pt-3">
              <BlogCards tone="dark" />
            </div>

            <div className="pt-(--space-section)">
              <DualBanners
                items={[
                  banner('dual-1', {
                    eyebrow: 'Kendi markalarımız',
                    title: 'Tescilli Markalarımız',
                    href: '/markalar',
                    tone: 'acik',
                    productImage: '/mock/products/cutout/receiver-white.svg',
                  }),
                  banner('dual-2', {
                    eyebrow: 'Yetkili satıcılık',
                    title: 'Resmi Yetkili Satıcısı Olduğumuz Markalar',
                    href: '/markalar',
                    tone: 'turkuaz',
                    productImage: '/mock/products/cutout/camera-white.svg',
                  }),
                ]}
              />
            </div>

            <div className="pt-(--space-section)">
              <BrandGrid />
            </div>
          </div>
        </div>
      </Section>

      {/* 18 — SEO editorial */}
      <Section>
        <SeoEditorial />
      </Section>

      {/* 19 — trust row. Part of the footer stack, so it uses the wider 1400
             chrome track rather than the 1320 content container. */}
      <Section track="nav" className="pb-6">
        <TrustRow items={vitrin.trust} />
      </Section>

      {/* Renders nothing. Arms the band reveal, and only once its observer
          exists — see reveal-on-scroll.tsx for why that order matters. */}
      <RevealOnScroll />
    </>
  );
}
