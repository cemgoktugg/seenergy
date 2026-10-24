'use client';
/* eslint-disable @next/next/no-img-element */

/**
 * Product gallery — the product page's media: a large stage, a thumbnail strip
 * under it, and a full-screen viewer.
 *
 *   - The stage is a native scroll-snap track, the house pattern (`.rail`,
 *     ProductSlider): swiping works on touch with no gesture code, and the
 *     active picture is read back from the scroll position rather than kept
 *     as a second source of truth.
 *   - Pictures are CONTAINED on the neutral bed, never cropped — "the product
 *     page contains, the listing fills" (see the page's header note).
 *   - The first picture is the page's LCP element: eager, `fetchPriority`.
 *     The rest are lazy.
 *   - Zoom follows the pointer only for a mouse; touch gets the full-screen
 *     viewer instead, where the picture is as large as the screen allows.
 *   - A gallery of one is just a picture: no strip, no arrows, no counter.
 *   - Reduced motion: every programmatic scroll jumps instead of gliding.
 */

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { imageProps } from '@/lib/image';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * One scroll-snap track whose slides are exactly as wide as the track.
 * `active` is derived from `scrollLeft`; while a programmatic scroll is
 * gliding to a target, the slides it passes over are not reported, so the
 * thumbnails do not flicker through them.
 */
function useSnapTrack(count: number, onChange: (index: number) => void) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || count < 2) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / el.clientWidth)));
        if (target.current !== null) {
          if (index !== target.current) return;
          target.current = null;
        }
        onChange(index);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [count, onChange]);

  const scrollTo = useCallback((index: number, instant = false) => {
    const el = ref.current;
    if (!el) return;
    const behavior = instant || prefersReducedMotion() ? 'instant' : 'smooth';
    if (behavior === 'smooth') target.current = index;
    el.scrollTo({ left: index * el.clientWidth, behavior });
  }, []);

  return { ref, scrollTo };
}

/** Keep the active thumbnail inside its strip without scrolling the page. */
function useThumbInView(strip: React.RefObject<HTMLDivElement | null>, active: number) {
  useEffect(() => {
    const el = strip.current;
    const thumb = el?.children[active] as HTMLElement | undefined;
    if (!el || !thumb) return;
    const behavior = prefersReducedMotion() ? 'instant' : 'smooth';
    const start = thumb.offsetLeft;
    const end = start + thumb.offsetWidth;
    if (start < el.scrollLeft) el.scrollTo({ left: start - 4, behavior });
    else if (end > el.scrollLeft + el.clientWidth) el.scrollTo({ left: end - el.clientWidth + 4, behavior });
  }, [strip, active]);
}

const TRACK =
  'flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden';

const ARROW =
  'grid h-10 w-10 place-items-center rounded-full border border-line bg-surface-card/95 text-text-primary shadow-e2 backdrop-blur transition-[opacity,background-color,color] duration-(--duration-fast) hover:bg-brand hover:text-white focus-visible:opacity-100';

function Thumbs({
  images,
  active,
  onSelect,
  size,
  stripRef,
}: {
  images: string[];
  active: number;
  onSelect: (index: number) => void;
  size: string;
  stripRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={stripRef} className="relative flex gap-2 overflow-x-auto p-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {images.map((src, index) => (
        <button
          key={`${src}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`${index + 1}. görsel`}
          aria-current={index === active ? 'true' : undefined}
          className={`grid shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border bg-surface-card p-1.5 transition-[border-color,box-shadow,opacity] duration-(--duration-fast) ${size} ${
            index === active
              ? 'border-brand opacity-100 ring-2 ring-brand/25'
              : 'border-line opacity-70 hover:border-line-strong hover:opacity-100'
          }`}
        >
          <img {...imageProps(src, 80)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
        </button>
      ))}
    </div>
  );
}

export function ProductGallery({
  images,
  alt,
  badges,
}: {
  images: string[];
  alt: string;
  /** Server-rendered status pills, laid over the stage's top-left corner. */
  badges?: ReactNode;
}) {
  const count = images.length;
  const many = count > 1;
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const { ref: stageRef, scrollTo: stageTo } = useSnapTrack(count, setActive);
  const { ref: viewerTrackRef, scrollTo: viewerTo } = useSnapTrack(count, setActive);
  const strip = useRef<HTMLDivElement>(null);
  const viewerStrip = useRef<HTMLDivElement>(null);
  const viewer = useRef<HTMLDialogElement>(null);
  useThumbInView(strip, active);
  useThumbInView(viewerStrip, active);

  const wrap = (index: number) => (index + count) % count;

  const show = (index: number) => {
    const next = wrap(index);
    setActive(next);
    (viewerOpen ? viewerTo : stageTo)(next);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!many) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      show(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  };

  const openViewer = () => {
    viewer.current?.showModal();
    setViewerOpen(true);
    document.documentElement.style.overflow = 'hidden';
    // The dialog has only just got a layout; place its track before paint.
    requestAnimationFrame(() => viewerTo(active, true));
  };

  // Closing — by the button, Esc or the backdrop — returns the stage to the
  // picture the visitor was last looking at.
  useEffect(() => {
    const dialog = viewer.current;
    if (!dialog) return;
    const onClose = () => {
      setViewerOpen(false);
      document.documentElement.style.overflow = '';
    };
    dialog.addEventListener('close', onClose);
    return () => {
      dialog.removeEventListener('close', onClose);
      document.documentElement.style.overflow = '';
    };
  }, []);
  useEffect(() => {
    if (!viewerOpen) stageTo(active, true);
    // Only on open/close — the stage follows its own scrolling otherwise.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerOpen]);

  /* Hover zoom, mouse only: the picture scales 2× about the pointer. Written to
     the element's style directly — re-rendering React on every pointer move
     would be the expensive way to move a transform origin. */
  const zoomMove = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse') return;
    const img = event.currentTarget.querySelector('img');
    if (!img) return;
    const box = event.currentTarget.getBoundingClientRect();
    img.style.transformOrigin = `${((event.clientX - box.left) / box.width) * 100}% ${((event.clientY - box.top) / box.height) * 100}%`;
    img.style.transform = 'scale(2)';
  };
  const zoomOut = (event: React.PointerEvent<HTMLElement>) => {
    const img = event.currentTarget.querySelector('img');
    if (img) img.style.transform = '';
  };

  return (
    <div
      className="flex min-w-0 flex-col gap-2.5 dt:gap-3"
      role={many ? 'region' : undefined}
      aria-roledescription={many ? 'galeri' : undefined}
      aria-label={many ? `${alt} görselleri` : undefined}
      onKeyDown={onKeyDown}
    >
      {/* --- stage ------------------------------------------------------ */}
      <div className="group relative overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-b from-surface-card to-surface-page shadow-e1">
        <span aria-hidden className="absolute inset-x-0 top-0 z-10 block h-[3px] bg-linear-to-r from-grad-1 via-grad-3 to-grad-4" />

        <div ref={stageRef} className={TRACK}>
          {images.map((src, index) => (
            <div
              key={`${src}-${index}`}
              role={many ? 'group' : undefined}
              aria-roledescription={many ? 'görsel' : undefined}
              aria-label={many ? `${index + 1} / ${count}` : undefined}
              aria-hidden={many && index !== active ? true : undefined}
              className="aspect-square w-full shrink-0 snap-center [scroll-snap-stop:always]"
            >
              <button
                type="button"
                onClick={openViewer}
                onPointerMove={zoomMove}
                onPointerLeave={zoomOut}
                tabIndex={index === active ? 0 : -1}
                aria-label="Görseli tam ekran aç"
                className="block h-full w-full cursor-zoom-in overflow-hidden p-6 sm:p-8 dt:p-10"
              >
                <img
                  {...imageProps(src, 640)}
                  alt={index === 0 ? alt : `${alt} — ${index + 1}. görsel`}
                  width={800}
                  height={800}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : undefined}
                  decoding={index === 0 ? 'sync' : 'async'}
                  draggable={false}
                  className="h-full w-full object-contain transition-transform duration-(--duration-base) ease-out motion-reduce:transition-none"
                />
              </button>
            </div>
          ))}
        </div>

        {badges && <div className="pointer-events-none absolute left-4 top-5 flex flex-col gap-1.5">{badges}</div>}

        <button
          type="button"
          onClick={openViewer}
          aria-label="Tam ekran görüntüle"
          className={`${ARROW} absolute right-3 top-4 h-9 w-9 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100`}
        >
          <Expand size={16} strokeWidth={2} aria-hidden />
        </button>

        {many && (
          <>
            <button
              type="button"
              onClick={() => show(active - 1)}
              aria-label="Önceki görsel"
              className={`${ARROW} absolute left-3 top-1/2 -translate-y-1/2 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100`}
            >
              <ChevronLeft size={20} strokeWidth={2.25} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => show(active + 1)}
              aria-label="Sonraki görsel"
              className={`${ARROW} absolute right-3 top-1/2 -translate-y-1/2 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100`}
            >
              <ChevronRight size={20} strokeWidth={2.25} aria-hidden />
            </button>
            <p
              aria-live="polite"
              className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-chrome/80 px-2.5 py-1 font-mono text-[12px] tabular-nums text-white backdrop-blur"
            >
              {active + 1} / {count}
            </p>
          </>
        )}
      </div>

      {/* --- thumbnail strip — the mini slider ---------------------------- */}
      {many && (
        <Thumbs
          images={images}
          active={active}
          onSelect={show}
          size="h-16 w-16 dt:h-[76px] dt:w-[76px]"
          stripRef={strip}
        />
      )}

      {/* --- full-screen viewer -------------------------------------------
          A native <dialog>: focus is trapped, Esc closes and the rest of the
          page is inert without any of it being re-implemented here. The
          backdrop click is the one thing <dialog> does not do on its own. */}
      <dialog
        ref={viewer}
        aria-label={`${alt} görselleri`}
        onClick={(event) => {
          if (event.target === event.currentTarget) viewer.current?.close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-surface-card p-0 text-text-primary backdrop:bg-chrome/70 open:flex open:flex-col"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3 dt:px-6">
          <p className="min-w-0 truncate text-[14px] font-semibold">{alt}</p>
          <div className="flex shrink-0 items-center gap-3">
            {many && (
              <span className="font-mono text-[12px] tabular-nums text-text-secondary">
                {active + 1} / {count}
              </span>
            )}
            <button
              type="button"
              autoFocus
              onClick={() => viewer.current?.close()}
              aria-label="Kapat"
              className="grid h-10 w-10 place-items-center rounded-full border border-line-strong transition-colors duration-(--duration-fast) hover:border-brand hover:bg-brand hover:text-white"
            >
              <X size={18} strokeWidth={2.25} aria-hidden />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          <div ref={viewerTrackRef} className={`${TRACK} h-full`}>
            {images.map((src, index) => (
              <div
                key={`${src}-${index}`}
                aria-hidden={index !== active ? true : undefined}
                className="grid h-full w-full shrink-0 snap-center place-items-center p-4 [scroll-snap-stop:always] dt:p-10"
              >
                <img
                  src={src}
                  alt={index === 0 ? alt : `${alt} — ${index + 1}. görsel`}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
          {many && (
            <>
              <button
                type="button"
                onClick={() => show(active - 1)}
                aria-label="Önceki görsel"
                className={`${ARROW} absolute left-3 top-1/2 h-12 w-12 -translate-y-1/2 dt:left-6`}
              >
                <ChevronLeft size={22} strokeWidth={2.25} aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => show(active + 1)}
                aria-label="Sonraki görsel"
                className={`${ARROW} absolute right-3 top-1/2 h-12 w-12 -translate-y-1/2 dt:right-6`}
              >
                <ChevronRight size={22} strokeWidth={2.25} aria-hidden />
              </button>
            </>
          )}
        </div>

        {many && (
          <div className="flex justify-center border-t border-line px-4 py-3">
            <Thumbs
              images={images}
              active={active}
              onSelect={show}
              size="h-14 w-14 dt:h-16 dt:w-16"
              stripRef={viewerStrip}
            />
          </div>
        )}
      </dialog>
    </div>
  );
}
