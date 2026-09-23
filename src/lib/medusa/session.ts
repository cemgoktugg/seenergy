import { cookies } from 'next/headers';
import { cache } from 'react';

import { MedusaError, medusa } from '@/lib/medusa/client';

/**
 * The signed-in customer's session: Medusa's customer JWT in an httpOnly
 * cookie, and the one lookup through it.
 *
 * Deliberately not a `'use server'` module — reading the token is a server
 * detail, never an action a browser can call.
 */

const AUTH_COOKIE = 'seenergy_auth';
/** Medusa issues customer tokens for 24 hours; the cookie must not outlive it. */
const TOKEN_TTL = 60 * 60 * 24;

export interface Customer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company_name: string | null;
}

export async function readToken(): Promise<string | undefined> {
  return (await cookies()).get(AUTH_COOKIE)?.value;
}

export async function writeToken(token: string) {
  (await cookies()).set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: TOKEN_TTL,
  });
}

export async function clearToken() {
  (await cookies()).delete(AUTH_COOKIE);
}

/** The signed-in customer, or null — an expired token simply reads as signed out. */
export const currentCustomer = cache(async (): Promise<Customer | null> => {
  const token = await readToken();
  if (!token) return null;
  try {
    const { customer } = await medusa<{ customer: Customer }>('/store/customers/me', {
      token,
      cache: 'no-store',
    });
    return customer;
  } catch (error) {
    if (error instanceof MedusaError && error.status === 401) return null;
    throw error;
  }
});
