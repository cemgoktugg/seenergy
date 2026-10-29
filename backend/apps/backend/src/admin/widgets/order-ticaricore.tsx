import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { AdminOrder, DetailWidgetProps } from "@medusajs/framework/types"
import { Badge, Button, Container, Heading, Text, toast } from "@medusajs/ui"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { sdk } from "../lib/sdk"
import { errorText } from "../lib/vitrin"

type State = {
  configured: boolean
  status: "sent" | "failed" | null
  uid: string | null
  error: string | null
  attempts: number
  sent_at: string | null
}

/**
 * On the order page: whether this order reached TicariCore (where it is
 * invoiced and shipped), why not if it did not, and a button to send it.
 */
const OrderTicariCoreWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const client = useQueryClient()
  const key = ["ticaricore", "order", order.id]
  const { data } = useQuery({
    queryKey: key,
    queryFn: () => sdk.client.fetch<State>(`/admin/ticaricore/orders/${order.id}`),
  })
  const send = useMutation({
    mutationFn: () => sdk.client.fetch<{ uid?: string }>(`/admin/ticaricore/orders/${order.id}`, { method: "POST" }),
    onSuccess: () => {
      toast.success("Sipariş NetHesap Online'a aktarıldı.")
      client.invalidateQueries({ queryKey: key })
    },
    onError: (error) => {
      toast.error(errorText(error))
      client.invalidateQueries({ queryKey: key })
    },
  })
  if (!data?.configured) return null

  return (
    <Container className="flex flex-col gap-3 px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">NetHesap Online</Heading>
        {data.status === "sent" ? (
          <Badge color="green">Aktarıldı</Badge>
        ) : data.status === "failed" ? (
          <Badge color="red">Aktarılamadı</Badge>
        ) : (
          <Badge color="grey">Gönderilmedi</Badge>
        )}
      </div>
      {data.status === "sent" ? (
        <Text size="small" className="text-ui-fg-subtle">
          Fatura ve sevkiyat NetHesap Online'dan yapılır.
          {data.sent_at ? ` Gönderim: ${new Date(data.sent_at).toLocaleString("tr-TR")}.` : ""}
        </Text>
      ) : (
        <>
          {data.error ? (
            <Text size="small" className="text-ui-fg-error">
              {data.error}
            </Text>
          ) : (
            <Text size="small" className="text-ui-fg-subtle">
              Bu sipariş entegrasyondan önce verilmiş ya da henüz gönderilmemiş.
            </Text>
          )}
          {data.status === "failed" && data.attempts < 12 ? (
            <Text size="xsmall" className="text-ui-fg-muted">
              10 dakikada bir kendiliğinden tekrar denenir ({data.attempts}/12).
            </Text>
          ) : null}
          <Button size="small" variant="secondary" isLoading={send.isPending} onClick={() => send.mutate()}>
            NetHesap Online'a gönder
          </Button>
        </>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
})

export default OrderTicariCoreWidget
