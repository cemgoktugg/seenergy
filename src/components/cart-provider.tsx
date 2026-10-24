'use client';

/**
 * The Medusa cart, shared by the header badge, product cards, the product page
 * and the cart page.
 *
 * Pages stay static: nothing here reads a cookie during the server render.
 * The provider asks the server for the cart once it mounts, and every mutation
 * returns the whole cart, so one response updates every surface at once.
 *
 * Mutations are QUEUED, not fired concurrently. The first add creates the cart
 * and sets its cookie; a second add racing it would find no cookie yet and
 * create a second cart, and one of the two lines would silently vanish.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

import { addToCart, getCart, removeLine, updateLine } from '@/lib/medusa/cart';
import type { CartResult, CartSummary } from '@/lib/medusa/cart-summary';

interface CartValue {
  cart: CartSummary | null;
  /** False until the first server read has answered. */
  ready: boolean;
  /** True while a mutation is in flight. */
  busy: boolean;
  error: string | null;
  count: number;
  /** Quantity of this variant already in the cart (0 when absent). */
  quantityOf: (variantId: string) => number;
  /** `label` names the product in the "sepete eklendi" confirmation. */
  add: (variantId: string, quantity?: number, label?: string) => Promise<boolean>;
  setQuantity: (lineId: string, quantity: number) => Promise<boolean>;
  remove: (lineId: string) => Promise<boolean>;
  /** Re-read from the server — after checkout completes, for instance. */
  refresh: () => Promise<void>;
  dismissError: () => void;
  /** Increments on every successful add — the header badge keys its pulse on it. */
  bump: number;
}

const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  /* The add-to-cart confirmation. Without it the only sign an add worked was
     a digit changing in the header, off to the side of where the visitor was
     looking — easy to miss, and a missed add gets clicked again. */
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(null);
  const [bump, setBump] = useState(0);
  const queue = useRef<Promise<unknown>>(Promise.resolve());

  const apply = useCallback((result: CartResult): boolean => {
    if (result.ok) {
      setCart(result.cart);
      setError(null);
      return true;
    }
    setError(result.error);
    return false;
  }, []);

  const run = useCallback(
    (action: () => Promise<CartResult>): Promise<boolean> => {
      setPending((n) => n + 1);
      const next = queue.current
        .catch(() => undefined)
        .then(action)
        .then(apply, () => apply({ ok: false, error: 'Sepet güncellenemedi. Lütfen tekrar deneyin.' }))
        .finally(() => setPending((n) => n - 1));
      queue.current = next;
      return next;
    },
    [apply],
  );

  const add = useCallback(
    async (variantId: string, quantity = 1, label?: string) => {
      const ok = await run(() => addToCart(variantId, quantity));
      if (ok) {
        setBump((n) => n + 1);
        setNotice({ id: Date.now(), text: label ? `${label} sepete eklendi.` : 'Ürün sepete eklendi.' });
      }
      return ok;
    },
    [run],
  );

  // A confirmation is a moment, not a fixture: it leaves on its own.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const refresh = useCallback(async () => {
    await run(getCart);
    setReady(true);
  }, [run]);

  useEffect(() => {
    let cancelled = false;
    getCart()
      .then((result) => {
        if (!cancelled) apply(result);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [apply]);

  const value = useMemo<CartValue>(
    () => ({
      cart,
      ready,
      busy: pending > 0,
      error,
      count: cart?.count ?? 0,
      quantityOf: (variantId) =>
        cart?.lines.find((line) => line.variantId === variantId)?.quantity ?? 0,
      add,
      setQuantity: (lineId, quantity) => run(() => updateLine(lineId, quantity)),
      remove: (lineId) => run(() => removeLine(lineId)),
      refresh,
      dismissError: () => setError(null),
      bump,
    }),
    [cart, ready, pending, error, run, refresh, add, bump],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* One announcement point for every cart failure — out of stock, backend
          down — wherever the button that caused it sits on the page. */}
      <div aria-live="assertive" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 dt:bottom-6">
        {error ? (
          <div
            role="alert"
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-(--card-radius) border border-danger bg-surface-card px-4 py-3 text-[14px] text-text-primary shadow-e3"
          >
            <span className="min-w-0 flex-1">{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="shrink-0 text-[13px] font-semibold text-danger-ink hover:underline"
            >
              Kapat
            </button>
          </div>
        ) : null}
      </div>
      {/* Success is polite, failure assertive; a failure replaces any
          confirmation rather than stacking under it. */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 dt:bottom-6">
        {notice && !error ? (
          <div
            key={notice.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-md animate-[toast-in_320ms_var(--ease-out)_both] items-center gap-3 rounded-(--card-radius) border border-line bg-surface-card py-2.5 pl-3 pr-2 text-[14px] text-text-primary shadow-e3"
          >
            <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-soft text-brand-text">
              <Check size={16} strokeWidth={2.5} />
            </span>
            <span className="line-clamp-2 min-w-0 flex-1 leading-snug">{notice.text}</span>
            <Link
              href="/sepet"
              onClick={() => setNotice(null)}
              className="inline-flex items-center shrink-0 rounded-full bg-brand px-3.5 h-9 text-[13px] font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              Sepete git
            </Link>
            <button
              type="button"
              onClick={() => setNotice(null)}
              aria-label="Bildirimi kapat"
              className="relative grid h-8 w-8 shrink-0 place-items-center rounded-full text-text-secondary transition-colors before:absolute before:-inset-1.5 before:content-[''] hover:bg-surface-page hover:text-text-primary"
            >
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </CartContext.Provider>
  );
}

export function useCart(): CartValue {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
