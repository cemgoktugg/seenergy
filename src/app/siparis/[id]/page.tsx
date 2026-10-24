/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Landmark, Truck } from 'lucide-react';

import { CartReset } from '@/app/siparis/[id]/cart-reset';
import { formatPrice } from '@/data/catalog';
import { paymentLabel } from '@/data/checkout';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { loadVitrin } from '@/lib/medusa/vitrin';

/**
 * Order confirmation — `/siparis/[id]`.
 *
 * Every figure here is the order's own, as Medusa stored it — not a
 * re-computation of the cart. The id is Medusa's unguessable order id, which
 * is what lets a guest see their order without an account.
 *
 * Bank details come from admin → Vitrin → Şirket bilgileri (the BANK_* env
 * still answers until the admin has a value) and are never invented: until they are configured, the page says the
 * details will follow by e-mail rather than printing a placeholder IBAN that
 * someone might pay into.
 */

export const metadata: Metadata = {
  title: 'Siparişiniz alındı',
  robots: { index: false, follow: false },
};

interface StoreOrder {
  id: string;
  display_id: number;
  email: string;
  created_at: string;
  item_total: number;
  shipping_total: number;
  tax_total: number;
  total: number;
  shipping_address: {
    first_name: string | null;
    last_name: string | null;
    address_1: string | null;
    city: string | null;
    province: string | null;
    postal_code: string | null;
    phone: string | null;
    company: string | null;
  } | null;
  shipping_methods: { name: string; amount: number }[];
  items: {
    id: string;
    title: string;
    product_handle: string | null;
    thumbnail: string | null;
    quantity: number;
    total: number;
  }[];
}

const imagePath = (thumbnail: string | null) => {
  if (!thumbnail) return '/mock/products/receiver-black.svg';
  try {
    const url = new URL(thumbnail);
    return url.pathname.startsWith('/mock/') ? url.pathname : thumbnail;
  } catch {
    return thumbnail;
  }
};

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { company } = await loadVitrin();
  const BANK = { name: company.bankName, holder: company.bankHolder, iban: company.iban };
  if (!/^order_[A-Z0-9]+$/.test(id)) notFound();

  let order: StoreOrder;
  let details: { payment_method: string | null };
  try {
    [{ order }, { details }] = await Promise.all([
      medusa<{ order: StoreOrder }>(`/store/orders/${id}`, {
        query: { fields: '*items,*shipping_address,*shipping_methods' },
        cache: 'no-store',
      }),
      // The core Store API never returns order metadata; this backend route
      // exposes the payment method the checkout stored there.
      medusa<{ details: { payment_method: string | null } }>(`/store/order-details/${id}`, {
        cache: 'no-store',
      }),
    ]);
  } catch (error) {
    if (error instanceof MedusaError && error.status === 404) notFound();
    throw error;
  }

  const method = details.payment_method;
  const address = order.shipping_address;
  const reference = `SE-${order.display_id}`;

  return (
    <div className="container-main pb-12 pt-6 dt:pt-10">
      <CartReset />

      <section className="mx-auto max-w-3xl text-center">
        <span aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand-text">
          <CheckCircle2 size={28} strokeWidth={2} />
        </span>
        <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
          Siparişiniz alındı
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">
          Sipariş numaranız <strong className="font-mono text-text-primary">{reference}</strong>. Siparişinizle
          ilgili <strong className="text-text-primary">{order.email}</strong> adresinden size ulaşacağız.
        </p>
      </section>

      <div className="mx-auto mt-8 grid max-w-3xl gap-(--space-grid-gap)">
        {method === 'havale' ? (
          <section className="rounded-(--panel-radius) border border-brand bg-brand-soft p-4 dt:p-5">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-text-primary">
              <Landmark size={18} strokeWidth={2} aria-hidden />
              Havale / EFT ile ödeme
            </h2>
            {BANK.iban ? (
              <dl className="mt-3 grid gap-1.5 text-[13px]">
                {BANK.name ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-secondary">Banka:</dt>
                    <dd className="font-semibold text-text-primary">{BANK.name}</dd>
                  </div>
                ) : null}
                {BANK.holder ? (
                  <div className="flex flex-wrap gap-x-2">
                    <dt className="text-text-secondary">Alıcı:</dt>
                    <dd className="font-semibold text-text-primary">{BANK.holder}</dd>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-secondary">IBAN:</dt>
                  <dd className="font-mono font-semibold text-text-primary">{BANK.iban}</dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-text-secondary">Tutar:</dt>
                  <dd className="font-semibold tabular-nums text-text-primary">{formatPrice(order.total)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-[13px] leading-relaxed text-text-primary">
                Banka hesap bilgilerimizi e-posta adresinize ileteceğiz.
              </p>
            )}
            <p className="mt-3 text-[12px] leading-relaxed text-text-secondary">
              Açıklama kısmına sipariş numaranızı (<strong className="font-mono">{reference}</strong>) yazın.
              Ödemeniz hesabımıza ulaştığında siparişiniz kargoya verilir.
            </p>
          </section>
        ) : method === 'kapida' ? (
          <section className="rounded-(--panel-radius) border border-brand bg-brand-soft p-4 dt:p-5">
            <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-text-primary">
              <Truck size={18} strokeWidth={2} aria-hidden />
              Kapıda ödeme
            </h2>
            <p className="mt-2 text-[13px] leading-relaxed text-text-primary">
              Siparişinizi teslim alırken kargo görevlisine{' '}
              <strong className="tabular-nums">{formatPrice(order.total)}</strong> ödeyeceksiniz.
            </p>
          </section>
        ) : null}

        <section className="rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
          <h2 className="border-b border-line px-4 py-3 text-[15px] font-extrabold text-text-primary">
            Sipariş özeti
          </h2>
          <ul className="divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-(--card-radius) border border-line">
                  <img src={imagePath(item.thumbnail)} alt="" width={48} height={48} className="h-full w-full object-contain p-1" />
                </span>
                <span className="min-w-0 flex-1 text-[13px] text-text-primary">
                  {item.product_handle ? (
                    <Link href={`/urun/${item.product_handle}`} className="hover:text-brand-text">
                      {item.title}
                    </Link>
                  ) : (
                    item.title
                  )}
                  <span className="block text-[12px] text-text-secondary">{item.quantity} adet</span>
                </span>
                <span className="shrink-0 text-[14px] font-semibold tabular-nums text-text-primary">
                  {formatPrice(item.total)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-line px-4 py-3 text-[13px]">
            <div className="flex justify-between">
              <dt className="text-text-secondary">Ürünler</dt>
              <dd className="tabular-nums text-text-primary">{formatPrice(order.item_total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-secondary">Kargo ({order.shipping_methods[0]?.name ?? '—'})</dt>
              <dd className="tabular-nums text-text-primary">
                {order.shipping_total === 0 ? 'Ücretsiz' : formatPrice(order.shipping_total)}
              </dd>
            </div>
            <div className="flex justify-between pt-1.5 text-[15px]">
              <dt className="font-bold text-text-primary">Toplam</dt>
              <dd className="font-extrabold tabular-nums text-text-primary">{formatPrice(order.total)}</dd>
            </div>
            <p className="text-right text-[11px] text-text-secondary">
              KDV dahil ({formatPrice(order.tax_total)})
            </p>
          </dl>
        </section>

        <section className="grid gap-(--space-grid-gap) md:grid-cols-2">
          <div className="rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-text-secondary">Teslimat adresi</h2>
            {address ? (
              <p className="mt-2 text-[13px] leading-relaxed text-text-primary">
                {address.first_name} {address.last_name}
                {address.company ? <><br />{address.company}</> : null}
                <br />
                {address.address_1}
                <br />
                {address.city} / {address.province} {address.postal_code}
                <br />
                {address.phone}
              </p>
            ) : null}
          </div>
          <div className="rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1">
            <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-text-secondary">Ödeme</h2>
            <p className="mt-2 text-[13px] text-text-primary">{paymentLabel(method)}</p>
            <p className="mt-1 text-[12px] text-text-secondary">
              {new Date(order.created_at).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Alışverişe devam et
          </Link>
        </div>
      </div>
    </div>
  );
}
