/**
 * Brand listing — `/marka/[slug]`.
 *
 * The same shell as a category, over a brand's products: the product page's
 * "diğer modeller" rail and the header's brand links both land here, so the
 * brand rail's "Tümünü gör" finally goes somewhere real.
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CatalogShell } from '@/components/catalog-shell';
import { brandSlug } from '@/data/catalog';
import { BRANDS } from '@/data/site';
import type { SearchParams } from '@/lib/catalog-query';
import { loadCatalog } from '@/lib/medusa/catalog';

/**
 * Brands the site already names before the catalogue carries them: the
 * homepage's brand strip and the client's four brand banners. Their pages
 * open on the shell's coming-soon panel under the brand's own name; only a
 * slug nobody links to gets the plain list of brands below.
 */
const ANNOUNCED: Record<string, string> = {
  ...Object.fromEntries(BRANDS.map((brand) => [brand.href.split('/').pop()!, brand.name])),
  dahua: 'Dahua',
  hikvision: 'Hikvision',
  unv: 'UNV',
  neutron: 'Neutron',
};

export async function generateStaticParams() {
  const { brands } = await loadCatalog();
  return brands.map((brand) => ({ slug: brandSlug(brand) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { brandFromSlug } = await loadCatalog();
  const brand = brandFromSlug(slug) ?? ANNOUNCED[slug];
  return {
    title: brand ? `${brand} ürünleri` : 'Marka',
    alternates: { canonical: `/marka/${slug}` },
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, query, { brands: catalogBrands, brandFromSlug, byBrandSlug }] =
    await Promise.all([params, searchParams, loadCatalog()]);
  const brand = brandFromSlug(slug) ?? ANNOUNCED[slug];

  if (!brand) {
    const brands = [...catalogBrands].sort((a, b) => a.localeCompare(b, 'tr'));
    return (
      <div className="container-main py-16">
        <div className="mx-auto max-w-2xl rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-6 py-12 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
            Katalog kapsamı
          </p>
          <h1 className="mt-3 text-[20px] font-extrabold tracking-tight text-text-primary dt:text-[24px]">
            Bu markanın ürünleri henüz listelenmiyor
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Katalogda ürünü bulunan markalar:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5">
            {brands.map((item) => (
              <li key={item}>
                <Link
                  href={`/marka/${brandSlug(item)}`}
                  className="inline-flex rounded-full border border-line-strong px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const scope = byBrandSlug(slug);

  return (
    <CatalogShell
      eyebrow="Marka"
      title={brand}
      description={
        scope.length
          ? `${brand} markasının katalogdaki ${scope.length} modeli.`
          : `${brand} ürünleri için fiyat ve stok bilgisini bizden alabilirsiniz.`
      }
      basePath={`/marka/${slug}`}
      scope={scope}
      params={query}
    />
  );
}
