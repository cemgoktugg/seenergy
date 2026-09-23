'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * Cart — `/sepet`.
 *
 * The cart is Medusa's: lines, prices, KDV and totals all come from the cart
 * the server holds, through CartProvider. Nothing is summed in the browser
 * except the "you saved" figure, which is display-only and derived from the
 * same line prices Medusa returned.
 *
 * Shipping is not priced here — the visitor has not chosen a method yet — but
 * the free-shipping threshold is, because "kargoya 212 TL kaldı" is the
 * number that changes what goes in the cart.
 */

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Trash2, Truck } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { FREE_SHIPPING_FROM, formatPrice } from '@/data/catalog';

export default function CartPage() {
  const { cart, ready, busy, setQuantity, remove } = useCart();
  const lines = cart?.lines ?? [];

  const saving = lines.reduce(
    (sum, line) =>
      sum + (line.compareAtUnitPrice ? (line.compareAtUnitPrice - line.unitPrice) * line.quantity : 0),
    0,
  );
  const toFreeShipping = Math.max(0, FREE_SHIPPING_FROM - (cart?.itemTotal ?? 0));

  if (!ready) {
    return (
      <div className="container-main py-14 dt:py-20" aria-busy="true">
        <p className="text-center text-[14px] text-text-secondary">Sepetiniz yükleniyor…</p>
      </div>
    );
  }

  if (lines.length === 0) {
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
            Ürün sayfalarındaki “Sepete Ekle” ile başlayabilirsiniz.
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
          <ul
            aria-busy={busy}
            className="divide-y divide-line overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
          >
            {lines.map((line) => (
              <li key={line.id} className="flex flex-wrap items-center gap-3 p-3 dt:flex-nowrap dt:gap-4 dt:p-4">
                <Link
                  href={`/urun/${line.handle}`}
                  className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-surface-card"
                >
                  <img
                    src={line.image}
                    alt=""
                    width={64}
                    height={64}
                    loading="lazy"
                    className="h-full w-full object-contain p-1"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-text-secondary">{line.brand}</p>
                  <Link
                    href={`/urun/${line.handle}`}
                    className="line-clamp-2 text-[13px] leading-[1.35] text-text-primary hover:text-brand-text"
                  >
                    {line.title}
                  </Link>
                  <p className="mt-0.5 font-mono text-[11px] text-text-secondary">{line.sku}</p>
                </div>

                {/* Quantity. Medusa refuses a quantity above stock; the error
                    surfaces through CartProvider's alert. */}
                <div className="flex items-center rounded-full border border-line-strong" role="group" aria-label={`${line.title} adedi`}>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void setQuantity(line.id, line.quantity - 1)}
                    aria-label="Bir azalt"
                    className="grid h-9 w-9 place-items-center rounded-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-50"
                  >
                    <Minus size={15} strokeWidth={2} aria-hidden />
                  </button>
                  <span className="min-w-7 text-center text-[14px] font-semibold tabular-nums text-text-primary" aria-live="polite">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void setQuantity(line.id, line.quantity + 1)}
                    aria-label="Bir artır"
                    className="grid h-9 w-9 place-items-center rounded-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-50"
                  >
                    <Plus size={15} strokeWidth={2} aria-hidden />
                  </button>
                </div>

                <div className="ml-auto shrink-0 text-right dt:ml-0 dt:min-w-28">
                  <p className="text-[16px] font-extrabold tabular-nums text-text-primary">
                    {formatPrice(line.total)}
                  </p>
                  {line.quantity > 1 ? (
                    <p className="text-[11px] tabular-nums text-text-secondary">
                      {formatPrice(line.unitPrice)} / adet
                    </p>
                  ) : line.compareAtUnitPrice ? (
                    <p className="text-[12px] tabular-nums text-danger-ink line-through">
                      {formatPrice(line.compareAtUnitPrice)}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(line.id)}
                  aria-label={`${line.title} ürününü sepetten çıkar`}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-page hover:text-danger-ink disabled:opacity-50"
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
                    <dt className="text-text-secondary">Ürünler ({cart?.count})</dt>
                    <dd className="font-semibold tabular-nums text-text-primary">
                      {formatPrice(cart?.itemTotal ?? 0)}
                    </dd>
                  </div>
                  {saving > 0 && (
                    <div className="flex items-center justify-between">
                      <dt className="text-text-secondary">Kazancınız</dt>
                      <dd className="font-semibold tabular-nums text-danger-ink">
                        {formatPrice(saving)}
                      </dd>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <dt className="text-text-secondary">Kargo</dt>
                    <dd className="font-semibold text-text-primary">
                      {toFreeShipping === 0 ? 'Ücretsiz' : 'Ödeme adımında'}
                    </dd>
                  </div>
                </dl>

                <div className="flex items-baseline justify-between pt-4">
                  <span className="text-[13px] font-semibold text-text-primary">Toplam</span>
                  <span className="text-[20px] font-extrabold tabular-nums text-text-primary">
                    {formatPrice(cart?.itemTotal ?? 0)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[11px] text-text-secondary">
                  KDV dahil ({formatPrice(cart?.taxTotal ?? 0)})
                </p>

                <p className="mt-4 flex items-start gap-2 rounded-(--card-radius) border border-line bg-surface-page px-3 py-2.5 text-[12px] leading-relaxed text-text-secondary">
                  <Truck size={16} strokeWidth={1.9} aria-hidden className="mt-px shrink-0 text-brand-text" />
                  {toFreeShipping === 0 ? (
                    <span>Siparişiniz ücretsiz kargo ile gönderilecek.</span>
                  ) : (
                    <span>
                      Ücretsiz kargo için{' '}
                      <strong className="font-semibold text-text-primary">
                        {formatPrice(toFreeShipping)}
                      </strong>{' '}
                      daha ekleyin.
                    </span>
                  )}
                </p>

                <Link
                  href="/odeme"
                  aria-disabled={busy}
                  className={`mt-4 flex h-12 items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-dark ${
                    busy ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  Siparişi Tamamla
                  <ArrowRight size={18} strokeWidth={2} aria-hidden />
                </Link>

                <Link
                  href="/kurumsal"
                  className="mt-2 flex h-11 items-center justify-center rounded-full border border-line-strong text-[13px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  Kurumsal teklif iste
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
