import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

import { describeReport, syncCatalogFromTicariCore } from "../lib/ticaricore/catalog-sync"

/** `npx medusa exec ./src/scripts/ticaricore-sync.ts` — one TicariCore pass
 *  from the command line, the same as the admin's "TicariCore'dan çek". */
export default async function ticaricoreSync({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const report = await syncCatalogFromTicariCore(container)
  logger.info(describeReport(report))
  logger.info(JSON.stringify(report, null, 2))
}
