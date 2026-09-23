import { ArrowDownMini, ArrowUpMini, MagnifyingGlass, Plus, Trash } from "@medusajs/icons"
import { Badge, IconButton, Input, Text, clx } from "@medusajs/ui"
import { useMemo, useState } from "react"

import { formatTRY, mediaUrl, useQuickProducts, type QuickProduct } from "../lib/vitrin"

/**
 * An ordered product list, edited the way a shop person thinks about it:
 * search by name or code, click to add, arrows to move, bin to remove.
 * The order here is the order on the site.
 */

function Thumb({ src, storefront }: { src: string | null; storefront: string }) {
  return (
    <div className="bg-ui-bg-subtle flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border">
      {src ? <img src={mediaUrl(src, storefront)} alt="" className="h-full w-full object-contain p-0.5" /> : null}
    </div>
  )
}

function StockBadge({ product }: { product: QuickProduct }) {
  if (product.status !== "published") return <Badge size="2xsmall" color="grey">Taslak</Badge>
  if (product.stock <= 0) return <Badge size="2xsmall" color="red">Stokta yok</Badge>
  if (product.stock < 5) return <Badge size="2xsmall" color="orange">Son {product.stock}</Badge>
  return null
}

export function ProductPicker({
  exclude,
  onPick,
  storefront,
  disabled,
}: {
  exclude: string[]
  onPick: (product: QuickProduct) => void
  storefront: string
  disabled?: boolean
}) {
  const [q, setQ] = useState("")
  const search = q.trim()
  const { data, isFetching } = useQuickProducts({ q: search || undefined, limit: 8 })
  const results = (data?.products ?? []).filter((p) => !exclude.includes(p.id))

  return (
    <div className="flex flex-col gap-y-2">
      <div className="relative">
        <Input
          type="search"
          placeholder="Ürün adı, marka veya ürün kodu ile arayın…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          disabled={disabled}
        />
        <MagnifyingGlass className="text-ui-fg-muted pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
      </div>
      {disabled ? (
        <Text size="small" className="text-ui-fg-subtle">
          Liste dolu. Eklemek için önce bir ürün çıkarın.
        </Text>
      ) : (
        <div className="divide-y rounded-lg border">
          {results.length === 0 ? (
            <Text size="small" className="text-ui-fg-subtle px-3 py-3">
              {isFetching ? "Aranıyor…" : search ? "Eşleşen ürün yok." : "Ürün bulunamadı."}
            </Text>
          ) : (
            results.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onPick(product)}
                className="hover:bg-ui-bg-base-hover flex w-full items-center gap-x-3 px-3 py-2 text-left"
              >
                <Thumb src={product.image} storefront={storefront} />
                <div className="min-w-0 flex-1">
                  <Text size="small" weight="plus" className="truncate">
                    {product.title}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    {product.brand} · {product.sku} · {formatTRY(product.sale_price ?? product.price)}
                  </Text>
                </div>
                <StockBadge product={product} />
                <Plus className="text-ui-fg-interactive" />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export function ProductListEditor({
  ids,
  onChange,
  limit,
  storefront,
  showFrom,
}: {
  ids: string[]
  onChange: (ids: string[]) => void
  limit: number
  storefront: string
  /** Rows past this index are marked "shown only in the tabs" etc. */
  showFrom?: { index: number; note: string }
}) {
  const { data } = useQuickProducts({ ids })
  const byId = useMemo(() => new Map((data?.products ?? []).map((p) => [p.id, p])), [data])

  const move = (from: number, to: number) => {
    const next = [...ids]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="divide-y rounded-lg border">
        {ids.length === 0 ? (
          <Text size="small" className="text-ui-fg-subtle px-4 py-6 text-center">
            Bu listede ürün yok. Aşağıdan arayıp ekleyin.
          </Text>
        ) : (
          ids.map((id, index) => {
            const product = byId.get(id)
            return (
              <div
                key={id}
                className={clx(
                  "flex items-center gap-x-3 px-3 py-2",
                  showFrom && index >= showFrom.index && "bg-ui-bg-subtle"
                )}
              >
                <Text size="small" className="text-ui-fg-muted w-6 text-right tabular-nums">
                  {index + 1}
                </Text>
                <Thumb src={product?.image ?? null} storefront={storefront} />
                <div className="min-w-0 flex-1">
                  <Text size="small" weight="plus" className="truncate">
                    {product?.title ?? (data ? "Silinmiş ürün" : "Yükleniyor…")}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    {product ? `${product.brand ?? ""} · ${formatTRY(product.sale_price ?? product.price)}` : id}
                    {showFrom && index >= showFrom.index ? ` · ${showFrom.note}` : ""}
                  </Text>
                </div>
                {product ? <StockBadge product={product} /> : null}
                <IconButton size="small" variant="transparent" disabled={index === 0} onClick={() => move(index, index - 1)} aria-label="Yukarı taşı">
                  <ArrowUpMini />
                </IconButton>
                <IconButton size="small" variant="transparent" disabled={index === ids.length - 1} onClick={() => move(index, index + 1)} aria-label="Aşağı taşı">
                  <ArrowDownMini />
                </IconButton>
                <IconButton size="small" variant="transparent" onClick={() => onChange(ids.filter((x) => x !== id))} aria-label="Listeden çıkar">
                  <Trash className="text-ui-fg-error" />
                </IconButton>
              </div>
            )
          })
        )}
      </div>
      <div className="flex items-center justify-between">
        <Text size="small" weight="plus">
          Ürün ekle
        </Text>
        <Text size="xsmall" className="text-ui-fg-subtle">
          {ids.length} / {limit}
        </Text>
      </div>
      <ProductPicker
        exclude={ids}
        storefront={storefront}
        disabled={ids.length >= limit}
        onPick={(product) => onChange([...ids, product.id])}
      />
    </div>
  )
}
