/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone, UserRound } from 'lucide-react';

import { BrandLogo } from '@/components/brand-mark';
import { InquiryForm } from '@/components/inquiry-form';
import { SectionHeading } from '@/components/section-heading';
import { CONTACT_FIELDS } from '@/data/inquiry-fields';
import { directionsHref, telHref, waHref } from '@/lib/contact';
import { imageProps } from '@/lib/image';
import { DEPARTMENTS, hoursLines, loadVitrin, type Company, type StaffMember } from '@/lib/medusa/vitrin';

export const metadata: Metadata = {
  title: 'İletişim',
  description:
    'SEENERGY Güvenlik Teknolojileri — İvedik OSB, Yenimahalle / Ankara. Telefon, e-posta, çalışma saatleri, satış, muhasebe ve insan kaynakları ekibimiz ve iletişim formu.',
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
 * /iletisim — laid out from the client's own sketch (2026-10-28):
 *
 *   one wide banner   the company building's photo on the left, the address
 *                     and contact details on the right
 *   then, per department (Satış Departmanı, Muhasebe, İnsan Kaynakları)
 *                     a row of people: photo, name, e-mail, phone
 *
 * and the contact form after them. Everything comes from the admin: the
 * details and the building photo from Vitrin → Şirket bilgileri, the people
 * from Vitrin → Ekibimiz. A department without people is not shown.
 *
 * The product pages' "Fiyat Teklifi Al" / "Teklif İste" link here with
 * ?konu=teklif&urun=<SKU>; then the form moves up under the banner, since
 * that visitor came to fill it in, and the request becomes a quote.
 *
 * The page leaves the InfoPage shell (its side menu would halve the banner
 * the sketch draws full width); the breadcrumb and heading style are the same.
 */
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ konu?: string; urun?: string }>;
}) {
  const [{ konu, urun }, { company, staff }] = await Promise.all([searchParams, loadVitrin()]);
  const quote = konu === 'teklif' || Boolean(urun);
  const topic = TOPICS[konu ?? ''] ?? (urun ? TOPICS.teklif : '');
  const title = quote ? 'Fiyat Teklifi İsteyin' : 'İletişim';

  const form = (
    <section aria-labelledby="contact-form-title" className="mt-(--space-section)">
      <SectionHeading id="contact-form-title" eyebrow={quote ? 'Teklif' : 'Bize yazın'} title={quote ? 'Teklif formu' : 'İletişim formu'} />
      <div className="mt-4 rounded-(--panel-radius) border border-line bg-surface-card px-5 py-6 shadow-e1 dt:px-8 dt:py-8">
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
      </div>
    </section>
  );

  return (
    <div className="container-main pb-14 pt-4 dt:pt-6">
      <nav aria-label="Konum" className="text-[12px] text-text-secondary">
        <Link href="/" className="transition-colors hover:text-text-primary">
          Ana sayfa
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <span className="font-medium text-text-primary">{title}</span>
      </nav>

      <ContactBanner company={company} title={title} quote={quote} whatsappText={urun ? `Merhaba, ${urun} için fiyat teklifi almak istiyorum.` : undefined} />

      {quote ? form : null}

      {DEPARTMENTS.map(({ key, title: department }) => {
        const people = staff.filter((member) => member.department === key);
        if (people.length === 0) return null;
        return (
          <section key={key} aria-labelledby={`ekip-${key}`} className="mt-(--space-section)">
            <SectionHeading id={`ekip-${key}`} eyebrow="Ekibimiz" title={department} />
            <ul className="mt-4 grid grid-cols-2 gap-(--space-grid-gap) md:grid-cols-3 lg:grid-cols-4">
              {people.map((member, index) => (
                <li key={`${member.name}-${index}`}>
                  <StaffCard member={member} fallbackPhone={company.phone} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {quote ? null : form}
    </div>
  );
}

/* ------------------------------------------------------------------ */

/** "Hafta içi 08:00 – 18:00" → ["Hafta içi", "08:00 – 18:00"]. */
const splitHours = (line: string): [string, string] => {
  const match = /^(.*?)\s*:?\s*(\d.*)$/.exec(line);
  return match && match[1] ? [match[1], match[2]] : ['', line];
};

/**
 * The sketch's top box: the building on the left, the details on the right.
 * Until the admin uploads a building photo the left side is the brushed
 * steel panel with the logo — a finished surface, not an empty frame.
 */
function ContactBanner({
  company,
  title,
  quote,
  whatsappText,
}: {
  company: Company;
  title: string;
  quote: boolean;
  whatsappText?: string;
}) {
  const mapHref = directionsHref({
    query: company.mapQuery,
    legalName: company.legalName,
    address: company.address,
  });
  const hours = hoursLines(company.hours);

  return (
    <section
      aria-labelledby="contact-title"
      className="mt-4 grid overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e2 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
    >
      {/* --- the building ------------------------------------------------ */}
      <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-[440px]">
        {company.buildingImage ? (
          <>
            <img
              {...imageProps(company.buildingImage, 840)}
              alt={`${company.legalName} şirket binası`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/70 to-transparent" />
            <p className="absolute bottom-5 left-5 right-5 text-[16px] font-extrabold tracking-tight text-white dt:bottom-7 dt:left-7 dt:text-[20px]">
              {company.legalName}
            </p>
          </>
        ) : (
          <div className="nav-metal absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center text-white">
            <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-25" />
            <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.08] blur-3xl" />
            <BrandLogo tone="light" shine className="relative h-9 w-auto sm:h-11 dt:h-14" />
            <p className="relative text-[13px] font-bold uppercase tracking-[0.2em] text-white/70">Güvenlik Teknolojileri A.Ş.</p>
          </div>
        )}
      </div>

      {/* --- address and contact details -------------------------------- */}
      <div className="relative flex flex-col px-5 py-6 dt:px-8 dt:py-8">
        <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-50" />
        <p className="relative flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-text-secondary">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          {quote ? 'Fiyat teklifi' : 'Bize ulaşın'}
        </p>
        <h1 id="contact-title" className="relative mt-2 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary dt:text-[32px]">
          {title}
        </h1>

        <dl className="relative mt-5 space-y-4">
          {company.address ? (
            <Detail icon={MapPin} label="Adres">
              <span className="whitespace-pre-line">{company.address}</span>
            </Detail>
          ) : null}
          {company.phone ? (
            <Detail icon={Phone} label="Telefon">
              <a href={telHref(company.phone)} className="font-bold hover:underline">
                {company.phone}
              </a>
            </Detail>
          ) : null}
          {company.whatsapp ? (
            <Detail icon={MessageCircle} label="WhatsApp">
              <a href={waHref(company.whatsapp, whatsappText)} target="_blank" rel="noopener" className="font-bold hover:underline">
                {company.whatsapp}
              </a>
            </Detail>
          ) : null}
          {company.email ? (
            <Detail icon={Mail} label="E-posta">
              <a href={`mailto:${company.email}`} className="break-all font-bold hover:underline">
                {company.email}
              </a>
            </Detail>
          ) : null}
          {hours.length > 0 ? (
            <Detail icon={Clock} label="Çalışma saatleri">
              <span className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5">
                {hours.map((line) => {
                  const [day, time] = splitHours(line);
                  return (
                    <span key={line} className="contents">
                      <span className="text-text-secondary">{day}</span>
                      <span className="font-semibold tabular-nums">{time}</span>
                    </span>
                  );
                })}
              </span>
            </Detail>
          ) : null}
        </dl>

        <div className="relative mt-6 flex flex-wrap gap-2.5 lg:mt-auto lg:pt-6">
          {company.phone ? (
            <a
              href={telHref(company.phone)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-[14px] font-bold text-white shadow-e1 transition-colors duration-(--duration-fast) hover:bg-brand-dark"
            >
              <Phone size={16} strokeWidth={2.25} aria-hidden />
              Hemen arayın
            </a>
          ) : null}
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface-card px-5 text-[14px] font-bold text-text-primary transition-colors duration-(--duration-fast) hover:border-text-primary"
            >
              <Navigation size={16} strokeWidth={2.25} aria-hidden />
              Yol tarifi al
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Detail({ icon: Icon, label, children }: { icon: typeof Phone; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3.5">
      <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1">
        <Icon size={18} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <dt className="text-[12px] font-bold uppercase tracking-[0.1em] text-text-secondary">{label}</dt>
        <dd className="mt-0.5 text-[14px] leading-relaxed text-text-primary dt:text-[16px]">{children}</dd>
      </div>
    </div>
  );
}

/**
 * One person: photo, name, e-mail, phone — the sketch's three lines. Without
 * a photo, a person mark on the steel ground; without a phone of their own,
 * the company's line, so every card can be called.
 */
function StaffCard({ member, fallbackPhone }: { member: StaffMember; fallbackPhone: string }) {
  const phone = member.phone || fallbackPhone;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-(--card-radius) border border-line bg-surface-card shadow-e1 transition-[box-shadow,border-color] duration-(--duration-base) hover:border-line-strong hover:shadow-e2">
      <div className="relative m-2 mb-0 aspect-[4/3] overflow-hidden rounded-(--card-radius) bg-linear-to-br from-wash-fixed to-line">
        {member.photo ? (
          <img
            {...imageProps(member.photo, 320)}
            alt={member.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
          />
        ) : (
          <span aria-hidden className="absolute inset-0 grid place-items-center text-text-secondary/45">
            <UserRound size={64} strokeWidth={1.4} />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3 dt:px-4">
        <h3 className="text-[14px] font-extrabold leading-snug tracking-tight text-text-primary dt:text-[16px]">{member.name}</h3>
        {member.title ? <p className="mt-0.5 text-[13px] text-text-secondary">{member.title}</p> : null}
        <ul className="mt-3 space-y-1.5 text-[13px]">
          {member.email ? (
            <li>
              <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-text-primary transition-colors hover:text-brand-text">
                <Mail size={14} strokeWidth={2} aria-hidden className="shrink-0 text-text-secondary" />
                <span className="truncate">{member.email}</span>
              </a>
            </li>
          ) : null}
          {phone ? (
            <li>
              <a href={telHref(phone)} className="flex items-center gap-2 text-text-primary transition-colors hover:text-brand-text">
                <Phone size={14} strokeWidth={2} aria-hidden className="shrink-0 text-text-secondary" />
                <span className="truncate tabular-nums">{phone}</span>
              </a>
            </li>
          ) : null}
        </ul>
      </div>
    </article>
  );
}
