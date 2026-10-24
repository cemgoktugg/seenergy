/**
 * A storefront page for one Vitrin list (admin → Vitrin → Listeler): the
 * products the shop put on it, in its order, on the same filterable listing
 * shell the category and brand pages use. Until the list exists the page
 * says so plainly instead of padding it.
 */

import { CatalogShell } from '@/components/catalog-shell';
import type { Product } from '@/data/catalog';
import type { SearchParams } from '@/lib/catalog-query';
import { loadCatalog } from '@/lib/medusa/catalog';
import { loadVitrin } from '@/lib/medusa/vitrin';

export async function VitrinListPage({
  listKey,
  title,
  eyebrow,
  description,
  basePath,
  searchParams,
}: {
  listKey: string;
  title: string;
  eyebrow: string;
  description: string;
  basePath: string;
  searchParams: Promise<SearchParams>;
}) {
  const [params, { byId }, vitrin] = await Promise.all([searchParams, loadCatalog(), loadVitrin()]);
  const scope = (vitrin.lists[listKey] ?? [])
    .map((id) => byId(id))
    .filter((product): product is Product => Boolean(product));
  return (
    <CatalogShell title={title} eyebrow={eyebrow} description={description} basePath={basePath} scope={scope} params={params} />
  );
}
