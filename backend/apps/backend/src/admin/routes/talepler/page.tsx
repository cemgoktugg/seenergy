import { defineRouteConfig } from "@medusajs/admin-sdk"
import { ChatBubbleLeftRight } from "@medusajs/icons"
import { Badge, Button, Container, Heading, Select, Text, Textarea, toast } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"

import { sdk } from "../../lib/sdk"

/**
 * Talepler — the requests visitors leave on the storefront's forms
 * (iletişim, fiyat teklifi, kurumsal, toptan, bayi, havale bildirimi, iş
 * başvurusu). There is no e-mail provider yet, so this screen is where they
 * arrive: newest first, filterable, each with a status and a working note.
 */

const TYPES: Record<string, string> = {
  iletisim: "İletişim",
  teklif: "Fiyat teklifi",
  kurumsal: "Kurumsal / proje",
  toptan: "Toptan satış",
  bayi: "Bayi başvurusu",
  havale: "Havale bildirimi",
  kariyer: "İş başvurusu",
}
const STATUSES: Record<string, string> = { yeni: "Yeni", islemde: "İşlemde", tamamlandi: "Tamamlandı" }
const STATUS_COLOR: Record<string, "red" | "orange" | "green"> = { yeni: "red", islemde: "orange", tamamlandi: "green" }

/** Labels for the per-form fields kept in `data`. */
const DATA_LABELS: Record<string, string> = {
  product: "Ürün",
  sku: "Ürün kodu",
  quantity: "Adet",
  order: "Sipariş no",
  amount: "Tutar",
  bank: "Banka",
  date: "Ödeme tarihi",
  sender: "Gönderen",
  city: "İl",
  tax_number: "Vergi no",
  business: "Faaliyet alanı",
  position: "Pozisyon",
  topic: "Konu",
  page: "Gönderildiği sayfa",
}

interface Inquiry {
  id: string
  type: string
  status: string
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string | null
  data: Record<string, string> | null
  note: string | null
  created_at: string
}

const keys = { list: (status: string, type: string) => ["inquiries", status, type] as const }

function useInquiries(status: string, type: string) {
  return useQuery({
    queryKey: keys.list(status, type),
    queryFn: () =>
      sdk.client.fetch<{ inquiries: Inquiry[]; count: number; new_count: number }>("/admin/inquiries", {
        query: { limit: 100, ...(status ? { status } : {}), ...(type ? { type } : {}) },
      }),
  })
}

function useUpdate() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...body }: { id: string; status?: string; note?: string | null }) =>
      sdk.client.fetch(`/admin/inquiries/${id}`, { method: "POST", body }),
    onSuccess: () => client.invalidateQueries({ queryKey: ["inquiries"] }),
  })
}

const when = (iso: string) =>
  new Date(iso).toLocaleString("tr-TR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })

function Row({ inquiry }: { inquiry: Inquiry }) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState(inquiry.note ?? "")
  const update = useUpdate()
  const save = (body: { status?: string; note?: string | null }) =>
    update.mutate(
      { id: inquiry.id, ...body },
      { onSuccess: () => toast.success("Kaydedildi"), onError: () => toast.error("Kaydedilemedi") },
    )

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="hover:bg-ui-bg-subtle-hover flex w-full items-center gap-4 px-6 py-3 text-left"
      >
        <Badge size="2xsmall" color={STATUS_COLOR[inquiry.status] ?? "grey"}>
          {STATUSES[inquiry.status] ?? inquiry.status}
        </Badge>
        <div className="min-w-0 flex-1">
          <Text size="small" weight="plus" className="truncate">
            {inquiry.name}
            {inquiry.company ? ` · ${inquiry.company}` : ""}
          </Text>
          <Text size="xsmall" className="text-ui-fg-subtle truncate">
            {TYPES[inquiry.type] ?? inquiry.type}
            {inquiry.subject ? ` — ${inquiry.subject}` : ""}
            {inquiry.data?.sku ? ` — ${inquiry.data.sku}` : ""}
          </Text>
        </div>
        <Text size="xsmall" className="text-ui-fg-subtle shrink-0">
          {when(inquiry.created_at)}
        </Text>
      </button>

      {open ? (
        <div className="bg-ui-bg-subtle grid gap-4 px-6 py-4 md:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-y-3">
            <dl className="grid grid-cols-[140px_minmax(0,1fr)] gap-x-3 gap-y-1.5">
              <dt className="txt-small text-ui-fg-subtle">E-posta</dt>
              <dd className="txt-small">
                <a className="text-ui-fg-interactive" href={`mailto:${inquiry.email}`}>
                  {inquiry.email}
                </a>
              </dd>
              {inquiry.phone ? (
                <>
                  <dt className="txt-small text-ui-fg-subtle">Telefon</dt>
                  <dd className="txt-small">
                    <a className="text-ui-fg-interactive" href={`tel:${inquiry.phone}`}>
                      {inquiry.phone}
                    </a>
                  </dd>
                </>
              ) : null}
              {Object.entries(inquiry.data ?? {})
                .filter(([, value]) => value)
                .map(([key, value]) => (
                  <div key={key} className="contents">
                    <dt className="txt-small text-ui-fg-subtle">{DATA_LABELS[key] ?? key}</dt>
                    <dd className="txt-small break-words">{value}</dd>
                  </div>
                ))}
            </dl>
            {inquiry.message ? (
              <div className="bg-ui-bg-base rounded-md border px-3 py-2">
                <Text size="small" className="whitespace-pre-line">
                  {inquiry.message}
                </Text>
              </div>
            ) : null}
          </div>
          <div className="flex flex-col gap-y-2">
            <Text size="xsmall" weight="plus">
              Durum
            </Text>
            <Select value={inquiry.status} onValueChange={(status) => save({ status })}>
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                {Object.entries(STATUSES).map(([value, label]) => (
                  <Select.Item key={value} value={value}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
            <Text size="xsmall" weight="plus" className="mt-2">
              İç not (müşteri görmez)
            </Text>
            <Textarea rows={4} value={note} onChange={(event) => setNote(event.target.value)} />
            <Button size="small" variant="secondary" isLoading={update.isPending} onClick={() => save({ note: note || null })}>
              Notu kaydet
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

const TalepPage = () => {
  const [status, setStatus] = useState("")
  const [type, setType] = useState("")
  const { data, isLoading } = useInquiries(status, type)

  return (
    <Container className="divide-y p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div>
          <Heading level="h1">Talepler</Heading>
          <Text size="small" className="text-ui-fg-subtle">
            Siteden gelen iletişim, teklif, toptan satış, bayilik, havale bildirimi ve iş başvuruları.
            {data?.new_count ? ` ${data.new_count} yeni talep var.` : ""}
          </Text>
        </div>
        <div className="flex gap-2">
          <Select value={status || "all"} onValueChange={(value) => setStatus(value === "all" ? "" : value)}>
            <Select.Trigger className="w-[150px]">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Tüm durumlar</Select.Item>
              {Object.entries(STATUSES).map(([value, label]) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
          <Select value={type || "all"} onValueChange={(value) => setType(value === "all" ? "" : value)}>
            <Select.Trigger className="w-[180px]">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="all">Tüm türler</Select.Item>
              {Object.entries(TYPES).map(([value, label]) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="px-6 py-8">
          <Text size="small" className="text-ui-fg-subtle">
            Yükleniyor…
          </Text>
        </div>
      ) : (data?.inquiries.length ?? 0) === 0 ? (
        <div className="px-6 py-10 text-center">
          <Text size="small" className="text-ui-fg-subtle">
            Bu filtrede talep yok.
          </Text>
        </div>
      ) : (
        <div>
          {data!.inquiries.map((inquiry) => (
            <Row key={inquiry.id} inquiry={inquiry} />
          ))}
        </div>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Talepler",
  icon: ChatBubbleLeftRight,
})

export default TalepPage
