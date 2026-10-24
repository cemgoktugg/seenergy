'use client';

/**
 * One form for every request page — iletişim, teklif, kurumsal, toptan,
 * bayi, havale, kariyer. A page lists its fields; this renders them in the
 * site's form style, posts them through `submitInquiry` (→ Medusa → admin →
 * Talepler), keeps what was typed when something is wrong, and replaces
 * itself with a confirmation when it is sent.
 *
 * Base fields go by their own names (name, email, phone, company, subject,
 * message); everything else is posted as `data.<name>`.
 */

import { useActionState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Send } from 'lucide-react';

import { Field, inputClass, invalidProps } from '@/components/form-field';
import type { InquiryField } from '@/data/inquiry-fields';
import { submitInquiry, type InquiryState } from '@/lib/medusa/inquiry';

const BASE = new Set(['name', 'email', 'phone', 'company', 'subject', 'message']);


export function InquiryForm({
  type,
  fields,
  initial = {},
  submitLabel = 'Gönder',
  successTitle = 'Talebiniz alındı',
  successText = 'En kısa sürede sizinle iletişime geçeceğiz.',
}: {
  type: string;
  fields: InquiryField[];
  /** Prefill by field name, e.g. the product a quote is for. */
  initial?: Record<string, string>;
  submitLabel?: string;
  successTitle?: string;
  successText?: string;
}) {
  const [state, action, pending] = useActionState<InquiryState, FormData>(submitInquiry, {});
  const errors = state.fieldErrors ?? {};
  const inputName = (field: InquiryField) => (BASE.has(field.name) ? field.name : `data.${field.name}`);
  const value = (field: InquiryField) => state.values?.[inputName(field)] ?? initial[field.name] ?? '';

  if (state.ok) {
    return (
      <div role="status" className="rounded-(--panel-radius) border border-success/30 bg-success/5 px-5 py-8 text-center">
        <CheckCircle2 size={34} strokeWidth={1.8} aria-hidden className="mx-auto text-success-ink" />
        <p className="mt-3 text-[20px] font-extrabold text-text-primary">{successTitle}</p>
        <p className="mx-auto mt-1.5 max-w-[46ch] text-[14px] text-text-secondary">{successText}</p>
        <Link href="/" className="mt-5 inline-flex items-center rounded-full bg-brand px-5 h-11 text-[14px] font-semibold text-white hover:bg-brand-dark">
          Alışverişe devam et
        </Link>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="not-prose">
      <input type="hidden" name="type" value={type} />
      <input
        type="hidden"
        name="required"
        value={fields.filter((field) => field.required && !['name', 'email'].includes(field.name)).map(inputName).join(',')}
      />
      {/* Honeypot: off-screen, out of the tab order, ignored by people. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Web sitesi
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.error ? (
        <p role="alert" className="mb-4 rounded-(--card-radius) border border-danger/30 bg-danger/5 px-3.5 py-2.5 text-[14px] font-medium text-danger-ink">
          {state.error}
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const name = inputName(field);
          const label = field.required ? `${field.label} *` : field.label;
          const common = {
            id: name,
            name,
            defaultValue: value(field),
            placeholder: field.placeholder,
            required: field.required,
            autoComplete: field.autoComplete,
            ...invalidProps(errors, name),
          };
          return (
            <Field
              key={name}
              name={name}
              label={label}
              error={errors[name]}
              hint={field.hint}
              className={field.wide || field.type === 'textarea' ? 'sm:col-span-2' : ''}
            >
              {field.type === 'textarea' ? (
                <textarea {...common} rows={5} className={`${inputClass} h-auto py-2.5`} />
              ) : field.type === 'select' ? (
                <select {...common} className={inputClass}>
                  <option value="">Seçin</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={field.type ?? 'text'} className={inputClass} />
              )}
            </Field>
          );
        })}
      </div>

      <label className="mt-5 flex items-start gap-2.5 text-[13px] leading-snug text-text-secondary">
        <input type="checkbox" name="kvkk" className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand)]" {...invalidProps(errors, 'kvkk')} />
        <span>
          Kişisel verilerimin talebime dönüş yapılması amacıyla işlenmesine ilişkin{' '}
          <Link href="/kvkk-aydinlatma-metni" target="_blank" className="font-semibold text-text-primary underline underline-offset-2">
            KVKK Aydınlatma Metni
          </Link>
          &apos;ni okudum.
        </span>
      </label>
      {errors.kvkk ? (
        <p id="kvkk-error" className="mt-1 text-[12px] font-medium text-danger-ink">
          {errors.kvkk}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 inline-flex h-12 items-center gap-2 rounded-full bg-brand px-6 text-[16px] font-bold text-white shadow-e2 transition-[transform,background-color] hover:-translate-y-px hover:bg-brand-dark disabled:translate-y-0 disabled:opacity-60"
      >
        <Send size={17} strokeWidth={2} aria-hidden />
        {pending ? 'Gönderiliyor…' : submitLabel}
      </button>
    </form>
  );
}
