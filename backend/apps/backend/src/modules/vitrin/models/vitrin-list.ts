import { model } from "@medusajs/framework/utils"

/**
 * A curated, ordered product list — "Haftanın Ürünleri", "Yeni Gelenler"…
 *
 * `key` is what the storefront asks for; `product_ids` is the order the shop
 * chose, first to last. Ids are stored rather than linked because the list is
 * editorial: a product that is deleted or unpublished simply drops out when
 * the storefront resolves the ids, and the list does not need a migration.
 */
const VitrinList = model.define("vitrin_list", {
  id: model.id({ prefix: "vlist" }).primaryKey(),
  key: model.text().unique(),
  title: model.text(),
  description: model.text().nullable(),
  product_ids: model.array(),
})

export default VitrinList
