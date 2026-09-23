import { cookies } from 'next/headers';

import { MedusaError, medusa } from '@/lib/medusa/client';
import type { StoreCart } from '@/lib/medusa/cart-summary';

/**
 * The cart cookie and the one lookup through it.
 *
 * Kept out of `cart.ts` because that file is `'use server'`, where every export
 * becomes a client-callable action — reading or clearing the cart id is a
 * server detail, not something a browser should be able to invoke.
 */

const CART_COOKIE = 'seenergy_cart';

export async function readCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

export async function writeCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearCartId() {
  (await cookies()).delete(CART_COOKIE);
}

/** The open cart behind an id; null when it is gone or has become an order. */
export async function retrieveCart(id: string): Promise<StoreCart | null> {
  try {
    const { cart } = await medusa<{ cart: StoreCart }>(`/store/carts/${id}`, { cache: 'no-store' });
    return cart.completed_at ? null : cart;
  } catch (error) {
    if (error instanceof MedusaError && error.status === 404) return null;
    throw error;
  }
}

/** The visitor's open cart, if they have one. */
export async function currentCart(): Promise<StoreCart | null> {
  const id = await readCartId();
  return id ? retrieveCart(id) : null;
}
