import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * Move the seeded banners and hero tiles onto campaign cards.
 *
 * The first seed gave every banner the same sound-wave artwork as a full-bleed
 * background. The storefront now draws these as campaign cards: a brand tone
 * plus a product picture on a light plate (src/components/campaign-card.tsx).
 *
 * Only blocks the shop has NOT changed are touched: a block is upgraded when
 * its image is still exactly the artwork the seed put there. Anything the shop
 * uploaded or edited stays as it is. On a fresh database the seed already
 * writes the new shape, so this finds nothing to do. Runs once (migration
 * scripts are tracked); the file name sorts after vitrin-seed.ts on purpose.
 */

const UPGRADES: Record<string, { seeded: string; tone: string; product_image: string }> = {
  "hero-side-1": { seeded: "/mock/campaigns/wide-2.svg", tone: "mor", product_image: "/mock/products/cutout/speaker-white.svg" },
  "hero-side-2": { seeded: "/mock/campaigns/wide-3.svg", tone: "turkuaz", product_image: "/mock/products/cutout/nvr-white.svg" },
  wide: { seeded: "/mock/campaigns/wide-1.svg", tone: "koyu", product_image: "/mock/products/cutout/ledbar-white.svg" },
  "dual-1": { seeded: "/mock/campaigns/half-1.svg", tone: "acik", product_image: "/mock/products/cutout/receiver-white.svg" },
  "dual-2": { seeded: "/mock/campaigns/half-2.svg", tone: "turkuaz", product_image: "/mock/products/cutout/camera-white.svg" },
  // The promo tile always held a cut-out; it only moves to the new field.
  "super-firsat-promo": { seeded: "/mock/products/cutout/dish-white.svg", tone: "mor", product_image: "/mock/products/cutout/dish-white.svg" },
};

export default async function vitrin_upgrade_campaign_cards({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const blocks = await vitrin.listVitrinBlocks({ group: ["hero-side", "banner"] });
  const updates = blocks
    .filter((block) => block.key && UPGRADES[block.key] && (block.data as Record<string, unknown>).image === UPGRADES[block.key].seeded)
    .map((block) => {
      const upgrade = UPGRADES[block.key!];
      return {
        id: block.id,
        data: { ...(block.data as Record<string, unknown>), image: "", tone: upgrade.tone, product_image: upgrade.product_image },
      };
    });

  if (updates.length > 0) await vitrin.updateVitrinBlocks(updates);
  logger.info(`Vitrin: ${updates.length} banner(s) moved onto campaign cards; ${blocks.length - updates.length} left as the shop set them.`);
}
