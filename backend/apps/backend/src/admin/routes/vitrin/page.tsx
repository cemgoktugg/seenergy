import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowUpRightOnBox, PencilSquare, Plus, Swatch } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Text } from "@medusajs/ui"
import { Link } from "react-router-dom"

import { DEPARTMENT_NAMES, GROUPS, LIST_PLACES, PAGE_NAMES } from "../../lib/blocks"
import { mediaUrl, useQuickProducts, useVitrin, type VitrinBlock, type VitrinList } from "../../lib/vitrin"

/**
 * Vitrin — the homepage as a map (rebuilt 2026-10-28 to match the page band
 * for band: stale entries for bands no longer on it were dropped, and every
 * band links to its own settings — shown / hidden, headings, pictures).
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
  hidden,
  links,
  children,
  extra,
}: {
  n?: number
  title: string
  where: string
  to: string
  external?: boolean
  /** The band is switched off (its section block says "Gizli"). */
  hidden?: boolean
  /** Further parts of the same band, each with its own editor. */
  links?: { label: string; to: string }[]
  children?: React.ReactNode
  extra?: React.ReactNode
}) {
  return (
    <div className={`flex flex-col gap-y-3 px-6 py-4 ${hidden ? "bg-ui-bg-subtle" : ""}`}>
      <div className="flex items-start gap-x-3">
        {n ? (
          <span className="bg-ui-bg-component txt-compact-xsmall-plus text-ui-fg-subtle mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border">
            {n}
          </span>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Text size="base" weight="plus" leading="compact">
              {title}
            </Text>
            {hidden ? (
              <Badge size="2xsmall" color="orange">
                Sitede gizli
              </Badge>
            ) : null}
          </div>
          <Text size="small" className="text-ui-fg-subtle mt-0.5">
            {where}
          </Text>
          {links?.length ? (
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
              {links.map((link) => (
                <Link key={link.to} to={link.to} className="txt-compact-small-plus text-ui-fg-interactive hover:underline">
                  {link.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        {extra}
        <Button size="small" variant="secondary" asChild>
          <Link to={to}>
            {external ? <ArrowUpRightOnBox /> : <PencilSquare />}
            {external ? "Aç" : "Düzenle"}
          </Link>
        </Button>
      </div>
      {children ? <div className={n ? "pl-9" : ""}>{children}</div> : null}
    </div>
  )
}

/** A row of logo tiles (own brands, brand wall). */
function LogoPreview({ blocks, storefront, max = 12 }: { blocks: VitrinBlock[]; storefront: string; max?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {blocks.slice(0, max).map((b) => (
        <div
          key={b.id}
          title={b.data.name}
          className={`flex h-9 w-20 items-center justify-center overflow-hidden rounded-md border bg-white px-1.5 ${b.is_active ? "" : "opacity-40"}`}
        >
          {b.data.logo ? <img src={mediaUrl(b.data.logo, storefront)} alt="" className="max-h-6 w-auto max-w-full object-contain" /> : null}
        </div>
      ))}
      {blocks.length > max ? (
        <Text size="xsmall" className="text-ui-fg-subtle">
          +{blocks.length - max} marka
        </Text>
      ) : null}
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
                className={`h-full w-full ${b.data.product_image || fields.includes("logo") ? "object-contain p-1" : "object-cover"}`}
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

/**
 * A corporate page on the map: its settings (headings, lede, search text)
 * behind Düzenle, its text sections and its own cards as links, and the
 * section headings as a preview.
 */
function CorporatePage({
  page,
  where,
  extra,
  sections,
}: {
  page: string
  where: string
  extra: { label: string; to: string }
  sections: VitrinBlock[]
}) {
  return (
    <Band
      title={PAGE_NAMES[page]}
      where={where}
      to={`/vitrin/blok/page?bolum=${page}`}
      links={[extra, { label: `Metin bölümleri (${sections.length})`, to: `/vitrin/blok/page-section?sayfa=${page}` }]}
    >
      <div className="flex flex-wrap gap-2">
        {sections.map((b) => (
          <Badge key={b.id} size="small" color={b.is_active ? "grey" : "orange"}>
            {b.data.heading || "başlıksız"}
          </Badge>
        ))}
      </div>
    </Band>
  )
}

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
  const group = (g: VitrinBlock["group"]) => data.blocks.filter((b) => b.group === g).sort((a, b) => a.rank - b.rank)
  const banner = (key: string) => data.blocks.filter((b) => b.group === "banner" && b.key === key)
  const announcement = group("announcement")[0]
  const section = (key: string) => data.blocks.find((b) => b.group === "section" && b.key === key)
  const isHidden = (key: string) => section(key)?.data.visible === "off"
  const settings = (key: string) => `/vitrin/blok/section?bolum=${key}`
  const sectionsOf = (page: string) => group("page-section").filter((b) => b.data.page === page)
  const companyCards = group("company-card")
  const heroLight = section("hero")?.data.design === "acik"
  const deals = section("deals")?.data ?? {}

  let n = 0
  return (
    <div className="flex flex-col gap-y-3">
      <Container className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <Heading>Vitrin</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1 max-w-2xl">
            Ana sayfa, sitedeki sırasıyla yukarıdan aşağı. Her bölümün yazısı, görseli ve ürünleri buradan
            değişir; bir bölümü kaldırmak için “Düzenle”den “Sitede: Gizli” seçin. Kaydettiğiniz her değişiklik
            sitede hemen görünür.
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
          <Heading level="h2">Her sayfada</Heading>
        </div>

        <Band title={GROUPS.announcement.title} where={GROUPS.announcement.where} to="/vitrin/blok/announcement">
          <Badge size="small">{announcement?.data.text ?? "—"}</Badge>
        </Band>

        <Band title={GROUPS.company.title} where={GROUPS.company.where} to="/vitrin/blok/company">
          <Text size="small" className="text-ui-fg-subtle">
            {group("company")[0]?.data.legal_name ?? "—"} · {group("company")[0]?.data.phone || "telefon yok"} ·{" "}
            {group("company")[0]?.data.iban ? "IBAN girildi" : "IBAN girilmedi"}
          </Text>
        </Band>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-3">
          <Heading level="h2">Ana sayfa, yukarıdan aşağı</Heading>
        </div>

        <Band
          n={++n}
          title="Ana slayt"
          where="Sayfanın en üstündeki büyük, kayan alan. İki tasarımı var: afiş (görseliniz olduğu gibi, kırpılmadan) veya açık tasarım (sitenin başlığı ve kırmızı butonu bir fotoğrafın üstünde). Tasarımı “Düzenle”nin en üstünden seçersiniz."
          to="/vitrin/blok/hero-slide"
          hidden={isHidden("hero")}
          links={[
            { label: "Tasarımı değiştir", to: "/vitrin/blok/hero-slide" },
            { label: "Göster / gizle", to: settings("hero") },
          ]}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Badge size="small" color={heroLight ? "blue" : "grey"}>
              Tasarım: {heroLight ? "Açık" : "Afiş"}
            </Badge>
            <ImagePreview blocks={group("hero-slide")} storefront={storefront} />
          </div>
        </Band>

        <Band
          n={++n}
          title={GROUPS["brand-board"].title}
          where={GROUPS["brand-board"].where}
          to="/vitrin/blok/brand-board"
          hidden={isHidden("brand-board")}
          links={[{ label: "Bölümü göster / gizle", to: settings("brand-board") }]}
        >
          <ImagePreview blocks={group("brand-board").slice(0, 4)} storefront={storefront} fields={["banner"]} />
        </Band>

        <Band
          n={++n}
          title="Haftanın Ürünleri ve Yeni Gelenler"
          where="Marka panosunun altındaki yan yana iki ürün rafı (her birinde ilk 8 ürün, kendi kendine döner). Başlıklar ve 'Tümü' bağlantıları 'Düzenle'den."
          to={settings("rails")}
          hidden={isHidden("rails")}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-y-2">
              <ListLink list={list("haftanin")} label={(section("rails")?.data.left_title as string) || "Haftanın Ürünleri"} />
              <ListPreview list={list("haftanin")} storefront={storefront} />
            </div>
            <div className="flex flex-col gap-y-2">
              <ListLink list={list("yeni")} label={(section("rails")?.data.right_title as string) || "Yeni Gelenler"} />
              <ListPreview list={list("yeni")} storefront={storefront} />
            </div>
          </div>
        </Band>

        <Band
          n={++n}
          title="Fırsat Ürünleri"
          where="Solda bölümün görseli, yanında dört ürün; her ürünün üstünde 'Fırsat Ürünü' etiketi. Görsel, buton ve etiket 'Düzenle'den; ürünler listeden."
          to={settings("deals")}
          hidden={isHidden("deals")}
          links={[{ label: `Ürünleri seç (${list("super-firsat")?.product_ids.length ?? 0})`, to: "/vitrin/liste/super-firsat" }]}
        >
          <div className="flex flex-wrap items-center gap-2">
            {deals.image ? (
              <div className="h-12 w-20 overflow-hidden rounded-md border" title="Bölüm görseli">
                <img src={mediaUrl(deals.image as string, storefront)} alt="" className="h-full w-full object-cover" />
              </div>
            ) : null}
            <ListPreview list={list("super-firsat")} storefront={storefront} count={4} />
          </div>
        </Band>

        <Band
          n={++n}
          title={(section("featured")?.data.title as string) || "Öne Çıkanlar"}
          where={`${LIST_PLACES["one-cikan"]} Başlık 'Düzenle'den, ürünler listeden.`}
          to={settings("featured")}
          hidden={isHidden("featured")}
          links={[{ label: `Ürünleri seç (${list("one-cikan")?.product_ids.length ?? 0})`, to: "/vitrin/liste/one-cikan" }]}
        >
          <ListPreview list={list("one-cikan")} storefront={storefront} count={20} />
        </Band>

        <Band
          n={++n}
          title={(section("brands")?.data.title as string) || "Markalarımız"}
          where="İki kart yan yana: solda tescilli markalarımız, sağda yetkili satıcısı olduğumuz markalar. Bölüm başlığı 'Düzenle'den."
          to={settings("brands")}
          hidden={isHidden("brands")}
          links={[
            { label: "Kartların yazıları", to: "/vitrin/blok/banner" },
            { label: `Tescilli markalarımız (${group("own-brand").length})`, to: "/vitrin/blok/own-brand" },
            { label: "Yetkili satıcılık logoları → Marka panosu", to: "/vitrin/blok/brand-board" },
          ]}
        >
          <div className="flex flex-col gap-y-2">
            <ImagePreview blocks={[...banner("dual-1"), ...banner("dual-2")]} storefront={storefront} />
            <LogoPreview blocks={group("own-brand")} storefront={storefront} />
          </div>
        </Band>

        <Band
          n={++n}
          title={GROUPS["brand-wall"].title}
          where={GROUPS["brand-wall"].where}
          to="/vitrin/blok/brand-wall"
          hidden={isHidden("brand-wall")}
          links={[{ label: "'Tümünü gör' butonu · göster / gizle", to: settings("brand-wall") }]}
        >
          <LogoPreview blocks={group("brand-wall")} storefront={storefront} />
        </Band>

        <Band
          n={++n}
          title={(section("company")?.data.title as string) || "Referanslar ve Projeler"}
          where="Üç kart: Referanslarımız, Çözüm Ortaklarımız, Projelerimiz. Kartların başlığı, yazısı ve bağlantısı 'Kartlar'dan; bölüm başlığı 'Düzenle'den."
          to={settings("company")}
          hidden={isHidden("company")}
          links={[{ label: "Kartlar", to: "/vitrin/blok/company-card" }]}
        >
          <div className="flex flex-wrap gap-2">
            {companyCards.map((b) => (
              <Badge key={b.id} size="small">
                {b.data.title || "başlıksız"}
              </Badge>
            ))}
          </div>
        </Band>

        <Band
          n={++n}
          title={GROUPS.trust.title}
          where={GROUPS.trust.where}
          to="/vitrin/blok/trust"
          hidden={isHidden("trust")}
          links={[{ label: "Bölümü göster / gizle", to: settings("trust") }]}
        >
          <div className="flex flex-wrap gap-2">
            {group("trust").map((b) => (
              <Badge key={b.id} size="small" color={b.is_active ? "grey" : "orange"}>
                {b.data.title}
              </Badge>
            ))}
          </div>
        </Band>
      </Container>

      <Container className="divide-y p-0">
        <div className="px-6 py-3">
          <Heading level="h2">Diğer sayfalar</Heading>
        </div>

        <Band
          title="İletişim sayfası"
          where="Adres / telefon kutusundaki etiketler ve butonlar, teklif modu, ekip bölümlerinin başlıkları, formun başlığı, konu seçenekleri ve gönderildi mesajı. Adres, telefon, çalışma saatleri ve kutunun arka planı 'Şirket bilgileri'nden gelir."
          to="/vitrin/blok/page?bolum=iletisim"
          links={[
            { label: `Ekibimiz (${group("staff").length} kişi)`, to: "/vitrin/blok/staff" },
            { label: "Şirket bilgileri", to: "/vitrin/blok/company" },
          ]}
        >
          <div className="flex flex-wrap gap-2">
            {group("staff").map((b) => (
              <Badge key={b.id} size="small" color={b.is_active ? "grey" : "orange"}>
                {DEPARTMENT_NAMES[b.data.department] ?? "—"}: {b.data.name || "isim girilmedi"}
              </Badge>
            ))}
          </div>
        </Band>

        <CorporatePage
          page="referanslar"
          where="Başlık ve giriş yazısı, firma kartları (referanslar) ve altındaki başlıklı metin bölümleri."
          extra={{ label: `Referanslar (${group("reference").length} firma)`, to: "/vitrin/blok/reference" }}
          sections={sectionsOf("referanslar")}
        />
        <CorporatePage
          page="cozum-ortaklarimiz"
          where="Başlık ve giriş yazısı, marka logoları ve altındaki metin bölümleri. Logolar ana sayfadaki Marka duvarı ile aynıdır."
          extra={{ label: `Marka logoları → Marka duvarı (${group("brand-wall").length})`, to: "/vitrin/blok/brand-wall" }}
          sections={sectionsOf("cozum-ortaklarimiz")}
        />
        <CorporatePage
          page="projeler"
          where="Başlık ve giriş yazısı, fotoğraflı proje kartları ve altındaki başlıklı metin bölümleri."
          extra={{ label: `Projeler (${group("project").length} proje)`, to: "/vitrin/blok/project" }}
          sections={sectionsOf("projeler")}
        />

        <Band
          title="Kategoriler"
          where="Üst menü ve kategori sayfaları: 14 ana kategori ve alt kategorileri. Ürünlerin hangi kategoride olduğunu her ürünün formundan seçersiniz; kategori ağacının kendisi (yeni kategori eklemek, ad değiştirmek) sitenin kodunda tanımlıdır, bu yüzden o değişiklik için geliştiriciye başvurun."
          to="/categories"
          external
        />
      </Container>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Vitrin",
  icon: Swatch,
})

export default VitrinPage
