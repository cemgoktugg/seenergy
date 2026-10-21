import { NextResponse, type NextRequest } from 'next/server';

import { loadCatalog, loadProductDetails } from '@/lib/medusa/catalog';

/* COMPARE_LIMIT's value. Not imported: it lives in a 'use client' module, and
   a server import of one receives a client reference, not the number. */
const LIMIT = 4;

/**
 * GET /api/compare?ids=<id>,<id>…
 *
 * What the compare list needs that only the server can read: a summary of
 * each stored id for the floating compare bar (shown on every page, where no
 * catalogue is loaded), and each product's own technical sheet for the
 * compare table (metadata.specs, which is kept out of `Product` on purpose).
 *
 * Both come from the same cached Store API response the pages use, so this
 * costs no extra Medusa round trip. Unknown ids are dropped — a product
 * unpublished since it was added simply leaves the list.
 */
export async function GET(request: NextRequest) {
  const ids = (request.nextUrl.searchParams.get('ids') ?? '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, LIMIT);

  const { byId } = await loadCatalog();
  const products = await Promise.all(
    ids.map(async (id) => {
      const product = byId(id);
      if (!product) return null;
      const { specs } = await loadProductDetails(product.id);
      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        sku: product.sku,
        image: product.image,
        specs,
      };
    }),
  );

  return NextResponse.json({ products: products.filter(Boolean) });
}
