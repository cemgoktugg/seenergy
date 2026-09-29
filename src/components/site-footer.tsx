/**
 * Footer — dense, useful, multi-column, exactly as the reference is.
 * Brief §19 rules out replacing it with a minimal two-column startup footer.
 *
 * Structure observed: a full-width newsletter + social strip, then a light
 * footer that opens with "Popüler Kategoriler" and continues into link
 * columns. The strip's amber fill is now the SEENERGY gradient.
 */

import Link from 'next/link';

import { FooterColumns } from '@/components/footer-columns';
import { FOOTER_COLUMNS, PAYMENT_METHODS, POPULAR_CATEGORIES, SITE } from '@/data/site';

/**
 * Generic social glyphs drawn inline.
 *
 * lucide-react v1 dropped its brand icons, and reproducing a platform's actual
 * logo would be using someone else's trademark for decoration. These are
 * simplified, non-trademark marks that still read as social channels.
 */
type Glyph = (props: { size?: number }) => React.ReactElement;

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
});

const SocialShare: Glyph = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </svg>
);

const SocialPhoto: Glyph = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" />
  </svg>
);

const SocialVideo: Glyph = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="M10 9.5l5 2.5-5 2.5z" />
  </svg>
);

const SocialMessage: Glyph = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <path d="M21 11.5a8.4 8.4 0 01-9 8.4 9 9 0 01-4-.9L3 21l1.9-4.9A8.4 8.4 0 0112 3a8.4 8.4 0 019 8.5z" />
  </svg>
);

const SocialWork: Glyph = ({ size = 18 }) => (
  <svg {...svgProps(size)}>
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M7 10v7M7 7.2v.1M11.5 17v-4a2.5 2.5 0 015 0v4" />
  </svg>
);

/** Measured: five circular marks on the strip, not four. */
const SOCIAL: { label: string; href: string; Icon: Glyph }[] = [
  { label: 'Sosyal medya', href: 'https://example.com', Icon: SocialShare },
  { label: 'Fotoğraf paylaşımı', href: 'https://example.com', Icon: SocialPhoto },
  { label: 'Video kanalı', href: 'https://example.com', Icon: SocialVideo },
  { label: 'Kurumsal ağ', href: 'https://example.com', Icon: SocialWork },
  { label: 'Mesajlaşma', href: 'https://example.com', Icon: SocialMessage },
];

/**
 * Newsletter + social strip.
 *
 * The one place the full logo gradient runs edge to edge: it anchors the bottom
 * of the page the way the near-black nav band anchors the top. Safe here
 * because nothing on this band is body copy — the social marks are white discs
 * and the newsletter field is a white pill.
 */
export function NewsletterBar() {
  return (
    <section className="bg-linear-to-r from-grad-1 via-grad-3 to-grad-4 py-4">
      <div className="container-nav flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
        <ul className="flex items-center gap-2.5">
          {SOCIAL.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-brand-fixed transition-colors hover:bg-brand-dark hover:text-white"
              >
                <Icon size={18} />
              </a>
            </li>
          ))}
        </ul>

        <form className="flex w-full max-w-xl items-stretch overflow-hidden rounded-full bg-white">
          <label htmlFor="newsletter-email" className="sr-only">
            E-posta adresiniz
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="Bizden haberdar ol"
            className="min-w-0 flex-1 bg-transparent px-5 py-3 text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type="submit"
            className="my-1 mr-1 shrink-0 rounded-full bg-brand px-5 text-[14px] font-semibold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-surface-page pt-8">
      <div className="container-nav">
        <section aria-labelledby="popular-categories">
          <h2
            id="popular-categories"
            className="text-[16px] font-bold text-text-primary lg:text-[20px]"
          >
            Popüler Kategoriler
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-6">
            {POPULAR_CATEGORIES.map((category) => (
              <li key={category.href}>
                <Link
                  href={category.href}
                  className="text-[12px] text-text-secondary transition-colors hover:text-brand-dark lg:text-[13px]"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Measured: three link columns, then a contact block on the right —
            not four even columns. */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
          <FooterColumns columns={FOOTER_COLUMNS} />

          <div className="col-span-2 lg:col-span-1">
            <p className="text-[14px] font-bold text-text-primary">Bize Ulaşın</p>
            <p className="mt-4 text-[16px] font-bold text-text-primary">0850 000 00 00</p>
            <address className="mt-3 text-[12px] not-italic leading-relaxed text-text-secondary lg:text-[13px]">
              {SITE.name}
              <br />
              Organize Sanayi Bölgesi, 4. Cadde No: 12
              <br />
              Başakşehir / İstanbul
            </address>
          </div>
        </div>

        {/* Payment strip — the reference carries a row of card-scheme logos in
            this position. Those are third-party trademarks, so the row's shape
            is kept and the marks are replaced with neutral labels. */}
        <ul className="rail mt-6 flex gap-2 border-t border-line pt-5 lg:flex-wrap lg:items-center lg:justify-center lg:overflow-visible">
          {PAYMENT_METHODS.map((method) => (
            <li
              key={method}
              className="shrink-0 whitespace-nowrap rounded-md border border-line bg-surface-page px-2.5 py-1 text-[10px] font-medium text-text-secondary lg:px-3 lg:py-1.5 lg:text-[11px]"
            >
              {method}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-line bg-surface-utility py-4">
        <div className="container-nav flex flex-col items-center justify-center gap-1 text-center text-[12px] text-text-secondary">
          {/* Measured 105 characters on a single line at 12px across the 1400
              track — the longest measure left on the page once the editorial
              block was bounded. Capped so it wraps to two readable lines. */}
          {/* States only what is true: orders are taken, paid by transfer or
              on delivery. The old card/SSL line promised a card payment that
              does not exist — restore it only when a card provider is live. */}
          <p className="max-w-[60ch]">
            © {new Date().getFullYear()} {SITE.name}. Tüm hakları saklıdır.
          </p>
          <p>Siparişlerinizi havale / EFT veya kapıda ödeme ile verebilirsiniz.</p>
        </div>
      </div>
    </footer>
  );
}
