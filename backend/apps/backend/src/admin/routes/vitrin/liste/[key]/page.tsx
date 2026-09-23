import { ArrowUpRightOnBox } from "@medusajs/icons"
import { Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { ProductListEditor } from "../../../../components/product-list-editor"
import { LIST_LIMITS, LIST_PLACES } from "../../../../lib/blocks"
import { errorText, useSaveList, useVitrin } from "../../../../lib/vitrin"

/**
 * One curated list — "Haftanın Ürünleri" and friends. Edits stay local until
 * "Kaydet", so rearranging twelve products is one save, not twelve.
 */
const ListPage = () => {
  const { key = "" } = useParams()
  const { data } = useVitrin()
  const save = useSaveList()
  const list = data?.lists.find((l) => l.key === key)
  const [ids, setIds] = useState<string[] | null>(null)

  useEffect(() => {
    if (list && ids === null) setIds(list.product_ids)
  }, [list, ids])

  if (!data) return <Container className="px-6 py-4"><Text>Yükleniyor…</Text></Container>
  if (!list) return <Container className="px-6 py-4"><Text>Liste bulunamadı.</Text></Container>

  const current = ids ?? list.product_ids
  const dirty = JSON.stringify(current) !== JSON.stringify(list.product_ids)
  const splitAt = key === "haftanin" || key === "yeni" ? 8 : undefined

  const onSave = () =>
    save.mutate(
      { key, product_ids: current },
      {
        onSuccess: () => toast.success(`${list.title} kaydedildi. Sitede güncellendi.`),
        onError: (error) => toast.error(errorText(error)),
      }
    )

  return (
    <div className="flex flex-col gap-y-3 pb-16">
      <Container className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            <Link to="/vitrin" className="hover:underline">Vitrin</Link> / Ürün listesi
          </Text>
          <Heading className="mt-1">{list.title}</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1 max-w-2xl">
            Sitede nerede: {LIST_PLACES[key] ?? list.description}
          </Text>
        </div>
        {data.storefront_url ? (
          <Button size="small" variant="secondary" asChild>
            <a href={data.storefront_url} target="_blank" rel="noreferrer">
              <ArrowUpRightOnBox />
              Sitede gör
            </a>
          </Button>
        ) : null}
      </Container>

      <Container className="px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle mb-4">
          Ürünler bu sırayla gösterilir. Okları kullanarak sıralayın, çöp kutusuyla çıkarın.
        </Text>
        <ProductListEditor
          ids={current}
          onChange={setIds}
          limit={LIST_LIMITS[key] ?? 12}
          storefront={data.storefront_url}
          showFrom={splitAt ? { index: splitAt, note: "yalnızca sekmeli bölümde görünür" } : undefined}
        />
      </Container>

      {dirty ? (
        <div className="bg-ui-bg-base shadow-elevation-flyout fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-3 rounded-xl border px-4 py-2.5">
          <Text size="small">Kaydedilmemiş değişiklik var.</Text>
          <Button size="small" variant="secondary" onClick={() => setIds(list.product_ids)}>
            Vazgeç
          </Button>
          <Button size="small" isLoading={save.isPending} onClick={onSave}>
            Kaydet
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export default ListPage
