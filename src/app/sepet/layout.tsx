import type { Metadata } from 'next';

import { CatalogProvider } from '@/components/catalog-provider';
import { loadProducts } from '@/lib/medusa/catalog';

/**
 * The cart page is a client component, and a client component cannot export
 * `metadata`. This layout exists only to carry it.
 *
 * `noindex, follow` per docs/INFORMATION_ARCHITECTURE §2: cart, wishlist,
 * compare and search are excluded from the index and from the sitemap.
 */
export const metadata: Metadata = {
  title: 'Sepetim',
  robots: { index: false, follow: true },
};

export default async function CartLayout({ children }: { children: React.ReactNode }) {
  return <CatalogProvider products={await loadProducts()}>{children}</CatalogProvider>;
}
