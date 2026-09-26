'use client';

/**
 * Three-row commercial header — the reference's defining structure.
 *
 * Measured target (docs/MERTER_REFERENCE_BLUEPRINT.md §3):
 *   row 1  utility   31px   rgb(241,241,241)
 *   row 2  main     101px   white, logo 271×58, search input 612×41
 *   row 3  nav       43px   rgb(253,172,12), 12 items across a 1400px track
 *   ≤1200            51px   single row, search collapses to an icon
 *   total           175px, position: static (the reference does NOT stick)
 *
 * The desktop/mobile switch is `dt:` (1200px), not Tailwind's `lg:` (1024px):
 * container-sweep measured a 175px header at 1200 and a 51px header at 1024.
 *
 * Hovering a nav item opens a full-width 1400×210 five-column mega panel with
 * `border-radius: 0 0 10px 10px` and `box-shadow: 0 3px 6px rgba(0,0,0,.16)` —
 * not a narrow dropdown.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  Badge as BadgeIcon,
  ChevronDown,
  Info,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from 'lucide-react';

import { BrandMark } from '@/components/brand-mark';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/components/cart-provider';
import { PRIMARY_NAV, SITE, UTILITY_LINKS } from '@/data/site';

const UTILITY_ICONS = { info: Info, phone: Phone, truck: Truck, badge: BadgeIcon };

/**
 * The lockup: the drawn S mark plus "EENERGY" set in the site's own Montserrat
 * at 800, which is what the logotype is. Setting the word as text rather than
 * shipping the whole lockup as an image keeps it sharp at every size and lets
 * it inherit the near-black ink token.
 *
 * The mark is taller than the cap height, as in the original, so the two are
 * baseline-aligned rather than centre-aligned.
 */
function Logo({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/"
      /* The lockup hit-tested 122×33: wide enough, 11px short. Extended
         vertically only — the mark and wordmark keep their measured sizes. */
      /* `min-w-11` below `sm` is a touch-target fix, not spacing. Withdrawing
         the wordmark there leaves only the ~25px S mark, which dropped the
         link's WIDTH to 25 and its hit area to 26×44 — the height extension
         below was doing its job while the width quietly failed. A minimum width
         is used rather than another `before` inset because the box can simply
         be 44 wide here; the mark centres inside it. */
      className={`relative flex min-w-11 items-end justify-center gap-[6px] before:absolute before:inset-x-0 before:-inset-y-[7px] before:content-[''] sm:min-w-0 sm:justify-start ${className}`}
      aria-label={SITE.name}
    >
      <BrandMark className="h-[30px] w-auto shrink-0 dt:h-[46px]" />
      {/* The wordmark is withdrawn below `sm`, leaving the S mark — the same
          thing the condensed sticky bar does.

          Not a taste call. Measured at 390 the logo link is 110px wide and ends
          at x=230, while the "EENERGY" glyphs are 113px wide and end at x=264;
          the b2b badge starts at 242, so the brand name was painting underneath
          it. At 320 the link is crushed to 40px while the text still renders to
          264, overrunning b2b, account and cart together. `min-w-0 shrink` lets
          the flex item shrink, but nothing makes the glyphs follow it and
          nothing clips them.

          Worth noting for future header checks: comparing the LINK boxes shows
          a tidy 12px gap and reports no collision. The overflow is only visible
          if you measure the text box. */}
      <span className="hidden items-start pb-[1px] sm:flex dt:pb-[3px]">
        <span className="text-[23px] font-extrabold uppercase leading-[0.82] tracking-[-0.015em] text-text-primary dt:text-[37px]">
          EENERGY
        </span>
        <span
          aria-hidden
          className="ml-[1px] text-[7px] font-semibold leading-none text-text-secondary dt:text-[10px]"
        >
          ®
        </span>
      </span>
    </Link>
  );
}

/**
 * Search field.
 *
 * Measured footprint kept (612×41 at 1440, pill, submit inside the right end),
 * but the resting state is now a filled surface rather than an outlined white
 * box: an outline-only field on white reads as a form control, a filled one
 * reads as a search tool, and this is the primary way anyone finds a part here.
 *
 * Three deliberate additions:
 *   - the placeholder names a product code, because that is what a technical
 *     buyer actually types
 *   - a `/` shortcut hint, and the shortcut itself, which is why the hint is
 *     honest rather than decoration
 *   - a `dark` tone for the condensed sticky bar, where the field sits on chrome
 */
function SearchField({
  id,
  autoFocus = false,
  tone = 'light',
  shortcut = false,
}: {
  id: string;
  autoFocus?: boolean;
  tone?: 'light' | 'dark';
  shortcut?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, the way every developer-facing tool binds it. Ignored
  // while the caret is already in a field, so it never eats real typing.
  useEffect(() => {
    if (!shortcut) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      event.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [shortcut]);

  const dark = tone === 'dark';

  return (
    <form
      role="search"
      action="/arama"
      className={`group flex h-[41px] w-full items-stretch overflow-hidden rounded-full border transition-colors duration-(--duration-base) ${
        dark
          ? 'border-chrome-line bg-white/10 focus-within:border-grad-1 focus-within:bg-white/15'
          : 'border-line-strong bg-surface-page focus-within:border-brand focus-within:bg-surface-card'
      }`}
    >
      <label htmlFor={id} className="sr-only">
        Ürün, marka veya ürün kodu ara
      </label>
      <input
        ref={inputRef}
        id={id}
        name="q"
        type="search"
        autoFocus={autoFocus}
        placeholder="Ürün, marka veya ürün kodu ara"
        className={`min-w-0 flex-1 bg-transparent pl-[18px] pr-2 text-[16px] outline-none dt:text-[16px] ${
          dark
            ? 'text-white placeholder:text-white/55'
            : 'text-text-primary placeholder:text-text-secondary'
        }`}
      />
      {shortcut && (
        <kbd
          aria-hidden
          className="my-auto mr-1 hidden shrink-0 rounded-md border border-line-strong bg-surface-card px-1.5 py-0.5 font-mono text-[11px] leading-none text-text-secondary group-focus-within:hidden dt:block"
        >
          /
        </kbd>
      )}
      <button
        type="submit"
        aria-label="Ara"
        /* The field is a measured 41px tall, so the button cannot be 44 without
           breaking that. `before` extends the hit area past the visual bounds
           instead — the documented answer when the control must stay small. */
        /* A filled gradient end-cap rather than a bare icon: the submit now
           reads as the action it is. It deliberately keeps FULL field height
           and the `before` extension — insetting it with `my-1` would have
           made a prettier floating pill and dropped the touch target from
           ~48×47 back to 41, undoing a fix made earlier in this build. The
           form's `overflow-hidden rounded-full` clips this into the pill end. */
        className={`relative grid w-14 shrink-0 place-items-center transition-colors duration-(--duration-fast) ease-in-out before:absolute before:inset-x-0 before:-inset-y-1 before:content-[''] ${
          dark
            ? 'bg-white/15 text-white hover:bg-white/25'
            : 'bg-linear-to-br from-grad-2 to-grad-3 text-white hover:from-grad-3 hover:to-grad-4'
        }`}
      >
        <Search size={20} strokeWidth={2.25} aria-hidden />
      </button>
    </form>
  );
}

function HeaderActions() {
  /* The badge shows 0 until the cart has been read, on purpose: pages render
     statically, so the server HTML cannot know this visitor's cart, and a
     count in the first client pass would disagree with it. */
  const { count: cartCount, bump } = useCart();

  return (
    <div className="flex shrink-0 items-center gap-1 dt:gap-2.5">
      {/* Placed in this cluster rather than in the 31px utility strip: the
          strip is desktop-only and too short to hold a 44px target, while this
          row renders at 390 too, so the control is reachable on a phone. It
          leads the cluster because it changes the whole page and the three
          beside it are destinations. */}
      <ThemeToggle className="hidden text-text-primary hover:bg-surface-page hover:text-brand-dark dt:grid dt:h-[38px] dt:w-[38px]" />
      {/* Measured: the b2b badge is present at 390 too, not desktop-only. */}
      <Link
        href="/toptan-satis"
        /* Hit-tested 44×32 — the width was fine, the height was not. The 32px
           visual keeps the measured badge proportions, so `before` lifts the
           target to 44 (32 + 2×6) instead of inflating the pill. */
        className="relative flex h-8 items-center rounded-full bg-brand px-2.5 text-[12px] font-extrabold text-white transition-colors duration-(--duration-fast) ease-in-out before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:bg-brand-dark dt:h-10 dt:px-3.5 dt:text-[13px]"
      >
        b2b
      </Link>
      <Link
        href="/hesabim"
        aria-label="Hesabım"
        /* 44px below `dt` because that is the touch context; 38px from `dt` up,
           where a pointer is driving and the measured header row is 101px. */
        className="grid h-11 w-11 place-items-center rounded-full text-text-primary transition-colors duration-(--duration-fast) ease-in-out hover:text-brand-dark dt:h-[38px] dt:w-[38px] dt:bg-brand dt:text-white dt:hover:bg-brand-dark"
      >
        <User size={20} strokeWidth={1.9} aria-hidden />
      </Link>
      <Link
        href="/sepet"
        aria-label={`Sepetim, ${cartCount} ürün`}
        className="relative grid h-11 w-11 place-items-center rounded-full text-text-primary transition-colors duration-(--duration-fast) ease-in-out hover:text-brand-dark dt:h-[38px] dt:w-[38px] dt:bg-brand dt:text-white dt:hover:bg-brand-dark"
      >
        <ShoppingCart size={20} strokeWidth={1.9} aria-hidden />
        {/* Inset rather than hung outside the button: at 320 a negative offset
            pushed the badge past the viewport and the document scrolled 9px. */}
        {/* Keyed on `bump`: each successful add remounts the badge, which
            replays the pulse — the header answering the click. */}
        <span
          key={bump}
          className={`absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[rgb(195,19,28)] px-1 text-[10px] font-bold text-white ${bump > 0 ? 'animate-[cart-bump_520ms_var(--ease-out)]' : ''}`}
        >
          {cartCount}
        </span>
      </Link>
    </div>
  );
}

/** `promo` is the announcement bar text (admin → Vitrin → Duyuru çubuğu). */
export function SiteHeader({ promo }: { promo: string }) {
  /* The condensed bar carries its own cart badge. It reads the same store as
     the masthead's, so the two cannot disagree — a sticky bar still showing 0
     after something was added would be worse than having no badge there. */
  const { count: cartCount, bump } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  /**
   * Escape closes the drawer.
   *
   * A full-viewport overlay whose only exit is finding its close button is a
   * trap — for a keyboard user most of all, since tabbing lands them inside a
   * panel they cannot dismiss. Bound only while the drawer is open, so the
   * listener is not sitting on the window for the whole session.
   */
  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  /**
   * The measured reference header does not stick. This one grows a condensed
   * bar instead of sticking whole: 175px of chrome following you down an
   * 8600px page would cost more than it gives, but losing search and the cart
   * after the first screen is worse. The threshold clears the masthead.
   *
   * Scroll position is external state, so it is subscribed to rather than
   * mirrored into a state variable from an effect — the server snapshot of
   * `false` also guarantees the bar renders hidden on the server.
   */
  const condensed = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('scroll', onStoreChange, { passive: true });
      return () => window.removeEventListener('scroll', onStoreChange);
    },
    () => window.scrollY > 260,
    () => false,
  );

  // A small close delay keeps the panel usable while the pointer travels from
  // the 43px trigger down into the panel below it.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMega(null), 120);
  };
  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header className="relative z-40 bg-surface-card">
      {/* ---- condensed sticky bar -------------------------------------- */}
      {/* Inert until it is on screen: aria-hidden, no tab stops and no pointer
          target, so a hidden bar can never take a click meant for the page. */}
      <div
        aria-hidden={!condensed}
        className={`fixed inset-x-0 top-0 z-50 border-b border-chrome-line bg-chrome/95 backdrop-blur transition-transform duration-(--duration-base) ease-out ${
          condensed ? 'translate-y-0' : '-translate-y-full'
        } ${condensed ? '' : 'pointer-events-none'}`}
      >
        <div className="container-header flex h-14 items-center gap-2.5 dt:gap-4">
          {/* Scrolling past the masthead used to take all twelve categories
              with it, leaving logo / search / cart for the remaining ~9.800px
              of page. This trigger reopens the drawer, which already holds
              every category and its sub-groups — reusing it beats building a
              second panel that would then have to be kept in sync. */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Kategoriler"
            tabIndex={condensed ? 0 : -1}
            className="flex h-11 shrink-0 items-center gap-2 rounded-full px-2.5 text-[13px] font-semibold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-chrome-soft"
          >
            <Menu size={20} strokeWidth={2} aria-hidden />
            <span className="hidden sm:inline">Kategoriler</span>
          </button>

          <Link
            href="/"
            aria-label={SITE.name}
            tabIndex={condensed ? 0 : -1}
            className="flex shrink-0 items-end gap-[5px]"
          >
            <BrandMark className="h-6 w-auto dt:h-7" />
            <span className="hidden text-[16px] font-extrabold uppercase leading-none tracking-[-0.015em] text-white sm:block dt:text-[20px]">
              EENERGY
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <SearchField id="search-sticky" tone="dark" />
          </div>

          <Link
            href="/sepet"
            aria-label={`Sepetim, ${cartCount} ürün`}
            tabIndex={condensed ? 0 : -1}
            className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-chrome-soft"
          >
            <ShoppingCart size={20} strokeWidth={1.9} aria-hidden />
            <span
              key={bump}
              className={`absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[rgb(195,19,28)] px-1 text-[10px] font-bold text-white ${bump > 0 ? 'animate-[cart-bump_520ms_var(--ease-out)]' : ''}`}
            >
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* ---- row 1: utility, 31px -------------------------------------- */}
      {/* Chrome, not the light grey it carried before.

          Three stacked surfaces — grey strip, white masthead, near-black nav —
          read as an accident rather than a system, and the grey was the least
          modern thing on the page. The strip now belongs to the same chrome
          family as the nav band, so the header reads as one dark frame
          bracketing a white middle. The palette is explicitly no longer the
          reference's since the rebrand (CLAUDE.md rule 6), so this is a token
          decision rather than a drift from measured geometry — the 31px height
          is untouched. */}
      <div className="hidden h-[31px] items-center border-b border-chrome-line bg-chrome dt:flex">
        <div className="container-header relative flex items-center justify-end">
          {/* Reference centres this promo line across the full bar rather than
              aligning it left, so it reads as an announcement, not a link.
              16px bold was shouting inside a 31px strip; 12.5px with a gradient
              dot announces without dominating. */}
          <p className="pointer-events-none absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap text-[13px] font-semibold text-white">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-r from-grad-1 to-grad-4"
            />
            {promo}
          </p>
          <nav aria-label="Yardımcı bağlantılar">
            <ul className="flex items-center gap-5">
              {UTILITY_LINKS.map((link) => {
                const Icon = UTILITY_ICONS[link.icon];
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-white/70 transition-colors duration-(--duration-fast) ease-in-out hover:text-white"
                    >
                      <Icon size={14} strokeWidth={1.8} aria-hidden />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>

      {/* ---- row 2: main header, 101px --------------------------------- */}
      {/* The masthead shares the nav's wider 1400 track, not the 1320 content
          container: the logo sits at x=20 and the cart ends at x=1429, both
          outside the content column. */}
      <div className="border-b border-[rgb(215,215,215)] dt:h-[101px]">
        <div className="container-header flex h-[50px] items-center gap-3 dt:h-full dt:justify-between dt:gap-4">
          <button
            type="button"
            aria-label="Kategori menüsünü aç"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen(true)}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-(--card-radius) text-text-primary dt:hidden"
          >
            <Menu size={24} strokeWidth={2} aria-hidden />
          </button>

          {/* Measured at 390 the order is hamburger · search · logo · b2b ·
              account · cart, with the logo centred. The search icon therefore
              sits before the logo on mobile and is hidden from 1200 up, where
              the full field takes over. */}
          <button
            type="button"
            onClick={() => setSearchOpen((open) => !open)}
            aria-label="Ara"
            aria-expanded={searchOpen}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-primary dt:hidden"
          >
            <Search size={22} strokeWidth={2} aria-hidden />
          </button>

          <Logo className="min-w-0 shrink dt:mr-0 dt:ml-0 mx-auto dt:mx-0" />

          {/* Measured: the search pill tracks the container rather than sitting
              at a fixed width — input 612 @1440 (container 1320) and 560 @1366
              (container 1240). A fixed 662px cap matched 1440 but ran 52px wide
              at 1366. `basis-1/2` is measured against the row, i.e. against the
              container, giving 660→610 and 620→570. (`max-w-[50%]` would resolve
              against the leftover flex slot instead and collapse it to ~405.) */}
          <div className="hidden justify-center dt:flex dt:shrink-0 dt:grow-0 dt:basis-[47%]">
            <div className="w-full">
              <SearchField id="search-desktop" shortcut />
            </div>
          </div>

          <div className="ml-auto dt:ml-0">
            <HeaderActions />
          </div>
        </div>

        {/* Mobile search opens as a sheet under the bar — the reference keeps
            the 51px row clean and reveals search from its icon. */}
        {searchOpen && (
          <div className="container-header pb-3 dt:hidden">
            <div className="flex items-center gap-2">
              <SearchField id="search-mobile" autoFocus />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Aramayı kapat"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-secondary"
              >
                <X size={20} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---- row 3: primary navigation, 43px --------------------------- */}
      {/* Measured bar colour is the *nav* orange rgb(253,172,12), which is not
          the same as the primary action orange rgb(248,158,30). */}
      <nav
        aria-label="Ana kategoriler"
        /* Two changes from the measured 43px amber bar, both deliberate:

           The light grey bottom border is gone. It was measured off a bar that
           was orange; on near-black it reads as a bright hairline separating
           the nav from nothing, and the colour change to the page already does
           the separating.

           48px rather than 43. The labels wrap to two lines at 12.5px, which is
           ~30px of text in a 43px bar — the bar was almost entirely type with no
           room around it. The header stack goes 31 + 101 + 48 = 180px, which is
           exactly the upper bound of the `header+nav` critical band already
           declared in visual.config.mjs, so the diff budget still applies
           unchanged. */
        className="relative hidden bg-brand-nav dt:block dt:h-[48px]"
        onMouseLeave={scheduleClose}
      >
        <div className="container-header h-full">
          <ul className="flex h-full items-stretch">
            {PRIMARY_NAV.map((item) => {
              const open = openMega === item.href;
              return (
                <li
                  key={item.href}
                  // `flex-auto` (flex: 1 1 auto), not `flex-1` (1 1 0%): the
                  // reference's 12 items are content-proportional, measuring
                  // 92–164px across the 1400 track, and that uneven sizing is
                  // what makes the longer labels wrap to two lines.
                  className="flex-auto"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMega(item.groups ? item.href : null);
                  }}
                >
                  {/* The dividers are gone and the open state no longer flips
                      to a white slab: on a near-black bar that read as a table
                      of cells. The trigger stays dark and gains a gradient
                      underline, which is also what ties it to the panel's own
                      gradient hairline below. */}
                  <Link
                    href={item.href}
                    onFocus={() => setOpenMega(item.groups ? item.href : null)}
                    /* `rounded-t-(--card-radius)` is the detail that ties the two pieces
                       together: the mega panel below carries `rounded-b-(--card-radius)`,
                       so an open trigger and its panel now read as one shape
                       rather than a flat cell sitting above a separate card.
                       The radius is invisible until the item has a surface,
                       i.e. on hover or open. */
                    className={`group relative flex h-full items-center justify-center rounded-t-(--card-radius) px-2.5 text-center text-[13px] font-semibold leading-[1.2] tracking-[-0.005em] transition-colors duration-(--duration-fast) ease-in-out ${
                      open ? 'bg-chrome-soft text-white' : 'text-white/80 hover:bg-chrome-soft hover:text-white'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={`absolute inset-x-2.5 bottom-0 h-[3px] rounded-t-full bg-linear-to-r from-grad-1 to-grad-4 transition-opacity duration-(--duration-fast) group-hover:opacity-100 ${
                        open ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mega panel: measured 1400 wide, aligned to the nav track, sitting
            immediately under the 175px header. One panel element for all
            triggers, so it cannot be clipped by a list item's bounds. */}
        {PRIMARY_NAV.map((item) => {
          if (!item.groups || openMega !== item.href) return null;
          return (
            <div
              key={item.href}
              className="absolute inset-x-0 top-full z-50"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div className="container-header">
                {/* e3, not a hand-written `0 3px 6px rgba(0,0,0,0.16)`. The
                    mega panel floats over the page, which is exactly what the
                    overlay step is for, and the ad-hoc value was one of the
                    three hardcoded shadows that existed before the scale. */}
                <div className="overflow-hidden rounded-b-(--card-radius) bg-surface-card shadow-e3">
                  {/* Hairline in the logo gradient: it carries the dark
                      trigger's underline down into the white panel so the two
                      read as one surface. */}
                  <span
                    aria-hidden
                    className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
                  />
                  <div className="px-5 py-6">
                  {/* The measured pitch was exactly 220px with no gutter
                      (columns at x=170/390/610/830/1050). Reproduced faithfully,
                      it left the panel's right ~260px empty: 5 × 220 = 1100
                      inside 1360px of usable width, which reads as a dead block
                      rather than a deliberate margin.
                      Five equal fractions fill the panel instead. This is a
                      departure from the measured reference, taken because the
                      client asked for the header to be modernised — and the
                      alternative, inventing a promo block to fill the gap, would
                      put content there that the site does not actually have. */}
                  <ul className="grid [grid-template-columns:repeat(5,minmax(0,1fr))]">
                    {item.groups.map((group) => (
                      <li key={group.href}>
                        {/* Measured: heading 15px/500 rgb(255,146,0);
                            links 13px/400 rgb(83,83,83) at a 24px pitch. */}
                        <Link
                          href={group.href}
                          className="block text-[16px] font-medium leading-[15px] text-brand-heading hover:underline"
                        >
                          {group.title}
                        </Link>
                        <ul className="mt-3">
                          {group.links.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block py-[2.5px] text-[13px] leading-[19px] text-[rgb(83,83,83)] transition-colors duration-(--duration-fast) ease-in-out hover:text-brand-dark"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </nav>

      {/* ---- mobile drawer --------------------------------------------- */}
      {/* Measured at 390: the drawer fills the full viewport width, and from
          `sm` up it becomes a 384px panel.

          No longer `dt:hidden`. It was mobile-only because the only way to open
          it was the mobile hamburger; the condensed bar's Kategoriler trigger
          now opens it at any width, and a narrow panel over a dimmed page is
          the ordinary desktop pattern for this.

          The comment lives HERE, above the guard — putting it between
          `{drawerOpen && (` and the element makes the parenthesised expression
          hold two things and the file stops parsing. */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Menüyü kapat"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/45 animate-[drawer-fade_200ms_ease-out_both]"
          />
          {/* Slides in from the edge it is anchored to. The gradient cap is the
              same device the panels and the nav trigger use, so the drawer
              reads as part of the system rather than a plain white sheet. */}
          <div className="absolute inset-y-0 left-0 flex w-full flex-col bg-surface-card animate-[drawer-in_260ms_var(--ease-out)_both] sm:w-[86%] sm:max-w-sm">
            <span
              aria-hidden
              className="block h-[3px] w-full shrink-0 bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
            />
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <Logo />
              <div className="flex items-center gap-1">
                {/* The theme control lives HERE below `dt`, not in the header
                    action cluster. Measured at 320: adding a fourth 44px
                    control to that row pushed the document to 364px — an exact
                    44px overflow, the width of this button, and the narrow
                    phone smoke test caught it. The row was already at its
                    limit with hamburger, search, logo, b2b, account and cart.
                    A drawer is where settings belong on a phone anyway; the
                    header keeps only destinations. */}
                <ThemeToggle className="text-text-primary hover:bg-surface-page hover:text-brand-dark dt:hidden" />
                <button
                  type="button"
                  aria-label="Menüyü kapat"
                  onClick={() => setDrawerOpen(false)}
                  className="grid h-11 w-11 place-items-center rounded-(--card-radius)"
                >
                  <X size={22} strokeWidth={2} aria-hidden />
                </button>
              </div>
            </div>

            <nav aria-label="Kategoriler" className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-line">
                {PRIMARY_NAV.map((item) => (
                  <li key={item.href}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className="flex-1 px-4 py-3 text-[14px] font-semibold text-text-primary"
                      >
                        {item.label}
                      </Link>
                      {item.groups && (
                        <button
                          type="button"
                          aria-label={`${item.label} alt kategorileri`}
                          aria-expanded={openGroup === item.href}
                          onClick={() =>
                            setOpenGroup(openGroup === item.href ? null : item.href)
                          }
                          className="grid h-11 w-11 place-items-center text-text-secondary"
                        >
                          <ChevronDown
                            size={18}
                            className={openGroup === item.href ? 'rotate-180' : ''}
                            aria-hidden
                          />
                        </button>
                      )}
                    </div>
                    {/* The drawer shows the same group structure as the desktop
                        mega panel: a group heading, then its links. */}
                    {item.groups && openGroup === item.href && (
                      <ul className="bg-surface-page pb-2">
                        {item.groups.map((group) => (
                          <li key={group.href}>
                            <Link
                              href={group.href}
                              onClick={() => setDrawerOpen(false)}
                              className="block px-7 pb-1 pt-3 text-[13px] font-semibold text-brand-heading"
                            >
                              {group.title}
                            </Link>
                            <ul>
                              {group.links.map((child) => (
                                <li key={child.href}>
                                  <Link
                                    href={child.href}
                                    onClick={() => setDrawerOpen(false)}
                                    className="block px-9 py-2 text-[13px] text-text-secondary"
                                  >
                                    {child.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* The utility links, which until now existed only in the 31px
                desktop bar (`dt:flex`). On a phone the sole route to them was
                the footer, ~12.600px down the homepage — and a drawer is where
                someone looks for navigation. Pinned below the scrolling
                category list rather than appended to it, so it also puts the
                drawer's empty lower third to work.
                `min-h-11` on the row, not padding arithmetic: the label is
                12.5px and padding alone left the target ~34px. */}
            <div className="shrink-0 border-t border-line bg-surface-page px-4 py-2">
              <ul className="grid grid-cols-2 gap-x-3">
                {UTILITY_LINKS.map((link) => {
                  const Icon = UTILITY_ICONS[link.icon];
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setDrawerOpen(false)}
                        className="flex min-h-11 items-center gap-2 text-[13px] font-medium text-text-secondary transition-colors duration-(--duration-fast) ease-in-out hover:text-brand-dark"
                      >
                        <Icon size={15} strokeWidth={1.8} aria-hidden className="shrink-0" />
                        <span className="truncate">{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
