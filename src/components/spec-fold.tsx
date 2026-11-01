'use client';

/**
 * The spec groups after the first, folded on a phone and a tablet only, where
 * they stack into one long column. From `lg` the groups sit in two columns and
 * nothing is folded: `lg:contents` lets them join those columns directly. The
 * rows are in the HTML either way.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function SpecFold({ total, children }: { total: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={open ? 'lg:contents' : 'max-lg:hidden lg:contents'}>{children}</div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-(--card-radius) border border-line-strong text-[14px] font-semibold text-text-primary transition-colors duration-(--duration-fast) hover:bg-surface-page lg:hidden"
        >
          Tüm özellikleri göster ({total})
          <ChevronDown size={16} strokeWidth={1.5} aria-hidden />
        </button>
      )}
    </>
  );
}
