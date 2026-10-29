import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import {
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows"

import {
  createQuickProduct,
  listQuickProducts,
  patchQuickProduct,
  slugify,
  type QuickPatch,
  type QuickProduct,
} from "../quick-product"
import { revalidateStorefront } from "../storefront"
import {
  ticaricore,
  ticaricoreConfig,
  type CatalogCategory,
  type CatalogItem,
  type TicariCoreConfig,
} from "./client"

/**
 * TicariCore → Medusa: the "websitesi" sales channel's catalogue, in order
 * brands, categories, products.
 *
 * A full pass every time — the channel's snapshot (POST …/catalog/snapshots,
 * ready in about a second, then paged). TicariCore keeps an incremental change
 * feed only for a channel assigned to an integrator connection; until it is,
 * the snapshot is the only way in, and for a few hundred products a full
 * pass is cheap. Every write is skipped when nothing differs, so a quiet run
 * changes nothing and does not flush the storefront's cache.
 *
 * Scope is the channel: only the brands and categories its products use
 * (with a category's parents) come over — the tenant also holds unrelated
 * ones (an optician's "GÖZLÜK" / VENİTA) that must not reach this shop.
 *
 * Matching, never by Medusa id:
 *   brand     collection handle = slugify(name)        ("Seenergy" → seenergy)
 *   category  metadata.ticaricore_id, else handle = slugify(name)
 *             ("AHD sistem" → ahd-sistem, the storefront's own slug)
 *   product   metadata.ticaricore_uid, else variant SKU = product code
 *
 * Who owns what. TicariCore: price, sale price, stock, published, category,
 * brand. Medusa keeps what the ERP has thinner versions of — title,
 * description, pictures, spec sheet, datasheet — and only fills them when
 * empty (a new product takes them all from TicariCore). A product that leaves
 * the channel goes to draft; products TicariCore never knew stay untouched.
 */

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> }

export interface CatalogSyncReport {
  items: number
  brands: { linked: number; created: string[] }
  categories: { linked: number; created: string[] }
  products: { created: string[]; updated: string[]; unchanged: number; unpublished: string[] }
  skipped: { code: string; reason: string }[]
  failed: { code: string; message: string }[]
}

let running: Promise<CatalogSyncReport> | null = null

/** One pass at a time: the scheduled job and the admin button share it. */
export function syncCatalogFromTicariCore(container: MedusaContainer): Promise<CatalogSyncReport> {
  const config = ticaricoreConfig()
  if (!config) return Promise.reject(new Error("NetHesap Online bağlantısı ayarlı değil (TICARICORE_URL / _API_KEY / _CHANNEL_UID)."))
  running ??= run(container, config).finally(() => {
    running = null
  })
  return running
}

async function loadChannelItems(config: TicariCoreConfig): Promise<CatalogItem[]> {
  const base = `/channels/${config.channelUid}/catalog/snapshots`
  let snapshot = await ticaricore<{ snapshotUid: string; status: string; error: string }>(config, base, {
    method: "POST",
  })
  for (let wait = 0; snapshot.status !== "ready"; wait++) {
    if (snapshot.status === "failed" || wait >= 60) {
      throw new Error(`NetHesap Online ürün listesi hazırlanamadı: ${snapshot.error || snapshot.status}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
    snapshot = await ticaricore(config, `${base}/${snapshot.snapshotUid}`)
  }
  const items: CatalogItem[] = []
  let cursor: string | undefined
  do {
    const page = await ticaricore<{ items: CatalogItem[]; nextCursor: string | null; hasMore: boolean }>(
      config,
      `${base}/${snapshot.snapshotUid}/items`,
      { query: { pageSize: 500, cursor } }
    )
    items.push(...page.items)
    cursor = page.hasMore && page.nextCursor ? page.nextCursor : undefined
  } while (cursor)
  return items
}

/** "7468.38" → 7468.38; "", "0" or garbage → null. */
const amount = (value: string | null | undefined) => {
  const n = Number(value)
  return value && Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null
}

/** KDV-inclusive price and sale price. A compare-at price above the selling
 *  price is the struck-through "was" price: it becomes the price, and the
 *  selling price the sale price — the storefront's own discount display. */
function pricesOf(item: CatalogItem): { price: number | null; sale_price: number | null } {
  const selling = amount(item.priceInclVat)
  const was = amount(item.compareAtPrice)
  if (selling != null && was != null && was > selling) return { price: was, sale_price: selling }
  return { price: selling, sale_price: null }
}

const stockOf = (item: CatalogItem) => Math.max(0, Math.floor(Number(item.sellableQuantity) || 0))

/** TicariCore's pictures, stored through Medusa's file module like an admin
 *  upload, so the storefront serves (and resizes) them itself. */
async function uploadPictures(container: MedusaContainer, item: CatalogItem): Promise<string[]> {
  const files: { filename: string; mimeType: string; content: string; access: "public" }[] = []
  for (const [index, url] of (item.imageUrls ?? []).entries()) {
    const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
    if (!response.ok) continue
    const mimeType = response.headers.get("content-type")?.split(";")[0] || "image/webp"
    const extension = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "webp"
    files.push({
      filename: `${slugify(item.code)}${index ? `-${index + 1}` : ""}.${extension}`,
      mimeType,
      content: Buffer.from(await response.arrayBuffer()).toString("base64"),
      access: "public",
    })
  }
  if (!files.length) return []
  const { result } = await uploadFilesWorkflow(container).run({ input: { files } })
  return result.map((file) => file.url)
}

async function syncBrands(container: MedusaContainer, names: string[], report: CatalogSyncReport) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const byName = new Map<string, string>()
  const { data } = await query.graph({ entity: "product_collection", fields: ["id", "handle"] })
  const byHandle = new Map(data.map((c) => [c.handle as string, c.id as string]))
  for (const name of names) {
    const handle = slugify(name)
    let id = byHandle.get(handle)
    if (id) report.brands.linked++
    else {
      const { result } = await createCollectionsWorkflow(container).run({ input: { collections: [{ title: name, handle }] } })
      id = result[0].id
      byHandle.set(handle, id)
      report.brands.created.push(name)
    }
    byName.set(name, id)
  }
  return byName
}

async function syncCategories(
  container: MedusaContainer,
  config: TicariCoreConfig,
  usedIds: Set<number>,
  report: CatalogSyncReport
) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const { categories } = await ticaricore<{ categories: CatalogCategory[] }>(config, "/catalog/categories")
  const byId = new Map(categories.map((c) => [c.id, c]))

  // The used categories and every parent above them, parents first.
  const wanted = new Set<number>()
  for (const id of usedIds) {
    for (let c = byId.get(id); c && !wanted.has(c.id); c = byId.get(c.parentId)) wanted.add(c.id)
  }
  const depth = (c: CatalogCategory): number => (byId.has(c.parentId) ? 1 + depth(byId.get(c.parentId)!) : 0)
  const ordered = [...wanted].map((id) => byId.get(id)!).sort((a, b) => depth(a) - depth(b))

  const { data } = await query.graph({ entity: "product_category", fields: ["id", "handle", "metadata"] })
  const mapped = new Map<number, string>()
  for (const category of ordered) {
    const handle = slugify(category.name)
    const existing =
      data.find((c) => Number(c.metadata?.ticaricore_id) === category.id) ?? data.find((c) => c.handle === handle)
    if (existing) {
      mapped.set(category.id, existing.id)
      report.categories.linked++
      if (Number(existing.metadata?.ticaricore_id) !== category.id) {
        await updateProductCategoriesWorkflow(container).run({
          input: { selector: { id: existing.id }, update: { metadata: { ...existing.metadata, ticaricore_id: category.id } } },
        })
      }
      continue
    }
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          {
            name: category.name,
            handle,
            is_active: true,
            parent_category_id: mapped.get(category.parentId) ?? null,
            metadata: { ticaricore_id: category.id },
          },
        ],
      },
    })
    mapped.set(category.id, result[0].id)
    data.push(result[0])
    report.categories.created.push(category.name)
  }
  return mapped
}

async function run(container: MedusaContainer, config: TicariCoreConfig): Promise<CatalogSyncReport> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const report: CatalogSyncReport = {
    items: 0,
    brands: { linked: 0, created: [] },
    categories: { linked: 0, created: [] },
    products: { created: [], updated: [], unchanged: 0, unpublished: [] },
    skipped: [],
    failed: [],
  }

  const all = await loadChannelItems(config)
  report.items = all.length
  // One product, one model: variant rows of a multi-model card are not modelled yet.
  const items = all.filter((item) => {
    if (item.kind === "product" && !item.parentProductUid && item.code) return true
    report.skipped.push({ code: item.code || item.productUid, reason: "Varyantlı ürün kartı henüz aktarılmıyor." })
    return false
  })

  // 1. Brands, 2. categories — before any product points at them.
  const brands = await syncBrands(container, [...new Set(items.map((i) => i.brand?.trim()).filter((b): b is string => !!b))], report)
  const categories = await syncCategories(
    container,
    config,
    new Set(items.map((i) => i.categoryId).filter((id): id is number => !!id)),
    report
  )

  // 3. Products.
  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "description", "thumbnail", "metadata", "collection_id", "variants.sku"],
  })
  const byUid = new Map(products.filter((p) => p.metadata?.ticaricore_uid).map((p) => [p.metadata.ticaricore_uid as string, p]))
  const bySku = new Map<string, any>(
    products.flatMap((p) => (p.variants ?? []).filter((v: any) => v.sku).map((v: any): [string, any] => [v.sku, p]))
  )
  const linked = items
    .map((item) => byUid.get(item.productUid) ?? bySku.get(item.code))
    .filter(Boolean)
    .map((p) => p.id as string)
  const current: QuickProduct[] = linked.length
    ? (await listQuickProducts(container, { ids: linked, take: linked.length })).products
    : []
  const quickById = new Map(current.map((p) => [p.id, p]))

  for (const item of items) {
    try {
      const brandId = item.brand?.trim() ? brands.get(item.brand.trim()) : undefined
      const categoryId = item.categoryId ? categories.get(item.categoryId) : undefined
      const { price, sale_price } = pricesOf(item)
      const stock = stockOf(item)
      const product = byUid.get(item.productUid) ?? bySku.get(item.code)

      if (!product) {
        if (!brandId) {
          report.skipped.push({ code: item.code, reason: "NetHesap Online'da markası yok." })
          continue
        }
        const images = await uploadPictures(container, item)
        const created = await createQuickProduct(container, {
          title: item.name,
          description: item.description || null,
          status: "published",
          brand_id: brandId,
          category_id: categoryId ?? "",
          sku: item.code,
          price,
          sale_price,
          stock,
          images,
          instalment: false,
          list_keys: [],
        })
        await updateProductsWorkflow(container).run({
          input: {
            selector: { id: created.id },
            update: { metadata: { ticaricore_uid: item.productUid, ticaricore_code: item.code } } as any,
          },
        })
        report.products.created.push(item.code)
        continue
      }

      const quick = quickById.get(product.id)
      let changed = false
      const patch: QuickPatch = { id: product.id }
      if (quick?.price !== price) patch.price = price
      if ((quick?.sale_price ?? null) !== sale_price) patch.sale_price = sale_price
      if (quick?.stock !== stock) patch.stock = stock
      if (product.status !== "published") patch.status = "published"
      if (categoryId && quick?.category_id !== categoryId) patch.category_id = categoryId
      if (Object.keys(patch).length > 1) {
        await patchQuickProduct(container, patch)
        changed = true
      }

      const update: Record<string, unknown> = {}
      if (brandId && product.collection_id !== brandId) update.collection_id = brandId
      if (!product.description && item.description) update.description = item.description
      if (!product.thumbnail && item.imageUrls?.length) {
        const images = await uploadPictures(container, item)
        if (images.length) {
          update.thumbnail = images[0]
          update.images = images.map((url) => ({ url }))
        }
      }
      if (product.metadata?.ticaricore_uid !== item.productUid || product.metadata?.ticaricore_code !== item.code) {
        update.metadata = { ticaricore_uid: item.productUid, ticaricore_code: item.code }
      }
      if (Object.keys(update).length) {
        await updateProductsWorkflow(container).run({ input: { selector: { id: product.id }, update: update as any } })
        changed = true
      }
      if (changed) report.products.updated.push(item.code)
      else report.products.unchanged++
    } catch (error) {
      report.failed.push({ code: item.code, message: error instanceof Error ? error.message : String(error) })
    }
  }

  // 4. Left the channel → draft. An empty channel is far likelier a setup
  //    mistake than "sell nothing", so it never empties the shop.
  if (items.length) {
    const inChannel = new Set(items.map((i) => i.productUid))
    for (const product of products) {
      const uid = product.metadata?.ticaricore_uid
      if (!uid || inChannel.has(uid) || product.status !== "published") continue
      try {
        await patchQuickProduct(container, { id: product.id, status: "draft" })
        report.products.unpublished.push(product.metadata?.ticaricore_code ?? product.title)
      } catch (error) {
        report.failed.push({ code: product.title, message: error instanceof Error ? error.message : String(error) })
      }
    }
  }

  const touched =
    report.brands.created.length +
    report.categories.created.length +
    report.products.created.length +
    report.products.updated.length +
    report.products.unpublished.length
  if (touched) revalidateStorefront(["catalog", "vitrin"])
  return report
}

/** One line for the log. */
export function describeReport(r: CatalogSyncReport): string {
  const list = (label: string, names: string[]) => (names.length ? `; ${label}: ${names.join(", ")}` : "")
  return (
    `NetHesap Online: ${r.items} ürün kanalda — ${r.products.created.length} yeni, ${r.products.updated.length} güncellendi, ` +
    `${r.products.unchanged} değişmedi, ${r.products.unpublished.length} yayından kalktı` +
    list("yeni marka", r.brands.created) +
    list("yeni kategori", r.categories.created) +
    (r.skipped.length ? `; atlandı: ${r.skipped.map((s) => `${s.code} (${s.reason})`).join(", ")}` : "") +
    (r.failed.length ? `; hata: ${r.failed.map((f) => `${f.code} (${f.message})`).join(", ")}` : "")
  )
}
