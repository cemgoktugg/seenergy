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
  PromoProductRow,
  SeoEditorial,
  TechBand,
  TrustRow,
  WideBanner,
} from '@/components/sections';
import type { Product } from '@/data/catalog';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin, type BrandBand } from '@/lib/medusa/vitrin';

export default async function HomePage() {
  const [{ byId, byBrandSlug, brandFromSlug, mixed }, vitrin] = await Promise.all([
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

  /* The brand board's squares (admin → Vitrin → Marka panosu), each with the
     brand's models from the catalogue — listed the way the mega menu lists
     them: the model code, then the rest of the title. A brand with no
     products yet has no name in the catalogue, so its handle stands in
     ("unv" → "UNV", "dahua" → "Dahua"). */
  const brandBoard: BrandBoardEntry[] = vitrin.brandBoard.map(({ brandHandle, logo }) => {
    const products = byBrandSlug(brandHandle);
    const name =
      brandFromSlug(brandHandle) ??
      (brandHandle.length <= 3 ? brandHandle.toUpperCase() : brandHandle.charAt(0).toUpperCase() + brandHandle.slice(1));
    return {
      name,
      href: `/marka/${brandHandle}`,
      logo,
      models: products.map((product) => {
        const bare = product.name.startsWith(`${product.brand} `) ? product.name.slice(product.brand.length + 1) : product.name;
        const coded = product.sku && bare.startsWith(product.sku);
        return {
          label: coded ? product.sku : bare,
          detail: coded ? bare.slice(product.sku.length).trim() : product.brand,
          image: product.image,
          href: `/urun/${product.slug}`,
        };
      }),
    };
  });

  const banner = (key: keyof typeof vitrin.banners, fallback: NonNullable<(typeof vitrin.banners)['wide']>) =>
    vitrin.banners[key] ?? fallback;

  /* Only bands whose brand still has products — a band with no products
     would be a logo over an empty shelf. */
  const brandBands = vitrin.brandBands.filter((band) => brandFromSlug(band.brandHandle));

  /**
   * One brand band, rendered in two runs below.
   *
   * The seven showcases stay structurally identical on purpose — see
   * BrandSection's own note: seven different layouts would read as seven
   * competing headers rather than a rhythm. The monotony problem is the length
   * of the unbroken run, not the sameness of the bands, so the technical band
   * splits the run instead of the bands varying.
   */
  const brandBand = (band: BrandBand) => {
    const chosen = band.productIds.map((id) => byId(id)).filter((p): p is Product => Boolean(p));
    return (
      <Section key={band.brandHandle}>
        <BrandSection
          brand={brandFromSlug(band.brandHandle) ?? band.brandHandle}
          tagline={band.tagline}
          href={`/marka/${band.brandHandle}`}
          logo={band.logo}
          banner={band.banner || undefined}
          products={chosen.length > 0 ? chosen.slice(0, 4) : byBrandSlug(band.brandHandle).slice(0, 4)}
        />
      </Section>
    );
  };

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

      {/* 04b — the brand board: four squares, one per brand, its models on
             hover. It replaced the category board on 2026-10-22 at the
             client's request ("no categories here") — categories stay in the
             mega menu and on /kategori. See BrandBoard. */}
      {brandBoard.length > 0 ? (
        <Section label="Markalar">
          <BrandBoard items={brandBoard} />
        </Section>
      ) : null}

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
            products={pick('haftanin', 8, 2)}
            accent="violet"
          />
          <ProductSlider
            eyebrow="Rafa yeni girenler"
            title="Yeni Gelenler"
            href="/yeni-gelenler"
            products={pick('yeni', 8, 11)}
            accent="teal"
          />
        </div>
      </Section>

      {/* 06 — wide campaign banner */}
      <Section>
        {(() => {
          const wide = banner('wide', {
            eyebrow: "CCTV güvenlik sistemleri",
            title: "AHD ve IP kamera sistemleri",
            subtitle: "Kamera, kayıt cihazı ve aksesuarlar; projeler için kurumsal teklif.",
            href: "/kategori/cctv-guvenlik-sistemleri",
            tone: 'koyu',
            productImage: "/mock/products/cutout/dome-white.svg",
          });
          return <WideBanner banner={wide} />;
        })()}
      </Section>

      {/* 07 — promo tile + 4 products */}
      <Section label="Süper fırsat ürünleri">
        <PromoProductRow
          promo={(() => {
            const promo = banner('super-firsat-promo', {
              title: 'Süper Fırsat',
              subtitle: 'Ürünleri',
              href: '/kampanyalar',
              /* A transparent CUTOUT, not the category illustration that stood
                 here. `/mock/categories/*.svg` carry their own background
                 plate, which was invisible while the art was a 45%-opacity
                 texture and became an amorphous purple blob the moment the
                 tile gave it real space. Cutouts composite cleanly onto brand
                 colour — the same pairing CATEGORY_TILES already uses. The
                 shop should upload cutouts here too (admin → Vitrin →
                 Bannerlar → Süper Fırsat kartı). */
              productImage: '/mock/products/cutout/dish-white.svg',
              tone: 'mor',
            });
            // Older content kept this tile's cut-out in `image`.
            const art = promo.productImage ?? promo.image ?? '';
            return { title: promo.title, subtitle: promo.subtitle ?? '', href: promo.href, image: art };
          })()}
          products={pick('super-firsat', 4, 0)}
        />
      </Section>

      {/* 08 — brand showcases (admin → Vitrin → Marka vitrinleri).
             These replace the two category bands that stood here (All In One
             Bilgisayarlar / Oto Ses ve Görüntü): the client wants this stretch
             of the homepage organised by brand, and Tekniva leads because the
             all-in-one band was the model for the whole series. */}
      {brandBands.slice(0, 4).map(brandBand)}

      {/* 08b — full-bleed technical band, placed INSIDE the brand run.
             Measured: the seven showcases ran y=1793→5576 as one unbroken
             3783px stretch on an even 541px pitch. Putting the band after all
             seven left that stretch intact and only capped it; splitting it
             four/three breaks the monotony where it actually occurs, into two
             runs of roughly 1900px.
             Figures are the shop's to set (admin → Vitrin → Neden SEENERGY). */}
      <Section track="bleed">
        <TechBand
          {...(vitrin.techBand ?? {
            eyebrow: 'Neden SEENERGY',
            title: "Güvenlik altyapısında tedarik, tek adresten",
            description:
              "CCTV ve kayıt sistemlerinden network, alarm, yangın algılama ve geçiş kontrolüne, uydu ve seslendirme sistemlerine kadar güvenlik altyapısının ürünleri; hem son kullanıcıya hem kurumsal alıcıya aynı stok derinliğiyle.",
            stats: [
              { value: '12.000+', label: 'Katalogdaki ürün çeşidi' },
              { value: '45+', label: 'Yetkili satıcısı olduğumuz marka' },
              { value: '16:00', label: 'Aynı gün kargo için son saat' },
              { value: '24 ay', label: 'Garanti kapsamındaki ürünler' },
            ],
            cta: { label: 'Kurumsal alım ve bayilik', href: '/toptan-satis' },
          })}
        />
      </Section>

      {/* 08c — the remaining showcases, after the break. */}
      {brandBands.slice(4).map(brandBand)}

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
