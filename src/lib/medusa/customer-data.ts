import { medusa } from '@/lib/medusa/client';
import { readToken } from '@/lib/medusa/session';

/**
 * Server-side reads of the signed-in customer's own records. Not a
 * `'use server'` module: these are lookups for server components, never
 * actions a browser can call.
 */

export interface Address {
  id: string;
  address_name: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  phone: string | null;
  address_1: string | null;
  city: string | null;
  province: string | null;
  postal_code: string | null;
  is_default_shipping: boolean;
}

export async function listAddresses(): Promise<Address[]> {
  const token = await readToken();
  if (!token) return [];
  try {
    const { addresses } = await medusa<{ addresses: Address[] }>('/store/customers/me/addresses', {
      token,
      cache: 'no-store',
      query: { limit: 50 },
    });
    // The default first, then newest-first as Medusa returns them.
    return [...addresses].sort((a, b) => Number(b.is_default_shipping) - Number(a.is_default_shipping));
  } catch {
    return [];
  }
}

/** "Kadıköy / İstanbul" style one-liner for cards and pickers. */
export const addressLine = (address: Address) =>
  [address.address_1, [address.city, address.province].filter(Boolean).join(' / '), address.postal_code]
    .filter(Boolean)
    .join(', ');
