/**
 * Tell the storefront its cached pages are stale.
 *
 * The storefront caches catalogue and vitrin data for 60 seconds; without
 * this call an edit would take up to a minute to show. With it, the shop
 * saves in the admin and the site is already updated.
 *
 * Fire-and-forget by design: the storefront being down must never make an
 * admin save fail — the 60-second cache still catches up on its own.
 */
export type StorefrontTag = "catalog" | "vitrin"

export function revalidateStorefront(tags: StorefrontTag[]): void {
  const url = process.env.STOREFRONT_URL
  const secret = process.env.STOREFRONT_REVALIDATE_SECRET
  if (!url || !secret) return

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 3000)
  fetch(`${url}/api/revalidate`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-revalidate-secret": secret },
    body: JSON.stringify({ tags }),
    signal: controller.signal,
  })
    .catch(() => undefined)
    .finally(() => clearTimeout(timer))
}
