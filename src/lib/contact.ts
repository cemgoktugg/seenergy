/** "0850 000 00 00" → "tel:+908500000000"; a local 0-prefix becomes +90. */
const digits = (phone: string) => phone.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');

export const telHref = (phone: string) => `tel:+90${digits(phone)}`;

/** WhatsApp click-to-chat, optionally with a prefilled message. */
export const waHref = (phone: string, text?: string) =>
  `https://wa.me/90${digits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/** The quote form, with the product's code filled in. */
export const quoteHref = (sku?: string) =>
  sku ? `/iletisim?konu=teklif&urun=${encodeURIComponent(sku)}` : '/iletisim?konu=teklif';
