'use client';

/**
 * The compare list's server-side half, fetched from /api/compare: a summary
 * per product (for the floating bar, which renders on pages that load no
 * catalogue) and each product's own technical sheet (for the compare table).
 *
 * Kept in a module-level cache, so the bar and the page share what either
 * fetched and adding a fourth product fetches one product, not four.
 */

import { useEffect, useState } from 'react';

import type { SpecGroup } from '@/data/specs';

export interface CompareItem {
  id: string;
  slug: string;
  name: string;
  brand: string;
  sku: string;
  image: string;
  specs: SpecGroup[];
}

const cache = new Map<string, CompareItem>();

export function useCompareItems(ids: string[]): { items: Record<string, CompareItem>; loading: boolean } {
  const key = ids.join(',');
  const [, setVersion] = useState(0);
  const missing = ids.filter((id) => !cache.has(id));
  const missingKey = missing.join(',');

  useEffect(() => {
    if (!missingKey) return;
    let alive = true;
    fetch(`/api/compare?ids=${encodeURIComponent(missingKey)}`)
      .then((response) => (response.ok ? response.json() : { products: [] }))
      .then((json: { products: CompareItem[] }) => {
        for (const item of json.products) cache.set(item.id, item);
        if (alive) setVersion((version) => version + 1);
      })
      .catch(() => {
        /* offline or the backend is down: the bar shows what it has */
      });
    return () => {
      alive = false;
    };
  }, [missingKey]);

  const items: Record<string, CompareItem> = {};
  for (const id of key ? key.split(',') : []) {
    const item = cache.get(id);
    if (item) items[id] = item;
  }
  return { items, loading: missing.length > 0 };
}
