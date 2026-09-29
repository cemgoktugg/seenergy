import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowUpRightOnBox, PencilSquare, Plus, Swatch } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { GROUPS, LIST_PLACES } from "../../lib/blocks"
import { mediaUrl, useQuickProducts, useVitrin, type VitrinBlock, type VitrinList } from "../../lib/vitrin"

/**
 * Vitrin — the homepage as a map.
 *
 * Every band of the storefront homepage, top to bottom, in the order a visitor
 * sees it, each with a small preview of what is there now and one button to
 * change it. The point is that nobody has to know what a "block" or a "list
 * key" is: they find "Haftanın Ürünleri" where it is on the page.
 */

function Band({
  n,
  title,
  where,
  to,
  external,
  children,
  extra,
}: {
  n: number
  title: string
  where: string
  to: string
  external?: boolean
  children?: React.ReactNode
  extra?: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-y-3 px-6 py-4">
      <div className="flex items-start gap-x-3">
        <span className="bg-ui-bg-component txt-compact-xsmall-plus text-ui-fg-subtle mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <Text size="base" weight="plus" leading="compact">
            {title}
          </Text>
          <Text size="small" className="text-ui-fg-subtle mt-0.5">
            {where}
          </Text>
        </div>
        {extra}
        {external ? (
          <Button size="small" variant="secondary" asChild>
            <Link to={to}>
              <ArrowUpRightOnBox />
              Aç
            </Link>
          </Button>
        ) : (
          <Button size="small" variant="secondary" asChild>
            <Link to={to}>
              <PencilSquare />
              Düzenle
            </Link>
          </Button>
        )}
      </div>
      {children ? <div className="pl-9">{children}</div> : null}
    </div>
  )
}

function ListPreview({ list, storefront, count = 8 }: { list?: VitrinList; storefront: string; count?: number }) {
  const ids = (list?.product_ids ?? []).slice(0, count)
  const { data } = useQuickProducts({ ids })
  const byId = new Map((data?.products ?? []).map((p) => [p.id, p]))
  if (!list) return null
  return (
    <div className="flex flex-wrap items-center gap-2">
      {ids.map((id) => {
        const p = byId.get(id)
        return (
          <div key={id} title={p?.title} className="bg-ui-bg-subtle h-12 w-12 overflow-hidden rounded-md border">
            {p?.image ? <img src={mediaUrl(p.image, storefront)} alt="" className="h-full w-full object-contain p-0.5" /> : null}
          </div>
        )
      })}
      <Text size="xsmall" className="text-ui-fg-subtle">
        {list.product_ids.length} ürün
      </Text>
    </div>
  )
}

/** `fields`: where the picture may be, first filled one wins. */
function ImagePreview({ blocks, storefront, fields = ["image"] }: { blocks: VitrinBlock[]; storefront: string; fields?: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {blocks.map((b) => {
        const src: string | undefined = b.data.product_image || fields.map((f) => b.data[f]).find(Boolean)
        return (
          <div
            key={b.id}
            className={`bg-ui-bg-subtle relative h-14 w-24 overflow-hidden rounded-md border ${b.is_active ? "" : "opacity-40"}`}
            title={b.data.title}
          >
            {src ? (
              <img
                src={mediaUrl(src, storefront)}
                alt=""
                className={`h-full w-full ${b.data.product_image ? "object-contain p-1" : "object-cover"}`}
              />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

const ListLink = ({ list, label }: { list?: VitrinList; label: string }) =>
  list ? (
    <Link to={`/vitrin/liste/${list.key}`} className="txt-compact-small-plus text-ui-fg-interactive hover:underline">
      {label} ({list.product_ids.length})
    </Link>
  ) : null

const VitrinPage = () => {
  const { data, isLoading } = useVitrin()
  if (isLoading || !data) {
    return (
      <Container className="px-6 py-4">
        <Text>Yükleniyor…</Text>
      </Container>
    )
  }

  const storefront = data.storefront_url
  const list = (key: string) => data.lists.find((l) => l.key === key)
  const group = (g: VitrinBlock["group"]) => data.blocks.filter((b) => b.group === g)
  const banner = (key: string) => data.blocks.filter((b) => b.group === "banner" && b.key === key)
  const brandBands = group("brand-band")
  const activeBrands = brandBands.filter((b) => b.is_active)
  const announcement = group("announcement")[0]

  let n = 0
  return (
    <div className="flex flex-col gap-y-3">
      <Container className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <Heading>Vitrin</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1 max-w-2xl">
            Ana sayfadaki bölümler, sitedeki sırasıyla. Değiştirmek istediğiniz bölümün “Düzenle”
            düğmesine basın. Kaydettiğiniz her değişiklik sitede hemen görünür.
          </Text>
        </div>
        <div className="flex gap-x-2">
          <Button size="small" variant="secondary" asChild>
            <a href={storefront || "/"} target="_blank" rel="noreferrer">
              <ArrowUpRightOnBox />
              Siteyi aç
            </a>
          </Button>
          <Button size="small" asChild>
            <Link to="/vitrin/urunler/yeni">
              <Plus />
              Yeni ürün ekle
            </Link>
          </Button>
        </div>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-3">
          <Heading level="h2">Ana sayfa, yukarıdan aşağı</Heading>
        </div>

        <Band n={++n} title={GROUPS.announcement.title} where={GROUPS.announcement.where} to="/vitrin/blok/announcement">
          <Badge size="small">{announcement?.data.text ?? "—"}</Badge>
        </Band>

        <Band n={++n} title="Ana slayt" where={GROUPS["hero-slide"].where} to="/vitrin/blok/hero-slide">
          <ImagePreview blocks={group("hero-slide")} storefront={storefront} />
        </Band>

        <Band n={++n} title="Slayt yanı kartlar" where={GROUPS["hero-side"].where} to="/vitrin/blok/hero-side">
          <ImagePreview blocks={group("hero-side")} storefront={storefront} />
        </Band>

        <Band
          n={++n}
          title="Kategoriler"
          where="Slaytın altındaki kategori panosu ve menü: 14 ana kategori ve alt kategorileri. Ürünlerin hangi kategoride olduğunu buradan, her ürünün formundan seçersiniz; kategori ağacının kendisi (yeni kategori eklemek, ad değiştirmek) sitenin kodunda tanımlıdır, bu yüzden o değişiklik için geliştiriciye başvurun."
          to="/categories"
          external
        />

        <Band n={++n} title="Haftanın Ürünleri ve Yeni Gelenler" where="Kategorilerin altındaki yan yana iki ürün rafı." to="/vitrin/liste/haftanin">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-y-2">
              <ListLink list={list("haftanin")} label="Haftanın Ürünleri" />
              <ListPreview list={list("haftanin")} storefront={storefront} />
            </div>
            <div className="flex flex-col gap-y-2">
              <ListLink list={list("yeni")} label="Yeni Gelenler" />
              <ListPreview list={list("yeni")} storefront={storefront} />
            </div>
          </div>
        </Band>

        <Band n={++n} title="Geniş banner" where="Ürün raflarının altındaki tam genişlik kampanya görseli." to="/vitrin/blok/banner">
          <ImagePreview blocks={banner("wide")} storefront={storefront} />
        </Band>

        <Band n={++n} title="Süper Fırsat Ürünleri" where={LIST_PLACES["super-firsat"]} to="/vitrin/liste/super-firsat">
          <ListPreview list={list("super-firsat")} storefront={storefront} count={4} />
        </Band>

        <Band
          n={++n}
          title="Marka vitrinleri"
          where={GROUPS["brand-band"].where}
          to="/vitrin/blok/brand-band"
          extra={<Badge size="2xsmall">{activeBrands.length} yayında</Badge>}
        >
          <ImagePreview blocks={brandBands} storefront={storefront} fields={["banner", "logo"]} />
        </Band>

        <Band n={++n} title={GROUPS["tech-band"].title} where={GROUPS["tech-band"].where} to="/vitrin/blok/tech-band">
          <Text size="small" className="text-ui-fg-subtle">
            “{group("tech-band")[0]?.data.title ?? "—"}”
          </Text>
        </Band>

        <Band
          n={++n}
          title="Sekmeli ürün bölümü"
          where="Haftanın Ürünleri / Yeni Ürünler / Çok Satanlar sekmeleri. İlk iki sekme yukarıdaki raflarla aynı listeleri kullanır."
          to="/vitrin/liste/cok-satan"
        >
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <ListLink list={list("haftanin")} label="Haftanın Ürünleri" />
            <ListLink list={list("yeni")} label="Yeni Ürünler" />
            <ListLink list={list("cok-satan")} label="Çok Satanlar" />
          </div>
        </Band>

        <Band n={++n} title="Blog ve markalar" where="Sayfa sonuna doğru koyu bölümdeki iki büyük banner." to="/vitrin/blok/banner">
          <ImagePreview blocks={[...banner("dual-1"), ...banner("dual-2")]} storefront={storefront} />
        </Band>

        <Band n={++n} title={GROUPS.trust.title} where={GROUPS.trust.where} to="/vitrin/blok/trust">
          <div className="flex flex-wrap gap-2">
            {group("trust").map((b) => (
              <Badge key={b.id} size="small" color={b.is_active ? "grey" : "orange"}>
                {b.data.title}
              </Badge>
            ))}
          </div>
        </Band>
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Vitrin",
  icon: Swatch,
})

export default VitrinPage
