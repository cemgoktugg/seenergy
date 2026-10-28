import { MedusaContainer } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import { VITRIN_MODULE } from "../modules/vitrin";
import type VitrinModuleService from "../modules/vitrin/service";

/**
 * The whole homepage becomes editable in admin → Vitrin (2026-10-28, the
 * client's request: "ana sayfadaki her işlemi rahat düzenleyecek sistem,
 * vitrinin şu anki haliyle birebir uyumlu").
 *
 * First content = exactly what the storefront hard-coded until now, so the
 * switch changes nothing visible:
 *   - `section` (one per band): shown, plus the band's headings, links and
 *     pictures — the hero's building background, the Fırsat artwork, …
 *   - `own-brand`: SEENERGY, SEENERGY Home, Racksan (Markalarımız, left card)
 *   - `brand-wall`: the 33 logos of the moving wall
 *   - `company-card`: Referanslarımız, Çözüm Ortaklarımız, Projelerimiz
 *   - `brand-board`: each square gets its banner and frame colour, which
 *     were in code (img/1-4.jpeg → public/brand-board/)
 *
 * Fill-only: a band, card or list that already exists is left alone, and a
 * brand-board square only gets a banner / colour where it has none.
 */

type Block = { group: string; key: string | null; rank: number; is_active: boolean; data: Record<string, unknown> };

const SECTIONS: Record<string, Record<string, unknown>> = {
  hero: { visible: "on", background: "/hero/seenergy-bina.webp" },
  "brand-board": { visible: "on" },
  rails: {
    visible: "on",
    left_eyebrow: "Bu hafta öne çıkanlar",
    left_title: "Haftanın Ürünleri",
    left_href: "/kampanyalar/haftanin-urunleri",
    right_eyebrow: "Rafa yeni girenler",
    right_title: "Yeni Gelenler",
    right_href: "/yeni-gelenler",
  },
  deals: {
    visible: "on",
    image: "/campaign/firsat-urunleri.webp",
    href: "/kampanyalar/super-firsat",
    button: "Hemen incele",
    chip: "Fırsat Ürünü",
  },
  featured: { visible: "on", eyebrow: "Keşfet", title: "Öne Çıkanlar" },
  brands: { visible: "on", eyebrow: "Markalar", title: "Markalarımız", action_label: "Tüm markalar", action_href: "/markalar" },
  "brand-wall": { visible: "on", button: "Tümünü gör", href: "/markalar" },
  company: { visible: "on", eyebrow: "Kurumsal", title: "Referanslar ve Projeler" },
  trust: { visible: "on" },
};

const OWN_BRANDS = [
  { name: "SEENERGY", href: "/marka/seenergy", logo: "/brands/seenergy.webp" },
  { name: "SEENERGY Home", href: "/marka/seenergy-home", logo: "/brands/seenergy-home.webp" },
  { name: "Racksan", href: "/marka/racksan", logo: "/brands/racksan.webp" },
];

const WALL: [string, string][] = [
  ["SEENERGY", "seenergy"],
  ["SEENERGY Home", "seenergy-home"],
  ["Racksan", "racksan"],
  ["Dahua", "dahua"],
  ["Hikvision", "hikvision"],
  ["UNV", "unv"],
  ["Neutron", "neutron"],
  ["Ruijie", "ruijie"],
  ["TP-Link", "tp-link"],
  ["Teknim", "teknim"],
  ["Paradox", "paradox"],
  ["Karel", "karel"],
  ["Audio", "audio"],
  ["Huawei", "huawei"],
  ["Sismik", "sismik"],
  ["Gold Audio", "gold-audio"],
  ["Wöller", "woller"],
  ["Westa", "westa"],
  ["Tescom", "tescom"],
  ["Dotvolt", "dotvolt"],
  ["Ajax", "ajax"],
  ["HES Cabling Systems", "hes"],
  ["Öznur Kablo", "oznur-kablo"],
  ["Reçber", "recber"],
  ["Armağan Kablo", "armagan-kablo"],
  ["Eleks", "eleks"],
  ["Hi-Level", "hi-level"],
  ["HiLook", "hilook"],
  ["HPE", "hpe"],
  ["Kioxia", "kioxia"],
  ["Koç Kablo", "koc-kablo"],
  ["MAG", "mag"],
  ["T&Smart", "t-smart"],
];

const COMPANY_CARDS: Record<string, Record<string, unknown>> = {
  referanslar: {
    title: "Referanslarımız",
    text: "Fabrikadan siteye, okuldan otoparka; farklı sektörlerde güvenlik altyapısı kuran firmalara ürün ve çözüm sağlıyoruz.",
    href: "/referanslar",
  },
  "cozum-ortaklari": {
    title: "Çözüm Ortaklarımız",
    text: "Dahua, Hikvision, UNV, Neutron ve 30'dan fazla markayla birlikte çalışıyor; doğru ürünü yetkili kanaldan sunuyoruz.",
    href: "/cozum-ortaklarimiz",
  },
  projeler: {
    title: "Projelerimiz",
    text: "Keşiften kuruluma kadar yanınızdayız: kamera, kayıt, network ve uzak saha (4G, solar) projeleri için çözüm üretiyoruz.",
    href: "/projeler",
    image: "/hero/seenergy-cctv.webp",
  },
};

const BOARD: Record<string, { banner: string; accent: string }> = {
  dahua: { banner: "/brand-board/dahua.jpg", accent: "#e60012" },
  hikvision: { banner: "/brand-board/hikvision.jpg", accent: "#e1251b" },
  unv: { banner: "/brand-board/unv.jpg", accent: "#0068b7" },
  neutron: { banner: "/brand-board/neutron.jpg", accent: "#1b8fe0" },
};

export default async function vitrin_upgrade_homepage_sections({ container }: { container: MedusaContainer }) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const vitrin: VitrinModuleService = container.resolve(VITRIN_MODULE);
  const create: Block[] = [];

  const keyed = async (group: string, content: Record<string, Record<string, unknown>>) => {
    const existing = await vitrin.listVitrinBlocks({ group });
    const have = new Set(existing.map((b) => b.key));
    Object.entries(content).forEach(([key, data], rank) => {
      if (!have.has(key)) create.push({ group, key, rank, is_active: true, data });
    });
  };
  const list = async (group: string, items: Record<string, unknown>[]) => {
    const existing = await vitrin.listVitrinBlocks({ group });
    if (existing.length > 0) return;
    items.forEach((data, rank) => create.push({ group, key: null, rank, is_active: true, data }));
  };

  await keyed("section", SECTIONS);
  await keyed("company-card", COMPANY_CARDS);
  await list("own-brand", OWN_BRANDS);
  await list(
    "brand-wall",
    WALL.map(([name, slug]) => ({ name, href: `/marka/${slug}`, logo: `/brands/${slug}.webp` }))
  );
  if (create.length > 0) await vitrin.createVitrinBlocks(create);

  const board = await vitrin.listVitrinBlocks({ group: "brand-board" });
  const updates = board
    .map((block) => {
      const data = { ...((block.data as Record<string, unknown>) ?? {}) };
      const preset = BOARD[String(data.brand_handle ?? "")];
      if (!preset) return null;
      let changed = false;
      if (!data.banner) {
        data.banner = preset.banner;
        changed = true;
      }
      if (!data.accent) {
        data.accent = preset.accent;
        changed = true;
      }
      return changed ? { id: block.id, data } : null;
    })
    .filter((u): u is { id: string; data: Record<string, unknown> } => u !== null);
  if (updates.length > 0) await vitrin.updateVitrinBlocks(updates);

  logger.info(
    `SEENERGY: homepage editable — ${create.length} block(s) created, ${updates.length} brand-board square(s) given their banner.`
  );
}
