import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { revalidateStorefront } from "../../../../../lib/storefront"
import { VITRIN_MODULE } from "../../../../../modules/vitrin"
import type VitrinModuleService from "../../../../../modules/vitrin/service"
import { BlockUpdate, firstIssue } from "../../validators"

/** POST /admin/vitrin/blocks/:id — edit a block's content, visibility or rank. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = BlockUpdate.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))

  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  const block = await vitrin.updateVitrinBlocks({ id: req.params.id, ...parsed.data })
  revalidateStorefront(["vitrin"])
  res.json({ block })
}

/** DELETE /admin/vitrin/blocks/:id */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  await vitrin.deleteVitrinBlocks(req.params.id)
  revalidateStorefront(["vitrin"])
  res.json({ id: req.params.id, deleted: true })
}
