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
 * number that changes what goes in the cart. It leads the page as a progress
 * bar, and the suggestions under the lines are what closes that gap.
 *
 * The line list sizes to its content (`items-start`): stretched to the
 * summary's height, a one-line cart left ~350px of empty white panel.
 */

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck, Undo2 } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { useCatalog } from '@/components/catalog-provider';
import { ProductCard } from '@/components/product-card';
import { SectionHeading } from '@/components/section-heading';
import { FREE_SHIPPING_FROM, formatPrice, type Product } from '@/data/catalog';
import { imageProps } from '@/lib/image';

const PROMISES = [
  { icon: ShieldCheck, text: 'Faturalı ve garantili ürün' },
  { icon: Truck, text: `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz kargo` },
  { icon: Undo2, text: '14 gün içinde iade' },
];

/**
 * Four products worth adding: buyable now, not already in the cart, from the
 * cart's own categories first — a camera in the cart asks for a recorder or a
 * disk, not a hoparlör.
 */
function suggestionsFor(products: Product[], inCart: Set<string>, categories: Set<string>): Product[] {
  const candidates = products.filter(
    (product) => product.price != null && product.stock > 0 && !inCart.has(product.slug),
  );
  const near = candidates.filter((product) => categories.has(product.category));
  const rest = candidates.filter((product) => !categories.has(product.category));
  return [...near, ...rest].slice(0, 4);
}

function Suggestions({ products }: { products: Product[] }) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby="sepet-oneriler" className="mt-8 dt:mt-10">
      <SectionHeading id="sepet-oneriler" eyebrow="Sepetinize uygun" title="Bunları da ekleyin" />
      <ul className="mt-4 grid grid-cols-2 gap-(--space-grid-gap) lg:grid-cols-4">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function CartPage() {
  const { cart, ready, busy, setQuantity, remove } = useCart();
  const { products, bySlug } = useCatalog();
  const lines = cart?.lines ?? [];

  const saving = lines.reduce(
    (sum, line) =>
      sum + (line.compareAtUnitPrice ? (line.compareAtUnitPrice - line.unitPrice) * line.quantity : 0),
    0,
  );
  const itemTotal = cart?.itemTotal ?? 0;
  const toFreeShipping = Math.max(0, FREE_SHIPPING_FROM - itemTotal);
  const progress = Math.min(100, Math.round((itemTotal / FREE_SHIPPING_FROM) * 100));
  const suggestions = suggestionsFor(
    products,
    new Set(lines.map((line) => line.handle)),
    new Set(lines.flatMap((line) => bySlug(line.handle)?.category ?? [])),
  );

  if (!ready) {
    return (
      <div className="container-main py-14 dt:py-20" aria-busy="true">
        <p className="text-center text-[14px] text-text-secondary">Sepetiniz yükleniyor…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="container-main pb-12 pt-10 dt:pt-14">
        <div className="mx-auto max-w-xl rounded-(--panel-radius) border border-line bg-surface-card px-6 py-10 text-center shadow-e1">
          <span
            aria-hidden
            className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1"
          >
            <ShoppingCart size={24} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
            Sepetiniz boş
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün sayfalarındaki “Sepete Ekle” ile başlayabilirsiniz.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[16px] font-bold text-white transition-colors hover:bg-brand-dark"
          >
            <ArrowLeft size={17} strokeWidth={2} aria-hidden />
            Alışverişe devam et
          </Link>
        </div>
        <Suggestions products={suggestions} />
      </div>
    );
  }

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-text-secondary">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Sepet
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
          Sepetim <span className="text-[16px] font-semibold text-text-secondary dt:text-[20px]">({cart?.count} ürün)</span>
        </h1>
      </section>

      <section className="container-main pb-12 pt-4 dt:pt-6" aria-label="Sepet içeriği">
        <div className="grid items-start gap-(--space-grid-gap) dt:grid-cols-[minmax(0,1fr)_340px]">
          <div className="grid gap-(--space-grid-gap)">
            {/* Free shipping, as a bar that fills — the number that changes
                what goes in the cart, where it is seen first. */}
            <div className="rounded-(--panel-radius) border border-line bg-surface-card px-4 py-3.5 shadow-e1">
              <p className="flex items-center gap-2 text-[14px] text-text-primary">
                <Truck size={18} strokeWidth={1.9} aria-hidden className="shrink-0" />
                {toFreeShipping === 0 ? (
                  <span className="font-bold">Tebrikler, kargonuz ücretsiz!</span>
                ) : (
                  <span>
                    Ücretsiz kargo için <strong className="font-extrabold tabular-nums">{formatPrice(toFreeShipping)}</strong>{' '}
                    daha ekleyin.
                  </span>
                )}
              </p>
              <div
                role="progressbar"
                aria-label="Ücretsiz kargoya kalan"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="mt-2.5 h-2 overflow-hidden rounded-full bg-surface-page"
              >
                <div
                  className={`h-full rounded-full transition-[width] duration-(--duration-slow) ease-(--ease-out) ${
                    toFreeShipping === 0 ? 'bg-success' : 'bg-linear-to-r from-grad-2 to-grad-4'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ul
              aria-busy={busy}
              className="divide-y divide-line overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
            >
              {lines.map((line) => (
                <li key={line.id} className="flex flex-wrap items-center gap-3 p-3 sm:flex-nowrap dt:gap-5 dt:p-4">
                  <Link
                    href={`/urun/${line.handle}`}
                    className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-white dt:h-24 dt:w-24"
                  >
                    <img
                      {...imageProps(line.image, 96)}
                      alt=""
                      width={96}
                      height={96}
                      loading="lazy"
                      className="h-full w-full object-contain p-1.5"
                    />
                  </Link>

                  <div className="min-w-0 flex-1 basis-[calc(100%-92px)] sm:basis-auto">
                    <p className="text-[12px] font-bold text-text-secondary">{line.brand}</p>
                    <Link
                      href={`/urun/${line.handle}`}
                      className="line-clamp-2 text-[14px] font-semibold leading-[1.35] text-text-primary hover:text-brand-text"
                    >
                      {line.title}
                    </Link>
                    <p className="mt-0.5 font-mono text-[12px] text-text-secondary">{line.sku}</p>
                  </div>

                  {/* Quantity. Medusa refuses a quantity above stock; the error
                      surfaces through CartProvider's alert. */}
                  <div className="flex items-center rounded-full border border-line-strong" role="group" aria-label={`${line.title} adedi`}>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void setQuantity(line.id, line.quantity - 1)}
                      aria-label="Bir azalt"
                      className="grid h-11 w-11 place-items-center rounded-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-50"
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
                      className="grid h-11 w-11 place-items-center rounded-full text-text-primary transition-colors hover:bg-surface-page disabled:opacity-50"
                    >
                      <Plus size={15} strokeWidth={2} aria-hidden />
                    </button>
                  </div>

                  <div className="ml-auto shrink-0 text-right sm:ml-0 sm:min-w-28">
                    <p className="text-[16px] font-extrabold tabular-nums text-text-primary">
                      {formatPrice(line.total)}
                    </p>
                    {line.quantity > 1 ? (
                      <p className="text-[12px] tabular-nums text-text-secondary">
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
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-page hover:text-danger-ink disabled:opacity-50"
                  >
                    <Trash2 size={17} strokeWidth={1.9} aria-hidden />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center gap-2 rounded-full px-1 text-[14px] font-semibold text-text-primary underline-offset-4 hover:underline"
              >
                <ArrowLeft size={16} strokeWidth={2} aria-hidden />
                Alışverişe devam et
              </Link>
              <ul className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px] text-text-secondary">
                {PROMISES.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-1.5">
                    <Icon size={15} strokeWidth={1.9} aria-hidden className="text-text-primary" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="dt:sticky dt:top-(--sticky-offset)">
            <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
              <span
                aria-hidden
                className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
              />
              <div className="p-4 dt:p-5">
                <h2 className="text-[16px] font-extrabold tracking-tight text-text-primary">
                  Sipariş özeti
                </h2>

                <dl className="mt-4 space-y-2 border-b border-line pb-4 text-[14px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-secondary">Ürünler ({cart?.count})</dt>
                    <dd className="font-semibold tabular-nums text-text-primary">
                      {formatPrice(itemTotal)}
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
                  <span className="text-[14px] font-semibold text-text-primary">Toplam</span>
                  <span className="text-[24px] font-extrabold tabular-nums text-text-primary">
                    {formatPrice(itemTotal)}
                  </span>
                </div>
                <p className="mt-1 text-right text-[12px] text-text-secondary">
                  KDV dahil ({formatPrice(cart?.taxTotal ?? 0)})
                </p>

                <Link
                  href="/odeme"
                  aria-disabled={busy}
                  className={`mt-4 flex h-[52px] items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-dark ${
                    busy ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  Siparişi Tamamla
                  <ArrowRight size={18} strokeWidth={2} aria-hidden />
                </Link>

                <Link
                  href="/kurumsal"
                  className="mt-2 flex h-11 items-center justify-center rounded-full border border-line-strong text-[14px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
                >
                  Kurumsal teklif iste
                </Link>
                <p className="mt-3 text-center text-[12px] text-text-secondary">Havale / EFT veya kapıda ödeme</p>
              </div>
            </div>
          </aside>
        </div>

        <Suggestions products={suggestions} />
      </section>
    </>
  );
}
