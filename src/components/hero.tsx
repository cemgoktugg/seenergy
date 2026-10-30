'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * THE STUDIO DESIGN (2026-10-30, the client's mock — "tamamen bunun gibi")
 *
 * One continuous scene instead of two panels: a grey studio, light on the
 * left where the copy stands in dark ink, darker to the right where the
 * products stand on a black plinth with a red light behind them. The action
 * is a red button at the bottom right, beside round arrows. It replaced the
 * dark oval design (building photo + frosted rim), which is in git history
 * before this date; the light design (hero-light.tsx) is still the other
 * choice in admin → Vitrin → Ana slayt → Tasarım.
 *
 * A slide with a wide photo (`wide_image`) shows the photo, washed light on
 * the left under the copy; without one, its product picture is set into the
 * CSS studio — so the product shots the shop uploads (cut-outs on white,
 * multiplied away on the grey) get the mock's look without a photo shoot.
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
            const photo = slide.wide_image;
            return (
              <div key={`${i}-${slide.title}`} className="relative h-full w-full shrink-0 overflow-hidden">
                {photo ? (
                  <>
                    <Image
                      src={photo}
                      alt=""
                      fill
                      priority={i === 0}
                      unoptimized={isVector(photo)}
                      sizes="(min-width: 1400px) 1320px, 100vw"
                      className={`object-cover object-[78%_40%] sm:object-[70%_50%] ${active ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''}`}
                    />
                    {/* Light on the left, where the copy stands; on a phone,
                        light along the bottom. */}
                    <span className="absolute inset-0 bg-[linear-gradient(to_top,#eceef0_0%,#eceef0_45%,rgb(236_238_240/0.7)_58%,transparent_75%)] sm:bg-[linear-gradient(to_right,#eceef0_0%,rgb(236_238_240/0.92)_28%,rgb(236_238_240/0.55)_45%,transparent_62%)]" />
                  </>
                ) : (
                  <Studio slide={slide} active={active} first={i === 0} />
                )}
              </div>
            );
          })}
        </div>
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

/**
 * A slide without a photo: its product picture in a CSS studio — the grey
 * sweep, a darker wall to the right, a red light behind, a soft floor and a
 * contact shadow. No dark plinth: the shop's product shots are cut-outs on
 * white, multiplied onto the grey, and multiply over a dark plinth would
 * sink the product into it (tried 2026-10-30).
 */
function Studio({ slide, active, first }: { slide: HeroSlide; active: boolean; first: boolean }) {
  return (
    <>
      <span className="absolute inset-0 bg-[linear-gradient(100deg,#eef0f2_0%,#e2e5e8_38%,#a7abb2_70%,#5d6168_100%)]" />
      {/* The red light: a soft glow low on the right and two thin streaks. */}
      <span className="absolute inset-0 bg-[radial-gradient(40%_70%_at_96%_88%,rgb(214_22_32/0.55),transparent_70%)]" />
      <span className="absolute -right-[4%] top-[-10%] hidden h-[130%] w-[3px] rotate-[24deg] bg-hero-accent shadow-[0_0_18px_4px_rgb(214_22_32/0.55)] sm:block" />
      <span className="absolute right-[10%] top-[-10%] hidden h-[130%] w-px rotate-[24deg] bg-hero-accent/70 shadow-[0_0_12px_2px_rgb(214_22_32/0.4)] sm:block" />
      {/* Floor, darkening softly towards the front. */}
      <span className="absolute inset-x-0 bottom-0 h-[40%] bg-linear-to-b from-transparent to-black/[0.10]" />

      <div className="absolute inset-x-0 top-0 h-[200px] sm:inset-y-0 sm:left-[42%] sm:right-[4%] sm:h-auto">
        {/* Contact shadow under the product. */}
        <span className="absolute bottom-[4%] left-1/2 h-[10%] w-[60%] -translate-x-1/2 rounded-full bg-black/20 blur-xl sm:bottom-[14%] sm:h-[8%] sm:w-[50%]" />
        <Image
          src={slide.image}
          alt=""
          fill
          priority={first}
          unoptimized={isVector(slide.image)}
          sizes="(min-width: 640px) 54vw, 100vw"
          className={`object-contain object-bottom p-5 mix-blend-multiply sm:px-[8%] sm:pb-[16%] sm:pt-[8%] ${active ? 'animate-[hero-settle_900ms_var(--ease-out)_both]' : ''}`}
        />
      </div>
    </>
  );
}
