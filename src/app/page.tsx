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

import { BrandSection } from '@/components/brand-section';
import { Hero } from '@/components/hero';
import { HeroSide } from '@/components/hero-side';
import { CategoryMosaic } from '@/components/category-mosaic';
import { ProductSlider } from '@/components/product-slider';
import { ProductTabs } from '@/components/product-tabs';
import { RevealOnScroll } from '@/components/reveal-on-scroll';
import { Section } from '@/components/section';
import {
  BlogCards,
  BrandGrid,
  DualBanners,
  PromoProductRow,
  SectionBar,
  SeoEditorial,
  TechBand,
  TrustRow,
  WideBanner,
} from '@/components/sections';
import { BRAND_SECTIONS } from '@/data/site';
import { loadCatalog } from '@/lib/medusa/catalog';

export default async function HomePage() {
  const { byBrand, mixed } = await loadCatalog();

  /**
   * One brand band, rendered in two runs below.
   *
   * The seven showcases stay structurally identical on purpose — see
   * BrandSection's own note: seven different layouts would read as seven
   * competing headers rather than a rhythm. The monotony problem is the length
   * of the unbroken run, not the sameness of the bands, so the technical band
   * splits the run instead of the bands varying.
   */
  const brandBand = (item: (typeof BRAND_SECTIONS)[number]) => (
    <Section key={item.brand}>
      <BrandSection
        brand={item.brand}
        tagline={item.tagline}
        href={item.href}
        logo={item.logo}
        products={byBrand(item.brand, 4)}
      />
    </Section>
  );

  return (
    <>
      {/* 04 — hero band. `first`: nothing precedes it, so it keeps the tight
             offset instead of being pushed down the fold.

             One 1320×423 slide became a 62/38 split: the slider keeps the
             left, two campaign tiles stack on the right. The BAND HEIGHT IS
             UNCHANGED at the measured 423 — the row sets it and both columns
             fill it, so the first screen gains two destinations without the
             fold moving. Below `dt` it collapses to the slide with the two
             tiles as a short pair beneath it. */}
      <Section first>
        <div className="grid gap-(--space-grid-gap) dt:h-[423px] dt:grid-cols-[minmax(0,62fr)_minmax(0,38fr)]">
          <Hero />
          <HeroSide />
        </div>
      </Section>

      {/* 04b — the department board.
             Category discovery used to sit at y=7337, i.e. 73% down the page,
             behind ~6.000px of product rows — the first question a technical
             buyer asks, answered last. It is now the first thing under the
             hero. Deliberately NOT another row of four equal cards: 60% of
             this page was already card rows. See CategoryMosaic. */}
      <Section label="Kategoriler">
        <CategoryMosaic />
      </Section>

      {/* 05 — paired product sliders.
             The reference puts a 4-tile campaign strip here; the client asked
             for two compact product rails instead, so this band sells product
             rather than categories. The tile strip still appears at band 13. */}
      <Section label="Haftanın ürünleri ve yeni gelenler">
        <div className="grid grid-cols-1 gap-(--space-grid-gap) lg:grid-cols-2">
          <ProductSlider
            eyebrow="Bu hafta öne çıkanlar"
            title="Haftanın Ürünleri"
            href="/kampanyalar/haftanin-urunleri"
            products={mixed(4, 8)}
            accent="violet"
          />
          <ProductSlider
            eyebrow="Rafa yeni girenler"
            title="Yeni Gelenler"
            href="/yeni-gelenler"
            products={mixed(17, 8)}
            accent="teal"
          />
        </div>
      </Section>

      {/* 06 — wide campaign banner */}
      <Section>
        <WideBanner
          image="/mock/campaigns/wide-1.svg"
          title="Türkiye'nin en geniş yedek parça stoğu"
          subtitle="13.000+ televizyona uyumlu led bar çeşitleri"
          href="/kategori/tv-yedek-parca"
        />
      </Section>

      {/* 07 — promo tile + 4 products */}
      <Section label="Süper fırsat ürünleri">
        <PromoProductRow
          promo={{
            title: 'Süper Fırsat',
            subtitle: 'Ürünleri',
            href: '/kampanyalar',
            /* A transparent CUTOUT, not the category illustration that stood
               here. `/mock/categories/*.svg` carry their own background plate,
               which was invisible while the art was a 45%-opacity texture and
               became an amorphous purple blob the moment the tile gave it real
               space. Cutouts composite cleanly onto brand colour — the same
               pairing CATEGORY_TILES already uses for its filled tiles. */
            image: '/mock/products/cutout/dish-white.svg',
          }}
          products={mixed(0, 4)}
        />
      </Section>

      {/* 08 — seven brand showcases, one per featured brand.
             These replace the two category bands that stood here (All In One
             Bilgisayarlar / Oto Ses ve Görüntü): the client wants this stretch
             of the homepage organised by brand, and Tekniva leads because the
             all-in-one band was the model for the whole series. */}
      {BRAND_SECTIONS.slice(0, 4).map(brandBand)}

      {/* 08b — full-bleed technical band, placed INSIDE the brand run.
             Measured: the seven showcases ran y=1793→5576 as one unbroken
             3783px stretch on an even 541px pitch. Putting the band after all
             seven left that stretch intact and only capped it; splitting it
             four/three breaks the monotony where it actually occurs, into two
             runs of roughly 1900px.
             Figures are placeholders pending the client's numbers. */}
      <Section track="bleed">
        <TechBand
          eyebrow="Neden SEENERGY"
          title="Elektronikte tedarik, tek adresten"
          description="Uydu ve güvenlik sistemlerinden televizyon yedek parçaya, oto ses sistemlerinden devre elemanlarına kadar geniş bir katalog; hem son kullanıcıya hem kurumsal alıcıya aynı stok derinliğiyle."
          stats={[
            { value: '12.000+', label: 'Katalogdaki ürün çeşidi' },
            { value: '45+', label: 'Yetkili satıcısı olduğumuz marka' },
            { value: '16:00', label: "Aynı gün kargo için son saat" },
            { value: '24 ay', label: 'Garanti kapsamındaki ürünler' },
          ]}
          cta={{ label: 'Kurumsal alım ve bayilik', href: '/toptan-satis' }}
        />
      </Section>

      {/* 08c — the remaining three showcases, after the break. */}
      {BRAND_SECTIONS.slice(4).map(brandBand)}

      {/* 12 — tabbed product block: 3 tabs + 5×3 grid.
             The largest single section on the reference homepage. */}
      <Section>
        <ProductTabs
          tabs={[
            /* 12, not 15: the grid is four columns beside the vertical tab
               rail now, so twelve fills exactly three rows. Fifteen would
               leave a ragged final row of three. */
            { id: 'haftanin', label: 'Haftanın Ürünleri', products: mixed(2, 12) },
            { id: 'yeni', label: 'Yeni Ürünler', products: mixed(11, 12) },
            { id: 'cok-satan', label: 'Çok Satanlar', products: mixed(23, 12) },
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
            <SectionBar title="Blog & Markalarımız" tone="dark" />
            <div className="pt-2.5 dt:pt-3">
              <BlogCards tone="dark" />
            </div>

            <div className="pt-(--space-section)">
              <DualBanners
                items={[
                  {
                    image: '/mock/campaigns/half-1.svg',
                    eyebrow: 'Kendi markalarımız',
                    title: 'Tescilli Markalarımız',
                    href: '/markalar',
                  },
                  {
                    image: '/mock/campaigns/half-2.svg',
                    eyebrow: 'Yetkili satıcılık',
                    title: 'Resmi Yetkili Satıcısı Olduğumuz Markalar',
                    href: '/markalar',
                  },
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
        <TrustRow />
      </Section>

      {/* Renders nothing. Arms the band reveal, and only once its observer
          exists — see reveal-on-scroll.tsx for why that order matters. */}
      <RevealOnScroll />
    </>
  );
}
