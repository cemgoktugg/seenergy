/**
 * Markalar — `/markalar` (2026-10-24).
 *
 * The homepage's "Markalarımız" band and its "Tüm markalar" link land here;
 * the route used to fall through to the "not built yet" panel. It shows the
 * same two brand cards (own brand, authorised brands) and then every brand
 * the catalogue carries, alphabetically, with its product count and a link to
 * its listing, under a steel monogram.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { BrandShowcase } from '@/components/brand-showcase';
import { SectionHeading } from '@/components/section-heading';
import { brandSlug } from '@/data/catalog';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'Markalarımız',
  description: 'SEENERGY ve resmi yetkili satıcısı olduğumuz güvenlik markaları; katalogdaki tüm markalar ve ürünleri.',
};

const titleCase = (handle: string) =>
  handle.length <= 3 ? handle.toUpperCase() : handle.charAt(0).toUpperCase() + handle.slice(1);

export default async function BrandsPage() {
  const [{ brands, byBrandSlug, brandFromSlug }, vitrin] = await Promise.all([loadCatalog(), loadVitrin()]);

  const all = [...brands]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b, 'tr'))
    .map((name) => {
      const slug = brandSlug(name);
      return { name, slug, count: byBrandSlug(slug).length };
    });

  const own = vitrin.banners['dual-1'] ?? {
    eyebrow: 'Kendi markalarımız',
    title: 'Tescilli Markalarımız',
    href: '/marka/seenergy',
    tone: 'koyu' as const,
  };
  const partners = vitrin.banners['dual-2'] ?? {
    eyebrow: 'Yetkili satıcılık',
    title: 'Resmi Yetkili Satıcısı Olduğumuz Markalar',
    href: '/markalar',
    tone: 'acik' as const,
  };
  const partnerBrands = vitrin.brandBoard.map(({ brandHandle, logo }) => ({
    name: brandFromSlug(brandHandle) ?? titleCase(brandHandle),
    href: `/marka/${brandHandle}`,
    logo,
  }));

  return (
    <div className="container-main pb-12 pt-5 dt:pt-8">
      <nav aria-label="Konum" className="text-[12px] text-text-secondary">
        <Link href="/" className="hover:text-text-primary">
          Ana sayfa
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <span className="font-medium text-text-primary">Markalar</span>
      </nav>

      <h1 className="mt-3 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">Markalarımız</h1>
      <p className="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-text-secondary">
        Kendi markamız SEENERGY ve resmi yetkili satıcısı olduğumuz güvenlik markaları ile katalogdaki tüm
        markalar. Bir markaya tıklayarak ürünlerini görebilirsiniz.
      </p>

      <div className="pt-5 dt:pt-7">
        <BrandShowcase own={own} ownBrands={vitrin.ownBrands} partners={partners} brands={partnerBrands} />
      </div>

      <section aria-labelledby="tum-markalar" className="pt-(--space-section)">
        <SectionHeading eyebrow="Katalog" title={`Tüm Markalar (${all.length})`} id="tum-markalar" />
        <ul className="grid grid-cols-2 gap-2.5 pt-4 sm:grid-cols-3 lg:grid-cols-5 dt:gap-3">
          {all.map((brand) => (
            <li key={brand.slug}>
              <Link
                href={`/marka/${brand.slug}`}
                className="group flex h-full items-center gap-3 rounded-(--card-radius) border border-line bg-surface-card px-3 py-3 shadow-e1 transition-[transform,box-shadow,border-color] duration-(--duration-base) hover:-translate-y-0.5 hover:border-line-strong hover:shadow-e2"
              >
                {/* A steel monogram, not the generated mark: at this size the
                    mock marks' lettering is unreadable, and the name is
                    beside it anyway. */}
                <span
                  aria-hidden
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-[14px] font-extrabold tracking-tight text-white shadow-e1 transition-transform duration-(--duration-base) group-hover:scale-105"
                >
                  {brand.name.slice(0, 2).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[14px] font-bold text-text-primary">{brand.name}</span>
                  <span className="block text-[12px] text-text-secondary">{brand.count} ürün</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
