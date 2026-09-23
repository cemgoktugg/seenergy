import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/** GET /admin/vitrin/options — brands and categories for the form selects. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const [{ data: brands }, { data: categories }] = await Promise.all([
    query.graph({ entity: "product_collection", fields: ["id", "title", "handle"] }),
    query.graph({ entity: "product_category", fields: ["id", "name", "handle", "rank"] }),
  ])
  res.json({
    brands: [...brands].sort((a, b) => a.title.localeCompare(b.title, "tr")),
    categories: [...categories].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0)),
  })
}
