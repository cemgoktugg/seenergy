/**
 * The shell every corporate, legal and help page shares (2026-10-24): a
 * breadcrumb, an eyebrow and title, an optional lede, the page body in the
 * readable `.info-prose` style, and a sticky side menu of the sibling pages
 * with a contact card under it. Contact details come from admin → Vitrin →
 * Şirket bilgileri, so a phone number is changed in one place.
 *
 * A server component.
 */

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react';

import { telHref, waHref } from '@/lib/contact';
import { hoursLines, type Company } from '@/lib/medusa/vitrin';

/** The side menu: every page the shell serves, grouped. */
export const INFO_NAV = [
  {
    title: 'Kurumsal',
    links: [
      { label: 'Hakkımızda', href: '/hakkimizda' },
      { label: 'Referanslarımız', href: '/referanslar' },
      { label: 'Çözüm Ortaklarımız', href: '/cozum-ortaklarimiz' },
      { label: 'Projelerimiz', href: '/projeler' },
      { label: 'İletişim', href: '/iletisim' },
      { label: 'Kurumsal Satış ve Proje', href: '/kurumsal' },
      { label: 'Toptan Satış', href: '/toptan-satis' },
      { label: 'Bayi Başvurusu', href: '/bayi-basvurusu' },
      { label: 'B2B Bayi Girişi', href: '/b2b-giris' },
      { label: 'İş İlanları', href: '/is-ilanlari' },
    ],
  },
  {
    title: 'Yardım',
    links: [
      { label: 'Sıkça Sorulan Sorular', href: '/sss' },
      { label: 'Sipariş Takibi', href: '/siparis-takibi' },
      { label: 'Havale Bildirim Formu', href: '/havale-bildirim' },
      { label: 'Kargo ve Teslimat', href: '/kargo-teslimat' },
      { label: 'İade ve Değişim', href: '/iade-degisim' },
      { label: 'Garanti Koşulları', href: '/garanti' },
    ],
  },
  {
    title: 'Sözleşmeler ve politikalar',
    links: [
      { label: 'Mesafeli Satış Sözleşmesi', href: '/mesafeli-satis-sozlesmesi' },
      { label: 'Ön Bilgilendirme Formu', href: '/on-bilgilendirme-formu' },
      { label: 'Kişisel Verilerin Korunması', href: '/kvkk' },
      { label: 'KVKK Aydınlatma Metni', href: '/kvkk-aydinlatma-metni' },
      { label: 'Gizlilik ve Güvenlik', href: '/gizlilik' },
      { label: 'Çerez Politikası', href: '/cerez-politikasi' },
      { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
    ],
  },
] as const;

export function InfoPage({
  path,
  eyebrow,
  title,
  lede,
  updated,
  company,
  children,
}: {
  /** This page's own href, to mark it in the side menu. */
  path: string;
  eyebrow: string;
  title: string;
  lede?: ReactNode;
  /** "Son güncelleme" line for contracts and policies. */
  updated?: string;
  company: Company;
  children: ReactNode;
}) {
  return (
    <div className="container-main pb-14 pt-4 dt:pt-6">
      <nav aria-label="Konum" className="text-[12px] text-text-secondary">
        <Link href="/" className="transition-colors hover:text-text-primary">
          Ana sayfa
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <span className="font-medium text-text-primary">{title}</span>
      </nav>

      <div className="mt-4 grid items-start gap-(--space-grid-gap) lg:grid-cols-[minmax(0,1fr)_300px] dt:gap-8">
        <article className="min-w-0">
          <header className="relative overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card px-5 py-6 shadow-e1 dt:px-8 dt:py-8">
            <span aria-hidden className="tech-grid pointer-events-none absolute inset-0 opacity-60" />
            <p className="relative flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-text-secondary">
              <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
              {eyebrow}
            </p>
            <h1 className="relative mt-2 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary text-balance dt:text-[32px]">
              {title}
            </h1>
            {lede ? (
              <p className="relative mt-3 max-w-[68ch] text-[14px] leading-relaxed text-text-secondary dt:text-[16px]">{lede}</p>
            ) : null}
            {updated ? <p className="relative mt-3 text-[12px] text-text-secondary">Son güncelleme: {updated}</p> : null}
          </header>

          <div className="info-prose mt-(--space-grid-gap) rounded-(--panel-radius) border border-line bg-surface-card px-5 py-6 shadow-e1 dt:px-8 dt:py-8">
            {children}
          </div>
        </article>

        <aside className="flex flex-col gap-(--space-grid-gap) lg:sticky lg:top-(--sticky-offset)">
          <nav aria-label="Kurumsal ve yardım sayfaları" className="rounded-(--panel-radius) border border-line bg-surface-card p-3 shadow-e1">
            {INFO_NAV.map((group) => (
              <div key={group.title} className="py-1.5 first:pt-0.5">
                <p className="px-2.5 pb-1.5 pt-1 text-[12px] font-bold uppercase tracking-[0.14em] text-text-secondary">{group.title}</p>
                <ul>
                  {group.links.map((link) => {
                    const active = link.href === path;
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center justify-between gap-2 rounded-(--card-radius) px-2.5 py-2 text-[14px] transition-colors duration-(--duration-fast) ${
                            active ? 'bg-brand font-semibold text-white' : 'text-text-primary hover:bg-surface-page'
                          }`}
                        >
                          {link.label}
                          <ChevronRight size={14} strokeWidth={2.25} aria-hidden className={active ? 'opacity-90' : 'opacity-35'} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          <ContactCard company={company} />
        </aside>
      </div>
    </div>
  );
}

/** Phone, WhatsApp and e-mail, as far as the admin has filled them in. */
export function ContactCard({ company }: { company: Company }) {
  return (
    <div className="nav-metal relative overflow-hidden rounded-(--panel-radius) p-5 text-white shadow-e2">
      <p className="relative text-[12px] font-bold uppercase tracking-[0.16em] text-white/60">Yardım mı lazım?</p>
      <p className="relative mt-1.5 text-[16px] font-extrabold tracking-tight">Bize ulaşın</p>
      {hoursLines(company.hours).map((line) => (
        <p key={line} className="relative mt-1 text-[13px] text-white/65">
          {line}
        </p>
      ))}
      <ul className="relative mt-4 space-y-2">
        {company.phone ? (
          <li>
            <a href={telHref(company.phone)} className="flex items-center gap-2.5 rounded-(--card-radius) bg-white/[0.08] px-3 py-2.5 text-[14px] font-semibold transition-colors hover:bg-white/15">
              <Phone size={16} strokeWidth={2} aria-hidden />
              {company.phone}
            </a>
          </li>
        ) : null}
        {company.whatsapp ? (
          <li>
            <a href={waHref(company.whatsapp)} target="_blank" rel="noopener" className="flex items-center gap-2.5 rounded-(--card-radius) bg-white/[0.08] px-3 py-2.5 text-[14px] font-semibold transition-colors hover:bg-white/15">
              <MessageCircle size={16} strokeWidth={2} aria-hidden />
              WhatsApp
            </a>
          </li>
        ) : null}
        {company.email ? (
          <li>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 rounded-(--card-radius) bg-white/[0.08] px-3 py-2.5 text-[14px] font-semibold transition-colors hover:bg-white/15">
              <Mail size={16} strokeWidth={2} aria-hidden />
              <span className="truncate">{company.email}</span>
            </a>
          </li>
        ) : null}
        <li>
          <Link href="/iletisim" className="flex items-center justify-center gap-1.5 rounded-full bg-white px-3 h-11 text-[13px] font-bold text-ink-fixed transition-transform hover:-translate-y-px">
            İletişim formu
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
          </Link>
        </li>
      </ul>
    </div>
  );
}

/** "SEENERGY Güvenlik Teknolojileri A.Ş., Adres…, MERSİS…" for the contracts. */
export function SellerBlock({ company }: { company: Company }) {
  const rows: [string, string][] = [
    ['Unvan', company.legalName],
    ['Adres', company.address.replace(/\n/g, ', ')],
    ['Telefon', company.phone],
    ['E-posta', company.email],
    ['KEP adresi', company.kep],
    ['MERSİS no', company.mersis],
    ['Vergi dairesi / no', [company.taxOffice, company.taxNumber].filter(Boolean).join(' / ')],
  ];
  return (
    <table>
      <tbody>
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <tr key={label}>
              <th scope="row">{label}</th>
              <td>{value}</td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
