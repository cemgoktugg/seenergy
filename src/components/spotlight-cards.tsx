'use client';

/**
 * Pointer-following light for a group of cards (the Referanslar ve Projeler
 * panel, 2026-10-27). One listener on the group writes the pointer position
 * into each `[data-spot]` card as --mx / --my (pixels, relative to that
 * card) and a small tilt as --rx / --ry; the CSS in globals.css (`.spot-card`)
 * draws a glowing border and an inner light at that point. Every card in the
 * group reads the same pointer, so the light runs across neighbouring cards
 * as the pointer moves between them.
 *
 * Mouse only: touch has no hover, and the cards stay plain there. Nothing is
 * written under reduced motion except the light itself (no tilt).
 */

import { useRef } from 'react';

export function SpotlightCards({ className = '', children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !ref.current) return;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (const card of ref.current.querySelectorAll<HTMLElement>('[data-spot]')) {
      const box = card.getBoundingClientRect();
      const x = event.clientX - box.left;
      const y = event.clientY - box.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
      const inside = x >= 0 && y >= 0 && x <= box.width && y <= box.height;
      card.style.setProperty('--rx', inside && !still ? `${((y / box.height) - 0.5) * -6}deg` : '0deg');
      card.style.setProperty('--ry', inside && !still ? `${((x / box.width) - 0.5) * 6}deg` : '0deg');
    }
  };

  const leave = () => {
    for (const card of ref.current?.querySelectorAll<HTMLElement>('[data-spot]') ?? []) {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--mx', '-999px');
      card.style.setProperty('--my', '-999px');
    }
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={leave} className={className}>
      {children}
    </div>
  );
}
