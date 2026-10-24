import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { z } from "zod"

import { INQUIRY_MODULE } from "../../../modules/inquiry"
import type InquiryModuleService from "../../../modules/inquiry/service"
import { INQUIRY_TYPES } from "../../../modules/inquiry/types"

/**
 * POST /store/inquiries — a request from one of the storefront's forms
 * (iletişim, teklif, kurumsal, toptan, bayi, havale, kariyer). The storefront
 * validates too; this is the one that counts. Messages are Turkish: the
 * storefront shows them as they are.
 */
const Body = z.object({
  type: z.enum(Object.keys(INQUIRY_TYPES) as [keyof typeof INQUIRY_TYPES, ...(keyof typeof INQUIRY_TYPES)[]]),
  name: z.string().trim().min(2, "Adınızı ve soyadınızı girin.").max(120),
  email: z.string().trim().toLowerCase().email("Geçerli bir e-posta adresi girin.").max(200),
  phone: z.string().trim().max(40).optional(),
  company: z.string().trim().max(200).optional(),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().max(5000).optional(),
  data: z.record(z.string(), z.string().max(500)).optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = Body.safeParse(req.body)
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, parsed.error.issues[0]?.message ?? "Geçersiz istek.")
  }
  const service: InquiryModuleService = req.scope.resolve(INQUIRY_MODULE)
  const inquiry = await service.createInquiries({
    ...parsed.data,
    phone: parsed.data.phone || null,
    company: parsed.data.company || null,
    subject: parsed.data.subject || null,
    message: parsed.data.message || null,
    data: parsed.data.data ?? null,
    status: "yeni",
  })
  res.status(201).json({ id: inquiry.id })
}
