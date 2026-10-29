import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

import { describeReport, syncCatalogFromTicariCore } from "../../../../lib/ticaricore/catalog-sync"
import { ticaricoreConfig } from "../../../../lib/ticaricore/client"

/**
 * POST /admin/ticaricore/sync — "TicariCore'dan çek" in Ürün Yönetimi: the
 * same pass the 15-minute job runs, now, with its report. A pass already
 * running is joined rather than started twice.
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  if (!ticaricoreConfig()) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "NetHesap Online bağlantısı bu sunucuda ayarlı değil.")
  }
  const report = await syncCatalogFromTicariCore(req.scope)
  req.scope.resolve(ContainerRegistrationKeys.LOGGER).info(describeReport(report))
  res.json({ report })
}
