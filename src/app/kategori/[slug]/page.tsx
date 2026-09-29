/**
 * Category listing — `/kategori/[slug]`, for every category and subcategory in
 * the tree (src/data/categories.ts).
 *
 * A top-level category lists its subcategories' products too, and both levels
 * carry the same row of subcategory links under the heading — "Tümü" plus each
 * subcategory with its count — so the tree can be walked without the menu. A
 * subcategory's eyebrow names its parent.
 *
 * An unknown slug is answered honestly: it says the category is not in the
 * catalogue and offers the ones that are, rather than 404ing.
 *
 * The canonical drops every filter parameter (docs/INFORMATION_ARCHITECTURE §2).
 */

import type { Metadata } from 'next';
import Link from 'next/link';

import { CatalogShell } from '@/components/catalog-shell';
import { CATEGORY_TREE, categoryHref } from '@/data/categories';
import { CATEGORY_META, categoryMeta } from '@/data/catalog';
import type { SearchParams } from '@/lib/catalog-query';
import { loadCatalog } from '@/lib/medusa/catalog';

const keyFor = (slug: string) => (slug in CATEGORY_META ? slug : undefined);

export function generateStaticParams() {
  return Object.keys(CATEGORY_META).map((slug) => ({ slug }));
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

function Chip({ href, label, count, active }: { href: string; label: string; count: number; active: boolean }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-(--duration-fast) ${
        active
          ? 'border-brand bg-brand text-white'
          : 'border-line-strong bg-surface-card text-text-primary hover:border-brand'
      }`}
    >
      {label}
      <span className={`text-[11px] font-medium tabular-nums ${active ? 'text-white/70' : 'text-text-secondary'}`}>
        {count}
      </span>
    </Link>
  );
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
            Bu kategori kataloğumuzda yok
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Aradığınız bölüm aşağıdaki kategorilerden birinde olabilir:
          </p>
          <ul className="mt-6 flex flex-wrap justify-center gap-1.5">
            {CATEGORY_TREE.map((node) => (
              <li key={node.slug}>
                <Link
                  href={categoryHref(node.slug)}
                  className="inline-flex rounded-full border border-line-strong px-3 py-1.5 text-[13px] font-medium text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  {node.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  const meta = categoryMeta(key);
  const { byCategory } = await loadCatalog();
  const scope = byCategory(key);

  /* The subcategory row: this category's children, or — on a subcategory —
     its siblings, with "Tümü" leading back to the parent. */
  const parentKey = meta.parent ?? key;
  const parent = categoryMeta(parentKey);
  const lead =
    parent.children.length > 0 ? (
      <nav aria-label="Alt kategoriler" className="mt-4">
        <ul className="flex flex-wrap gap-1.5">
          <li>
            <Chip href={parent.href} label="Tümü" count={byCategory(parentKey).length} active={key === parentKey} />
          </li>
          {parent.children.map((child) => (
            <li key={child}>
              <Chip
                href={categoryMeta(child).href}
                label={categoryMeta(child).label}
                count={byCategory(child).length}
                active={key === child}
              />
            </li>
          ))}
        </ul>
      </nav>
    ) : undefined;

  return (
    <CatalogShell
      eyebrow={meta.parent ? parent.label : 'Kategori'}
      title={meta.label}
      /* Second sentence removed: it said "you can narrow by brand, price and
         stock" next to a 264px rail that lists exactly those three groups.
         Prose describing visible controls is filler. */
      description={
        scope.length
          ? `${meta.label} kategorisindeki ${scope.length} ürün.`
          : `${meta.label} kategorisine henüz ürün eklenmedi.`
      }
      basePath={meta.href}
      scope={scope}
      params={query}
      lead={lead}
    />
  );
}
