import type { Metadata } from 'next';
import { Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react';

import { InfoPage } from '@/components/info-page';
import { InquiryForm } from '@/components/inquiry-form';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { telHref, waHref } from '@/lib/contact';
import { loadVitrin } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'İletişim',
  description: 'Telefon, WhatsApp, e-posta ve iletişim formu. Fiyat teklifi ve teknik destek talepleriniz için bize yazın.',
};

/** ?konu= values the site links with, and the subject each one picks. */
const TOPICS: Record<string, string> = {
  teklif: 'Fiyat teklifi',
  teknik: 'Teknik destek',
  siparis: 'Siparişim hakkında',
  iade: 'İade ve cayma',
  garanti: 'Garanti ve arıza',
  genel: 'Genel bilgi',
};

/**
 * /iletisim — contact cards from admin → Vitrin → Şirket bilgileri, and the
 * contact form (→ admin → Talepler). The product pages' "Fiyat Teklifi Al"
 * and "Teklif İste" link here with ?konu=teklif&urun=<SKU>, which turns the
 * request into a quote ("teklif") with the product code filled in.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ konu?: string; urun?: string }>;
}) {
  const [{ konu, urun }, { company }] = await Promise.all([searchParams, loadVitrin()]);
  const quote = konu === 'teklif' || Boolean(urun);
  const topic = TOPICS[konu ?? ''] ?? (urun ? TOPICS.teklif : '');

  const cards = [
    company.phone && { icon: Phone, label: 'Telefon', value: company.phone, href: telHref(company.phone) },
    company.whatsapp && {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: company.whatsapp,
      href: waHref(company.whatsapp, urun ? `Merhaba, ${urun} için fiyat teklifi almak istiyorum.` : undefined),
    },
    company.email && { icon: Mail, label: 'E-posta', value: company.email, href: `mailto:${company.email}` },
    company.address && {
      icon: MapPin,
      label: 'Adres',
      value: company.address,
      href: company.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(company.address)}`,
    },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string }[];

  return (
    <InfoPage
      path="/iletisim"
      eyebrow="Kurumsal"
      title={quote ? 'Fiyat Teklifi İsteyin' : 'İletişim'}
      lede={
        quote
          ? 'Ürün kodunu ve ihtiyacınız olan adedi yazın; stok ve fiyat bilgisini en kısa sürede iletelim.'
          : 'Sorularınız, fiyat teklifi ve teknik destek talepleriniz için bize ulaşın.'
      }
      company={company}
    >
      <div className="not-prose grid gap-3 sm:grid-cols-2">
        {cards.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener' : undefined}
            className="group flex items-start gap-3.5 rounded-(--panel-radius) border border-line bg-surface-page p-4 transition-colors hover:border-text-primary"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1">
              <Icon size={18} strokeWidth={2} aria-hidden />
            </span>
            <span className="min-w-0">
              <span className="block text-[11.5px] font-bold uppercase tracking-[0.1em] text-text-secondary">{label}</span>
              <span className="mt-0.5 block whitespace-pre-line text-[14.5px] font-semibold text-text-primary">{value}</span>
            </span>
          </a>
        ))}
      </div>
      {company.hours ? (
        <p className="not-prose flex items-center gap-2 text-[13.5px] text-text-secondary">
          <Clock size={15} strokeWidth={2} aria-hidden />
          {company.hours}
        </p>
      ) : null}

      <h2>{quote ? 'Teklif formu' : 'Bize yazın'}</h2>
      <InquiryForm
        type={quote ? 'teklif' : 'iletisim'}
        initial={{ subject: topic, sku: urun ?? '' }}
        fields={[
          ...CONTACT_FIELDS,
          { name: 'company', label: 'Firma (varsa)', autoComplete: 'organization' },
          ...(quote
            ? [
                { name: 'sku', label: 'Ürün kodu', required: true, placeholder: 'Örn. SE-1080LD' },
                { name: 'quantity', label: 'Adet', type: 'number' as const, placeholder: '1' },
              ]
            : [
                {
                  name: 'subject',
                  label: 'Konu',
                  type: 'select' as const,
                  required: true,
                  options: Object.values(TOPICS),
                },
              ]),
          {
            name: 'message',
            label: quote ? 'Notunuz' : 'Mesajınız',
            type: 'textarea',
            required: !quote,
            placeholder: quote ? 'Kurulum yeri, teslim tarihi gibi eklemek istedikleriniz' : '',
          },
        ]}
        submitLabel={quote ? 'Teklif iste' : 'Mesajı gönder'}
        successTitle={quote ? 'Teklif talebiniz alındı' : 'Mesajınız alındı'}
        successText="Mesai saatlerinde aynı gün, en geç bir iş günü içinde dönüş yapıyoruz."
      />
    </InfoPage>
  );
}
