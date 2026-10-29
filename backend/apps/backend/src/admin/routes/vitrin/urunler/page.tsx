import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ArrowPath, MagnifyingGlass, PencilSquare, Photo, Plus, XMark } from "@medusajs/icons"
import {
  Badge,
  Button,
  Checkbox,
  Container,
  Heading,
  IconButton,
  Input,
  Select,
  Switch,
  Table,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui"
import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
  errorText,
  mediaUrl,
  moneyInput,
  parseMoney,
  uploadImage,
  useAllQuickProducts,
  useBatchUpdate,
  useTicariCoreSync,
  useVitrin,
  useVitrinOptions,
  type QuickPatch,
  type QuickProduct,
  type VitrinCategory,
} from "../../../lib/vitrin"

/**
 * Ürün Yönetimi — the catalogue, category by category.
 *
 *   left    the category tree, every category and subcategory with its count;
 *           "Tüm ürünler" and "Kategorisiz" above it
 *   top     search (name, brand, code), quick filters that count themselves
 *           (fiyatı yok, görseli yok, stokta yok, indirimde, taslak), sorting
 *   table   price, sale price, stock and "Yayında" edited in place; changes
 *           collect and are saved together with one "Kaydet" (a bar at the
 *           bottom says how many). A picture dropped on a row's thumbnail
 *           becomes its main picture at once.
 *   bulk    tick rows → raise/lower prices by %, give or remove a % discount,
 *           publish / unpublish, move to another category — all as pending
 *           edits, reviewed in the table before "Kaydet".
 *
 * The whole catalogue is loaded once (hundreds of products, not millions), so
 * every switch and filter is instant. The category in view lives in the URL
 * (?kategori=), so the product form's "geri" lands back on it.
 */

const PAGE = 50
const ALL = "tumu"
const NONE = "kategorisiz"

type Edit = Partial<{ price: string; sale_price: string; stock: string; status: "published" | "draft"; category_id: string }>
type Filter = "all" | "no-price" | "no-image" | "out" | "sale" | "draft"
type Sort = "name" | "price-asc" | "price-desc" | "stock-asc"

const FILTERS: { key: Filter; label: string; test: (p: QuickProduct) => boolean }[] = [
  { key: "all", label: "Tümü", test: () => true },
  { key: "no-price", label: "Fiyatı yok", test: (p) => p.price == null },
  { key: "no-image", label: "Görseli yok", test: (p) => !p.image },
  { key: "out", label: "Stokta yok", test: (p) => p.price != null && p.stock <= 0 },
  { key: "sale", label: "İndirimde", test: (p) => p.sale_price != null },
  { key: "draft", label: "Taslak", test: (p) => p.status !== "published" },
]

const lower = (s: string | null | undefined) => (s ?? "").toLocaleLowerCase("tr")
const round2 = (n: number) => Math.round(n * 100) / 100

/** What a row's edit would save; `error` when it cannot be saved as typed. */
function patchOf(p: QuickProduct, e: Edit): { patch: QuickPatch | null; error?: string } {
  const patch: QuickPatch = { id: p.id }
  let price = p.price
  let sale = p.sale_price
  if (e.price !== undefined) {
    const v = parseMoney(e.price)
    if (Number.isNaN(v)) return { patch: null, error: "Fiyat anlaşılamadı." }
    if (v != null && v <= 0) return { patch: null, error: "Fiyat 0'dan büyük olmalı." }
    price = v
    if (v !== p.price) patch.price = v
  }
  if (e.sale_price !== undefined) {
    const v = parseMoney(e.sale_price)
    if (Number.isNaN(v)) return { patch: null, error: "İndirimli fiyat anlaşılamadı." }
    sale = v
    if (v !== p.sale_price) patch.sale_price = v
  }
  if (price == null && sale != null) return { patch: null, error: "Fiyatı olmayan ürüne indirim girilemez." }
  if (price != null && sale != null && !(sale > 0 && sale < price)) {
    return { patch: null, error: "İndirimli fiyat, fiyattan düşük olmalı." }
  }
  if (e.stock !== undefined) {
    const v = Number(e.stock.trim())
    if (e.stock.trim() === "" || !Number.isInteger(v) || v < 0) return { patch: null, error: "Stok 0 veya daha büyük tam sayı olmalı." }
    if (v !== p.stock) patch.stock = v
  }
  if (e.status && e.status !== p.status) patch.status = e.status
  if (e.category_id && e.category_id !== p.category_id) patch.category_id = e.category_id
  return { patch: Object.keys(patch).length > 1 ? patch : null }
}

function CategoryTree({
  categories,
  counts,
  total,
  uncategorized,
  selected,
  onSelect,
}: {
  categories: VitrinCategory[]
  counts: Map<string, number>
  total: number
  uncategorized: number
  selected: string
  onSelect: (id: string) => void
}) {
  const tops = categories.filter((c) => !c.parent_id).sort((a, b) => a.rank - b.rank)
  const children = (id: string) => categories.filter((c) => c.parent_id === id).sort((a, b) => a.rank - b.rank)
  const item = (id: string, label: string, count: number, depth = 0) => (
    <button
      key={id}
      type="button"
      onClick={() => onSelect(id)}
      className={`txt-compact-small flex w-full items-center justify-between gap-2 rounded-md py-1.5 pr-2 text-left transition-colors ${
        depth ? "pl-6" : "pl-2"
      } ${selected === id ? "bg-ui-bg-base-pressed text-ui-fg-base font-medium" : "text-ui-fg-subtle hover:bg-ui-bg-base-hover"}`}
    >
      <span className="truncate">{label}</span>
      <span className={`txt-compact-xsmall shrink-0 ${count ? "" : "text-ui-fg-muted"}`}>{count}</span>
    </button>
  )
  return (
    <nav className="flex flex-col gap-y-0.5" aria-label="Kategoriler">
      {item(ALL, "Tüm ürünler", total)}
      {uncategorized ? item(NONE, "Kategorisiz", uncategorized) : null}
      <div className="my-1.5 border-t" />
      {tops.map((top) => (
        <div key={top.id}>
          {item(top.id, top.name, counts.get(top.id) ?? 0)}
          {children(top.id).map((child) => item(child.id, child.name, counts.get(child.id) ?? 0, 1))}
        </div>
      ))}
    </nav>
  )
}

/** The main picture; a file dropped or picked here becomes the new main one. */
function Thumb({ product, storefront, onImage, busy }: { product: QuickProduct; storefront: string; onImage: (file: File) => void; busy: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  return (
    <button
      type="button"
      title={product.image ? "Yeni ana görsel için tıklayın veya görsel sürükleyin" : "Görsel eklemek için tıklayın veya sürükleyin"}
      onClick={() => input.current?.click()}
      onDragOver={(e) => {
        e.preventDefault()
        setOver(true)
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        const file = e.dataTransfer.files[0]
        if (file) onImage(file)
      }}
      className={`bg-ui-bg-subtle relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md border ${
        over ? "border-ui-border-interactive ring-ui-border-interactive ring-2" : product.image ? "" : "border-dashed"
      } ${busy ? "opacity-50" : ""}`}
    >
      {product.image ? (
        <img src={mediaUrl(product.image, storefront)} alt="" className="h-full w-full object-contain p-0.5" />
      ) : (
        <Photo className="text-ui-fg-muted" />
      )}
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onImage(file)
          e.target.value = ""
        }}
      />
    </button>
  )
}

const ProductsPage = () => {
  const navigate = useNavigate()
  const prompt = usePrompt()
  const [params, setParams] = useSearchParams()
  const { data: vitrin } = useVitrin()
  const { data: options } = useVitrinOptions()
  const { data, isLoading } = useAllQuickProducts()
  const batch = useBatchUpdate()
  const ticari = useTicariCoreSync()

  const storefront = vitrin?.storefront_url ?? ""
  const categories = options?.categories ?? []
  const products = data?.products ?? []
  const selected = params.get("kategori") ?? ALL

  const [q, setQ] = useState("")
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("name")
  const [page, setPage] = useState(0)
  const [edits, setEdits] = useState<Record<string, Edit>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [picked, setPicked] = useState<Set<string>>(new Set())
  const [uploading, setUploading] = useState<string | null>(null)
  const [pct, setPct] = useState("")
  const [moveTo, setMoveTo] = useState("")

  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])
  const parentOf = useMemo(() => new Map(categories.map((c) => [c.id, c.parent_id])), [categories])
  const categoryName = (id: string | null | undefined) => categories.find((c) => c.id === id)?.label ?? ""

  // Counts per category (a parent counts its subcategories' products too).
  const counts = useMemo(() => {
    const map = new Map<string, number>()
    for (const p of products) {
      if (!p.category_id) continue
      map.set(p.category_id, (map.get(p.category_id) ?? 0) + 1)
      const parent = parentOf.get(p.category_id)
      if (parent) map.set(parent, (map.get(parent) ?? 0) + 1)
    }
    return map
  }, [products, parentOf])

  const inCategory = (p: QuickProduct) =>
    selected === ALL
      ? true
      : selected === NONE
        ? !p.category_id
        : p.category_id === selected || (p.category_id ? parentOf.get(p.category_id) === selected : false)

  const term = lower(q.trim())
  const scoped = products.filter(inCategory).filter(
    (p) => !term || lower(p.title).includes(term) || lower(p.brand).includes(term) || lower(p.sku).includes(term)
  )
  const filterCounts = new Map(FILTERS.map((f) => [f.key, scoped.filter(f.test).length]))
  const filtered = scoped.filter(FILTERS.find((f) => f.key === filter)!.test)
  const sorted = [...filtered].sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title, "tr")
    if (sort === "stock-asc") return a.stock - b.stock
    const pa = a.price ?? (sort === "price-asc" ? Infinity : -Infinity)
    const pb = b.price ?? (sort === "price-asc" ? Infinity : -Infinity)
    return sort === "price-asc" ? pa - pb : pb - pa
  })
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE))
  const visible = sorted.slice(page * PAGE, page * PAGE + PAGE)
  useEffect(() => setPage(0), [selected, term, filter, sort])

  const pending = Object.entries(edits)
    .map(([id, edit]) => {
      const p = byId.get(id)
      return p ? { p, ...patchOf(p, edit) } : null
    })
    .filter((x): x is NonNullable<typeof x> => x !== null && (x.patch !== null || Boolean(x.error)))
  const dirty = pending.length > 0

  useEffect(() => {
    if (!dirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener("beforeunload", warn)
    return () => window.removeEventListener("beforeunload", warn)
  }, [dirty])

  const leave = async (to: string) => {
    if (dirty) {
      const ok = await prompt({
        title: "Kaydedilmemiş değişiklikler var",
        description: `${pending.length} üründe yaptığınız değişiklikler kaydedilmedi. Çıkarsanız kaybolur.`,
        confirmText: "Kaydetmeden çık",
        cancelText: "Geri dön",
      })
      if (!ok) return
    }
    navigate(to)
  }

  const setEdit = (id: string, patch: Edit) => {
    setEdits((all) => ({ ...all, [id]: { ...all[id], ...patch } }))
    setErrors((all) => {
      if (!all[id]) return all
      const { [id]: _drop, ...rest } = all
      return rest
    })
  }
  const value = (p: QuickProduct, field: "price" | "sale_price" | "stock") => {
    const edit = edits[p.id]?.[field]
    if (edit !== undefined) return edit
    return field === "stock" ? String(p.stock) : moneyInput(p[field])
  }
  const changed = (p: QuickProduct, field: keyof Edit) => {
    const e = edits[p.id]
    if (!e || e[field] === undefined) return false
    if (field === "stock") return Number(e.stock) !== p.stock
    if (field === "price" || field === "sale_price") return parseMoney(e[field]!) !== p[field]
    if (field === "status") return e.status !== p.status
    return e.category_id !== p.category_id
  }

  const pullFromTicariCore = () =>
    ticari.mutate(undefined, {
      onSuccess: ({ report: r }) => {
        const added = [...r.brands.created.map((b) => `marka ${b}`), ...r.categories.created.map((c) => `kategori ${c}`)]
        const summary =
          `${r.items} ürün: ${r.products.created.length} yeni, ${r.products.updated.length} güncellendi, ` +
          `${r.products.unchanged} değişmedi` +
          (r.products.unpublished.length ? `, ${r.products.unpublished.length} yayından kalktı` : "") +
          (added.length ? `. Eklenen: ${added.join(", ")}` : "")
        if (r.failed.length) toast.error(`${summary}. Aktarılamayan: ${r.failed.map((f) => `${f.code} — ${f.message}`).join("; ")}`)
        else toast.success(`NetHesap Online: ${summary}.`)
      },
      onError: (error) => toast.error(errorText(error)),
    })

  const save = () => {
    const bad = pending.filter((x) => x.error)
    if (bad.length) {
      setErrors(Object.fromEntries(bad.map((x) => [x.p.id, x.error!])))
      return toast.error(`${bad.length} üründe düzeltilmesi gereken bir değer var; kırmızı satırlara bakın.`)
    }
    const updates = pending.map((x) => x.patch!).filter(Boolean)
    if (!updates.length) return setEdits({})
    batch.mutate(updates, {
      onSuccess: ({ saved, failed }) => {
        setEdits((all) => Object.fromEntries(Object.entries(all).filter(([id]) => !saved.includes(id))))
        setErrors(Object.fromEntries(failed.map((f) => [f.id, f.message])))
        if (failed.length) toast.error(`${saved.length} ürün kaydedildi, ${failed.length} ürün kaydedilemedi; kırmızı satırlara bakın.`)
        else toast.success(`${saved.length} ürün kaydedildi. Sitede güncellendi.`)
      },
      onError: (error) => toast.error(errorText(error)),
    })
  }

  const addImage = async (p: QuickProduct, file: File) => {
    if (!file.type.startsWith("image/")) return toast.error("Lütfen bir görsel dosyası seçin.")
    if (file.size > 5 * 1024 * 1024) return toast.error("Görsel 5 MB'tan küçük olmalı.")
    setUploading(p.id)
    try {
      const url = await uploadImage(file)
      const { failed } = await batch.mutateAsync([{ id: p.id, add_image: url }])
      if (failed.length) toast.error(failed[0].message)
      else toast.success(`${p.title}: yeni ana görsel kaydedildi.`)
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setUploading(null)
    }
  }

  // --- bulk, on the ticked rows -------------------------------------------
  const pickedProducts = [...picked].map((id) => byId.get(id)).filter((p): p is QuickProduct => Boolean(p))
  const pctValue = Number(pct.replace(",", "."))
  const pctOk = pct.trim() !== "" && Number.isFinite(pctValue) && pctValue !== 0
  const bulk = (fn: (p: QuickProduct) => Edit | null, done: string) => {
    let n = 0
    setEdits((all) => {
      const next = { ...all }
      for (const p of pickedProducts) {
        const e = fn(p)
        if (!e) continue
        next[p.id] = { ...next[p.id], ...e }
        n++
      }
      return next
    })
    toast.info(n ? `${done} ${n} ürüne uygulandı. Kontrol edip 'Kaydet'e basın.` : "Seçilen ürünlerin hiçbirine uygulanamadı (fiyatı olmayanlar atlanır).")
  }
  const currentPrice = (p: QuickProduct) => {
    const e = edits[p.id]?.price
    return e !== undefined ? parseMoney(e) : p.price
  }
  const currentSale = (p: QuickProduct) => {
    const e = edits[p.id]?.sale_price
    return e !== undefined ? parseMoney(e) : p.sale_price
  }
  const raise = () =>
    bulk((p) => {
      const price = currentPrice(p)
      if (price == null || Number.isNaN(price)) return null
      const sale = currentSale(p)
      const k = 1 + pctValue / 100
      return {
        price: moneyInput(round2(price * k)),
        ...(sale != null && !Number.isNaN(sale) ? { sale_price: moneyInput(round2(sale * k)) } : {}),
      }
    }, `Fiyatlara %${pctValue > 0 ? "+" : ""}${pctValue}`)
  const discount = () =>
    bulk((p) => {
      const price = currentPrice(p)
      if (price == null || Number.isNaN(price) || pctValue <= 0 || pctValue >= 100) return null
      return { sale_price: moneyInput(round2(price * (1 - pctValue / 100))) }
    }, `%${pctValue} indirim`)

  const allVisiblePicked = visible.length > 0 && visible.every((p) => picked.has(p.id))
  const togglePick = (id: string, on: boolean) =>
    setPicked((s) => {
      const next = new Set(s)
      if (on) next.add(id)
      else next.delete(id)
      return next
    })

  const selectCategory = (id: string) => {
    setParams(id === ALL ? {} : { kategori: id }, { replace: true })
    setPicked(new Set())
  }
  const title =
    selected === ALL ? "Tüm ürünler" : selected === NONE ? "Kategorisiz ürünler" : categoryName(selected) || "Kategori"
  const newHref = `/vitrin/urunler/yeni${selected !== ALL && selected !== NONE ? `?kategori=${selected}` : ""}`
  const editHref = (id: string) => `/vitrin/urunler/${id}${selected !== ALL ? `?kategori=${selected}` : ""}`

  return (
    <div className="flex flex-col gap-y-3 pb-24">
      <Container className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
        <div>
          <Heading>Ürün Yönetimi</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1 max-w-2xl">
            Soldan bir kategori seçin. Fiyat, indirimli fiyat, stok ve yayın durumunu tablodan değiştirip en altta tek
            seferde kaydedin; görsel için ürünün küçük resminin üstüne görsel sürükleyin. Adı, açıklaması, görselleri ve
            teknik özellikleri için “Düzenle”.
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="small"
            variant="secondary"
            isLoading={ticari.isPending}
            onClick={pullFromTicariCore}
            title="Markalar, kategoriler, ürünler, fiyat ve stok NetHesap Online'daki 'websitesi' kanalından alınır. Her 15 dakikada kendiliğinden de çalışır."
          >
            <ArrowPath />
            NetHesap Online'dan çek
          </Button>
          <Button size="small" onClick={() => void leave(newHref)}>
            <Plus />
            Yeni ürün ekle
          </Button>
        </div>
      </Container>

      <div className="grid items-start gap-3 lg:grid-cols-[260px_minmax(0,1fr)]">
        <Container className="px-3 py-3 lg:sticky lg:top-3">
          <Text size="xsmall" weight="plus" className="text-ui-fg-muted mb-2 px-2 uppercase tracking-wide">
            Kategoriler
          </Text>
          <CategoryTree
            categories={categories}
            counts={counts}
            total={products.length}
            uncategorized={products.filter((p) => !p.category_id).length}
            selected={selected}
            onSelect={selectCategory}
          />
        </Container>

        <Container className="divide-y p-0">
          <div className="flex flex-col gap-3 px-6 py-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Heading level="h2">
                {title}{" "}
                <span className="text-ui-fg-muted txt-compact-medium font-normal">· {scoped.length} ürün</span>
              </Heading>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-64">
                  <Input size="small" type="search" placeholder="Ad, marka veya ürün kodu…" value={q} onChange={(e) => setQ(e.target.value)} />
                  <MagnifyingGlass className="text-ui-fg-muted pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                </div>
                <Select size="small" value={sort} onValueChange={(v) => setSort(v as Sort)}>
                  <Select.Trigger className="w-44">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="name">Ada göre (A–Z)</Select.Item>
                    <Select.Item value="price-asc">Fiyat: düşükten yükseğe</Select.Item>
                    <Select.Item value="price-desc">Fiyat: yüksekten düşüğe</Select.Item>
                    <Select.Item value="stock-asc">Stok: azdan çoğa</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const n = filterCounts.get(f.key) ?? 0
                const on = filter === f.key
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`txt-compact-small rounded-full border px-3 py-1 transition-colors ${
                      on ? "bg-ui-button-inverted text-ui-fg-on-inverted border-transparent" : "text-ui-fg-subtle hover:bg-ui-bg-base-hover"
                    }`}
                  >
                    {f.label} <span className={on ? "opacity-80" : "text-ui-fg-muted"}>{n}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {picked.size > 0 ? (
            <div className="bg-ui-bg-subtle flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3">
              <Text size="small" weight="plus">
                {picked.size} ürün seçildi
              </Text>
              <div className="flex items-center gap-1.5">
                <Input size="small" className="w-20" inputMode="decimal" placeholder="%" value={pct} onChange={(e) => setPct(e.target.value)} />
                <Button size="small" variant="secondary" disabled={!pctOk} onClick={raise} title="Örn. 10 = %10 zam, -5 = %5 indirim (fiyat ve varsa indirimli fiyat birlikte)">
                  Fiyatlara % uygula
                </Button>
                <Button size="small" variant="secondary" disabled={!pctOk || pctValue <= 0 || pctValue >= 100} onClick={discount} title="Fiyatın bu kadar altında bir indirimli fiyat yazar">
                  % indirim yap
                </Button>
                <Button size="small" variant="transparent" onClick={() => bulk((p) => (currentSale(p) != null ? { sale_price: "" } : null), "İndirim kaldırma")}>
                  İndirimi kaldır
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <Button size="small" variant="secondary" onClick={() => bulk(() => ({ status: "published" }), "Yayına alma")}>
                  Yayına al
                </Button>
                <Button size="small" variant="secondary" onClick={() => bulk(() => ({ status: "draft" }), "Taslağa alma")}>
                  Taslağa al
                </Button>
              </div>
              <div className="flex items-center gap-1.5">
                <Select size="small" value={moveTo || undefined} onValueChange={setMoveTo}>
                  <Select.Trigger className="w-56">
                    <Select.Value placeholder="Kategoriye taşı…" />
                  </Select.Trigger>
                  <Select.Content>
                    {[...categories].sort((a, b) => a.label.localeCompare(b.label, "tr")).map((c) => (
                      <Select.Item key={c.id} value={c.id}>
                        {c.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select>
                <Button size="small" variant="secondary" disabled={!moveTo} onClick={() => bulk(() => ({ category_id: moveTo }), "Kategori değişikliği")}>
                  Taşı
                </Button>
              </div>
              <Button size="small" variant="transparent" onClick={() => setPicked(new Set())}>
                <XMark />
                Seçimi kaldır
              </Button>
            </div>
          ) : null}

          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell className="w-10">
                  <Checkbox
                    checked={allVisiblePicked}
                    onCheckedChange={(on) => visible.forEach((p) => togglePick(p.id, on === true))}
                    aria-label="Sayfadakilerin hepsini seç"
                  />
                </Table.HeaderCell>
                <Table.HeaderCell>Ürün</Table.HeaderCell>
                <Table.HeaderCell>Fiyat (TL, KDV dahil)</Table.HeaderCell>
                <Table.HeaderCell>İndirimli fiyat</Table.HeaderCell>
                <Table.HeaderCell>Stok</Table.HeaderCell>
                <Table.HeaderCell>Yayında</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {visible.map((p) => {
                const error = errors[p.id] ?? pending.find((x) => x.p.id === p.id)?.error
                const status = edits[p.id]?.status ?? p.status
                const movedTo = edits[p.id]?.category_id
                const cell = (field: keyof Edit) => (changed(p, field) ? "bg-ui-tag-orange-bg" : "")
                const price = currentPrice(p)
                const sale = currentSale(p)
                const off = price && sale && !Number.isNaN(price) && !Number.isNaN(sale) && sale < price ? Math.round(((price - sale) / price) * 100) : null
                return (
                  <Table.Row key={p.id} className={error ? "bg-ui-tag-red-bg" : picked.has(p.id) ? "bg-ui-bg-highlight" : ""}>
                    <Table.Cell>
                      <Checkbox checked={picked.has(p.id)} onCheckedChange={(on) => togglePick(p.id, on === true)} aria-label={`${p.title} seç`} />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-x-3 py-1.5">
                        <Thumb product={p} storefront={storefront} busy={uploading === p.id} onImage={(file) => void addImage(p, file)} />
                        <div className="min-w-0">
                          <button type="button" onClick={() => void leave(editHref(p.id))} className="text-left hover:underline">
                            <Text size="small" weight="plus" className="max-w-sm truncate">
                              {p.title}
                            </Text>
                          </button>
                          <Text size="xsmall" className="text-ui-fg-subtle">
                            {[p.brand, p.sku].filter(Boolean).join(" · ")}
                            {selected === ALL || (selected !== NONE && p.category_id !== selected) ? ` · ${p.category ?? "kategorisiz"}` : ""}
                          </Text>
                          {movedTo ? (
                            <Text size="xsmall" className="text-ui-fg-interactive">
                              → {categoryName(movedTo)} (kaydedince taşınır)
                            </Text>
                          ) : null}
                          {error ? (
                            <Text size="xsmall" className="text-ui-fg-error">
                              {error}
                            </Text>
                          ) : null}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        size="small"
                        inputMode="decimal"
                        className={`w-28 ${cell("price")}`}
                        placeholder="Teklifle"
                        title="Boş bırakılırsa sitede 'Fiyat için teklif isteyin' görünür."
                        value={value(p, "price")}
                        onChange={(e) => setEdit(p.id, { price: e.target.value })}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1.5">
                        <Input
                          size="small"
                          inputMode="decimal"
                          className={`w-28 ${cell("sale_price")}`}
                          placeholder="—"
                          disabled={price == null}
                          value={value(p, "sale_price")}
                          onChange={(e) => setEdit(p.id, { sale_price: e.target.value })}
                        />
                        {off ? (
                          <Badge size="2xsmall" color="red">
                            %{off}
                          </Badge>
                        ) : null}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <Input
                        size="small"
                        inputMode="numeric"
                        className={`w-20 ${cell("stock")}`}
                        value={value(p, "stock")}
                        onChange={(e) => setEdit(p.id, { stock: e.target.value })}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <div className={`inline-flex rounded-md p-1 ${cell("status")}`}>
                        <Switch
                          checked={status === "published"}
                          onCheckedChange={(on) => setEdit(p.id, { status: on ? "published" : "draft" })}
                          aria-label={`${p.title} yayında`}
                        />
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton size="small" variant="transparent" onClick={() => void leave(editHref(p.id))} aria-label={`${p.title} düzenle`} title="Adı, açıklaması, görselleri, teknik özellikleri">
                        <PencilSquare />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                )
              })}
            </Table.Body>
          </Table>

          {isLoading ? (
            <Text size="small" className="text-ui-fg-subtle px-6 py-8 text-center">
              Ürünler yükleniyor…
            </Text>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-10">
              <Text size="small" className="text-ui-fg-subtle">
                {term ? `“${q.trim()}” ile eşleşen ürün yok.` : filter !== "all" ? "Bu filtreye uyan ürün yok." : "Bu kategoride henüz ürün yok."}
              </Text>
              {!term && filter === "all" && selected !== ALL && selected !== NONE ? (
                <Button size="small" variant="secondary" onClick={() => void leave(newHref)}>
                  <Plus />
                  Bu kategoriye ürün ekle
                </Button>
              ) : null}
            </div>
          ) : null}

          {pages > 1 ? (
            <div className="flex items-center justify-between px-6 py-3">
              <Text size="small" className="text-ui-fg-subtle">
                {sorted.length} ürün · Sayfa {page + 1} / {pages}
              </Text>
              <div className="flex gap-x-2">
                <Button size="small" variant="secondary" disabled={page === 0} onClick={() => setPage((n) => n - 1)}>
                  Önceki
                </Button>
                <Button size="small" variant="secondary" disabled={page + 1 >= pages} onClick={() => setPage((n) => n + 1)}>
                  Sonraki
                </Button>
              </div>
            </div>
          ) : null}
        </Container>
      </div>

      {dirty ? (
        <div className="bg-ui-bg-base shadow-elevation-flyout fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-3 rounded-xl border px-4 py-2.5">
          <Text size="small" weight="plus">
            {pending.length} üründe kaydedilmemiş değişiklik
          </Text>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setEdits({})
              setErrors({})
            }}
          >
            Vazgeç
          </Button>
          <Button size="small" isLoading={batch.isPending} onClick={save}>
            Kaydet
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Ürün Yönetimi",
})

export default ProductsPage
