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

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { PROVINCES } from '@/data/provinces';
import { clearCartId, readCartId, retrieveCart } from '@/lib/medusa/cart-cookie';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { clearToken, readToken, writeToken } from '@/lib/medusa/session';

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

/* ------------------------------------------------------------------ */
/* Signed-in account: profile, password, address book (2026-10-24)     */
/* ------------------------------------------------------------------ */

export interface FormState {
  ok?: string;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
}

const PROVINCE_SET = new Set<string>(PROVINCES);

async function requireToken(): Promise<string> {
  const token = await readToken();
  if (!token) redirect('/hesabim');
  return token;
}

/** 05xx xxx xx xx → +905xxxxxxxxx; empty stays empty; null when not a mobile. */
function mobile(raw: string): string | null {
  if (!raw) return '';
  const digits = raw.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  return /^5\d{9}$/.test(digits) ? `+90${digits}` : null;
}

export async function updateProfile(_previous: FormState, form: FormData): Promise<FormState> {
  const token = await requireToken();
  const values = {
    first_name: text(form, 'first_name'),
    last_name: text(form, 'last_name'),
    phone: text(form, 'phone'),
    company_name: text(form, 'company_name'),
  };
  const fieldErrors: Partial<Record<string, string>> = {};
  if (values.first_name.length < 2) fieldErrors.first_name = 'Adınızı girin.';
  if (values.last_name.length < 2) fieldErrors.last_name = 'Soyadınızı girin.';
  const phone = mobile(values.phone);
  if (phone === null) fieldErrors.phone = 'Cep telefonunuzu 05xx xxx xx xx biçiminde girin.';
  if (Object.keys(fieldErrors).length) return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values };
  try {
    await medusa('/store/customers/me', {
      method: 'POST',
      token,
      cache: 'no-store',
      body: {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: phone || null,
        company_name: values.company_name || null,
      },
    });
  } catch {
    return { error: 'Bilgileriniz kaydedilemedi. Birazdan tekrar deneyin.', values };
  }
  revalidatePath('/hesabim', 'layout');
  return { ok: 'Bilgileriniz güncellendi.' };
}

export async function changePassword(_previous: FormState, form: FormData): Promise<FormState> {
  const token = await requireToken();
  const current = String(form.get('current_password') ?? '');
  const next = String(form.get('new_password') ?? '');
  const repeat = String(form.get('repeat_password') ?? '');
  const fieldErrors: Partial<Record<string, string>> = {};
  if (!current) fieldErrors.current_password = 'Mevcut şifrenizi girin.';
  if (next.length < 8 || !/\d/.test(next) || !/[A-Za-zÇĞİÖŞÜçğıöşü]/.test(next)) {
    fieldErrors.new_password = 'Şifre en az 8 karakter olmalı, harf ve rakam içermeli.';
  }
  if (next !== repeat) fieldErrors.repeat_password = 'Şifreler aynı değil.';
  if (Object.keys(fieldErrors).length) return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors };
  try {
    await medusa('/store/customers/me/password', {
      method: 'POST',
      token,
      cache: 'no-store',
      body: { current_password: current, new_password: next },
    });
  } catch (error) {
    if (error instanceof MedusaError && /hatalı/i.test(error.message)) {
      return { error: 'Mevcut şifreniz hatalı.', fieldErrors: { current_password: 'Mevcut şifreniz hatalı.' } };
    }
    return { error: error instanceof MedusaError ? error.message : 'Şifreniz değiştirilemedi. Birazdan tekrar deneyin.' };
  }
  return { ok: 'Şifreniz değiştirildi.' };
}

const ADDRESS_FIELDS = ['id', 'address_name', 'first_name', 'last_name', 'phone', 'province', 'district', 'address', 'postal_code', 'company', 'is_default'] as const;

export async function saveAddress(_previous: FormState, form: FormData): Promise<FormState> {
  const token = await requireToken();
  const v = Object.fromEntries(ADDRESS_FIELDS.map((key) => [key, text(form, key)])) as Record<(typeof ADDRESS_FIELDS)[number], string>;
  const fieldErrors: Partial<Record<string, string>> = {};
  if (v.first_name.length < 2) fieldErrors.first_name = 'Adı girin.';
  if (v.last_name.length < 2) fieldErrors.last_name = 'Soyadı girin.';
  const phone = mobile(v.phone);
  if (!phone) fieldErrors.phone = 'Cep telefonunu 05xx xxx xx xx biçiminde girin.';
  if (!PROVINCE_SET.has(v.province)) fieldErrors.province = 'İl seçin.';
  if (v.district.length < 2) fieldErrors.district = 'İlçeyi girin.';
  if (v.address.length < 10) fieldErrors.address = 'Mahalle, sokak, bina ve daire bilgisini girin.';
  if (v.postal_code && !/^\d{5}$/.test(v.postal_code)) fieldErrors.postal_code = 'Posta kodu 5 haneli olmalı.';
  if (Object.keys(fieldErrors).length) return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values: v };

  const body = {
    address_name: v.address_name || null,
    first_name: v.first_name,
    last_name: v.last_name,
    phone,
    company: v.company || null,
    address_1: v.address,
    city: v.district,
    province: v.province,
    postal_code: v.postal_code || null,
    country_code: 'tr',
    is_default_shipping: v.is_default === 'on',
    is_default_billing: v.is_default === 'on',
  };
  try {
    await medusa(v.id ? `/store/customers/me/addresses/${v.id}` : '/store/customers/me/addresses', {
      method: 'POST',
      token,
      cache: 'no-store',
      body,
    });
  } catch {
    return { error: 'Adres kaydedilemedi. Birazdan tekrar deneyin.', values: v };
  }
  revalidatePath('/hesabim/adresler');
  redirect('/hesabim/adresler?kaydedildi=1');
}

export async function deleteAddress(form: FormData) {
  const token = await requireToken();
  const id = text(form, 'id');
  if (id) {
    await medusa(`/store/customers/me/addresses/${id}`, { method: 'DELETE', token, cache: 'no-store' }).catch(
      () => undefined,
    );
  }
  revalidatePath('/hesabim/adresler');
  redirect('/hesabim/adresler');
}

export async function makeDefaultAddress(form: FormData) {
  const token = await requireToken();
  const id = text(form, 'id');
  if (id) {
    await medusa(`/store/customers/me/addresses/${id}`, {
      method: 'POST',
      token,
      cache: 'no-store',
      body: { is_default_shipping: true, is_default_billing: true },
    }).catch(() => undefined);
  }
  revalidatePath('/hesabim/adresler');
  redirect('/hesabim/adresler');
}
