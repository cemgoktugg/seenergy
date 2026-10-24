/**
 * Listing shell — one implementation behind `/kategori/[slug]` and
 * `/marka/[slug]`, because a category listing and a brand listing differ only
 * in which products they start from.
 *
 * Everything except the mobile drawer is a server component, and every filter
 * is a link. There is no client filter state to get out of sync with the URL,
 * the result is shareable, and the page filters with JavaScript disabled.
 */

import Link from 'next/link';
import { Check, X } from 'lucide-react';

import { EmptyScope } from '@/components/empty-scope';
import { FilterDrawer } from '@/components/filter-drawer';
import { ProductGrid } from '@/components/sections';
import { formatPrice, type Product } from '@/data/catalog';
import { loadCatalog } from '@/lib/medusa/catalog';
import {
  SORTS,
  activeCount,
  applyFilters,
  facetsOf,
  hrefWith,
  parseFilters,
  toggled,
  type SearchParams,
} from '@/lib/catalog-query';

function FilterOption({
  href,
  label,
  count,
  checked,
}: {
  href: string;
  label: string;
  count: number;
  checked: boolean;
}) {
  const disabled = count === 0 && !checked;

  return (
    <li>
      <Link
        href={href}
        aria-disabled={disabled}
        className={`flex items-center gap-2.5 rounded-(--card-radius) px-2 py-1.5 transition-colors duration-(--duration-fast) ${
          disabled
            ? 'pointer-events-none opacity-40'
            : 'hover:bg-surface-page'
        }`}
      >
        <span
          aria-hidden
          className={`grid h-[18px] w-[18px] shrink-0 place-items-center rounded-md border transition-colors ${
            checked ? 'border-brand bg-brand text-white' : 'border-line-strong bg-surface-card'
          }`}
        >
          {checked && <Check size={12} strokeWidth={3} />}
        </span>
        <span className="min-w-0 flex-1 truncate text-[13px] text-text-primary">{label}</span>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-text-secondary">
          {count}
        </span>
      </Link>
    </li>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-text-secondary">
        {title}
      </h3>
      {children}
    </section>
  );
}

function FilterPanel({
  basePath,
  params,
  scope,
  brandFromSlug,
}: {
  basePath: string;
  params: SearchParams;
  scope: Product[];
  brandFromSlug: (slug: string) => string | undefined;
}) {
  const filters = parseFilters(params);
  const facets = facetsOf(scope, filters);

  /**
   * The facet list plus any brand the visitor has actually selected.
   *
   * `facetsOf` builds brands from the scope with every other filter applied,
   * so a selected brand with no products left under the current price/feature
   * filters is absent from it. Without this merge the group rendered an empty
   * list — or, with the count-based guard below, vanished entirely while the
   * visitor was still filtering by it. A selected option must always be on
   * screen, if only so it can be un-selected; count 0 is the honest number and
   * FilterOption keeps a checked option active regardless.
   */
  const brandOptions = [
    ...facets.brands,
    ...filters.brands
      .filter((slug) => !facets.brands.some((brand) => brand.slug === slug))
      .map((slug) => ({ slug, label: brandFromSlug(slug) ?? slug, count: 0 })),
  ];

  return (
    <div>
      {/* Only when there is a choice to make, OR a choice already made.
          On /marka/[slug] the scope is one brand, so this group rendered a
          single checkbox — "Tekniva (4)" — at the head of a 264px filter
          column, on a page that is already only Tekniva. Ticking it narrowed
          nothing.
          The second clause is the correction to that rule: hiding a group the
          visitor is CURRENTLY filtering by is worse than showing a pointless
          one. With `?marka=orbisat&fiyat=0-500&ozellik=taksit` the facet list
          empties, and the count test alone dropped the whole Marka group off
          the rail while its filter was still in force.
          Both clauses are on the DATA, not the route: a category that happens
          to carry one brand is equally pointless to filter by, and a brand page
          would still show the group if the catalogue ever gave it two. */}
      {(brandOptions.length > 1 || filters.brands.length > 0) && (
        <FilterGroup title="Marka">
          <ul className="-mx-2 max-h-[280px] space-y-0.5 overflow-y-auto">
            {brandOptions.map((brand) => (
              <FilterOption
                key={brand.slug}
                label={brand.label}
                count={brand.count}
                checked={filters.brands.includes(brand.slug)}
                href={hrefWith(basePath, params, {
                  marka: toggled(filters.brands, brand.slug),
                })}
              />
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Fiyat">
        <ul className="-mx-2 space-y-0.5">
          {facets.bands.map((band) => (
            <FilterOption
              key={band.key}
              label={band.label}
              count={band.count}
              checked={filters.band === band.key}
              href={hrefWith(basePath, params, {
                fiyat: filters.band === band.key ? undefined : band.key,
              })}
            />
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Durum">
        <ul className="-mx-2 space-y-0.5">
          <FilterOption
            label="Sadece stokta olanlar"
            count={facets.inStock}
            checked={filters.inStock}
            href={hrefWith(basePath, params, { stok: filters.inStock ? undefined : '1' })}
          />
        </ul>
      </FilterGroup>

      <FilterGroup title="Özellikler">
        <ul className="-mx-2 space-y-0.5">
          {facets.features.map((feature) => (
            <FilterOption
              key={feature.key}
              label={feature.label}
              count={feature.count}
              checked={filters.features.includes(feature.key)}
              href={hrefWith(basePath, params, {
                ozellik: toggled(filters.features, feature.key),
              })}
            />
          ))}
        </ul>
      </FilterGroup>
    </div>
  );
}

export async function CatalogShell({
  title,
  eyebrow,
  description,
  basePath,
  clearHref,
  scope,
  params,
  lead,
}: {
  title: string;
  eyebrow: string;
  description?: string;
  /** Under the description — a category page's subcategory links. */
  lead?: React.ReactNode;
  basePath: string;
  /**
   * Where "clear filters" goes, when that is not simply the base path. On a
   * search result it must keep the query — dropping filters should not also
   * drop what the visitor searched for.
   */
  clearHref?: string;
  scope: Product[];
  params: SearchParams;
}) {
  const { brandFromSlug } = await loadCatalog();
  const clearTo = clearHref ?? basePath;
  const filters = parseFilters(params);
  const results = applyFilters(scope, filters);
  const active = activeCount(filters);
  const facets = facetsOf(scope, filters);

  /**
   * Facts about the SCOPE, not about the current filter — the header describes
   * the place you are in, the toolbar's count describes what you have narrowed
   * it to. Keeping that split is why these are computed from `scope` and not
   * from `results` or from `facets` (which are filter-aware by design).
   *
   * Each row earns its place by not being on screen already: the price range
   * appears nowhere else, and the brand count is dropped on a brand page where
   * it is 1 by definition — the same data-driven test the Marka facet uses.
   * Stock reads "Tümü stokta" when it can, because a positive is worth more
   * than "6 / 6".
   */
  // Stock is counted over what can be bought now; price-on-request models
  // report theirs in the quote.
  const sellable = scope.filter((product) => product.price != null);
  const inStockCount = sellable.filter((product) => product.stock > 0).length;
  const brandCount = new Set(scope.map((product) => product.brand)).size;
  // Price-on-request products have no price to put in a range.
  const prices = scope.flatMap((product) => (product.price == null ? [] : [product.price]));
  const scopeStats = scope.length
    ? [
        ...(prices.length
          ? [
              {
                label: 'Fiyat aralığı',
                value:
                  Math.min(...prices) === Math.max(...prices)
                    ? formatPrice(prices[0])
                    : `${formatPrice(Math.min(...prices))} – ${formatPrice(Math.max(...prices))}`,
              },
            ]
          : []),
        ...(brandCount > 1 ? [{ label: 'Marka', value: String(brandCount) }] : []),
        ...(sellable.length
          ? [
              {
                label: 'Stok',
                value:
                  inStockCount === sellable.length
                    ? 'Tümü stokta'
                    : `${inStockCount} / ${sellable.length} stokta`,
              },
            ]
          : [{ label: 'Fiyat', value: 'Teklif ile' }]),
      ]
    : [];

  const chips = [
    /* Resolved against the whole catalogue, NOT against `facets.brands`.
       Facets are filter-aware by design: `facetsOf` builds the brand list from
       the scope with every OTHER filter applied, so a brand whose products are
       all excluded by the price or feature filter drops out of that list
       entirely. The chip lookup then missed and fell back to the raw slug — it
       read "orbisat", lowercase, precisely in the zero-result dead end where
       the chip is the only way back out. `brandFromSlug` is the same resolver
       /marka/[slug] uses, so a chip and a brand page can never disagree.
       Bands and features need no equivalent: facetsOf maps them over the
       constant PRICE_BANDS / FEATURES lists, so their keys never vanish. */
    ...filters.brands.map((slug) => ({
      key: `marka-${slug}`,
      label: brandFromSlug(slug) ?? slug,
      href: hrefWith(basePath, params, { marka: toggled(filters.brands, slug) }),
    })),
    ...(filters.band
      ? [
          {
            key: 'fiyat',
            label: facets.bands.find((band) => band.key === filters.band)?.label ?? 'Fiyat',
            href: hrefWith(basePath, params, { fiyat: undefined }),
          },
        ]
      : []),
    ...(filters.inStock
      ? [
          {
            key: 'stok',
            label: 'Stokta olanlar',
            href: hrefWith(basePath, params, { stok: undefined }),
          },
        ]
      : []),
    ...filters.features.map((key) => ({
      key: `ozellik-${key}`,
      label: facets.features.find((feature) => feature.key === key)?.label ?? key,
      href: hrefWith(basePath, params, { ozellik: toggled(filters.features, key) }),
    })),
  ];

  return (
    <>
      {/* The header is a panel, not loose text on the page ground.
          Every other surface on this site that introduces a block now carries
          the same 3px logo-gradient cap — the product page's media panel, the
          seven brand bands, the paired sliders, the mega panel. The listing
          header was the last place still setting a heading directly on grey,
          which made category, search and brand pages read as older than the
          pages they link to. One change, three routes, since they share this
          shell. */}
      <section className="container-main pt-4 dt:pt-6">
        <div className="overflow-hidden rounded-(--panel-radius) border border-line bg-linear-to-b from-surface-card to-surface-page shadow-e1">
          <span
            aria-hidden
            className="block h-[3px] w-full bg-linear-to-r from-grad-1 via-grad-3 to-grad-4"
          />
          {/* Two columns from 768 up, because one was leaving 620 of the
              panel's 1320px as dead white — the copy only ever fills the left
              half. The right half takes the scope figures rather than
              decoration. The split starts at `md`, not `dt`: at 768 the
              stacked version left the same lopsided gap beside a one-line stat
              row, and the column form costs ~50px less above the fold. */}
          <div className="grid gap-4 px-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 dt:px-6 dt:py-6">
            <div>
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary dt:text-[11px]">
                <span
                  aria-hidden
                  className="h-[3px] w-6 rounded-full bg-linear-to-r from-grad-1 to-grad-4"
                />
                {eyebrow}
              </p>
              <h1 className="mt-2 text-[24px] font-extrabold tracking-tight text-text-primary dt:text-[32px]">
                {title}
              </h1>
              {description && (
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-text-secondary">
                  {description}
                </p>
              )}
              {lead}
            </div>

            {scopeStats.length > 0 && (
              <dl className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-3.5 md:min-w-[250px] md:flex-col md:justify-center md:gap-2.5 md:border-l md:border-t-0 md:pl-6 md:pt-0 dt:min-w-[286px] dt:pl-7">
                {scopeStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="md:flex md:items-baseline md:justify-between md:gap-4"
                  >
                    <dt className="text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary dt:text-[11px]">
                      {stat.label}
                    </dt>
                    <dd className="text-[13px] font-extrabold tabular-nums text-text-primary dt:text-[14px]">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      </section>

      {/* No products at all in this scope: a filter rail over nothing reads
          as a broken page, so the scope gets the quote-and-featured panel. */}
      {scope.length === 0 ? (
        <EmptyScope title={title} />
      ) : (
      <section className="container-main pb-10 pt-4 dt:pt-6" aria-label="Ürün listesi">
        <div className="grid gap-(--space-grid-gap) dt:grid-cols-[264px_minmax(0,1fr)]">
          {/* Desktop filter rail */}
          <aside className="hidden dt:block">
            <div className="sticky top-4 rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-4 py-4">
              <div className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-3">
                <p className="text-[14px] font-extrabold tracking-tight text-text-primary">
                  Filtreler
                </p>
                {active > 0 && (
                  <Link
                    href={clearTo}
                    className="text-[12px] font-semibold text-brand-text transition-colors hover:text-brand-dark"
                  >
                    Temizle
                  </Link>
                )}
              </div>
              <FilterPanel
                basePath={basePath}
                params={params}
                scope={scope}
                brandFromSlug={brandFromSlug}
              />
            </div>
          </aside>

          <div className="min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 rounded-(--panel-radius) border border-line bg-surface-card shadow-e1 px-3 py-2.5 dt:px-4">
              <p className="text-[13px] text-text-secondary">
                <span className="font-extrabold tabular-nums text-text-primary">
                  {results.length}
                </span>{' '}
                ürün
              </p>

              <FilterDrawer count={active}>
                <FilterPanel
                basePath={basePath}
                params={params}
                scope={scope}
                brandFromSlug={brandFromSlug}
              />
              </FilterDrawer>

              <div className="rail ml-auto auto-cols-max gap-1 dt:flex dt:overflow-visible">
                {SORTS.map((sort) => {
                  const selected = filters.sort === sort.key;
                  return (
                    <Link
                      key={sort.key}
                      href={hrefWith(basePath, params, {
                        siralama: sort.key === 'onerilen' ? undefined : sort.key,
                      })}
                      aria-current={selected}
                      className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] transition-colors duration-(--duration-fast) ${
                        selected
                          ? 'bg-brand font-bold text-white'
                          : 'font-medium text-text-secondary hover:bg-surface-page hover:text-text-primary'
                      }`}
                    >
                      {sort.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Active filter chips */}
            {chips.length > 0 && (
              <ul className="flex flex-wrap items-center gap-1.5 pt-3">
                {chips.map((chip) => (
                  <li key={chip.key}>
                    <Link
                      href={chip.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong bg-surface-card px-2.5 py-1 text-[12px] font-medium text-text-primary transition-colors hover:border-danger hover:text-danger-ink"
                    >
                      {chip.label}
                      <X size={12} strokeWidth={2.5} aria-hidden />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={clearTo}
                    className="px-2 py-1 text-[12px] font-semibold text-text-secondary underline underline-offset-2 transition-colors hover:text-text-primary"
                  >
                    Tümünü temizle
                  </Link>
                </li>
              </ul>
            )}

            {/* Results */}
            <div className="pt-3">
              {/* `grid`, not the default rail: these are search results, and at
                  390 the rail showed 2 of 6 with the rest behind a horizontal
                  swipe. (Comment sits above the conditional — inside `? (` it
                  would make the branch hold two expressions and stop the file
                  parsing.) */}
              {results.length > 0 ? (
                <ProductGrid products={results} columns={4} layout="grid" />
              ) : (
                <div className="grid place-items-center rounded-(--panel-radius) border border-dashed border-line-strong bg-surface-card px-6 py-16 text-center">
                  <p className="text-[16px] font-extrabold text-text-primary">
                    Bu filtrelerle eşleşen ürün yok
                  </p>
                  <p className="mt-2 max-w-md text-[13px] leading-relaxed text-text-secondary">
                    Filtreleri gevşetirseniz bu listede {scope.length} ürün var.
                  </p>
                  <Link
                    href={clearTo}
                    className="mt-5 inline-flex items-center rounded-full bg-brand px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-brand-dark"
                  >
                    Filtreleri temizle
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      )}
    </>
  );
}
