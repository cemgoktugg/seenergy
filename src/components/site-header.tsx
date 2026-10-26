'use client';
/* eslint-disable @next/next/no-img-element */

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
  ChevronRight,
  Info,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  Truck,
  User,
  X,
} from 'lucide-react';

import { BrandLogo, BrandLogoCompact, BrandMark } from '@/components/brand-mark';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/components/cart-provider';
import { formatPrice } from '@/data/catalog';
import { CATEGORY_ICONS } from '@/components/category-icons';
import { NAV_FEATURED, PRIMARY_NAV, SITE, UTILITY_LINKS, type NavItem } from '@/data/site';
import { imageProps } from '@/lib/image';

const UTILITY_ICONS = { info: Info, phone: Phone, truck: Truck, badge: BadgeIcon };

/** A model in the mega panel, keyed by its subcategory's href. */
export type MenuModels = Record<string, { label: string; detail: string; image: string; href: string }[]>;

/** Models listed per column before it hands over to "+n model daha". */
const MENU_MODEL_LIMIT = 7;

/**
 * The lockup: the client's own logo (see brand-mark.tsx) — the SEENERGY®
 * wordmark from `sm` up, the S mark alone below. Theme-following: black on
 * the light header, white under the dark theme.
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
      className={`relative flex min-w-11 items-center justify-center before:absolute before:inset-x-0 before:-inset-y-[7px] before:content-[''] sm:min-w-0 sm:justify-start ${className}`}
      aria-label={SITE.name}
    >
      <BrandMark shine className="flex h-[42px] w-auto shrink-0 sm:hidden" />
      {/* The wordmark is withdrawn below `sm`, leaving the S mark — the same
          thing the condensed sticky bar does. (Measured when the wordmark was
          still set as text; the rule carries over to the image lockup, which
          is wider still.)

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
      <BrandLogo shine className="hidden h-[38px] w-auto shrink-0 sm:flex dt:h-10" />
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
      className={`group flex h-[41px] w-full items-stretch overflow-hidden rounded-full border transition-colors duration-(--duration-base) ${dark ? '' : 'dt:h-10'} ${
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
        className={`min-w-0 flex-1 bg-transparent pl-[18px] pr-2 text-[16px] outline-none dt:text-[14px] min-[85rem]:text-[16px] ${
          dark
            ? 'text-white placeholder:text-white/55'
            : 'text-text-primary placeholder:text-text-secondary'
        }`}
      />
      {shortcut && (
        <kbd
          aria-hidden
          className="my-auto mr-1 hidden shrink-0 rounded-(--card-radius) border border-line-strong bg-surface-card px-1.5 py-0.5 font-mono text-[12px] leading-none text-text-secondary group-focus-within:hidden min-[85rem]:block"
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
  const { cart, count: cartCount, bump } = useCart();

  /* From `dt` the account and cart are labelled — icon-only circles left a
     shopper guessing, and the cart now says what is in it. Below `dt` they
     stay 44px icons: the 390 row is already at its width limit. */
  const iconCircle =
    'relative grid h-11 w-11 shrink-0 place-items-center rounded-full text-text-primary transition-colors duration-(--duration-fast) ease-in-out dt:h-10 dt:w-10 dt:bg-brand dt:text-white';

  return (
    <div className="flex shrink-0 items-center gap-1 dt:gap-4 min-[85rem]:gap-5">
      {/* Measured: the b2b badge is present at 390 too, not desktop-only. */}
      <Link
        href="/toptan-satis"
        /* Hit-tested 44×32 — the width was fine, the height was not. The 32px
           visual keeps the measured badge proportions, so `before` lifts the
           target to 44 (32 + 2×6) instead of inflating the pill. */
        className="relative flex h-8 items-center rounded-full bg-brand px-2.5 text-[12px] font-extrabold text-white transition-colors duration-(--duration-fast) ease-in-out before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[''] hover:bg-brand-dark dt:h-10 dt:px-4 dt:text-[13px]"
      >
        b2b
      </Link>
      <Link href="/hesabim" aria-label="Hesabım" className="group flex items-center gap-2.5">
        <span className={`${iconCircle} dt:group-hover:bg-brand-dark`}>
          <User size={20} strokeWidth={1.9} aria-hidden />
        </span>
        <span className="hidden leading-tight dt:block">
          <span className="block text-[12px] text-text-secondary">Giriş yap</span>
          <span className="block text-[14px] font-bold text-text-primary">Hesabım</span>
        </span>
      </Link>
      <Link href="/sepet" aria-label={`Sepetim, ${cartCount} ürün`} className="group flex items-center gap-2.5">
        <span className={`${iconCircle} dt:group-hover:bg-brand-dark`}>
          <ShoppingCart size={20} strokeWidth={1.9} aria-hidden />
          {/* Inset rather than hung outside the button: at 320 a negative offset
              pushed the badge past the viewport and the document scrolled 9px.
              Keyed on `bump`: each successful add remounts the badge, which
              replays the pulse — the header answering the click. */}
          <span
            key={bump}
            className={`absolute right-0 top-0 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[rgb(195,19,28)] px-1 text-[12px] font-bold text-white ring-2 ring-surface-card dt:-right-1 dt:-top-1 ${bump > 0 ? 'animate-[cart-bump_520ms_var(--ease-out)]' : ''}`}
          >
            {cartCount}
          </span>
        </span>
        <span className="hidden leading-tight dt:block">
          <span className="block text-[12px] text-text-secondary">Sepetim</span>
          <span className="block min-w-[72px] text-[14px] font-bold tabular-nums text-text-primary">
            {cart && cart.count > 0 ? formatPrice(cart.itemTotal) : 'Boş'}
          </span>
        </span>
      </Link>
    </div>
  );
}

/** `openMega` value for the all-categories panel (any other value is a category href). */
const ALL = '__all__';

/** Every model listed under a category: its subcategories' or its own. */
const modelsOf = (item: NavItem, menuModels: MenuModels) =>
  (item.children ?? [item]).flatMap((child) => menuModels[child.href] ?? []);

/** The category, on the dark chrome the header is made of. */
function CategoryIntro({ item, menuModels, onClose }: { item: NavItem; menuModels: MenuModels; onClose: () => void }) {
  const total = modelsOf(item, menuModels).length;
  return (
    <div className="relative flex w-[250px] shrink-0 flex-col overflow-hidden bg-chrome p-6 text-white">
      <span aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-grad-1/25 blur-3xl" />
      <p className="relative text-[12px] font-bold uppercase tracking-[0.18em] text-white/55">Kategori</p>
      <p className="relative mt-1.5 text-[20px] font-extrabold leading-tight tracking-tight">{item.label}</p>
      <p className="relative mt-2 text-[13px] text-white/65">
        {item.children ? `${item.children.length} alt kategori · ` : ''}
        {total} ürün
      </p>
      <Link
        href={item.href}
        onClick={onClose}
        className="relative mt-auto inline-flex h-9 w-fit items-center gap-1.5 rounded-full bg-white px-4 text-[13px] font-bold text-chrome transition-transform duration-(--duration-fast) hover:translate-x-0.5"
      >
        Tüm ürünler
        <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
      </Link>
    </div>
  );
}

function ModelLink({ model, onClose }: { model: MenuModels[string][number]; onClose: () => void }) {
  return (
    <Link
      href={model.href}
      onClick={onClose}
      className="group/model -mx-2 flex items-center gap-3 rounded-(--card-radius) px-2 py-1.5 transition-colors duration-(--duration-fast) hover:bg-surface-page"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-(--card-radius) border border-line bg-surface-card p-1 transition-colors duration-(--duration-fast) group-hover/model:border-line-strong">
        <img {...imageProps(model.image, 40)} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[13px] font-bold text-text-primary">{model.label}</span>
        <span className="block truncate text-[12px] text-text-secondary">{model.detail}</span>
      </span>
    </Link>
  );
}

/**
 * One column per subcategory with its models underneath — the client's own
 * layout ("AHD Sistem" opens onto SE-1080LD, SE-1080MD…) — or, for a category
 * without subcategories, its own models in a grid. Built from the catalogue,
 * so a model added in the admin joins on its own.
 */
function CategoryBody({ item, menuModels, onClose }: { item: NavItem; menuModels: MenuModels; onClose: () => void }) {
  if (!item.children) {
    const models = menuModels[item.href] ?? [];
    return models.length ? (
      <div className="flex-1 p-6">
        <ul className="grid gap-x-5 gap-y-1 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
          {models.slice(0, 12).map((model) => (
            <li key={model.href}>
              <ModelLink model={model} onClose={onClose} />
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="flex-1 px-6 py-14 text-center">
        <div>
          <p className="text-[16px] font-extrabold text-text-primary">Bu kategorinin ürünleri yakında burada</p>
          <p className="mt-1 text-[13px] text-text-secondary">Fiyat ve stok bilgisi için bize yazabilirsiniz.</p>
          <Link
            href={`/iletisim?konu=teklif&urun=${encodeURIComponent(item.label)}`}
            onClick={onClose}
            className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-bold text-white hover:bg-brand-dark"
          >
            Teklif iste
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <ul className="grid flex-1 content-start gap-x-5 gap-y-6 p-6 [grid-template-columns:repeat(auto-fill,minmax(220px,1fr))]">
      {item.children.map((child) => {
        const models = menuModels[child.href] ?? [];
        return (
          <li key={child.href} className="min-w-0">
            <Link
              href={child.href}
              onClick={onClose}
              className="group/sub flex items-center gap-2 pb-2.5 text-[14px] font-extrabold tracking-tight text-text-primary"
            >
              <span
                aria-hidden
                className="h-[3px] w-4 shrink-0 rounded-full bg-linear-to-r from-grad-1 to-grad-4 transition-[width] duration-(--duration-fast) group-hover/sub:w-6"
              />
              <span className="truncate">{child.label}</span>
              <span className="ml-auto shrink-0 rounded-full bg-surface-page px-2 py-0.5 text-[12px] font-bold tabular-nums text-text-secondary">
                {models.length}
              </span>
            </Link>
            {models.length > 0 ? (
              <ul className="space-y-0.5">
                {models.slice(0, MENU_MODEL_LIMIT).map((model) => (
                  <li key={model.href}>
                    <ModelLink model={model} onClose={onClose} />
                  </li>
                ))}
                {models.length > MENU_MODEL_LIMIT && (
                  <li className="pt-1">
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[13px] font-bold text-text-primary underline decoration-line-strong underline-offset-4 hover:decoration-text-primary"
                    >
                      +{models.length - MENU_MODEL_LIMIT} model daha
                      <ChevronRight size={13} strokeWidth={2.5} aria-hidden />
                    </Link>
                  </li>
                )}
              </ul>
            ) : (
              <p className="rounded-(--card-radius) border border-dashed border-line px-3 py-3 text-[12px] text-text-secondary">
                Bu alt kategoriye ürünler yakında eklenecek.
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * "Tüm Kategoriler": the whole tree in two panes — every category down the
 * left, the one under the pointer opened on the right — so all fourteen are
 * one hover away without fourteen labels crowding the bar.
 */
function AllCategoriesPanel({ menuModels, onClose }: { menuModels: MenuModels; onClose: () => void }) {
  const [active, setActive] = useState(PRIMARY_NAV[0].href);
  const item = PRIMARY_NAV.find((entry) => entry.href === active) ?? PRIMARY_NAV[0];
  return (
    <div className="flex max-h-[calc(100dvh-200px)] overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e3">
      <ul className="w-[310px] shrink-0 overflow-y-auto border-r border-line bg-surface-page py-2">
        {PRIMARY_NAV.map((entry) => {
          const Icon = CATEGORY_ICONS[entry.href];
          const on = entry.href === active;
          const count = modelsOf(entry, menuModels).length;
          return (
            <li key={entry.href}>
              <Link
                href={entry.href}
                onClick={onClose}
                onMouseEnter={() => setActive(entry.href)}
                onFocus={() => setActive(entry.href)}
                className={`relative flex h-11 items-center gap-3 px-4 text-[14px] font-semibold transition-colors duration-(--duration-fast) ${
                  on ? 'bg-surface-card text-text-primary' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-linear-to-b from-grad-1 to-grad-4 transition-opacity ${on ? 'opacity-100' : 'opacity-0'}`}
                />
                {Icon ? <Icon size={18} strokeWidth={1.9} aria-hidden className="shrink-0" /> : null}
                <span className="min-w-0 flex-1 truncate">{entry.label}</span>
                {count > 0 && <span className="text-[12px] tabular-nums text-text-secondary">{count}</span>}
                <ChevronRight size={15} strokeWidth={2.25} aria-hidden className={on ? 'opacity-100' : 'opacity-0'} />
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-text-secondary">Kategori</p>
            <p className="mt-0.5 text-[20px] font-extrabold tracking-tight text-text-primary">{item.label}</p>
          </div>
          <Link
            href={item.href}
            onClick={onClose}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-brand px-4 text-[13px] font-bold text-white hover:bg-brand-dark"
          >
            Tüm ürünler
            <ChevronRight size={14} strokeWidth={2.5} aria-hidden />
          </Link>
        </div>
        <CategoryBody item={item} menuModels={menuModels} onClose={onClose} />
      </div>
    </div>
  );
}

/**
 * `promo` is the announcement bar text (admin → Vitrin → Duyuru çubuğu).
 * `menuModels` is each subcategory's products, built by the layout from the
 * catalogue — the mega panel lists them under their subcategory.
 */
export function SiteHeader({ promo, menuModels = {} }: { promo: string; menuModels?: MenuModels }) {
  /* The condensed bar carries its own cart badge. It reads the same store as
     the masthead's, so the two cannot disagree — a sticky bar still showing 0
     after something was added would be worse than having no badge there. */
  const { count: cartCount, bump } = useCart();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMega, setOpenMega] = useState<string | null>(null);
  const featured = NAV_FEATURED.map((href) => PRIMARY_NAV.find((item) => item.href === href)).filter(
    (item): item is NavItem => Boolean(item),
  );
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
        <div className="container-main flex h-14 items-center gap-2.5 dt:gap-4">
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
            className="flex h-11 min-w-11 shrink-0 items-center justify-center sm:justify-start"
          >
            <BrandMark shine tone="light" className="flex h-7 w-auto sm:hidden" />
            <BrandLogoCompact shine tone="light" className="hidden h-[22px] w-auto sm:flex dt:h-[26px]" />
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
              className={`absolute right-0 top-0 grid h-[17px] min-w-[17px] place-items-center rounded-full bg-[rgb(195,19,28)] px-1 text-[12px] font-bold text-white ${bump > 0 ? 'animate-[cart-bump_520ms_var(--ease-out)]' : ''}`}
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
        <div className="container-main relative flex items-center justify-between gap-6">
          {/* Reference centres this promo line across the full bar rather than
              aligning it left, so it reads as an announcement, not a link.
              16px bold was shouting inside a 31px strip; 12.5px with a gradient
              dot announces without dominating. */}
          <p className="flex items-center gap-2 whitespace-nowrap text-[13px] font-semibold text-white">
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
              <li className="border-l border-white/15 pl-5">
                <ThemeToggle inline className="text-[12px] font-medium text-white/70 hover:text-white" />
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ---- row 2: main header, 72px (101px until 2026-10-26: 31px of air above
          and below 40px of content made the header read oversized) ---- */}
      {/* The masthead is on the content track (2026-10-26): the logo starts
          where the slider starts and the cart ends where it ends. Logo, search,
          b2b and the icons are all 40px from `dt`: one box, one top and one
          bottom line — option C, the client's choice (2026-10-26). A 48px row
          was turned down (icons too big); 48px logo + search with 40px icons
          was tried and replaced by this. */}
      <div className="border-b border-[rgb(215,215,215)] dt:h-[72px]">
        <div className="container-main flex h-[50px] items-center gap-3 dt:h-full dt:justify-between dt:gap-4">
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

          {/* From `dt` the logo and the actions take equal shares, so the
              search sits on the page centre; below it the wrapper is
              `contents` and the logo stays a flex item of the row. */}
          <div className="contents dt:flex dt:flex-1">
            <Logo className="min-w-0 shrink dt:mr-0 dt:ml-0 mx-auto dt:mx-0" />
          </div>

          {/* Measured: the search pill tracks the container rather than sitting
              at a fixed width — input 612 @1440 (container 1320) and 560 @1366
              (container 1240). A fixed 662px cap matched 1440 but ran 52px wide
              at 1366. `basis-1/2` is measured against the row, i.e. against the
              container, giving 660→610 and 620→570. (`max-w-[50%]` would resolve
              against the leftover flex slot instead and collapse it to ~405.) */}
          <div className="hidden justify-center dt:flex dt:shrink-0 dt:grow-0 dt:basis-[31%] min-[85rem]:basis-[36%] min-[90rem]:basis-[40%]">
            <div className="w-full">
              <SearchField id="search-desktop" shortcut />
            </div>
          </div>

          <div className="ml-auto dt:ml-0 dt:flex dt:flex-1 dt:justify-end">
            <HeaderActions />
          </div>
        </div>

        {/* Mobile search opens as a sheet under the bar — the reference keeps
            the 51px row clean and reveals search from its icon. */}
        {searchOpen && (
          <div className="container-main pb-3 dt:hidden">
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
        /* One line, not fourteen two-line labels: "Tüm Kategoriler" opens the
           whole tree, and the bar names the seven categories people shop most
           (NAV_FEATURED) — five at 1200, six from 1280, seven from 1440. */
        className="nav-metal relative hidden dt:block dt:h-[48px]"
        onMouseLeave={scheduleClose}
      >
        <div className="container-main h-full">
          <ul className="flex h-full items-stretch gap-1">
            <li
              onMouseEnter={() => {
                cancelClose();
                setOpenMega(ALL);
              }}
            >
              <button
                type="button"
                aria-expanded={openMega === ALL}
                aria-haspopup="true"
                onClick={() => setOpenMega(openMega === ALL ? null : ALL)}
                onFocus={() => setOpenMega(ALL)}
                className={`flex h-full items-center gap-2.5 whitespace-nowrap px-4 text-[14px] font-bold text-white transition-colors duration-(--duration-fast) ${
                  openMega === ALL ? 'bg-white/[0.14]' : 'bg-white/[0.07] hover:bg-white/[0.12]'
                }`}
              >
                <Menu size={18} strokeWidth={2.25} aria-hidden />
                Tüm Kategoriler
                <ChevronDown
                  size={15}
                  strokeWidth={2.5}
                  aria-hidden
                  className={`transition-transform duration-(--duration-fast) ${openMega === ALL ? 'rotate-180' : ''}`}
                />
              </button>
            </li>
            {featured.map((item, index) => {
              const open = openMega === item.href;
              return (
                <li
                  key={item.href}
                  className={index >= 6 ? 'hidden min-[90rem]:flex' : index >= 5 ? 'hidden xl:flex' : 'flex'}
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMega(item.children ? item.href : null);
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpenMega(null)}
                    onFocus={() => setOpenMega(item.children ? item.href : null)}
                    aria-label={item.short !== item.label ? item.label : undefined}
                    className={`group relative flex h-full items-center gap-1 whitespace-nowrap px-3 text-[14px] min-[90rem]:px-3.5 font-semibold transition-colors duration-(--duration-fast) ease-in-out ${
                      open ? 'bg-white/[0.09] text-white' : 'text-white/80 hover:bg-white/[0.07] hover:text-white'
                    }`}
                  >
                    {item.short}
                    {item.children && <ChevronDown size={14} strokeWidth={2.25} aria-hidden className="opacity-60" />}
                    <span
                      aria-hidden
                      className={`absolute inset-x-3 bottom-0 h-[3px] rounded-t-full bg-linear-to-r from-transparent via-white to-transparent shadow-[0_0_10px_rgb(255_255_255/0.6)] transition-opacity duration-(--duration-fast) group-hover:opacity-100 ${
                        open ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mega panel. One panel element per trigger, outside the list items,
            so it cannot be clipped by an item's bounds. Every link in it closes
            it on click (client navigation keeps the header mounted), and moving
            onto the dimmed page behind it closes it too. */}
        {openMega && (
          <div>
            <div
              aria-hidden
              onMouseEnter={() => setOpenMega(null)}
              className="absolute inset-x-0 top-full h-dvh bg-chrome/35 backdrop-blur-[2px] animate-[drawer-fade_160ms_ease-out_both]"
            />
            <div
              className="absolute inset-x-0 top-full z-50 animate-[mega-in_200ms_var(--ease-out)_both]"
              onMouseEnter={cancelClose}
              onMouseLeave={scheduleClose}
            >
              <div className="container-main pt-2">
                {openMega === ALL ? (
                  <AllCategoriesPanel menuModels={menuModels} onClose={() => setOpenMega(null)} />
                ) : (
                  PRIMARY_NAV.filter((item) => item.href === openMega && item.children).map((item) => (
                    <div key={item.href} className="flex overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e3">
                      <CategoryIntro item={item} menuModels={menuModels} onClose={() => setOpenMega(null)} />
                      <CategoryBody item={item} menuModels={menuModels} onClose={() => setOpenMega(null)} />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
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
                      {item.children && (
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
                    {/* Subcategories, same as the desktop mega panel. */}
                    {item.children && openGroup === item.href && (
                      <ul className="bg-surface-page py-1.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setDrawerOpen(false)}
                              className="block px-7 py-2.5 text-[14px] font-medium text-text-secondary transition-colors hover:text-text-primary"
                            >
                              {child.label}
                            </Link>
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
