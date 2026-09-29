import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * GET /admin/vitrin/options — brands and categories for the form selects.
 *
 * Categories: active ones only (the retired pre-2026-09 categories are kept
 * inactive, not deleted — see migration-scripts/security-category-tree.ts),
 * each with a `label` that names its parent ("CCTV Güvenlik Sistemleri › AHD
 * Sistem"), sorted by that label so every subcategory follows its parent.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const [{ data: brands }, { data: categories }] = await Promise.all([
    query.graph({ entity: "product_collection", fields: ["id", "title", "handle"] }),
    query.graph({
      entity: "product_category",
      fields: ["id", "name", "handle", "rank", "is_active", "parent_category_id"],
    }),
  ])
  const active = categories.filter((c) => c.is_active)
  const names = new Map(active.map((c) => [c.id, c.name as string]))
  res.json({
    brands: [...brands].sort((a, b) => a.title.localeCompare(b.title, "tr")),
    categories: active
      .map((c) => ({
        id: c.id,
        name: c.name,
        handle: c.handle,
        label: c.parent_category_id && names.has(c.parent_category_id) ? `${names.get(c.parent_category_id)} › ${c.name}` : c.name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "tr")),
  })
}
