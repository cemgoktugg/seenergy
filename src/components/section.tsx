/**
 * One section wrapper, one vertical rhythm.
 *
 * WHY THIS EXISTS
 *
 * Spacing used to live at every call site: `pt-2.5`, `pt-3`, `pt-[30px]`,
 * `dt:pt-5`, `dt:pt-6` — nineteen bands, five different values, no system. The
 * `--space-section` token existed but was referenced nowhere, so measured gaps
 * between bands were 0 and the homepage read as a single uncut column.
 *
 * Every band now goes through here and takes its top space from the shared
 * tokens. The compact variant brings the brand banners closer to the hero.
 * Retune the rhythm in globals.css; nothing is spaced by hand at call sites.
 *
 * `track` picks the horizontal rail, because they are genuinely different and
 * measured:
 *   main   the 1320 content container (most bands)
 *   nav    the wider 1400 chrome track — the footer stack uses this
 *   bleed  full width, for bands that paint edge to edge; they bring their own
 *          inner container so the copy still lines up with everything above
 */

import type { ReactNode } from 'react';

export function Section({
  children,
  label,
  track = 'main',
  className = '',
  first = false,
  compact = false,
}: {
  children: ReactNode;
  /** Names the region. Omit for bands whose heading already names them. */
  label?: string;
  track?: 'main' | 'nav' | 'bleed';
  className?: string;
  /**
   * The first band under the header keeps the original tight offset: a 64px
   * gap there would push the hero below the fold for no benefit, since there
   * is no preceding section to separate it from.
   */
  first?: boolean;
  /** A smaller gap for content visually connected to the preceding band. */
  compact?: boolean;
}) {
  const container =
    track === 'nav' ? 'container-nav' : track === 'bleed' ? '' : 'container-main';
  const rhythm = first
    ? 'pt-2.5 dt:pt-5'
    : compact ? 'pt-(--space-section-compact)' : 'pt-(--space-section)';

  return (
    <section
      aria-label={label}
      /* Marks the band for RevealOnScroll. The first band is left unmarked:
         animating the hero on load delays the one thing the visitor came for.
         The attribute is inert on its own — nothing is hidden unless the
         observer arms `html.reveal-ready`. */
      data-reveal={first ? undefined : ''}
      className={`${container} ${rhythm} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
