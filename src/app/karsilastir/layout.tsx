import type { Metadata } from 'next';

/**
 * Carries the metadata the client page cannot export itself.
 * `noindex, follow` per docs/INFORMATION_ARCHITECTURE §2.
 */
export const metadata: Metadata = {
  title: 'Ürün Karşılaştırma',
  robots: { index: false, follow: true },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
