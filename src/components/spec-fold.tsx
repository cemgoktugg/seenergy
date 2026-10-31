'use client';

/**
 * The spec groups after the first, folded at every width, so the sheet stands
 * level with the description beside it and the page stays compact. The rows are
 * in the HTML either way; one hairline row opens them.
 */

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function SpecFold({ total, children }: { total: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div hidden={!open}>{children}</div>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className="flex h-11 w-full items-center justify-center gap-2 border-t border-line text-[13px] font-semibold text-text-primary transition-colors duration-(--duration-fast) hover:bg-surface-page"
        >
          Tüm özellikleri göster ({total})
          <ChevronDown size={16} strokeWidth={1.75} aria-hidden />
        </button>
      )}
    </>
  );
}
