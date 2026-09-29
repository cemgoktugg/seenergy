import { ArrowUpRightOnBox } from "@medusajs/icons"
import { Button, Checkbox, Container, Heading, Input, Label, Select, Switch, Text, Textarea, toast } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { LIST_PLACES } from "../lib/blocks"
import {
  BADGE_LABELS,
  errorText,
  formatTRY,
  useSaveQuickProduct,
  useVitrin,
  useVitrinOptions,
  type QuickProduct,
  type QuickProductInput,
} from "../lib/vitrin"
import { FieldShell, GalleryField } from "./fields"

/**
 * One form for a whole SEENERGY product — create and edit alike.
 *
 * Laid out in the order a shop person fills it: what is it, what does it cost
 * and how many are there, what does it look like, where does it show. Every
 * Medusa concept behind it (variant, price list, inventory level…) is handled
 * by the backend; none of it appears here.
 */

const NEW_BRAND = "__new__"
const NO_BADGE = "__none__"

interface FormState {
  title: string
  description: string
  brand_id: string
  new_brand: string
  category_id: string
  sku: string
  price: string
  sale_price: string
  stock: string
  images: string[]
  badge: string
  instalment: boolean
  published: boolean
  list_keys: string[]
}

const fromProduct = (p?: QuickProduct): FormState => ({
  title: p?.title ?? "",
  description: p?.description ?? "",
  brand_id: p?.brand_id ?? "",
  new_brand: "",
  category_id: p?.category_id ?? "",
  sku: p?.sku ?? "",
  price: p?.price != null ? String(p.price) : "",
  sale_price: p?.sale_price != null ? String(p.sale_price) : "",
  stock: p ? String(p.stock) : "",
  images: p?.images?.length ? p.images : p?.image ? [p.image] : [],
  badge: p?.badge ?? NO_BADGE,
  instalment: p?.instalment ?? true,
  published: p ? p.status === "published" : true,
  list_keys: p?.list_keys ?? [],
})

/**
 * Accepts "1.249,90", "1249,90", "1249.90" and "1.249" — people type prices
 * every way. A dot followed by exactly three digits is a Turkish thousands
 * separator ("1.249" is 1249, not 1,249).
 */
const parseMoney = (value: string): number | null => {
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

function Section({ title, children, aside }: { title: string; children: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-3">
        <Heading level="h2">{title}</Heading>
        {aside}
      </div>
      <div className="grid gap-5 px-6 py-5 md:grid-cols-2">{children}</div>
    </Container>
  )
}

export function QuickProductForm({ product }: { product?: QuickProduct }) {
  const navigate = useNavigate()
  const { data: options } = useVitrinOptions()
  const { data: vitrin } = useVitrin()
  const save = useSaveQuickProduct()
  const [form, setForm] = useState<FormState>(() => fromProduct(product))
  useEffect(() => setForm(fromProduct(product)), [product?.id, product?.updated_at])
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }))

  const price = parseMoney(form.price)
  const sale = parseMoney(form.sale_price)
  const discount = price && sale && sale < price ? Math.round(((price - sale) / price) * 100) : null
  const storefront = vitrin?.storefront_url ?? ""

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const problems: string[] = []
    if (form.title.trim().length < 3) problems.push("Ürün adı")
    if (!form.brand_id || (form.brand_id === NEW_BRAND && !form.new_brand.trim())) problems.push("Marka")
    if (!form.category_id) problems.push("Kategori")
    if (!price || Number.isNaN(price) || price <= 0) problems.push("Fiyat")
    if (Number.isNaN(sale)) problems.push("İndirimli fiyat")
    if (sale != null && price && sale >= price) {
      return toast.error("İndirimli fiyat, normal fiyattan düşük olmalı.")
    }
    const stock = Number(form.stock)
    if (form.stock.trim() === "" || !Number.isInteger(stock) || stock < 0) problems.push("Stok")
    if (problems.length) return toast.error(`Lütfen kontrol edin: ${problems.join(", ")}`)

    const input: QuickProductInput = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      status: form.published ? "published" : "draft",
      brand_id: form.brand_id === NEW_BRAND ? null : form.brand_id,
      new_brand: form.brand_id === NEW_BRAND ? form.new_brand.trim() : null,
      category_id: form.category_id,
      sku: form.sku.trim() || null,
      price: price!,
      sale_price: sale,
      stock,
      images: form.images,
      badge: form.badge === NO_BADGE ? null : (form.badge as QuickProduct["badge"]),
      instalment: form.instalment,
      list_keys: form.list_keys,
    }
    save.mutate(
      { id: product?.id, input },
      {
        onSuccess: ({ product: saved }) => {
          toast.success(product ? "Ürün kaydedildi. Sitede güncellendi." : "Ürün eklendi. Sitede yayında.")
          if (!product) navigate(`/vitrin/urunler/${saved.id}`, { replace: true })
        },
        onError: (error) => toast.error(errorText(error)),
      }
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-y-3 pb-20">
      <Container className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            <Link to="/vitrin/urunler" className="hover:underline">Ürün Yönetimi</Link> / {product ? "Düzenle" : "Yeni ürün"}
          </Text>
          <Heading className="mt-1">{product ? product.title : "Yeni ürün ekle"}</Heading>
          {product ? null : (
            <Text size="small" className="text-ui-fg-subtle mt-1">
              Yıldızlı alanlar zorunlu. Gerisi sonradan da eklenebilir.
            </Text>
          )}
        </div>
        {product ? (
          <div className="flex gap-x-2">
            {storefront ? (
              <Button size="small" variant="secondary" asChild>
                <a href={`${storefront}/urun/${product.handle}`} target="_blank" rel="noreferrer">
                  <ArrowUpRightOnBox />
                  Sitede gör
                </a>
              </Button>
            ) : null}
            <Button size="small" variant="transparent" asChild>
              <Link to={`/products/${product.id}`}>Gelişmiş düzenleme</Link>
            </Button>
          </div>
        ) : null}
      </Container>

      <Section title="1. Ürün bilgisi">
        <div className="md:col-span-2">
          <FieldShell label="Ürün adı" required htmlFor="qp-title" hint="Sitede ve aramada bu ad görünür. Marka ve model kodunu yazın.">
            <Input id="qp-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Orbisat OR-9500 4K Ultra HD Uydu Alıcısı" />
          </FieldShell>
        </div>
        <FieldShell label="Marka" required>
          <Select value={form.brand_id || undefined} onValueChange={(v) => set("brand_id", v)}>
            <Select.Trigger>
              <Select.Value placeholder="Marka seçin" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={NEW_BRAND}>+ Yeni marka ekle</Select.Item>
              {(options?.brands ?? []).map((b) => (
                <Select.Item key={b.id} value={b.id}>
                  {b.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          {form.brand_id === NEW_BRAND ? (
            <Input className="mt-2" placeholder="Yeni markanın adı" value={form.new_brand} onChange={(e) => set("new_brand", e.target.value)} />
          ) : null}
        </FieldShell>
        <FieldShell label="Kategori" required>
          <Select value={form.category_id || undefined} onValueChange={(v) => set("category_id", v)}>
            <Select.Trigger>
              <Select.Value placeholder="Kategori seçin" />
            </Select.Trigger>
            <Select.Content>
              {(options?.categories ?? []).map((c) => (
                <Select.Item key={c.id} value={c.id}>
                  {c.name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </FieldShell>
        <FieldShell label="Ürün kodu (SKU)" htmlFor="qp-sku" hint="Boş bırakırsanız otomatik verilir.">
          <Input id="qp-sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
        </FieldShell>
        <div className="md:col-span-2">
          <FieldShell label="Açıklama" htmlFor="qp-desc">
            <Textarea id="qp-desc" rows={4} value={form.description} onChange={(e) => set("description", e.target.value)} />
          </FieldShell>
        </div>
      </Section>

      <Section title="2. Fiyat ve stok">
        <FieldShell label="Satış fiyatı (KDV dahil, TL)" required htmlFor="qp-price">
          <Input id="qp-price" inputMode="decimal" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="1.249,90" />
        </FieldShell>
        <FieldShell
          label="İndirimli fiyat (TL)"
          htmlFor="qp-sale"
          hint={
            discount
              ? `Sitede %${discount} indirim olarak görünür: ${formatTRY(price)} yerine ${formatTRY(sale)}.`
              : "Doldurursanız normal fiyat üstü çizili gösterilir."
          }
        >
          <Input id="qp-sale" inputMode="decimal" value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} />
        </FieldShell>
        <FieldShell label="Stok adedi" required htmlFor="qp-stock" hint="0 yazarsanız ürün 'Tükendi' olarak görünür.">
          <Input id="qp-stock" inputMode="numeric" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
        </FieldShell>
        <FieldShell label="Taksit" hint="Kartla ödeme açıldığında sitede görünür; şu an sitede gösterilmiyor.">
          <label className="txt-compact-small flex items-center gap-x-2 pt-1.5">
            <Switch checked={form.instalment} onCheckedChange={(v) => set("instalment", v)} />
            Taksit seçeneği göster
          </label>
        </FieldShell>
      </Section>

      <Section title="3. Görseller">
        <div className="md:col-span-2">
          <FieldShell
            label="Ürün görselleri"
            hint="İlk görsel ana görseldir: ürün kartlarında ve sepette o görünür. Ürün sayfasında hepsi, bu sırayla, küçük resimli bir galeride gösterilir. Birden çok dosyayı aynı anda seçebilir veya sürükleyebilirsiniz. Beyaz veya şeffaf arka planlı, kare görseller en iyi sonucu verir."
          >
            <GalleryField value={form.images} onChange={(v) => set("images", v)} storefront={storefront} />
          </FieldShell>
        </div>
      </Section>

      <Section title="4. Vitrin">
        <FieldShell label="Rozet" hint="Ürün kartının köşesindeki etiket.">
          <Select value={form.badge} onValueChange={(v) => set("badge", v)}>
            <Select.Trigger>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value={NO_BADGE}>Rozet yok</Select.Item>
              {Object.entries(BADGE_LABELS).map(([value, label]) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </FieldShell>
        <div className="md:col-span-2">
          <Label size="small" weight="plus">
            Ana sayfada göster
          </Label>
          <div className="mt-2 grid gap-2 md:grid-cols-2">
            {(vitrin?.lists ?? []).map((list) => (
              <label key={list.key} className="hover:bg-ui-bg-base-hover flex cursor-pointer items-start gap-x-3 rounded-lg border px-3 py-2.5">
                <Checkbox
                  className="mt-0.5"
                  checked={form.list_keys.includes(list.key)}
                  onCheckedChange={(checked) =>
                    set(
                      "list_keys",
                      checked ? [...form.list_keys, list.key] : form.list_keys.filter((k) => k !== list.key)
                    )
                  }
                />
                <span>
                  <Text size="small" weight="plus">
                    {list.title}
                  </Text>
                  <Text size="xsmall" className="text-ui-fg-subtle">
                    {LIST_PLACES[list.key] ?? list.description}
                  </Text>
                </span>
              </label>
            ))}
          </div>
        </div>
      </Section>

      <Container className="px-6 py-4">
        <label className="flex items-center gap-x-3">
          <Switch checked={form.published} onCheckedChange={(v) => set("published", v)} />
          <span>
            <Text size="small" weight="plus">
              {form.published ? "Yayında" : "Taslak"}
            </Text>
            <Text size="xsmall" className="text-ui-fg-subtle">
              {form.published ? "Ürün sitede görünür ve satılabilir." : "Ürün kaydedilir ama sitede görünmez."}
            </Text>
          </span>
        </label>
      </Container>

      <div className="bg-ui-bg-base shadow-elevation-flyout fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-x-3 rounded-xl border px-4 py-2.5">
        <Button size="small" variant="secondary" type="button" onClick={() => navigate("/vitrin/urunler")}>
          Vazgeç
        </Button>
        <Button size="small" type="submit" isLoading={save.isPending}>
          {product ? "Kaydet" : "Ürünü ekle"}
        </Button>
      </div>
    </form>
  )
}
