'use client';

/**
 * The product page's section tabs: plain anchors with a hairline under them,
 * so they work with JavaScript off. The script only marks the section being
 * read. Sections side by side (description beside specs) start level, and the
 * first of them stays marked until one further down is reached.
 */

import { useEffect, useRef, useState } from 'react';
import { Download } from 'lucide-react';

/** Where a section counts as reached: under the condensed header and this bar. */
const READ_LINE = 140;

export function ProductSectionNav({
  sections,
  datasheet,
}: {
  sections: { id: string; label: string }[];
  datasheet: string | null;
}) {
  const [active, setActive] = useState(sections[0]?.id);
  /* A click on a tab wins over the scroll position while its smooth scroll runs:
     two level sections scroll to the same place, and the tab clicked stays on. */
  const clickedAt = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (Date.now() - clickedAt.current < 1000) return;
        let current = sections[0]?.id;
        let top = -Infinity;
        for (const { id } of sections) {
          const start = document.getElementById(id)?.getBoundingClientRect().top;
          if (start !== undefined && start <= READ_LINE && start > top + 1) {
            current = id;
            top = start;
          }
        }
        setActive(current);
      });
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <nav aria-label="Ürün bölümleri" className="sticky top-14 z-30 border-b border-line bg-surface-card">
      <div className="container-main">
        <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const on = section.id === active;
            return (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  aria-current={on ? 'true' : undefined}
                  onClick={() => {
                    clickedAt.current = Date.now();
                    setActive(section.id);
                  }}
                  className={`relative flex h-11 items-center px-3 text-[14px] font-semibold transition-colors duration-(--duration-fast) after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-signal after:transition-opacity after:duration-(--duration-fast) ${
                    on ? 'text-signal after:opacity-100' : 'text-text-secondary after:opacity-0 hover:text-text-primary'
                  }`}
                >
                  {section.label}
                </a>
              </li>
            );
          })}
          {datasheet && (
            <li className="ml-auto shrink-0">
              <a
                href={datasheet}
                target="_blank"
                rel="noopener"
                className="flex h-11 items-center gap-1.5 px-3 text-[13px] font-semibold text-text-primary"
              >
                <Download size={15} strokeWidth={1.75} aria-hidden />
                Teknik föy
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
