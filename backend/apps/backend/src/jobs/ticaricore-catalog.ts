import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { ticaricoreConfig } from "../lib/ticaricore/client"
import { describeReport, syncCatalogFromTicariCore } from "../lib/ticaricore/catalog-sync"

/**
 * TicariCore → Medusa every 15 minutes: brands, categories, then products
 * with their prices and stock (see lib/ticaricore/catalog-sync.ts). Without
 * the TICARICORE_* environment the job does nothing.
 */
export default async function ticaricoreCatalogJob(container: MedusaContainer) {
  if (!ticaricoreConfig()) return
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  try {
    logger.info(describeReport(await syncCatalogFromTicariCore(container)))
  } catch (error) {
    logger.error(`NetHesap Online ürün aktarımı başarısız: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export const config = {
  name: "ticaricore-catalog",
  schedule: "*/15 * * * *",
}
