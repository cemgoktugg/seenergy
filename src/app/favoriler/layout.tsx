import type { Metadata } from 'next';

/**
 * Carries the metadata the client page cannot export itself.
 * `noindex, follow` per docs/INFORMATION_ARCHITECTURE §2.
 */
export const metadata: Metadata = {
  title: 'Favorilerim',
  robots: { index: false, follow: true },
};

export default function FavouritesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
