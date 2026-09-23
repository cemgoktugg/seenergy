'use server';

/**
 * Sign in, register and sign out.
 *
 * Medusa splits a customer in two: an auth identity (email + password, which
 * issues the JWT) and a customer record (name, phone, orders). Registering
 * therefore creates both, in that order. On either sign-in path the visitor's
 * open cart is attached to the customer, so what they put in the basket
 * before signing in is still there — and the order it becomes shows up under
 * "Siparişlerim".
 */

import { redirect } from 'next/navigation';

import { clearCartId, readCartId, retrieveCart } from '@/lib/medusa/cart-cookie';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { clearToken, writeToken } from '@/lib/medusa/session';

export interface AuthState {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
}

const text = (form: FormData, key: string) => String(form.get(key) ?? '').trim();
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** The cart becomes the customer's; failure here must not block signing in. */
async function attachCart(token: string) {
  const id = await readCartId();
  if (!id || !(await retrieveCart(id))) return;
  try {
    await medusa(`/store/carts/${id}/customer`, { method: 'POST', token, cache: 'no-store' });
  } catch {
    /* the cart stays a guest cart; checkout still works */
  }
}

/** Only same-site paths — never an open redirect to another origin. */
const safeNext = (value: string) => (value.startsWith('/') && !value.startsWith('//') ? value : '/hesabim');

export async function signIn(_previous: AuthState, form: FormData): Promise<AuthState> {
  const email = text(form, 'email').toLowerCase();
  const password = String(form.get('password') ?? '');
  const next = safeNext(text(form, 'next'));

  if (!EMAIL.test(email) || !password) {
    return { error: 'E-posta adresinizi ve şifrenizi girin.', values: { email } };
  }

  try {
    const { token } = await medusa<{ token: string }>('/auth/customer/emailpass', {
      method: 'POST',
      body: { email, password },
      cache: 'no-store',
    });
    await writeToken(token);
    await attachCart(token);
  } catch (error) {
    return {
      error:
        error instanceof MedusaError && error.status === 401
          ? 'E-posta adresi veya şifre hatalı.'
          : 'Giriş yapılamadı. Birazdan tekrar deneyin.',
      values: { email },
    };
  }
  redirect(next);
}

export async function register(_previous: AuthState, form: FormData): Promise<AuthState> {
  const values = {
    first_name: text(form, 'first_name'),
    last_name: text(form, 'last_name'),
    email: text(form, 'email').toLowerCase(),
    phone: text(form, 'phone'),
  };
  const password = String(form.get('password') ?? '');
  const next = safeNext(text(form, 'next'));

  const fieldErrors: Partial<Record<string, string>> = {};
  if (values.first_name.length < 2) fieldErrors.first_name = 'Adınızı girin.';
  if (values.last_name.length < 2) fieldErrors.last_name = 'Soyadınızı girin.';
  if (!EMAIL.test(values.email)) fieldErrors.email = 'Geçerli bir e-posta adresi girin.';
  if (password.length < 8 || !/\d/.test(password) || !/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(password)) {
    fieldErrors.password = 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli.';
  }
  if (form.get('kvkk') !== 'on') fieldErrors.kvkk = 'Üyelik için aydınlatma metnini onaylamanız gerekiyor.';
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values };
  }

  try {
    const { token: registration } = await medusa<{ token: string }>(
      '/auth/customer/emailpass/register',
      { method: 'POST', body: { email: values.email, password }, cache: 'no-store' },
    );
    await medusa('/store/customers', {
      method: 'POST',
      token: registration,
      cache: 'no-store',
      body: {
        email: values.email,
        first_name: values.first_name,
        last_name: values.last_name,
        ...(values.phone ? { phone: values.phone } : {}),
      },
    });
    // The registration token only authorises creating the customer; sign in
    // for a token that carries the new customer id.
    const { token } = await medusa<{ token: string }>('/auth/customer/emailpass', {
      method: 'POST',
      body: { email: values.email, password },
      cache: 'no-store',
    });
    await writeToken(token);
    await attachCart(token);
  } catch (error) {
    if (error instanceof MedusaError && /exists/i.test(error.message)) {
      return {
        error: 'Bu e-posta adresiyle bir üyelik zaten var. Giriş yapmayı deneyin.',
        fieldErrors: { email: 'Bu e-posta adresi kayıtlı.' },
        values,
      };
    }
    return { error: 'Üyelik oluşturulamadı. Birazdan tekrar deneyin.', values };
  }
  redirect(next);
}

export async function signOut() {
  await clearToken();
  // The cart now belongs to the customer; on a shared computer the next
  // visitor must not inherit it.
  await clearCartId();
  redirect('/');
}
