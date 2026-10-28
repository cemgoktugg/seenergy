import { ArrowDownMini, ArrowUpMini, Plus, Trash } from "@medusajs/icons"
import { Badge, Button, Container, Heading, IconButton, Switch, Text, toast, usePrompt } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"

import { BlockField } from "../../../../components/fields"
import { fieldsOf, GROUPS, type GroupDef } from "../../../../lib/blocks"
import {
  errorText,
  useCreateBlock,
  useDeleteBlock,
  useReorderBlocks,
  useSaveBlock,
  useVitrin,
  type BlockGroup,
  type VitrinBlock,
} from "../../../../lib/vitrin"

/**
 * Edit one part of the page: every block of a group, each as its own card with
 * its own "Kaydet". Repeatable groups (slides, brand bands, trust boxes) also
 * add, hide, reorder and delete.
 */

function BlockCard({
  block,
  def,
  index,
  count,
  storefront,
  onMove,
}: {
  block: VitrinBlock
  def: GroupDef
  index: number
  count: number
  storefront: string
  onMove: (from: number, to: number) => void
}) {
  const save = useSaveBlock()
  const remove = useDeleteBlock()
  const prompt = usePrompt()
  const [data, setData] = useState<Record<string, any>>(block.data)
  // Keyed on content, not identity: saving ANOTHER card refetches every block,
  // and resetting on a new object would wipe this card's unsaved edits.
  const saved = JSON.stringify(block.data)
  useEffect(() => setData(JSON.parse(saved)), [saved])
  const dirty = JSON.stringify(data) !== saved
  const fields = fieldsOf(def, block.key)

  const onSave = () => {
    const missing = fields.filter((f) => f.required && !String(data[f.name] ?? "").trim())
    if (missing.length) return toast.error(`Lütfen doldurun: ${missing.map((f) => f.label).join(", ")}`)
    save.mutate(
      { id: block.id, data },
      {
        onSuccess: () => toast.success("Kaydedildi. Sitede güncellendi."),
        onError: (error) => toast.error(errorText(error)),
      }
    )
  }

  const onToggle = (is_active: boolean) =>
    save.mutate(
      { id: block.id, is_active },
      {
        onSuccess: () => toast.success(is_active ? "Sitede gösteriliyor." : "Siteden gizlendi."),
        onError: (error) => toast.error(errorText(error)),
      }
    )

  const onDelete = async () => {
    const ok = await prompt({
      title: `Bu ${def.itemName} silinsin mi?`,
      description: "Bu işlem geri alınamaz. Yalnızca geçici olarak kaldırmak istiyorsanız 'Sitede göster' anahtarını kapatın.",
      confirmText: "Sil",
      cancelText: "Vazgeç",
    })
    if (!ok) return
    remove.mutate(block.id, {
      onSuccess: () => toast.success("Silindi."),
      onError: (error) => toast.error(errorText(error)),
    })
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center gap-3 px-6 py-3">
        <Heading level="h2" className="min-w-0 flex-1">
          {def.itemTitle(data, index, block.key)}
        </Heading>
        {def.repeatable ? (
          <>
            {!block.is_active ? <Badge size="2xsmall" color="orange">Gizli</Badge> : null}
            <label className="txt-compact-small flex items-center gap-x-2">
              <Switch checked={block.is_active} onCheckedChange={onToggle} />
              Sitede göster
            </label>
            <IconButton size="small" variant="transparent" disabled={index === 0} onClick={() => onMove(index, index - 1)} aria-label="Yukarı taşı">
              <ArrowUpMini />
            </IconButton>
            <IconButton size="small" variant="transparent" disabled={index === count - 1} onClick={() => onMove(index, index + 1)} aria-label="Aşağı taşı">
              <ArrowDownMini />
            </IconButton>
            <IconButton size="small" variant="transparent" onClick={onDelete} aria-label="Sil">
              <Trash className="text-ui-fg-error" />
            </IconButton>
          </>
        ) : null}
      </div>
      <div className="grid gap-5 px-6 py-5 lg:grid-cols-2">
        {fields.map((field) => (
          <div
            key={field.name}
            className={["textarea", "image", "tags", "stats", "products"].includes(field.type) ? "lg:col-span-2" : ""}
          >
            <BlockField
              field={field}
              value={data[field.name]}
              onChange={(value) => setData((d) => ({ ...d, [field.name]: value }))}
              storefront={storefront}
              inputId={`${block.id}-${field.name}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-x-2 px-6 py-3">
        {dirty ? (
          <Button size="small" variant="secondary" onClick={() => setData(block.data)}>
            Vazgeç
          </Button>
        ) : null}
        <Button size="small" disabled={!dirty} isLoading={save.isPending} onClick={onSave}>
          Kaydet
        </Button>
      </div>
    </Container>
  )
}

const BlockGroupPage = () => {
  const { group = "" } = useParams()
  const [search] = useSearchParams()
  const only = search.get("bolum")
  const { data } = useVitrin()
  const create = useCreateBlock()
  const reorder = useReorderBlocks()
  const def = GROUPS[group as BlockGroup]

  if (!def) return <Container className="px-6 py-4"><Text>Bölüm bulunamadı.</Text></Container>
  if (!data) return <Container className="px-6 py-4"><Text>Yükleniyor…</Text></Container>

  // Keyed groups list only the slots the site still uses, in page order;
  // ?bolum=<key> narrows to one (the Vitrin map links each band to its own).
  const blocks = data.blocks
    .filter((b) => b.group === group)
    .filter((b) => !def.slots || def.slots.includes(b.key ?? ""))
    .filter((b) => !only || b.key === only)
    .sort((a, b) => (def.slots ? def.slots.indexOf(a.key ?? "") - def.slots.indexOf(b.key ?? "") : a.rank - b.rank))

  const onMove = (from: number, to: number) => {
    const ids = blocks.map((b) => b.id)
    const [moved] = ids.splice(from, 1)
    ids.splice(to, 0, moved)
    reorder.mutate(ids, {
      onSuccess: () => toast.success("Sıralama kaydedildi."),
      onError: (error) => toast.error(errorText(error)),
    })
  }

  const onAdd = () =>
    create.mutate(
      { group: group as BlockGroup, data: def.newItem?.() ?? {}, is_active: false },
      {
        onSuccess: () =>
          toast.success(`Yeni ${def.itemName} eklendi (gizli). Doldurup kaydedin, sonra 'Sitede göster'i açın.`),
        onError: (error) => toast.error(errorText(error)),
      }
    )

  return (
    <div className="flex flex-col gap-y-3">
      <Container className="flex flex-wrap items-start justify-between gap-4 px-6 py-4">
        <div>
          <Text size="small" className="text-ui-fg-subtle">
            <Link to="/vitrin" className="hover:underline">Vitrin</Link> / {def.title}
          </Text>
          <Heading className="mt-1">{only ? def.itemTitle({}, 0, only) : def.title}</Heading>
          <Text size="small" className="text-ui-fg-subtle mt-1 max-w-2xl">
            Sitede nerede: {def.where}
          </Text>
        </div>
        {def.repeatable ? (
          <Button size="small" variant="secondary" isLoading={create.isPending} onClick={onAdd}>
            <Plus />
            {def.itemName.charAt(0).toLocaleUpperCase("tr") + def.itemName.slice(1)} ekle
          </Button>
        ) : null}
      </Container>

      {blocks.map((block, index) => (
        <BlockCard
          key={block.id}
          block={block}
          def={def}
          index={index}
          count={blocks.length}
          storefront={data.storefront_url}
          onMove={onMove}
        />
      ))}
    </div>
  )
}

export default BlockGroupPage
