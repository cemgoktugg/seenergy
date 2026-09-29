import {
  ArrowDownMini,
  ArrowLeftMini,
  ArrowRightMini,
  ArrowUpMini,
  CloudArrowUp,
  DocumentText,
  Plus,
  StarSolid,
  Trash,
  XMark,
} from "@medusajs/icons"
import { Button, IconButton, Input, Label, Select, Text, Textarea, toast, usePrompt } from "@medusajs/ui"
import { useRef, useState } from "react"

import { TRUST_ICONS, type FieldDef } from "../lib/blocks"
import {
  errorText,
  fetchSpecTemplate,
  mediaUrl,
  uploadImage,
  uploadImages,
  useVitrinOptions,
  type SpecGroup,
} from "../lib/vitrin"
import { ProductListEditor } from "./product-list-editor"

/**
 * One input per field type. The block editor maps a GroupDef's fields through
 * <BlockField>, so every vitrin form shares the same controls.
 */

export function FieldShell({
  label,
  hint,
  required,
  htmlFor,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  htmlFor?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-y-1.5">
      <Label htmlFor={htmlFor} size="small" weight="plus">
        {label}
        {required ? <span className="text-ui-fg-error"> *</span> : null}
      </Label>
      {children}
      {hint ? (
        <Text size="xsmall" className="text-ui-fg-subtle">
          {hint}
        </Text>
      ) : null}
    </div>
  )
}

export function ImageField({
  value,
  onChange,
  storefront,
  id,
}: {
  value: string
  onChange: (value: string) => void
  storefront: string
  id?: string
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  const upload = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith("image/")) return toast.error("Lütfen bir görsel dosyası seçin.")
    if (file.size > 5 * 1024 * 1024) return toast.error("Görsel 5 MB'tan küçük olmalı.")
    setBusy(true)
    try {
      onChange(await uploadImage(file))
      toast.success("Görsel yüklendi")
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-start gap-x-3">
      <div
        className="bg-ui-bg-subtle flex h-24 w-32 shrink-0 items-center justify-center overflow-hidden rounded-lg border"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          void upload(e.dataTransfer.files[0])
        }}
      >
        {value ? (
          <img src={mediaUrl(value, storefront)} alt="" className="h-full w-full object-contain" />
        ) : (
          <Text size="xsmall" className="text-ui-fg-muted px-2 text-center">
            Görseli buraya sürükleyin
          </Text>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-y-2">
        <div className="flex gap-x-2">
          <Button type="button" size="small" variant="secondary" isLoading={busy} onClick={() => input.current?.click()}>
            <CloudArrowUp />
            Bilgisayardan yükle
          </Button>
          {value ? (
            <Button type="button" size="small" variant="transparent" onClick={() => onChange("")}>
              <XMark />
              Kaldır
            </Button>
          ) : null}
        </div>
        <Input
          id={id}
          size="small"
          placeholder="veya görsel bağlantısı yapıştırın"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <input
          ref={input}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void upload(e.target.files?.[0])
            e.target.value = ""
          }}
        />
      </div>
    </div>
  )
}

/**
 * A product's pictures, in the order the site shows them. The first is the
 * main picture — the one on cards, in the cart and first in the product page's
 * gallery. Several files can be chosen or dropped at once.
 */
export function GalleryField({
  value,
  onChange,
  storefront,
  max = 20,
}: {
  value: string[]
  onChange: (value: string[]) => void
  storefront: string
  max?: number
}) {
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [link, setLink] = useState("")

  const upload = async (list: FileList | File[] | null | undefined) => {
    const files = Array.from(list ?? [])
    if (!files.length) return
    const images = files.filter((file) => file.type.startsWith("image/"))
    if (images.length < files.length) toast.error("Yalnızca görsel dosyaları yüklenebilir.")
    const fitting = images.filter((file) => file.size <= 5 * 1024 * 1024)
    if (fitting.length < images.length) toast.error("5 MB'tan büyük görseller atlandı.")
    const room = max - value.length
    if (fitting.length > room) toast.error(`En fazla ${max} görsel eklenebilir.`)
    const batch = fitting.slice(0, Math.max(0, room))
    if (!batch.length) return
    setBusy(true)
    try {
      onChange([...value, ...(await uploadImages(batch))])
      toast.success(batch.length === 1 ? "Görsel yüklendi" : `${batch.length} görsel yüklendi`)
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setBusy(false)
    }
  }

  const move = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const addLink = () => {
    const url = link.trim()
    if (!url) return
    if (value.includes(url)) return toast.error("Bu görsel zaten ekli.")
    onChange([...value, url])
    setLink("")
  }

  return (
    <div
      className="flex flex-col gap-y-3"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault()
        void upload(e.dataTransfer.files)
      }}
    >
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div key={`${url}-${index}`} className="flex w-32 flex-col gap-y-1.5">
            <div
              className={`bg-ui-bg-subtle relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-lg border ${
                index === 0 ? "border-ui-border-interactive border-2" : ""
              }`}
            >
              <img src={mediaUrl(url, storefront)} alt="" className="h-full w-full object-contain p-1" />
              {index === 0 ? (
                <span className="bg-ui-bg-interactive txt-compact-xsmall-plus absolute left-1.5 top-1.5 rounded px-1.5 py-0.5 text-white">
                  Ana görsel
                </span>
              ) : null}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex">
                <IconButton
                  type="button"
                  size="small"
                  variant="transparent"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                  aria-label="Sola taşı"
                >
                  <ArrowLeftMini />
                </IconButton>
                <IconButton
                  type="button"
                  size="small"
                  variant="transparent"
                  disabled={index === value.length - 1}
                  onClick={() => move(index, index + 1)}
                  aria-label="Sağa taşı"
                >
                  <ArrowRightMini />
                </IconButton>
              </div>
              <div className="flex">
                {index > 0 ? (
                  <IconButton
                    type="button"
                    size="small"
                    variant="transparent"
                    onClick={() => move(index, 0)}
                    aria-label="Ana görsel yap"
                    title="Ana görsel yap"
                  >
                    <StarSolid />
                  </IconButton>
                ) : null}
                <IconButton
                  type="button"
                  size="small"
                  variant="transparent"
                  onClick={() => onChange(value.filter((_, i) => i !== index))}
                  aria-label="Kaldır"
                  title="Kaldır"
                >
                  <Trash />
                </IconButton>
              </div>
            </div>
          </div>
        ))}

        {value.length < max ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => input.current?.click()}
            className="bg-ui-bg-subtle hover:bg-ui-bg-subtle-hover text-ui-fg-subtle flex h-32 w-32 flex-col items-center justify-center gap-y-1.5 rounded-lg border border-dashed transition-colors disabled:opacity-60"
          >
            <CloudArrowUp />
            <Text size="xsmall" className="px-2 text-center">
              {busy ? "Yükleniyor…" : "Görsel ekle veya sürükleyin"}
            </Text>
          </button>
        ) : null}
      </div>

      <div className="flex max-w-xl gap-x-2">
        <Input
          size="small"
          placeholder="veya görsel bağlantısı yapıştırın"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addLink()
            }
          }}
        />
        <Button type="button" size="small" variant="secondary" onClick={addLink} disabled={!link.trim()}>
          <Plus />
          Ekle
        </Button>
      </div>

      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void upload(e.target.files)
          e.target.value = ""
        }}
      />
    </div>
  )
}

const emptyRow = () => ({ label: "", value: "", note: "" })

/**
 * The product's own "Teknik Özellikler" sheet: groups of label / value rows,
 * with an optional note under a value. Empty rows are simply not saved, so
 * the editor never nags about half-filled lines.
 *
 * Most sheets should start from the category template rather than a blank
 * page — the button fetches it from the storefront, which owns the templates.
 * Leaving the sheet empty is also valid: the product page then shows the
 * template and says it is the category's typical values.
 */
export function SpecsField({
  value,
  onChange,
  storefront,
  categoryHandle,
  categoryName,
}: {
  value: SpecGroup[]
  onChange: (value: SpecGroup[]) => void
  storefront: string
  /** Handle of the category chosen in the form, if any. */
  categoryHandle?: string
  categoryName?: string
}) {
  const prompt = usePrompt()
  const [loading, setLoading] = useState(false)
  const rowCount = value.reduce((total, group) => total + group.rows.length, 0)

  const setGroup = (index: number, group: SpecGroup) => onChange(value.map((g, i) => (i === index ? group : g)))
  const moveGroup = (from: number, to: number) => {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const loadTemplate = async () => {
    if (!categoryHandle) return toast.error("Önce ürünün kategorisini seçin.")
    if (rowCount > 0) {
      const confirmed = await prompt({
        title: "Kategori şablonu yüklensin mi?",
        description: "Bu ürün için girdiğiniz teknik özellikler, kategorinin şablonuyla değiştirilecek.",
        confirmText: "Şablonu yükle",
        cancelText: "Vazgeç",
      })
      if (!confirmed) return
    }
    setLoading(true)
    try {
      const groups = await fetchSpecTemplate(storefront, categoryHandle)
      if (!groups.length) return toast.error("Bu kategori için şablon bulunamadı.")
      onChange(groups.map((group) => ({ title: group.title, rows: group.rows.map((row) => ({ note: "", ...row })) })))
      toast.success("Şablon yüklendi. Değerleri bu ürüne göre düzeltin.")
    } catch (error) {
      toast.error(errorText(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-y-4">
      <div className="bg-ui-bg-subtle flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3">
        <Text size="small" className="text-ui-fg-subtle">
          {value.length === 0
            ? `Bu ürün için özel değer girilmedi. Ürün sayfasında ${categoryName ? `"${categoryName}"` : "kategorinin"} şablonu, "tipik değerler" notuyla gösterilir.`
            : `${value.length} grup · ${rowCount} satır — ürün sayfasında bu değerler gösterilir.`}
        </Text>
        <div className="flex gap-2">
          <Button type="button" size="small" variant="secondary" isLoading={loading} onClick={() => void loadTemplate()}>
            <DocumentText />
            {value.length ? "Şablonla değiştir" : "Kategori şablonunu yükle"}
          </Button>
          {value.length ? (
            <Button type="button" size="small" variant="transparent" onClick={() => onChange([])}>
              <Trash />
              Tümünü temizle
            </Button>
          ) : null}
        </div>
      </div>

      {value.map((group, gi) => (
        <div key={gi} className="flex flex-col gap-y-2 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Input
              size="small"
              placeholder="Grup adı, örn. Ekran"
              value={group.title}
              onChange={(e) => setGroup(gi, { ...group, title: e.target.value })}
              className="font-medium"
            />
            <IconButton type="button" size="small" variant="transparent" disabled={gi === 0} onClick={() => moveGroup(gi, gi - 1)} aria-label="Grubu yukarı taşı">
              <ArrowUpMini />
            </IconButton>
            <IconButton
              type="button"
              size="small"
              variant="transparent"
              disabled={gi === value.length - 1}
              onClick={() => moveGroup(gi, gi + 1)}
              aria-label="Grubu aşağı taşı"
            >
              <ArrowDownMini />
            </IconButton>
            <IconButton
              type="button"
              size="small"
              variant="transparent"
              onClick={() => onChange(value.filter((_, i) => i !== gi))}
              aria-label="Grubu sil"
            >
              <Trash />
            </IconButton>
          </div>

          <div className="text-ui-fg-muted hidden grid-cols-[1fr_1.4fr_1fr_28px] gap-2 px-1 md:grid">
            <Text size="xsmall">Özellik</Text>
            <Text size="xsmall">Değer</Text>
            <Text size="xsmall">Not (isteğe bağlı)</Text>
            <span />
          </div>
          {group.rows.map((row, ri) => {
            const setRow = (patch: Partial<SpecGroup["rows"][number]>) =>
              setGroup(gi, { ...group, rows: group.rows.map((r, i) => (i === ri ? { ...r, ...patch } : r)) })
            return (
              <div key={ri} className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_1.4fr_1fr_28px]">
                <Input size="small" placeholder="Özellik, örn. Çözünürlük" value={row.label} onChange={(e) => setRow({ label: e.target.value })} />
                <Input size="small" placeholder="Değer, örn. 1920 × 1080 px" value={row.value} onChange={(e) => setRow({ value: e.target.value })} />
                <Input size="small" placeholder="Not" value={row.note ?? ""} onChange={(e) => setRow({ note: e.target.value })} />
                <IconButton
                  type="button"
                  size="small"
                  variant="transparent"
                  onClick={() => setGroup(gi, { ...group, rows: group.rows.filter((_, i) => i !== ri) })}
                  aria-label="Satırı sil"
                >
                  <XMark />
                </IconButton>
              </div>
            )
          })}
          <div>
            <Button type="button" size="small" variant="transparent" onClick={() => setGroup(gi, { ...group, rows: [...group.rows, emptyRow()] })}>
              <Plus />
              Satır ekle
            </Button>
          </div>
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" size="small" variant="secondary" onClick={() => onChange([...value, { title: "", rows: [emptyRow()] }])}>
          <Plus />
          Grup ekle
        </Button>
        <Text size="xsmall" className="text-ui-fg-subtle">
          Adı veya değeri boş satırlar kaydedilmez. "Genel" adlı grup, ürün sayfasında marka, ürün kodu ve kategoriyle birleşir.
        </Text>
      </div>
    </div>
  )
}

function TagsField({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const [draft, setDraft] = useState("")
  const add = () => {
    const tag = draft.trim()
    if (tag && !value.includes(tag)) onChange([...value, tag])
    setDraft("")
  }
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <span key={tag} className="bg-ui-bg-subtle txt-compact-small flex items-center gap-x-1 rounded-full border py-0.5 pl-2.5 pr-1">
            {tag}
            <IconButton size="2xsmall" variant="transparent" onClick={() => onChange(value.filter((t) => t !== tag))} aria-label={`${tag} sil`}>
              <XMark />
            </IconButton>
          </span>
        ))}
      </div>
      <div className="flex gap-x-2">
        <Input
          size="small"
          value={draft}
          placeholder="Madde yazıp Enter'a basın"
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              add()
            }
          }}
        />
        <Button type="button" size="small" variant="secondary" onClick={add}>
          Ekle
        </Button>
      </div>
    </div>
  )
}

function StatsField({
  value,
  onChange,
}: {
  value: { value: string; label: string }[]
  onChange: (value: { value: string; label: string }[]) => void
}) {
  const set = (i: number, patch: Partial<{ value: string; label: string }>) =>
    onChange(value.map((row, j) => (j === i ? { ...row, ...patch } : row)))
  return (
    <div className="flex flex-col gap-y-2">
      {value.map((row, i) => (
        <div key={i} className="flex gap-x-2">
          <Input size="small" className="w-28" value={row.value} placeholder="12.000+" onChange={(e) => set(i, { value: e.target.value })} />
          <Input size="small" className="flex-1" value={row.label} placeholder="Katalogdaki ürün çeşidi" onChange={(e) => set(i, { label: e.target.value })} />
          <IconButton size="small" variant="transparent" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label="Rakamı sil">
            <Trash className="text-ui-fg-error" />
          </IconButton>
        </div>
      ))}
      {value.length < 4 ? (
        <Button type="button" size="small" variant="secondary" className="self-start" onClick={() => onChange([...value, { value: "", label: "" }])}>
          <Plus />
          Rakam ekle
        </Button>
      ) : null}
    </div>
  )
}

function BrandSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const { data } = useVitrinOptions()
  return (
    <Select value={value || undefined} onValueChange={onChange}>
      <Select.Trigger>
        <Select.Value placeholder="Marka seçin" />
      </Select.Trigger>
      <Select.Content>
        {(data?.brands ?? []).map((brand) => (
          <Select.Item key={brand.id} value={brand.handle}>
            {brand.title}
          </Select.Item>
        ))}
      </Select.Content>
    </Select>
  )
}

export function BlockField({
  field,
  value,
  onChange,
  storefront,
  inputId,
}: {
  field: FieldDef
  value: any
  onChange: (value: unknown) => void
  storefront: string
  inputId: string
}) {
  let control: React.ReactNode
  switch (field.type) {
    case "textarea":
      control = <Textarea id={inputId} rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />
      break
    case "image":
      control = <ImageField id={inputId} value={value ?? ""} onChange={onChange} storefront={storefront} />
      break
    case "tags":
      control = <TagsField value={Array.isArray(value) ? value : []} onChange={onChange} />
      break
    case "stats":
      control = <StatsField value={Array.isArray(value) ? value : []} onChange={onChange} />
      break
    case "brand":
      control = <BrandSelect value={value ?? ""} onChange={onChange} />
      break
    case "icon":
      control = (
        <Select value={value || undefined} onValueChange={onChange}>
          <Select.Trigger>
            <Select.Value placeholder="Simge seçin" />
          </Select.Trigger>
          <Select.Content>
            {TRUST_ICONS.map((icon) => (
              <Select.Item key={icon.value} value={icon.value}>
                {icon.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )
      break
    case "choice":
      control = (
        <Select value={value || field.options?.[0]?.value} onValueChange={onChange}>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {(field.options ?? []).map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      )
      break
    case "products":
      control = (
        <ProductListEditor ids={Array.isArray(value) ? value : []} onChange={onChange} limit={4} storefront={storefront} />
      )
      break
    default:
      control = (
        <Input
          id={inputId}
          value={value ?? ""}
          placeholder={field.placeholder ?? (field.type === "link" ? "/kategori/…" : undefined)}
          onChange={(e) => onChange(e.target.value)}
        />
      )
  }
  return (
    <FieldShell label={field.label} hint={field.hint} required={field.required} htmlFor={inputId}>
      {control}
    </FieldShell>
  )
}
