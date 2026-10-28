import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { patchQuickProduct } from "../../../../lib/quick-product"
import { revalidateStorefront } from "../../../../lib/storefront"
import { ProductBatchBody, firstIssue } from "../validators"

/**
 * POST /admin/vitrin/product-batch — save what was changed straight in the
 * Ürün Yönetimi list (price, sale price, stock, status, category, a new main
 * picture), many products in one go.
 *
 * Each product is saved on its own; one that fails (a sale price above its
 * price…) does not stop the rest. The answer names the failures, so the list
 * keeps exactly those rows unsaved and shows why.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = ProductBatchBody.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))

  const saved: string[] = []
  const failed: { id: string; message: string }[] = []
  for (const patch of parsed.data.updates) {
    try {
      await patchQuickProduct(req.scope, patch)
      saved.push(patch.id)
    } catch (error) {
      failed.push({ id: patch.id, message: error instanceof Error ? error.message : "Kaydedilemedi." })
    }
  }
  if (saved.length) revalidateStorefront(["catalog", "vitrin"])
  res.json({ saved, failed })
}
