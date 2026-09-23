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
import { PRODUCTS, brandFromSlug, brandSlug, byBrandSlug } from '@/data/catalog';
import type { SearchParams } from '@/lib/catalog-query';

export function generateStaticParams() {
  return [...new Set(PRODUCTS.map((product) => brandSlug(product.brand)))].map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const brand = brandFromSlug(slug);
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
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const brand = brandFromSlug(slug);

  if (!brand) {
    const brands = [...new Set(PRODUCTS.map((product) => product.brand))].sort((a, b) =>
      a.localeCompare(b, 'tr'),
    );
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
      description={`${brand} markasının katalogdaki ${scope.length} modeli.`}
      basePath={`/marka/${slug}`}
      scope={scope}
      params={query}
    />
  );
}
