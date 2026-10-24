'use server';

/**
 * Send a storefront form to Medusa (POST /store/inquiries), where it lands in
 * admin → Talepler. One action for every form: the base fields (name, e-mail,
 * phone, company, subject, message) by name, the form's own fields as
 * `data.<key>` inputs.
 */

import { MedusaError, medusa } from '@/lib/medusa/client';

export interface InquiryState {
  ok?: boolean;
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
}

const TYPES = ['iletisim', 'teklif', 'kurumsal', 'toptan', 'bayi', 'havale', 'kariyer'] as const;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitInquiry(_previous: InquiryState, form: FormData): Promise<InquiryState> {
  const values: Record<string, string> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === 'string') values[key] = value.trim();
  }

  // A hidden field people never see; bots fill it. Pretend success.
  if (values.website) return { ok: true };

  const type = values.type as (typeof TYPES)[number];
  if (!TYPES.includes(type)) return { error: 'Form türü tanınmadı.' };

  const required = (values.required ?? '').split(',').filter(Boolean);
  const fieldErrors: Partial<Record<string, string>> = {};
  if ((values.name ?? '').length < 2) fieldErrors.name = 'Adınızı ve soyadınızı girin.';
  if (!EMAIL.test(values.email ?? '')) fieldErrors.email = 'Geçerli bir e-posta adresi girin.';
  if (values.phone && values.phone.replace(/\D/g, '').length < 10) fieldErrors.phone = 'Telefon numaranızı kontrol edin.';
  for (const name of required) {
    if (!values[name] && !fieldErrors[name]) fieldErrors[name] = 'Bu alanı doldurun.';
  }
  if (values.kvkk !== 'on') fieldErrors.kvkk = 'Devam etmek için aydınlatma metnini onaylayın.';

  const echo = Object.fromEntries(Object.entries(values).filter(([key]) => !['kvkk', 'website', 'required'].includes(key)));
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values: echo };
  }

  const data = Object.fromEntries(
    Object.entries(values)
      .filter(([key, value]) => key.startsWith('data.') && value)
      .map(([key, value]) => [key.slice(5), value.slice(0, 500)]),
  );

  try {
    await medusa('/store/inquiries', {
      method: 'POST',
      cache: 'no-store',
      body: {
        type,
        name: values.name ?? '',
        email: (values.email ?? '').toLowerCase(),
        ...(values.phone ? { phone: values.phone } : {}),
        ...(values.company ? { company: values.company } : {}),
        ...(values.subject ? { subject: values.subject } : {}),
        ...(values.message ? { message: values.message.slice(0, 5000) } : {}),
        ...(Object.keys(data).length ? { data } : {}),
      },
    });
  } catch (error) {
    return {
      error:
        error instanceof MedusaError && error.status === 400
          ? error.message
          : 'Talebiniz gönderilemedi. Birazdan tekrar deneyin ya da bizi telefonla arayın.',
      values: echo,
    };
  }
  return { ok: true };
}
