'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * Compare — `/karsilastir`.
 *
 * A real table, not a grid of cards: the whole point is reading one attribute
 * across several products, which means the row/column relationship has to
 * survive for a screen reader too (ECDOS 10 §47, the same rule the product
 * page's spec table follows).
 *
 * Rows are built from the union of what the selected products actually
 * declare — catalogue fields plus the headline specs derived from each
 * product's own name. A row is only shown when at least one product has a
 * value for it, so the table never pads itself with empty cells.
 *
 * Capped at four by the store: past that a comparison stops being readable on
 * any screen this storefront targets.
 */

import Link from 'next/link';
import { ArrowLeft, Scale, X } from 'lucide-react';

import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { useCatalog } from '@/components/catalog-provider';
import { categoryMeta, discountPercent, priceLabel } from '@/data/catalog';
import { INSTALMENTS_AVAILABLE } from '@/data/checkout';
import { keySpecsOf } from '@/data/specs';

export default function ComparePage() {
  const { state, ready, remove, clear } = useStore();
  const { byId } = useCatalog();

  const products = state.compare
    .map((id) => byId(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));

  if (ready && products.length === 0) {
    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-xl text-center">
          <span
            aria-hidden
            className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-brand-text"
          >
            <Scale size={22} strokeWidth={2} />
          </span>
          <h1 className="mt-4 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[30px]">
            Karşılaştırma listeniz boş
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün sayfasındaki “Karşılaştırmaya ekle” bağlantısıyla en çok{' '}
            {COMPARE_LIMIT} ürünü yan yana inceleyebilirsiniz.
          </p>
          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <ArrowLeft size={17} strokeWidth={2} aria-hidden />
            Ürünlere göz at
          </Link>
        </div>
      </div>
    );
  }

  /* Catalogue rows every product can answer, then the union of the headline
     specs the selected products happen to declare. */
  const baseRows: { label: string; value: (p: (typeof products)[number]) => string }[] = [
    { label: 'Marka', value: (p) => p.brand },
    { label: 'Ürün kodu', value: (p) => p.sku },
    { label: 'Kategori', value: (p) => categoryMeta(p.category).label },
    { label: 'Fiyat', value: (p) => priceLabel(p.price) },
    {
      label: 'İndirim',
      value: (p) => {
        const percent = discountPercent(p);
        return percent && percent > 0 ? `%${percent}` : '—';
      },
    },
    { label: 'Stok', value: (p) => (p.stock === 0 ? 'Tükendi' : `${p.stock} adet`) },
    { label: 'Kargo', value: (p) => (p.freeShipping ? 'Ücretsiz' : 'Standart') },
    {
      label: 'Ödeme',
      value: (p) => (INSTALMENTS_AVAILABLE && p.instalment ? '3 taksit' : 'Havale / EFT, kapıda'),
    },
  ];

  const specLabels = [
    ...new Set(products.flatMap((product) => keySpecsOf(product).map((spec) => spec.label))),
  ];

  const specValue = (product: (typeof products)[number], label: string) =>
    keySpecsOf(product).find((spec) => spec.label === label)?.value ?? '—';

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Karşılaştırma
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
            Ürün Karşılaştırma
          </h1>
          <button
            type="button"
            onClick={() => clear('compare')}
            className="text-[13px] font-semibold text-text-secondary underline underline-offset-2 transition-colors hover:text-danger-ink"
          >
            Listeyi temizle
          </button>
        </div>
        <p className="mt-2 text-[14px] text-text-secondary">
          <span className="font-extrabold tabular-nums text-text-primary">{products.length}</span>{' '}
          / {COMPARE_LIMIT} ürün
        </p>
      </section>

      <section className="container-main pb-12 pt-4 dt:pt-6" aria-label="Karşılaştırma tablosu">
        {/* The table scrolls inside its own box rather than pushing the page
            sideways, which is what four columns would do at 390. */}
        <div className="overflow-x-auto rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Seçilen ürünlerin karşılaştırması</caption>
            <thead>
              <tr>
                <th scope="col" className="w-[150px] border-b border-line p-3 align-bottom">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
                    Özellik
                  </span>
                </th>
                {products.map((product) => (
                  <th
                    key={product.id}
                    scope="col"
                    className="border-b border-line p-3 align-bottom"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Link href={`/urun/${product.slug}`} className="group min-w-0">
                        <span className="grid h-20 w-full place-items-center">
                          <img
                            src={product.image}
                            alt=""
                            width={80}
                            height={80}
                            loading="lazy"
                            className="h-20 w-auto object-contain"
                          />
                        </span>
                        <span className="mt-2 block text-[11px] font-bold text-text-secondary">
                          {product.brand}
                        </span>
                        <span className="line-clamp-2 text-[13px] leading-[1.35] text-text-primary group-hover:text-brand-text">
                          {product.name}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove('compare', product.id)}
                        aria-label={`${product.name} ürününü karşılaştırmadan çıkar`}
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-surface-page hover:text-danger-ink"
                      >
                        <X size={15} strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {baseRows.map((row) => (
                <tr key={row.label} className="border-b border-line">
                  <th
                    scope="row"
                    className="p-3 align-top text-[13px] font-medium text-text-secondary"
                  >
                    {row.label}
                  </th>
                  {products.map((product) => (
                    <td
                      key={product.id}
                      className="p-3 align-top font-mono text-[13px] tabular-nums text-text-primary"
                    >
                      {row.value(product)}
                    </td>
                  ))}
                </tr>
              ))}

              {specLabels.length > 0 && (
                <tr>
                  <th
                    colSpan={products.length + 1}
                    scope="colgroup"
                    className="border-b border-line px-3 pb-2 pt-5 text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary"
                  >
                    Öne çıkan özellikler
                  </th>
                </tr>
              )}
              {specLabels.map((label) => (
                <tr key={label} className="border-b border-line">
                  <th
                    scope="row"
                    className="p-3 align-top text-[13px] font-medium text-text-secondary"
                  >
                    {label}
                  </th>
                  {products.map((product) => (
                    <td
                      key={product.id}
                      className="p-3 align-top font-mono text-[13px] tabular-nums text-text-primary"
                    >
                      {specValue(product, label)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
