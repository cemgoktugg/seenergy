'use server';

/**
 * Cart server actions — the only way the browser touches the Medusa cart.
 *
 * The cart id lives in an httpOnly cookie, so client code can neither read it
 * nor forge one; every mutation happens here, on the server, with the
 * publishable key. Each action returns the full `CartSummary`, which is what
 * lets the header badge, the cards and the cart page all update from a single
 * response instead of re-fetching.
 *
 * Errors are returned, not thrown: a thrown server-action error reaches the
 * client as a generic message in production, and "stokta yeterli ürün yok"
 * is information the visitor needs verbatim.
 */

import { getRegion } from '@/lib/medusa/catalog';
import { readCartId, retrieveCart, writeCartId } from '@/lib/medusa/cart-cookie';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { toCartSummary, type CartResult, type StoreCart } from '@/lib/medusa/cart-summary';

/** The visitor's open cart, or a new one when they have none (or a stale id). */
async function ensureCart(): Promise<StoreCart> {
  const id = await readCartId();
  const existing = id ? await retrieveCart(id) : null;
  if (existing) return existing;

  const region = await getRegion();
  const { cart } = await medusa<{ cart: StoreCart }>('/store/carts', {
    method: 'POST',
    body: { region_id: region.id },
    cache: 'no-store',
  });
  await writeCartId(cart.id);
  return cart;
}

function failure(error: unknown): CartResult {
  if (error instanceof MedusaError) {
    if (/inventory/i.test(error.message)) {
      return { ok: false, error: 'Stokta bu kadar ürün yok. Adedi azaltıp tekrar deneyin.' };
    }
    return { ok: false, error: 'Sepet güncellenemedi. Lütfen tekrar deneyin.' };
  }
  return { ok: false, error: 'Mağaza sunucusuna ulaşılamıyor. Birazdan tekrar deneyin.' };
}

/** Read-only: never creates a cart just because a page asked what is in it. */
export async function getCart(): Promise<CartResult> {
  try {
    const id = await readCartId();
    const cart = id ? await retrieveCart(id) : null;
    return { ok: true, cart: toCartSummary(cart) };
  } catch (error) {
    return failure(error);
  }
}

export async function addToCart(variantId: string, quantity = 1): Promise<CartResult> {
  try {
    const cart = await ensureCart();
    const { cart: next } = await medusa<{ cart: StoreCart }>(`/store/carts/${cart.id}/line-items`, {
      method: 'POST',
      body: { variant_id: variantId, quantity },
      cache: 'no-store',
    });
    return { ok: true, cart: toCartSummary(next) };
  } catch (error) {
    return failure(error);
  }
}

export async function updateLine(lineId: string, quantity: number): Promise<CartResult> {
  if (quantity < 1) return removeLine(lineId);
  try {
    const cart = await ensureCart();
    const { cart: next } = await medusa<{ cart: StoreCart }>(
      `/store/carts/${cart.id}/line-items/${lineId}`,
      { method: 'POST', body: { quantity }, cache: 'no-store' },
    );
    return { ok: true, cart: toCartSummary(next) };
  } catch (error) {
    return failure(error);
  }
}

export async function removeLine(lineId: string): Promise<CartResult> {
  try {
    const cart = await ensureCart();
    const { parent } = await medusa<{ parent: StoreCart }>(
      `/store/carts/${cart.id}/line-items/${lineId}`,
      { method: 'DELETE', cache: 'no-store' },
    );
    return { ok: true, cart: toCartSummary(parent) };
  } catch (error) {
    return failure(error);
  }
}
