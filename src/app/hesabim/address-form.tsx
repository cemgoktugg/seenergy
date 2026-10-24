'use client';

/**
 * Add or edit an address in the customer's Medusa address book. Posts
 * through `saveAddress`; on success the action redirects back to the list.
 */

import { useActionState } from 'react';
import Link from 'next/link';

import { Field, inputClass, invalidProps } from '@/components/form-field';
import { PROVINCES_SORTED } from '@/data/provinces';
import { saveAddress, type FormState } from '@/lib/medusa/account';

export interface AddressValues {
  id?: string;
  address_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  province?: string;
  district?: string;
  address?: string;
  postal_code?: string;
  company?: string;
  is_default?: boolean;
}

export function AddressForm({ initial }: { initial: AddressValues }) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveAddress, {});
  const v = { ...initial, ...(state.values ?? {}) } as Record<string, string | boolean | undefined>;
  const err = state.fieldErrors ?? {};
  const str = (key: string) => (typeof v[key] === 'string' ? (v[key] as string) : '');

  return (
    <form action={action} noValidate className="rounded-(--panel-radius) border border-line bg-surface-card p-5 shadow-e1 dt:p-6">
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      {state.error ? (
        <p role="alert" className="mb-4 rounded-(--card-radius) border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[14px] font-medium text-danger-ink">
          {state.error}
        </p>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="address_name" label="Adres başlığı" hint="Örn. Ev, İş yeri, Depo" className="md:col-span-2">
          <input id="address_name" name="address_name" defaultValue={str('address_name')} className={inputClass} />
        </Field>
        <Field name="first_name" label="Ad" error={err.first_name}>
          <input id="first_name" name="first_name" autoComplete="given-name" defaultValue={str('first_name')} className={inputClass} {...invalidProps(err, 'first_name')} />
        </Field>
        <Field name="last_name" label="Soyad" error={err.last_name}>
          <input id="last_name" name="last_name" autoComplete="family-name" defaultValue={str('last_name')} className={inputClass} {...invalidProps(err, 'last_name')} />
        </Field>
        <Field name="phone" label="Cep telefonu" error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" defaultValue={str('phone')} className={inputClass} {...invalidProps(err, 'phone')} />
        </Field>
        <Field name="company" label="Firma (isteğe bağlı)">
          <input id="company" name="company" autoComplete="organization" defaultValue={str('company')} className={inputClass} />
        </Field>
        <Field name="province" label="İl" error={err.province}>
          <select id="province" name="province" defaultValue={str('province')} className={inputClass} {...invalidProps(err, 'province')}>
            <option value="">İl seçin</option>
            {PROVINCES_SORTED.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </Field>
        <Field name="district" label="İlçe" error={err.district}>
          <input id="district" name="district" autoComplete="address-level2" defaultValue={str('district')} className={inputClass} {...invalidProps(err, 'district')} />
        </Field>
        <Field name="address" label="Açık adres" error={err.address} className="md:col-span-2">
          <textarea
            id="address"
            name="address"
            rows={3}
            autoComplete="street-address"
            placeholder="Mahalle, cadde/sokak, bina no, daire no"
            defaultValue={str('address')}
            className={`${inputClass} h-auto py-2.5`}
            {...invalidProps(err, 'address')}
          />
        </Field>
        <Field name="postal_code" label="Posta kodu (isteğe bağlı)" error={err.postal_code}>
          <input id="postal_code" name="postal_code" inputMode="numeric" maxLength={5} defaultValue={str('postal_code')} className={inputClass} {...invalidProps(err, 'postal_code')} />
        </Field>
      </div>
      <label className="mt-5 flex items-center gap-2.5 text-[14px] font-medium text-text-primary">
        <input type="checkbox" name="is_default" defaultChecked={Boolean(initial.is_default)} className="h-4 w-4 accent-[var(--color-brand)]" />
        Varsayılan teslimat adresim olsun
      </label>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <button type="submit" disabled={pending} className="inline-flex h-11 items-center rounded-full bg-brand px-6 text-[14px] font-bold text-white hover:bg-brand-dark disabled:opacity-60">
          {pending ? 'Kaydediliyor…' : 'Adresi kaydet'}
        </button>
        <Link href="/hesabim/adresler" className="inline-flex h-11 items-center rounded-full border border-line-strong px-5 text-[14px] font-semibold text-text-primary hover:border-text-primary">
          Vazgeç
        </Link>
      </div>
    </form>
  );
}
