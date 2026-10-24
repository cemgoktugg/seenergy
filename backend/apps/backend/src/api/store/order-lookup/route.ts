import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * GET /store/order-lookup?number=<display id>&email=<e-mail>
 *
 * Sipariş takibi for guests: the order number alone is guessable (it counts
 * up), so the e-mail the order was placed with must match too. On a match it
 * returns only the order's id — the storefront then shows the same order page
 * the confirmation link opens. A mismatch and a missing order answer alike.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const number = Number(String(req.query.number ?? "").replace(/\D/g, ""));
  const email = String(req.query.email ?? "").trim().toLowerCase();
  if (!number || !email) {
    res.status(400).json({ message: "Sipariş numarası ve e-posta gerekli." });
    return;
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "order",
    fields: ["id", "email"],
    // display_id is a number at runtime; the generated filter type only
    // offers strings, so the literal is cast rather than stringified.
    filters: { display_id: number } as never,
  });
  const order = data.find((row: { email?: string | null }) => (row.email ?? "").toLowerCase() === email);
  if (!order) {
    res.status(404).json({ message: "Bu bilgilerle bir sipariş bulunamadı." });
    return;
  }
  res.json({ id: order.id });
}
