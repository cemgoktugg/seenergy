import { z } from "zod"

import { BADGES } from "../../../lib/quick-product"

/**
 * Request bodies for the vitrin admin routes. Messages are Turkish because
 * they surface verbatim in the admin forms.
 */

export const ListUpdate = z.object({
  product_ids: z.array(z.string().startsWith("prod_")).max(48, "Bir listede en fazla 48 ürün olabilir."),
})

export const BLOCK_GROUPS = [
  "announcement",
  "hero-slide",
  "hero-side",
  "banner",
  "brand-band",
  "brand-board",
  "company",
  "tech-band",
  "trust",
  "staff",
  "section",
  "own-brand",
  "brand-wall",
  "company-card",
  "page",
  "page-section",
  "reference",
  "project",
] as const

export const BlockCreate = z.object({
  group: z.enum(BLOCK_GROUPS),
  key: z.string().nullable().optional(),
  rank: z.number().int().optional(),
  is_active: z.boolean().optional(),
  data: z.record(z.string(), z.unknown()),
})

export const BlockUpdate = z.object({
  rank: z.number().int().optional(),
  is_active: z.boolean().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
})

export const Reorder = z.object({ ids: z.array(z.string()).min(1) })

const money = z.coerce.number({ message: "Geçerli bir tutar girin." })

export const QuickProductBody = z.object({
  title: z.string().trim().min(3, "Ürün adı en az 3 karakter olmalı."),
  description: z.string().nullable().optional(),
  status: z.enum(["published", "draft"]).default("published"),
  brand_id: z.string().nullable().optional(),
  new_brand: z.string().nullable().optional(),
  category_id: z.string().min(1, "Bir kategori seçin."),
  sku: z.string().nullable().optional(),
  // Empty = no price: the product shows "Fiyat için teklif isteyin".
  price: money.nullable(),
  sale_price: money.nullable().optional(),
  stock: z.coerce.number().int("Stok tam sayı olmalı.").min(0, "Stok negatif olamaz."),
  images: z.array(z.string()).max(20, "En fazla 20 görsel eklenebilir.").nullable().optional(),
  specs: z
    .array(
      z.object({
        title: z.string().max(80, "Grup adı en fazla 80 karakter olabilir."),
        rows: z
          .array(
            z.object({
              label: z.string().max(120, "Özellik adı en fazla 120 karakter olabilir."),
              value: z.string().max(400, "Değer en fazla 400 karakter olabilir."),
              note: z.string().max(400, "Not en fazla 400 karakter olabilir.").optional(),
            })
          )
          .max(60, "Bir grupta en fazla 60 satır olabilir."),
      })
    )
    .max(20, "En fazla 20 grup eklenebilir.")
    .nullable()
    .optional(),
  image: z.string().nullable().optional(),
  badge: z.enum(BADGES).nullable().optional(),
  instalment: z.boolean().default(false),
  list_keys: z.array(z.string()).default([]),
})

/** Changes made straight in the Ürün Yönetimi list, many products at once. */
export const ProductBatchBody = z.object({
  updates: z
    .array(
      z.object({
        id: z.string().startsWith("prod_"),
        price: money.nullable().optional(),
        sale_price: money.nullable().optional(),
        stock: z.coerce.number().int("Stok tam sayı olmalı.").min(0, "Stok negatif olamaz.").optional(),
        status: z.enum(["published", "draft"]).optional(),
        category_id: z.string().min(1).optional(),
        add_image: z.string().min(1).optional(),
      })
    )
    .min(1)
    .max(200, "Bir seferde en fazla 200 ürün kaydedilebilir."),
})

/** First zod issue as a single sentence for the admin toast. */
export function firstIssue(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Geçersiz istek."
}
