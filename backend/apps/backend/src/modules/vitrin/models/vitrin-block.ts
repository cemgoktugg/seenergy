import { model } from "@medusajs/framework/utils"

/**
 * One editable piece of the storefront's design: a hero slide, a banner, a
 * brand showcase, the announcement bar…
 *
 * `group` says which part of the page it belongs to and fixes the shape of
 * `data` (see ../types.ts). `key` names a fixed slot ("wide", "dual-1") where
 * the design has exactly one; repeatable groups (slides, brand bands) leave it
 * null and are ordered by `rank`.
 */
const VitrinBlock = model.define("vitrin_block", {
  id: model.id({ prefix: "vblk" }).primaryKey(),
  group: model.text().index(),
  key: model.text().nullable(),
  rank: model.number().default(0),
  is_active: model.boolean().default(true),
  data: model.json(),
})

export default VitrinBlock
