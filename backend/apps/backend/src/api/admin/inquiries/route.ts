import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { INQUIRY_MODULE } from "../../../modules/inquiry"
import type InquiryModuleService from "../../../modules/inquiry/service"

/** GET /admin/inquiries?status=&type=&limit=&offset= — newest first. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const service: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  const q = req.query as Record<string, string | undefined>
  const filters: Record<string, string> = {}
  if (q.status) filters.status = q.status
  if (q.type) filters.type = q.type
  const take = Math.min(Number(q.limit) || 50, 200)
  const skip = Number(q.offset) || 0
  const [inquiries, count] = await service.listAndCountInquiries(filters, {
    order: { created_at: "DESC" },
    take,
    skip,
  })
  const [, fresh] = await service.listAndCountInquiries({ status: "yeni" }, { take: 1 })
  res.json({ inquiries, count, new_count: fresh })
}
