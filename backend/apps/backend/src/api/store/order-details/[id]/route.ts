import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

/**
 * GET /store/order-details/:id
 *
 * The storefront stores the checkout's payment method and invoice type on the
 * order's metadata, but the core Store API never returns order metadata. This
 * route exposes exactly those customer-facing keys — nothing else in metadata
 * (tax number, notes, anything an admin adds later) leaves the backend.
 *
 * Access matches GET /store/orders/:id: the publishable key plus the order's
 * unguessable id.
 */

const PUBLIC_KEYS = ["payment_method", "invoice_type"] as const;

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: ["id", "metadata"],
    filters: { id: req.params.id },
  });

  if (!order) {
    res.status(404).json({ message: "Order not found" });
    return;
  }

  const metadata = (order.metadata ?? {}) as Record<string, unknown>;
  res.json({
    details: Object.fromEntries(
      PUBLIC_KEYS.map((key) => [key, typeof metadata[key] === "string" ? metadata[key] : null])
    ),
  });
}
