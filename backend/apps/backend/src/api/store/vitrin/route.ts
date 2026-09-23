import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { VITRIN_MODULE } from "../../../modules/vitrin"
import type VitrinModuleService from "../../../modules/vitrin/service"

/**
 * GET /store/vitrin — the storefront's editable content: product lists as
 * ordered id arrays, and the ACTIVE blocks grouped by page area, in rank order.
 * Product details are not repeated here; the storefront already has the
 * catalogue and resolves the ids against it.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  const [lists, blocks] = await Promise.all([
    vitrin.listVitrinLists({}),
    vitrin.listVitrinBlocks({ is_active: true }, { order: { rank: "ASC" } }),
  ])

  const grouped: Record<string, { id: string; key: string | null; data: unknown }[]> = {}
  for (const block of blocks) {
    if (!grouped[block.group]) grouped[block.group] = []
    grouped[block.group].push({ id: block.id, key: block.key, data: block.data })
  }
  res.json({
    lists: Object.fromEntries(lists.map((list) => [list.key, { title: list.title, product_ids: list.product_ids }])),
    blocks: grouped,
  })
}
