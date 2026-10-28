/** "0850 000 00 00" → "tel:+908500000000"; a local 0-prefix becomes +90. */
const digits = (phone: string) => phone.replace(/\D/g, '').replace(/^90/, '').replace(/^0/, '');

export const telHref = (phone: string) => `tel:+90${digits(phone)}`;

/** WhatsApp click-to-chat, optionally with a prefilled message. */
export const waHref = (phone: string, text?: string) =>
  `https://wa.me/90${digits(phone)}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/**
 * "Yol tarifi al": Google Maps' directions URL, which opens route planning
 * from the visitor's own position (on a phone, the Maps app with the route
 * ready to start). A maps *search* for the address — what this used to be —
 * lists several candidate places instead of going to ours.
 *
 * The destination is the company's NAME, which Google resolves to its
 * business listing — checked in a browser on 2026-10-28: "SEENERGY Güvenlik
 * Teknolojileri A.Ş., Yenimahalle, Ankara" lands on the listing (Melih Gökçek
 * Blv. Köşe İvedik İş Merkezi D:4BJ No:85) and the box shows the company's
 * name. Coordinates were tried first and Google snapped them to a neighbour
 * ("NORA SİGORTA"); the street address as text is only the last resort.
 *
 * `query` is the admin's override (Şirket bilgileri → Haritadaki işletme
 * adı); empty = legal name + the address's last line ("Yenimahalle / Ankara").
 */
export function directionsHref({
  query,
  legalName,
  address,
}: {
  query: string;
  legalName: string;
  address: string;
}): string {
  const lines = address.split('\n').map((line) => line.trim()).filter(Boolean);
  const city = lines.at(-1)?.replace(/\s*\/\s*/g, ', ') ?? '';
  const target =
    query.trim() || (legalName ? [legalName, city].filter(Boolean).join(', ') : lines.join(', '));
  if (!target) return '';
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(target)}&travelmode=driving`;
}

/** The quote form, with the product's code filled in. */
export const quoteHref = (sku?: string) =>
  sku ? `/iletisim?konu=teklif&urun=${encodeURIComponent(sku)}` : '/iletisim?konu=teklif';
