/**
 * Search results — `/arama`.
 *
 * The header's search form has always posted here; until now it landed on the
 * "not built" placeholder. It is the same listing shell as a category, over the
 * products a query matches, so filtering and sorting a result set works exactly
 * as it does everywhere else.
 *
 * `noindex, follow` per docs/INFORMATION_ARCHITECTURE §2: a search result is
 * not a landing page.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';

import { CatalogShell } from '@/components/catalog-shell';
import { CATEGORY_META, brandSlug } from '@/data/catalog';
import { hrefWith, searchProducts, type SearchParams } from '@/lib/catalog-query';
import { loadCatalog } from '@/lib/medusa/catalog';

export const metadata: Metadata = {
  title: 'Arama',
  robots: { index: false, follow: true },
};

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const [params, { products, brands: catalogBrands }] = await Promise.all([
    searchParams,
    loadCatalog(),
  ]);
  const query = first(params.q).trim();

  /* No query: a prompt, not an empty result. Telling someone "0 ürün bulundu"
     when they have not searched for anything yet is just wrong. */
  if (query === '') {
    const brands = [...catalogBrands]
      .sort((a, b) => a.localeCompare(b, 'tr'))
      .slice(0, 12);

    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-text"
          >
            <Search size={22} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[30px]">
            Ne aramıştınız?
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün adı, marka veya ürün kodu yazabilirsiniz. Üst taraftaki arama
            alanına <kbd className="rounded border border-line-strong bg-surface-card px-1.5 py-0.5 font-mono text-[12px]">/</kbd> ile
            hızlıca geçebilirsiniz.
          </p>
        </div>

        <section className="mx-auto mt-10 max-w-3xl" aria-label="Kategoriler">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
            Kategoriler
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {Object.values(CATEGORY_META).map((meta) => (
              <li key={meta.href}>
                <Link
                  href={meta.href}
                  className="inline-flex rounded-full border border-line-strong bg-surface-card px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {meta.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
            Markalar
          </p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {brands.map((brand) => (
              <li key={brand}>
                <Link
                  href={`/marka/${brandSlug(brand)}`}
                  className="inline-flex rounded-full border border-line-strong bg-surface-card px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  const matches = searchProducts(products, query);

  if (matches.length === 0) {
    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-2xl rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-6 py-12 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
            0 sonuç
          </p>
          <h1 className="mt-3 text-[20px] font-extrabold tracking-tight text-text-primary dt:text-[24px]">
            “{query}” için ürün bulunamadı
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün kodunun tamamı yerine bir parçasını deneyin, ya da kategoriden
            ilerleyin.
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5">
            {Object.values(CATEGORY_META)
              .slice(0, 6)
              .map((meta) => (
                <li key={meta.href}>
                  <Link
                    href={meta.href}
                    className="inline-flex rounded-full border border-line-strong px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                  >
                    {meta.label}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <CatalogShell
      eyebrow="Arama sonuçları"
      title={`“${query}”`}
      description={`${matches.length} ürün eşleşti.`}
      basePath="/arama"
      /* Keeps `q` when the filters are cleared. */
      clearHref={hrefWith('/arama', {}, { q: query })}
      scope={matches}
      params={params}
    />
  );
}
