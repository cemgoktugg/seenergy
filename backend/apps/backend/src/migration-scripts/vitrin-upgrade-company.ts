import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * Şirket bilgileri (2026-10-24): one block the whole storefront reads — the
 * footer, /iletisim, the contracts (Mesafeli Satış, Ön Bilgilendirme, KVKK)
 * and the havale details on the order confirmation. Edited in admin →
 * Vitrin → Şirket bilgileri.
 *
 * First content = what the footer already showed, so nothing visible changes;
 * the bank details come from the backend's BANK_* environment when set
 * (they used to live only in the storefront's). Created only when missing.
 */
export default async function vitrin_upgrade_company({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const existing = await vitrin.listVitrinBlocks({ group: "company" });
  if (existing.length > 0) {
    logger.info("SEENERGY: company block already exists.");
    return;
  }

  await vitrin.createVitrinBlocks([
    {
      group: "company",
      key: "company",
      rank: 0,
      is_active: true,
      data: {
        legal_name: "SEENERGY Güvenlik Teknolojileri A.Ş.",
        phone: "0850 000 00 00",
        whatsapp: "",
        email: "",
        address: "Organize Sanayi Bölgesi, 4. Cadde No: 12\nBaşakşehir / İstanbul",
        hours: "Hafta içi 09:00 – 18:00",
        map_url: "",
        mersis: "",
        tax_office: "",
        tax_number: "",
        kep: "",
        bank_name: process.env.BANK_NAME ?? "",
        bank_holder: process.env.BANK_HOLDER ?? "",
        iban: process.env.BANK_IBAN ?? "",
      },
    },
  ]);
  logger.info("SEENERGY: company block created.");
}
