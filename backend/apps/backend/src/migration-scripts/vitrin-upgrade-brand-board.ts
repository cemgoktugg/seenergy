import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createCollectionsWorkflow } from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";
import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * The brand board (2026-10-22): four squares under the hero — Dahua,
 * Hikvision, Neutron, UNV — that replaced the category board at the client's
 * request. Hovering a square lists that brand's models.
 *
 *   - Creates the four brands as collections when they are missing, so the
 *     admin's product form can file products under them; until it does, the
 *     storefront's squares say the models are on the way.
 *   - Adds the four blocks, with logos cut from the client's own brand
 *     banners (public/brand-logos/ on the storefront), only when the group is
 *     still empty — a board edited in the admin is left alone.
 *
 * Named "vitrin-upgrade-…" so it sorts after vitrin-seed.ts: scripts run in
 * file-name order, and on a fresh database the seed must go first.
 */

const BOARD = [
  { title: "Dahua", logo: "/brand-logos/dahua.webp" },
  { title: "Hikvision", logo: "/brand-logos/hikvision.webp" },
  { title: "Neutron", logo: "/brand-logos/neutron.webp" },
  { title: "UNV", logo: "/brand-logos/unv.webp" },
];

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

export default async function vitrin_upgrade_brand_board({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const handles = BOARD.map((brand) => slugify(brand.title));
  const { data: existing } = await query.graph({
    entity: "product_collection",
    fields: ["id", "handle"],
    filters: { handle: handles },
  });
  const missing = BOARD.filter((brand) => !existing.some((c) => c.handle === slugify(brand.title)));
  if (missing.length) {
    await createCollectionsWorkflow(container).run({
      input: { collections: missing.map((brand) => ({ title: brand.title, handle: slugify(brand.title) })) },
    });
  }

  const blocks = await vitrin.listVitrinBlocks({ group: "brand-board" });
  if (blocks.length === 0) {
    await vitrin.createVitrinBlocks(
      BOARD.map((brand, rank) => ({
        group: "brand-board",
        key: null,
        rank,
        is_active: true,
        data: { brand_handle: slugify(brand.title), logo: brand.logo },
      })),
    );
  }

  logger.info(
    `SEENERGY: brand board — ${missing.length} brands added, ${blocks.length === 0 ? BOARD.length : 0} squares added.`,
  );
}
