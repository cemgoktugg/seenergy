'use client';

/**
 * Footer link columns.
 *
 * Measured mobile behaviour (reference-analysis/mobile-390/Z-footer.png): at 390
 * the reference collapses "Kurumsal", "Müşteri İlişkileri" and "Sipariş
 * İşlemleri" into chevron accordions and shows only their headings. Rendering
 * all 19 links expanded made the local mobile footer 492px taller than the
 * reference — the single largest mobile geometry error.
 *
 * At `lg` and above the panels are always visible and the toggle is hidden, so
 * the desktop three-column block is unchanged. The list is never duplicated in
 * the markup: one <ul> whose visibility is `hidden`/`block` on mobile and
 * unconditionally `block` from `lg` up.
 */

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

export function FooterColumns({ columns }: { columns: readonly FooterColumn[] }) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      {columns.map((column) => {
        const isOpen = open === column.title;
        const panelId = `footer-panel-${column.title}`;
        return (
          <nav
            key={column.title}
            aria-labelledby={`footer-${column.title}`}
            className="col-span-2 border-b border-line last:border-b-0 lg:col-span-1 lg:border-b-0"
          >
            {/* Mobile: a real toggle. Desktop: a plain heading. */}
            <button
              type="button"
              id={`footer-${column.title}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpen(isOpen ? null : column.title)}
              className="flex w-full items-center justify-between py-3.5 text-left text-[14px] font-bold text-text-primary lg:pointer-events-none lg:py-0"
            >
              {column.title}
              <ChevronDown
                size={18}
                aria-hidden
                className={`shrink-0 text-text-secondary transition-transform duration-(--duration-base) lg:hidden ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            <ul
              id={panelId}
              className={`space-y-2.5 pb-4 lg:mt-4 lg:block lg:pb-0 ${isOpen ? 'block' : 'hidden'}`}
            >
              {column.links.map((link) => (
                <li key={`${column.title}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="text-[12px] text-text-secondary transition-colors hover:text-brand-dark lg:text-[13px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        );
      })}
    </>
  );
}
