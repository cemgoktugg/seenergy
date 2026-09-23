/**
 * 404.
 *
 * Reached when a route resolves to nothing real — a product slug that is not in
 * the catalogue, for instance. Distinct from `[...slug]`, which answers for
 * sections that exist in the navigation but are not built yet: that page says
 * "not built", this one says "not found", and conflating the two would tell a
 * visitor the wrong thing.
 */

import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container-main flex min-h-[46vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-text-secondary">
        404
      </p>

      <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary lg:text-[32px]">
        Aradığınız ürün bulunamadı
      </h1>

      <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-text-secondary">
        Ürün kaldırılmış veya adres hatalı olabilir. Ürün kodu ile arama
        yaparsanız doğru modele daha hızlı ulaşırsınız.
      </p>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          <ArrowLeft size={17} strokeWidth={2} aria-hidden />
          Ana sayfaya dön
        </Link>
        <Link
          href="/arama"
          className="inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3 text-[16px] font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand hover:text-white"
        >
          <Search size={17} strokeWidth={2} aria-hidden />
          Ürün ara
        </Link>
      </div>
    </div>
  );
}
