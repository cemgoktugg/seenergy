/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { ARTICLES, type Article } from '@/data/blog-articles';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Güvenlik kameraları, network ve elektronik ürünler hakkında rehberler ve bilgi yazıları.',
};

/** Reading time from the article's own words, at ~200 words a minute. */
const minutes = (article: Article) =>
  Math.max(
    2,
    Math.round(
      article.body
        .map((block) => ('p' in block ? block.p : 'h' in block ? block.h : block.ul.join(' ')))
        .join(' ')
        .split(/\s+/).length / 200,
    ),
  );

export default function BlogIndexPage() {
  const [lead, ...rest] = ARTICLES;
  return (
    <div className="container-main pb-14 pt-4 dt:pt-6">
      <nav aria-label="Konum" className="text-[12px] text-text-secondary">
        <Link href="/" className="hover:text-text-primary">
          Ana sayfa
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <span className="font-medium text-text-primary">Blog</span>
      </nav>
      <p className="mt-4 flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.18em] text-text-secondary">
        <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
        Bilgi ve rehber
      </p>
      <h1 className="mt-2 text-[32px] font-extrabold tracking-tight text-text-primary dt:text-[40px]">Blog</h1>
      <p className="mt-2 max-w-[62ch] text-[14px] text-text-secondary">
        Güvenlik kameraları, kayıt cihazları, network ve elektronik ürünler hakkında doğru seçimi yapmanıza yardımcı
        olacak rehberler.
      </p>

      {/* The lead article, large, on the steel card. */}
      <Link
        href={`/blog/${lead.slug}`}
        className="nav-metal group relative mt-6 grid overflow-hidden rounded-(--panel-radius) text-white shadow-e2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
      >
        <div className="relative p-6 dt:p-9">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-white/60">
            Öne çıkan rehber · {minutes(lead)} dk okuma
          </p>
          <h2 className="mt-2 text-[24px] font-extrabold leading-tight tracking-tight dt:text-[32px]">{lead.title}</h2>
          <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/70">{lead.excerpt}</p>
          <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white px-4 h-9 text-[13px] font-bold text-ink-fixed">
            Yazıyı oku
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className="relative hidden place-items-center bg-linear-to-br from-white to-wash-fixed p-8 md:grid">
          <img
            src={lead.image}
            alt=""
            className="h-48 w-auto object-contain transition-transform duration-(--duration-slow) group-hover:scale-105"
          />
        </div>
      </Link>

      <ul className="mt-(--space-grid-gap) grid gap-(--space-grid-gap) sm:grid-cols-2 lg:grid-cols-4">
        {rest.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 transition-[transform,box-shadow] duration-(--duration-base) hover:-translate-y-1 hover:shadow-e2"
            >
              <span className="grid h-40 place-items-center bg-linear-to-br from-white to-wash-fixed p-6">
                <img
                  src={article.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-auto object-contain transition-transform duration-(--duration-slow) group-hover:scale-105"
                />
              </span>
              <span className="flex flex-1 flex-col p-4">
                <span className="text-[12px] font-semibold text-text-secondary">{minutes(article)} dk okuma</span>
                <span className="mt-1 text-[16px] font-extrabold leading-snug text-text-primary">{article.title}</span>
                <span className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-text-secondary">{article.excerpt}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[13px] font-bold text-text-primary">
                  Oku
                  <ArrowRight size={14} strokeWidth={2.5} aria-hidden className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
