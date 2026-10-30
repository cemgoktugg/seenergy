'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * THE PHOTO DESIGN (2026-10-30)
 *
 * Each slide's picture fills the whole panel — its wide photo, else its
 * product picture — and from the side the copy stands on it blurs, a little
 * at first and more towards the edge (the client: "yazı yazılan kısımdan
 * resim yavaş yavaş bulanıklaşsın"): the left from `sm`, the bottom on a
 * phone. Dark title and text on that frosted side, the red button and round
 * arrows bottom right (the layout of the client's second mock).
 *
 * The same day it went through a dark oval (building photo + frosted rim,
 * git history up to a9f0392) and a grey CSS studio with the product
 * multiplied onto it (up to feb750d). The light design (hero-light.tsx) is
 * still the other choice in admin → Vitrin → Ana slayt → Tasarım.
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

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { index, go, paused, setPaused, reduced, pauseOn } = useCarousel(slides.length);
  const many = slides.length > 1;

  /* Round 36px controls on the scene; `before` lifts each target to 44. */
  const control =
    "relative grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/50 bg-black/35 text-white backdrop-blur transition-colors duration-(--duration-fast) before:absolute before:-inset-1 before:content-[''] hover:bg-black/55";

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) bg-[#e6e8eb] shadow-e1"
      {...pauseOn}
    >
      {/* --- scenes -------------------------------------------------------- */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const picture = slide.wide_image || slide.image;
            return (
              <div key={`${i}-${slide.title}`} className="relative h-full w-full shrink-0 overflow-hidden">
                <Image
                  src={picture}
                  alt=""
                  fill
                  priority={i === 0}
                  unoptimized={isVector(picture)}
                  sizes="(min-width: 1400px) 1320px, 100vw"
                  className={`object-cover object-[70%_40%] sm:object-[65%_50%] ${active ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* --- the blur ------------------------------------------------------ */}
      {/* A progressive blur over the copy's side, fixed while the pictures
          move under it: three backdrop blurs, each stronger and each masked
          to a narrower band from the edge, so the picture goes soft step by
          step instead of at a line. A light frost over the same side keeps
          the dark copy readable on a dark photo. Left from `sm`, the bottom
          on a phone, where the copy sits. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute inset-0 backdrop-blur-[3px] [mask-image:linear-gradient(to_top,#000_42%,transparent_72%)] sm:[mask-image:linear-gradient(to_right,#000_30%,transparent_64%)]" />
        <span className="absolute inset-0 backdrop-blur-[8px] [mask-image:linear-gradient(to_top,#000_34%,transparent_60%)] sm:[mask-image:linear-gradient(to_right,#000_22%,transparent_52%)]" />
        <span className="absolute inset-0 backdrop-blur-[18px] [mask-image:linear-gradient(to_top,#000_26%,transparent_48%)] sm:[mask-image:linear-gradient(to_right,#000_12%,transparent_40%)]" />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(241_243_246/0.72)_0%,rgb(241_243_246/0.5)_38%,transparent_64%)] sm:bg-[linear-gradient(to_right,rgb(241_243_246/0.6)_0%,rgb(241_243_246/0.4)_34%,transparent_62%)]" />
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
                <div className="absolute inset-x-0 bottom-[76px] px-5 sm:inset-y-0 sm:flex sm:flex-col sm:justify-center sm:px-10 md:px-14 dt:px-16">
                  <div className="sm:max-w-[46%] dt:max-w-[40%]">
                    {/* As authored, not uppercased; a light weight, as drawn. */}
                    <h2
                      className={`line-clamp-3 text-[24px] font-medium leading-[1.12] tracking-[-0.025em] text-[#18202e] sm:text-[32px] dt:text-[40px] ${active ? RISE : ''}`}
                      style={{ animationDelay: '60ms' }}
                    >
                      {slide.title}
                      {slide.title_accent ? <span className="block">{slide.title_accent}</span> : null}
                    </h2>
                    {slide.description ? (
                      <p
                        className={`mt-2 line-clamp-2 max-w-[44ch] text-[13px] leading-relaxed text-[#4a5262] sm:mt-3 sm:text-[14px] dt:text-[16px] ${active ? RISE : ''}`}
                        style={{ animationDelay: '140ms' }}
                      >
                        {slide.description}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* The action, bottom right as drawn, left of the arrows; on a
                    phone it leads the bottom row. */}
                <div
                  className={`absolute bottom-4 left-5 sm:bottom-6 sm:left-auto ${many ? 'sm:right-[164px] dt:right-[172px]' : 'sm:right-6 dt:right-8'} dt:bottom-7 ${active ? RISE : ''}`}
                  style={{ animationDelay: '220ms' }}
                >
                  <Link
                    href={slide.href}
                    tabIndex={active ? 0 : -1}
                    className="group/cta inline-flex h-11 items-center gap-2.5 rounded-(--card-radius) bg-hero-accent px-6 text-[14px] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(214_22_32/0.6)] transition-colors duration-(--duration-fast) hover:bg-hero-accent-strong"
                  >
                    {slide.cta}
                    <ArrowRight
                      size={16}
                      strokeWidth={2}
                      aria-hidden
                      className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- controls: bottom right, as drawn ------------------------------ */}
      {many ? (
        <div className="absolute bottom-[18px] right-4 z-10 flex items-center gap-2 sm:bottom-[30px] sm:right-6 dt:bottom-[34px] dt:right-8">
          <button type="button" onClick={() => go(index - 1)} aria-label="Önceki kampanya" className={control}>
            <ChevronLeft size={18} strokeWidth={2} aria-hidden />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Sonraki kampanya" className={control}>
            <ChevronRight size={18} strokeWidth={2} aria-hidden />
          </button>
          {/* Withdrawn under reduced motion: autoplay never starts there. */}
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
              className={control}
            >
              {paused ? <Play size={13} strokeWidth={2.5} aria-hidden /> : <Pause size={13} strokeWidth={2.5} aria-hidden />}
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}
