import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"

import { revalidateStorefront } from "../../../../../lib/storefront"
import { VITRIN_MODULE } from "../../../../../modules/vitrin"
import type VitrinModuleService from "../../../../../modules/vitrin/service"
import { ListUpdate, firstIssue } from "../../validators"

/** POST /admin/vitrin/lists/:key — replace a list's products, in order. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = ListUpdate.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))

  const vitrin: VitrinModuleService = req.scope.resolve(VITRIN_MODULE)
  const [list] = await vitrin.listVitrinLists({ key: req.params.key })
  if (!list) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Liste bulunamadı.")

  const product_ids = [...new Set(parsed.data.product_ids)]
  const updated = await vitrin.updateVitrinLists({ id: list.id, product_ids })
  revalidateStorefront(["vitrin"])
  res.json({ list: updated })
}
