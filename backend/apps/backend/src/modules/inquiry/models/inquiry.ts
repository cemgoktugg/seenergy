import { model } from "@medusajs/framework/utils"

/**
 * A request a visitor left on the storefront: a contact message, a price
 * quote, a wholesale or dealer application, a bank-transfer notice, a job
 * application… (2026-10-24). There is no e-mail provider, so these are kept
 * in Medusa and worked through in admin → Talepler.
 *
 * `type` picks the form it came from (see ../types.ts); `data` holds that
 * form's own fields (product code, order number, amount, city…).
 */
const Inquiry = model.define("inquiry", {
  id: model.id({ prefix: "inq" }).primaryKey(),
  type: model.text().index(),
  status: model.text().default("yeni").index(),
  name: model.text(),
  email: model.text(),
  phone: model.text().nullable(),
  company: model.text().nullable(),
  subject: model.text().nullable(),
  message: model.text().nullable(),
  data: model.json().nullable(),
  /** The shop's own working note; never shown to the visitor. */
  note: model.text().nullable(),
})

export default Inquiry
