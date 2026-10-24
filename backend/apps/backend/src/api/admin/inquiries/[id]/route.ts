import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"

import { INQUIRY_MODULE } from "../../../../modules/inquiry"
import type InquiryModuleService from "../../../../modules/inquiry/service"
import { INQUIRY_STATUSES } from "../../../../modules/inquiry/types"

const Update = z.object({
  status: z.enum(Object.keys(INQUIRY_STATUSES) as [string, ...string[]]).optional(),
  note: z.string().max(5000).nullable().optional(),
})

/** POST /admin/inquiries/:id — change a request's status or working note. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = Update.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Geçersiz istek.")
  const service: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  const inquiry = await service.updateInquiries({ id: req.params.id, ...parsed.data })
  res.json({ inquiry })
}

/** DELETE /admin/inquiries/:id */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const service: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  await service.deleteInquiries(req.params.id)
  res.json({ id: req.params.id, deleted: true })
}
