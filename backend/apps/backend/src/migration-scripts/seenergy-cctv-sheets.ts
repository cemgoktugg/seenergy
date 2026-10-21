import fs from "fs";
import path from "path";
import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  updateProductVariantsWorkflow,
  updateProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";
import { CCTV_CONTENT } from "../seed/cctv-content";

/**
 * The CCTV range's own content, from the client's datasheets: a product
 * photo, the datasheet PDF, an e-commerce title, a description and the
 * grouped technical specs (src/seed/cctv-content.ts).
 *
 * Files go through Medusa's file module — the same path as an admin upload —
 * so they land in the uploads directory (a persistent volume on the live
 * server) under the backend's public URL, and the admin shows and replaces
 * them like any other picture. The sources ship in seed-assets/cctv, which
 * the backend image copies to /server/seed-assets.
 *
 * Fills, never overwrites: a product that already has a picture, a
 * description, specs or a datasheet keeps it, and the title, handle and SKU
 * change only while they are still the bare model code this range was
 * created with. Whatever someone edited in the admin stays as they left it.
 *
 * Named to sort after seenergy-cctv-products / -publish (scripts run in file
 * name order), so on a fresh database the products exist by the time it runs.
 */

const ASSETS = path.resolve(process.cwd(), "seed-assets/cctv");

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

const handleOf = (code: string) => slugify(`SEENERGY ${code}`);

export default async function seenergy_cctv_sheets({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;

  if (!fs.existsSync(ASSETS)) {
    logger.warn(`SEENERGY: CCTV datasheets skipped — ${ASSETS} not found.`);
    return;
  }

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "description", "thumbnail", "metadata", "images.id", "variants.id", "variants.sku"],
    filters: { handle: CCTV_CONTENT.flatMap((item) => [handleOf(item.code), handleOf(item.sku)]) },
  });

  let updated = 0;
  const missing: string[] = [];

  for (const item of CCTV_CONTENT) {
    const product =
      products.find((p) => p.handle === handleOf(item.code)) ?? products.find((p) => p.handle === handleOf(item.sku));
    if (!product) {
      missing.push(item.sku);
      continue;
    }

    const meta = (product.metadata ?? {}) as Record<string, unknown>;
    const needsPicture = !product.thumbnail && !(product.images?.length > 0);
    const needsSheet = typeof meta.datasheet_url !== "string" || !meta.datasheet_url;
    const needsSpecs = !Array.isArray(meta.specs) || meta.specs.length === 0;
    const bareTitle = product.title === `SEENERGY ${item.code}`;

    const files: { filename: string; mimeType: string; content: string; access: "public" }[] = [];
    const picture = path.join(ASSETS, `${item.sku}.webp`);
    const sheet = path.join(ASSETS, `${item.sku}.pdf`);
    if (needsPicture && fs.existsSync(picture)) {
      files.push({
        filename: `${item.sku.toLowerCase()}.webp`,
        mimeType: "image/webp",
        content: fs.readFileSync(picture).toString("base64"),
        access: "public",
      });
    }
    if (needsSheet && fs.existsSync(sheet)) {
      files.push({
        filename: `${item.sku}-teknik-foy.pdf`,
        mimeType: "application/pdf",
        content: fs.readFileSync(sheet).toString("base64"),
        access: "public",
      });
    }
    const uploaded = files.length ? (await uploadFilesWorkflow(container).run({ input: { files } })).result : [];
    const pictureUrl = uploaded.find((file) => file.url.endsWith(".webp"))?.url;
    const sheetUrl = uploaded.find((file) => file.url.endsWith(".pdf"))?.url;

    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        update: {
          ...(bareTitle ? { title: `SEENERGY ${item.sku} ${item.name}`, handle: handleOf(item.sku) } : {}),
          ...(product.description ? {} : { description: item.description }),
          ...(pictureUrl ? { thumbnail: pictureUrl, images: [{ url: pictureUrl }] } : {}),
          // Medusa merges metadata by key; brand and the rest stay.
          metadata: {
            ...(needsSpecs ? { specs: item.specs } : {}),
            ...(sheetUrl ? { datasheet_url: sheetUrl } : {}),
          },
        } as any,
      },
    });

    const variant = product.variants?.[0];
    if (variant && variant.sku === item.code && item.code !== item.sku) {
      await updateProductVariantsWorkflow(container).run({
        input: { selector: { id: variant.id }, update: { sku: item.sku } as any },
      });
    }
    updated++;
  }

  logger.info(
    `SEENERGY: CCTV datasheets — ${updated} models filled` +
      (missing.length ? `; not found: ${missing.join(", ")}` : "") +
      ".",
  );
}
