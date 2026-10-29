import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils"

import { ticaricoreConfig } from "../../../../../lib/ticaricore/client"
import { exportOrderToTicariCore } from "../../../../../lib/ticaricore/order-export"

/** GET — the order's TicariCore state, for the widget on the order page. */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({ entity: "order", fields: ["id", "metadata"], filters: { id: req.params.id } })
  if (!data[0]) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Sipariş bulunamadı.")
  const meta = (data[0].metadata ?? {}) as Record<string, unknown>
  res.json({
    configured: !!ticaricoreConfig(),
    status: (meta.ticaricore_status as string) || null,
    uid: (meta.ticaricore_order_uid as string) || null,
    error: (meta.ticaricore_error as string) || null,
    attempts: Number(meta.ticaricore_attempts ?? 0),
    sent_at: (meta.ticaricore_sent_at as string) || null,
  })
}

/** POST — send it now ("TicariCore'a gönder"); also restarts the automatic
 *  retries of an order that used them up. */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!ticaricoreConfig()) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "TicariCore bağlantısı bu sunucuda ayarlı değil.")
  }
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({ entity: "order", fields: ["id", "metadata"], filters: { id: req.params.id } })
  if (!data[0]) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Sipariş bulunamadı.")
  if (Number((data[0].metadata as any)?.ticaricore_attempts ?? 0) >= 12) {
    const orders = req.scope.resolve(Modules.ORDER) as any
    await orders.updateOrders([{ id: req.params.id, metadata: { ...(data[0].metadata ?? {}), ticaricore_attempts: 0 } }])
  }
  const result = await exportOrderToTicariCore(req.scope, req.params.id)
  if (result.status === "failed") throw new MedusaError(MedusaError.Types.INVALID_DATA, result.message ?? "Aktarılamadı.")
  res.json(result)
}
