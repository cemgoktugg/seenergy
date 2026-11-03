import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { deleteProductCategoriesWorkflow, updateProductsWorkflow } from "@medusajs/medusa/core-flows"

import { revalidateStorefront } from "../../../../../lib/storefront"

/**
 * DELETE /admin/vitrin/categories/:id — remove a category from Ürün
 * Yönetimi's tree.
 *
 * A category with subcategories is refused: those go first. One with products
 * (drafts too) is deleted only when the request says where they go —
 * `?urunler=<category id>` moves them there, `?urunler=kategorisiz` leaves them
 * without a category (still published, on no category page). Without it the
 * answer is a 409 naming the count, so nobody empties a category by accident.
 * A product's other categories are kept.
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "category_children.id", "products.id", "products.categories.id"],
    filters: { id: req.params.id },
  })
  const category = data[0]
  if (!category) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Kategori bulunamadı.")

  const children = (category.category_children ?? []).filter(Boolean).length
  if (children > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `“${category.name}” kategorisinin ${children} alt kategorisi var. Önce onları silin.`,
    )

  const products = (category.products ?? []).filter((p): p is NonNullable<typeof p> => Boolean(p))
  const target = typeof req.query.urunler === "string" ? req.query.urunler : ""
  if (products.length > 0) {
    if (!target)
      throw new MedusaError(
        MedusaError.Types.CONFLICT,
        `“${category.name}” kategorisinde ${products.length} ürün var (taslaklar dahil). Ürünlerin nereye taşınacağını seçin.`,
      )
    let moveTo: string | null = null
    if (target !== "kategorisiz") {
      if (target === category.id) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Ürünler silinen kategoriye taşınamaz.")
      const { data: found } = await query.graph({
        entity: "product_category",
        fields: ["id", "is_active"],
        filters: { id: target },
      })
      if (!found[0]?.is_active) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Taşınacak kategori bulunamadı.")
      moveTo = target
    }
    for (const product of products) {
      const kept = (product.categories ?? []).map((c) => c?.id).filter((id): id is string => Boolean(id) && id !== category.id)
      const category_ids = moveTo && !kept.includes(moveTo) ? [moveTo, ...kept] : kept
      await updateProductsWorkflow(req.scope).run({ input: { selector: { id: product.id }, update: { category_ids } } })
    }
  }

  await deleteProductCategoriesWorkflow(req.scope).run({ input: [category.id] })
  revalidateStorefront(["catalog"])
  res.json({ id: category.id, deleted: true, moved: products.length })
}
