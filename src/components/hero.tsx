'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * A split slide: a dark copy panel and a light image stage. From `sm` the
 * stage takes the right ~54% of the panel and fades into the copy; on a
 * phone the stage stacks above the copy.
 *
 * WHY SPLIT
 *
 * The earlier hero laid the copy over a full-bleed image darkened on the left.
 * That assumes moody, wide campaign art with empty space on its left half. What
 * the shop actually uploads is product photography and its logo, on white:
 * under the dark scrim a white photo turned into a muddy grey, and the logo's
 * own lettering sat directly under the headline. A split slide makes that
 * collision impossible — the copy and the picture never share pixels.
 *
 * Each slide picks how its picture sits (admin → Vitrin → Ana slayt →
 * "Görsel yerleşimi"): `contain` shows it whole with room around it (products,
 * logos — the default), `cover` fills the stage (a wide campaign photo).
 *
 * Kept from before, and still load-bearing:
 *   - a pause control (WCAG 2.2.2) and no autoplay under reduced motion;
 *   - the progress segments, 44px wide below `dt` for touch;
 *   - active-state animations applied by class, never by `key` — remounting an
 *     <img> re-requests it every dwell and the network never idles;
 *   - no carousel library: a transformed flex track.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import type { HeroSlide } from '@/lib/medusa/vitrin';

const AUTOPLAY_MS = 5000;

/** Staggered entrance for the active slide's copy. */
const RISE = 'animate-[hero-rise_600ms_var(--ease-out)_both]';

/**
 * next/image resizes uploads (a 3.7 MB, 2000×2000 photo arrived as the second
 * slide) to the stage and serves WebP. SVG artwork needs no resizing and is
 * passed through untouched.
 */
const isVector = (src: string) => /\.svg(\?|$)/i.test(src);

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [paused, setPaused] = useState(false);

  /* The motion preference is external state, read by subscription: live if it
     changes with the page open, `false` on the server so hydration agrees. */
  const reduced = useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia('(prefers-reduced-motion: reduce)');
      query.addEventListener('change', onStoreChange);
      return () => query.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );

  const go = useCallback(
    (next: number) => setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  const running = !paused && !hovered && !reduced && slides.length > 1;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [running, index, go]);

  /* 32px discs in the control row; `before` lifts each target to 44. */
  const control =
    "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors duration-(--duration-fast) before:absolute before:-inset-1.5 before:content-[''] hover:border-white/40 hover:bg-white/15";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) bg-chrome shadow-e1"
      // Pause on pointer and focus so autoplay cannot pull a slide out from
      // under someone reading or tabbing through it.
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      {/* A faint technical grid over the dark panel, so it is not flat black. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_right,black,transparent_70%)]"
      />

      {/* Fixed heights, so every slide in the track is the same size whatever
          its copy: stacked on a phone, split from `sm`. */}
      <div className="h-[380px] sm:h-[320px] md:h-[360px] dt:h-[440px]">
        {/* A carousel advance is page-level motion: 800ms, ease-in-out. */}
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const cover = slide.fit === 'cover';
            return (
              <div
                key={`${i}-${slide.title}`}
                role="group"
                aria-roledescription="slayt"
                aria-label={`${i + 1} / ${slides.length}`}
                aria-hidden={!active}
                className="relative h-full w-full shrink-0"
              >
                {/* --- stage ------------------------------------------------ */}
                {/* Always light, in both themes: it is the plate the product
                    stands on, the same idea as the product card's stage. Out
                    to the viewport's right edge from `sm`. */}
                <div className="absolute inset-x-0 top-0 h-[190px] overflow-hidden bg-[radial-gradient(120%_100%_at_60%_40%,#ffffff_0%,#f3f4f7_55%,#e3e5ea_100%)] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[54%]">
                  {/* multiply on the contained picture: a product shot on white
                      loses its white box and stands on the stage instead of
                      sitting on it as a pasted rectangle. Safe because the
                      stage is light in both themes; dark pixels are unchanged. */}
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    unoptimized={isVector(slide.image)}
                    sizes="(min-width: 640px) 54vw, 100vw"
                    className={
                      cover
                        ? `object-cover ${active ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''}`
                        : `object-contain p-6 mix-blend-multiply sm:p-10 dt:px-16 dt:py-12 ${active ? 'animate-[hero-settle_900ms_var(--ease-out)_both]' : ''}`
                    }
                  />
                  {/* The seam: the dark panel fades into the stage instead of
                      meeting it at a hard vertical edge. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-0 left-0 hidden w-28 bg-linear-to-r from-chrome to-transparent sm:block dt:w-40"
                  />
                </div>

                {/* --- copy ------------------------------------------------- */}
                <div className="relative flex h-full flex-col justify-end px-4 pb-16 pt-[200px] sm:justify-center sm:px-8 sm:pb-16 sm:pt-0 dt:px-12 dt:pb-20">
                  {/* Brand light behind the copy, so the panel is not flat black. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-grad-1/20 blur-3xl"
                  />

                  <div className="relative sm:max-w-[44%]">
                    {slide.eyebrow ? (
                      <p
                        className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 dt:text-[11px] ${active ? RISE : ''}`}
                        style={{ animationDelay: '40ms' }}
                      >
                        <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
                        {slide.eyebrow}
                      </p>
                    ) : null}

                    {/* As authored, not uppercased: a sentence-case headline
                        reads faster, and the shop's own capitalisation stays. */}
                    <h2
                      className={`mt-2 line-clamp-2 text-[22px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:line-clamp-3 sm:text-[28px] md:text-[34px] dt:mt-3 dt:text-[42px] ${active ? RISE : ''}`}
                      style={{ animationDelay: '110ms' }}
                    >
                      {slide.title}
                    </h2>

                    {slide.description ? (
                      <p
                        className={`mt-2 hidden max-w-[46ch] text-[13px] leading-relaxed text-white/70 sm:line-clamp-2 sm:block dt:mt-4 dt:text-[16px] ${active ? RISE : ''}`}
                        style={{ animationDelay: '180ms' }}
                      >
                        {slide.description}
                      </p>
                    ) : null}

                    {slide.chips.length > 0 ? (
                      /* One row only: chips that do not fit are clipped rather
                         than wrapping into a second row of pills. */
                      <ul
                        className={`mt-5 hidden h-[28px] flex-wrap gap-1.5 overflow-hidden dt:flex ${active ? RISE : ''}`}
                        style={{ animationDelay: '240ms' }}
                      >
                        {slide.chips.slice(0, 3).map((chip) => (
                          <li
                            key={chip}
                            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-medium text-white/80"
                          >
                            {chip}
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {/* The arrow travels on hover: motion that says "this goes
                        somewhere". */}
                    <Link
                      href={slide.href}
                      tabIndex={active ? 0 : -1}
                      className={`group/cta mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[12.5px] font-bold text-ink-fixed shadow-lg shadow-black/30 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand hover:text-white sm:mt-5 sm:px-5 sm:py-2.5 sm:text-[13.5px] dt:mt-7 dt:px-7 dt:py-3.5 dt:text-[15px] ${active ? RISE : ''}`}
                      style={{ animationDelay: '300ms' }}
                    >
                      {slide.cta}
                      <ArrowRight
                        size={16}
                        strokeWidth={2.25}
                        aria-hidden
                        className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- control row ------------------------------------------------
          Under the copy, on the dark panel, where white controls read and
          cover no part of the picture. */}
      {slides.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-3.5 z-10 px-4 sm:bottom-5 sm:px-8 dt:bottom-7 dt:px-12">
          <div>
            <div className="pointer-events-auto flex w-fit items-center gap-3">
              <button type="button" onClick={() => go(index - 1)} aria-label="Önceki kampanya" className={`${control} hidden md:grid`}>
                <ChevronLeft size={16} strokeWidth={2.25} aria-hidden />
              </button>

              {/* Below `dt` each segment is its own 44px target with an 8px gap;
                  from `dt` a pointer drives, the idle segments shrink to dots and
                  only the height is extended. */}
              <ul className="flex items-center gap-2 dt:gap-1.5">
                {slides.map((slide, i) => (
                  <li key={`${i}-${slide.title}`}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`${i + 1}. kampanyaya git`}
                      aria-current={i === index}
                      /* No overflow-hidden here: it would clip this button's own
                         ::before hit area. The fill's clip is on the inner span. */
                      className={`relative block h-1.5 rounded-full transition-all duration-(--duration-base) ease-out before:absolute before:inset-x-0 before:-inset-y-5 before:content-[''] ${
                        i === index ? 'w-11 bg-white/25 dt:w-12' : 'w-11 bg-white/35 hover:bg-white/70 dt:w-2.5'
                      }`}
                    >
                      {i === index && (
                        <span aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                          {/* Keyed on slide and run state so the fill restarts from
                              zero on every advance and on resume. */}
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

              <button type="button" onClick={() => go(index + 1)} aria-label="Sonraki kampanya" className={`${control} hidden md:grid`}>
                <ChevronRight size={16} strokeWidth={2.25} aria-hidden />
              </button>

              {/* Withdrawn under reduced motion: autoplay never starts there. */}
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
                  className={control}
                >
                  {paused ? <Play size={12} strokeWidth={2.5} aria-hidden /> : <Pause size={12} strokeWidth={2.5} aria-hidden />}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
