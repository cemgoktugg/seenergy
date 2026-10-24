import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CheckCircle2, MapPin, Pencil, Plus, Star, Trash2 } from 'lucide-react';

import { AccountShell } from '@/app/hesabim/account-shell';
import { deleteAddress, makeDefaultAddress } from '@/lib/medusa/account';
import { addressLine, listAddresses } from '@/lib/medusa/customer-data';
import { currentCustomer } from '@/lib/medusa/session';

export const metadata: Metadata = {
  title: 'Adreslerim',
  robots: { index: false, follow: false },
};

/** The customer's Medusa address book; the default one is offered first at checkout. */
export default async function AddressesPage({ searchParams }: { searchParams: Promise<{ kaydedildi?: string }> }) {
  const [{ kaydedildi }, customer] = await Promise.all([searchParams, currentCustomer()]);
  if (!customer) redirect('/hesabim?next=/hesabim/adresler');
  const addresses = await listAddresses();

  return (
    <AccountShell
      customer={customer}
      path="/hesabim/adresler"
      title="Adreslerim"
      action={
        <Link
          href="/hesabim/adresler/yeni"
          className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2.5 text-[13.5px] font-bold text-white hover:bg-brand-dark"
        >
          <Plus size={16} strokeWidth={2.25} aria-hidden />
          Yeni adres
        </Link>
      }
    >
      {kaydedildi ? (
        <p role="status" className="mb-4 flex items-center gap-2 rounded-(--card-radius) border border-success/30 bg-success/5 px-3.5 py-2.5 text-[13.5px] font-medium text-success-ink">
          <CheckCircle2 size={16} strokeWidth={2} aria-hidden />
          Adres kaydedildi.
        </p>
      ) : null}

      {addresses.length === 0 ? (
        <div className="rounded-(--panel-radius) border border-dashed border-line-strong bg-surface-card px-5 py-12 text-center">
          <MapPin size={30} strokeWidth={1.8} aria-hidden className="mx-auto text-text-secondary" />
          <p className="mt-3 text-[15px] font-semibold text-text-primary">Kayıtlı adresiniz yok.</p>
          <p className="mt-1 text-[13px] text-text-secondary">Adres eklerseniz ödeme sayfasında tek tıkla seçebilirsiniz.</p>
          <Link href="/hesabim/adresler/yeni" className="mt-5 inline-flex rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-brand-dark">
            Adres ekle
          </Link>
        </div>
      ) : (
        <ul className="grid gap-(--space-grid-gap) md:grid-cols-2">
          {addresses.map((address) => (
            <li
              key={address.id}
              className={`flex flex-col rounded-(--panel-radius) border bg-surface-card p-5 shadow-e1 ${
                address.is_default_shipping ? 'border-text-primary' : 'border-line'
              }`}
            >
              <p className="flex items-center justify-between gap-2">
                <span className="text-[15px] font-extrabold text-text-primary">{address.address_name || 'Adres'}</span>
                {address.is_default_shipping ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2.5 py-0.5 text-[11px] font-bold text-white">
                    <Star size={11} strokeWidth={2.5} aria-hidden />
                    Varsayılan
                  </span>
                ) : null}
              </p>
              <p className="mt-2 text-[13.5px] font-semibold text-text-primary">
                {[address.first_name, address.last_name].filter(Boolean).join(' ')}
                {address.company ? ` · ${address.company}` : ''}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{addressLine(address)}</p>
              {address.phone ? <p className="mt-1 text-[13px] text-text-secondary">{address.phone}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
                <Link
                  href={`/hesabim/adresler/${address.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[12.5px] font-semibold text-text-primary hover:border-text-primary"
                >
                  <Pencil size={13} strokeWidth={2} aria-hidden />
                  Düzenle
                </Link>
                {address.is_default_shipping ? null : (
                  <form action={makeDefaultAddress}>
                    <input type="hidden" name="id" value={address.id} />
                    <button type="submit" className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3.5 py-1.5 text-[12.5px] font-semibold text-text-primary hover:border-text-primary">
                      <Star size={13} strokeWidth={2} aria-hidden />
                      Varsayılan yap
                    </button>
                  </form>
                )}
                <form action={deleteAddress} className="ml-auto">
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-text-secondary hover:bg-danger/10 hover:text-danger-ink">
                    <Trash2 size={13} strokeWidth={2} aria-hidden />
                    Sil
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AccountShell>
  );
}
