import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Heart, LogOut, MapPin, Package, Scale, UserRound } from 'lucide-react';

import { signOut } from '@/lib/medusa/account';
import type { Customer } from '@/lib/medusa/session';

/**
 * The signed-in account area's frame (2026-10-24): a greeting, a side menu —
 * Siparişlerim, Adreslerim, Hesap bilgileri, Favorilerim, Karşılaştırma,
 * Çıkış — and the page's own content beside it. A server component; sign-out
 * is a plain form post.
 */
const NAV = [
  { href: '/hesabim', label: 'Siparişlerim', icon: Package },
  { href: '/hesabim/adresler', label: 'Adreslerim', icon: MapPin },
  { href: '/hesabim/bilgiler', label: 'Hesap bilgileri', icon: UserRound },
  { href: '/favoriler', label: 'Favorilerim', icon: Heart },
  { href: '/karsilastir', label: 'Karşılaştırma', icon: Scale },
];

export function AccountShell({
  customer,
  path,
  title,
  action,
  children,
}: {
  customer: Customer;
  path: string;
  title: string;
  /** Right of the title, e.g. "Yeni adres". */
  action?: ReactNode;
  children: ReactNode;
}) {
  const name = [customer.first_name, customer.last_name].filter(Boolean).join(' ');
  const initials = (customer.first_name?.[0] ?? customer.email[0] ?? '?').toLocaleUpperCase('tr') + (customer.last_name?.[0] ?? '').toLocaleUpperCase('tr');

  return (
    <div className="container-main pb-12 pt-4 dt:pt-6">
      <div className="grid items-start gap-(--space-grid-gap) lg:grid-cols-[270px_minmax(0,1fr)] dt:gap-7">
        <aside className="flex flex-col gap-(--space-grid-gap) lg:sticky lg:top-(--sticky-offset)">
          <div className="nav-metal relative overflow-hidden rounded-(--panel-radius) p-5 text-white shadow-e2">
            <div className="relative flex items-center gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-[16px] font-extrabold text-ink-fixed">
                {initials}
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-bold uppercase tracking-[0.14em] text-white/55">Hesabım</span>
                <span className="block truncate text-[16px] font-extrabold">{name || 'Hoş geldiniz'}</span>
                <span className="block truncate text-[12px] text-white/65">{customer.email}</span>
              </span>
            </div>
          </div>
          <nav aria-label="Hesap menüsü" className="rounded-(--panel-radius) border border-line bg-surface-card p-2 shadow-e1">
            <ul className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = href === path;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      aria-current={active ? 'page' : undefined}
                      className={`flex items-center gap-2.5 rounded-(--card-radius) px-3 py-2.5 text-[14px] font-semibold transition-colors ${
                        active ? 'bg-brand text-white' : 'text-text-primary hover:bg-surface-page'
                      }`}
                    >
                      <Icon size={16} strokeWidth={2} aria-hidden className="shrink-0" />
                      <span className="truncate">{label}</span>
                      <ChevronRight size={14} strokeWidth={2.25} aria-hidden className="ml-auto hidden shrink-0 opacity-40 lg:block" />
                    </Link>
                  </li>
                );
              })}
              <li>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2.5 rounded-(--card-radius) px-3 py-2.5 text-left text-[14px] font-semibold text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger-ink"
                  >
                    <LogOut size={16} strokeWidth={2} aria-hidden className="shrink-0" />
                    Çıkış yap
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em] text-text-secondary">
                <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
                Hesabım
              </p>
              <h1 className="mt-1.5 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">{title}</h1>
            </div>
            {action}
          </div>
          <div className="mt-4 dt:mt-5">{children}</div>
        </div>
      </div>
    </div>
  );
}
