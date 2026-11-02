import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * The client's WhatsApp line (2026-11-02). Şirket bilgileri had it empty, so no
 * WhatsApp link showed anywhere. Only while it is still empty: a number the shop
 * has since typed in the admin is left alone.
 */
export default async function vitrin_upgrade_whatsapp({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const [company] = await vitrin.listVitrinBlocks({ group: "company" });
  const data = (company?.data ?? null) as Record<string, unknown> | null;
  if (!company || !data || data.whatsapp) {
    logger.info("SEENERGY: WhatsApp line already set, or no company block.");
    return;
  }
  await vitrin.updateVitrinBlocks([{ id: company.id, data: { ...data, whatsapp: "0544 480 1490" } }]);
  logger.info("SEENERGY: WhatsApp line set.");
}
