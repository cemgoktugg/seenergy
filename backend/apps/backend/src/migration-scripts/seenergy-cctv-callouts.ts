import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

import { slugify } from "../lib/quick-product";

/**
 * Product page, 2026-10-25: datasheet-style labels over the first photo — a
 * dot on the part, a line to a tag with the value it delivers. `metadata.
 * callouts`, read by the storefront's catalog loader (calloutsFrom).
 *
 * Points are fractions of the photo (x, y, 0–1), placed by hand on the
 * client's own pictures in seed-assets/cctv against a 10% grid; `ty` is the
 * tag's height at the stage edge. Every value is from the model's datasheet
 * text in seed/cctv-content.ts. Fill-only: a product that already carries
 * callouts (edited in the admin) keeps them.
 */
type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

type Callout = { x: number; y: number; ty: number; side: "left" | "right"; value: string; label: string };

const CALLOUTS: Record<string, Callout[]> = {
  "SE-IPC5083LD": [
    { x: 0.5, y: 0.43, ty: 0.24, side: "right", value: "40–50 m", label: "gece görüşü" },
    { x: 0.48, y: 0.59, ty: 0.59, side: "left", value: "2,8 mm", label: "sabit lens" },
    { x: 0.66, y: 0.59, ty: 0.76, side: "right", value: "5 MP", label: "IP görüntü" },
  ],
  "SE-IPC5083B": [
    { x: 0.14, y: 0.44, ty: 0.2, side: "left", value: "40–50 m", label: "gece görüşü, 18 LED" },
    { x: 0.25, y: 0.57, ty: 0.84, side: "left", value: "2,8 mm", label: "sabit lens" },
    { x: 0.86, y: 0.3, ty: 0.12, side: "right", value: "Montaj ayağı", label: "yönlendirilebilir" },
  ],
  "SE-1080LD": [
    { x: 0.49, y: 0.65, ty: 0.9, side: "left", value: "2,8 mm", label: "sabit lens" },
    { x: 0.7, y: 0.58, ty: 0.9, side: "right", value: "15–30 m", label: "gece görüşü, 18 IR LED" },
  ],
  "SE-3824": [
    { x: 0.13, y: 0.44, ty: 0.18, side: "left", value: "30–40 m", label: "gece görüşü, 36 IR LED" },
    { x: 0.19, y: 0.53, ty: 0.82, side: "left", value: "2 MP", label: "AHD görüntü" },
    { x: 0.78, y: 0.45, ty: 0.82, side: "right", value: "Montaj ayağı", label: "yönlendirilebilir" },
  ],
  "SE-5010X-4G": [
    { x: 0.32, y: 0.24, ty: 0.5, side: "left", value: "8 W", label: "güneş paneli" },
    { x: 0.5, y: 0.76, ty: 0.84, side: "left", value: "10x", label: "optik yakınlaştırma" },
  ],
  "SE-IPC5010LDS": [
    { x: 0.43, y: 0.79, ty: 0.92, side: "left", value: "40–50 m", label: "renkli gece görüşü" },
    { x: 0.6, y: 0.59, ty: 0.92, side: "right", value: "5 MP", label: "IP görüntü" },
  ],
};

const handleOf = (sku: string) => slugify(`SEENERGY ${sku}`);

export default async function seenergy_cctv_callouts({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "handle", "metadata"],
    filters: { handle: Object.keys(CALLOUTS).map(handleOf) },
  });

  let updated = 0;
  for (const [sku, callouts] of Object.entries(CALLOUTS)) {
    const product = products.find((p) => p.handle === handleOf(sku));
    if (!product || Array.isArray(product.metadata?.callouts)) continue;
    await updateProductsWorkflow(container).run({
      input: {
        selector: { id: product.id },
        // Medusa merges metadata by key; specs, datasheet and brand stay.
        update: { metadata: { callouts } } as any,
      },
    });
    updated++;
  }
  logger.info(`SEENERGY: photo callouts set on ${updated} CCTV product(s).`);
}
