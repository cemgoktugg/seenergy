import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import { CartProvider } from '@/components/cart-provider';
import { StoreProvider } from '@/components/cart-store';
import { SiteHeader } from '@/components/site-header';
import { NewsletterBar, SiteFooter } from '@/components/site-footer';
import { PRIMARY_NAV, SITE } from '@/data/site';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

import './globals.css';

// The reference site renders in Montserrat; matching the typeface is part of
// matching the composition, so it is loaded rather than approximated.
const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description:
    'CCTV, kayıt ve depolama, network, alarm, yangın algılama, geçiş kontrol, uydu ve seslendirme sistemlerinde toptan ve perakende güvenlik teknolojileri tedariki.',
  robots: { index: false, follow: false },
};

/**
 * Theme, applied before the first paint.
 *
 * This has to be a blocking inline script in <head> and cannot be a component
 * effect. An effect runs after hydration, which is after the browser has
 * already painted — so a visitor who chose dark would see a flash of the light
 * page on every navigation. Reading localStorage and stamping the attribute
 * here happens before any pixels exist.
 *
 * Only an explicit choice is written. "system" removes the attribute entirely
 * and lets the `prefers-color-scheme` block in globals.css decide, which is
 * also what a visitor with JavaScript off always gets.
 *
 * Wrapped in try/catch because localStorage throws outright in some privacy
 * modes; a theme preference is not worth breaking the page for.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem('seenergy-theme');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Cached under the `vitrin` tag, so every page stays static.
  const { announcement } = await loadVitrin();

  /* The mega panel lists each subcategory's models (the client asked for
     "AHD Sistem" to open onto SE-1080LD, SE-1080MD…). Built here, on the
     server, from the catalogue — cached under `catalog` — and handed to the
     client header as plain links. A model added in the admin appears in the
     menu on its own. The brand prefix is dropped: the column already says
     where you are, and "SEENERGY SE-1080LD" ×9 is noise. */
  const { byCategory } = await loadCatalog();
  const menuModels: Record<string, { label: string; href: string }[]> = {};
  for (const item of PRIMARY_NAV) {
    for (const child of item.children ?? []) {
      const key = child.href.replace('/kategori/', '');
      // The house brand's own range leads its columns: that is the list the
      // client gave for this menu; other brands' products follow.
      const products = byCategory(key);
      const ordered = [
        ...products.filter((product) => product.brand === SITE.name),
        ...products.filter((product) => product.brand !== SITE.name),
      ];
      menuModels[child.href] = ordered.map((product) => ({
        /* The house range by its model code — the client's own menu lists
           codes, and "SE-1080LD 2MP AHD IR Dome Kamera" would not fit a
           column. Other brands by name, without the brand. */
        label:
          product.brand === SITE.name && product.sku
            ? product.sku
            : product.name.startsWith(`${product.brand} `)
              ? product.name.slice(product.brand.length + 1)
              : product.name,
        href: `/urun/${product.slug}`,
      }));
    }
  }

  return (
    <html lang="tr" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-(--card-radius) focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
        >
          İçeriğe geç
        </a>

        {/* The Medusa cart and the browser-local favourites/compare lists. Both
            wrap the header too, because its cart badge reads the same truth the
            pages do. */}
        <CartProvider>
          <StoreProvider>
            <SiteHeader promo={announcement} menuModels={menuModels} />
            <main id="icerik">{children}</main>
            <NewsletterBar />
            <SiteFooter />
          </StoreProvider>
        </CartProvider>
      </body>
    </html>
  );
}
