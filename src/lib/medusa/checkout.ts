'use server';

/**
 * Place the order — the one server action behind the checkout form.
 *
 * Medusa's order path, in the order it requires:
 *   1. contact, addresses and metadata onto the cart
 *   2. the chosen shipping method
 *   3. a payment collection with a system-provider session
 *   4. complete → the cart becomes an order, stock is reserved
 *
 * Every step is re-validated here; the form's `required` attributes are a
 * convenience, not a guarantee. A failure returns the visitor's input so the
 * form re-renders filled in, with the message beside the field that caused it.
 */

import { redirect } from 'next/navigation';

import { PAYMENT_OPTIONS, type CheckoutState } from '@/data/checkout';
import { PROVINCES } from '@/data/provinces';
import { clearCartId, currentCart } from '@/lib/medusa/cart-cookie';
import { MedusaError, medusa } from '@/lib/medusa/client';
import { readToken } from '@/lib/medusa/session';

const FIELDS = [
  'email',
  'phone',
  'first_name',
  'last_name',
  'province',
  'district',
  'address',
  'postal_code',
  'shipping_option',
  'payment',
  'invoice',
  'company',
  'tax_office',
  'tax_number',
  'note',
  'agreement',
] as const;

type Values = Record<(typeof FIELDS)[number], string>;

/** 05xx xxx xx xx, 5xx xxx xx xx or +90 5xx… → +905xxxxxxxxx; null when not a mobile. */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');
  return /^5\d{9}$/.test(digits) ? `+90${digits}` : null;
}

function validate(v: Values): Partial<Record<string, string>> {
  const errors: Partial<Record<string, string>> = {};
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Geçerli bir e-posta adresi girin.';
  if (!normalisePhone(v.phone)) errors.phone = 'Cep telefonunuzu 05xx xxx xx xx biçiminde girin.';
  if (v.first_name.length < 2) errors.first_name = 'Adınızı girin.';
  if (v.last_name.length < 2) errors.last_name = 'Soyadınızı girin.';
  if (!(PROVINCES as readonly string[]).includes(v.province)) errors.province = 'İl seçin.';
  if (v.district.length < 2) errors.district = 'İlçeyi girin.';
  if (v.address.length < 10) errors.address = 'Mahalle, sokak, bina ve daire bilgisini girin.';
  if (v.postal_code && !/^\d{5}$/.test(v.postal_code)) errors.postal_code = 'Posta kodu 5 haneli olmalı.';
  if (!v.shipping_option) errors.shipping_option = 'Bir kargo seçeneği seçin.';
  if (!PAYMENT_OPTIONS.some((option) => option.id === v.payment)) errors.payment = 'Bir ödeme yöntemi seçin.';
  if (v.invoice === 'kurumsal') {
    if (v.company.length < 2) errors.company = 'Firma ünvanını girin.';
    if (v.tax_office.length < 2) errors.tax_office = 'Vergi dairesini girin.';
    if (!/^\d{10,11}$/.test(v.tax_number)) errors.tax_number = 'Vergi / T.C. kimlik no 10 veya 11 haneli olmalı.';
  }
  if (v.agreement !== 'on') {
    errors.agreement = 'Siparişi verebilmek için sözleşmeleri onaylamanız gerekiyor.';
  }
  return errors;
}

export async function placeOrder(_previous: CheckoutState, form: FormData): Promise<CheckoutState> {
  const values = Object.fromEntries(
    FIELDS.map((key) => [key, String(form.get(key) ?? '').trim()]),
  ) as Values;
  // Never echo the agreement tick back: re-confirming after an error is correct.
  const { agreement: _agreement, ...echo } = values;
  void _agreement;

  const fieldErrors = validate(values);
  if (Object.keys(fieldErrors).length > 0) {
    return { error: 'Lütfen işaretli alanları kontrol edin.', fieldErrors, values: echo };
  }

  const cart = await currentCart();
  if (!cart || (cart.items?.length ?? 0) === 0) {
    return { error: 'Sepetiniz boş ya da süresi dolmuş. Sepetinize dönüp tekrar deneyin.', values: echo };
  }

  const corporate = values.invoice === 'kurumsal';
  const address = {
    first_name: values.first_name,
    last_name: values.last_name,
    phone: normalisePhone(values.phone)!,
    address_1: values.address,
    city: values.district,
    province: values.province,
    postal_code: values.postal_code || undefined,
    country_code: 'tr',
    company: corporate ? values.company : undefined,
  };

  let orderId: string;
  try {
    // A signed-in customer's order must land in their account. Signing in
    // already attaches the cart; this covers a cart started in another tab.
    const token = await readToken();
    if (token) {
      await medusa(`/store/carts/${cart.id}/customer`, { method: 'POST', token, cache: 'no-store' }).catch(
        () => undefined,
      );
    }

    await medusa(`/store/carts/${cart.id}`, {
      method: 'POST',
      cache: 'no-store',
      body: {
        email: values.email.toLowerCase(),
        shipping_address: address,
        billing_address: address,
        metadata: {
          payment_method: values.payment,
          invoice_type: corporate ? 'kurumsal' : 'bireysel',
          ...(corporate ? { tax_office: values.tax_office, tax_number: values.tax_number } : {}),
          ...(values.note ? { customer_note: values.note.slice(0, 500) } : {}),
        },
      },
    });

    await medusa(`/store/carts/${cart.id}/shipping-methods`, {
      method: 'POST',
      cache: 'no-store',
      body: { option_id: values.shipping_option },
    });

    const { payment_collection } = await medusa<{ payment_collection: { id: string } }>(
      '/store/payment-collections',
      { method: 'POST', cache: 'no-store', body: { cart_id: cart.id } },
    );
    await medusa(`/store/payment-collections/${payment_collection.id}/payment-sessions`, {
      method: 'POST',
      cache: 'no-store',
      body: { provider_id: 'pp_system_default' },
    });

    const result = await medusa<
      { type: 'order'; order: { id: string } } | { type: 'cart'; error?: { message?: string } }
    >(`/store/carts/${cart.id}/complete`, { method: 'POST', cache: 'no-store' });

    if (result.type !== 'order') {
      return {
        error: /inventory/i.test(result.error?.message ?? '')
          ? 'Sepetinizdeki bir ürünün stoğu siz alışveriş yaparken tükendi. Sepetinizi kontrol edin.'
          : 'Sipariş oluşturulamadı. Lütfen tekrar deneyin.',
        values: echo,
      };
    }
    orderId = result.order.id;
  } catch (error) {
    if (error instanceof MedusaError && /inventory/i.test(error.message)) {
      return {
        error: 'Sepetinizdeki bir ürünün stoğu yetersiz. Sepetinizi kontrol edin.',
        values: echo,
      };
    }
    return {
      error:
        error instanceof MedusaError
          ? 'Sipariş oluşturulamadı. Bilgilerinizi kontrol edip tekrar deneyin.'
          : 'Mağaza sunucusuna ulaşılamıyor. Birazdan tekrar deneyin.',
      values: echo,
    };
  }

  // The cart is an order now; the next visit starts a fresh one.
  await clearCartId();
  redirect(`/siparis/${orderId}`);
}
