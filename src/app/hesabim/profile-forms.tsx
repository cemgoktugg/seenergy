'use client';

/** Profile and password forms of /hesabim/bilgiler. */

import { useActionState } from 'react';
import { CheckCircle2 } from 'lucide-react';

import { Field, inputClass, invalidProps } from '@/components/form-field';
import { changePassword, updateProfile, type FormState } from '@/lib/medusa/account';

function Notice({ state }: { state: FormState }) {
  if (state.ok) {
    return (
      <p role="status" className="mb-4 flex items-center gap-2 rounded-(--card-radius) border border-success/30 bg-success/5 px-3.5 py-2.5 text-[14px] font-medium text-success-ink">
        <CheckCircle2 size={16} strokeWidth={2} aria-hidden />
        {state.ok}
      </p>
    );
  }
  if (state.error) {
    return (
      <p role="alert" className="mb-4 rounded-(--card-radius) border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[14px] font-medium text-danger-ink">
        {state.error}
      </p>
    );
  }
  return null;
}

const card = 'rounded-(--panel-radius) border border-line bg-surface-card p-5 shadow-e1 dt:p-6';
const submit = 'mt-5 inline-flex h-11 items-center rounded-full bg-brand px-6 text-[14px] font-bold text-white hover:bg-brand-dark disabled:opacity-60';

export function ProfileForm({ initial, email }: { initial: Record<string, string>; email: string }) {
  const [state, action, pending] = useActionState<FormState, FormData>(updateProfile, {});
  const v = state.values ?? initial;
  const err = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className={card}>
      <h2 className="mb-4 text-[16px] font-extrabold text-text-primary">Kişisel bilgiler</h2>
      <Notice state={state} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="first_name" label="Ad" error={err.first_name}>
          <input id="first_name" name="first_name" autoComplete="given-name" defaultValue={v.first_name} className={inputClass} {...invalidProps(err, 'first_name')} />
        </Field>
        <Field name="last_name" label="Soyad" error={err.last_name}>
          <input id="last_name" name="last_name" autoComplete="family-name" defaultValue={v.last_name} className={inputClass} {...invalidProps(err, 'last_name')} />
        </Field>
        <Field name="profile_email" label="E-posta" hint="E-posta adresiniz giriş bilginizdir; değiştirmek için bize ulaşın.">
          <input id="profile_email" value={email} readOnly disabled className={`${inputClass} opacity-70`} />
        </Field>
        <Field name="phone" label="Cep telefonu" error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="05xx xxx xx xx" defaultValue={v.phone} className={inputClass} {...invalidProps(err, 'phone')} />
        </Field>
        <Field name="company_name" label="Firma (isteğe bağlı)" className="md:col-span-2">
          <input id="company_name" name="company_name" autoComplete="organization" defaultValue={v.company_name} className={inputClass} />
        </Field>
      </div>
      <button type="submit" disabled={pending} className={submit}>
        {pending ? 'Kaydediliyor…' : 'Bilgileri kaydet'}
      </button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(changePassword, {});
  const err = state.fieldErrors ?? {};
  return (
    <form action={action} noValidate className={card} key={state.ok ? 'done' : 'form'}>
      <h2 className="mb-4 text-[16px] font-extrabold text-text-primary">Şifre değiştir</h2>
      <Notice state={state} />
      <div className="grid gap-4 md:grid-cols-3">
        <Field name="current_password" label="Mevcut şifre" error={err.current_password}>
          <input id="current_password" name="current_password" type="password" autoComplete="current-password" className={inputClass} {...invalidProps(err, 'current_password')} />
        </Field>
        <Field name="new_password" label="Yeni şifre" error={err.new_password} hint="En az 8 karakter, harf ve rakam.">
          <input id="new_password" name="new_password" type="password" autoComplete="new-password" className={inputClass} {...invalidProps(err, 'new_password')} />
        </Field>
        <Field name="repeat_password" label="Yeni şifre (tekrar)" error={err.repeat_password}>
          <input id="repeat_password" name="repeat_password" type="password" autoComplete="new-password" className={inputClass} {...invalidProps(err, 'repeat_password')} />
        </Field>
      </div>
      <button type="submit" disabled={pending} className={submit}>
        {pending ? 'Değiştiriliyor…' : 'Şifreyi değiştir'}
      </button>
    </form>
  );
}
