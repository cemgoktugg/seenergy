'use client';

/**
 * Sign-in and registration, side by side on desktop, stacked on a phone.
 *
 * Both are plain forms posting to server actions; React adds the pending
 * state and keeps what was typed after a failed attempt. `next` carries the
 * page to return to — checkout sends visitors here and expects them back.
 */

import Link from 'next/link';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { Field, inputClass, invalidProps } from '@/components/form-field';
import { register, signIn, type AuthState } from '@/lib/medusa/account';

function Submit({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-brand text-[15px] font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? busy : idle}
    </button>
  );
}

function Alert({ message }: { message?: string }) {
  return message ? (
    <p
      role="alert"
      className="mb-4 rounded-(--card-radius) border border-danger bg-danger/10 px-3 py-2.5 text-[13px] font-medium text-danger-ink"
    >
      {message}
    </p>
  ) : null;
}

const panel = 'rounded-(--panel-radius) border border-line bg-surface-card p-5 shadow-e1 dt:p-7';

export function AuthForms({ next }: { next: string }) {
  const [signInState, signInAction] = useActionState<AuthState, FormData>(signIn, {});
  const [registerState, registerAction] = useActionState<AuthState, FormData>(register, {});
  const r = registerState.values ?? {};
  const rErr = registerState.fieldErrors ?? {};

  return (
    <div className="grid gap-(--space-grid-gap) md:grid-cols-2">
      <form action={signInAction} noValidate className={panel}>
        <h2 className="text-[18px] font-extrabold tracking-tight text-text-primary">Giriş yap</h2>
        <p className="mt-1 mb-5 text-[13px] text-text-secondary">
          Siparişlerinizi görmek ve daha hızlı ödeme yapmak için.
        </p>
        <Alert message={signInState.error} />
        <input type="hidden" name="next" value={next} />
        <div className="grid gap-4">
          <Field name="signin-email" label="E-posta">
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              defaultValue={signInState.values?.email}
              className={inputClass}
            />
          </Field>
          <Field name="signin-password" label="Şifre">
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </Field>
        </div>
        <Submit idle="Giriş Yap" busy="Giriş yapılıyor…" />
        {/* No e-mail provider yet, so no self-service reset link to send:
            the request goes to the shop, which can reset it from the admin. */}
        <p className="mt-3 text-[12.5px] text-text-secondary">
          Şifrenizi mi unuttunuz?{' '}
          <Link href="/iletisim?konu=genel" className="font-semibold text-text-primary underline underline-offset-2">
            Bize yazın
          </Link>
          , şifrenizi sıfırlayalım.
        </p>
      </form>

      <form action={registerAction} noValidate className={panel}>
        <h2 className="text-[18px] font-extrabold tracking-tight text-text-primary">Üye ol</h2>
        <p className="mt-1 mb-5 text-[13px] text-text-secondary">
          Üye olmadan da sipariş verebilirsiniz; üyelik siparişlerinizi tek yerde toplar.
        </p>
        <Alert message={registerState.error} />
        <input type="hidden" name="next" value={next} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field name="first_name" label="Ad" error={rErr.first_name}>
            <input id="first_name" name="first_name" autoComplete="given-name" required defaultValue={r.first_name} className={inputClass} {...invalidProps(rErr, 'first_name')} />
          </Field>
          <Field name="last_name" label="Soyad" error={rErr.last_name}>
            <input id="last_name" name="last_name" autoComplete="family-name" required defaultValue={r.last_name} className={inputClass} {...invalidProps(rErr, 'last_name')} />
          </Field>
          <Field name="email" label="E-posta" error={rErr.email} className="sm:col-span-2">
            <input id="email" name="email" type="email" autoComplete="email" required defaultValue={r.email} className={inputClass} {...invalidProps(rErr, 'email')} />
          </Field>
          <Field name="phone" label="Cep telefonu (isteğe bağlı)" className="sm:col-span-2">
            <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" defaultValue={r.phone} className={inputClass} />
          </Field>
          <Field
            name="password"
            label="Şifre"
            error={rErr.password}
            hint="En az 8 karakter; harf ve rakam içermeli."
            className="sm:col-span-2"
          >
            <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} className={inputClass} {...invalidProps(rErr, 'password')} />
          </Field>
        </div>
        <label className="mt-4 flex items-start gap-2.5 text-[12px] leading-relaxed text-text-secondary">
          <input type="checkbox" name="kvkk" required className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-brand)" {...invalidProps(rErr, 'kvkk')} />
          <span>
            <Link href="/kvkk-aydinlatma-metni" target="_blank" className="font-semibold text-text-primary underline underline-offset-2">
              KVKK Aydınlatma Metni
            </Link>
            ’ni okudum; kişisel verilerimin üyelik ve siparişlerim için işlenmesini kabul ediyorum.
          </span>
        </label>
        {rErr.kvkk ? (
          <p id="kvkk-error" className="mt-1 text-[12px] font-medium text-danger-ink">
            {rErr.kvkk}
          </p>
        ) : null}
        <Submit idle="Üye Ol" busy="Üyeliğiniz oluşturuluyor…" />
      </form>
    </div>
  );
}
