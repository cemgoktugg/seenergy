/**
 * The cart as the storefront sees it — a plain, serialisable projection of
 * Medusa's cart. Server actions return it; client components render it.
 *
 * All amounts are TRY and KDV-inclusive, exactly as Medusa computes them. The
 * storefront never re-adds prices: a total derived in the browser is a total
 * that can disagree with the order.
 */

export interface CartLine {
  id: string;
  variantId: string;
  productId: string;
  handle: string;
  title: string;
  brand: string;
  sku: string;
  image: string;
  quantity: number;
  unitPrice: number;
  compareAtUnitPrice: number | null;
  total: number;
}

export interface CartSummary {
  id: string;
  /** Sum of quantities — what the header badge shows. */
  count: number;
  lines: CartLine[];
  /** Items, KDV included, before shipping. */
  itemTotal: number;
  /** The KDV share already inside `total`. */
  taxTotal: number;
  shippingTotal: number;
  discountTotal: number;
  total: number;
  email: string | null;
  hasShippingMethod: boolean;
}

export type CartResult = { ok: true; cart: CartSummary | null } | { ok: false; error: string };

/** The subset of Medusa's StoreCart this storefront reads. */
export interface StoreCart {
  id: string;
  completed_at: string | null;
  email: string | null;
  item_total: number;
  tax_total: number;
  shipping_total: number;
  discount_total: number;
  total: number;
  shipping_methods?: { id: string; shipping_option_id: string; amount: number }[] | null;
  items?:
    | {
        id: string;
        variant_id: string;
        product_id: string;
        product_handle: string | null;
        product_title: string | null;
        product_collection: string | null;
        variant_sku: string | null;
        thumbnail: string | null;
        quantity: number;
        unit_price: number;
        compare_at_unit_price: number | null;
        total?: number;
        created_at: string;
      }[]
    | null;
}

/** Seeded thumbnails point back at this storefront's /mock assets. */
const imagePath = (thumbnail: string | null): string => {
  if (!thumbnail) return '/mock/products/receiver-black.svg';
  try {
    const url = new URL(thumbnail);
    return url.pathname.startsWith('/mock/') ? url.pathname : thumbnail;
  } catch {
    return thumbnail;
  }
};

export function toCartSummary(cart: StoreCart | null): CartSummary | null {
  if (!cart) return null;
  // Oldest first, so a line does not jump when its quantity changes.
  const items = [...(cart.items ?? [])].sort((a, b) => a.created_at.localeCompare(b.created_at));

  return {
    id: cart.id,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    lines: items.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      handle: item.product_handle ?? '',
      title: item.product_title ?? '',
      brand: item.product_collection ?? '',
      sku: item.variant_sku ?? '',
      image: imagePath(item.thumbnail),
      quantity: item.quantity,
      unitPrice: item.unit_price,
      compareAtUnitPrice:
        item.compare_at_unit_price && item.compare_at_unit_price > item.unit_price
          ? item.compare_at_unit_price
          : null,
      total: item.total ?? item.unit_price * item.quantity,
    })),
    itemTotal: cart.item_total,
    taxTotal: cart.tax_total,
    shippingTotal: cart.shipping_total,
    discountTotal: cart.discount_total,
    total: cart.total,
    email: cart.email,
    hasShippingMethod: (cart.shipping_methods?.length ?? 0) > 0,
  };
}
