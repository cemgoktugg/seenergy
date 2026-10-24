import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { CheckoutForm, type ShippingChoice } from '@/app/odeme/checkout-form';
import { currentCart } from '@/lib/medusa/cart-cookie';
import { toCartSummary } from '@/lib/medusa/cart-summary';
import { medusa } from '@/lib/medusa/client';
import { listAddresses } from '@/lib/medusa/customer-data';
import { currentCustomer } from '@/lib/medusa/session';

/**
 * Checkout — `/odeme`.
 *
 * Rendered per request: it reads the visitor's cart cookie, and the shipping
 * options Medusa offers depend on that cart (Standart Kargo is free only once
 * the items reach 1.000 TL). Nothing here is cached.
 */

export const metadata: Metadata = {
  title: 'Ödeme',
  robots: { index: false, follow: false },
};

interface StoreShippingOption {
  id: string;
  name: string;
  amount: number;
  type?: { description?: string | null } | null;
}

export default async function CheckoutPage() {
  const [cart, customer] = await Promise.all([currentCart(), currentCustomer()]);
  const summary = toCartSummary(cart);
  if (!cart || !summary || summary.lines.length === 0) redirect('/sepet');

  const { shipping_options } = await medusa<{ shipping_options: StoreShippingOption[] }>(
    '/store/shipping-options',
    { query: { cart_id: cart.id }, cache: 'no-store' },
  );
  /* The signed-in customer's address book, offered as one-click choices;
     the default one is picked to begin with. */
  const addresses = customer
    ? (await listAddresses()).map((address) => ({
        id: address.id,
        label: address.address_name || [address.city, address.province].filter(Boolean).join(' / ') || 'Adres',
        first_name: address.first_name ?? '',
        last_name: address.last_name ?? '',
        phone: address.phone?.replace(/^\+90/, '0') ?? '',
        province: address.province ?? '',
        district: address.city ?? '',
        address: address.address_1 ?? '',
        postal_code: address.postal_code ?? '',
        is_default: address.is_default_shipping,
      }))
    : [];

  const shipping: ShippingChoice[] = shipping_options
    .map((option) => ({
      id: option.id,
      name: option.name,
      amount: option.amount,
      description: option.type?.description ?? '',
    }))
    .sort((a, b) => a.amount - b.amount);

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Ödeme
        </p>
        <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
          Siparişi Tamamla
        </h1>
      </section>

      <CheckoutForm
        cart={summary}
        shipping={shipping}
        signedIn={customer !== null}
        addresses={addresses}
        prefill={
          customer
            ? {
                email: customer.email,
                first_name: customer.first_name ?? '',
                last_name: customer.last_name ?? '',
                phone: customer.phone ?? '',
              }
            : undefined
        }
      />
    </>
  );
}
