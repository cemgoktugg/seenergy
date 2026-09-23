import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { revalidateStorefront } from "../../../../lib/storefront"
import { VITRIN_MODULE } from "../../../../modules/vitrin"
import type VitrinModuleService from "../../../../modules/vitrin/service"
import { BlockCreate, firstIssue } from "../validators"

/** POST /admin/vitrin/blocks — add a block (a new hero slide, brand band…). */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = BlockCreate.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))

  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  const siblings = await vitrin.listVitrinBlocks({ group: parsed.data.group })
  const block = await vitrin.createVitrinBlocks({
    group: parsed.data.group,
    key: parsed.data.key ?? null,
    is_active: parsed.data.is_active ?? true,
    // Appended to the end of its group unless a rank was given.
    rank: parsed.data.rank ?? siblings.reduce((max, b) => Math.max(max, b.rank + 1), 0),
    data: parsed.data.data,
  })
  revalidateStorefront(["vitrin"])
  res.json({ block })
}
