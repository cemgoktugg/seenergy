import type { Metadata } from 'next';
import Link from 'next/link';
import { LogOut, Package } from 'lucide-react';

import { AuthForms } from '@/app/hesabim/auth-forms';
import { formatPrice } from '@/data/catalog';
import { signOut } from '@/lib/medusa/account';
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
  items: { id: string }[] | null;
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

  return (
    <div className="container-main pb-12 pt-4 dt:pt-6">
      <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
        <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
        Hesabım
      </p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
          Merhaba, {customer.first_name ?? customer.email}
        </h1>
        <form action={signOut}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-[13px] font-semibold text-text-primary transition-colors hover:border-danger hover:text-danger-ink"
          >
            <LogOut size={15} strokeWidth={2} aria-hidden />
            Çıkış yap
          </button>
        </form>
      </div>

      <div className="mt-5 grid gap-(--space-grid-gap) dt:mt-7 dt:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-(--panel-radius) border border-line bg-surface-card shadow-e1" aria-labelledby="orders-title">
          <h2 id="orders-title" className="border-b border-line px-4 py-3 text-[15px] font-extrabold text-text-primary dt:px-5">
            Siparişlerim
          </h2>
          {orders.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Package aria-hidden size={28} strokeWidth={1.8} className="mx-auto text-text-secondary" />
              <p className="mt-3 text-[14px] text-text-secondary">Henüz siparişiniz yok.</p>
              <Link href="/" className="mt-4 inline-flex rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
                Alışverişe başla
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {orders.map((order) => {
                const status = statusLabel(order);
                const count = order.items?.length ?? 0;
                return (
                  <li key={order.id}>
                    <Link
                      href={`/siparis/${order.id}`}
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 transition-colors hover:bg-surface-page dt:px-5"
                    >
                      <span className="font-mono text-[13px] font-bold text-text-primary">SE-{order.display_id}</span>
                      <span className="text-[12px] text-text-secondary">
                        {new Date(order.created_at).toLocaleDateString('tr-TR', { dateStyle: 'medium' })} · {count} ürün
                      </span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${toneClass[status.tone]}`}>
                        {status.label}
                      </span>
                      <span className="ml-auto text-[14px] font-bold tabular-nums text-text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside className="self-start rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1 dt:p-5">
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-text-secondary">Üyelik bilgileri</h2>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div>
              <dt className="text-text-secondary">Ad soyad</dt>
              <dd className="font-semibold text-text-primary">
                {[customer.first_name, customer.last_name].filter(Boolean).join(' ') || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary">E-posta</dt>
              <dd className="font-semibold text-text-primary">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Telefon</dt>
              <dd className="font-semibold text-text-primary">{customer.phone ?? '—'}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
