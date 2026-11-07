import fs from "fs";
import path from "path";
import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys, ProductStatus } from "@medusajs/framework/utils";
import {
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  updateProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";
import { STORAGE_CONTENT } from "../seed/storage-content";

/**
 * The client's Kayıt ve Depolama range (2026-11-07): 34 memory cards, SSDs and
 * surveillance disks in the kayit-ve-depolama category, each under its brand
 * (a collection, created when missing), with the client's title, description,
 * spec table and photo (src/seed/storage-content.ts, seed-assets/storage).
 *
 * Published with no price, like the CCTV range: the storefront shows
 * "Tükendi" until a price is entered in Vitrin → Ürün Yönetimi. Built the way
 * the admin's product form builds one (a "Standart" variant, the default
 * sales channel, stock 0 at the warehouse), so that form edits these like any
 * other.
 *
 * A product that already exists — same handle, or same SKU (NetHesap Online
 * may have brought it over first) — is not created again; it only gets what
 * it is missing: picture, description, specs. Nothing an admin wrote is
 * overwritten. Runs after security-category-tree (file-name order), which
 * creates the category.
 */

const ASSETS = path.resolve(process.cwd(), "seed-assets/storage");
const CATEGORY = "kayit-ve-depolama";

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

export default async function seenergy_storage_range({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;

  const [{ data: categories }, { data: stores }, { data: profiles }, { data: locations }, { data: options }] =
    await Promise.all([
      query.graph({ entity: "product_category", fields: ["id"], filters: { handle: CATEGORY } }),
      query.graph({ entity: "store", fields: ["default_sales_channel_id"] }),
      query.graph({ entity: "shipping_profile", fields: ["id"] }),
      query.graph({ entity: "stock_location", fields: ["id"] }),
      query.graph({ entity: "product_option", fields: ["id", "title"], filters: { title: "Model" } }),
    ]);
  const salesChannelId = stores[0]?.default_sales_channel_id;
  if (!salesChannelId || !profiles[0] || !locations[0] || !categories[0]) {
    logger.info("SEENERGY: storage range skipped — store, warehouse or category not set up yet.");
    return;
  }

  // Brands, as collections (how the catalogue keeps brands).
  const brandId = new Map<string, string>();
  for (const brand of new Set(STORAGE_CONTENT.map((item) => item.brand))) {
    const { data: found } = await query.graph({
      entity: "product_collection",
      fields: ["id"],
      filters: { handle: slugify(brand) },
    });
    if (found[0]) {
      brandId.set(brand, found[0].id);
      continue;
    }
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [{ title: brand, handle: slugify(brand) }] },
    });
    brandId.set(brand, result[0].id);
  }

  const skus = STORAGE_CONTENT.map((item) => item.sku).filter((sku): sku is string => !!sku);
  const [{ data: byHandle }, { data: variants }] = await Promise.all([
    query.graph({
      entity: "product",
      fields: ["id", "handle"],
      filters: { handle: STORAGE_CONTENT.map((item) => item.handle) },
    }),
    query.graph({ entity: "product_variant", fields: ["sku", "product_id"], filters: { sku: skus } }),
  ]);

  let created = 0;
  let filled = 0;

  for (const item of STORAGE_CONTENT) {
    let productId: string | undefined =
      byHandle.find((p) => p.handle === item.handle)?.id ??
      (item.sku ? variants.find((v) => v.sku === item.sku)?.product_id : undefined);

    if (!productId) {
      const { result } = await createProductsWorkflow(container).run({
        input: {
          products: [
            {
              title: item.title,
              handle: item.handle,
              status: ProductStatus.PUBLISHED,
              category_ids: [categories[0].id],
              collection_id: brandId.get(item.brand),
              shipping_profile_id: profiles[0].id,
              metadata: { brand: item.brand, instalment: true },
              options: options[0] ? [{ id: options[0].id }] : [{ title: "Model", values: ["Standart"] }],
              variants: [
                {
                  title: "Standart",
                  ...(item.sku ? { sku: item.sku } : {}),
                  manage_inventory: true,
                  options: { Model: "Standart" },
                  prices: [],
                },
              ],
              sales_channels: [{ id: salesChannelId }],
            } as any,
          ],
        },
      });
      productId = result[0].id;

      const { data: made } = await query.graph({
        entity: "product_variant",
        fields: ["inventory_items.inventory_item_id"],
        filters: { product_id: productId },
      });
      const inventoryItemId = made[0]?.inventory_items?.[0]?.inventory_item_id;
      if (inventoryItemId) {
        await createInventoryLevelsWorkflow(container).run({
          input: {
            inventory_levels: [{ inventory_item_id: inventoryItemId, location_id: locations[0].id, stocked_quantity: 0 }],
          },
        });
      }
      created++;
    }

    // Fill what is missing — on a new product that is everything.
    const { data: current } = await query.graph({
      entity: "product",
      fields: ["id", "description", "thumbnail", "metadata", "images.id"],
      filters: { id: productId },
    });
    const product = current[0];
    const meta = (product.metadata ?? {}) as Record<string, unknown>;
    const needsPicture = !product.thumbnail && !(product.images?.length > 0);
    const needsSpecs = !Array.isArray(meta.specs) || meta.specs.length === 0;
    const needsDescription = !product.description && !!item.description;

    let pictureUrl: string | undefined;
    const picture = path.join(ASSETS, `${item.handle}.webp`);
    if (needsPicture && fs.existsSync(picture)) {
      const { result } = await uploadFilesWorkflow(container).run({
        input: {
          files: [
            {
              filename: `${item.handle}.webp`,
              mimeType: "image/webp",
              content: fs.readFileSync(picture).toString("base64"),
              access: "public",
            },
          ],
        },
      });
      pictureUrl = result[0]?.url;
    }

    if (!pictureUrl && !needsSpecs && !needsDescription) continue;
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          ...(needsDescription ? { description: item.description } : {}),
          ...(pictureUrl ? { thumbnail: pictureUrl, images: [{ url: pictureUrl }] } : {}),
          // Medusa merges metadata by key; brand and the rest stay.
          ...(needsSpecs ? { metadata: { specs: item.specs } } : {}),
        } as any,
      },
    });
    filled++;
  }

  logger.info(`SEENERGY: storage range — ${created} products added, ${filled} filled.`);
}
