'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * A split slide: a dark copy panel and a light image stage. Since 2026-10-30
 * they are divided by an oval with a frosted rim, as on the /iletisim banner
 * (it replaced a diagonal cut): from `sm` the dark oval bulges from the left
 * into the picture; on a phone it rises under the picture as an arc.
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

export const AUTOPLAY_MS = 5000;

/** Staggered entrance for the active slide's copy. */
export const RISE = 'animate-[hero-rise_600ms_var(--ease-out)_both]';

/**
 * next/image resizes uploads (a 3.7 MB, 2000×2000 photo arrived as the second
 * slide) to the stage and serves WebP. SVG artwork needs no resizing and is
 * passed through untouched.
 */
export const isVector = (src: string) => /\.svg(\?|$)/i.test(src);

/**
 * The slider's state, shared by both designs (admin → Vitrin → Ana slayt →
 * "Tasarım"): the current slide, autoplay, the pause control and the motion
 * preference. `pauseOn` goes on the carousel's root — pointer and focus pause
 * it, so autoplay cannot pull a slide out from under someone reading or
 * tabbing through it.
 */
export function useCarousel(count: number) {
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

  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  const running = !paused && !hovered && !reduced && count > 1;

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => go(index + 1), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [running, index, go]);

  const pauseOn = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocusCapture: () => setHovered(true),
    onBlurCapture: () => setHovered(false),
  };

  return { index, go, paused, setPaused, reduced, running, pauseOn };
}

export function Hero({ slides, background = '' }: { slides: HeroSlide[]; background?: string }) {
  const { index, go, paused, setPaused, reduced, running, pauseOn } = useCarousel(slides.length);

  /* 32px discs in the control row; `before` lifts each target to 44. */
  const control =
    "relative grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/20 bg-white/5 text-white transition-colors duration-(--duration-fast) before:absolute before:-inset-1.5 before:content-[''] hover:border-white/40 hover:bg-white/15";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) bg-chrome shadow-e1"
      {...pauseOn}
    >
      {/* Three layers, so the oval can stand still while the slides move:
          the pictures' track, the oval (the dark panel and its frosted rim)
          above it, and the copy's track on top. Both tracks move together. */}

      {/* --- pictures ------------------------------------------------------ */}
      {/* Fixed heights, so every slide is the same size whatever its copy:
          stacked on a phone, split from `sm`. A carousel advance is
          page-level motion: 800ms, ease-in-out. */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const cover = slide.fit === 'cover';
            return (
              /* Always light, in both themes: it is the plate the product
                 stands on, the same idea as the product card's stage. */
              <div
                key={`${i}-${slide.title}`}
                className="relative h-full w-full shrink-0 bg-[radial-gradient(90%_120%_at_75%_40%,#ffffff_0%,#f3f4f7_55%,#e3e5ea_100%)]"
              >
                {/* The picture's box starts under the oval, so a `cover`
                    picture runs into the curve; a contained one keeps clear
                    of it with its left padding. multiply: a product shot on
                    white loses its white box and stands on the plate. */}
                <div className="absolute inset-x-0 top-0 h-[168px] sm:inset-y-0 sm:left-[40%] sm:h-auto">
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    unoptimized={isVector(slide.image)}
                    sizes="(min-width: 640px) 60vw, 100vw"
                    className={
                      cover
                        ? `object-cover ${active ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''}`
                        : `object-contain p-5 mix-blend-multiply sm:py-8 sm:pl-[21%] sm:pr-[4%] dt:py-10 ${active ? 'animate-[hero-settle_900ms_var(--ease-out)_both]' : ''}`
                    }
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- the oval (2026-10-30, after the /iletisim banner) ------------- */}
      {/* The dark panel is a large ellipse whose right side bulges into the
          picture, ringed by a band of frosted glass — the curve the contact
          banner's artwork draws between its two pictures. Its centre sits
          below the middle, so the curve is steeper at the bottom, as there.
          On a phone the same oval rises from below as an arc under the
          picture. The rim is the same ellipse, 14px larger, blurring the
          picture under it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-white/45 backdrop-blur-md [clip-path:ellipse(calc(130%_+_14px)_calc(100%_+_14px)_at_50%_144%)] sm:[clip-path:ellipse(calc(52%_+_14px)_calc(135%_+_14px)_at_-2%_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-chrome [clip-path:ellipse(130%_100%_at_50%_144%)] sm:[clip-path:ellipse(52%_135%_at_-2%_65%)]"
      >
        {/* The client's artwork (2026-10-28): the SEENERGY building, set to
            its right side, where the facade and its lettering are. A chrome
            gradient, heaviest under the copy, keeps the text legible. Set in
            admin → Vitrin → Ana slayt; empty = plain chrome. */}
        {background ? (
          <div className="absolute inset-0 sm:right-[46%]">
            <Image
              src={background}
              alt=""
              fill
              priority
              sizes="(min-width: 640px) 55vw, 100vw"
              className="object-cover object-[85%_45%]"
            />
            <span className="absolute inset-0 bg-linear-to-r from-chrome/90 via-chrome/70 to-chrome/35" />
            <span className="absolute inset-0 bg-linear-to-t from-chrome/60 to-transparent to-50%" />
          </div>
        ) : null}

        {/* A faint technical grid, so the panel is not flat black. */}
        <span className="absolute inset-0 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:linear-gradient(to_right,black,transparent_70%)]" />
      </div>

      {/* --- copy ---------------------------------------------------------- */}
      <div className="relative h-[380px] sm:h-[320px] md:h-[360px] dt:h-[440px]">
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <div
                key={`${i}-${slide.title}`}
                role="group"
                aria-roledescription="slayt"
                aria-label={`${i + 1} / ${slides.length}`}
                aria-hidden={!active}
                className="relative h-full w-full shrink-0"
              >
                <div className="relative flex h-full flex-col justify-end px-4 pb-16 pt-[200px] sm:justify-center sm:px-8 sm:pb-16 sm:pt-0 dt:px-12 dt:pb-20">
                  {/* Brand light behind the copy, so the panel is not flat black. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-grad-1/20 blur-3xl"
                  />

                  <div className="relative sm:max-w-[44%]">
                    {slide.eyebrow ? (
                      <p
                        className={`flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-white/65 ${active ? RISE : ''}`}
                        style={{ animationDelay: '40ms' }}
                      >
                        <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
                        {slide.eyebrow}
                      </p>
                    ) : null}

                    {/* As authored, not uppercased: a sentence-case headline
                        reads faster, and the shop's own capitalisation stays. */}
                    <h2
                      className={`mt-2 line-clamp-2 text-[24px] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:line-clamp-3 sm:text-[32px] md:text-[32px] dt:mt-3 dt:text-[40px] ${active ? RISE : ''}`}
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

                    {/* Two actions: the slide's own, and a quote — most of this
                        range sells by project, so "Teklif Al" is offered on
                        every slide rather than left to the footer. The arrow
                        travels on hover: motion that says "this goes somewhere". */}
                    <div
                      className={`mt-4 flex flex-wrap items-center gap-2.5 sm:mt-5 dt:mt-7 dt:gap-3 ${active ? RISE : ''}`}
                      style={{ animationDelay: '300ms' }}
                    >
                      <Link
                        href={slide.href}
                        tabIndex={active ? 0 : -1}
                        className="group/cta inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-[14px] font-bold text-ink-fixed shadow-lg shadow-black/30 transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand hover:text-white dt:h-[52px] dt:px-7 dt:text-[16px]"
                      >
                        {slide.cta}
                        <ArrowRight
                          size={16}
                          strokeWidth={2.25}
                          aria-hidden
                          className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
                        />
                      </Link>
                      <Link
                        href="/iletisim?konu=teklif"
                        tabIndex={active ? 0 : -1}
                        className="hidden h-11 items-center rounded-full border border-white/30 px-5 text-[14px] font-bold text-white transition-colors duration-(--duration-fast) ease-in-out hover:border-white hover:bg-white/10 sm:inline-flex dt:h-[52px] dt:px-7 dt:text-[16px]"
                      >
                        Teklif Al
                      </Link>
                    </div>
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
