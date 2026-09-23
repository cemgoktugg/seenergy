'use client';

/**
 * Reveal bands as they enter the viewport.
 *
 * WHY IT IS BUILT THIS WAY ROUND
 *
 * The obvious implementation hides every band in CSS and lets JavaScript show
 * them. That makes the page depend on a script to have content at all: if the
 * bundle fails, is blocked, or simply has not run yet, the visitor gets a
 * blank column. A homepage must not be one script away from empty.
 *
 * So the hiding rule is scoped to `html.reveal-ready`, and this component adds
 * that class only once the observer is actually constructed and about to watch
 * something. No script, no class, nothing hidden — the page renders complete
 * and the animation is purely additive.
 *
 * It returns null and renders nothing. The bands mark themselves with
 * `data-reveal` (see Section); the first band does not, because animating the
 * hero on load delays the one thing the visitor came to see.
 *
 * Under `prefers-reduced-motion: reduce` it does nothing at all — it does not
 * even arm the class, so there is no transition to collapse.
 */

import { useEffect } from 'react';

export function RevealOnScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof IntersectionObserver === 'undefined') return;

    const nodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
    if (nodes.length === 0) return;

    const root = document.documentElement;
    root.classList.add('reveal-ready');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          // One-way: a band that has arrived stays arrived. Re-hiding on scroll
          // up is the thing that makes this pattern feel gimmicky.
          observer.unobserve(entry.target);
        }
      },
      // A little short of the bottom edge, so a band starts moving as it comes
      // into view rather than after it has already been read.
      { rootMargin: '0px 0px -8% 0px', threshold: 0.02 },
    );

    for (const node of nodes) observer.observe(node);

    return () => {
      observer.disconnect();
      root.classList.remove('reveal-ready');
    };
  }, []);

  return null;
}
