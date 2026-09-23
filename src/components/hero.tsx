'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * Hero slider.
 *
 * Measured target (docs/MERTER_REFERENCE_BLUEPRINT.md §5.1):
 *   box                1320 × 423 at x=60, y=185   → aspect ratio 3.12 : 1
 *   slides             5   ·   autoplay dwell 5000ms   ·   slide 800ms ease
 *   pagination         5 dots, 12 × 12, inside the slider near the bottom
 *   arrows             0 visible (two exist in the DOM but are hidden)
 *
 * The box, the dwell and the sliding track are kept. Four things are
 * deliberately NOT the reference any more, at the client's request for a more
 * modern hero — and two of them are accessibility fixes rather than taste:
 *
 *   1. A pause control. An autoplaying carousel that cannot be stopped fails
 *      WCAG 2.2.2, and the reference's version cannot be stopped.
 *   2. Autoplay never starts under `prefers-reduced-motion: reduce`, and the
 *      pause control is withdrawn with it because there is nothing to pause.
 *   3. The dots become a progress bar: the active segment fills across the
 *      dwell, so the slider shows how long is left rather than only which
 *      slide is up. Under reduced motion the fill collapses and the segment
 *      simply reads as "current".
 *   4. Arrows exist, appear on hover, and are always reachable by keyboard —
 *      hidden-but-present arrows, as the reference has them, are worse than
 *      none.
 *
 * Still no carousel library: a transformed flex track, per the dependency
 * budget.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { HERO_SLIDES } from '@/data/site';

const AUTOPLAY_MS = 5000;

/**
 * Entrance curve for the copy. var(--ease-out) is a decelerating
 * ease — fast out of the gate, settling at the end — which is what arriving
 * content should do. Applied only to the ACTIVE slide: animating four off-screen
 * slides costs work nobody sees.
 */
const RISE = 'animate-[hero-rise_600ms_var(--ease-out)_both]';

export function Hero() {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  /**
   * The motion preference is external state, so it is read as external state
   * rather than copied into a state variable from an effect: subscribing keeps
   * it live if someone flips the OS setting with the page open, the server
   * snapshot of `false` keeps hydration consistent, and nothing calls setState
   * synchronously during an effect.
   */
  const reduced = useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', onStoreChange);
      return () => query.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );

  const go = useCallback((next: number) => {
    setIndex(((next % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const running = !paused && !hovered && !reduced;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [running, index, go]);

  /* 44px at every viewport, not 36: the arrows measured 36×36 at 390, under
     the touch minimum. They are round, so the visual grows with the target. */
  const arrow =
    'absolute top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-chrome/40 text-white opacity-0 backdrop-blur transition-[opacity,background-color] duration-(--duration-base) hover:bg-chrome/75 focus-visible:opacity-100 group-hover:opacity-100';

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      /* `dt:h-full`: from `dt` the hero is one cell of a two-column band and
         the row sets the height, so the slide fills its column instead of
         dictating the band. Below `dt` it is still the aspect box below. */
      className="group relative overflow-hidden rounded-(--panel-radius) dt:h-full"
      // Pause on pointer and focus so autoplay cannot pull a slide out from
      // under someone reading or tabbing through it.
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* Measured 1320 × 423 → 3.12:1. Mobile runs slightly taller than the
          measured 374 × 128 because the eyebrow and the chips need the room. */}
      <div className="relative aspect-[374/150] dt:aspect-auto dt:h-full">
        {/* 800ms is the measured reference dwell-to-slide timing and stays a
            deliberate one-off above --duration-slow; a carousel advance is
            page-level motion, not a UI transition, and so is the 600ms scroll
            reveal. The EASING is on-system now: `ease-[ease]` was the browser
            keyword, the last curve on this page picked by default rather than
            chosen. A slide should accelerate away and decelerate in, which is
            ease-in-out — not the decelerate-only curve the rest of the site
            uses for things that arrive. */}
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <div
              key={slide.title}
              role="group"
              aria-roledescription="slayt"
              aria-label={`${i + 1} / ${HERO_SLIDES.length}`}
              aria-hidden={i !== index}
              className="relative h-full w-full shrink-0"
            >
              {/* Deliberately NOT keyed. Keying on the active index restarts
                  the push-in by remounting, but a remounted <img> re-enters the
                  DOM and re-requests its source — every 5 seconds, for as long
                  as autoplay runs. The network never went idle and the smoke
                  suite went from ~87s to 310s.
                  Toggling the class is enough: when the slide becomes active the
                  animation-name goes from `none` to `hero-zoom`, and that starts
                  the animation on its own. */}
              <img
                src={slide.image}
                alt=""
                className={`h-full w-full object-cover ${
                  i === index ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''
                }`}
                loading={i === 0 ? 'eager' : 'lazy'}
              />

              {/* Two scrims, not one.

                  The first is the legibility layer: weighted to the left where
                  the copy sits, so the artwork stays visible on the right
                  instead of being flattened under a full-width overlay.

                  The second is a brand wash — the logo's teal→indigo→purple
                  running diagonally at low opacity. It is what stops the hero
                  reading as "dark photo with white text on it" and ties it to
                  the same gradient the nav underline, the panel caps and the
                  technical band all use. Low enough (22%) that it tints rather
                  than tales over the artwork, and it sits BELOW the copy so it
                  never touches text contrast. */}
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-r from-chrome/92 via-chrome/55 to-transparent"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-linear-to-br from-grad-1/22 via-grad-3/12 to-grad-4/22 mix-blend-screen"
              />

              <div className="absolute inset-0 flex items-center">
                {/* Same reasoning as the artwork: no `key`. The stagger restarts
                    because RISE is added when the slide becomes active, not
                    because the subtree is thrown away and rebuilt. */}
                <div className="w-full px-4 sm:px-8 dt:px-14">
                  <p
                    className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/75 dt:text-[11px] ${
                      i === index ? RISE : ''
                    }`}
                    style={{ animationDelay: '40ms' }}
                  >
                    <span
                      aria-hidden
                      className="h-[3px] w-5 rounded-full bg-linear-to-r from-grad-1 to-grad-4 dt:w-7"
                    />
                    {slide.eyebrow}
                  </p>

                  {/* 58px at `dt`, up from 54: the hero is the one place on the
                      page that should speak loudest, and the type scale had no
                      tier above the 40px technical band. */}
                  <h2
                    className={`mt-1.5 max-w-[64%] text-[20px] font-extrabold uppercase leading-[1.02] tracking-[-0.02em] text-white sm:text-[38px] dt:mt-3 dt:max-w-[58%] dt:text-[58px] ${
                      i === index ? RISE : ''
                    }`}
                    style={{ animationDelay: '120ms' }}
                  >
                    {slide.title}
                  </h2>

                  <p
                    className={`mt-1.5 hidden max-w-[46%] text-[16px] leading-snug text-white/80 dt:block ${
                      i === index ? RISE : ''
                    }`}
                    style={{ animationDelay: '190ms' }}
                  >
                    {slide.description}
                  </p>

                  <ul
                    className={`mt-3 hidden flex-wrap gap-1.5 sm:flex dt:mt-4 ${
                      i === index ? RISE : ''
                    }`}
                    style={{ animationDelay: '250ms' }}
                  >
                    {slide.chips.map((chip) => (
                      <li
                        key={chip}
                        className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-sm dt:text-[12px]"
                      >
                        {chip}
                      </li>
                    ))}
                  </ul>

                  {/* The arrow travels on hover rather than the button changing
                      colour alone — motion that says "this goes somewhere". */}
                  <Link
                    href={slide.href}
                    tabIndex={i === index ? 0 : -1}
                    className={`group/cta mt-2.5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] font-bold text-ink-fixed shadow-lg shadow-black/25 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand hover:text-white sm:px-5 sm:py-2.5 sm:text-[14px] dt:mt-5 dt:px-6 dt:py-3 ${
                      i === index ? RISE : ''
                    }`}
                    style={{ animationDelay: '310ms' }}
                  >
                    {slide.cta}
                    <ArrowRight
                      size={15}
                      strokeWidth={2.25}
                      aria-hidden
                      className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Önceki kampanya"
        className={`${arrow} left-2 dt:left-4`}
      >
        <ChevronLeft size={18} strokeWidth={2.25} aria-hidden />
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Sonraki kampanya"
        className={`${arrow} right-2 dt:right-4`}
      >
        <ChevronRight size={18} strokeWidth={2.25} aria-hidden />
      </button>

      {/* --- control bar: progress segments + pause -------------------- */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-3 p-2.5 dt:p-4">
        {/* 8px between targets below `dt` — the minimum separation adjacent
            touch targets need; tighter again from `dt` up. */}
        <ul className="flex items-center gap-2 dt:gap-1.5">
          {HERO_SLIDES.map((slide, i) => (
            <li key={slide.title}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}. kampanyaya git`}
                aria-current={i === index}
                /* Touch targets here went wrong twice, so the reasoning is
                   recorded. Measured 10×6 originally — unusable. Extending the
                   hit area vertically AND horizontally then produced 44px-wide
                   areas over 10px dots separated by 6px, so neighbouring
                   targets overlapped by ~28px and tapping between two dots was
                   ambiguous — a worse failure than being small, and a breach of
                   the 8px minimum gap between targets.
                   Below `dt` the visual therefore carries the target: equal
                   44px segments with an 8px gap, the ordinary segmented-progress
                   pattern. From `dt` up a pointer is driving, so the asymmetric
                   4px/48px look returns and only the height is extended. */
                /* NO `overflow-hidden` here, deliberately: it clips the
                   element's own `::before`, so the vertical hit-area extension
                   silently did nothing (hit-tested at 44×6 against a 44px
                   floor). The clip the progress fill needs now lives on the
                   inner wrapper below. */
                className={`relative block h-1.5 rounded-full transition-all duration-(--duration-base) ease-out before:absolute before:inset-x-0 before:-inset-y-5 before:content-[''] ${
                  i === index
                    ? 'w-11 bg-white/30 dt:w-12'
                    : 'w-11 bg-white/40 hover:bg-white/75 dt:w-2.5'
                }`}
              >
                {i === index && (
                  // The clip lives here rather than on the button so the
                  // button's `::before` hit area is not clipped away with it.
                  <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                    {/* Keyed on the slide AND the run state so the fill
                        restarts from zero on every advance and on resume. */}
                    <span
                      key={`${index}-${running ? 'run' : 'hold'}`}
                      className={`absolute inset-y-0 left-0 w-full origin-left rounded-full bg-white ${
                        running ? 'animate-[hero-progress_5000ms_linear_forwards]' : ''
                      }`}
                    />
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>

        {/* Withdrawn under reduced motion: autoplay never starts there, so a
            pause button would be a control over nothing. */}
        {!reduced && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
            /* 28×28 measured — the smallest control on the page. The disc stays
               small so it does not compete with the progress bar beside it, so
               the hit area is extended rather than the visual. */
            /* -inset-2.5, not -inset-2: 28 + 2×8 hit-tested at 42×42, just
               under the floor. 28 + 2×10 = 48. */
            className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/25 bg-chrome/40 text-white backdrop-blur transition-colors duration-(--duration-fast) before:absolute before:-inset-2.5 before:content-[''] hover:bg-chrome/75"
          >
            {paused ? (
              <Play size={12} strokeWidth={2.5} aria-hidden />
            ) : (
              <Pause size={12} strokeWidth={2.5} aria-hidden />
            )}
          </button>
        )}
      </div>
    </section>
  );
}
