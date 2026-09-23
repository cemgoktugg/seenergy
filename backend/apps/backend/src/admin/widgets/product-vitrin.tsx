import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { PencilSquare } from "@medusajs/icons"
import type { AdminProduct, DetailWidgetProps } from "@medusajs/framework/types"
import { Button, Checkbox, Container, Heading, Text, toast } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { LIST_LIMITS } from "../lib/blocks"
import { errorText, useSaveList, useVitrin } from "../lib/vitrin"

/**
 * On Medusa's own product page: where this product appears on the SEENERGY
 * homepage, with one tick to add it to "Haftanın Ürünleri" or take it out —
 * and a way into the simple edit form.
 */
const ProductVitrinWidget = ({ data: product }: DetailWidgetProps<AdminProduct>) => {
  const { data } = useVitrin()
  const save = useSaveList()

  const toggle = (key: string, on: boolean) => {
    const list = data?.lists.find((l) => l.key === key)
    if (!list) return
    const limit = LIST_LIMITS[key] ?? 12
    if (on && list.product_ids.length >= limit) {
      return toast.error(`${list.title} dolu (${limit} ürün). Önce listeden bir ürün çıkarın.`)
    }
    const product_ids = on ? [product.id, ...list.product_ids] : list.product_ids.filter((id) => id !== product.id)
    save.mutate(
      { key, product_ids },
      {
        onSuccess: () => toast.success(on ? `${list.title} listesine eklendi.` : `${list.title} listesinden çıkarıldı.`),
        onError: (error) => toast.error(errorText(error)),
      }
    )
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">SEENERGY Vitrin</Heading>
        <Button size="small" variant="secondary" asChild>
          <Link to={`/vitrin/urunler/${product.id}`}>
            <PencilSquare />
            Kolay düzenle
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-y-2 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle">
          Ana sayfada göster:
        </Text>
        {(data?.lists ?? []).map((list) => (
          <label key={list.key} className="flex cursor-pointer items-center gap-x-2">
            <Checkbox
              checked={list.product_ids.includes(product.id)}
              disabled={save.isPending}
              onCheckedChange={(checked) => toggle(list.key, checked === true)}
            />
            <Text size="small">{list.title}</Text>
            <Text size="xsmall" className="text-ui-fg-muted">
              ({list.product_ids.length}/{LIST_LIMITS[list.key] ?? 12})
            </Text>
          </label>
        ))}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
})

export default ProductVitrinWidget
