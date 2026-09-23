'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * The checkout form.
 *
 * One form, one server action (`placeOrder`). It works as a plain HTML form
 * post; React only adds the pending state, the conditional corporate-invoice
 * fields and the live total. The total shown here is a preview — item total
 * plus the shipping option picked — and the order confirmation shows the
 * figure Medusa actually charged.
 */

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Lock, ShieldCheck } from 'lucide-react';

import { PAYMENT_OPTIONS, type CheckoutState } from '@/data/checkout';
import { formatPrice } from '@/data/catalog';
import { PROVINCES_SORTED } from '@/data/provinces';
import type { CartSummary } from '@/lib/medusa/cart-summary';
import { placeOrder } from '@/lib/medusa/checkout';

export interface ShippingChoice {
  id: string;
  name: string;
  amount: number;
  description: string;
}

const inputClass =
  'mt-1 block h-11 w-full rounded-(--card-radius) border border-line-strong bg-surface-card px-3 text-[14px] text-text-primary outline-none transition-colors placeholder:text-text-secondary focus:border-brand aria-invalid:border-danger';

function Field({
  name,
  label,
  error,
  hint,
  className = '',
  children,
}: {
  name: string;
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-[13px] font-semibold text-text-primary">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[12px] font-medium text-danger-ink">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1 text-[12px] text-text-secondary">{hint}</p>
      ) : null}
    </div>
  );
}

function Step({ index, title, children }: { index: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1 dt:p-6">
      <h2 className="flex items-center gap-2.5 text-[16px] font-extrabold tracking-tight text-text-primary">
        <span
          aria-hidden
          className="grid h-7 w-7 place-items-center rounded-full bg-brand text-[13px] font-bold text-white"
        >
          {index}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-wait disabled:opacity-70"
    >
      <Lock size={17} strokeWidth={2} aria-hidden />
      {pending ? 'Siparişiniz oluşturuluyor…' : 'Siparişi Onayla'}
    </button>
  );
}

export function CheckoutForm({ cart, shipping }: { cart: CartSummary; shipping: ShippingChoice[] }) {
  const [state, action] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const v = state.values ?? {};
  const err = state.fieldErrors ?? {};
  const invalid = (name: string) =>
    err[name] ? { 'aria-invalid': true as const, 'aria-describedby': `${name}-error` } : {};

  const [shippingId, setShippingId] = useState(v.shipping_option || shipping[0]?.id || '');
  const [invoice, setInvoice] = useState(v.invoice || 'bireysel');
  const shippingAmount = shipping.find((option) => option.id === shippingId)?.amount ?? 0;

  return (
    <form action={action} noValidate className="container-main pb-12 pt-4 dt:pt-6">
      {state.error ? (
        <p
          role="alert"
          className="mb-4 rounded-(--card-radius) border border-danger bg-danger/10 px-4 py-3 text-[14px] font-medium text-danger-ink"
        >
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-(--space-grid-gap) dt:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-(--space-grid-gap)">
          <Step index={1} title="İletişim bilgileri">
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="email" label="E-posta" error={err.email} hint="Siparişinizle ilgili bu adresten size ulaşırız.">
                <input id="email" name="email" type="email" autoComplete="email" required defaultValue={v.email} className={inputClass} {...invalid('email')} />
              </Field>
              <Field name="phone" label="Cep telefonu" error={err.phone} hint="Kargo firması teslimat için arayabilir.">
                <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="05xx xxx xx xx" required defaultValue={v.phone} className={inputClass} {...invalid('phone')} />
              </Field>
            </div>
          </Step>

          <Step index={2} title="Teslimat adresi">
            <div className="grid gap-4 md:grid-cols-2">
              <Field name="first_name" label="Ad" error={err.first_name}>
                <input id="first_name" name="first_name" autoComplete="given-name" required defaultValue={v.first_name} className={inputClass} {...invalid('first_name')} />
              </Field>
              <Field name="last_name" label="Soyad" error={err.last_name}>
                <input id="last_name" name="last_name" autoComplete="family-name" required defaultValue={v.last_name} className={inputClass} {...invalid('last_name')} />
              </Field>
              <Field name="province" label="İl" error={err.province}>
                <select id="province" name="province" autoComplete="address-level1" required defaultValue={v.province ?? ''} className={inputClass} {...invalid('province')}>
                  <option value="" disabled>
                    İl seçin
                  </option>
                  {PROVINCES_SORTED.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </Field>
              <Field name="district" label="İlçe" error={err.district}>
                <input id="district" name="district" autoComplete="address-level2" required defaultValue={v.district} className={inputClass} {...invalid('district')} />
              </Field>
              <Field name="address" label="Açık adres" error={err.address} className="md:col-span-2">
                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  rows={3}
                  required
                  placeholder="Mahalle, cadde/sokak, bina no, daire no"
                  defaultValue={v.address}
                  className={`${inputClass} h-auto py-2.5`}
                  {...invalid('address')}
                />
              </Field>
              <Field name="postal_code" label="Posta kodu (isteğe bağlı)" error={err.postal_code}>
                <input id="postal_code" name="postal_code" inputMode="numeric" autoComplete="postal-code" maxLength={5} defaultValue={v.postal_code} className={inputClass} {...invalid('postal_code')} />
              </Field>
            </div>

            <fieldset className="mt-5 border-t border-line pt-4">
              <legend className="text-[13px] font-semibold text-text-primary">Fatura</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  { id: 'bireysel', label: 'Bireysel' },
                  { id: 'kurumsal', label: 'Kurumsal (firma adına)' },
                ].map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-line-strong px-3.5 py-2 text-[13px] font-medium text-text-primary has-checked:border-brand has-checked:bg-brand-soft"
                  >
                    <input
                      type="radio"
                      name="invoice"
                      value={option.id}
                      checked={invoice === option.id}
                      onChange={() => setInvoice(option.id)}
                      className="accent-(--color-brand)"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-[12px] text-text-secondary">Fatura adresi teslimat adresiyle aynıdır.</p>

              {invoice === 'kurumsal' ? (
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field name="company" label="Firma ünvanı" error={err.company} className="md:col-span-2">
                    <input id="company" name="company" autoComplete="organization" defaultValue={v.company} className={inputClass} {...invalid('company')} />
                  </Field>
                  <Field name="tax_office" label="Vergi dairesi" error={err.tax_office}>
                    <input id="tax_office" name="tax_office" defaultValue={v.tax_office} className={inputClass} {...invalid('tax_office')} />
                  </Field>
                  <Field name="tax_number" label="Vergi no / T.C. kimlik no" error={err.tax_number}>
                    <input id="tax_number" name="tax_number" inputMode="numeric" maxLength={11} defaultValue={v.tax_number} className={inputClass} {...invalid('tax_number')} />
                  </Field>
                </div>
              ) : null}
            </fieldset>
          </Step>

          <Step index={3} title="Kargo">
            <fieldset>
              <legend className="sr-only">Kargo seçeneği</legend>
              <div className="grid gap-2.5">
                {shipping.map((option) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-start gap-3 rounded-(--card-radius) border border-line-strong p-3.5 transition-colors has-checked:border-brand has-checked:bg-brand-soft"
                  >
                    <input
                      type="radio"
                      name="shipping_option"
                      value={option.id}
                      checked={shippingId === option.id}
                      onChange={() => setShippingId(option.id)}
                      className="mt-1 accent-(--color-brand)"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14px] font-semibold text-text-primary">{option.name}</span>
                      {option.description ? (
                        <span className="mt-0.5 block text-[12px] text-text-secondary">{option.description}</span>
                      ) : null}
                    </span>
                    <span className="shrink-0 text-[14px] font-bold tabular-nums text-text-primary">
                      {option.amount === 0 ? 'Ücretsiz' : formatPrice(option.amount)}
                    </span>
                  </label>
                ))}
              </div>
              {err.shipping_option ? (
                <p className="mt-2 text-[12px] font-medium text-danger-ink">{err.shipping_option}</p>
              ) : null}
            </fieldset>
          </Step>

          <Step index={4} title="Ödeme">
            <fieldset>
              <legend className="sr-only">Ödeme yöntemi</legend>
              <div className="grid gap-2.5">
                {PAYMENT_OPTIONS.map((option, i) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-start gap-3 rounded-(--card-radius) border border-line-strong p-3.5 transition-colors has-checked:border-brand has-checked:bg-brand-soft"
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.id}
                      defaultChecked={v.payment ? v.payment === option.id : i === 0}
                      className="mt-1 accent-(--color-brand)"
                    />
                    <span>
                      <span className="block text-[14px] font-semibold text-text-primary">{option.label}</span>
                      <span className="mt-0.5 block text-[12px] leading-relaxed text-text-secondary">
                        {option.description}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
              {err.payment ? <p className="mt-2 text-[12px] font-medium text-danger-ink">{err.payment}</p> : null}
            </fieldset>

            <Field name="note" label="Sipariş notu (isteğe bağlı)" className="mt-4">
              <textarea id="note" name="note" rows={2} maxLength={500} defaultValue={v.note} className={`${inputClass} h-auto py-2.5`} />
            </Field>
          </Step>
        </div>

        <aside className="dt:sticky dt:top-4 dt:self-start">
          <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
            <span aria-hidden className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4" />
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[16px] font-extrabold tracking-tight text-text-primary">Sipariş özeti</h2>
                <Link href="/sepet" className="text-[12px] font-semibold text-brand-text hover:underline">
                  Sepeti düzenle
                </Link>
              </div>

              <ul className="mt-3 max-h-64 space-y-2.5 overflow-y-auto border-b border-line pb-3">
                {cart.lines.map((line) => (
                  <li key={line.id} className="flex items-center gap-2.5">
                    <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-(--card-radius) border border-line bg-surface-card">
                      <img src={line.image} alt="" width={48} height={48} className="h-full w-full object-contain p-1" />
                      <span className="absolute -right-1.5 -top-1.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-text-primary px-1 text-[10px] font-bold text-surface-card">
                        {line.quantity}
                      </span>
                    </span>
                    <span className="line-clamp-2 min-w-0 flex-1 text-[12px] leading-[1.35] text-text-primary">{line.title}</span>
                    <span className="shrink-0 text-[13px] font-semibold tabular-nums text-text-primary">{formatPrice(line.total)}</span>
                  </li>
                ))}
              </ul>

              <dl className="space-y-2 border-b border-line py-3 text-[13px]">
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Ürünler</dt>
                  <dd className="font-semibold tabular-nums text-text-primary">{formatPrice(cart.itemTotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-text-secondary">Kargo</dt>
                  <dd className="font-semibold tabular-nums text-text-primary">
                    {shippingAmount === 0 ? 'Ücretsiz' : formatPrice(shippingAmount)}
                  </dd>
                </div>
              </dl>

              <div className="flex items-baseline justify-between pt-3">
                <span className="text-[13px] font-semibold text-text-primary">Toplam</span>
                <span className="text-[22px] font-extrabold tabular-nums text-text-primary">
                  {formatPrice(cart.itemTotal + shippingAmount)}
                </span>
              </div>
              <p className="mt-1 text-right text-[11px] text-text-secondary">KDV dahil</p>

              <label className="mt-4 flex items-start gap-2.5 text-[12px] leading-relaxed text-text-secondary">
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0 accent-(--color-brand)"
                  {...invalid('agreement')}
                />
                <span>
                  <Link href="/on-bilgilendirme-formu" className="font-semibold text-text-primary underline underline-offset-2" target="_blank">
                    Ön Bilgilendirme Formu
                  </Link>
                  ’nu ve{' '}
                  <Link href="/mesafeli-satis-sozlesmesi" className="font-semibold text-text-primary underline underline-offset-2" target="_blank">
                    Mesafeli Satış Sözleşmesi
                  </Link>
                  ’ni okudum, onaylıyorum.
                </span>
              </label>
              {err.agreement ? (
                <p id="agreement-error" className="mt-1 text-[12px] font-medium text-danger-ink">
                  {err.agreement}
                </p>
              ) : null}

              <SubmitButton />

              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-text-secondary">
                <ShieldCheck size={14} strokeWidth={1.9} aria-hidden />
                Bilgileriniz yalnızca siparişiniz için kullanılır.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
