import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";
import type { StaffData } from "../modules/vitrin/types";

/**
 * İletişim (2026-10-28): the client's real contact details, and the staff
 * slots of the new /iletisim layout (their sketch: a building banner with
 * the address and contact details, then Satış Departmanı ×4, Muhasebe ×2,
 * İnsan Kaynakları ×1 — photo, name, e-mail, phone).
 *
 * Company: phone, address and hours are written only where the field still
 * holds the first seed's placeholder (vitrin-upgrade-company) or is empty —
 * a value someone typed in the admin is left alone.
 *
 * Staff: the seven slots are created only when the group is empty. The
 * client has not sent names yet, so each slot carries its role as its name
 * ("Satış Temsilcisi"), never an invented person; names, e-mails, phones and
 * photos are filled in at admin → Vitrin → Ekibimiz.
 */
const PLACEHOLDERS: Record<string, string[]> = {
  phone: ["0850 000 00 00"],
  address: ["Organize Sanayi Bölgesi, 4. Cadde No: 12\nBaşakşehir / İstanbul"],
  hours: ["Hafta içi 09:00 – 18:00"],
};

const COMPANY = {
  phone: "(0312) 480 1 490",
  address: "İvedik OSB Mahallesi, Melih Gökçek Bulvarı Köşe\nİvedik İş Merkezi 4BJ No: 85\nYenimahalle / Ankara",
  hours: "Hafta içi 08:00 – 18:00 · Hafta sonu 08:00 – 15:00",
};

const slot = (department: StaffData["department"], name: string): StaffData => ({
  department,
  name,
  title: "",
  email: "",
  phone: "",
  photo: "",
});

const STAFF: StaffData[] = [
  slot("satis", "Satış Temsilcisi"),
  slot("satis", "Satış Temsilcisi"),
  slot("satis", "Satış Temsilcisi"),
  slot("satis", "Satış Temsilcisi"),
  slot("muhasebe", "Muhasebe Sorumlusu"),
  slot("muhasebe", "Muhasebe Sorumlusu"),
  slot("insan-kaynaklari", "İnsan Kaynakları Sorumlusu"),
];

export default async function vitrin_upgrade_contact({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const [company] = await vitrin.listVitrinBlocks({ group: "company" });
  if (company) {
    const data = { ...((company.data as Record<string, unknown>) ?? {}) };
    const changed: string[] = [];
    for (const [field, value] of Object.entries(COMPANY)) {
      const current = typeof data[field] === "string" ? (data[field] as string) : "";
      if (!current || PLACEHOLDERS[field]?.includes(current)) {
        data[field] = value;
        changed.push(field);
      }
    }
    if (changed.length > 0) {
      await vitrin.updateVitrinBlocks({ id: company.id, data });
      logger.info(`SEENERGY: company ${changed.join(", ")} set to the client's details.`);
    } else {
      logger.info("SEENERGY: company details already edited; left alone.");
    }
  } else {
    logger.info("SEENERGY: no company block; run vitrin-upgrade-company first.");
  }

  const staff = await vitrin.listVitrinBlocks({ group: "staff" });
  if (staff.length > 0) {
    logger.info("SEENERGY: staff blocks already exist.");
    return;
  }
  await vitrin.createVitrinBlocks(
    STAFF.map((data, rank) => ({ group: "staff", key: null, rank, is_active: true, data: { ...data } }))
  );
  logger.info(`SEENERGY: ${STAFF.length} staff slots created (admin → Vitrin → Ekibimiz).`);
}
