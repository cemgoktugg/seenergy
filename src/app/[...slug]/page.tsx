/**
 * Placeholder for routes that exist in the navigation but are not built yet.
 *
 * The reconstruction brief scopes this phase to the homepage. Without this
 * route every nav item, footer link and category tile resolves to a browser
 * 404 — and Next prefetches them, so the console fills with 404s before anyone
 * even clicks.
 *
 * It states plainly that the section is not built. It does not fabricate a
 * category page or pretend to have products.
 */

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamicParams = true;

export function generateStaticParams() {
  // Nothing is prerendered; every path is resolved on demand.
  return [];
}

export default async function PlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = `/${(slug ?? []).join('/')}`;

  return (
    <div className="container-main flex min-h-[46vh] flex-col items-center justify-center py-16 text-center">
      <p className="rounded-full bg-brand-soft px-4 py-1.5 text-[12px] font-bold uppercase tracking-wide text-brand-dark">
        Demo kapsamı
      </p>

      <h1 className="mt-5 text-[24px] font-extrabold text-text-primary lg:text-[32px]">
        Bu bölüm henüz hazır değil
      </h1>

      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-text-secondary">
        Bu sürümde yalnızca ana sayfa yeniden inşa edildi. Aradığınız sayfa
        (<code className="rounded bg-surface-utility px-1.5 py-0.5 text-[13px]">{path}</code>)
        gezinme yapısında yer alıyor, ancak içeriği sonraki aşamada eklenecek.
      </p>

      <Link
        href="/"
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 h-13 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark"
      >
        <ArrowLeft size={17} strokeWidth={2} aria-hidden />
        Ana sayfaya dön
      </Link>
    </div>
  );
}
