import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError, Modules } from "@medusajs/framework/utils";
import { z } from "zod";

/**
 * POST /store/customers/me/password — change the signed-in customer's
 * password: the current one is checked first, then the emailpass identity is
 * updated (the provider hashes it). Medusa's own route for this needs a reset
 * token, which only reaches the customer by e-mail, and there is no e-mail
 * provider; this covers the signed-in case.
 */
const Body = z.object({
  current_password: z.string().min(1, "Mevcut şifrenizi girin."),
  new_password: z
    .string()
    .min(8, "Yeni şifre en az 8 karakter olmalı.")
    .regex(/\d/, "Yeni şifre en az bir rakam içermeli.")
    .regex(/[A-Za-zÇĞİÖŞÜçğıöşü]/, "Yeni şifre en az bir harf içermeli."),
});

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, parsed.error.issues[0]?.message ?? "Geçersiz istek.");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const {
    data: [customer],
  } = await query.graph({ entity: "customer", fields: ["email"], filters: { id: req.auth_context.actor_id } });
  if (!customer?.email) throw new MedusaError(MedusaError.Types.NOT_FOUND, "Müşteri bulunamadı.");

  const auth = req.scope.resolve(Modules.AUTH);
  const check = await auth.authenticate("emailpass", {
    body: { email: customer.email, password: parsed.data.current_password },
  } as never);
  if (!check.success) {
    throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "Mevcut şifreniz hatalı.");
  }

  await auth.updateProvider("emailpass", { entity_id: customer.email, password: parsed.data.new_password });
  res.json({ success: true });
}
