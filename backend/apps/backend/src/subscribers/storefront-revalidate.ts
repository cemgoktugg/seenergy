import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"

import { revalidateStorefront } from "../lib/storefront"

/**
 * Product edits made on Medusa's own screens (not the Vitrin quick form)
 * refresh the storefront too, so where a change was made never decides how
 * soon it shows.
 */
export default async function storefrontRevalidate(_args: SubscriberArgs<unknown>) {
  revalidateStorefront(["catalog", "vitrin"])
}

export const config: SubscriberConfig = {
  event: [
    "product.created",
    "product.updated",
    "product.deleted",
    "product-variant.created",
    "product-variant.updated",
    "product-variant.deleted",
    "product-collection.updated",
    "product-category.updated",
  ],
}
