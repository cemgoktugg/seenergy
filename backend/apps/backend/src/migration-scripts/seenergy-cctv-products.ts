import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
} from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";

/**
 * The client's CCTV range (2026-10-22): 25 SEENERGY models under the four
 * CCTV subcategories, as listed in the client's table.
 *
 * The table gives model codes only — no price, stock or picture — so every
 * product is created as a DRAFT: it is in the admin, in its subcategory, under
 * the SEENERGY brand, with the model code as SKU, but not on the site until a
 * price (and ideally stock and a picture) is entered in Vitrin → Ürün
 * Yönetimi and it is published. Built the way the admin's product form builds
 * a product (one "Standart" variant, the default sales channel, a stock level
 * of 0 at the warehouse), so that form edits these like any other.
 *
 * Idempotent: a model whose handle already exists is skipped. Runs after
 * security-category-tree (file-name order), which creates the subcategories.
 */

const RANGE: Record<string, string[]> = {
  "ahd-sistem": [
    "SE-1080LD", "SE-1080MD", "SE-1080MC", "SE-3824", "SE-1080ML", "SE-1080MLW", "SE-4000", "SE-8000", "SE-16000",
  ],
  "ip-sistem": [
    "SE-IP5083LD", "SE-IPC5010LDS", "SE-IPC5083B", "SE-IPC5010MLS", "SE-NVR1010", "SE-NVR1016", "SE-NVR2036", "SE-NVR4036",
  ],
  "wifi-kameralar": ["3800WM", "3800WP", "3800WB", "IPC5010LDW", "1080M4G"],
  "solar-kameralar": ["3004G", "5010X-4G", "6010XD-4G"],
};

const BRAND = "SEENERGY";

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

export default async function seenergy_cctv_products({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;

  const [{ data: categories }, { data: stores }, { data: profiles }, { data: locations }, { data: options }] =
    await Promise.all([
      query.graph({ entity: "product_category", fields: ["id", "handle"] }),
      query.graph({ entity: "store", fields: ["default_sales_channel_id"] }),
      query.graph({ entity: "shipping_profile", fields: ["id"] }),
      query.graph({ entity: "stock_location", fields: ["id"] }),
      query.graph({ entity: "product_option", fields: ["id", "title"], filters: { title: "Model" } }),
    ]);
  const categoryId = new Map(categories.map((c) => [c.handle as string, c.id as string]));
  const salesChannelId = stores[0]?.default_sales_channel_id;
  // A fresh database that was never seeded has none of this; nothing to add to.
  if (!salesChannelId || !profiles[0] || !locations[0] || !categoryId.has("ahd-sistem")) {
    logger.info("SEENERGY: CCTV range skipped — store, warehouse or category tree not set up yet.");
    return;
  }

  // The brand, as a collection (how the catalogue keeps brands).
  let { data: brand } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
    filters: { handle: slugify(BRAND) },
  });
  if (!brand[0]) {
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [{ title: BRAND, handle: slugify(BRAND) }] },
    });
    brand = result;
  }

  let created = 0;
  for (const [category, models] of Object.entries(RANGE)) {
    for (const model of models) {
      const handle = slugify(`${BRAND} ${model}`);
      const { data: existing } = await query.graph({ entity: "product", fields: ["id"], filters: { handle } });
      if (existing.length) continue;

      const { result } = await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title: `${BRAND} ${model}`,
              handle,
              status: ProductStatus.DRAFT,
              category_ids: [categoryId.get(category)!],
              collection_id: brand[0].id,
              shipping_profile_id: profiles[0].id,
              metadata: { brand: BRAND, instalment: true },
              options: options[0] ? [{ id: options[0].id }] : [{ title: "Model", values: ["Standart"] }],
              variants: [
                { title: "Standart", sku: model, manage_inventory: true, options: { Model: "Standart" }, prices: [] },
              ],
              sales_channels: [{ id: salesChannelId }],
            } as any,
          ],
        },
      });

      const { data: variants } = await query.graph({
        entity: "product_variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { product_id: result[0].id },
      });
      const inventoryItemId = variants[0]?.inventory_items?.[0]?.inventory_item_id;
      if (inventoryItemId) {
        await createInventoryLevelsWorkflow(container).run({
          input: {
            inventory_levels: [{ inventory_item_id: inventoryItemId, location_id: locations[0].id, stocked_quantity: 0 }],
          },
        });
      }
      created++;
    }
  }
  logger.info(`SEENERGY: CCTV range — ${created} draft products added.`);
}
