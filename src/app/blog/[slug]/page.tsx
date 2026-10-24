/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, ChevronRight } from 'lucide-react';

import { ARTICLES, articleBySlug } from '@/data/blog-articles';

export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = articleBySlug((await params).slug);
  return article ? { title: article.title, description: article.excerpt } : { title: 'Yazı bulunamadı' };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = articleBySlug((await params).slug);
  if (!article) notFound();
  const others = ARTICLES.filter((item) => item.slug !== article.slug).slice(0, 3);

  return (
    <div className="container-main pb-14 pt-4 dt:pt-6">
      <nav aria-label="Konum" className="text-[12px] text-text-secondary">
        <Link href="/" className="hover:text-text-primary">
          Ana sayfa
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <Link href="/blog" className="hover:text-text-primary">
          Blog
        </Link>
        <ChevronRight size={13} strokeWidth={2} aria-hidden className="mx-1 inline text-line-strong" />
        <span className="font-medium text-text-primary">{article.title}</span>
      </nav>

      <div className="mt-4 grid items-start gap-(--space-grid-gap) lg:grid-cols-[minmax(0,1fr)_300px] dt:gap-8">
        <article className="min-w-0 overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
          <header className="grid gap-6 border-b border-line p-6 md:grid-cols-[minmax(0,1fr)_200px] md:items-center dt:p-8">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-text-secondary dt:text-[11px]">
                <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
                Blog
              </p>
              <h1 className="mt-2 text-[24px] font-extrabold leading-tight tracking-tight text-text-primary text-balance dt:text-[32px]">
                {article.title}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">{article.excerpt}</p>
            </div>
            <span className="hidden h-40 place-items-center rounded-(--card-radius) bg-linear-to-br from-white to-wash-fixed p-5 md:grid">
              <img src={article.image} alt="" className="h-full w-auto object-contain" />
            </span>
          </header>
          <div className="info-prose p-6 dt:p-8">
            {article.body.map((block, index) =>
              'h' in block ? (
                <h2 key={index}>{block.h}</h2>
              ) : 'p' in block ? (
                <p key={index}>{block.p}</p>
              ) : (
                <ul key={index}>
                  {block.ul.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-surface-page px-6 py-4 dt:px-8">
            <p className="text-[13.5px] font-semibold text-text-primary">İlgili ürünler: {article.related.label}</p>
            <Link
              href={article.related.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-[13px] font-bold text-white hover:bg-brand-dark"
            >
              Ürünleri incele
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </article>

        <aside className="flex flex-col gap-(--space-grid-gap) lg:sticky lg:top-(--sticky-offset)">
          <div className="rounded-(--panel-radius) border border-line bg-surface-card p-4 shadow-e1">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.14em] text-text-secondary">Diğer yazılar</p>
            <ul className="mt-2 divide-y divide-line">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`} className="group flex items-center gap-3 py-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-(--card-radius) bg-surface-page p-1.5">
                      <img src={item.image} alt="" loading="lazy" className="h-full w-full object-contain" />
                    </span>
                    <span className="text-[13px] font-semibold leading-snug text-text-primary group-hover:underline">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="nav-metal relative overflow-hidden rounded-(--panel-radius) p-5 text-white shadow-e2">
            <p className="relative text-[16px] font-extrabold">Doğru ürünü birlikte seçelim</p>
            <p className="relative mt-1.5 text-[13px] text-white/70">
              İhtiyacınızı yazın, uygun ürün listesini ve fiyatı iletelim.
            </p>
            <Link
              href="/iletisim?konu=teknik"
              className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink-fixed"
            >
              Teknik destek al
              <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
