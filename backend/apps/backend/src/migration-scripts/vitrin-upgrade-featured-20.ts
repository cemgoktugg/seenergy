import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";
import { slugify } from "../lib/quick-product";

/**
 * "Öne Çıkanlar" grows from 4 × 4 to 4 × 5 (2026-10-27, the client asked for
 * four more products). The four added are SEENERGY's own range, with real
 * photos: a 5MP IP dome, a 4G solar PTZ, a 36-channel NVR and an AHD bullet.
 *
 * Fill-only: the four are appended only while the list still holds 16 or
 * fewer products, and only those not already in it — a list the shop has
 * already grown or reordered in the admin is left alone. Products are found
 * by handle, so the same script works on any database.
 */
const KEY = "one-cikan";
const ADD = ["SE-IPC5083LD", "SE-5010X-4G", "SE-NVR2036", "SE-3824"];

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

export default async function vitrin_upgrade_featured_20({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const [list] = await vitrin.listVitrinLists({ key: KEY });
  if (!list) {
    logger.info("SEENERGY: Öne Çıkanlar list not found; nothing to extend.");
    return;
  }
  const current = (list.product_ids as string[] | null) ?? [];
  if (current.length > 16) {
    logger.info("SEENERGY: Öne Çıkanlar already holds more than 16 products.");
    return;
  }

  const handles = ADD.map((sku) => slugify(`SEENERGY ${sku}`));
  const { data: products } = await query.graph({ entity: "product", fields: ["id", "handle"], filters: { handle: handles } });
  const ids = handles
    .map((handle) => products.find((product) => product.handle === handle)?.id as string | undefined)
    .filter((id): id is string => Boolean(id) && !current.includes(id as string));

  await vitrin.updateVitrinLists({
    id: list.id,
    product_ids: [...current, ...ids],
    description: "Ana sayfadaki 'Keşfet · Öne Çıkanlar' bölümü (4 × 5, ilk 20).",
  });
  logger.info(`SEENERGY: Öne Çıkanlar extended by ${ids.length} product(s) to ${current.length + ids.length}.`);
}
