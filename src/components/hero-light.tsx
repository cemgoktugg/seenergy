'use client';

/**
 * Hero slider, light design (2026-10-30, from the client's mock) — the second
 * look of the same slides, picked in admin → Vitrin → Ana slayt → "Tasarım".
 * The oval design (hero.tsx) stays the default; this one is shown only when
 * the band is switched to "acik".
 *
 * A wide photo fills the slide; its left side is washed to white, and the
 * copy stands on that white in dark ink with one red accent: the line before
 * the eyebrow, the title's second line, the button and the active dot.
 * Arrows sit thin at the panel's edges, the dots centred at the bottom.
 *
 * A slide without its own wide photo shows its product picture on a light
 * plate on the right instead, so switching never leaves a slide blank.
 *
 * Same slider underneath as the oval design (useCarousel): autoplay that
 * pauses on pointer and focus, a pause control (WCAG 2.2.2), no autoplay
 * under reduced motion, a transformed flex track, active-state animations by
 * class, never by `key`.
 */

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

import { isVector, RISE, useCarousel } from '@/components/hero';
import type { HeroSlide } from '@/lib/medusa/vitrin';

/** "SEENERGY • GÜVENLİK TEKNOLOJİLERİ": the bullets as authored, set in red. */
function eyebrowParts(text: string) {
  const parts = text.split('•').map((part) => part.trim());
  return parts.flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <span key={i} aria-hidden className="mx-1.5 inline-block h-1.5 w-1.5 dt:mx-2.5 translate-y-[-2px] rounded-full bg-hero-accent" />,
          part,
        ],
  );
}

export function HeroLight({ slides }: { slides: HeroSlide[] }) {
  const { index, go, paused, setPaused, reduced, pauseOn } = useCarousel(slides.length);
  const many = slides.length > 1;
  /* The right arrow sits on the photo, which is dark there: white on a
     wide photo, ink on the light plate. */
  const onPhoto = Boolean(slides[index]?.wide_image);

  const arrow =
    'absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center transition-colors duration-(--duration-fast) md:grid';
  const ink = 'text-text-primary/45 hover:text-text-primary';

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Öne çıkan kampanyalar"
      className="relative overflow-hidden rounded-(--panel-radius) border border-line bg-white shadow-e1"
      {...pauseOn}
    >
      {/* --- pictures ------------------------------------------------------ */}
      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-[800ms] ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const active = i === index;
            const wide = slide.wide_image;
            return (
              <div key={`${i}-${slide.title}`} className="relative h-full w-full shrink-0">
                {wide ? (
                  /* From `sm` the photo starts under the copy, so its left
                     side runs into the white wash; on a phone it is a band
                     across the top. */
                  <div className="absolute inset-x-0 top-0 h-[200px] sm:inset-y-0 sm:left-[24%] sm:h-auto">
                    <Image
                      src={wide}
                      alt=""
                      fill
                      priority={i === 0}
                      unoptimized={isVector(wide)}
                      sizes="(min-width: 640px) 76vw, 100vw"
                      className={`object-cover object-[60%_50%] ${active ? 'animate-[hero-zoom_7000ms_ease-out_both]' : ''}`}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-x-0 top-0 h-[190px] bg-[radial-gradient(80%_100%_at_70%_45%,#ffffff_0%,#f3f4f7_60%,#e6e8ec_100%)] sm:inset-y-0 sm:left-[46%] sm:h-auto sm:[mask-image:linear-gradient(to_right,transparent,#000_18%)]">
                    <Image
                      src={slide.image}
                      alt=""
                      fill
                      priority={i === 0}
                      unoptimized={isVector(slide.image)}
                      sizes="(min-width: 640px) 54vw, 100vw"
                      className={`object-contain p-5 mix-blend-multiply sm:p-8 dt:p-10 ${active ? 'animate-[hero-settle_900ms_var(--ease-out)_both]' : ''}`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* The white wash the copy stands on: across the left from `sm`, up
          from the bottom on a phone. Fixed, like the copy's ground should be. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#fff_0%,#fff_52%,rgb(255_255_255/0.75)_62%,transparent_76%)] sm:bg-[linear-gradient(to_right,#fff_0%,#fff_30%,rgb(255_255_255/0.88)_42%,rgb(255_255_255/0.35)_56%,transparent_68%)]"
      />

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
                className="relative flex h-full w-full shrink-0 flex-col justify-end px-5 pb-14 pt-[200px] sm:justify-center sm:px-10 sm:pb-8 sm:pt-0 md:px-14 dt:px-20"
              >
                <div className="sm:max-w-[66%] dt:max-w-[52%]">
                  {slide.eyebrow ? (
                    <p
                      className={`flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] dt:gap-4 dt:tracking-[0.28em] text-text-primary/80 ${active ? RISE : ''}`}
                      style={{ animationDelay: '40ms' }}
                    >
                      <span aria-hidden className="h-[2px] w-6 shrink-0 bg-hero-accent sm:w-10 dt:w-16" />
                      <span className="min-w-0 truncate">{eyebrowParts(slide.eyebrow)}</span>
                    </p>
                  ) : null}

                  <h2
                    className={`mt-3 text-[24px] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink-fixed sm:text-[32px] dt:mt-5 dt:text-[40px] ${active ? RISE : ''}`}
                    style={{ animationDelay: '110ms' }}
                  >
                    <span className="line-clamp-2">{slide.title}</span>
                    {slide.title_accent ? <span className="block text-hero-accent">{slide.title_accent}</span> : null}
                  </h2>

                  {slide.description ? (
                    <p
                      className={`mt-3 hidden max-w-[40ch] text-[14px] leading-relaxed text-text-secondary sm:line-clamp-2 sm:block dt:mt-5 dt:max-w-[52ch] dt:text-[16px] ${active ? RISE : ''}`}
                      style={{ animationDelay: '180ms' }}
                    >
                      {slide.description}
                    </p>
                  ) : null}

                  <div
                    className={`mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 dt:mt-8 ${active ? RISE : ''}`}
                    style={{ animationDelay: '260ms' }}
                  >
                    <Link
                      href={slide.href}
                      tabIndex={active ? 0 : -1}
                      className="group/cta inline-flex h-11 items-center gap-3 rounded-(--card-radius) bg-hero-accent px-6 text-[14px] font-semibold text-white shadow-e2 transition-colors duration-(--duration-fast) hover:bg-hero-accent-strong dt:h-13 dt:px-9 dt:text-[16px]"
                    >
                      {slide.cta}
                      <ArrowRight
                        size={18}
                        strokeWidth={1.75}
                        aria-hidden
                        className="transition-transform duration-(--duration-base) ease-out group-hover/cta:translate-x-1"
                      />
                    </Link>
                    <Link
                      href="/iletisim?konu=teklif"
                      tabIndex={active ? 0 : -1}
                      className="group/quote hidden h-11 items-center sm:inline-flex"
                    >
                      <span className="inline-flex items-center gap-3 border-b border-text-primary pb-1 text-[14px] font-semibold text-text-primary transition-colors duration-(--duration-fast) group-hover/quote:border-hero-accent group-hover/quote:text-hero-accent dt:text-[16px]">
                        Teklif alın
                        <ArrowRight size={18} strokeWidth={1.75} aria-hidden />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- controls ------------------------------------------------------ */}
      {many ? (
        <>
          <button type="button" onClick={() => go(index - 1)} aria-label="Önceki kampanya" className={`${arrow} ${ink} left-1 dt:left-3`}>
            <ChevronLeft size={30} strokeWidth={1.25} aria-hidden />
          </button>
          <button type="button" onClick={() => go(index + 1)} aria-label="Sonraki kampanya" className={`${arrow} right-1 dt:right-3 ${onPhoto ? 'text-white/80 drop-shadow hover:text-white' : ink}`}>
            <ChevronRight size={30} strokeWidth={1.25} aria-hidden />
          </button>

          {/* Dots in 28px boxes (a 10px mark each), and the pause control —
              withdrawn under reduced motion, where autoplay never starts. */}
          <div className="absolute inset-x-0 bottom-2 z-10 flex justify-center sm:bottom-3 dt:bottom-4">
            <div className="flex items-center gap-1">
              <ul className="flex items-center gap-1">
                {slides.map((slide, i) => (
                  <li key={`${i}-${slide.title}`}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-label={`${i + 1}. kampanyaya git`}
                      aria-current={i === index}
                      className="group/dot grid h-7 w-7 place-items-center"
                    >
                      <span
                        aria-hidden
                        className={`h-2.5 w-2.5 rounded-full transition-colors duration-(--duration-base) ${
                          i === index ? 'bg-hero-accent' : 'bg-black/20 group-hover/dot:bg-black/40'
                        }`}
                      />
                    </button>
                  </li>
                ))}
              </ul>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi durdur'}
                  className="ml-1 grid h-7 w-7 place-items-center rounded-full border border-black/10 bg-white/80 text-text-primary/60 backdrop-blur transition-colors duration-(--duration-fast) hover:text-text-primary"
                >
                  {paused ? <Play size={12} strokeWidth={2.5} aria-hidden /> : <Pause size={12} strokeWidth={2.5} aria-hidden />}
                </button>
              )}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
