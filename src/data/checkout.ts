/**
 * Checkout choices shared by the form (client) and the order action (server).
 *
 * Both payment methods run through Medusa's system payment provider: no money
 * moves online, the order is created unpaid, and the shop marks it paid in the
 * admin once the transfer arrives or the courier collects. The method chosen is
 * stored on the order's metadata so the admin can see which one it is.
 * An online card provider (iyzico, PayTR) slots in as a third entry later.
 */

export const PAYMENT_OPTIONS = [
  {
    id: 'havale',
    label: 'Havale / EFT',
    description:
      'Siparişinizi onayladıktan sonra banka hesap bilgilerimizi iletiriz. Ödemeniz hesabımıza ulaştığında siparişiniz kargoya verilir.',
  },
  {
    id: 'kapida',
    label: 'Kapıda Ödeme',
    description: 'Ürünü teslim alırken kargo görevlisine ödeme yaparsınız.',
  },
] as const;

export type PaymentOptionId = (typeof PAYMENT_OPTIONS)[number]['id'];

export const paymentLabel = (id: unknown): string =>
  PAYMENT_OPTIONS.find((option) => option.id === id)?.label ?? 'Belirtilmedi';

/** Form state the order action hands back when it cannot place the order. */
export interface CheckoutState {
  error?: string;
  fieldErrors?: Partial<Record<string, string>>;
  /** What the visitor typed, so a failed submit does not wipe the form. */
  values?: Record<string, string>;
}
