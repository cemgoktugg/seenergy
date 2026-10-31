'use client';

/**
 * Hero slider — the width of the content container, on its own since
 * 2026-10-22 (the two campaign tiles beside it were removed at the client's
 * request; an edge-to-edge version was tried and taken back the same day).
 *
 * THE REFERENCE'S SLIDER (2026-10-31, the client: "burda olduğu gibi")
 *
 * Measured on merterelektronik.com: one flat 3:1 picture across the content
 * track (1320 x 439), the whole slide a link, no arrows, no shadow, and the
 * dots on a white pill centred near the bottom edge; the stage moves on an
 * 800ms `ease` translate every 5s.
 *
 * Its pictures are all drawn at 3:1; what the shop uploads are not. Finished
 * posters arrive at ~1:1 and ~2.75:1 with logo, headline and phone row drawn
 * in (the lesson of 2026-10-30, when four designs that treated them as photos
 * broke them). So the ratio decides, read off the loaded picture:
 *   - near 3:1 fills the panel edge to edge like the reference, losing at most
 *     ~10% off its edges (`fit: cover` forces this for any picture);
 *   - anything else is shown whole, on the same picture enlarged and blurred,
 *     stopping short of the bottom so the pill never sits on its words.
 * The slide's title and description are not drawn — the art has its own — but
 * name the link for screen readers. The panel is 3:2 on a phone, where every
 * picture is shown whole: at the reference's 3:1 (374 x 124) a square poster
 * would be an unreadable stamp.
 *
 * The light design (hero-light.tsx) is still the other choice in admin →
 * Vitrin → Ana slayt → Tasarım.
 *
 * Kept from before, and still load-bearing:
 *   - a pause control (WCAG 2.2.2) and no autoplay under reduced motion;
 *   - active-state animations applied by class, never by `key` — remounting an
 *     <img> re-requests it every dwell and the network never idles;
 *   - no carousel library: a transformed flex track.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Pause, Play } from 'lucide-react';

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

/** Pictures this close to the panel's 3:1 fill it; the crop stays under ~10%. */
const fillsPanel = (ratio: number | undefined) => ratio !== undefined && ratio >= 2.7 && ratio <= 3.3;

export function Hero({ slides }: { slides: HeroSlide[] }) {
  const { index, go, paused, setPaused, reduced, pauseOn } = useCarousel(slides.length);
  const [ratios, setRatios] = useState<Record<number, number>>({});
  const touchX = useRef<number | null>(null);
  const many = slides.length > 1;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) bg-surface-utility"
      {...pauseOn}
    >
      {/* No arrows, as on the reference: a phone swipes, the dots do the rest. */}
      <div
        className="relative aspect-[3/2] touch-pan-y sm:aspect-[3/1]"
        onTouchStart={(event) => {
          touchX.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchX.current === null || !many) return;
          const moved = event.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(moved) > 40) go(index + (moved < 0 ? 1 : -1));
        }}
      >
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-[ease]"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const cover = slide.fit === 'cover' || fillsPanel(ratios[i]);
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
                  {/* The same picture, enlarged and heavily blurred under a veil
                      of white: a soft tint of the poster, light like the page,
                      where the artwork leaves room. A small rendition is enough
                      for a blur. Filling art needs it on a phone only, where
                      the 3:2 panel shows that art whole too. */}
                  <span className={`absolute inset-0 ${cover ? 'sm:hidden' : ''}`}>
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      unoptimized={isVector(slide.image)}
                      sizes="256px"
                      className="scale-150 object-cover blur-3xl"
                    />
                    <span className="absolute inset-0 bg-white/55" />
                  </span>
                  {/* Art shown whole stops short of the bottom: the pill sits in
                      that strip, never on the poster's own words. */}
                  <div
                    className={`absolute inset-x-0 top-0 ${many ? 'bottom-8' : 'bottom-0'} ${cover ? 'sm:bottom-0' : ''}`}
                  >
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      priority={i === 0}
                      unoptimized={isVector(slide.image)}
                      sizes="(min-width: 1400px) 1320px, 100vw"
                      onLoad={(event) => {
                        const { naturalWidth, naturalHeight } = event.currentTarget;
                        if (naturalHeight) setRatios((known) => ({ ...known, [i]: naturalWidth / naturalHeight }));
                      }}
                      className={`object-contain drop-shadow-[0_8px_24px_rgb(0_0_0/0.25)] ${cover ? 'sm:object-cover sm:drop-shadow-none' : ''}`}
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* The reference's white pill: 12px dots (10 on a phone) on a 6px gap, the
          current one dark. The pause control is its last slot, withdrawn under
          reduced motion, where autoplay never starts. */}
      {many ? (
        <div className="absolute bottom-1 left-1/2 shadow-e1 z-10 flex h-6 -translate-x-1/2 items-center rounded-full bg-white px-1.5">
          {slides.map((slide, i) => (
            <button
              key={`${i}-${slide.title}`}
              type="button"
              onClick={() => go(i)}
              aria-label={`${i + 1}. kampanyaya git`}
              aria-current={i === index}
              className="group/dot grid h-6 w-6 place-items-center sm:w-[18px]"
            >
              <span
                aria-hidden
                className={`h-2.5 w-2.5 rounded-full transition-colors duration-(--duration-base) sm:h-3 sm:w-3 ${
                  i === index ? 'bg-ink-fixed' : 'bg-[rgb(187_187_187)] group-hover/dot:bg-[rgb(120_120_120)]'
                }`}
              />
            </button>
          ))}
          {!reduced && (
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
              className="grid h-6 w-6 place-items-center text-[rgb(120_120_120)] hover:text-ink-fixed"
            >
              {paused ? <Play size={12} strokeWidth={2.5} aria-hidden /> : <Pause size={12} strokeWidth={2.5} aria-hidden />}
            </button>
          )}
        </div>
      ) : null}
    </section>
  );
}
