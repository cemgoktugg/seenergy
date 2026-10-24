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
import { CATEGORY_TREE, categoryHref } from '@/data/categories';
import { FOOTER_COLUMNS, PAYMENT_METHODS, SITE } from '@/data/site';
import { telHref, waHref } from '@/lib/contact';
import type { Company } from '@/lib/medusa/vitrin';

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

const GROUPED = CATEGORY_TREE.filter((node) => node.children?.length);
const SINGLES = CATEGORY_TREE.filter((node) => !node.children?.length);

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
      <div className="container-main flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
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

        <form className="flex h-[52px] w-full max-w-xl items-center overflow-hidden rounded-full bg-white">
          <label htmlFor="newsletter-email" className="sr-only">
            E-posta adresiniz
          </label>
          <input
            id="newsletter-email"
            type="email"
            name="email"
            placeholder="Bizden haberdar ol"
            className="h-full min-w-0 flex-1 bg-transparent px-5 text-[14px] text-text-primary outline-none placeholder:text-text-secondary"
          />
          <button
            type="submit"
            className="mr-1 h-11 shrink-0 rounded-full bg-brand px-5 text-[14px] font-semibold text-white transition-colors duration-(--duration-fast) ease-in-out hover:bg-brand-dark"
          >
            Kayıt Ol
          </button>
        </form>
      </div>
    </section>
  );
}

/** `company`: admin → Vitrin → Şirket bilgileri; empty fields are not shown. */
export function SiteFooter({ company }: { company: Company }) {
  return (
    <footer className="bg-surface-page pt-8">
      <div className="container-main">
        <section aria-labelledby="popular-categories">
          <h2
            id="popular-categories"
            className="text-[16px] font-bold text-text-primary lg:text-[20px]"
          >
            Popüler Kategoriler
          </h2>
          {/* Grouped by the tree rather than one 26-link wall: the three
              categories with subcategories each get a column headed by the
              parent, and the eleven without share the last two. */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
            {GROUPED.map((node) => (
              <div key={node.slug}>
                <Link
                  href={categoryHref(node.slug)}
                  className="text-[14px] font-bold text-text-primary transition-colors hover:text-brand-dark"
                >
                  {node.label}
                </Link>
                <ul className="mt-2.5 space-y-2 pointer-coarse:mt-1 pointer-coarse:space-y-0">
                  {node.children!.map((child) => (
                    <li key={child.slug}>
                      <Link
                        href={categoryHref(child.slug)}
                        className="text-[13px] text-text-secondary transition-colors hover:text-brand-dark"
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 lg:col-span-2">
              <p className="text-[14px] font-bold text-text-primary">Diğer kategoriler</p>
              <ul className="mt-2.5 grid grid-cols-2 gap-x-6 gap-y-2 pointer-coarse:mt-1 pointer-coarse:gap-y-0">
                {SINGLES.map((node) => (
                  <li key={node.slug}>
                    <Link
                      href={categoryHref(node.slug)}
                      className="text-[13px] text-text-secondary transition-colors hover:text-brand-dark"
                    >
                      {node.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Measured: three link columns, then a contact block on the right —
            not four even columns. */}
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
          <FooterColumns columns={FOOTER_COLUMNS} />

          <div className="col-span-2 lg:col-span-1">
            <p className="text-[14px] font-bold text-text-primary">Bize Ulaşın</p>
            {company.phone ? (
              <a href={telHref(company.phone)} className="mt-4 block text-[16px] font-bold text-text-primary hover:text-brand-dark">
                {company.phone}
              </a>
            ) : null}
            {company.whatsapp ? (
              <a href={waHref(company.whatsapp)} target="_blank" rel="noopener" className="mt-1 block text-[13px] font-semibold text-text-secondary hover:text-text-primary">
                WhatsApp: {company.whatsapp}
              </a>
            ) : null}
            {company.email ? (
              <a href={`mailto:${company.email}`} className="mt-1 block text-[13px] text-text-secondary hover:text-text-primary">
                {company.email}
              </a>
            ) : null}
            <address className="mt-3 whitespace-pre-line text-[12px] not-italic leading-relaxed text-text-secondary lg:text-[13px]">
              {company.legalName || SITE.name}
              {company.address ? `
${company.address}` : ''}
            </address>
            {company.hours ? <p className="mt-2 text-[12px] text-text-secondary lg:text-[13px]">{company.hours}</p> : null}
            <Link href="/iletisim" className="mt-3 inline-flex text-[13px] font-semibold text-text-primary underline underline-offset-4 hover:text-brand-dark">
              İletişim sayfası
            </Link>
          </div>
        </div>

        {/* Payment strip — the reference carries a row of card-scheme logos in
            this position. Those are third-party trademarks, so the row's shape
            is kept and the marks are replaced with neutral labels. */}
        <ul className="rail mt-6 flex gap-2 border-t border-line pt-5 lg:flex-wrap lg:items-center lg:justify-center lg:overflow-visible">
          {PAYMENT_METHODS.map((method) => (
            <li
              key={method}
              className="shrink-0 whitespace-nowrap rounded-(--card-radius) border border-line bg-surface-page px-2.5 py-1 text-[12px] font-medium text-text-secondary lg:px-3 lg:py-1.5"
            >
              {method}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t border-line bg-surface-utility py-4">
        <div className="container-main flex flex-col items-center justify-center gap-1 text-center text-[12px] text-text-secondary">
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
