import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * Hero, light design (2026-10-30, the client's mock): a second look for the
 * slider, chosen in admin → Vitrin → Ana slayt → "Tasarım". The oval design
 * stays the default, so nothing visible changes until someone switches.
 *
 * The light design wants a wide photo per slide. So that switching shows the
 * mock's look at once, the first slide gets the photo cut from the client's
 * own mock (storefront public/hero/acik-guvenlik.webp) — fill-only: only
 * while that slide has no wide photo of its own. The oval design never
 * reads this field.
 */
const PHOTO = "/hero/acik-guvenlik.webp";

export default async function vitrin_upgrade_hero_light({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const slides = await vitrin.listVitrinBlocks({ group: ["hero-slide"] });
  const first = [...slides].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0))[0];
  const data = (first?.data ?? {}) as Record<string, unknown>;
  if (!first || (typeof data.wide_image === "string" && data.wide_image)) {
    logger.info("SEENERGY: the first hero slide already has a wide photo (or there is none).");
    return;
  }
  await vitrin.updateVitrinBlocks([{ id: first.id, data: { ...data, wide_image: PHOTO } }]);
  logger.info("SEENERGY: the first hero slide has a wide photo for the light design.");
}
