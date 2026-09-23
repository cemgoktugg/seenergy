import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { getQuickProduct, updateQuickProduct } from "../../../../../lib/quick-product"
import { revalidateStorefront } from "../../../../../lib/storefront"
import { QuickProductBody, firstIssue } from "../../validators"

/** GET /admin/vitrin/products/:id */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  res.json({ product: await getQuickProduct(req.scope, req.params.id) })
}

/** POST /admin/vitrin/products/:id — save the quick form. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = QuickProductBody.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))
  const product = await updateQuickProduct(req.scope, req.params.id, parsed.data)
  revalidateStorefront(["catalog", "vitrin"])
  res.json({ product })
}
