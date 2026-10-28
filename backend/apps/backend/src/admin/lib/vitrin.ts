import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { sdk } from "./sdk"

/**
 * Data layer for the SEENERGY Vitrin screens: types mirroring the backend
 * routes, and react-query hooks around them. One query key per resource so a
 * save anywhere refreshes every screen that shows it.
 */

export interface VitrinList {
  id: string
  key: string
  title: string
  description: string | null
  product_ids: string[]
}

export interface VitrinBlock {
  id: string
  group: BlockGroup
  key: string | null
  rank: number
  is_active: boolean
  data: Record<string, any>
}

export type BlockGroup =
  | "announcement"
  | "hero-slide"
  | "hero-side"
  | "banner"
  | "brand-band"
  | "brand-board"
  | "company"
  | "tech-band"
  | "trust"
  | "staff"
  | "section"
  | "own-brand"
  | "brand-wall"
  | "company-card"

/** One group of the product page's "Teknik Özellikler" table. */
export interface SpecGroup {
  title: string
  rows: { label: string; value: string; note?: string }[]
}

/**
 * The storefront's spec template for a category (its handle), to start a
 * product's sheet from. Served by the storefront, which owns the templates.
 */
export async function fetchSpecTemplate(storefront: string, categoryHandle: string): Promise<SpecGroup[]> {
  const response = await fetch(`${storefront.replace(/\/$/, "")}/api/spec-template?category=${encodeURIComponent(categoryHandle)}`)
  if (!response.ok) throw new Error("Şablon alınamadı. Mağaza sunucusu çalışıyor mu?")
  const body = (await response.json()) as { groups?: SpecGroup[] }
  return body.groups ?? []
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
  /** Every picture, main first. */
  images: string[]
  /** The product's own spec sheet; empty when it uses the category's. */
  specs: SpecGroup[]
  badge: "yeni" | "super-firsat" | "cok-satan" | null
  instalment: boolean
  list_keys: string[]
  updated_at: string
}

export interface QuickProductInput {
  title: string
  description: string | null
  status: "published" | "draft"
  brand_id: string | null
  new_brand: string | null
  category_id: string
  sku: string | null
  /** null = no price ("Fiyat için teklif isteyin"). */
  price: number | null
  sale_price: number | null
  stock: number
  /** Every picture in display order; the first is the main one. */
  images: string[]
  /** Empty = use the category template on the product page. */
  specs: SpecGroup[]
  badge: QuickProduct["badge"]
  instalment: boolean
  list_keys: string[]
}

interface VitrinResponse {
  lists: VitrinList[]
  blocks: VitrinBlock[]
  storefront_url: string
}

export const vitrinKeys = {
  all: ["vitrin"] as const,
  products: (params: Record<string, unknown>) => ["vitrin", "products", params] as const,
  product: (id: string) => ["vitrin", "product", id] as const,
  options: ["vitrin", "options"] as const,
}

export function useVitrin() {
  return useQuery({
    queryKey: vitrinKeys.all,
    queryFn: () => sdk.client.fetch<VitrinResponse>("/admin/vitrin"),
  })
}

export function useVitrinOptions() {
  return useQuery({
    queryKey: vitrinKeys.options,
    queryFn: () =>
      sdk.client.fetch<{
        brands: { id: string; title: string; handle: string }[]
        /** Active only; `label` names the parent of a subcategory. */
        categories: VitrinCategory[]
      }>("/admin/vitrin/options"),
    staleTime: 60_000,
  })
}

export function useQuickProducts(params: { q?: string; limit?: number; offset?: number; ids?: string[] }) {
  const query: Record<string, string | number> = {}
  if (params.q) query.q = params.q
  if (params.limit) query.limit = params.limit
  if (params.offset) query.offset = params.offset
  if (params.ids) query.ids = params.ids.join(",")
  return useQuery({
    queryKey: vitrinKeys.products(query),
    queryFn: () =>
      sdk.client.fetch<{ products: QuickProduct[]; count: number }>("/admin/vitrin/products", { query }),
    enabled: params.ids ? params.ids.length > 0 : true,
    placeholderData: (previous) => previous,
  })
}

/** The whole catalogue at once — Ürün Yönetimi filters, counts and pages it
 *  in the browser, so switching category or filter is instant. */
export function useAllQuickProducts() {
  return useQuery({
    queryKey: vitrinKeys.products({ all: 1 }),
    queryFn: () =>
      sdk.client.fetch<{ products: QuickProduct[]; count: number }>("/admin/vitrin/products", { query: { all: 1 } }),
  })
}

/** A change made straight in the list; only the fields given are saved. */
export interface QuickPatch {
  id: string
  price?: number | null
  sale_price?: number | null
  stock?: number
  status?: "published" | "draft"
  category_id?: string
  add_image?: string
}

export function useBatchUpdate() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (updates: QuickPatch[]) =>
      sdk.client.fetch<{ saved: string[]; failed: { id: string; message: string }[] }>("/admin/vitrin/product-batch", {
        method: "POST",
        body: { updates },
      }),
    onSuccess: invalidate,
  })
}

export function useQuickProduct(id: string | undefined) {
  return useQuery({
    queryKey: vitrinKeys.product(id ?? ""),
    queryFn: () => sdk.client.fetch<{ product: QuickProduct }>(`/admin/vitrin/products/${id}`),
    enabled: Boolean(id),
  })
}

/** Every vitrin save invalidates everything vitrin — the screens are small. */
function useInvalidate() {
  const client = useQueryClient()
  return () => client.invalidateQueries({ queryKey: vitrinKeys.all })
}

export function useSaveList() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ key, product_ids }: { key: string; product_ids: string[] }) =>
      sdk.client.fetch<{ list: VitrinList }>(`/admin/vitrin/lists/${key}`, {
        method: "POST",
        body: { product_ids },
      }),
    onSuccess: invalidate,
  })
}

export function useSaveBlock() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; data?: Record<string, unknown>; is_active?: boolean; rank?: number }) =>
      sdk.client.fetch<{ block: VitrinBlock }>(`/admin/vitrin/blocks/${id}`, { method: "POST", body }),
    onSuccess: invalidate,
  })
}

export function useCreateBlock() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (body: { group: BlockGroup; key?: string | null; data: Record<string, unknown>; is_active?: boolean }) =>
      sdk.client.fetch<{ block: VitrinBlock }>("/admin/vitrin/blocks", { method: "POST", body }),
    onSuccess: invalidate,
  })
}

export function useDeleteBlock() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (id: string) => sdk.client.fetch(`/admin/vitrin/blocks/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  })
}

export function useReorderBlocks() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: (ids: string[]) =>
      sdk.client.fetch("/admin/vitrin/blocks/reorder", { method: "POST", body: { ids } }),
    onSuccess: invalidate,
  })
}

export function useSaveQuickProduct() {
  const invalidate = useInvalidate()
  return useMutation({
    mutationFn: ({ id, input }: { id?: string; input: QuickProductInput }) =>
      sdk.client.fetch<{ product: QuickProduct }>(
        id ? `/admin/vitrin/products/${id}` : "/admin/vitrin/products",
        { method: "POST", body: input }
      ),
    onSuccess: invalidate,
  })
}

/** Upload several files in one request; returns their public URLs in order. */
export async function uploadImages(files: File[]): Promise<string[]> {
  const { files: uploaded } = await sdk.admin.upload.create({ files })
  return uploaded.map((file) => file.url)
}

/** Upload one file through Medusa's file module; returns its public URL. */
export async function uploadImage(file: File): Promise<string> {
  const { files } = await sdk.admin.upload.create({ files: [file] })
  return files[0].url
}

/** Error text from a failed call, for a toast. */
export function errorText(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) return String((error as Error).message)
  return "İşlem tamamlanamadı."
}

export const formatTRY = (value: number | null | undefined) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", minimumFractionDigits: 2 }).format(value)

/**
 * Seeded content uses the storefront's own root-relative assets ("/mock/…");
 * the admin runs on another origin, so previews prefix the storefront URL.
 */
export const mediaUrl = (src: string | null | undefined, storefront: string) =>
  !src ? "" : src.startsWith("/") ? `${storefront}${src}` : src

/** An active category; `label` names the parent of a subcategory. */
export interface VitrinCategory {
  id: string
  name: string
  handle: string
  /** null for a top-level category. */
  parent_id: string | null
  rank: number
  label: string
}

/**
 * Accepts "1.249,90", "1249,90", "1249.90" and "1.249" — people type prices
 * every way. A dot followed by exactly three digits is a Turkish thousands
 * separator ("1.249" is 1249, not 1,249). Empty = null; nonsense = NaN.
 */
export const parseMoney = (value: string): number | null => {
  const v = value.trim().replace(/\s/g, "").replace(/(TL|₺)$/i, "")
  if (!v) return null
  const normalised = /,\d{1,2}$/.test(v)
    ? v.replace(/\./g, "").replace(",", ".")
    : /^\d{1,3}(\.\d{3})+$/.test(v)
      ? v.replace(/\./g, "")
      : v.replace(/,/g, "")
  const n = Number(normalised)
  return Number.isFinite(n) ? n : NaN
}

/** A price as it is typed back into a field: "1.249,90", "" for none. */
export const moneyInput = (value: number | null | undefined) =>
  value == null ? "" : new Intl.NumberFormat("tr-TR", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value)

export const BADGE_LABELS: Record<NonNullable<QuickProduct["badge"]>, string> = {
  "yeni": "Yeni",
  "super-firsat": "Süper Fırsat",
  "cok-satan": "Çok Satan",
}
