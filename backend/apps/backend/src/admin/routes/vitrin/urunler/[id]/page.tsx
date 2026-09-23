import { Container, Text } from "@medusajs/ui"
import { useParams } from "react-router-dom"

import { QuickProductForm } from "../../../../components/quick-product-form"
import { useQuickProduct } from "../../../../lib/vitrin"

/** Ürün düzenle — the quick form, filled from the product. */
const EditProductPage = () => {
  const { id } = useParams()
  const { data, isLoading, error } = useQuickProduct(id)
  if (isLoading) return <Container className="px-6 py-4"><Text>Yükleniyor…</Text></Container>
  if (error || !data) return <Container className="px-6 py-4"><Text>Ürün bulunamadı.</Text></Container>
  return <QuickProductForm product={data.product} />
}

export default EditProductPage
