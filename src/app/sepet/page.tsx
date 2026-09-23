'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * Cart — `/sepet`.
 *
 * A client route because the cart is client state: it lives in `localStorage`
 * and nothing is ever sent anywhere. The page says so plainly rather than
 * implying an order can be placed — the footer already states this is a demo
 * store with no order or payment flow, and a checkout button that silently does
 * nothing would contradict it.
 *
 * Totals are computed from the catalogue, never stored: a price kept in the
 * cart would go stale the moment the catalogue changed.
 */

import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';

import { useStore } from '@/components/cart-store';
import { useCatalog } from '@/components/catalog-provider';
import { formatPrice } from '@/data/catalog';

export default function CartPage() {
  const { state, ready, remove, clear } = useStore();
  const { byId } = useCatalog();

  const lines = state.cart
    .map((id) => byId(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const total = lines.reduce((sum, product) => sum + product.price, 0);
  const saving = lines.reduce(
    (sum, product) => sum + (product.compareAtPrice ? product.compareAtPrice - product.price : 0),
    0,
  );

  if (ready && lines.length === 0) {
    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-xl text-center">
          <span
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-text"
          >
            <ShoppingCart size={22} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[30px]">
            Sepetiniz boş
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Eklediğiniz ürünler bu tarayıcıda saklanır; hiçbir yere gönderilmez.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <ArrowLeft size={17} strokeWidth={2} aria-hidden />
            Alışverişe devam et
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Sepet
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
          Sepetim
        </h1>
      </section>

      <section className="container-main pb-12 pt-4 dt:pt-6" aria-label="Sepet içeriği">
        <div className="grid gap-(--space-grid-gap) dt:grid-cols-[minmax(0,1fr)_320px]">
          <ul className="divide-y divide-line overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
            {lines.map((product) => (
              <li key={product.id} className="flex items-center gap-3 p-3 dt:gap-4 dt:p-4">
                <Link
                  href={`/urun/${product.slug}`}
                  className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-surface-card"
                >
                  <img
                    src={product.image}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-text-secondary">{product.brand}</p>
                  <Link
                    href={`/urun/${product.slug}`}
                    className="line-clamp-2 text-[13px] leading-[1.35] text-text-primary hover:text-brand-text"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-text-secondary">{product.sku}</p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[16px] font-extrabold tabular-nums text-text-primary dt:text-[16px]">
                    {formatPrice(product.price)}
                  </p>
                  {product.compareAtPrice && (
                    <p className="text-[12px] tabular-nums text-danger-ink line-through">
                      {formatPrice(product.compareAtPrice)}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => remove('cart', product.id)}
                  aria-label={`${product.name} ürününü sepetten çıkar`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-page hover:text-danger-ink"
                >
                  <Trash2 size={17} strokeWidth={1.9} aria-hidden />
                </button>
              </li>
            ))}
          </ul>

          <aside className="dt:sticky dt:top-4 dt:self-start">
            <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
              <span
                aria-hidden
                className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
              />
              <div className="p-4">
                <h2 className="text-[16px] font-extrabold tracking-tight text-text-primary">
                  Özet
                </h2>

                <dl className="mt-4 space-y-2 border-b border-line pb-4 text-[13px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-secondary">Ürün ({lines.length})</dt>
                    <dd className="font-semibold tabular-nums text-text-primary">
                      {formatPrice(total)}
                    </dd>
                  </div>
                  {saving > 0 && (
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">İndirim</dt>
                      <dd className="font-semibold tabular-nums text-danger-ink">
                        −{formatPrice(saving)}
                      </dd>
                    </div>
                  )}
                </dl>

                <div className="flex items-baseline justify-between pt-4">
                  <span className="text-[13px] font-semibold text-text-primary">Toplam</span>
                  <span className="text-[20px] font-extrabold tabular-nums text-text-primary">
                    {formatPrice(total)}
                  </span>
                </div>

                {/* Stated, not implied: there is no checkout behind this. */}
                <p className="mt-4 rounded-(--card-radius) border border-line bg-surface-page px-3 py-2.5 text-[12px] leading-relaxed text-text-secondary">
                  Bu bir demo mağazadır. Sipariş ve ödeme akışı çalışmaz; sepetiniz
                  yalnızca bu tarayıcıda saklanır.
                </p>

                <Link
                  href="/kurumsal"
                  className="mt-3 flex h-11 items-center justify-center rounded-full border border-line-strong text-[13px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  Kurumsal teklif iste
                </Link>

                <button
                  type="button"
                  onClick={() => clear('cart')}
                  className="mt-2 w-full py-2 text-[12px] font-semibold text-text-secondary underline underline-offset-2 transition-colors hover:text-danger-ink"
                >
                  Sepeti boşalt
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
