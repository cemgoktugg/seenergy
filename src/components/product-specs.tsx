/**
 * Technical specifications — one card beside the description, the sheet of a
 * datasheet: aligned label and value columns on hairlines.
 *
 *   - Still a real <table> per group, labelled by its heading, so the
 *     row/column relationship survives for screen readers (ECDOS 10 §47).
 *   - The first group (the catalogue facts plus "Genel") always shows; a long
 *     sheet folds the rest behind one row, so the card stands level with the
 *     description instead of running 1000px past it.
 *   - The rows a buyer decides on are set a step bolder than the rest.
 *   - Commercial facts stay out of the table: price, stock, delivery and
 *     payment are stated once, in the offer above.
 *
 * Whose values: the product's own, when the admin has written them (product
 * form → "Teknik özellikler", stored in metadata.specs). Otherwise the
 * category's template — and then the page SAYS so, because a template row
 * can contradict the product (a 27" all-in-one listed a 23,8" panel).
 *
 * A server component: nothing here holds state.
 */

import Link from 'next/link';
import { ChevronRight, CircleCheck, Headphones, Info, Settings } from 'lucide-react';

import { SpecFold } from '@/components/spec-fold';
import { brandSlug, categoryMeta, type Product } from '@/data/catalog';
import { categorySpec, type CompatibilityItem, type SpecGroup } from '@/data/specs';

type Row = {
  label: string;
  value: string;
  note?: string;
  /** Makes the value a link — the product's own brand and category. */
  href?: string;
  /** An identifier rather than a quantity: set in monospace. */
  mono?: boolean;
};

type Group = { title: string; rows: Row[] };

const lower = (text: string) => text.trim().toLocaleLowerCase('tr');

/** A sheet longer than this folds everything after its first group. */
const FOLD_OVER = 10;

/** The rows that decide a purchase, set a step bolder. */
const KEY_ROW = /^çözünürlük|^lens|gece|kanal sayısı/i;

/**
 * The catalogue facts first, then the spec groups — the product's own when it
 * has any, the category's otherwise. A "Genel" group, wherever it sits, is
 * merged into ours rather than shown as a second "Genel", and a row repeating
 * one of our facts (an admin typing "Marka" by hand) is dropped.
 */
function groupsOf(product: Product, source: SpecGroup[]): Group[] {
  const category = categoryMeta(product.category);
  const facts: Row[] = [
    { label: 'Marka', value: product.brand, href: `/marka/${brandSlug(product.brand)}` },
    { label: 'Ürün kodu', value: product.sku, mono: true },
    { label: 'Kategori', value: category.label, href: category.href },
  ];
  const known = new Set(facts.map((fact) => lower(fact.label)));
  const general = source.find((group) => lower(group.title) === 'genel');
  return [
    { title: 'Genel', rows: [...facts, ...(general?.rows ?? []).filter((row) => !known.has(lower(row.label)))] },
    ...source.filter((group) => group !== general),
  ];
}

function SpecTable({ group, index, headed }: { group: Group; index: number; headed: boolean }) {
  const id = `spec-group-${index}`;
  return (
    <section aria-labelledby={id}>
      <h3
        id={id}
        className={
          headed
            ? 'border-t border-line bg-surface-page px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-text-secondary dt:px-5'
            : 'sr-only'
        }
      >
        {group.title}
      </h3>
      <table aria-labelledby={id} className="w-full table-fixed border-collapse text-left">
        <tbody>
          {group.rows.map((row) => (
            <tr key={row.label} className="border-t border-line">
              <th
                scope="row"
                className="w-[42%] break-words px-4 py-2.5 align-top text-[13px] font-medium leading-snug text-text-secondary dt:pl-5"
              >
                {row.label}
              </th>
              <td
                className={`break-words border-l border-line px-4 py-2.5 align-top text-[14px] leading-snug tabular-nums text-text-primary dt:pr-5 ${
                  KEY_ROW.test(row.label) ? 'font-bold' : 'font-medium'
                }`}
              >
                {row.href ? (
                  <Link
                    href={row.href}
                    className="inline-flex items-center gap-0.5 underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-text-primary"
                  >
                    {row.value}
                    <ChevronRight size={13} strokeWidth={1.75} aria-hidden className="text-text-secondary" />
                  </Link>
                ) : row.mono ? (
                  <span className="font-mono text-[13px] uppercase tracking-[0.04em]">{row.value}</span>
                ) : (
                  row.value
                )}
                {row.note && (
                  <span className="mt-1 block text-[12px] font-normal leading-relaxed text-text-secondary">
                    {row.note}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

/**
 * Compatibility stays its own block rather than a row buried in the table
 * (docs/COMMERCE_RULES §9): "will this fit what I already have" is the
 * question that blocks the purchase.
 */
function Compatibility({ items }: { items: CompatibilityItem[] }) {
  return (
    <section aria-labelledby="spec-compatibility">
      <h3
        id="spec-compatibility"
        className="border-t border-line bg-surface-page px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-text-secondary dt:px-5"
      >
        Uyumluluk
      </h3>
      <dl>
        {items.map((item) => (
          <div key={item.label} className="border-t border-line px-4 py-3 dt:px-5">
            <dt className="flex items-start gap-2 text-[13px] font-semibold leading-snug text-text-primary">
              <CircleCheck size={15} strokeWidth={1.75} aria-hidden className="mt-px shrink-0 text-text-secondary" />
              {item.label}
            </dt>
            {/* Keyed by position as well as value: two entries that normalise
                to the same string must not collide as React keys. */}
            <dd className="mt-1.5 flex flex-wrap gap-1.5 pl-[23px]">
              {item.values.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-(--card-radius) border border-line px-2 py-1 text-[12px] font-medium leading-tight text-text-primary"
                >
                  {value}
                </span>
              ))}
            </dd>
            {item.note && (
              <dd className="mt-1.5 pl-[23px] text-[12px] leading-relaxed text-text-secondary">{item.note}</dd>
            )}
          </div>
        ))}
      </dl>
    </section>
  );
}

export function ProductSpecs({ product, specs }: { product: Product; specs: SpecGroup[] }) {
  const own = specs.length > 0;
  const template = categorySpec(product.category)?.groups ?? [];
  const groups = groupsOf(product, own ? specs : template);
  /* The "typical values" note belongs to a template; a category without one
     shows only the catalogue facts, which are this product's own. */
  const typical = !own && template.length > 0;
  /* The template's compatibility list is the template's too: on a product
     with its own sheet it would put "ONVIF Profile S" under an AHD camera. */
  const compatibility = own ? [] : (categorySpec(product.category)?.compatibility ?? []);
  const rowCount = groups.reduce((total, group) => total + group.rows.length, 0);
  const headed = groups.length > 1 || compatibility.length > 0;

  const rest = (
    <>
      {groups.slice(1).map((group, index) => (
        <SpecTable key={group.title} group={group} index={index + 1} headed={headed} />
      ))}
      {compatibility.length > 0 && <Compatibility items={compatibility} />}
    </>
  );

  return (
    <section
      id="teknik-ozellikler"
      aria-labelledby="teknik-ozellikler-baslik"
      className="min-w-0 overflow-hidden rounded-(--card-radius) border border-line bg-surface-card"
    >
      <h2
        id="teknik-ozellikler-baslik"
        className="flex items-center gap-2.5 px-4 py-3.5 text-[20px] font-extrabold tracking-tight text-text-primary dt:px-5"
      >
        <Settings size={20} strokeWidth={1.75} aria-hidden className="shrink-0 text-signal" />
        Teknik Özellikler
      </h2>

      {typical && (
        <p className="flex items-start gap-2 border-t border-line px-4 py-2.5 text-[13px] leading-relaxed text-text-secondary dt:px-5">
          <Info size={15} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-text-primary" />
          <span>
            Bu tablo, <span className="font-semibold text-text-primary">{categoryMeta(product.category).label}</span>{' '}
            kategorisindeki ürünler için tipik değerleri gösterir. Bu ürüne ait kesin değerler için ürün kodunu
            belirterek bize ulaşın.
          </span>
        </p>
      )}

      <SpecTable group={groups[0]} index={0} headed={headed} />
      {rowCount > FOLD_OVER ? <SpecFold total={rowCount}>{rest}</SpecFold> : rest}

      <div className="flex items-start gap-2.5 border-t border-line px-4 py-3 text-[13px] leading-relaxed text-text-secondary dt:px-5">
        <Headphones size={17} strokeWidth={1.75} aria-hidden className="mt-0.5 shrink-0 text-text-primary" />
        <p>
          Uyumluluk, montaj veya alternatifler için ürün kodunu belirterek{' '}
          <Link
            href={`/iletisim?konu=teknik&urun=${encodeURIComponent(product.sku)}`}
            className="font-semibold text-text-primary underline decoration-line-strong underline-offset-[3px] hover:decoration-text-primary"
          >
            teknik destek ekibimize ulaşın
          </Link>
          {' · '}
          <Link
            href="/kurumsal"
            className="font-semibold text-text-primary underline decoration-line-strong underline-offset-[3px] hover:decoration-text-primary"
          >
            Kurumsal teklif
          </Link>
        </p>
      </div>
      <p className="border-t border-line px-4 py-2.5 text-[12px] leading-relaxed text-text-secondary dt:px-5">
        Teknik özellikler üretici tarafından önceden haber verilmeksizin değiştirilebilir.
      </p>
    </section>
  );
}
