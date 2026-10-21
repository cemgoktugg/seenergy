import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";

/**
 * Publish the CCTV range added as drafts by seenergy-cctv-products.
 *
 * The client wants the models visible — in the CCTV mega menu under their
 * subcategories and on their own pages — before prices exist. The storefront
 * now shows a product without a price as "Fiyat için teklif isteyin" (no
 * add-to-cart), so publishing them is safe; entering a price in the admin
 * turns a model into an ordinary sale item.
 *
 * Only the 25 models of the range, and only while they are still drafts: a
 * model someone has since unpublished on purpose is not touched again
 * (migration scripts run once).
 */

const MODELS = [
  "SE-1080LD", "SE-1080MD", "SE-1080MC", "SE-3824", "SE-1080ML", "SE-1080MLW", "SE-4000", "SE-8000", "SE-16000",
  "SE-IP5083LD", "SE-IPC5010LDS", "SE-IPC5083B", "SE-IPC5010MLS", "SE-NVR1010", "SE-NVR1016", "SE-NVR2036", "SE-NVR4036",
  "3800WM", "3800WP", "3800WB", "IPC5010LDW", "1080M4G",
  "3004G", "5010X-4G", "6010XD-4G",
];

export default async function seenergy_cctv_publish({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as {
    graph: (config: Record<string, unknown>) => Promise<{ data: any[] }>;
  };
  // The same handle seenergy-cctv-products gave each model.
  const handles = MODELS.map((model) => slugify(`SEENERGY ${model}`));
  const { data } = await query.graph({
    entity: "product",
    fields: ["id", "status"],
    filters: { handle: handles },
  });
  const drafts = data.filter((product) => product.status === ProductStatus.DRAFT).map((product) => product.id);
  if (drafts.length) {
    await updateProductsWorkflow(container).run({
      input: { selector: { id: drafts }, update: { status: ProductStatus.PUBLISHED } },
    });
  }
  logger.info(`SEENERGY: CCTV range — ${drafts.length} models published.`);
}
