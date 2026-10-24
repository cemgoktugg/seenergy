'use client';

/**
 * The spec cards, folded below `dt`.
 *
 * On a phone the groups stack into one column that measured ~2500px — the
 * similar products and the footer sat behind that much scrolling. Below `dt`
 * the cards show their first ~640px and a fade, with one button that opens
 * the rest. From `dt` they sit in two columns and nothing is folded.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function SpecFold({ total, children }: { total: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className={open ? '' : 'max-dt:max-h-[640px] max-dt:overflow-hidden'}>{children}</div>
      {!open && (
        <div className="absolute inset-x-0 bottom-0 flex h-36 items-end justify-center bg-linear-to-t from-(--page-ground) from-35% to-transparent pb-1 dt:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface-card px-5 text-[14px] font-bold text-text-primary shadow-e1"
          >
            Tüm özellikleri göster ({total})
            <ChevronDown size={16} strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
