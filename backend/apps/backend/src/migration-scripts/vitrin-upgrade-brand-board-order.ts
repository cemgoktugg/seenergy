import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * "Resmi Yetkili Satıcısı Olduğumuz Markalar" (2026-10-27): the client wants
 * UNV before Neutron. The card follows the Marka panosu blocks' rank, so the
 * two ranks are swapped.
 *
 * Only while Neutron still precedes UNV — an order the shop has since set in
 * the admin is left alone.
 */
export default async function vitrin_upgrade_brand_board_order({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const blocks = await vitrin.listVitrinBlocks({ group: "brand-board" });
  const handle = (block: (typeof blocks)[number]) => (block.data as { brand_handle?: string } | null)?.brand_handle;
  const neutron = blocks.find((block) => handle(block) === "neutron");
  const unv = blocks.find((block) => handle(block) === "unv");
  if (!neutron || !unv || neutron.rank > unv.rank) {
    logger.info("SEENERGY: brand board order already has UNV before Neutron.");
    return;
  }
  await vitrin.updateVitrinBlocks([
    { id: neutron.id, rank: unv.rank },
    { id: unv.id, rank: neutron.rank },
  ]);
  logger.info("SEENERGY: brand board — UNV now before Neutron.");
}
