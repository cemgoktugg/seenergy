import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { ticaricoreConfig } from "../lib/ticaricore/client"
import { retryFailedOrders } from "../lib/ticaricore/order-export"

/** Every 10 minutes: orders whose transfer to TicariCore failed are tried
 *  again (lib/ticaricore/order-export.ts). */
export default async function ticaricoreOrdersJob(container: MedusaContainer) {
  if (!ticaricoreConfig()) return
  const results = await retryFailedOrders(container)
  if (!results.length) return
  const sent = results.filter((r) => r.status === "sent").length
  container
    .resolve(ContainerRegistrationKeys.LOGGER)
    .info(`TicariCore: ${results.length} bekleyen siparişten ${sent} tanesi aktarıldı.`)
}

export const config = {
  name: "ticaricore-orders",
  schedule: "*/10 * * * *",
}
