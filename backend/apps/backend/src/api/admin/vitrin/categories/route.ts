import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

import { slugify } from "../../../../lib/quick-product"
import { revalidateStorefront } from "../../../../lib/storefront"
import { CategoryCreate, firstIssue } from "../validators"

/**
 * POST /admin/vitrin/categories — a new category, from Ürün Yönetimi's tree
 * (2026-11-03, the client: "kategori kısmına ekleme ya da silme").
 *
 * Top-level, or a subcategory of a top-level one: the storefront's menu draws
 * two levels, so a third is refused rather than created and never shown. It
 * goes last among its siblings, active and public, so the storefront's menu,
 * footer and /kategori list it as soon as the cache is flushed. The handle —
 * the storefront's route — is the name's slug, made unique.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = CategoryCreate.safeParse(req.body)
  if (!parsed.success) throw new MedusaError(MedusaError.Types.INVALID_DATA, firstIssue(parsed.error))
  const name = parsed.data.name.trim()
  const parentId = parsed.data.parent_id || null

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: categories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "handle", "rank", "is_active", "parent_category_id"],
  })

  if (parentId) {
    const parent = categories.find((c) => c.id === parentId)
    if (!parent || !parent.is_active) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Üst kategori bulunamadı.")
    if (parent.parent_category_id)
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "Alt kategorinin altına kategori eklenemez — sitede iki seviye gösterilir.")
  }

  const siblings = categories.filter((c) => c.is_active && (c.parent_category_id ?? null) === parentId)
  const fold = (value: string) => value.toLocaleLowerCase("tr").trim()
  if (siblings.some((c) => fold(c.name) === fold(name)))
    throw new MedusaError(MedusaError.Types.DUPLICATE_ERROR, `“${name}” adında bir kategori burada zaten var.`)

  const base = slugify(name) || "kategori"
  const taken = new Set(categories.map((c) => c.handle))
  let handle = base
  for (let n = 2; taken.has(handle); n++) handle = `${base}-${n}`

  const rank = siblings.reduce((max, c) => Math.max(max, Number(c.rank ?? 0)), -1) + 1
  const { result } = await createProductCategoriesWorkflow(req.scope).run({
    input: {
      product_categories: [
        { name, handle, rank, is_active: true, is_internal: false, parent_category_id: parentId },
      ],
    },
  })

  revalidateStorefront(["catalog"])
  res.json({ category: { id: result[0].id, name, handle, parent_id: parentId, rank } })
}
