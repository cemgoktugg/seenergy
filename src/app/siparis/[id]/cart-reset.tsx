'use client';

import { useEffect } from 'react';

import { useCart } from '@/components/cart-provider';

/**
 * The order action cleared the cart cookie on the server, but CartProvider
 * still holds the cart it last read — the header badge would keep showing the
 * items just ordered. Re-reading once on arrival brings it back to empty.
 */
export function CartReset() {
  const { refresh } = useCart();
  useEffect(() => {
    void refresh();
  }, [refresh]);
  return null;
}
