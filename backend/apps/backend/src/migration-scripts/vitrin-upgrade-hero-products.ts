import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * Hero, first slide (2026-10-25): the SEENERGY logo alone on the stage gave
 * the homepage's first screen no product. It now shows the house range — a
 * solar PTZ, a turret, a bullet and an NVR, composed from the client's own
 * photos into the storefront's public/hero/seenergy-cctv.webp.
 *
 * Fill-only: a slide is changed only while it still carries the seeded logo,
 * so a picture the shop has chosen in the admin is never replaced.
 */
const OLD = "/brand/seenergy-logo-hero.webp";
const NEW = "/hero/seenergy-cctv.webp";

export default async function vitrin_upgrade_hero_products({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const slides = await vitrin.listVitrinBlocks({ group: ["hero-slide"] });
  const stale = slides.filter((block) => (block.data as { image?: string } | null)?.image === OLD);
  if (!stale.length) {
    logger.info("SEENERGY: hero slides already carry their own pictures.");
    return;
  }
  await vitrin.updateVitrinBlocks(
    stale.map((block) => ({
      id: block.id,
      data: { ...(block.data as Record<string, unknown>), image: NEW, fit: "contain" },
    }))
  );
  logger.info(`SEENERGY: ${stale.length} hero slide(s) now show the CCTV range.`);
}
