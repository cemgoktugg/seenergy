import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { VITRIN_MODULE } from "../../../modules/vitrin"
import type VitrinModuleService from "../../../modules/vitrin/service"

/**
 * GET /admin/vitrin — everything the Vitrin screens edit, in one response:
 * the product lists, every content block (active or not), and the storefront
 * URL so the admin can preview root-relative images and link to the live page.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  const [lists, blocks] = await Promise.all([
    vitrin.listVitrinLists({}, { order: { created_at: "ASC" } }),
    vitrin.listVitrinBlocks({}, { order: { rank: "ASC" } }),
  ])
  res.json({ lists, blocks, storefront_url: process.env.STOREFRONT_URL ?? "" })
}
