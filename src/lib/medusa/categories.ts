import { cache } from 'react';

import { DEFAULT_CATEGORY_TREE, setCategoryTree, type CategoryNode } from '@/data/categories';
import { medusa } from '@/lib/medusa/client';

// The same tag as CATALOG_TAG in ./catalog, which imports this module.
const CATALOG_TAG = 'catalog';

/**
 * The category tree from Medusa (2026-11-03): the shop adds and deletes
 * categories in the admin, and the menu, the footer, /kategori and the category
 * pages follow without a code change.
 *
 * The Store API lists only active, public categories, so the retired
 * pre-2026-09 ones (kept inactive) stay out. Two levels, as the menu draws
 * them: a category deeper than that is not shown. Order is the admin's rank.
 * `short` (the nav bar's label) and `spec` (the spec template) come from the
 * category's metadata, else from the hand-written tree for the categories it
 * knows, so the client's fourteen keep theirs.
 *
 * Cached under the `catalog` tag with the products — an admin save flushes
 * both. Unreachable backend: the hand-written tree.
 */

interface StoreCategory {
  id: string;
  name: string;
  handle: string;
  rank: number | null;
  parent_category_id: string | null;
  metadata: Record<string, unknown> | null;
}

const known = new Map(
  DEFAULT_CATEGORY_TREE.flatMap((node) => [node, ...(node.children ?? [])]).map((node) => [node.slug, node]),
);

const text = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined;

function toNode(category: StoreCategory): CategoryNode {
  const fallback = known.get(category.handle);
  const short = text(category.metadata?.short) ?? fallback?.short;
  const spec = text(category.metadata?.spec) ?? fallback?.spec;
  return { slug: category.handle, label: category.name, ...(short && { short }), ...(spec && { spec }) };
}

export function buildCategoryTree(categories: StoreCategory[]): CategoryNode[] {
  const byRank = (a: StoreCategory, b: StoreCategory) =>
    (a.rank ?? 0) - (b.rank ?? 0) || a.name.localeCompare(b.name, 'tr');
  const tops = categories.filter((c) => !c.parent_category_id).sort(byRank);
  return tops.map((top) => {
    const children = categories.filter((c) => c.parent_category_id === top.id).sort(byRank).map(toNode);
    return { ...toNode(top), ...(children.length > 0 && { children }) };
  });
}

export const loadCategoryTree = cache(async (): Promise<CategoryNode[]> => {
  let tree: CategoryNode[];
  try {
    const { product_categories } = await medusa<{ product_categories: StoreCategory[] }>('/store/product-categories', {
      query: { limit: 500, fields: 'id,name,handle,rank,parent_category_id,metadata' },
      next: { revalidate: 60, tags: [CATALOG_TAG] },
    });
    tree = buildCategoryTree(product_categories);
    // An empty answer is a broken backend, not a shop without categories.
    if (tree.length === 0) tree = DEFAULT_CATEGORY_TREE;
  } catch (error) {
    if (process.env.SEENERGY_IMAGE_BUILD !== '1') console.warn('[seenergy] category tree unavailable, using the default:', error);
    tree = DEFAULT_CATEGORY_TREE;
  }
  setCategoryTree(tree);
  return tree;
});
