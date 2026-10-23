import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * The "Öne Çıkanlar" list (2026-10-24): the homepage's "Keşfet · Öne
 * Çıkanlar" band lost its three tabs (Haftanın Ürünleri / Yeni Ürünler / Çok
 * Satanlar) at the client's request and became one 4 × 4 grid — 16 products
 * from a list of its own, edited in admin → Vitrin.
 *
 * Its first content is what the tabs were showing, so nothing the shop picked
 * is lost: the Haftanın Ürünleri, Çok Satanlar and Yeni Gelenler lists, in
 * that order, without repeats, first 16. Created only when it does not exist.
 *
 * Named "vitrin-upgrade-…" so it sorts after vitrin-seed.ts: scripts run in
 * file-name order, and on a fresh database the seed must go first.
 */
const KEY = "one-cikan";
const SIZE = 16;

export default async function vitrin_upgrade_featured_list({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const lists = await vitrin.listVitrinLists({});
  if (lists.some((list) => list.key === KEY)) {
    logger.info("SEENERGY: Öne Çıkanlar list already exists.");
    return;
  }

  const byKey = (key: string) => (lists.find((list) => list.key === key)?.product_ids as string[] | undefined) ?? [];
  const ids = [...new Set([...byKey("haftanin"), ...byKey("cok-satan"), ...byKey("yeni")])].slice(0, SIZE);

  await vitrin.createVitrinLists([
    {
      key: KEY,
      title: "Öne Çıkanlar",
      description: "Ana sayfadaki 'Keşfet · Öne Çıkanlar' bölümü (4 × 4, ilk 16).",
      product_ids: ids,
    },
  ]);
  logger.info(`SEENERGY: Öne Çıkanlar list created with ${ids.length} products.`);
}
