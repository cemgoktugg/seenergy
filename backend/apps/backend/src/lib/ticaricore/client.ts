/**
 * TicariCore (NetHesap) — the client's ERP, and the source of truth for what
 * the shop sells: products, prices, stock, brands and categories come from
 * there; Medusa is the sales channel.
 *
 * REST at `<TICARICORE_URL>/api/v1`, `Authorization: Bearer <key>`; the
 * tenant is resolved from the host. Errors come back as
 * `{ code, message, details }` with Turkish messages, passed on as they are.
 *
 * The key lives only in the environment (backend .env / Dokploy), never in
 * code. Unset = the integration is off and every caller does nothing.
 */

export interface TicariCoreConfig {
  url: string
  key: string
  channelUid: string
}

export function ticaricoreConfig(): TicariCoreConfig | null {
  const url = process.env.TICARICORE_URL?.replace(/\/+$/, "")
  const key = process.env.TICARICORE_API_KEY
  const channelUid = process.env.TICARICORE_CHANNEL_UID
  if (!url || !key || !channelUid) return null
  return { url, key, channelUid }
}

export class TicariCoreError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message)
  }
}

export async function ticaricore<T>(
  config: TicariCoreConfig,
  path: string,
  init: {
    method?: string
    body?: unknown
    query?: Record<string, string | number | undefined>
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const url = new URL(`${config.url}/api/v1${path}`)
  for (const [name, value] of Object.entries(init.query ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(name, String(value))
  }
  const response = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      authorization: `Bearer ${config.key}`,
      accept: "application/json",
      ...(init.body !== undefined ? { "content-type": "application/json" } : {}),
      ...init.headers,
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(30_000),
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new TicariCoreError(
      response.status,
      data?.code ?? "unknown",
      `TicariCore ${path}: ${data?.message ?? response.statusText}`
    )
  }
  return data as T
}

/** One sellable row of a channel's catalogue, as the snapshot and the change
 *  feed both deliver it. Amounts and quantities are decimal strings; "" = none. */
export interface CatalogItem {
  catalogProductUid: string
  productUid: string
  parentProductUid: string | null
  kind: string
  code: string
  name: string
  description: string
  brand: string | null
  categoryId: number | null
  imageUrls: string[] | null
  vatRate: string
  priceInclVat: string
  compareAtPrice: string
  sellableQuantity: string
}

export interface CatalogCategory {
  id: number
  parentId: number
  name: string
}
