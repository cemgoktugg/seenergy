import { defineRouteConfig } from "@medusajs/admin-sdk"
import { MagnifyingGlass, Plus } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Input, Table, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { BADGE_LABELS, formatTRY, mediaUrl, useQuickProducts, useVitrin } from "../../../lib/vitrin"

/**
 * Ürün Yönetimi — every product as one row with the numbers people change
 * most: price, sale price, stock. Search by name, brand or code; click a row
 * to edit it on one page.
 */

const PAGE = 20

const ProductsPage = () => {
  const navigate = useNavigate()
  const { data: vitrin } = useVitrin()
  const [q, setQ] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(q.trim())
      setPage(0)
    }, 250)
    return () => clearTimeout(t)
  }, [q])

  const { data, isLoading } = useQuickProducts({ q: search || undefined, limit: PAGE, offset: page * PAGE })
  const storefront = vitrin?.storefront_url ?? ""
  const listTitle = (key: string) => vitrin?.lists.find((l) => l.key === key)?.title ?? key
  const pages = Math.max(1, Math.ceil((data?.count ?? 0) / PAGE))

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <Heading>Ürün Yönetimi</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1">
            Ürün eklemenin ve fiyat, stok, görsel güncellemenin kolay yolu.
          </Text>
        </div>
        <Button size="small" asChild>
          <Link to="/vitrin/urunler/yeni">
            <Plus />
            Yeni ürün ekle
          </Link>
        </Button>
      </div>
      <div className="px-6 py-3">
        <div className="relative max-w-md">
          <Input type="search" placeholder="Ürün adı, marka veya ürün kodu…" value={q} onChange={(e) => setQ(e.target.value)} />
          <MagnifyingGlass className="text-ui-fg-muted pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Ürün</Table.HeaderCell>
            <Table.HeaderCell>Fiyat</Table.HeaderCell>
            <Table.HeaderCell>Stok</Table.HeaderCell>
            <Table.HeaderCell>Vitrin</Table.HeaderCell>
            <Table.HeaderCell>Durum</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(data?.products ?? []).map((p) => (
            <Table.Row key={p.id} className="cursor-pointer" onClick={() => navigate(`/vitrin/urunler/${p.id}`)}>
              <Table.Cell>
                <div className="flex items-center gap-x-3 py-1">
                  <div className="bg-ui-bg-subtle h-10 w-10 shrink-0 overflow-hidden rounded-md border">
                    {p.image ? <img src={mediaUrl(p.image, storefront)} alt="" className="h-full w-full object-contain p-0.5" /> : null}
                  </div>
                  <div className="min-w-0">
                    <Text size="small" weight="plus" className="max-w-md truncate">
                      {p.title}
                    </Text>
                    <Text size="xsmall" className="text-ui-fg-subtle">
                      {p.brand} · {p.sku} {p.badge ? `· ${BADGE_LABELS[p.badge]}` : ""}
                    </Text>
                  </div>
                </div>
              </Table.Cell>
              <Table.Cell>
                {p.sale_price != null ? (
                  <div>
                    <Text size="small" weight="plus">{formatTRY(p.sale_price)}</Text>
                    <Text size="xsmall" className="text-ui-fg-muted line-through">{formatTRY(p.price)}</Text>
                  </div>
                ) : (
                  <Text size="small">{formatTRY(p.price)}</Text>
                )}
              </Table.Cell>
              <Table.Cell>
                <Badge size="2xsmall" color={p.stock <= 0 ? "red" : p.stock < 5 ? "orange" : "grey"}>
                  {p.stock <= 0 ? "Tükendi" : `${p.stock} adet`}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <div className="flex flex-wrap gap-1">
                  {p.list_keys.map((k) => (
                    <Badge key={k} size="2xsmall" color="purple">
                      {listTitle(k)}
                    </Badge>
                  ))}
                </div>
              </Table.Cell>
              <Table.Cell>
                <Badge size="2xsmall" color={p.status === "published" ? "green" : "grey"}>
                  {p.status === "published" ? "Yayında" : "Taslak"}
                </Badge>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      {!isLoading && (data?.products.length ?? 0) === 0 ? (
        <Text size="small" className="text-ui-fg-subtle px-6 py-8 text-center">
          {search ? `“${search}” ile eşleşen ürün yok.` : "Henüz ürün yok."}
        </Text>
      ) : null}
      <div className="flex items-center justify-between px-6 py-3">
        <Text size="small" className="text-ui-fg-subtle">
          {data?.count ?? 0} ürün · Sayfa {page + 1} / {pages}
        </Text>
        <div className="flex gap-x-2">
          <Button size="small" variant="secondary" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            Önceki
          </Button>
          <Button size="small" variant="secondary" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>
            Sonraki
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Ürün Yönetimi",
})

export default ProductsPage
