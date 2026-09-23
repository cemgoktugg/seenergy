import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { createQuickProduct, listQuickProducts } from "../../../../lib/quick-product"
import { revalidateStorefront } from "../../../../lib/storefront"
import { QuickProductBody, firstIssue } from "../validators"

/**
 * GET /admin/vitrin/products?q=&limit=&offset=&ids=a,b — products as flat rows
 * (price, sale price, stock, brand, lists) for the quick list and the pickers.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const q = typeof req.query.q === "string" && req.query.q.trim() ? req.query.q.trim() : undefined
  const ids = typeof req.query.ids === "string" && req.query.ids ? req.query.ids.split(",") : undefined
  const take = Math.min(Number(req.query.limit) || 20, 100)
  const skip = Number(req.query.offset) || 0
  res.json(await listQuickProducts(req.scope, { q, ids, take: ids ? ids.length : take, skip: ids ? 0 : skip }))
}

/** POST /admin/vitrin/products — create a product from the quick form. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = QuickProductBody.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))
  const product = await createQuickProduct(req.scope, parsed.data)
  revalidateStorefront(["catalog", "vitrin"])
  res.json({ product })
}
