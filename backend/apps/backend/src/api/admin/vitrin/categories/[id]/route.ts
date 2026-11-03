import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { deleteProductCategoriesWorkflow } from "@medusajs/medusa/core-flows"

import { revalidateStorefront } from "../../../../../lib/storefront"

/**
 * DELETE /admin/vitrin/categories/:id — remove a category from Ürün
 * Yönetimi's tree.
 *
 * Only an empty one: a category with products (drafts too) or with
 * subcategories is refused, and the answer says what to move first. Deleting
 * it with its products would leave them uncategorised and invisible on every
 * category page without anyone having decided that.
 */
export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "product_category",
    fields: ["id", "name", "category_children.id", "products.id"],
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
  const products = (category.products ?? []).filter(Boolean).length
  if (products > 0)
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `“${category.name}” kategorisinde ${products} ürün var (taslaklar dahil). Önce ürünleri başka bir kategoriye taşıyın.`,
    )

  await deleteProductCategoriesWorkflow(req.scope).run({ input: [category.id] })
  revalidateStorefront(["catalog"])
  res.json({ id: category.id, deleted: true })
}
