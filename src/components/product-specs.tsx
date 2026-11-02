/**
 * Technical specifications, the content of their tab: every row the
 * product has, grouped as its sheet groups them, labels on the left and values
 * on the right, on white and very light grey rows with hairlines between.
 *
 *   - Still a real <table> per group, labelled by its heading, so the
 *     row/column relationship survives for screen readers (ECDOS 10 §47).
 *   - From `lg` the groups flow in two balanced columns; below it a long sheet
 *     folds after its first group (see SpecFold). Nothing is ever dropped.
 *   - The rows a buyer decides on are set a step bolder than the rest.
 *   - Long values wrap inside their cell: `table-fixed` and `break-words` keep a
 *     phone from scrolling sideways.
 *   - Commercial facts stay out of the table: price, stock, delivery and
 *     payment are stated once, in the buy column.
 *
 * Whose values: the product's own, when the admin has written them (product
 * form → "Teknik özellikler", stored in metadata.specs). Otherwise the
 * category's template — and then the page SAYS so, because a template row
 * can contradict the product (a 27" all-in-one listed a 23,8" panel).
 *
 * A server component: nothing here holds state.
 */

import Link from 'next/link';
import { ChevronRight, CircleCheck, Info } from 'lucide-react';

import { SpecFold } from '@/components/spec-fold';
import { brandSlug, categoryMeta, type Product } from '@/data/catalog';
import { categorySpec, type CompatibilityItem, type SpecGroup } from '@/data/specs';

type Row = {
  label: string;
  value: string;
  note?: string;
  /** Makes the value a link — the product's own brand and category. */
  href?: string;
};

type Group = { title: string; rows: Row[] };

const lower = (text: string) => text.trim().toLocaleLowerCase('tr');

/** A sheet longer than this folds everything after its first group on a phone. */
const FOLD_OVER = 10;

/** The rows that decide a purchase, set a step bolder. */
const KEY_ROW = /^çözünürlük|^lens|^gece|kanal sayısı/i;

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
    { label: 'Ürün kodu', value: product.sku },
    { label: 'Kategori', value: category.label, href: category.href },
  ];
  const known = new Set(facts.map((fact) => lower(fact.label)));
  const general = source.find((group) => lower(group.title) === 'genel');
  return [
    { title: 'Genel', rows: [...facts, ...(general?.rows ?? []).filter((row) => !known.has(lower(row.label)))] },
    ...source.filter((group) => group !== general),
  ];
}

/** A group's title with its small red mark. */
function GroupTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="flex items-center gap-2 pb-2 text-[16px] font-bold text-text-primary">
      <span aria-hidden className="h-3.5 w-[3px] shrink-0 bg-signal" />
      {children}
    </h3>
  );
}

function SpecTable({ group, index }: { group: Group; index: number }) {
  const id = `spec-group-${index}`;
  return (
    <section aria-labelledby={id} className="mb-6 break-inside-avoid">
      <GroupTitle id={id}>{group.title}</GroupTitle>
      <table aria-labelledby={id} className="w-full table-fixed border-collapse border-y border-line text-left">
        <tbody>
          {group.rows.map((row) => (
            <tr key={row.label} className="border-t border-line first:border-t-0 even:bg-surface-page">
              <th
                scope="row"
                className="w-[44%] break-words py-2.5 pl-3 pr-3 align-top text-[14px] font-medium leading-snug text-text-secondary"
              >
                {row.label}
              </th>
              <td
                className={`break-words py-2.5 pl-3 pr-3 align-top text-[14px] leading-snug tabular-nums text-text-primary ${
                  KEY_ROW.test(row.label) ? 'font-bold' : 'font-medium'
                }`}
              >
                {row.href ? (
                  <Link
                    href={row.href}
                    className="relative inline-flex items-center gap-0.5 underline decoration-line-strong underline-offset-[3px] transition-colors duration-(--duration-fast) before:absolute before:inset-x-0 before:-inset-y-3 before:content-[''] hover:decoration-text-primary"
                  >
                    {row.value}
                    <ChevronRight size={14} strokeWidth={1.5} aria-hidden className="text-text-secondary" />
                  </Link>
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
 * question that blocks the purchase. Only from a category template, which the
 * section's note marks as typical values.
 */
function Compatibility({ items }: { items: CompatibilityItem[] }) {
  return (
    <section aria-labelledby="spec-compatibility" className="mb-6 break-inside-avoid">
      <GroupTitle id="spec-compatibility">Uyumluluk</GroupTitle>
      <dl className="border-y border-line">
        {items.map((item) => (
          <div key={item.label} className="border-t border-line px-3 py-2.5 first:border-t-0">
            <dt className="flex items-start gap-2 text-[14px] font-semibold leading-snug text-text-primary">
              <CircleCheck size={16} strokeWidth={1.5} aria-hidden className="mt-px shrink-0 text-text-secondary" />
              {item.label}
            </dt>
            {/* Keyed by position as well as value: two entries that normalise
                to the same string must not collide as React keys. */}
            <dd className="mt-1.5 flex flex-wrap gap-1.5 pl-6">
              {item.values.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-(--card-radius) border border-line px-2 py-1 text-[12px] font-medium leading-tight text-text-primary"
                >
                  {value}
                </span>
              ))}
            </dd>
            {item.note && <dd className="mt-1.5 pl-6 text-[12px] leading-relaxed text-text-secondary">{item.note}</dd>}
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

  const rest = (
    <>
      {groups.slice(1).map((group, index) => (
        <SpecTable key={group.title} group={group} index={index + 1} />
      ))}
      {compatibility.length > 0 && <Compatibility items={compatibility} />}
    </>
  );

  return (
    <>
      <h2 className="sr-only">Teknik Özellikler</h2>

      {typical && (
        <p className="mb-4 flex max-w-[80ch] items-start gap-2 text-[14px] leading-relaxed text-text-secondary">
          <Info size={16} strokeWidth={1.5} aria-hidden className="mt-0.5 shrink-0 text-text-primary" />
          <span>
            Bu tablo, <span className="font-semibold text-text-primary">{categoryMeta(product.category).label}</span>{' '}
            kategorisindeki ürünler için tipik değerleri gösterir. Bu ürüne ait kesin değerler için ürün kodunu
            belirterek bize ulaşın.
          </span>
        </p>
      )}

      <div className="lg:columns-2 lg:gap-8">
        <SpecTable group={groups[0]} index={0} />
        {rowCount > FOLD_OVER ? <SpecFold total={rowCount}>{rest}</SpecFold> : rest}
      </div>

      <p className="mt-3 max-w-[80ch] text-[12px] leading-relaxed text-text-secondary">
        Teknik özellikler üretici tarafından önceden haber verilmeksizin değiştirilebilir.
      </p>
    </>
  );
}
