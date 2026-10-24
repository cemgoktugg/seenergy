import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Landmark, Package } from 'lucide-react';

import { AccountShell } from '@/app/hesabim/account-shell';
import { AuthForms } from '@/app/hesabim/auth-forms';
import { formatPrice } from '@/data/catalog';
import { medusa } from '@/lib/medusa/client';
import { currentCustomer, readToken } from '@/lib/medusa/session';

/**
 * Account — `/hesabim`.
 *
 * Signed out: sign-in and registration. Signed in: the customer's details and
 * their orders, newest first, each linking to the same confirmation page a
 * guest sees. Rendered per request, since it depends on the session cookie.
 */

export const metadata: Metadata = {
  title: 'Hesabım',
  robots: { index: false, follow: false },
};

interface OrderRow {
  id: string;
  display_id: number;
  created_at: string;
  total: number;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  items: { id: string; thumbnail: string | null; title: string; quantity: number }[] | null;
}

/** Medusa's statuses, as a customer would say them. */
function statusLabel(order: OrderRow): { label: string; tone: 'muted' | 'brand' | 'danger' } {
  if (order.status === 'canceled') return { label: 'İptal edildi', tone: 'danger' };
  if (order.fulfillment_status === 'delivered') return { label: 'Teslim edildi', tone: 'muted' };
  if (['shipped', 'partially_shipped'].includes(order.fulfillment_status)) {
    return { label: 'Kargoda', tone: 'brand' };
  }
  if (['captured', 'partially_captured'].includes(order.payment_status)) {
    return { label: 'Hazırlanıyor', tone: 'brand' };
  }
  // Not yet captured: a transfer not yet matched, or a cash-on-delivery order
  // — "payment pending" would be wrong for the latter, so stay neutral.
  return { label: 'Sipariş alındı', tone: 'muted' };
}

const toneClass = {
  muted: 'bg-surface-page text-text-secondary',
  brand: 'bg-brand-soft text-brand-text',
  danger: 'bg-danger/10 text-danger-ink',
};

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [{ next }, customer] = await Promise.all([searchParams, currentCustomer()]);

  if (!customer) {
    return (
      <div className="container-main pb-12 pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Hesabım
        </p>
        <h1 className="mb-5 mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:mb-7 dt:text-[32px]">
          Giriş yap veya üye ol
        </h1>
        <AuthForms next={next ?? '/hesabim'} />
      </div>
    );
  }

  const token = await readToken();
  const { orders } = await medusa<{ orders: OrderRow[] }>('/store/orders', {
    token,
    cache: 'no-store',
    query: {
      limit: 50,
      order: '-created_at',
      fields: 'id,display_id,created_at,total,status,fulfillment_status,payment_status,*items',
    },
  });
  /* Payment method lives on order metadata, which the Store API does not
     return; the backend's order-details route exposes it. Only needed for
     orders still awaiting payment, to offer the transfer notice. */
  const awaiting = orders.filter(
    (order) => order.status !== 'canceled' && !['captured', 'partially_captured', 'refunded'].includes(order.payment_status),
  );
  const methods = Object.fromEntries(
    await Promise.all(
      awaiting.map(async (order) => {
        try {
          const { details } = await medusa<{ details: { payment_method: string | null } }>(
            `/store/order-details/${order.id}`,
            { cache: 'no-store' },
          );
          return [order.id, details.payment_method] as const;
        } catch {
          return [order.id, null] as const;
        }
      }),
    ),
  );
  const open = orders.filter((order) => order.status !== 'canceled' && order.fulfillment_status !== 'delivered').length;

  return (
    <AccountShell customer={customer} path="/hesabim" title="Siparişlerim">
      <dl className="grid grid-cols-2 gap-(--space-grid-gap) sm:grid-cols-3">
        {[
          { label: 'Toplam sipariş', value: String(orders.length) },
          { label: 'Devam eden', value: String(open) },
          { label: 'Toplam harcama', value: formatPrice(orders.filter((o) => o.status !== 'canceled').reduce((sum, o) => sum + o.total, 0)) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-(--panel-radius) border border-line bg-surface-card px-4 py-3.5 shadow-e1 last:col-span-2 sm:last:col-span-1">
            <dt className="text-[12px] font-medium text-text-secondary">{stat.label}</dt>
            <dd className="mt-0.5 text-[20px] font-extrabold tabular-nums text-text-primary">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-(--space-grid-gap) rounded-(--panel-radius) border border-line bg-surface-card shadow-e1" aria-label="Sipariş listesi">
        {orders.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Package aria-hidden size={30} strokeWidth={1.8} className="mx-auto text-text-secondary" />
            <p className="mt-3 text-[15px] font-semibold text-text-primary">Henüz siparişiniz yok.</p>
            <p className="mt-1 text-[13px] text-text-secondary">Verdiğiniz siparişler burada listelenir.</p>
            <Link href="/" className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
              Alışverişe başla
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {orders.map((order) => {
              const status = statusLabel(order);
              const items = order.items ?? [];
              const count = items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
              const transfer = methods[order.id] === 'havale';
              return (
                <li key={order.id} className="flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-4 dt:px-5">
                  <div className="flex -space-x-2">
                    {items.slice(0, 4).map((item) => (
                      <span key={item.id} className="grid h-12 w-12 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-white p-1 shadow-e1">
                        {item.thumbnail ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.thumbnail} alt="" loading="lazy" className="h-full w-full object-contain" />
                        ) : (
                          <Package size={18} strokeWidth={1.8} aria-hidden className="text-text-secondary" />
                        )}
                      </span>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[13.5px] font-bold text-text-primary">SE-{order.display_id}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${toneClass[status.tone]}`}>{status.label}</span>
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-text-secondary">
                      {new Date(order.created_at).toLocaleDateString('tr-TR', { dateStyle: 'long' })} · {count} ürün
                    </p>
                  </div>
                  <span className="text-[15px] font-extrabold tabular-nums text-text-primary">{formatPrice(order.total)}</span>
                  <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                    {transfer ? (
                      <Link
                        href={`/havale-bildirim?siparis=SE-${order.display_id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-2 text-[12.5px] font-semibold text-text-primary hover:border-text-primary"
                      >
                        <Landmark size={14} strokeWidth={2} aria-hidden />
                        Havale bildir
                      </Link>
                    ) : null}
                    <Link
                      href={`/siparis/${order.id}`}
                      className="inline-flex items-center gap-1 rounded-full bg-brand px-3.5 py-2 text-[12.5px] font-semibold text-white hover:bg-brand-dark"
                    >
                      Detay
                      <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </AccountShell>
  );
}
