import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";
import type { PageSectionData } from "../modules/vitrin/types";

/**
 * Kurumsal sayfalar ve İletişim, editable in Vitrin (2026-10-30, the client:
 * "her şeyi değiştirebilecek şekilde").
 *
 *   page          one settings block per page (referanslar, cozum-ortaklarimiz,
 *                 projeler, iletisim): headings, lede, search text, and on
 *                 /iletisim every label, button and form text
 *   page-section  the corporate pages' headed text sections, in order
 *   reference     client cards on /referanslar — none seeded: the shop
 *                 publishes a client's name only with their consent
 *   project       project cards on /projeler — none seeded, nothing invented
 *
 * The content is exactly what the pages hard-coded until today, so the switch
 * changes nothing a visitor sees. Each group is created only when it is
 * empty; a re-run never overwrites an edit.
 */

const PAGES: Record<string, Record<string, unknown>> = {
  referanslar: {
    eyebrow: "Kurumsal",
    title: "Referanslarımız",
    lede: "Farklı sektörlerde güvenlik altyapısı kuran firmalara, kurulumculara ve proje ekiplerine ürün ve çözüm sağlıyoruz.",
    seo_description:
      "SEENERGY Güvenlik Teknolojileri; fabrika, site, mağaza, okul, sağlık ve otopark projelerinde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlar.",
    references_title: "Çalıştığımız firmalar",
  },
  "cozum-ortaklarimiz": {
    eyebrow: "Kurumsal",
    title: "Çözüm Ortaklarımız",
    lede: "Kendi markamız SEENERGY ile birlikte {sayi} markanın ürünlerini sunuyoruz. Bir markaya tıklayarak ürünlerine ulaşabilirsiniz.",
    seo_description:
      "SEENERGY Güvenlik Teknolojileri olarak birlikte çalıştığımız markalar: Dahua, Hikvision, UNV, Neutron, Ruijie, TP-Link ve daha fazlası.",
  },
  projeler: {
    eyebrow: "Kurumsal",
    title: "Projelerimiz",
    lede: "Tek bir kameradan yüzlerce kanallı kayıt sistemine kadar, projenize uygun ürünleri seçiyor ve proje boyunca yanınızda oluyoruz.",
    seo_description:
      "Kamera, kayıt, network ve uzak saha (4G, solar) güvenlik projeleri: keşiften kuruluma kadar ürün ve çözüm desteği.",
    projects_title: "Tamamlanan projeler",
  },
  iletisim: {
    eyebrow: "Bize ulaşın",
    title: "İletişim",
    quote_eyebrow: "Fiyat teklifi",
    quote_title: "Fiyat Teklifi İsteyin",
    tagline: "Güvenlik Teknolojileri A.Ş.",
    address_label: "Adres",
    phone_label: "Telefon",
    hours_label: "Çalışma saatleri",
    call_label: "Hemen arayın",
    directions_label: "Yol tarifi al",
    staff_eyebrow: "Ekibimiz",
    satis_title: "Satış Departmanı",
    muhasebe_title: "Muhasebe",
    ik_title: "İnsan Kaynakları",
    form_eyebrow: "Bize yazın",
    form_title: "İletişim formu",
    topics: ["Fiyat teklifi", "Teknik destek", "Siparişim hakkında", "İade ve cayma", "Garanti ve arıza", "Genel bilgi"],
    submit_label: "Mesajı gönder",
    success_title: "Mesajınız alındı",
    quote_form_eyebrow: "Teklif",
    quote_form_title: "Teklif formu",
    quote_submit_label: "Teklif iste",
    quote_success_title: "Teklif talebiniz alındı",
    success_text: "Mesai saatlerinde aynı gün, en geç bir iş günü içinde dönüş yapıyoruz.",
    seo_description:
      "SEENERGY Güvenlik Teknolojileri — İvedik OSB, Yenimahalle / Ankara. Telefon, e-posta, çalışma saatleri, satış, muhasebe ve insan kaynakları ekibimiz ve iletişim formu.",
  },
};

const SECTIONS: PageSectionData[] = [
  {
    page: "referanslar",
    heading: "Hizmet verdiğimiz alanlar",
    style: "liste",
    text: [
      "Fabrika ve depo: geniş alan ve çevre güvenliği, giriş-çıkış kontrolü, gece görüşlü kamera ve uzun süreli kayıt.",
      "Site ve konut: ortak alan, otopark ve giriş kameraları, interkom ve geçiş kontrol sistemleri.",
      "Mağaza ve AVM: kasa ve satış alanı izleme, renkli gece görüşü, uzaktan izleme.",
      "Okul ve kamu binaları: bina çevresi, koridor ve giriş güvenliği, yangın algılama.",
      "Sağlık: kesintisiz kayıt, network altyapısı ve alarm sistemleri.",
      "Otopark ve uzak saha: plaka ve araç izleme, elektrik ve internet hattı olmayan noktalar için 4G solar kameralar.",
    ].join("\n"),
  },
  {
    page: "referanslar",
    heading: "Referans listemiz",
    style: "paragraf",
    text: "Tamamladığımız projelerin ve çalıştığımız firmaların listesini, müşterilerimizin onayıyla, teklif sürecinde paylaşıyoruz. Benzer bir proje için örnek ve referans talep etmek isterseniz [kurumsal satış ve proje](/kurumsal) formundan bize yazabilirsiniz.",
  },
  {
    page: "referanslar",
    heading: "Birlikte çalıştığımız markalar",
    style: "paragraf",
    text: "Kendi markamız SEENERGY'nin yanında Dahua, Hikvision, UNV ve Neutron gibi markaların ürünlerini sunuyoruz. Tüm markalar için [Çözüm Ortaklarımız](/cozum-ortaklarimiz) sayfasına göz atabilirsiniz.",
  },
  {
    page: "cozum-ortaklarimiz",
    heading: "Neden önemli?",
    style: "paragraf",
    text: "Ürünleri yetkili kanallardan, faturalı ve garantili olarak tedarik ediyoruz. Projenize uygun markayı ve modeli birlikte seçmek için [kurumsal satış ve proje](/kurumsal) formundan bize ulaşabilirsiniz.",
  },
  {
    page: "projeler",
    heading: "Proje türleri",
    style: "liste",
    text: [
      "CCTV ve kayıt sistemleri: AHD ve IP kameralar, DVR/NVR kayıt cihazları, disk ve depolama planlaması.",
      "Network altyapısı: PoE ve ethernet switch, access point, router ve rack kabinet.",
      "Uzak saha: elektrik ve internet hattı olmayan noktalar için 4G SIM kartlı, solar panelli kameralar.",
      "Alarm, yangın ve geçiş kontrol: bina güvenliğini tamamlayan sistemler.",
    ].join("\n"),
  },
  {
    page: "projeler",
    heading: "Bir proje nasıl ilerler?",
    style: "adimlar",
    text: [
      "İhtiyacı konuşuruz: alanı, kamera noktalarını, kayıt süresini ve bütçeyi birlikte belirleriz.",
      "Teklif hazırlarız: uyumlu ürünleri, adetleri ve fiyatları tek bir teklifte sunarız.",
      "Tedarik ederiz: ürünleri faturalı ve garantili olarak hızla sevk ederiz.",
      "Kurulumda destek oluruz: kurulum ve ayar aşamasında teknik destek veririz.",
    ].join("\n"),
  },
  {
    page: "projeler",
    heading: "Projeniz için teklif alın",
    style: "paragraf",
    text: "Proje detaylarını [kurumsal satış ve proje](/kurumsal) formundan iletin; size aynı gün dönüş yapalım. Daha önce yaptığımız benzer projeler için [Referanslarımız](/referanslar) sayfasına göz atabilirsiniz.",
  },
];

export default async function vitrin_upgrade_corporate_pages({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);

  const existing = await vitrin.listVitrinBlocks({ group: "page" });
  const missing = Object.keys(PAGES).filter((key) => !existing.some((block) => block.key === key));
  if (missing.length) {
    await vitrin.createVitrinBlocks(
      missing.map((key, rank) => ({ group: "page", key, rank, is_active: true, data: { ...PAGES[key] } }))
    );
  }

  const sections = await vitrin.listVitrinBlocks({ group: "page-section" });
  if (sections.length === 0) {
    await vitrin.createVitrinBlocks(
      SECTIONS.map((data, rank) => ({ group: "page-section", key: null, rank, is_active: true, data: { ...data } }))
    );
  }

  logger.info(
    `SEENERGY: corporate pages in Vitrin — ${missing.length} page settings, ` +
      `${sections.length === 0 ? SECTIONS.length : 0} text sections created.`
  );
}
