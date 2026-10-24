import { MedusaService } from "@medusajs/framework/utils"

import Inquiry from "./models/inquiry"

/** CRUD from MedusaService (createInquiries, listAndCountInquiries, …). */
class InquiryModuleService extends MedusaService({ Inquiry }) {}

export default InquiryModuleService
