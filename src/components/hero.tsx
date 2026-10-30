'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * THE POSTER DESIGN (2026-10-30) — show the artwork as it was made
 *
 * What the shop uploads as slide pictures are finished posters: logo,
 * headline, feature icons and phone numbers already drawn in (square
 * Instagram-style posts, ~1:1, and the odd wide banner, ~2.75:1). Every
 * design that treated them as photos broke them: cropped to fill, blurred
 * under copy, or with our own title and button laid over their words. So
 * the picture is shown whole and untouched; the same picture, enlarged and
 * blurred, fills whatever the artwork leaves free (a square poster's sides),
 * and the whole slide is one link. The slide's title and description are
 * not drawn — the poster has its own — but name the link for screen
 * readers. "Görsel yerleşimi: alanı kaplasın" (`fit: cover`) still fills
 * the panel edge to edge, for artwork made at the panel's 3:1.
 *
 * The same day this panel went through a dark oval (to a9f0392), a grey CSS
 * studio (to feb750d) and a full-bleed photo blurred towards the copy (to
 * f4b7dbf) — each looked right with a clean photo and wrong with the posters
 * actually uploaded. The light design (hero-light.tsx) is still the other
 * choice in admin → Vitrin → Ana slayt → Tasarım.
 *
 * Kept from before, and still load-bearing:
 *   - a pause control (WCAG 2.2.2) and no autoplay under reduced motion;
 *   - active-state animations applied by class, never by `key` — remounting an
 *     <img> re-requests it every dwell and the network never idles;
 *   - no carousel library: a transformed flex track.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

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

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { index, go, paused, setPaused, reduced, pauseOn } = useCarousel(slides.length);
  const many = slides.length > 1;

  /* Round 40px controls on the picture's edges; `before` lifts each to 44. */
  const control =
    "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/40 bg-black/40 text-white shadow-e2 backdrop-blur transition-colors duration-(--duration-fast) before:absolute before:-inset-0.5 before:content-[''] hover:bg-black/60";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) bg-chrome shadow-e1"
      {...pauseOn}
    >
      <div className="relative h-[380px] sm:h-[320px] md:h-[360px] dt:h-[440px]">
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const cover = slide.fit === 'cover';
            const label = [slide.title, slide.title_accent, slide.description].filter(Boolean).join(' — ');
            return (
              <div
                key={`${i}-${slide.title}`}
                role="group"
                aria-roledescription="slayt"
                aria-label={`${i + 1} / ${slides.length}`}
                aria-hidden={!active}
                className="relative h-full w-full shrink-0 overflow-hidden"
              >
                {/* The whole slide is the link: the artwork carries its own
                    words, so they are the link's name for a screen reader. */}
                <Link href={slide.href} tabIndex={active ? 0 : -1} aria-label={label} className="absolute inset-0 block">
                  {cover ? null : (
                    /* The same picture, enlarged and blurred, fills what the
                       artwork leaves free — a square poster's sides, a wide
                       banner's thin edges — so the panel is never bare. A
                       small rendition is enough for a blur. */
                    <>
                      <Image
                        src={slide.image}
                        alt=""
                        fill
                        unoptimized={isVector(slide.image)}
                        sizes="256px"
                        className="scale-125 object-cover opacity-90 blur-2xl saturate-150"
                      />
                      <span className="absolute inset-0 bg-black/15" />
                    </>
                  )}
                  {/* On a phone the artwork stops 40px short of the bottom: the
                      dots sit in that strip, never on the poster's own words. */}
                  <div className={cover ? 'absolute inset-0' : `absolute inset-x-0 top-0 ${many ? 'bottom-10' : 'bottom-0'} sm:bottom-0`}>
                  <Image
                    src={slide.image}
                    alt=""
                    fill
                    priority={i === 0}
                    unoptimized={isVector(slide.image)}
                    sizes="(min-width: 1400px) 1320px, 100vw"
                    className={
                      cover
                        ? 'object-cover'
                        : `object-contain drop-shadow-[0_12px_32px_rgb(0_0_0/0.35)] ${active ? 'animate-[hero-settle_900ms_var(--ease-out)_both]' : ''}`
                    }
                  />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- controls: on the edges, where a poster leaves room ----------- */}
      {many ? (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Önceki kampanya"
            className={`${control} absolute left-2.5 top-1/2 z-10 hidden -translate-y-1/2 sm:grid`}
          >
            <ChevronLeft size={20} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Sonraki kampanya"
            className={`${control} absolute right-2.5 top-1/2 z-10 hidden -translate-y-1/2 sm:grid`}
          >
            <ChevronRight size={20} strokeWidth={2} aria-hidden />
          </button>

          {/* Position dots and the pause control on a small dark pill: in the
              strip under the artwork on a phone; from `sm` standing upright
              in the right margin under the arrow, where a poster leaves room.
              The pause control is withdrawn under reduced motion, where
              autoplay never starts. */}
          <div className="absolute bottom-1.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-1.5 py-0.5 backdrop-blur sm:bottom-4 sm:left-auto sm:right-[18px] sm:translate-x-0 sm:flex-col sm:px-0.5 sm:py-1.5">
            {slides.map((slide, i) => (
              <button
                key={`${i}-${slide.title}`}
                type="button"
                onClick={() => go(i)}
                aria-label={`${i + 1}. kampanyaya git`}
                aria-current={i === index}
                className="group/dot grid h-7 w-6 place-items-center sm:h-6 sm:w-7"
              >
                <span
                  aria-hidden
                  className={`h-2 rounded-full transition-all duration-(--duration-base) ${
                    i === index ? 'w-5 bg-white sm:h-5 sm:w-2' : 'w-2 bg-white/50 group-hover/dot:bg-white/80'
                  }`}
                />
              </button>
            ))}
            {!reduced && (
              <button
                type="button"
                onClick={() => setPaused((value) => !value)}
                aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
                className="grid h-7 w-7 place-items-center text-white/80 hover:text-white"
              >
                {paused ? <Play size={12} strokeWidth={2.5} aria-hidden /> : <Pause size={12} strokeWidth={2.5} aria-hidden />}
              </button>
            )}
          </div>
        </>
      ) : null}
    </section>
  );
}
