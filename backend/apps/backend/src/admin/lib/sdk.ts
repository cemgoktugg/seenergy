import Medusa from "@medusajs/js-sdk"

/**
 * The admin's own session is reused: extensions run inside the Medusa admin,
 * already signed in, so every call below is authorised as the current user.
 */
export const sdk = new Medusa({
  baseUrl: import.meta.env.VITE_BACKEND_URL || "/",
  debug: false,
  auth: { type: "session" },
})
