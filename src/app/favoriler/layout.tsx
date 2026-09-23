import type { Metadata } from 'next';

import { CatalogProvider } from '@/components/catalog-provider';
import { loadProducts } from '@/lib/medusa/catalog';

/**
 * Carries the metadata the client page cannot export itself.
 * `noindex, follow` per docs/INFORMATION_ARCHITECTURE §2.
 */
export const metadata: Metadata = {
  title: 'Favorilerim',
  robots: { index: false, follow: true },
};

export default async function FavouritesLayout({ children }: { children: React.ReactNode }) {
  return <CatalogProvider products={await loadProducts()}>{children}</CatalogProvider>;
}
