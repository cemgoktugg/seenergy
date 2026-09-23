/**
 * Category listing — `/kategori/[slug]`.
 *
 * The navigation names far more categories than the mock catalogue carries, so
 * an unknown slug is answered honestly: it says the category is not in the
 * catalogue yet and offers the ones that are, rather than 404ing a link the
 * site's own menu just offered.
 *
 * The canonical drops every filter parameter (docs/INFORMATION_ARCHITECTURE §2).
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CatalogShell } from '@/components/catalog-shell';
import { CATEGORY_META, byCategory, categoryMeta } from '@/data/catalog';
import type { SearchParams } from '@/lib/catalog-query';

const keyFor = (slug: string) =>
  Object.keys(CATEGORY_META).find((key) => CATEGORY_META[key].href === `/kategori/${slug}`);

export function generateStaticParams() {
  return Object.values(CATEGORY_META).map((meta) => ({
    slug: meta.href.replace('/kategori/', ''),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const key = keyFor(slug);
  const title = key ? categoryMeta(key).label : 'Kategori';
  return { title, alternates: { canonical: `/kategori/${slug}` } };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const key = keyFor(slug);

  if (!key) {
    return (
      <div className="container-main py-16">
        <div className="mx-auto max-w-2xl rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-6 py-12 text-center">
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary">
            Katalog kapsamı
          </p>
          <h1 className="mt-3 text-[20px] font-extrabold tracking-tight text-text-primary dt:text-[24px]">
            Bu kategori henüz kataloğa eklenmedi
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Menüde yer alıyor, ancak ürünleri bu sürümde listelenmiyor. Aşağıdaki
            kategoriler şu an dolu:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5">
            {Object.entries(CATEGORY_META).map(([, meta]) => (
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

  const meta = categoryMeta(key);
  const scope = byCategory(key);

  return (
    <CatalogShell
      eyebrow="Kategori"
      title={meta.label}
      /* Second sentence removed: it said "you can narrow by brand, price and
         stock" next to a 264px rail that lists exactly those three groups.
         Prose describing visible controls is filler. */
      description={`${meta.label} kategorisindeki ${scope.length} ürün.`}
      basePath={meta.href}
      scope={scope}
      params={query}
    />
  );
}
