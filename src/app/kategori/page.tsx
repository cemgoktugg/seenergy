/**
 * All categories — `/kategori`.
 *
 * The whole tree on one page: each top-level category as a card with its
 * product count, and its subcategories listed inside it. It is where the
 * homepage board's "Tüm Kategoriler" cell goes, and where a product with no
 * category of its own points its breadcrumb (categoryMeta's fallback) — both
 * used to land on the generic "not ready yet" page.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { CATEGORY_ICONS } from '@/components/category-icons';
import { CATEGORY_TREE, categoryHref } from '@/data/categories';
import { loadCatalog } from '@/lib/medusa/catalog';

export const metadata: Metadata = {
  title: 'Tüm Kategoriler',
  alternates: { canonical: '/kategori' },
};

export default async function CategoriesPage() {
  const { byCategory } = await loadCatalog();

  return (
    <div className="container-main pb-12 pt-4 dt:pt-6">
      <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-b from-surface-card to-surface-page shadow-e1">
        <span aria-hidden className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4" />
        <div className="px-4 py-5 dt:px-6 dt:py-6">
          <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-text-secondary">
            <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
            Katalog
          </p>
          <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
            Tüm Kategoriler
          </h1>
          <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-text-secondary">
            {CATEGORY_TREE.length} ana kategori ve alt kategorileri.
          </p>
        </div>
      </div>

      {/* Columns, not a grid: a grid row stretched every card to the tallest
          one, so a category without subcategories sat in a mostly empty box
          beside CCTV's list of four. Columns size each card to its content
          and keep the client's order, reading down each column. */}
      <ul className="mt-(--space-grid-gap) columns-1 gap-(--space-grid-gap) sm:columns-2 dt:columns-3">
        {CATEGORY_TREE.map((node) => {
          const href = categoryHref(node.slug);
          const Icon = CATEGORY_ICONS[href];
          const count = byCategory(node.slug).length;
          return (
            <li
              key={node.slug}
              className="mb-(--space-grid-gap) flex break-inside-avoid flex-col overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
            >
              <Link
                href={href}
                className="group flex items-center gap-3 px-4 py-4 transition-colors duration-(--duration-fast) hover:bg-brand-soft dt:px-5"
              >
                {Icon && (
                  <span
                    aria-hidden
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1"
                  >
                    <Icon size={18} strokeWidth={1.9} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-extrabold leading-tight tracking-tight text-text-primary">
                    {node.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] tabular-nums text-text-secondary">
                    {count ? `${count} ürün` : 'Yakında'}
                    {node.children ? ` · ${node.children.length} alt kategori` : ''}
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  strokeWidth={2.25}
                  aria-hidden
                  className="shrink-0 text-text-secondary transition-transform duration-(--duration-base) group-hover:translate-x-0.5"
                />
              </Link>

              {node.children && (
                <ul className="border-t border-line px-2 py-2">
                  {node.children.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={categoryHref(child.slug)}
                        className="flex items-center justify-between gap-2 rounded-(--card-radius) px-3 py-2 text-[14px] font-medium text-text-primary transition-colors duration-(--duration-fast) hover:bg-surface-page"
                      >
                        {child.label}
                        <span className="text-[12px] tabular-nums text-text-secondary">
                          {byCategory(child.slug).length}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
