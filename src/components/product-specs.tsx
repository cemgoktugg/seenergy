/**
 * Technical specifications — the product page's second half.
 *
 * What it replaced: one 1,300px column of label/value rows set in monospace,
 * a "Ticari" group repeating the price and stock the buy box had just shown,
 * and compatibility chips in monospace as well. It read as a data dump.
 *
 * Now:
 *   - every spec group is its own card, headed by an icon and a row count.
 *     From `dt` the cards flow in two balanced CSS columns, so one long group
 *     and two short ones pack instead of leaving a hole under the short side
 *   - values are set in the text face at semibold with tabular figures, on
 *     zebra rows; monospace is kept for identifiers (the SKU) only
 *   - the commercial rows left the table: payment, shipping and stock are
 *     stated once, in the "Sipariş bilgileri" card beside it
 *   - compatibility is a card in the same flow as the groups; order
 *     information and technical support share a short rail that stays in
 *     view, below the condensed header, while the groups scroll past
 *
 * Still a real <table> per group, labelled by its heading, so the row/column
 * relationship survives for screen readers (ECDOS 10 §47).
 *
 * A server component: nothing here holds state.
 */

import Link from 'next/link';
import {
  BatteryCharging,
  Binary,
  Cable,
  ChevronRight,
  CircleCheck,
  CircuitBoard,
  ClipboardList,
  Gauge,
  HardDrive,
  Headphones,
  Lightbulb,
  Monitor,
  PackageCheck,
  Plug,
  RadioTower,
  Ruler,
  SatelliteDish,
  Truck,
  Volume2,
  Wallet,
  Wifi,
  Zap,
  type LucideIcon,
} from 'lucide-react';

import { SectionHeading } from '@/components/section-heading';
import { brandSlug, categoryMeta, formatPrice, FREE_SHIPPING_FROM, type Product } from '@/data/catalog';
import { INSTALMENTS_AVAILABLE } from '@/data/checkout';
import { categorySpec, type CompatibilityItem } from '@/data/specs';

/** Every group title the catalogue's categories use, and its mark. */
const GROUP_ICONS: Record<string, LucideIcon> = {
  Genel: ClipboardList,
  Fiziksel: Ruler,
  'Sinyal ve alım': SatelliteDish,
  İletim: RadioTower,
  Ölçüm: Gauge,
  Ses: Volume2,
  'Kod ve öğrenme': Binary,
  Kayıt: HardDrive,
  Güç: Zap,
  Enerji: BatteryCharging,
  Ekran: Monitor,
  Bağlantı: Cable,
  'Ağ ve kablosuz': Wifi,
  Aydınlatma: Lightbulb,
};

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

/**
 * The product's own facts first, then the category's groups. The category's
 * "Genel" group is merged into ours rather than added as a second "Genel".
 */
function groupsOf(product: Product): Group[] {
  const category = categoryMeta(product.category);
  const [first, ...rest] = categorySpec(product.category)?.groups ?? [];
  return [
    {
      title: 'Genel',
      rows: [
        { label: 'Marka', value: product.brand, href: `/marka/${brandSlug(product.brand)}` },
        { label: 'Ürün kodu', value: product.sku, mono: true },
        { label: 'Kategori', value: category.label, href: category.href },
        ...(first?.title === 'Genel' ? first.rows : []),
      ],
    },
    ...(first && first.title !== 'Genel' ? [first] : []),
    ...rest,
  ];
}

/** The small graphite tile every card in this section opens with. */
function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span
      aria-hidden
      className="grid h-9 w-9 shrink-0 place-items-center rounded-(--card-radius) bg-linear-to-br from-grad-2 to-grad-4 text-white shadow-e1"
    >
      <Icon size={17} strokeWidth={2} />
    </span>
  );
}

function SpecCard({ group, index }: { group: Group; index: number }) {
  const id = `spec-group-${index}`;
  return (
    <section
      aria-labelledby={id}
      className="mb-(--space-grid-gap) break-inside-avoid overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 dt:px-5">
        <IconTile icon={GROUP_ICONS[group.title] ?? CircuitBoard} />
        <h3 id={id} className="min-w-0 flex-1 truncate text-[15px] font-extrabold tracking-tight text-text-primary dt:text-[16px]">
          {group.title}
        </h3>
        <span className="shrink-0 rounded-full bg-surface-page px-2.5 py-1 text-[11px] font-semibold tabular-nums text-text-secondary">
          {group.rows.length} özellik
        </span>
      </div>

      <table aria-labelledby={id} className="w-full border-collapse text-left">
        <tbody>
          {group.rows.map((row) => (
            <tr key={row.label} className="even:bg-surface-page">
              <th
                scope="row"
                className="w-[42%] px-4 py-3 align-top text-[13px] font-medium leading-snug text-text-secondary dt:pl-5"
              >
                {row.label}
              </th>
              <td className="px-4 py-3 align-top text-[13.5px] font-semibold leading-snug tabular-nums text-text-primary dt:pr-5">
                {row.href ? (
                  <Link
                    href={row.href}
                    className="inline-flex items-center gap-0.5 underline decoration-line-strong underline-offset-[3px] transition-colors hover:decoration-text-primary"
                  >
                    {row.value}
                    <ChevronRight size={13} strokeWidth={2.25} aria-hidden className="text-text-secondary" />
                  </Link>
                ) : row.mono ? (
                  <span className="rounded-md border border-line bg-surface-card px-1.5 py-0.5 font-mono text-[12px] uppercase tracking-[0.04em]">
                    {row.value}
                  </span>
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
 * Compatibility gets its own card rather than a row buried in the table
 * (docs/COMMERCE_RULES §9): "will this fit what I already have" is the
 * question that blocks the purchase.
 */
function CompatibilityCard({ items }: { items: CompatibilityItem[] }) {
  return (
    <section
      aria-labelledby="spec-compatibility"
      className="mb-(--space-grid-gap) break-inside-avoid overflow-hidden rounded-(--panel-radius) border border-line bg-surface-card shadow-e1"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3.5 dt:px-5">
        <IconTile icon={Plug} />
        <div className="min-w-0">
          <h3 id="spec-compatibility" className="text-[15px] font-extrabold tracking-tight text-text-primary dt:text-[16px]">
            Uyumluluk
          </h3>
          <p className="text-[12px] text-text-secondary">Birlikte çalıştığı sistemler ve bağlantılar</p>
        </div>
      </div>

      <dl className="divide-y divide-line">
        {items.map((item) => (
          <div key={item.label} className="px-4 py-3.5 dt:px-5">
            <dt className="flex items-start gap-2 text-[13px] font-bold leading-snug text-text-primary">
              <CircleCheck size={15} strokeWidth={2.25} aria-hidden className="mt-px shrink-0 text-success" />
              {item.label}
            </dt>
            {/* Keyed by position as well as value: two entries that normalise
                to the same string must not collide as React keys. */}
            <dd className="mt-2 flex flex-wrap gap-1.5 pl-[23px]">
              {item.values.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="rounded-full border border-line bg-surface-page px-2.5 py-1 text-[12px] font-medium leading-tight text-text-primary"
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

/** Payment, shipping and stock, stated once — they used to be table rows. */
function OrderCard({ product }: { product: Product }) {
  const rows = [
    {
      icon: Truck,
      label: 'Kargo',
      value: product.freeShipping
        ? 'Ücretsiz kargo'
        : `${formatPrice(FREE_SHIPPING_FROM)} üzeri ücretsiz`,
    },
    {
      icon: Wallet,
      label: 'Ödeme',
      value: INSTALMENTS_AVAILABLE && product.instalment ? 'Peşin fiyatına 3 taksit' : 'Havale / EFT veya kapıda ödeme',
    },
    {
      icon: PackageCheck,
      label: 'Stok',
      value: product.stock === 0 ? 'Şu anda stokta yok' : `Stokta · ${product.stock} adet`,
    },
  ];

  return (
    <section
      aria-labelledby="spec-order"
      className="rounded-(--panel-radius) border border-line bg-surface-card px-4 py-4 shadow-e1 dt:px-5"
    >
      <h3 id="spec-order" className="text-[11px] font-bold uppercase tracking-[0.14em] text-text-secondary">
        Sipariş bilgileri
      </h3>
      <dl className="mt-3 space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span
              aria-hidden
              className="grid h-8 w-8 shrink-0 place-items-center rounded-(--card-radius) bg-surface-page text-text-primary"
            >
              <Icon size={15} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <dt className="text-[11.5px] text-text-secondary">{label}</dt>
              <dd className="text-[13px] font-semibold text-text-primary">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
}

function SupportCard({ product }: { product: Product }) {
  const category = categoryMeta(product.category);
  return (
    <aside
      aria-label="Teknik destek"
      className="relative overflow-hidden rounded-(--panel-radius) bg-chrome px-5 py-5 text-white shadow-e2"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-14 h-44 w-44 rounded-full bg-grad-1/20 blur-3xl"
      />
      <span aria-hidden className="relative grid h-10 w-10 place-items-center rounded-(--card-radius) bg-white/10 ring-1 ring-white/15">
        <Headphones size={18} strokeWidth={2} />
      </span>
      <p className="relative mt-3 text-[16px] font-extrabold tracking-tight">Teknik destek</p>
      <p className="relative mt-1.5 text-[13px] leading-relaxed text-white/70">
        Uyumluluk, montaj veya alternatifler için ürün kodunu{' '}
        <span className="rounded bg-white/10 px-1 py-px font-mono text-[12px] text-white">{product.sku}</span>{' '}
        belirterek ekibimize ulaşın.
      </p>
      <div className="relative mt-4 flex flex-wrap gap-2">
        <Link
          href="/iletisim"
          className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-[13px] font-bold text-ink-fixed transition-colors duration-(--duration-fast) hover:bg-white/85"
        >
          Bize ulaşın
          <ChevronRight size={14} strokeWidth={2.25} aria-hidden />
        </Link>
        <Link
          href="/kurumsal"
          className="inline-flex items-center rounded-full border border-white/25 px-4 py-2 text-[13px] font-semibold text-white transition-colors duration-(--duration-fast) hover:bg-white/10"
        >
          Kurumsal teklif
        </Link>
      </div>
      <Link
        href={category.href}
        className="relative mt-4 flex items-center justify-between gap-2 border-t border-white/10 pt-3 text-[12px] text-white/70 transition-colors hover:text-white"
      >
        <span className="min-w-0 truncate">
          Kategori: <span className="font-semibold text-white">{category.label}</span>
        </span>
        <ChevronRight size={14} strokeWidth={2.25} aria-hidden className="shrink-0" />
      </Link>
    </aside>
  );
}

export function ProductSpecs({ product }: { product: Product }) {
  const groups = groupsOf(product);
  const compatibility = categorySpec(product.category)?.compatibility ?? [];
  const rowCount = groups.reduce((total, group) => total + group.rows.length, 0);

  return (
    <section className="container-main pt-8 dt:pt-12" aria-labelledby="teknik-ozellikler">
      <SectionHeading eyebrow="Ürün detayları" title="Teknik Özellikler" id="teknik-ozellikler">
        <span className="hidden rounded-full border border-line bg-surface-card px-3 py-1 text-[12px] font-semibold tabular-nums text-text-secondary sm:inline-flex">
          {groups.length} grup · {rowCount} özellik
        </span>
      </SectionHeading>

      <div className="mt-4 grid items-start gap-(--space-grid-gap) dt:mt-5 lg:grid-cols-[minmax(0,1fr)_340px] dt:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          {/* Compatibility flows WITH the groups rather than heading the rail:
              in the rail it made that column ~260px taller than the groups, so
              the rail could never stick. Here it balances the two columns. */}
          <div className="dt:columns-2 dt:gap-(--space-grid-gap)">
            {groups.map((group, index) => (
              <SpecCard key={group.title} group={group} index={index} />
            ))}
            {compatibility.length > 0 && <CompatibilityCard items={compatibility} />}
          </div>
          <p className="max-w-[80ch] text-[12px] leading-relaxed text-text-secondary">
            Teknik özellikler üretici tarafından önceden haber verilmeksizin değiştirilebilir. Siparişten önce
            teyit etmek için ürün kodunu belirterek teknik destek ekibimize ulaşabilirsiniz.
          </p>
        </div>

        <div className="flex flex-col gap-(--space-grid-gap) lg:sticky lg:top-(--sticky-offset)">
          <OrderCard product={product} />
          <SupportCard product={product} />
        </div>
      </div>
    </section>
  );
}
