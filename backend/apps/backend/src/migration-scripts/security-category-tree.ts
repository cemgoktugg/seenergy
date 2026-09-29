import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  updateProductCategoriesWorkflow,
  updateProductsWorkflow,
} from "@medusajs/medusa/core-flows";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * The client's category tree (2026-09-29), replacing the twelve categories
 * the catalogue was seeded with.
 *
 * SEENERGY is a security-technology supplier, and the client wrote the tree
 * out by hand: 14 top-level categories, three of them with subcategories.
 * The storefront renders the same tree from src/data/categories.ts — the
 * handles below and the slugs there must stay identical.
 *
 * What this does, idempotently (safe to run again):
 *   1. creates the tree, or brings an existing category with the same handle
 *      into it (uydu-sistemleri and seslendirme-sistemleri survive)
 *   2. moves every seeded product that fits into its new (sub)category
 *   3. DEACTIVATES the old categories rather than deleting them. Products
 *      that fit nowhere in the new tree (TV remotes, car audio, all-in-one
 *      PCs, meters, LED bars…) stay published and linked to their old,
 *      now-inactive category, so nothing is lost and the step can be undone
 *      by reactivating a category in the admin
 *   4. repoints the first hero slide, whose link (/kategori/akilli-ev) never
 *      matched a category
 *
 * Runs after initial-data-seed (scripts run in file-name order), so on a
 * fresh database the seeded products exist by the time it moves them.
 */

type Node = { handle: string; name: string; children?: { handle: string; name: string }[] };

export const TREE: Node[] = [
  {
    handle: "cctv-guvenlik-sistemleri",
    name: "CCTV Güvenlik Sistemleri",
    children: [
      { handle: "ahd-sistem", name: "AHD Sistem" },
      { handle: "ip-sistem", name: "IP Sistem" },
      { handle: "wifi-kameralar", name: "WiFi Kameralar" },
      { handle: "solar-kameralar", name: "Solar Kameralar" },
    ],
  },
  { handle: "arac-kameralari", name: "Araç Kameraları" },
  { handle: "kayit-ve-depolama", name: "Kayıt ve Depolama" },
  {
    handle: "network-urunleri",
    name: "Network Ürünleri",
    children: [
      { handle: "ethernet-switch", name: "Ethernet Switch" },
      { handle: "poe-switch", name: "PoE Switch" },
      { handle: "access-point-router", name: "Access Point / Router" },
    ],
  },
  { handle: "yangin-algilama-sistemleri", name: "Yangın Algılama Sistemleri" },
  { handle: "alarm-sistemleri", name: "Alarm Sistemleri" },
  {
    handle: "uydu-sistemleri",
    name: "Uydu Sistemleri",
    children: [
      { handle: "uydu-alicisi", name: "Uydu Alıcısı" },
      { handle: "uydu-santrali", name: "Uydu Santrali" },
      { handle: "lnb", name: "LNB" },
      { handle: "uydu-aksesuarlari", name: "Uydu Aksesuarları" },
      { handle: "anten", name: "Anten" },
    ],
  },
  { handle: "rack-kabinetler", name: "Rack Kabinetler" },
  { handle: "aksesuarlar", name: "Aksesuarlar" },
  { handle: "elektronik-kilit-sistemleri", name: "Elektronik Kilit Sistemleri" },
  { handle: "gecis-kontrol-sistemleri", name: "Geçiş Kontrol Sistemleri" },
  { handle: "interkom-sistemleri", name: "İnterkom Sistemleri" },
  { handle: "seslendirme-sistemleri", name: "Seslendirme Sistemleri" },
  { handle: "monitor", name: "Monitör" },
];

/** Seeded product handle → its new category handle. */
const MOVES: Record<string, string> = {
  "fotokam-fk-8200-5mp-ahd-bullet-guvenlik-kamerasi": "ahd-sistem",
  "provista-pv-kit4-4-kamerali-guvenlik-seti-harddisk-dahil": "ahd-sistem",
  "provista-pv-dome3-3mp-ip-dome-kamera-gece-goruslu": "ip-sistem",
  "fotokam-fk-360-wi-fi-i-c-mekan-kamera-360-hareketli": "wifi-kameralar",
  "voltra-vt-cam1-arac-i-ci-kayit-kamerasi-full-hd": "arac-kameralari",
  "provista-pv-16-16-kanal-ahd-kayit-cihazi-5mp": "kayit-ve-depolama",
  "provista-pv-8-8-kanal-nvr-ip-kayit-cihazi-4k": "kayit-ve-depolama",
  "digiwave-dw-poe8-8-port-poe-switch-gigabit": "poe-switch",
  "nexora-nx-ac1200-dual-band-access-point-router": "access-point-router",
  "digiwave-dw-ext-menzil-genisletici-wi-fi-6": "access-point-router",
  "nexora-nx-300-adsl-modem-4-port-wi-fi-n300": "access-point-router",
  "orbisat-or-7200-full-hd-mini-uydu-alicisi-usb-kayit": "uydu-alicisi",
  "orbisat-or-9500-4k-ultra-hd-uydu-alicisi-wi-fi-destekli": "uydu-alicisi",
  "orbisat-or-3100-hd-uydu-alicisi-ethernet-portlu": "uydu-alicisi",
  "antenix-ax-4400-kaskatli-uydu-santrali-4-cikisli": "uydu-santrali",
  "antenix-ax-120-single-lnb-0-1db-gurultu-seviyesi": "lnb",
  "cabletek-ct-rg6-rg6-u6-anten-kablosu-100-metre": "uydu-aksesuarlari",
  "kumandax-kx-500-universal-uydu-alici-kumandasi": "uydu-aksesuarlari",
  "orbisat-or-90-90cm-ofset-canak-anten-seti-lnb-dahil": "anten",
  "kablonis-kb-cat6-cat6-utp-ag-kablosu-305m-makara": "aksesuarlar",
  "kablonis-kb-alarm-6x0-22-alarm-kablosu-100-metre": "aksesuarlar",
  "cabletek-ct-hdmi21-hdmi-2-1-kablo-8k-3-metre": "aksesuarlar",
  "powerin-pw-1220-12v-2a-adaptor-fisli-guc-kaynagi": "aksesuarlar",
  "bataryam-bt-100-12v-100ah-jel-aku-derin-dongu": "aksesuarlar",
  "servisan-sv-abs-abs-plastik-kutu-seti-10-adet": "aksesuarlar",
  "sesyapi-sy-40-tavan-hoparloru-6-40w-beyaz": "seslendirme-sistemleri",
  "sesyapi-sy-2400-anfi-ve-mikser-240w-4-kanal": "seslendirme-sistemleri",
  "sonora-sn-820-bluetooth-tasinabilir-hoparlor-60w": "seslendirme-sistemleri",
  "sonora-sn-1500-15-1000w-aktif-kabin-hoparlor": "seslendirme-sistemleri",
  "sonora-sn-300-kolon-hoparlor-120w-cift-yonlu": "seslendirme-sistemleri",
  "sonora-sn-950-aktif-kabin-hoparlor-12-600w": "seslendirme-sistemleri",
  "tekniva-tk-22mon-22-full-hd-monitor-ips-100hz": "monitor",
  "optivolt-ov-32sm-32-smart-led-tv-hd-wi-fi": "monitor",
};

/** The seed's categories that are not part of the new tree. */
const RETIRED = [
  "guvenlik-sistemleri",
  "kumanda-cesitleri",
  "oem-cevre-birimleri",
  "oto-ses-goruntu",
  "bilgisayar",
  "olcu-aletleri",
  "adaptor-aku-pil",
  "led-aydinlatma",
  "kablo-cesitleri",
  "hirdavat-tamir",
];

type Query = { graph: (config: Record<string, unknown>) => Promise<{ data: any[] }> };

export default async function security_category_tree({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY) as unknown as Query;

  const categories = async () =>
    new Map(
      (await query.graph({ entity: "product_category", fields: ["id", "handle"] })).data.map((c) => [
        c.handle as string,
        c.id as string,
      ])
    );

  /* 1. the tree — parents first, so children can point at them */
  const upsert = async (
    level: { handle: string; name: string }[],
    parentId: string | null
  ) => {
    const existing = await categories();
    const fresh = level
      .map((node, rank) => ({ ...node, rank }))
      .filter((node) => !existing.has(node.handle));
    if (fresh.length) {
      await createProductCategoriesWorkflow(container).run({
        input: {
          product_categories: fresh.map((node) => ({
            name: node.name,
            handle: node.handle,
            rank: node.rank,
            is_active: true,
            parent_category_id: parentId,
          })),
        },
      });
    }
    for (const [rank, node] of level.entries()) {
      const id = existing.get(node.handle);
      if (!id) continue;
      await updateProductCategoriesWorkflow(container).run({
        input: {
          selector: { id },
          update: { name: node.name, rank, is_active: true, parent_category_id: parentId },
        },
      });
    }
  };

  logger.info("SEENERGY: category tree...");
  await upsert(TREE, null);
  let ids = await categories();
  for (const parent of TREE) {
    if (parent.children?.length) await upsert(parent.children, ids.get(parent.handle)!);
  }
  ids = await categories();

  /* 2. products — grouped by destination, one update per category */
  const { data: products } = await query.graph({ entity: "product", fields: ["id", "handle"] });
  const byTarget = new Map<string, string[]>();
  for (const product of products) {
    const target = MOVES[product.handle];
    if (!target) continue;
    byTarget.set(target, [...(byTarget.get(target) ?? []), product.id]);
  }
  for (const [handle, productIds] of byTarget) {
    await updateProductsWorkflow(container).run({
      input: { selector: { id: productIds }, update: { category_ids: [ids.get(handle)!] } },
    });
  }
  logger.info(`SEENERGY: ${[...byTarget.values()].flat().length} products moved into the new tree.`);

  /* 3. the old categories — inactive, not deleted */
  for (const handle of RETIRED) {
    const id = ids.get(handle);
    if (!id) continue;
    await updateProductCategoriesWorkflow(container).run({
      input: { selector: { id }, update: { is_active: false } },
    });
  }

  /* 4. a hero link that never matched a category (on a fresh database the
        vitrin is seeded after this script, with the corrected link) */
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);
  const slides = await vitrin.listVitrinBlocks({ group: ["hero-slide"] });
  const stale = slides.filter((block) => (block.data as { href?: string } | null)?.href === "/kategori/akilli-ev");
  if (stale.length) {
    await vitrin.updateVitrinBlocks(
      stale.map((block) => ({
        id: block.id,
        data: { ...(block.data as Record<string, unknown>), href: "/kategori/cctv-guvenlik-sistemleri" },
      }))
    );
  }
  logger.info("SEENERGY: category tree done.");
}
