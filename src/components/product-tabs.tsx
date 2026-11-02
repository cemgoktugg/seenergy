'use client';

/**
 * The product page's tabs: a click swaps the panel under the bar and the page
 * stays where it is (2026-11-02, the client). So the bar is not sticky: it can
 * only be clicked where its panel starts right below it.
 *
 * Every panel is in the HTML, the closed ones hidden by class: the `hidden`
 * attribute would be !important in Tailwind's preflight, which the noscript style
 * could not undo. With JavaScript off the bar goes and they all show in a row.
 */

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

export function ProductTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(tabs[0]?.id);
  const bar = useRef<HTMLDivElement>(null);

  /* The ARIA tabs pattern: arrows move between tabs, Tab moves into the panel. */
  const onKeyDown = (event: KeyboardEvent) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = tabs.findIndex((tab) => tab.id === active);
    const next = (index + step + tabs.length) % tabs.length;
    setActive(tabs[next].id);
    bar.current?.querySelectorAll('button')[next]?.focus();
  };

  return (
    <div id="urun-sekmeleri">
      <noscript>
        <style>{`#urun-sekmeleri [role=tablist]{display:none}#urun-sekmeleri [role=tabpanel]{display:block}`}</style>
      </noscript>
      <div className="border-b border-line">
        <div className="container-main">
          <div
            ref={bar}
            role="tablist"
            aria-label="Ürün bilgileri"
            onKeyDown={onKeyDown}
            className="flex overflow-x-auto sm:gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {tabs.map((tab) => {
              const on = tab.id === active;
              return (
                <button
                  key={tab.id}
                  id={`${tab.id}-sekme`}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls={tab.id}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(tab.id)}
                  className={`relative flex h-11 shrink-0 items-center px-1.5 text-[13px] sm:px-3 sm:text-[14px] font-semibold transition-colors duration-(--duration-fast) after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-signal after:transition-opacity after:duration-(--duration-fast) ${
                    on ? 'text-signal after:opacity-100' : 'text-text-secondary after:opacity-0 hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          id={tab.id}
          role="tabpanel"
          aria-labelledby={`${tab.id}-sekme`}
          tabIndex={0}
          className={`container-main py-6 dt:py-8 ${tab.id === active ? '' : 'hidden'}`}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
