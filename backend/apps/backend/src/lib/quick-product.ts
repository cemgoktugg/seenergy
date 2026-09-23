import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, MedusaError, ProductStatus } from "@medusajs/framework/utils"
import {
  batchPriceListPricesWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  updateInventoryLevelsWorkflow,
  updateProductsWorkflow,
  updateProductVariantsWorkflow,
} from "@medusajs/medusa/core-flows"

import { VITRIN_MODULE } from "../modules/vitrin"
import type VitrinModuleService from "../modules/vitrin/service"

/**
 * "Hızlı ürün" — a SEENERGY product as one flat form.
 *
 * Medusa models a product as product + option + variant + price set + price
 * list prices + inventory item + inventory level + sales channel link. Every
 * SEENERGY product is a single model with one TRY price, an optional sale
 * price, and stock in one warehouse, so the admin form only needs the fields
 * a shop person thinks in. This file translates between the two.
 */

export const BADGES = ["yeni", "super-firsat", "cok-satan"] as const
export type Badge = (typeof BADGES)[number]

export interface QuickProductInput {
  title: string
  description?: string | null
  status: "published" | "draft"
  /** Existing brand (collection) id … */
  brand_id?: string | null
  /** … or the name of a new brand to create. */
  new_brand?: string | null
  category_id: string
  sku?: string | null
  price: number
  sale_price?: number | null
  stock: number
  image?: string | null
  badge?: Badge | null
  instalment: boolean
  /** Vitrin lists this product should appear in. */
  list_keys: string[]
}

export interface QuickProduct {
  id: string
  variant_id: string
  title: string
  handle: string
  description: string | null
  status: string
  brand_id: string | null
  brand: string | null
  category_id: string | null
  category: string | null
  sku: string | null
  price: number | null
  sale_price: number | null
  stock: number
  image: string | null
  badge: Badge | null
  instalment: boolean
  list_keys: string[]
  updated_at: string
}

const SALE_LIST_TITLE = "İndirimli Fiyatlar"

export const slugify = (value: string) =>
  value
    .toLocaleLowerCase("tr")
    .replaceAll("ı", "i")
    .replaceAll("ğ", "g")
    .replaceAll("ü", "u")
    .replaceAll("ş", "s")
    .replaceAll("ö", "o")
    .replaceAll("ç", "c")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

const FIELDS = [
  "id",
  "title",
  "handle",
  "description",
  "status",
  "thumbnail",
  "metadata",
  "updated_at",
  "collection.id",
  "collection.title",
  "categories.id",
  "categories.name",
  "variants.id",
  "variants.sku",
  "variants.prices.id",
  "variants.prices.amount",
  "variants.prices.currency_code",
  "variants.prices.price_set_id",
  "variants.inventory_items.inventory_item_id",
  "variants.inventory_items.inventory.location_levels.location_id",
  "variants.inventory_items.inventory.location_levels.stocked_quantity",
]

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[]; metadata?: { count?: number } }> }

async function saleListPrices(query: Query) {
  const { data } = await query.graph({
    entity: "price_list",
    fields: ["id", "title", "prices.id", "prices.amount", "prices.currency_code", "prices.price_set_id"],
    filters: { title: SALE_LIST_TITLE },
  })
  const list = data[0]
  if (!list) throw new MedusaError(MedusaError.Types.NOT_FOUND, `"${SALE_LIST_TITLE}" fiyat listesi bulunamadı.`)
  return {
    id: list.id as string,
    bySet: new Map<string, { id: string; amount: number }>(
      (list.prices ?? [])
        .filter((p: any) => p.currency_code === "try")
        .map((p: any) => [p.price_set_id, { id: p.id, amount: Number(p.amount) }])
    ),
  }
}

function toQuick(
  product: any,
  sale: Map<string, { id: string; amount: number }>,
  lists: { key: string; product_ids: string[] }[]
): QuickProduct {
  const variant = product.variants?.[0] ?? {}
  const base = (variant.prices ?? []).find((p: any) => p.currency_code === "try")
  const levels = variant.inventory_items?.[0]?.inventory?.location_levels ?? []
  const meta = product.metadata ?? {}
  return {
    id: product.id,
    variant_id: variant.id,
    title: product.title,
    handle: product.handle,
    description: product.description ?? null,
    status: product.status,
    brand_id: product.collection?.id ?? null,
    brand: product.collection?.title ?? (typeof meta.brand === "string" ? meta.brand : null),
    category_id: product.categories?.[0]?.id ?? null,
    category: product.categories?.[0]?.name ?? null,
    sku: variant.sku ?? null,
    price: base ? Number(base.amount) : null,
    sale_price: base ? sale.get(base.price_set_id)?.amount ?? null : null,
    stock: levels.reduce((sum: number, level: any) => sum + Number(level.stocked_quantity ?? 0), 0),
    image: product.thumbnail ?? null,
    badge: BADGES.includes(meta.badge) ? meta.badge : null,
    instalment: meta.instalment === true,
    list_keys: lists.filter((l) => l.product_ids.includes(product.id)).map((l) => l.key),
    updated_at: product.updated_at,
  }
}

export async function listQuickProducts(
  container: MedusaContainer,
  { q, take = 20, skip = 0, ids }: { q?: string; take?: number; skip?: number; ids?: string[] }
): Promise<{ products: QuickProduct[]; count: number }> {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE)
  const filters: Record<string, unknown> = {}
  if (q) filters.q = q
  if (ids) filters.id = ids

  const [{ data, metadata }, sale, lists] = await Promise.all([
    query.graph({
      entity: "product",
      fields: FIELDS,
      filters,
      pagination: { take, skip, order: { created_at: "DESC" } },
    }),
    saleListPrices(query),
    vitrin.listVitrinLists({}, { select: ["key", "product_ids"] }),
  ])
  return {
    products: data.map((p) => toQuick(p, sale.bySet, lists)),
    count: metadata?.count ?? data.length,
  }
}

export async function getQuickProduct(container: MedusaContainer, id: string): Promise<QuickProduct> {
  const { products } = await listQuickProducts(container, { ids: [id], take: 1 })
  if (!products[0]) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Ürün bulunamadı.")
  return products[0]
}

/** Validate the numbers a person can get wrong, in their language. */
function checkInput(input: QuickProductInput) {
  if (input.title.trim().length < 3) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Ürün adı en az 3 karakter olmalı.")
  }
  if (!(input.price > 0)) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Fiyat 0'dan büyük olmalı.")
  if (input.sale_price != null && !(input.sale_price > 0 && input.sale_price < input.price)) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "İndirimli fiyat, normal fiyattan düşük ve 0'dan büyük olmalı."
    )
  }
  if (!Number.isInteger(input.stock) || input.stock < 0) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Stok 0 veya daha büyük bir tam sayı olmalı.")
  }
  if (!input.brand_id && !input.new_brand?.trim()) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Bir marka seçin veya yeni marka adı yazın.")
  }
}

async function resolveBrand(container: MedusaContainer, input: QuickProductInput) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const name = input.new_brand?.trim()
  if (name) {
    const handle = slugify(name)
    const { data } = await query.graph({ entity: "product_collection", fields: ["id", "title"], filters: { handle } })
    if (data[0]) return { id: data[0].id as string, title: data[0].title as string }
    const { result } = await createCollectionsWorkflow(container).run({
      input: { collections: [{ title: name, handle }] },
    })
    return { id: result[0].id, title: result[0].title }
  }
  const { data } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title"],
    filters: { id: input.brand_id },
  })
  if (!data[0]) throw new MedusaError(MedusaError.Types.INVALID_DATA, "Seçilen marka bulunamadı.")
  return { id: data[0].id as string, title: data[0].title as string }
}

/** Keep the product in exactly the vitrin lists that were ticked. */
async function syncLists(container: MedusaContainer, productId: string, keys: string[]) {
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE)
  const lists = await vitrin.listVitrinLists({})
  const updates = lists
    .map((list) => {
      const has = list.product_ids.includes(productId)
      const want = keys.includes(list.key)
      if (has === want) return null
      // New entries go to the front: the newest pick is the one to show first.
      const product_ids = want ? [productId, ...list.product_ids] : list.product_ids.filter((id) => id !== productId)
      return { id: list.id, product_ids }
    })
    .filter((u): u is { id: string; product_ids: string[] } => u !== null)
  if (updates.length) await vitrin.updateVitrinLists(updates)
}

async function setSalePrice(
  container: MedusaContainer,
  { variantId, priceSetId, salePrice }: { variantId: string; priceSetId: string; salePrice: number | null | undefined }
) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const sale = await saleListPrices(query)
  const existing = sale.bySet.get(priceSetId)
  const data = { id: sale.id, create: [] as any[], update: [] as any[], delete: [] as string[] }
  if (salePrice != null) {
    if (existing) data.update.push({ id: existing.id, currency_code: "try", amount: salePrice, variant_id: variantId })
    else data.create.push({ currency_code: "try", amount: salePrice, variant_id: variantId })
  } else if (existing) {
    data.delete.push(existing.id)
  }
  if (data.create.length || data.update.length || data.delete.length) {
    await batchPriceListPricesWorkflow(container).run({ input: { data } })
  }
}

export async function createQuickProduct(container: MedusaContainer, input: QuickProductInput): Promise<QuickProduct> {
  checkInput(input)
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const brand = await resolveBrand(container, input)

  const [{ data: stores }, { data: profiles }, { data: locations }, { data: options }] = await Promise.all([
    query.graph({ entity: "store", fields: ["default_sales_channel_id"] }),
    query.graph({ entity: "shipping_profile", fields: ["id"] }),
    query.graph({ entity: "stock_location", fields: ["id"] }),
    query.graph({ entity: "product_option", fields: ["id", "title"], filters: { title: "Model" } }),
  ])
  const salesChannelId = stores[0]?.default_sales_channel_id
  if (!salesChannelId || !profiles[0] || !locations[0]) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Mağaza kurulumu eksik (satış kanalı, kargo profili veya depo).")
  }

  const handleBase = slugify(input.title)
  const { data: clash } = await query.graph({ entity: "product", fields: ["id"], filters: { handle: handleBase } })
  const handle = clash.length ? `${handleBase}-${Date.now().toString(36)}` : handleBase
  const sku = input.sku?.trim() || `${slugify(brand.title).slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`

  const { result } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: input.title.trim(),
          handle,
          description: input.description?.trim() || undefined,
          status: input.status === "draft" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED,
          category_ids: [input.category_id],
          collection_id: brand.id,
          shipping_profile_id: profiles[0].id,
          thumbnail: input.image || undefined,
          images: input.image ? [{ url: input.image }] : [],
          metadata: {
            brand: brand.title,
            instalment: input.instalment,
            ...(input.badge ? { badge: input.badge } : {}),
          },
          options: options[0] ? [{ id: options[0].id }] : [{ title: "Model", values: ["Standart"] }],
          variants: [
            {
              title: "Standart",
              sku,
              manage_inventory: true,
              options: { Model: "Standart" },
              prices: [{ currency_code: "try", amount: input.price }],
            },
          ],
          sales_channels: [{ id: salesChannelId }],
        } as any,
      ],
    },
  })
  const product = result[0]
  const created = await getQuickProduct(container, product.id)

  const { data: links } = await query.graph({
    entity: "product_variant",
    fields: ["id", "inventory_items.inventory_item_id", "prices.price_set_id"],
    filters: { id: created.variant_id },
  })
  const inventoryItemId = links[0]?.inventory_items?.[0]?.inventory_item_id
  if (inventoryItemId) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: [
          { inventory_item_id: inventoryItemId, location_id: locations[0].id, stocked_quantity: input.stock },
        ],
      },
    })
  }
  const priceSetId = links[0]?.prices?.[0]?.price_set_id
  if (priceSetId && input.sale_price != null) {
    await setSalePrice(container, { variantId: created.variant_id, priceSetId, salePrice: input.sale_price })
  }
  await syncLists(container, product.id, input.list_keys)
  return getQuickProduct(container, product.id)
}

export async function updateQuickProduct(
  container: MedusaContainer,
  id: string,
  input: QuickProductInput
): Promise<QuickProduct> {
  checkInput(input)
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query
  const brand = await resolveBrand(container, input)

  const { data } = await query.graph({ entity: "product", fields: FIELDS, filters: { id } })
  const current = data[0]
  if (!current) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Ürün bulunamadı.")
  const variant = current.variants?.[0]
  const base = (variant?.prices ?? []).find((p: any) => p.currency_code === "try")

  await updateProductsWorkflow(container).run({
    input: {
      selector: { id },
      update: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        status: input.status === "draft" ? ProductStatus.DRAFT : ProductStatus.PUBLISHED,
        collection_id: brand.id,
        category_ids: [input.category_id],
        thumbnail: input.image || null,
        ...(input.image && input.image !== current.thumbnail ? { images: [{ url: input.image }] } : {}),
        // Medusa merges metadata; an empty string removes a key.
        metadata: {
          brand: brand.title,
          instalment: input.instalment,
          badge: input.badge ?? "",
        },
      } as any,
    },
  })

  if (variant) {
    await updateProductVariantsWorkflow(container).run({
      input: {
        selector: { id: variant.id },
        update: {
          ...(input.sku?.trim() ? { sku: input.sku.trim() } : {}),
          prices: [
            base
              ? { id: base.id, currency_code: "try", amount: input.price }
              : { currency_code: "try", amount: input.price },
          ],
        } as any,
      },
    })

    if (base?.price_set_id) {
      await setSalePrice(container, { variantId: variant.id, priceSetId: base.price_set_id, salePrice: input.sale_price })
    }

    const item = variant.inventory_items?.[0]
    const level = item?.inventory?.location_levels?.[0]
    if (item && level) {
      await updateInventoryLevelsWorkflow(container).run({
        input: {
          updates: [
            { inventory_item_id: item.inventory_item_id, location_id: level.location_id, stocked_quantity: input.stock },
          ],
        },
      })
    } else if (item) {
      const { data: locations } = await query.graph({ entity: "stock_location", fields: ["id"] })
      await createInventoryLevelsWorkflow(container).run({
        input: {
          inventory_levels: [
            { inventory_item_id: item.inventory_item_id, location_id: locations[0].id, stocked_quantity: input.stock },
          ],
        },
      })
    }
  }

  await syncLists(container, id, input.list_keys)
  return getQuickProduct(container, id)
}
