import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { AccountShell } from '@/app/hesabim/account-shell';
import { AddressForm, type AddressValues } from '@/app/hesabim/address-form';
import { listAddresses } from '@/lib/medusa/customer-data';
import { currentCustomer } from '@/lib/medusa/session';

export const metadata: Metadata = {
  title: 'Adres',
  robots: { index: false, follow: false },
};

/** /hesabim/adresler/yeni adds an address; /hesabim/adresler/<id> edits one. */
export default async function AddressEditPage({ params }: { params: Promise<{ id: string }> }) {
  const [{ id }, customer] = await Promise.all([params, currentCustomer()]);
  if (!customer) redirect('/hesabim?next=/hesabim/adresler');

  let initial: AddressValues;
  if (id === 'yeni') {
    const addresses = await listAddresses();
    initial = {
      first_name: customer.first_name ?? '',
      last_name: customer.last_name ?? '',
      phone: customer.phone?.replace(/^\+90/, '0') ?? '',
      is_default: addresses.length === 0,
    };
  } else {
    const address = (await listAddresses()).find((item) => item.id === id);
    if (!address) notFound();
    initial = {
      id: address.id,
      address_name: address.address_name ?? '',
      first_name: address.first_name ?? '',
      last_name: address.last_name ?? '',
      phone: address.phone?.replace(/^\+90/, '0') ?? '',
      province: address.province ?? '',
      district: address.city ?? '',
      address: address.address_1 ?? '',
      postal_code: address.postal_code ?? '',
      company: address.company ?? '',
      is_default: address.is_default_shipping,
    };
  }

  return (
    <AccountShell customer={customer} path="/hesabim/adresler" title={id === 'yeni' ? 'Yeni adres' : 'Adresi düzenle'}>
      <AddressForm initial={initial} />
    </AccountShell>
  );
}
