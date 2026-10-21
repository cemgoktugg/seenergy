'use client';

/* eslint-disable @next/next/no-img-element */
/**
 * Compare — `/karsilastir`.
 *
 * Reworked after the client's VoltEdge build (2026-10-21): products are added
 * from a scale button on every card and gathered in a floating compare bar;
 * this page puts them side by side.
 *
 * A real table, not a grid of cards: the whole point is reading one attribute
 * across several products, which means the row/column relationship has to
 * survive for a screen reader too (ECDOS 10 §47, the same rule the product
 * page's spec table follows).
 *
 *   - The header row is a buy card per product — picture, price and the cart
 *     button — so a decision made here is one click from the cart.
 *   - Rows: what selling decides (discount, stock, shipping, payment), what
 *     identifies the product, then every group of the products' OWN technical
 *     sheets (from /api/compare), unioned by group and label. A product with
 *     no sheet answers with the headline specs read from its name.
 *   - Rows whose values differ are set strong, identical rows quiet, and
 *     "Sadece farkları göster" hides the identical ones.
 *   - No rating or review rows: docs/PRODUCT_MODEL rules them out everywhere.
 *
 * Capped at four by the store: past that a comparison stops being readable on
 * any screen this storefront targets.
 */

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, Check, MessageSquareQuote, Minus, Plus, Scale, ShoppingCart, X } from 'lucide-react';

import { useCart } from '@/components/cart-provider';
import { COMPARE_LIMIT, useStore } from '@/components/cart-store';
import { useCatalog } from '@/components/catalog-provider';
import { useCompareItems } from '@/components/compare-data';
import { categoryMeta, discountPercent, formatPrice, PRICE_ON_REQUEST, type Product } from '@/data/catalog';
import { INSTALMENTS_AVAILABLE } from '@/data/checkout';
import { keySpecsOf, type SpecGroup } from '@/data/specs';

type Row = { label: string; raw: string[]; cells: ReactNode[] };
type Group = { title: string; rows: Row[] };

const DASH = '—';
const yes = <Check size={18} strokeWidth={2.5} className="text-success-ink" aria-label="Var" />;
const no = <Minus size={16} strokeWidth={2} className="text-text-secondary/60" aria-label="Yok" />;

/** A row whose present values are not all the same. */
const differs = (row: Row) => new Set(row.raw.map((value) => value.trim().toLocaleLowerCase('tr'))).size > 1;

const IDENTITY = new Set(['marka', 'ürün kodu', 'kategori']);

export default function ComparePage() {
  const { state, ready, remove, clear } = useStore();
  const { byId } = useCatalog();
  const cart = useCart();
  const [onlyDiff, setOnlyDiff] = useState(false);

  const products = state.compare
    .map((id) => byId(id))
    .filter((product): product is Product => Boolean(product));
  const { items } = useCompareItems(products.map((product) => product.id));

  if (ready && products.length === 0) {
    return (
      <div className="container-main py-14 dt:py-20">
        <div className="mx-auto max-w-xl text-center">
          <span
            aria-hidden
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e2"
          >
            <Scale size={28} strokeWidth={1.8} />
          </span>
          <h1 className="mt-5 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[30px]">
            Karşılaştırma listeniz boş
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-text-secondary">
            Ürün kartlarındaki terazi simgesine dokunarak en çok {COMPARE_LIMIT} ürünü yan yana
            karşılaştırabilirsiniz. Seçtikleriniz ekranın altındaki karşılaştırma çubuğunda toplanır.
          </p>
          <Link
            href="/kategori"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            <ArrowLeft size={17} strokeWidth={2} aria-hidden />
            Ürünleri keşfet
          </Link>
        </div>
      </div>
    );
  }

  /* --- rows --------------------------------------------------------- */

  const text = (values: string[]): Row['cells'] =>
    values.map((value, index) => (
      <span key={index} className={value === DASH ? 'text-text-secondary/60' : undefined}>
        {value}
      </span>
    ));

  const row = (label: string, raw: string[], cells?: ReactNode[]): Row => ({ label, raw, cells: cells ?? text(raw) });

  const selling: Group = {
    title: 'Satış bilgileri',
    rows: [
      row(
        'İndirim',
        products.map((p) => {
          const percent = discountPercent(p);
          return percent && percent > 0 ? `%${percent}` : DASH;
        }),
      ),
      row(
        'Stok',
        products.map((p) => (p.price == null ? 'Teklifte bildirilir' : p.stock === 0 ? 'Tükendi' : 'Stokta')),
      ),
      row(
        'Ücretsiz kargo',
        products.map((p) => (p.freeShipping ? 'var' : 'yok')),
        products.map((p) => <span key={p.id}>{p.freeShipping ? yes : no}</span>),
      ),
      row(
        'Ödeme',
        products.map((p) =>
          p.price == null ? 'Teklif ile' : INSTALMENTS_AVAILABLE && p.instalment ? 'Peşin fiyatına 3 taksit' : 'Havale / EFT, kapıda',
        ),
      ),
    ],
  };

  const identity: Group = {
    title: 'Ürün',
    rows: [
      row('Marka', products.map((p) => p.brand)),
      row(
        'Ürün kodu',
        products.map((p) => p.sku),
        products.map((p) => (
          <span key={p.id} className="font-mono text-[12.5px]">
            {p.sku}
          </span>
        )),
      ),
      row('Kategori', products.map((p) => categoryMeta(p.category).label)),
    ],
  };

  /* Each product's sheet: its own when it has one, else the headline specs
     read from its name, filed under "Genel". */
  const sheets: SpecGroup[][] = products.map((p) => {
    const own = items[p.id]?.specs ?? [];
    return own.length > 0 ? own : [{ title: 'Genel', rows: keySpecsOf(p, 6) }];
  });
  const technical: Group[] = [];
  for (const sheet of sheets) {
    for (const group of sheet) {
      let target = technical.find((g) => g.title === group.title);
      if (!target) technical.push((target = { title: group.title, rows: [] }));
      for (const specRow of group.rows) {
        if (IDENTITY.has(specRow.label.toLocaleLowerCase('tr'))) continue;
        if (target.rows.some((r) => r.label === specRow.label)) continue;
        const raw = sheets.map(
          (s) => s.find((g) => g.title === group.title)?.rows.find((r) => r.label === specRow.label)?.value ?? DASH,
        );
        target.rows.push(row(specRow.label, raw));
      }
    }
  }

  const groups = [selling, identity, ...technical.filter((g) => g.rows.length > 0)];
  const visible = groups
    .map((group) => ({ ...group, rows: onlyDiff && products.length > 1 ? group.rows.filter(differs) : group.rows }))
    .filter((group) => group.rows.length > 0);
  const diffCount = groups.reduce((total, group) => total + group.rows.filter(differs).length, 0);
  const freeSlots = Math.max(0, COMPARE_LIMIT - products.length);
  const columns = products.length + (freeSlots > 0 ? 1 : 0);
  const addMoreHref = products[0] ? categoryMeta(products[0].category).href : '/kategori';

  return (
    <>
      <section className="container-main pt-4 dt:pt-6">
        <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
          <span aria-hidden className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4" />
          Karşılaştırma
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
              Ürün Karşılaştırma
            </h1>
            <p className="mt-1 text-[14px] text-text-secondary">
              <span className="font-extrabold tabular-nums text-text-primary">{products.length}</span> / {COMPARE_LIMIT}{' '}
              ürün · <span className="font-semibold text-text-primary tabular-nums">{diffCount}</span> özellikte fark var
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <label className="inline-flex cursor-pointer select-none items-center gap-2.5 text-[13.5px] font-semibold text-text-primary">
              <input
                type="checkbox"
                checked={onlyDiff}
                onChange={(event) => setOnlyDiff(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="relative h-6 w-11 rounded-full bg-line-strong transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-e1 after:transition-transform peer-checked:after:translate-x-5"
              />
              Sadece farkları göster
            </label>
            <button
              type="button"
              onClick={() => clear('compare')}
              className="text-[13px] font-semibold text-text-secondary underline underline-offset-2 transition-colors hover:text-danger-ink"
            >
              Listeyi temizle
            </button>
          </div>
        </div>
      </section>

      <section className="container-main pb-12 pt-4 dt:pt-6" aria-label="Karşılaştırma tablosu">
        {/* The table scrolls inside its own box rather than pushing the page
            sideways; the label column stays pinned while it does. */}
        <div className="overflow-x-auto rounded-(--panel-radius) border border-line bg-surface-card shadow-e1">
          <table className="w-full min-w-[720px] border-collapse text-left" style={{ tableLayout: 'fixed' }}>
            <caption className="sr-only">Seçilen ürünlerin karşılaştırması</caption>
            <colgroup>
              <col className="w-[132px] dt:w-[200px]" />
              {Array.from({ length: columns }).map((_, index) => (
                <col key={index} />
              ))}
            </colgroup>
            <thead>
              <tr>
                <th scope="col" className="sticky left-0 z-10 border-b border-line bg-surface-card p-3 align-bottom">
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">Özellik</span>
                </th>
                {products.map((product) => {
                  const inCart = cart.quantityOf(product.variantId) > 0;
                  const discount = discountPercent(product);
                  return (
                    <th key={product.id} scope="col" className="border-b border-line p-2.5 align-top font-normal">
                      <div className="relative flex h-full flex-col rounded-(--card-radius) border border-line bg-surface-card p-3">
                        <button
                          type="button"
                          onClick={() => remove('compare', product.id)}
                          aria-label={`${product.name} ürününü karşılaştırmadan çıkar`}
                          className="absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-surface-page text-text-secondary transition-colors hover:bg-danger/10 hover:text-danger-ink"
                        >
                          <X size={15} strokeWidth={2} aria-hidden />
                        </button>
                        <Link href={`/urun/${product.slug}`} className="group block">
                          <span className="flex h-28 items-center justify-center overflow-hidden rounded-(--card-radius) bg-white p-2 dt:h-36">
                            <img src={product.image} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                          </span>
                          <span className="mt-3 block text-[11px] font-bold text-text-secondary">{product.brand}</span>
                          <span className="mt-0.5 line-clamp-2 min-h-[36px] text-[13px] font-semibold leading-[1.35] text-text-primary group-hover:underline">
                            {product.name}
                          </span>
                        </Link>
                        <div className="mt-2 min-h-[44px]">
                          {product.price == null ? (
                            <p className="text-[13px] font-bold text-text-primary">{PRICE_ON_REQUEST}</p>
                          ) : (
                            <>
                              {product.compareAtPrice && discount ? (
                                <p className="text-[12px] tabular-nums text-text-secondary">
                                  <span className="line-through">{formatPrice(product.compareAtPrice)}</span>{' '}
                                  <span className="font-bold text-danger-ink">%{discount}</span>
                                </p>
                              ) : null}
                              <p className="text-[19px] font-extrabold tabular-nums text-text-primary">
                                {formatPrice(product.price)}
                              </p>
                            </>
                          )}
                        </div>
                        <div className="mt-auto pt-2">
                          {product.price == null ? (
                            <Link
                              href="/iletisim"
                              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-line-strong text-[13px] font-semibold text-text-primary transition-colors hover:border-text-primary"
                            >
                              <MessageSquareQuote size={15} strokeWidth={2} aria-hidden />
                              Teklif İste
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled={product.stock === 0 || cart.busy}
                              onClick={() => void cart.add(product.variantId, 1, product.name)}
                              className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-brand text-[13px] font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-text-secondary"
                            >
                              <ShoppingCart size={15} strokeWidth={2} aria-hidden />
                              {product.stock === 0 ? 'Tükendi' : inCart ? 'Sepette' : 'Sepete Ekle'}
                            </button>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
                {freeSlots > 0 && (
                  <th scope="col" className="border-b border-line p-2.5 align-top font-normal">
                    <Link
                      href={addMoreHref}
                      className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 rounded-(--card-radius) border-2 border-dashed border-line-strong p-4 text-center text-text-secondary transition-colors hover:border-text-primary hover:text-text-primary"
                    >
                      <span className="grid h-11 w-11 place-items-center rounded-full bg-surface-page">
                        <Plus size={20} strokeWidth={2} aria-hidden />
                      </span>
                      <span className="text-[13px] font-semibold">Ürün ekle</span>
                      <span className="text-[12px]">
                        {freeSlots} yer boş · kartlardaki terazi simgesiyle ekleyin
                      </span>
                    </Link>
                  </th>
                )}
              </tr>
            </thead>

            <tbody>
              {visible.map((group) => (
                <GroupRows key={group.title} group={group} columns={columns} products={products.length} />
              ))}
              {onlyDiff && visible.length === 0 && (
                <tr>
                  <td colSpan={columns + 1} className="p-8 text-center text-[14px] text-text-secondary">
                    Seçilen ürünlerin karşılaştırılan özellikleri aynı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

function GroupRows({ group, columns, products }: { group: Group; columns: number; products: number }) {
  return (
    <>
      <tr>
        <th
          colSpan={columns + 1}
          scope="colgroup"
          className="border-b border-line bg-surface-page px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[0.12em] text-text-primary"
        >
          {group.title}
        </th>
      </tr>
      {group.rows.map((row) => {
        const different = products > 1 && differs(row);
        return (
          <tr key={row.label} className="border-b border-line last:border-b-0">
            <th
              scope="row"
              className="sticky left-0 z-10 bg-surface-card p-3 align-top text-[12.5px] font-medium text-text-secondary"
            >
              <span className="flex items-start gap-1.5">
                {different && (
                  <span aria-hidden title="Değerler farklı" className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-text-primary" />
                )}
                {row.label}
              </span>
            </th>
            {row.cells.map((cell, index) => (
              <td
                key={index}
                className={`p-3 align-top text-[13px] leading-snug tabular-nums ${
                  different ? 'font-semibold text-text-primary' : 'text-text-secondary'
                }`}
              >
                {cell}
              </td>
            ))}
            {columns > products && <td aria-hidden />}
          </tr>
        );
      })}
    </>
  );
}
