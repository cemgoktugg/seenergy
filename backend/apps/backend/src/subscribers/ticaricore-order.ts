import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { exportOrderToTicariCore } from "../lib/ticaricore/order-export"

/**
 * A new order goes to TicariCore as soon as it is placed. A failure is kept
 * on the order (ticaricore_status: failed) and retried by the
 * ticaricore-orders job; it never affects the customer's checkout.
 */
export default async function ticaricoreOrder({ event, container }: SubscriberArgs<{ id: string }>) {
  const result = await exportOrderToTicariCore(container, event.data.id)
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  if (result.status === "sent") logger.info(`TicariCore: sipariş ${event.data.id} aktarıldı (${result.uid}).`)
  else if (result.status === "failed") logger.warn(`TicariCore: sipariş ${event.data.id} aktarılamadı — ${result.message}`)
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
