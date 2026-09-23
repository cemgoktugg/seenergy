'use client';

/**
 * The catalogue, handed from a server layout to client pages.
 *
 * Favourites and compare are lists of product ids kept in the browser, so the
 * pages that render them are client components and cannot `await` Medusa.
 * Their layouts load the catalogue on the server and pass it down through
 * this provider; the pages then resolve ids with the same `byId` the server
 * uses.
 *
 * The whole catalogue crosses the wire, which is fine at 59 products and is
 * limited to these noindex pages. Past a few hundred, fetch only the stored ids.
 */

import { createContext, useContext, useMemo } from 'react';

import { indexCatalog, type Catalog, type Product } from '@/data/catalog';

const CatalogContext = createContext<Catalog | null>(null);

export function CatalogProvider({
  products,
  children,
}: {
  products: Product[];
  children: React.ReactNode;
}) {
  const catalog = useMemo(() => indexCatalog(products), [products]);
  return <CatalogContext.Provider value={catalog}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): Catalog {
  const context = useContext(CatalogContext);
  if (!context) throw new Error('useCatalog must be used inside <CatalogProvider>');
  return context;
}
