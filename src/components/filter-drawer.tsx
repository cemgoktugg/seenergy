'use client';

/**
 * Mobile filter drawer.
 *
 * The only client component in the listing: the filter panel itself is server
 * rendered and passed in as children, so the filters keep working exactly the
 * same whether they are read from the sidebar or from inside this sheet.
 */

import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

export function FilterDrawer({
  count,
  children,
}: {
  count: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // A sheet that covers the page must not leave the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-line-strong px-4 text-[13px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white dt:hidden"
      >
        <SlidersHorizontal size={16} strokeWidth={2} aria-hidden />
        Filtrele
        {count > 0 && (
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] dt:hidden" role="dialog" aria-modal="true" aria-label="Filtreler">
          <button
            type="button"
            aria-label="Filtreleri kapat"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-surface-card">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-[16px] font-extrabold tracking-tight text-text-primary">
                Filtreler
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Filtreleri kapat"
                className="grid h-9 w-9 place-items-center rounded-full text-text-secondary hover:bg-surface-page"
              >
                <X size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>

            <div className="border-t border-line p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-12 w-full items-center justify-center rounded-full bg-brand text-[16px] font-bold text-white transition-colors hover:bg-brand-dark"
              >
                Sonuçları göster
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
