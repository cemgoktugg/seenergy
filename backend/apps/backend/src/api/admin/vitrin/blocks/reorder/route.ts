import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { revalidateStorefront } from "../../../../../lib/storefront"
import { VITRIN_MODULE } from "../../../../../modules/vitrin"
import type VitrinModuleService from "../../../../../modules/vitrin/service"
import { Reorder, firstIssue } from "../../validators"

/** POST /admin/vitrin/blocks/reorder — `ids` in their new order. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = Reorder.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))

  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  await vitrin.updateVitrinBlocks(parsed.data.ids.map((id, rank) => ({ id, rank })))
  revalidateStorefront(["vitrin"])
  res.json({ ok: true })
}
