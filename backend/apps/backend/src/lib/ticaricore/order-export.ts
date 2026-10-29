import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import { ticaricore, ticaricoreConfig, TicariCoreError, type TicariCoreConfig } from "./client"

/**
 * Medusa → TicariCore: a placed order becomes a sales order in the ERP
 * (POST /orders/import, "Sipariş Aktarımı"), where invoicing, e-Arşiv /
 * e-Fatura and shipping happen.
 *
 * The body is built from the order, then priced by TicariCore itself
 * (POST /orders/import/calculate) — the import refuses totals it did not
 * compute. Its payable amount must equal the order's total to the kuruş, or
 * nothing is sent: a mismatch means the two systems disagree on a price or
 * the VAT, and a person has to look.
 *
 *   lines      productCode = variant SKU, KDV-inclusive unit price
 *   shipping   a document-level charge (entryMode 2 = an amount), KDV-inclusive
 *   discount   a document-level allowance, when a promotion applied
 *   buyer      kurumsal: firm, tax office, VKN; bireysel: the name, and
 *              11111111111 — the e-Arşiv placeholder for a buyer with no TCKN
 *   payment    a note only (TicariCore's "payments" needs a cash account code,
 *              and a declaration there records no collection anyway)
 *
 * State lives on the order's metadata: ticaricore_status (sent | failed),
 * ticaricore_order_uid, ticaricore_error, ticaricore_attempts. Only orders
 * that were tried get retried — orders from before the integration are never
 * sent by themselves; the admin's order widget can send one by hand.
 *
 * Duplicates: clientUid and customerRef never change for an order, and
 * TicariCore answers a repeat with the existing order. The Idempotency-Key
 * changes only after a definite rejection (4xx), because TicariCore stores a
 * 4xx under its key and would replay it after the cause has been fixed.
 */

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> }

const PAYMENT_LABELS: Record<string, string> = { havale: "Havale / EFT", kapida: "Kapıda Ödeme" }
/** e-Arşiv's stand-in TCKN for a consumer who gave none. */
const NO_TCKN = "11111111111"

const ORDER_FIELDS = [
  "id",
  "display_id",
  "status",
  "email",
  "created_at",
  "currency_code",
  "total",
  "shipping_total",
  "discount_total",
  "metadata",
  "items.quantity",
  "items.unit_price",
  "items.variant_sku",
  "items.product_title",
  "items.title",
  "items.tax_lines.rate",
  "shipping_address.*",
  "billing_address.*",
  "shipping_methods.name",
]

const money = (value: unknown) => (Math.round(Number(value ?? 0) * 100) / 100).toFixed(2)

let channel: { id: number; code: string } | null = null
async function salesChannel(config: TicariCoreConfig) {
  if (channel) return channel
  const context = await ticaricore<{ channels: { id: number; uid: string; code: string }[] }>(
    config,
    "/integration/context"
  )
  const found = context.channels.find((c) => c.uid === config.channelUid)
  if (!found) throw new Error("TicariCore satış kanalı bu bağlantıya atanmamış.")
  channel = { id: found.id, code: found.code }
  return channel
}

function addressLine(a: any) {
  return [a?.address_1, a?.address_2].filter(Boolean).join(" ")
}

function buildBody(order: any, salesChannelCode: string) {
  const meta = order.metadata ?? {}
  const ship = order.shipping_address ?? {}
  const bill = order.billing_address ?? ship
  const corporate = meta.invoice_type === "kurumsal"
  const name = [bill.first_name, bill.last_name].filter(Boolean).join(" ")
  const prefix = process.env.TICARICORE_ORDER_PREFIX ?? "WEB-"
  const payment = PAYMENT_LABELS[meta.payment_method as string] ?? "Belirtilmedi"
  const shipping = Number(order.shipping_total ?? 0)
  const discount = Number(order.discount_total ?? 0)

  return {
    clientUid: `seenergy-${order.id}`,
    calcVersion: 1,
    orderSource: "website",
    salesChannelCode,
    customerRef: `${prefix}${order.display_id}`,
    issueDate: new Date(order.created_at).toLocaleDateString("sv-SE", { timeZone: "Europe/Istanbul" }),
    curCode: "TL",
    exchRate: "1",
    vatIncluded: true,
    partnerName: corporate && bill.company ? bill.company : name,
    compName: corporate ? (bill.company ?? "") : "",
    taxNumber: corporate ? String(meta.tax_number ?? "") : NO_TCKN,
    taxOffice: corporate ? String(meta.tax_office ?? "") : "",
    phone: bill.phone ?? ship.phone ?? "",
    email: order.email ?? "",
    invoiceAddress: addressLine(bill),
    invoiceDistrict: bill.city ?? "",
    invoiceCity: bill.province ?? "",
    invoiceCountry: "Türkiye",
    invoicePostalCode: bill.postal_code ?? "",
    despatchName: [ship.first_name, ship.last_name].filter(Boolean).join(" "),
    despatchAddress: addressLine(ship),
    despatchDistrict: ship.city ?? "",
    despatchCity: ship.province ?? "",
    despatchCountry: "Türkiye",
    despatchPostalCode: ship.postal_code ?? "",
    shippingFee: money(shipping),
    shippingNote: order.shipping_methods?.[0]?.name ?? "",
    docNote: [`Web sitesi siparişi #${order.display_id}`, `Ödeme: ${payment}`, meta.customer_note]
      .filter(Boolean)
      .join(" · ")
      .slice(0, 500),
    notes: [{ title: "Ödeme yöntemi", note: payment }],
    payments: [],
    lines: (order.items ?? []).map((item: any, index: number) => ({
      productCode: item.variant_sku ?? "",
      productName: item.product_title ?? item.title ?? "",
      quantity: String(item.quantity),
      unit: "Adet",
      multiply: "1",
      price: money(item.unit_price),
      curCode: "TL",
      exchRate: "1",
      discountAmount: "0",
      vatRate: String(item.tax_lines?.[0]?.rate ?? 20),
      allocationSequence: index + 1,
    })),
    allowanceCharges: [
      ...(shipping > 0 ? [{ isCharge: true, entryMode: 2, amount: money(shipping), reason: "Kargo" }] : []),
      ...(discount > 0 ? [{ isCharge: false, entryMode: 2, amount: money(discount), reason: "İndirim" }] : []),
    ],
  }
}

async function saveState(container: MedusaContainer, order: any, state: Record<string, unknown>) {
  const orders = container.resolve(Modules.ORDER) as any
  await orders.updateOrders([{ id: order.id, metadata: { ...(order.metadata ?? {}), ...state } }])
}

export interface ExportResult {
  status: "sent" | "failed" | "skipped"
  uid?: string
  message?: string
}

const inFlight = new Set<string>()

export async function exportOrderToTicariCore(container: MedusaContainer, orderId: string): Promise<ExportResult> {
  const config = ticaricoreConfig()
  if (!config) return { status: "skipped", message: "TicariCore bağlantısı ayarlı değil." }
  if (inFlight.has(orderId)) return { status: "skipped", message: "Bu sipariş şu anda gönderiliyor." }
  inFlight.add(orderId)
  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
    const { data } = await query.graph({ entity: "order", fields: ORDER_FIELDS, filters: { id: orderId } })
    const order = data[0]
    if (!order) return { status: "skipped", message: "Sipariş bulunamadı." }
    const meta = order.metadata ?? {}
    if (meta.ticaricore_order_uid) return { status: "sent", uid: meta.ticaricore_order_uid }
    if (order.status === "canceled") return { status: "skipped", message: "Sipariş iptal edilmiş." }

    const attempts = Number(meta.ticaricore_attempts ?? 0)
    const rejections = Number(meta.ticaricore_rejections ?? 0)
    try {
      const { code } = await salesChannel(config)
      const body = buildBody(order, code)
      const preview = await ticaricore<{ totals: Record<string, string>; lines: { taxInclAmount: string }[] }>(config, "/orders/import/calculate", {
        method: "POST",
        body,
      })
      const totals = preview.totals
      if (Math.abs(Number(totals.payableAmount) - Number(order.total)) > 0.01) {
        throw new TicariCoreError(
          422,
          "amount_mismatch",
          `Tutar tutmuyor: sitede ${money(order.total)} TL, TicariCore ${totals.payableAmount} TL hesapladı.`
        )
      }
      const result = await ticaricore<{ uid: string; existing?: boolean }>(config, "/orders/import", {
        method: "POST",
        body: {
          ...body,
          ...totals,
          // Lines before the document-level charge / allowance, as in TicariCore's example.
          taxIncTotalAmount: money(preview.lines.reduce((sum, line) => sum + Number(line.taxInclAmount), 0)),
          docAmount: totals.taxIncAmount,
        },
        headers: { "idempotency-key": `seenergy-${order.id}-${rejections}` },
      })
      await saveState(container, order, {
        ticaricore_status: "sent",
        ticaricore_order_uid: result.uid,
        ticaricore_error: "",
        ticaricore_attempts: attempts + 1,
        ticaricore_sent_at: new Date().toISOString(),
      })
      return { status: "sent", uid: result.uid }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      // A definite rejection gets a fresh HTTP key next time; a timeout or a
      // 5xx keeps the same one, so a request that did land is not doubled.
      const definite = error instanceof TicariCoreError && error.status >= 400 && error.status < 500
      await saveState(container, order, {
        ticaricore_status: "failed",
        ticaricore_error: message.slice(0, 500),
        ticaricore_attempts: attempts + 1,
        ticaricore_rejections: rejections + (definite ? 1 : 0),
      })
      return { status: "failed", message }
    }
  } finally {
    inFlight.delete(orderId)
  }
}

/** Orders tried and not yet in TicariCore, newest first, within two weeks;
 *  one that failed 12 times (two hours) waits for the admin's button. */
export async function retryFailedOrders(container: MedusaContainer) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const since = new Date(Date.now() - 14 * 24 * 3600 * 1000)
  const { data } = await query.graph({
    entity: "order",
    fields: ["id", "status", "metadata"],
    filters: { created_at: { $gte: since } },
    pagination: { take: 500, order: { created_at: "DESC" } },
  })
  const due = data.filter(
    (o) =>
      o.status !== "canceled" &&
      o.metadata?.ticaricore_status === "failed" &&
      Number(o.metadata?.ticaricore_attempts ?? 0) < 12
  )
  const results: ExportResult[] = []
  for (const order of due) results.push(await exportOrderToTicariCore(container, order.id))
  return results
}
