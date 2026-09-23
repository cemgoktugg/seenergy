import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';

import { CartProvider } from '@/components/cart-provider';
import { StoreProvider } from '@/components/cart-store';
import { SiteHeader } from '@/components/site-header';
import { NewsletterBar, SiteFooter } from '@/components/site-footer';
import { SITE } from '@/data/site';
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
    'Uydu sistemleri, güvenlik kameraları, ses sistemleri, televizyon yedek parça, adaptör ve kablo çeşitlerinde toptan ve perakende elektronik tedarik.',
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
            <SiteHeader promo={announcement} />
            <main id="icerik">{children}</main>
            <NewsletterBar />
            <SiteFooter />
          </StoreProvider>
        </CartProvider>
      </body>
    </html>
  );
}
